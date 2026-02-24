/**
 * Netlify Function: User Authentication
 * POST /auth/login
 */
import { getSupabaseAdmin, createResponse, validateMethod, parseBody } from '../shared/supabase.js';

export async function handler(event, context) {
  // Handle CORS preflight
  const methodCheck = validateMethod(event, ['POST']);
  if (methodCheck) return methodCheck;
  
  try {
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
    
  } catch (error) {
    console.error('Login function error:', error);
    return createResponse(500, null, 'Internal server error');
  }
}