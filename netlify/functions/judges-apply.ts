import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Server is not configured for Supabase' }),
      };
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const body = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!body.username || !body.fullName || !body.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields: username, fullName, email' }),
      };
    }

    // Check for existing username in applications
    const { data: existingUsername } = await supabaseAdmin
      .from('judge_applications')
      .select('id')
      .eq('username', body.username)
      .maybeSingle();

    if (existingUsername) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Username already exists in applications' }),
      };
    }

    // Check for existing email in applications
    const { data: existingEmail } = await supabaseAdmin
      .from('judge_applications')
      .select('id')
      .eq('email', body.email)
      .maybeSingle();

    if (existingEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email already registered in applications' }),
      };
    }

    // Check if already approved as judge
    const { data: existingJudge } = await supabaseAdmin
      .from('judges')
      .select('id')
      .or(`username.eq.${body.username},email.eq.${body.email}`)
      .maybeSingle();

    if (existingJudge) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'You are already a registered judge or have a pending application' }),
      };
    }

    // Prepare application data
    const applicationData = {
      username: body.username,
      full_name: body.fullName,
      profile_photo: body.profilePhoto,
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
      average_feedback_rating: body.averageFeedbackRating,
      linkedin: body.linkedin,
      github: body.github,
      twitter: body.twitter,
      website: body.website,
      languages_spoken: body.languagesSpoken || [],
      public_achievements: body.publicAchievements,
      mentorship_statement: body.mentorshipStatement,
      availability_status: body.availabilityStatus || 'available',
      email: body.email,
      phone: body.phone,
      resume: body.resume,
      proof_of_judging: body.proofOfJudging,
      timezone: body.timezone,
      calendar_link: body.calendarLink,
      compensation_preference: body.compensationPreference,
      judge_references: body.references,
      conflict_of_interest: body.conflictOfInterest,
      agreed_to_nda: body.agreedToNDA || false,
      address: body.address,
      status: 'pending'
    };

    // Insert application
    const { data: application, error: applicationError } = await supabaseAdmin
      .from('judge_applications')
      .insert(applicationData)
      .select()
      .single();

    if (applicationError) {
      console.error('Application insert error:', applicationError);
      return {
        statusCode: 500,
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
        const { error: eventsError } = await supabaseAdmin
          .from('judge_application_events')
          .insert(events);

        if (eventsError) {
          console.error('Events insert error:', eventsError);
        }
      }
    }

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Application submitted successfully! We will review your application and get back to you soon.',
        applicationId: application.id
      }),
    };
  } catch (err: any) {
    console.error('Judge application error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err?.message || 'Failed to submit application' }),
    };
  }
};
