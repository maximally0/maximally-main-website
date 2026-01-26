import type { Config, Context } from "@netlify/functions";
import { createClient } from '@supabase/supabase-js';

// Newsletter cron job - runs every 5 minutes to check for scheduled newsletters
export default async (req: Request, context: Context) => {
  // Allow manual testing via GET request with ?test=true
  const url = new URL(req.url);
  const isManualTest = req.method === 'GET' && url.searchParams.get('test') === 'true';
  
  if (req.method === 'GET' && !isManualTest) {
    return new Response(JSON.stringify({
      success: true,
      message: 'Newsletter cron job is active',
      schedule: 'Every 5 minutes',
      timezone: 'IST (UTC+5:30)',
      manual_test: 'Add ?test=true to manually trigger'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Use correct environment variables for Netlify
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration:', { 
      hasUrl: !!supabaseUrl, 
      hasServiceKey: !!supabaseServiceKey 
    });
    return new Response(JSON.stringify({
      success: false,
      error: 'Missing Supabase configuration'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  const startTime = new Date();
  console.log('🚀 Newsletter cron job started at:', startTime.toISOString());

  try {
    // Use IST timezone for comparison
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istNow = new Date(now.getTime() + istOffset);
    
    console.log('⏰ Current UTC time:', now.toISOString());
    console.log('🇮🇳 Current IST time:', istNow.toISOString());

    let newslettersToSend = [];

    // 1. INDIVIDUAL SCHEDULING: Get PENDING newsletters that are past their scheduled time
    console.log('📧 Checking for pending newsletters with individual scheduling...');
    const { data: pendingNewsletters, error: pendingError } = await supabase
      .from('newsletter_emails')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', now.toISOString());

    if (pendingError) {
      console.error('❌ Error fetching pending newsletters:', pendingError);
    } else if (pendingNewsletters && pendingNewsletters.length > 0) {
      console.log(`✅ Found ${pendingNewsletters.length} pending newsletters ready to send`);
      newslettersToSend.push(...pendingNewsletters);
    } else {
      console.log('ℹ️ No pending newsletters ready to send');
    }

    // 2. GLOBAL SCHEDULING: Check for READY_TO_SEND newsletters based on global schedule
    console.log('📅 Checking global schedule for ready_to_send newsletters...');
    const { data: scheduleSettings, error: scheduleError } = await supabase
      .from('newsletter_schedule_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    if (scheduleError) {
      console.log('ℹ️ No active global schedule settings found');
    } else if (scheduleSettings) {
      const nextScheduled = new Date(scheduleSettings.next_scheduled_at);
      console.log('📅 Global schedule next send (UTC):', nextScheduled.toISOString());
      console.log('📅 Global schedule next send (IST):', new Date(nextScheduled.getTime() + istOffset).toISOString());

      if (now >= nextScheduled) {
        console.log('🎯 Time for global send!');
        
        // Get ready_to_send newsletters
        const { data: readyNewsletters, error: readyError } = await supabase
          .from('newsletter_emails')
          .select('*')
          .eq('status', 'ready_to_send')
          .order('created_at', { ascending: true })
          .limit(1); // Send one at a time for global schedule

        if (!readyError && readyNewsletters && readyNewsletters.length > 0) {
          console.log(`✅ Found ${readyNewsletters.length} ready_to_send newsletter for global schedule`);
          newslettersToSend.push(...readyNewsletters);

          // Update next scheduled time
          const nextTime = calculateNextScheduledTime(scheduleSettings);
          const { error: updateError } = await supabase
            .from('newsletter_schedule_settings')
            .update({ 
              next_scheduled_at: nextTime,
              last_sent_at: now.toISOString()
            })
            .eq('id', scheduleSettings.id);
          
          if (updateError) {
            console.error('❌ Error updating global schedule:', updateError);
          } else {
            console.log('✅ Updated global schedule next send to:', nextTime);
          }
        } else {
          console.log('ℹ️ No ready_to_send newsletters found for global schedule');
        }
      } else {
        const timeUntilNext = Math.round((nextScheduled.getTime() - now.getTime()) / (1000 * 60));
        console.log(`⏳ Global schedule not ready yet. Next send in ${timeUntilNext} minutes`);
      }
    }

    if (newslettersToSend.length === 0) {
      console.log('✅ No newsletters ready to send at this time');
      return new Response(JSON.stringify({
        success: true,
        message: 'No newsletters ready to send',
        timestamp: istNow.toISOString(),
        timezone: 'IST (UTC+5:30)'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get all active subscribers
    console.log('👥 Getting active subscribers...');
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscriptions')
      .select('email')
      .eq('status', 'active');

    if (subscribersError) {
      console.error('❌ Error fetching subscribers:', subscribersError);
      throw subscribersError;
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('⚠️ No active subscribers found');
      return new Response(JSON.stringify({
        success: true,
        message: 'No active subscribers',
        timestamp: istNow.toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`👥 Found ${subscribers.length} active subscribers`);
    console.log(`📤 Will send ${newslettersToSend.length} newsletters`);

    let totalSent = 0;
    const results = [];

    // Process each newsletter
    for (const newsletter of newslettersToSend) {
      console.log(`\n📧 Processing: "${newsletter.subject}" (status: ${newsletter.status})`);
      
      let sentCount = 0;
      let failedCount = 0;

      // Send to all subscribers
      for (const subscriber of subscribers) {
        try {
          // Import email utilities dynamically
          const { generateNewsletterEmail, generateUnsubscribeUrl } = await import('../../server/utils/email-templates');
          
          // Create unsubscribe URL
          const unsubscribeUrl = generateUnsubscribeUrl(subscriber.email, 'https://maximally.in');
          
          // Generate email HTML
          const emailHtml = generateNewsletterEmail({
            subject: newsletter.subject,
            htmlContent: newsletter.html_content,
            unsubscribeUrl,
          });

          // Send email using Resend
          if (process.env.RESEND_API_KEY) {
            const { Resend } = await import('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);
            
            await resend.emails.send({
              from: `Maximally Newsletter <${process.env.FROM_EMAIL || 'noreply@maximally.in'}>`,
              to: subscriber.email,
              subject: newsletter.subject,
              html: emailHtml,
            });
          } else {
            console.warn('⚠️ RESEND_API_KEY not configured - emails not actually sent');
          }

          // Log successful send
          await supabase.from('newsletter_send_logs').insert({
            newsletter_id: newsletter.id,
            recipient_email: subscriber.email,
            status: 'sent',
          });

          sentCount++;
        } catch (error) {
          console.error(`❌ Failed to send to ${subscriber.email}:`, error);
          
          // Log failed send
          await supabase.from('newsletter_send_logs').insert({
            newsletter_id: newsletter.id,
            recipient_email: subscriber.email,
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
          });

          failedCount++;
        }
      }

      // Update newsletter status to sent
      const { error: updateError } = await supabase
        .from('newsletter_emails')
        .update({
          status: 'sent',
          sent_at: now.toISOString(),
          total_sent: sentCount,
          total_failed: failedCount,
          total_recipients: subscribers.length,
        })
        .eq('id', newsletter.id);

      if (updateError) {
        console.error('❌ Error updating newsletter status:', updateError);
      } else {
        console.log(`✅ Newsletter "${newsletter.subject}": ${sentCount} sent, ${failedCount} failed`);
      }

      results.push({
        id: newsletter.id,
        subject: newsletter.subject,
        status: newsletter.status,
        sent: sentCount,
        failed: failedCount
      });

      totalSent++;
    }

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    console.log(`\n🎉 Cron job completed successfully!`);
    console.log(`📊 Summary: ${totalSent} newsletters sent to ${subscribers.length} subscribers`);
    console.log(`⏱️ Duration: ${duration}ms`);

    return new Response(JSON.stringify({
      success: true,
      newsletters_sent: totalSent,
      total_recipients: subscribers.length,
      duration_ms: duration,
      results: results,
      timestamp: istNow.toISOString(),
      timezone: 'IST (UTC+5:30)'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Newsletter cron job error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Run every 5 minutes to check for scheduled newsletters
export const config: Config = {
  schedule: "*/5 * * * *", // Every 5 minutes
};

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


