/**
 * Role Management API Routes
 * Handles role assignment, validation, and hierarchy management
 */

import { Router } from 'express';
import { db } from '../db';
import { authenticateToken } from '../middleware/auth';
import { validateAdminPermission } from '../middleware/roleAuth';
import type { Express, Request, Response } from 'express';

// ─── Valid roles for the admin assign-role endpoint ───────────────────────────

const VALID_ASSIGNABLE_ROLES = ['user', 'participant', 'organizer', 'judge', 'mentor', 'admin'] as const;
type AssignableRole = typeof VALID_ASSIGNABLE_ROLES[number];

// ─── Admin check helper ───────────────────────────────────────────────────────

/**
 * Validates the bearer token and checks that the caller has admin access.
 * Admin access = profiles.role = 'admin' OR a row exists in admin_roles for the user.
 *
 * Returns the caller's userId on success, or sends an HTTP error and returns null.
 */
async function requireAdminCaller(
  req: Request,
  res: Response,
  supabaseAdmin: any
): Promise<string | null> {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(403).json({ success: false, message: 'Forbidden' });
    return null;
  }
  const token = authHeader.slice(7);

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    res.status(403).json({ success: false, message: 'Forbidden' });
    return null;
  }

  // Check profiles.role = 'admin'
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role === 'admin') {
    return user.id;
  }

  // Check admin_roles table
  const { data: adminRole } = await supabaseAdmin
    .from('admin_roles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (adminRole) {
    return user.id;
  }

  res.status(403).json({ success: false, message: 'Forbidden' });
  return null;
}

const router = Router();

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = 'participant' | 'mentor' | 'judge' | 'organizer' | 'admin';
type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'viewer';

interface RoleAssignmentRequest {
  userId: string;
  role: UserRole;
  adminRole?: AdminRole;
  reason: string;
}

// ─── Role Hierarchy Configuration ─────────────────────────────────────────────

