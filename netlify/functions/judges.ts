import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server configuration error' }),
    };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Handle POST /api/judges/apply
  if (event.httpMethod === 'POST' && (event.path.includes('/apply') || event.path.endsWith('/judges'))) {
    try {
      const body = JSON.parse(event.body || '{}');

      // Validate required fields
      if (!body.username || !body.fullName || !body.email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Missing required fields: username, fullName, email' }),
        };
      }

      // Check for existing username in applications
      const { data: existingUsername } = await supabase
        .from('judge_applications')
        .select('id')
        .eq('username', body.username)
        .maybeSingle();

      if (existingUsername) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Username already exists in applications' }),
        };
      }

      // Check for existing email in applications
      const { data: existingEmail } = await supabase
        .from('judge_applications')
        .select('id')
        .eq('email', body.email)
        .maybeSingle();

      if (existingEmail) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Email already registered in applications' }),
        };
      }

      // Check if already approved as judge
      const { data: existingJudge } = await supabase
        .from('judges')
        .select('id')
        .or(`username.eq.${body.username},email.eq.${body.email}`)
        .maybeSingle();

      if (existingJudge) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'You are already a registered judge or have a pending application' }),
        };
      }

      // Prepare application data
      const applicationData = {
        username: body.username,
        full_name: body.fullName,
        profile_photo: body.profilePhoto || null,
        headline: body.headline,
        short_bio: body.shortBio,
        judge_location: body.location,
        role_title: body.currentRole,
        company: body.company,
        primary_expertise: body.primaryExpertise || [],
        secondary_expertise: body.secondaryExpertise || [],
        total_events_judged: body.totalEventsJudged || 0,
        total_teams_evaluated: body.totalTeamsEvaluated || 0,
        total_mentorship_hours: body.totalMentorshipHours || 0,
        years_of_experience: body.yearsOfExperience || 0,
        average_feedback_rating: body.averageFeedbackRating || null,
        linkedin: body.linkedin || null,
        github: body.github || null,
        twitter: body.twitter || null,
        website: body.website || null,
        languages_spoken: body.languagesSpoken || [],
        public_achievements: body.publicAchievements || null,
        mentorship_statement: body.mentorshipStatement,
        availability_status: body.availabilityStatus || 'available',
        email: body.email,
        phone: body.phone || null,
        resume: body.resume || null,
        proof_of_judging: body.proofOfJudging || null,
        timezone: body.timezone || null,
        calendar_link: body.calendarLink || null,
        compensation_preference: body.compensationPreference || null,
        judge_references: body.references || null,
        conflict_of_interest: body.conflictOfInterest || null,
        agreed_to_nda: body.agreedToNDA || false,
        address: body.address || null,
        status: 'pending'
      };

      // Insert application
      const { data: application, error: applicationError } = await supabase
        .from('judge_applications')
        .insert(applicationData)
        .select()
        .single();

      if (applicationError) {
        console.error('Application insert error:', applicationError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ message: `Failed to submit application: ${applicationError.message}` }),
        };
      }

      // Add judge events if provided
      if (body.topEventsJudged && Array.isArray(body.topEventsJudged)) {
        const events = body.topEventsJudged
          .filter((event: any) => event.eventName && event.role && event.date)
          .map((event: any) => ({
            application_id: application.id,
            event_name: event.eventName,
            event_role: event.role,
            event_date: event.date,
            event_link: event.link || null,
            verified: false
          }));

        if (events.length > 0) {
          await supabase.from('judge_application_events').insert(events);
        }
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: 'Application submitted successfully! We will review your application and get back to you soon.',
          applicationId: application.id
        }),
      };
    } catch (err: any) {
      console.error('Judge application error:', err);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: err?.message || 'Failed to submit application' }),
      };
    }
  }

  // Get username from path for GET requests
  const path = event.path.replace('/.netlify/functions/judges', '').replace('/api/judges', '');
  const username = path.replace(/^\//, '');

  console.log('Path:', event.path, 'Username:', username);

  if (!username) {
    // List all judges
    const { data: judges, error } = await supabase
      .from('judges')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message }),
      };
    }

    const judgesList = (judges || []).map((judgeData: any) => ({
      id: judgeData.id,
      username: judgeData.username,
      fullName: judgeData.full_name,
      profilePhoto: judgeData.profile_photo,
      headline: judgeData.headline,
      shortBio: judgeData.short_bio,
      location: judgeData.judge_location,
      currentRole: judgeData.role_title,
      company: judgeData.company,
      primaryExpertise: judgeData.primary_expertise || [],
      secondaryExpertise: judgeData.secondary_expertise || [],
      totalEventsJudged: judgeData.total_events_judged || 0,
      totalTeamsEvaluated: judgeData.total_teams_evaluated || 0,
      totalMentorshipHours: judgeData.total_mentorship_hours || 0,
      yearsOfExperience: judgeData.years_of_experience || 0,
      averageFeedbackRating: judgeData.average_feedback_rating,
      eventsJudgedVerified: judgeData.events_judged_verified || false,
      teamsEvaluatedVerified: judgeData.teams_evaluated_verified || false,
      mentorshipHoursVerified: judgeData.mentorship_hours_verified || false,
      feedbackRatingVerified: judgeData.feedback_rating_verified || false,
      linkedin: judgeData.linkedin,
      github: judgeData.github,
      twitter: judgeData.twitter,
      website: judgeData.website,
      languagesSpoken: judgeData.languages_spoken || [],
      publicAchievements: judgeData.public_achievements,
      mentorshipStatement: judgeData.mentorship_statement,
      availabilityStatus: judgeData.availability_status || 'available',
      tier: judgeData.tier || 'starter',
      isPublished: judgeData.is_published || false,
      createdAt: judgeData.created_at
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(judgesList),
    };
  }

  // Get specific judge
  const { data: judge, error: judgeError } = await supabase
    .from('judges')
    .select('*')
    .ilike('username', username)
    .eq('is_published', true)
    .single();

  if (judgeError || !judge) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Judge not found' }),
    };
  }

  // Get judge events
  const { data: events } = await supabase
    .from('judge_events')
    .select('*')
    .eq('judge_id', judge.id)
    .order('event_date', { ascending: false })
    .limit(5);

  const response = {
    id: judge.id,
    username: judge.username,
    fullName: judge.full_name,
    profilePhoto: judge.profile_photo,
    headline: judge.headline,
    shortBio: judge.short_bio,
    location: judge.judge_location,
    currentRole: judge.role_title,
    company: judge.company,
    primaryExpertise: judge.primary_expertise || [],
    secondaryExpertise: judge.secondary_expertise || [],
    totalEventsJudged: judge.total_events_judged || 0,
    totalTeamsEvaluated: judge.total_teams_evaluated || 0,
    totalMentorshipHours: judge.total_mentorship_hours || 0,
    yearsOfExperience: judge.years_of_experience || 0,
    averageFeedbackRating: judge.average_feedback_rating,
    eventsJudgedVerified: judge.events_judged_verified || false,
    teamsEvaluatedVerified: judge.teams_evaluated_verified || false,
    mentorshipHoursVerified: judge.mentorship_hours_verified || false,
    feedbackRatingVerified: judge.feedback_rating_verified || false,
    linkedin: judge.linkedin,
    github: judge.github,
    twitter: judge.twitter,
    website: judge.website,
    email: judge.email,
    phone: judge.phone,
    address: judge.address,
    timezone: judge.timezone,
    compensationPreference: judge.compensation_preference,
    languagesSpoken: judge.languages_spoken || [],
    publicAchievements: judge.public_achievements,
    mentorshipStatement: judge.mentorship_statement,
    availabilityStatus: judge.availability_status || 'available',
    tier: judge.tier || 'starter',
    isPublished: judge.is_published || false,
    topEventsJudged: (events || []).map((e: any) => ({
      eventName: e.event_name,
      role: e.event_role,
      date: e.event_date,
      link: e.event_link,
      verified: e.verified || false
    }))
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(response),
  };
};

export { handler };
