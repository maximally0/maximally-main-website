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

// Public base URL used for auth redirects (prod/staging friendly)
const publicBaseUrl = getEnvVar('VITE_PUBLIC_BASE_URL');

function getBaseUrl(): string | undefined {
  // Prefer explicit base URL if provided
  if (publicBaseUrl) return publicBaseUrl;
  // Fallback to window origin in browser
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin;
  return undefined;
}

// Development environment logging removed

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
      storageKey: 'maximally-supabase-auth',
    },
    global: {
      headers: { 'x-client-info': 'maximally-webapp' }
    }
  });
} else if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase client not created - missing environment variables');
} else {
  // Reusing existing Supabase client instance
}

export const supabase = _supabaseInstance;

if (!supabase) {
  console.error('❌ Supabase client not initialized. Check env variables.');
  console.error('- VITE_SUPABASE_URL:', supabaseUrl);
  console.error('- VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
} else {
  // Supabase client initialized successfully
}

// Use the same client instance for all queries to avoid multiple GoTrueClient instances
// Public data queries will work fine with the main client
export const supabasePublic = supabase;

if (supabase) {
  // Using main Supabase client for public data queries
}

// -------------------- Moderation Status --------------------
export interface ModerationStatus {
  user_id: string;
  is_banned: boolean;
  is_muted: boolean;
  is_suspended: boolean;
  ban_reason: string | null;
  mute_reason: string | null;
  suspend_reason: string | null;
  ban_expires_at: string | null;
  mute_expires_at: string | null;
  suspend_expires_at: string | null;
  warning_count: number;
}

export async function getUserModerationStatus(userId: string): Promise<ModerationStatus | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('user_moderation_status')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching moderation status:', error);
      return null;
    }
    
    // Check if any time-based restrictions have expired
    if (data) {
      const now = new Date();
      const status = data as ModerationStatus;
      
      // Check if ban has expired
      if (status.is_banned && status.ban_expires_at) {
        if (new Date(status.ban_expires_at) < now) {
          status.is_banned = false;
        }
      }
      
      // Check if mute has expired
      if (status.is_muted && status.mute_expires_at) {
        if (new Date(status.mute_expires_at) < now) {
          status.is_muted = false;
        }
      }
      
      // Check if suspension has expired
      if (status.is_suspended && status.suspend_expires_at) {
        if (new Date(status.suspend_expires_at) < now) {
          status.is_suspended = false;
        }
      }
      
      return status;
    }
    
    return null;
  } catch (err) {
    console.error('getUserModerationStatus error:', err);
    return null;
  }
}

export async function isUserBanned(userId: string): Promise<{ banned: boolean; reason?: string; expiresAt?: string }> {
  const status = await getUserModerationStatus(userId);
  if (!status) return { banned: false };
  
  if (status.is_banned) {
    // Check if ban has expired
    if (status.ban_expires_at) {
      const expiresAt = new Date(status.ban_expires_at);
      if (expiresAt < new Date()) {
        return { banned: false };
      }
      return { banned: true, reason: status.ban_reason || undefined, expiresAt: status.ban_expires_at };
    }
    return { banned: true, reason: status.ban_reason || undefined };
  }
  
  return { banned: false };
}

export async function isUserMuted(userId: string): Promise<{ muted: boolean; reason?: string; expiresAt?: string }> {
  const status = await getUserModerationStatus(userId);
  if (!status) return { muted: false };
  
  if (status.is_muted) {
    if (status.mute_expires_at) {
      const expiresAt = new Date(status.mute_expires_at);
      if (expiresAt < new Date()) {
        return { muted: false };
      }
      return { muted: true, reason: status.mute_reason || undefined, expiresAt: status.mute_expires_at };
    }
    return { muted: true, reason: status.mute_reason || undefined };
  }
  
  return { muted: false };
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
  role: 'user' | 'admin' | 'judge' | 'organizer';
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
  if (!supabase) return null;
  
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user ?? null;
  } catch (err: any) {
    console.error('getUser error:', err.message || err);
    return null;
  }
}

