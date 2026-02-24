/**
 * React hooks for hackathon data using API client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';

interface Hackathon {
  id: string;
  title: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  max_participants?: number;
  featured: boolean;
  published: boolean;
  organizer_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username?: string;
    full_name?: string;
  };
  hackathon_registrations?: Array<{ count: number }>;
}

interface UseHackathonsOptions {
  status?: 'upcoming' | 'ongoing' | 'ended';
  featured?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
  autoFetch?: boolean;
}

export function useHackathons(options: UseHackathonsOptions = {}) {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const { autoFetch = true, ...fetchOptions } = options;

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiClient.getHackathons(fetchOptions);
      
      if (result.success) {
        setHackathons(result.data.hackathons);
        setTotal(result.data.total || 0);
      } else {
        setError(result.error || 'Failed to fetch hackathons');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hackathons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchHackathons();
    }
  }, [autoFetch, JSON.stringify(fetchOptions)]);

  return {
    hackathons,
    loading,
    error,
    total,
    refetch: fetchHackathons,
  };
}

// Helper hook to get hackathons by status
export function useUpcomingHackathons(limit = 6) {
  return useHackathons({ 
    status: 'upcoming', 
    limit,
    featured: true 
  });
}

export function useOngoingHackathons(limit = 6) {
  return useHackathons({ 
    status: 'ongoing', 
    limit 
  });
}

export function useFeaturedHackathons(limit = 3) {
  return useHackathons({ 
    featured: true, 
    limit 
  });
}