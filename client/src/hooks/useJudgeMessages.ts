import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getMessages } from '@/api/judgeMessages';
import type { MessageFilters, MessageWithRead } from '@/types/judgeMessages';

interface UseJudgeMessagesReturn {
  messages: MessageWithRead[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setFilters: (filters: MessageFilters) => void;
}

export function useJudgeMessages(initialFilters?: MessageFilters): UseJudgeMessagesReturn {
  const { user, profile, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<MessageWithRead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MessageFilters>(initialFilters || {});
  const isMountedRef = useRef(true);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  const fetchMessages = useCallback(async (filtersToUse: MessageFilters) => {
    // Skip if not authenticated
    if (authLoading || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getMessages(filtersToUse);
      if (isMountedRef.current) {
        setMessages(data.items);
        setTotal(data.total || data.items.length);
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error('Failed to fetch messages:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  // Fetch messages when filters change (with debounce for subject search)
  useEffect(() => {
    if (!user || authLoading) {
      return;
    }

    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce subject search, but apply other filters immediately
    const shouldDebounce = filters.subject !== undefined && filters.subject.length > 0;
    
    if (shouldDebounce) {
      debounceTimerRef.current = setTimeout(() => {
        fetchMessages(filters);
      }, 300);
    } else {
      fetchMessages(filters);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters, fetchMessages, user, authLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refetch = useCallback(async () => {
    await fetchMessages(filters);
  }, [fetchMessages, filters]);

  return {
    messages,
    total,
    loading,
    error,
    refetch,
    setFilters
  };
}
