/**
 * Netlify Function: Get Users for Admin Panel
 * GET /admin/getUsers?limit=50&offset=0
 */
import { getSupabaseAdmin, createResponse, validateMethod } from '../shared/supabase.js';

export async function handler(event, context) {
  // Handle CORS preflight
  const methodCheck = validateMethod(event, ['GET']);
  if (methodCheck) return methodCheck;
  
  try {
    const { limit = 50, offset = 0, search } = event.queryStringParameters || {};
    
    const supabase = getSupabaseAdmin();
    
    let query = supabase
      .from('profiles')
      .select(`
        *,
        hackathons:hackathons!organizer_id(count),
        registrations:hackathon_registrations(count)
      `)
      .order('created_at', { ascending: false });
    
    // Search functionality
    if (search) {
      query = query.or(`username.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    
    // Apply pagination
    const limitNum = Math.min(parseInt(limit) || 50, 100); // Max 100 items
    const offsetNum = parseInt(offset) || 0;
    
    query = query.range(offsetNum, offsetNum + limitNum - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Users fetch error:', error);
      return createResponse(500, null, 'Failed to fetch users');
    }
    
    // Remove sensitive information for non-admin users
    const sanitizedUsers = data?.map(user => ({
      ...user,
      // Keep email for admin panel, but could be removed if needed
    })) || [];
    
    return createResponse(200, {
      users: sanitizedUsers,
      total: count,
      limit: limitNum,
      offset: offsetNum
    });
    
  } catch (error) {
    console.error('Get users function error:', error);
    return createResponse(500, null, 'Internal server error');
  }
}