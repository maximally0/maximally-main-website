/**
 * Utility functions for CAPTCHA verification
 */

export interface CaptchaVerificationResult {
  success: boolean;
  message?: string;
  score?: number;
  action?: string;
  errors?: string[];
}

/**
 * Verifies CAPTCHA token with the backend
 * @param token - The CAPTCHA token from the widget
 * @returns Promise with verification result
 */
export async function verifyCaptcha(token: string | null): Promise<CaptchaVerificationResult> {
  if (!token) {
    // Token missing — treat as a failed verification without making a network call
    return {
      success: false,
      message: 'Missing CAPTCHA token',
    };
  }

  // For static hosting deployment, we'll do client-side validation only
  // In a full-stack deployment, this would verify with the backend
  if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
    // Static hosting - just validate token format
    if (isValidCaptchaToken(token)) {
      return {
        success: true,
        message: 'CAPTCHA verified (client-side)',
      };
    } else {
      return {
        success: false,
        message: 'Invalid CAPTCHA token format',
      };
    }
  }

  // Full-stack deployment with backend API
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${apiUrl}/api/verify-captcha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'CAPTCHA verification failed');
    }

    return result as CaptchaVerificationResult;
  } catch (error: any) {
    console.error('CAPTCHA verification error:', error);
    return {
      success: false,
      message: error.message || 'CAPTCHA verification failed',
    };
  }
}

/**
 * Checks if CAPTCHA is required for the current environment
 * In development, you might want to skip CAPTCHA for easier testing
 */
export function isCaptchaRequired(): boolean {
  // Always require CAPTCHA in production
  if (import.meta.env.PROD) {
    return true;
  }
  
  // In development, check if CAPTCHA keys are configured
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  
  // Allow disabling CAPTCHA in development with environment variable
  if (import.meta.env.VITE_DISABLE_CAPTCHA === 'true') {
    return false;
  }
  
  return !!siteKey;
}

/**
 * Validates CAPTCHA token format
 */
export function isValidCaptchaToken(token: string | null): boolean {
  return typeof token === 'string' && token.length > 0;
}