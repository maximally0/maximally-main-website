/**
 * Hybrid client that can use either Supabase or API client
 * Allows gradual migration based on feature flags
 */
import { createClient } from '@supabase/supabase-js';
import { apiClient, supabaseCompat } from './apiClient';
import { USE_API } from './featureFlags';

// Original Supabase client setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let _supabaseInstance: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey && !_supabaseInstance) {
  _supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  });
}

// Export the original supabase client for components that haven't migrated yet
export const supabase = _supabaseInstance;

// Hybrid client that routes to appropriate backend
export const hybridClient = {
  auth: {
    signInWithPassword: USE_API 
      ? supabaseCompat.auth.signInWithPassword
      : _supabaseInstance?.auth.signInWithPassword.bind(_supabaseInstance.auth),
      
    signUp: USE_API
      ? supabaseCompat.auth.signUp
      : _supabaseInstance?.auth.signUp.bind(_supabaseInstance.auth),
      
    signOut: _supabaseInstance?.auth.signOut.bind(_supabaseInstance.auth),
    
    getSession: _supabaseInstance?.auth.getSession.bind(_supabaseInstance.auth),
    
    onAuthStateChange: _supabaseInstance?.auth.onAuthStateChange.bind(_supabaseInstance.auth),
  },
  
  from: (table: string) => {
    // Route ALL tables to new API if enabled
    if (USE_API) {
      return {
        select: () => ({
          eq: () => ({
            single: () => {
              throw new Error('Direct Supabase queries disabled. Use API client methods instead.');
            }
          })
        })
      };
    }
    
    // Fallback to original Supabase for other tables
    return _supabaseInstance?.from(table);
  }
};

// Legacy exports for backward compatibility
export const getProfileByUsername = async (username: string) => {
  if (USE_API) {
    try {
      const result = await apiClient.getUserProfile(undefined, username);
      return result.data.profile;
    } catch (error) {
      throw error;
    }
  }
  
  // Fallback to original Supabase
  const { data, error } = await supabase?.from('profiles')
    .select('*')
    .eq('username', username)
    .single() || { data: null, error: new Error('Supabase not initialized') };
    
  if (error) throw error;
  return data;
};

export const getCurrentUserWithProfile = async () => {
  const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } };
  
  if (!session?.user) {
    return { user: null, profile: null };
  }
  
  if (USE_API) {
    try {
      const result = await apiClient.getUserProfile(session.user.id);
      return {
        user: session.user,
        profile: result.data.profile
      };
    } catch (error) {
      return { user: session.user, profile: null };
    }
  }
  
  // Fallback to original Supabase
  const { data: profile } = await supabase?.from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single() || { data: null };
    
  return { user: session.user, profile };
};

export const updateProfileMe = async (updates: any) => {
  const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } };
  
  if (!session?.user) {
    throw new Error('Not authenticated');
  }
  
  // For now, keep using Supabase for updates until we implement update endpoints
  const { data, error } = await supabase?.from('profiles')
    .update(updates)
    .eq('id', session.user.id)
    .select()
    .single() || { data: null, error: new Error('Supabase not initialized') };
    
  if (error) throw error;
  return data;
};

export const getCertificatesByUsername = async (username: string) => {
  if (USE_API) {
    try {
      const result = await apiClient.getCertificates({ maximally_username: username });
      return result.data.certificates;
    } catch (error) {
      throw error;
    }
  }
  
  // Fallback to original Supabase
  const { data, error } = await supabase?.from('certificates')
    .select('*')
    .eq('maximally_username', username)
    .order('created_at', { ascending: false }) || { data: null, error: new Error('Supabase not initialized') };
    
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (USE_API) {
    // Clear local storage
    localStorage.removeItem('maximally_session');
    localStorage.removeItem('maximally_user');
    localStorage.removeItem('maximally_profile');
  }
  
  // Also sign out from Supabase
  await supabase?.auth.signOut();
};

// Re-export types
export type { User, Session } from '@supabase/supabase-js';