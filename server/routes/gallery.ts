// @ts-nocheck
import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

// Helper to get user from bearer token
async function getUserFromToken(supabaseAdmin: any, authHeader: string | undefined): Promise<string | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length);
  const { data } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

export function registerGalleryRoutes(app: any) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // Get all approved gallery projects (public)
  router.get('/projects', async (req: Request, res: Response) => {
    try {
      const { 
        page = '1', 
        limit = '12', 
        category, 
        search, 
        sort = 'newest',
        hackathon_only,
        featured_only
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = Math.min(parseInt(limit as string), 50);
      const offset = (pageNum - 1) * limitNum;

      // First get count
      let countQuery = supabaseAdmin
        .from('gallery_projects')
        .select('id', { count: 'exact', head: true })
        .in('status', ['approved', 'featured']);

      if (category) countQuery = countQuery.eq('category', category);
      if (search) countQuery = countQuery.or(`name.ilike.%${search}%,tagline.ilike.%${search}%,description.ilike.%${search}%`);
      if (hackathon_only === 'true') countQuery = countQuery.not('hackathon_id', 'is', null);
      if (featured_only === 'true') countQuery = countQuery.eq('status', 'featured');

      const { count } = await countQuery;

      // Then get projects without joins
      let query = supabaseAdmin
        .from('gallery_projects')
        .select('*')
        .in('status', ['approved', 'featured']);

      // Apply filters
      if (category) {
        query = query.eq('category', category);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,tagline.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (hackathon_only === 'true') {
        query = query.not('hackathon_id', 'is', null);
      }

      if (featured_only === 'true') {
        query = query.eq('status', 'featured');
      }

      // Apply sorting
      switch (sort) {
        case 'popular':
          query = query.order('like_count', { ascending: false });
          break;
        case 'views':
          query = query.order('view_count', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      query = query.range(offset, offset + limitNum - 1);

      const { data: projects, error } = await query;

      if (error) throw error;

      // Fetch profiles and hackathons separately for each project
      const projectsWithRelations = await Promise.all(
        (projects || []).map(async (project: any) => {
          // Fetch profile
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('username, full_name, avatar_url')
            .eq('id', project.user_id)
            .single();

          // Fetch hackathon if exists
          let hackathon = null;
          if (project.hackathon_id) {
            const { data: hackathonData } = await supabaseAdmin
              .from('hackathons')
              .select('title, slug')
              .eq('id', project.hackathon_id)
              .single();
            hackathon = hackathonData;
          }

          return {
            ...project,
            profiles: profile,
            hackathons: hackathon
          };
        })
      );

      return res.json({
        success: true,
        data: projectsWithRelations,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitNum)
        }
      });
    } catch (err: any) {
      console.error('Error fetching gallery projects:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Get single project by ID (public)
  router.get('/projects/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Get project without joins
      const { data: project, error } = await supabaseAdmin
        .from('gallery_projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      // Check if project is viewable
      const userId = await getUserFromToken(supabaseAdmin, req.headers.authorization);
      if (project.status !== 'approved' && project.status !== 'featured' && project.user_id !== userId) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      // Fetch profile separately
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('username, full_name, avatar_url, bio')
        .eq('id', project.user_id)
        .single();

      // Fetch hackathon if exists
      let hackathon = null;
      if (project.hackathon_id) {
        const { data: hackathonData } = await supabaseAdmin
          .from('hackathons')
          .select('title, slug, start_date, end_date')
          .eq('id', project.hackathon_id)
          .single();
        hackathon = hackathonData;
      }

      // Increment view count
      await supabaseAdmin
        .from('gallery_projects')
        .update({ view_count: (project.view_count || 0) + 1 })
        .eq('id', id);

      // Check if current user has liked
      let hasLiked = false;
      if (userId) {
        const { data: likeData } = await supabaseAdmin
          .from('gallery_project_likes')
          .select('id')
          .eq('project_id', id)
          .eq('user_id', userId)
          .single();
        hasLiked = !!likeData;
      }

      const data = {
        ...project,
        profiles: profile,
        hackathons: hackathon
      };

      return res.json({
        success: true,
        data: { ...data, hasLiked }
      });
    } catch (err: any) {
      console.error('Error fetching project:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Create new project (authenticated)
  router.post('/projects', async (req: Request, res: Response) => {
    try {
      const userId = await getUserFromToken(supabaseAdmin, req.headers.authorization);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const {
        name,
        tagline,
        description,
        logo_url,
        cover_image_url,
        github_url,
        demo_url,
        video_url,
        website_url,
        category,
        tags,
        technologies,
        readme_content
      } = req.body;

      if (!name || !description) {
        return res.status(400).json({ success: false, message: 'Name and description are required' });
      }

      const { data, error } = await supabaseAdmin
        .from('gallery_projects')
        .insert({
          user_id: userId,
          name,
          tagline,
          description,
          logo_url,
          cover_image_url,
          github_url,
          demo_url,
          video_url,
          website_url,
          category,
          tags: tags || [],
          technologies: technologies || [],
          readme_content,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      return res.json({
        success: true,
        data,
        message: 'Project submitted for review'
      });
    } catch (err: any) {
      console.error('Error creating project:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Update project (owner only)
  router.put('/projects/:id', async (req: Request, res: Response) => {
    try {
      const userId = await getUserFromToken(supabaseAdmin, req.headers.authorization);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { id } = req.params;

      // Check ownership
      const { data: existing } = await supabaseAdmin
        .from('gallery_projects')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existing || existing.user_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this project' });
      }

      const {
        name,
        tagline,
        description,
        logo_url,
        cover_image_url,
        github_url,
        demo_url,
        video_url,
        website_url,
        category,
        tags,
        technologies,
        readme_content
      } = req.body;

      const { data, error } = await supabaseAdmin
        .from('gallery_projects')
        .update({
          name,
          tagline,
          description,
          logo_url,
          cover_image_url,
          github_url,
          demo_url,
          video_url,
          website_url,
          category,
          tags,
          technologies,
          readme_content,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (err: any) {
      console.error('Error updating project:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Delete project (owner only)
  router.delete('/projects/:id', async (req: Request, res: Response) => {
    try {
      const userId = await getUserFromToken(supabaseAdmin, req.headers.authorization);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { id } = req.params;

      const { error } = await supabaseAdmin
        .from('gallery_projects')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      return res.json({ success: true, message: 'Project deleted' });
    } catch (err: any) {
      console.error('Error deleting project:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Like/unlike project
  router.post('/projects/:id/like', async (req: Request, res: Response) => {
    try {
      const userId = await getUserFromToken(supabaseAdmin, req.headers.authorization);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { id } = req.params;

      // Check if already liked
      const { data: existing } = await supabaseAdmin
        .from('gallery_project_likes')
        .select('id')
        .eq('project_id', id)
        .eq('user_id', userId)
        .single();

      if (existing) {
        // Unlike
        await supabaseAdmin
          .from('gallery_project_likes')
          .delete()
          .eq('project_id', id)
          .eq('user_id', userId);

        return res.json({ success: true, liked: false });
      } else {
        // Like
        await supabaseAdmin
          .from('gallery_project_likes')
          .insert({ project_id: parseInt(id), user_id: userId });

        return res.json({ success: true, liked: true });
      }
    } catch (err: any) {
      console.error('Error toggling like:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Get user's own projects
  router.get('/my-projects', async (req: Request, res: Response) => {
    try {
      const userId = await getUserFromToken(supabaseAdmin, req.headers.authorization);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { data, error } = await supabaseAdmin
        .from('gallery_projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.json({ success: true, data: data || [] });
    } catch (err: any) {
      console.error('Error fetching user projects:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Get categories
  router.get('/categories', async (_req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('gallery_projects')
        .select('category')
        .in('status', ['approved', 'featured'])
        .not('category', 'is', null);

      if (error) throw error;

      const categories = [...new Set((data || []).map(p => p.category).filter(Boolean))];
      return res.json({ success: true, data: categories });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Admin: Get all projects for moderation
  router.get('/admin/projects', async (req: Request, res: Response) => {
    try {
      const userId = await getUserFromToken(supabaseAdmin, req.headers.authorization);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      // Check if admin
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (!profile || profile.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { status, page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      // Get count first
      let countQuery = supabaseAdmin
        .from('gallery_projects')
        .select('id', { count: 'exact', head: true });
      if (status) countQuery = countQuery.eq('status', status);
      const { count } = await countQuery;

      // Get projects without joins
      let query = supabaseAdmin
        .from('gallery_projects')
        .select('*');

      if (status) {
        query = query.eq('status', status);
      }

      query = query.order('created_at', { ascending: false }).range(offset, offset + limitNum - 1);

      const { data: projects, error } = await query;

      if (error) throw error;

      // Fetch profiles separately
      const projectsWithProfiles = await Promise.all(
        (projects || []).map(async (project: any) => {
          const { data: userProfile } = await supabaseAdmin
            .from('profiles')
            .select('username, full_name, email, avatar_url')
            .eq('id', project.user_id)
            .single();
          return { ...project, profiles: userProfile };
        })
      );

      return res.json({
        success: true,
        data: projectsWithProfiles,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitNum)
        }
      });
    } catch (err: any) {
      console.error('Error fetching admin projects:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Admin: Moderate project
  router.post('/admin/projects/:id/moderate', async (req: Request, res: Response) => {
    try {
      const userId = await getUserFromToken(supabaseAdmin, req.headers.authorization);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      // Check if admin
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (!profile || profile.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { id } = req.params;
      const { status, moderation_notes } = req.body;

      if (!['pending', 'approved', 'rejected', 'featured'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      const { data, error } = await supabaseAdmin
        .from('gallery_projects')
        .update({
          status,
          moderation_notes,
          moderated_by: userId,
          moderated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (err: any) {
      console.error('Error moderating project:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Admin: Get moderation stats
  router.get('/admin/stats', async (req: Request, res: Response) => {
    try {
      const userId = await getUserFromToken(supabaseAdmin, req.headers.authorization);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (!profile || profile.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const [pending, approved, rejected, featured, total] = await Promise.all([
        supabaseAdmin.from('gallery_projects').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabaseAdmin.from('gallery_projects').select('id', { count: 'exact' }).eq('status', 'approved'),
        supabaseAdmin.from('gallery_projects').select('id', { count: 'exact' }).eq('status', 'rejected'),
        supabaseAdmin.from('gallery_projects').select('id', { count: 'exact' }).eq('status', 'featured'),
        supabaseAdmin.from('gallery_projects').select('id', { count: 'exact' })
      ]);

      return res.json({
        success: true,
        data: {
          pending: pending.count || 0,
          approved: approved.count || 0,
          rejected: rejected.count || 0,
          featured: featured.count || 0,
          total: total.count || 0
        }
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Admin: Sync hackathon submissions to gallery
  router.post('/admin/sync-hackathon-submissions', async (req: Request, res: Response) => {
    try {
      const userId = await getUserFromToken(supabaseAdmin, req.headers.authorization);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (!profile || profile.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      // Get all hackathon submissions that aren't already in gallery
      const { data: submissions, error: fetchError } = await supabaseAdmin
        .from('hackathon_submissions')
        .select('*')
        .in('status', ['submitted', 'judged']);

      if (fetchError) throw fetchError;

      // Get existing gallery project submission IDs
      const { data: existingProjects } = await supabaseAdmin
        .from('gallery_projects')
        .select('hackathon_submission_id')
        .not('hackathon_submission_id', 'is', null);

      const existingIds = new Set((existingProjects || []).map(p => p.hackathon_submission_id));

      // Filter out already imported submissions
      const newSubmissions = (submissions || []).filter(s => !existingIds.has(s.id));

      if (newSubmissions.length === 0) {
        return res.json({ success: true, message: 'No new submissions to import', imported: 0 });
      }

      // Import new submissions
      const projectsToInsert = newSubmissions.map(s => ({
        user_id: s.user_id,
        name: s.project_name || 'Untitled Project',
        tagline: s.tagline,
        description: s.description || '',
        logo_url: s.project_logo,
        cover_image_url: s.cover_image,
        github_url: s.github_repo,
        demo_url: s.demo_url,
        video_url: s.video_url,
        technologies: s.technologies_used || [],
        hackathon_id: s.hackathon_id,
        hackathon_submission_id: s.id,
        hackathon_position: s.prize_won,
        status: 'approved', // Auto-approve hackathon submissions
        created_at: s.submitted_at || new Date().toISOString()
      }));

      const { data: inserted, error: insertError } = await supabaseAdmin
        .from('gallery_projects')
        .insert(projectsToInsert)
        .select();

      if (insertError) throw insertError;

      return res.json({
        success: true,
        message: `Imported ${inserted?.length || 0} hackathon submissions to gallery`,
        imported: inserted?.length || 0
      });
    } catch (err: any) {
      console.error('Error syncing hackathon submissions:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  app.use('/api/gallery', router);
}
