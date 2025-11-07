import { supabase } from './supabaseClient';

// Auth utility functions
export const getAuthToken = async (): Promise<string | null> => {
  try {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = await getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAuthToken();
  return !!token;
};