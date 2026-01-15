/**
 * Judge Token Authentication Middleware
 * 
 * This middleware authenticates judges using secure tokens sent via email.
 * Judges do not need to log in - they access scoring via tokenized links.
 * 
 * Requirements: 9.2, 1.5
 */

import type { Request, Response, NextFunction } from 'express';
import type { SupabaseClient } from '@supabase/supabase-js';
import { isValidTokenFormat, isTokenExpired, type TokenData, type TokenAuthResult } from '../../shared/judgeToken';

/**
 * Extended request type with judge authentication data
 */
export interface JudgeAuthenticatedRequest extends Request {
  judgeAuth?: {
    judgeId: string;
    hackathonId: number;
    tokenId: string;
  };
}

/**
 * Options for the judge authentication middleware
 */
export interface JudgeAuthMiddlewareOptions {
  /** Supabase admin client for database access */
  supabaseAdmin: SupabaseClient;
  /** Whether to update last_accessed_at on successful auth (default: true) */
  updateLastAccessed?: boolean;
}

/**
 * Creates a middleware function that authenticates judge tokens.
 * 
 * Property 2: Token Authentication
 * For any token string, if the token exists and is not expired, authentication
 * SHALL succeed; if the token does not exist or is expired, authentication
 * SHALL fail.
 * 
 * Validates: Requirements 1.5, 9.2
 * 
 * @param options - Middleware configuration options
 * @returns Express middleware function
 */
export function createJudgeAuthMiddleware(options: JudgeAuthMiddlewareOptions) {
  const { supabaseAdmin, updateLastAccessed = true } = options;

  return async function authenticateJudgeToken(
    req: JudgeAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extract token from URL parameter or query string
      const token = req.params.token || req.query.token as string;

      if (!token) {
        res.status(401).json({
          success: false,
          error: 'missing_token',
          message: 'Scoring token is required',
        });
        return;
      }

      // Validate token format
      if (!isValidTokenFormat(token)) {
        res.status(401).json({
          success: false,
          error: 'invalid_format',
          message: 'Invalid scoring link format',
        });
        return;
      }

      // Look up token in database
      const { data: tokenData, error: dbError } = await supabaseAdmin
        .from('judge_scoring_tokens')
        .select('id, hackathon_id, judge_id, token, expires_at, last_accessed_at')
        .eq('token', token)
        .single();

      console.log('[JudgeAuth] Token lookup result:', { token: token.substring(0, 10) + '...', found: !!tokenData, error: dbError?.message });

      if (dbError || !tokenData) {
        res.status(401).json({
          success: false,
          error: 'not_found',
          message: 'Invalid or expired scoring link',
        });
        return;
      }

      // Check if token has expired
      if (isTokenExpired(tokenData.expires_at)) {
        res.status(401).json({
          success: false,
          error: 'expired',
          message: 'This scoring link has expired',
        });
        return;
      }

      // Token is valid - attach judge info to request
      req.judgeAuth = {
        judgeId: tokenData.judge_id,
        hackathonId: tokenData.hackathon_id,
        tokenId: tokenData.id,
      };

      // Update last_accessed_at if enabled
      if (updateLastAccessed) {
        await supabaseAdmin
          .from('judge_scoring_tokens')
          .update({ last_accessed_at: new Date().toISOString() })
          .eq('id', tokenData.id);
      }

      next();
    } catch (error) {
      console.error('Judge token authentication error:', error);
      res.status(500).json({
        success: false,
        error: 'server_error',
        message: 'Authentication failed due to server error',
      });
    }
  };
}

/**
 * Standalone function to authenticate a judge token.
 * Useful for testing or non-middleware contexts.
 * 
 * @param token - The token string to authenticate
 * @param supabaseAdmin - Supabase admin client
 * @param currentTime - Optional current time for testing
 * @returns Authentication result
 */
export async function authenticateJudgeTokenDirect(
  token: string,
  supabaseAdmin: SupabaseClient,
  currentTime: Date = new Date()
): Promise<TokenAuthResult> {
  // Validate token format
  if (!isValidTokenFormat(token)) {
    return { success: false, error: 'invalid_format' };
  }

  // Look up token in database
  const { data: tokenData, error: dbError } = await supabaseAdmin
    .from('judge_scoring_tokens')
    .select('id, hackathon_id, judge_id, token, expires_at, last_accessed_at')
    .eq('token', token)
    .single();

  if (dbError || !tokenData) {
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
