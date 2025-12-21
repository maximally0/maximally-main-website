import type { Config, Context } from "@netlify/functions";

// This function runs every hour to send deadline reminder emails
export default async (req: Request, context: Context) => {
  const PLATFORM_URL = process.env.PLATFORM_URL || process.env.URL || 'https://maximally.in';
  const SCHEDULER_SECRET = process.env.SCHEDULER_SECRET;

  try {
    // Call the main API endpoint
    const response = await fetch(`${PLATFORM_URL}/api/scheduler/deadline-reminders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-scheduler-key': SCHEDULER_SECRET || '',
      },
    });

    const data = await response.json();
    
    console.log('Deadline reminders result:', data);
    
    return new Response(JSON.stringify(data), {
      status: response.ok ? 200 : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Scheduled deadline reminders error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Run every hour
export const config: Config = {
  schedule: "0 * * * *", // Every hour at minute 0
};
