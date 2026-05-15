import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, ensureUserProfile } from '@/lib/supabaseClient';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setMessage('Processing OAuth callback...');
        
        // Handle OAuth callback with Supabase client
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('OAuth callback error:', error);
          setStatus('error');
          setMessage('Authentication failed: ' + error.message);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!data.session) {
          console.error('No session found after OAuth callback');
          setStatus('error');
          setMessage('No session found. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        console.log('OAuth callback - Session found:', data.session.user.id);
        
        // Store session in localStorage for consistency with other auth flows
        localStorage.setItem('sb-session', JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          token_type: data.session.token_type,
          expires_in: data.session.expires_in,
          expires_at: data.session.expires_at
        }));

        setMessage('Setting up your profile...');
        
        // Ensure profile exists for OAuth user
        const createdProfile = await ensureUserProfile({
          id: data.session.user.id,
          email: data.session.user.email || '',
          name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name,
          image: data.session.user.user_metadata?.avatar_url || data.session.user.user_metadata?.picture,
          user_metadata: data.session.user.user_metadata || {},
          app_metadata: data.session.user.app_metadata || {},
          aud: data.session.user.aud || 'authenticated',
        });
        
        if (!createdProfile) {
          console.error('Failed to create profile for OAuth user');
          setStatus('error');
          setMessage('Failed to set up your profile. Please contact support.');
          return;
        }
        
        console.log('Profile created/verified successfully:', createdProfile.id);

        setStatus('success');
        setMessage('Welcome! Redirecting to dashboard...');
        
        // Get redirect URL from query params or default to home
        const redirectTo = searchParams.get('redirect') || '/';
        
        // Force a page reload to ensure AuthContext picks up the new session
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 2000);
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          {status === 'loading' && (
            <Loader2 className="h-12 w-12 text-orange-400 animate-spin mx-auto" />
          )}
          {status === 'success' && (
            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto" />
          )}
          {status === 'error' && (
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
          )}
        </div>
        
        <h1 className="font-space font-bold text-xl mb-4">
          {status === 'loading' && 'Setting up your account...'}
          {status === 'success' && 'Welcome to Maximally!'}
          {status === 'error' && 'Authentication Error'}
        </h1>
        
        <p className="font-space text-gray-400 text-sm">
          {message}
        </p>
        
        {status === 'loading' && (
          <div className="mt-6">
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-orange-500 h-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;