// Simple judge profile route - no dependencies on judge_events
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";

export function registerSimpleJudgeRoutes(app: Express) {
  console.log('🚀 [SIMPLE JUDGE ROUTES] Registering simple judge routes...');
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // Simple judge profile endpoint
  app.get("/api/judges/:username", async (req, res) => {
    try {
      const { username } = req.params;
      console.log(`[SIMPLE JUDGE] Fetching: ${username}`);

      // Try judges table first
      const { data: judge } = await supabaseAdmin
        .from('judges')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (judge) {
        console.log(`[SIMPLE JUDGE] Found in judges table`);
        return res.json({
          id: judge.id,
          username: judge.username,
          fullName: judge.full_name,
          profilePhoto: judge.profile_photo,
          headline: judge.headline,
          shortBio: judge.short_bio,
          location: judge.judge_location,
          currentRole: judge.role_title,
          company: judge.company,
          tier: judge.tier,
          availabilityStatus: judge.availability_status,
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
          languagesSpoken: judge.languages_spoken || [],
          publicAchievements: judge.public_achievements || '',
          mentorshipStatement: judge.mentorship_statement || '',
          email: judge.email,
          phone: judge.phone,
          address: judge.address,
          timezone: judge.timezone,
          compensationPreference: judge.compensation_preference,
          topEventsJudged: []
        });
      }

      // Try profiles table
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (profile && (profile.role === 'judge' || profile.judge_tier)) {
        console.log(`[SIMPLE JUDGE] Found in profiles table`);
        return res.json({
          id: profile.id,
          username: profile.username,
          fullName: profile.full_name,
          profilePhoto: profile.avatar_url,
          headline: profile.headline || 'Judge',
          shortBio: profile.bio || '',
          location: profile.location || '',
          currentRole: profile.current_role || '',
          company: profile.company || '',
          tier: profile.judge_tier || 'starter',
          availabilityStatus: 'available',
          primaryExpertise: profile.skills || [],
          secondaryExpertise: [],
          totalEventsJudged: profile.total_events_judged || 0,
          totalTeamsEvaluated: profile.total_teams_evaluated || 0,
          totalMentorshipHours: profile.total_mentorship_hours || 0,
          yearsOfExperience: profile.years_of_experience || 0,
          averageFeedbackRating: null,
          eventsJudgedVerified: true,
          teamsEvaluatedVerified: true,
          mentorshipHoursVerified: true,
          feedbackRatingVerified: false,
          linkedin: profile.linkedin_username ? `https://linkedin.com/in/${profile.linkedin_username}` : null,
          github: profile.github_username ? `https://github.com/${profile.github_username}` : null,
          twitter: profile.twitter_username ? `https://twitter.com/${profile.twitter_username}` : null,
          website: profile.website_url,
          languagesSpoken: ['English'],
          publicAchievements: '',
          mentorshipStatement: profile.bio || '',
          topEventsJudged: []
        });
      }

      console.log(`[SIMPLE JUDGE] Not found`);
      return res.status(404).json({ success: false, message: 'Judge not found' });
    } catch (error: any) {
      console.error('[SIMPLE JUDGE] Error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
