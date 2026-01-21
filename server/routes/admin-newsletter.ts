import type { Express, Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { generateNewsletterEmail, generateUnsubscribeUrl } from '../utils/email-templates';

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    [key: string]: any;
  };
}

export function registerAdminNewsletterRoutes(app: Express) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@maximally.in';
  const PLATFORM_URL = process.env.PLATFORM_URL || 'https://maximally.in';

  // Middleware to check admin role
  const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const token = authHeader.toString().slice(7);
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }

      // Check if user is admin
      const { data: adminRole } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!adminRole) {
        return res.status(403).json({ success: false, error: 'Forbidden' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  };

  // Get all newsletters
  app.get('/api/admin/newsletter/list', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('newsletter_emails')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      res.status(500).json({ error: 'Failed to fetch newsletters' });
    }
  });

  // Get subscribers - MUST come before /:id route
  app.get('/api/admin/newsletter/subscribers', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      res.status(500).json({ error: 'Failed to fetch subscribers' });
    }
  });

  // Export subscribers - MUST come before /:id route
  app.get('/api/admin/newsletter/subscribers/export', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('email, status, subscribed_at')
        .eq('status', 'active');

      if (error) throw error;

      const csv = [
        'Email,Status,Subscribed At',
        ...data.map((sub) => `${sub.email},${sub.status},${sub.subscribed_at}`),
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
      res.send(csv);
    } catch (error) {
      console.error('Error exporting subscribers:', error);
      res.status(500).json({ error: 'Failed to export subscribers' });
    }
  });

  // Get schedule settings - MUST come before /:id route
  app.get('/api/admin/newsletter/schedule', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('newsletter_schedule_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      res.json(data || null);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      res.status(500).json({ error: 'Failed to fetch schedule' });
    }
  });

  // Get statistics - MUST come before /:id route
  app.get('/api/admin/newsletter/stats', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { count: totalSubscribers } = await supabase
        .from('newsletter_subscriptions')
        .select('*', { count: 'exact', head: true });

      const { count: activeSubscribers } = await supabase
        .from('newsletter_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: totalNewslettersSent } = await supabase
        .from('newsletter_emails')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'sent');

      const { data: emailsSent } = await supabase
        .from('newsletter_emails')
        .select('total_sent')
        .eq('status', 'sent');

      const totalEmailsSent = emailsSent?.reduce((sum, n) => sum + (n.total_sent || 0), 0) || 0;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: recentGrowth } = await supabase
        .from('newsletter_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .gte('subscribed_at', thirtyDaysAgo.toISOString());

      // Get chart data for last 30 days
      const { data: subscriptions } = await supabase
        .from('newsletter_subscriptions')
        .select('subscribed_at, status')
        .gte('subscribed_at', thirtyDaysAgo.toISOString())
        .order('subscribed_at', { ascending: true });

      const { data: unsubscriptions } = await supabase
        .from('newsletter_subscriptions')
        .select('unsubscribed_at, status')
        .eq('status', 'unsubscribed')
        .gte('unsubscribed_at', thirtyDaysAgo.toISOString())
        .order('unsubscribed_at', { ascending: true });

      // Create daily aggregation for chart
      const chartData: { [key: string]: { date: string; subscribed: number; unsubscribed: number } } = {};
      
      // Initialize all 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dateStr = date.toISOString().split('T')[0];
        chartData[dateStr] = { date: dateStr, subscribed: 0, unsubscribed: 0 };
      }

      // Count subscriptions per day
      subscriptions?.forEach((sub) => {
        const dateStr = sub.subscribed_at.split('T')[0];
        if (chartData[dateStr]) {
          chartData[dateStr].subscribed++;
        }
      });

      // Count unsubscriptions per day
      unsubscriptions?.forEach((unsub) => {
        if (unsub.unsubscribed_at) {
          const dateStr = unsub.unsubscribed_at.split('T')[0];
          if (chartData[dateStr]) {
            chartData[dateStr].unsubscribed++;
          }
        }
      });

      const chartDataArray = Object.values(chartData);

      res.json({
        total_subscribers: totalSubscribers || 0,
        active_subscribers: activeSubscribers || 0,
        total_newsletters_sent: totalNewslettersSent || 0,
        total_emails_sent: totalEmailsSent,
        recent_growth: recentGrowth || 0,
        chart_data: chartDataArray,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  });

  // Get single newsletter - MUST come after specific routes
  app.get('/api/admin/newsletter/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('newsletter_emails')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching newsletter:', error);
      res.status(500).json({ error: 'Failed to fetch newsletter' });
    }
  });

  // Save newsletter (create or update)
  app.post('/api/admin/newsletter/save', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id, subject, content, html_content, status } = req.body;
      const userId = req.user?.id;

      if (id) {
        const { data, error } = await supabase
          .from('newsletter_emails')
          .update({
            subject,
            content,
            html_content,
            status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        res.json(data);
      } else {
        const { data, error } = await supabase
          .from('newsletter_emails')
          .insert({
            subject,
            content,
            html_content,
            status,
            created_by: userId,
          })
          .select()
          .single();

        if (error) throw error;
        res.json(data);
      }
    } catch (error) {
      console.error('Error saving newsletter:', error);
      res.status(500).json({ error: 'Failed to save newsletter' });
    }
  });

  // Schedule newsletter
  app.post('/api/admin/newsletter/schedule', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id, subject, content, html_content, scheduled_for } = req.body;
      const userId = req.user?.id;

      const { count } = await supabase
        .from('newsletter_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const newsletterData = {
        subject,
        content,
        html_content,
        status: 'pending',
        scheduled_for,
        total_recipients: count || 0,
        updated_at: new Date().toISOString(),
      };

      if (id) {
        const { data, error } = await supabase
          .from('newsletter_emails')
          .update(newsletterData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        res.json(data);
      } else {
        const { data, error } = await supabase
          .from('newsletter_emails')
          .insert({
            ...newsletterData,
            created_by: userId,
          })
          .select()
          .single();

        if (error) throw error;
        res.json(data);
      }
    } catch (error) {
      console.error('Error scheduling newsletter:', error);
      res.status(500).json({ error: 'Failed to schedule newsletter' });
    }
  });

  // Send newsletter immediately
  app.post('/api/admin/newsletter/send', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id, subject, content, html_content } = req.body;
      const userId = req.user?.id;

      const { data: subscribers, error: subError } = await supabase
        .from('newsletter_subscriptions')
        .select('email')
        .eq('status', 'active');

      if (subError) throw subError;

      if (!subscribers || subscribers.length === 0) {
        return res.status(400).json({ error: 'No active subscribers' });
      }

      let newsletterId = id;
      if (!id) {
        const { data: newsletter, error: createError } = await supabase
          .from('newsletter_emails')
          .insert({
            subject,
            content,
            html_content,
            status: 'sent',
            created_by: userId,
            sent_at: new Date().toISOString(),
            total_recipients: subscribers.length,
          })
          .select()
          .single();

        if (createError) throw createError;
        newsletterId = newsletter.id;
      } else {
        const { error: updateError } = await supabase
          .from('newsletter_emails')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            total_recipients: subscribers.length,
          })
          .eq('id', id);

        if (updateError) throw updateError;
      }

      let sentCount = 0;
      let failedCount = 0;

      for (const subscriber of subscribers) {
        try {
          const unsubscribeUrl = generateUnsubscribeUrl(subscriber.email, PLATFORM_URL);
          const emailHtml = generateNewsletterEmail({
            subject,
            htmlContent: html_content,
            unsubscribeUrl,
          });

          if (resend) {
            await resend.emails.send({
              from: `Maximally Newsletter <${FROM_EMAIL}>`,
              to: subscriber.email,
              subject: subject,
              html: emailHtml,
            });
          }

          await supabase.from('newsletter_send_logs').insert({
            newsletter_id: newsletterId,
            recipient_email: subscriber.email,
            status: 'sent',
          });
          
          sentCount++;
        } catch (error) {
          console.error(`Failed to send to ${subscriber.email}:`, error);
          
          await supabase.from('newsletter_send_logs').insert({
            newsletter_id: newsletterId,
            recipient_email: subscriber.email,
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
          });
          
          failedCount++;
        }
      }

      await supabase
        .from('newsletter_emails')
        .update({
          total_sent: sentCount,
          total_failed: failedCount,
        })
        .eq('id', newsletterId);

      res.json({
        message: 'Newsletter sent',
        total_sent: sentCount,
        total_failed: failedCount,
      });
    } catch (error) {
      console.error('Error sending newsletter:', error);
      res.status(500).json({ error: 'Failed to send newsletter' });
    }
  });

  // Delete newsletter
  app.delete('/api/admin/newsletter/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { error } = await supabase
        .from('newsletter_emails')
        .delete()
        .eq('id', req.params.id);

      if (error) throw error;
      res.json({ message: 'Newsletter deleted' });
    } catch (error) {
      console.error('Error deleting newsletter:', error);
      res.status(500).json({ error: 'Failed to delete newsletter' });
    }
  });

  // Unsubscribe a user (admin action)
  app.post('/api/admin/newsletter/subscribers/:id/unsubscribe', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString(),
        })
        .eq('id', req.params.id);

      if (error) throw error;
      res.json({ message: 'User unsubscribed' });
    } catch (error) {
      console.error('Error unsubscribing user:', error);
      res.status(500).json({ error: 'Failed to unsubscribe user' });
    }
  });

  // Update schedule settings
  app.post('/api/admin/newsletter/schedule/settings', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const settings = req.body;
      const userId = req.user?.id;

      const nextScheduled = calculateNextScheduledTime(settings);

      const { data: existing } = await supabase
        .from('newsletter_schedule_settings')
        .select('id')
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from('newsletter_schedule_settings')
          .update({
            ...settings,
            next_scheduled_at: nextScheduled,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        res.json(data);
      } else {
        const { data, error } = await supabase
          .from('newsletter_schedule_settings')
          .insert({
            ...settings,
            created_by: userId,
            next_scheduled_at: nextScheduled,
          })
          .select()
          .single();

        if (error) throw error;
        res.json(data);
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      res.status(500).json({ error: 'Failed to save schedule' });
    }
  });

  // Manual trigger to send pending newsletters (for development/testing)
  app.post('/api/admin/newsletter/send-pending', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const now = new Date();
      
      // Get all pending newsletters that are past their scheduled time
      const { data: pendingNewsletters, error: fetchError } = await supabase
        .from('newsletter_emails')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_for', now.toISOString());

      if (fetchError) throw fetchError;

      if (!pendingNewsletters || pendingNewsletters.length === 0) {
        return res.json({ message: 'No pending newsletters to send', sent: 0 });
      }

      let totalSent = 0;

      for (const newsletter of pendingNewsletters) {
        // Get active subscribers
        const { data: subscribers, error: subError } = await supabase
          .from('newsletter_subscriptions')
          .select('email')
          .eq('status', 'active');

        if (subError || !subscribers || subscribers.length === 0) {
          console.log(`No subscribers for newsletter ${newsletter.id}`);
          continue;
        }

        let sentCount = 0;
        let failedCount = 0;

        for (const subscriber of subscribers) {
          try {
            const unsubscribeUrl = generateUnsubscribeUrl(subscriber.email, PLATFORM_URL);
            const emailHtml = generateNewsletterEmail({
              subject: newsletter.subject,
              htmlContent: newsletter.html_content,
              unsubscribeUrl,
            });

            if (resend) {
              await resend.emails.send({
                from: `Maximally Newsletter <${FROM_EMAIL}>`,
                to: subscriber.email,
                subject: newsletter.subject,
                html: emailHtml,
              });
            }

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

        totalSent++;
      }

      res.json({
        message: `Sent ${totalSent} pending newsletter(s)`,
        sent: totalSent,
      });
    } catch (error) {
      console.error('Error sending pending newsletters:', error);
      res.status(500).json({ error: 'Failed to send pending newsletters' });
    }
  });

  function calculateNextScheduledTime(settings: any): string {
    const now = new Date();
    const [hours, minutes] = settings.time_of_day.split(':').map(Number);

    let next = new Date(now);
    next.setHours(hours, minutes, 0, 0);

    if (settings.frequency === 'weekly') {
      const daysUntilNext = (settings.day_of_week - now.getDay() + 7) % 7;
      next.setDate(now.getDate() + (daysUntilNext || 7));
    } else if (settings.frequency === 'biweekly') {
      const daysUntilNext = (settings.day_of_week - now.getDay() + 7) % 7;
      next.setDate(now.getDate() + (daysUntilNext || 14));
    } else if (settings.frequency === 'monthly') {
      next.setDate(settings.day_of_month);
      if (next <= now) {
        next.setMonth(next.getMonth() + 1);
      }
    }

    return next.toISOString();
  }
}
