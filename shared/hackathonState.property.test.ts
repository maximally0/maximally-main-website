/**
 * Property-Based Tests for Hackathon State Display
 * 
 * Feature: platform-simplification, Property 3: Hackathon State Display
 * Validates: Requirements 2.1
 * 
 * Property: For any hackathon viewed by an organizer, the displayed state
 * SHALL be exactly one of: 'draft', 'live', or 'ended'.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  getHackathonDisplayState,
  isValidHackathonDisplayState,
  VALID_HACKATHON_STATES,
  canRegister,
  canSubmit,
  canEditHackathon,
  type HackathonStateInput,
  type HackathonSubmissionInput,
  type HackathonDisplayState,
} from './hackathonState';

/**
 * Arbitrary generator for hackathon status values
 * Includes both old complex statuses and new simplified ones
 */
const hackathonStatusArb = fc.oneof(
  fc.constant('draft'),
  fc.constant('pending_review'),
  fc.constant('published'),
  fc.constant('rejected'),
  fc.constant('live'),
  fc.constant('ended'),
  fc.constant(null),
  fc.string({ minLength: 0, maxLength: 20 }) // Random strings to test edge cases
);

/**
 * Arbitrary generator for hackathon_status values (the display status)
 */
const hackathonDisplayStatusArb = fc.oneof(
  fc.constant('draft'),
  fc.constant('live'),
  fc.constant('ended'),
  fc.constant('upcoming'),
  fc.constant('registration_open'),
  fc.constant('building'),
  fc.constant('ongoing'),
  fc.constant('submission_open'),
  fc.constant('judging'),
  fc.constant('completed'),
  fc.constant(null),
  fc.constant(undefined)
);

/**
 * Arbitrary generator for date strings
 * Uses a filter to ensure only valid dates are generated
 */
const dateStringArb = fc.date({
  min: new Date('2020-01-01'),
  max: new Date('2030-12-31'),
}).filter(d => !isNaN(d.getTime())).map(d => d.toISOString());

/**
 * Arbitrary generator for HackathonStateInput
 */
const hackathonStateInputArb: fc.Arbitrary<HackathonStateInput> = fc.record({
  status: hackathonStatusArb,
  hackathon_status: hackathonDisplayStatusArb,
  end_date: dateStringArb,
});

/**
 * Arbitrary generator for current time
 */
const currentTimeArb = fc.date({
  min: new Date('2020-01-01'),
  max: new Date('2030-12-31'),
});

