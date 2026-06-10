/**
 * Expert Submissions API
 * Experts submit articles/webinars/tutorials for editorial review
 */
import type { Express, Request, Response } from 'express';

async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

export function registerExpertSubmissionsRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as any;
  if (!supabaseAdmin) return;

  // GET /api/expert-submissions — list published submissions (public)
  app.get('/api/expert-submissions', async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string || 'published';
      let query = supabaseAdmin.from('expert_submissions')
        .select('*, profiles:author_id(full_name, username, avatar_url, reputation_tier)')
        .order('published_at', { ascending: false });
      
      if (status !== 'all') query = query.eq('status', status);
      
      const { data, error } = await query;
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true, data: data || [] });
    } catch (err: any) { return res.status(500).json({ success: false, message: err.message }); }
  });

  // POST /api/expert-submissions — submit for review (auth required)
  app.post('/api/expert-submissions', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const userId = await bearerUserId(supabaseAdmin, authHeader.slice(7));
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      const { type, title, abstract, topic_area, content_url } = req.body;
      if (!type || !title) return res.status(400).json({ success: false, message: 'Type and title required' });

      const { data, error } = await supabaseAdmin.from('expert_submissions').insert({
        author_id: userId, type, title, abstract, topic_area, content_url, status: 'pending'
      }).select().single();
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.status(201).json({ success: true, data });
    } catch (err: any) { return res.status(500).json({ success: false, message: err.message }); }
  });

  // GET /api/expert-submissions/my — get current user's submissions
  app.get('/api/expert-submissions/my', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const userId = await bearerUserId(supabaseAdmin, authHeader.slice(7));
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      const { data, error } = await supabaseAdmin.from('expert_submissions')
        .select('*').eq('author_id', userId).order('created_at', { ascending: false });
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true, data: data || [] });
    } catch (err: any) { return res.status(500).json({ success: false, message: err.message }); }
  });

  // PATCH /api/expert-submissions/:id/review — admin approves/rejects
  app.patch('/api/expert-submissions/:id/review', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const userId = await bearerUserId(supabaseAdmin, authHeader.slice(7));
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
      const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', userId).single();
      if (profile?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

      const { status, reviewer_notes } = req.body;
      const updateData: any = { status, reviewer_notes, updated_at: new Date().toISOString() };
      if (status === 'published') updateData.published_at = new Date().toISOString();

      const { data, error } = await supabaseAdmin.from('expert_submissions')
        .update(updateData).eq('id', req.params.id).select().single();
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true, data });
    } catch (err: any) { return res.status(500).json({ success: false, message: err.message }); }
  });
}
