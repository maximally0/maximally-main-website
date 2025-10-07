import { createClient, type User, type Session } from '@supabase/supabase-js';

// Check multiple environment variable sources
const getEnvVar = (key: string): string | undefined => {
  // Try Vite import.meta.env first
  if (import.meta && import.meta.env) {
    const value = import.meta.env[key];
    if (value) return value;
  }
  
  // Fallback to process.env (Node.js)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  
  // Fallback to window environment (if set by server)
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    return (window as any).__ENV__[key];
  }
  
  return undefined;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Only log detailed environment info in development
if (import.meta.env.DEV) {
  console.log('🌍 Environment debug:', {
    hasImportMeta: typeof import.meta !== 'undefined',
    hasEnv: typeof import.meta?.env !== 'undefined',
    allEnvKeys: import.meta?.env ? Object.keys(import.meta.env) : [],
    environment: typeof window !== 'undefined' ? 'browser' : 'server'
  });

  console.log('🔑 Supabase configuration:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlLength: supabaseUrl?.length || 0,
    keyLength: supabaseAnonKey?.length || 0
  });
}

// Create single instance with proper configuration to prevent multiple instances
// Use singleton pattern to ensure only one client is ever created
let _supabaseInstance: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey && !_supabaseInstance) {
  _supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Prevent multiple auth listeners
      storageKey: 'maximally-supabase-auth'
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: { 'x-client-info': 'maximally-webapp' }
    }
  });
  
  console.log('✅ Supabase client created (singleton instance)');
} else if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase client not created - missing environment variables');
} else {
  console.log('♾️ Reusing existing Supabase client instance');
}

export const supabase = _supabaseInstance;

if (!supabase) {
  console.error('❌ Supabase client not initialized. Check env variables.');
  console.error('- VITE_SUPABASE_URL:', supabaseUrl);
  console.error('- VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
} else {
  console.log('✅ Supabase client initialized successfully');
}

// Use the same client instance for all queries to avoid multiple GoTrueClient instances
// Public data queries will work fine with the main client
export const supabasePublic = supabase;

if (supabase) {
  console.log('✅ Using main Supabase client for public data queries (no duplication)');
}

// -------------------- Types --------------------
export type Profile = {
  id: string; // uuid
  email: string | null;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  skills: string[] | null;
  github_username: string | null;
  linkedin_username: string | null;
  twitter_username: string | null;
  website_url: string | null;
  role: 'user' | 'admin';
  is_verified: boolean | null;
  preferences: any | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export interface SignUpPayload {
  email: string;
  password: string;
  name?: string;
  username?: string;
}

export type UpdatableProfileFields = {
  full_name?: string | null;
  bio?: string | null;
  location?: string | null;
  email?: string | null; // ignored server-side
  skills?: string[] | null;
  github_username?: string | null;
  linkedin_username?: string | null;
  twitter_username?: string | null;
  website_url?: string | null;
  avatar_url?: string | null;
};

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  author_name?: string | null;
  status: 'draft' | 'published';
  created_at: string | null;
  updated_at: string | null;
  tags?: string | string[] | null;
  reading_time_minutes?: number | null;
}

// -------------------- Auth Helpers --------------------
export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function getUser(): Promise<User | null> {
  if (!supabase) {
    console.log('❌ getUser: Supabase client not available');
    return null;
  }
  
  try {
    console.log('🔍 getUser: Calling supabase.auth.getUser()...');
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('❌ getUser: Supabase auth error:', error);
      return null;
    }
    
    const user = data.user ?? null;
    console.log('✅ getUser: Result:', user ? user.email : 'No user');
    return user;
  } catch (err: any) {
    console.error('❌ getUser: Exception:', err.message || err);
    return null;
  }
}

// -------------------- Profile Helpers --------------------
export async function getProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data as Profile ?? null;
  } catch (err) {
    console.error('getProfile error:', err);
    return null;
  }
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();
    if (error) throw error;
    return data as Profile ?? null;
  } catch (err) {
    console.error('getProfileByUsername error:', err);
    return null;
  }
}

export async function ensureUserProfile(user: User): Promise<Profile | null> {
  if (!supabase) {
    console.error('❌ ensureUserProfile: Supabase client not available');
    return null;
  }
  
  try {
    console.log('🔍 ensureUserProfile: Checking existing profile for:', user.email);
    const existing = await getProfile(user.id);
    if (existing) {
      console.log('✅ ensureUserProfile: Existing profile found:', existing.username || existing.email);
      return existing;
    }

    console.log('🔄 ensureUserProfile: Creating new profile for:', user.email);
    const email = user.email ?? null;
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, email, role: 'user' }, { onConflict: 'id' })
      .select()
      .maybeSingle();
      
    if (error) {
      console.error('❌ ensureUserProfile: Database error:', error);
      throw error;
    }
    
    const profile = data as Profile ?? null;
    if (profile) {
      console.log('✅ ensureUserProfile: New profile created:', profile.email);
    } else {
      console.error('❌ ensureUserProfile: No profile returned from upsert');
    }
    
    return profile;
  } catch (err: any) {
    console.error('❌ ensureUserProfile error:', err.message || err);
    return null;
  }
}

