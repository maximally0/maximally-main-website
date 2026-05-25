/**
 * Resources API Routes
 * Serves podcasts, interviews, and builder stories from the database.
 * Admin users can create/update/delete entries.
 */

import type { Express, Request, Response } from 'express';

export function registerResourceRoutes(app: Express): void {
  const getSupabase = (req: Request) => req.app.locals.supabaseAdmin;

  // ═══════════════════════════════════════════
  // ADMIN: LIST USERS
  // ═══════════════════════════════════════════

  app.get('/api/admin/users', async (req: Request, res: Response) => {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { data: { user } } = await supabase.auth.getUser(authHeader.slice(7));
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

      const { data, error } = await supabase.from('profiles').select('id, username, full_name, email, role, admin_role, avatar_url, created_at').order('created_at', { ascending: false }).limit(200);
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.json({ success: true, data: data ?? [] });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ═══════════════════════════════════════════
  // NEWSLETTER SUBSCRIBERS (admin list)
  // ═══════════════════════════════════════════

  app.get('/api/newsletter/subscribers', async (req: Request, res: Response) => {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { data: { user } } = await supabase.auth.getUser(authHeader.slice(7));
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

      const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }).limit(500);
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.json({ success: true, data: data ?? [] });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ═══════════════════════════════════════════
  // PODCASTS
  // ═══════════════════════════════════════════

  // GET /api/podcasts — public, list all published podcasts
  app.get('/api/podcasts', async (req: Request, res: Response) => {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const { category } = req.query;
      let query = supabase
        .from('podcasts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (category && category !== 'All Episodes') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.json({ success: true, data: data ?? [] });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // POST /api/podcasts — admin only, create podcast
  app.post('/api/podcasts', async (req: Request, res: Response) => {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { data: { user } } = await supabase.auth.getUser(authHeader.slice(7));
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

      const { data, error } = await supabase.from('podcasts').insert(req.body).select().single();
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.status(201).json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // PATCH /api/podcasts/:id — admin only, update podcast
  app.patch('/api/podcasts/:id', async (req: Request, res: Response) => {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { data: { user } } = await supabase.auth.getUser(authHeader.slice(7));
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

      const { data, error } = await supabase.from('podcasts').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', req.params.id).select().single();
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // DELETE /api/podcasts/:id — admin only
  app.delete('/api/podcasts/:id', async (req: Request, res: Response) => {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { data: { user } } = await supabase.auth.getUser(authHeader.slice(7));
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

      const { error } = await supabase.from('podcasts').delete().eq('id', req.params.id);
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ═══════════════════════════════════════════
  // INTERVIEWS
  // ═══════════════════════════════════════════

  app.get('/api/interviews', async (req: Request, res: Response) => {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const { category } = req.query;
      let query = supabase
        .from('interviews')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (category && category !== 'All Interviews') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.json({ success: true, data: data ?? [] });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  app.post('/api/interviews', async (req: Request, res: Response) => {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { data: { user } } = await supabase.auth.getUser(authHeader.slice(7));
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

      const { data, error } = await supabase.from('interviews').insert(req.body).select().single();
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.status(201).json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  app.patch('/api/interviews/:id', async (req: Request, res: Response) => {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { data: { user } } = await supabase.auth.getUser(authHeader.slice(7));
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

      const { data, error } = await supabase.from('interviews').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', req.params.id).select().single();
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  app.delete('/api/interviews/:id', async (req: Request, res: Response) => {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { data: { user } } = await supabase.auth.getUser(authHeader.slice(7));
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

      const { error } = await supabase.from('interviews').delete().eq('id', req.params.id);
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ═══════════════════════════════════════════
  // BUILDER STORIES
  // ═══════════════════════════════════════════

  app.get('/api/builder-stories', async (req: Request, res: Response) => {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const { stage, category } = req.query;
      let query = supabase
        .from('builder_stories')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (stage && stage !== 'All') {
        query = query.eq('stage', stage);
      }
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.json({ success: true, data: data ?? [] });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  app.post('/api/builder-stories', async (req: Request, res: Response) => {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { data: { user } } = await supabase.auth.getUser(authHeader.slice(7));
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

      const { data, error } = await supabase.from('builder_stories').insert(req.body).select().single();
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.status(201).json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  app.patch('/api/builder-stories/:id', async (req: Request, res: Response) => {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { data: { user } } = await supabase.auth.getUser(authHeader.slice(7));
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

      const { data, error } = await supabase.from('builder_stories').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', req.params.id).select().single();
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  app.delete('/api/builder-stories/:id', async (req: Request, res: Response) => {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(503).json({ success: false, message: 'Server not configured' });

    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { data: { user } } = await supabase.auth.getUser(authHeader.slice(7));
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

      const { error } = await supabase.from('builder_stories').delete().eq('id', req.params.id);
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });
}
