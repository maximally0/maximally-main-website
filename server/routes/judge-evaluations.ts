import { Router } from 'express'
import type { Express, Request, Response } from 'express'

const router = Router()

// ============================================================
// Helper: extract bearer token and validate judge/admin role
// Returns { userId, judgeId } on success, or sends HTTP error
// ============================================================
async function requireJudgeRole(
  req: Request,
  res: Response,
  supabaseAdmin: any
): Promise<{ userId: string; judgeId: string } | null> {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Missing token' });
    return null;
  }
  const token = authHeader.slice(7);

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    res.status(401).json({ success: false, message: 'Invalid token' });
    return null;
  }

  // Check profiles.role
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile || (profile.role !== 'judge' && profile.role !== 'admin')) {
    res.status(403).json({ success: false, message: 'Forbidden' });
    return null;
  }

  // Get judges.id from judges.user_id = userId
  const { data: judgeRow, error: judgeError } = await supabaseAdmin
    .from('judges')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (judgeError || !judgeRow) {
    res.status(403).json({ success: false, message: 'Forbidden' });
    return null;
  }

  return { userId: user.id, judgeId: judgeRow.id };
}

// ============================================================
// GET /api/judging/assignments — authenticated, judge only
// ============================================================
async function getJudgingAssignments(req: Request, res: Response) {
  try {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, message: 'Server not configured' });
    }

    const auth = await requireJudgeRole(req, res, supabaseAdmin);
    if (!auth) return; // response already sent

    const { judgeId } = auth;

    const { data: assignments, error } = await supabaseAdmin
      .from('judge_evaluations')
      .select('*, hackathon_submissions(*), organizer_hackathons(*)')
      .eq('judge_id', judgeId);

    if (error) {
      console.error('Error fetching judging assignments:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch assignments' });
    }

    return res.json({ success: true, data: assignments || [] });
  } catch (e: any) {
    console.error('Error in GET /api/judging/assignments:', e);
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ============================================================
// POST /api/judging/evaluations/:evaluationId/save
// ============================================================
async function saveEvaluation(req: Request, res: Response) {
  try {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, message: 'Server not configured' });
    }

    const auth = await requireJudgeRole(req, res, supabaseAdmin);
    if (!auth) return;

    const { evaluationId } = req.params;
    const { rubricScores, comments } = req.body;

    const { error } = await supabaseAdmin
      .from('judge_evaluations')
      .update({
        status: 'in_progress',
        rubric_scores: rubricScores,
        comments: comments ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', evaluationId);

    if (error) {
      console.error('Error saving evaluation:', error);
      return res.status(500).json({ success: false, message: 'Failed to save evaluation' });
    }

    return res.json({ success: true });
  } catch (e: any) {
    console.error('Error in POST /api/judging/evaluations/:evaluationId/save:', e);
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ============================================================
// POST /api/judging/evaluations/:evaluationId/submit
// ============================================================
async function submitEvaluation(req: Request, res: Response) {
  try {
    const supabaseAdmin = req.app.locals.supabaseAdmin;
    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, message: 'Server not configured' });
    }

    const auth = await requireJudgeRole(req, res, supabaseAdmin);
    if (!auth) return;

    const { evaluationId } = req.params;
    const { rubricScores, comments } = req.body;

    // Fetch the existing evaluation to get required rubric keys
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('judge_evaluations')
      .select('rubric_scores')
      .eq('id', evaluationId)
      .maybeSingle();

    if (fetchError || !existing) {
      return res.status(404).json({ success: false, message: 'Evaluation not found' });
    }

    // Determine required keys from the existing rubric_scores object
    const existingKeys = Object.keys(existing.rubric_scores || {});
    if (existingKeys.length > 0) {
      const submittedKeys = Object.keys(rubricScores || {});
      const missingKeys = existingKeys.filter((k) => !submittedKeys.includes(k));
      if (missingKeys.length > 0) {
        return res.status(400).json({ success: false, message: 'All rubric fields are required' });
      }
    }

    const { error } = await supabaseAdmin
      .from('judge_evaluations')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        rubric_scores: rubricScores,
        comments: comments ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', evaluationId);

    if (error) {
      console.error('Error submitting evaluation:', error);
      return res.status(500).json({ success: false, message: 'Failed to submit evaluation' });
    }

    return res.json({ success: true });
  } catch (e: any) {
    console.error('Error in POST /api/judging/evaluations/:evaluationId/submit:', e);
    return res.status(500).json({ success: false, message: e.message });
  }
}

