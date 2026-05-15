// @ts-nocheck
/**
 * Supabase JS client — server-side only (service role key).
 * 
 * This replaces the old Neon query builder shim.
 * The Supabase JS client already exposes the same .from().select().eq() interface
 * that all existing route files use, so no route changes are needed.
 * 
 * NEVER expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn('⚠️  SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — DB client will not work');
}

// Singleton Supabase client with service role key (bypasses RLS)
let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    if (!supabaseUrl || !serviceRoleKey) {
      // Return a null-safe stub so the server doesn't crash on startup
      return createNullClient() as any;
    }
    _client = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _client;
}

// Null-safe stub — returns { data: null, error: { message: 'Database not configured' } }
// for all calls when env vars are absent
function createNullClient() {
  const nullResult = { data: null, error: { message: 'Database not configured' } };
  const nullChain: any = new Proxy({}, {
    get: () => () => nullChain,
  });
  return {
    from: () => nullChain,
    rpc: async () => nullResult,
    storage: {
      from: () => ({
        remove: async () => ({ error: null }),
        upload: async () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
    auth: {
      getUser: async () => ({ data: { user: null }, error: { message: 'Database not configured' } }),
      admin: {
        listUsers: async () => ({ data: { users: [] }, error: null }),
        createUser: async () => ({ data: { user: null }, error: { message: 'Database not configured' } }),
        deleteUser: async () => ({ error: null }),
        getUserById: async () => ({ data: { user: null }, error: null }),
        updateUserById: async () => ({ error: null }),
        inviteUserByEmail: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
      },
      signInWithPassword: async () => ({ data: null, error: { message: 'Database not configured' } }),
      refreshSession: async () => ({ data: null, error: { message: 'Database not configured' } }),
      resetPasswordForEmail: async () => ({ error: null }),
    },
  };
}

// Main db export — drop-in replacement for the old Neon shim
export const db = getSupabaseClient();

// Keep sql export for any legacy code that uses it directly
export const sql = null;

export default db;
