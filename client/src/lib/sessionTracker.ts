/**
 * sessionTracker.ts - Core session lifecycle management
 * Implements Task 5.2: Mentorship session tracking system
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6
 */

// ─── Types ────────────────────────────────────────────────────────────────────

/** Requirement 9.1: Full session lifecycle states */
export type SessionStatus =
  | 'pending'
  | 'accepted'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'no_show'

export type SessionType = 'general' | 'technical' | 'design' | 'business' | 'presentation'

export interface MentorshipSession {
  id: number
  mentor_id: string
  mentee_id: string
  hackathon_id?: number | null
  team_id?: number | null
  problem_description: string
  requested_time?: string | null
  scheduled_time?: string | null
  /** Requirement 9.3: Duration tracking */
  started_at?: string | null
  ended_at?: string | null
  duration_minutes: number
  session_type: SessionType
  /** Requirement 9.1: Status lifecycle */
  status: SessionStatus
  mentor_notes?: string | null
  mentee_feedback?: string | null
  /** Requirement 9.5: 1-5 star rating */
  rating?: number | null
  notification_sent_at?: string | null
  created_at: string
  updated_at: string
  // Joined data
  mentor?: { full_name: string | null; username: string | null; avatar_url: string | null }
  mentee?: { full_name: string | null; username: string | null; avatar_url: string | null }
}

export interface SessionCreateData {
  mentor_id: string
  mentee_id: string
  problem_description: string
  session_type?: SessionType
  duration_minutes?: number
  requested_time?: string
  hackathon_id?: number
  team_id?: number
}

export interface SessionUpdateData {
  status?: SessionStatus
  mentor_notes?: string
  mentee_feedback?: string
  rating?: number
  duration_minutes?: number
  started_at?: string
  ended_at?: string
}

export interface SessionRatingData {
  rating: number // 1-5
  mentee_feedback?: string
}

/** Requirement 9.6: Session analytics */
export interface SessionAnalytics {
  total_sessions: number
  completed_sessions: number
  cancelled_sessions: number
  total_hours: number
  average_duration_minutes: number
  average_rating: number
  sessions_by_type: Record<SessionType, number>
  sessions_by_status: Record<SessionStatus, number>
}

export interface StatusTransitionResult {
  success: boolean
  error?: string
  session?: MentorshipSession
}

// ─── Valid Transitions ────────────────────────────────────────────────────────

/**
 * Requirement 9.1: Allowed status transitions
 * pending → accepted | rejected | cancelled
 * accepted → active | cancelled
 * active → completed | cancelled | no_show
 */
const VALID_TRANSITIONS: Record<SessionStatus, SessionStatus[]> = {
  pending: ['accepted', 'rejected', 'cancelled'],
  accepted: ['active', 'cancelled'],
  active: ['completed', 'cancelled', 'no_show'],
  completed: [],
  cancelled: [],
  rejected: [],
  no_show: [],
}

// ─── SessionTracker Class ─────────────────────────────────────────────────────

export class SessionTracker {
  private static instance: SessionTracker
  private apiBase: string

  private constructor() {
    this.apiBase = import.meta.env.PROD
      ? 'https://maximally.in/.netlify/functions'
      : 'http://localhost:5002'
  }

  static getInstance(): SessionTracker {
    if (!SessionTracker.instance) {
      SessionTracker.instance = new SessionTracker()
    }
    return SessionTracker.instance
  }

  // ─── Lifecycle Validation ─────────────────────────────────────────────────

  /**
   * Requirement 9.1: Validate status transition
   */
  isValidTransition(from: SessionStatus, to: SessionStatus): boolean {
    return VALID_TRANSITIONS[from]?.includes(to) ?? false
  }

  /**
   * Requirement 9.1: Get allowed next statuses from current status
   */
  getAllowedTransitions(current: SessionStatus): SessionStatus[] {
    return VALID_TRANSITIONS[current] ?? []
  }

  // ─── Duration Tracking ────────────────────────────────────────────────────

  /**
   * Requirement 9.3: Calculate session duration in minutes from timestamps
   */
  calculateDuration(startedAt: string, endedAt: string): number {
    const start = new Date(startedAt).getTime()
    const end = new Date(endedAt).getTime()
    if (isNaN(start) || isNaN(end) || end <= start) return 0
    return Math.round((end - start) / 60_000)
  }

  /**
   * Requirement 9.3: Get elapsed minutes for an active session
   */
  getElapsedMinutes(startedAt: string): number {
    const start = new Date(startedAt).getTime()
    if (isNaN(start)) return 0
    return Math.floor((Date.now() - start) / 60_000)
  }

  // ─── Hours Calculation ────────────────────────────────────────────────────

