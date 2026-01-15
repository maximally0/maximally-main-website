// Judges don't have accounts - they access via tokenized links
// This hook is deprecated

interface UseJudgeUnreadCountReturn {
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useJudgeUnreadCount(_pollInterval: number = 30000): UseJudgeUnreadCountReturn {
  return {
    unreadCount: 0,
    loading: false,
    error: null,
    refetch: async () => {}
  };
}
