/**
 * API Client for Netlify Functions Backend
 * Replaces direct Supabase calls from the browser
 */

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://maximally.in/.netlify/functions'
  : 'http://localhost:8888/.netlify/functions';

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
}

class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(email: string, password: string, username?: string, fullName?: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, username, fullName }),
    });
  }

  // Blog methods
  async getBlogs(params: {
    featured?: boolean;
    limit?: number;
    offset?: number;
  } = {}) {
    const searchParams = new URLSearchParams();
    
    if (params.featured !== undefined) {
      searchParams.set('featured', params.featured.toString());
    }
    if (params.limit) {
      searchParams.set('limit', params.limit.toString());
    }
    if (params.offset) {
      searchParams.set('offset', params.offset.toString());
    }
    
    const query = searchParams.toString();
    return this.request(`/blogs/getAll${query ? `?${query}` : ''}`);
  }

  async getBlogBySlug(slug: string) {
    return this.request(`/blogs/getBySlug?slug=${encodeURIComponent(slug)}`);
  }

  // Hackathon methods
  async getHackathons(params: {
    status?: 'upcoming' | 'ongoing' | 'ended';
    featured?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    
    if (params.status) {
      searchParams.set('status', params.status);
    }
    if (params.featured !== undefined) {
      searchParams.set('featured', params.featured.toString());
    }
    if (params.limit) {
      searchParams.set('limit', params.limit.toString());
    }
    if (params.offset) {
      searchParams.set('offset', params.offset.toString());
    }
    if (params.search) {
      searchParams.set('search', params.search);
    }
    
    const query = searchParams.toString();
    return this.request(`/hackathons/getAll${query ? `?${query}` : ''}`);
  }

  // User methods
  async getUserProfile(userId?: string, username?: string) {
    const searchParams = new URLSearchParams();
    
    if (userId) {
      searchParams.set('userId', userId);
    } else if (username) {
      searchParams.set('username', username);
    } else {
      throw new Error('Either userId or username is required');
    }
    
    return this.request(`/user/getProfile?${searchParams.toString()}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types for use in components
export type { ApiResponse };

// Legacy compatibility - gradually replace these
export const supabaseCompat = {
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      try {
        const result = await apiClient.login(email, password);
        return {
          data: result.data,
          error: null
        };
      } catch (error) {
        return {
          data: null,
          error: { message: error instanceof Error ? error.message : 'Login failed' }
        };
      }
    },
    
    signUp: async ({ email, password }: { email: string; password: string }) => {
      try {
        const result = await apiClient.signup(email, password);
        return {
          data: result.data,
          error: null
        };
      } catch (error) {
        return {
          data: null,
          error: { message: error instanceof Error ? error.message : 'Signup failed' }
        };
      }
    }
  },
  
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          // This is a simplified compatibility layer
          // Implement specific cases as needed
          throw new Error('Direct Supabase queries not supported. Use apiClient methods instead.');
        }
      })
    })
  })
};