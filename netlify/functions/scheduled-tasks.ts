// Netlify scheduled function for hackathon automation
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { runScheduledTasks } from "../../server/services/scheduledTasks";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  console.log('Scheduled tasks function triggered');
  
  try {
    // Verify this is a scheduled invocation (not a manual HTTP request)
    const isScheduled = event.httpMethod === 'POST' && event.headers['netlify-cron'];
    const isManualTrigger = event.httpMethod === 'GET' && event.queryStringParameters?.trigger === 'manual';
    
    if (!isScheduled && !isManualTrigger) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          success: false,
          message: 'This function can only be triggered by Netlify cron or manual trigger'
        })
      };
    }

    console.log('Running scheduled tasks...');
    const results = await runScheduledTasks();

    const response = {
      success: true,
      message: 'Scheduled tasks completed',
      timestamp: new Date().toISOString(),
      results: {
        autoPublish: {
          processed: results.autoPublish.processed,
          published: results.autoPublish.published,
          errors: results.autoPublish.errors
        },
        deadlineReminders: {
          processed: results.deadlineReminders.processed,
          reminded: results.deadlineReminders.reminded,
          errors: results.deadlineReminders.errors
        },
        cleanup: {
          judgeTokensDeleted: results.cleanup.judgeTokensDeleted,
          teamInvitesDeleted: results.cleanup.teamInvitesDeleted,
          otpCodesDeleted: results.cleanup.otpCodesDeleted,
          errors: results.cleanup.errors
        },
        totalErrors: results.totalErrors
      }
    };

    console.log('Scheduled tasks completed:', response);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    };

  } catch (error: any) {
    console.error('Error in scheduled tasks:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        message: 'Scheduled tasks failed',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};