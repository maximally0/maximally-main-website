/**
 * Netlify Function: Get All Blogs
 * GET /blogs/getAll
 */
import { getSupabaseAdmin, createResponse, validateMethod } from '../shared/supabase.js';

export async function handler(event, context) {
  // Handle CORS preflight
  const methodCheck = validateMethod(event, ['GET']);
  if (methodCheck) return methodCheck;
  
  try {
    const supabase = getSupabaseAdmin();
    
    // Parse query parameters
    const { featured, limit = 50, offset = 0 } = event.queryStringParameters || {};
    
    let query = supabase
      .from('blogs')
      .select(`
        *,
        profiles:author_id (
          username,
          full_name
        )
      `)
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    // Filter by featured if specified
    if (featured === 'true') {
      query = query.eq('featured', true);
    }
    
    // Apply pagination
    const limitNum = Math.min(parseInt(limit) || 50, 100); // Max 100 items
    const offsetNum = parseInt(offset) || 0;
    
    query = query.range(offsetNum, offsetNum + limitNum - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Blogs fetch error:', error);
      return createResponse(500, null, 'Failed to fetch blogs');
    }
    
    return createResponse(200, {
      blogs: data || [],
      total: count,
      limit: limitNum,
      offset: offsetNum
    });
    
  } catch (error) {
    console.error('Get blogs function error:', error);
    return createResponse(500, null, 'Internal server error');
  }
}