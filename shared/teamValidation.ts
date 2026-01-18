// Team management validation and edge case handling
export interface TeamValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TeamMember {
  id: string;
  user_id: string;
  team_id: string;
  role: 'leader' | 'member';
  status: 'active' | 'pending' | 'left';
  joined_at: string;
}

export interface Team {
  id: string;
  hackathon_id: string;
  team_name: string;
  team_code: string;
  team_leader_id: string;
  max_size: number;
  current_size: number;
  status: 'active' | 'disbanded';
  created_at: string;
}

export interface HackathonSubmission {
  id: string;
  team_id: string;
  status: 'draft' | 'submitted' | 'disqualified';
  submitted_at?: string;
}

/**
 * Validates team creation
 */
export function validateTeamCreation(
  teamName: string,
  maxTeamSize: number,
  userId: string
): TeamValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate team name
  if (!teamName || teamName.trim().length === 0) {
    errors.push('Team name is required');
  } else if (teamName.trim().length < 2) {
    errors.push('Team name must be at least 2 characters long');
  } else if (teamName.trim().length > 50) {
    errors.push('Team name must be less than 50 characters');
  }
  
  // Check for inappropriate content (basic check)
  const inappropriateWords = ['spam', 'test', 'admin', 'moderator', 'null', 'undefined'];
  const lowerTeamName = teamName.toLowerCase();
  for (const word of inappropriateWords) {
    if (lowerTeamName.includes(word)) {
      warnings.push(`Team name contains potentially inappropriate word: ${word}`);
    }
  }
  
  // Validate max team size
  if (maxTeamSize < 1) {
    errors.push('Team must allow at least 1 member');
  } else if (maxTeamSize > 10) {
    warnings.push('Team size larger than 10 may be difficult to manage');
  }
  
  // Validate user ID
  if (!userId || userId.trim().length === 0) {
    errors.push('User ID is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates team joining
 */
export function validateTeamJoin(
  team: Team,
  userId: string,
  userCurrentTeamId?: string
): TeamValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if user is already on a team
  if (userCurrentTeamId) {
    errors.push('You are already on a team for this hackathon');
    return { isValid: false, errors, warnings };
  }
  
  // Check if team exists and is active
  if (!team) {
    errors.push('Team not found');
    return { isValid: false, errors, warnings };
  }
  
  if (team.status !== 'active') {
    errors.push('Team is no longer active');
    return { isValid: false, errors, warnings };
  }
  
  // Check if team is full
  if (team.current_size >= team.max_size) {
    errors.push(`Team is full (maximum ${team.max_size} members)`);
    return { isValid: false, errors, warnings };
  }
  
  // Check if user is trying to join their own team (shouldn't happen but safety check)
  if (team.team_leader_id === userId) {
    errors.push('You are already the leader of this team');
    return { isValid: false, errors, warnings };
  }
  
  // Validate user ID
  if (!userId || userId.trim().length === 0) {
    errors.push('User ID is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates team leaving
 */
export function validateTeamLeave(
  team: Team,
  userId: string,
  userRole: 'leader' | 'member',
  submission?: HackathonSubmission
): TeamValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if team exists
  if (!team) {
    errors.push('Team not found');
    return { isValid: false, errors, warnings };
  }
  
  // Team leaders cannot leave directly - they must disband the team or transfer leadership
  if (userRole === 'leader') {
    errors.push('Team leaders cannot leave directly. Please disband the team or transfer leadership first.');
    return { isValid: false, errors, warnings };
  }
  
  // Check if team has submitted a project (optional enforcement)
  if (submission && submission.status === 'submitted') {
    errors.push('Cannot leave team after project submission');
    return { isValid: false, errors, warnings };
  }
  
  // Validate user ID
  if (!userId || userId.trim().length === 0) {
    errors.push('User ID is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates team disbanding
 */
export function validateTeamDisband(
  team: Team,
  userId: string,
  submission?: HackathonSubmission
): TeamValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if team exists
  if (!team) {
    errors.push('Team not found');
    return { isValid: false, errors, warnings };
  }
  
  // Only team leader can disband
  if (team.team_leader_id !== userId) {
    errors.push('Only the team leader can disband the team');
    return { isValid: false, errors, warnings };
  }
  
  // Check if team has submitted a project
  if (submission && submission.status === 'submitted') {
    warnings.push('Disbanding team after project submission may affect judging');
  }
  
  // Validate user ID
  if (!userId || userId.trim().length === 0) {
    errors.push('User ID is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates leadership transfer
 */
export function validateLeadershipTransfer(
  team: Team,
  currentLeaderId: string,
  newLeaderId: string,
  newLeaderIsMember: boolean
): TeamValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if team exists
  if (!team) {
    errors.push('Team not found');
    return { isValid: false, errors, warnings };
  }
  
  // Only current leader can transfer leadership
  if (team.team_leader_id !== currentLeaderId) {
    errors.push('Only the current team leader can transfer leadership');
    return { isValid: false, errors, warnings };
  }
  
  // New leader must be a team member
  if (!newLeaderIsMember) {
    errors.push('New leader must be a team member');
    return { isValid: false, errors, warnings };
  }
  
  // Cannot transfer to self
  if (currentLeaderId === newLeaderId) {
    errors.push('Cannot transfer leadership to yourself');
    return { isValid: false, errors, warnings };
  }
  
  // Validate IDs
  if (!currentLeaderId || currentLeaderId.trim().length === 0) {
    errors.push('Current leader ID is required');
  }
  
  if (!newLeaderId || newLeaderId.trim().length === 0) {
    errors.push('New leader ID is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates team invitation
 */
export function validateTeamInvitation(
  team: Team,
  inviterId: string,
  inviteeEmail: string
): TeamValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if team exists and is active
  if (!team) {
    errors.push('Team not found');
    return { isValid: false, errors, warnings };
  }
  
  if (team.status !== 'active') {
    errors.push('Team is no longer active');
    return { isValid: false, errors, warnings };
  }
  
  // Only team leader can send invitations
  if (team.team_leader_id !== inviterId) {
    errors.push('Only the team leader can send invitations');
    return { isValid: false, errors, warnings };
  }
  
  // Check if team is full
  if (team.current_size >= team.max_size) {
    errors.push(`Team is full (maximum ${team.max_size} members)`);
    return { isValid: false, errors, warnings };
  }
  
  // Validate email format (basic check)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(inviteeEmail)) {
    errors.push('Invalid email format');
  }
  
  // Validate IDs
  if (!inviterId || inviterId.trim().length === 0) {
    errors.push('Inviter ID is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Generates a unique team code
 */
export function generateTeamCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validates team code format
 */
export function validateTeamCode(code: string): boolean {
  const codeRegex = /^[A-Z0-9]{6}$/;
  return codeRegex.test(code);
}

/**
 * Checks if team name is unique within a hackathon
 */
export function validateTeamNameUniqueness(
  teamName: string,
  hackathonId: string,
  existingTeamNames: string[]
): TeamValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const normalizedName = teamName.trim().toLowerCase();
  const normalizedExisting = existingTeamNames.map(name => name.toLowerCase());
  
  if (normalizedExisting.includes(normalizedName)) {
    errors.push('A team with this name already exists in this hackathon');
  }
  
  // Check for very similar names (optional warning)
  for (const existingName of normalizedExisting) {
    if (existingName !== normalizedName && existingName.includes(normalizedName)) {
      warnings.push(`Similar team name already exists: ${existingName}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates team size limits
 */
export function validateTeamSizeLimit(
  currentSize: number,
  maxSize: number,
  action: 'join' | 'invite'
): TeamValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (currentSize >= maxSize) {
    errors.push(`Team is full (maximum ${maxSize} members)`);
  } else if (currentSize + 1 === maxSize && action === 'invite') {
    warnings.push('This will be the last member that can join the team');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates team member permissions
 */
export function validateTeamMemberPermissions(
  userRole: 'leader' | 'member',
  action: 'invite' | 'remove' | 'disband' | 'transfer_leadership'
): TeamValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const leaderOnlyActions = ['invite', 'remove', 'disband', 'transfer_leadership'];
  
  if (leaderOnlyActions.includes(action) && userRole !== 'leader') {
    errors.push(`Only team leaders can ${action.replace('_', ' ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}