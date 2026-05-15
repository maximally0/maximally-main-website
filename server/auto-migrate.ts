// Auto-migration check - runs on server startup
import { sql } from "./db";

export async function runAutoMigrations(_supabaseAdmin?: any) {
  if (!sql) {
    console.warn('⚠️  Skipping auto-migrations: DATABASE_URL not configured');
    return false;
  }

  console.log('🔄 Running auto-migration checks...');

  try {
    // Quick connectivity check
    await sql`SELECT 1`;
    console.log('✅ Neon DB connection verified');
    return true;
  } catch (error: any) {
    console.error('❌ Auto-migration check failed:', error.message);
    return false;
  }
}
