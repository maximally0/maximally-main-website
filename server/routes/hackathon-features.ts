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
  // SUBMISSION COMMENTS - DEPRECATED
  // The hackathon_submission_comments table has been removed as part of
  // Platform Simplification. Judges now use simple scoring without comments.
  // See: .kiro/specs/platform-simplification/requirements.md - Requirement 12.4
  // ============================================================================
  
  // DEPRECATED: Get comments for a submission
  // Returns empty array since table no longer exists
  app.get("/api/submissions/:submissionId/comments", async (req, res) => {
    // Return empty array - table removed in Platform Simplification
    return res.json({ success: true, data: [] });
  });

  // DEPRECATED: Add comment to submission
  // Returns error since table no longer exists
  app.post("/api/submissions/:submissionId/comments", async (req, res) => {
    // Table removed in Platform Simplification
    return res.status(410).json({ 
      success: false, 
      message: 'Submission comments feature has been removed. Judges now use simple scoring.' 
    });
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

  // ============================================================================
  // PARTICIPANT FEEDBACK (Simple feedback for ended hackathons)
  // ============================================================================

  // Get participant feedback for a hackathon (public - shows on hackathon page)
  app.get("/api/hackathons/:hackathonId/participant-feedback", async (req, res) => {
    try {
      const { hackathonId } = req.params;
      
      // First get the feedback
      const { data: feedbackData, error: feedbackError } = await supabaseAdmin
        .from('hackathon_participant_feedback')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (feedbackError) throw feedbackError;

      // Then get profiles for each feedback
      const feedbackWithProfiles = await Promise.all(
        (feedbackData || []).map(async (feedback) => {
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('username, full_name, avatar_url')
            .eq('id', feedback.user_id)
            .single();
          
          return {
            ...feedback,
            profiles: profile || null
          };
        })
      );

      return res.json({ success: true, data: feedbackWithProfiles });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get all feedback for organizer (includes private)
  app.get("/api/hackathons/:hackathonId/participant-feedback/all", async (req, res) => {
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

      // Verify organizer owns this hackathon
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (!hackathon || hackathon.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const { data: feedbackData, error } = await supabaseAdmin
        .from('hackathon_participant_feedback')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get profiles for each feedback
      const data = await Promise.all(
        (feedbackData || []).map(async (feedback) => {
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('username, full_name, avatar_url, email')
            .eq('id', feedback.user_id)
            .single();
          
          return {
            ...feedback,
            profiles: profile || null
          };
        })
      );

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Check if user has already submitted feedback
  app.get("/api/hackathons/:hackathonId/participant-feedback/my-feedback", async (req, res) => {
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

      const { data, error } = await supabaseAdmin
        .from('hackathon_participant_feedback')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return res.json({ success: true, data: data || null });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Submit participant feedback (only for registered participants of ended hackathons)
  app.post("/api/hackathons/:hackathonId/participant-feedback", async (req, res) => {
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
      const {
        overall_rating,
        organization_rating,
        mentorship_rating,
        experience_highlights,
        improvement_suggestions,
        would_recommend,
        testimonial,
        is_public
      } = req.body;

      // Verify hackathon has ended (winners announced)
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('winners_announced')
        .eq('id', hackathonId)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      if (!hackathon.winners_announced) {
        return res.status(400).json({ success: false, message: 'Feedback can only be submitted after hackathon ends' });
      }

      // Verify user is a registered participant
      const { data: registration } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('id')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      if (!registration) {
        return res.status(403).json({ success: false, message: 'Only registered participants can submit feedback' });
      }

      // Check if user already submitted feedback
      const { data: existingFeedback } = await supabaseAdmin
        .from('hackathon_participant_feedback')
        .select('id')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      if (existingFeedback) {
        return res.status(400).json({ success: false, message: 'You have already submitted feedback for this hackathon' });
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_participant_feedback')
        .insert({
          hackathon_id: parseInt(hackathonId),
          user_id: userId,
          overall_rating,
          organization_rating,
          mentorship_rating,
          experience_highlights,
          improvement_suggestions,
          would_recommend,
          testimonial,
          is_public: is_public || false,
        })
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get feedback stats for a hackathon
  app.get("/api/hackathons/:hackathonId/participant-feedback/stats", async (req, res) => {
    try {
      const { hackathonId } = req.params;

      const { data, error } = await supabaseAdmin
        .from('hackathon_participant_feedback')
        .select('overall_rating, organization_rating, mentorship_rating, would_recommend')
        .eq('hackathon_id', hackathonId);

      if (error) throw error;

      if (!data || data.length === 0) {
        return res.json({
          success: true,
          data: {
            total_responses: 0,
            avg_overall: 0,
            avg_organization: 0,
            avg_mentorship: 0,
            recommend_percentage: 0
          }
        });
      }

      const total = data.length;
      const avgOverall = data.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / total;
      const avgOrganization = data.reduce((sum, f) => sum + (f.organization_rating || 0), 0) / total;
      const avgMentorship = data.reduce((sum, f) => sum + (f.mentorship_rating || 0), 0) / total;
      const recommendCount = data.filter(f => f.would_recommend).length;

      return res.json({
        success: true,
        data: {
          total_responses: total,
          avg_overall: Math.round(avgOverall * 10) / 10,
          avg_organization: Math.round(avgOrganization * 10) / 10,
          avg_mentorship: Math.round(avgMentorship * 10) / 10,
          recommend_percentage: Math.round((recommendCount / total) * 100)
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // ============================================================================
  // MENTORS (for certificate generation)
  // ============================================================================

  // Get mentors for a hackathon (organizer only - for certificates)
  app.get("/api/organizer/hackathons/:hackathonId/mentors", async (req, res) => {
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

      // Verify organizer owns this hackathon
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (!hackathon || hackathon.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Get mentors from hackathon_mentors table
      const { data: mentors, error } = await supabaseAdmin
        .from('hackathon_mentors')
        .select(`
          id,
          mentor_id,
          expertise_areas,
          bio,
          status,
          mentor:profiles!hackathon_mentors_mentor_id_fkey(
            id,
            email,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('hackathon_id', hackathonId)
        .eq('status', 'active');

      if (error) throw error;

      // Map to expected format
      const mappedMentors = (mentors || []).map((m: any) => ({
        id: m.id,
        mentor_id: m.mentor_id,
        mentor_name: m.mentor?.full_name || m.mentor?.username || 'Unknown',
        full_name: m.mentor?.full_name,
        email: m.mentor?.email,
        avatar_url: m.mentor?.avatar_url,
        expertise_areas: m.expertise_areas,
        bio: m.bio,
      }));

      return res.json({ success: true, data: mappedMentors });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // DEPRECATED: Old judges route using judge_hackathon_assignments table
  // This has been replaced by the simplified judges system in simplified-judges.ts
  // which uses the hackathon_judges table instead
  /*
  app.get("/api/organizer/hackathons/:hackathonId/judges", async (req, res) => {
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

      // Verify organizer owns this hackathon
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (!hackathon || hackathon.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Get judges from judge_hackathon_assignments table
      const { data: judges, error } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .select(`
          id,
          judge_id,
          role,
          status,
          judge:profiles!judge_hackathon_assignments_judge_id_fkey(
            id,
            email,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('hackathon_id', hackathonId)
        .eq('status', 'active');

      if (error) throw error;

      // Map to expected format
      const mappedJudges = (judges || []).map((j: any) => ({
        id: j.id,
        judge_id: j.judge_id,
        judge_name: j.judge?.full_name || j.judge?.username || 'Unknown',
        full_name: j.judge?.full_name,
        email: j.judge?.email,
        avatar_url: j.judge?.avatar_url,
        role: j.role,
      }));

      return res.json({ success: true, data: mappedJudges });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
  */
}
