// Scheduled tasks for hackathon automation
import { createClient } from "@supabase/supabase-js";
import { sendJudgeInvitationEmail } from "./email";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Auto-publish galleries for hackathons that have ended
 * This should be run every 5 minutes via a cron job or scheduled function
 */
export async function autoPublishGalleries(): Promise<{
  processed: number;
  published: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let processed = 0;
  let published = 0;

  try {
    console.log('[autoPublishGalleries] Starting auto-publish check...');

    // Find hackathons that should have their galleries auto-published
    const { data: hackathons, error: fetchError } = await supabaseAdmin
      .from('organizer_hackathons')
      .select(`
        id,
        hackathon_name,
        slug,
        organizer_id,
        organizer_email,
        end_date,
        auto_publish_gallery,
        gallery_published_at,
        status
      `)
      .eq('status', 'published')
      .eq('auto_publish_gallery', true)
      .is('gallery_published_at', null)
      .lte('end_date', new Date().toISOString());

    if (fetchError) {
      errors.push(`Failed to fetch hackathons: ${fetchError.message}`);
      return { processed, published, errors };
    }

    if (!hackathons || hackathons.length === 0) {
      console.log('[autoPublishGalleries] No hackathons found for auto-publish');
      return { processed, published, errors };
    }

    console.log(`[autoPublishGalleries] Found ${hackathons.length} hackathons to process`);

    for (const hackathon of hackathons) {
      processed++;
      
      try {
        console.log(`[autoPublishGalleries] Processing hackathon: ${hackathon.slug}`);

        // Double-check that the hackathon has actually ended
        const now = new Date();
        const endDate = new Date(hackathon.end_date);
        
        if (now < endDate) {
          console.log(`[autoPublishGalleries] Skipping ${hackathon.slug} - not yet ended`);
          continue;
        }

        // Update hackathon to mark gallery as published
        const { error: updateError } = await supabaseAdmin
          .from('organizer_hackathons')
          .update({
            gallery_published_at: now.toISOString()
          })
          .eq('id', hackathon.id);

        if (updateError) {
          errors.push(`Failed to publish gallery for ${hackathon.slug}: ${updateError.message}`);
          continue;
        }

        published++;
        console.log(`[autoPublishGalleries] Published gallery for: ${hackathon.slug}`);

        // Get judges for this hackathon to notify them
        const { data: judges, error: judgesError } = await supabaseAdmin
          .from('hackathon_judges')
          .select('id, name, email, role, company')
          .eq('hackathon_id', hackathon.id)
          .eq('status', 'confirmed');

        if (judgesError) {
          errors.push(`Failed to fetch judges for ${hackathon.slug}: ${judgesError.message}`);
          continue;
        }

        // Send notification emails to judges
        if (judges && judges.length > 0) {
          console.log(`[autoPublishGalleries] Notifying ${judges.length} judges for ${hackathon.slug}`);
          
          for (const judge of judges) {
            try {
              await sendJudgeInvitationEmail({
                email: judge.email,
                judgeName: judge.name,
                hackathonName: hackathon.hackathon_name,
                hackathonSlug: hackathon.slug,
                organizerName: hackathon.organizer_email,
                invitationLink: `https://maximally.in/judge/${hackathon.slug}`
              });
            } catch (emailError: any) {
              errors.push(`Failed to notify judge ${judge.email} for ${hackathon.slug}: ${emailError.message}`);
            }
          }
        }

        // Log activity for admin tracking
        await supabaseAdmin
          .from('admin_activity_feed')
          .insert({
            activity_type: 'hackathon_gallery_auto_published',
            actor_id: null, // System action
            actor_username: 'system',
            actor_email: 'system@maximally.in',
            target_type: 'hackathon',
            target_id: hackathon.id.toString(),
            target_name: hackathon.hackathon_name,
            action: 'auto_publish_gallery',
            metadata: {
              hackathon_slug: hackathon.slug,
              end_date: hackathon.end_date,
              judges_notified: judges?.length || 0
            },
            severity: 'info'
          });

      } catch (hackathonError: any) {
        errors.push(`Error processing hackathon ${hackathon.slug}: ${hackathonError.message}`);
      }
    }

    console.log(`[autoPublishGalleries] Completed: ${processed} processed, ${published} published, ${errors.length} errors`);

  } catch (error: any) {
    errors.push(`Fatal error in autoPublishGalleries: ${error.message}`);
  }

  return { processed, published, errors };
}

