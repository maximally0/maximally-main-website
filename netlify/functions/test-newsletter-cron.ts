import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event, context) => {
  console.log('Test newsletter cron triggered at:', new Date().toISOString());
  
  try {
    // Use IST timezone for comparison
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istNow = new Date(now.getTime() + istOffset);
    
    console.log('Current UTC time:', now.toISOString());
    console.log('Current IST time:', istNow.toISOString());
    
    // Check for pending newsletters
    const { data: pendingNewsletters, error: fetchError } = await supabase
      .from('newsletter_emails')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', now.toISOString());

    if (fetchError) {
      console.error('Error fetching pending newsletters:', fetchError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database error', details: fetchError })
      };
    }

    console.log(`Found ${pendingNewsletters?.length || 0} pending newsletters ready to send`);

    if (pendingNewsletters && pendingNewsletters.length > 0) {
      // Send each pending newsletter
      for (const newsletter of pendingNewsletters) {
        console.log(`Processing newsletter: ${newsletter.subject}`);
        
        // Get active subscribers
        const { data: subscribers, error: subError } = await supabase
          .from('newsletter_subscriptions')
          .select('email')
          .eq('status', 'active');

        if (subError || !subscribers || subscribers.length === 0) {
          console.log(`No subscribers found for newsletter ${newsletter.id}`);
          continue;
        }

        console.log(`Would send to ${subscribers.length} subscribers`);

        // Update newsletter status to sent (for testing, we'll just mark it as sent)
        const { error: updateError } = await supabase
          .from('newsletter_emails')
          .update({
            status: 'sent',
            sent_at: now.toISOString(),
            total_sent: subscribers.length,
            total_recipients: subscribers.length
          })
          .eq('id', newsletter.id);

        if (updateError) {
          console.error('Error updating newsletter status:', updateError);
        } else {
          console.log(`Newsletter ${newsletter.subject} marked as sent`);
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Newsletter cron test completed',
        timestamp: istNow.toISOString(),
        timezone: 'IST (UTC+5:30)',
        pendingCount: pendingNewsletters?.length || 0,
        processed: pendingNewsletters?.length || 0
      })
    };

  } catch (error) {
    console.error('Newsletter cron error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Newsletter cron failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      })
    };
  }
};