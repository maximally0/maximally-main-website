/**
 * MentorService - Enhanced mentor-specific functionality (Main Website)
 * Implements Task 3.2: Mentor-specific profile features
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7
 */

import { profileManager } from './profileManager'

// ─── Types and Interfaces ────────────────────────────────────────────────────

export interface AvailabilitySlot {
  id?: number
  day_of_week: number // 0-6 (Sunday-Saturday)
  start_time: string // HH:MM format
  end_time: string // HH:MM format
  timezone: string
  slot_type: 'regular' | 'emergency' | 'workshop' | 'office_hours'
  max_sessions: number
  is_active: boolean
}

export interface MentorshipSession {
  id: number
  mentor_id: string
  mentee_id: string
  hackathon_id?: number
  team_id?: number
  problem_description: string
  requested_time?: string
  scheduled_time?: string
  duration_minutes: number
  session_type: 'general' | 'technical' | 'design' | 'business' | 'presentation'
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled' | 'no_show'
  mentor_notes?: string
  mentee_feedback?: string
  rating?: number
  created_at: string
  updated_at: string
}

export interface MentorStats {
  total_hours: number
  total_sessions: number
  average_rating: number
  active_sessions: number
  completed_sessions: number
  availability_status: 'available' | 'in_session' | 'offline'
}

export interface SkillValidationResult {
  isValid: boolean
  errors: string[]
  suggestions?: string[]
}

// ─── MentorService Class ─────────────────────────────────────────────────────

export class MentorService {
  private static instance: MentorService
  private apiBaseUrl: string