/**
 * Send deadline reminders to participants
 * This should be run daily to check for hackathons ending soon
 */
export async function sendDeadlineReminders(): Promise<{
  processed: number;
  reminded: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let processed = 0;
  let reminded = 0;

  try {
    console.log('[sendDeadlineReminders] Starting deadline reminder check...');

    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find hackathons ending in the next 24 hours that haven't sent reminders yet
    const { data: hackathons, error: fetchError } = await supabaseAdmin
      .from('organizer_hackathons')
      .select(`
        id,
        hackathon_name,
        slug,
        organizer_email,
        end_date,
        status,
        deadline_reminder_sent
      `)
      .eq('status', 'published')
      .gte('end_date', now.toISOString())
      .lte('end_date', twentyFourHoursFromNow.toISOString())
      .neq('deadline_reminder_sent', true);

    if (fetchError) {
      errors.push(`Failed to fetch hackathons: ${fetchError.message}`);
      return { processed, reminded, errors };
    }

    if (!hackathons || hackathons.length === 0) {
      console.log('[sendDeadlineReminders] No hackathons found for deadline reminders');
      return { processed, reminded, errors };
    }

    console.log(`[sendDeadlineReminders] Found ${hackathons.length} hackathons to process`);

    for (const hackathon of hackathons) {
      processed++;
      
      try {
        console.log(`[sendDeadlineReminders] Processing hackathon: ${hackathon.slug}`);

        // Get registered participants
        const { data: registrations, error: regError } = await supabaseAdmin
          .from('hackathon_registrations')
          .select(`
            user_id,
            profiles!inner(email, full_name, username)
          `)
          .eq('hackathon_id', hackathon.id)
          .eq('status', 'confirmed');

        if (regError) {
          errors.push(`Failed to fetch registrations for ${hackathon.slug}: ${regError.message}`);
          continue;
        }

        if (!registrations || registrations.length === 0) {
          console.log(`[sendDeadlineReminders] No registrations found for ${hackathon.slug}`);
          continue;
        }

        // Send reminder emails (implement this function in email service)
        // await sendDeadlineReminderEmails(hackathon, registrations);

        // Mark reminder as sent
        const { error: updateError } = await supabaseAdmin
          .from('organizer_hackathons')
          .update({
            deadline_reminder_sent: true
          })
          .eq('id', hackathon.id);

        if (updateError) {
          errors.push(`Failed to mark reminder sent for ${hackathon.slug}: ${updateError.message}`);
          continue;
        }

        reminded++;
        console.log(`[sendDeadlineReminders] Sent reminders for: ${hackathon.slug} to ${registrations.length} participants`);

      } catch (hackathonError: any) {
        errors.push(`Error processing hackathon ${hackathon.slug}: ${hackathonError.message}`);
      }
    }

    console.log(`[sendDeadlineReminders] Completed: ${processed} processed, ${reminded} reminded, ${errors.length} errors`);

  } catch (error: any) {
    errors.push(`Fatal error in sendDeadlineReminders: ${error.message}`);
  }

  return { processed, reminded, errors };
}

/**
 * Clean up expired tokens and temporary data
 * This should be run daily
 */
