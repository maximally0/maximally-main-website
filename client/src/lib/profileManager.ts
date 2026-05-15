/**
 * ProfileManager - Core component for role-specific profile management
 * Integrates with existing RoleManager and provides unified profile interface
 * Main website implementation with Supabase Auth integration
 */

import { getStoredSession } from './supabaseClient'

// ─── Core Interfaces ─────────────────────────────────────────────────────────

export interface BaseProfile {
  id: string
  email: string | null
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  github_username: string | null
  linkedin_username: string | null
  twitter_username: string | null
  website_url: string | null
  role: UserRole
  is_verified: boolean
  preferences: any
  created_at: string
  updated_at: string
}

export type UserRole = 'participant' | 'mentor' | 'judge' | 'organizer' | 'admin'

export interface TimeSlot {
  day: string // 'monday', 'tuesday', etc.
  start_time: string // ISO time string or HH:MM format
  end_time: string
  timezone?: string
}

export interface JudgeEvent {
  id: string
  event_name: string
  event_role: string
  event_date: string
  event_link?: string | null
  verified: boolean
}

export interface MentorProfile extends BaseProfile {
  role: 'mentor'
  skills: string[]
  availability: TimeSlot[]
  max_concurrent_teams: number
  booking_url?: string | null
  mentored_hours: number
  mentor_rating: number
  mentor_specializations: string[]
}

export interface JudgeProfile extends BaseProfile {
  role: 'judge'
  assigned_category?: string | null
  evaluation_status: number // percentage
  judge_tier: 'junior' | 'senior' | 'expert' | 'master'
  total_evaluations_completed: number
  hackathons_judged: JudgeEvent[]
}

export interface OrganizerProfile extends BaseProfile {
  role: 'organizer'
  organizer_status: 'active' | 'inactive' | 'pending' | 'suspended'
  organizer_tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | null
  events_organized: number
  total_participants_managed: number
}

export interface AdminProfile extends BaseProfile {
  role: 'admin'
  admin_role?: 'super_admin' | 'admin' | 'moderator' | 'viewer'
  admin_permissions: string[]
}

export type RoleSpecificProfile = MentorProfile | JudgeProfile | OrganizerProfile | AdminProfile

// ─── Validation Interfaces ──────────────────────────────────────────────────

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ProfileUpdateData {
  // Base profile fields
  username?: string
  full_name?: string
  bio?: string
  location?: string
  github_username?: string
  linkedin_username?: string
  twitter_username?: string
  website_url?: string
  
  // Role-specific fields
  skills?: string[]
  availability?: TimeSlot[]
  max_concurrent_teams?: number
  booking_url?: string
  mentor_specializations?: string[]
  assigned_category?: string
  judge_tier?: 'junior' | 'senior' | 'expert' | 'master'
  organizer_status?: 'active' | 'inactive' | 'pending' | 'suspended'
  organizer_tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
}

// ─── ProfileManager Class ────────────────────────────────────────────────────

export class ProfileManager {
  private static instance: ProfileManager
  private profileCache: Map<string, BaseProfile> = new Map()

  private constructor() {
    // Session is managed via localStorage (sb-session key)
  }

  static getInstance(): ProfileManager {
    if (!ProfileManager.instance) {
      ProfileManager.instance = new ProfileManager()
    }
    return ProfileManager.instance
  }

  // ─── Core Profile Management ─────────────────────────────────────────────

  /**
   * Get user profile with role-specific data
   */
  async getProfile(userId: string): Promise<BaseProfile | null> {
    try {
      // Check cache first
      if (this.profileCache.has(userId)) {
        return this.profileCache.get(userId)!
      }

      // Fetch from API
      const response = await fetch(`/api/profiles/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('[ProfileManager] Error fetching profile:', response.statusText)
        return null
      }

      const data = await response.json()

      // Cache the result
      if (data) {
        this.profileCache.set(userId, data)
      }

      return data
    } catch (error) {
      console.error('[ProfileManager] Error in getProfile:', error)
      return null
    }
  }

  /**
   * Get current user's profile
   */
  async getCurrentUserProfile(): Promise<BaseProfile | null> {
    try {
      const session = getStoredSession()
      if (!session?.access_token) {
        return null
      }
      // Decode user id from JWT
      try {
        const parts = session.access_token.split('.')
        const payload = JSON.parse(atob(parts[1]))
        if (!payload.sub) return null
        return await this.getProfile(payload.sub)
      } catch {
        return null
      }
    } catch (error) {
      console.error('[ProfileManager] Error getting current user profile:', error)
      return null
    }
  }

  /**
   * Update user profile with validation
   */
  async updateProfile(userId: string, data: ProfileUpdateData): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current profile to determine role
      const currentProfile = await this.getProfile(userId)
      if (!currentProfile) {
        return { success: false, error: 'Profile not found' }
      }

      // Validate the update data
      const validation = this.validateProfileData(currentProfile.role, data)
      if (!validation.isValid) {
        return { 
          success: false, 
          error: validation.errors.map(e => e.message).join(', ') 
        }
      }

      // Update via API
      const response = await fetch(`/api/profiles/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { success: false, error: errorData.error || 'Failed to update profile' }
      }

      // Clear cache to force refresh
      this.profileCache.delete(userId)

      return { success: true }
    } catch (error) {
      console.error('[ProfileManager] Error in updateProfile:', error)
      return { success: false, error: 'Failed to update profile' }
    }
  }