/**
 * GET /api/judges — Public list of all judges
 * This handler is needed because app.use('/api/judges', router) intercepts
 * all /api/judges* requests, including the bare GET /api/judges list endpoint.
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const supabaseAdmin = req.app.locals.supabaseAdmin
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Server not configured' })

    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio, location, skills, github_username, linkedin_username, twitter_username, website_url, total_events_judged, total_teams_evaluated, total_mentorship_hours, is_verified, created_at')
      .eq('role', 'judge')
      .order('total_events_judged', { ascending: false })

    if (error) return res.status(500).json({ success: false, message: error.message })

    const { data: judgesData } = await supabaseAdmin
      .from('judges')
      .select('user_id, assigned_category, evaluation_status, hackathons_judged, is_active')

    const judgesMap = new Map((judgesData || []).map((j: any) => [j.user_id, j]))

    const judgesList = (profiles || []).map((p: any) => {
      const jd = judgesMap.get(p.id) as any
      return {
        id: p.id,
        username: p.username,
        fullName: p.full_name,
        profilePhoto: p.avatar_url,
        headline: null,
        shortBio: p.bio,
        location: p.location,
        currentRole: null,
        company: null,
        primaryExpertise: p.skills ?? [],
        secondaryExpertise: [],
        totalEventsJudged: p.total_events_judged ?? 0,
        totalTeamsEvaluated: p.total_teams_evaluated ?? 0,
        totalMentorshipHours: p.total_mentorship_hours ?? 0,
        yearsOfExperience: 0,
        averageFeedbackRating: null,
        eventsJudgedVerified: p.is_verified ?? false,
        teamsEvaluatedVerified: p.is_verified ?? false,
        mentorshipHoursVerified: false,
        feedbackRatingVerified: false,
        linkedin: p.linkedin_username ? `https://linkedin.com/in/${p.linkedin_username}` : null,
        github: p.github_username ? `https://github.com/${p.github_username}` : null,
        twitter: p.twitter_username ? `https://twitter.com/${p.twitter_username}` : null,
        website: p.website_url,
        languagesSpoken: [],
        publicAchievements: null,
        mentorshipStatement: null,
        availabilityStatus: jd?.is_active ? 'available' : 'unavailable',
        tier: 'starter',
        isPublished: true,
        createdAt: p.created_at,
        topEventsJudged: jd?.hackathons_judged ?? [],
      }
    })
    return res.json(judgesList)
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message })
  }
})

/**
 * GET /api/judges/:username — Public judge profile by username
 * NOTE: This must be AFTER /:judgeId/assignments and /:judgeId/evaluations
 * to avoid intercepting those routes.
 */
router.get('/:username([^/]+)', async (req: Request, res: Response) => {
  const { username } = req.params
  // Don't handle sub-path routes here — they have their own handlers above
  try {
    const supabaseAdmin = req.app.locals.supabaseAdmin
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Server not configured' })

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio, location, skills, github_username, linkedin_username, twitter_username, website_url, total_events_judged, total_teams_evaluated, total_mentorship_hours, is_verified, created_at')
      .eq('username', username)
      .eq('role', 'judge')
      .maybeSingle()

    if (error || !profile) return res.status(404).json({ success: false, message: 'Judge not found' })

    const { data: jd } = await supabaseAdmin
      .from('judges')
      .select('assigned_category, hackathons_judged, is_active')
      .eq('user_id', profile.id)
      .maybeSingle()

    return res.json({
      id: profile.id,
      username: profile.username,
      fullName: profile.full_name,
      profilePhoto: profile.avatar_url,
      headline: null,
      shortBio: profile.bio,
      location: profile.location,
      currentRole: null,
      company: null,
      primaryExpertise: profile.skills ?? [],
      secondaryExpertise: [],
      totalEventsJudged: profile.total_events_judged ?? 0,
      totalTeamsEvaluated: profile.total_teams_evaluated ?? 0,
      totalMentorshipHours: profile.total_mentorship_hours ?? 0,
      yearsOfExperience: 0,
      averageFeedbackRating: null,
      eventsJudgedVerified: profile.is_verified ?? false,
      teamsEvaluatedVerified: profile.is_verified ?? false,
      mentorshipHoursVerified: false,
      feedbackRatingVerified: false,
      linkedin: profile.linkedin_username ? `https://linkedin.com/in/${profile.linkedin_username}` : null,
      github: profile.github_username ? `https://github.com/${profile.github_username}` : null,
      twitter: profile.twitter_username ? `https://twitter.com/${profile.twitter_username}` : null,
      website: profile.website_url,
      languagesSpoken: [],
      publicAchievements: null,
      mentorshipStatement: null,
      availabilityStatus: jd?.is_active ? 'available' : 'unavailable',
      tier: 'starter',
      topEventsJudged: jd?.hackathons_judged ?? [],
    })
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message })
  }
})

