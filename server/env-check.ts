/**
 * Environment configuration checker for the disposable email prevention system
 */

export interface EnvConfig {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export function validateEnvironment(): { isValid: boolean; missing: string[]; config?: EnvConfig } {
  const missing: string[] = [];
  
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL) {
    missing.push('SUPABASE_URL');
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY');
  }

  const isValid = missing.length === 0;

  if (isValid) {
    return {
      isValid: true,
      missing: [],
      config: {
        SUPABASE_URL: SUPABASE_URL!,
        SUPABASE_SERVICE_ROLE_KEY: SUPABASE_SERVICE_ROLE_KEY!,
      }
    };
  }

  return { isValid: false, missing };
}

export function logEnvironmentStatus(): void {
  const { isValid, missing, config } = validateEnvironment();

  if (isValid) {
    // Environment configured correctly
  } else {
    console.error('❌ Disposable email prevention system - Missing required environment variables:');
    missing.forEach(key => {
      console.error(`   - ${key}`);
    });
    console.error('\nPlease add these to your .env file:');
    console.error('SUPABASE_URL=your_supabase_project_url');
    console.error('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
    console.error('\n⚠️  The service role key should have full access to auth.users table');
  }
}