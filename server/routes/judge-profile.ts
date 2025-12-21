// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";
import { sendProjectFeedbackEmail } from "../services/email";

async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

export function registerJudgeProfileRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // Get judge profile with statistics
  app.get("/api/judge/profile", async (req, res) => {
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

      // Get profile with judge statistics
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      if (profile.role !== 'judge') {
        return res.status(403).json({ success: false, message: 'Not a judge' });
      }

      // Get judge events
      const { data: events, error: eventsError } = await supabaseAdmin
        .from('judge_events')
        .select('*')
        .eq('judge_id', userId)
        .order('date', { ascending: false });

      if (eventsError) {
        console.error('Error fetching judge events:', eventsError);
      }

      // Get active assignments
      const { data: assignments, error: assignmentsError } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .select(`
          *,
          hackathon:organizer_hackathons(id, hackathon_name, start_date, end_date, format, slug)
        `)
        .eq('judge_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (assignmentsError) {
        console.error('Error fetching assignments:', assignmentsError);
      }

      // Get judge data from judges table for tier information
      const { data: judgeData } = await supabaseAdmin
        .from('judges')
        .select('tier')
        .eq('user_id', userId)
        .single();

      // Format response
      const response = {
        profile: {
          id: profile.id,
          username: profile.username,
          fullName: profile.full_name,
          profilePhoto: profile.avatar_url,
          headline: profile.headline || 'Judge',
          shortBio: profile.bio || '',
          location: profile.location || '',
          currentRole: profile.current_role || '',
          company: profile.company || '',
          tier: judgeData?.tier || 'starter',
          totalEventsJudged: profile.total_events_judged || 0,
          totalTeamsEvaluated: profile.total_teams_evaluated || 0,
          totalMentorshipHours: profile.total_mentorship_hours || 0,
          eventsJudgedVerified: true,
          teamsEvaluatedVerified: true,
          mentorshipHoursVerified: true,
          availabilityStatus: 'available',
          primaryExpertise: profile.skills || [],
          secondaryExpertise: []
        },
        events: (events || []).map((event: any) => ({
          id: event.id,
          eventName: event.event_name,
          role: event.role,
          date: event.date,
          link: null,
          verified: event.verified,
          teamsEvaluated: event.teams_evaluated,
          hoursSpent: event.hours_spent
        })),
        assignments: (assignments || []).map((assignment: any) => ({
          id: assignment.id,
          hackathon: assignment.hackathon,
          role: assignment.role,
          assignedAt: assignment.created_at
        }))
      };

      return res.json(response);
    } catch (error: any) {
      console.error('Error in judge profile:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get public judge profile by username
  app.get("/api/judge/profile/:username", async (req, res) => {
    try {
      const { username } = req.params;

      // Get profile
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('username', username)
        .eq('role', 'judge')
        .single();

      if (profileError || !profile) {
        return res.status(404).json({ success: false, message: 'Judge not found' });
      }

      // Get judge data from judges table for tier information
      const { data: judgeData } = await supabaseAdmin
        .from('judges')
        .select('tier')
        .eq('user_id', profile.id)
        .single();

      // Get verified events only (public)
      const { data: events } = await supabaseAdmin
        .from('judge_events')
        .select('*')
        .eq('judge_id', profile.id)
        .eq('verified', true)
        .order('date', { ascending: false});

      const response = {
        id: profile.id,
        username: profile.username,
        fullName: profile.full_name,
        profilePhoto: profile.avatar_url,
        headline: profile.headline || 'Judge',
        shortBio: profile.bio || '',
        location: profile.location || '',
        tier: judgeData?.tier || 'starter',
        totalEventsJudged: profile.total_events_judged || 0,
        totalTeamsEvaluated: profile.total_teams_evaluated || 0,
        totalMentorshipHours: profile.total_mentorship_hours || 0,
        verifiedEvents: (events || []).map((event: any) => ({
          eventName: event.event_name,
          role: event.role,
          date: event.date,
          teamsEvaluated: event.teams_evaluated,
          hoursSpent: event.hours_spent
        }))
      };

      return res.json({ success: true, data: response });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Update judge event (add teams evaluated, hours spent)
  app.patch("/api/judge/events/:eventId", async (req, res) => {
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

      const { eventId } = req.params;
      const { teams_evaluated, hours_spent } = req.body;

      const { data, error } = await supabaseAdmin
        .from('judge_events')
        .update({
          teams_evaluated,
          hours_spent,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .eq('judge_id', userId)
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Submit score for a submission
  app.post("/api/judge/submissions/:submissionId/score", async (req, res) => {
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
      const { score, feedback, criteria_scores } = req.body;

      if (!score || score < 0 || score > 100) {
        return res.status(400).json({ success: false, message: 'Score must be between 0 and 100' });
      }

      // Verify judge has access to this submission's hackathon
      const { data: submission } = await supabaseAdmin
        .from('hackathon_submissions')
        .select('hackathon_id')
        .eq('id', submissionId)
        .single();

      if (!submission) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }

      const { data: invitation } = await supabaseAdmin
        .from('judge_invitations')
        .select('*')
        .eq('hackathon_id', submission.hackathon_id)
        .eq('judge_id', userId)
        .eq('status', 'accepted')
        .single();

      if (!invitation) {
        return res.status(403).json({ success: false, message: 'Not authorized to score this submission' });
      }

      // Upsert score with criteria scores
      console.log(`[JUDGE SCORE] Saving score for submission ${submissionId} by judge ${userId}:`, { score, criteria_scores, feedback });
      
      const { data, error } = await supabaseAdmin
        .from('judge_scores')
        .upsert({
          judge_id: userId,
          submission_id: parseInt(submissionId),
          score: parseFloat(score),
          criteria_scores: criteria_scores || null,
          feedback: feedback || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'judge_id,submission_id'
        })
        .select()
        .single();

      if (error) {
        console.error('[JUDGE SCORE] Error upserting score:', error);
        throw error;
      }

      // Send feedback email to participant if feedback was provided
      if (feedback) {
        // Get submission details with user info
        const { data: submissionDetails } = await supabaseAdmin
          .from('hackathon_submissions')
          .select('project_name, user_id, hackathon_id')
          .eq('id', submissionId)
          .single();

        if (submissionDetails) {
          // Get participant profile
          const { data: participantProfile } = await supabaseAdmin
            .from('profiles')
            .select('email, full_name, username')
            .eq('id', submissionDetails.user_id)
            .single();

          // Get hackathon name
          const { data: hackathon } = await supabaseAdmin
            .from('organizer_hackathons')
            .select('hackathon_name')
            .eq('id', submissionDetails.hackathon_id)
            .single();

          // Get judge name
          const { data: judgeProfile } = await supabaseAdmin
            .from('profiles')
            .select('full_name, username')
            .eq('id', userId)
            .single();

          if (participantProfile?.email && hackathon) {
            sendProjectFeedbackEmail({
              email: participantProfile.email,
              userName: participantProfile.full_name || participantProfile.username || 'there',
              hackathonName: hackathon.hackathon_name,
              projectName: submissionDetails.project_name,
              projectId: parseInt(submissionId),
              judgeName: judgeProfile?.full_name || judgeProfile?.username || 'A Judge',
              score: parseFloat(score),
              feedback: feedback,
            }).catch(err => console.error('Project feedback email failed:', err));
          }
        }
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in score submission:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get hackathons assigned to judge
  app.get("/api/judge/hackathons", async (req, res) => {
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

      // Get hackathons where judge has accepted invitation
      const { data: assignments, error } = await supabaseAdmin
        .from('judge_invitations')
        .select(`
          hackathon_id,
          hackathon:organizer_hackathons!inner(
            id,
            hackathon_name,
            slug,
            start_date,
            end_date,
            format,
            status
          )
        `)
        .eq('judge_id', userId)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching judge hackathons:', error);
        return res.status(500).json({ success: false, message: error.message });
      }

      // Get counts for each hackathon
      const hackathonsWithCounts = await Promise.all(
        (assignments || []).map(async (assignment: any) => {
          const hackathon = assignment.hackathon;
          
          // Get registrations count
          const { count: regCount } = await supabaseAdmin
            .from('hackathon_registrations')
            .select('*', { count: 'exact', head: true })
            .eq('hackathon_id', hackathon.id)
            .eq('status', 'confirmed');

          // Get submissions count
          const { count: subCount } = await supabaseAdmin
            .from('submissions')
            .select('*', { count: 'exact', head: true })
            .eq('hackathon_id', hackathon.id);

          return {
            id: hackathon.id,
            hackathon_name: hackathon.hackathon_name,
            slug: hackathon.slug,
            start_date: hackathon.start_date,
            end_date: hackathon.end_date,
            format: hackathon.format,
            status: hackathon.status,
            registrations_count: regCount || 0,
            submissions_count: subCount || 0
          };
        })
      );

      return res.json({ success: true, data: hackathonsWithCounts });
    } catch (error: any) {
      console.error('Error in judge hackathons:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
