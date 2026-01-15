/**
 * Simplified Judges Management Routes
 * 
 * These routes handle the simplified judge management system where judges
 * are stored per-hackathon without requiring accounts.
 * 
 * Requirements: 1.3, 1.4, 10.1, 10.2, 10.3, 14.1
 */

import type { Express, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { generateSecureToken } from '../../shared/judgeToken';
import { sendJudgeScoringLinkEmail } from '../services/email';

// Helper to get user ID from bearer token
async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

// Helper to check hackathon access
async function checkHackathonAccess(
  supabaseAdmin: any,
  hackathonId: string | number,
  userId: string
): Promise<{ hasAccess: boolean; isOwner: boolean }> {
  // Check if user is the owner
  const { data: hackathon } = await supabaseAdmin
    .from('organizer_hackathons')
    .select('organizer_id')
    .eq('id', hackathonId)
    .single();

  if (hackathon?.organizer_id === userId) {
    return { hasAccess: true, isOwner: true };
  }

  // Check if user is a co-organizer
  const { data: coOrg } = await supabaseAdmin
    .from('hackathon_organizers')
    .select('role, status')
    .eq('hackathon_id', hackathonId)
    .eq('user_id', userId)
    .eq('status', 'accepted')
    .single();

  if (coOrg) {
    return { hasAccess: true, isOwner: false };
  }

  return { hasAccess: false, isOwner: false };
}

export function registerSimplifiedJudgesRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  if (!supabaseAdmin) {
    console.warn('Simplified judges routes not registered: Supabase admin client not available');
    return;
  }

  /**
   * GET /api/organizer/hackathons/:hackathonId/judges
   * 
   * Get all judges for a hackathon.
   * Requirements: 1.3
   */
  app.get('/api/organizer/hackathons/:hackathonId/judges', async (req: Request, res: Response) => {
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

      console.log('[SimplifiedJudges] Fetching judges for hackathon:', hackathonId, 'type:', typeof hackathonId);

      const { data, error } = await supabaseAdmin
        .from('hackathon_judges')
        .select('*')
        .eq('hackathon_id', parseInt(hackathonId))
        .order('created_at', { ascending: true });

      console.log('[SimplifiedJudges] Judges result:', { count: data?.length, error });

      if (error) {
        console.error('Error fetching judges:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch judges' });
      }

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      console.error('Error in GET judges:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  /**
   * POST /api/organizer/hackathons/:hackathonId/judges
   * 
   * Add a new judge to a hackathon.
   * Requirements: 1.3
   */
  app.post('/api/organizer/hackathons/:hackathonId/judges', async (req: Request, res: Response) => {
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
      const { name, email, role_title, company, bio, profile_photo } = req.body;

      // Validate required fields
      if (!name || !email) {
        return res.status(400).json({ success: false, message: 'Name and email are required' });
      }

      // Validate bio length
      if (bio && bio.length > 100) {
        return res.status(400).json({ success: false, message: 'Bio must be 100 characters or less' });
      }

      // Verify access
      const access = await checkHackathonAccess(supabaseAdmin, hackathonId, userId);
      if (!access.hasAccess) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Check if judge with same email already exists for this hackathon
      const { data: existingJudge } = await supabaseAdmin
        .from('hackathon_judges')
        .select('id')
        .eq('hackathon_id', hackathonId)
        .eq('email', email.toLowerCase())
        .single();

      if (existingJudge) {
        return res.status(409).json({ success: false, message: 'A judge with this email already exists for this hackathon' });
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_judges')
        .insert({
          hackathon_id: parseInt(hackathonId),
          name: name.trim(),
          email: email.toLowerCase().trim(),
          role_title: role_title?.trim() || null,
          company: company?.trim() || null,
          bio: bio?.trim() || null,
          profile_photo: profile_photo?.trim() || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating judge:', error);
        return res.status(500).json({ success: false, message: 'Failed to add judge' });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in POST judge:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  /**
   * PATCH /api/organizer/hackathons/:hackathonId/judges/:judgeId
   * 
   * Update a judge's information.
   * Requirements: 1.3
   */
  app.patch('/api/organizer/hackathons/:hackathonId/judges/:judgeId', async (req: Request, res: Response) => {
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

      const { hackathonId, judgeId } = req.params;
      const { name, email, role_title, company, bio, profile_photo } = req.body;

      // Validate bio length
      if (bio && bio.length > 100) {
        return res.status(400).json({ success: false, message: 'Bio must be 100 characters or less' });
      }

      // Verify access
      const access = await checkHackathonAccess(supabaseAdmin, hackathonId, userId);
      if (!access.hasAccess) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name.trim();
      if (email !== undefined) updateData.email = email.toLowerCase().trim();
      if (role_title !== undefined) updateData.role_title = role_title?.trim() || null;
      if (company !== undefined) updateData.company = company?.trim() || null;
      if (bio !== undefined) updateData.bio = bio?.trim() || null;
      if (profile_photo !== undefined) updateData.profile_photo = profile_photo?.trim() || null;

      const { data, error } = await supabaseAdmin
        .from('hackathon_judges')
        .update(updateData)
        .eq('id', judgeId)
        .eq('hackathon_id', hackathonId)
        .select()
        .single();

      if (error) {
        console.error('Error updating judge:', error);
        return res.status(500).json({ success: false, message: 'Failed to update judge' });
      }

      if (!data) {
        return res.status(404).json({ success: false, message: 'Judge not found' });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in PATCH judge:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  /**
   * DELETE /api/organizer/hackathons/:hackathonId/judges/:judgeId
   * 
   * Remove a judge from a hackathon.
   * Requirements: 1.3
   */
  app.delete('/api/organizer/hackathons/:hackathonId/judges/:judgeId', async (req: Request, res: Response) => {
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

      const { hackathonId, judgeId } = req.params;

      // Verify access
      const access = await checkHackathonAccess(supabaseAdmin, hackathonId, userId);
      if (!access.hasAccess) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Delete associated scoring tokens first
      await supabaseAdmin
        .from('judge_scoring_tokens')
        .delete()
        .eq('judge_id', judgeId);

      // Delete associated scores
      await supabaseAdmin
        .from('judge_scores')
        .delete()
        .eq('judge_id', judgeId);

      // Delete the judge
      const { error } = await supabaseAdmin
        .from('hackathon_judges')
        .delete()
        .eq('id', judgeId)
        .eq('hackathon_id', hackathonId);

      if (error) {
        console.error('Error deleting judge:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete judge' });
      }

      return res.json({ success: true, message: 'Judge removed successfully' });
    } catch (error: any) {
      console.error('Error in DELETE judge:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  /**
   * POST /api/organizer/hackathons/:hackathonId/resend-judge-links
   * 
   * Resend scoring links to all judges for a hackathon.
   * Generates new tokens and sends emails to all judges.
   */
  app.post('/api/organizer/hackathons/:hackathonId/resend-judge-links', async (req: Request, res: Response) => {
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

      // Verify user is organizer
      const { data: hackathon, error: hackathonError } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('id, hackathon_name, organizer_id')
        .eq('id', hackathonId)
        .single();

      if (hackathonError || !hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Check if user is owner or co-organizer
      const isOwner = hackathon.organizer_id === userId;
      let isCoOrganizer = false;
      
      if (!isOwner) {
        const { data: coOrg } = await supabaseAdmin
          .from('hackathon_co_organizers')
          .select('role')
          .eq('hackathon_id', hackathonId)
          .eq('user_id', userId)
          .single();
        isCoOrganizer = !!coOrg;
      }

      if (!isOwner && !isCoOrganizer) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Get all judges
      const { data: judges, error: judgesError } = await supabaseAdmin
        .from('hackathon_judges')
        .select('id, name, email')
        .eq('hackathon_id', hackathonId);

      if (judgesError) {
        return res.status(500).json({ success: false, message: 'Failed to fetch judges' });
      }

      if (!judges || judges.length === 0) {
        return res.status(400).json({ success: false, message: 'No judges found for this hackathon' });
      }

      let emailsSent = 0;
      const errors: string[] = [];

      for (const judge of judges) {
        try {
          // Generate new token
          const tokenResult = generateSecureToken();
          const tokenValue = tokenResult.token;
          const expiresAt = tokenResult.expiresAt;

          // Check if token already exists
          const { data: existingToken } = await supabaseAdmin
            .from('judge_scoring_tokens')
            .select('id')
            .eq('judge_id', judge.id)
            .single();

          if (existingToken) {
            await supabaseAdmin
              .from('judge_scoring_tokens')
              .update({
                token: tokenValue,
                expires_at: expiresAt.toISOString(),
                created_at: new Date().toISOString()
              })
              .eq('id', existingToken.id);
          } else {
            await supabaseAdmin
              .from('judge_scoring_tokens')
              .insert({
                hackathon_id: parseInt(hackathonId),
                judge_id: judge.id,
                token: tokenValue,
                expires_at: expiresAt.toISOString()
              });
          }

          // Send email
          const scoringUrl = `${process.env.FRONTEND_URL || 'https://maximally.in'}/judge/${tokenValue}`;
          
          const emailResult = await sendJudgeScoringLinkEmail({
            email: judge.email,
            judgeName: judge.name,
            hackathonName: hackathon.hackathon_name,
            scoringUrl,
            expiresAt: expiresAt.toISOString()
          });

          if (emailResult.success) {
            emailsSent++;
            console.log(`✅ Scoring link resent to ${judge.name} (${judge.email})`);
          } else {
            errors.push(`Failed to send to ${judge.email}`);
          }
        } catch (err: any) {
          errors.push(`Error for ${judge.email}: ${err.message}`);
        }
      }

      return res.json({
        success: true,
        message: `Scoring links sent to ${emailsSent}/${judges.length} judges`,
        emailsSent,
        totalJudges: judges.length,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (error: any) {
      console.error('Error in resend-judge-links:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  /**
   * POST /api/organizer/hackathons/:hackathonId/publish-gallery
   * 
   * Make the project gallery public and send scoring links to all judges.
   * This is the single action that triggers:
   * - Mark moderation as done
   * - Make gallery visible
   * - Generate and send secure scoring links to all judges
   * 
   * Requirements: 10.1, 10.2, 10.3, 1.4
   */
  app.post('/api/organizer/hackathons/:hackathonId/publish-gallery', async (req: Request, res: Response) => {
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

      // Get hackathon details
      const { data: hackathon, error: hackathonError } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('id, hackathon_name, slug, gallery_public')
        .eq('id', hackathonId)
        .single();

      if (hackathonError || !hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      if (hackathon.gallery_public) {
        return res.status(400).json({ success: false, message: 'Gallery is already public' });
      }

      // Get all judges for this hackathon
      const { data: judges, error: judgesError } = await supabaseAdmin
        .from('hackathon_judges')
        .select('id, name, email')
        .eq('hackathon_id', hackathonId);

      if (judgesError) {
        console.error('Error fetching judges:', judgesError);
        return res.status(500).json({ success: false, message: 'Failed to fetch judges' });
      }

      // Update hackathon to mark gallery as public
      const { error: updateError } = await supabaseAdmin
        .from('organizer_hackathons')
        .update({
          gallery_public: true,
          gallery_published_at: new Date().toISOString()
        })
        .eq('id', hackathonId);

      if (updateError) {
        console.error('Error updating hackathon:', updateError);
        return res.status(500).json({ success: false, message: 'Failed to publish gallery' });
      }

      // Generate scoring tokens for each judge and send emails
      const tokenResults = [];
      const emailResults = [];

      for (const judge of judges || []) {
        // Generate secure token
        const tokenResult = generateSecureToken();
        const tokenValue = tokenResult.token;
        const expiresAt = tokenResult.expiresAt;

        // Check if token already exists for this judge
        const { data: existingToken } = await supabaseAdmin
          .from('judge_scoring_tokens')
          .select('id')
          .eq('judge_id', judge.id)
          .single();

        if (existingToken) {
          // Update existing token
          await supabaseAdmin
            .from('judge_scoring_tokens')
            .update({
              token: tokenValue,
              expires_at: expiresAt.toISOString(),
              created_at: new Date().toISOString()
            })
            .eq('id', existingToken.id);
        } else {
          // Create new token
          await supabaseAdmin
            .from('judge_scoring_tokens')
            .insert({
              hackathon_id: parseInt(hackathonId),
              judge_id: judge.id,
              token: tokenValue,
              expires_at: expiresAt.toISOString()
            });
        }

        tokenResults.push({ judgeId: judge.id, token: tokenValue });

        // Send email with scoring link
        const scoringUrl = `${process.env.FRONTEND_URL || 'https://maximally.in'}/judge/${tokenValue}`;
        
        try {
          const emailResult = await sendJudgeScoringLinkEmail({
            email: judge.email,
            judgeName: judge.name,
            hackathonName: hackathon.hackathon_name,
            scoringUrl,
            expiresAt: expiresAt.toISOString()
          });
          
          if (emailResult.success) {
            emailResults.push({ judgeId: judge.id, email: judge.email, sent: true });
            console.log(`✅ Scoring link sent to ${judge.name} (${judge.email})`);
          } else {
            emailResults.push({ judgeId: judge.id, email: judge.email, sent: false, error: emailResult.error });
            console.error(`❌ Failed to send scoring link to ${judge.email}:`, emailResult.error);
          }
        } catch (emailError) {
          emailResults.push({ judgeId: judge.id, email: judge.email, sent: false, error: emailError });
          console.error(`❌ Error sending email to ${judge.email}:`, emailError);
        }
      }

      return res.json({
        success: true,
        message: 'Gallery published and judges notified',
        data: {
          gallery_public: true,
          judges_notified: judges?.length || 0
        }
      });
    } catch (error: any) {
      console.error('Error in publish-gallery:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  console.log('Simplified judges routes registered');
}
