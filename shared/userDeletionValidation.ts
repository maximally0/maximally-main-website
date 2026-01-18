// User account deletion validation and edge case handling
export interface UserDeletionValidationResult {
  canDelete: boolean;
  errors: string[];
  warnings: string[];
  blockers: string[];
  suggestions: string[];
}

export interface UserDeletionContext {
  userId: string;
  userRole: string;
  ownedHackathons: number;
  activeTeamLeaderships: number;
  activeRegistrations: number;
  submittedProjects: number;
  judgeAssignments: number;
  coOrganizerRoles: number;
}

/**
 * Validates if a user can be deleted safely
 */
export function validateUserDeletion(context: UserDeletionContext): UserDeletionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const blockers: string[] = [];
  const suggestions: string[] = [];
  
  // Critical blockers that prevent deletion
  
  // 1. User owns hackathons
  if (context.ownedHackathons > 0) {
    blockers.push(`User owns ${context.ownedHackathons} hackathon${context.ownedHackathons !== 1 ? 's' : ''}`);
    suggestions.push('Transfer hackathon ownership to another organizer before deletion');
  }
  
  // 2. User is team leader of active teams
  if (context.activeTeamLeaderships > 0) {
    blockers.push(`User is team leader of ${context.activeTeamLeaderships} active team${context.activeTeamLeaderships !== 1 ? 's' : ''}`);
    suggestions.push('Transfer team leadership or disband teams before deletion');
  }
  
  // 3. User has organizer role with active responsibilities
  if (context.userRole === 'organizer' && (context.ownedHackathons > 0 || context.coOrganizerRoles > 0)) {
    blockers.push('User has active organizer responsibilities');
    suggestions.push('Complete or transfer all organizer responsibilities before deletion');
  }
  
  // 4. User has admin role
  if (context.userRole === 'admin') {
    blockers.push('Admin users cannot be deleted through this process');
    suggestions.push('Contact super admin to revoke admin role first');
  }
  
  // Warnings for data that will be affected
  
  // 1. Active registrations
  if (context.activeRegistrations > 0) {
    warnings.push(`User has ${context.activeRegistrations} active hackathon registration${context.activeRegistrations !== 1 ? 's' : ''} that will be cancelled`);
  }
  
  // 2. Submitted projects
  if (context.submittedProjects > 0) {
    warnings.push(`User has ${context.submittedProjects} submitted project${context.submittedProjects !== 1 ? 's' : ''} that will be anonymized`);
  }
  
  // 3. Judge assignments
  if (context.judgeAssignments > 0) {
    warnings.push(`User has ${context.judgeAssignments} judge assignment${context.judgeAssignments !== 1 ? 's' : ''} that will be removed`);
  }
  
  // 4. Co-organizer roles
  if (context.coOrganizerRoles > 0) {
    warnings.push(`User has ${context.coOrganizerRoles} co-organizer role${context.coOrganizerRoles !== 1 ? 's' : ''} that will be removed`);
  }
  
  // Determine if deletion is allowed
  const canDelete = blockers.length === 0;
  
  if (!canDelete) {
    errors.push('User cannot be deleted due to active responsibilities');
  }
  
  return {
    canDelete,
    errors,
    warnings,
    blockers,
    suggestions
  };
}

/**
 * Validates organizer role revocation
 */
export function validateOrganizerRoleRevocation(context: {
  userId: string;
  ownedHackathons: number;
  coOrganizerRoles: number;
}): UserDeletionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const blockers: string[] = [];
  const suggestions: string[] = [];
  
  // Check if user owns hackathons
  if (context.ownedHackathons > 0) {
    blockers.push(`User owns ${context.ownedHackathons} hackathon${context.ownedHackathons !== 1 ? 's' : ''}`);
    suggestions.push('Transfer hackathon ownership before revoking organizer role');
  }
  
  // Warn about co-organizer roles
  if (context.coOrganizerRoles > 0) {
    warnings.push(`User has ${context.coOrganizerRoles} co-organizer role${context.coOrganizerRoles !== 1 ? 's' : ''} that will be removed`);
  }
  
  const canDelete = blockers.length === 0;
  
  if (!canDelete) {
    errors.push('Cannot revoke organizer role due to active responsibilities');
  }
  
  return {
    canDelete,
    errors,
    warnings,
    blockers,
    suggestions
  };
}

/**
 * Validates admin role revocation
 */
export function validateAdminRoleRevocation(context: {
  userId: string;
  userRole: string;
  currentAdminId: string;
  totalAdmins: number;
}): UserDeletionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const blockers: string[] = [];
  const suggestions: string[] = [];
  
  // Cannot revoke own admin role
  if (context.userId === context.currentAdminId) {
    blockers.push('Cannot revoke your own admin role');
    suggestions.push('Ask another admin to revoke your role');
  }
  
  // Cannot revoke super admin role
  if (context.userRole === 'super_admin') {
    blockers.push('Super admin role cannot be revoked');
    suggestions.push('Contact system administrator');
  }
  
  // Warn if this is the last admin
  if (context.totalAdmins <= 1) {
    warnings.push('This is the last admin user - platform will have no administrators');
  }
  
  const canDelete = blockers.length === 0;
  
  if (!canDelete) {
    errors.push('Cannot revoke admin role');
  }
  
  return {
    canDelete,
    errors,
    warnings,
    blockers,
    suggestions
  };
}