  // ─── Role-Specific Profile Methods ───────────────────────────────────────

  /**
   * Get mentor profile with mentor-specific data
   */
  async getMentorProfile(userId: string): Promise<MentorProfile | null> {
    const profile = await this.getProfile(userId)
    if (!profile || profile.role !== 'mentor') {
      return null
    }

    return {
      ...profile,
      role: 'mentor',
      skills: (profile as any).skills || [],
      availability: (profile as any).availability || [],
      max_concurrent_teams: (profile as any).max_concurrent_teams || 3,
      booking_url: (profile as any).booking_url,
      mentored_hours: (profile as any).mentored_hours || 0,
      mentor_rating: (profile as any).mentor_rating || 0.0,
      mentor_specializations: (profile as any).mentor_specializations || []
    } as MentorProfile
  }

  /**
   * Get judge profile with judge-specific data
   */
  async getJudgeProfile(userId: string): Promise<JudgeProfile | null> {
    const profile = await this.getProfile(userId)
    if (!profile || profile.role !== 'judge') {
      return null
    }

    return {
      ...profile,
      role: 'judge',
      assigned_category: (profile as any).assigned_category,
      evaluation_status: (profile as any).evaluation_status || 0,
      judge_tier: (profile as any).judge_tier || 'junior',
      total_evaluations_completed: (profile as any).total_evaluations_completed || 0,
      hackathons_judged: (profile as any).hackathons_judged || []
    } as JudgeProfile
  }

  /**
   * Get organizer profile with organizer-specific data
   */
  async getOrganizerProfile(userId: string): Promise<OrganizerProfile | null> {
    const profile = await this.getProfile(userId)
    if (!profile || profile.role !== 'organizer') {
      return null
    }

    return {
      ...profile,
      role: 'organizer',
      organizer_status: (profile as any).organizer_status || 'inactive',
      organizer_tier: (profile as any).organizer_tier,
      events_organized: (profile as any).events_organized || 0,
      total_participants_managed: (profile as any).total_participants_managed || 0
    } as OrganizerProfile
  }

  // ─── Profile Validation ──────────────────────────────────────────────────

