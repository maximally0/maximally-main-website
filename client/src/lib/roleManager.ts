/**
 * RoleManager - Core component for role-based access control
 * Integrates with Neon Auth and provides role assignment, validation, and routing
 */

import { getSession, getStoredSession } from './supabaseClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'participant' | 'mentor' | 'judge' | 'organizer' | 'admin';
export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'viewer';

export interface RolePermission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface UserWithRole {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  adminRole?: AdminRole;
  permissions: RolePermission[];
  profileComplete: boolean;
}

export interface RoleAssignmentRequest {
  userId: string;
  role: UserRole;
  adminRole?: AdminRole;
  reason: string;
  assignedBy: string;
}

export interface RoleHierarchy {
  levels: AdminRoleLevel[];
  currentUserLevel: number;
  managableRoles: AdminRole[];
}

export interface AdminRoleLevel {
  role: AdminRole;
  level: number;
  permissions: string[];
  canManage: AdminRole[];
}

// ─── Role Hierarchy Configuration ─────────────────────────────────────────────

const ADMIN_HIERARCHY: Record<AdminRole, AdminRoleLevel> = {
  super_admin: {
    role: 'super_admin',
    level: 4,
    permissions: ['*'],
    canManage: ['admin', 'moderator', 'viewer']
  },
  admin: {
    role: 'admin',
    level: 3,
    permissions: [
      'MANAGE_ROLES',
      'MANAGE_USERS',
      'MANAGE_HACKATHONS',
      'MANAGE_CONTENT',
      'VIEW_ANALYTICS',
      'MANAGE_NOTIFICATIONS'
    ],
    canManage: ['moderator', 'viewer']
  },
  moderator: {
    role: 'moderator',
    level: 2,
    permissions: [
      'MODERATE_CONTENT',
      'MANAGE_SUBMISSIONS',
      'VIEW_REPORTS',
      'MANAGE_PARTICIPANTS'
    ],
    canManage: ['viewer']
  },
  viewer: {
    role: 'viewer',
    level: 1,
    permissions: [
      'VIEW_ANALYTICS',
      'VIEW_REPORTS',
      'VIEW_USERS'
    ],
    canManage: []
  }
};

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  participant: [
    'VIEW_HACKATHONS',
    'REGISTER_HACKATHONS',
    'SUBMIT_PROJECTS',
    'REQUEST_MENTORSHIP',
    'VIEW_PROFILE'
  ],
  mentor: [
    'VIEW_HACKATHONS',
    'PROVIDE_MENTORSHIP',
    'MANAGE_AVAILABILITY',
    'VIEW_SESSIONS',
    'UPDATE_MENTOR_PROFILE'
  ],
  judge: [
    'VIEW_ASSIGNED_HACKATHONS',
    'EVALUATE_SUBMISSIONS',
    'VIEW_EVALUATION_HISTORY',
    'UPDATE_JUDGE_PROFILE'
  ],
  organizer: [
    'CREATE_HACKATHONS',
    'MANAGE_HACKATHONS',
    'MANAGE_PARTICIPANTS',
    'ASSIGN_JUDGES',
    'ASSIGN_MENTORS',
    'VIEW_ANALYTICS'
  ],
  admin: [
    'ACCESS_ADMIN_PANEL',
    'MANAGE_PLATFORM'
  ]
};

const DEFAULT_ROUTES: Record<UserRole, string> = {
  participant: '/my-hackathons',
  mentor: '/mentor/dashboard',
  judge: '/judging/dashboard',
  organizer: '/organizer/dashboard',
  /** Admin UI is the separate admin-panel SPA; keep default in-app route valid for redirects. */
  admin: '/'
};

// ─── RoleManager Class ────────────────────────────────────────────────────────

export class RoleManager {
  private static instance: RoleManager;
  private currentUser: UserWithRole | null = null;
  private sessionCache: Map<string, UserWithRole> = new Map();

  private constructor() {}

  static getInstance(): RoleManager {
    if (!RoleManager.instance) {
      RoleManager.instance = new RoleManager();
    }
    return RoleManager.instance;
  }

  // ─── Session Management ─────────────────────────────────────────────────────

  /**
   * Get current user with role information from Neon Auth session
   */
  async getCurrentUserWithRole(): Promise<UserWithRole | null> {
    try {
      const session = getStoredSession();
      if (!session?.access_token) {
        this.currentUser = null;
        return null;
      }

      // Decode JWT to get user info
      let userId: string;
      let userEmail: string;
      let userName: string | null = null;
      try {
        const parts = session.access_token.split('.');
        const payload = JSON.parse(atob(parts[1]));
        userId = payload.sub;
        userEmail = payload.email ?? '';
        userName = payload.user_metadata?.full_name ?? null;
      } catch {
        this.currentUser = null;
        return null;
      }

      // Check cache first
      if (this.sessionCache.has(userId)) {
        const cached = this.sessionCache.get(userId)!;
        this.currentUser = cached;
        return cached;
      }

      // Fetch role data from API
      const roleData = await this.fetchUserRole(userId);
      if (!roleData) {
        // Default to participant role for new users
        const defaultUser: UserWithRole = {
          id: userId,
          email: userEmail,
          name: userName,
          role: 'participant',
          permissions: this.getRolePermissions('participant'),
          profileComplete: false
        };
        this.sessionCache.set(userId, defaultUser);
        this.currentUser = defaultUser;
        return defaultUser;
      }

      const userWithRole: UserWithRole = {
        id: userId,
        email: userEmail,
        name: userName,
        role: roleData.role,
        adminRole: roleData.adminRole,
        permissions: this.getUserPermissions(roleData.role, roleData.adminRole),
        profileComplete: roleData.profileComplete
      };

      this.sessionCache.set(userId, userWithRole);
      this.currentUser = userWithRole;
      return userWithRole;
    } catch (error) {
      console.error('[RoleManager] Error getting current user with role:', error);
      return null;
    }
  }

