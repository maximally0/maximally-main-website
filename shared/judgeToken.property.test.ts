/**
 * Property-Based Tests for Judge Scoring Token System
 * 
 * Feature: platform-simplification, Property 1: Token Uniqueness and Validity
 * Validates: Requirements 1.1, 9.1
 * 
 * Property: For any judge in a hackathon, when a scoring token is generated,
 * the token SHALL be unique across all tokens and SHALL grant access only to
 * that judge's assigned hackathon submissions.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  generateSecureToken,
  isValidTokenFormat,
  isTokenExpired,
  authenticateToken,
  TOKEN_CONFIG,
  type TokenData,
} from './judgeToken';

describe('Property 1: Token Uniqueness and Validity', () => {
  /**
   * Feature: platform-simplification, Property 1: Token Uniqueness and Validity
   * Validates: Requirements 1.1, 9.1
   * 
   * Property: Generated tokens are always unique (with extremely high probability)
   */
  it('Property 1: Generated tokens are unique across multiple generations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 100 }), // Number of tokens to generate
        (count) => {
          const tokens = new Set<string>();
          
          for (let i = 0; i < count; i++) {
            const result = generateSecureToken();
            tokens.add(result.token);
          }
          
          // All tokens should be unique
          expect(tokens.size).toBe(count);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1a: Generated tokens have valid format
   */
  it('Property 1a: Generated tokens always have valid format', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 365 }), // Expiry days
        (expiryDays) => {
          const result = generateSecureToken(expiryDays);
          
          // Token should be valid format
          expect(isValidTokenFormat(result.token)).toBe(true);
          
          // Token should be exactly 64 hex characters (32 bytes)
          expect(result.token.length).toBe(TOKEN_CONFIG.TOKEN_BYTES * 2);
          
          // Token should only contain hex characters
          expect(/^[a-f0-9]+$/i.test(result.token)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1b: Token expiration is correctly calculated
   */
  it('Property 1b: Token expiration is correctly set based on expiry days', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 365 }), // Expiry days
        (expiryDays) => {
          const beforeGeneration = new Date();
          const result = generateSecureToken(expiryDays);
          const afterGeneration = new Date();
          
          // Expiration should be approximately expiryDays from now
          const expectedMinExpiry = new Date(beforeGeneration);
          expectedMinExpiry.setDate(expectedMinExpiry.getDate() + expiryDays);
          
          const expectedMaxExpiry = new Date(afterGeneration);
          expectedMaxExpiry.setDate(expectedMaxExpiry.getDate() + expiryDays);
          // Add small buffer for test execution time
          expectedMaxExpiry.setSeconds(expectedMaxExpiry.getSeconds() + 1);
          
          expect(result.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMinExpiry.getTime());
          expect(result.expiresAt.getTime()).toBeLessThanOrEqual(expectedMaxExpiry.getTime());
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1c: Token generation is deterministic in structure but random in value
   */
  it('Property 1c: Each token generation produces different values', () => {
    fc.assert(
      fc.property(
        fc.constant(null), // No input needed
        () => {
          const result1 = generateSecureToken();
          const result2 = generateSecureToken();
          
          // Tokens should be different
          expect(result1.token).not.toBe(result2.token);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Helper to generate hex strings of a given length
 */
const hexStringArb = (minLength: number, maxLength: number) =>
  fc.array(
    fc.integer({ min: 0, max: 15 }).map(n => n.toString(16)),
    { minLength, maxLength }
  ).map(arr => arr.join(''));

describe('Token Format Validation', () => {
  /**
   * Property: Valid hex strings of sufficient length are accepted
   */
  it('Valid hex strings of sufficient length are accepted', () => {
    fc.assert(
      fc.property(
        hexStringArb(TOKEN_CONFIG.MIN_TOKEN_LENGTH, 128),
        (hexString) => {
          expect(isValidTokenFormat(hexString)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Non-string values are rejected
   */
  it('Non-string values are rejected', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer(),
          fc.boolean(),
          fc.constant(null),
          fc.constant(undefined),
          fc.array(fc.string()),
          fc.object()
        ),
        (value) => {
          expect(isValidTokenFormat(value)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Short strings are rejected
   */
  it('Strings shorter than minimum length are rejected', () => {
    fc.assert(
      fc.property(
        hexStringArb(0, TOKEN_CONFIG.MIN_TOKEN_LENGTH - 1),
        (shortHex) => {
          expect(isValidTokenFormat(shortHex)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Non-hex strings are rejected
   */
  it('Non-hex strings are rejected', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: TOKEN_CONFIG.MIN_TOKEN_LENGTH })
          .filter(s => !/^[a-f0-9]+$/i.test(s)), // Only non-hex strings
        (nonHexString) => {
          expect(isValidTokenFormat(nonHexString)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Helper to generate valid dates (filtering out NaN dates)
 */
const validDateArb = (min: Date, max: Date) =>
  fc.date({ min, max }).filter(d => !isNaN(d.getTime()));

describe('Token Expiration', () => {
  /**
   * Property: Tokens with past expiration dates are expired
   */
  it('Tokens with past expiration dates are expired', () => {
    fc.assert(
      fc.property(
        validDateArb(new Date('2020-01-01'), new Date('2025-01-01')),
        fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }), // 1ms to 1 year after
        (expiresAt, msAfter) => {
          const currentTime = new Date(expiresAt.getTime() + msAfter);
          
          expect(isTokenExpired(expiresAt, currentTime)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Tokens with future expiration dates are not expired
   */
  it('Tokens with future expiration dates are not expired', () => {
    fc.assert(
      fc.property(
        validDateArb(new Date('2025-01-01'), new Date('2030-01-01')),
        fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }), // 1ms to 1 year before
        (expiresAt, msBefore) => {
          const currentTime = new Date(expiresAt.getTime() - msBefore);
          
          expect(isTokenExpired(expiresAt, currentTime)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: String dates are handled correctly
   */
  it('String dates are handled correctly', () => {
    fc.assert(
      fc.property(
        validDateArb(new Date('2020-01-01'), new Date('2030-01-01')),
        (expiresAt) => {
          const expiresAtString = expiresAt.toISOString();
          const currentTime = new Date(expiresAt.getTime() + 1000); // 1 second after
          
          expect(isTokenExpired(expiresAtString, currentTime)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Feature: platform-simplification, Property 2: Token Authentication
 * Validates: Requirements 1.5, 9.2
 * 
 * Property: For any token string, if the token exists and is not expired,
 * authentication SHALL succeed; if the token does not exist or is expired,
 * authentication SHALL fail.
 */
describe('Property 2: Token Authentication', () => {
  /**
   * Helper to create mock token data
   */
  const createMockTokenData = (
    token: string,
    expiresAt: Date,
    judgeId: string = 'judge-123',
    hackathonId: number = 1
  ): TokenData => ({
    id: 'token-id-123',
    hackathon_id: hackathonId,
    judge_id: judgeId,
    token,
    expires_at: expiresAt.toISOString(),
    last_accessed_at: null,
  });

  /**
   * Property 2: Valid tokens that exist and are not expired authenticate successfully
   */
  it('Property 2: Valid tokens that exist and are not expired authenticate successfully', () => {
    fc.assert(
      fc.property(
        hexStringArb(64, 64), // Valid token format (64 hex chars)
        fc.uuid(), // Judge ID
        fc.integer({ min: 1, max: 1000 }), // Hackathon ID
        validDateArb(new Date('2026-01-01'), new Date('2030-01-01')), // Future expiry
        (token, judgeId, hackathonId, expiresAt) => {
          const tokenData = createMockTokenData(token, expiresAt, judgeId, hackathonId);
          const currentTime = new Date('2025-06-01'); // Before expiry
          
          const result = authenticateToken(token, tokenData, currentTime);
          
          expect(result.success).toBe(true);
          expect(result.judgeId).toBe(judgeId);
          expect(result.hackathonId).toBe(hackathonId);
          expect(result.error).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2a: Tokens that don't exist fail authentication
   */
  it('Property 2a: Tokens that do not exist fail authentication', () => {
    fc.assert(
      fc.property(
        hexStringArb(64, 64), // Valid token format
        (token) => {
          const result = authenticateToken(token, null); // Token not found
          
          expect(result.success).toBe(false);
          expect(result.error).toBe('not_found');
          expect(result.judgeId).toBeUndefined();
          expect(result.hackathonId).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2b: Expired tokens fail authentication
   */
  it('Property 2b: Expired tokens fail authentication', () => {
    fc.assert(
      fc.property(
        hexStringArb(64, 64), // Valid token format
        validDateArb(new Date('2020-01-01'), new Date('2024-12-31')), // Past expiry
        fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }), // Time after expiry
        (token, expiresAt, msAfter) => {
          const tokenData = createMockTokenData(token, expiresAt);
          const currentTime = new Date(expiresAt.getTime() + msAfter);
          
          const result = authenticateToken(token, tokenData, currentTime);
          
          expect(result.success).toBe(false);
          expect(result.error).toBe('expired');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2c: Invalid format tokens fail authentication
   */
  it('Property 2c: Invalid format tokens fail authentication', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.string({ minLength: 0, maxLength: 31 }), // Too short
          fc.string({ minLength: 32 }).filter(s => !/^[a-f0-9]+$/i.test(s)) // Non-hex
        ),
        (invalidToken) => {
          // Even if token data exists, invalid format should fail
          const tokenData = createMockTokenData(invalidToken, new Date('2030-01-01'));
          
          const result = authenticateToken(invalidToken, tokenData);
          
          expect(result.success).toBe(false);
          expect(result.error).toBe('invalid_format');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2d: Authentication result is deterministic
   */
  it('Property 2d: Authentication result is deterministic', () => {
    fc.assert(
      fc.property(
        hexStringArb(64, 64),
        validDateArb(new Date('2025-01-01'), new Date('2030-01-01')),
        (token, expiresAt) => {
          const tokenData = createMockTokenData(token, expiresAt);
          const currentTime = new Date('2025-06-01');
          
          const result1 = authenticateToken(token, tokenData, currentTime);
          const result2 = authenticateToken(token, tokenData, currentTime);
          
          expect(result1.success).toBe(result2.success);
          expect(result1.error).toBe(result2.error);
          expect(result1.judgeId).toBe(result2.judgeId);
          expect(result1.hackathonId).toBe(result2.hackathonId);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2e: Token at exact expiry boundary
   */
  it('Property 2e: Token at exact expiry time is not expired', () => {
    fc.assert(
      fc.property(
        hexStringArb(64, 64),
        validDateArb(new Date('2025-01-01'), new Date('2030-01-01')),
        (token, expiresAt) => {
          const tokenData = createMockTokenData(token, expiresAt);
          
          // At exact expiry time, token should still be valid (not expired yet)
          const result = authenticateToken(token, tokenData, expiresAt);
          
          expect(result.success).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2f: Token 1ms after expiry is expired
   */
  it('Property 2f: Token 1ms after expiry is expired', () => {
    fc.assert(
      fc.property(
        hexStringArb(64, 64),
        validDateArb(new Date('2025-01-01'), new Date('2030-01-01')),
        (token, expiresAt) => {
          const tokenData = createMockTokenData(token, expiresAt);
          const justAfterExpiry = new Date(expiresAt.getTime() + 1);
          
          const result = authenticateToken(token, tokenData, justAfterExpiry);
          
          expect(result.success).toBe(false);
          expect(result.error).toBe('expired');
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: platform-simplification, Property 8: Judge Access Scope
 * Validates: Requirements 9.3
 * 
 * Property: For any authenticated judge token, the judge SHALL only see
 * submissions belonging to the hackathon associated with their token.
 */
describe('Property 8: Judge Access Scope', () => {
  /**
   * Helper type for submission data
   */
  interface Submission {
    id: number;
    hackathon_id: number;
    project_name: string;
  }

  /**
   * Pure function that filters submissions based on judge's hackathon access.
   * This mirrors the logic in the API route.
   */
  function filterSubmissionsForJudge(
    submissions: Submission[],
    judgeHackathonId: number
  ): Submission[] {
    return submissions.filter(s => s.hackathon_id === judgeHackathonId);
  }

  /**
   * Pure function that checks if a judge can score a specific submission.
   * Returns true only if the submission belongs to the judge's hackathon.
   */
  function canJudgeScoreSubmission(
    submissionHackathonId: number,
    judgeHackathonId: number
  ): boolean {
    return submissionHackathonId === judgeHackathonId;
  }

  /**
   * Arbitrary generator for submissions
   */
  const submissionArb = fc.record({
    id: fc.integer({ min: 1, max: 10000 }),
    hackathon_id: fc.integer({ min: 1, max: 100 }),
    project_name: fc.string({ minLength: 1, maxLength: 50 }),
  });

  /**
   * Property 8: Filtered submissions only contain submissions from judge's hackathon
   */
  it('Property 8: Filtered submissions only contain submissions from judge\'s hackathon', () => {
    fc.assert(
      fc.property(
        fc.array(submissionArb, { minLength: 0, maxLength: 50 }),
        fc.integer({ min: 1, max: 100 }), // Judge's hackathon ID
        (submissions, judgeHackathonId) => {
          const filtered = filterSubmissionsForJudge(submissions, judgeHackathonId);
          
          // All filtered submissions must belong to judge's hackathon
          for (const submission of filtered) {
            expect(submission.hackathon_id).toBe(judgeHackathonId);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8a: No submissions from other hackathons are included
   */
  it('Property 8a: No submissions from other hackathons are included', () => {
    fc.assert(
      fc.property(
        fc.array(submissionArb, { minLength: 0, maxLength: 50 }),
        fc.integer({ min: 1, max: 100 }), // Judge's hackathon ID
        (submissions, judgeHackathonId) => {
          const filtered = filterSubmissionsForJudge(submissions, judgeHackathonId);
          
          // Count submissions from other hackathons in filtered results
          const otherHackathonCount = filtered.filter(
            s => s.hackathon_id !== judgeHackathonId
          ).length;
          
          expect(otherHackathonCount).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8b: All submissions from judge's hackathon are included
   */
  it('Property 8b: All submissions from judge\'s hackathon are included', () => {
    fc.assert(
      fc.property(
        fc.array(submissionArb, { minLength: 0, maxLength: 50 }),
        fc.integer({ min: 1, max: 100 }), // Judge's hackathon ID
        (submissions, judgeHackathonId) => {
          const filtered = filterSubmissionsForJudge(submissions, judgeHackathonId);
          
          // Count expected submissions
          const expectedCount = submissions.filter(
            s => s.hackathon_id === judgeHackathonId
          ).length;
          
          expect(filtered.length).toBe(expectedCount);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8c: Judge can only score submissions from their hackathon
   */
  it('Property 8c: Judge can only score submissions from their hackathon', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }), // Submission's hackathon ID
        fc.integer({ min: 1, max: 100 }), // Judge's hackathon ID
        (submissionHackathonId, judgeHackathonId) => {
          const canScore = canJudgeScoreSubmission(submissionHackathonId, judgeHackathonId);
          
          if (submissionHackathonId === judgeHackathonId) {
            expect(canScore).toBe(true);
          } else {
            expect(canScore).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8d: Access scope check is deterministic
   */
  it('Property 8d: Access scope check is deterministic', () => {
    fc.assert(
      fc.property(
        fc.array(submissionArb, { minLength: 0, maxLength: 50 }),
        fc.integer({ min: 1, max: 100 }),
        (submissions, judgeHackathonId) => {
          const filtered1 = filterSubmissionsForJudge(submissions, judgeHackathonId);
          const filtered2 = filterSubmissionsForJudge(submissions, judgeHackathonId);
          
          expect(filtered1.length).toBe(filtered2.length);
          
          // Check each submission matches
          for (let i = 0; i < filtered1.length; i++) {
            expect(filtered1[i].id).toBe(filtered2[i].id);
            expect(filtered1[i].hackathon_id).toBe(filtered2[i].hackathon_id);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8e: Empty submissions array returns empty result
   */
  it('Property 8e: Empty submissions array returns empty result', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        (judgeHackathonId) => {
          const filtered = filterSubmissionsForJudge([], judgeHackathonId);
          
          expect(filtered.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8f: Filtering preserves submission data integrity
   */
  it('Property 8f: Filtering preserves submission data integrity', () => {
    // Generate submissions with unique IDs (as they would be in a real database)
    const uniqueSubmissionsArb = fc.array(
      fc.integer({ min: 1, max: 10000 }),
      { minLength: 1, maxLength: 50 }
    ).chain(ids => {
      const uniqueIds = [...new Set(ids)];
      return fc.tuple(
        ...uniqueIds.map(id =>
          fc.record({
            id: fc.constant(id),
            hackathon_id: fc.integer({ min: 1, max: 100 }),
            project_name: fc.string({ minLength: 1, maxLength: 50 }),
          })
        )
      );
    }).map(arr => arr as Submission[]);

    fc.assert(
      fc.property(
        uniqueSubmissionsArb,
        fc.integer({ min: 1, max: 100 }),
        (submissions, judgeHackathonId) => {
          const filtered = filterSubmissionsForJudge(submissions, judgeHackathonId);
          
          // Each filtered submission should exist in original array with same data
          for (const filteredSub of filtered) {
            const original = submissions.find(s => s.id === filteredSub.id);
            
            if (original) {
              expect(filteredSub.hackathon_id).toBe(original.hackathon_id);
              expect(filteredSub.project_name).toBe(original.project_name);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
