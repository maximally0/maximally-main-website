// Judge score validation and edge case handling
export interface ScoreValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface JudgeScore {
  judge_id: string;
  submission_id: string;
  criteria_scores: Record<string, number>;
  overall_score?: number;
  feedback?: string;
  scored_at: string;
}

export interface ScoringCriteria {
  id: string;
  name: string;
  description: string;
  min_score: number;
  max_score: number;
  weight: number;
  required: boolean;
}

export interface JudgeToken {
  token: string;
  judge_id: string;
  hackathon_id: string;
  expires_at: string;
  revoked: boolean;
}

/**
 * Validates individual criterion score
 */
export function validateCriterionScore(
  score: number,
  criteria: ScoringCriteria
): ScoreValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if score is a valid number
  if (typeof score !== 'number' || isNaN(score)) {
    errors.push(`${criteria.name}: Score must be a valid number`);
    return { isValid: false, errors, warnings };
  }
  
  // Check score range
  if (score < criteria.min_score) {
    errors.push(`${criteria.name}: Score cannot be less than ${criteria.min_score}`);
  }
  
  if (score > criteria.max_score) {
    errors.push(`${criteria.name}: Score cannot be greater than ${criteria.max_score}`);
  }
  
  // Check for decimal precision (allow up to 2 decimal places)
  const decimalPlaces = (score.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    warnings.push(`${criteria.name}: Score will be rounded to 2 decimal places`);
  }
  
  // Warning for extreme scores
  const range = criteria.max_score - criteria.min_score;
  const scorePercentage = (score - criteria.min_score) / range;
  
  if (scorePercentage <= 0.1) {
    warnings.push(`${criteria.name}: Very low score (${score}/${criteria.max_score})`);
  } else if (scorePercentage >= 0.9) {
    warnings.push(`${criteria.name}: Very high score (${score}/${criteria.max_score})`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates complete judge score submission
 */
export function validateJudgeScore(
  score: Partial<JudgeScore>,
  criteria: ScoringCriteria[],
  requiredCriteria?: string[]
): ScoreValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate required fields
  if (!score.judge_id) {
    errors.push('Judge ID is required');
  }
  
  if (!score.submission_id) {
    errors.push('Submission ID is required');
  }
  
  if (!score.criteria_scores || Object.keys(score.criteria_scores).length === 0) {
    errors.push('At least one criterion score is required');
    return { isValid: false, errors, warnings };
  }
  
  // Validate each criterion score
  const criteriaMap = new Map(criteria.map(c => [c.id, c]));
  const scoredCriteria = new Set(Object.keys(score.criteria_scores));
  
  // Check for required criteria
  const requiredCriteriaIds = requiredCriteria || criteria.filter(c => c.required).map(c => c.id);
  for (const requiredId of requiredCriteriaIds) {
    if (!scoredCriteria.has(requiredId)) {
      const criteriaName = criteriaMap.get(requiredId)?.name || requiredId;
      errors.push(`Required criterion "${criteriaName}" is missing`);
    }
  }
  
  // Validate individual scores
  for (const [criteriaId, scoreValue] of Object.entries(score.criteria_scores)) {
    const criteriaInfo = criteriaMap.get(criteriaId);
    
    if (!criteriaInfo) {
      warnings.push(`Unknown criterion: ${criteriaId}`);
      continue;
    }
    
    const criteriaValidation = validateCriterionScore(scoreValue, criteriaInfo);
    errors.push(...criteriaValidation.errors);
    warnings.push(...criteriaValidation.warnings);
  }
  
  // Validate overall score if provided
  if (score.overall_score !== undefined) {
    const overallValidation = validateOverallScore(
      score.overall_score,
      score.criteria_scores,
      criteria
    );
    errors.push(...overallValidation.errors);
    warnings.push(...overallValidation.warnings);
  }
  
  // Validate feedback length
  if (score.feedback && score.feedback.length > 2000) {
    errors.push('Feedback cannot exceed 2000 characters');
  }
  
  // Check for potentially inappropriate feedback
  if (score.feedback) {
    const inappropriateWords = ['spam', 'fake', 'cheat', 'stupid', 'terrible', 'awful'];
    const lowerFeedback = score.feedback.toLowerCase();
    for (const word of inappropriateWords) {
      if (lowerFeedback.includes(word)) {
        warnings.push(`Feedback contains potentially inappropriate language: ${word}`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates overall score against weighted criteria scores
 */
export function validateOverallScore(
  overallScore: number,
  criteriaScores: Record<string, number>,
  criteria: ScoringCriteria[]
): ScoreValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if overall score is a valid number
  if (typeof overallScore !== 'number' || isNaN(overallScore)) {
    errors.push('Overall score must be a valid number');
    return { isValid: false, errors, warnings };
  }
  
  // Calculate weighted average
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  for (const criterion of criteria) {
    const score = criteriaScores[criterion.id];
    if (score !== undefined) {
      // Normalize score to 0-1 range
      const normalizedScore = (score - criterion.min_score) / (criterion.max_score - criterion.min_score);
      totalWeightedScore += normalizedScore * criterion.weight;
      totalWeight += criterion.weight;
    }
  }
  
  if (totalWeight === 0) {
    warnings.push('No weighted criteria found for overall score calculation');
    return { isValid: true, errors, warnings };
  }
  
  // Calculate expected overall score (assuming 0-100 scale)
  const expectedOverallScore = (totalWeightedScore / totalWeight) * 100;
  const scoreDifference = Math.abs(overallScore - expectedOverallScore);
  
  // Allow some tolerance for manual adjustments
  const tolerance = 10; // 10 points tolerance
  
  if (scoreDifference > tolerance) {
    warnings.push(
      `Overall score (${overallScore}) differs significantly from weighted average (${expectedOverallScore.toFixed(1)})`
    );
  }
  
  // Validate overall score range (assuming 0-100)
  if (overallScore < 0) {
    errors.push('Overall score cannot be negative');
  }
  
  if (overallScore > 100) {
    errors.push('Overall score cannot exceed 100');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates judge token
 */
export function validateJudgeToken(token: JudgeToken): ScoreValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if token is revoked
  if (token.revoked) {
    errors.push('Judge token has been revoked');
    return { isValid: false, errors, warnings };
  }
  
  // Check if token is expired
  const now = new Date();
  const expiresAt = new Date(token.expires_at);
  
  if (now >= expiresAt) {
    errors.push('Judge token has expired');
    return { isValid: false, errors, warnings };
  }
  
  // Warning if token expires soon (within 24 hours)
  const hoursUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursUntilExpiry <= 24) {
    warnings.push(`Token expires in ${Math.round(hoursUntilExpiry)} hours`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates judge access to specific submission
 */
export function validateJudgeSubmissionAccess(
  judgeId: string,
  submissionId: string,
  hackathonId: string,
  tokenHackathonId: string,
  assignedSubmissions?: string[]
): ScoreValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if judge token is for the correct hackathon
  if (tokenHackathonId !== hackathonId) {
    errors.push('Judge token is not valid for this hackathon');
    return { isValid: false, errors, warnings };
  }
  
  // Check if judge is assigned to this specific submission (if assignments are used)
  if (assignedSubmissions && assignedSubmissions.length > 0) {
    if (!assignedSubmissions.includes(submissionId)) {
      errors.push('Judge is not assigned to score this submission');
      return { isValid: false, errors, warnings };
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates score update (for existing scores)
 */
export function validateScoreUpdate(
  existingScore: JudgeScore,
  newScore: Partial<JudgeScore>,
  allowUpdates: boolean = true
): ScoreValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if updates are allowed
  if (!allowUpdates) {
    errors.push('Score updates are not allowed for this hackathon');
    return { isValid: false, errors, warnings };
  }
  
  // Check if trying to change immutable fields
  if (newScore.judge_id && newScore.judge_id !== existingScore.judge_id) {
    errors.push('Cannot change judge ID in score update');
  }
  
  if (newScore.submission_id && newScore.submission_id !== existingScore.submission_id) {
    errors.push('Cannot change submission ID in score update');
  }
  
  // Warning about updating scores
  const existingDate = new Date(existingScore.scored_at);
  const now = new Date();
  const hoursSinceScoring = (now.getTime() - existingDate.getTime()) / (1000 * 60 * 60);
  
  if (hoursSinceScoring > 24) {
    warnings.push('Updating score that was submitted more than 24 hours ago');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates batch score submission
 */
export function validateBatchScores(
  scores: Partial<JudgeScore>[],
  criteria: ScoringCriteria[],
  maxBatchSize: number = 50
): ScoreValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check batch size
  if (scores.length === 0) {
    errors.push('No scores provided');
    return { isValid: false, errors, warnings };
  }
  
  if (scores.length > maxBatchSize) {
    errors.push(`Batch size cannot exceed ${maxBatchSize} scores`);
    return { isValid: false, errors, warnings };
  }
  
  // Validate each score
  const submissionIds = new Set<string>();
  
  for (let i = 0; i < scores.length; i++) {
    const score = scores[i];
    
    // Check for duplicate submissions in batch
    if (score.submission_id) {
      if (submissionIds.has(score.submission_id)) {
        errors.push(`Duplicate submission ID in batch: ${score.submission_id}`);
      } else {
        submissionIds.add(score.submission_id);
      }
    }
    
    // Validate individual score
    const scoreValidation = validateJudgeScore(score, criteria);
    
    // Prefix errors with index for clarity
    for (const error of scoreValidation.errors) {
      errors.push(`Score ${i + 1}: ${error}`);
    }
    
    for (const warning of scoreValidation.warnings) {
      warnings.push(`Score ${i + 1}: ${warning}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Calculates normalized score (0-100 scale)
 */
export function calculateNormalizedScore(
  criteriaScores: Record<string, number>,
  criteria: ScoringCriteria[]
): number {
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  for (const criterion of criteria) {
    const score = criteriaScores[criterion.id];
    if (score !== undefined) {
      // Normalize score to 0-1 range
      const normalizedScore = (score - criterion.min_score) / (criterion.max_score - criterion.min_score);
      totalWeightedScore += normalizedScore * criterion.weight;
      totalWeight += criterion.weight;
    }
  }
  
  if (totalWeight === 0) {
    return 0;
  }
  
  // Return score on 0-100 scale
  return (totalWeightedScore / totalWeight) * 100;
}

/**
 * Rounds score to specified decimal places
 */
export function roundScore(score: number, decimalPlaces: number = 2): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(score * factor) / factor;
}