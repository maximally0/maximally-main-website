import { useState, useEffect } from 'react';
import { getAuthHeaders } from '@/lib/auth';

interface MyMentorState {
  hasMentor: boolean;
  mentorName: string | null;
  loading: boolean;
}

export function useMyMentor(userId: string | undefined): MyMentorState {
  const [state, setState] = useState<MyMentorState>({ hasMentor: false, mentorName: null, loading: false });

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const check = async () => {
      setState(s => ({ ...s, loading: true }));
      try {
        const headers = await getAuthHeaders();
        const res = await fetch('/api/mentorship/my-mentor', { headers });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setState({
            hasMentor: !!data.mentor && !!data.session,
            mentorName: data.mentor?.name ?? null,
            loading: false,
          });
        }
      } catch {
        if (!cancelled) setState(s => ({ ...s, loading: false }));
      }
    };

    check();
    return () => { cancelled = true; };
  }, [userId]);

  return state;
}
