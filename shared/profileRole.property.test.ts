/**
 * Property-Based Tests for Profile Role Constraint
 * 
 * Feature: platform-simplification, Property 9: Profile Role Constraint
 * Validates: Requirements 23.1
 * 
 * Property: For any profile update operation, the role value SHALL only be
 * accepted if it is one of: 'user', 'admin', 'organizer'.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  isValidProfileRole,
  validateProfileRoleUpdate,
  migrateLegacyRole,
  VALID_ROLES,
  ROLE_CONFIG,
  type ProfileRole,
} from './profileRole';

/**
 * Feature: platform-simplification, Property 9: Profile Role Constraint
 * Validates: Requirements 23.1
 */
describe('Property 9: Profile Role Constraint', () => {
  /**
   * Property 9: Valid roles are accepted
   * 
   * For any role in the set {'user', 'admin', 'organizer'}, 
   * the validation SHALL accept it.
   */
  it('Property 9: Valid roles are accepted', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_ROLES),
        (role) => {
          expect(isValidProfileRole(role)).toBe(true);
          expect(() => validateProfileRoleUpdate(role)).not.toThrow();
          expect(validateProfileRoleUpdate(role)).toBe(role);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9a: 'judge' role is rejected
   * 
   * The 'judge' role SHALL NOT be accepted as a valid profile role.
   * Requirements: 23.1, 23.3
   */
  it('Property 9a: Judge role is rejected', () => {
    fc.assert(
      fc.property(
        fc.constant('judge'),
        (role) => {
          expect(isValidProfileRole(role)).toBe(false);
          expect(() => validateProfileRoleUpdate(role)).toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9b: Invalid string roles are rejected
   * 
   * For any string that is not in {'user', 'admin', 'organizer'},
   * the validation SHALL reject it.
   */
  it('Property 9b: Invalid string roles are rejected', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !VALID_ROLES.includes(s as ProfileRole)),
        (invalidRole) => {
          expect(isValidProfileRole(invalidRole)).toBe(false);
          expect(() => validateProfileRoleUpdate(invalidRole)).toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9c: Non-string values are rejected
   * 
   * For any non-string value, the validation SHALL reject it.
   */
  it('Property 9c: Non-string values are rejected', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer(),
          fc.boolean(),
          fc.constant(null),
          fc.constant(undefined),
          fc.array(fc.string()),
          fc.object()
        ),
        (nonStringValue) => {
          expect(isValidProfileRole(nonStringValue)).toBe(false);
          expect(() => validateProfileRoleUpdate(nonStringValue)).toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9d: Validation is deterministic
   * 
   * For any input, repeated validation calls SHALL produce the same result.
   */
  it('Property 9d: Validation is deterministic', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constantFrom(...VALID_ROLES),
          fc.string(),
          fc.integer(),
          fc.constant(null)
        ),
        (value) => {
          const result1 = isValidProfileRole(value);
          const result2 = isValidProfileRole(value);
          
          expect(result1).toBe(result2);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9e: Valid roles set is exactly three elements
   * 
   * The set of valid roles SHALL contain exactly 'user', 'admin', 'organizer'.
   */
  it('Property 9e: Valid roles set is exactly three elements', () => {
    expect(VALID_ROLES.length).toBe(3);
    expect(VALID_ROLES).toContain('user');
    expect(VALID_ROLES).toContain('admin');
    expect(VALID_ROLES).toContain('organizer');
    expect(VALID_ROLES).not.toContain('judge');
  });
});

/**
 * Tests for legacy role migration
 * Validates: Requirements 23.2
 */
describe('Legacy Role Migration', () => {
  /**
   * Property: Judge role migrates to user
   * 
   * Requirements: 23.2 - existing users with role='judge' SHALL be migrated to role='user'
   */
  it('Judge role migrates to user', () => {
    fc.assert(
      fc.property(
        fc.constant('judge'),
        (legacyRole) => {
          const migratedRole = migrateLegacyRole(legacyRole);
          
          expect(migratedRole).toBe('user');
          expect(isValidProfileRole(migratedRole)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Valid roles are preserved during migration
   */
  it('Valid roles are preserved during migration', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_ROLES),
        (validRole) => {
          const migratedRole = migrateLegacyRole(validRole);
          
          expect(migratedRole).toBe(validRole);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Unknown roles default to user
   */
  it('Unknown roles default to user', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => 
          !VALID_ROLES.includes(s as ProfileRole) && s !== 'judge'
        ),
        (unknownRole) => {
          const migratedRole = migrateLegacyRole(unknownRole);
          
          expect(migratedRole).toBe('user');
          expect(isValidProfileRole(migratedRole)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Migration always produces valid role
   */
  it('Migration always produces valid role', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (anyRole) => {
          const migratedRole = migrateLegacyRole(anyRole);
          
          expect(isValidProfileRole(migratedRole)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Tests for role configuration
 */
describe('Role Configuration', () => {
  /**
   * Property: Default role is valid
   */
  it('Default role is valid', () => {
    expect(isValidProfileRole(ROLE_CONFIG.DEFAULT_ROLE)).toBe(true);
    expect(ROLE_CONFIG.DEFAULT_ROLE).toBe('user');
  });

  /**
   * Property: All elevated roles are valid
   */
  it('All elevated roles are valid', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ROLE_CONFIG.ELEVATED_ROLES),
        (elevatedRole) => {
          expect(isValidProfileRole(elevatedRole)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Legacy roles are not valid
   */
  it('Legacy roles are not valid', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ROLE_CONFIG.LEGACY_ROLES),
        (legacyRole) => {
          expect(isValidProfileRole(legacyRole)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
