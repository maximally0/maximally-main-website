// @ts-nocheck
import type { Express, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

// Rate limiter helper
const rateBuckets = new Map<string, { tokens: number; last: number }>();
function rateLimit(userId: string, key: string, capacity = 10, refillMs = 60_000): boolean {
  const bucketKey = `${key}:${userId}`;
  const now = Date.now();
  const b = rateBuckets.get(bucketKey) || { tokens: capacity, last: now };
  const elapsed = now - b.last;
  if (elapsed > 0) {
    const refill = Math.floor(elapsed / refillMs) * capacity;
    b.tokens = Math.min(capacity, b.tokens + refill);
    b.last = now;
  }
  if (b.tokens <= 0) {
    rateBuckets.set(bucketKey, b);
    return false;
  }
  b.tokens -= 1;
  rateBuckets.set(bucketKey, b);
  return true;
}

async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const r = await supabaseAdmin.auth.getUser(token);
  return r?.data?.user?.id || null;
}

async function isAdmin(supabaseAdmin: any, userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  return data?.role === 'admin';
}

export function registerModerationRoutes(app: Express) {
  console.log('[Moderation] Registering moderation routes...');
  
  // Health check for moderation routes
  app.get("/api/moderation/health", (_req: Request, res: Response) => {
    return res.json({ success: true, message: 'Moderation routes are working' });
  });

  // Submit a user report
  app.post("/api/moderation/report", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      const authHeader = req.headers['authorization'];
      if (!authHeader?.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Rate limit: 5 reports per hour per user
      if (!rateLimit(userId, 'report:create', 5, 3600_000)) {
        return res.status(429).json({ success: false, message: 'Too many reports. Please try again later.' });
      }

      const { reported_user_id, category, description, screenshot_urls } = req.body;

      if (!reported_user_id || !category || !description) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      // Prevent self-reporting
      if (reported_user_id === userId) {
        return res.status(400).json({ success: false, message: 'You cannot report yourself' });
      }

      // Validate category
      const validCategories = ['harassment', 'spam', 'inappropriate_content', 'impersonation', 'cheating', 'hate_speech', 'scam', 'other'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ success: false, message: 'Invalid category' });
      }

      const { data, error } = await supabaseAdmin
        .from('user_reports')
        .insert({
          reporter_id: userId,
          reported_user_id,
          category,
          description,
          screenshot_urls: screenshot_urls || []
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating report:', error);
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.json({ success: true, data });
    } catch (err: any) {
      console.error('Report creation error:', err);
      return res.status(500).json({ success: false, message: err?.message || 'Failed to create report' });
    }
  });

  // Get user's own reports
  app.get("/api/moderation/my-reports", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      const authHeader = req.headers['authorization'];
      if (!authHeader?.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      const { data, error } = await supabaseAdmin
        .from('user_reports')
        .select('*')
        .eq('reporter_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Failed to fetch reports' });
    }
  });

  // Check user's moderation status
  app.get("/api/moderation/status", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      const authHeader = req.headers['authorization'];
      if (!authHeader?.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      const { data, error } = await supabaseAdmin
        .from('user_moderation_status')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.json({ 
        success: true, 
        data: data || { 
          is_banned: false, 
          is_muted: false, 
          is_suspended: false,
          warning_count: 0 
        } 
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Failed to fetch status' });
    }
  });

  // ============ ADMIN ENDPOINTS ============

  // Get all reports (admin only)
  app.get("/api/admin/moderation/reports", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      const authHeader = req.headers['authorization'];
      if (!authHeader?.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      if (!(await isAdmin(supabaseAdmin, userId))) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { status, limit = 50, offset = 0 } = req.query;

      let query = supabaseAdmin
        .from('user_reports')
        .select(`
          *,
          reporter:profiles!user_reports_reporter_id_fkey(id, username, full_name, avatar_url),
          reported_user:profiles!user_reports_reported_user_id_fkey(id, username, full_name, avatar_url, email)
        `)
        .order('created_at', { ascending: false })
        .range(Number(offset), Number(offset) + Number(limit) - 1);

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching reports:', error);
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.json({ success: true, data, count });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Failed to fetch reports' });
    }
  });

  // Update report status (admin only)
  app.patch("/api/admin/moderation/reports/:id", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      const authHeader = req.headers['authorization'];
      if (!authHeader?.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      if (!(await isAdmin(supabaseAdmin, userId))) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { id } = req.params;
      const { status, admin_notes, resolution, priority } = req.body;

      const updateData: any = { updated_at: new Date().toISOString() };
      if (status) updateData.status = status;
      if (admin_notes !== undefined) updateData.admin_notes = admin_notes;
      if (resolution !== undefined) updateData.resolution = resolution;
      if (priority) updateData.priority = priority;

      if (status === 'resolved' || status === 'dismissed') {
        updateData.reviewed_by = userId;
        updateData.reviewed_at = new Date().toISOString();
      }

      const { data, error } = await supabaseAdmin
        .from('user_reports')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Failed to update report' });
    }
  });

  // Get all users with moderation info (admin only)
  app.get("/api/admin/moderation/users", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      const authHeader = req.headers['authorization'];
      if (!authHeader?.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      if (!(await isAdmin(supabaseAdmin, userId))) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { search, filter, limit = 50, offset = 0 } = req.query;

      // Get profiles with moderation status
      let query = supabaseAdmin
        .from('profiles')
        .select(`
          *,
          moderation_status:user_moderation_status(*)
        `)
        .order('created_at', { ascending: false })
        .range(Number(offset), Number(offset) + Number(limit) - 1);

      if (search) {
        query = query.or(`username.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ success: false, message: error.message });
      }

      // Filter by moderation status if needed
      let filteredData = data || [];
      if (filter === 'banned') {
        filteredData = filteredData.filter((u: any) => u.moderation_status?.is_banned);
      } else if (filter === 'muted') {
        filteredData = filteredData.filter((u: any) => u.moderation_status?.is_muted);
      } else if (filter === 'suspended') {
        filteredData = filteredData.filter((u: any) => u.moderation_status?.is_suspended);
      } else if (filter === 'warned') {
        filteredData = filteredData.filter((u: any) => u.moderation_status?.warning_count > 0);
      }

      return res.json({ success: true, data: filteredData });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Failed to fetch users' });
    }
  });

  // Get user details with moderation history (admin only)
  app.get("/api/admin/moderation/users/:userId", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      const authHeader = req.headers['authorization'];
      if (!authHeader?.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const adminId = await bearerUserId(supabaseAdmin, token);
      if (!adminId) return res.status(401).json({ success: false, message: 'Invalid token' });

      if (!(await isAdmin(supabaseAdmin, adminId))) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { userId } = req.params;

      // Get user profile
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Get moderation status
      const { data: moderationStatus } = await supabaseAdmin
        .from('user_moderation_status')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Get moderation history
      const { data: moderationHistory } = await supabaseAdmin
        .from('user_moderation_actions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Get reports against this user
      const { data: reportsAgainst } = await supabaseAdmin
        .from('user_reports')
        .select('*')
        .eq('reported_user_id', userId)
        .order('created_at', { ascending: false });

      // Get reports made by this user
      const { data: reportsMade } = await supabaseAdmin
        .from('user_reports')
        .select('*')
        .eq('reporter_id', userId)
        .order('created_at', { ascending: false });

      return res.json({
        success: true,
        data: {
          profile,
          moderationStatus: moderationStatus || { is_banned: false, is_muted: false, is_suspended: false, warning_count: 0 },
          moderationHistory: moderationHistory || [],
          reportsAgainst: reportsAgainst || [],
          reportsMade: reportsMade || []
        }
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Failed to fetch user details' });
    }
  });

  // Take moderation action on user (admin only)
  app.post("/api/admin/moderation/action", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      const authHeader = req.headers['authorization'];
      if (!authHeader?.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const adminId = await bearerUserId(supabaseAdmin, token);
      if (!adminId) return res.status(401).json({ success: false, message: 'Invalid token' });

      if (!(await isAdmin(supabaseAdmin, adminId))) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { user_id, action_type, reason, duration_hours, related_report_id, metadata } = req.body;

      if (!user_id || !action_type || !reason) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const validActions = ['warning', 'mute', 'suspend', 'ban', 'unban', 'unmute', 'note', 'verify', 'unverify'];
      if (!validActions.includes(action_type)) {
        return res.status(400).json({ success: false, message: 'Invalid action type' });
      }

      // Calculate expiration if duration is provided
      let expires_at = null;
      if (duration_hours && ['mute', 'suspend', 'ban'].includes(action_type)) {
        expires_at = new Date(Date.now() + duration_hours * 60 * 60 * 1000).toISOString();
      }

      const { data, error } = await supabaseAdmin
        .from('user_moderation_actions')
        .insert({
          user_id,
          action_type,
          reason,
          duration_hours,
          expires_at,
          performed_by: adminId,
          related_report_id,
          metadata: metadata || {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating moderation action:', error);
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Failed to take action' });
    }
  });

  // Get moderation stats (admin only)
  app.get("/api/admin/moderation/stats", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      const authHeader = req.headers['authorization'];
      if (!authHeader?.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      if (!(await isAdmin(supabaseAdmin, userId))) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      // Get report counts by status
      const { data: pendingReports } = await supabaseAdmin
        .from('user_reports')
        .select('id', { count: 'exact' })
        .eq('status', 'pending');

      const { data: underReviewReports } = await supabaseAdmin
        .from('user_reports')
        .select('id', { count: 'exact' })
        .eq('status', 'under_review');

      const { data: resolvedReports } = await supabaseAdmin
        .from('user_reports')
        .select('id', { count: 'exact' })
        .eq('status', 'resolved');

      // Get banned/muted user counts
      const { data: bannedUsers } = await supabaseAdmin
        .from('user_moderation_status')
        .select('user_id', { count: 'exact' })
        .eq('is_banned', true);

      const { data: mutedUsers } = await supabaseAdmin
        .from('user_moderation_status')
        .select('user_id', { count: 'exact' })
        .eq('is_muted', true);

      // Get recent actions count (last 24 hours)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: recentActions } = await supabaseAdmin
        .from('user_moderation_actions')
        .select('id', { count: 'exact' })
        .gte('created_at', yesterday);

      return res.json({
        success: true,
        data: {
          pendingReports: pendingReports?.length || 0,
          underReviewReports: underReviewReports?.length || 0,
          resolvedReports: resolvedReports?.length || 0,
          bannedUsers: bannedUsers?.length || 0,
          mutedUsers: mutedUsers?.length || 0,
          recentActions: recentActions?.length || 0
        }
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Failed to fetch stats' });
    }
  });
}
