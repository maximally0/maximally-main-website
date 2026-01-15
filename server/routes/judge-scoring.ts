/**
 * Judge Scoring API Routes
 * 
 * These routes handle judge scoring via secure tokenized links.
 * Judges do not need to log in - they access scoring via tokens sent via email.
 * 
 * Requirements: 9.3, 9.4
 */

import type { Express, Response } from 'express';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createJudgeAuthMiddleware, type JudgeAuthenticatedRequest } from '../middleware/judgeAuth';

/**
 * Score submission request body
 */
interface ScoreSubmissionBody {
  submission_id: number;
  score: number;
  notes?: string;
}

/**
 * Registers judge scoring API routes.
 * 
 * Property 8: Judge Access Scope
 * For any authenticated judge token, the judge SHALL only see submissions
 * belonging to the hackathon associated with their token.
 * 
 * Validates: Requirements 9.3, 9.4
 * 
 * @param app - Express application
 */
export function registerJudgeScoringRoutes(app: Express): void {
  const supabaseAdmin = app.locals.supabaseAdmin as SupabaseClient | undefined;

  if (!supabaseAdmin) {
    console.warn('Judge scoring routes not registered: Supabase admin client not available');
    return;
  }

  const judgeAuth = createJudgeAuthMiddleware({ supabaseAdmin });

  /**
   * GET /api/judge/:token/submissions
   * 
   * Get all submissions for the hackathon that the judge is assigned to.
   * Only returns submissions for the hackathon associated with the token.
   * 
   * Property 8: Judge Access Scope
   * Validates: Requirements 9.3
   */
  app.get(
    '/api/judge/:token/submissions',
    judgeAuth,
    async (req: JudgeAuthenticatedRequest, res: Response) => {
      try {
        const { hackathonId, judgeId } = req.judgeAuth!;

        // Get hackathon info
        const { data: hackathon, error: hackathonError } = await supabaseAdmin
          .from('organizer_hackathons')
          .select('id, hackathon_name, end_date')
          .eq('id', hackathonId)
          .single();

        if (hackathonError || !hackathon) {
          return res.status(404).json({
            success: false,
            message: 'Hackathon not found',
          });
        }

        // Get judge info
        const { data: judge, error: judgeError } = await supabaseAdmin
          .from('hackathon_judges')
          .select('id, name, email')
          .eq('id', judgeId)
          .single();

        if (judgeError || !judge) {
          return res.status(404).json({
            success: false,
            message: 'Judge not found',
          });
        }

        // Get submissions for this hackathon
        const { data: submissions, error: submissionsError } = await supabaseAdmin
          .from('hackathon_submissions')
          .select(`
            id,
            project_name,
            description,
            demo_url,
            github_repo,
            video_url,
            created_at,
            updated_at
          `)
          .eq('hackathon_id', hackathonId)
          .order('created_at', { ascending: true });

        if (submissionsError) {
          console.error('Error fetching submissions:', submissionsError);
          return res.status(500).json({
            success: false,
            message: 'Failed to fetch submissions',
          });
        }

        // Get existing scores by this judge
        const { data: existingScores, error: scoresError } = await supabaseAdmin
          .from('judge_scores')
          .select('submission_id, score, notes, scored_at')
          .eq('judge_id', judgeId)
          .eq('hackathon_id', hackathonId);

        if (scoresError) {
          console.error('Error fetching scores:', scoresError);
        }

        // Create a map of submission_id to score
        const scoresMap = new Map(
          (existingScores || []).map((s: any) => [s.submission_id, s])
        );

        // Combine submissions with their scores
        const submissionsWithScores = (submissions || []).map((submission: any) => ({
          ...submission,
          score: scoresMap.get(submission.id) || null,
        }));

        return res.json({
          success: true,
          hackathon: {
            id: hackathon.id,
            title: hackathon.hackathon_name,
            end_date: hackathon.end_date,
          },
          judge: {
            id: judge.id,
            name: judge.name,
          },
          submissions: submissionsWithScores,
          stats: {
            total: submissionsWithScores.length,
            scored: submissionsWithScores.filter((s: any) => s.score !== null).length,
          },
        });
      } catch (error) {
        console.error('Error in GET /api/judge/:token/submissions:', error);
        return res.status(500).json({
          success: false,
          message: 'Server error',
        });
      }
    }
  );

  /**
   * POST /api/judge/:token/score
   * 
   * Submit or update a score for a submission.
   * Only allows scoring submissions from the hackathon associated with the token.
   * 
   * Validates: Requirements 9.4
   */
  app.post(
    '/api/judge/:token/score',
    judgeAuth,
    async (req: JudgeAuthenticatedRequest, res: Response) => {
      try {
        const { hackathonId, judgeId } = req.judgeAuth!;
        const { submission_id, score, notes } = req.body as ScoreSubmissionBody;

        // Validate required fields
        if (typeof submission_id !== 'number' || submission_id <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Valid submission_id is required',
          });
        }

        if (typeof score !== 'number' || score < 0 || score > 10) {
          return res.status(400).json({
            success: false,
            message: 'Score must be a number between 0 and 10',
          });
        }

        // Verify submission belongs to this hackathon (Property 8: Judge Access Scope)
        const { data: submission, error: submissionError } = await supabaseAdmin
          .from('hackathon_submissions')
          .select('id, hackathon_id')
          .eq('id', submission_id)
          .single();

        if (submissionError || !submission) {
          return res.status(404).json({
            success: false,
            message: 'Submission not found',
          });
        }

        if (submission.hackathon_id !== hackathonId) {
          return res.status(403).json({
            success: false,
            message: 'You can only score submissions from your assigned hackathon',
          });
        }

        // Check if score already exists (upsert)
        const { data: existingScore } = await supabaseAdmin
          .from('judge_scores')
          .select('id')
          .eq('judge_id', judgeId)
          .eq('submission_id', submission_id)
          .single();

        let result;
        if (existingScore) {
          // Update existing score
          result = await supabaseAdmin
            .from('judge_scores')
            .update({
              score,
              notes: notes || null,
              scored_at: new Date().toISOString(),
            })
            .eq('id', existingScore.id)
            .select()
            .single();
        } else {
          // Insert new score
          result = await supabaseAdmin
            .from('judge_scores')
            .insert({
              hackathon_id: hackathonId,
              judge_id: judgeId,
              submission_id,
              score,
              notes: notes || null,
              scored_at: new Date().toISOString(),
            })
            .select()
            .single();
        }

        if (result.error) {
          console.error('Error saving score:', result.error);
          return res.status(500).json({
            success: false,
            message: 'Failed to save score',
          });
        }

        return res.json({
          success: true,
          message: existingScore ? 'Score updated' : 'Score submitted',
          score: result.data,
        });
      } catch (error) {
        console.error('Error in POST /api/judge/:token/score:', error);
        return res.status(500).json({
          success: false,
          message: 'Server error',
        });
      }
    }
  );

  /**
   * GET /api/judge/:token/info
   * 
   * Get judge and hackathon info for the token.
   * Useful for displaying judge name and hackathon details on the scoring page.
   */
  app.get(
    '/api/judge/:token/info',
    judgeAuth,
    async (req: JudgeAuthenticatedRequest, res: Response) => {
      try {
        const { hackathonId, judgeId } = req.judgeAuth!;

        // Get hackathon info
        const { data: hackathon, error: hackathonError } = await supabaseAdmin
          .from('organizer_hackathons')
          .select('id, hackathon_name, description, start_date, end_date, hackathon_status')
          .eq('id', hackathonId)
          .single();

        if (hackathonError || !hackathon) {
          return res.status(404).json({
            success: false,
            message: 'Hackathon not found',
          });
        }

        // Get judge info
        const { data: judge, error: judgeError } = await supabaseAdmin
          .from('hackathon_judges')
          .select('id, name, email, role_title, company')
          .eq('id', judgeId)
          .single();

        if (judgeError || !judge) {
          return res.status(404).json({
            success: false,
            message: 'Judge not found',
          });
        }

        return res.json({
          success: true,
          hackathon: {
            id: hackathon.id,
            title: hackathon.hackathon_name,
            description: hackathon.description,
            start_date: hackathon.start_date,
            end_date: hackathon.end_date,
            status: hackathon.hackathon_status,
          },
          judge: {
            id: judge.id,
            name: judge.name,
            role_title: judge.role_title,
            company: judge.company,
          },
        });
      } catch (error) {
        console.error('Error in GET /api/judge/:token/info:', error);
        return res.status(500).json({
          success: false,
          message: 'Server error',
        });
      }
    }
  );

  console.log('Judge scoring routes registered');
}
