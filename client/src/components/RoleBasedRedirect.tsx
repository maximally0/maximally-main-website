/**
 * RoleBasedRedirect - Component for handling role-based navigation and redirects
 * Integrates with RoleManager to provide seamless role-based routing
 */

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRole } from '@/lib/roleManager';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getAdminPanelBaseUrl } from '@/lib/adminPanelUrl';

interface RoleBasedRedirectProps {
  children?: React.ReactNode;
  fallbackRoute?: string;
}

/**
 * Component that redirects users to their appropriate dashboard based on role
 */
export function RoleBasedRedirect({ children, fallbackRoute = '/' }: RoleBasedRedirectProps) {
  const { user, loading, getDefaultRoute } = useRole();
  const [redirectRoute, setRedirectRoute] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleRedirect = async () => {
      if (loading || !user) return;

      // Don't redirect if we're already on a role-appropriate route
      const currentPath = location.pathname;
      
      // Check if current route is appropriate for user's role
      const isAppropriateRoute = await checkRouteAppropriate(currentPath, user.role);
      if (isAppropriateRoute) {
        setRedirectRoute(null);
        return;
      }

      // Get the default route for user's role
      const defaultRoute = await getDefaultRoute();
      
      // Only redirect if we're not already on the default route
      if (currentPath !== defaultRoute) {
        setRedirectRoute(defaultRoute);
      }
    };

    handleRedirect();
  }, [user, loading, location.pathname, getDefaultRoute]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (redirectRoute) {
    return <Navigate to={redirectRoute} replace />;
  }

  return <>{children}</>;
}

/**
 * Check if a route is appropriate for a user's role
 */
async function checkRouteAppropriate(path: string, role: string): Promise<boolean> {
  // Define role-appropriate routes
  const roleRoutes: Record<string, string[]> = {
    participant: ['/my-hackathons', '/hackathon', '/profile', '/events', '/mentors', '/'],
    mentor: ['/mentor', '/mentors', '/my-hackathons', '/hackathon', '/profile', '/events', '/'],
    judge: ['/judging', '/judge', '/mentors', '/my-hackathons', '/profile', '/events', '/'],
    organizer: ['/organizer', '/create-hackathon', '/mentors', '/my-hackathons', '/profile', '/events', '/'],
    admin: ['/organizer', '/judging', '/mentor', '/mentors', '/my-hackathons', '/profile', '/events', '/']
  };

  const appropriateRoutes = roleRoutes[role] || ['/'];
  
  return appropriateRoutes.some(route => {
    if (route === '/') return path === '/';
    return path.startsWith(route);
  });
}

/**
 * Higher-order component for role-based route protection
 */
interface WithRoleProtectionProps {
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallbackRoute?: string;
  children: React.ReactNode;
}

export function WithRoleProtection({
  requiredRoles = [],
  requiredPermissions = [],
  fallbackRoute = '/',
  children
}: WithRoleProtectionProps) {
  const { user, loading, hasPermission } = useRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to={fallbackRoute} replace />;
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );
    
    if (!hasRequiredPermissions) {
      return <Navigate to={fallbackRoute} replace />;
    }
  }

  return <>{children}</>;
}

/**
 * Component for displaying role-specific navigation items
 */
interface RoleBasedNavProps {
  className?: string;
}

