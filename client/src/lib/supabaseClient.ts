/**
 * Supabase client — powered by @supabase/supabase-js
 * All auth operations go through the /api/auth/* proxy endpoints.
 * The browser NEVER calls Supabase directly (ISP blocking in India).
 */
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { USE_API } from './featureFlags';
import { apiClient } from './apiClient';

// ─── Supabase client (anon key only — used to read JWT structure, never for DB queries) ─
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? '',
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  {
    auth: {
      storage: localStorage,
      storageKey: 'sb-session',
      autoRefreshToken: false,
    },
  }
);

export const supabasePublic = supabase;

// ─── Session storage key ──────────────────────────────────────────────────────
const SESSION_KEY = 'sb-session';

// ─── 401 handler ─────────────────────────────────────────────────────────────
export function handle401(): void {
  localStorage.removeItem(SESSION_KEY);
  const onLoginPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/auth');
  if (!onLoginPage) {
    toast.error('Your session has expired. Please sign in again.');
    window.location.href = '/login';
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type User = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  identities?: any[];
  user_metadata?: any;
  app_metadata?: any;
  aud?: string;
};

export type Session = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: number;
};

export type Profile = {
  id: string;
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
  role: 'user' | 'admin' | 'organizer' | 'mentor' | 'judge';
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
  email?: string | null;
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

// ─── Session helpers ──────────────────────────────────────────────────────────
export function getStoredSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  return getStoredSession();
}

export async function getUser(): Promise<User | null> {
  const session = getStoredSession();
  if (!session?.access_token) return null;
  try {
    // Decode the JWT payload to get user info without a network call
    const parts = session.access_token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return {
      id: payload.sub,
      email: payload.email ?? '',
      user_metadata: payload.user_metadata ?? {},
      app_metadata: payload.app_metadata ?? {},
      aud: payload.aud ?? 'authenticated',
    };
  } catch {
    return null;
  }
}

// ─── Auth actions (all go through /api/auth/* proxy) ─────────────────────────

export async function signInWithEmailPassword(email: string, password: string): Promise<User> {
  const res = await fetch('/api/auth/sign-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  // 401 from sign-in means wrong credentials, NOT expired session — don't call handle401
  if (!res.ok || !json.success) throw new Error(json.message ?? 'Invalid email or password');
  localStorage.setItem(SESSION_KEY, JSON.stringify(json.session));
  return json.user as User;
}

export async function signUp(payload: SignUpPayload): Promise<User> {
  const res = await fetch('/api/auth/sign-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message ?? 'Sign-up failed');
  return json.user as User;
}

// Alias kept for backward compatibility
export async function signUpWithEmailPassword(payload: SignUpPayload): Promise<User | null> {
  return signUp(payload);
}

export async function signOut(): Promise<void> {
  const session = getStoredSession();
  try {
    if (session?.access_token) {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      });
    }
  } catch {
    // Best-effort — always clear local session
  } finally {
    localStorage.removeItem(SESSION_KEY);
  }
}

/** Refresh this many seconds before access token expiry (JWT skew / clock drift). */
const ACCESS_TOKEN_REFRESH_SKEW_SEC = 120;

function getAccessTokenExpiryUnix(session: Session): number | null {
  if (session.expires_at != null && typeof session.expires_at === 'number') {
    return session.expires_at;
  }
  try {
    const parts = session.access_token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1])) as { exp?: number };
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

function isAccessTokenNearExpiry(session: Session, skewSec: number = ACCESS_TOKEN_REFRESH_SKEW_SEC): boolean {
  const exp = getAccessTokenExpiryUnix(session);
  if (exp == null) return false;
  const now = Math.floor(Date.now() / 1000);
  return now >= exp - skewSec;
}

export async function refreshSession(): Promise<Session | null> {
  const session = getStoredSession();
  if (!session?.refresh_token) return null;
  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    if (res.status === 401 || res.status === 400) {
      // Stale refresh token — clear silently, don't redirect
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    const json = await res.json();
    if (!json.success) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(json.session));
    return json.session as Session;
  } catch {
    return null;
  }
}

