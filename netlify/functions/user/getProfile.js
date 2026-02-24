/**
 * Netlify Function: Get User Profile
 * GET /user/getProfile?userId=uuid
 */
import { getSupabaseAdmin, createResponse, validateMethod } from '../shared/supabase.js';

export async function handler(event, context) {
  // Handle CORS preflight
  const methodCheck = validateMethod(event, ['GET']);
  if (methodCheck) return methodCheck;
  
  try {
    const { userId, username } = event.queryStringParameters || {};
    
    if (!userId && !username) {
      return createResponse(400, null, 'User ID or username is required');
    }
    
    const supabase = getSupabaseAdmin();
    
    let query = supabase
      .from('profiles')
      .select(`
        *,
        hackathons:hackathons!organizer_id(count),
        registrations:hackathon_registrations(count)
      `);
    
    if (userId) {
      query = query.eq('id', userId);
    } else {
      query = query.eq('username', username);
    }
    
    const { data, error } = await query.single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return createResponse(404, null, 'User not found');
      }
      console.error('Profile fetch error:', error);
      return createResponse(500, null, 'Failed to fetch profile');
    }
    
    // Remove sensitive information
    const { email, ...publicProfile } = data;
    
    return createResponse(200, {
      profile: publicProfile
    });
    
  } catch (error) {
    console.error('Get profile function error:', error);
    return createResponse(500, null, 'Internal server error');
  }
}