import { useState, useEffect, useRef } from 'react';
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
import Recaptcha, { RecaptchaRef } from '@/components/ui/recaptcha';
import { verifyCaptcha, isCaptchaRequired, isValidCaptchaToken } from '@/lib/captcha';

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
  
  // CAPTCHA state
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [captchaLoaded, setCaptchaLoaded] = useState(false);
  const captchaRequired = isCaptchaRequired();
  const recaptchaRef = useRef<RecaptchaRef | null>(null);
  const captchaTokenRef = useRef<string | null>(null);
  
  // Removed development-only CAPTCHA debug logging

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
      // User authenticated, redirecting to home
      navigate('/', { replace: true });
    }
  }, [user, navigate, supabase]);

  // CAPTCHA handlers
  const handleCaptchaVerify = (token: string | null) => {
    setCaptchaToken(token);
    captchaTokenRef.current = token;
    setCaptchaError(null);
    setCaptchaLoaded(true);
  };

  const handleCaptchaError = () => {
    setCaptchaToken(null);
    setCaptchaError('CAPTCHA verification failed. Please refresh and try again.');
    setCaptchaLoaded(false);
    captchaTokenRef.current = null;
  };

  const resetCaptcha = () => {
    setCaptchaToken(null);
    setCaptchaError(null);
    setCaptchaLoaded(false);
    captchaTokenRef.current = null;
  };

  // Email validation check before signup
  const validateEmailBeforeSignup = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/validate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        return false;
      }
      
      const validation = data.validation;
      
      // Check if email is valid (not disposable, has MX record, etc.)
      if (!validation.isValid) {
        setError(validation.issues?.[0] || 'Email validation failed');
        return false;
      }
      
      return true;
    } catch (err: any) {
      console.error('Email validation error:', err);
      setError('Unable to validate email. Please try again.');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCaptchaError(null);
    setLoading(true);

    // Check CAPTCHA if required
    if (captchaRequired) {
      // If no token yet, show immediate error and then attempt programmatic execution
      if (!isValidCaptchaToken(captchaTokenRef.current)) {
        // Show immediate error so user sees feedback right away
        setError('Please complete the CAPTCHA verification');
        setLoading(false);

        // Still attempt to programmatically execute the invisible widget for convenience
        try {
          recaptchaRef.current?.execute();
        } catch (err) {
          console.warn('Recaptcha execute failed (maybe non-invisible widget):', err);
        }

        return;
      }

  // Verify CAPTCHA with backend before proceeding with authentication
      const captchaResult = await verifyCaptcha(captchaTokenRef.current as string);
      
      if (!captchaResult.success) {
        setError(captchaResult.message || 'CAPTCHA verification failed');
        resetCaptcha();
        setLoading(false);
        return;
      }
      // CAPTCHA verification successful
    }

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
  // Attempting to sign up user with email validation
        
        // First, validate the email
        const emailIsValid = await validateEmailBeforeSignup(email);
        if (!emailIsValid) {
          setLoading(false);
          return;
        }
        
  // Email validation passed, proceeding with signup
        
        // Use the original signup method (which works correctly for username storage)
        const result = await signUp(email, password, name.trim(), username.trim());
        if (result.error) {
          setError(result.error.message);
          setLoading(false);
          return;
        }
  // Sign up successful
        // Redirect to home page after successful signup
        navigate('/');
      } else {
  // Attempting to sign in user
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error.message);
          resetCaptcha(); // Reset CAPTCHA on authentication error
          setLoading(false);
          return;
        }
  // Sign in successful
        // Redirect to home page after successful signin
        navigate('/');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'An unexpected error occurred');
      resetCaptcha(); // Reset CAPTCHA on any error
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!supabase) return;
    
    // Check CAPTCHA if required
    if (captchaRequired) {
      if (!isValidCaptchaToken(captchaToken)) {
        setError('Please complete the CAPTCHA verification before signing in with Google');
        return;
      }

      // Verify CAPTCHA with backend
      const captchaResult = await verifyCaptcha(captchaToken);
      if (!captchaResult.success) {
        setError(captchaResult.message || 'CAPTCHA verification failed');
        resetCaptcha();
        return;
      }
    }
    
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
    
    // Check CAPTCHA if required
    if (captchaRequired) {
      if (!isValidCaptchaToken(captchaToken)) {
        setError('Please complete the CAPTCHA verification before signing in with GitHub');
        return;
      }

      // Verify CAPTCHA with backend
      const captchaResult = await verifyCaptcha(captchaToken);
      if (!captchaResult.success) {
        setError(captchaResult.message || 'CAPTCHA verification failed');
        resetCaptcha();
        return;
      }
    }
    
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
        <div className="" />
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

              {captchaRequired && (
                <div className="space-y-2">
                  <div className="flex justify-center ml-2">
                    <Recaptcha
                      ref={recaptchaRef}
                      onVerify={handleCaptchaVerify}
                      onError={handleCaptchaError}
                      size="normal"
                      className=""
                    />
                  </div>
                  {captchaError && (
                    <div className="text-red-400 text-sm" role="alert">{captchaError}</div>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-maximally-red dark:bg-maximally-red hover:bg-maximally-red/90 dark:hover:bg-maximally-red/90 text-white dark:text-white font-semibold"
                data-testid="button-submit"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </Button>

              {/* Debug button removed - removed in favor of production UX */}
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
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  resetCaptcha(); // Reset CAPTCHA when switching modes
                }}
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