  /**
   * Requirement 9.4: Calculate total mentor hours from completed sessions
   * Property 7: mentor.mentoredHours = Σ(session.duration | completed sessions)
   */
  calculateTotalHours(sessions: MentorshipSession[]): number {
    const totalMinutes = sessions
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + (s.duration_minutes ?? 0), 0)
    return Math.round((totalMinutes / 60) * 100) / 100
  }

  /**
   * Requirement 9.4: Calculate total minutes from completed sessions
   */
  calculateTotalMinutes(sessions: MentorshipSession[]): number {
    return sessions
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + (s.duration_minutes ?? 0), 0)
  }

  // ─── Rating Validation ────────────────────────────────────────────────────

  /**
   * Requirement 9.5: Validate rating is 1-5 integer
   */
  validateRating(rating: number): { isValid: boolean; error?: string } {
    if (!Number.isInteger(rating)) {
      return { isValid: false, error: 'Rating must be a whole number' }
    }
    if (rating < 1 || rating > 5) {
      return { isValid: false, error: 'Rating must be between 1 and 5' }
    }
    return { isValid: true }
  }

  /**
   * Requirement 9.5: Calculate average rating from rated sessions
   */
  calculateAverageRating(sessions: MentorshipSession[]): number {
    const rated = sessions.filter(s => s.rating != null && s.rating > 0)
    if (rated.length === 0) return 0
    const sum = rated.reduce((acc, s) => acc + (s.rating ?? 0), 0)
    return Math.round((sum / rated.length) * 100) / 100
  }

  // ─── Analytics ────────────────────────────────────────────────────────────

  /**
   * Requirement 9.6: Build session analytics from a list of sessions
   */
  buildAnalytics(sessions: MentorshipSession[]): SessionAnalytics {
    const completed = sessions.filter(s => s.status === 'completed')
    const totalMinutes = this.calculateTotalMinutes(sessions)

    const byType = {} as Record<SessionType, number>
    const byStatus = {} as Record<SessionStatus, number>

    for (const s of sessions) {
      byType[s.session_type] = (byType[s.session_type] ?? 0) + 1
      byStatus[s.status] = (byStatus[s.status] ?? 0) + 1
    }

    return {
      total_sessions: sessions.length,
      completed_sessions: completed.length,
      cancelled_sessions: sessions.filter(s => s.status === 'cancelled').length,
      total_hours: this.calculateTotalHours(sessions),
      average_duration_minutes:
        completed.length > 0 ? Math.round(totalMinutes / completed.length) : 0,
      average_rating: this.calculateAverageRating(sessions),
      sessions_by_type: byType,
      sessions_by_status: byStatus,
    }
  }

  // ─── API Methods ──────────────────────────────────────────────────────────

  private async apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${this.apiBase}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error((err as any).error || `Request failed: ${res.status}`)
    }
    return res.json() as Promise<T>
  }

  /**
   * Requirement 9.3: Create a new session record
   */
  async createSession(data: SessionCreateData, authToken?: string): Promise<MentorshipSession> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`

    const result = await this.apiFetch<{ session: MentorshipSession }>('/api/mentorship/sessions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...data,
        session_type: data.session_type ?? 'general',
        duration_minutes: data.duration_minutes ?? 30,
        status: 'pending',
      }),
    })
    return result.session
  }

  /**
   * Requirement 9.2: Update session status with lifecycle validation
   */
  async updateSessionStatus(
    sessionId: number,
    newStatus: SessionStatus,
    currentStatus: SessionStatus,
    extra?: Pick<SessionUpdateData, 'mentor_notes' | 'duration_minutes' | 'started_at' | 'ended_at'>,
    authToken?: string
  ): Promise<StatusTransitionResult> {
    if (!this.isValidTransition(currentStatus, newStatus)) {
      return {
        success: false,
        error: `Cannot transition from "${currentStatus}" to "${newStatus}"`,
      }
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`

    // Auto-set timestamps for active/completed transitions
    const body: SessionUpdateData = { status: newStatus, ...extra }
    if (newStatus === 'active' && !body.started_at) {
      body.started_at = new Date().toISOString()
    }
    if (newStatus === 'completed' && !body.ended_at) {
      body.ended_at = new Date().toISOString()
    }

    try {
      const result = await this.apiFetch<{ session: MentorshipSession }>(
        `/api/mentorship/sessions/${sessionId}/status`,
        { method: 'PUT', headers, body: JSON.stringify(body) }
      )
      return { success: true, session: result.session }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update session status',
      }
    }
  }

  /**
   * Requirement 9.5: Submit post-session rating
   */
  async submitRating(
    sessionId: number,
    ratingData: SessionRatingData,
    authToken?: string
  ): Promise<{ success: boolean; error?: string }> {
    const validation = this.validateRating(ratingData.rating)
    if (!validation.isValid) {
      return { success: false, error: validation.error }
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`

    try {
      await this.apiFetch(`/api/mentorship/sessions/${sessionId}/rating`, {
        method: 'POST',
        headers,
        body: JSON.stringify(ratingData),
      })
      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to submit rating',
      }
    }
  }

  /**
   * Requirement 9.6: Fetch session history for a mentor or mentee
   */
  async getSessionHistory(
    userId: string,
    role: 'mentor' | 'mentee',
    authToken?: string
  ): Promise<MentorshipSession[]> {
    const headers: Record<string, string> = {}
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`

    try {
      const result = await this.apiFetch<{ sessions: MentorshipSession[] }>(
        `/api/mentorship/sessions?${role}_id=${userId}`,
        { headers }
      )
      return result.sessions ?? []
    } catch {
      return []
    }
  }

  /**
   * Requirement 9.4: Recalculate and persist mentor hours after session completion
   */
  async syncMentorHours(
    mentorId: string,
    authToken?: string
  ): Promise<{ success: boolean; hours?: number; error?: string }> {
    const sessions = await this.getSessionHistory(mentorId, 'mentor', authToken)
    const hours = this.calculateTotalHours(sessions)

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`

    try {
      await this.apiFetch(`/api/profiles/${mentorId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ mentored_hours: Math.floor(hours) }),
      })
      return { success: true, hours }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to sync mentor hours',
      }
    }
  }
}

// ─── Singleton Export ─────────────────────────────────────────────────────────

export const sessionTracker = SessionTracker.getInstance()
