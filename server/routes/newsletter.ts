import type { Express } from 'express';
import { createClient } from '@supabase/supabase-js';

export function registerNewsletterRoutes(app: Express) {
  const supabase = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Subscribe to newsletter
  app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.status === 'active') {
        return res.status(400).json({ error: 'Email already subscribed' });
      } else {
        // Reactivate subscription
        const { error } = await supabase
          .from('newsletter_subscriptions')
          .update({
            status: 'active',
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null,
          })
          .eq('id', existing.id);

        if (error) throw error;

        return res.json({ message: 'Subscription reactivated' });
      }
    }

    // Create new subscription
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email,
        status: 'active',
        source: 'landing_page',
      });

    if (error) throw error;

    res.json({ message: 'Successfully subscribed' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

  // Unsubscribe from newsletter
  app.post('/api/newsletter/unsubscribe', async (req, res) => {
    try {
      const { email } = req.body;

      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString(),
        })
        .eq('email', email);

      if (error) throw error;

      res.json({ message: 'Successfully unsubscribed' });
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      res.status(500).json({ error: 'Failed to unsubscribe' });
    }
  });
}