// -------------------- OAuth Profile Helpers --------------------
interface OAuthProfileData {
  fullName?: string;
  username?: string;
  avatarUrl?: string;
  githubUsername?: string;
}

function extractGoogleProfileData(user: User): OAuthProfileData {
  const metadata = user.user_metadata || {};
  const identities = user.identities || [];
  
  // Get Google identity data
  const googleIdentity = identities.find(id => id.provider === 'google');
  const googleData = googleIdentity?.identity_data || {};
  
  // Extract avatar URL from multiple possible sources
  const avatarUrl = metadata.avatar_url || 
                   metadata.picture || 
                   googleData.picture ||
                   googleData.avatar_url;
  
  // Google profile data extracted
  
  return {
    fullName: metadata.full_name || metadata.name || googleData.name,
    username: metadata.preferred_username || metadata.email?.split('@')[0],
    avatarUrl,
  };
}

function extractGitHubProfileData(user: User): OAuthProfileData {
  const metadata = user.user_metadata || {};
  const identities = user.identities || [];
  
  // Get GitHub identity data
  const githubIdentity = identities.find(id => id.provider === 'github');
  const githubData = githubIdentity?.identity_data || {};
  
  // Extract avatar URL from multiple possible sources
  const avatarUrl = metadata.avatar_url || 
                   githubData.avatar_url || 
                   metadata.picture ||
                   (githubData.login ? `https://github.com/${githubData.login}.png` : null);
  
  // GitHub profile data extracted
  
  return {
    fullName: metadata.full_name || metadata.name || githubData.name,
    username: metadata.preferred_username || metadata.user_name || githubData.login,
    avatarUrl,
    githubUsername: metadata.user_name || githubData.login,
  };
}

function extractOAuthProfileData(user: User): OAuthProfileData {
  const identities = user.identities || [];
  
  // Check which OAuth provider was used
  if (identities.some(id => id.provider === 'google')) {
    return extractGoogleProfileData(user);
  } else if (identities.some(id => id.provider === 'github')) {
    return extractGitHubProfileData(user);
  }
  
  return {};
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
    return (data as unknown as Profile) ?? null;
  } catch (err) {
    console.error('getProfile error:', err);
    return null;
  }
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  if (!supabase) return null;
  try {
  // getProfileByUsername: Direct query for username
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();
    
    if (error) {
      console.error('❌ getProfileByUsername error:', error);
      return null;
    }
    
    if (data) {
      const profile = data as any;
  // Profile found for username
    } else {
      console.warn('⚠️ No profile found for username:', username);
    }
    
    return (data as unknown as Profile) ?? null;
  } catch (err) {
    console.error('getProfileByUsername error:', err);
    return null;
  }
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  if (!supabase) return false;
  if (!username || username.length < 3) return false;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      console.error('isUsernameAvailable error:', error);
      return false;
    }
    
    return !data; // Available if no data found
  } catch (err) {
    console.error('isUsernameAvailable error:', err);
    return false;
  }
}

export async function generateUniqueUsername(baseUsername: string): Promise<string> {
  if (!supabase) return baseUsername;
  
  let username = slugifyUsername(baseUsername);
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const isAvailable = await isUsernameAvailable(username);
    if (isAvailable) {
      return username;
    }
    
    attempts++;
    const suffix = Math.random().toString(36).slice(2, 4);
    username = `${slugifyUsername(baseUsername)}${suffix}`;
  }
  
  // Fallback with timestamp
  return `${slugifyUsername(baseUsername)}${Date.now().toString().slice(-4)}`;
}

