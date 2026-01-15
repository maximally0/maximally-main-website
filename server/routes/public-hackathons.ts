// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";

async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

export function registerPublicHackathonRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // Get public hackathon by ID (legacy endpoint)
  app.get("/api/hackathons/by-id/:hackathonId", async (req, res) => {
    try {
      const { hackathonId } = req.params;

      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('id', hackathonId)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get public hackathon by ID (used by judge submissions page)
  app.get("/api/hackathons/id/:hackathonId", async (req, res) => {
    try {
      const { hackathonId } = req.params;

      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('id', hackathonId)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

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
        .eq('target_audience', 'public')
        .order('published_at', { ascending: false });

      if (error) throw error;

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get public projects/submissions for a hackathon
  app.get("/api/hackathons/:hackathonId/projects", async (req, res) => {
    try {
      const { hackathonId } = req.params;

      const { data, error } = await supabaseAdmin
        .from('hackathon_submissions')
        .select(`
          id,
          project_name,
          tagline,
          description,
          track,
          github_repo,
          demo_url,
          video_url,
          cover_image,
          project_logo,
          technologies_used,
          status,
          score,
          prize_won,
          submitted_at,
          user_id,
          team_id
        `)
        .eq('hackathon_id', hackathonId)
        .eq('status', 'submitted')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      // Enrich with user names and team info
      const enrichedData = await Promise.all((data || []).map(async (project: any) => {
        let userName = 'Anonymous';
        let team = null;

        if (project.user_id) {
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('username, full_name')
            .eq('id', project.user_id)
            .single();
          userName = profile?.full_name || profile?.username || 'Anonymous';
        }

        if (project.team_id) {
          const { data: teamData } = await supabaseAdmin
            .from('hackathon_teams')
            .select('team_name, team_code')
            .eq('id', project.team_id)
            .single();
          team = teamData;
        }

        return {
          ...project,
          user_name: userName,
          team
        };
      }));

      return res.json({ success: true, data: enrichedData });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Check if user is organizer of hackathon (owner or co-organizer)
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

      // Check if user is the owner
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.organizer_id === userId) {
        return res.json({ success: true, isOrganizer: true });
      }

      // Check if user is a co-organizer (any role: co-organizer, admin, viewer)
      const { data: coOrg } = await supabaseAdmin
        .from('hackathon_organizers')
        .select('role, status')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .eq('status', 'accepted')
        .single();

      return res.json({ 
        success: true, 
        isOrganizer: !!coOrg
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
          hackathon:organizer_hackathons(id, hackathon_name, slug, hackathon_logo),
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
          submission:hackathon_submissions(
            id,
            project_name,
            description,
            tagline,
            github_repo,
            demo_url,
            video_url,
            cover_image,
            project_logo,
            user_id,
            team_id
          )
        `)
        .eq('hackathon_id', hackathonIdNum)
        .order('position', { ascending: true });

      if (error) throw error;

      // Enrich with user names and team names
      const enrichedData = await Promise.all((data || []).map(async (winner: any) => {
        let userName = 'Anonymous';
        let teamName = null;

        if (winner.submission?.user_id) {
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('username, full_name')
            .eq('id', winner.submission.user_id)
            .single();
          userName = profile?.full_name || profile?.username || 'Anonymous';
        }
        if (winner.submission?.team_id) {
          const { data: team } = await supabaseAdmin
            .from('hackathon_teams')
            .select('team_name')
            .eq('id', winner.submission.team_id)
            .single();
          teamName = team?.team_name;
        }

        return {
          ...winner,
          submission: winner.submission ? {
            ...winner.submission,
            user_name: userName,
            team: teamName ? { team_name: teamName } : null
          } : null,
          team_name: teamName
        };
      }));

      return res.json({ success: true, data: enrichedData });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
