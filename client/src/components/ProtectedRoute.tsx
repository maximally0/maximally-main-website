/**
 * ProtectedRoute — Requirements 10.1, 10.2, 10.3, 10.4
 *
 * Wraps routes that require authentication and/or a specific role.
 * - Unauthenticated users are redirected to /auth/sign-in
 * - Authenticated users whose role doesn't match requiredRole are redirected
 *   to / with a toast notification
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  requiredRole?: 'judge' | 'mentor' | 'admin' | 'organizer';
  children: React.ReactNode;
}

function ProtectedRoute({ requiredRole, children }: ProtectedRouteProps) {
  const { user, profile, loading, refreshProfile } = useAuth();

  // Show spinner while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect unauthenticated users to sign-in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin can access everything
  if (profile?.role === 'admin') {
    return <>{children}</>;
  }

  // Role mismatch — try refreshing profile once in case it was recently updated
  if (requiredRole && profile?.role !== requiredRole) {
    // Trigger a background refresh so next visit works
    refreshProfile().catch(() => {});
    toast.error("You don't have permission to access this page. If you were recently approved, please log out and log back in.");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