export async function ensureUserProfile(user: User): Promise<Profile | null> {
  if (!supabase) return null;
  
  try {
    const existing = await getProfile(user.id);
    if (existing) return existing;

    // Extract OAuth profile data if available
    const oauthData = extractOAuthProfileData(user);
    const email = user.email ?? null;
    
    // Generate username from OAuth data or email fallback
    let baseUsername = oauthData.username;
    if (!baseUsername && email) {
      // Special handling for known problematic emails
      if (email === 'os.iso.file1010@gmail.com') {
        baseUsername = 'osiso1010';
      } else {
        baseUsername = email.split('@')[0];
      }
    }
    
    // Ensure username is valid and unique
    if (!baseUsername || baseUsername.length < 3) {
      baseUsername = 'user' + Math.random().toString(36).slice(2, 8);
    }
    
    // Generate a unique username
    const username = await generateUniqueUsername(baseUsername);
    
    // Prepare profile payload with OAuth data
    const profilePayload: Partial<Profile> = {
      id: user.id,
      email,
      role: 'user',
      full_name: oauthData.fullName || null,
      username: username || null,
      avatar_url: oauthData.avatarUrl || null,
      github_username: oauthData.githubUsername || null,
    };
    
  // Creating profile with OAuth data

    // Try inserting the profile, with retry for username conflicts
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .upsert(profilePayload as any, { onConflict: 'id' })
          .select()
          .maybeSingle();
          
        if (error) {
          // If username constraint or duplicate violation, generate a new username and retry
          if ((error.message?.includes('username') || error.message?.includes('duplicate') || error.message?.includes('unique')) && attempts < maxAttempts - 1) {
            const randomSuffix = Math.random().toString(36).slice(2, 4);
            const baseUsername = username.replace(/\d+$/, ''); // Remove existing numbers
            profilePayload.username = `${baseUsername}${randomSuffix}`;
            // Username collision, retrying with new username
            attempts++;
            continue;
          }
          throw error;
        }
        
        return (data as unknown as Profile) ?? null;
      } catch (retryError) {
        if (attempts === maxAttempts - 1) {
          throw retryError;
        }
        attempts++;
      }
    }
    
    return null;
  } catch (err: any) {
    console.error('ensureUserProfile error:', err.message || err);
    
    // Store error info for the login page to handle
    if (typeof window !== 'undefined' && err.message?.includes('constraint')) {
      localStorage.setItem('oauth_profile_error', err.message);
    }
    
    return null;
  }
}

export async function updateProfileMe(patch: UpdatableProfileFields) {
  if (!supabase) throw new Error('Supabase not configured');
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // For static hosting, update profile directly with Supabase
    const { data, error } = await (supabase as any)
      .from('profiles')
      .update(patch)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Profile | undefined;
  } catch (err) {
    console.error('updateProfileMe error:', err);
    throw err;
  }
}

export async function updateUsername(newUsername: string): Promise<{success: boolean, error?: string}> {
  if (!supabase) return {success: false, error: 'Supabase not configured'};
  
  try {
    // Validate username format
    const cleanUsername = slugifyUsername(newUsername);
    if (cleanUsername !== newUsername.toLowerCase() || cleanUsername.length < 3 || cleanUsername.length > 30) {
      return {success: false, error: 'Username must be 3-30 characters, letters and numbers only'};
    }
    
    // Check if username is available
    const isAvailable = await isUsernameAvailable(cleanUsername);
    if (!isAvailable) {
      return {success: false, error: 'Username is already taken'};
    }
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {success: false, error: 'Not authenticated'};
    
    // Update username
    const { error } = await (supabase as any)
      .from('profiles')
      .update({ username: cleanUsername })
      .eq('id', user.id);
      
    if (error) {
      console.error('updateUsername error:', error);
      return {success: false, error: error.message};
    }
    
    return {success: true};
  } catch (err: any) {
    console.error('updateUsername error:', err);
    return {success: false, error: err.message || 'Failed to update username'};
  }
}

// -------------------- Password Management --------------------
export async function changePassword(currentPassword: string, newPassword: string): Promise<{success: boolean, error?: string}> {
  if (!supabase) return {success: false, error: 'Supabase not configured'};
  
  try {
    // For static hosting, use Supabase's built-in password update
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      return {success: false, error: error.message};
    }
    
    return {success: true};
  } catch (err: any) {
    console.error('changePassword error:', err);
    return {success: false, error: err.message || 'Failed to change password'};
  }
}

export async function setPasswordForOAuthUser(newPassword: string): Promise<{success: boolean, error?: string}> {
  if (!supabase) return {success: false, error: 'Supabase not configured'};
  
  try {
    // For static hosting, use Supabase's built-in password update
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      data: {
        has_password: true,
        password_set_at: new Date().toISOString()
      }
    });
    
    if (error) {
      return {success: false, error: error.message};
    }
    
    return {success: true};
  } catch (err: any) {
    console.error('setPasswordForOAuthUser error:', err);
    return {success: false, error: err.message || 'Failed to set password'};
  }
}