/**
 * Returns the stored session, refreshing via /api/auth/refresh when the access token is expired or near expiry.
 * The browser client uses autoRefreshToken: false (sessions are proxied); without this, API routes that call
 * supabase.auth.getUser(jwt) return "Invalid token" while the UI still appears signed in.
 */
export async function ensureSessionFresh(): Promise<Session | null> {
  const session = getStoredSession();
  if (!session?.access_token) return null;
  if (!isAccessTokenNearExpiry(session)) return session;
  if (!session.refresh_token) return null;
  return refreshSession();
}

export async function requestPasswordReset(email: string, redirectTo?: string): Promise<{ success: boolean; error?: string }> {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, redirectTo }),
  });
  const json = await res.json();
  if (!json.success) return { success: false, error: json.message };
  return { success: true };
}

export async function completePasswordReset(newPassword: string): Promise<{ success: boolean; error?: string }> {
  const session = getStoredSession();
  const res = await fetch('/api/auth/reset-password-confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify({ newPassword }),
  });
  const json = await res.json();
  if (!json.success) return { success: false, error: json.message };
  return { success: true };
}

export async function changePassword(_currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  return completePasswordReset(newPassword);
}

export async function setPasswordForOAuthUser(newPassword: string): Promise<{ success: boolean; error?: string }> {
  return completePasswordReset(newPassword);
}

export async function checkIfUserHasPassword(): Promise<boolean> {
  const session = getStoredSession();
  return !!session?.access_token;
}

export async function verifyEmailOtp(_email: string, _token: string): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

export async function resendEmailOtp(_email: string): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

// ─── OAuth stubs (social sign-in uses client-side PKCE flow) ─────
export async function signInWithGoogle() {
  // Use client-side OAuth with PKCE flow
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });
  
  if (error) {
    throw new Error(error.message);
  }
}

export async function signUpWithGoogle() { 
  return signInWithGoogle(); 
}

export async function signInWithGitHub() {
  // Use client-side OAuth with PKCE flow
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    }
  });
  
  if (error) {
    throw new Error(error.message);
  }
}

export async function signUpWithGitHub() { 
  return signInWithGitHub(); 
}

// ─── Profile helpers ──────────────────────────────────────────────────────────
export async function getProfile(userId: string): Promise<Profile | null> {
  if (USE_API) {
    try {
      const result = await apiClient.getUserProfile(userId);
      return result.data.profile;
    } catch { return null; }
  }
  try {
    // Use Supabase directly instead of proxy endpoint
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !data) return null;
    return data as Profile;
  } catch { return null; }
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  if (USE_API) {
    try {
      const result = await apiClient.getUserProfile(undefined, username);
      return result.data.profile;
    } catch { return null; }
  }
  try {
    // Use Supabase directly instead of proxy endpoint
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) return null;
    return data as Profile;
  } catch { return null; }
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  if (!username || username.length < 3) return false;
  try {
    const res = await fetch(`/api/profile?username=${username}`);
    const json = await res.json();
    return !json.data?.profile;
  } catch { return false; }
}

export async function updateProfileMe(patch: UpdatableProfileFields) {
  const session = getStoredSession();
  if (!session) throw new Error('Not authenticated');
  
  const user = await getUser();
  if (!user) throw new Error('Not authenticated');
  
  // Use Supabase directly instead of proxy endpoint
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return data as Profile;
}

