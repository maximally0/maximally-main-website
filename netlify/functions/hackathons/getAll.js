/**
 * Netlify Function: Get All Hackathons
 * GET /hackathons/getAll
 */
import { getSupabaseAdmin, createResponse, validateMethod } from '../shared/supabase.js';

export async function handler(event, context) {
  // Handle CORS preflight
  const methodCheck = validateMethod(event, ['GET']);
  if (methodCheck) return methodCheck;
  
  try {
    const supabase = getSupabaseAdmin();
    
    // Parse query parameters
    const { 
      status, 
      featured, 
      limit = 50, 
      offset = 0,
      search 
    } = event.queryStringParameters || {};
    
    let query = supabase
      .from('hackathons')
      .select(`
        *,
        profiles:organizer_id (
          username,
          full_name
        ),
        hackathon_registrations(count)
      `)
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    // Filter by status if specified
    if (status) {
      const now = new Date().toISOString();
      switch (status) {
        case 'upcoming':
          query = query.gt('start_date', now);
          break;
        case 'ongoing':
          query = query.lte('start_date', now).gt('end_date', now);
          break;
        case 'ended':
          query = query.lt('end_date', now);
          break;
      }
    }
    
    // Filter by featured if specified
    if (featured === 'true') {
      query = query.eq('featured', true);
    }
    
    // Search functionality
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    // Apply pagination
    const limitNum = Math.min(parseInt(limit) || 50, 100); // Max 100 items
    const offsetNum = parseInt(offset) || 0;
    
    query = query.range(offsetNum, offsetNum + limitNum - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Hackathons fetch error:', error);
      return createResponse(500, null, 'Failed to fetch hackathons');
    }
    
    return createResponse(200, {
      hackathons: data || [],
      total: count,
      limit: limitNum,
      offset: offsetNum
    });
    
  } catch (error) {
    console.error('Get hackathons function error:', error);
    return createResponse(500, null, 'Internal server error');
  }
}