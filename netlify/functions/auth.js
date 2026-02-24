/**
 * Netlify Function: Authentication API
 * Handles login and signup endpoints
 */
import { getSupabaseAdmin, createResponse, parseBody } from './shared/supabase.js';

export async function handler(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }
  
  try {
    console.log('Auth function called with:', event.queryStringParameters);
    
    const supabase = getSupabaseAdmin();
    const { queryStringParameters } = event;
    const action = queryStringParameters?.action;
    
    if (event.httpMethod === 'POST') {
      const body = parseBody(event);
      
      if (action === 'login') {
        console.log('Processing login request');
        
        const { email, password } = body;
        
        if (!email || !password) {
          return createResponse(400, null, 'Email and password are required');
        }
        
        // Authenticate with Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (authError) {
          console.error('Auth error:', authError);
          return createResponse(401, null, authError.message);
        }
        
        if (!authData.user || !authData.session) {
          return createResponse(401, null, 'Authentication failed');
        }
        
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
        
        if (profileError) {
          console.error('Profile fetch error:', profileError);
          return createResponse(500, null, 'Failed to fetch user profile');
        }
        
        return createResponse(200, {
          user: authData.user,
          session: authData.session,
          profile: profile
        });
        
      } else if (action === 'signup') {
        console.log('Processing signup request');
        
        const { email, password, username, fullName } = body;
        
        if (!email || !password) {
          return createResponse(400, null, 'Email and password are required');
        }
        
        // Sign up with Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0],
              full_name: fullName || ''
            }
          }
        });
        
        if (authError) {
          console.error('Signup error:', authError);
          return createResponse(400, null, authError.message);
        }
        
        return createResponse(200, {
          user: authData.user,
          session: authData.session,
          message: 'Please check your email to confirm your account'
        });
        
      } else {
        return createResponse(400, null, 'Invalid action');
      }
    } else {
      return createResponse(405, null, 'Method not allowed');
    }
    
  } catch (error) {
    console.error('Auth function error:', error);
    return createResponse(500, null, 'Internal server error: ' + error.message);
  }
}