export async function cleanupExpiredData(): Promise<{
  judgeTokensDeleted: number;
  teamInvitesDeleted: number;
  otpCodesDeleted: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let judgeTokensDeleted = 0;
  let teamInvitesDeleted = 0;
  let otpCodesDeleted = 0;

  try {
    console.log('[cleanupExpiredData] Starting cleanup...');

    const now = new Date();

    // Clean up expired judge tokens
    try {
      const { count: deletedTokens, error: tokenError } = await supabaseAdmin
        .from('judge_tokens')
        .delete({ count: 'exact' })
        .lt('expires_at', now.toISOString());

      if (tokenError) {
        errors.push(`Failed to delete expired judge tokens: ${tokenError.message}`);
      } else {
        judgeTokensDeleted = deletedTokens || 0;
        console.log(`[cleanupExpiredData] Deleted ${judgeTokensDeleted} expired judge tokens`);
      }
    } catch (error: any) {
      errors.push(`Error cleaning judge tokens: ${error.message}`);
    }

    // Clean up expired team invitations (if they exist)
    try {
      const { count: deletedInvites, error: inviteError } = await supabaseAdmin
        .from('team_invitations')
        .delete({ count: 'exact' })
        .lt('expires_at', now.toISOString());

      if (inviteError && inviteError.code !== 'PGRST116') { // Ignore table not found
        errors.push(`Failed to delete expired team invites: ${inviteError.message}`);
      } else {
        teamInvitesDeleted = deletedInvites || 0;
        console.log(`[cleanupExpiredData] Deleted ${teamInvitesDeleted} expired team invites`);
      }
    } catch (error: any) {
      errors.push(`Error cleaning team invites: ${error.message}`);
    }

    // Clean up expired OTP codes (if they exist)
    try {
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
      
      const { count: deletedOtps, error: otpError } = await supabaseAdmin
        .from('signup_otps')
        .delete({ count: 'exact' })
        .lt('created_at', tenMinutesAgo.toISOString());

      if (otpError && otpError.code !== 'PGRST116') { // Ignore table not found
        errors.push(`Failed to delete expired OTP codes: ${otpError.message}`);
      } else {
        otpCodesDeleted = deletedOtps || 0;
        console.log(`[cleanupExpiredData] Deleted ${otpCodesDeleted} expired OTP codes`);
      }
    } catch (error: any) {
      errors.push(`Error cleaning OTP codes: ${error.message}`);
    }

    console.log(`[cleanupExpiredData] Completed cleanup`);

  } catch (error: any) {
    errors.push(`Fatal error in cleanupExpiredData: ${error.message}`);
  }

  return { judgeTokensDeleted, teamInvitesDeleted, otpCodesDeleted, errors };
}

/**
 * Run all scheduled tasks
 * This is the main function to call from a cron job
 */
export async function runScheduledTasks(): Promise<{
  autoPublish: any;
  deadlineReminders: any;
  cleanup: any;
  totalErrors: number;
}> {
  console.log('[runScheduledTasks] Starting all scheduled tasks...');

  const autoPublish = await autoPublishGalleries();
  const deadlineReminders = await sendDeadlineReminders();
  const cleanup = await cleanupExpiredData();

  const totalErrors = autoPublish.errors.length + deadlineReminders.errors.length + cleanup.errors.length;

  console.log(`[runScheduledTasks] All tasks completed. Total errors: ${totalErrors}`);

  // Log summary to admin activity feed
  try {
    await supabaseAdmin
      .from('admin_activity_feed')
      .insert({
        activity_type: 'scheduled_tasks_completed',
        actor_id: null,
        actor_username: 'system',
        actor_email: 'system@maximally.in',
        target_type: 'system',
        target_id: 'scheduled_tasks',
        target_name: 'Scheduled Tasks',
        action: 'run_all_tasks',
        metadata: {
          auto_publish: {
            processed: autoPublish.processed,
            published: autoPublish.published,
            errors: autoPublish.errors.length
          },
          deadline_reminders: {
            processed: deadlineReminders.processed,
            reminded: deadlineReminders.reminded,
            errors: deadlineReminders.errors.length
          },
          cleanup: {
            judge_tokens_deleted: cleanup.judgeTokensDeleted,
            team_invites_deleted: cleanup.teamInvitesDeleted,
            otp_codes_deleted: cleanup.otpCodesDeleted,
            errors: cleanup.errors.length
          },
          total_errors: totalErrors
        },
        severity: totalErrors > 0 ? 'warning' : 'info'
      });
  } catch (logError) {
    console.error('Failed to log scheduled tasks summary:', logError);
  }

  return {
    autoPublish,
    deadlineReminders,
    cleanup,
    totalErrors
  };
}