/**
 * Validates team leadership transfer
 */
export function validateTeamLeadershipTransfer(context: {
  currentLeaderId: string;
  newLeaderId: string;
  teamMembers: string[];
  hasActiveSubmission: boolean;
}): UserDeletionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const blockers: string[] = [];
  const suggestions: string[] = [];
  
  // New leader must be a team member
  if (!context.teamMembers.includes(context.newLeaderId)) {
    blockers.push('New leader must be a team member');
    suggestions.push('Add the new leader to the team first');
  }
  
  // Cannot transfer to self
  if (context.currentLeaderId === context.newLeaderId) {
    blockers.push('Cannot transfer leadership to yourself');
  }
  
  // Warn about active submission
  if (context.hasActiveSubmission) {
    warnings.push('Team has an active submission - new leader will have full control');
  }
  
  const canDelete = blockers.length === 0;
  
  if (!canDelete) {
    errors.push('Cannot transfer team leadership');
  }
  
  return {
    canDelete,
    errors,
    warnings,
    blockers,
    suggestions
  };
}

/**
 * Validates hackathon ownership transfer
 */
export function validateHackathonOwnershipTransfer(context: {
  hackathonId: string;
  currentOwnerId: string;
  newOwnerId: string;
  newOwnerRole: string;
  hackathonStatus: string;
  hasActiveRegistrations: boolean;
}): UserDeletionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const blockers: string[] = [];
  const suggestions: string[] = [];
  
  // New owner must be an organizer or admin
  if (!['organizer', 'admin'].includes(context.newOwnerRole)) {
    blockers.push('New owner must have organizer or admin role');
    suggestions.push('Grant organizer role to the new owner first');
  }
  
  // Cannot transfer to self
  if (context.currentOwnerId === context.newOwnerId) {
    blockers.push('Cannot transfer ownership to yourself');
  }
  
  // Warn about active hackathon
  if (context.hackathonStatus === 'published') {
    warnings.push('Hackathon is currently published - new owner will have full control');
  }
  
  // Warn about registrations
  if (context.hasActiveRegistrations) {
    warnings.push('Hackathon has active registrations - participants will be notified of ownership change');
  }
  
  const canDelete = blockers.length === 0;
  
  if (!canDelete) {
    errors.push('Cannot transfer hackathon ownership');
  }
  
  return {
    canDelete,
    errors,
    warnings,
    blockers,
    suggestions
  };
}

/**
 * Generates user deletion plan
 */
export function generateUserDeletionPlan(context: UserDeletionContext): {
  canProceed: boolean;
  steps: string[];
  warnings: string[];
  dataImpact: string[];
} {
  const validation = validateUserDeletion(context);
  
  const steps: string[] = [];
  const dataImpact: string[] = [];
  
  if (!validation.canDelete) {
    // Return steps to resolve blockers
    steps.push(...validation.suggestions);
    return {
      canProceed: false,
      steps,
      warnings: validation.warnings,
      dataImpact
    };
  }
  
  // Generate deletion steps
  steps.push('1. Cancel all active hackathon registrations');
  
  if (context.submittedProjects > 0) {
    steps.push('2. Anonymize submitted projects (preserve for judging/results)');
    dataImpact.push(`${context.submittedProjects} project submissions will be anonymized`);
  }
  
  if (context.judgeAssignments > 0) {
    steps.push('3. Remove judge assignments and invalidate judge tokens');
    dataImpact.push(`${context.judgeAssignments} judge assignments will be removed`);
  }
  
  if (context.coOrganizerRoles > 0) {
    steps.push('4. Remove co-organizer roles from hackathons');
    dataImpact.push(`${context.coOrganizerRoles} co-organizer roles will be removed`);
  }
  
  steps.push('5. Anonymize activity feed entries (preserve audit trail)');
  steps.push('6. Delete user profile and authentication data');
  
  dataImpact.push('User profile and personal data will be permanently deleted');
  dataImpact.push('Activity history will be preserved but anonymized');
  
  return {
    canProceed: true,
    steps,
    warnings: validation.warnings,
    dataImpact
  };
}

/**
 * Validates GDPR data export request
 */
export function validateDataExportRequest(context: {
  userId: string;
  requestedBy: string;
  userConsent: boolean;
}): UserDeletionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const blockers: string[] = [];
  const suggestions: string[] = [];
  
  // User must consent to data export (GDPR requirement)
  if (!context.userConsent) {
    blockers.push('User consent required for data export');
    suggestions.push('Obtain explicit user consent before proceeding');
  }
  
  // Self-service or admin request
  const isSelfRequest = context.userId === context.requestedBy;
  if (!isSelfRequest) {
    warnings.push('Data export requested by admin - ensure proper authorization');
  }
  
  const canDelete = blockers.length === 0;
  
  if (!canDelete) {
    errors.push('Cannot proceed with data export');
  }
  
  return {
    canDelete,
    errors,
    warnings,
    blockers,
    suggestions
  };
}