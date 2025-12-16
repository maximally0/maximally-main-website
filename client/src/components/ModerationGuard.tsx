import { useAuth } from '@/contexts/AuthContext';
import Banned from '@/pages/Banned';

interface ModerationGuardProps {
  children: React.ReactNode;
}

/**
 * ModerationGuard wraps the app and shows a banned page if the user is banned.
 * It allows banned users to still see the banned page and sign out.
 */
export default function ModerationGuard({ children }: ModerationGuardProps) {
  const { user, isBanned, loading } = useAuth();

  // Don't block while loading
  if (loading) {
    return <>{children}</>;
  }

  // If user is logged in and banned, show banned page
  if (user && isBanned) {
    return <Banned />;
  }

  return <>{children}</>;
}
