// Scheduled tasks for hackathon automation — uses Neon PostgreSQL
import { sql } from "../db";
import { sendJudgeInvitationEmail } from "./email";

async function dbQuery(query: string, params: any[] = []) {
  if (!sql) throw new Error('Database not configured');
  return sql(query, params);
}

export async function autoPublishGalleries(): Promise<{ processed: number; published: number; errors: string[] }> {
  const errors: string[] = [];
  let processed = 0, published = 0;

  try {
    const hackathons = await dbQuery(`
      SELECT id, hackathon_name, slug, organizer_id, organizer_email, end_date
      FROM organizer_hackathons
      WHERE status = 'published' AND auto_publish_gallery = true
        AND gallery_published_at IS NULL AND end_date <= $1
    `, [new Date().toISOString()]);

    if (!hackathons.length) return { processed, published, errors };

    for (const hackathon of hackathons as any[]) {
      processed++;
      try {
        const now = new Date();
        if (now < new Date(hackathon.end_date)) continue;

        await dbQuery(`UPDATE organizer_hackathons SET gallery_published_at = $1 WHERE id = $2`, [now.toISOString(), hackathon.id]);
        published++;

        const judges = await dbQuery(`SELECT id, name, email FROM hackathon_judges WHERE hackathon_id = $1`, [hackathon.id]);
        for (const judge of judges as any[]) {
          try {
            await sendJudgeInvitationEmail({
              email: judge.email, judgeName: judge.name,
              hackathonName: hackathon.hackathon_name, hackathonSlug: hackathon.slug,
              organizerName: hackathon.organizer_email,
              invitationLink: `https://maximally.in/judge/${hackathon.slug}`
            });
          } catch (e: any) { errors.push(`Email failed for ${judge.email}: ${e.message}`); }
        }

        await dbQuery(`
          INSERT INTO admin_activity_feed (activity_type, actor_username, actor_email, target_type, target_id, target_name, action, metadata, severity)
          VALUES ('hackathon_gallery_auto_published', 'system', 'system@maximally.in', 'hackathon', $1, $2, 'auto_publish_gallery', $3, 'info')
        `, [hackathon.id.toString(), hackathon.hackathon_name, JSON.stringify({ hackathon_slug: hackathon.slug, judges_notified: judges.length })]);

      } catch (e: any) { errors.push(`Error processing ${hackathon.slug}: ${e.message}`); }
    }
  } catch (e: any) { errors.push(`Fatal: ${e.message}`); }

  return { processed, published, errors };
}

export async function sendDeadlineReminders(): Promise<{ processed: number; reminded: number; errors: string[] }> {
  const errors: string[] = [];
  let processed = 0, reminded = 0;

  try {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const hackathons = await dbQuery(`
      SELECT id, hackathon_name, slug, organizer_email, end_date
      FROM organizer_hackathons
      WHERE status = 'published' AND end_date >= $1 AND end_date <= $2
        AND (deadline_reminder_sent IS NULL OR deadline_reminder_sent = false)
    `, [now.toISOString(), in24h.toISOString()]);

    for (const hackathon of hackathons as any[]) {
      processed++;
      try {
        const registrations = await dbQuery(`
          SELECT hr.user_id, p.email, p.full_name, p.username
          FROM hackathon_registrations hr
          JOIN profiles p ON p.id = hr.user_id
          WHERE hr.hackathon_id = $1 AND hr.status = 'confirmed'
        `, [hackathon.id]);

        if (!registrations.length) continue;

        await dbQuery(`UPDATE organizer_hackathons SET deadline_reminder_sent = true WHERE id = $1`, [hackathon.id]);
        reminded++;
        console.log(`[deadlineReminders] Sent for ${hackathon.slug} to ${registrations.length} participants`);
      } catch (e: any) { errors.push(`Error for ${hackathon.slug}: ${e.message}`); }
    }
  } catch (e: any) { errors.push(`Fatal: ${e.message}`); }

  return { processed, reminded, errors };
}

export async function cleanupExpiredData(): Promise<{ judgeTokensDeleted: number; teamInvitesDeleted: number; otpCodesDeleted: number; errors: string[] }> {
  const errors: string[] = [];
  let judgeTokensDeleted = 0, teamInvitesDeleted = 0, otpCodesDeleted = 0;
  const now = new Date().toISOString();

  try {
    const r1 = await dbQuery(`DELETE FROM judge_scoring_tokens WHERE expires_at < $1 RETURNING id`, [now]);
    judgeTokensDeleted = (r1 as any[]).length;
  } catch (e: any) { errors.push(`Judge tokens: ${e.message}`); }

  try {
    const r2 = await dbQuery(`DELETE FROM hackathon_team_invitations WHERE expires_at < $1 RETURNING id`, [now]);
    teamInvitesDeleted = (r2 as any[]).length;
  } catch (e: any) { errors.push(`Team invites: ${e.message}`); }

  try {
    const r3 = await dbQuery(`DELETE FROM signup_otps WHERE expires_at < $1 RETURNING id`, [now]);
    otpCodesDeleted = (r3 as any[]).length;
  } catch (e: any) { errors.push(`OTP codes: ${e.message}`); }

  return { judgeTokensDeleted, teamInvitesDeleted, otpCodesDeleted, errors };
}

export async function runScheduledTasks() {
  console.log('[runScheduledTasks] Starting...');
  const autoPublish = await autoPublishGalleries();
  const deadlineReminders = await sendDeadlineReminders();
  const cleanup = await cleanupExpiredData();
  const totalErrors = autoPublish.errors.length + deadlineReminders.errors.length + cleanup.errors.length;

  try {
    await dbQuery(`
      INSERT INTO admin_activity_feed (activity_type, actor_username, actor_email, target_type, target_id, target_name, action, metadata, severity)
      VALUES ('scheduled_tasks_completed', 'system', 'system@maximally.in', 'system', 'scheduled_tasks', 'Scheduled Tasks', 'run_all_tasks', $1, $2)
    `, [JSON.stringify({ auto_publish: autoPublish, deadline_reminders: deadlineReminders, cleanup, total_errors: totalErrors }), totalErrors > 0 ? 'warning' : 'info']);
  } catch (e) { console.error('Failed to log tasks summary:', e); }

  return { autoPublish, deadlineReminders, cleanup, totalErrors };
}
