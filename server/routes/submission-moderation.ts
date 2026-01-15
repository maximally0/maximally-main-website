// @ts-nocheck
/**
 * Submission Moderation Routes
 * 
 * Allows organizers to moderate (disqualify) project submissions
 * before the gallery goes public.
 * 
 * Per the platform flow:
 * - All projects are eligible by default
 * - Organizer only marks exceptions (disqualifications)
 * - Moderation happens BEFORE gallery goes public
 */

import type { Express, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

// Helper to get user ID from bearer token
async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

// Helper to check hackathon access (owner or co-organizer)
async function checkHackathonAccess(supabaseAdmin: any, hackathonId: string, userId: string) {
  // Check if owner
  const { data: hackathon } = await supabaseAdmin
    .from('organizer_hackathons')
    .select('organizer_id')
    .eq('id', hackathonId)
    .single();

  if (hackathon?.organizer_id === userId) {
    return { hasAccess: true, isOwner: true };
  }

  // Check if co-organizer
  const { data: coOrg } = await supabaseAdmin
    .from('hackathon_organizers')
    .select('role, status')
    .eq('hackathon_id', hackathonId)
    .eq('user_id', userId)
    .eq('status', 'accepted')
    .single();

  if (coOrg) {
    return { hasAccess: true, isOwner: false, role: coOrg.role };
  }

  return { hasAccess: false };
}

export function registerSubmissionModerationRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  /**
   * GET /api/organizer/hackathons/:hackathonId/submissions/moderation
   * 
   * Get all submissions for moderation (with their current status)
   */
  app.get('/api/organizer/hackathons/:hackathonId/submissions/moderation', async (req: Request, res: Response) => {
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

      // Verify access
      const access = await checkHackathonAccess(supabaseAdmin, hackathonId, userId);
      if (!access.hasAccess) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Get all submitted projects (not drafts)
      const { data: submissions, error } = await supabaseAdmin
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
          submitted_at,
          created_at,
          team_id,
          user_id
        `)
        .eq('hackathon_id', hackathonId)
        .in('status', ['submitted', 'disqualified'])
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions for moderation:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
      }

      // Enrich with team info
      const enrichedSubmissions = await Promise.all((submissions || []).map(async (sub: any) => {
        let teamInfo = null;
        if (sub.team_id) {
          const { data: team } = await supabaseAdmin
            .from('hackathon_teams')
            .select('team_name, team_code')
            .eq('id', sub.team_id)
            .single();
          teamInfo = team;
        }

        // Get submitter info
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('username, full_name')
          .eq('id', sub.user_id)
          .single();

        return {
          ...sub,
          team: teamInfo,
          submitter: profile
        };
      }));

      return res.json({ success: true, data: enrichedSubmissions });
    } catch (error: any) {
      console.error('Error in get submissions for moderation:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  /**
   * POST /api/organizer/hackathons/:hackathonId/submissions/:submissionId/disqualify
   * 
   * Disqualify a submission (mark as ineligible for judging)
   */
  app.post('/api/organizer/hackathons/:hackathonId/submissions/:submissionId/disqualify', async (req: Request, res: Response) => {
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

      const { hackathonId, submissionId } = req.params;
      const { reason } = req.body;

      // Verify access
      const access = await checkHackathonAccess(supabaseAdmin, hackathonId, userId);
      if (!access.hasAccess) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Check if gallery is already public
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('gallery_public')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.gallery_public) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot disqualify submissions after gallery is public. Moderation must happen before gallery publication.' 
        });
      }

      // Update submission status to disqualified
      const { data, error } = await supabaseAdmin
        .from('hackathon_submissions')
        .update({
          status: 'disqualified',
          feedback: reason || 'Disqualified by organizer',
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId)
        .eq('hackathon_id', hackathonId)
        .select()
        .single();

      if (error) {
        console.error('Error disqualifying submission:', error);
        return res.status(500).json({ success: false, message: 'Failed to disqualify submission' });
      }

      return res.json({ 
        success: true, 
        message: 'Submission disqualified',
        data 
      });
    } catch (error: any) {
      console.error('Error in disqualify submission:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  /**
   * POST /api/organizer/hackathons/:hackathonId/submissions/:submissionId/reinstate
   * 
   * Reinstate a disqualified submission (mark as eligible again)
   */
  app.post('/api/organizer/hackathons/:hackathonId/submissions/:submissionId/reinstate', async (req: Request, res: Response) => {
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

      const { hackathonId, submissionId } = req.params;

      // Verify access
      const access = await checkHackathonAccess(supabaseAdmin, hackathonId, userId);
      if (!access.hasAccess) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Check if gallery is already public
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('gallery_public')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.gallery_public) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot reinstate submissions after gallery is public.' 
        });
      }

      // Update submission status back to submitted
      const { data, error } = await supabaseAdmin
        .from('hackathon_submissions')
        .update({
          status: 'submitted',
          feedback: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId)
        .eq('hackathon_id', hackathonId)
        .eq('status', 'disqualified')
        .select()
        .single();

      if (error) {
        console.error('Error reinstating submission:', error);
        return res.status(500).json({ success: false, message: 'Failed to reinstate submission' });
      }

      return res.json({ 
        success: true, 
        message: 'Submission reinstated',
        data 
      });
    } catch (error: any) {
      console.error('Error in reinstate submission:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  console.log('Submission moderation routes registered');
}
