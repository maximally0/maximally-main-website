import React, { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface RecaptchaProps {
  onVerify: (token: string | null) => void;
  onExpired?: () => void;
  onError?: () => void;
  size?: 'compact' | 'normal' | 'invisible';
  theme?: 'light' | 'dark';
  className?: string;
  // For future extensibility
  provider?: 'recaptcha' | 'hcaptcha';
  version?: 'v2' | 'v3';
}

export interface RecaptchaRef {
  execute: () => void;
  reset: () => void;
  getValue: () => string | null;
}

const RecaptchaComponent = forwardRef<RecaptchaRef, RecaptchaProps>(({
  onVerify,
  onExpired,
  onError,
  size = 'normal',
  theme = 'dark', // Match the dark theme of the login form
  className = '',
  provider = 'recaptcha',
  version = 'v2'
}, ref) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  
  // Removed debug logging for production
  
  if (!siteKey) {
    console.error('VITE_RECAPTCHA_SITE_KEY environment variable is not set');
    return (
      <div className="p-4 border border-red-500 rounded bg-red-50 text-red-700">
        <p>CAPTCHA not configured. Missing VITE_RECAPTCHA_SITE_KEY environment variable.</p>
      </div>
    );
  }

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    execute: () => {
      recaptchaRef.current?.execute();
    },
    reset: () => {
      recaptchaRef.current?.reset();
    },
    getValue: () => {
      return recaptchaRef.current?.getValue() || null;
    }
  }));

  const handleChange = (token: string | null) => {
    onVerify(token);
  };

  const handleExpired = () => {
    onVerify(null);
    onExpired?.();
  };

  const handleError = () => {
    onVerify(null);
    onError?.();
  };

  // For future extensibility with hCaptcha
  if (provider === 'hcaptcha') {
    // This would be implemented when adding hCaptcha support
    console.warn('hCaptcha not yet implemented');
    return null;
  }

  return (
    <div className={`recaptcha-container ${className}`}>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={handleChange}
        onExpired={handleExpired}
        onError={handleError}
        size={size}
        theme={theme}
      />
    </div>
  );
});

RecaptchaComponent.displayName = 'RecaptchaComponent';

export default RecaptchaComponent;