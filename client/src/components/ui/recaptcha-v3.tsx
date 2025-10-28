import React, { useEffect, useState, useRef } from 'react';

interface RecaptchaV3Props {
  onVerify: (token: string | null) => void;
  onError?: () => void;
  action?: string;
  className?: string;
}

// Extend window interface for reCAPTCHA
declare global {
  interface Window {
    grecaptcha?: any;
  }
}

const RecaptchaV3: React.FC<RecaptchaV3Props> = ({
  onVerify,
  onError,
  action = 'submit',
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const lastActionRef = useRef<string | null>(null);

  // Debug logging removed for production

  const executeRecaptcha = async () => {
    if (!siteKey) {
      console.warn('reCAPTCHA site key missing, skipping execution');
      onVerify(null);
      return;
    }
    // Prevent concurrent executions
    if ((executeRecaptcha as any)._running) {
      return;
    }
    // If we've already executed for this action, skip duplicate execution
    if (lastActionRef.current === action) {
      (executeRecaptcha as any)._running = false;
      return;
    }
    (executeRecaptcha as any)._running = true;

    // Defensive: ensure grecaptcha exists and has execute function
    const readyToExecute = !!window.grecaptcha && typeof window.grecaptcha.execute === 'function';
    if (!readyToExecute) {
      console.warn('reCAPTCHA not ready yet - will retry shortly');
      // Try a few times with backoff before giving up
      let attempts = 0;
      const maxAttempts = 3;
      const tryLater = async (): Promise<void> => {
        attempts += 1;
        await new Promise((r) => setTimeout(r, 500 * attempts));
        if (window.grecaptcha && typeof window.grecaptcha.execute === 'function') {
          try {
            return await executeRecaptcha();
          } finally {
            (executeRecaptcha as any)._running = false;
          }
        }
        if (attempts < maxAttempts) {
          return tryLater();
        }
        console.error('reCAPTCHA failed to become ready after retries');
        onError?.();
        onVerify(null);
      };
      // Ensure any rejection from tryLater is handled
      tryLater().catch((err) => {
        console.error('tryLater executeRecaptcha error:', err);
        onError?.();
        onVerify(null);
      }).finally(() => { (executeRecaptcha as any)._running = false; });
      return;
    }

    try {
    setIsLoading(true);
    const token = await window.grecaptcha.execute(siteKey, { action });
  // Mark that we've executed for this action to avoid duplicates
  lastActionRef.current = action;
  onVerify(token);
      setIsLoading(false);
      (executeRecaptcha as any)._running = false;
    } catch (error) {
      console.error('reCAPTCHA execution error:', error);
      onError?.();
      onVerify(null);
      setIsLoading(false);
      (executeRecaptcha as any)._running = false;
    }
  };

  useEffect(() => {
    if (!siteKey) {
      console.error('VITE_RECAPTCHA_SITE_KEY environment variable is not set');
      setIsLoading(false);
      return;
    }

    // Use a global loader promise to avoid inserting the script multiple times
    const globalKey = '__recaptcha_v3_loader__';
    const existingScript = document.querySelector(`script[src*="recaptcha/api.js?render="]`);

    if ((window as any)[globalKey]) {
      // Wait for global loader to resolve
      (async () => {
        try {
          await (window as any)[globalKey];
          setScriptLoaded(true);
          if (window.grecaptcha) {
            window.grecaptcha.ready(() => {
              // handle execute result
              executeRecaptcha().catch((err) => {
                console.error('executeRecaptcha error (ready callback):', err);
                onError?.();
                onVerify(null);
              });
            });
          }
        } catch (err) {
          console.error('Global reCAPTCHA loader failed:', err);
          onError?.();
          setIsLoading(false);
        }
      })();
      return;
    }

    // If script already in DOM (maybe injected by another instance), wait for grecaptcha
    if (existingScript) {
      (window as any)[globalKey] = new Promise<void>((resolve, reject) => {
        const checkReady = () => {
          if (window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
            resolve();
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
      });
      (async () => {
        try {
          await (window as any)[globalKey];
          setScriptLoaded(true);
          window.grecaptcha.ready(() => {
            executeRecaptcha().catch((err) => {
              console.error('executeRecaptcha error (ready callback):', err);
              onError?.();
              onVerify(null);
            });
          });
        } catch (err) {
          console.error('reCAPTCHA existing script handler failed:', err);
          onError?.();
          setIsLoading(false);
        }
      })();
      return;
    }

    // Otherwise create and install the script and global loader
    (window as any)[globalKey] = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        // reCAPTCHA v3 script loaded
        // Wait until grecaptcha reports ready
        const waitForReady = () => {
          if (window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
            window.grecaptcha.ready(() => {
              resolve();
            });
          } else {
            setTimeout(waitForReady, 50);
          }
        };
        waitForReady();
      };

      script.onerror = (e) => {
        console.error('Failed to load reCAPTCHA script');
        reject(new Error('Failed to load reCAPTCHA script'));
      };

      document.head.appendChild(script);
    });

    (async () => {
      try {
        await (window as any)[globalKey];
        setScriptLoaded(true);
        // Execute after loader resolves
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            executeRecaptcha().catch((err) => {
              console.error('executeRecaptcha error (loader):', err);
              onError?.();
              onVerify(null);
            });
          });
        }
      } catch (err) {
        console.error('Global reCAPTCHA loader error:', err);
        onError?.();
        setIsLoading(false);
      }
    })();
  }, [siteKey, onError, scriptLoaded]);

  // Re-execute when action changes
  useEffect(() => {
      if (window.grecaptcha && siteKey && scriptLoaded) {
      window.grecaptcha.ready(() => {
        executeRecaptcha().catch((err) => {
          console.error('executeRecaptcha error (re-execute):', err);
          onError?.();
          onVerify(null);
        });
      });
    }
  }, [action, siteKey, scriptLoaded]);

  if (!siteKey) {
    return (
      <div className={`p-4 border border-red-500 rounded bg-red-50 text-red-700 ${className}`}>
        <p>CAPTCHA not configured. Missing VITE_RECAPTCHA_SITE_KEY environment variable.</p>
      </div>
    );
  }

  return (
    <div className={`recaptcha-v3-container ${className}`}>
      <div className="text-sm text-gray-400 flex items-center gap-2">
        {isLoading ? (
          <>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Loading security verification...</span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Security verification complete</span>
          </>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        This site is protected by reCAPTCHA and the Google{' '}
        <a href="https://policies.google.com/privacy" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>{' '}
        and{' '}
        <a href="https://policies.google.com/terms" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
          Terms of Service
        </a>{' '}
        apply.
      </p>
    </div>
  );
};

export default RecaptchaV3;