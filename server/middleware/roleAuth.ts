/**
 * Role-based authentication middleware
 * Validates user roles and permissions for protected routes
 */

import { Request, Response, NextFunction } from 'express';
import { db } from '../db';

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = 'participant' | 'mentor' | 'judge' | 'organizer' | 'admin';
type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'viewer';

interface UserWithRole {
  id: string;
  role: UserRole;
  adminRole?: AdminRole;
  permissions: string[];
}

// ─── Permission Configuration ─────────────────────────────────────────────────

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

const ADMIN_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: ['*'],
  admin: [
    'MANAGE_ROLES',
    'MANAGE_USERS',
    'MANAGE_HACKATHONS',
    'MANAGE_CONTENT',
    'VIEW_ANALYTICS',
    'MANAGE_NOTIFICATIONS'
  ],
  moderator: [
    'MODERATE_CONTENT',
    'MANAGE_SUBMISSIONS',
    'VIEW_REPORTS',
    'MANAGE_PARTICIPANTS'
  ],
  viewer: [
    'VIEW_ANALYTICS',
    'VIEW_REPORTS',
    'VIEW_USERS'
  ]
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

async function getUserWithRole(userId: string): Promise<UserWithRole | null> {
  try {
    let profile: any = null;

    const { data: fullProfile, error: fullProfileError } = await db.from('profiles')
      .select('role, admin_role')
      .eq('id', userId)
      .maybeSingle();

    if (fullProfileError) {
      // Backward compatibility: some deployments still don't have admin_role
      const { data: legacyProfile } = await db.from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      profile = legacyProfile;
    } else {
      profile = fullProfile;
    }

    if (!profile) return null;

    const role = profile.role || 'participant';
    // If admin_role column/value is missing, default admin users to admin-level permissions.
    const adminRole = profile.admin_role || (role === 'admin' ? 'admin' : undefined);

    // Get permissions for role and admin role
    let permissions = ROLE_PERMISSIONS[role] || [];
    if (adminRole && ADMIN_PERMISSIONS[adminRole]) {
      permissions = [...permissions, ...ADMIN_PERMISSIONS[adminRole]];
    }

    return {
      id: userId,
      role,
      adminRole,
      permissions
    };
  } catch (error) {
    console.error('[RoleAuth] Error fetching user role:', error);
    return null;
  }
}

function hasPermission(user: UserWithRole, permission: string): boolean {
  // Super admin has all permissions
  if (user.adminRole === 'super_admin') return true;
  
  return user.permissions.includes(permission) || user.permissions.includes('*');
}

// ─── Middleware Functions ─────────────────────────────────────────────────────

/**
 * Middleware to validate user has required role
 */
