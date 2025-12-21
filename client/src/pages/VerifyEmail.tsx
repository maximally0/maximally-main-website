import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { verifyEmailOtp, resendEmailOtp, getSession } from '@/lib/supabaseClient';
import Recaptcha, { RecaptchaRef } from '@/components/ui/recaptcha';
import { isCaptchaRequired, verifyCaptcha } from '@/lib/captcha';
import OTPInput from '@/components/OTPInput';
import { useRef } from 'react';
import { Mail } from 'lucide-react';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const emailParam = params.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [nextResendAt, setNextResendAt] = useState<number>(0);

  const captchaRequired = isCaptchaRequired();
  const recaptchaRef = useRef<RecaptchaRef | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [resendRequested, setResendRequested] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session) navigate('/', { replace: true });
    })();
  }, [navigate]);

  const canSubmit = useMemo(() => email.trim().length > 3 && code.trim().length >= 6, [email, code]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { success, error } = await verifyEmailOtp(email.trim(), code.trim());
      if (!success) {
        setError(error || 'Invalid or expired code');
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/', { replace: true }), 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const actuallyResend = async () => {
    setResending(true);
    try {
      const { success, error } = await resendEmailOtp(email.trim());
      if (!success) {
        setError(error || 'Failed to resend code');
      } else {
        setNextResendAt(Date.now() + 30_000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    const now = Date.now();
    if (now < nextResendAt) return;
    if (captchaRequired) {
      setResendRequested(true);
      recaptchaRef.current?.execute();
      return;
    }
    await actuallyResend();
  };

  useEffect(() => {
    const go = async () => {
      if (!resendRequested || !captchaRequired) return;
      const res = await verifyCaptcha(captchaToken ?? null);
      if (!res.success) {
        setError(res.message || 'Security verification failed');
        setResendRequested(false);
        return;
      }
      setResendRequested(false);
      await actuallyResend();
    };
    go();
  }, [captchaToken, resendRequested, captchaRequired]);

  return (
    <>
      <Helmet>
        <title>Verify Email - Maximally</title>
      </Helmet>
      <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center p-4 pt-24">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
        
        <div className="absolute top-20 left-[10%] w-60 h-60 bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-40 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />

        <div className="w-full max-w-lg relative z-10">
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 p-8 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="bg-purple-500/20 border border-purple-500/40 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-purple-400" />
                </div>
                <h1 className="font-press-start text-xl md:text-2xl mb-4">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">VERIFY EMAIL</span>
                </h1>
                <p className="font-jetbrains text-sm text-gray-400">Enter the 6-digit code we emailed to you.</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 mb-6">
                  <div className="text-red-300 font-press-start text-xs" role="alert">⚠️ {error}</div>
                </div>
              )}
              {success && (
                <div className="bg-green-500/10 border border-green-500/30 p-3 mb-6">
                  <div className="text-green-300 font-press-start text-xs" role="status">✓ Verified! Redirecting…</div>
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-press-start text-xs text-cyan-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-400"></span>
                    EMAIL ADDRESS
                  </Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-black/40 border border-purple-500/30 text-white font-jetbrains focus:border-purple-400 placeholder:text-gray-500 transition-colors" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code" className="font-press-start text-xs text-green-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400"></span>
                    VERIFICATION CODE
                  </Label>
                  <div className="flex justify-center">
                    <OTPInput length={6} value={code} onChange={setCode} />
                  </div>
                </div>

                <Button type="submit" disabled={loading || !canSubmit} className="w-full bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-press-start text-sm py-4 transition-all">
                  {loading ? 'VERIFYING...' : 'VERIFY'}
                </Button>

                <div className="text-center">
                  <button type="button" onClick={handleResend} disabled={resending || Date.now() < nextResendAt} className="font-press-start text-xs text-gray-400 hover:text-purple-300 transition-colors">
                    {resending ? 'SENDING...' : (Date.now() < nextResendAt ? `WAIT ${Math.ceil((nextResendAt - Date.now())/1000)}s` : 'RESEND CODE')}
                  </button>
                </div>

                {captchaRequired && (
                  <div className="sr-only">
                    <Recaptcha
                      ref={recaptchaRef}
                      onVerify={(t) => setCaptchaToken(t)}
                      onError={() => setCaptchaToken(null)}
                      size="invisible"
                      theme="dark"
                    />
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
