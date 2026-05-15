// @ts-nocheck
/**
 * Mentor Routes
 *
 * Implements the public mentor gallery (GET /api/mentors) and
 * mentor-specific profile features.
 *
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */

import type { Express, Request, Response } from 'express';
import { notifyMentorHelpRequest } from '../lib/mentorHelpRequestNotify';

// ─── Public Mentor Gallery ────────────────────────────────────────────────────

/**
 * GET /api/mentors
 *
 * Returns all active mentors joined with their profile data.
 * Supports optional query params:
 *   ?skill=<string>         — single skill (legacy)
 *   ?skills=a,b,c          — mentor must have all listed skills (comma-separated)
 *   ?status=<string>       — filter by mentors.status (available | in_session | offline)
 *   ?availability=<string> — filter by availability JSON array containing a matching time slot
 *
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */
async function getMentors(req: Request, res: Response) {
  const supabaseAdmin = req.app.locals.supabaseAdmin;

  if (!supabaseAdmin) {
    return res.status(503).json({ success: false, message: 'Server not configured' });
  }

  try {
    const { skill, skills, status, availability } = req.query as {
      skill?: string;
      skills?: string;
      status?: string;
      availability?: string;
    };

    let skillList: string[] = [];
    if (typeof skills === 'string' && skills.trim()) {
      skillList = skills.split(',').map((s) => s.trim()).filter(Boolean);
    } else if (skill) {
      skillList = [skill];
    }

    // Base query: join mentors with profiles, only active mentors
    let query = supabaseAdmin
      .from('mentors')
      .select('*, profiles!inner(full_name, avatar_url, bio, username, location)')
      .eq('is_active', true);

    // Filter by status (exact match)
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Mentors] Query error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }

    let mentors = data ?? [];

    // Filter by skill(s): mentor must have every listed skill (case-insensitive)
    if (skillList.length) {
      mentors = mentors.filter((m: any) => {
        const arr = (m.skills ?? []).map((s: string) => String(s).toLowerCase());
        return skillList.every((reqSkill) => arr.some((s) => s === reqSkill.toLowerCase()));
      });
    }

    // Filter by availability (post-fetch: check if any slot matches the query string)
    if (availability) {
      const availLower = availability.toLowerCase();
      mentors = mentors.filter((m: any) => {
        const slots: any[] = m.availability ?? [];
        return slots.some((slot: any) => {
          // Support both plain string slots and object slots
          const slotStr = typeof slot === 'string' ? slot : JSON.stringify(slot);
          return slotStr.toLowerCase().includes(availLower);
        });
      });
    }

    // Shape the response (PRD: skills, availability, hours, booking, max concurrent, public identity)
    const result = mentors.map((m: any) => ({
      id: m.id,
      user_id: m.user_id,
      name: m.profiles?.full_name ?? null,
      username: m.profiles?.username ?? null,
      location: m.profiles?.location ?? null,
      avatar_url: m.profiles?.avatar_url ?? null,
      bio: m.profiles?.bio ?? null,
      skills: m.skills ?? [],
      status: m.status,
      availability: m.availability ?? [],
      total_mentorship_hours: m.total_mentorship_hours ?? 0,
      booking_url: m.booking_url ?? null,
      max_concurrent_teams: m.max_concurrent_teams ?? 3,
    }));

    return res.json({ success: true, mentors: result });
  } catch (err: any) {
    console.error('[Mentors] Unexpected error:', err);
    return res.status(500).json({ success: false, message: err.message ?? 'Internal server error' });
  }
}

// ─── Route Registration ───────────────────────────────────────────────────────

