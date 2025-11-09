import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserWithProfile } from '@/lib/supabaseClient';

export default function MyProfileRedirect() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        
        
        const ctx = await getCurrentUserWithProfile();
        
        
        
        if (!ctx) {
          
          navigate('/login', { replace: true });
          return;
        }
        
        if (!ctx.profile?.username) {
          
          const fallback = ctx.user?.email?.split('@')[0] || 'me';
          
          navigate(`/profile/${fallback}`, { replace: true });
          return;
        }
        
        
        navigate(`/profile/${ctx.profile.username}`, { replace: true });
      } catch (error: any) {
        
        // If profile loading fails, redirect to home page instead of staying stuck
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maximally-red mx-auto mb-4"></div>
          <p className="text-maximally-red">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return null;
}
