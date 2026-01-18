// Date validation utilities for hackathon dates
export interface DateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface HackathonDates {
  startDate: string | Date;
  endDate: string | Date;
}

/**
 * Validates hackathon dates with comprehensive checks
 */
export function validateHackathonDates(dates: HackathonDates): DateValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Parse dates
  const startDate = new Date(dates.startDate);
  const endDate = new Date(dates.endDate);
  const now = new Date();
  
  // Check if dates are valid
  if (isNaN(startDate.getTime())) {
    errors.push('Start date is invalid');
  }
  
  if (isNaN(endDate.getTime())) {
    errors.push('End date is invalid');
  }
  
  // If dates are invalid, return early
  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }
  
  // Check if end date is after start date
  if (endDate <= startDate) {
    errors.push('End date must be after start date');
  }
  
  // Check if end date is in the past (critical error)
  if (endDate <= now) {
    errors.push('End date cannot be in the past');
  }
  
  // Check if start date is in the past (warning for existing hackathons)
  if (startDate <= now) {
    warnings.push('Start date is in the past - hackathon will start immediately');
  }
  
  // Check minimum duration (1 hour)
  const durationMs = endDate.getTime() - startDate.getTime();
  const oneHour = 60 * 60 * 1000;
  if (durationMs < oneHour) {
    errors.push('Hackathon must be at least 1 hour long');
  }
  
  // Check maximum duration (30 days)
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  if (durationMs > thirtyDays) {
    warnings.push('Hackathon duration is longer than 30 days');
  }
  
  // Check if dates are too far in the future (1 year)
  const oneYear = 365 * 24 * 60 * 60 * 1000;
  if (startDate.getTime() - now.getTime() > oneYear) {
    warnings.push('Start date is more than 1 year in the future');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates a single date
 */
export function validateDate(date: string | Date, fieldName: string = 'Date'): DateValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const parsedDate = new Date(date);
  
  if (isNaN(parsedDate.getTime())) {
    errors.push(`${fieldName} is invalid`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Checks if a date is in the past
 */
export function isDateInPast(date: string | Date): boolean {
  const parsedDate = new Date(date);
  const now = new Date();
  return parsedDate <= now;
}

/**
 * Checks if a hackathon is currently active (between start and end dates)
 */
export function isHackathonActive(startDate: string | Date, endDate: string | Date): boolean {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return now >= start && now <= end;
}

/**
 * Checks if a hackathon has ended
 */
export function hasHackathonEnded(endDate: string | Date): boolean {
  const now = new Date();
  const end = new Date(endDate);
  
  return now > end;
}

/**
 * Gets the duration of a hackathon in milliseconds
 */
export function getHackathonDuration(startDate: string | Date, endDate: string | Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return end.getTime() - start.getTime();
}

/**
 * Formats duration in human-readable format
 */
export function formatDuration(durationMs: number): string {
  const days = Math.floor(durationMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((durationMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((durationMs % (60 * 60 * 1000)) / (60 * 1000));
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
}

/**
 * Validates date update for existing hackathons
 */
export function validateDateUpdate(
  currentDates: HackathonDates,
  newDates: HackathonDates,
  hackathonStatus: string
): DateValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // First validate the new dates normally
  const basicValidation = validateHackathonDates(newDates);
  errors.push(...basicValidation.errors);
  warnings.push(...basicValidation.warnings);
  
  // If basic validation failed, return early
  if (!basicValidation.isValid) {
    return { isValid: false, errors, warnings };
  }
  
  const now = new Date();
  const currentStart = new Date(currentDates.startDate);
  const currentEnd = new Date(currentDates.endDate);
  const newStart = new Date(newDates.startDate);
  const newEnd = new Date(newDates.endDate);
  
  // Check if hackathon has already started
  const hasStarted = now >= currentStart;
  
  // Check if hackathon has already ended
  const hasEnded = now >= currentEnd;
  
  if (hasEnded) {
    errors.push('Cannot modify dates of a hackathon that has already ended');
    return { isValid: false, errors, warnings };
  }
  
  if (hasStarted) {
    // If hackathon has started, only allow extending the end date
    if (newStart.getTime() !== currentStart.getTime()) {
      errors.push('Cannot change start date of a hackathon that has already started');
    }
    
    if (newEnd < currentEnd) {
      errors.push('Cannot shorten a hackathon that has already started');
    }
    
    if (newEnd <= now) {
      errors.push('Cannot set end date to past when hackathon is already running');
    }
  }
  
  // Check if there are registrations (would need database check in actual implementation)
  // This is a placeholder for the actual check
  if (hackathonStatus === 'published') {
    warnings.push('Changing dates of a published hackathon may affect registered participants');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}