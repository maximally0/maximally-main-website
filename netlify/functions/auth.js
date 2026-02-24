/**
 * Netlify Function: Authentication API
 * Handles all auth-related endpoints
 */
import { getSupabaseAdmin, createResponse, validateMethod, parseBody } from './shared/supabase.js';

export async function handler(event, context) {
  try {
    const { httpMethod, queryStringParameters } = event;
    
    // Route based on action parameter
    const action = queryStringParameters?.action;
    
    if (action === 'login') {
      // Handle CORS preflight
      const methodCheck = validateMethod(event, ['POST']);
      if (methodCheck) return methodCheck;
      
      const { email, password } = parseBody(event);
      
      // Validate input
      if (!email || !password) {
        return createResponse(400, null, 'Email and password are required');
      }
      
      if (!email.includes('@')) {
        return createResponse(400, null, 'Invalid email format');
      }
      
      const supabase = getSupabaseAdmin();
      
      // Attempt to sign in with email/password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        return createResponse(401, null, error.message);
      }
      
      if (!data.user) {
        return createResponse(401, null, 'Authentication failed');
      }
      
      // Get user profile for additional info
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.warn('Profile fetch error:', profileError);
      }
      
      // Return user data and session info
      return createResponse(200, {
        user: data.user,
        session: data.session,
        profile: profile || null
      });
      
    } else if (action === 'signup') {
      // Handle CORS preflight
      const methodCheck = validateMethod(event, ['POST']);
      if (methodCheck) return methodCheck;
      
      const { email, password, username, fullName } = parseBody(event);
      
      // Validate input
      if (!email || !password) {
        return createResponse(400, null, 'Email and password are required');
      }
      
      if (!email.includes('@')) {
        return createResponse(400, null, 'Invalid email format');
      }
      
      if (password.length < 6) {
        return createResponse(400, null, 'Password must be at least 6 characters');
      }
      
      const supabase = getSupabaseAdmin();
      
      // Create user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || null,
            full_name: fullName || null
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        return createResponse(400, null, error.message);
      }
      
      return createResponse(200, {
        user: data.user,
        session: data.session,
        message: 'Account created successfully'
      });
      
    } else {
      return createResponse(400, null, 'Invalid auth action');
    }
    
  } catch (error) {
    console.error('Auth function error:', error);
    return createResponse(500, null, 'Internal server error');
  }
}