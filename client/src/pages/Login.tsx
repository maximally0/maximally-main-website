import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { supabase, signInWithEmailPassword, signUpWithEmailPassword, getCurrentUserWithProfile } from '@/lib/supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Check if Supabase is available
    if (!supabase) {
      setError('Authentication service is not available. Please check your connection.');
      setLoading(false);
      return;
    }

    const withTimeout = async <T,>(p: Promise<T>, ms: number, label: string): Promise<T> => {
      return await Promise.race<T>([
        p,
        new Promise<T>((_resolve, reject) =>
          setTimeout(() => reject(new Error(`${label} timed out after ${ms/1000}s`)), ms)
        ) as any,
      ]);
    };

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }
        
        console.log('Attempting to sign up user...');
        await withTimeout(signUpWithEmailPassword({ email, password, name, username }), 15000, 'Sign up');
        console.log('Sign up successful');
      } else {
        console.log('Attempting to sign in user...');
        await withTimeout(signInWithEmailPassword(email, password), 15000, 'Sign in');
        console.log('Sign in successful');
      }

      // Give more time for profile creation/fetching
      console.log('Fetching user profile...');
      const ctx = await Promise.race([
        getCurrentUserWithProfile(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000)),
      ]);

      if (ctx && ctx.profile?.role === 'admin') {
        console.log('Redirecting admin user to admin panel');
        navigate('/admin');
      } else if (ctx && ctx.profile) {
        const fallback = ctx.user.email?.split('@')[0] || 'me';
        const uname = ctx.profile.username || fallback;
        console.log(`Redirecting user to profile: /profile/${uname}`);
        navigate(`/profile/${uname}`);
      } else if (ctx) {
        console.log('User found but no profile, redirecting to generic profile');
        navigate('/profile');
      } else {
        console.log('No user context found, but auth seemed successful. Redirecting to home.');
        navigate('/');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      let errorMessage = 'Authentication failed';
      
      if (err?.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (err?.message?.includes('User already registered')) {
        errorMessage = 'An account with this email already exists';
      } else if (err?.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (err?.message?.includes('Authentication service is not configured')) {
        errorMessage = 'Authentication service is currently unavailable';
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    } catch (err) {
      console.error('Google sign-in error', err);
      setError('Google sign-in failed');
    }
  };

  const handleGithubSignIn = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signInWithOAuth({ provider: 'github' });
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
