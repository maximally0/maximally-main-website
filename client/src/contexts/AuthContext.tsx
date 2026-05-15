import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  getUser, 
  getSession, 
  signInWithEmailPassword, 
  signUp as supabaseSignUp, 
  signInWithGoogle, 
  signInWithGitHub, 
  signOut as supabaseSignOut,
  getCurrentUserWithProfile,
  getUserModerationStatus,
  isUserBanned,
  isUserMuted,
  type User,
  type Session,
  type Profile,
  type ModerationStatus,
  type SignUpPayload
} from '@/lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  moderationStatus: ModerationStatus | null;
  isBanned: boolean;
  isMuted: boolean;
  isSuspended: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, name: string, username: string) => Promise<{ error?: any }>;
  signInWithGoogle: () => Promise<{ error?: any }>;
  signUpWithGoogle: () => Promise<{ error?: any }>;
  signInWithGitHub: () => Promise<{ error?: any }>;
  signUpWithGitHub: () => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshModerationStatus: () => Promise<void>;
}

// Types imported from supabaseClient
export type { User, Session, Profile, ModerationStatus } from '@/lib/supabaseClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [moderationStatus, setModerationStatus] = useState<ModerationStatus | null>(null);

  const isBanned = moderationStatus?.is_banned ?? false;
  const isMuted = moderationStatus?.is_muted ?? false;
  const isSuspended = moderationStatus?.is_suspended ?? false;

  // Load user session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        setLoading(true);
        
        // Get current user and profile using supabaseClient
        const result = await getCurrentUserWithProfile();
        
        if (!result) {
          setLoading(false);
          return;
        }

        setUser(result.user);
        setProfile(result.profile);
        
        // Get session
        const session = await getSession();
        setSession(session);

        // Load moderation status
        if (result.user?.id) {
          try {
            const moderationStatus = await getUserModerationStatus(result.user.id);
            setModerationStatus(moderationStatus);
          } catch (moderationError) {
            console.error('Failed to load moderation status:', moderationError);
          }
        }
        
      } catch (error) {
        console.error('[AuthContext] Error initializing session:', error);
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, []);

  const refreshModerationStatus = async () => {
    if (!user) return;
    try {
      const moderationStatus = await getUserModerationStatus(user.id);
      setModerationStatus(moderationStatus);
    } catch (error) {
      console.error('Failed to refresh moderation status:', error);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const result = await getCurrentUserWithProfile();
      if (result) {
        setUser(result.user);
        setProfile(result.profile);
      }
      await refreshModerationStatus();
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const user = await signInWithEmailPassword(email, password);
      
      // Get updated profile
      const result = await getCurrentUserWithProfile();
      if (result) {
        setUser(result.user);
        setProfile(result.profile);
        
        // Get session
        const session = await getSession();
        setSession(session);
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Sign in failed' } };
    } finally {
      setTimeout(() => setLoading(false), 100);
    }
  };

  const signUpHandler = async (email: string, password: string, name: string, username: string) => {
    try {
      setLoading(true);
      const payload: SignUpPayload = { email, password, name, username };
      const user = await supabaseSignUp(payload);
      
      if (user) {
        // Get updated profile
        const result = await getCurrentUserWithProfile();
        if (result) {
          setUser(result.user);
          setProfile(result.profile);
        }
        return { error: null };
      }
      
      return { error: { message: 'Sign up failed' } };
    } catch (error: any) {
      return { error: { message: error.message || 'Sign up failed' } };
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await supabaseSignOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      setModerationStatus(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      setUser(null);
      setProfile(null);
      setSession(null);
      setModerationStatus(null);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user, profile, session, loading, moderationStatus,
    isBanned, isMuted, isSuspended,
    signIn,
    signUp: signUpHandler,
    signInWithGoogle: async () => { 
      try { 
        await signInWithGoogle(); 
        return { error: null }; 
      } catch (e: any) { 
        return { error: e }; 
      } 
    },
    signUpWithGoogle: async () => { 
      try { 
        await signInWithGoogle(); 
        return { error: null }; 
      } catch (e: any) { 
        return { error: e }; 
      } 
    },
    signInWithGitHub: async () => { 
      try { 
        await signInWithGitHub(); 
        return { error: null }; 
      } catch (e: any) { 
        return { error: e }; 
      } 
    },
    signUpWithGitHub: async () => { 
      try { 
        await signInWithGitHub(); 
        return { error: null }; 
      } catch (e: any) { 
        return { error: e }; 
      } 
    },
    signOut: handleSignOut,
    refreshProfile,
    refreshModerationStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}