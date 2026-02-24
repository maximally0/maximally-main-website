/**
 * Feature flag for ISP blocking fix
 */

export const USE_API = import.meta.env.VITE_USE_API === 'true';

// Helper to check if we should use Netlify Functions
export function shouldUseApi(): boolean {
  return USE_API;
}