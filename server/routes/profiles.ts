/**
 * Profile Routes - Enhanced role-based profile management
 * Supports ProfileManager functionality with role-specific data handling
 */

import { Express, Request, Response } from 'express'

interface ProfileUpdateRequest {
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
  availability?: any[]
  max_concurrent_teams?: number
  booking_url?: string
  mentor_specializations?: string[]
  assigned_category?: string
  judge_tier?: 'junior' | 'senior' | 'expert' | 'master'
  organizer_status?: 'active' | 'inactive' | 'pending' | 'suspended'
  organizer_tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
}

/**
 * Validate profile update data based on role
 */
function validateProfileUpdate(role: string, data: ProfileUpdateRequest): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Base validation
  if (data.username && data.username.length < 3) {
    errors.push('Username must be at least 3 characters long')
  }

  if (data.website_url && !isValidUrl(data.website_url)) {
    errors.push('Website URL must be a valid HTTP/HTTPS URL')
  }

  if (data.booking_url && !isValidUrl(data.booking_url)) {
    errors.push('Booking URL must be a valid HTTP/HTTPS URL')
  }

  // Role-specific validation
  switch (role) {
    case 'mentor':
      if (data.skills !== undefined) {
        if (!Array.isArray(data.skills)) {
          errors.push('Skills must be an array of strings')
        } else if (data.skills.length === 0) {
          errors.push('At least one skill is required for mentors')
        } else if (data.skills.length > 20) {
          errors.push('Maximum 20 skills allowed')
        }
      }

      if (data.max_concurrent_teams !== undefined) {
        if (data.max_concurrent_teams < 1 || data.max_concurrent_teams > 10) {
          errors.push('Max concurrent teams must be between 1 and 10')
        }
      }
      break

    case 'judge':
      if (data.judge_tier !== undefined) {
        const validTiers = ['junior', 'senior', 'expert', 'master']
        if (!validTiers.includes(data.judge_tier)) {
          errors.push('Judge tier must be one of: junior, senior, expert, master')
        }
      }
      break

    case 'organizer':
      if (data.organizer_status !== undefined) {
        const validStatuses = ['active', 'inactive', 'pending', 'suspended']
        if (!validStatuses.includes(data.organizer_status)) {
          errors.push('Organizer status must be one of: active, inactive, pending, suspended')
        }
      }

      if (data.organizer_tier !== undefined) {
        const validTiers = ['bronze', 'silver', 'gold', 'platinum']
        if (!validTiers.includes(data.organizer_tier)) {
          errors.push('Organizer tier must be one of: bronze, silver, gold, platinum')
        }
      }
      break
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Register profile management routes
 */
export function registerProfileRoutes(app: Express) {
  
  // GET /api/profiles/:userId - Get specific user profile
  app.get('/api/profiles/:userId', async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = req.app.locals.supabaseAdmin;
      if (!supabaseAdmin) {
        return res.status(500).json({ error: 'Server not configured' })
      }

      const { userId } = req.params

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' })
      }

      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('[ProfileRoutes] Error fetching profile:', error)
        return res.status(404).json({ error: 'Profile not found' })
      }

      return res.json(profile)
    } catch (error) {
      console.error('[ProfileRoutes] Error in GET /api/profiles/:userId:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  })

  // PUT /api/profiles/:userId - Update user profile
  app.put('/api/profiles/:userId', async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = req.app.locals.supabaseAdmin;
      if (!supabaseAdmin) {
        return res.status(500).json({ error: 'Server not configured' })
      }

      const { userId } = req.params
      const updateData: ProfileUpdateRequest = req.body

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' })
      }

      // Get current profile to determine role
      const { data: currentProfile, error: fetchError } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (fetchError || !currentProfile) {
        return res.status(404).json({ error: 'Profile not found' })
      }

      // Validate the update data
      const validation = validateProfileUpdate(currentProfile.role, updateData)
      if (!validation.isValid) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: validation.errors 
        })
      }

      // Update the profile
      const { data: updatedProfile, error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (updateError) {
        console.error('[ProfileRoutes] Error updating profile:', updateError)
        return res.status(500).json({ error: 'Failed to update profile' })
      }

      return res.json(updatedProfile)
    } catch (error) {
      console.error('[ProfileRoutes] Error in PUT /api/profiles/:userId:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  })

  // GET /api/profiles/:userId/mentor - Get mentor-specific profile data
  app.get('/api/profiles/:userId/mentor', async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = req.app.locals.supabaseAdmin;
      if (!supabaseAdmin) {
        return res.status(500).json({ error: 'Server not configured' })
      }

      const { userId } = req.params

      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .eq('role', 'mentor')
        .single()

      if (error || !profile) {
        return res.status(404).json({ error: 'Mentor profile not found' })
      }

      // Return mentor-specific formatted data
      const mentorProfile = {
        ...profile,
        skills: profile.skills || [],
        availability: profile.availability || [],
        max_concurrent_teams: profile.max_concurrent_teams || 3,
        mentored_hours: profile.mentored_hours || 0,
        mentor_rating: profile.mentor_rating || 0.0,
        mentor_specializations: profile.mentor_specializations || []
      }

      return res.json(mentorProfile)
    } catch (error) {
      console.error('[ProfileRoutes] Error in GET /api/profiles/:userId/mentor:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  })

  // GET /api/profiles/:userId/judge - Get judge-specific profile data
  app.get('/api/profiles/:userId/judge', async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = req.app.locals.supabaseAdmin;
      if (!supabaseAdmin) {
        return res.status(500).json({ error: 'Server not configured' })
      }

      const { userId } = req.params

      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .eq('role', 'judge')
        .single()

      if (error || !profile) {
        return res.status(404).json({ error: 'Judge profile not found' })
      }

      // Return judge-specific formatted data
      const judgeProfile = {
        ...profile,
        evaluation_status: profile.evaluation_status || 0,
        judge_tier: profile.judge_tier || 'junior',
        total_evaluations_completed: profile.total_evaluations_completed || 0,
        hackathons_judged: profile.hackathons_judged || []
      }

      return res.json(judgeProfile)
    } catch (error) {
      console.error('[ProfileRoutes] Error in GET /api/profiles/:userId/judge:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  })

  // GET /api/profiles/:userId/organizer - Get organizer-specific profile data
  app.get('/api/profiles/:userId/organizer', async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = req.app.locals.supabaseAdmin;
      if (!supabaseAdmin) {
        return res.status(500).json({ error: 'Server not configured' })
      }

      const { userId } = req.params

      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .eq('role', 'organizer')
        .single()

      if (error || !profile) {
        return res.status(404).json({ error: 'Organizer profile not found' })
      }

      // Return organizer-specific formatted data
      const organizerProfile = {
        ...profile,
        organizer_status: profile.organizer_status || 'inactive',
        events_organized: profile.events_organized || 0,
        total_participants_managed: profile.total_participants_managed || 0
      }

      return res.json(organizerProfile)
    } catch (error) {
      console.error('[ProfileRoutes] Error in GET /api/profiles/:userId/organizer:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  })

}