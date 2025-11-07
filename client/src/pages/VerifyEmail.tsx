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

  // CAPTCHA for resend flow (invisible)
  const captchaRequired = isCaptchaRequired();
  const recaptchaRef = useRef<RecaptchaRef | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [resendRequested, setResendRequested] = useState(false);

  useEffect(() => {
    // If already authed (e.g., via magic link), redirect
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
    if (now < nextResendAt) return; // cooldown active
    if (captchaRequired) {
      setResendRequested(true);
      recaptchaRef.current?.execute();
      return;
    }
    await actuallyResend();
  };

  // When CAPTCHA token arrives and resend was requested, verify server-side then proceed
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
                  <span className="text-4xl">📩</span>
                </div>
                <h1 className="font-press-start text-2xl md:text-3xl font-bold mb-4 minecraft-text">
                  <span className="text-maximally-red drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">VERIFY_EMAIL</span>
                </h1>
                <p className="font-jetbrains text-sm text-gray-400">Enter the 6-digit code we emailed to you.</p>
              </div>

              {error && (
                <div className="minecraft-block bg-red-900/30 border-2 border-maximally-red p-3 mb-6">
                  <div className="text-red-300 font-press-start text-xs" role="alert">⚠️ {error}</div>
                </div>
              )}
              {success && (
                <div className="minecraft-block bg-green-900/30 border-2 border-green-600 p-3 mb-6">
                  <div className="text-green-300 font-press-start text-xs" role="status">Verified! Redirecting…</div>
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-press-start text-xs text-maximally-blue flex items-center gap-2">
                    <span className="w-2 h-2 bg-maximally-blue"></span>
                    EMAIL_ADDRESS
                  </Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-black border-2 border-gray-700 text-white font-jetbrains focus:border-maximally-blue placeholder:text-gray-500 transition-colors" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code" className="font-press-start text-xs text-maximally-green flex items-center gap-2">
                    <span className="w-2 h-2 bg-maximally-green"></span>
                    VERIFICATION_CODE
                  </Label>
                  <div className="flex justify-center">
                    <OTPInput length={6} value={code} onChange={setCode} />
                  </div>
                </div>

                <Button type="submit" disabled={loading || !canSubmit} className="w-full pixel-button bg-maximally-red hover:bg-maximally-red/90 text-white font-press-start text-sm py-4 transition-colors border-4 border-maximally-red hover:border-maximally-yellow">
                  {loading ? 'VERIFYING...' : 'VERIFY'}
                </Button>

                <div className="text-center">
                  <button type="button" onClick={handleResend} disabled={resending || Date.now() < nextResendAt} className="font-press-start text-xs text-gray-400 hover:text-maximally-yellow">
                    {resending ? 'SENDING...' : (Date.now() < nextResendAt ? `WAIT_${Math.ceil((nextResendAt - Date.now())/1000)}s` : 'RESEND_CODE')}
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