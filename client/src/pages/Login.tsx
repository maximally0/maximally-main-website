import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import Recaptcha, { RecaptchaRef } from '@/components/ui/recaptcha';
import { isCaptchaRequired, isValidCaptchaToken } from '@/lib/captcha';
import { Sparkles, Zap } from 'lucide-react';

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
  
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [captchaLoaded, setCaptchaLoaded] = useState(false);
  const captchaRequired = isCaptchaRequired();
  const recaptchaRef = useRef<RecaptchaRef | null>(null);
  const captchaTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthError = urlParams.get('error');
    
    if (oauthError) {
      window.history.replaceState({}, document.title, window.location.pathname);
      if (supabase) {
        supabase.auth.signOut().catch(() => {});
      }
      try {
        localStorage.removeItem('maximally-supabase-auth');
        sessionStorage.clear();
      } catch (e) {}
      setError('OAuth authentication failed. Please try again.');
      return;
    }
    
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
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

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

  const validateEmailBeforeSignup = async (email: string): Promise<boolean> => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError('Please enter a valid email address');
        return false;
      }
      const disposableDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com'];
      const domain = email.split('@')[1]?.toLowerCase();
      if (disposableDomains.includes(domain)) {
        setError('Please use a permanent email address');
        return false;
      }
      return true;
    } catch (err: any) {
      setError('Unable to validate email. Please try again.');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCaptchaError(null);
    setLoading(true);

    if (captchaRequired) {
      const currentToken = captchaToken || captchaTokenRef.current;
      if (!isValidCaptchaToken(currentToken)) {
        setError('Please complete the CAPTCHA verification');
        setLoading(false);
        return;
      }
    }

    if (isSignUp) {
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
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
        const emailIsValid = await validateEmailBeforeSignup(email);
        if (!emailIsValid) {
          setLoading(false);
          return;
        }
        const result = await signUp(email, password, name.trim(), username.trim());
        if (result.error) {
          setError(result.error.message);
          setLoading(false);
          return;
        }
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
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error.message);
          resetCaptcha();
          setLoading(false);
          return;
        }
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      resetCaptcha();
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!supabase) return;
    if (captchaRequired) {
      const currentToken = captchaToken || captchaTokenRef.current;
      if (!isValidCaptchaToken(currentToken)) {
        setError('Please complete the CAPTCHA verification before signing in with Google');
        return;
      }
    }
    try {
      await supabase.auth.signOut();
      setTimeout(async () => {
        if (!supabase) {
          setError('Authentication service not available');
          return;
        }
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin }
        });
        if (error) setError('Google sign-in failed: ' + error.message);
      }, 100);
    } catch (err) {
      setError('Google sign-in failed');
    }
  };

  const handleGithubSignIn = async () => {
    if (!supabase) return;
    if (captchaRequired) {
      const currentToken = captchaToken || captchaTokenRef.current;
      if (!isValidCaptchaToken(currentToken)) {
        setError('Please complete the CAPTCHA verification before signing in with GitHub');
        return;
      }
    }
    try {
      await supabase.auth.signOut();
      setTimeout(async () => {
        if (!supabase) {
          setError('Authentication service not available');
          return;
        }
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: { redirectTo: window.location.origin }
        });
        if (error) setError('GitHub sign-in failed: ' + error.message);
      }, 100);
    } catch (err) {
      setError('GitHub sign-in failed');
    }
  };

  return (
    <>
      <Helmet>
        <title>{isSignUp ? 'Sign Up' : 'Login'} - Maximally</title>
        <meta name="description" content="Join Maximally - World's First AI-Native Hackathon Platform" />
      </Helmet>

      <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center p-4 pt-24">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.10)_0%,transparent_50%)]" />
        
        <div className="absolute top-20 left-[10%] w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />

        {/* Auth Card */}
        <div className="w-full max-w-lg relative z-10">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-purple-500/30 p-6 sm:p-8 backdrop-blur-sm" data-testid="card-auth">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-purple-500/20 border border-purple-500/40">
                <Zap className="w-7 h-7 text-purple-400" />
              </div>
              <h1 className="font-press-start text-lg sm:text-xl md:text-2xl mb-3">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {isSignUp ? 'JOIN MAXIMALLY' : 'WELCOME BACK'}
                </span>
              </h1>
              <p className="font-jetbrains text-sm text-gray-400">
                {isSignUp ? 'Join the global innovation league' : 'Access your dashboard'}
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 mb-6">
                <div className="text-red-400 font-jetbrains text-sm" role="alert" data-testid="auth-error">
                  ⚠️ {error}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-press-start text-[10px] text-purple-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-400"></span>
                  EMAIL ADDRESS
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hacker@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  className="bg-black/50 border border-purple-500/30 text-white font-jetbrains focus:border-purple-400 placeholder:text-gray-600"
                  required
                  data-testid="input-email"
                />
              </div>

              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-press-start text-[10px] text-pink-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-pink-400"></span>
                      FULL NAME
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(null); }}
                      className="bg-black/50 border border-pink-500/30 text-white font-jetbrains focus:border-pink-400 placeholder:text-gray-600"
                      required
                      data-testid="input-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="font-press-start text-[10px] text-cyan-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-cyan-400"></span>
                      USERNAME
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="choose_a_username"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setError(null); }}
                      className="bg-black/50 border border-cyan-500/30 text-white font-jetbrains focus:border-cyan-400 placeholder:text-gray-600"
                      required
                      data-testid="input-username"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="font-press-start text-[10px] text-green-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400"></span>
                  PASSWORD
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  className="bg-black/50 border border-green-500/30 text-white font-jetbrains focus:border-green-400 placeholder:text-gray-600"
                  required
                  data-testid="input-password"
                />
                {!isSignUp && (
                  <div className="text-right mt-1">
                    <button
                      type="button"
                      onClick={() => navigate('/forgot-password')}
                      className="font-jetbrains text-xs text-gray-500 hover:text-purple-400 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="font-press-start text-[10px] text-green-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-400"></span>
                    CONFIRM PASSWORD
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                    className="bg-black/50 border border-green-500/30 text-white font-jetbrains focus:border-green-400 placeholder:text-gray-600"
                    required
                    data-testid="input-confirm-password"
                  />
                </div>
              )}

              {captchaRequired && (
                <div className="bg-purple-500/5 border border-purple-500/20 p-4">
                  <h3 className="font-press-start text-[10px] text-purple-300 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400"></span>
                    VERIFICATION REQUIRED
                  </h3>
                  <div className="flex justify-center">
                    <Recaptcha
                      ref={recaptchaRef}
                      onVerify={handleCaptchaVerify}
                      onError={handleCaptchaError}
                      size="normal"
                    />
                  </div>
                  {captchaError && (
                    <div className="bg-red-500/10 border border-red-500/30 p-2 mt-3">
                      <div className="text-red-400 font-jetbrains text-xs" role="alert">⚠️ {captchaError}</div>
                    </div>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-press-start text-xs py-5 transition-all duration-300"
                data-testid="button-submit"
                disabled={loading}
              >
                {loading ? 'LOADING...' : (isSignUp ? 'JOIN LEAGUE' : 'ACCESS DASHBOARD')}
              </Button>
            </form>

            {/* OAuth Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-500/20" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gray-900 px-4 font-jetbrains text-xs text-gray-500">
                  or connect with
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                onClick={handleGoogleSignIn}
                className="bg-white hover:bg-gray-100 text-black font-press-start text-[10px] py-3 border border-gray-300 hover:border-purple-400 transition-colors flex items-center justify-center gap-2"
                data-testid="button-google-signin"
              >
                <FcGoogle className="h-4 w-4" />
                <span className="hidden sm:inline">GOOGLE</span>
              </Button>

              <Button
                onClick={handleGithubSignIn}
                className="bg-gray-800 hover:bg-gray-700 text-white font-press-start text-[10px] py-3 border border-gray-700 hover:border-purple-400 transition-colors flex items-center justify-center gap-2"
                data-testid="button-github-signin"
              >
                <FaGithub className="h-4 w-4" />
                <span className="hidden sm:inline">GITHUB</span>
              </Button>
            </div>

            {/* Toggle Mode */}
            <div className="text-center border-t border-purple-500/20 pt-4">
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(null); resetCaptcha(); }}
                className="font-jetbrains text-sm text-gray-400 hover:text-purple-400 transition-colors"
                data-testid="button-toggle-mode"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'New user? Create account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