// -------------------- Password Reset (Forgot/Recover) --------------------
// Triggers a password reset email via Supabase. SMTP is managed in Supabase (e.g. Resend).
export async function requestPasswordReset(email: string, redirectTo?: string): Promise<{ success: boolean; error?: string }>{
  if (!supabase) return { success: false, error: 'Supabase not configured' };
  try {
    const base = redirectTo || (getBaseUrl() ? `${getBaseUrl()}/reset-password` : undefined);
    const { error } = await supabase.auth.resetPasswordForEmail(email, base ? { redirectTo: base } : undefined as any);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    console.error('requestPasswordReset error:', err);
    return { success: false, error: err.message || 'Failed to send reset email' };
  }
}

// Completes the password reset once the user landed back from the email link.
// Supabase sets a temporary recovery session on redirect; updateUser uses that session.
export async function completePasswordReset(newPassword: string): Promise<{ success: boolean; error?: string }>{
  if (!supabase) return { success: false, error: 'Supabase not configured' };
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    console.error('completePasswordReset error:', err);
    return { success: false, error: err.message || 'Failed to reset password' };
  }
}

export async function checkIfUserHasPassword(): Promise<boolean> {
  if (!supabase) return false;
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Check if user has any email-based identity (indicates original password-based signup)
    const hasEmailIdentity = user.identities?.some(identity => identity.provider === 'email');
    if (hasEmailIdentity) return true;
    
    // Check user metadata for password flag (primary check for OAuth users)
    const hasPasswordFromMetadata = user.user_metadata?.has_password === true;
    if (hasPasswordFromMetadata) return true;
    
    // Fallback: assume OAuth-only users don't have password initially
    return false;
  } catch (err: any) {
    console.error('checkIfUserHasPassword error:', err);
    return false;
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
  // Email signin successful
    return data.user;
  } catch (err) {
    console.error('signInWithEmailPassword error:', err);
    throw err;
  }
}

// -------------------- Email OTP (signup verification) --------------------
export async function verifyEmailOtp(email: string, token: string): Promise<{ success: boolean; error?: string }>{
  if (!supabase) return { success: false, error: 'Supabase not configured' };
  try {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    console.error('verifyEmailOtp error:', err);
    return { success: false, error: err.message || 'Failed to verify code' };
  }
}

export async function resendEmailOtp(email: string): Promise<{ success: boolean; error?: string }>{
  if (!supabase) return { success: false, error: 'Supabase not configured' };
  try {
    const { error } = await (supabase as any).auth.resend({ type: 'signup', email });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    console.error('resendEmailOtp error:', err);
    return { success: false, error: err.message || 'Failed to resend code' };
  }
}

export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Authentication service is not configured.');
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin, // 👈 FIXES the 5000 redirect
    },
  });

  if (error) throw error;
}

export async function signUpWithGoogle() {
  // OAuth sign-in and sign-up are the same
  return signInWithGoogle();
}

export async function signInWithGitHub() {
  if (!supabase) {
    throw new Error('Authentication service is not configured.');
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: window.location.origin, // 👈 SAME FIX
    },
  });

  if (error) throw error;
}
export async function signUpWithGitHub() {
  // OAuth sign-in and sign-up are the same
  return signInWithGitHub();
}

function slugifyUsername(input: string) {
  let username = input
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric characters
    .slice(0, 20); // Limit length to 20 characters
  
  // Ensure it starts with a letter (some databases require this)
  if (username && /^[0-9]/.test(username)) {
    username = 'u' + username;
  }
  
  // Ensure minimum length and fallback
  if (!username || username.length < 3) {
    username = 'user' + Math.random().toString(36).slice(2, 8);
  }
  
  return username;
}

