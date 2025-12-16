import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getOrganizerMessages } from '@/api/organizerMessages';
import type { MessageFilters, MessageWithRead } from '@/types/organizerMessages';

interface UseOrganizerMessagesReturn {
  messages: MessageWithRead[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setFilters: (filters: MessageFilters) => void;
}

export function useOrganizerMessages(initialFilters?: MessageFilters): UseOrganizerMessagesReturn {
  const { user, profile, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<MessageWithRead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MessageFilters>(initialFilters || {});
  const isMountedRef = useRef(true);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  const fetchMessages = useCallback(async (filtersToUse: MessageFilters) => {
    if (authLoading || !user) {
      setLoading(false);
      return;
    }

    // Check if user is an organizer
    if (profile?.role !== 'organizer') {
      setLoading(false);
      setMessages([]);
      return;
    }

    setLoading(true);
    try {
      const data = await getOrganizerMessages(filtersToUse);
      if (isMountedRef.current) {
        setMessages(data.items || []);
        setTotal(data.total || data.items?.length || 0);
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error('Failed to fetch messages:', err);
        // If table doesn't exist, just show empty state
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch messages';
        if (errorMsg.includes('does not exist') || errorMsg.includes('42P01')) {
          setMessages([]);
          setError(null);
        } else {
          setError(errorMsg);
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [user, authLoading, profile]);

  useEffect(() => {
    if (!user || authLoading || !profile) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

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
  }, [filters, fetchMessages, user, authLoading, profile]);

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
