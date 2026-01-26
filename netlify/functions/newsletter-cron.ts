import { schedule } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Run every hour
export const handler = schedule('0 * * * *', async () => {
  console.log('Newsletter cron job started at:', new Date().toISOString());

  try {
    // Get active schedule settings
    const { data: settings, error: settingsError } = await supabase
      .from('newsletter_schedule_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    if (settingsError || !settings) {
      console.log('No active schedule settings found');
      return { statusCode: 200, body: 'No active schedule' };
    }

    // Check if it's time to send using IST timezone
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istNow = new Date(now.getTime() + istOffset);
    const nextScheduled = new Date(settings.next_scheduled_at);

    console.log('Current UTC time:', now.toISOString());
    console.log('Current IST time:', istNow.toISOString());
    console.log('Next scheduled (UTC):', nextScheduled.toISOString());

    if (now < nextScheduled) {
      console.log('Not time to send yet');
      return { statusCode: 200, body: 'Not time to send' };
    }

    // Get the oldest pending newsletter
    const { data: newsletter, error: newsletterError } = await supabase
      .from('newsletter_emails')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (newsletterError || !newsletter) {
      console.log('No pending newsletters found');
      
      // Update next scheduled time even if no newsletter
      const nextTime = calculateNextScheduledTime(settings);
      await supabase
        .from('newsletter_schedule_settings')
        .update({ 
          next_scheduled_at: nextTime,
          last_sent_at: now.toISOString()
        })
        .eq('id', settings.id);

      return { statusCode: 200, body: 'No pending newsletters' };
    }

    console.log('Found pending newsletter:', newsletter.id);

    // Get all active subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscriptions')
      .select('email')
      .eq('status', 'active');

    if (subscribersError || !subscribers || subscribers.length === 0) {
      console.log('No active subscribers found');
      return { statusCode: 200, body: 'No active subscribers' };
    }

    console.log(`Sending to ${subscribers.length} subscribers`);

    // Send emails (in production, integrate with your email service)
    let sentCount = 0;
    let failedCount = 0;

    for (const subscriber of subscribers) {
      try {
        // TODO: Replace with actual email sending
        // Example with Resend:
        // await resend.emails.send({
        //   from: 'newsletter@maximally.in',
        //   to: subscriber.email,
        //   subject: newsletter.subject,
        //   html: newsletter.html_content,
        // });

        // Log the send
        await supabase.from('newsletter_send_logs').insert({
          newsletter_id: newsletter.id,
          recipient_email: subscriber.email,
          status: 'sent',
        });

        sentCount++;
      } catch (error) {
        console.error(`Failed to send to ${subscriber.email}:`, error);
        
        await supabase.from('newsletter_send_logs').insert({
          newsletter_id: newsletter.id,
          recipient_email: subscriber.email,
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
        });

        failedCount++;
      }
    }

    // Update newsletter status
    await supabase
      .from('newsletter_emails')
      .update({
        status: 'sent',
        sent_at: now.toISOString(),
        total_sent: sentCount,
        total_failed: failedCount,
      })
      .eq('id', newsletter.id);

    // Calculate and update next scheduled time
    const nextTime = calculateNextScheduledTime(settings);
    await supabase
      .from('newsletter_schedule_settings')
      .update({ 
        next_scheduled_at: nextTime,
        last_sent_at: now.toISOString()
      })
      .eq('id', settings.id);

    console.log(`Newsletter sent successfully. Sent: ${sentCount}, Failed: ${failedCount}`);
    console.log('Next scheduled send:', nextTime);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        newsletter_id: newsletter.id,
        sent: sentCount,
        failed: failedCount,
        next_scheduled: nextTime,
      }),
    };
  } catch (error) {
    console.error('Newsletter cron job error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
});

function calculateNextScheduledTime(settings: any): string {
  // Use IST timezone (UTC+5:30)
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istNow = new Date(now.getTime() + istOffset);
  
  const [hours, minutes] = settings.time_of_day.split(':').map(Number);

  let next = new Date(istNow);
  next.setHours(hours, minutes, 0, 0);

  // If the time has already passed today, start from tomorrow
  if (next <= istNow) {
    next.setDate(next.getDate() + 1);
  }

  if (settings.frequency === 'weekly') {
    // Find next occurrence of the specified day of week
    const targetDay = settings.day_of_week;
    const currentDay = next.getDay();
    const daysUntilTarget = (targetDay - currentDay + 7) % 7;
    
    if (daysUntilTarget === 0 && next <= istNow) {
      // If it's the same day but time has passed, schedule for next week
      next.setDate(next.getDate() + 7);
    } else {
      next.setDate(next.getDate() + daysUntilTarget);
    }
  } else if (settings.frequency === 'biweekly') {
    // Find next occurrence of the specified day of week, 2 weeks from last send
    const targetDay = settings.day_of_week;
    const currentDay = next.getDay();
    const daysUntilTarget = (targetDay - currentDay + 7) % 7;
    
    if (daysUntilTarget === 0 && next <= istNow) {
      next.setDate(next.getDate() + 14);
    } else {
      next.setDate(next.getDate() + daysUntilTarget);
      // If this is less than 14 days from last send, add another week
      if (settings.last_sent_at) {
        const lastSent = new Date(settings.last_sent_at);
        const daysSinceLastSend = Math.floor((next.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceLastSend < 14) {
          next.setDate(next.getDate() + 7);
        }
      }
    }
  } else if (settings.frequency === 'monthly') {
    // Set to the specified day of the month
    next.setDate(settings.day_of_month);
    
    // If that day has passed this month, move to next month
    if (next <= istNow) {
      next.setMonth(next.getMonth() + 1);
      next.setDate(settings.day_of_month);
    }
  }

  // Convert back to UTC for storage
  return new Date(next.getTime() - istOffset).toISOString();
}
