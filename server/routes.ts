import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createClient } from "@supabase/supabase-js";

// Simple per-user rate limiter (token bucket) in memory
const rateBuckets = new Map<string, { tokens: number; last: number }>();
function rateLimit(userId: string, key: string, capacity = 10, refillMs = 60_000): boolean {
  const bucketKey = `${key}:${userId}`;
  const now = Date.now();
  const b = rateBuckets.get(bucketKey) || { tokens: capacity, last: now };
  // Refill tokens
  const elapsed = now - b.last;
  if (elapsed > 0) {
    const refill = Math.floor(elapsed / refillMs) * capacity;
    b.tokens = Math.min(capacity, b.tokens + refill);
    b.last = now;
  }
  if (b.tokens <= 0) {
    rateBuckets.set(bucketKey, b);
    return false;
  }
  b.tokens -= 1;
  rateBuckets.set(bucketKey, b);
  return true;
}

function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  return supabaseAdmin.auth.getUser(token).then((r: any) => (r?.data?.user?.id ? r.data.user.id : null));
}

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  // Secure admin invite endpoint
  app.post("/api/admin/invite", async (req: Request, res: Response) => {
    try {
      const adminTokenHeader = req.headers["x-admin-invite-token"] as string | undefined;
      const ADMIN_INVITE_TOKEN = process.env.ADMIN_INVITE_TOKEN;
      if (!ADMIN_INVITE_TOKEN || adminTokenHeader !== ADMIN_INVITE_TOKEN) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { email } = req.body as { email?: string };
      if (!email || typeof email !== "string") {
        return res.status(400).json({ success: false, message: "Invalid payload: 'email' is required" });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
      }

      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      const SUPABASE_URL = process.env.SUPABASE_URL;
      if (!supabaseAdmin || !SUPABASE_URL) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      // Send an invite; if user exists, Supabase will throw an error
      const { data, error } = await (supabaseAdmin as any).auth.admin.inviteUserByEmail(email);
      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      const invitedUser = data?.user;
      if (!invitedUser?.id) {
        return res.status(500).json({ success: false, message: "Invite succeeded but user was not returned" });
      }

      // Upsert profile with role=admin
      const { error: upsertErr } = await supabaseAdmin
        .from("profiles")
        .upsert({ id: invitedUser.id, email, role: "admin" }, { onConflict: "id" });

      if (upsertErr) {
        return res.status(500).json({ success: false, message: `User invited but failed to set admin profile: ${upsertErr.message}` });
      }

      return res.json({ success: true, message: "Admin invite sent and profile updated", user_id: invitedUser.id });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || "Unexpected error" });
    }
  });

  // Account deletion endpoint (requires authenticated Bearer token)
  app.post("/api/account/delete", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      const SUPABASE_URL = process.env.SUPABASE_URL;
      if (!supabaseAdmin || !SUPABASE_URL) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);

      // Verify token and get the user
      const { data: jwtUser, error: jwtErr } = await (supabaseAdmin as any).auth.getUser(token);
      if (jwtErr || !jwtUser?.user?.id) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
      const userId: string = jwtUser.user.id;

      // Try to remove avatar object if present
      const { data: prof, error: profErr } = await supabaseAdmin
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .maybeSingle();
      if (!profErr && prof?.avatar_url) {
        try {
          const prefix = '/storage/v1/object/public/avatar/';
          const url = new URL(prof.avatar_url, SUPABASE_URL);
          const idx = url.pathname.indexOf(prefix);
          if (idx >= 0) {
            const path = url.pathname.slice(idx + prefix.length);
            await (supabaseAdmin as any).storage.from('avatar').remove([path]);
          }
        } catch {}
      }

      // Delete profile row
      await supabaseAdmin.from('profiles').delete().eq('id', userId);

      // Delete auth user
      const { error: delErr } = await (supabaseAdmin as any).auth.admin.deleteUser(userId);
      if (delErr) {
        return res.status(500).json({ success: false, message: delErr.message });
      }

      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Unexpected error' });
    }
  });

  // Profile update endpoint with validation and per-user rate limiting
  app.post("/api/profile/update", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin as any, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      if (!rateLimit(userId, 'profile:update', 15, 60_000)) {
        return res.status(429).json({ success: false, message: 'Too many requests' });
      }

      // Allowlist fields and validate/sanitize
      type Patch = {
        name?: string | null;
        bio?: string | null;
        location?: string | null;
        email?: string | null; // ignored here (email updates should go through auth API)
        skills?: string[] | null;
        github?: string | null;
        linkedin?: string | null;
        twitter?: string | null;
        website?: string | null;
        avatar_url?: string | null;
      };
      const body: Patch = req.body || {};

      // Helpers
      const trimOrNull = (v: any, max = 200): string | null => {
        if (typeof v !== 'string') return null;
        const s = v.trim();
        if (!s) return null;
        return s.slice(0, max);
      };
      const sanitizeHandle = (v: any, max = 64): string | null => {
        const s = trimOrNull(v, max);
        if (!s) return null;
        const cleaned = s.toLowerCase().replace(/[^a-z0-9._-]/g, '');
        return cleaned ? cleaned.slice(0, max) : null;
      };
      const sanitizeSkills = (arr: any): string[] | null => {
        if (!Array.isArray(arr)) return null;
        const out: string[] = [];
        for (const x of arr) {
          const val = trimOrNull(String(x), 32);
          if (val) out.push(val);
          if (out.length >= 20) break;
        }
        return out.length ? out : [];
      };
      const sanitizeWebsite = (v: any): string | null => {
        const raw = trimOrNull(v, 300);
        if (!raw) return null;
        try {
          const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
          if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
          return u.toString().slice(0, 300);
        } catch {
          return null;
        }
      };

      const patch: Patch = {
        name: trimOrNull(body.name, 100),
        bio: trimOrNull(body.bio, 1000),
        location: trimOrNull(body.location, 100),
        // email intentionally ignored to avoid desync with auth
        skills: sanitizeSkills(body.skills),
        github: sanitizeHandle(body.github),
        linkedin: sanitizeHandle(body.linkedin),
        twitter: sanitizeHandle(body.twitter),
        website: sanitizeWebsite(body.website),
        avatar_url: trimOrNull(body.avatar_url, 500),
      };

      const { error } = await (supabaseAdmin as any)
        .from('profiles')
        .update(patch)
        .eq('id', userId);
      if (error) return res.status(400).json({ success: false, message: error.message });

      const { data: updated, error: selErr } = await (supabaseAdmin as any)
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (selErr) return res.status(500).json({ success: false, message: selErr.message });

      return res.json({ success: true, profile: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Unexpected error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
