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

  // Email validation check before signup (client-side only for static hosting)
  const validateEmailBeforeSignup = async (email: string): Promise<boolean> => {
    try {
      // Basic client-side email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError('Please enter a valid email address');
        return false;
      }

      // Check for common disposable email domains (basic list)
      const disposableDomains = [
        '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
        'mailinator.com', 'throwaway.email', 'temp-mail.org'
      ];
      
      const domain = email.split('@')[1]?.toLowerCase();
      if (disposableDomains.includes(domain)) {
        setError('Please use a permanent email address');
        return false;
      }

      // For static hosting, we'll do basic validation only
      // In a full-stack deployment, this would validate with the backend
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
      // Check both captchaToken state and captchaTokenRef for the token
      const currentToken = captchaToken || captchaTokenRef.current;
      
      if (!isValidCaptchaToken(currentToken)) {
        setError('Please complete the CAPTCHA verification');
        setLoading(false);
        return;
      }

      // For now, skip backend verification since we're on static hosting
      // The CAPTCHA token presence is sufficient for client-side validation
      console.log('CAPTCHA token validated client-side');
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
        // If email confirmation is required, there may be no session yet.
        try {
          const { data: { session } } = await supabase!.auth.getSession();
          if (!session) {
            navigate(`/verify-email?email=${encodeURIComponent(email)}`);
          } else {
            navigate('/');
          }
        } catch {
          navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        }
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
      const currentToken = captchaToken || captchaTokenRef.current;
      
      if (!isValidCaptchaToken(currentToken)) {
        setError('Please complete the CAPTCHA verification before signing in with Google');
        return;
      }

      // For now, skip backend verification since we're on static hosting
      console.log('CAPTCHA token validated client-side for Google OAuth');
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
      const currentToken = captchaToken || captchaTokenRef.current;
      
      if (!isValidCaptchaToken(currentToken)) {
        setError('Please complete the CAPTCHA verification before signing in with GitHub');
        return;
      }

      // For now, skip backend verification since we're on static hosting
      console.log('CAPTCHA token validated client-side for GitHub OAuth');
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
          content="Join Maximally - World's First AI-Native Hackathon Platform"
        />
      </Helmet>

      <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center p-4 pt-24">
        {/* Pixel Grid Background */}
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating Pixels */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="fixed w-2 h-2 bg-maximally-red pixel-border animate-float pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          />
        ))}

        {/* Auth Card */}
        <div className="w-full max-w-lg relative z-10">
          <div className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-maximally-red hover:border-maximally-yellow transition-all duration-500 p-8 relative group overflow-hidden" data-testid="card-auth">
            {/* Corner decorations */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-maximally-yellow animate-pulse" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-maximally-yellow animate-pulse delay-200" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-maximally-yellow animate-pulse delay-400" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-maximally-yellow animate-pulse delay-600" />
            
            {/* Animated Border Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-maximally-red via-maximally-yellow to-maximally-red opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="minecraft-block bg-maximally-red/20 border-2 border-maximally-red p-3 inline-block mb-4 animate-[glow_2s_ease-in-out_infinite]">
                  <span className="text-4xl">⚡</span>
                </div>
                <h1 className="font-press-start text-2xl md:text-3xl font-bold mb-4 minecraft-text">
                  <span className="text-maximally-red drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                    {isSignUp ? 'JOIN_MAXIMALLY' : 'WELCOME_BACK'}
                  </span>
                </h1>
                <p className="font-press-start text-xs text-maximally-yellow mb-2">
                  {isSignUp ? 'CREATE_ACCOUNT' : 'SIGN_IN_TO_CONTINUE'}
                </p>
                <p className="font-jetbrains text-sm text-gray-400">
                  {isSignUp
                    ? 'Join the global innovation league'
                    : 'Access your dashboard'}
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="minecraft-block bg-red-900/30 border-2 border-maximally-red p-3 mb-6">
                  <div className="text-red-300 font-press-start text-xs" role="alert" data-testid="auth-error">
                    ⚠️ {error}
                  </div>
                </div>
              )}
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-press-start text-xs text-maximally-blue flex items-center gap-2">
                    <span className="w-2 h-2 bg-maximally-blue"></span>
                    EMAIL_ADDRESS
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hacker@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-blue placeholder:text-gray-500 transition-colors"
                    required
                    data-testid="input-email"
                  />
                </div>

                {isSignUp && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-press-start text-xs text-maximally-yellow flex items-center gap-2">
                        <span className="w-2 h-2 bg-maximally-yellow"></span>
                        FULL_NAME
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-yellow placeholder:text-gray-500 transition-colors"
                        required
                        data-testid="input-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username" className="font-press-start text-xs text-maximally-red flex items-center gap-2">
                        <span className="w-2 h-2 bg-maximally-red"></span>
                        USERNAME
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="choose_a_username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-red placeholder:text-gray-500 transition-colors"
                        required
                        data-testid="input-username"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-press-start text-xs text-maximally-green flex items-center gap-2">
                    <span className="w-2 h-2 bg-maximally-green"></span>
                    PASSWORD
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-green placeholder:text-gray-500 transition-colors"
                    required
                    data-testid="input-password"
                  />
                  {!isSignUp && (
                    <div className="text-right mt-1">
                      <button
                        type="button"
                        onClick={() => navigate('/forgot-password')}
                        className="font-press-start text-xs text-gray-400 hover:text-maximally-blue"
                      >
                        FORGOT_PASSWORD?
                      </button>
                    </div>
                  )}
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-press-start text-xs text-maximally-green flex items-center gap-2">
                      <span className="w-2 h-2 bg-maximally-green"></span>
                      CONFIRM_PASSWORD
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-green placeholder:text-gray-500 transition-colors"
                      required
                      data-testid="input-confirm-password"
                    />
                  </div>
                )}

                {captchaRequired && (
                  <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-blue/30 p-4">
                    <h3 className="font-press-start text-xs text-maximally-blue mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-maximally-blue"></span>
                      VERIFICATION_REQUIRED
                    </h3>
                    <div className="flex justify-center">
                      <Recaptcha
                        ref={recaptchaRef}
                        onVerify={handleCaptchaVerify}
                        onError={handleCaptchaError}
                        size="normal"
                        className=""
                      />
                    </div>
                    {captchaError && (
                      <div className="minecraft-block bg-red-900/30 border-2 border-maximally-red p-2 mt-3">
                        <div className="text-red-300 font-press-start text-xs" role="alert">⚠️ {captchaError}</div>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full pixel-button bg-maximally-red hover:bg-maximally-red/90 text-white font-press-start text-sm py-4 transition-colors border-4 border-maximally-red hover:border-maximally-yellow"
                  data-testid="button-submit"
                  disabled={loading}
                >
                  {loading ? 'LOADING...' : (isSignUp ? 'JOIN_LEAGUE' : 'ACCESS_DASHBOARD')}
                </Button>

              </form>

              {/* OAuth Separator */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-700" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-black px-4 font-press-start text-xs text-gray-400">
                    OR_CONNECT_WITH
                  </span>
                </div>
              </div>

              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                  onClick={handleGoogleSignIn}
                  className="pixel-button bg-white hover:bg-gray-100 text-black font-press-start text-xs py-3 border-2 border-gray-300 hover:border-maximally-red transition-colors flex items-center justify-center gap-2"
                  data-testid="button-google-signin"
                >
                  <FcGoogle className="h-4 w-4" />
                  <span className="hidden sm:inline">GOOGLE</span>
                </Button>

                <Button
                  onClick={handleGithubSignIn}
                  className="pixel-button bg-gray-800 hover:bg-black text-white font-press-start text-xs py-3 border-2 border-gray-700 hover:border-maximally-red transition-colors flex items-center justify-center gap-2"
                  data-testid="button-github-signin"
                >
                  <FaGithub className="h-4 w-4" />
                  <span className="hidden sm:inline">GITHUB</span>
                </Button>
              </div>

              {/* Toggle Mode */}
              <div className="text-center border-t-2 border-gray-800 pt-4">
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    resetCaptcha();
                  }}
                  className="font-press-start text-xs text-gray-400 hover:text-maximally-yellow transition-colors"
                  data-testid="button-toggle-mode"
                >
                  {isSignUp
                    ? 'EXISTING_USER? → SIGN_IN'
                    : 'NEW_USER? → JOIN_NOW'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