export async function updateUsername(newUsername: string): Promise<{ success: boolean; error?: string }> {
  const session = getStoredSession();
  if (!session) return { success: false, error: 'Not authenticated' };
  
  const user = await getUser();
  if (!user) return { success: false, error: 'Not authenticated' };
  
  try {
    // Use Supabase directly instead of proxy endpoint
    const { error } = await supabase
      .from('profiles')
      .update({
        username: newUsername,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Update failed' };
  }
}

export async function ensureUserProfile(user: User): Promise<Profile | null> {
  const existing = await getProfile(user.id);
  if (existing) return existing;

  try {
    const session = getStoredSession();
    if (!session) {
      console.error('No active session - cannot ensure profile');
      return null;
    }

    const profileData = {
      id: user.id,
      email: user.email,
      full_name: user.name || user.user_metadata?.full_name || user.email?.split('@')[0] || null,
      username: user.user_metadata?.username || user.app_metadata?.username || null,
      avatar_url: user.image || null,
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Use Supabase directly instead of proxy endpoint
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    return data as Profile;
  } catch (error) {
    console.error('Error creating profile:', error);
    return null;
  }
}

export async function generateUniqueUsername(base: string): Promise<string> {
  let username = base.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'user';
  if (username.length < 3) username = 'user' + username;
  let attempts = 0;
  while (attempts < 10) {
    if (await isUsernameAvailable(username)) return username;
    username = base.slice(0, 16) + Math.random().toString(36).slice(2, 4);
    attempts++;
  }
  return base.slice(0, 16) + Date.now().toString().slice(-4);
}

export async function getCurrentUserWithProfile(): Promise<{ user: User; profile: Profile } | null> {
  const user = await getUser();
  if (!user) return null;
  if (USE_API) {
    try {
      const result = await apiClient.getUserProfile(user.id);
      const profile = result.data;
      if (!profile) {
        const created = await ensureUserProfile(user);
        if (!created) return null;
        return { user, profile: created };
      }
      return { user, profile };
    } catch { return null; }
  }
  const profile = await getProfile(user.id);
  if (!profile) {
    const created = await ensureUserProfile(user);
    if (!created) return null;
    return { user, profile: created };
  }
  return { user, profile };
}

export async function getUserModerationStatus(userId: string): Promise<ModerationStatus | null> {
  try {
    const res = await fetch(`/api/moderation/status/${userId}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch { return null; }
}

export async function isUserBanned(userId: string): Promise<{ banned: boolean; reason?: string; expiresAt?: string }> {
  const status = await getUserModerationStatus(userId);
  if (!status?.is_banned) return { banned: false };
  if (status.ban_expires_at && new Date(status.ban_expires_at) < new Date()) return { banned: false };
  return { banned: true, reason: status.ban_reason ?? undefined, expiresAt: status.ban_expires_at ?? undefined };
}

export async function isUserMuted(userId: string): Promise<{ muted: boolean; reason?: string; expiresAt?: string }> {
  const status = await getUserModerationStatus(userId);
  if (!status?.is_muted) return { muted: false };
  if (status.mute_expires_at && new Date(status.mute_expires_at) < new Date()) return { muted: false };
  return { muted: true, reason: status.mute_reason ?? undefined, expiresAt: status.mute_expires_at ?? undefined };
}

// ─── Image upload helpers (route through API) ─────────────────────────────────
export async function uploadHackathonImage(file: File, hackathonId: string | number): Promise<string | null> {
  try {
    const session = getStoredSession();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('hackathonId', String(hackathonId));
    const res = await fetch('/api/upload/hackathon-image', {
      method: 'POST',
      headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
      body: formData,
    });
    const json = await res.json();
    return json.url ?? null;
  } catch { return null; }
}

export async function deleteHackathonImage(urlOrId: string | number, _imageType?: string): Promise<void> {
  try {
    const session = getStoredSession();
    await fetch('/api/upload/hackathon-image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ url: urlOrId }),
    });
  } catch {}
}

// ─── Avatar helpers ───────────────────────────────────────────────────────────
export async function uploadAvatar(file: File): Promise<string> {
  const session = getStoredSession();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload/avatar', {
    method: 'POST',
    headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error('Avatar upload failed');
  const json = await res.json();
  if (!json.url) throw new Error('No URL returned from avatar upload');
  return json.url as string;
}

export async function clearAvatar(): Promise<void> {
  const session = getStoredSession();
  const user = await getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: null, updated_at: new Date().toISOString() })
    .eq('id', user.id);
  if (error) throw new Error(error.message);
}

// ─── Account deletion helper ──────────────────────────────────────────────────
export async function deleteAccountRequest(): Promise<{ message: string }> {
  const session = getStoredSession();
  if (!session) throw new Error('Not authenticated');
  const res = await fetch('/api/users/account', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Account deletion failed');
  // Clear local session after deletion
  localStorage.removeItem('sb-session');
  return { message: json.message || 'Account deleted successfully' };
}
