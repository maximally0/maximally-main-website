/**
 * judgePortalApi - API functions for the Judge Evaluation Portal
 * Implements Task 6.1: Judge Portal dashboard with project queue
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6
 */

// ─── Types ────────────────────────────────────────────────────────────────────

/** Requirement 10.3: Traffic light status values */
export type EvaluationStatus = 'not_started' | 'in_progress' | 'submitted'

/** Requirement 10.2: Project queue item with all assigned submission data */
export interface SubmissionQueueItem {
  submission_id: number
  hackathon_id: number
  team_name: string
  project_title: string
  project_description: string
  submission_url?: string
  evaluation_status: EvaluationStatus
  total_score?: number | null
  evaluation_id?: number | null
  submitted_at?: string | null
}

export interface JudgeHackathonAssignment {
  id: number
  judge_id: string
  hackathon_id: number
  hackathon_name: string
  assigned_category?: string | null
  status: 'active' | 'inactive' | 'completed'
  assigned_at: string
  start_date?: string | null
  end_date?: string | null
}

/** Requirement 10.4: Progress display data */
export interface JudgeProgressStats {
  total_assigned: number
  total_completed: number
  total_in_progress: number
  total_not_started: number
  completion_percentage: number
}

export interface JudgePortalData {
  assignments: JudgeHackathonAssignment[]
  queue: SubmissionQueueItem[]
  stats: JudgeProgressStats
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
 * Fetch all hackathon assignments for a judge.
 * Requirement 10.5: Judge-specific navigation data
 */
export async function fetchJudgeAssignments(
  judgeId: string,
  authToken?: string
): Promise<JudgeHackathonAssignment[]> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  try {
    const data = await apiFetch<{ assignments: JudgeHackathonAssignment[] }>(
      `/api/judges/${judgeId}/assignments`,
      { headers }
    )
    return data.assignments ?? []
  } catch {
    return []
  }
}

/**
 * Fetch the full submission queue for a judge with evaluation status.
 * Requirement 10.2: Project queue showing all assigned submissions
 * Requirement 10.3: Traffic light status per submission
 */
export async function fetchJudgeQueue(
  judgeId: string,
  hackathonId?: number,
  authToken?: string
): Promise<SubmissionQueueItem[]> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  const params = new URLSearchParams()
  if (hackathonId) params.set('hackathon_id', String(hackathonId))

  const query = params.toString()
  try {
    const data = await apiFetch<{ queue: SubmissionQueueItem[] }>(
      `/api/judges/${judgeId}/queue${query ? `?${query}` : ''}`,
      { headers }
    )
    return data.queue ?? []
  } catch {
    return []
  }
}

/**
 * Fetch judge progress statistics.
 * Requirement 10.4: Progress display (X of Y evaluated, completion percentage)
 */
export async function fetchJudgeStats(
  judgeId: string,
  hackathonId?: number,
  authToken?: string
): Promise<JudgeProgressStats> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  const params = new URLSearchParams()
  if (hackathonId) params.set('hackathon_id', String(hackathonId))

  const query = params.toString()
  try {
    const data = await apiFetch<{ stats: JudgeProgressStats }>(
      `/api/judges/${judgeId}/stats${query ? `?${query}` : ''}`,
      { headers }
    )
    return (
      data.stats ?? {
        total_assigned: 0,
        total_completed: 0,
        total_in_progress: 0,
        total_not_started: 0,
        completion_percentage: 0,
      }
    )
  } catch {
    return {
      total_assigned: 0,
      total_completed: 0,
      total_in_progress: 0,
      total_not_started: 0,
      completion_percentage: 0,
    }
  }
}

/**
 * Fetch all portal data in one call (assignments + queue + stats).
 * Convenience wrapper used by the JudgePortal dashboard.
 */
export async function fetchJudgePortalData(
  judgeId: string,
  hackathonId?: number,
  authToken?: string
): Promise<JudgePortalData> {
  const [assignments, queue, stats] = await Promise.all([
    fetchJudgeAssignments(judgeId, authToken),
    fetchJudgeQueue(judgeId, hackathonId, authToken),
    fetchJudgeStats(judgeId, hackathonId, authToken),
  ])
  return { assignments, queue, stats }
}

// ─── Traffic Light Helpers ────────────────────────────────────────────────────

/**
 * Requirement 10.3: Map evaluation status to traffic light colour.
 * red = not_started, yellow = in_progress, green = submitted
 */
export function getTrafficLightColor(status: EvaluationStatus): 'red' | 'yellow' | 'green' {
  switch (status) {
    case 'submitted':
      return 'green'
    case 'in_progress':
      return 'yellow'
    case 'not_started':
    default:
      return 'red'
  }
}

export function getStatusLabel(status: EvaluationStatus): string {
  switch (status) {
    case 'submitted':
      return 'Submitted'
    case 'in_progress':
      return 'In Progress'
    case 'not_started':
    default:
      return 'Not Started'
  }
}
