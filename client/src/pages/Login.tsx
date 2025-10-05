import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { email, password, isSignUp });
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign-in clicked');
  };

  const handleGithubSignIn = () => {
    console.log('GitHub sign-in clicked');
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200 dark:text-gray-200">
                  Email
                </Label>
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
                <Label htmlFor="password" className="text-gray-200 dark:text-gray-200">
                  Password
                </Label>
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-200 dark:text-gray-200">
                    Confirm Password
                  </Label>
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
              )}

              <Button
                type="submit"
                className="w-full bg-maximally-red dark:bg-maximally-red hover:bg-maximally-red/90 dark:hover:bg-maximally-red/90 text-white dark:text-white font-semibold"
                data-testid="button-submit"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
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
