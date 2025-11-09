import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUnreadCount } from '@/api/judgeMessages';

interface UseJudgeUnreadCountReturn {
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useJudgeUnreadCount(pollInterval: number = 30000): UseJudgeUnreadCountReturn {
  const { user, profile, loading: authLoading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  const fetchUnreadCount = useCallback(async () => {
    // Skip if not authenticated or not a judge
    if (authLoading || !user || profile?.role !== 'judge') {
      setLoading(false);
      return;
    }

    try {
      const data = await getUnreadCount();
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

  // Initial fetch and setup polling
  useEffect(() => {
    if (!user || profile?.role !== 'judge' || authLoading) {
      return;
    }

    // Initial fetch
    fetchUnreadCount();

    // Setup polling
    if (pollInterval > 0) {
      intervalRef.current = setInterval(fetchUnreadCount, pollInterval);
    }

    // Refetch on window focus
    const handleFocus = () => fetchUnreadCount();
    window.addEventListener('focus', handleFocus);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchUnreadCount, pollInterval, user, profile, authLoading]);

  // Cleanup on unmount
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
