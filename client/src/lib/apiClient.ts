/**
 * Custom API Client - Replacement for Supabase Client
 * 
 * This client provides the same interface as Supabase but connects to our custom API
 * Use this to replace @supabase/supabase-js in your React applications
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  role: string;
  avatarUrl?: string;
  emailVerified: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
  error?: {
    message: string;
    code?: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<void> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('auth_token');
      this.refreshToken = localStorage.getItem('refresh_token');
    }
  }

  private saveTokensToStorage(accessToken: string, refreshToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  private clearTokensFromStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
    this.accessToken = null;
    this.refreshToken = null;
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken: this.refreshToken,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error?.message || 'Token refresh failed');
        }

        this.saveTokensToStorage(data.tokens.accessToken, data.tokens.refreshToken);
      } catch (error) {
        this.clearTokensFromStorage();
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      let response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle token expiration
      if (response.status === 401 && this.refreshToken) {
        try {
          await this.refreshAccessToken();
          
          // Retry the request with new token
          headers['Authorization'] = `Bearer ${this.accessToken}`;
          response = await fetch(url, {
            ...options,
            headers,
          });
        } catch (refreshError) {
          // Refresh failed, redirect to login
          this.clearTokensFromStorage();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/signin';
          }
          throw refreshError;
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  auth = {
    signUp: async (email: string, password: string, fullName: string, username: string): Promise<AuthResponse> => {
      const response = await this.request<AuthResponse>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName, username }),
      });
      return response;
    },

    signIn: async (email: string, password: string): Promise<AuthResponse> => {
      const response = await this.request<AuthResponse>('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success && (response as any).tokens) {
        const tokens = (response as any).tokens;
        this.saveTokensToStorage(tokens.accessToken, tokens.refreshToken);
      }

      return response;
    },

    signOut: async (): Promise<AuthResponse> => {
      const response = await this.request<AuthResponse>('/api/auth/signout', {
        method: 'POST',
      });

      this.clearTokensFromStorage();
      return response;
    },

    resetPassword: async (email: string): Promise<ApiResponse> => {
      return this.request('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },

    updatePassword: async (token: string, password: string): Promise<ApiResponse> => {
      return this.request('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
    },

    verifyEmail: async (token: string): Promise<ApiResponse> => {
      return this.request('/api/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    },

    getUser: async (): Promise<{ user: User | null; error: any }> => {
      if (!this.accessToken) {
        return { user: null, error: null };
      }

      try {
        const response = await this.request<User>('/api/users/profile');
        return { 
          user: response.success ? response.data || null : null, 
          error: response.success ? null : response.error 
        };
      } catch (error) {
        return { user: null, error };
      }
    },

    // OAuth methods (to be implemented with passport.js)
    signInWithOAuth: async (provider: 'google' | 'github') => {
      if (typeof window !== 'undefined') {
        window.location.href = `${this.baseURL}/api/auth/oauth/${provider}`;
      }
    },
  };

  // Database-like methods (similar to Supabase)
  from = (table: string) => {
    return {
      select: (columns = '*') => ({
        eq: (column: string, value: any) => this.request(`/api/${table}?${column}=${value}`),
        neq: (column: string, value: any) => this.request(`/api/${table}?${column}=neq.${value}`),
        gt: (column: string, value: any) => this.request(`/api/${table}?${column}=gt.${value}`),
        gte: (column: string, value: any) => this.request(`/api/${table}?${column}=gte.${value}`),
        lt: (column: string, value: any) => this.request(`/api/${table}?${column}=lt.${value}`),
        lte: (column: string, value: any) => this.request(`/api/${table}?${column}=lte.${value}`),
        like: (column: string, value: any) => this.request(`/api/${table}?${column}=like.${value}`),
        in: (column: string, values: any[]) => this.request(`/api/${table}?${column}=in.(${values.join(',')})`),
        order: (column: string, ascending = true) => this.request(`/api/${table}?order=${column}.${ascending ? 'asc' : 'desc'}`),
        limit: (count: number) => this.request(`/api/${table}?limit=${count}`),
        range: (from: number, to: number) => this.request(`/api/${table}?offset=${from}&limit=${to - from + 1}`),
      }),
      
      insert: (data: any) => this.request(`/api/${table}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      
      update: (data: any) => ({
        eq: (column: string, value: any) => this.request(`/api/${table}?${column}=${value}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        }),
      }),
      
      delete: () => ({
        eq: (column: string, value: any) => this.request(`/api/${table}?${column}=${value}`, {
          method: 'DELETE',
        }),
      }),
    };
  };

  // Specific API methods for your application
  hackathons = {
    getAll: (filters?: any) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key]) params.append(key, filters[key]);
        });
      }
      const queryString = params.toString();
      return this.request(`/api/hackathons${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id: string) => this.request(`/api/hackathons/${id}`),
    create: (data: any) => this.request('/api/hackathons', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => this.request(`/api/hackathons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    register: (id: string, data: any) => this.request(`/api/hackathons/${id}/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getRegistrations: (id: string) => this.request(`/api/hackathons/${id}/registrations`),
    submitProject: (id: string, data: any) => this.request(`/api/hackathons/${id}/submissions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  };

  mentors = {
    getAll: (filters?: { skill?: string; skills?: string; status?: string; availability?: string }) => {
      const params = new URLSearchParams();
      if (filters?.skill) params.append('skill', filters.skill);
      if (filters?.skills) params.append('skills', filters.skills);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.availability) params.append('availability', filters.availability);
      
      const queryString = params.toString();
      return this.request(`/api/mentors${queryString ? `?${queryString}` : ''}`);
    },
    requestHelp: (mentorId: string, data: any) => this.request(`/api/mentors/${mentorId}/request`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getSessions: (mentorId: string) => this.request(`/api/mentors/${mentorId}/sessions`),
    acceptSession: (sessionId: string) => this.request(`/api/mentors/sessions/${sessionId}/accept`, {
      method: 'POST',
    }),
    completeSession: (sessionId: string) => this.request(`/api/mentors/sessions/${sessionId}/complete`, {
      method: 'POST',
    }),
    cancelSession: (sessionId: string) => this.request(`/api/mentors/sessions/${sessionId}/cancel`, {
      method: 'POST',
    }),
  };

  judging = {
    getAssignments: () => this.request('/api/judging/assignments'),
    saveEvaluation: (evaluationId: string, data: any) => this.request(`/api/judging/evaluations/${evaluationId}/save`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    submitEvaluation: (evaluationId: string, data: any) => this.request(`/api/judging/evaluations/${evaluationId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  };

  admin = {
    verifyRole: () => this.request('/api/admin/verify-role'),
    getUsers: (filters?: any) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key]) params.append(key, filters[key]);
        });
      }
      const queryString = params.toString();
      return this.request(`/api/admin/users${queryString ? `?${queryString}` : ''}`);
    },
    assignRole: (userId: string, role: string) => this.request(`/api/admin/users/${userId}/assign-role`, {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),
    removeRole: (userId: string) => this.request(`/api/admin/users/${userId}/role`, {
      method: 'DELETE',
    }),
    toggleMentorActive: (mentorId: string) => this.request(`/api/admin/mentors/${mentorId}/toggle-active`, {
      method: 'PATCH',
    }),
    getAnalytics: () => this.request('/api/admin/analytics'),
    getAuditLogs: (filters?: any) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key]) params.append(key, filters[key]);
        });
      }
      const queryString = params.toString();
      return this.request(`/api/admin/audit-logs${queryString ? `?${queryString}` : ''}`);
    },
  };

  users = {
    getProfile: () => this.request('/api/users/profile'),
    updateProfile: (data: any) => this.request('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    deleteAccount: () => this.request('/api/users/account', {
      method: 'DELETE',
    }),
  };

  upload = {
    image: (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      return fetch(`${this.baseURL}/api/upload/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: formData,
      }).then(res => res.json());
    },
    
    document: (file: File) => {
      const formData = new FormData();
      formData.append('document', file);
      
      return fetch(`${this.baseURL}/api/upload/document`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: formData,
      }).then(res => res.json());
    },
    
    avatar: (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      
      return fetch(`${this.baseURL}/api/upload/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: formData,
      }).then(res => res.json());
    },
  };

  // ── Generic HTTP helpers (used by hooks that call apiClient.get / apiClient.post) ──

  get = (endpoint: string): Promise<ApiResponse<any>> => {
    return this.request(endpoint);
  };

  post = (endpoint: string, data?: any): Promise<ApiResponse<any>> => {
    return this.request(endpoint, {
      method: 'POST',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  };

  // ── Auth convenience aliases ──────────────────────────────────────────────

  login = (email: string, password: string): Promise<ApiResponse<any>> => {
    return this.request('/api/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  };

  signup = (email: string, password: string, username?: string, fullName?: string): Promise<ApiResponse<any>> => {
    return this.request('/api/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify({ email, password, username, fullName }),
    });
  };

  // ── Blog helpers ──────────────────────────────────────────────────────────

  getBlogs = (options?: { limit?: number; offset?: number; search?: string; featured?: boolean }): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    if (options?.limit !== undefined) params.append('limit', String(options.limit));
    if (options?.offset !== undefined) params.append('offset', String(options.offset));
    if (options?.search) params.append('search', options.search);
    if (options?.featured !== undefined) params.append('featured', String(options.featured));
    const qs = params.toString();
    return this.request(`/api/blogs${qs ? `?${qs}` : ''}`);
  };

  getBlogBySlug = (slug: string): Promise<ApiResponse<any>> => {
    return this.request(`/api/blogs/${encodeURIComponent(slug)}`);
  };

  // ── Hackathon helpers ─────────────────────────────────────────────────────

  getHackathons = (options?: { status?: string; featured?: boolean; limit?: number; offset?: number; search?: string }): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    if (options?.status) params.append('status', options.status);
    if (options?.featured !== undefined) params.append('featured', String(options.featured));
    if (options?.limit !== undefined) params.append('limit', String(options.limit));
    if (options?.offset !== undefined) params.append('offset', String(options.offset));
    if (options?.search) params.append('search', options.search);
    const qs = params.toString();
    return this.request(`/api/hackathons${qs ? `?${qs}` : ''}`);
  };

  // ── User / profile helpers ────────────────────────────────────────────────

  getUserProfile = (userId?: string, username?: string): Promise<ApiResponse<any>> => {
    if (username) {
      return this.request(`/api/profile?username=${encodeURIComponent(username)}`);
    }
    if (userId) {
      return this.request(`/api/profile?userId=${encodeURIComponent(userId)}`);
    }
    return this.request('/api/users/profile');
  };

  // ── Certificate helpers ───────────────────────────────────────────────────

  getCertificates = (options?: { certificate_id?: string; username?: string }): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    if (options?.certificate_id) params.append('certificate_id', options.certificate_id);
    if (options?.username) params.append('username', options.username);
    const qs = params.toString();
    return this.request(`/api/certificates${qs ? `?${qs}` : ''}`);
  };
}

// Create and export the client instance
export const createApiClient = (baseURL: string) => new ApiClient(baseURL);

// Default client instance
export const apiClient = createApiClient(
  import.meta.env.VITE_API_URL || 
  'http://localhost:3000'
);

// Default export for easy importing
export default apiClient;