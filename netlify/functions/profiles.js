/**
 * Netlify Function: Profiles API
 * Handles profile-related endpoints
 */
import { getSupabaseAdmin, createResponse } from './shared/supabase.js';

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
    console.log('Profiles function called with:', event.queryStringParameters);
    
    const supabase = getSupabaseAdmin();
    const { queryStringParameters } = event;
    
    const userId = queryStringParameters?.userId;
    const username = queryStringParameters?.username;
    const limit = parseInt(queryStringParameters?.limit || '50');
    const offset = parseInt(queryStringParameters?.offset || '0');
    
    if (userId) {
      console.log('Fetching profile by user ID:', userId);
      
      // Get Profile by User ID
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
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
      
    } else if (username) {
      console.log('Fetching profile by username:', username);
      
      // Get Profile by Username
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
      
    } else {
      console.log('Fetching all profiles');
      
      // Get All Profiles (with pagination)
      const limitNum = Math.min(limit, 100); // Max 100 items
      const offsetNum = offset;
      
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
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