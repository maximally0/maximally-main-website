/**
 * evaluationApi - API functions for the Judge Evaluation Form
 * Implements Task 6.2: Project evaluation interface
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7
 */

// ─── Types (mirrored from admin-panel/src/types/profile.ts) ──────────────────

/** Requirement 8.2: Evaluation rubric criterion */
export interface JudgeEvaluationCriteria {
  id: number
  hackathon_id: number
  name: string
  description?: string | null
  weight: number
  max_score: number
  display_order: number
  is_active: boolean
  created_at: string
}

/** Requirement 8.1, 8.5, 8.6: Judge submission evaluation record */
export interface JudgeSubmissionEvaluation {
  id: number
  judge_id: string
  submission_id: number
  hackathon_id: number
  /** Requirement 8.2: Per-criterion scores keyed by criterion id */
  criteria_scores: Record<string, number>
  /** Requirement 8.3: Weighted total score */
  total_score?: number | null
  /** Requirement 8.4: Private comments for organizers */
  comments_for_organizers?: string | null
  /** Requirement 8.4: Comments shared with participants after event */
  comments_for_participants?: string | null
  /** Requirement 8.5/8.6: not_started | in_progress | submitted */
  status: 'not_started' | 'in_progress' | 'submitted'
  created_at: string
  updated_at: string
  submitted_at?: string | null
}

// ─── Request / Response Types ─────────────────────────────────────────────────

export interface SaveEvaluationPayload {
  judge_id: string
  submission_id: number
  hackathon_id: number
  criteria_scores: Record<string, number>
  comments_for_organizers?: string
  comments_for_participants?: string
  /** 'draft' saves progress; 'submitted' locks the evaluation */
  status: 'in_progress' | 'submitted'
}

export interface SaveEvaluationResult {
  success: boolean
  evaluation?: JudgeSubmissionEvaluation
  error?: string
}

// ─── API Base ─────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.PROD
  ? 'https://maximally.org/.netlify/functions'
  : 'http://localhost:5002'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any).error || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Fetch evaluation rubric criteria for a hackathon.
 * Requirement 8.2: Evaluation rubric with multiple criteria
 */
export async function fetchEvaluationCriteria(
  hackathonId: number,
  authToken?: string
): Promise<JudgeEvaluationCriteria[]> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  try {
    const data = await apiFetch<{ criteria: JudgeEvaluationCriteria[] }>(
      `/api/evaluations/rubric/${hackathonId}`,
      { headers }
    )
    return data.criteria ?? []
  } catch {
    return []
  }
}

/**
 * Fetch an existing evaluation for a judge + submission pair.
 * Requirement 8.1: Private evaluation visible only to the assigned judge
 * Requirement 8.5: Load saved draft progress
 */
export async function fetchEvaluation(
  judgeId: string,
  submissionId: number,
  authToken?: string
): Promise<JudgeSubmissionEvaluation | null> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  try {
    const data = await apiFetch<{ evaluation: JudgeSubmissionEvaluation | null }>(
      `/api/evaluations/${judgeId}/${submissionId}`,
      { headers }
    )
    return data.evaluation ?? null
  } catch {
    return null
  }
}

/**
 * Save evaluation as a draft (in_progress).
 * Requirement 8.5: Draft saving — judge can save progress without submitting
 * Requirement 10.3: Sets traffic light to yellow (in_progress)
 */
export async function saveEvaluationDraft(
  data: Omit<SaveEvaluationPayload, 'status'>,
  authToken?: string
): Promise<SaveEvaluationResult> {
  return _saveEvaluation({ ...data, status: 'in_progress' }, authToken)
}

/**
 * Submit final evaluation (locks it).
 * Requirement 8.6: Final submission — locks evaluation, changes status to 'submitted'
 * Requirement 10.3: Sets traffic light to green (submitted)
 */
export async function submitEvaluation(
  data: Omit<SaveEvaluationPayload, 'status'>,
  authToken?: string
): Promise<SaveEvaluationResult> {
  return _saveEvaluation({ ...data, status: 'submitted' }, authToken)
}

async function _saveEvaluation(
  payload: SaveEvaluationPayload,
  authToken?: string
): Promise<SaveEvaluationResult> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  try {
    const data = await apiFetch<{ evaluation: JudgeSubmissionEvaluation }>(
      `/api/evaluations/${payload.judge_id}/${payload.submission_id}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          hackathon_id: payload.hackathon_id,
          criteria_scores: payload.criteria_scores,
          comments_for_organizers: payload.comments_for_organizers,
          comments_for_participants: payload.comments_for_participants,
          status: payload.status,
        }),
      }
    )
    return { success: true, evaluation: data.evaluation }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to save evaluation',
    }
  }
}

// ─── Score Calculation Helpers ────────────────────────────────────────────────

/**
 * Calculate weighted total score from criteria scores.
 * Requirement 8.3: Total score auto-calculated from weighted criteria scores
 */
export function calculateWeightedScore(
  criteriaScores: Record<string, number>,
  criteria: JudgeEvaluationCriteria[]
): number {
  const activeCriteria = criteria.filter(c => c.is_active)
  if (activeCriteria.length === 0) return 0

  const totalWeight = activeCriteria.reduce((sum, c) => sum + c.weight, 0)
  if (totalWeight === 0) return 0

  const weightedSum = activeCriteria.reduce((sum, c) => {
    const score = criteriaScores[String(c.id)] ?? 0
    return sum + score * c.weight
  }, 0)

  // Normalise to 0–10 scale
  const maxWeightedSum = activeCriteria.reduce((sum, c) => sum + c.max_score * c.weight, 0)
  if (maxWeightedSum === 0) return 0

  return Math.round((weightedSum / maxWeightedSum) * 10 * 100) / 100
}