export function requireRole(roles: UserRole | UserRole[]) {
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const userWithRole = await getUserWithRole(userId);
      if (!userWithRole) {
        return res.status(403).json({ success: false, message: 'User role not found' });
      }

      if (!requiredRoles.includes(userWithRole.role)) {
        return res.status(403).json({ 
          success: false, 
          message: `Access denied. Required role: ${requiredRoles.join(' or ')}` 
        });
      }

      // Attach user role info to request
      req.userRole = userWithRole;
      next();
    } catch (error) {
      console.error('[RoleAuth] Error in requireRole middleware:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}

/**
 * Middleware to validate user has required admin level
 */
export function requireAdminLevel(minLevel: AdminRole) {
  const adminLevels: Record<AdminRole, number> = {
    viewer: 1,
    moderator: 2,
    admin: 3,
    super_admin: 4
  };

  const requiredLevel = adminLevels[minLevel];

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const userWithRole = await getUserWithRole(userId);
      if (!userWithRole || userWithRole.role !== 'admin' || !userWithRole.adminRole) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const userLevel = adminLevels[userWithRole.adminRole];
      if (userLevel < requiredLevel) {
        return res.status(403).json({ 
          success: false, 
          message: `Insufficient admin level. Required: ${minLevel}` 
        });
      }

      // Attach user role info to request
      req.userRole = userWithRole;
      next();
    } catch (error) {
      console.error('[RoleAuth] Error in requireAdminLevel middleware:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}

/**
 * Middleware to validate user has specific permission
 */
export function validatePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const userWithRole = await getUserWithRole(userId);
      if (!userWithRole) {
        return res.status(403).json({ success: false, message: 'User role not found' });
      }

      if (!hasPermission(userWithRole, permission)) {
        return res.status(403).json({ 
          success: false, 
          message: `Access denied. Required permission: ${permission}` 
        });
      }

      // Attach user role info to request
      req.userRole = userWithRole;
      next();
    } catch (error) {
      console.error('[RoleAuth] Error in validatePermission middleware:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}

/**
 * Middleware to validate admin permission (shorthand for admin-specific permissions)
 */
export function validateAdminPermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const userWithRole = await getUserWithRole(userId);
      if (!userWithRole || userWithRole.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      if (!hasPermission(userWithRole, permission)) {
        return res.status(403).json({ 
          success: false, 
          message: `Access denied. Required admin permission: ${permission}` 
        });
      }

      // Attach user role info to request
      req.userRole = userWithRole;
      next();
    } catch (error) {
      console.error('[RoleAuth] Error in validateAdminPermission middleware:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}

/**
 * Middleware to validate resource ownership or admin access
 */
export function requireOwnershipOrAdmin(resourceIdParam: string = 'id') {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const resourceId = req.params[resourceIdParam];
      const userWithRole = await getUserWithRole(userId);
      
      if (!userWithRole) {
        return res.status(403).json({ success: false, message: 'User role not found' });
      }

      // Allow if user owns the resource
      if (userId === resourceId) {
        req.userRole = userWithRole;
        return next();
      }

      // Allow if user has admin permissions
      if (userWithRole.role === 'admin' && hasPermission(userWithRole, 'MANAGE_USERS')) {
        req.userRole = userWithRole;
        return next();
      }

      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Must be resource owner or admin' 
      });
    } catch (error) {
      console.error('[RoleAuth] Error in requireOwnershipOrAdmin middleware:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}

/**
 * Middleware to check if user can manage hackathons (organizer or admin)
 */
export function requireHackathonManagement() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const userWithRole = await getUserWithRole(userId);
      if (!userWithRole) {
        return res.status(403).json({ success: false, message: 'User role not found' });
      }

      const canManageHackathons = 
        userWithRole.role === 'organizer' || 
        userWithRole.role === 'admin' ||
        hasPermission(userWithRole, 'MANAGE_HACKATHONS');

      if (!canManageHackathons) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. Organizer or admin role required' 
        });
      }

      req.userRole = userWithRole;
      next();
    } catch (error) {
      console.error('[RoleAuth] Error in requireHackathonManagement middleware:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}

/**
 * Middleware to check if user can evaluate submissions (judge or admin)
 */
export function requireEvaluationAccess() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const userWithRole = await getUserWithRole(userId);
      if (!userWithRole) {
        return res.status(403).json({ success: false, message: 'User role not found' });
      }

      const canEvaluate = 
        userWithRole.role === 'judge' || 
        userWithRole.role === 'admin' ||
        hasPermission(userWithRole, 'EVALUATE_SUBMISSIONS');

      if (!canEvaluate) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. Judge or admin role required' 
        });
      }

      req.userRole = userWithRole;
      next();
    } catch (error) {
      console.error('[RoleAuth] Error in requireEvaluationAccess middleware:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}

/**
 * Middleware to check if user can provide mentorship (mentor or admin)
 */
export function requireMentorshipAccess() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const userWithRole = await getUserWithRole(userId);
      if (!userWithRole) {
        return res.status(403).json({ success: false, message: 'User role not found' });
      }

      const canMentor = 
        userWithRole.role === 'mentor' || 
        userWithRole.role === 'admin' ||
        hasPermission(userWithRole, 'PROVIDE_MENTORSHIP');

      if (!canMentor) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. Mentor or admin role required' 
        });
      }

      req.userRole = userWithRole;
      next();
    } catch (error) {
      console.error('[RoleAuth] Error in requireMentorshipAccess middleware:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}

// ─── Type Extensions ──────────────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      userRole?: UserWithRole;
    }
  }
}

export { UserWithRole };