/**
 * Judge Scoring Token Utilities
 * 
 * This module provides utilities for generating and validating secure tokens
 * for judge scoring access. Judges receive tokenized links via email that
 * grant direct access to scoring without requiring login.
 * 
 * Requirements: 9.1, 1.1
 */

import { randomBytes } from 'crypto';

/**
 * Token configuration
 */
export const TOKEN_CONFIG = {
  /** Length of the token in bytes (32 bytes = 64 hex chars) */
  TOKEN_BYTES: 32,
  /** Default token expiration in days */
  DEFAULT_EXPIRY_DAYS: 30,
  /** Minimum token length for validation */
  MIN_TOKEN_LENGTH: 32,
} as const;

/**
 * Result of token generation
 */
export interface TokenGenerationResult {
  token: string;
  expiresAt: Date;
}

/**
 * Generates a cryptographically secure random token for judge scoring access.
 * 
 * Property 1: Token Uniqueness and Validity
 * For any judge in a hackathon, when a scoring token is generated, the token
 * SHALL be unique across all tokens.
 * 
 * Validates: Requirements 1.1, 9.1
 * 
 * @param expiryDays - Number of days until the token expires (default: 30)
 * @returns Object containing the token string and expiration date
 */
export function generateSecureToken(expiryDays: number = TOKEN_CONFIG.DEFAULT_EXPIRY_DAYS): TokenGenerationResult {
  // Generate cryptographically secure random bytes
  const tokenBuffer = randomBytes(TOKEN_CONFIG.TOKEN_BYTES);
  
  // Convert to hex string for URL-safe representation
  const token = tokenBuffer.toString('hex');
  
  // Calculate expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);
  
  return {
    token,
    expiresAt,
  };
}

/**
 * Validates that a token string has the correct format.
 * Does NOT check if the token exists in the database.
 * 
 * @param token - The token string to validate
 * @returns true if the token format is valid, false otherwise
 */
export function isValidTokenFormat(token: unknown): token is string {
  if (typeof token !== 'string') {
    return false;
  }
  
  // Token must be at least MIN_TOKEN_LENGTH characters
  if (token.length < TOKEN_CONFIG.MIN_TOKEN_LENGTH) {
    return false;
  }
  
  // Token must be a valid hex string
  return /^[a-f0-9]+$/i.test(token);
}

/**
 * Checks if a token has expired based on its expiration date.
 * 
 * @param expiresAt - The expiration date of the token
 * @param currentTime - Optional current time for testing (defaults to now)
 * @returns true if the token has expired, false otherwise
 */
export function isTokenExpired(expiresAt: Date | string, currentTime: Date = new Date()): boolean {
  const expiry = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  return currentTime > expiry;
}

/**
 * Token authentication result
 */
export interface TokenAuthResult {
  success: boolean;
  error?: 'invalid_format' | 'not_found' | 'expired';
  judgeId?: string;
  hackathonId?: number;
}

/**
 * Token data from database lookup
 */
export interface TokenData {
  id: string;
  hackathon_id: number;
  judge_id: string;
  token: string;
  expires_at: string;
  last_accessed_at?: string | null;
}

/**
 * Authenticates a judge token against stored token data.
 * 
 * Property 2: Token Authentication
 * For any token string, if the token exists and is not expired, authentication
 * SHALL succeed; if the token does not exist or is expired, authentication
 * SHALL fail.
 * 
 * Validates: Requirements 1.5, 9.2
 * 
 * @param token - The token string to authenticate
 * @param tokenData - The token data from database lookup (null if not found)
 * @param currentTime - Optional current time for testing (defaults to now)
 * @returns Authentication result with success status and error details
 */
export function authenticateToken(
  token: string,
  tokenData: TokenData | null,
  currentTime: Date = new Date()
): TokenAuthResult {
  // Validate token format first
  if (!isValidTokenFormat(token)) {
    return { success: false, error: 'invalid_format' };
  }
  
  // Check if token exists in database
  if (!tokenData) {
    return { success: false, error: 'not_found' };
  }
  
  // Check if token has expired
  if (isTokenExpired(tokenData.expires_at, currentTime)) {
    return { success: false, error: 'expired' };
  }
  
  // Token is valid
  return {
    success: true,
    judgeId: tokenData.judge_id,
    hackathonId: tokenData.hackathon_id,
  };
}
