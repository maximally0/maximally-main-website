/**
 * Simple test function to verify Netlify Functions and Supabase are working
 */
import { getSupabaseAdmin } from './shared/supabase.js';

export async function handler(event, context) {
  try {
    console.log('Test function called');
    
    // Test basic function execution
    const basicTest = {
      success: true,
      message: 'Netlify Functions are working!',
      timestamp: new Date().toISOString(),
      environment: {
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        nodeVersion: process.version
      }
    };
    
    // Test Supabase connection
    try {
      console.log('Testing Supabase connection...');
      const supabase = getSupabaseAdmin();
      
      // Simple query to test connection
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, created_at')
        .limit(1);
      
      if (error) {
        console.error('Supabase test error:', error);
        basicTest.supabaseTest = {
          success: false,
          error: error.message
        };
      } else {
        console.log('Supabase test successful');
        basicTest.supabaseTest = {
          success: true,
          blogCount: data?.length || 0
        };
      }
    } catch (supabaseError) {
      console.error('Supabase connection error:', supabaseError);
      basicTest.supabaseTest = {
        success: false,
        error: supabaseError.message
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: JSON.stringify(basicTest)
    };
    
  } catch (error) {
    console.error('Test function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack
      })
    };
  }
}