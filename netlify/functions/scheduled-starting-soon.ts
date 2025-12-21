import type { Config, Context } from "@netlify/functions";

// This function runs every hour to send "hackathon starting soon" emails
export default async (req: Request, context: Context) => {
  const PLATFORM_URL = process.env.PLATFORM_URL || process.env.URL || 'https://maximally.in';
  const SCHEDULER_SECRET = process.env.SCHEDULER_SECRET;

  try {
    // Call the main API endpoint
    const response = await fetch(`${PLATFORM_URL}/api/scheduler/starting-soon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-scheduler-key': SCHEDULER_SECRET || '',
      },
    });

    const data = await response.json();
    
    console.log('Starting soon reminders result:', data);
    
    return new Response(JSON.stringify(data), {
      status: response.ok ? 200 : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Scheduled starting soon error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Run every hour at minute 30 (offset from deadline reminders)
export const config: Config = {
  schedule: "30 * * * *", // Every hour at minute 30
};