const ADMIN_HIERARCHY: Record<AdminRole, { level: number; canManage: AdminRole[] }> = {
  super_admin: { level: 4, canManage: ['admin', 'moderator', 'viewer'] },
  admin: { level: 3, canManage: ['moderator', 'viewer'] },
  moderator: { level: 2, canManage: ['viewer'] },
  viewer: { level: 1, canManage: [] }
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

async function getUserRole(userId: string) {
  let profile: any = null;

  const { data: fullProfile, error: fullProfileError } = await db.from('profiles')
    .select('role, admin_role, full_name')
    .eq('id', userId)
    .maybeSingle();

  if (fullProfileError) {
    // Backward compatibility for deployments without admin_role column
    const { data: legacyProfile } = await db.from('profiles')
      .select('role, full_name')
      .eq('id', userId)
      .maybeSingle();
    profile = legacyProfile;
  } else {
    profile = fullProfile;
  }

  if (!profile) return null;

  // Check if profile is complete
  const profileComplete = !!(profile.full_name && profile.role);

  return {
    role: profile.role || 'participant',
    adminRole: profile.admin_role || (profile.role === 'admin' ? 'admin' : undefined),
    profileComplete
  };
}

async function logRoleChange(data: {
  targetUserId: string;
  adminUserId: string;
  action: 'assign' | 'revoke';
  previousRole?: UserRole;
  newRole?: UserRole;
  previousAdminRole?: AdminRole;
  newAdminRole?: AdminRole;
  reason: string;
}) {
  await db.from('role_audit_logs').insert({
    target_user_id: data.targetUserId,
    admin_user_id: data.adminUserId,
    action: data.action,
    previous_role: data.previousRole,
    new_role: data.newRole,
    previous_admin_role: data.previousAdminRole,
    new_admin_role: data.newAdminRole,
    reason: data.reason,
    created_at: new Date().toISOString()
  });
}

function canManageAdminRole(currentAdminRole: AdminRole | undefined, targetAdminRole: AdminRole): boolean {
  if (!currentAdminRole) return false;
  
  const currentLevel = ADMIN_HIERARCHY[currentAdminRole].level;
  const targetLevel = ADMIN_HIERARCHY[targetAdminRole].level;
  
  return currentLevel > targetLevel;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * GET /api/roles/current
 * Get current user's role and permissions
 */
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const roleData = await getUserRole(userId);
    if (!roleData) {
      // Default to participant role for new users
      return res.json({
        success: true,
        data: {
          role: 'participant',
          permissions: ['VIEW_HACKATHONS', 'REGISTER_HACKATHONS', 'SUBMIT_PROJECTS'],
          profileComplete: false,
          defaultRoute: '/my-hackathons'
        }
      });
    }

    // Get permissions based on role and admin role
    const permissions = getRolePermissions(roleData.role, roleData.adminRole);
    const defaultRoute = getDefaultRoute(roleData.role);

    res.json({
      success: true,
      data: {
        role: roleData.role,
        adminRole: roleData.adminRole,
        permissions,
        profileComplete: roleData.profileComplete,
        defaultRoute
      }
    });
  } catch (error) {
    console.error('[Roles API] Error getting current role:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * GET /api/roles/user/:userId
 * Get specific user's role information (admin only)
 */
router.get('/user/:userId', authenticateToken, validateAdminPermission('VIEW_USERS'), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const roleData = await getUserRole(userId);
    if (!roleData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: roleData
    });
  } catch (error) {
    console.error('[Roles API] Error getting user role:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * POST /api/roles/assign
 * Assign role to user (admin only)
 */
router.post('/assign', authenticateToken, validateAdminPermission('MANAGE_ROLES'), async (req, res) => {
  try {
    const adminUserId = req.user?.id;
    if (!adminUserId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { userId, role, adminRole, reason }: RoleAssignmentRequest = req.body;

    if (!userId || !role || !reason) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: userId, role, reason' 
      });
    }

    // Validate role values
    const validRoles: UserRole[] = ['participant', 'mentor', 'judge', 'organizer', 'admin'];
    const validAdminRoles: AdminRole[] = ['super_admin', 'admin', 'moderator', 'viewer'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    if (adminRole && !validAdminRoles.includes(adminRole)) {
      return res.status(400).json({ success: false, message: 'Invalid admin role' });
    }

    // Get current admin's role to check permissions
    const adminRoleData = await getUserRole(adminUserId);
    if (!adminRoleData?.adminRole) {
      return res.status(403).json({ success: false, message: 'Insufficient admin permissions' });
    }

    // Check if admin can assign the requested admin role
    if (role === 'admin' && adminRole) {
      if (!canManageAdminRole(adminRoleData.adminRole, adminRole)) {
        return res.status(403).json({ 
          success: false, 
          message: 'Cannot assign higher or equal admin role' 
        });
      }
    }

    // Get current user role for audit log
    const currentRoleData = await getUserRole(userId);

    // Update user role
    const updateData: any = { role };
    if (role === 'admin' && adminRole) {
      updateData.admin_role = adminRole;
    } else {
      updateData.admin_role = null;
    }

    const { error } = await db.from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('[Roles API] Database error:', error);
      return res.status(500).json({ success: false, message: 'Failed to update role' });
    }

    // Log the role change
    await logRoleChange({
      targetUserId: userId,
      adminUserId,
      action: 'assign',
      previousRole: currentRoleData?.role,
      newRole: role,
      previousAdminRole: currentRoleData?.adminRole,
      newAdminRole: adminRole,
      reason
    });

    res.json({ success: true, message: 'Role assigned successfully' });
  } catch (error) {
    console.error('[Roles API] Error assigning role:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * POST /api/roles/revoke
 * Revoke user's role (admin only)
 */
router.post('/revoke', authenticateToken, validateAdminPermission('MANAGE_ROLES'), async (req, res) => {
  try {
    const adminUserId = req.user?.id;
    if (!adminUserId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { userId, reason } = req.body;

    if (!userId || !reason) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: userId, reason' 
      });
    }

    // Get current user role for audit log
    const currentRoleData = await getUserRole(userId);
    if (!currentRoleData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent revoking super_admin role
    if (currentRoleData.adminRole === 'super_admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Cannot revoke super_admin role' 
      });
    }

    // Reset to participant role
    const { error } = await db.from('profiles')
      .update({ 
        role: 'participant',
        admin_role: null
      })
      .eq('id', userId);

    if (error) {
      console.error('[Roles API] Database error:', error);
      return res.status(500).json({ success: false, message: 'Failed to revoke role' });
    }

    // Log the role change
    await logRoleChange({
      targetUserId: userId,
      adminUserId,
      action: 'revoke',
      previousRole: currentRoleData.role,
      newRole: 'participant',
      previousAdminRole: currentRoleData.adminRole,
      reason
    });

    res.json({ success: true, message: 'Role revoked successfully' });
  } catch (error) {
    console.error('[Roles API] Error revoking role:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * GET /api/roles/hierarchy
 * Get admin role hierarchy information
 */
router.get('/hierarchy', authenticateToken, validateAdminPermission('VIEW_USERS'), async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const roleData = await getUserRole(userId);
    const currentLevel = roleData?.adminRole ? ADMIN_HIERARCHY[roleData.adminRole].level : 0;
    
    const levels = Object.entries(ADMIN_HIERARCHY).map(([role, config]) => ({
      role: role as AdminRole,
      level: config.level,
      canManage: config.canManage
    })).sort((a, b) => b.level - a.level);

    const managableRoles = roleData?.adminRole ? ADMIN_HIERARCHY[roleData.adminRole].canManage : [];

    res.json({
      success: true,
      data: {
        levels,
        currentUserLevel: currentLevel,
        managableRoles
      }
    });
  } catch (error) {
    console.error('[Roles API] Error getting hierarchy:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * GET /api/roles/audit
 * Get role change audit logs (admin only)
 */
router.get('/audit', authenticateToken, validateAdminPermission('VIEW_REPORTS'), async (req, res) => {
  try {
    const { page = 1, limit = 50, userId } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = db.from('role_audit_logs')
      .select(`
        *,
        target_profile:profiles!target_user_id(full_name, email),
        admin_profile:profiles!admin_user_id(full_name, email)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (userId) {
      query = query.eq('target_user_id', userId);
    }

    const { data: logs, error } = await query;

    if (error) {
      console.error('[Roles API] Database error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
    }

    res.json({
      success: true,
      data: logs || []
    });
  } catch (error) {
    console.error('[Roles API] Error getting audit logs:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getRolePermissions(role: UserRole, adminRole?: AdminRole): string[] {
  const rolePermissions: Record<UserRole, string[]> = {
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

  let permissions = rolePermissions[role] || [];

  if (adminRole) {
    const adminPermissions: Record<AdminRole, string[]> = {
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

    permissions = [...permissions, ...(adminPermissions[adminRole] || [])];
  }

  return permissions;
}

function getDefaultRoute(role: UserRole): string {
  const defaultRoutes: Record<UserRole, string> = {
    participant: '/my-hackathons',
    mentor: '/mentor/dashboard',
    judge: '/judging/dashboard',
    organizer: '/organizer/dashboard',
    admin: '/'
  };

  return defaultRoutes[role] || '/';
}

export function registerRoleRoutes(app: Express) {
  app.use('/api/roles', router);

  // ─── Admin: Assign role to user ─────────────────────────────────────────────

  /**
   * POST /api/admin/users/:userId/assign-role
   * Admin only. Accepts { role } and updates profiles.role.
   * If role = 'mentor', upserts a mentors row with is_active = true.
   * If role = 'judge', upserts a judges row with is_active = true.
   *
   * Requirements: 11.1, 11.3, 11.4
   */
  app.post('/api/admin/users/:userId/assign-role', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) {
      return res.status(503).json({ success: false, message: 'Server not configured' });
    }

    try {
      // Validate role first (before admin check, so 400 takes priority over 403)
      const { role } = req.body as { role?: string };
      if (!role || !(VALID_ASSIGNABLE_ROLES as readonly string[]).includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role' });
      }

      // Admin check
      const callerId = await requireAdminCaller(req, res, supabaseAdmin);
      if (!callerId) return; // response already sent

      const { userId } = req.params;

      // Check user exists in profiles
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('[Roles API] Error checking user:', profileError);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      if (!profile) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Update profiles.role
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (updateError) {
        console.error('[Roles API] Error updating profile role:', updateError);
        return res.status(500).json({ success: false, message: 'Failed to update role' });
      }

      // If role = 'mentor', upsert mentors row
      if (role === 'mentor') {
        const { error: mentorError } = await supabaseAdmin
          .from('mentors')
          .upsert({ user_id: userId, is_active: true }, { onConflict: 'user_id' });

        if (mentorError) {
          console.error('[Roles API] Error upserting mentor row:', mentorError);
          return res.status(500).json({ success: false, message: 'Failed to create mentor record' });
        }
      }

      // If role = 'judge', upsert judges row
      if (role === 'judge') {
        const { error: judgeError } = await supabaseAdmin
          .from('judges')
          .upsert({ user_id: userId, is_active: true }, { onConflict: 'user_id' });

        if (judgeError) {
          console.error('[Roles API] Error upserting judge row:', judgeError);
          return res.status(500).json({ success: false, message: 'Failed to create judge record' });
        }
      }

      return res.json({ success: true });
    } catch (err: any) {
      console.error('[Roles API] Unexpected error in assign-role:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

  // ─── Admin: Revoke role from user ───────────────────────────────────────────

  /**
   * DELETE /api/admin/users/:userId/role
   * Admin only. Resets profiles.role to 'user' and soft-deletes
   * mentors/judges rows by setting is_active = false.
   *
   * Requirements: 11.2
   */
  app.delete('/api/admin/users/:userId/role', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) {
      return res.status(503).json({ success: false, message: 'Server not configured' });
    }

    try {
      // Admin check
      const callerId = await requireAdminCaller(req, res, supabaseAdmin);
      if (!callerId) return; // response already sent

      const { userId } = req.params;

      // Reset profiles.role to 'user'
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ role: 'user', updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (updateError) {
        console.error('[Roles API] Error resetting profile role:', updateError);
        return res.status(500).json({ success: false, message: 'Failed to reset role' });
      }

      // Soft-delete mentors row (set is_active = false)
      await supabaseAdmin
        .from('mentors')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      // Soft-delete judges row (set is_active = false)
      await supabaseAdmin
        .from('judges')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      return res.json({ success: true });
    } catch (err: any) {
      console.error('[Roles API] Unexpected error in delete role:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

  // ─── Admin: Toggle mentor active status ─────────────────────────────────────

  /**
   * PATCH /api/admin/mentors/:mentorId/toggle-active
   * Admin only. Flips mentors.is_active and returns the updated mentor record.
   *
   * Requirements: 11.5, 11.6
   */
  app.patch('/api/admin/mentors/:mentorId/toggle-active', async (req: Request, res: Response) => {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) {
      return res.status(503).json({ success: false, message: 'Server not configured' });
    }

    try {
      // Admin check
      const callerId = await requireAdminCaller(req, res, supabaseAdmin);
      if (!callerId) return; // response already sent

      const { mentorId } = req.params;

      // Fetch current is_active value
      const { data: mentor, error: fetchError } = await supabaseAdmin
        .from('mentors')
        .select('id, is_active')
        .eq('id', mentorId)
        .maybeSingle();

      if (fetchError) {
        console.error('[Roles API] Error fetching mentor:', fetchError);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      if (!mentor) {
        return res.status(404).json({ success: false, message: 'Mentor not found' });
      }

      const newIsActive = !mentor.is_active;

      // Update is_active
      const { error: updateError } = await supabaseAdmin
        .from('mentors')
        .update({ is_active: newIsActive, updated_at: new Date().toISOString() })
        .eq('id', mentorId);

      if (updateError) {
        console.error('[Roles API] Error toggling mentor active:', updateError);
        return res.status(500).json({ success: false, message: 'Failed to update mentor' });
      }

      return res.json({ success: true, mentor: { id: mentorId, is_active: newIsActive } });
    } catch (err: any) {
      console.error('[Roles API] Unexpected error in toggle-active:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
}

export default router;