  private constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_URL || '/api'
  }

  static getInstance(): MentorService {
    if (!MentorService.instance) {
      MentorService.instance = new MentorService()
    }
    return MentorService.instance
  }

  // ─── Skills Management ─────────────────────────────────────────────────────

  /**
   * Validates mentor skills array
   * Requirements: 2.2 - Skills validation as array of strings
   */
  validateSkills(skills: string[]): SkillValidationResult {
    const errors: string[] = []
    const suggestions: string[] = []

    // Basic validation
    if (!Array.isArray(skills)) {
      errors.push('Skills must be an array')
      return { isValid: false, errors }
    }

    if (skills.length === 0) {
      errors.push('At least one skill is required')
      return { isValid: false, errors }
    }

    if (skills.length > 20) {
      errors.push('Maximum 20 skills allowed')
    }

    // Validate each skill
    skills.forEach((skill, index) => {
      if (typeof skill !== 'string') {
        errors.push(`Skill at index ${index} must be a string`)
      } else if (skill.trim().length === 0) {
        errors.push(`Skill at index ${index} cannot be empty`)
      } else if (skill.length > 50) {
        errors.push(`Skill at index ${index} must be 50 characters or less`)
      }
    })

    // Check for duplicates
    const uniqueSkills = new Set(skills.map(s => s.toLowerCase().trim()))
    if (uniqueSkills.size !== skills.length) {
      errors.push('Duplicate skills are not allowed')
    }

    // Provide suggestions for common skills
    const commonSkills = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
      'UI/UX Design', 'Product Management', 'Data Science', 'Machine Learning',
      'DevOps', 'Cloud Computing', 'Mobile Development', 'Backend Development',
      'Frontend Development', 'Full Stack Development'
    ]

    skills.forEach(skill => {
      const normalizedSkill = skill.toLowerCase().trim()
      const suggestion = commonSkills.find(common => 
        common.toLowerCase().includes(normalizedSkill) || 
        normalizedSkill.includes(common.toLowerCase())
      )
      if (suggestion && !suggestions.includes(suggestion)) {
        suggestions.push(suggestion)
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    }
  }

  /**
   * Updates mentor skills with validation
   * Requirements: 2.1, 2.2, 2.5 - Skills management and validation
   */
  async updateMentorSkills(mentorId: string, skills: string[]): Promise<{
    success: boolean
    error?: string
    validation?: SkillValidationResult
  }> {
    try {
      // Validate skills first
      const validation = this.validateSkills(skills)
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', '),
          validation
        }
      }

      // Normalize skills (trim and proper case)
      const normalizedSkills = skills.map(skill => skill.trim())

      // Update profile
      const result = await profileManager.updateProfile(mentorId, {
        skills: normalizedSkills
      })

      return {
        success: result.success,
        error: result.error,
        validation
      }
    } catch (error) {
      console.error('[MentorService] Error updating skills:', error)
      return {
        success: false,
        error: 'Failed to update skills'
      }
    }
  }

  // ─── Availability Management ───────────────────────────────────────────────

  /**
   * Validates availability slot
   * Requirements: 2.3 - Availability slots validation
   */
  validateAvailabilitySlot(slot: AvailabilitySlot): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate day of week
    if (slot.day_of_week < 0 || slot.day_of_week > 6) {
      errors.push('Day of week must be between 0 (Sunday) and 6 (Saturday)')
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(slot.start_time)) {
      errors.push('Start time must be in HH:MM format')
    }
    if (!timeRegex.test(slot.end_time)) {
      errors.push('End time must be in HH:MM format')
    }

    // Validate time order
    if (slot.start_time >= slot.end_time) {
      errors.push('End time must be after start time')
    }

    // Validate timezone
    if (!slot.timezone || slot.timezone.trim().length === 0) {
      errors.push('Timezone is required')
    }

    // Validate slot type
    const validTypes = ['regular', 'emergency', 'workshop', 'office_hours']
    if (!validTypes.includes(slot.slot_type)) {
      errors.push('Invalid slot type')
    }

    // Validate max sessions
    if (slot.max_sessions < 1 || slot.max_sessions > 10) {
      errors.push('Max sessions must be between 1 and 10')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Gets mentor availability slots
   * Requirements: 2.1 - Availability slots management
   */
  async getMentorAvailability(mentorId: string): Promise<AvailabilitySlot[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/mentors/${mentorId}/availability`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        console.error('[MentorService] Error fetching availability:', response.statusText)
        return []
      }

      const data = await response.json()
      return data.availability || []
    } catch (error) {
      console.error('[MentorService] Error in getMentorAvailability:', error)
      return []
    }
  }

  /**
   * Updates mentor availability slots
   * Requirements: 2.1, 2.3, 2.5 - Availability management
   */
  async updateMentorAvailability(mentorId: string, slots: AvailabilitySlot[]): Promise<{
    success: boolean
    error?: string
    validationErrors?: string[]
  }> {
    try {
      // Validate all slots
      const validationErrors: string[] = []
      slots.forEach((slot, index) => {
        const validation = this.validateAvailabilitySlot(slot)
        if (!validation.isValid) {
          validationErrors.push(`Slot ${index + 1}: ${validation.errors.join(', ')}`)
        }
      })

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: 'Validation failed',
          validationErrors
        }
      }

      // Update availability
      const response = await fetch(`${this.apiBaseUrl}/mentors/${mentorId}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ availability: slots })
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.error || 'Failed to update availability'
        }
      }

      return { success: true }
    } catch (error) {
      console.error('[MentorService] Error updating availability:', error)
      return {
        success: false,
        error: 'Failed to update availability'
      }
    }
  }

  // ─── Session and Hours Management ──────────────────────────────────────────

  /**
   * Gets mentor statistics including hours and ratings
   * Requirements: 2.6 - Track total mentored hours
   */
  async getMentorStats(mentorId: string): Promise<MentorStats | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/mentors/${mentorId}/stats`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        console.error('[MentorService] Error fetching stats:', response.statusText)
        return null
      }

      const data = await response.json()
      return data.stats
    } catch (error) {
      console.error('[MentorService] Error in getMentorStats:', error)
      return null
    }
  }

  /**
   * Calculates mentor hours from completed sessions
   * Requirements: 2.6 - Mentored hours calculation
   */
  async calculateMentorHours(mentorId: string): Promise<number> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/mentors/${mentorId}/sessions?status=completed`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        console.error('[MentorService] Error fetching sessions:', response.statusText)
        return 0
      }

      const data = await response.json()
      const sessions: MentorshipSession[] = data.sessions || []
      
      return sessions.reduce((total, session) => {
        return total + (session.duration_minutes || 30)
      }, 0)
    } catch (error) {
      console.error('[MentorService] Error calculating hours:', error)
      return 0
    }
  }

  /**
   * Gets mentor's active sessions count
   * Requirements: 2.4 - Max concurrent teams tracking
   */
  async getActiveSessions(mentorId: string): Promise<number> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/mentors/${mentorId}/sessions?status=active`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        console.error('[MentorService] Error fetching active sessions:', response.statusText)
        return 0
      }

      const data = await response.json()
      return data.sessions?.length || 0
    } catch (error) {
      console.error('[MentorService] Error getting active sessions:', error)
      return 0
    }
  }

  // ─── Rating System ─────────────────────────────────────────────────────────

  /**
   * Calculates mentor rating from session feedback
   * Requirements: 2.6 - Mentor rating system
   */
  async calculateMentorRating(mentorId: string): Promise<number> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/mentors/${mentorId}/sessions?with_ratings=true`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        console.error('[MentorService] Error fetching rated sessions:', response.statusText)
        return 0.0
      }

      const data = await response.json()
      const sessions: MentorshipSession[] = data.sessions || []
      
      const ratedSessions = sessions.filter(session => session.rating && session.rating > 0)
      
      if (ratedSessions.length === 0) {
        return 0.0
      }

      const totalRating = ratedSessions.reduce((sum, session) => sum + (session.rating || 0), 0)
      return Math.round((totalRating / ratedSessions.length) * 100) / 100 // Round to 2 decimal places
    } catch (error) {
      console.error('[MentorService] Error calculating rating:', error)
      return 0.0
    }
  }

  /**
   * Updates mentor rating in profile
   * Requirements: 2.6 - Mentor rating system
   */
  async updateMentorRating(mentorId: string): Promise<{ success: boolean; rating?: number; error?: string }> {
    try {
      const rating = await this.calculateMentorRating(mentorId)
      
      const result = await profileManager.updateProfile(mentorId, {
        mentor_rating: rating
      } as any)

      return {
        success: result.success,
        rating: rating,
        error: result.error
      }
    } catch (error) {
      console.error('[MentorService] Error updating rating:', error)
      return {
        success: false,
        error: 'Failed to update rating'
      }
    }
  }

  // ─── Booking URL Validation ────────────────────────────────────────────────

  /**
   * Enhanced booking URL validation
   * Requirements: 2.7 - Booking URL validation
   */
  validateBookingUrl(url: string): { isValid: boolean; error?: string; suggestions?: string[] } {
    if (!url || url.trim().length === 0) {
      return { isValid: true } // Optional field
    }

    const trimmedUrl = url.trim()

    // Basic URL format validation
    try {
      const urlObj = new URL(trimmedUrl)
      
      // Must be HTTP or HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return {
          isValid: false,
          error: 'URL must use HTTP or HTTPS protocol'
        }
      }

      // Check for common booking platforms
      const bookingPlatforms = [
        'calendly.com',
        'cal.com',
        'acuityscheduling.com',
        'bookingpage.com',
        'youcanbook.me',
        'setmore.com',
        'simplybook.me'
      ]

      const suggestions: string[] = []
      const hostname = urlObj.hostname.toLowerCase()
      
      // Suggest if it looks like a booking URL but not from known platforms
      if (!bookingPlatforms.some(platform => hostname.includes(platform))) {
        suggestions.push('Consider using a dedicated booking platform like Calendly or Cal.com')
      }

      return {
        isValid: true,
        suggestions: suggestions.length > 0 ? suggestions : undefined
      }
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid URL format'
      }
    }
  }

  /**
   * Updates mentor booking URL with validation
   * Requirements: 2.7 - Booking URL validation
   */
  async updateBookingUrl(mentorId: string, bookingUrl: string): Promise<{
    success: boolean
    error?: string
    suggestions?: string[]
  }> {
    try {
      // Validate URL
      const validation = this.validateBookingUrl(bookingUrl)
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
          suggestions: validation.suggestions
        }
      }

      // Update profile
      const result = await profileManager.updateProfile(mentorId, {
        booking_url: bookingUrl.trim() || null
      })

      return {
        success: result.success,
        error: result.error,
        suggestions: validation.suggestions
      }
    } catch (error) {
      console.error('[MentorService] Error updating booking URL:', error)
      return {
        success: false,
        error: 'Failed to update booking URL'
      }
    }
  }

  // ─── Status Management ─────────────────────────────────────────────────────

  /**
   * Gets mentor availability status based on active sessions
   * Requirements: 2.4 - Max concurrent teams tracking
   */
  async getMentorStatus(mentorId: string): Promise<'available' | 'in_session' | 'offline'> {
    try {
      const profile = await profileManager.getMentorProfile(mentorId)
      if (!profile || (profile as any).active === false) {
        return 'offline'
      }

      const activeSessions = await this.getActiveSessions(mentorId)
      const maxTeams = profile.max_concurrent_teams || 3

      if (activeSessions >= maxTeams) {
        return 'in_session'
      }

      return 'available'
    } catch (error) {
      console.error('[MentorService] Error getting mentor status:', error)
      return 'offline'
    }
  }

  // ─── Utility Methods ───────────────────────────────────────────────────────

  private async getAuthToken(): Promise<string> {
    // This would integrate with your auth system
    // For now, return empty string - will be implemented with actual auth
    return ''
  }

  /**
   * Formats time for display
   */
  formatTime(time: string): string {
    try {
      const [hours, minutes] = time.split(':')
      const hour = parseInt(hours, 10)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    } catch (error) {
      return time
    }
  }

  /**
   * Gets day name from day of week number
   */
  getDayName(dayOfWeek: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayOfWeek] || 'Unknown'
  }
}

// ─── Export Singleton Instance ───────────────────────────────────────────────

export const mentorService = MentorService.getInstance()