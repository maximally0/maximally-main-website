import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export async function apiRequest<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  // Use API base URL from environment variable, fallback to relative URL for local dev
  const apiBaseUrl = import.meta.env.VITE_API_URL || '';
  const fullUrl = url.startsWith('http') ? url : `${apiBaseUrl}${url}`;
  
  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include', // Include cookies for session
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}
