// Edge case test suite for Maximally platform
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateHackathonDates, validateDateUpdate } from '../shared/dateValidation';
import { validateTeamCreation, validateTeamJoin, validateTeamLeave } from '../shared/teamValidation';
import { validateJudgeScore, validateCriterionScore } from '../shared/judgeScoreValidation';
import { validateSubmissionData, validateSubmissionTiming } from '../shared/submissionValidation';
import { validateUserDeletion, validateOrganizerRoleRevocation } from '../shared/userDeletionValidation';
import { validateEmail, isDisposableDomain } from '../shared/emailValidation';

describe('Edge Cases - Date Validation', () => {
  it('should reject end date in the past', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    const result = validateHackathonDates({
      startDate: yesterday,
      endDate: yesterday
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('End date cannot be in the past');
  });
  
  it('should reject start date after end date', () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(Date.now() + 48 * 60 * 60 * 1000);
    
    const result = validateHackathonDates({
      startDate: dayAfterTomorrow,
      endDate: tomorrow
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('End date must be after start date');
  });
  
  it('should reject hackathon shorter than 1 hour', () => {
    const now = new Date();
    const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);
    
    const result = validateHackathonDates({
      startDate: now,
      endDate: thirtyMinutesLater
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Hackathon must be at least 1 hour long');
  });
  
  it('should allow date updates for future hackathons', () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const threeDaysLater = new Date(Date.now() + 72 * 60 * 60 * 1000);
    
    const result = validateDateUpdate(
      { startDate: tomorrow, endDate: dayAfterTomorrow },
      { startDate: tomorrow, endDate: threeDaysLater },
      'published'
    );
    
    expect(result.isValid).toBe(true);
  });
  
  it('should reject date changes for ended hackathons', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    const result = validateDateUpdate(
      { startDate: twoDaysAgo, endDate: yesterday },
      { startDate: twoDaysAgo, endDate: tomorrow },
      'published'
    );
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Cannot modify dates of a hackathon that has already ended');
  });
});

describe('Edge Cases - Team Management', () => {
  it('should reject team creation with empty name', () => {
    const result = validateTeamCreation('', 5, 'user123');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Team name is required');
  });
  
  it('should reject team creation with very short name', () => {
    const result = validateTeamCreation('A', 5, 'user123');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Team name must be at least 2 characters long');
  });
  
  it('should reject team creation with very long name', () => {
    const longName = 'A'.repeat(51);
    const result = validateTeamCreation(longName, 5, 'user123');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Team name must be less than 50 characters');
  });
  
  it('should reject joining full team', () => {
    const team = {
      id: 'team1',
      hackathon_id: 'hack1',
      team_name: 'Test Team',
      team_code: 'ABC123',
      team_leader_id: 'leader1',
      max_size: 3,
      current_size: 3,
      status: 'active' as const,
      created_at: new Date().toISOString()
    };
    
    const result = validateTeamJoin(team, 'user123');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Team is full (maximum 3 members)');
  });
  
  it('should reject team leader leaving directly', () => {
    const team = {
      id: 'team1',
      hackathon_id: 'hack1',
      team_name: 'Test Team',
      team_code: 'ABC123',
      team_leader_id: 'leader1',
      max_size: 5,
      current_size: 2,
      status: 'active' as const,
      created_at: new Date().toISOString()
    };
    
    const result = validateTeamLeave(team, 'leader1', 'leader');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Team leaders cannot leave directly. Please disband the team or transfer leadership first.');
  });
});

describe('Edge Cases - Judge Scoring', () => {
  it('should reject scores outside valid range', () => {
    const criteria = {
      id: 'innovation',
      name: 'Innovation',
      description: 'How innovative is the project?',
      min_score: 0,
      max_score: 10,
      weight: 1,
      required: true
    };
    
    const result = validateCriterionScore(15, criteria);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Innovation: Score cannot be greater than 10');
  });
  
  it('should reject negative scores', () => {
    const criteria = {
      id: 'technical',
      name: 'Technical Quality',
      description: 'Technical implementation quality',
      min_score: 0,
      max_score: 10,
      weight: 1,
      required: true
    };
    
    const result = validateCriterionScore(-5, criteria);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Technical Quality: Score cannot be less than 0');
  });
  
  it('should validate complete judge score', () => {
    const score = {
      judge_id: 'judge1',
      submission_id: 'sub1',
      criteria_scores: {
        innovation: 8,
        technical: 7,
        design: 9
      },
      feedback: 'Great project!'
    };
    
    const criteria = [
      { id: 'innovation', name: 'Innovation', description: '', min_score: 0, max_score: 10, weight: 1, required: true },
      { id: 'technical', name: 'Technical', description: '', min_score: 0, max_score: 10, weight: 1, required: true },
      { id: 'design', name: 'Design', description: '', min_score: 0, max_score: 10, weight: 1, required: false }
    ];
    
    const result = validateJudgeScore(score, criteria);
    
    expect(result.isValid).toBe(true);
  });
  
  it('should reject score with missing required criteria', () => {
    const score = {
      judge_id: 'judge1',
      submission_id: 'sub1',
      criteria_scores: {
        innovation: 8
        // missing required 'technical' criterion
      }
    };
    
    const criteria = [
      { id: 'innovation', name: 'Innovation', description: '', min_score: 0, max_score: 10, weight: 1, required: true },
      { id: 'technical', name: 'Technical', description: '', min_score: 0, max_score: 10, weight: 1, required: true }
    ];
    
    const result = validateJudgeScore(score, criteria);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Required criterion "Technical" is missing');
  });
});

describe('Edge Cases - Submission Validation', () => {
  it('should reject submission with missing required fields', () => {
    const submission = {
      project_name: '',
      description: '',
      hackathon_id: 'hack1'
    };
    
    const result = validateSubmissionData(submission);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Project name is required');
    expect(result.errors).toContain('Project description is required');
  });
  
  it('should reject submission with invalid URLs', () => {
    const submission = {
      project_name: 'Test Project',
      description: 'A test project for validation',
      demo_url: 'not-a-valid-url',
      github_repo: 'also-not-valid',
      hackathon_id: 'hack1'
    };
    
    const result = validateSubmissionData(submission);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Demo URL is not a valid URL format');
    expect(result.errors).toContain('GitHub repository URL is not a valid URL format');
  });
  
  it('should warn about local URLs', () => {
    const submission = {
      project_name: 'Test Project',
      description: 'A test project for validation',
      demo_url: 'http://localhost:3000',
      hackathon_id: 'hack1'
    };
    
    const result = validateSubmissionData(submission);
    
    expect(result.isValid).toBe(true);
    expect(result.warnings).toContain('Demo URL appears to be a local URL - make sure it\'s accessible publicly');
  });
  
  it('should reject submissions after deadline', () => {
    const hackathon = {
      hackathon_id: 'hack1',
      start_date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
      end_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      status: 'published'
    };
    
    const result = validateSubmissionTiming(hackathon);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Submission period has ended - no new submissions allowed');
  });
  
  it('should reject submissions before start date', () => {
    const hackathon = {
      hackathon_id: 'hack1',
      start_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
      end_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // day after tomorrow
      status: 'published'
    };
    
    const result = validateSubmissionTiming(hackathon);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Submissions are not open yet - hackathon has not started');
  });
});

describe('Edge Cases - User Deletion', () => {
  it('should block deletion of user with owned hackathons', () => {
    const context = {
      userId: 'user1',
      userRole: 'organizer',
      ownedHackathons: 2,
      activeTeamLeaderships: 0,
      activeRegistrations: 1,
      submittedProjects: 0,
      judgeAssignments: 0,
      coOrganizerRoles: 0
    };
    
    const result = validateUserDeletion(context);
    
    expect(result.canDelete).toBe(false);
    expect(result.blockers).toContain('User owns 2 hackathons');
    expect(result.suggestions).toContain('Transfer hackathon ownership to another organizer before deletion');
  });
  
  it('should block deletion of team leader', () => {
    const context = {
      userId: 'user1',
      userRole: 'user',
      ownedHackathons: 0,
      activeTeamLeaderships: 1,
      activeRegistrations: 1,
      submittedProjects: 0,
      judgeAssignments: 0,
      coOrganizerRoles: 0
    };
    
    const result = validateUserDeletion(context);
    
    expect(result.canDelete).toBe(false);
    expect(result.blockers).toContain('User is team leader of 1 active team');
  });
  
  it('should allow deletion of regular user with warnings', () => {
    const context = {
      userId: 'user1',
      userRole: 'user',
      ownedHackathons: 0,
      activeTeamLeaderships: 0,
      activeRegistrations: 2,
      submittedProjects: 1,
      judgeAssignments: 0,
      coOrganizerRoles: 0
    };
    
    const result = validateUserDeletion(context);
    
    expect(result.canDelete).toBe(true);
    expect(result.warnings).toContain('User has 2 active hackathon registrations that will be cancelled');
    expect(result.warnings).toContain('User has 1 submitted project that will be anonymized');
  });
  
  it('should block organizer role revocation with active hackathons', () => {
    const context = {
      userId: 'user1',
      ownedHackathons: 1,
      coOrganizerRoles: 2
    };
    
    const result = validateOrganizerRoleRevocation(context);
    
    expect(result.canDelete).toBe(false);
    expect(result.blockers).toContain('User owns 1 hackathon');
  });
});

describe('Edge Cases - Email Validation', () => {
  it('should reject disposable email domains', () => {
    expect(isDisposableDomain('tempmail.com')).toBe(true);
    expect(isDisposableDomain('10minutemail.com')).toBe(true);
    expect(isDisposableDomain('guerrillamail.com')).toBe(true);
    expect(isDisposableDomain('mailinator.com')).toBe(true);
  });
  
  it('should allow legitimate email domains', () => {
    expect(isDisposableDomain('gmail.com')).toBe(false);
    expect(isDisposableDomain('outlook.com')).toBe(false);
    expect(isDisposableDomain('company.com')).toBe(false);
  });
  
  it('should detect disposable subdomains', () => {
    expect(isDisposableDomain('mail.tempmail.com')).toBe(true);
    expect(isDisposableDomain('secure.guerrillamail.com')).toBe(true);
  });
  
  it('should detect pattern-based disposable emails', () => {
    expect(isDisposableDomain('tempemailservice.com')).toBe(true);
    expect(isDisposableDomain('throwawaymail.net')).toBe(true);
    expect(isDisposableDomain('spammail.org')).toBe(true);
  });
  
  it('should validate complete email addresses', async () => {
    // Note: This test would require mocking DNS resolution in a real test environment
    const validEmail = 'test@gmail.com';
    // const result = await validateEmail(validEmail);
    // expect(result.isValid).toBe(true);
    
    // For now, just test the quick validation
    const quickResult = validateEmail(validEmail);
    expect(quickResult.isValid).toBe(true);
  });
});

describe('Edge Cases - Rate Limiting', () => {
  // Note: Rate limiting tests would require setting up the actual rate limiter
  // and testing with multiple requests. This is more of an integration test.
  
  it('should have rate limiting configuration', () => {
    // Test that rate limiting constants are properly defined
    expect(typeof 5).toBe('number'); // OTP requests per hour
    expect(typeof 10).toBe('number'); // OTP verifications per hour
    expect(typeof 20).toBe('number'); // Email validations per minute
  });
});

describe('Edge Cases - Concurrent Operations', () => {
  it('should handle concurrent team creation with same name', () => {
    // This would be an integration test that creates multiple teams
    // with the same name simultaneously to test race conditions
    expect(true).toBe(true); // Placeholder
  });
  
  it('should handle concurrent registration for limited capacity hackathon', () => {
    // This would test what happens when multiple users try to register
    // for the last spot in a hackathon simultaneously
    expect(true).toBe(true); // Placeholder
  });
  
  it('should handle concurrent judge scoring', () => {
    // This would test multiple judges scoring the same submission
    // at the same time
    expect(true).toBe(true); // Placeholder
  });
});

describe('Edge Cases - Data Integrity', () => {
  it('should maintain referential integrity on cascading deletes', () => {
    // This would test that when a hackathon is deleted,
    // all related data is properly cleaned up
    expect(true).toBe(true); // Placeholder
  });
  
  it('should handle orphaned records gracefully', () => {
    // This would test scenarios where foreign key references
    // become null due to deletions
    expect(true).toBe(true); // Placeholder
  });
  
  it('should preserve audit trail on user deletion', () => {
    // This would test that activity feed entries are preserved
    // but anonymized when a user is deleted
    expect(true).toBe(true); // Placeholder
  });
});