import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  
  // Test 1: Check if we can connect
  console.log('Test 1: Checking connection...');
  const { data: tables, error: tablesError } = await supabase
    .from('judges')
    .select('id')
    .limit(1);
  
  if (tablesError) {
    console.log('⚠️  judges table query result:', tablesError.message);
  } else {
    console.log('✅ Connection successful! judges table exists.');
  }
  
  // Test 2: Check if judge_applications table exists
  console.log('\nTest 2: Checking judge_applications table...');
  const { data: apps, error: appsError } = await supabase
    .from('judge_applications')
    .select('id')
    .limit(1);
  
  if (appsError) {
    console.log('❌ judge_applications table does NOT exist!');
    console.log('   Error:', appsError.message);
    console.log('\n📋 ACTION REQUIRED:');
    console.log('   You need to run the SQL migration to create the judge_applications table.');
    console.log('   See MIGRATION-INSTRUCTIONS.md for details.\n');
  } else {
    console.log('✅ judge_applications table exists!');
  }
  
  // Test 3: Check if judge_application_events table exists
  console.log('\nTest 3: Checking judge_application_events table...');
  const { data: events, error: eventsError } = await supabase
    .from('judge_application_events')
    .select('id')
    .limit(1);
  
  if (eventsError) {
    console.log('❌ judge_application_events table does NOT exist!');
    console.log('   Error:', eventsError.message);
  } else {
    console.log('✅ judge_application_events table exists!');
  }
  
  console.log('\n' + '='.repeat(60));
  if (appsError || eventsError) {
    console.log('❌ MIGRATION NEEDED');
    console.log('   Run the SQL in supabase-migration-judge-applications.sql');
    console.log('   in your Supabase SQL Editor to fix the issue.');
  } else {
    console.log('✅ ALL TABLES EXIST - Judge applications should work!');
  }
  console.log('='.repeat(60) + '\n');
}

testConnection().catch(console.error);
