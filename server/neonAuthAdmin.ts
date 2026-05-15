/**
 * @deprecated This module has been replaced by server/supabaseAdmin.ts.
 * This file is kept as a compatibility shim to avoid breaking existing imports.
 * All new code should import from './supabaseAdmin' directly.
 */
export { getSupabaseAdmin } from './supabaseAdmin';

/**
 * Legacy shim: createNeonAuthAdmin is no longer used.
 * Returns a minimal object that delegates auth.getUser to the Supabase admin client,
 * so any remaining call sites continue to compile without changes.
 */
export function createNeonAuthAdmin(_neonAuthUrl?: string, _jwksUrl?: string) {
  const { getSupabaseAdmin: _getSupabaseAdmin } = require('./supabaseAdmin');
  const client = _getSupabaseAdmin();

  async function getUser(token: string) {
    return client.auth.getUser(token);
  }

  const admin = client.auth.admin;

  return { getUser, admin };
}
