/**
 * Simple test function to verify Netlify Functions are working
 */

export async function handler(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: JSON.stringify({
      success: true,
      message: 'Netlify Functions are working!',
      timestamp: new Date().toISOString(),
      environment: {
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        nodeVersion: process.version
      }
    })
  };
}