/**
 * Get judge assignments
 * GET /api/judges/:judgeId/assignments
 */
router.get('/:judgeId/assignments', async (req: Request, res: Response) => {
  try {
    const { judgeId } = req.params
    const supabaseAdmin = req.app.locals.supabaseAdmin
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection not available' })
    }

    const { data: assignments, error } = await supabaseAdmin
      .from('judge_hackathon_evaluations')
      .select(`
        *,
        hackathon:organizer_hackathons(id, name, start_date, end_date)
      `)
      .eq('judge_id', judgeId)
      .order('assigned_at', { ascending: false })

    if (error) {
      console.error('Error fetching judge assignments:', error)
      return res.status(500).json({ error: 'Failed to fetch judge assignments' })
    }

    res.json({ success: true, data: assignments || [] })
  } catch (error) {
    console.error('Error in GET /api/judges/:judgeId/assignments:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Get judge evaluations
 * GET /api/judges/:judgeId/evaluations
 */
router.get('/:judgeId/evaluations', async (req: Request, res: Response) => {
  try {
    const { judgeId } = req.params
    const supabaseAdmin = req.app.locals.supabaseAdmin
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection not available' })
    }

    const { data: evaluations, error } = await supabaseAdmin
      .from('judge_submission_evaluations')
      .select(`
        *,
        submission:hackathon_submissions(
          id,
          project_name,
          team_name,
          submission_url,
          github_url,
          description
        ),
        hackathon:organizer_hackathons(id, name)
      `)
      .eq('judge_id', judgeId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching judge evaluations:', error)
      return res.status(500).json({ error: 'Failed to fetch judge evaluations' })
    }

    res.json({ success: true, data: evaluations || [] })
  } catch (error) {
    console.error('Error in GET /api/judges/:judgeId/evaluations:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Get evaluation criteria for a hackathon
 * GET /api/hackathons/:hackathonId/evaluation-criteria
 */
router.get('/hackathons/:hackathonId/evaluation-criteria', async (req: Request, res: Response) => {
  try {
    const { hackathonId } = req.params
    const supabaseAdmin = req.app.locals.supabaseAdmin
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection not available' })
    }

    const { data: criteria, error } = await supabaseAdmin
      .from('judge_evaluation_criteria')
      .select('*')
      .eq('hackathon_id', hackathonId)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching evaluation criteria:', error)
      return res.status(500).json({ error: 'Failed to fetch evaluation criteria' })
    }

    res.json({ success: true, data: criteria || [] })
  } catch (error) {
    console.error('Error in GET /api/hackathons/:hackathonId/evaluation-criteria:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Get a specific evaluation
 * GET /api/evaluations/:evaluationId
 */
router.get('/evaluations/:evaluationId', async (req: Request, res: Response) => {
  try {
    const { evaluationId } = req.params
    const supabaseAdmin = req.app.locals.supabaseAdmin
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection not available' })
    }

    const { data: evaluation, error } = await supabaseAdmin
      .from('judge_submission_evaluations')
      .select(`
        *,
        submission:hackathon_submissions(
          id,
          project_name,
          team_name,
          submission_url,
          github_url,
          description,
          demo_url,
          presentation_url
        ),
        hackathon:organizer_hackathons(id, name)
      `)
      .eq('id', evaluationId)
      .single()

    if (error) {
      console.error('Error fetching evaluation:', error)
      return res.status(404).json({ error: 'Evaluation not found' })
    }

    res.json({ success: true, data: evaluation })
  } catch (error) {
    console.error('Error in GET /api/evaluations/:evaluationId:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Submit evaluation
 * POST /api/evaluations/:evaluationId/submit
 */
router.post('/evaluations/:evaluationId/submit', async (req: Request, res: Response) => {
  try {
    const { evaluationId } = req.params
    const { criteria_scores, comments_for_organizers, comments_for_participants } = req.body

    if (!criteria_scores || Object.keys(criteria_scores).length === 0) {
      return res.status(400).json({ error: 'Criteria scores are required' })
    }

    const supabaseAdmin = req.app.locals.supabaseAdmin
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection not available' })
    }

    // Calculate total score based on criteria weights
    const { data: evaluation, error: evalError } = await supabaseAdmin
      .from('judge_submission_evaluations')
      .select('hackathon_id')
      .eq('id', evaluationId)
      .single()

    if (evalError || !evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' })
    }

    // Get criteria to calculate weighted total
    const { data: criteria, error: criteriaError } = await supabaseAdmin
      .from('judge_evaluation_criteria')
      .select('id, weight, max_score')
      .eq('hackathon_id', evaluation.hackathon_id)
      .eq('is_active', true)

    if (criteriaError) {
      console.error('Error fetching criteria:', criteriaError)
      return res.status(500).json({ error: 'Failed to fetch evaluation criteria' })
    }

    // Calculate weighted total score
    let totalScore = 0
    let totalWeight = 0

    criteria?.forEach(criterion => {
      const score = criteria_scores[criterion.id.toString()]
      if (score !== undefined && score !== null) {
        const normalizedScore = (score / criterion.max_score) * criterion.weight
        totalScore += normalizedScore
        totalWeight += criterion.weight
      }
    })

    // Normalize to 100-point scale
    const finalScore = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0

    // Update evaluation
    const { data: updatedEvaluation, error: updateError } = await supabaseAdmin
      .from('judge_submission_evaluations')
      .update({
        criteria_scores,
        total_score: Math.round(finalScore * 100) / 100, // Round to 2 decimal places
        comments_for_organizers: comments_for_organizers || null,
        comments_for_participants: comments_for_participants || null,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', evaluationId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating evaluation:', updateError)
      return res.status(500).json({ error: 'Failed to submit evaluation' })
    }

    res.json({ 
      success: true, 
      data: updatedEvaluation,
      message: 'Evaluation submitted successfully'
    })
  } catch (error) {
    console.error('Error in POST /api/evaluations/:evaluationId/submit:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Save evaluation draft
 * POST /api/evaluations/:evaluationId/draft
 */
router.post('/evaluations/:evaluationId/draft', async (req: Request, res: Response) => {
  try {
    const { evaluationId } = req.params
    const { criteria_scores, comments_for_organizers, comments_for_participants } = req.body

    const supabaseAdmin = req.app.locals.supabaseAdmin
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection not available' })
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (criteria_scores) updateData.criteria_scores = criteria_scores
    if (comments_for_organizers !== undefined) updateData.comments_for_organizers = comments_for_organizers
    if (comments_for_participants !== undefined) updateData.comments_for_participants = comments_for_participants

    // Set status to in_progress if it was not_started
    const { data: currentEval } = await supabaseAdmin
      .from('judge_submission_evaluations')
      .select('status')
      .eq('id', evaluationId)
      .single()

    if (currentEval?.status === 'not_started') {
      updateData.status = 'in_progress'
    }

    const { data: updatedEvaluation, error } = await supabaseAdmin
      .from('judge_submission_evaluations')
      .update(updateData)
      .eq('id', evaluationId)
      .select()
      .single()

    if (error) {
      console.error('Error saving evaluation draft:', error)
      return res.status(500).json({ error: 'Failed to save evaluation draft' })
    }

    res.json({ 
      success: true, 
      data: updatedEvaluation,
      message: 'Draft saved successfully'
    })
  } catch (error) {
    console.error('Error in POST /api/evaluations/:evaluationId/draft:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export function registerJudgeEvaluationRoutes(app: Express): void {
  // New judging portal endpoints (task 15.1) — registered FIRST so they take
  // priority over the legacy wildcard router mounted at /api below.
  app.get('/api/judging/assignments', getJudgingAssignments)
  app.post('/api/judging/evaluations/:evaluationId/save', saveEvaluation)
  app.post('/api/judging/evaluations/:evaluationId/submit', submitEvaluation)

  // Legacy routes (existing judge management endpoints)
  app.use('/api/judges', router)
  app.use('/api', router)
}