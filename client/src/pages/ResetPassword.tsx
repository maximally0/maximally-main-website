import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { completePasswordReset, getSession } from '@/lib/supabaseClient';
import { KeyRound } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const session = await getSession();
        setHasRecoverySession(!!session);
      } catch (_) {
        setHasRecoverySession(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      const { success, error } = await completePasswordReset(password);
      if (!success) {
        setError(error || 'Failed to reset password');
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password - Maximally</title>
      </Helmet>
      <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center p-4 pt-24">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.10)_0%,transparent_50%)]" />

        <div className="w-full max-w-lg relative z-10">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-purple-500/40 hover:border-pink-400/50 transition-all duration-500 p-8 relative overflow-hidden">
            {/* Corner decorations */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-purple-500/50" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-purple-500/50" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-purple-500/50" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-purple-500/50" />

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/20 border border-purple-500/40 p-4 inline-block mb-4">
                  <KeyRound className="h-8 w-8 text-purple-400" />
                </div>
                <h1 className="font-press-start text-2xl md:text-3xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">RESET_PASSWORD</span>
                </h1>
                <p className="font-jetbrains text-sm text-gray-400">Choose a new password for your account</p>
              </div>

              {loading ? (
                <div className="text-center text-purple-400 font-press-start text-sm animate-pulse">Loading...</div>
              ) : !hasRecoverySession ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-red-900/30 to-rose-900/20 border border-red-500/40 p-4">
                    <div className="text-red-300 font-press-start text-xs">Invalid or expired reset link. Request a new one.</div>
                  </div>
                  <div className="text-center">
                    <button 
                      type="button" 
                      onClick={() => navigate('/forgot-password')} 
                      className="font-press-start text-xs text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      REQUEST_NEW_LINK
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-gradient-to-br from-red-900/30 to-rose-900/20 border border-red-500/40 p-4">
                      <div className="text-red-300 font-press-start text-xs">⚠️ {error}</div>
                    </div>
                  )}
                  {success && (
                    <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/40 p-4">
                      <div className="text-green-300 font-press-start text-xs">Password updated! Redirecting to login…</div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-press-start text-xs text-purple-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400"></span>
                      NEW_PASSWORD
                    </Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="bg-black/50 border border-purple-500/30 text-white font-jetbrains focus:border-pink-400 placeholder:text-gray-500 transition-colors" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm" className="font-press-start text-xs text-purple-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400"></span>
                      CONFIRM_PASSWORD
                    </Label>
                    <Input 
                      id="confirm" 
                      type="password" 
                      placeholder="••••••••" 
                      value={confirm} 
                      onChange={(e) => setConfirm(e.target.value)} 
                      className="bg-black/50 border border-purple-500/30 text-white font-jetbrains focus:border-pink-400 placeholder:text-gray-500 transition-colors" 
                      required 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={submitting} 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-press-start text-sm py-4 transition-all border border-pink-500/50"
                  >
                    {submitting ? 'UPDATING...' : 'UPDATE_PASSWORD'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
