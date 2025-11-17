// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";

async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

export function registerPublicHackathonRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // Get public hackathon by slug
  app.get("/api/hackathons/:slug", async (req, res) => {
    try {
      const { slug } = req.params;

      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Increment views
      await supabaseAdmin
        .from('organizer_hackathons')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', data.id);

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get public announcements for a hackathon
  app.get("/api/hackathons/:hackathonId/announcements", async (req, res) => {
    try {
      const { hackathonId } = req.params;

      const { data, error } = await supabaseAdmin
        .from('hackathon_announcements')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Check if user is organizer of hackathon
  app.get("/api/hackathons/:hackathonId/is-organizer", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.json({ success: true, isOrganizer: false });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.json({ success: true, isOrganizer: false });
      }

      const { hackathonId } = req.params;

      const { data } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      return res.json({ 
        success: true, 
        isOrganizer: data?.organizer_id === userId 
      });
    } catch (error: any) {
      return res.json({ success: true, isOrganizer: false });
    }
  });

  // Check if registration is allowed
  app.get("/api/hackathons/:hackathonId/can-register", async (req, res) => {
    try {
      const { hackathonId } = req.params;

      const { data, error } = await supabaseAdmin
        .rpc('can_register_to_hackathon', { p_hackathon_id: parseInt(hackathonId) });

      if (error) throw error;

      return res.json({ success: true, canRegister: data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Check if submission is allowed
  app.get("/api/hackathons/:hackathonId/can-submit", async (req, res) => {
    try {
      const { hackathonId } = req.params;

      const { data, error } = await supabaseAdmin
        .rpc('can_submit_to_hackathon', { p_hackathon_id: parseInt(hackathonId) });

      if (error) throw error;

      return res.json({ success: true, canSubmit: data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get submission by slug
  app.get("/api/submissions/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;

      const { data, error } = await supabaseAdmin
        .from('hackathon_submissions')
        .select(`
          *,
          hackathon:organizer_hackathons(id, hackathon_name, slug, cover_image),
          team:hackathon_teams(team_name, team_code, project_name),
          user:profiles(username, full_name, avatar_url)
        `)
        .eq('slug', slug)
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get hackathon winners
  app.get("/api/hackathons/:hackathonId/winners", async (req, res) => {
    try {
      const { hackathonId } = req.params;
      
      // Validate hackathon ID
      const hackathonIdNum = parseInt(hackathonId);
      if (isNaN(hackathonIdNum)) {
        return res.status(400).json({ success: false, message: 'Invalid hackathon ID' });
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_winners')
        .select(`
          *,
          submission:hackathon_submissions(description, tagline, github_repo, demo_url, video_url, cover_image),
          team:hackathon_teams(team_name, team_code, project_name)
        `)
        .eq('hackathon_id', hackathonIdNum)
        .order('position', { ascending: true });

      if (error) throw error;

      // Get user names
      const enrichedData = await Promise.all((data || []).map(async (winner: any) => {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('username, full_name, avatar_url')
          .eq('id', winner.user_id)
          .single();

        return {
          ...winner,
          user_name: profile?.full_name || profile?.username || 'Anonymous',
          user_avatar: profile?.avatar_url
        };
      }));

      return res.json({ success: true, data: enrichedData });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
