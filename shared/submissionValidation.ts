// Submission validation and edge case handling
export interface SubmissionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SubmissionData {
  project_name: string;
  description: string;
  demo_url?: string;
  github_repo?: string;
  video_url?: string;
  technologies?: string[];
  team_id?: string;
  hackathon_id: string;
}

export interface HackathonSubmissionWindow {
  hackathon_id: string;
  start_date: string;
  end_date: string;
  status: string;
}

/**
 * Validates URL format
 */
export function validateUrl(url: string, fieldName: string = 'URL'): SubmissionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!url || url.trim().length === 0) {
    return { isValid: true, errors, warnings }; // Empty URLs are allowed for optional fields
  }
  
  try {
    const parsedUrl = new URL(url);
    
    // Check protocol
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      errors.push(`${fieldName} must use HTTP or HTTPS protocol`);
    }
    
    // Check for localhost/local IPs in production
    const hostname = parsedUrl.hostname.toLowerCase();
    const localPatterns = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1',
      /^192\.168\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./
    ];
    
    const isLocal = localPatterns.some(pattern => 
      typeof pattern === 'string' ? hostname === pattern : pattern.test(hostname)
    );
    
    if (isLocal) {
      warnings.push(`${fieldName} appears to be a local URL - make sure it's accessible publicly`);
    }
    
    // Check URL length
    if (url.length > 2000) {
      errors.push(`${fieldName} is too long (maximum 2000 characters)`);
    }
    
  } catch (error) {
    errors.push(`${fieldName} is not a valid URL format`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates submission timing
 */
export function validateSubmissionTiming(
  hackathon: HackathonSubmissionWindow,
  isUpdate: boolean = false
): SubmissionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const now = new Date();
  const startDate = new Date(hackathon.start_date);
  const endDate = new Date(hackathon.end_date);
  
  // Check if hackathon is published
  if (hackathon.status !== 'published') {
    errors.push('Submissions are not open - hackathon is not published');
    return { isValid: false, errors, warnings };
  }
  
  // Check if before start date
  if (now < startDate) {
    errors.push('Submissions are not open yet - hackathon has not started');
    return { isValid: false, errors, warnings };
  }
  
  // Check if after end date
  if (now > endDate) {
    if (isUpdate) {
      errors.push('Submission period has ended - projects are now read-only');
    } else {
      errors.push('Submission period has ended - no new submissions allowed');
    }
    return { isValid: false, errors, warnings };
  }
  
  // Warning if close to deadline
  const timeUntilEnd = endDate.getTime() - now.getTime();
  const hoursUntilEnd = timeUntilEnd / (1000 * 60 * 60);
  
  if (hoursUntilEnd <= 1) {
    warnings.push('Less than 1 hour remaining until submission deadline');
  } else if (hoursUntilEnd <= 24) {
    warnings.push('Less than 24 hours remaining until submission deadline');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates submission data
 */
export function validateSubmissionData(data: SubmissionData): SubmissionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields
  if (!data.project_name || data.project_name.trim().length === 0) {
    errors.push('Project name is required');
  } else if (data.project_name.trim().length < 3) {
    errors.push('Project name must be at least 3 characters long');
  } else if (data.project_name.trim().length > 100) {
    errors.push('Project name must be less than 100 characters');
  }
  
  if (!data.description || data.description.trim().length === 0) {
    errors.push('Project description is required');
  } else if (data.description.trim().length < 10) {
    errors.push('Project description must be at least 10 characters long');
  } else if (data.description.trim().length > 5000) {
    errors.push('Project description must be less than 5000 characters');
  }
  
  // URL validations
  if (data.demo_url) {
    const demoValidation = validateUrl(data.demo_url, 'Demo URL');
    errors.push(...demoValidation.errors);
    warnings.push(...demoValidation.warnings);
  }
  
  if (data.github_repo) {
    const githubValidation = validateUrl(data.github_repo, 'GitHub repository URL');
    errors.push(...githubValidation.errors);
    warnings.push(...githubValidation.warnings);
    
    // Additional GitHub-specific validation
    if (githubValidation.isValid && data.github_repo) {
      try {
        const url = new URL(data.github_repo);
        if (!url.hostname.includes('github.com')) {
          warnings.push('GitHub repository URL should be from github.com');
        }
      } catch {
        // URL validation already handled above
      }
    }
  }
  
  if (data.video_url) {
    const videoValidation = validateUrl(data.video_url, 'Video URL');
    errors.push(...videoValidation.errors);
    warnings.push(...videoValidation.warnings);
    
    // Additional video platform validation
    if (videoValidation.isValid && data.video_url) {
      try {
        const url = new URL(data.video_url);
        const videoHosts = ['youtube.com', 'youtu.be', 'vimeo.com', 'loom.com', 'drive.google.com'];
        const isKnownVideoHost = videoHosts.some(host => url.hostname.includes(host));
        
        if (!isKnownVideoHost) {
          warnings.push('Video URL should be from a known video platform (YouTube, Vimeo, Loom, etc.)');
        }
      } catch {
        // URL validation already handled above
      }
    }
  }
  
  // Technologies validation
  if (data.technologies) {
    if (!Array.isArray(data.technologies)) {
      errors.push('Technologies must be an array');
    } else {
      if (data.technologies.length > 20) {
        errors.push('Maximum 20 technologies allowed');
      }
      
      for (const tech of data.technologies) {
        if (typeof tech !== 'string') {
          errors.push('All technologies must be strings');
          break;
        }
        
        if (tech.trim().length === 0) {
          errors.push('Technology names cannot be empty');
          break;
        }
        
        if (tech.length > 50) {
          errors.push('Technology names must be less than 50 characters');
          break;
        }
      }
      
      // Check for duplicates
      const uniqueTechs = new Set(data.technologies.map(t => t.toLowerCase()));
      if (uniqueTechs.size !== data.technologies.length) {
        warnings.push('Duplicate technologies detected');
      }
    }
  }
  
  // Content validation
  const inappropriateWords = ['spam', 'test', 'fake', 'placeholder', 'lorem ipsum'];
  const projectNameLower = data.project_name?.toLowerCase() || '';
  const descriptionLower = data.description?.toLowerCase() || '';
  
  for (const word of inappropriateWords) {
    if (projectNameLower.includes(word)) {
      warnings.push(`Project name contains potentially inappropriate word: ${word}`);
    }
    if (descriptionLower.includes(word)) {
      warnings.push(`Description contains potentially inappropriate word: ${word}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates submission update
 */
export function validateSubmissionUpdate(
  existingSubmission: any,
  newData: Partial<SubmissionData>,
  hackathon: HackathonSubmissionWindow
): SubmissionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check timing for updates
  const timingValidation = validateSubmissionTiming(hackathon, true);
  errors.push(...timingValidation.errors);
  warnings.push(...timingValidation.warnings);
  
  if (!timingValidation.isValid) {
    return { isValid: false, errors, warnings };
  }
  
  // Check if submission is disqualified
  if (existingSubmission.status === 'disqualified') {
    errors.push('Cannot update disqualified submissions');
    return { isValid: false, errors, warnings };
  }
  
  // Validate the updated data
  const mergedData = { ...existingSubmission, ...newData };
  const dataValidation = validateSubmissionData(mergedData);
  errors.push(...dataValidation.errors);
  warnings.push(...dataValidation.warnings);
  
  // Check if trying to change immutable fields
  if (newData.hackathon_id && newData.hackathon_id !== existingSubmission.hackathon_id) {
    errors.push('Cannot change hackathon ID');
  }
  
  if (newData.team_id && newData.team_id !== existingSubmission.team_id) {
    warnings.push('Changing team assignment - make sure this is intentional');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates file upload (for future use)
 */
export function validateFileUpload(
  file: { size: number; type: string; name: string },
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
  maxSizeMB: number = 50
): SubmissionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    errors.push(`File size exceeds maximum allowed (${maxSizeMB}MB)`);
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  // Check file name
  if (file.name.length > 255) {
    errors.push('File name is too long (maximum 255 characters)');
  }
  
  // Warning for large files
  const warningThreshold = maxSizeMB * 0.8 * 1024 * 1024; // 80% of max size
  if (file.size > warningThreshold) {
    warnings.push(`Large file size (${Math.round(file.size / 1024 / 1024)}MB) - consider compressing`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates team submission permissions
 */
export function validateTeamSubmissionPermissions(
  userId: string,
  teamId: string | null,
  teamLeaderId: string | null,
  isTeamSubmission: boolean = false
): SubmissionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (isTeamSubmission) {
    if (!teamId) {
      errors.push('Team ID is required for team submissions');
      return { isValid: false, errors, warnings };
    }
    
    if (!teamLeaderId) {
      errors.push('Team leader not found');
      return { isValid: false, errors, warnings };
    }
    
    // Only team leader can create/update team submissions
    if (userId !== teamLeaderId) {
      errors.push('Only the team leader can create or update team submissions');
      return { isValid: false, errors, warnings };
    }
  } else {
    // Individual submission
    if (teamId) {
      warnings.push('You are part of a team but creating an individual submission');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Sanitizes submission data
 */
export function sanitizeSubmissionData(data: SubmissionData): SubmissionData {
  return {
    ...data,
    project_name: data.project_name?.trim() || '',
    description: data.description?.trim() || '',
    demo_url: data.demo_url?.trim() || undefined,
    github_repo: data.github_repo?.trim() || undefined,
    video_url: data.video_url?.trim() || undefined,
    technologies: data.technologies?.map(t => t.trim()).filter(t => t.length > 0) || []
  };
}