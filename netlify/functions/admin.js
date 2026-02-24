/**
 * Netlify Function: Admin API
 * Handles admin-specific endpoints for the admin panel
 */
import { getSupabaseAdmin, createResponse, parseBody } from './shared/supabase.js';

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
  
  try {
    console.log('Admin function called with:', event.queryStringParameters);
    
    const supabase = getSupabaseAdmin();
    const { queryStringParameters } = event;
    const action = queryStringParameters?.action;
    
    if (event.httpMethod === 'GET') {
      
      if (action === 'getUsers') {
        // Get users with pagination and search
        const { limit = 50, offset = 0, search } = queryStringParameters || {};
        
        let query = supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false });
        
        if (search) {
          query = query.or(`username.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`);
        }
        
        const limitNum = Math.min(parseInt(limit) || 50, 100);
        const offsetNum = parseInt(offset) || 0;
        
        query = query.range(offsetNum, offsetNum + limitNum - 1);
        
        const { data, error, count } = await query;
        
        if (error) {
          console.error('Users fetch error:', error);
          return createResponse(500, null, 'Failed to fetch users: ' + error.message);
        }
        
        return createResponse(200, {
          users: data || [],
          total: count,
          limit: limitNum,
          offset: offsetNum
        });
        
      } else if (action === 'getHackathons') {
        // Get hackathons for admin panel
        const { limit = 50, offset = 0, status } = queryStringParameters || {};
        
        let query = supabase
          .from('organizer_hackathons')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (status) {
          query = query.eq('status', status);
        }
        
        const limitNum = Math.min(parseInt(limit) || 50, 100);
        const offsetNum = parseInt(offset) || 0;
        
        query = query.range(offsetNum, offsetNum + limitNum - 1);
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Hackathons fetch error:', error);
          return createResponse(500, null, 'Failed to fetch hackathons: ' + error.message);
        }
        
        return createResponse(200, {
          hackathons: data || [],
          limit: limitNum,
          offset: offsetNum
        });
        
      } else if (action === 'getReports') {
        // Get user reports
        const { limit = 50, offset = 0, status } = queryStringParameters || {};
        
        let query = supabase
          .from('user_reports')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false });
        
        if (status) {
          query = query.eq('status', status);
        }
        
        const limitNum = Math.min(parseInt(limit) || 50, 100);
        const offsetNum = parseInt(offset) || 0;
        
        query = query.range(offsetNum, offsetNum + limitNum - 1);
        
        const { data, error, count } = await query;
        
        if (error) {
          console.error('Reports fetch error:', error);
          return createResponse(500, null, 'Failed to fetch reports: ' + error.message);
        }
        
        return createResponse(200, {
          reports: data || [],
          total: count,
          limit: limitNum,
          offset: offsetNum
        });
        
      } else if (action === 'getGalleryProjects') {
        // Get gallery projects for moderation
        const { limit = 50, offset = 0, status } = queryStringParameters || {};
        
        let query = supabase
          .from('gallery_projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (status) {
          query = query.eq('status', status);
        }
        
        const limitNum = Math.min(parseInt(limit) || 50, 100);
        const offsetNum = parseInt(offset) || 0;
        
        query = query.range(offsetNum, offsetNum + limitNum - 1);
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Gallery projects fetch error:', error);
          return createResponse(500, null, 'Failed to fetch gallery projects: ' + error.message);
        }
        
        return createResponse(200, {
          projects: data || [],
          limit: limitNum,
          offset: offsetNum
        });
        
      } else if (action === 'getOrganizers') {
        // Get organizers
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, full_name, email, role, created_at')
          .eq('role', 'organizer')
          .order('created_at', { ascending: false });
        
        if (profilesError) {
          console.error('Organizers fetch error:', profilesError);
          return createResponse(500, null, 'Failed to fetch organizers: ' + profilesError.message);
        }
        
        return createResponse(200, {
          organizers: profiles || []
        });
        
      } else if (action === 'getStats') {
        // Get admin dashboard stats
        const [usersRes, hackathonsRes, reportsRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact' }),
          supabase.from('organizer_hackathons').select('id', { count: 'exact' }),
          supabase.from('user_reports').select('id', { count: 'exact' }).eq('status', 'pending')
        ]);
        
        return createResponse(200, {
          stats: {
            totalUsers: usersRes.count || 0,
            totalHackathons: hackathonsRes.count || 0,
            pendingReports: reportsRes.count || 0
          }
        });
        
      } else {
        return createResponse(400, null, 'Invalid action');
      }
      
    } else if (event.httpMethod === 'POST') {
      // Handle POST requests for updates/inserts
      const body = parseBody(event);
      
      if (action === 'updateUser') {
        const { userId, updates } = body;
        
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId)
          .select()
          .single();
        
        if (error) {
          console.error('User update error:', error);
          return createResponse(500, null, 'Failed to update user: ' + error.message);
        }
        
        return createResponse(200, { user: data });
        
      } else if (action === 'updateReport') {
        const { reportId, updates } = body;
        
        const { data, error } = await supabase
          .from('user_reports')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', reportId)
          .select()
          .single();
        
        if (error) {
          console.error('Report update error:', error);
          return createResponse(500, null, 'Failed to update report: ' + error.message);
        }
        
        return createResponse(200, { report: data });
        
      } else if (action === 'updateProject') {
        const { projectId, status, reason } = body;
        
        const { data, error } = await supabase
          .from('gallery_projects')
          .update({
            status,
            moderation_reason: reason,
            moderated_at: new Date().toISOString()
          })
          .eq('id', projectId)
          .select()
          .single();
        
        if (error) {
          console.error('Project update error:', error);
          return createResponse(500, null, 'Failed to update project: ' + error.message);
        }
        
        return createResponse(200, { project: data });
        
      } else {
        return createResponse(400, null, 'Invalid action');
      }
      
    } else {
      return createResponse(405, null, 'Method not allowed');
    }
    
  } catch (error) {
    console.error('Admin function error:', error);
    return createResponse(500, null, 'Internal server error: ' + error.message);
  }
}