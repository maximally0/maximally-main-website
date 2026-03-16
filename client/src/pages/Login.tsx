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
import { Sparkles, Zap, Mail, ArrowLeft, RefreshCw, Eye, EyeOff } from 'lucide-react';

type SignupStep = 'form' | 'otp';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [signupStep, setSignupStep] = useState<SignupStep>('form');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [captchaLoaded, setCaptchaLoaded] = useState(false);
  const captchaRequired = isCaptchaRequired();
  const recaptchaRef = useRef<RecaptchaRef | null>(null);
  const captchaTokenRef = useRef<string | null>(null);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

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

  const resetSignupForm = () => {
    setSignupStep('form');
    setOtp('');
    setError(null);
    setSuccessMessage(null);
  };

  // Step 1: Request OTP
  const handleRequestOtp = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (captchaRequired) {
      const currentToken = captchaToken || captchaTokenRef.current;
      if (!isValidCaptchaToken(currentToken)) {
        setError('Please complete the CAPTCHA verification');
        setLoading(false);
        return;
      }
    }

    // Validation
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

    try {
      const response = await fetch('/api/auth/signup-request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name.trim(),
          username: username.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSignupStep('otp');
        setSuccessMessage('Verification code sent! Check your email.');
        setResendCooldown(60); // 60 second cooldown
      } else {
        setError(data.message || 'Failed to send verification code');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (otp.length !== 6) {
      setError('Please enter the 6-digit verification code');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup-verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Account created successfully! Signing you in...');
        // Auto sign in
        setTimeout(async () => {
          const result = await signIn(email, password);
          if (result.error) {
            setError('Account created but auto-login failed. Please sign in manually.');
            setIsSignUp(false);
            resetSignupForm();
          } else {
            navigate('/');
          }
        }, 1500);
      } else {
        setError(data.message || 'Invalid verification code');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('New verification code sent!');
        setResendCooldown(60);
      } else {
        setError(data.message || 'Failed to resend code');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (captchaRequired) {
      const currentToken = captchaToken || captchaTokenRef.current;
      if (!isValidCaptchaToken(currentToken)) {
        setError('Please complete the CAPTCHA verification');
        setLoading(false);
        return;
      }
    }

    try {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error.message);
        resetCaptcha();
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      resetCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      if (signupStep === 'form') {
        await handleRequestOtp();
      } else {
        await handleVerifyOtp();
      }
    } else {
      await handleLogin(e);
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
        <meta name="description" content="Sign in to Maximally — infrastructure for serious builders. Manage events, submissions, and your builder profile." />
      </Helmet>

      <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center p-4 pt-24">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
        
        <div className="absolute top-20 left-[10%] w-80 h-80 bg-orange-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-[10%] w-60 h-60 bg-orange-500/3 rounded-full blur-[80px]" />

        {/* Auth Card */}
        <div className="w-full max-w-lg relative z-10">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 p-6 sm:p-8 backdrop-blur-sm" data-testid="card-auth">
            {/* Header */}
            <div className="text-center mb-8">
              {isSignUp && signupStep === 'otp' ? (
                <>
                  <div className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-orange-500/10 border border-orange-500/30">
                    <Mail className="w-7 h-7 text-orange-400" />
                  </div>
                  <h1 className="font-space font-bold text-lg sm:text-xl md:text-2xl mb-3">
                    <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                      VERIFY EMAIL
                    </span>
                  </h1>
                  <p className="font-space text-sm text-gray-400">
                    Enter the 6-digit code sent to<br />
                    <span className="text-orange-400">{email}</span>
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-orange-500/10 border border-orange-500/30">
                    <Zap className="w-7 h-7 text-orange-400" />
                  </div>
                  <h1 className="font-space font-bold text-lg sm:text-xl md:text-2xl mb-3">
                    <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                      {isSignUp ? 'JOIN MAXIMALLY' : 'WELCOME BACK'}
                    </span>
                  </h1>
                  <p className="font-space text-sm text-gray-400">
                    {isSignUp ? 'Join the global innovation league' : 'Access your dashboard'}
                  </p>
                </>
              )}
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/30 p-3 mb-6">
                <div className="text-green-400 font-space text-sm">
                  ✅ {successMessage}
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 mb-6">
                <div className="text-red-400 font-space text-sm" role="alert" data-testid="auth-error">
                  ⚠️ {error}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* OTP Verification Step */}
              {isSignUp && signupStep === 'otp' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="font-space font-semibold text-[10px] text-orange-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-400"></span>
                      VERIFICATION CODE
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => { 
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(val); 
                        setError(null); 
                      }}
                      className="bg-black/50 border border-gray-700 text-white font-space focus:border-orange-500 placeholder:text-gray-600 text-center text-2xl tracking-[0.5em]"
                      maxLength={6}
                      required
                      autoFocus
                      data-testid="input-otp"
                    />
                    <p className="text-xs text-gray-500 font-space text-center mt-2">
                      Code expires in 10 minutes
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 border-none text-white font-space font-bold text-xs py-5 transition-all duration-300"
                    data-testid="button-verify-otp"
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? 'VERIFYING...' : 'VERIFY & CREATE ACCOUNT'}
                  </Button>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={resetSignupForm}
                      className="font-space text-sm text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || loading}
                      className="font-space text-sm text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Regular Form Fields */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-space font-semibold text-[10px] text-orange-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-400"></span>
                      EMAIL ADDRESS
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hacker@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null); }}
                      className="bg-black/50 border border-gray-700 text-white font-space focus:border-orange-500 placeholder:text-gray-600"
                      required
                      data-testid="input-email"
                    />
                  </div>

                  {isSignUp && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-space font-semibold text-[10px] text-orange-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-orange-400"></span>
                          FULL NAME
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => { setName(e.target.value); setError(null); }}
                          className="bg-black/50 border border-gray-700 text-white font-space focus:border-orange-500 placeholder:text-gray-600"
                          required
                          data-testid="input-name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username" className="font-space font-semibold text-[10px] text-orange-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-orange-400"></span>
                          USERNAME
                        </Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder="choose_a_username"
                          value={username}
                          onChange={(e) => { setUsername(e.target.value); setError(null); }}
                          className="bg-black/50 border border-gray-700 text-white font-space focus:border-orange-500 placeholder:text-gray-600"
                          required
                          data-testid="input-username"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-space font-semibold text-[10px] text-orange-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-400"></span>
                      PASSWORD
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(null); }}
                        className="bg-black/50 border border-gray-700 text-white font-space focus:border-orange-500 placeholder:text-gray-600 pr-10"
                        required
                        data-testid="input-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-400 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {!isSignUp && (
                      <div className="text-right mt-1">
                        <button
                          type="button"
                          onClick={() => navigate('/forgot-password')}
                          className="font-space text-xs text-gray-500 hover:text-orange-400 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}
                  </div>

                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="font-space font-semibold text-[10px] text-orange-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-400"></span>
                        CONFIRM PASSWORD
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                          className="bg-black/50 border border-gray-700 text-white font-space focus:border-orange-500 placeholder:text-gray-600 pr-10"
                          required
                          data-testid="input-confirm-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-400 transition-colors"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {captchaRequired && (
                    <div className="bg-orange-500/5 border border-gray-800 p-4">
                      <h3 className="font-space font-semibold text-[10px] text-orange-400 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-400"></span>
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
                          <div className="text-red-400 font-space text-xs" role="alert">⚠️ {captchaError}</div>
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 border-none text-white font-space font-bold text-xs py-5 transition-all duration-300"
                    data-testid="button-submit"
                    disabled={loading}
                  >
                    {loading ? 'LOADING...' : (isSignUp ? 'SEND VERIFICATION CODE' : 'ACCESS DASHBOARD')}
                  </Button>
                </>
              )}
            </form>

            {/* OAuth Section - Only show on login or signup form step */}
            {(!isSignUp || signupStep === 'form') && (
              <>
                {/* OAuth Separator */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-gray-900 px-4 font-space text-xs text-gray-500">
                      or connect with
                    </span>
                  </div>
                </div>

                {/* OAuth Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="bg-white hover:bg-gray-100 text-black font-space font-bold text-[10px] py-3 border border-gray-300 hover:border-orange-500 transition-colors flex items-center justify-center gap-2"
                    data-testid="button-google-signin"
                  >
                    <FcGoogle className="h-4 w-4" />
                    <span className="hidden sm:inline">GOOGLE</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={handleGithubSignIn}
                    className="bg-gray-800 hover:bg-gray-700 text-white font-space font-bold text-[10px] py-3 border border-gray-700 hover:border-orange-500 transition-colors flex items-center justify-center gap-2"
                    data-testid="button-github-signin"
                  >
                    <FaGithub className="h-4 w-4" />
                    <span className="hidden sm:inline">GITHUB</span>
                  </Button>
                </div>

                {/* Toggle Mode */}
                <div className="text-center border-t border-gray-800 pt-4">
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(!isSignUp); setError(null); resetCaptcha(); resetSignupForm(); }}
                    className="font-space text-sm text-gray-400 hover:text-orange-400 transition-colors"
                    data-testid="button-toggle-mode"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : 'New user? Create account'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
