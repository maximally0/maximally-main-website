import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUserWithProfile } from '@/lib/supabaseClient';

interface Props {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    (async () => {
      const ctx = await getCurrentUserWithProfile();
      setAllowed(!!ctx);
      setChecking(false);
    })();
  }, []);

  if (checking) return null; // or a small loader if you prefer
  if (!allowed) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
}
