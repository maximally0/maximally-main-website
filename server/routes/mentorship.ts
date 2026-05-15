import { Router } from 'express'
import type { Request, Response } from 'express'

const router = Router()

/**
 * Request mentorship session
 * POST /api/mentorship/request
 */
router.post('/request', async (req: Request, res: Response) => {
  try {
    const {
      mentorId,
      menteeId,
      problem_description,
      requested_time,
      duration_minutes,
      hackathon_id,
      team_id
    } = req.body

    if (!mentorId || !menteeId || !problem_description) {
      return res.status(400).json({ 
        error: 'Missing required fields: mentorId, menteeId, problem_description' 
      })
    }

    const supabaseAdmin = req.app.locals.supabaseAdmin
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection not available' })
    }

    // Verify mentor exists and is available
    const { data: mentor, error: mentorError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, max_concurrent_teams')
      .eq('id', mentorId)
      .eq('role', 'mentor')
      .single()

    if (mentorError || !mentor) {
      return res.status(404).json({ error: 'Mentor not found' })
    }

    // Check if mentor is not overloaded
    const { count: activeSessions } = await supabaseAdmin
      .from('mentorship_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('mentor_id', mentorId)
      .in('status', ['accepted', 'in_progress'])

    const maxTeams = mentor.max_concurrent_teams || 3
    if (activeSessions && activeSessions >= maxTeams) {
      return res.status(400).json({ 
        error: 'Mentor is currently at capacity. Please try again later.' 
      })
    }

    // Create mentorship session request
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('mentorship_sessions')
      .insert({
        mentor_id: mentorId,
        mentee_id: menteeId,
        problem_description,
        requested_time: requested_time || null,
        duration_minutes: duration_minutes || 30,
        hackathon_id: hackathon_id || null,
        team_id: team_id || null,
        status: 'pending'
      })
      .select()
      .single()

    if (sessionError) {
      console.error('Error creating mentorship session:', sessionError)
      return res.status(500).json({ error: 'Failed to create mentorship request' })
    }

    // Prefer POST /api/mentors/:mentorId/request for the platform flow. Optional Slack/email
    // for alerts: set MENTOR_REQUEST_SLACK_WEBHOOK_URL, RESEND_API_KEY, FROM_EMAIL (or MENTOR_NOTIFICATION_FROM_EMAIL).

    res.json({ 
      success: true, 
      data: session,
      message: 'Mentorship request recorded. The mentor can review it on their dashboard.' 
    })
  } catch (error) {
    console.error('Error in POST /api/mentorship/request:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Get mentorship sessions for a user
 * GET /api/mentorship/sessions?userId=:userId&role=:role
 */
router.get('/sessions', async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.query

    if (!userId || !role) {
      return res.status(400).json({ error: 'Missing required parameters: userId, role' })
    }

    const supabaseAdmin = req.app.locals.supabaseAdmin
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection not available' })
    }

    let query = supabaseAdmin
      .from('mentorship_sessions')
      .select(`
        *,
        mentor:profiles!mentor_id(id, full_name, username, avatar_url),
        mentee:profiles!mentee_id(id, full_name, username, avatar_url),
        hackathon:organizer_hackathons(id, name)
      `)
      .order('created_at', { ascending: false })

    // Filter based on role
    if (role === 'mentor') {
      query = query.eq('mentor_id', userId)
    } else if (role === 'mentee') {
      query = query.eq('mentee_id', userId)
    } else {
      return res.status(400).json({ error: 'Invalid role. Must be "mentor" or "mentee"' })
    }

    const { data: sessions, error } = await query

    if (error) {
      console.error('Error fetching mentorship sessions:', error)
      return res.status(500).json({ error: 'Failed to fetch mentorship sessions' })
    }

    res.json({ success: true, data: sessions || [] })
  } catch (error) {
    console.error('Error in GET /api/mentorship/sessions:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Update mentorship session status
 * PUT /api/mentorship/sessions/:id
 */
router.put('/sessions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status, mentor_notes, mentee_feedback, rating, scheduled_time } = req.body

    const supabaseAdmin = req.app.locals.supabaseAdmin
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection not available' })
    }

    // Validate status
    const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled']
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' })
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (status) updateData.status = status
    if (mentor_notes) updateData.mentor_notes = mentor_notes
    if (mentee_feedback) updateData.mentee_feedback = mentee_feedback
    if (rating) updateData.rating = rating
    if (scheduled_time) updateData.scheduled_time = scheduled_time

    const { data: session, error } = await supabaseAdmin
      .from('mentorship_sessions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating mentorship session:', error)
      return res.status(500).json({ error: 'Failed to update mentorship session' })
    }

    res.json({ success: true, data: session })
  } catch (error) {
    console.error('Error in PUT /api/mentorship/sessions/:id:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export function registerMentorshipRoutes(app: any) {
  app.use('/api/mentorship', router)
}