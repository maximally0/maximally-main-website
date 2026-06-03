/**
 * Judge Profiles API Routes
 * Global judge pool + hackathon assignment management
 */
import type { Express, Request, Response } from 'express';

const MENTOR_TITLE_PREFIX = '[MENTOR]';

function isMentorProfile(profile: any): boolean {
  return typeof profile?.title === 'string' && profile.title.startsWith(MENTOR_TITLE_PREFIX);
}

function toMentorTitle(title?: string): string {
  const cleanTitle = String(title || '').replace(MENTOR_TITLE_PREFIX, '').trim();
  return cleanTitle ? `${MENTOR_TITLE_PREFIX} ${cleanTitle}` : MENTOR_TITLE_PREFIX;
}

function stripMentorTitle(profile: any): any {
  if (!profile) return profile;
  return {
    ...profile,
    title: String(profile.title || '').replace(MENTOR_TITLE_PREFIX, '').trim(),
    type: 'mentor',
  };
}

async function requireAdmin(supabaseAdmin: any, req: Request): Promise<string | null> {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) return null;
  const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.slice(7));
  if (!user) return null;
  const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') return null;
  return user.id;
}

export function registerJudgeProfileRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as any;
  if (!supabaseAdmin) return;

  // GET /api/judge-profiles — list all judge profiles
  app.get('/api/judge-profiles', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('judge_profiles')
        .select('*')
        .order('name', { ascending: true });
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true, data: (data || []).filter((profile: any) => !isMentorProfile(profile)) });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // POST /api/judge-profiles — create a judge profile (admin only)
  app.post('/api/judge-profiles', async (req: Request, res: Response) => {
    try {
      const userId = await requireAdmin(supabaseAdmin, req);
      if (!userId) return res.status(403).json({ success: false, message: 'Forbidden' });

      const { name, email, title, profile_photo, link } = req.body;
      if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email are required' });

      const { data, error } = await supabaseAdmin
        .from('judge_profiles')
        .insert({ name, email, title, profile_photo, link })
        .select()
        .single();
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.status(201).json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // PATCH /api/judge-profiles/:id — update a judge profile (admin only)
  app.patch('/api/judge-profiles/:id', async (req: Request, res: Response) => {
    try {
      const userId = await requireAdmin(supabaseAdmin, req);
      if (!userId) return res.status(403).json({ success: false, message: 'Forbidden' });

      const { data, error } = await supabaseAdmin
        .from('judge_profiles')
        .update({ ...req.body, updated_at: new Date().toISOString() })
        .eq('id', req.params.id)
        .select()
        .single();
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // DELETE /api/judge-profiles/:id — delete a judge profile (admin only)
  app.delete('/api/judge-profiles/:id', async (req: Request, res: Response) => {
    try {
      const userId = await requireAdmin(supabaseAdmin, req);
      if (!userId) return res.status(403).json({ success: false, message: 'Forbidden' });

      const { error } = await supabaseAdmin
        .from('judge_profiles')
        .delete()
        .eq('id', req.params.id);
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // GET /api/judge-profiles/:id/hackathons — get hackathons assigned to a judge
  app.get('/api/judge-profiles/:id/hackathons', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('hackathon_judge_assignments')
        .select('hackathon_id, organizer_hackathons(id, hackathon_name, slug)')
        .eq('judge_id', req.params.id);
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true, data: data || [] });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // POST /api/judge-profiles/:id/assign — assign judge to hackathon(s) (admin only)
  app.post('/api/judge-profiles/:id/assign', async (req: Request, res: Response) => {
    try {
      const userId = await requireAdmin(supabaseAdmin, req);
      if (!userId) return res.status(403).json({ success: false, message: 'Forbidden' });

      const { hackathon_ids } = req.body; // array of hackathon IDs
      if (!hackathon_ids || !Array.isArray(hackathon_ids)) {
        return res.status(400).json({ success: false, message: 'hackathon_ids array required' });
      }

      const rows = hackathon_ids.map((hid: number) => ({
        judge_id: parseInt(req.params.id),
        hackathon_id: hid,
      }));

      const { data, error } = await supabaseAdmin
        .from('hackathon_judge_assignments')
        .upsert(rows, { onConflict: 'judge_id,hackathon_id' })
        .select();
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // DELETE /api/judge-profiles/:id/unassign/:hackathonId — remove judge from hackathon
  app.delete('/api/judge-profiles/:id/unassign/:hackathonId', async (req: Request, res: Response) => {
    try {
      const userId = await requireAdmin(supabaseAdmin, req);
      if (!userId) return res.status(403).json({ success: false, message: 'Forbidden' });

      const { error } = await supabaseAdmin
        .from('hackathon_judge_assignments')
        .delete()
        .eq('judge_id', req.params.id)
        .eq('hackathon_id', req.params.hackathonId);
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // GET /api/hackathons/:hackathonId/judge-profiles — get judges for a hackathon (public)
  app.get('/api/hackathons/:hackathonId/judge-profiles', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('hackathon_judge_assignments')
        .select('judge_id, judge_profiles(id, name, email, title, profile_photo, link)')
        .eq('hackathon_id', req.params.hackathonId);
      if (error) return res.status(500).json({ success: false, message: error.message });
      const judges = (data || [])
        .map((row: any) => row.judge_profiles)
        .filter((profile: any) => profile && !isMentorProfile(profile));
      return res.json({ success: true, data: judges });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // GET /api/hackathons/:hackathonId/mentor-profiles — get mentors for a hackathon (public)
  // Uses the same profile + assignment tables as judges because this DB has no
  // dedicated per-hackathon mentor CMS table.
  app.get('/api/hackathons/:hackathonId/mentor-profiles', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('hackathon_judge_assignments')
        .select('judge_id, judge_profiles(id, name, email, title, profile_photo, link)')
        .eq('hackathon_id', req.params.hackathonId);
      if (error) return res.status(500).json({ success: false, message: error.message });
      const mentors = (data || [])
        .map((row: any) => row.judge_profiles)
        .filter(isMentorProfile)
        .map(stripMentorTitle);
      return res.json({ success: true, data: mentors });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // POST /api/mentor-profiles — create a mentor profile (admin only)
  app.post('/api/mentor-profiles', async (req: Request, res: Response) => {
    try {
      const userId = await requireAdmin(supabaseAdmin, req);
      if (!userId) return res.status(403).json({ success: false, message: 'Forbidden' });

      const { name, email, title, profile_photo, link } = req.body;
      if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email are required' });

      const { data, error } = await supabaseAdmin
        .from('judge_profiles')
        .insert({ name, email, title: toMentorTitle(title), profile_photo, link })
        .select()
        .single();
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.status(201).json({ success: true, data: stripMentorTitle(data) });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // PATCH /api/mentor-profiles/:id — update a mentor profile (admin only)
  app.patch('/api/mentor-profiles/:id', async (req: Request, res: Response) => {
    try {
      const userId = await requireAdmin(supabaseAdmin, req);
      if (!userId) return res.status(403).json({ success: false, message: 'Forbidden' });

      const { name, email, title, profile_photo, link } = req.body;
      const patch = {
        name,
        email,
        title: toMentorTitle(title),
        profile_photo,
        link,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from('judge_profiles')
        .update(patch)
        .eq('id', req.params.id)
        .select()
        .single();
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true, data: stripMentorTitle(data) });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // POST /api/mentor-profiles/:id/assign — assign mentor to hackathon(s) (admin only)
  app.post('/api/mentor-profiles/:id/assign', async (req: Request, res: Response) => {
    try {
      const userId = await requireAdmin(supabaseAdmin, req);
      if (!userId) return res.status(403).json({ success: false, message: 'Forbidden' });

      const { hackathon_ids } = req.body;
      if (!hackathon_ids || !Array.isArray(hackathon_ids)) {
        return res.status(400).json({ success: false, message: 'hackathon_ids array required' });
      }

      const rows = hackathon_ids.map((hid: number) => ({
        judge_id: parseInt(req.params.id),
        hackathon_id: hid,
      }));

      const { data, error } = await supabaseAdmin
        .from('hackathon_judge_assignments')
        .upsert(rows, { onConflict: 'judge_id,hackathon_id' })
        .select();
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // DELETE /api/mentor-profiles/:id/unassign/:hackathonId — remove mentor from hackathon
  app.delete('/api/mentor-profiles/:id/unassign/:hackathonId', async (req: Request, res: Response) => {
    try {
      const userId = await requireAdmin(supabaseAdmin, req);
      if (!userId) return res.status(403).json({ success: false, message: 'Forbidden' });

      const { error } = await supabaseAdmin
        .from('hackathon_judge_assignments')
        .delete()
        .eq('judge_id', req.params.id)
        .eq('hackathon_id', req.params.hackathonId);
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });
}
