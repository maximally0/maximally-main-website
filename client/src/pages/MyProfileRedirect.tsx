import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserWithProfile } from '@/lib/supabaseClient';

export default function MyProfileRedirect() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Add timeout to prevent hanging
        const profilePromise = getCurrentUserWithProfile();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile loading timeout')), 8000)
        );
        
        const ctx = await Promise.race([profilePromise, timeoutPromise]);
        
        if (!ctx) {
          console.log('🚪 MyProfileRedirect: No user context, redirecting to login');
          navigate('/login', { replace: true });
          return;
        }
        
        const fallback = ctx.user.email?.split('@')[0] || 'me';
        const username = (ctx.profile as any)?.username || fallback;
        console.log('✅ MyProfileRedirect: Redirecting to profile:', username);
        navigate(`/profile/${username}`, { replace: true });
      } catch (error: any) {
        console.error('❌ MyProfileRedirect: Error loading profile, redirecting to home:', error.message);
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
