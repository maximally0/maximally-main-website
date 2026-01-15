/**
 * Simplified Hackathon State Management
 * 
 * This module provides utilities for determining hackathon display states.
 * According to the platform simplification spec, hackathons can only be in
 * one of three states: 'draft', 'live', or 'ended'.
 * 
 * The state is determined by:
 * - 'draft': Hackathon is not yet published/approved
 * - 'live': Hackathon is published and end_date has not passed
 * - 'ended': Hackathon end_date has passed
 */

/**
 * Valid hackathon display states after platform simplification
 */
export type HackathonDisplayState = 'draft' | 'live' | 'ended';

/**
 * Minimal hackathon data needed to determine display state
 */
export interface HackathonStateInput {
  status: string | null;
  hackathon_status?: string | null;
  end_date: string;
}

/**
 * Determines the display state of a hackathon.
 * 
 * Property 3: Hackathon State Display
 * For any hackathon viewed by an organizer, the displayed state SHALL be
 * exactly one of: 'draft', 'live', or 'ended'.
 * 
 * Validates: Requirements 2.1
 * 
 * @param hackathon - The hackathon data containing status and end_date
 * @param currentTime - Optional current time for testing (defaults to now)
 * @returns The display state: 'draft', 'live', or 'ended'
 */
export function getHackathonDisplayState(
  hackathon: HackathonStateInput,
  currentTime: Date = new Date()
): HackathonDisplayState {
  // Parse the end date - handle invalid dates gracefully
  const endDate = new Date(hackathon.end_date);
  
  // If end_date is invalid, treat as draft (can't determine state)
  if (isNaN(endDate.getTime())) {
    console.warn('[hackathonState] Invalid end_date:', hackathon.end_date);
    return 'draft';
  }
  
  // Check if the hackathon has ended (end_date has passed)
  if (currentTime > endDate) {
    return 'ended';
  }
  
  // Check if the hackathon is in draft state
  // Draft states include: 'draft', 'pending_review', null, or any non-published state
  const status = hackathon.status?.toLowerCase() || 'draft';
  
  // If status is 'published', the hackathon is live (regardless of hackathon_status)
  // The 'status' field is the authoritative source for whether a hackathon is public
  if (status === 'published') {
    return 'live';
  }
  
  // Otherwise, it's a draft
  return 'draft';
}

/**
 * Validates that a state value is a valid HackathonDisplayState
 * 
 * @param state - The state value to validate
 * @returns true if the state is valid, false otherwise
 */
export function isValidHackathonDisplayState(state: unknown): state is HackathonDisplayState {
  return state === 'draft' || state === 'live' || state === 'ended';
}

/**
 * All valid hackathon display states
 */
export const VALID_HACKATHON_STATES: readonly HackathonDisplayState[] = ['draft', 'live', 'ended'] as const;

/**
 * Determines if registration is available for a hackathon.
 * 
 * Property 5: Registration Availability
 * For any hackathon with status='live' and current time before end_date,
 * registration SHALL be allowed; for any hackathon with status='ended' or
 * current time past end_date, registration SHALL be rejected.
 * 
 * Validates: Requirements 2.5, 3.2, 3.3
 * 
 * @param hackathon - The hackathon data containing status and end_date
 * @param currentTime - Optional current time for testing (defaults to now)
 * @returns true if registration is available, false otherwise
 */
export function canRegister(
  hackathon: HackathonStateInput,
  currentTime: Date = new Date()
): boolean {
  const displayState = getHackathonDisplayState(hackathon, currentTime);
  
  // Registration is only available for live hackathons
  return displayState === 'live';
}

/**
 * Extended hackathon data needed for submission availability check
 */
export interface HackathonSubmissionInput extends HackathonStateInput {
  start_date: string;
}

/**
 * Determines if an organizer can edit a hackathon without approval workflow.
 * 
 * Property 7: Post-Publish Edit Freedom
 * For any hackathon with status='live', edit operations by the organizer
 * SHALL succeed without requiring approval workflow.
 * 
 * This function removes the edit request requirement for published hackathons.
 * 
 * Validates: Requirements 8.1
 * 
 * @param hackathon - The hackathon data containing status and end_date
 * @param currentTime - Optional current time for testing (defaults to now)
 * @returns An object indicating if edit is allowed and if approval is required
 */
export function canEditHackathon(
  hackathon: HackathonStateInput,
  currentTime: Date = new Date()
): { canEdit: boolean; requiresApproval: boolean } {
  const displayState = getHackathonDisplayState(hackathon, currentTime);
  
  // Draft hackathons can always be edited without approval
  if (displayState === 'draft') {
    return { canEdit: true, requiresApproval: false };
  }
  
  // Live hackathons can be edited without approval (post-publish edit freedom)
  if (displayState === 'live') {
    return { canEdit: true, requiresApproval: false };
  }
  
  // Ended hackathons cannot be edited
  return { canEdit: false, requiresApproval: false };
}

/**
 * Determines if project submission/editing is available for a hackathon.
 * 
 * Property 6: Submission Availability
 * For any hackathon with status='live' and current time between start_date
 * and end_date, submission creation/editing SHALL be allowed; otherwise,
 * submission editing SHALL be rejected.
 * 
 * This function removes manual toggle checks and uses only dates.
 * 
 * Validates: Requirements 5.1, 5.2, 4.2
 * 
 * @param hackathon - The hackathon data containing status, start_date, and end_date
 * @param currentTime - Optional current time for testing (defaults to now)
 * @returns true if submission is available, false otherwise
 */
export function canSubmit(
  hackathon: HackathonSubmissionInput,
  currentTime: Date = new Date()
): boolean {
  const displayState = getHackathonDisplayState(hackathon, currentTime);
  
  // Submissions are only available for live hackathons
  if (displayState !== 'live') {
    return false;
  }
  
  // Parse the start date
  const startDate = new Date(hackathon.start_date);
  
  // Submissions are only available after the start date
  // (end_date check is already handled by getHackathonDisplayState returning 'live')
  return currentTime >= startDate;
}
