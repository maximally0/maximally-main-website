import disposableDomains from 'disposable-email-domains';
import { promisify } from 'util';
import { resolve } from 'dns';

const resolveMx = promisify(resolve);

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
 * Perform MX record DNS lookup to verify domain can receive emails
 * Returns true if domain has valid MX records
 */
export async function hasMxRecord(domain: string): Promise<boolean> {
  try {
    const records = await resolveMx(domain);
    return Array.isArray(records) && records.length > 0;
  } catch (error) {
    // DNS lookup failed - domain likely doesn't exist or can't receive emails
    console.warn(`MX lookup failed for domain ${domain}:`, error);
    return false;
  }
}

/**
 * Comprehensive email validation result
 */
export interface EmailValidationResult {
  isValid: boolean;
  domain: string;
  issues: string[];
  isSafe: boolean;
  isDisposable: boolean;
  hasMx: boolean;
}

/**
 * Validate email comprehensively (format, disposable check, MX record)
 * This is the main validation function to use
 */
export async function validateEmail(email: string): Promise<EmailValidationResult> {
  const result: EmailValidationResult = {
    isValid: false,
    domain: '',
    issues: [],
    isSafe: false,
    isDisposable: false,
    hasMx: false
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

  // Step 5: MX record validation (skip if already failed disposable check)
  if (!result.isDisposable || result.isSafe) {
    try {
      result.hasMx = await hasMxRecord(result.domain);
      if (!result.hasMx) {
        result.issues.push('Temporary emails are not allowed');
      }
    } catch (error) {
      result.issues.push('Unable to verify email domain');
    }
  }

  // Overall validation result
  result.isValid = result.issues.length === 0 && (result.isSafe || (!result.isDisposable && result.hasMx));

  return result;
}

/**
 * Quick frontend-only validation (no MX check)
 * Use this for real-time validation in forms
 */
export function validateEmailQuick(email: string): Omit<EmailValidationResult, 'hasMx'> {
  const result: Omit<EmailValidationResult, 'hasMx'> = {
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
      result.issues.push('Disposable/temporary email addresses are not allowed');
    }
  }

  // Overall validation result (without MX check)
  result.isValid = result.issues.length === 0;

  return result;
}