  /**
   * Validate profile data based on role
   */
  validateProfileData(role: UserRole, data: ProfileUpdateData): ValidationResult {
    const errors: ValidationError[] = []

    // Base validation for all roles
    if (data.username && data.username.length < 3) {
      errors.push({
        field: 'username',
        message: 'Username must be at least 3 characters long',
        code: 'USERNAME_TOO_SHORT'
      })
    }

    if (data.website_url && !this.isValidUrl(data.website_url)) {
      errors.push({
        field: 'website_url',
        message: 'Website URL must be a valid HTTP/HTTPS URL',
        code: 'INVALID_URL'
      })
    }

    // Role-specific validation
    switch (role) {
      case 'mentor':
        this.validateMentorData(data, errors)
        break
      case 'judge':
        this.validateJudgeData(data, errors)
        break
      case 'organizer':
        this.validateOrganizerData(data, errors)
        break
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Validate mentor-specific data
   */
  private validateMentorData(data: ProfileUpdateData, errors: ValidationError[]): void {
    if (data.skills !== undefined) {
      if (!Array.isArray(data.skills)) {
        errors.push({
          field: 'skills',
          message: 'Skills must be an array of strings',
          code: 'INVALID_SKILLS_FORMAT'
        })
      } else if (data.skills.length === 0) {
        errors.push({
          field: 'skills',
          message: 'At least one skill is required for mentors',
          code: 'SKILLS_REQUIRED'
        })
      } else if (data.skills.length > 20) {
        errors.push({
          field: 'skills',
          message: 'Maximum 20 skills allowed',
          code: 'TOO_MANY_SKILLS'
        })
      }
    }

    if (data.max_concurrent_teams !== undefined) {
      if (data.max_concurrent_teams < 1 || data.max_concurrent_teams > 10) {
        errors.push({
          field: 'max_concurrent_teams',
          message: 'Max concurrent teams must be between 1 and 10',
          code: 'INVALID_MAX_TEAMS'
        })
      }
    }

    if (data.booking_url && !this.isValidUrl(data.booking_url)) {
      errors.push({
        field: 'booking_url',
        message: 'Booking URL must be a valid HTTP/HTTPS URL',
        code: 'INVALID_BOOKING_URL'
      })
    }

    if (data.availability !== undefined) {
      if (!Array.isArray(data.availability)) {
        errors.push({
          field: 'availability',
          message: 'Availability must be an array of time slots',
          code: 'INVALID_AVAILABILITY_FORMAT'
        })
      } else {
        data.availability.forEach((slot, index) => {
          if (!this.isValidTimeSlot(slot)) {
            errors.push({
              field: `availability[${index}]`,
              message: 'Invalid time slot format',
              code: 'INVALID_TIME_SLOT'
            })
          }
        })
      }
    }
  }

  /**
   * Validate judge-specific data
   */
  private validateJudgeData(data: ProfileUpdateData, errors: ValidationError[]): void {
    if (data.judge_tier !== undefined) {
      const validTiers = ['junior', 'senior', 'expert', 'master']
      if (!validTiers.includes(data.judge_tier)) {
        errors.push({
          field: 'judge_tier',
          message: 'Judge tier must be one of: junior, senior, expert, master',
          code: 'INVALID_JUDGE_TIER'
        })
      }
    }
  }

  /**
   * Validate organizer-specific data
   */
  private validateOrganizerData(data: ProfileUpdateData, errors: ValidationError[]): void {
    if (data.organizer_status !== undefined) {
      const validStatuses = ['active', 'inactive', 'pending', 'suspended']
      if (!validStatuses.includes(data.organizer_status)) {
        errors.push({
          field: 'organizer_status',
          message: 'Organizer status must be one of: active, inactive, pending, suspended',
          code: 'INVALID_ORGANIZER_STATUS'
        })
      }
    }

    if (data.organizer_tier !== undefined) {
      const validTiers = ['bronze', 'silver', 'gold', 'platinum']
      if (!validTiers.includes(data.organizer_tier)) {
        errors.push({
          field: 'organizer_tier',
          message: 'Organizer tier must be one of: bronze, silver, gold, platinum',
          code: 'INVALID_ORGANIZER_TIER'
        })
      }
    }
  }

  // ─── Required Fields Management ──────────────────────────────────────────

  /**
   * Get required fields for a specific role
   */
  getRequiredFields(role: UserRole): string[] {
    const baseRequired = ['full_name', 'email']

    switch (role) {
      case 'mentor':
        return [...baseRequired, 'skills', 'availability', 'max_concurrent_teams']
      case 'judge':
        return [...baseRequired, 'judge_tier']
      case 'organizer':
        return [...baseRequired, 'organizer_status']
      case 'admin':
        return [...baseRequired]
      default:
        return baseRequired
    }
  }

  /**
   * Check if profile has all required fields for their role
   */
  isProfileComplete(profile: BaseProfile): boolean {
    const requiredFields = this.getRequiredFields(profile.role)
    
    return requiredFields.every(field => {
      const value = (profile as any)[field]
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value !== null && value !== undefined && value !== ''
    })
  }

  // ─── Utility Methods ─────────────────────────────────────────────────────

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  /**
   * Validate time slot format
   */
  private isValidTimeSlot(slot: TimeSlot): boolean {
    if (!slot || typeof slot !== 'object') return false
    
    const { day, start_time, end_time } = slot
    
    // Validate day
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    if (!validDays.includes(day?.toLowerCase())) return false
    
    // Validate time format (HH:MM or ISO time string)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
      // Try parsing as ISO time string
      try {
        new Date(`1970-01-01T${start_time}`)
        new Date(`1970-01-01T${end_time}`)
      } catch {
        return false
      }
    }
    
    return true
  }

  /**
   * Clear profile cache
   */
  clearCache(): void {
    this.profileCache.clear()
  }

  /**
   * Clear specific profile from cache
   */
  clearProfileCache(userId: string): void {
    this.profileCache.delete(userId)
  }
}

// ─── Export Singleton Instance ───────────────────────────────────────────────

export const profileManager = ProfileManager.getInstance()

// ─── React Hook for Profile Management ───────────────────────────────────────

export function useProfileManager() {
  return {
    profileManager,
    getProfile: (userId: string) => profileManager.getProfile(userId),
    getCurrentUserProfile: () => profileManager.getCurrentUserProfile(),
    updateProfile: (userId: string, data: ProfileUpdateData) => 
      profileManager.updateProfile(userId, data),
    getMentorProfile: (userId: string) => profileManager.getMentorProfile(userId),
    getJudgeProfile: (userId: string) => profileManager.getJudgeProfile(userId),
    getOrganizerProfile: (userId: string) => profileManager.getOrganizerProfile(userId),
    validateProfileData: (role: UserRole, data: ProfileUpdateData) => 
      profileManager.validateProfileData(role, data),
    getRequiredFields: (role: UserRole) => profileManager.getRequiredFields(role),
    isProfileComplete: (profile: BaseProfile) => profileManager.isProfileComplete(profile)
  }
}