  /**
   * Refresh current user role data
   */
  async refreshCurrentUser(): Promise<UserWithRole | null> {
    if (this.currentUser) {
      this.sessionCache.delete(this.currentUser.id);
    }
    return this.getCurrentUserWithRole();
  }

  // ─── Role Assignment ─────────────────────────────────────────────────────────

  /**
   * Assign a role to a user (admin only)
   */
  async assignRole(request: RoleAssignmentRequest): Promise<{ success: boolean; error?: string }> {
    try {
      const currentUser = await this.getCurrentUserWithRole();
      if (!currentUser) {
        return { success: false, error: 'Not authenticated' };
      }

      // Check if current user can assign roles
      if (!this.hasPermission(currentUser, 'MANAGE_ROLES')) {
        return { success: false, error: 'Insufficient permissions' };
      }

      // For admin role assignments, check hierarchy
      if (request.role === 'admin' && request.adminRole) {
        const canManage = this.canManageAdminRole(currentUser.adminRole, request.adminRole);
        if (!canManage) {
          return { success: false, error: 'Cannot assign higher or equal admin role' };
        }
      }

      const session = await getSession();
      if (!session) {
        return { success: false, error: 'No active session' };
      }

      const response = await fetch('/api/roles/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(request)
      });

      const result = await this.safeReadJson(response);
      
      if (!response.ok) {
        return { success: false, error: result.message || 'Failed to assign role' };
      }

      // Clear cache for the target user
      this.sessionCache.delete(request.userId);

      return { success: true };
    } catch (error) {
      console.error('[RoleManager] Error assigning role:', error);
      return { success: false, error: 'Failed to assign role' };
    }
  }

  /**
   * Revoke a user's role (admin only)
   */
  async revokeRole(userId: string, reason: string): Promise<{ success: boolean; error?: string }> {
    try {
      const currentUser = await this.getCurrentUserWithRole();
      if (!currentUser || !this.hasPermission(currentUser, 'MANAGE_ROLES')) {
        return { success: false, error: 'Insufficient permissions' };
      }

      const session = await getSession();
      if (!session) {
        return { success: false, error: 'No active session' };
      }

      const response = await fetch('/api/roles/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ userId, reason })
      });

      const result = await this.safeReadJson(response);
      
      if (!response.ok) {
        return { success: false, error: result.message || 'Failed to revoke role' };
      }

      // Clear cache for the target user
      this.sessionCache.delete(userId);

      return { success: true };
    } catch (error) {
      console.error('[RoleManager] Error revoking role:', error);
      return { success: false, error: 'Failed to revoke role' };
    }
  }

  // ─── Permission Validation ──────────────────────────────────────────────────

  /**
   * Check if user has a specific permission
   */
  hasPermission(user: UserWithRole | null, permission: string): boolean {
    if (!user) return false;
    
    // Super admin has all permissions
    if (user.adminRole === 'super_admin') return true;
    
    return user.permissions.some(p => p.id === permission || p.id === '*');
  }

  /**
   * Validate role permission for current user
   */
  async validateRolePermission(permission: string): Promise<boolean> {
    const user = await this.getCurrentUserWithRole();
    return this.hasPermission(user, permission);
  }

  /**
   * Check if user can access a specific route
   */
  async canAccessRoute(route: string): Promise<boolean> {
    const user = await this.getCurrentUserWithRole();
    if (!user) return false;

    // Define protected routes and their required permissions
    const protectedRoutes: Record<string, string[]> = {
      '/judging': ['EVALUATE_SUBMISSIONS', 'VIEW_ASSIGNED_HACKATHONS'],
      '/mentor': ['PROVIDE_MENTORSHIP', 'MANAGE_AVAILABILITY'],
      '/organizer': ['CREATE_HACKATHONS', 'MANAGE_HACKATHONS'],
      '/create-hackathon': ['CREATE_HACKATHONS'],
      '/judge': ['EVALUATE_SUBMISSIONS']
    };

    // Check if route requires specific permissions
    for (const [routePrefix, requiredPerms] of Object.entries(protectedRoutes)) {
      if (route.startsWith(routePrefix)) {
        return requiredPerms.some(perm => this.hasPermission(user, perm));
      }
    }

    // Public routes are accessible to all authenticated users
    return true;
  }

  // ─── Role-Based Routing ─────────────────────────────────────────────────────

  /**
   * Get default route for user's role
   */
  async getDefaultRoute(): Promise<string> {
    const user = await this.getCurrentUserWithRole();
    if (!user) return '/';
    
    return DEFAULT_ROUTES[user.role] || '/';
  }

  /**
   * Redirect user to appropriate dashboard based on role
   */
  async redirectToRoleDashboard(): Promise<string> {
    const defaultRoute = await this.getDefaultRoute();
    
    // Check if user can access their default route
    const canAccess = await this.canAccessRoute(defaultRoute);
    if (!canAccess) {
      // Fallback to participant dashboard
      return '/my-hackathons';
    }
    
    return defaultRoute;
  }

  // ─── Admin Hierarchy Management ─────────────────────────────────────────────

  /**
   * Get admin role hierarchy information
   */
  async getAdminHierarchy(): Promise<RoleHierarchy> {
    const user = await this.getCurrentUserWithRole();
    const currentLevel = user?.adminRole ? ADMIN_HIERARCHY[user.adminRole].level : 0;
    
    const levels = Object.values(ADMIN_HIERARCHY).sort((a, b) => b.level - a.level);
    const managableRoles = user?.adminRole ? ADMIN_HIERARCHY[user.adminRole].canManage : [];
    
    return {
      levels,
      currentUserLevel: currentLevel,
      managableRoles
    };
  }

  /**
   * Check if current admin can manage target admin role
   */
  canManageAdminRole(currentAdminRole: AdminRole | undefined, targetAdminRole: AdminRole): boolean {
    if (!currentAdminRole) return false;
    
    const currentLevel = ADMIN_HIERARCHY[currentAdminRole].level;
    const targetLevel = ADMIN_HIERARCHY[targetAdminRole].level;
    
    return currentLevel > targetLevel;
  }

  // ─── Utility Methods ────────────────────────────────────────────────────────

  /**
   * Get permissions for a specific role
   */
  private getRolePermissions(role: UserRole): RolePermission[] {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.map(perm => ({
      id: perm,
      name: perm.replace(/_/g, ' ').toLowerCase(),
      description: `Permission to ${perm.replace(/_/g, ' ').toLowerCase()}`,
      resource: role,
      action: perm
    }));
  }

  /**
   * Get all permissions for user (role + admin permissions)
   */
  private getUserPermissions(role: UserRole, adminRole?: AdminRole): RolePermission[] {
    let permissions = this.getRolePermissions(role);
    
    if (adminRole) {
      const adminPermissions = ADMIN_HIERARCHY[adminRole].permissions;
      const adminPerms = adminPermissions.map(perm => ({
        id: perm,
        name: perm.replace(/_/g, ' ').toLowerCase(),
        description: `Admin permission to ${perm.replace(/_/g, ' ').toLowerCase()}`,
        resource: 'admin',
        action: perm
      }));
      permissions = [...permissions, ...adminPerms];
    }
    
    return permissions;
  }

  /**
   * Fetch user role data from API
   */
  private async fetchUserRole(userId: string): Promise<{
    role: UserRole;
    adminRole?: AdminRole;
    profileComplete: boolean;
  } | null> {
    try {
      // Use /api/roles/current for the current user instead of /api/roles/user/:id
      // which requires admin permissions
      const session = await getSession();
      if (!session?.access_token) return null;
      
      const response = await fetch('/api/roles/current', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) return null;
      
      const result = await this.safeReadJson(response);
      return result.data;
    } catch (error) {
      console.error('[RoleManager] Error fetching user role:', error);
      return null;
    }
  }

  /**
   * Read response JSON defensively because some mocked/network responses
   * may not expose a json() method.
   */
  private async safeReadJson(response: Response): Promise<Record<string, any>> {
    if (!response || typeof response.json !== 'function') {
      return {};
    }

    try {
      const data = await response.json();
      return (data && typeof data === 'object') ? data as Record<string, any> : {};
    } catch {
      return {};
    }
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.sessionCache.clear();
    this.currentUser = null;
  }
}

// ─── Singleton Instance ───────────────────────────────────────────────────────

export const roleManager = RoleManager.getInstance();

// ─── React Hook ───────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

export function useRole() {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await roleManager.getCurrentUserWithRole();
        if (mounted) {
          setUser(userData);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load user role');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await roleManager.refreshCurrentUser();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh user role');
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    return roleManager.hasPermission(user, permission);
  };

  const canAccessRoute = async (route: string): Promise<boolean> => {
    return roleManager.canAccessRoute(route);
  };

  return {
    user,
    loading,
    error,
    refreshUser,
    hasPermission,
    canAccessRoute,
    assignRole: roleManager.assignRole.bind(roleManager),
    revokeRole: roleManager.revokeRole.bind(roleManager),
    getDefaultRoute: roleManager.getDefaultRoute.bind(roleManager),
    getAdminHierarchy: roleManager.getAdminHierarchy.bind(roleManager)
  };
}