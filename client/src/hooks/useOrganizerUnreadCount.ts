import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getOrganizerUnreadCount } from '@/api/organizerMessages';

interface UseOrganizerUnreadCountReturn {
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOrganizerUnreadCount(pollInterval: number = 30000): UseOrganizerUnreadCountReturn {
  const { user, profile, loading: authLoading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  const fetchUnreadCount = useCallback(async () => {
    if (authLoading || !user || profile?.role !== 'organizer') {
      setLoading(false);
      return;
    }

    try {
      const data = await getOrganizerUnreadCount();
      if (isMountedRef.current) {
        setUnreadCount(data.unread);
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error('Failed to fetch unread count:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch unread count');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [user, profile, authLoading]);

  useEffect(() => {
    if (!user || profile?.role !== 'organizer' || authLoading) return;

    fetchUnreadCount();

    if (pollInterval > 0) {
      intervalRef.current = setInterval(fetchUnreadCount, pollInterval);
    }

    const handleFocus = () => fetchUnreadCount();
    window.addEventListener('focus', handleFocus);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchUnreadCount, pollInterval, user, profile, authLoading]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    loading,
    error,
    refetch
  };
}
