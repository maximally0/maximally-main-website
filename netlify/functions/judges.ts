import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  // Get username from path
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
