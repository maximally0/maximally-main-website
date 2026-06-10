/**
 * Reputation & Platform Features API Routes
 * Handles: tier evaluation, outcomes, showcase, activity feed, platform stats
 */
import type { Express, Request, Response } from 'express';

async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

async function requireAdmin(supabaseAdmin: any, req: Request): Promise<string | null> {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) return null;
  const userId = await bearerUserId(supabaseAdmin, authHeader.slice(7));
  if (!userId) return null;
  const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', userId).maybeSingle();
  if (profile?.role !== 'admin') return null;
  return userId;
}

export function registerReputationRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as any;
  if (!supabaseAdmin) return;

  // ═══ OUTCOMES ═══

  // GET /api/outcomes — public list of verified outcomes
  app.get('/api/outcomes', async (_req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('builder_outcomes')
        .select('*, profiles(full_name, username, avatar_url, reputation_tier)')
        .eq('is_public', true)
        .not('verified_at', 'is', null)
        .order('verified_at', { ascending: false });
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true, data: data || [] });
    } catch (err: any) { return res.status(500).json({ success: false, message: err.message }); }
  });

  // POST /api/outcomes — builder submits an outcome
  app.post('/api/outcomes', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const userId = await bearerUserId(supabaseAdmin, authHeader.slice(7));
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      const { outcome_type, description, related_event_id } = req.body;
      if (!outcome_type || !description) return res.status(400).json({ success: false, message: 'Type and description required' });

      const { data, error } = await supabaseAdmin.from('builder_outcomes').insert({
        user_id: userId, outcome_type, description, related_event_id: related_event_id || null,
        is_public: false, verified_at: null
      }).select().single();
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.status(201).json({ success: true, data });
    } catch (err: any) { return res.status(500).json({ success: false, message: err.message }); }
  });

  // PATCH /api/outcomes/:id/verify — admin verifies
  app.patch('/api/outcomes/:id/verify', async (req: Request, res: Response) => {
    try {
      if (!await requireAdmin(supabaseAdmin, req)) return res.status(403).json({ success: false, message: 'Forbidden' });
      const { data, error } = await supabaseAdmin.from('builder_outcomes')
        .update({ verified_at: new Date().toISOString(), is_public: true })
        .eq('id', req.params.id).select().single();
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true, data });
    } catch (err: any) { return res.status(500).json({ success: false, message: err.message }); }
  });


  // ═══ SHOWCASE ═══

  // GET /api/showcase — public showcase projects
  app.get('/api/showcase', async (_req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('showcase_projects')
        .select('*, hackathon_submissions(id, project_name, description, demo_url, github_url, video_url, track, user_id, profiles:user_id(full_name, username, reputation_tier)), organizer_hackathons:event_id(hackathon_name, slug)')
        .order('featured_at', { ascending: false })
        .limit(12);
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true, data: data || [] });
    } catch (err: any) { return res.status(500).json({ success: false, message: err.message }); }
  });

  // POST /api/showcase — admin adds project to showcase
  app.post('/api/showcase', async (req: Request, res: Response) => {
    try {
      if (!await requireAdmin(supabaseAdmin, req)) return res.status(403).json({ success: false, message: 'Forbidden' });
      const { project_id, event_id, placement, highlight_description } = req.body;
      if (!project_id) return res.status(400).json({ success: false, message: 'project_id required' });
      const { data, error } = await supabaseAdmin.from('showcase_projects').insert({ project_id, event_id, placement, highlight_description }).select().single();
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.status(201).json({ success: true, data });
    } catch (err: any) { return res.status(500).json({ success: false, message: err.message }); }
  });

  // DELETE /api/showcase/:id — admin removes
  app.delete('/api/showcase/:id', async (req: Request, res: Response) => {
    try {
      if (!await requireAdmin(supabaseAdmin, req)) return res.status(403).json({ success: false, message: 'Forbidden' });
      await supabaseAdmin.from('showcase_projects').delete().eq('id', req.params.id);
      return res.json({ success: true });
    } catch (err: any) { return res.status(500).json({ success: false, message: err.message }); }
  });

  // ═══ ACTIVITY FEED ═══

  // GET /api/feed — public activity feed
  app.get('/api/feed', async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = 20;
      const from = (page - 1) * pageSize;

      const { data, error, count } = await supabaseAdmin
        .from('activity_feed')
        .select('*, profiles:user_id(full_name, username, avatar_url, reputation_tier)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, from + pageSize - 1);
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true, data: data || [], total: count || 0, page, pageSize });
    } catch (err: any) { return res.status(500).json({ success: false, message: err.message }); }
  });

  // ═══ PLATFORM STATS ═══

  // GET /api/platform-stats — latest snapshot
  app.get('/api/platform-stats', async (_req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('platform_stats_snapshot')
        .select('*')
        .order('snapshot_at', { ascending: false })
        .limit(1)
        .single();
      if (error && error.code !== 'PGRST116') return res.status(500).json({ success: false, message: error.message });
      // If no snapshot, compute live
      if (!data) {
        const [profiles, events, submissions] = await Promise.all([
          supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
          supabaseAdmin.from('organizer_hackathons').select('id', { count: 'exact', head: true }).eq('status', 'published'),
          supabaseAdmin.from('hackathon_submissions').select('id', { count: 'exact', head: true }),
        ]);
        return res.json({ success: true, data: { total_active_builders: profiles.count || 0, total_events_run: events.count || 0, total_projects_submitted: submissions.count || 0, total_countries_represented: 15 } });
      }
      return res.json({ success: true, data });
    } catch (err: any) { return res.status(500).json({ success: false, message: err.message }); }
  });

  // ═══ TIER EVALUATION ═══

  // POST /api/reputation/evaluate/:userId — re-evaluate a user's tier (admin or system)
  app.post('/api/reputation/evaluate/:userId', async (req: Request, res: Response) => {
    try {
      if (!await requireAdmin(supabaseAdmin, req)) return res.status(403).json({ success: false, message: 'Forbidden' });
      const { userId } = req.params;
      const { data: profile } = await supabaseAdmin.from('profiles').select('projects_submitted, projects_placed, peer_reviews_given, reputation_tier').eq('id', userId).single();
      if (!profile) return res.status(404).json({ success: false, message: 'User not found' });

      const { data: rules } = await supabaseAdmin.from('tier_promotion_rules').select('*').order('min_projects_submitted', { ascending: false });
      if (!rules) return res.json({ success: true, tier: profile.reputation_tier });

      // Find highest qualifying tier (exclude council — admin-only)
      let newTier = 'newcomer';
      for (const rule of rules) {
        if (rule.requires_admin_approval) continue;
        if (profile.projects_submitted >= rule.min_projects_submitted &&
            profile.projects_placed >= rule.min_projects_placed &&
            profile.peer_reviews_given >= rule.min_peer_reviews) {
          newTier = rule.tier_name;
          break;
        }
      }

      if (newTier !== profile.reputation_tier) {
        await supabaseAdmin.from('profiles').update({ reputation_tier: newTier, tier_updated_at: new Date().toISOString() }).eq('id', userId);
      }
      return res.json({ success: true, tier: newTier, changed: newTier !== profile.reputation_tier });
    } catch (err: any) { return res.status(500).json({ success: false, message: err.message }); }
  });

  // POST /api/reputation/promote-council/:userId — admin assigns council tier
  app.post('/api/reputation/promote-council/:userId', async (req: Request, res: Response) => {
    try {
      if (!await requireAdmin(supabaseAdmin, req)) return res.status(403).json({ success: false, message: 'Forbidden' });
      const { userId } = req.params;
      const { data, error } = await supabaseAdmin.from('profiles').update({
        reputation_tier: 'council', tier_updated_at: new Date().toISOString(), council_assigned_at: new Date().toISOString()
      }).eq('id', userId).select().single();
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true, data });
    } catch (err: any) { return res.status(500).json({ success: false, message: err.message }); }
  });

  // ═══ PEER REVIEWS ═══

  // POST /api/peer-reviews — submit a peer review
  app.post('/api/peer-reviews', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const userId = await bearerUserId(supabaseAdmin, authHeader.slice(7));
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      const { submission_id, hackathon_id, score, feedback } = req.body;
      if (!submission_id || !score) return res.status(400).json({ success: false, message: 'submission_id and score required' });

      const { data, error } = await supabaseAdmin.from('peer_reviews').insert({
        reviewer_id: userId, submission_id, hackathon_id, score, feedback
      }).select().single();
      if (error) return res.status(500).json({ success: false, message: error.message });

      // Increment reviewer's peer_reviews_given
      const { data: currentProfile } = await supabaseAdmin.from('profiles').select('peer_reviews_given').eq('id', userId).single();
      await supabaseAdmin.from('profiles').update({ peer_reviews_given: (currentProfile?.peer_reviews_given || 0) + 1 }).eq('id', userId);

      return res.status(201).json({ success: true, data });
    } catch (err: any) { return res.status(500).json({ success: false, message: err.message }); }
  });
}
