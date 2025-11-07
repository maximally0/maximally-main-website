import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { requestPasswordReset } from '@/lib/supabaseClient';
import Recaptcha, { RecaptchaRef } from '@/components/ui/recaptcha';
import { isCaptchaRequired, isValidCaptchaToken } from '@/lib/captcha';
import { useRef } from 'react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  // CAPTCHA state
  const captchaRequired = isCaptchaRequired();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const recaptchaRef = useRef<RecaptchaRef | null>(null);

  const handleCaptchaVerify = (token: string | null) => {
    setCaptchaToken(token);
    setCaptchaError(null);
  };
  const handleCaptchaError = () => {
    setCaptchaToken(null);
    setCaptchaError('CAPTCHA verification failed. Please refresh and try again.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (captchaRequired) {
      if (!isValidCaptchaToken(captchaToken)) {
        setCaptchaError('Please complete the CAPTCHA verification');
        return;
      }
    }

    setLoading(true);
    try {
      const { success, error } = await requestPasswordReset(email);
      if (!success) {
        setError(error || 'Failed to send reset email');
      } else {
        setSent(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - Maximally</title>
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
                  <span className="text-4xl">🔒</span>
                </div>
                <h1 className="font-press-start text-2xl md:text-3xl font-bold mb-4 minecraft-text">
                  <span className="text-maximally-red drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">FORGOT_PASSWORD</span>
                </h1>
                <p className="font-jetbrains text-sm text-gray-400">Enter your email and we'll send you a reset link.</p>
              </div>

              {error && (
                <div className="minecraft-block bg-red-900/30 border-2 border-maximally-red p-3 mb-6">
                  <div className="text-red-300 font-press-start text-xs" role="alert">⚠️ {error}</div>
                </div>
              )}

              {sent ? (
                <div className="minecraft-block bg-green-900/30 border-2 border-green-600 p-3 mb-6">
                  <div className="text-green-300 font-press-start text-xs" role="status">Check your email for the password reset link.</div>
                </div>
              ) : (
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
                    />
                  </div>

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
                        />
                      </div>
                      {captchaError && (
                        <div className="minecraft-block bg-red-900/30 border-2 border-maximally-red p-2 mt-3">
                          <div className="text-red-300 font-press-start text-xs" role="alert">⚠️ {captchaError}</div>
                        </div>
                      )}
                    </div>
                  )}

                  <Button type="submit" disabled={loading} className="w-full pixel-button bg-maximally-red hover:bg-maximally-red/90 text-white font-press-start text-sm py-4 transition-colors border-4 border-maximally-red hover:border-maximally-yellow">
                    {loading ? 'SENDING...' : 'SEND_RESET_LINK'}
                  </Button>
                  <div className="text-center">
                    <button type="button" onClick={() => navigate('/login')} className="font-press-start text-xs text-gray-400 hover:text-maximally-yellow">BACK_TO_LOGIN</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