export async function updateProfileMe(patch: UpdatableProfileFields) {
  if (!supabase) throw new Error('Supabase not configured');
  try {
    const { data: s } = await supabase.auth.getSession();
    const token = s.session?.access_token;
    if (!token) throw new Error('Not authenticated');

    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.message || 'Failed to update profile');
    return json?.profile as Profile | undefined;
  } catch (err) {
    console.error('updateProfileMe error:', err);
    throw err;
  }
}

// -------------------- Auth Actions --------------------
export async function signInWithEmailPassword(email: string, password: string) {
  if (!supabase) {
    console.warn('Supabase not configured - authentication not available');
    throw new Error('Authentication service is not configured. Please check environment variables.');
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error('No user returned');
    await ensureUserProfile(data.user);
    return data.user;
  } catch (err) {
    console.error('signInWithEmailPassword error:', err);
    throw err;
  }
}

function slugifyUsername(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9_\.\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function signUpWithEmailPassword(payload: SignUpPayload) {
  if (!supabase) {
    console.warn('Supabase not configured - authentication not available');
    throw new Error('Authentication service is not configured. Please check environment variables.');
  }
  try {
    const { email, password, name, username } = payload;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    let user = data.user;
    if (!user) {
      const fetched = await getUser();
      if (fetched) user = fetched;
    }

    if (user) {
      const fallback = user.email?.split('@')[0] || 'user';
      const finalUsername = slugifyUsername(username || fallback);

      const profilePayload: Partial<Profile> = {
        id: user.id,
        email: user.email ?? null,
        role: 'user',
        full_name: name ?? null,
        username: finalUsername,
      } as any;

      await supabase.from('profiles').upsert(profilePayload, { onConflict: 'id' });
    }

    return user;
  } catch (err) {
    console.error('signUpWithEmailPassword error:', err);
    throw err;
  }
}

export async function signOut() {
  if (!supabase) return;
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error('signOut error:', err);
  }
}

// -------------------- User Helpers --------------------
// Cache promise to prevent multiple simultaneous calls
let _getCurrentUserPromise: Promise<{ user: User; profile: Profile } | null> | null = null;

export async function getCurrentUserWithProfile(): Promise<{ user: User; profile: Profile } | null> {
  // If there's already a pending request, return that promise
  if (_getCurrentUserPromise) {
    console.log('🔄 getCurrentUserWithProfile: Using cached promise');
    return _getCurrentUserPromise;
  }
  
  console.log('👤 getCurrentUserWithProfile: Starting new request...');
  
  // Create and cache the promise with timeout
  _getCurrentUserPromise = (async () => {
    try {
      // Add timeout to prevent hanging indefinitely
      const result = await Promise.race([
        (async () => {
          const user = await getUser();
          if (!user) {
            console.log('❌ getCurrentUserWithProfile: No user found');
            return null;
          }
          
          console.log('👤 getCurrentUserWithProfile: User found:', user.email);
          
          const profile = await ensureUserProfile(user);
          if (!profile) {
            console.error('❌ getCurrentUserWithProfile: No profile found/created');
            return null;
          }
          
          console.log('✅ getCurrentUserWithProfile: Success! Profile:', {
            username: profile.username,
            email: profile.email,
            role: profile.role
          });
          
          return { user, profile };
        })(),
        new Promise<null>((_, reject) => {
          setTimeout(() => {
            reject(new Error('getCurrentUserWithProfile timeout after 10 seconds'));
          }, 10000);
        })
      ]);
      
      return result;
    } finally {
      // Clear the cache after completion (success or failure)
      _getCurrentUserPromise = null;
    }
  })();
  
  return _getCurrentUserPromise;
}

export async function isAdmin(): Promise<boolean> {
  const c = await getCurrentUserWithProfile();
  return c?.profile.role === 'admin';
}

// -------------------- Avatar Helpers --------------------
export async function uploadAvatar(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error('Not authenticated');

  if (!file || !file.size) throw new Error('No file provided');
  if (!file.type.startsWith('image/')) throw new Error('Only image files allowed');
  const MAX = 5 * 1024 * 1024;
  if (file.size > MAX) throw new Error('Image must be <= 5MB');

  const userId = u.user.id;
  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  const safeExt = ['png','jpg','jpeg','webp','gif','bmp','avif'].includes(ext) ? ext : 'png';
  const key = `${userId}/avatar.${safeExt}`;

  const { error: upErr } = await supabase.storage.from('avatar').upload(key, file, {
    contentType: file.type || 'image/png',
    upsert: true,
  });
  if (upErr) throw upErr;

  const { data } = supabase.storage.from('avatar').getPublicUrl(key);
  const publicUrl = data.publicUrl;
  await updateProfileMe({ avatar_url: publicUrl });
  return publicUrl;
}

export async function clearAvatar(): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error('Not authenticated');

  const userId = u.user.id;
  const candidates = ['png','jpg','jpeg','webp','gif','bmp','avif'].map(ext => `${userId}/avatar.${ext}`);
  try { await (supabase as any).storage.from('avatar').remove(candidates); } catch {}
  await updateProfileMe({ avatar_url: null });
}

// -------------------- Account Delete --------------------
export async function deleteAccountRequest(): Promise<{ success: boolean; message?: string }> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Not authenticated');

  const res = await fetch('/api/account/delete', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || 'Failed to delete account');
  return body as any;
}
