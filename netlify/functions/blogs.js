/**
 * Netlify Function: Blogs API
 * Handles all blog-related endpoints
 */
import { getSupabaseAdmin, createResponse, validateMethod } from './shared/supabase.js';

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
  
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return createResponse(405, null, 'Method not allowed');
  }
  
  try {
    console.log('Blogs function called with:', event.queryStringParameters);
    
    const supabase = getSupabaseAdmin();
    const { queryStringParameters } = event;
    
    // Route based on query parameters
    const slug = queryStringParameters?.slug;
    const action = queryStringParameters?.action;
    
    if (slug) {
      console.log('Fetching blog by slug:', slug);
      
      // Get Blog by Slug
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          id,
          title,
          slug,
          content,
          author,
          cover_image,
          excerpt,
          tags,
          created_at,
          updated_at,
          reading_time_minutes,
          status
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      
      if (error) {
        console.error('Blog fetch error:', error);
        if (error.code === 'PGRST116') {
          return createResponse(404, null, 'Blog not found');
        }
        return createResponse(500, null, 'Failed to fetch blog: ' + error.message);
      }
      
      // Note: View count tracking not implemented in current schema
      // TODO: Add views column to blogs table if needed
      
      return createResponse(200, {
        blog: data
      });
      
    } else {
      console.log('Fetching all blogs');
      
      // Get All Blogs (default action)
      const { featured, limit = 50, offset = 0 } = queryStringParameters || {};
      
      let query = supabase
        .from('blogs')
        .select(`
          id,
          title,
          slug,
          content,
          author,
          cover_image,
          excerpt,
          tags,
          created_at,
          updated_at,
          reading_time_minutes,
          status
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      // Apply pagination
      const limitNum = Math.min(parseInt(limit) || 50, 100); // Max 100 items
      const offsetNum = parseInt(offset) || 0;
      
      console.log('Query params:', { limitNum, offsetNum, featured });
      
      query = query.range(offsetNum, offsetNum + limitNum - 1);
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Blogs fetch error:', error);
        return createResponse(500, null, 'Failed to fetch blogs: ' + error.message);
      }
      
      console.log('Blogs fetched successfully:', data?.length || 0);
      
      return createResponse(200, {
        blogs: data || [],
        total: count,
        limit: limitNum,
        offset: offsetNum
      });
    }
    
  } catch (error) {
    console.error('Blogs function error:', error);
    return createResponse(500, null, 'Internal server error: ' + error.message);
  }
}