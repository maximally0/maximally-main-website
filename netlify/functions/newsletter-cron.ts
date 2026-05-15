import type { Config, Context } from "@netlify/functions";
import { neon } from '@neondatabase/serverless';

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const isManualTest = req.method === 'GET' && url.searchParams.get('test') === 'true';

  if (req.method === 'GET' && !isManualTest) {
    return new Response(JSON.stringify({ success: true, message: 'Newsletter cron active', schedule: 'Every 5 minutes' }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return new Response(JSON.stringify({ success: false, error: 'DATABASE_URL not configured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  const sql = neon(databaseUrl);
  const startTime = new Date();
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);

  console.log('🚀 Newsletter cron started at:', startTime.toISOString());

  try {
    let newslettersToSend: any[] = [];

    // 1. Pending newsletters past their scheduled time
    const pendingNewsletters = await sql`
      SELECT * FROM newsletter_emails
      WHERE status = 'pending' AND scheduled_for <= ${now.toISOString()}
    `;
    if (pendingNewsletters.length > 0) {
      console.log(`✅ Found ${pendingNewsletters.length} pending newsletters`);
      newslettersToSend.push(...pendingNewsletters);
    }

    // 2. Global schedule: ready_to_send newsletters
    const scheduleRows = await sql`
      SELECT * FROM newsletter_schedule_settings WHERE is_active = true LIMIT 1
    `;
    const scheduleSettings = scheduleRows[0];

    if (scheduleSettings) {
      const nextScheduled = new Date(scheduleSettings.next_scheduled_at);
      if (now >= nextScheduled) {
        const readyRows = await sql`
          SELECT * FROM newsletter_emails WHERE status = 'ready_to_send'
          ORDER BY created_at ASC LIMIT 1
        `;
        if (readyRows.length > 0) {
          newslettersToSend.push(...readyRows);
          const nextTime = calculateNextScheduledTime(scheduleSettings);
          await sql`
            UPDATE newsletter_schedule_settings
            SET next_scheduled_at = ${nextTime}, last_sent_at = ${now.toISOString()}
            WHERE id = ${scheduleSettings.id}
          `;
        }
      }
    }

    if (newslettersToSend.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'No newsletters ready to send', timestamp: istNow.toISOString() }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get active subscribers
    const subscribers = await sql`SELECT email FROM newsletter_subscriptions WHERE status = 'active'`;
    if (!subscribers.length) {
      return new Response(JSON.stringify({ success: true, message: 'No active subscribers' }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`👥 ${subscribers.length} subscribers, ${newslettersToSend.length} newsletters`);

    let totalSent = 0;
    const results: any[] = [];

    for (const newsletter of newslettersToSend) {
      let sentCount = 0;
      let failedCount = 0;

      for (const subscriber of subscribers) {
        try {
          const { generateNewsletterEmail, generateUnsubscribeUrl } = await import('../../server/utils/email-templates');
          const unsubscribeUrl = generateUnsubscribeUrl(subscriber.email, 'https://maximally.in');
          const emailHtml = generateNewsletterEmail({ subject: newsletter.subject, htmlContent: newsletter.html_content, unsubscribeUrl });

          if (process.env.RESEND_API_KEY) {
            const { Resend } = await import('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
              from: `Maximally Newsletter <${process.env.FROM_EMAIL || 'noreply@maximally.in'}>`,
              to: subscriber.email,
              subject: newsletter.subject,
              html: emailHtml,
            });
          }

          await sql`INSERT INTO newsletter_send_logs (newsletter_id, recipient_email, status) VALUES (${newsletter.id}, ${subscriber.email}, 'sent')`;
          sentCount++;
        } catch (error: any) {
          await sql`INSERT INTO newsletter_send_logs (newsletter_id, recipient_email, status, error_message) VALUES (${newsletter.id}, ${subscriber.email}, 'failed', ${error.message})`;
          failedCount++;
        }
      }

      await sql`
        UPDATE newsletter_emails
        SET status = 'sent', sent_at = ${now.toISOString()},
            total_sent = ${sentCount}, total_failed = ${failedCount},
            total_recipients = ${subscribers.length}
        WHERE id = ${newsletter.id}
      `;

      results.push({ id: newsletter.id, subject: newsletter.subject, sent: sentCount, failed: failedCount });
      totalSent++;
    }

    const duration = Date.now() - startTime.getTime();
    console.log(`🎉 Done: ${totalSent} newsletters, ${subscribers.length} subscribers, ${duration}ms`);

    return new Response(JSON.stringify({
      success: true, newsletters_sent: totalSent, total_recipients: subscribers.length,
      duration_ms: duration, results, timestamp: istNow.toISOString()
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error('💥 Newsletter cron error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config: Config = { schedule: "*/5 * * * *" };

function calculateNextScheduledTime(settings: any): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);
  const [hours, minutes] = settings.time_of_day.split(':').map(Number);
  let next = new Date(istNow);
  next.setHours(hours, minutes, 0, 0);
  if (next <= istNow) next.setDate(next.getDate() + 1);

  if (settings.frequency === 'weekly' || settings.frequency === 'biweekly') {
    const targetDay = settings.day_of_week;
    const daysUntil = (targetDay - next.getDay() + 7) % 7;
    if (daysUntil === 0 && next <= istNow) next.setDate(next.getDate() + (settings.frequency === 'biweekly' ? 14 : 7));
    else next.setDate(next.getDate() + daysUntil);
  } else if (settings.frequency === 'monthly') {
    next.setDate(settings.day_of_month);
    if (next <= istNow) { next.setMonth(next.getMonth() + 1); next.setDate(settings.day_of_month); }
  }

  return new Date(next.getTime() - istOffset).toISOString();
}
