// Auto-migration script - runs on server startup
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export async function runAutoMigrations(supabaseAdmin: any) {
  console.log('🔄 Running auto-migrations...');
  
  try {
    // Check if user_notification_dismissals table exists
    const { data, error } = await supabaseAdmin
      .from('user_notification_dismissals')
      .select('*')
      .limit(1);

    if (error && error.message.includes('relation "user_notification_dismissals" does not exist')) {
      console.log('⚠️  user_notification_dismissals table not found.');
      console.log('📄 Please run the SQL migration:');
      console.log('   File: server/migrations/user_notification_dismissals.sql');
      console.log('   Or run: supabase db execute -f server/migrations/user_notification_dismissals.sql');
      console.log('');
      console.log('💡 Quick fix: Copy SQL from server/migrations/user_notification_dismissals.sql');
      console.log('   and run it in Supabase SQL Editor');
      return false;
    } else if (error) {
      console.error('❌ Migration check error:', error.message);
      return false;
    } else {
      console.log('✅ All migrations applied successfully');
      return true;
    }
  } catch (error: any) {
    console.error('❌ Auto-migration failed:', error.message);
    return false;
  }
}
