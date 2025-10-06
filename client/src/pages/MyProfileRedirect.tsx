import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserWithProfile } from '@/lib/supabaseClient';

export default function MyProfileRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const ctx = await getCurrentUserWithProfile();
      if (!ctx) {
        navigate('/login', { replace: true });
        return;
      }
      const fallback = ctx.user.email?.split('@')[0] || 'me';
      const username = (ctx.profile as any)?.username || fallback;
      navigate(`/profile/${username}`, { replace: true });
    })();
  }, [navigate]);

  return null;
}
