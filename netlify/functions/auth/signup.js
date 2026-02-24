/**
 * Netlify Function: User Registration
 * POST /auth/signup
 */
import { getSupabaseAdmin, createResponse, validateMethod, parseBody } from '../shared/supabase.js';

export async function handler(event, context) {
  // Handle CORS preflight
  const methodCheck = validateMethod(event, ['POST']);
  if (methodCheck) return methodCheck;
  
  try {
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
    
    // Check if email already exists
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail(email);
    if (existingUser.user) {
      return createResponse(400, null, 'User with this email already exists');
    }
    
    // Create user account
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for now
      user_metadata: {
        username: username || null,
        full_name: fullName || null
      }
    });
    
    if (error) {
      console.error('Signup error:', error);
      return createResponse(400, null, error.message);
    }
    
    // Create profile record
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          username: username || null,
          full_name: fullName || null,
          created_at: new Date().toISOString()
        });
      
      if (profileError) {
        console.warn('Profile creation error:', profileError);
      }
    }
    
    return createResponse(201, {
      user: data.user,
      message: 'Account created successfully'
    });
    
  } catch (error) {
    console.error('Signup function error:', error);
    return createResponse(500, null, 'Internal server error');
  }
}