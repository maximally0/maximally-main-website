/**
 * Profile Role Utilities
 * 
 * Provides validation and type definitions for user profile roles.
 * After platform simplification, only 'user', 'admin', and 'organizer' roles are allowed.
 * The 'judge' role has been removed as judges no longer need accounts.
 * 
 * Requirements: 23.1, 23.2, 23.3
 */

/**
 * Valid profile roles after platform simplification.
 * 'judge' role has been removed - judges now use tokenized access without accounts.
 */
export const VALID_ROLES = ['user', 'admin', 'organizer'] as const;

/**
 * Type representing valid profile roles.
 */
export type ProfileRole = typeof VALID_ROLES[number];

/**
 * Validates if a given value is a valid profile role.
 * 
 * @param role - The value to validate
 * @returns true if the role is valid, false otherwise
 * 
 * Requirements: 23.1 - profiles.role column SHALL only allow: 'user', 'admin', 'organizer'
 */
export function isValidProfileRole(role: unknown): role is ProfileRole {
  if (typeof role !== 'string') {
    return false;
  }
  return VALID_ROLES.includes(role as ProfileRole);
}

/**
 * Validates a profile update operation's role field.
 * Returns the validated role or throws an error if invalid.
 * 
 * @param role - The role value from the update operation
 * @returns The validated role
 * @throws Error if the role is invalid
 * 
 * Requirements: 23.1, 23.3 - THE system SHALL NOT allow setting profile role to 'judge'
 */
export function validateProfileRoleUpdate(role: unknown): ProfileRole {
  if (!isValidProfileRole(role)) {
    throw new Error(
      `Invalid profile role: ${String(role)}. Valid roles are: ${VALID_ROLES.join(', ')}`
    );
  }
  return role;
}

/**
 * Migrates a legacy role to a valid role.
 * Used for migrating existing users with role='judge' to role='user'.
 * 
 * @param role - The legacy role value
 * @returns A valid profile role
 * 
 * Requirements: 23.2 - existing users with role='judge' SHALL be migrated to role='user'
 */
export function migrateLegacyRole(role: string): ProfileRole {
  // If it's already a valid role, return it
  if (isValidProfileRole(role)) {
    return role;
  }
  
  // Migrate 'judge' to 'user'
  if (role === 'judge') {
    return 'user';
  }
  
  // Default to 'user' for any other invalid role
  return 'user';
}

/**
 * Configuration for profile role validation.
 */
export const ROLE_CONFIG = {
  /** Default role for new users */
  DEFAULT_ROLE: 'user' as ProfileRole,
  
  /** Roles that have elevated permissions */
  ELEVATED_ROLES: ['admin', 'organizer'] as ProfileRole[],
  
  /** Legacy roles that should be migrated */
  LEGACY_ROLES: ['judge'] as const,
} as const;