describe('Hackathon State Display - Property Tests', () => {
  /**
   * Feature: platform-simplification, Property 3: Hackathon State Display
   * Validates: Requirements 2.1
   * 
   * Property: For any hackathon, getHackathonDisplayState returns exactly
   * one of the three valid states: 'draft', 'live', or 'ended'.
   */
  it('Property 3: getHackathonDisplayState always returns a valid state', () => {
    fc.assert(
      fc.property(
        hackathonStateInputArb,
        currentTimeArb,
        (hackathon, currentTime) => {
          const result = getHackathonDisplayState(hackathon, currentTime);
          
          // The result must be exactly one of the three valid states
          expect(VALID_HACKATHON_STATES).toContain(result);
          expect(isValidHackathonDisplayState(result)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: The result is always a string (not null or undefined)
   */
  it('Property 3a: getHackathonDisplayState never returns null or undefined', () => {
    fc.assert(
      fc.property(
        hackathonStateInputArb,
        currentTimeArb,
        (hackathon, currentTime) => {
          const result = getHackathonDisplayState(hackathon, currentTime);
          
          expect(result).not.toBeNull();
          expect(result).not.toBeUndefined();
          expect(typeof result).toBe('string');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: If end_date has passed, state must be 'ended'
   * This validates the automatic state transition requirement.
   */
  it('Property 3b: Past end_date always results in ended state', () => {
    fc.assert(
      fc.property(
        hackathonStateInputArb,
        (hackathon) => {
          // Set current time to be after the end date
          const endDate = new Date(hackathon.end_date);
          const futureTime = new Date(endDate.getTime() + 1000); // 1 second after end
          
          const result = getHackathonDisplayState(hackathon, futureTime);
          
          expect(result).toBe('ended');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: The state is deterministic - same inputs always produce same output
   */
  it('Property 3c: getHackathonDisplayState is deterministic', () => {
    fc.assert(
      fc.property(
        hackathonStateInputArb,
        currentTimeArb,
        (hackathon, currentTime) => {
          const result1 = getHackathonDisplayState(hackathon, currentTime);
          const result2 = getHackathonDisplayState(hackathon, currentTime);
          
          expect(result1).toBe(result2);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: isValidHackathonDisplayState correctly validates states
   */
  it('Property 3d: isValidHackathonDisplayState validates correctly', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('draft' as const),
          fc.constant('live' as const),
          fc.constant('ended' as const),
          fc.string(),
          fc.constant(null),
          fc.constant(undefined),
          fc.integer()
        ),
        (value) => {
          const isValid = isValidHackathonDisplayState(value);
          
          if (value === 'draft' || value === 'live' || value === 'ended') {
            expect(isValid).toBe(true);
          } else {
            expect(isValid).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Hackathon State Display - Edge Cases', () => {
  it('handles null status gracefully', () => {
    const hackathon: HackathonStateInput = {
      status: null,
      end_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    };
    
    const result = getHackathonDisplayState(hackathon);
    expect(VALID_HACKATHON_STATES).toContain(result);
  });

  it('handles empty string status', () => {
    const hackathon: HackathonStateInput = {
      status: '',
      end_date: new Date(Date.now() + 86400000).toISOString(),
    };
    
    const result = getHackathonDisplayState(hackathon);
    expect(VALID_HACKATHON_STATES).toContain(result);
  });

  it('handles exact end_date boundary', () => {
    const now = new Date();
    const hackathon: HackathonStateInput = {
      status: 'published',
      hackathon_status: 'live',
      end_date: now.toISOString(),
    };
    
    // At exact end time, should still be live (not ended yet)
    const result = getHackathonDisplayState(hackathon, now);
    expect(VALID_HACKATHON_STATES).toContain(result);
  });
});

/**
 * Feature: platform-simplification, Property 4: Automatic State Transition on End Date
 * Validates: Requirements 2.4
 * 
 * Property: For any hackathon where the current time is past the end_date,
 * the hackathon_status SHALL be 'ended'.
 */
describe('Property 4: Automatic State Transition on End Date', () => {
  /**
   * Arbitrary generator for published hackathons (those that could be live)
   */
  const publishedHackathonArb = fc.record({
    status: fc.constant('published'),
    hackathon_status: fc.oneof(
      fc.constant('live'),
      fc.constant('draft'),
      fc.constant('ended'),
      fc.constant('upcoming'),
      fc.constant('registration_open'),
      fc.constant('building'),
      fc.constant('ongoing'),
      fc.constant('submission_open'),
      fc.constant('judging'),
      fc.constant('completed'),
      fc.constant(null),
      fc.constant(undefined)
    ),
    end_date: dateStringArb,
  });

  /**
   * Property 4: For any hackathon where current time is past end_date,
   * the display state SHALL be 'ended', regardless of other status fields.
   */
  it('Property 4: Any hackathon past end_date returns ended state', () => {
    fc.assert(
      fc.property(
        publishedHackathonArb,
        fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }), // 1ms to 1 year in ms
        (hackathon, msAfterEnd) => {
          const endDate = new Date(hackathon.end_date);
          const timeAfterEnd = new Date(endDate.getTime() + msAfterEnd);
          
          const result = getHackathonDisplayState(hackathon, timeAfterEnd);
          
          // Property: If current time > end_date, state MUST be 'ended'
          expect(result).toBe('ended');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4a: The transition to 'ended' is automatic and doesn't depend
   * on the hackathon_status field value.
   */
  it('Property 4a: End date transition overrides any hackathon_status value', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('live'),
          fc.constant('draft'),
          fc.constant('upcoming'),
          fc.constant('registration_open'),
          fc.constant('building'),
          fc.constant('ongoing'),
          fc.constant('submission_open'),
          fc.constant('judging'),
          fc.constant('completed')
        ),
        dateStringArb,
        (hackathonStatus, endDateStr) => {
          const hackathon: HackathonStateInput = {
            status: 'published',
            hackathon_status: hackathonStatus,
            end_date: endDateStr,
          };
          
          const endDate = new Date(endDateStr);
          const timeAfterEnd = new Date(endDate.getTime() + 1000); // 1 second after
          
          const result = getHackathonDisplayState(hackathon, timeAfterEnd);
          
          // Regardless of hackathon_status, if past end_date, result is 'ended'
          expect(result).toBe('ended');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4b: Before end_date, a published hackathon is NOT 'ended'
   * (unless it's in draft state)
   */
  it('Property 4b: Published live hackathon before end_date is not ended', () => {
    fc.assert(
      fc.property(
        dateStringArb,
        fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }), // 1ms to 1 year before
        (endDateStr, msBeforeEnd) => {
          const endDate = new Date(endDateStr);
          const timeBeforeEnd = new Date(endDate.getTime() - msBeforeEnd);
          
          const hackathon: HackathonStateInput = {
            status: 'published',
            hackathon_status: 'live',
            end_date: endDateStr,
          };
          
          const result = getHackathonDisplayState(hackathon, timeBeforeEnd);
          
          // Before end_date, a published live hackathon should be 'live'
          expect(result).toBe('live');
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Feature: platform-simplification, Property 5: Registration Availability
 * Validates: Requirements 2.5, 3.2, 3.3
 * 
 * Property: For any hackathon with status='live' and current time before end_date,
 * registration SHALL be allowed; for any hackathon with status='ended' or
 * current time past end_date, registration SHALL be rejected.
 */
describe('Property 5: Registration Availability', () => {
  /**
   * Property 5: Live hackathons before end_date allow registration
   */
  it('Property 5: Live hackathons before end_date allow registration', () => {
    fc.assert(
      fc.property(
        dateStringArb,
        fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }), // 1ms to 1 year before
        (endDateStr, msBeforeEnd) => {
          const endDate = new Date(endDateStr);
          const timeBeforeEnd = new Date(endDate.getTime() - msBeforeEnd);
          
          const hackathon: HackathonStateInput = {
            status: 'published',
            hackathon_status: 'live',
            end_date: endDateStr,
          };
          
          const canReg = canRegister(hackathon, timeBeforeEnd);
          
          // Live hackathon before end_date should allow registration
          expect(canReg).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5a: Ended hackathons do not allow registration
   */
  it('Property 5a: Ended hackathons do not allow registration', () => {
    fc.assert(
      fc.property(
        dateStringArb,
        fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }), // 1ms to 1 year after
        (endDateStr, msAfterEnd) => {
          const endDate = new Date(endDateStr);
          const timeAfterEnd = new Date(endDate.getTime() + msAfterEnd);
          
          const hackathon: HackathonStateInput = {
            status: 'published',
            hackathon_status: 'live', // Even if hackathon_status says live
            end_date: endDateStr,
          };
          
          const canReg = canRegister(hackathon, timeAfterEnd);
          
          // Past end_date should not allow registration
          expect(canReg).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5b: Draft hackathons do not allow registration
   */
  it('Property 5b: Draft hackathons do not allow registration', () => {
    fc.assert(
      fc.property(
        dateStringArb,
        currentTimeArb,
        (endDateStr, currentTime) => {
          const hackathon: HackathonStateInput = {
            status: 'draft', // Not published
            hackathon_status: 'draft',
            end_date: endDateStr,
          };
          
          const canReg = canRegister(hackathon, currentTime);
          
          // Draft hackathons should not allow registration
          expect(canReg).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5c: Registration availability is consistent with display state
   */
  it('Property 5c: Registration availability is consistent with display state', () => {
    fc.assert(
      fc.property(
        hackathonStateInputArb,
        currentTimeArb,
        (hackathon, currentTime) => {
          const displayState = getHackathonDisplayState(hackathon, currentTime);
          const canReg = canRegister(hackathon, currentTime);
          
          // Registration should only be allowed when state is 'live'
          if (displayState === 'live') {
            expect(canReg).toBe(true);
          } else {
            expect(canReg).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Feature: platform-simplification, Property 6: Submission Availability
 * Validates: Requirements 5.1, 5.2
 * 
 * Property: For any hackathon with status='live' and current time between
 * start_date and end_date, submission creation/editing SHALL be allowed;
 * otherwise, submission editing SHALL be rejected.
 */
describe('Property 6: Submission Availability', () => {
  /**
   * Arbitrary generator for HackathonSubmissionInput
   */
  const hackathonSubmissionInputArb: fc.Arbitrary<HackathonSubmissionInput> = fc.record({
    status: hackathonStatusArb,
    hackathon_status: hackathonDisplayStatusArb,
    start_date: dateStringArb,
    end_date: dateStringArb,
  }).filter(h => {
    // Ensure start_date is before end_date for valid hackathons
    const start = new Date(h.start_date);
    const end = new Date(h.end_date);
    return start < end;
  });

  /**
   * Property 6: Live hackathons between start_date and end_date allow submissions
   */
  it('Property 6: Live hackathons between start_date and end_date allow submissions', () => {
    fc.assert(
      fc.property(
        dateStringArb,
        dateStringArb,
        (startDateStr, endDateStr) => {
          const startDate = new Date(startDateStr);
          const endDate = new Date(endDateStr);
          
          // Skip if start >= end (invalid hackathon)
          if (startDate >= endDate) {
            return true;
          }
          
          // Calculate a time between start and end
          const midTime = new Date(startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 2);
          
          const hackathon: HackathonSubmissionInput = {
            status: 'published',
            hackathon_status: 'live',
            start_date: startDateStr,
            end_date: endDateStr,
          };
          
          const canSub = canSubmit(hackathon, midTime);
          
          // Live hackathon between start and end should allow submissions
          expect(canSub).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6a: Submissions are not allowed before start_date
   */
  it('Property 6a: Submissions are not allowed before start_date', () => {
    fc.assert(
      fc.property(
        dateStringArb,
        dateStringArb,
        fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }), // 1ms to 1 year before
        (startDateStr, endDateStr, msBeforeStart) => {
          const startDate = new Date(startDateStr);
          const endDate = new Date(endDateStr);
          
          // Skip if start >= end (invalid hackathon)
          if (startDate >= endDate) {
            return true;
          }
          
          const timeBeforeStart = new Date(startDate.getTime() - msBeforeStart);
          
          const hackathon: HackathonSubmissionInput = {
            status: 'published',
            hackathon_status: 'live',
            start_date: startDateStr,
            end_date: endDateStr,
          };
          
          const canSub = canSubmit(hackathon, timeBeforeStart);
          
          // Before start_date, submissions should not be allowed
          expect(canSub).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6b: Submissions are not allowed after end_date
   */
  it('Property 6b: Submissions are not allowed after end_date', () => {
    fc.assert(
      fc.property(
        dateStringArb,
        dateStringArb,
        fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }), // 1ms to 1 year after
        (startDateStr, endDateStr, msAfterEnd) => {
          const startDate = new Date(startDateStr);
          const endDate = new Date(endDateStr);
          
          // Skip if start >= end (invalid hackathon)
          if (startDate >= endDate) {
            return true;
          }
          
          const timeAfterEnd = new Date(endDate.getTime() + msAfterEnd);
          
          const hackathon: HackathonSubmissionInput = {
            status: 'published',
            hackathon_status: 'live', // Even if hackathon_status says live
            start_date: startDateStr,
            end_date: endDateStr,
          };
          
          const canSub = canSubmit(hackathon, timeAfterEnd);
          
          // After end_date, submissions should not be allowed
          expect(canSub).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6c: Draft hackathons do not allow submissions
   */
  it('Property 6c: Draft hackathons do not allow submissions', () => {
    fc.assert(
      fc.property(
        hackathonSubmissionInputArb,
        currentTimeArb,
        (hackathon, currentTime) => {
          const draftHackathon: HackathonSubmissionInput = {
            ...hackathon,
            status: 'draft', // Not published
            hackathon_status: 'draft',
          };
          
          const canSub = canSubmit(draftHackathon, currentTime);
          
          // Draft hackathons should not allow submissions
          expect(canSub).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6d: Submission availability is consistent with display state and dates
   */
  it('Property 6d: Submission availability is consistent with display state and dates', () => {
    fc.assert(
      fc.property(
        hackathonSubmissionInputArb,
        currentTimeArb,
        (hackathon, currentTime) => {
          const displayState = getHackathonDisplayState(hackathon, currentTime);
          const canSub = canSubmit(hackathon, currentTime);
          const startDate = new Date(hackathon.start_date);
          
          // Submissions should only be allowed when:
          // 1. State is 'live'
          // 2. Current time is >= start_date
          if (displayState === 'live' && currentTime >= startDate) {
            expect(canSub).toBe(true);
          } else {
            expect(canSub).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6e: Submission at exact start_date boundary is allowed
   */
  it('Property 6e: Submission at exact start_date boundary is allowed for live hackathons', () => {
    fc.assert(
      fc.property(
        dateStringArb,
        dateStringArb,
        (startDateStr, endDateStr) => {
          const startDate = new Date(startDateStr);
          const endDate = new Date(endDateStr);
          
          // Skip if start >= end (invalid hackathon)
          if (startDate >= endDate) {
            return true;
          }
          
          const hackathon: HackathonSubmissionInput = {
            status: 'published',
            hackathon_status: 'live',
            start_date: startDateStr,
            end_date: endDateStr,
          };
          
          // At exact start time, submissions should be allowed
          const canSub = canSubmit(hackathon, startDate);
          
          expect(canSub).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Feature: platform-simplification, Property 7: Post-Publish Edit Freedom
 * Validates: Requirements 8.1
 * 
 * Property: For any hackathon with status='live', edit operations by the
 * organizer SHALL succeed without requiring approval workflow.
 */
describe('Property 7: Post-Publish Edit Freedom', () => {
  /**
   * Property 7: Live hackathons can be edited without approval
   */
  it('Property 7: Live hackathons can be edited without requiring approval', () => {
    fc.assert(
      fc.property(
        dateStringArb,
        fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }), // 1ms to 1 year before end
        (endDateStr, msBeforeEnd) => {
          const endDate = new Date(endDateStr);
          const timeBeforeEnd = new Date(endDate.getTime() - msBeforeEnd);
          
          const hackathon: HackathonStateInput = {
            status: 'published',
            hackathon_status: 'live',
            end_date: endDateStr,
          };
          
          const editResult = canEditHackathon(hackathon, timeBeforeEnd);
          
          // Property: Live hackathons can be edited without approval
          expect(editResult.canEdit).toBe(true);
          expect(editResult.requiresApproval).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7a: Draft hackathons can be edited without approval (when not ended)
   */
  it('Property 7a: Draft hackathons can be edited without approval when not ended', () => {
    fc.assert(
      fc.property(
        dateStringArb,
        fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }), // 1ms to 1 year before end
        (endDateStr, msBeforeEnd) => {
          const endDate = new Date(endDateStr);
          const timeBeforeEnd = new Date(endDate.getTime() - msBeforeEnd);
          
          const hackathon: HackathonStateInput = {
            status: 'draft',
            hackathon_status: 'draft',
            end_date: endDateStr,
          };
          
          const editResult = canEditHackathon(hackathon, timeBeforeEnd);
          
          // Draft hackathons before end_date can be edited without approval
          expect(editResult.canEdit).toBe(true);
          expect(editResult.requiresApproval).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7b: Ended hackathons cannot be edited
   */
  it('Property 7b: Ended hackathons cannot be edited', () => {
    fc.assert(
      fc.property(
        dateStringArb,
        fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }), // 1ms to 1 year after end
        (endDateStr, msAfterEnd) => {
          const endDate = new Date(endDateStr);
          const timeAfterEnd = new Date(endDate.getTime() + msAfterEnd);
          
          const hackathon: HackathonStateInput = {
            status: 'published',
            hackathon_status: 'live', // Even if hackathon_status says live
            end_date: endDateStr,
          };
          
          const editResult = canEditHackathon(hackathon, timeAfterEnd);
          
          // Ended hackathons cannot be edited
          expect(editResult.canEdit).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7c: Edit freedom is consistent with display state
   */
  it('Property 7c: Edit freedom is consistent with display state', () => {
    fc.assert(
      fc.property(
        hackathonStateInputArb,
        currentTimeArb,
        (hackathon, currentTime) => {
          const displayState = getHackathonDisplayState(hackathon, currentTime);
          const editResult = canEditHackathon(hackathon, currentTime);
          
          // Edit should be allowed for draft and live, not for ended
          if (displayState === 'draft' || displayState === 'live') {
            expect(editResult.canEdit).toBe(true);
            expect(editResult.requiresApproval).toBe(false);
          } else {
            expect(editResult.canEdit).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7d: No approval workflow is ever required for any editable hackathon
   */
  it('Property 7d: No approval workflow is ever required for any editable hackathon', () => {
    fc.assert(
      fc.property(
        hackathonStateInputArb,
        currentTimeArb,
        (hackathon, currentTime) => {
          const editResult = canEditHackathon(hackathon, currentTime);
          
          // If edit is allowed, approval should never be required
          // This validates the removal of the edit request workflow
          if (editResult.canEdit) {
            expect(editResult.requiresApproval).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7e: Published hackathons with various hackathon_status values can be edited
   */
  it('Property 7e: Published hackathons with any hackathon_status can be edited before end_date', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('live'),
          fc.constant('upcoming'),
          fc.constant('registration_open'),
          fc.constant('building'),
          fc.constant('ongoing'),
          fc.constant('submission_open'),
          fc.constant('judging')
        ),
        dateStringArb,
        fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }), // 1ms to 1 year before end
        (hackathonStatus, endDateStr, msBeforeEnd) => {
          const endDate = new Date(endDateStr);
          const timeBeforeEnd = new Date(endDate.getTime() - msBeforeEnd);
          
          const hackathon: HackathonStateInput = {
            status: 'published',
            hackathon_status: hackathonStatus,
            end_date: endDateStr,
          };
          
          const editResult = canEditHackathon(hackathon, timeBeforeEnd);
          
          // All published hackathons before end_date should be editable without approval
          expect(editResult.canEdit).toBe(true);
          expect(editResult.requiresApproval).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