export function RoleBasedNav({ className = '' }: RoleBasedNavProps) {
  const { user, loading } = useRole();

  if (loading || !user) return null;

  const getNavItems = () => {
    const adminBase = getAdminPanelBaseUrl();

    const baseItems = [
      { label: 'Events', path: '/events', roles: ['participant', 'mentor', 'judge', 'organizer', 'admin'] },
      { label: 'Profile', path: '/profile', roles: ['participant', 'mentor', 'judge', 'organizer', 'admin'] }
    ];

    const roleSpecificItems = {
      participant: [
        { label: 'My Hackathons', path: '/my-hackathons' },
        { label: 'Find Mentors', path: '/mentors' }
      ],
      mentor: [
        { label: 'Mentor Dashboard', path: '/mentor/dashboard' },
        { label: 'My Sessions', path: '/mentor/sessions' },
        { label: 'Availability', path: '/mentor/availability' }
      ],
      judge: [
        { label: 'Judge Dashboard', path: '/judging/dashboard' },
        { label: 'Evaluations', path: '/judging/evaluations' },
        { label: 'My Assignments', path: '/judging/assignments' }
      ],
      organizer: [
        { label: 'Organizer Dashboard', path: '/organizer/dashboard' },
        { label: 'Create Hackathon', path: '/create-hackathon' },
        { label: 'My Events', path: '/organizer/events' }
      ],
      admin: adminBase
        ? [
            { label: 'Admin panel', path: `${adminBase}/dashboard`, external: true as const },
            { label: 'People & roles', path: `${adminBase}/people`, external: true as const },
            { label: 'Mentors (admin)', path: `${adminBase}/mentors`, external: true as const }
          ]
        : []
    };

    const userRoleItems = roleSpecificItems[user.role as keyof typeof roleSpecificItems] || [];
    
    return [
      ...userRoleItems.map(item => ({ ...item, roles: [user.role] })),
      ...baseItems.filter(item => item.roles.includes(user.role))
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className={`role-based-nav ${className}`}>
      <ul className="flex space-x-4">
        {navItems.map((item, index) => (
          <li key={index}>
            <a
              href={item.path}
              {...('external' in item && item.external
                ? { target: '_blank' as const, rel: 'noopener noreferrer' as const }
                : {})}
              className="text-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Component for displaying role-specific dashboard content
 */
interface RoleDashboardProps {
  className?: string;
}

export function RoleDashboard({ className = '' }: RoleDashboardProps) {
  const { user, loading } = useRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Please log in to access your dashboard.</p>
      </div>
    );
  }

  const getDashboardContent = () => {
    switch (user.role) {
      case 'participant':
        return {
          title: 'Participant Dashboard',
          description: 'Discover hackathons, join teams, and build amazing projects.',
          quickActions: [
            { label: 'Browse Events', path: '/events', icon: '🎯' },
            { label: 'Find Mentors', path: '/mentors', icon: '👨‍🏫' },
            { label: 'My Hackathons', path: '/my-hackathons', icon: '📋' }
          ]
        };
      
      case 'mentor':
        return {
          title: 'Mentor Dashboard',
          description: 'Guide participants and share your expertise.',
          quickActions: [
            { label: 'Manage Availability', path: '/mentor/availability', icon: '📅' },
            { label: 'View Sessions', path: '/mentor/sessions', icon: '💬' },
            { label: 'Update Profile', path: '/mentor/profile', icon: '👤' }
          ]
        };
      
      case 'judge':
        return {
          title: 'Judge Dashboard',
          description: 'Evaluate submissions and provide valuable feedback.',
          quickActions: [
            { label: 'My Assignments', path: '/judging/assignments', icon: '📝' },
            { label: 'Evaluation Queue', path: '/judging/queue', icon: '⚖️' },
            { label: 'Completed Reviews', path: '/judging/completed', icon: '✅' }
          ]
        };
      
      case 'organizer':
        return {
          title: 'Organizer Dashboard',
          description: 'Create and manage hackathons for the community.',
          quickActions: [
            { label: 'Create Hackathon', path: '/create-hackathon', icon: '➕' },
            { label: 'My Events', path: '/organizer/events', icon: '🎪' },
            { label: 'Analytics', path: '/organizer/analytics', icon: '📊' }
          ]
        };
      
      case 'admin': {
        const adminBase = getAdminPanelBaseUrl();
        if (!adminBase) {
          return {
            title: 'Admin',
            description: 'Platform admin tools live in the separate admin panel. Set VITE_ADMIN_PANEL_URL to link shortcuts here.',
            quickActions: [] as { label: string; path: string; icon: string; external?: boolean }[]
          };
        }
        return {
          title: 'Admin',
          description: 'Manage the platform in the admin panel (opens in a new tab).',
          quickActions: [
            { label: 'Admin panel', path: `${adminBase}/dashboard`, icon: '🛡️', external: true },
            { label: 'Mentors', path: `${adminBase}/mentors`, icon: '👨‍🏫', external: true },
            { label: 'People & roles', path: `${adminBase}/people`, icon: '👥', external: true },
            { label: 'System health', path: `${adminBase}/system-health`, icon: '🔧', external: true }
          ]
        };
      }
      
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to Maximally.',
          quickActions: []
        };
    }
  };

  const dashboardContent = getDashboardContent();

  return (
    <div className={`role-dashboard ${className}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {dashboardContent.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          {dashboardContent.description}
        </p>
      </div>

      {dashboardContent.quickActions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardContent.quickActions.map((action, index) => (
            <a
              key={index}
              href={action.path}
              {...(action.external
                ? { target: '_blank' as const, rel: 'noopener noreferrer' as const }
                : {})}
              className="block p-6 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{action.icon}</span>
                <span className="font-medium text-foreground">{action.label}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {user.adminRole && (
        <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <h3 className="font-semibold text-primary mb-2">
            Admin Access: {user.adminRole.replace('_', ' ').toUpperCase()}
          </h3>
          <p className="text-sm text-muted-foreground">
            You have additional administrative privileges on this platform.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Hook for role-based conditional rendering
 */
export function useRoleConditional() {
  const { user, hasPermission } = useRole();

  const showForRoles = (roles: string[]) => {
    return user && roles.includes(user.role);
  };

  const showForPermissions = (permissions: string[]) => {
    return user && permissions.every(permission => hasPermission(permission));
  };

  const showForAdminLevel = (minLevel: string) => {
    if (!user || user.role !== 'admin' || !user.adminRole) return false;
    
    const levels = { viewer: 1, moderator: 2, admin: 3, super_admin: 4 };
    const userLevel = levels[user.adminRole as keyof typeof levels] || 0;
    const requiredLevel = levels[minLevel as keyof typeof levels] || 0;
    
    return userLevel >= requiredLevel;
  };

  return {
    user,
    showForRoles,
    showForPermissions,
    showForAdminLevel,
    hasPermission
  };
}