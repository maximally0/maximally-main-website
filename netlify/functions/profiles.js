/**
 * Netlify Function: Profiles API
 * Handles all profile-related endpoints
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
  
  // Only allow GET requests for now
  if (event.httpMethod !== 'GET') {
    return createResponse(405, null, 'Method not allowed');
  }
  
  try {
    console.log('Profiles function called with:', event.queryStringParameters);
    
    const supabase = getSupabaseAdmin();
    const { queryStringParameters } = event;
    
    // Route based on query parameters
    const username = queryStringParameters?.username;
    const userId = queryStringParameters?.userId;
    const id = queryStringParameters?.id;
    
    if (username) {
      console.log('Fetching profile by username:', username);
      
      // Get profile by username
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) {
        console.error('Profile fetch error:', error);
        if (error.code === 'PGRST116') {
          return createResponse(404, null, 'Profile not found');
        }
        return createResponse(500, null, 'Failed to fetch profile: ' + error.message);
      }
      
      return createResponse(200, {
        profile: data
      });
      
    } else if (userId || id) {
      console.log('Fetching profile by ID:', userId || id);
      
      // Get profile by user ID
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId || id)
        .single();
      
      if (error) {
        console.error('Profile fetch error:', error);
        if (error.code === 'PGRST116') {
          return createResponse(404, null, 'Profile not found');
        }
        return createResponse(500, null, 'Failed to fetch profile: ' + error.message);
      }
      
      return createResponse(200, {
        profile: data
      });
      
    } else {
      // Get all profiles (with pagination)
      const { limit = 50, offset = 0 } = queryStringParameters || {};
      
      const limitNum = Math.min(parseInt(limit) || 50, 100);
      const offsetNum = parseInt(offset) || 0;
      
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .range(offsetNum, offsetNum + limitNum - 1);
      
      if (error) {
        console.error('Profiles fetch error:', error);
        return createResponse(500, null, 'Failed to fetch profiles: ' + error.message);
      }
      
      return createResponse(200, {
        profiles: data || [],
        total: count,
        limit: limitNum,
        offset: offsetNum
      });
    }
    
  } catch (error) {
    console.error('Profiles function error:', error);
    return createResponse(500, null, 'Internal server error: ' + error.message);
  }
}