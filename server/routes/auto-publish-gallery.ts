// @ts-nocheck
/**
 * Auto-Publish Gallery Routes
 * 
 * This module provides automatic gallery publication for ended hackathons.
 * When a hackathon's end_date passes (UTC) AND auto_publish_gallery is enabled, this will:
 * 1. Set gallery_public = true
 * 2. Update hackathon_status to 'ended'
 * 3. Generate scoring tokens for judges
 * 4. Send scoring link emails to all judges
 * 
 * All times follow UTC. No timezone configuration.
 */

import type { Express, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { generateSecureToken } from '../../shared/judgeToken';
import { sendJudgeScoringLinkEmail } from '../services/email';

export function registerAutoPublishGalleryRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  /**
   * POST /api/cron/auto-publish-galleries
   * 
   * Automatically publishes galleries for hackathons that have ended (UTC)
   * AND have auto_publish_gallery enabled.
   * 
   * This endpoint should be called periodically (e.g., every 5-15 minutes).
   * 
   * Security: Uses a secret key to prevent unauthorized access.
   */
  app.post('/api/cron/auto-publish-galleries', async (req: Request, res: Response) => {
    try {
      // Verify cron secret (optional - for security)
      const cronSecret = req.headers['x-cron-secret'] || req.query.secret;
      const expectedSecret = process.env.CRON_SECRET;
      
      // If CRON_SECRET is set, verify it
      if (expectedSecret && cronSecret !== expectedSecret) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const now = new Date();
      console.log(`[AutoPublish] Running auto-publish check at ${now.toISOString()} (UTC)`);

      // Find hackathons that:
      // 1. Have ended (end_date < now in UTC)
      // 2. Are published (status = 'published')
      // 3. Gallery is not yet public (gallery_public = false or null)
      // 4. Auto-publish is enabled (auto_publish_gallery = true)
      
      // First, let's see all published hackathons for debugging
      const { data: allPublished } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('id, hackathon_name, status, end_date, gallery_public, auto_publish_gallery')
        .eq('status', 'published');
      
      // Helper to check if hackathon has ended (UTC comparison)
      // All dates are stored and compared in UTC
      const hasHackathonEnded = (endDateStr: string) => {
        const endDate = new Date(endDateStr);
        return now > endDate;
      };
      
      console.log('[AutoPublish] All published hackathons:', allPublished?.map(h => ({
        id: h.id,
        name: h.hackathon_name,
        end_date: h.end_date,
        gallery_public: h.gallery_public,
        auto_publish_gallery: h.auto_publish_gallery,
        hasEnded: hasHackathonEnded(h.end_date)
      })));

      // Filter hackathons that:
      // - Have ended (UTC)
      // - Gallery not yet public
      // - Auto-publish is enabled
      const endedHackathons = allPublished?.filter(h => 
        (h.gallery_public === false || h.gallery_public === null) && 
        h.auto_publish_gallery === true &&
        hasHackathonEnded(h.end_date)
      ) || [];

      if (endedHackathons.length === 0) {
        console.log('[AutoPublish] No hackathons need gallery publication');
        return res.json({ success: true, message: 'No hackathons need processing', processed: 0 });
      }

      console.log(`[AutoPublish] Found ${endedHackathons.length} hackathons to process`);

      const results = [];

      for (const hackathon of endedHackathons) {
        try {
          console.log(`[AutoPublish] Processing hackathon: ${hackathon.hackathon_name} (ID: ${hackathon.id})`);

          // Update hackathon: set gallery_public = true and hackathon_status = 'ended'
          const { error: updateError } = await supabaseAdmin
            .from('organizer_hackathons')
            .update({
              gallery_public: true,
              gallery_published_at: now.toISOString(),
              hackathon_status: 'ended'
            })
            .eq('id', hackathon.id);

          if (updateError) {
            console.error(`[AutoPublish] Error updating hackathon ${hackathon.id}:`, updateError);
            results.push({ hackathonId: hackathon.id, success: false, error: updateError.message });
            continue;
          }

          // Get all judges for this hackathon
          const { data: judges, error: judgesError } = await supabaseAdmin
            .from('hackathon_judges')
            .select('id, name, email')
            .eq('hackathon_id', hackathon.id);

          if (judgesError) {
            console.error(`[AutoPublish] Error fetching judges for hackathon ${hackathon.id}:`, judgesError);
            results.push({ 
              hackathonId: hackathon.id, 
              success: true, 
              galleryPublished: true, 
              judgesNotified: 0,
              error: 'Failed to fetch judges'
            });
            continue;
          }

          let judgesNotified = 0;

          // Generate tokens and send emails to each judge
          for (const judge of judges || []) {
            try {
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
                    created_at: now.toISOString()
                  })
                  .eq('id', existingToken.id);
              } else {
                // Create new token
                await supabaseAdmin
                  .from('judge_scoring_tokens')
                  .insert({
                    hackathon_id: hackathon.id,
                    judge_id: judge.id,
                    token: tokenValue,
                    expires_at: expiresAt.toISOString()
                  });
              }

              // Send email with scoring link
              const scoringUrl = `${process.env.FRONTEND_URL || 'https://maximally.in'}/judge/${tokenValue}`;
              
              const emailResult = await sendJudgeScoringLinkEmail({
                email: judge.email,
                judgeName: judge.name,
                hackathonName: hackathon.hackathon_name,
                scoringUrl,
                expiresAt: expiresAt.toISOString()
              });

              if (emailResult.success) {
                judgesNotified++;
                console.log(`[AutoPublish] ✅ Scoring link sent to ${judge.name} (${judge.email})`);
              } else {
                console.error(`[AutoPublish] ❌ Failed to send email to ${judge.email}`);
              }
            } catch (judgeError) {
              console.error(`[AutoPublish] Error processing judge ${judge.id}:`, judgeError);
            }
          }

          results.push({
            hackathonId: hackathon.id,
            hackathonName: hackathon.hackathon_name,
            success: true,
            galleryPublished: true,
            judgesNotified,
            totalJudges: judges?.length || 0
          });

          console.log(`[AutoPublish] ✅ Hackathon ${hackathon.hackathon_name}: Gallery published, ${judgesNotified}/${judges?.length || 0} judges notified`);

        } catch (hackathonError: any) {
          console.error(`[AutoPublish] Error processing hackathon ${hackathon.id}:`, hackathonError);
          results.push({ hackathonId: hackathon.id, success: false, error: hackathonError.message });
        }
      }

      return res.json({
        success: true,
        message: `Processed ${results.length} hackathons`,
        processed: results.length,
        results
      });

    } catch (error: any) {
      console.error('[AutoPublish] Unexpected error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  console.log('Auto-publish gallery routes registered');
}
