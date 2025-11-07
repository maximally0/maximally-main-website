import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { completePasswordReset, getSession } from '@/lib/supabaseClient';

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
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="w-full max-w-lg relative z-10">
          <div className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-maximally-red hover:border-maximally-yellow transition-all duration-500 p-8 relative group overflow-hidden">
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-maximally-yellow animate-pulse" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-maximally-yellow animate-pulse delay-200" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-maximally-yellow animate-pulse delay-400" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-maximally-yellow animate-pulse delay-600" />

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="minecraft-block bg-maximally-red/20 border-2 border-maximally-red p-3 inline-block mb-4">
                  <span className="text-4xl">🔑</span>
                </div>
                <h1 className="font-press-start text-2xl md:text-3xl font-bold mb-4 minecraft-text">
                  <span className="text-maximally-red drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">RESET_PASSWORD</span>
                </h1>
                <p className="font-jetbrains text-sm text-gray-400">Choose a new password for your account</p>
              </div>

              {loading ? (
                <div className="text-center text-gray-400">Loading...</div>
              ) : !hasRecoverySession ? (
                <div className="space-y-4">
                  <div className="minecraft-block bg-red-900/30 border-2 border-maximally-red p-3">
                    <div className="text-red-300 font-press-start text-xs">Invalid or expired reset link. Request a new one.</div>
                  </div>
                  <div className="text-center">
                    <button type="button" onClick={() => navigate('/forgot-password')} className="font-press-start text-xs text-gray-400 hover:text-maximally-yellow">REQUEST_NEW_LINK</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-6">
                  {error && (
                    <div className="minecraft-block bg-red-900/30 border-2 border-maximally-red p-3">
                      <div className="text-red-300 font-press-start text-xs">⚠️ {error}</div>
                    </div>
                  )}
                  {success && (
                    <div className="minecraft-block bg-green-900/30 border-2 border-green-600 p-3">
                      <div className="text-green-300 font-press-start text-xs">Password updated! Redirecting to login…</div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-press-start text-xs text-maximally-green flex items-center gap-2">
                      <span className="w-2 h-2 bg-maximally-green"></span>
                      NEW_PASSWORD
                    </Label>
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-green placeholder:text-gray-500 transition-colors" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm" className="font-press-start text-xs text-maximally-green flex items-center gap-2">
                      <span className="w-2 h-2 bg-maximally-green"></span>
                      CONFIRM_PASSWORD
                    </Label>
                    <Input id="confirm" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-green placeholder:text-gray-500 transition-colors" required />
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full pixel-button bg-maximally-red hover:bg-maximally-red/90 text-white font-press-start text-sm py-4 transition-colors border-4 border-maximally-red hover:border-maximally-yellow">
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
