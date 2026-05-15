import "dotenv/config";
import { createAuthClient } from "@neondatabase/auth";
import { neon } from "@neondatabase/serverless";
import { execFileSync } from "node:child_process";

const API_BASE = process.env.PLATFORM_API_BASE || "http://localhost:5002";
const ORIGIN = API_BASE;
const NEON_AUTH_URL = process.env.NEON_AUTH_URL;
const DATABASE_URL = process.env.DATABASE_URL;

if (!NEON_AUTH_URL || !DATABASE_URL) {
  throw new Error("Missing NEON_AUTH_URL or DATABASE_URL in environment");
}

const sql = neon(DATABASE_URL);

function makeCookieFetch(cookieJar) {
  const nativeFetch = global.fetch;
  return async (input, init = {}) => {
    let url = input;
    if (typeof input === "string" && input.startsWith("/")) {
      url = `${NEON_AUTH_URL}${input}`;
    }

    const headers = new Headers(init.headers || {});
    headers.set("origin", ORIGIN);
    headers.set("referer", `${ORIGIN}/`);
    if (cookieJar.cookie) headers.set("cookie", cookieJar.cookie);

    const response = await nativeFetch(url, { ...init, headers });

    const setCookies =
      typeof response.headers.getSetCookie === "function"
        ? response.headers.getSetCookie()
        : [];

    if (setCookies.length > 0) {
      const next = setCookies.map((c) => c.split(";")[0]).join("; ");
      cookieJar.cookie = cookieJar.cookie ? `${cookieJar.cookie}; ${next}` : next;
    }

    return response;
  };
}

async function signInAndGetToken(email, password) {
  const cookieJar = { cookie: "" };
  const oldFetch = global.fetch;
  global.fetch = makeCookieFetch(cookieJar);

  try {
    const auth = createAuthClient(NEON_AUTH_URL);
    const signIn = await auth.signIn.email({ email, password });
    if (signIn?.error) {
      throw new Error(`Sign in failed for ${email}: ${signIn.error.message}`);
    }

    const session = await auth.getSession();
    const token = session?.data?.session?.token || null;
    const userId = session?.data?.user?.id || null;
    if (!token) {
      throw new Error(`No session token returned for ${email}`);
    }
    if (!userId) {
      throw new Error(`No session user id returned for ${email}`);
    }
    return { token, userId };
  } finally {
    global.fetch = oldFetch;
  }
}

async function signUpWithNeonAuth(email, password, name) {
  const cookieJar = { cookie: "" };
  const oldFetch = global.fetch;
  global.fetch = makeCookieFetch(cookieJar);

  try {
    const auth = createAuthClient(NEON_AUTH_URL);
    const signUp = await auth.signUp.email({ email, password, name });
    if (signUp?.error) {
      throw new Error(`Sign up failed for ${email}: ${signUp.error.message}`);
    }
    return signUp;
  } finally {
    global.fetch = oldFetch;
  }
}

async function jsonFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("origin", ORIGIN);
  headers.set("referer", `${ORIGIN}/`);
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: response.status, ok: response.ok, data };
}

