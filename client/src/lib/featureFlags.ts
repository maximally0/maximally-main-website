/**
 * Feature flags for gradual migration to Netlify Functions
 */

export const FEATURE_FLAGS = {
  // Enable new API client for authentication
  USE_API_AUTH: import.meta.env.VITE_USE_API_AUTH === 'true',
  
  // Enable new API client for blogs
  USE_API_BLOGS: import.meta.env.VITE_USE_API_BLOGS === 'true',
  
  // Enable new API client for hackathons
  USE_API_HACKATHONS: import.meta.env.VITE_USE_API_HACKATHONS === 'true',
  
  // Development mode - use local Netlify dev server
  USE_LOCAL_FUNCTIONS: import.meta.env.DEV,
} as const;

// Helper to check if we should use new API
export function shouldUseNewApi(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature] === true;
}