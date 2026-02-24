/**
 * Netlify Function: Get Blog by Slug
 * GET /blogs/getBySlug?slug=blog-slug
 */
import { getSupabaseAdmin, createResponse, validateMethod } from '../shared/supabase.js';

export async function handler(event, context) {
  // Handle CORS preflight
  const methodCheck = validateMethod(event, ['GET']);
  if (methodCheck) return methodCheck;
  
  try {
    const { slug } = event.queryStringParameters || {};
    
    if (!slug) {
      return createResponse(400, null, 'Blog slug is required');
    }
    
    const supabase = getSupabaseAdmin();
    
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
    
  } catch (error) {
    console.error('Get blog by slug function error:', error);
    return createResponse(500, null, 'Internal server error');
  }
}