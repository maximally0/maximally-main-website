import disposableDomains from 'disposable-email-domains';

// Whitelist of guaranteed safe domains that bypass disposable checks
const SAFE_DOMAINS = new Set([
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
  'protonmail.com',
  'proton.me',
  'aol.com',
  'live.com',
  'msn.com',
  'comcast.net',
  'verizon.net',
  'att.net',
  'sbcglobal.net',
  'cox.net',
  'charter.net',
  'earthlink.net'
]);

// Convert disposable domains array to Set for faster lookups
const DISPOSABLE_DOMAINS = new Set(disposableDomains);

/**
 * Extract domain from email address
 */
export function extractDomain(email: string): string {
  const atIndex = email.lastIndexOf('@');
  if (atIndex === -1) throw new Error('Invalid email format');
  return email.slice(atIndex + 1).toLowerCase().trim();
}

/**
 * Basic email format validation
 */
export function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Check if domain is in the safe whitelist
 */
export function isSafeDomain(domain: string): boolean {
  return SAFE_DOMAINS.has(domain.toLowerCase());
}

/**
 * Check if domain is disposable/temporary
 */
export function isDisposableDomain(domain: string): boolean {
  const normalizedDomain = domain.toLowerCase();
  
  // Check exact match first
  if (DISPOSABLE_DOMAINS.has(normalizedDomain)) {
    return true;
  }
  
  // Check for subdomain matches (e.g., mail.tempmail.com should match tempmail.com)
  for (const disposableDomain of Array.from(DISPOSABLE_DOMAINS)) {
    if (normalizedDomain.endsWith('.' + disposableDomain)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Email validation result interface
 */
export interface EmailValidationResult {
  isValid: boolean;
  domain: string;
  issues: string[];
  isSafe: boolean;
  isDisposable: boolean;
}

/**
 * Quick frontend-only validation (no MX check)
 * Use this for real-time validation in forms
 */
export function validateEmailQuick(email: string): EmailValidationResult {
  const result: EmailValidationResult = {
    isValid: false,
    domain: '',
    issues: [] as string[],
    isSafe: false,
    isDisposable: false
  };

  // Step 1: Basic format validation
  if (!isValidEmailFormat(email)) {
    result.issues.push('Invalid email format');
    return result;
  }

  try {
    // Step 2: Extract domain
    result.domain = extractDomain(email);
  } catch (error) {
    result.issues.push('Could not extract domain from email');
    return result;
  }

  // Step 3: Check if domain is in safe whitelist
  result.isSafe = isSafeDomain(result.domain);
  
  // Step 4: Check if domain is disposable (skip if whitelisted)
  if (!result.isSafe) {
    result.isDisposable = isDisposableDomain(result.domain);
    if (result.isDisposable) {
      result.issues.push('Temporary emails are not allowed');
    }
  }

  // Overall validation result (without MX check)
  result.isValid = result.issues.length === 0;

  return result;
}