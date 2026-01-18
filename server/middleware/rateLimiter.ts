// Rate limiting middleware using token bucket algorithm
// Optimized for serverless environments (Netlify Functions)
import type { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
  message?: string;
  skipSuccessfulRequests?: boolean;
}

interface TokenBucket {
  tokens: number;
  lastRefill: number;
  maxTokens: number;
  refillRate: number; // tokens per millisecond
}

// In-memory store for rate limiting
// Note: In serverless, this resets between cold starts, which is actually beneficial for rate limiting
const rateLimitStore = new Map<string, TokenBucket>();

// Cleanup function that runs on each request (serverless-friendly)
function cleanupExpiredBuckets() {
  const now = Date.now();
  const fiveMinutesAgo = now - 5 * 60 * 1000;
  
  // Only cleanup if we have more than 100 entries to avoid performance impact
  if (rateLimitStore.size > 100) {
    for (const [key, bucket] of rateLimitStore.entries()) {
      if (bucket.lastRefill < fiveMinutesAgo) {
        rateLimitStore.delete(key);
      }
    }
  }
}

function getTokenBucket(key: string, maxTokens: number, refillRate: number): TokenBucket {
  const now = Date.now();
  let bucket = rateLimitStore.get(key);
  
  if (!bucket) {
    bucket = {
      tokens: maxTokens,
      lastRefill: now,
      maxTokens,
      refillRate
    };
    rateLimitStore.set(key, bucket);
    return bucket;
  }
  
  // Refill tokens based on time passed
  const timePassed = now - bucket.lastRefill;
  const tokensToAdd = timePassed * bucket.refillRate;
  bucket.tokens = Math.min(bucket.maxTokens, bucket.tokens + tokensToAdd);
  bucket.lastRefill = now;
  
  return bucket;
}

export function createRateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    keyGenerator = (req) => req.ip || req.headers['x-forwarded-for'] as string || 'unknown',
    message = 'Too many requests. Please try again later.',
    skipSuccessfulRequests = false
  } = config;
  
  // Convert to tokens per millisecond
  const refillRate = maxRequests / windowMs;
  
  return (req: Request, res: Response, next: NextFunction) => {
    // Cleanup expired buckets periodically (serverless-friendly)
    cleanupExpiredBuckets();
    
    const key = keyGenerator(req);
    const bucket = getTokenBucket(key, maxRequests, refillRate);
    
    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      
      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': Math.floor(bucket.tokens).toString(),
        'X-RateLimit-Reset': new Date(bucket.lastRefill + windowMs).toISOString()
      });
      
      // Skip decrementing token on successful requests if configured
      if (skipSuccessfulRequests) {
        const originalSend = res.send;
        res.send = function(body) {
          if (res.statusCode < 400) {
            bucket.tokens += 1; // Refund token for successful request
          }
          return originalSend.call(this, body);
        };
      }
      
      next();
    } else {
      res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil(1 / refillRate)
      });
    }
  };
}

// Predefined rate limiters for common use cases
export const rateLimiters = {
  // OTP requests - 5 per hour per IP
  otpRequest: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
    message: 'Too many OTP requests. Please try again in an hour.'
  }),
  
  // OTP verification - 10 per hour per IP
  otpVerify: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    message: 'Too many verification attempts. Please try again in an hour.'
  }),
  
  // Email validation - 20 per minute per IP
  emailValidate: createRateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
    message: 'Too many email validation requests. Please slow down.'
  }),
  
  // Password changes - 3 per 5 minutes per user
  passwordChange: createRateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 3,
    keyGenerator: (req) => req.headers.authorization || req.ip || 'unknown',
    message: 'Too many password change attempts. Please wait 5 minutes.'
  }),
  
  // General API - 100 requests per 15 minutes per IP
  general: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests. Please try again later.'
  }),
  
  // Registration - 5 per hour per IP
  registration: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
    message: 'Too many registration attempts. Please try again in an hour.'
  }),
  
  // Submission creation - 10 per hour per user
  submission: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    keyGenerator: (req) => req.headers.authorization || req.ip || 'unknown',
    message: 'Too many submission attempts. Please try again in an hour.'
  })
};

// Helper function for custom rate limiting
export function checkRateLimit(
  key: string, 
  maxRequests: number, 
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: Date } {
  const refillRate = maxRequests / windowMs;
  const bucket = getTokenBucket(key, maxRequests, refillRate);
  
  const allowed = bucket.tokens >= 1;
  if (allowed) {
    bucket.tokens -= 1;
  }
  
  return {
    allowed,
    remaining: Math.floor(bucket.tokens),
    resetTime: new Date(bucket.lastRefill + windowMs)
  };
}