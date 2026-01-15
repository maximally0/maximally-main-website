// Test function to check if imports work
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  try {
    // Try to import a route module
    const { registerPublicHackathonRoutes } = await import('../../server/routes/public-hackathons');
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Import works!',
        hasFunction: typeof registerPublicHackathonRoutes === 'function'
      })
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack
      })
    };
  }
};
