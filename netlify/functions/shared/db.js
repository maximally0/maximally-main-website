/**
 * Shared Supabase client for Netlify Functions.
 * All database operations use the Supabase JS client with the service role key.
 */
import { createClient } from '@supabase/supabase-js';

export function getDb() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

// Legacy alias so existing code that calls getSupabaseAdmin() keeps working
export function getSupabaseAdmin() {
  return getDb();
}

// Deprecated stubs — kept so supabase.js re-exports don't break
// These were used with the old Neon DB client and are no longer functional
export function getSql() {
  throw new Error('getSql() is no longer supported. Use getDb() with the Supabase JS client instead.');
}

export function getNeonAuthUrl() {
  return process.env.NEON_AUTH_URL;
}

export function createResponse(statusCode, data, error = null) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: JSON.stringify({ success: statusCode >= 200 && statusCode < 300, data, error })
  };
}

export function parseBody(event) {
  try { return event.body ? JSON.parse(event.body) : {}; }
  catch { throw new Error('Invalid JSON in request body'); }
}
