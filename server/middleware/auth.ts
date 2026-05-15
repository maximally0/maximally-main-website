/**
 * Authentication middleware for Neon Auth integration
 * Validates JWT tokens and extracts user information
 */

import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  emailVerified?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

async function bearerUserId(supabaseAdmin: any, token: string): Promise<AuthenticatedUser | null> {
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) return null;
    
    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.full_name || data.user.user_metadata?.name,
      emailVerified: data.user.email_confirmed_at != null
    };
  } catch (error) {
    console.error('[Auth] Error validating token:', error);
    return null;
  }
}

// ─── Middleware Functions ─────────────────────────────────────────────────────

/**
 * Middleware to authenticate requests using Bearer token
 * Extracts user information from Neon Auth JWT token
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required. Please provide a valid Bearer token.' 
    });
  }

  const token = authHeader.toString().slice('Bearer '.length);
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token format' 
    });
  }

  // Get Supabase admin client from app locals
  const supabaseAdmin = req.app.locals.supabaseAdmin;
  if (!supabaseAdmin) {
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication service not configured' 
    });
  }

  // Validate token and extract user info
  bearerUserId(supabaseAdmin, token)
    .then(user => {
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid or expired token' 
        });
      }

      // Attach user to request
      req.user = user;
      next();
    })
    .catch(error => {
      console.error('[Auth] Token validation error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Authentication service error' 
      });
    });
}

/**
 * Optional authentication middleware - doesn't fail if no token provided
 * Useful for endpoints that work for both authenticated and anonymous users
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
    // No token provided, continue without user
    return next();
  }

  const token = authHeader.toString().slice('Bearer '.length);
  const supabaseAdmin = req.app.locals.supabaseAdmin;
  
  if (!supabaseAdmin || !token) {
    return next();
  }

  // Try to validate token, but don't fail if invalid
  bearerUserId(supabaseAdmin, token)
    .then(user => {
      if (user) {
        req.user = user;
      }
      next();
    })
    .catch(() => {
      // Ignore auth errors for optional auth
      next();
    });
}

/**
 * Middleware to check if user is authenticated and has verified email
 */
export function requireVerifiedEmail(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  if (!req.user.emailVerified) {
    return res.status(403).json({ 
      success: false, 
      message: 'Email verification required' 
    });
  }

  next();
}

/**
 * Rate limiting helper for authenticated users
 */
const rateBuckets = new Map<string, { tokens: number; last: number }>();

export function rateLimit(userId: string, key: string, capacity = 10, refillMs = 60_000): boolean {
  const bucketKey = `${key}:${userId}`;
  const now = Date.now();
  const bucket = rateBuckets.get(bucketKey) || { tokens: capacity, last: now };
  
  // Refill tokens based on time elapsed
  const elapsed = now - bucket.last;
  if (elapsed > 0) {
    const refill = Math.floor(elapsed / refillMs) * capacity;
    bucket.tokens = Math.min(capacity, bucket.tokens + refill);
    bucket.last = now;
  }
  
  if (bucket.tokens <= 0) {
    rateBuckets.set(bucketKey, bucket);
    return false;
  }
  
  bucket.tokens -= 1;
  rateBuckets.set(bucketKey, bucket);
  return true;
}

/**
 * Middleware for rate limiting authenticated requests
 */
export function authenticatedRateLimit(
  capacity: number = 10, 
  windowMs: number = 60_000,
  keyPrefix: string = 'api'
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!rateLimit(req.user.id, keyPrefix, capacity, windowMs)) {
      return res.status(429).json({ 
        success: false, 
        message: 'Too many requests. Please try again later.' 
      });
    }

    next();
  };
}