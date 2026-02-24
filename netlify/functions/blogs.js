/**
 * Netlify Function: Blogs API
 * Handles all blog-related endpoints
 */
import { getSupabaseAdmin, createResponse, validateMethod } from './shared/supabase.js';

export async function handler(event, context) {
  // Handle CORS preflight
  const methodCheck = validateMethod(event, ['GET']);
  if (methodCheck) return methodCheck;
  
  try {
    const supabase = getSupabaseAdmin();
    const { queryStringParameters } = event;
    
    // Route based on query parameters
    const action = queryStringParameters?.action;
    const slug = queryStringParameters?.slug;
    
    if (slug) {
      // Get Blog by Slug
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles:author_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return createResponse(404, null, 'Blog not found');
        }
        console.error('Blog fetch error:', error);
        return createResponse(500, null, 'Failed to fetch blog');
      }
      
      // Increment view count
      await supabase
        .from('blogs')
        .update({ 
          views: (data.views || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);
      
      return createResponse(200, {
        blog: data
      });
      
    } else {
      // Get All Blogs (default action)
      const { featured, limit = 50, offset = 0 } = queryStringParameters || {};
      
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
    }
    
  } catch (error) {
    console.error('Blogs function error:', error);
    return createResponse(500, null, 'Internal server error');
  }
}