async function run() {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  console.log("Ensuring required role/application schema exists...");
  await sql`
    alter table profiles
    add column if not exists admin_role text
  `;

  await sql`
    create table if not exists role_audit_logs (
      id uuid primary key default gen_random_uuid(),
      target_user_id uuid,
      admin_user_id uuid,
      action text,
      previous_role text,
      new_role text,
      previous_admin_role text,
      new_admin_role text,
      reason text,
      created_at timestamptz default now()
    )
  `;

  await sql`
    create table if not exists judge_applications (
      id uuid primary key default gen_random_uuid(),
      username text not null,
      full_name text,
      profile_photo text,
      headline text,
      short_bio text,
      judge_location text,
      role_title text,
      company text,
      primary_expertise jsonb default '[]'::jsonb,
      secondary_expertise jsonb default '[]'::jsonb,
      total_events_judged integer default 0,
      total_teams_evaluated integer default 0,
      total_mentorship_hours integer default 0,
      years_of_experience integer default 0,
      average_feedback_rating numeric,
      linkedin text,
      github text,
      twitter text,
      website text,
      languages_spoken jsonb default '[]'::jsonb,
      public_achievements text,
      mentorship_statement text,
      availability_status text default 'available',
      email text not null,
      phone text,
      resume text,
      proof_of_judging text,
      timezone text,
      calendar_link text,
      compensation_preference text,
      judge_references text,
      conflict_of_interest text,
      agreed_to_nda boolean default false,
      address text,
      status text default 'pending',
      reviewed_at timestamptz,
      reviewed_by text,
      rejection_reason text,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    )
  `;

  await sql`
    create table if not exists judge_application_events (
      id uuid primary key default gen_random_uuid(),
      application_id uuid references judge_applications(id) on delete cascade,
      event_name text,
      event_role text,
      event_date date,
      event_link text,
      verified boolean default false,
      created_at timestamptz default now()
    )
  `;

  await sql`
    create table if not exists judges (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references profiles(id) on delete set null,
      username text not null,
      full_name text,
      profile_photo text,
      headline text,
      short_bio text,
      judge_location text,
      role_title text,
      company text,
      primary_expertise jsonb default '[]'::jsonb,
      secondary_expertise jsonb default '[]'::jsonb,
      total_events_judged integer default 0,
      total_teams_evaluated integer default 0,
      total_mentorship_hours integer default 0,
      years_of_experience integer default 0,
      average_feedback_rating numeric,
      linkedin text,
      github text,
      twitter text,
      website text,
      languages_spoken jsonb default '[]'::jsonb,
      public_achievements text,
      mentorship_statement text,
      availability_status text default 'available',
      tier text default 'starter',
      is_published boolean default false,
      email text,
      phone text,
      resume text,
      proof_of_judging text,
      timezone text,
      calendar_link text,
      compensation_preference text,
      judge_references text,
      conflict_of_interest text,
      agreed_to_nda boolean default false,
      address text,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    )
  `;

  await sql`
    create table if not exists judge_hackathon_assignments (
      id uuid primary key default gen_random_uuid(),
      hackathon_id uuid,
      judge_id uuid,
      status text default 'active',
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    )
  `;

  await sql`
    create table if not exists judge_events (
      id uuid primary key default gen_random_uuid(),
      judge_id uuid references judges(id) on delete cascade,
      event_name text,
      event_role text,
      event_date date,
      event_link text,
      verified boolean default false,
      created_at timestamptz default now()
    )
  `;

  const suffix = Date.now();
  const password = "RoleFlow#2026";

  const users = {
    admin: {
      email: `admin.flow.${suffix}@outlook.com`,
      name: `Admin Flow ${suffix}`,
      username: `adminflow${suffix}`,
    },
    judge: {
      email: `judge.flow.${suffix}@outlook.com`,
      name: `Judge Flow ${suffix}`,
      username: `judgeflow${suffix}`,
    },
    mentor: {
      email: `mentor.flow.${suffix}@outlook.com`,
      name: `Mentor Flow ${suffix}`,
      username: `mentorflow${suffix}`,
    },
    participant: {
      email: `participant.flow.${suffix}@outlook.com`,
      name: `Participant Flow ${suffix}`,
      username: `participantflow${suffix}`,
    },
  };

  console.log("Creating 4 accounts via Neon Auth signup...");
  for (const key of Object.keys(users)) {
    await signUpWithNeonAuth(users[key].email, password, users[key].name);
    console.log(`  ✓ Created ${key}: ${users[key].email}`);
  }

  console.log("Signing in each user via Neon Auth...");
  const getSessionFromHelper = async (email) => {
    let lastError = null;
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        const raw = execFileSync(
          "node",
          ["scripts/get-neon-token.mjs", email, password],
          {
            cwd: process.cwd(),
            encoding: "utf8",
          }
        );
        return JSON.parse(raw);
      } catch (error) {
        lastError = error;
        await sleep(3000 * attempt);
      }
    }
    throw lastError;
  };

  const adminSession = await getSessionFromHelper(users.admin.email);
  await sleep(1500);
  const judgeSession = await getSessionFromHelper(users.judge.email);
  await sleep(1500);
  const mentorSession = await getSessionFromHelper(users.mentor.email);
  await sleep(1500);
  const participantSession = await getSessionFromHelper(users.participant.email);
  console.log("  ✓ Tokens acquired for all users");

  const sessionByKey = {
    admin: adminSession,
    judge: judgeSession,
    mentor: mentorSession,
    participant: participantSession
  };

  console.log("Upserting profile rows for created users...");
  for (const key of Object.keys(users)) {
    const user = users[key];
    const session = sessionByKey[key];
    await sql`
      insert into profiles (id, email, username, full_name, role, created_at, updated_at)
      values (${session.userId}::uuid, ${user.email}, ${user.username}, ${user.name}, 'participant', now(), now())
      on conflict (id) do update
      set email = excluded.email,
          username = excluded.username,
          full_name = excluded.full_name,
          updated_at = now()
    `;
  }

  console.log("Promoting bootstrap admin in DB (role=admin, admin_role=super_admin)...");
  await sql`
    update profiles
    set role = 'admin'
    where id = ${adminSession.userId}::uuid
  `;

  console.log("Submitting judge application...");
  const judgeApply = await jsonFetch("/api/judges/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: users.judge.username,
      fullName: users.judge.name,
      email: users.judge.email
    }),
  });
  if (!judgeApply.ok) {
    throw new Error(`Judge application failed: ${JSON.stringify(judgeApply.data)}`);
  }
  const judgeApplicationId = judgeApply.data?.applicationId;
  console.log(`  ✓ Judge application submitted: ${judgeApplicationId}`);

  console.log("Approving judge application as admin...");
  const approveJudge = await jsonFetch(`/api/admin/judge-applications/${judgeApplicationId}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminSession.token}`,
    },
    body: JSON.stringify({ tier: "starter" }),
  });
  if (!approveJudge.ok) {
    throw new Error(`Judge approval failed: ${JSON.stringify(approveJudge.data)}`);
  }
  console.log("  ✓ Judge approved");

  const [{ id: mentorUserId }] = await sql`
    select id from profiles where email = ${users.mentor.email} limit 1
  `;

  console.log("Assigning mentor role via admin role API...");
  const assignMentor = await jsonFetch("/api/roles/assign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminSession.token}`,
    },
    body: JSON.stringify({
      userId: mentorUserId,
      role: "mentor",
      reason: "E2E flow validation",
      assignedBy: mentorUserId,
    }),
  });
  if (!assignMentor.ok) {
    throw new Error(`Mentor role assignment failed: ${JSON.stringify(assignMentor.data)}`);
  }
  console.log("  ✓ Mentor role assigned");

  console.log("Validating role-protected endpoints...");
  const adminApps = await jsonFetch("/api/admin/judge-applications", {
    headers: { Authorization: `Bearer ${adminSession.token}` },
  });
  const judgeHackathons = await jsonFetch("/api/judge/hackathons", {
    headers: { Authorization: `Bearer ${judgeSession.token}` },
  });
  const mentorCurrentRole = await jsonFetch("/api/roles/current", {
    headers: { Authorization: `Bearer ${mentorSession.token}` },
  });
  const participantCurrentRole = await jsonFetch("/api/roles/current", {
    headers: { Authorization: `Bearer ${participantSession.token}` },
  });

  console.log("RESULTS");
  console.log(
    JSON.stringify(
      {
        createdUsers: users,
        checks: {
          adminJudgeApplications: { status: adminApps.status, ok: adminApps.ok },
          judgeHackathons: { status: judgeHackathons.status, ok: judgeHackathons.ok },
          mentorCurrentRole: {
            status: mentorCurrentRole.status,
            ok: mentorCurrentRole.ok,
            role: mentorCurrentRole.data?.data?.role,
          },
          participantCurrentRole: {
            status: participantCurrentRole.status,
            ok: participantCurrentRole.ok,
            role: participantCurrentRole.data?.data?.role,
          },
        },
      },
      null,
      2
    )
  );
}

run().catch((error) => {
  console.error("ROLE FLOW E2E FAILED");
  console.error(error?.stack || error?.message || error);
  process.exit(1);
});