export function registerMentorRoutes(app: Express): void {
  // Public mentor gallery
  app.get('/api/mentors', getMentors);

  /**
   * GET /api/mentorship/my-mentor
   * Get the accepted/active mentor session for the logged-in participant.
   */
  app.get('/api/mentorship/my-mentor', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) return res.status(503).json({ success: false, message: 'Server not configured' });
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
      const token = authHeader.slice(7);
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !user) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Find the most recent accepted/active session for this mentee
      const { data: session, error: sessionError } = await supabaseAdmin
        .from('mentorship_sessions')
        .select('id, mentor_id, problem_description, status, started_at, created_at')
        .eq('mentee_id', user.id)
        .in('status', ['active', 'pending'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sessionError) return res.status(500).json({ success: false, message: sessionError.message });
      if (!session) return res.json({ success: true, mentor: null, session: null });

      // Get mentor details with separate queries
      const { data: mentor, error: mentorError } = await supabaseAdmin
        .from('mentors')
        .select('id, user_id, skills, status, booking_url')
        .eq('id', (session as any).mentor_id)
        .single();

      if (mentorError || !mentor) return res.json({ success: true, mentor: null, session: null });

      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('full_name, email, username, avatar_url, bio, location')
        .eq('id', (mentor as any).user_id)
        .single();

      if (profileError || !profile) return res.json({ success: true, mentor: null, session: null });

      return res.json({
        success: true,
        session: {
          id: (session as any).id,
          status: (session as any).status,
          problem_description: (session as any).problem_description,
          started_at: (session as any).started_at,
          created_at: (session as any).created_at,
        },
        mentor: {
          id: (mentor as any).id,
          name: (profile as any)?.full_name ?? null,
          email: (profile as any)?.email ?? null,
          username: (profile as any)?.username ?? null,
          avatar_url: (profile as any)?.avatar_url ?? null,
          bio: (profile as any)?.bio ?? null,
          location: (profile as any)?.location ?? null,
          skills: (mentor as any).skills ?? [],
          status: (mentor as any).status,
          booking_url: (mentor as any).booking_url ?? null,
        }
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ── Current Mentor Data ──────────────────────────────────────────────────

  /**
   * GET /api/mentors/current
   * Get current authenticated user's mentor data
   */
  app.get('/api/mentors/current', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing token' });
      }
      const token = authHeader.slice(7);
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !user) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Get mentor data for current user
      const { data: mentor, error } = await supabaseAdmin
        .from('mentors')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) return res.status(500).json({ success: false, message: error.message });
      if (!mentor) return res.status(404).json({ success: false, message: 'Mentor profile not found' });

      return res.json(mentor);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * PATCH /api/mentors/current/profile
   * Mentor self-updates their own profile (bio, skills, availability, booking_url, max_concurrent_teams, status)
   */
  app.patch('/api/mentors/current/profile', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) return res.status(503).json({ success: false, message: 'Server not configured' });
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
      const token = authHeader.slice(7);
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !user) return res.status(401).json({ success: false, message: 'Invalid token' });

      const { bio, skills, availability, booking_url, max_concurrent_teams, status } = req.body;
      const now = new Date().toISOString();

      // Update mentors table
      const mentorPatch: any = { updated_at: now };
      if (skills !== undefined) mentorPatch.skills = skills;
      if (availability !== undefined) mentorPatch.availability = availability;
      if (booking_url !== undefined) mentorPatch.booking_url = booking_url || null;
      if (max_concurrent_teams !== undefined) mentorPatch.max_concurrent_teams = Number(max_concurrent_teams);
      if (status !== undefined) mentorPatch.status = status;

      const { data: mentor, error: mentorErr } = await supabaseAdmin
        .from('mentors')
        .update(mentorPatch)
        .eq('user_id', user.id)
        .select()
        .single();

      if (mentorErr) return res.status(500).json({ success: false, message: mentorErr.message });

      // Update bio on profiles if provided
      if (bio !== undefined) {
        await supabaseAdmin
          .from('profiles')
          .update({ bio, updated_at: now })
          .eq('id', user.id);
      }

      return res.json({ success: true, data: mentor });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * GET /api/mentors/:mentorId
   * Public mentor profile for gallery deep-link (PRD public view).
   */
  app.get('/api/mentors/:mentorId', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const { mentorId } = req.params;
      const { data, error } = await supabaseAdmin
        .from('mentors')
        .select('*, profiles!inner(full_name, avatar_url, bio, username, location)')
        .eq('id', mentorId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) return res.status(500).json({ success: false, message: error.message });
      if (!data) return res.status(404).json({ success: false, message: 'Mentor not found' });

      const m = data as any;
      const p = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
      const mentor = {
        id: m.id,
        name: p?.full_name ?? null,
        username: p?.username ?? null,
        location: p?.location ?? null,
        avatar_url: p?.avatar_url ?? null,
        bio: p?.bio ?? null,
        skills: m.skills ?? [],
        status: m.status,
        availability: m.availability ?? [],
        total_mentorship_hours: m.total_mentorship_hours ?? 0,
        booking_url: m.booking_url ?? null,
        max_concurrent_teams: m.max_concurrent_teams ?? 3,
      };

      return res.json({ success: true, mentor });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * GET /api/mentors/current/help-inbox
   * In-app rows for new help requests (requires mentor_help_request_inbox table).
   */
  app.get('/api/mentors/current/help-inbox', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing token' });
      }
      const token = authHeader.slice(7);
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !user) return res.status(401).json({ success: false, message: 'Invalid token' });

      const { data: rows, error } = await supabaseAdmin
        .from('mentor_help_request_inbox')
        .select('id, session_id, read_at, created_at, mentorship_sessions(problem_description, status, team_id, requested_time)')
        .eq('mentor_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.warn('[mentors] help-inbox query:', error.message);
        return res.json({ success: true, items: [], unread_count: 0 });
      }

      const items = rows ?? [];
      const unread_count = items.filter((r: any) => !r.read_at).length;
      return res.json({ success: true, items, unread_count });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * PATCH /api/mentors/current/help-inbox/:sessionId/read
   */
  app.patch('/api/mentors/current/help-inbox/:sessionId/read', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const { sessionId } = req.params;
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing token' });
      }
      const token = authHeader.slice(7);
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !user) return res.status(401).json({ success: false, message: 'Invalid token' });

      const now = new Date().toISOString();
      const { error } = await supabaseAdmin
        .from('mentor_help_request_inbox')
        .update({ read_at: now })
        .eq('mentor_user_id', user.id)
        .eq('session_id', sessionId);

      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ── Mentor Availability ──────────────────────────────────────────────────

  /**
   * GET /api/mentors/:mentorId/availability
   * Get mentor availability slots
   */
  app.get('/api/mentors/:mentorId/availability', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const { mentorId } = req.params;
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing token' });
      }
      const token = authHeader.slice(7);
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !user) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Only the mentor themselves or an admin can view availability
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      const isAdmin = profile?.role === 'admin';

      const { data: mentorRow, error: rowErr } = await supabaseAdmin
        .from('mentors')
        .select('user_id')
        .eq('id', mentorId)
        .maybeSingle();
      if (rowErr) return res.status(500).json({ success: false, message: rowErr.message });
      if (!mentorRow) return res.status(404).json({ success: false, message: 'Mentor not found' });

      const isSelf = mentorRow.user_id === user.id;

      if (!isSelf && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const { data: mentor, error } = await supabaseAdmin
        .from('mentors')
        .select('availability')
        .eq('id', mentorId)
        .maybeSingle();

      if (error) return res.status(500).json({ success: false, message: error.message });
      if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });

      return res.json({ availability: mentor.availability ?? [] });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * PUT /api/mentors/:mentorId/availability
   * Update mentor availability slots
   */
  app.put('/api/mentors/:mentorId/availability', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const { mentorId } = req.params;
      const { availability } = req.body;

      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing token' });
      }
      const token = authHeader.slice(7);
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !user) return res.status(401).json({ success: false, message: 'Invalid token' });

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      const isAdmin = profile?.role === 'admin';

      const { data: mentorRow, error: rowErr } = await supabaseAdmin
        .from('mentors')
        .select('user_id')
        .eq('id', mentorId)
        .maybeSingle();
      if (rowErr) return res.status(500).json({ success: false, message: rowErr.message });
      if (!mentorRow) return res.status(404).json({ success: false, message: 'Mentor not found' });

      const isSelf = mentorRow.user_id === user.id;

      if (!isSelf && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const { error } = await supabaseAdmin
        .from('mentors')
        .update({ availability: availability ?? [], updated_at: new Date().toISOString() })
        .eq('id', mentorId);

      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * PATCH /api/mentors/:mentorId/settings
   * Update booking_url and max_concurrent_teams (PRD mentor fields).
   */
  app.patch('/api/mentors/:mentorId/settings', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const { mentorId } = req.params;
      const { booking_url, max_concurrent_teams } = req.body as {
        booking_url?: string | null;
        max_concurrent_teams?: number;
      };

      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing token' });
      }
      const token = authHeader.slice(7);
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !user) return res.status(401).json({ success: false, message: 'Invalid token' });

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      const isAdmin = profile?.role === 'admin';

      const { data: mentorRow, error: rowErr } = await supabaseAdmin
        .from('mentors')
        .select('user_id')
        .eq('id', mentorId)
        .maybeSingle();
      if (rowErr) return res.status(500).json({ success: false, message: rowErr.message });
      if (!mentorRow) return res.status(404).json({ success: false, message: 'Mentor not found' });

      const isSelf = mentorRow.user_id === user.id;
      if (!isSelf && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (booking_url !== undefined) {
        patch.booking_url = booking_url === '' || booking_url === null ? null : String(booking_url).trim();
      }
      if (max_concurrent_teams !== undefined) {
        const n = Number(max_concurrent_teams);
        if (!Number.isFinite(n) || n < 1 || n > 50) {
          return res.status(400).json({ success: false, message: 'max_concurrent_teams must be between 1 and 50' });
        }
        patch.max_concurrent_teams = Math.floor(n);
      }

      if (Object.keys(patch).length <= 1) {
        return res.status(400).json({ success: false, message: 'No valid fields to update' });
      }

      const { data: updated, error } = await supabaseAdmin
        .from('mentors')
        .update(patch)
        .eq('id', mentorId)
        .select()
        .single();

      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.json({ success: true, mentor: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ── Mentor Status ────────────────────────────────────────────────────────

  /**
   * GET /api/mentors/:mentorId/status
   * Get mentor availability status
   */
  app.get('/api/mentors/:mentorId/status', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const { mentorId } = req.params;

      const { data: mentor, error } = await supabaseAdmin
        .from('mentors')
        .select('status, is_active, max_concurrent_teams')
        .eq('id', mentorId)
        .maybeSingle();

      if (error) return res.status(500).json({ success: false, message: error.message });
      if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });

      return res.json({
        status: mentor.status,
        is_active: mentor.is_active,
        max_concurrent_teams: mentor.max_concurrent_teams,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ── Mentor Sessions ──────────────────────────────────────────────────────

  /**
   * GET /api/mentors/:mentorId/sessions
   * Get mentor sessions (authenticated, mentor or admin only)
   * Requirements: 8.5
   */
  app.get('/api/mentors/:mentorId/sessions', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const { mentorId } = req.params;

      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing token' });
      }
      const token = authHeader.slice(7);
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !user) return res.status(401).json({ success: false, message: 'Invalid token' });

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      const isAdmin = profile?.role === 'admin';

      // Check if the authenticated user is the mentor
      const { data: mentorRow } = await supabaseAdmin
        .from('mentors')
        .select('user_id')
        .eq('id', mentorId)
        .maybeSingle();

      const isMentor = mentorRow?.user_id === user.id;

      if (!isMentor && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const { data: sessions, error } = await supabaseAdmin
        .from('mentorship_sessions')
        .select('*')
        .eq('mentor_id', mentorId)
        .order('created_at', { ascending: false });

      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.json({ sessions: sessions ?? [] });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * POST /api/mentors/:mentorId/request
   * Request a mentorship session
   * Requirements: 7.8, 8.1
   */
  app.post('/api/mentors/:mentorId/request', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const { mentorId } = req.params;
      const { teamId, problemDescription, requestedTime } = req.body;

      if (!problemDescription) {
        return res.status(400).json({ success: false, message: 'problemDescription is required' });
      }

      let requesterUserId: string | null = null;
      let requesterEmail: string | null = null;
      const authHeader = req.headers['authorization'];
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        const { data: { user } } = await supabaseAdmin.auth.getUser(token);
        if (user) {
          requesterUserId = user.id;
          requesterEmail = user.email ?? null;
        }
      }

      // Verify mentor exists and is active; load profile for notifications
      const { data: mentor, error: mentorError } = await supabaseAdmin
        .from('mentors')
        .select('id, is_active, user_id, profiles(full_name, email)')
        .eq('id', mentorId)
        .maybeSingle();

      if (mentorError) return res.status(500).json({ success: false, message: mentorError.message });
      if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });
      if (!mentor.is_active) return res.status(400).json({ success: false, message: 'Mentor is not currently active' });

      const { data: session, error } = await supabaseAdmin
        .from('mentorship_sessions')
        .insert({
          mentor_id: mentorId,
          team_id: teamId ?? null,
          problem_description: problemDescription,
          requested_time: requestedTime ?? null,
          status: 'pending',
          mentee_id: requesterUserId ?? null,
        })
        .select()
        .single();

      if (error) return res.status(500).json({ success: false, message: error.message });

      const prof = Array.isArray(mentor.profiles) ? mentor.profiles[0] : mentor.profiles;
      void notifyMentorHelpRequest({
        supabaseAdmin,
        mentorId,
        mentorUserId: mentor.user_id,
        mentorName: prof?.full_name ?? '',
        mentorEmail: prof?.email ?? null,
        sessionId: session.id,
        problemDescription,
        requestedTime: requestedTime ?? null,
        teamId: teamId != null ? Number(teamId) : null,
        requesterUserId,
        requesterEmail,
      });

      return res.status(201).json({ success: true, sessionId: session.id });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ── Session Lifecycle ────────────────────────────────────────────────────

  /**
   * POST /api/mentors/sessions/:sessionId/accept
   * Accept a pending session
   * Requirements: 8.2
   */
  app.post('/api/mentors/sessions/:sessionId/accept', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const { sessionId } = req.params;

      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing token' });
      }
      const token = authHeader.slice(7);
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !user) return res.status(401).json({ success: false, message: 'Invalid token' });

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.role !== 'mentor' && profile?.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      // Get the session
      const { data: session, error: sessionError } = await supabaseAdmin
        .from('mentorship_sessions')
        .select('*, mentors!inner(user_id)')
        .eq('id', sessionId)
        .maybeSingle();

      if (sessionError) return res.status(500).json({ success: false, message: sessionError.message });
      if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

      // Only the assigned mentor or admin can accept
      const isMentor = session.mentors?.user_id === user.id;
      const isAdmin = profile?.role === 'admin';
      if (!isMentor && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const now = new Date().toISOString();

      // Update session status
      const { error: updateError } = await supabaseAdmin
        .from('mentorship_sessions')
        .update({ status: 'active', started_at: now })
        .eq('id', sessionId);

      if (updateError) return res.status(500).json({ success: false, message: updateError.message });

      // Update mentor status to in_session
      await supabaseAdmin
        .from('mentors')
        .update({ status: 'in_session', updated_at: now })
        .eq('id', session.mentor_id);

      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * POST /api/mentors/sessions/:sessionId/complete
   * Complete an active session
   * Requirements: 8.3
   */
  app.post('/api/mentors/sessions/:sessionId/complete', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const { sessionId } = req.params;

      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing token' });
      }
      const token = authHeader.slice(7);
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !user) return res.status(401).json({ success: false, message: 'Invalid token' });

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.role !== 'mentor' && profile?.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      // Get the session
      const { data: session, error: sessionError } = await supabaseAdmin
        .from('mentorship_sessions')
        .select('*, mentors!inner(user_id, total_mentorship_hours)')
        .eq('id', sessionId)
        .maybeSingle();

      if (sessionError) return res.status(500).json({ success: false, message: sessionError.message });
      if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

      const isMentor = session.mentors?.user_id === user.id;
      const isAdmin = profile?.role === 'admin';
      if (!isMentor && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const now = new Date();
      const startedAt = session.started_at ? new Date(session.started_at) : now;
      const durationSeconds = Math.max(0, (now.getTime() - startedAt.getTime()) / 1000);
      const durationMinutes = Math.ceil(durationSeconds / 60);
      const hoursIncrement = Math.ceil(durationMinutes / 60);

      const { error: updateError } = await supabaseAdmin
        .from('mentorship_sessions')
        .update({
          status: 'completed',
          ended_at: now.toISOString(),
          duration_minutes: durationMinutes,
        })
        .eq('id', sessionId);

      if (updateError) return res.status(500).json({ success: false, message: updateError.message });

      // Increment mentor's total_mentorship_hours and reset status
      const currentHours = session.mentors?.total_mentorship_hours ?? 0;
      await supabaseAdmin
        .from('mentors')
        .update({
          status: 'available',
          total_mentorship_hours: currentHours + hoursIncrement,
          updated_at: now.toISOString(),
        })
        .eq('id', session.mentor_id);

      return res.json({ success: true, duration_minutes: durationMinutes });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * POST /api/mentors/sessions/:sessionId/cancel
   * Cancel a session
   * Requirements: 8.4
   */
  app.post('/api/mentors/sessions/:sessionId/cancel', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const { sessionId } = req.params;

      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing token' });
      }
      const token = authHeader.slice(7);
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !user) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Get the session
      const { data: session, error: sessionError } = await supabaseAdmin
        .from('mentorship_sessions')
        .select('*, mentors!inner(user_id, status)')
        .eq('id', sessionId)
        .maybeSingle();

      if (sessionError) return res.status(500).json({ success: false, message: sessionError.message });
      if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

      const { error: updateError } = await supabaseAdmin
        .from('mentorship_sessions')
        .update({ status: 'cancelled' })
        .eq('id', sessionId);

      if (updateError) return res.status(500).json({ success: false, message: updateError.message });

      // If mentor was in_session, reset to available
      if (session.mentors?.status === 'in_session') {
        await supabaseAdmin
          .from('mentors')
          .update({ status: 'available', updated_at: new Date().toISOString() })
          .eq('id', session.mentor_id);
      }

      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });
}
