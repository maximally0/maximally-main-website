import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle OAuth errors and user redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthError = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (oauthError) {
      console.error('❌ OAuth error:', {
        error: oauthError,
        description: errorDescription,
        code: urlParams.get('error_code')
      });
      
      // Clear the error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Clear any corrupted OAuth state
      if (supabase) {
        supabase.auth.signOut().catch(() => {});
      }
      
      // Clear browser storage to reset OAuth state
      try {
        localStorage.removeItem('maximally-supabase-auth');
        sessionStorage.clear();
      } catch (e) {}
      
      setError('OAuth authentication failed. Please try again.');
      return;
    }
    
    // Check for profile constraint errors and handle them
    if (window.location.pathname === '/login' && !oauthError && !user) {
      const currentError = localStorage.getItem('oauth_profile_error');
      if (currentError) {
        localStorage.removeItem('oauth_profile_error');
        setError('Profile creation failed. Please try signing in again.');
        if (supabase) {
          supabase.auth.signOut().catch(() => {});
        }
      }
    }
    
    if (user) {
      console.log('✅ User authenticated, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [user, navigate, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (isSignUp) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        setLoading(false);
        return;
      }
      if (name.trim().length < 2) {
        setError('Name must be at least 2 characters long');
        setLoading(false);
        return;
      }
      if (username.trim().length < 3) {
        setError('Username must be at least 3 characters long');
        setLoading(false);
        return;
      }
    }

    try {
      if (isSignUp) {
        console.log('Attempting to sign up user...');
        const result = await signUp(email, password, name.trim(), username.trim());
        if (result.error) {
          setError(result.error.message);
          setLoading(false);
          return;
        }
        console.log('Sign up successful');
        // Redirect to home page after successful signup
        navigate('/');
      } else {
        console.log('Attempting to sign in user...');
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error.message);
          setLoading(false);
          return;
        }
        console.log('Sign in successful');
        // Redirect to home page after successful signin
        navigate('/');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!supabase) return;
    try {
      // Clear any existing OAuth state to prevent conflicts
      await supabase.auth.signOut();
      
      // Small delay to ensure cleanup is complete
      setTimeout(async () => {
        if (!supabase) {
          setError('Authentication service not available');
          return;
        }
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) {
          console.error('Google OAuth error:', error);
          setError('Google sign-in failed: ' + error.message);
        }
      }, 100);
    } catch (err) {
      console.error('Google sign-in error', err);
      setError('Google sign-in failed');
    }
  };

  const handleGithubSignIn = async () => {
    if (!supabase) return;
    try {
      // Clear any existing OAuth state to prevent conflicts
      await supabase.auth.signOut();
      
      // Small delay to ensure cleanup is complete
      setTimeout(async () => {
        if (!supabase) {
          setError('Authentication service not available');
          return;
        }
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) {
          console.error('GitHub OAuth error:', error);
          setError('GitHub sign-in failed: ' + error.message);
        }
      }, 100);
    } catch (err) {
      console.error('GitHub sign-in error', err);
      setError('GitHub sign-in failed');
    }
  };

  return (
    <>
      <Helmet>
        <title>{isSignUp ? 'Sign Up' : 'Login'} - Maximally</title>
        <meta
          name="description"
          content="Join Maximally - India's premier skill development platform for teenagers."
        />
      </Helmet>

      <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center p-4 pt-24">
        <div className="starfield" />
        <div className="absolute inset-0 bg-grid-white opacity-20" />

        <Card className="w-full max-w-md bg-black/90 dark:bg-black/90 border-maximally-red/30 dark:border-maximally-red/30 backdrop-blur-sm relative z-10" data-testid="card-auth">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center text-maximally-red dark:text-maximally-red">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-center text-gray-400 dark:text-gray-400">
              {isSignUp
                ? 'Sign up to join the Maximally community'
                : 'Sign in to continue to Maximally'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="text-red-400 text-sm" role="alert" data-testid="auth-error">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200 dark:text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/50 dark:bg-black/50 border-gray-700 dark:border-gray-700 text-white dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:border-maximally-red dark:focus:border-maximally-red"
                  required
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200 dark:text-gray-200">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/50 dark:bg-black/50 border-gray-700 dark:border-gray-700 text-white dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:border-maximally-red dark:focus:border-maximally-red"
                  required
                  data-testid="input-password"
                />
              </div>

              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-200 dark:text-gray-200">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-black/50 dark:bg-black/50 border-gray-700 dark:border-gray-700 text-white dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:border-maximally-red dark:focus:border-maximally-red"
                      required
                      data-testid="input-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-200 dark:text-gray-200">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="choose-a-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-black/50 dark:bg-black/50 border-gray-700 dark:border-gray-700 text-white dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:border-maximally-red dark:focus:border-maximally-red"
                      required
                      data-testid="input-username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-200 dark:text-gray-200">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-black/50 dark:bg-black/50 border-gray-700 dark:border-gray-700 text-white dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:border-maximally-red dark:focus:border-maximally-red"
                      required
                      data-testid="input-confirm-password"
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-maximally-red dark:bg-maximally-red hover:bg-maximally-red/90 dark:hover:bg-maximally-red/90 text-white dark:text-white font-semibold"
                data-testid="button-submit"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-gray-700 dark:bg-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black dark:bg-black px-2 text-gray-400 dark:text-gray-400">
                  Or sign in with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full bg-white dark:bg-white hover:bg-gray-100 dark:hover:bg-gray-100 text-black dark:text-black border-gray-300 dark:border-gray-300"
                onClick={handleGoogleSignIn}
                data-testid="button-google-signin"
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Google
              </Button>

              <Button
                variant="outline"
                className="w-full bg-white dark:bg-white hover:bg-gray-100 dark:hover:bg-gray-100 text-black dark:text-black border-gray-300 dark:border-gray-300"
                onClick={handleGithubSignIn}
                data-testid="button-github-signin"
              >
                <FaGithub className="mr-2 h-5 w-5" />
                GitHub
              </Button>
            </div>

            <div className="text-center text-sm">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-gray-400 dark:text-gray-400 hover:text-maximally-red dark:hover:text-maximally-red transition-colors"
                data-testid="button-toggle-mode"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
