import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const suffix = process.argv[2];
if (!suffix) {
  throw new Error("Usage: node scripts/inspect-recent-profiles.mjs <suffix>");
}

const sql = neon(process.env.DATABASE_URL);
const rows = await sql`
  select id, email, username, role, created_at, updated_at
  from profiles
  where email like ${`%${suffix}%`}
     or username like ${`%${suffix}%`}
  order by created_at desc
  limit 20
`;

console.log(JSON.stringify(rows, null, 2));

