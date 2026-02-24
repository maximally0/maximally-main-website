/**
 * Netlify Function: Certificates API
 * Handles certificate-related endpoints
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
    console.log('Certificates function called with:', event.queryStringParameters);
    
    const supabase = getSupabaseAdmin();
    const { queryStringParameters } = event;
    
    const maximally_username = queryStringParameters?.maximally_username;
    const participant_email = queryStringParameters?.participant_email;
    const certificate_id = queryStringParameters?.certificate_id;
    const limit = parseInt(queryStringParameters?.limit || '50');
    const offset = parseInt(queryStringParameters?.offset || '0');
    
    let query = supabase
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply filters
    if (maximally_username) {
      console.log('Filtering by maximally_username:', maximally_username);
      query = query.eq('maximally_username', maximally_username);
    }
    
    if (participant_email) {
      console.log('Filtering by participant_email:', participant_email);
      query = query.eq('participant_email', participant_email);
    }
    
    if (certificate_id) {
      console.log('Filtering by certificate_id:', certificate_id);
      query = query.eq('certificate_id', certificate_id);
    }
    
    // Apply pagination
    const limitNum = Math.min(limit, 100); // Max 100 items
    const offsetNum = offset;
    
    query = query.range(offsetNum, offsetNum + limitNum - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Certificates fetch error:', error);
      return createResponse(500, null, 'Failed to fetch certificates: ' + error.message);
    }
    
    console.log('Certificates fetched successfully:', data?.length || 0);
    
    return createResponse(200, {
      certificates: data || [],
      total: count,
      limit: limitNum,
      offset: offsetNum
    });
    
  } catch (error) {
    console.error('Certificates function error:', error);
    return createResponse(500, null, 'Internal server error: ' + error.message);
  }
}