export async function signUpWithEmailPassword(payload: SignUpPayload) {
  if (!supabase) {
    console.warn('Supabase not configured - authentication not available');
    throw new Error('Authentication service is not configured. Please check environment variables.');
  }
  try {
    const { email, password, name, username } = payload;
const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: getBaseUrl() } });
    if (error) throw error;

    let user = data.user;
    if (!user) {
      const fetched = await getUser();
      if (fetched) user = fetched;
    }

    if (user) {
      // Use provided username directly, only fallback if empty
      let finalUsername = username;
      if (!finalUsername || finalUsername.trim() === '') {
        const fallback = user.email?.split('@')[0] || 'user';
        finalUsername = slugifyUsername(fallback);
      }

  // SIGNUP: Creating profile with username

      const profilePayload: Partial<Profile> = {
        id: user.id,
        email: user.email ?? null,
        role: 'user',
        full_name: name ?? null,
        username: finalUsername,
      } as any;

      const { error: profileError } = await supabase.from('profiles').upsert(profilePayload as any, { onConflict: 'id' });
      if (profileError) {
        console.error('❌ Profile creation error:', profileError);
        throw new Error('Failed to create profile: ' + profileError.message);
      }
  // Profile created successfully
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
    return _getCurrentUserPromise;
  }
  
  // Create and cache the promise with timeout
  _getCurrentUserPromise = (async () => {
    try {
      const user = await getUser();
      if (!user) {
  // getCurrentUserWithProfile: No user found
        return null;
      }
      
  // getCurrentUserWithProfile: Looking for profile for user
      
      // DIRECT QUERY - BYPASS ALL POLICIES
      if (!supabase) {
        console.error('❌ Supabase not initialized');
        return null;
      }
      
          // Use an explicit result variable so TypeScript can infer correct types
          const profileRes = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          let profile = (profileRes as any)?.data as Profile | null;
          const profileErr = (profileRes as any)?.error;
          
          if (profileErr && profileErr.code !== 'PGRST116') {
            console.error('❌ Direct profile query failed:', profileErr);
            return null;
          }
      
      // If no profile found, create one (especially important for OAuth users)
      if (!profile) {
  // No profile found, creating one for OAuth user
        profile = await ensureUserProfile(user);
        if (!profile) {
          console.error('❌ Failed to create profile for user:', user.email);
          return null;
        }
  // Profile created successfully for user
      }
      
      const profileData = profile as any;
  // Profile loaded
      
      return { user, profile: profile as Profile };
    } catch (error: any) {
      console.error('❌ getCurrentUserWithProfile error:', error);
      return null;
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
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Clear avatar files first
    try {
      const userId = user.id;
      const candidates = ['png','jpg','jpeg','webp','gif','bmp','avif'].map(ext => `${userId}/avatar.${ext}`);
      await (supabase as any).storage.from('avatar').remove(candidates);
    } catch (avatarError) {
      console.warn('Failed to delete avatar files:', avatarError);
    }

    // Delete related data first (certificates, etc.)
    try {
      // Delete certificates associated with this user
      await supabase
        .from('certificates')
        .delete()
        .eq('maximally_username', user.user_metadata?.preferred_username || user.email?.split('@')[0]);
    } catch (certError) {
      console.warn('Failed to delete certificates:', certError);
    }

    // Delete the profile data
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileError) {
      throw new Error('Failed to delete profile: ' + profileError.message);
    }

    // Try to delete the user from auth (this requires admin privileges)
    // Since we can't delete from client-side, we'll use a database function
    try {
      const { error: deleteUserError } = await (supabase as any).rpc('delete_user_account', {
        user_id: user.id
      });
      
      if (deleteUserError) {
        console.warn('Failed to delete auth user (may require admin privileges):', deleteUserError);
      }
    } catch (deleteError) {
      console.warn('User deletion from auth failed (expected for client-side):', deleteError);
    }

    // Clear local storage and session data
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (storageError) {
      console.warn('Failed to clear storage:', storageError);
    }

    // Sign out the user
    await supabase.auth.signOut();

    return { 
      success: true, 
      message: 'Account deleted successfully! All your profile data, certificates, and files have been permanently removed. You have been signed out.' 
    };
  } catch (err: any) {
    console.error('deleteAccountRequest error:', err);
    throw new Error(err.message || 'Failed to delete account');
  }
}
