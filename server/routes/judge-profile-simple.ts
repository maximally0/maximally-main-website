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
          id: (judge as any).id,
          username: (judge as any).username,
          fullName: (judge as any).full_name,
          profilePhoto: (judge as any).profile_photo,
          headline: (judge as any).headline,
          shortBio: (judge as any).short_bio,
          location: (judge as any).judge_location,
          currentRole: (judge as any).role_title,
          company: (judge as any).company,
          tier: (judge as any).tier,
          availabilityStatus: (judge as any).availability_status,
          primaryExpertise: (judge as any).primary_expertise || [],
          secondaryExpertise: (judge as any).secondary_expertise || [],
          totalEventsJudged: (judge as any).total_events_judged || 0,
          totalTeamsEvaluated: (judge as any).total_teams_evaluated || 0,
          totalMentorshipHours: (judge as any).total_mentorship_hours || 0,
          yearsOfExperience: (judge as any).years_of_experience || 0,
          averageFeedbackRating: (judge as any).average_feedback_rating,
          eventsJudgedVerified: (judge as any).events_judged_verified || false,
          teamsEvaluatedVerified: (judge as any).teams_evaluated_verified || false,
          mentorshipHoursVerified: (judge as any).mentorship_hours_verified || false,
          feedbackRatingVerified: (judge as any).feedback_rating_verified || false,
          linkedin: (judge as any).linkedin,
          github: (judge as any).github,
          twitter: (judge as any).twitter,
          website: (judge as any).website,
          languagesSpoken: (judge as any).languages_spoken || [],
          publicAchievements: (judge as any).public_achievements || '',
          mentorshipStatement: (judge as any).mentorship_statement || '',
          email: (judge as any).email,
          phone: (judge as any).phone,
          address: (judge as any).address,
          timezone: (judge as any).timezone,
          compensationPreference: (judge as any).compensation_preference,
          topEventsJudged: []
        });
      }

      // Fallback: Try profiles table (for judges who haven't been migrated to judges table yet)
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('username', username)
        .eq('role', 'judge')
        .maybeSingle();

      if (profile) {
        console.log(`[SIMPLE JUDGE] Found in profiles table (fallback)`);
        
        // Try to get tier from judges table if exists
        const { data: judgeData } = await supabaseAdmin
          .from('judges')
          .select('tier')
          .eq('user_id', (profile as any).id)
          .maybeSingle();
        
        return res.json({
          id: (profile as any).id,
          username: (profile as any).username,
          fullName: (profile as any).full_name,
          profilePhoto: (profile as any).avatar_url,
          headline: (profile as any).headline || 'Judge',
          shortBio: (profile as any).bio || '',
          location: (profile as any).location || '',
          currentRole: (profile as any).current_role || '',
          company: (profile as any).company || '',
          tier: (judgeData as any)?.tier || 'starter',
          availabilityStatus: 'available',
          primaryExpertise: (profile as any).skills || [],
          secondaryExpertise: [],
          totalEventsJudged: (profile as any).total_events_judged || 0,
          totalTeamsEvaluated: (profile as any).total_teams_evaluated || 0,
          totalMentorshipHours: (profile as any).total_mentorship_hours || 0,
          yearsOfExperience: (profile as any).years_of_experience || 0,
          averageFeedbackRating: null,
          eventsJudgedVerified: true,
          teamsEvaluatedVerified: true,
          mentorshipHoursVerified: true,
          feedbackRatingVerified: false,
          linkedin: (profile as any).linkedin_username ? `https://linkedin.com/in/${(profile as any).linkedin_username}` : null,
          github: (profile as any).github_username ? `https://github.com/${(profile as any).github_username}` : null,
          twitter: (profile as any).twitter_username ? `https://twitter.com/${(profile as any).twitter_username}` : null,
          website: (profile as any).website_url,
          languagesSpoken: ['English'],
          publicAchievements: '',
          mentorshipStatement: (profile as any).bio || '',
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
