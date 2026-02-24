/**
 * Shared Supabase client for Netlify Functions
 * Uses service role key for backend operations
 */
import { createClient } from '@supabase/supabase-js';

let supabaseAdmin = null;

export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseServiceKey
      });
      throw new Error('Supabase environment variables not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Netlify Dashboard.');
    }
    
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  
  return supabaseAdmin;
}

/**
 * Standard response helper
 */
export function createResponse(statusCode, data, error = null) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: JSON.stringify({
      success: statusCode >= 200 && statusCode < 300,
      data,
      error
    })
  };
}

/**
 * Validate request method
 */
export function validateMethod(event, allowedMethods) {
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, null);
  }
  
  if (!allowedMethods.includes(event.httpMethod)) {
    return createResponse(405, null, 'Method not allowed');
  }
  
  return null;
}

/**
 * Parse request body safely
 */
export function parseBody(event) {
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
}