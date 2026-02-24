/**
 * Netlify Function: Get Admin Dashboard Statistics
 * GET /admin/getStats
 */
import { getSupabaseAdmin, createResponse, validateMethod } from '../shared/supabase.js';

export async function handler(event, context) {
  // Handle CORS preflight
  const methodCheck = validateMethod(event, ['GET']);
  if (methodCheck) return methodCheck;
  
  try {
    const supabase = getSupabaseAdmin();
    
    // Get various statistics for admin dashboard
    const [
      { count: totalUsers },
      { count: totalBlogs },
      { count: totalHackathons },
      { count: totalRegistrations }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('blogs').select('*', { count: 'exact', head: true }),
      supabase.from('hackathons').select('*', { count: 'exact', head: true }),
      supabase.from('hackathon_registrations').select('*', { count: 'exact', head: true })
    ]);
    
    // Get recent activity
    const { data: recentBlogs } = await supabase
      .from('blogs')
      .select('id, title, created_at, published')
      .order('created_at', { ascending: false })
      .limit(5);
      
    const { data: recentHackathons } = await supabase
      .from('hackathons')
      .select('id, title, created_at, published')
      .order('created_at', { ascending: false })
      .limit(5);
    
    return createResponse(200, {
      stats: {
        totalUsers: totalUsers || 0,
        totalBlogs: totalBlogs || 0,
        totalHackathons: totalHackathons || 0,
        totalRegistrations: totalRegistrations || 0
      },
      recentActivity: {
        blogs: recentBlogs || [],
        hackathons: recentHackathons || []
      }
    });
    
  } catch (error) {
    console.error('Admin stats function error:', error);
    return createResponse(500, null, 'Internal server error');
  }
}