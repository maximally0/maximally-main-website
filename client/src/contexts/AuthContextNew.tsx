/**
 * New AuthContext using Netlify Functions instead of direct Supabase
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

interface User {
  id: string;
  email: string;
  user_metadata?: any;
  app_metadata?: any;
}

interface Session {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username?: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      // Check localStorage for session data
      const storedSession = localStorage.getItem('maximally_session');
      const storedUser = localStorage.getItem('maximally_user');
      const storedProfile = localStorage.getItem('maximally_profile');
      
      if (storedSession && storedUser) {
        const sessionData = JSON.parse(storedSession);
        const userData = JSON.parse(storedUser);
        const profileData = storedProfile ? JSON.parse(storedProfile) : null;
        
        // Verify session is still valid (check expiry)
        if (sessionData.expires_at && new Date(sessionData.expires_at) > new Date()) {
          setSession(sessionData);
          setUser(userData);
          setProfile(profileData);
        } else {
          // Session expired, clear storage
          clearSession();
        }
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
      clearSession();
    } finally {
      setLoading(false);
    }
  };

  const clearSession = () => {
    localStorage.removeItem('maximally_session');
    localStorage.removeItem('maximally_user');
    localStorage.removeItem('maximally_profile');
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const result = await apiClient.login(email, password);
      
      if (result.success && result.data) {
        const { user: userData, session: sessionData, profile: profileData } = result.data;
        
        // Store session data
        localStorage.setItem('maximally_session', JSON.stringify(sessionData));
        localStorage.setItem('maximally_user', JSON.stringify(userData));
        if (profileData) {
          localStorage.setItem('maximally_profile', JSON.stringify(profileData));
        }
        
        setUser(userData);
        setSession(sessionData);
        setProfile(profileData);
        
        return { error: null };
      } else {
        return { error: { message: result.error || 'Login failed' } };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Login failed' 
        } 
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username?: string, fullName?: string) => {
    try {
      setLoading(true);
      
      const result = await apiClient.signup(email, password, username, fullName);
      
      if (result.success) {
        return { error: null };
      } else {
        return { error: { message: result.error || 'Signup failed' } };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Signup failed' 
        } 
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    clearSession();
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}