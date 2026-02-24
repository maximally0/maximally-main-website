/**
 * Netlify Function: Certificates API
 * Handles all certificate-related endpoints
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
    console.log('Certificates function called with:', event.queryStringParameters);
    
    const supabase = getSupabaseAdmin();
    const { queryStringParameters } = event;
    
    // Route based on query parameters
    const maximally_username = queryStringParameters?.maximally_username;
    const participant_email = queryStringParameters?.participant_email;
    const certificate_id = queryStringParameters?.certificate_id;
    
    if (maximally_username) {
      console.log('Fetching certificates by username:', maximally_username);
      
      // Get certificates by Maximally username
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('maximally_username', maximally_username)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Certificates fetch error:', error);
        return createResponse(500, null, 'Failed to fetch certificates: ' + error.message);
      }
      
      return createResponse(200, {
        certificates: data || []
      });
      
    } else if (participant_email) {
      console.log('Fetching certificates by email:', participant_email);
      
      // Get certificates by participant email
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('participant_email', participant_email)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Certificates fetch error:', error);
        return createResponse(500, null, 'Failed to fetch certificates: ' + error.message);
      }
      
      return createResponse(200, {
        certificates: data || []
      });
      
    } else if (certificate_id) {
      console.log('Fetching certificate by ID:', certificate_id);
      
      // Get certificate by ID
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('certificate_id', certificate_id)
        .single();
      
      if (error) {
        console.error('Certificate fetch error:', error);
        if (error.code === 'PGRST116') {
          return createResponse(404, null, 'Certificate not found');
        }
        return createResponse(500, null, 'Failed to fetch certificate: ' + error.message);
      }
      
      return createResponse(200, {
        certificate: data
      });
      
    } else {
      // Get all certificates (with pagination)
      const { limit = 50, offset = 0 } = queryStringParameters || {};
      
      const limitNum = Math.min(parseInt(limit) || 50, 100);
      const offsetNum = parseInt(offset) || 0;
      
      const { data, error, count } = await supabase
        .from('certificates')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offsetNum, offsetNum + limitNum - 1);
      
      if (error) {
        console.error('Certificates fetch error:', error);
        return createResponse(500, null, 'Failed to fetch certificates: ' + error.message);
      }
      
      return createResponse(200, {
        certificates: data || [],
        total: count,
        limit: limitNum,
        offset: offsetNum
      });
    }
    
  } catch (error) {
    console.error('Certificates function error:', error);
    return createResponse(500, null, 'Internal server error: ' + error.message);
  }
}