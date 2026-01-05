// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";
import { sendJudgeReminderEmail } from "../services/email";

// Helper to get user ID from bearer token
async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

export function registerJudgeReminderRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // Send judge reminders for a hackathon
  app.post("/api/organizer/hackathons/:hackathonId/send-judge-reminders", async (req, res) => {
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
        .select('*')
        .eq('id', hackathonId)
        .eq('organizer_id', userId)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Get all judges assigned to this hackathon
      const { data: assignments } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .select(`
          judge_id,
          judge:profiles!judge_hackathon_assignments_judge_id_fkey(
            id,
            email,
            full_name,
            username
          )
        `)
        .eq('hackathon_id', hackathonId)
        .eq('status', 'active');

      if (!assignments || assignments.length === 0) {
        return res.status(400).json({ success: false, message: 'No judges assigned to this hackathon' });
      }

      // Get all submissions
      const { data: submissions } = await supabaseAdmin
        .from('hackathon_submissions')
        .select('id')
        .eq('hackathon_id', hackathonId)
        .eq('status', 'submitted');

      const totalSubmissions = submissions?.length || 0;

      if (totalSubmissions === 0) {
        return res.status(400).json({ success: false, message: 'No submissions to judge' });
      }

      // For each judge, calculate their progress and send reminder
      let sentCount = 0;
      let failedCount = 0;
      const results: any[] = [];

      for (const assignment of assignments) {
        const judge = assignment.judge as any;
        if (!judge?.email) continue;

        // Get scores by this judge
        const { data: scores } = await supabaseAdmin
          .from('hackathon_submission_ratings')
          .select('submission_id')
          .eq('judge_id', assignment.judge_id);

        const scoredCount = new Set(scores?.map(s => s.submission_id) || []).size;
        const unscoredCount = totalSubmissions - scoredCount;

        // Only send reminder if there are unscored submissions
        if (unscoredCount > 0) {
          const result = await sendJudgeReminderEmail({
            email: judge.email,
            judgeName: judge.full_name || judge.username || 'Judge',
            hackathonName: hackathon.hackathon_name,
            hackathonSlug: hackathon.slug,
            unscoredCount,
            totalSubmissions,
            judgingDeadline: hackathon.judging_ends_at,
          });

          if (result.success) {
            sentCount++;
            results.push({ judge: judge.email, status: 'sent', unscored: unscoredCount });
          } else {
            failedCount++;
            results.push({ judge: judge.email, status: 'failed', error: result.error });
          }
        } else {
          results.push({ judge: judge.email, status: 'skipped', reason: 'All submissions scored' });
        }
      }

      return res.json({
        success: true,
        message: `Sent ${sentCount} reminder(s)`,
        sent: sentCount,
        failed: failedCount,
        details: results,
      });
    } catch (error: any) {
      console.error('Error sending judge reminders:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get judge progress for a hackathon (for organizer dashboard)
  app.get("/api/organizer/hackathons/:hackathonId/judge-progress", async (req, res) => {
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
        .select('id')
        .eq('id', hackathonId)
        .eq('organizer_id', userId)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Get all judges
      const { data: assignments } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .select(`
          judge_id,
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

      // Get total submissions
      const { data: submissions } = await supabaseAdmin
        .from('hackathon_submissions')
        .select('id')
        .eq('hackathon_id', hackathonId)
        .eq('status', 'submitted');

      const totalSubmissions = submissions?.length || 0;

      // Calculate progress for each judge
      const judgeProgress = await Promise.all(
        (assignments || []).map(async (assignment) => {
          const judge = assignment.judge as any;
          
          const { data: scores } = await supabaseAdmin
            .from('hackathon_submission_ratings')
            .select('submission_id')
            .eq('judge_id', assignment.judge_id);

          const scoredCount = new Set(scores?.map(s => s.submission_id) || []).size;
          const progress = totalSubmissions > 0 ? Math.round((scoredCount / totalSubmissions) * 100) : 0;

          return {
            judge_id: assignment.judge_id,
            name: judge?.full_name || judge?.username || 'Unknown',
            email: judge?.email,
            avatar_url: judge?.avatar_url,
            scored: scoredCount,
            total: totalSubmissions,
            progress,
            completed: scoredCount >= totalSubmissions,
          };
        })
      );

      return res.json({
        success: true,
        data: {
          totalSubmissions,
          judges: judgeProgress,
          overallProgress: judgeProgress.length > 0
            ? Math.round(judgeProgress.reduce((sum, j) => sum + j.progress, 0) / judgeProgress.length)
            : 0,
        },
      });
    } catch (error: any) {
      console.error('Error fetching judge progress:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
