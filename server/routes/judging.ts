// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";

async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

export function registerJudgingRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // Get judge's assigned hackathons
  app.get("/api/judge/assigned-hackathons", async (req, res) => {
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

      const { data, error } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .select(`
          *,
          hackathon:organizer_hackathons(
            id,
            hackathon_name,
            slug,
            start_date,
            end_date,
            format,
            status,
            hackathon_status,
            cover_image
          )
        `)
        .eq('judge_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get submissions for a hackathon (for judging)
  app.get("/api/judge/hackathons/:hackathonId/submissions", async (req, res) => {
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

      // Verify judge is assigned to this hackathon (check invitations)
      const { data: invitation } = await supabaseAdmin
        .from('judge_invitations')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .eq('judge_id', userId)
        .eq('status', 'accepted')
        .single();

      if (!invitation) {
        return res.status(403).json({ success: false, message: 'Not authorized to judge this hackathon' });
      }

      // Get submissions
      const { data: submissions, error } = await supabaseAdmin
        .from('hackathon_submissions')
        .select(`
          *,
          team:hackathon_teams(team_name)
        `)
        .eq('hackathon_id', hackathonId)
        .eq('status', 'submitted')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        throw error;
      }

      // Get judge's scores for these submissions
      const submissionIds = (submissions || []).map((s: any) => s.id);
      const { data: scores } = submissionIds.length > 0 ? await supabaseAdmin
        .from('judge_scores')
        .select('*')
        .in('submission_id', submissionIds)
        .eq('judge_id', userId) : { data: [] };

      // Combine data with user names
      const enrichedSubmissions = await Promise.all((submissions || []).map(async (submission: any) => {
        const myScore = (scores || []).find((s: any) => s.submission_id === submission.id);
        
        // Get user profile
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('username, full_name')
          .eq('id', submission.user_id)
          .single();

        return {
          id: submission.id,
          project_name: submission.project_name,
          tagline: submission.tagline,
          description: submission.description,
          track: submission.track,
          github_repo: submission.github_repo,
          demo_url: submission.demo_url,
          video_url: submission.video_url,
          technologies_used: submission.technologies_used,
          team: submission.team,
          user_name: profile?.full_name || profile?.username || 'Unknown',
          submitted_at: submission.submitted_at,
          score: myScore?.score || null,
          criteria_scores: myScore?.criteria_scores || null,
          feedback: myScore?.feedback || null,
          prize_won: submission.prize_won || null,
          has_scored: !!myScore
        };
      }));

      return res.json({ success: true, data: enrichedSubmissions });
    } catch (error: any) {
      console.error('Error in judge submissions endpoint:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get judging criteria for a hackathon
  app.get("/api/hackathons/:hackathonId/judging-criteria", async (req, res) => {
    try {
      const { hackathonId } = req.params;

      const { data, error } = await supabaseAdmin
        .from('hackathon_judging_criteria')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .order('display_order', { ascending: true });

      if (error) throw error;

      // If no criteria exist, create default ones
      if (!data || data.length === 0) {
        await supabaseAdmin.rpc('create_default_judging_criteria', {
          p_hackathon_id: parseInt(hackathonId)
        });

        // Fetch again
        const { data: newData, error: newError } = await supabaseAdmin
          .from('hackathon_judging_criteria')
          .select('*')
          .eq('hackathon_id', hackathonId)
          .order('display_order', { ascending: true });

        if (newError) throw newError;
        return res.json({ success: true, data: newData });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Submit/Update rating for a submission
  app.post("/api/judge/submissions/:submissionId/rate", async (req, res) => {
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
      const { ratings, overall_notes } = req.body;

      // ratings should be an array of { criterion_id, score, notes }
      if (!Array.isArray(ratings) || ratings.length === 0) {
        return res.status(400).json({ success: false, message: 'Ratings array is required' });
      }

      // Verify judge is assigned to this hackathon
      const { data: submission } = await supabaseAdmin
        .from('hackathon_submissions')
        .select('hackathon_id')
        .eq('id', submissionId)
        .single();

      if (!submission) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }

      const { data: assignment } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .select('*')
        .eq('hackathon_id', submission.hackathon_id)
        .eq('judge_id', userId)
        .eq('status', 'active')
        .single();

      if (!assignment) {
        return res.status(403).json({ success: false, message: 'Not authorized to judge this submission' });
      }

      // Insert/Update ratings
      const ratingPromises = ratings.map((rating: any) => {
        return supabaseAdmin
          .from('hackathon_submission_ratings')
          .upsert({
            submission_id: parseInt(submissionId),
            judge_id: userId,
            criterion_id: rating.criterion_id,
            score: parseFloat(rating.score),
            notes: rating.notes || null,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'submission_id,judge_id,criterion_id'
          });
      });

      await Promise.all(ratingPromises);

      // Update judge event (increment teams evaluated)
      await supabaseAdmin.rpc('increment_judge_teams_evaluated', {
        p_judge_id: userId,
        p_hackathon_id: submission.hackathon_id
      }).catch(() => {
        // If function doesn't exist, update manually
        supabaseAdmin
          .from('judge_events')
          .update({
            teams_evaluated: supabaseAdmin.raw('teams_evaluated + 1'),
            updated_at: new Date().toISOString()
          })
          .eq('judge_id', userId)
          .eq('hackathon_id', submission.hackathon_id)
          .then(() => {});
      });

      return res.json({ success: true, message: 'Rating submitted successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get submission details with all ratings (for organizers)
  app.get("/api/organizer/submissions/:submissionId/ratings", async (req, res) => {
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

      // Verify organizer owns this hackathon
      const { data: submission } = await supabaseAdmin
        .from('hackathon_submissions')
        .select('hackathon_id')
        .eq('id', submissionId)
        .single();

      if (!submission) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }

      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', submission.hackathon_id)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Get all ratings for this submission
      const { data: ratings, error } = await supabaseAdmin
        .from('hackathon_submission_ratings')
        .select(`
          *,
          criterion:hackathon_judging_criteria(*),
          judge:profiles!hackathon_submission_ratings_judge_id_fkey(username, full_name, avatar_url)
        `)
        .eq('submission_id', submissionId);

      if (error) throw error;

      return res.json({ success: true, data: ratings });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Calculate winners for a hackathon
  app.post("/api/organizer/hackathons/:hackathonId/calculate-winners", async (req, res) => {
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

      // Verify ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Calculate winners
      const { data, error } = await supabaseAdmin.rpc('calculate_hackathon_winners', {
        p_hackathon_id: parseInt(hackathonId)
      });

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Create winner records (organizer proposes winners)
  app.post("/api/organizer/hackathons/:hackathonId/propose-winners", async (req, res) => {
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
      const { winners } = req.body;

      // winners should be array of { submission_id, position, prize_name, prize_amount }
      if (!Array.isArray(winners) || winners.length === 0) {
        return res.status(400).json({ success: false, message: 'Winners array is required' });
      }

      // Verify ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Create winner records
      const winnerRecords = await Promise.all(winners.map(async (winner: any) => {
        const { data: submission } = await supabaseAdmin
          .from('hackathon_submissions')
          .select('user_id, team_id')
          .eq('id', winner.submission_id)
          .single();

        if (!submission) return null;

        const { data, error } = await supabaseAdmin
          .from('hackathon_winners')
          .insert({
            hackathon_id: parseInt(hackathonId),
            submission_id: winner.submission_id,
            team_id: submission.team_id,
            user_id: submission.user_id,
            position: winner.position,
            prize_name: winner.prize_name,
            prize_amount: winner.prize_amount || null,
            announced_by: userId,
            status: 'pending'
          })
          .select()
          .single();

        return data;
      }));

      return res.json({ success: true, data: winnerRecords.filter(Boolean) });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Approve winner (creates achievements)
  app.post("/api/organizer/winners/:winnerId/approve", async (req, res) => {
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

      const { winnerId } = req.params;

      // Verify ownership
      const { data: winner } = await supabaseAdmin
        .from('hackathon_winners')
        .select('hackathon_id')
        .eq('id', winnerId)
        .single();

      if (!winner) {
        return res.status(404).json({ success: false, message: 'Winner not found' });
      }

      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', winner.hackathon_id)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Approve winner
      const { data, error } = await supabaseAdmin.rpc('approve_hackathon_winner', {
        p_winner_id: winnerId
      });

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get winners for a hackathon
  app.get("/api/hackathons/:hackathonId/winners", async (req, res) => {
    try {
      const { hackathonId } = req.params;
      
      // Validate hackathon ID
      const hackathonIdNum = parseInt(hackathonId);
      if (isNaN(hackathonIdNum)) {
        return res.status(400).json({ success: false, message: 'Invalid hackathon ID' });
      }

      // Return empty array - winners feature pending implementation
      return res.json({ success: true, data: [] });
    } catch (error: any) {
      console.error('Winners endpoint error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to fetch winners' });
    }
  });

  // Get judging progress for a hackathon (organizer)
  app.get("/api/organizer/hackathons/:hackathonId/judging-progress", async (req, res) => {
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

      // Verify ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Get submission count
      const { count: submissionCount } = await supabaseAdmin
        .from('hackathon_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('hackathon_id', hackathonId)
        .eq('status', 'submitted');

      // Get judge count
      const { count: judgeCount } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .select('*', { count: 'exact', head: true })
        .eq('hackathon_id', hackathonId)
        .eq('status', 'active');

      // Get ratings count
      const { data: ratingsData } = await supabaseAdmin
        .from('hackathon_submission_ratings')
        .select('submission_id, judge_id')
        .in('submission_id', 
          supabaseAdmin
            .from('hackathon_submissions')
            .select('id')
            .eq('hackathon_id', hackathonId)
        );

      const uniqueRatings = new Set((ratingsData || []).map((r: any) => `${r.submission_id}-${r.judge_id}`));
      const ratedSubmissions = new Set((ratingsData || []).map((r: any) => r.submission_id));

      return res.json({
        success: true,
        data: {
          total_submissions: submissionCount || 0,
          total_judges: judgeCount || 0,
          rated_submissions: ratedSubmissions.size,
          total_ratings: uniqueRatings.size,
          completion_percentage: submissionCount && judgeCount
            ? Math.round((uniqueRatings.size / (submissionCount * judgeCount)) * 100)
            : 0
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
