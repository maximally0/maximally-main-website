import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { 
  supabase, 
  signInWithEmailPassword, 
  signUpWithEmailPassword,
  signOut as supabaseSignOut,
  getCurrentUserWithProfile,
  type Profile,
  type SignUpPayload
} from '@/lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, name: string, username: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      if (user) {
        const result = await getCurrentUserWithProfile();
        if (result) {
          setProfile(result.profile);
        }
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    let timeoutId: NodeJS.Timeout;
    
    try {
      setLoading(true);
      console.log('🔑 Starting sign in for:', email);
      
      // Set a backup timeout to clear loading state
      timeoutId = setTimeout(() => {
        console.log('⏰ Sign in timeout - clearing loading state');
        setLoading(false);
      }, 3000); // 3 second max wait
      
      const user = await signInWithEmailPassword(email, password);
      
      console.log('✅ Sign in successful:', user?.email);
      // Clear the timeout since sign in was successful
      clearTimeout(timeoutId);
      
      // The auth state change listener will handle setting user/profile
      return { error: null };
    } catch (error: any) {
      console.error('❌ Sign in error:', error.message || error);
      if (timeoutId) clearTimeout(timeoutId);
      return { error };
    } finally {
      // Always ensure loading is cleared after a short delay
      setTimeout(() => {
        console.log('🔄 Final clearing of sign in loading state');
        setLoading(false);
      }, 100);
    }
  };

  const signUp = async (email: string, password: string, name: string, username: string) => {
    try {
      setLoading(true);
      console.log('📝 Starting sign up for:', email);
      
      const payload: SignUpPayload = { email, password, name, username };
      const user = await signUpWithEmailPassword(payload);
      
      console.log('✅ Sign up successful:', user?.email);
      // The auth state change listener will handle setting user/profile
      return { error: null };
    } catch (error: any) {
      console.error('❌ Sign up error:', error.message || error);
      return { error };
    } finally {
      // Add a shorter delay and ensure loading is always cleared
      setTimeout(() => {
        console.log('🔄 Clearing sign up loading state');
        setLoading(false);
      }, 300);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabaseSignOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase not initialized');
      setLoading(false);
      return;
    }

    // Fallback: If loading state persists for too long, clear it
    const loadingTimeout = setTimeout(() => {
      console.warn('⚠️ Auth loading state timeout - forcing clear');
      setLoading(false);
    }, 8000); // 8 seconds timeout

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase!.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else if (session) {
          setSession(session);
          setUser(session.user);
          
          // Get user profile
          const result = await getCurrentUserWithProfile();
          if (result) {
            setProfile(result.profile);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', {
        event, 
        userEmail: session?.user?.email || 'no user',
        hasSession: !!session
      });
      
      // Update session and user immediately
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        console.log('👤 Getting user profile for:', session.user.email);
        // Get user profile when signed in with timeout protection
        try {
          // Add timeout to prevent hanging
          const profilePromise = getCurrentUserWithProfile();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile loading timeout')), 5000)
          );
          
          const result = await Promise.race([profilePromise, timeoutPromise]);
          if (result) {
            setProfile(result.profile);
            console.log('✅ Profile loaded successfully:', result.profile.username || result.profile.email);
          } else {
            console.warn('⚠️ No profile found for user, this might indicate a database issue');
            // Set profile to null but don't block the auth flow
            setProfile(null);
          }
        } catch (error: any) {
          console.error('❌ Error getting profile after auth change:', error.message || error);
          // Don't block the auth flow even if profile loading fails
          setProfile(null);
        }
      } else {
        console.log('🚪 User signed out, clearing profile');
        setProfile(null);
      }

      // Always ensure loading is false after state change
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, [loading]);

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}