/**
 * mentorGalleryApi - API functions for fetching mentors with filters
 * Implements Task 5.1: Mentor Gallery interface for main website
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7
 */

// ─── Types ────────────────────────────────────────────────────────────────────

/** Requirement 6.4: Three availability states */
export type MentorAvailabilityStatus = 'available' | 'in_session' | 'offline'

export interface GalleryMentor {
  id: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  skills: string[]
  mentored_hours: number
  mentor_rating: number
  availability_status: MentorAvailabilityStatus
  max_concurrent_teams: number
  booking_url: string | null
  active_sessions: number
  total_sessions: number
}

export interface MentorGalleryFilters {
  /** Requirement 6.2: Filter by skill */
  skill?: string
  /** Requirement 6.3: Filter by availability status */
  availability?: MentorAvailabilityStatus | 'all'
  search?: string
  hackathon_id?: number
}

export interface MentorshipRequestPayload {
  mentor_id: string
  problem_description: string
  requested_time?: string
  duration_minutes: number
  session_type: 'general' | 'technical' | 'design' | 'business' | 'presentation'
  /** Requirement 6.7: Team integration */
  team_id?: number
  hackathon_id?: number
}

export interface MentorshipRequestResult {
  success: boolean
  session_id?: number
  error?: string
}

// ─── API Base ─────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.PROD
  ? 'https://maximally.in/.netlify/functions'
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
 * Fetch all active mentors, optionally filtered.
 * Requirement 6.1: Display all mentors with active status
 * Requirement 6.2: Filter by skills
 * Requirement 6.3: Filter by availability
 */
export async function fetchMentors(filters: MentorGalleryFilters = {}): Promise<GalleryMentor[]> {
  const params = new URLSearchParams()

  if (filters.skill) params.set('skill', filters.skill)
  if (filters.availability && filters.availability !== 'all') {
    params.set('availability', filters.availability)
  }
  if (filters.search) params.set('search', filters.search)
  if (filters.hackathon_id) params.set('hackathon_id', String(filters.hackathon_id))

  const query = params.toString()
  const data = await apiFetch<{ mentors: GalleryMentor[] }>(
    `/api/mentors${query ? `?${query}` : ''}`
  )
  return data.mentors ?? []
}

/**
 * Fetch a single mentor's gallery profile.
 * Requirement 6.5: Mentor card data
 */
export async function fetchMentor(mentorId: string): Promise<GalleryMentor | null> {
  try {
    const raw = await apiFetch<{ success?: boolean; mentor?: Record<string, unknown> }>(
      `/api/mentors/${mentorId}`
    )
    const m = raw.mentor
    if (!m || !m.id) return null
    const name = (m.full_name ?? m.name) as string | null
    const status = (m.availability_status ?? m.status ?? 'offline') as GalleryMentor['availability_status']
    return {
      id: String(m.id),
      full_name: name,
      username: (m.username as string) ?? null,
      avatar_url: (m.avatar_url as string) ?? null,
      bio: (m.bio as string) ?? null,
      location: (m.location as string) ?? null,
      skills: (m.skills as string[]) ?? [],
      mentored_hours: Number(m.mentored_hours ?? m.total_mentorship_hours ?? 0),
      mentor_rating: Number(m.mentor_rating ?? 0),
      availability_status: status,
      max_concurrent_teams: Number(m.max_concurrent_teams ?? 3),
      booking_url: (m.booking_url as string) ?? null,
      active_sessions: Number(m.active_sessions ?? 0),
      total_sessions: Number(m.total_sessions ?? 0),
    }
  } catch {
    return null
  }
}

/**
 * Submit a "Request Help" mentorship session.
 * Requirement 6.6: Request Help button
 * Requirement 6.7: Team integration
 */
export async function requestMentorHelp(
  payload: MentorshipRequestPayload,
  authToken?: string
): Promise<MentorshipRequestResult> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`

    const data = await apiFetch<{ session_id: number }>('/api/mentorship/request', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })
    return { success: true, session_id: data.session_id }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to send request',
    }
  }
}

/**
 * Get all unique skills across active mentors (for filter dropdown).
 * Requirement 6.2: Skill filter controls
 */
export async function fetchMentorSkills(): Promise<string[]> {
  try {
    const data = await apiFetch<{ skills: string[] }>('/api/mentors/skills')
    return data.skills ?? []
  } catch {
    // Fallback: derive from full mentor list
    const mentors = await fetchMentors()
    const set = new Set<string>()
    mentors.forEach(m => m.skills.forEach(s => set.add(s)))
    return Array.from(set).sort()
  }
}
