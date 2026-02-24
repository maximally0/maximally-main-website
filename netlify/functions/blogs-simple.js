/**
 * Simple blogs function for debugging
 */
import { getSupabaseAdmin } from './shared/supabase.js';

export async function handler(event, context) {
  try {
    console.log('Simple blogs function called');
    
    const supabase = getSupabaseAdmin();
    
    // Very simple query
    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, slug, created_at, published')
      .eq('published', true)
      .limit(5);
    
    if (error) {
      console.error('Simple blogs error:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: error.message
        })
      };
    }
    
    console.log('Simple blogs success:', data?.length);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: {
          blogs: data || [],
          total: data?.length || 0
        }
      })
    };
    
  } catch (error) {
    console.error('Simple blogs function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack
      })
    };
  }
}