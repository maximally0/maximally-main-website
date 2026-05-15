import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const rows = await sql`
  select table_name
  from information_schema.tables
  where table_schema = 'public'
    and (
      table_name ilike 'judge%'
      or table_name ilike '%application%'
      or table_name in ('profiles', 'mentor_sessions', 'mentorship_sessions')
    )
  order by table_name
`;

console.log(rows.map((r) => r.table_name).join("\n"));

