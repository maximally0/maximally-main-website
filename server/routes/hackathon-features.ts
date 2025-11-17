// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";

async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

export function registerHackathonFeatureRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // ============================================================================
  // TRACKS
  // ============================================================================
  
  // Get tracks for a hackathon
  app.get("/api/hackathons/:hackathonId/tracks", async (req, res) => {
    try {
      const { hackathonId } = req.params;
      
      const { data, error } = await supabaseAdmin
        .from('hackathon_tracks')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Create track (organizer only)
  app.post("/api/hackathons/:hackathonId/tracks", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { hackathonId } = req.params;

      const { track_name, track_description, track_icon, prize_pool, max_submissions, judging_criteria } = req.body;

      // Verify organizer owns this hackathon
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (!hackathon || hackathon.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_tracks')
        .insert({
          hackathon_id: parseInt(hackathonId),
          track_name,
          track_description,
          track_icon,
          prize_pool,
          max_submissions,
          judging_criteria,
        })
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // ============================================================================
  // SPONSORS
  // ============================================================================
  
  // Get sponsors for a hackathon
  app.get("/api/hackathons/:hackathonId/sponsors", async (req, res) => {
    try {
      const { hackathonId } = req.params;
      
      const { data, error } = await supabaseAdmin
        .from('hackathon_sponsors')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Create sponsor (organizer only)
  app.post("/api/hackathons/:hackathonId/sponsors", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { hackathonId } = req.params;
      const { sponsor_name, sponsor_logo, sponsor_website, sponsor_tier, contribution_amount, display_order } = req.body;

      // Verify organizer owns this hackathon
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (!hackathon || hackathon.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_sponsors')
        .insert({
          hackathon_id: parseInt(hackathonId),
          sponsor_name,
          sponsor_logo,
          sponsor_website,
          sponsor_tier,
          contribution_amount,
          display_order: display_order || 0,
        })
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // ============================================================================
  // FEEDBACK FORMS
  // ============================================================================
  
  // Get feedback forms for a hackathon
  app.get("/api/hackathons/:hackathonId/feedback-forms", async (req, res) => {
    try {
      const { hackathonId } = req.params;
      
      const { data, error } = await supabaseAdmin
        .from('hackathon_feedback_forms')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Submit feedback response
  app.post("/api/hackathons/feedback-forms/:formId/responses", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      const { formId } = req.params;
      const { responses, is_anonymous } = req.body;

      let userId = null;
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice('Bearer '.length);
        userId = await bearerUserId(supabaseAdmin, token);
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_feedback_responses')
        .insert({
          form_id: formId,
          respondent_id: is_anonymous ? null : userId,
          responses,
        })
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get feedback responses (organizer only)
  app.get("/api/hackathons/feedback-forms/:formId/responses", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { formId } = req.params;

      // Verify user is organizer of this hackathon
      const { data: form } = await supabaseAdmin
        .from('hackathon_feedback_forms')
        .select('hackathon_id')
        .eq('id', formId)
        .single();

      if (!form) {
        return res.status(404).json({ success: false, message: 'Form not found' });
      }

      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', form.hackathon_id)
        .single();

      if (!hackathon || hackathon.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_feedback_responses')
        .select('*')
        .eq('form_id', formId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // ============================================================================
  // SUBMISSION COMMENTS (for judges/organizers)
  // ============================================================================
  
  // Get comments for a submission
  app.get("/api/submissions/:submissionId/comments", async (req, res) => {
    try {
      const { submissionId } = req.params;
      
      const { data, error } = await supabaseAdmin
        .from('hackathon_submission_comments')
        .select('*')
        .eq('submission_id', submissionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Add comment to submission
  app.post("/api/submissions/:submissionId/comments", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { submissionId } = req.params;
      const { comment_text, commenter_role, is_private } = req.body;

      const { data, error } = await supabaseAdmin
        .from('hackathon_submission_comments')
        .insert({
          submission_id: parseInt(submissionId),
          commenter_id: userId,
          commenter_role,
          comment_text,
          is_private: is_private || true,
        })
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // ============================================================================
  // TEAM TASKS
  // ============================================================================
  
  // Get tasks for a team
  app.get("/api/teams/:teamId/tasks", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { teamId } = req.params;
      
      const { data, error } = await supabaseAdmin
        .from('hackathon_team_tasks')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Create task
  app.post("/api/teams/:teamId/tasks", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { teamId } = req.params;
      const { task_title, task_description, assigned_to, priority, due_date } = req.body;

      const { data, error } = await supabaseAdmin
        .from('hackathon_team_tasks')
        .insert({
          team_id: parseInt(teamId),
          task_title,
          task_description,
          assigned_to,
          priority: priority || 'medium',
          due_date,
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Update task status
  app.patch("/api/teams/tasks/:taskId", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { taskId } = req.params;
      const { status } = req.body;

      const { data, error } = await supabaseAdmin
        .from('hackathon_team_tasks')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}


  // ============================================================================
  // SUBMISSION MILESTONES
  // ============================================================================
  
  // Get milestones for a submission
  app.get("/api/submissions/:submissionId/milestones", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { submissionId } = req.params;
      
      const { data, error } = await supabaseAdmin
        .from('hackathon_submission_milestones')
        .select('*')
        .eq('submission_id', submissionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Create milestone
  app.post("/api/submissions/:submissionId/milestones", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { submissionId } = req.params;
      const { milestone_title, milestone_description } = req.body;

      const { data, error } = await supabaseAdmin
        .from('hackathon_submission_milestones')
        .insert({
          submission_id: parseInt(submissionId),
          milestone_title,
          milestone_description,
        })
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Update milestone (toggle completion)
  app.patch("/api/submissions/milestones/:milestoneId", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { milestoneId } = req.params;
      const { completed } = req.body;

      const updateData: any = { completed };
      if (completed) {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_submission_milestones')
        .update(updateData)
        .eq('id', milestoneId)
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Delete milestone
  app.delete("/api/submissions/milestones/:milestoneId", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { milestoneId } = req.params;

      const { error } = await supabaseAdmin
        .from('hackathon_submission_milestones')
        .delete()
        .eq('id', milestoneId);

      if (error) throw error;

      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
