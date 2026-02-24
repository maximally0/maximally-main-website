import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { requestPasswordReset } from '@/lib/supabaseClient';
import Recaptcha, { RecaptchaRef } from '@/components/ui/recaptcha';
import { isCaptchaRequired, isValidCaptchaToken } from '@/lib/captcha';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

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

    if (captchaRequired && !isValidCaptchaToken(captchaToken)) {
      setCaptchaError('Please complete the CAPTCHA verification');
      return;
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
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.04)_0%,transparent_50%)]" />
        
        <div className="absolute top-20 left-[10%] w-80 h-80 bg-orange-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-[10%] w-60 h-60 bg-orange-500/3 rounded-full blur-[80px]" />

        <div className="w-full max-w-lg relative z-10">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 p-6 sm:p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-orange-500/10 border border-orange-500/30">
                <Lock className="w-7 h-7 text-orange-400" />
              </div>
              <h1 className="font-space font-bold text-lg sm:text-xl md:text-2xl mb-3">
                <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  FORGOT PASSWORD
                </span>
              </h1>
              <p className="font-space text-sm text-gray-400">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 mb-6">
                <div className="text-red-400 font-space text-sm" role="alert">⚠️ {error}</div>
              </div>
            )}

            {sent ? (
              <div className="bg-green-500/10 border border-green-500/30 p-4 mb-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-green-400 font-space text-sm" role="status">
                  Check your email for the password reset link.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-space font-bold text-[10px] text-orange-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-400"></span>
                    EMAIL ADDRESS
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hacker@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/50 border border-gray-800 text-white font-space focus:border-orange-500 placeholder:text-gray-600"
                    required
                  />
                </div>

                {captchaRequired && (
                  <div className="bg-orange-500/5 border border-gray-800 p-4">
                    <h3 className="font-space font-bold text-[10px] text-orange-400 mb-3 flex items-center gap-2">
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
                  disabled={loading} 
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-500/50 hover:border-orange-500 text-white hover:text-white font-space font-bold text-xs py-5 transition-all duration-300"
                >
                  {loading ? 'SENDING...' : 'SEND RESET LINK'}
                </Button>
                
                <div className="text-center">
                  <button 
                    type="button" 
                    onClick={() => navigate('/login')} 
                    className="inline-flex items-center gap-2 font-space text-sm text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
