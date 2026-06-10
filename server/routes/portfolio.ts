/**
 * Portfolio Export API
 * Public profile data + PDF-friendly export endpoint
 */
import type { Express, Request, Response } from 'express';

export function registerPortfolioRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as any;
  if (!supabaseAdmin) return;

  // GET /api/portfolio/:username — public profile data for portfolio
  app.get('/api/portfolio/:username', async (req: Request, res: Response) => {
    try {
      const { username } = req.params;

      // Get profile
      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('id, username, full_name, avatar_url, bio, reputation_tier, tier_updated_at, projects_submitted, projects_placed, peer_reviews_given, council_assigned_at, created_at')
        .eq('username', username)
        .single();

      if (error || !profile) return res.status(404).json({ success: false, message: 'User not found' });

      // Get submissions
      const { data: submissions } = await supabaseAdmin
        .from('hackathon_submissions')
        .select('id, project_name, description, demo_url, github_url, track, status, created_at, hackathon_id, prize_won, organizer_hackathons:hackathon_id(hackathon_name, slug)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      // Get verified outcomes
      const { data: outcomes } = await supabaseAdmin
        .from('builder_outcomes')
        .select('outcome_type, description, verified_at, related_event_id')
        .eq('user_id', profile.id)
        .eq('is_public', true)
        .not('verified_at', 'is', null);

      // Get mentorship stats (if mentor)
      const { data: mentorData } = await supabaseAdmin
        .from('mentors')
        .select('total_mentorship_hours, skills')
        .eq('user_id', profile.id)
        .single();

      // Get peer review count
      const { count: reviewCount } = await supabaseAdmin
        .from('peer_reviews')
        .select('id', { count: 'exact', head: true })
        .eq('reviewer_id', profile.id);

      return res.json({
        success: true,
        data: {
          profile: {
            username: profile.username,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            bio: profile.bio,
            reputation_tier: profile.reputation_tier,
            tier_updated_at: profile.tier_updated_at,
            member_since: profile.created_at,
            stats: {
              projects_submitted: profile.projects_submitted || (submissions?.length || 0),
              projects_placed: profile.projects_placed || 0,
              peer_reviews_given: reviewCount || profile.peer_reviews_given || 0,
              mentored_hours: mentorData?.total_mentorship_hours || 0,
            }
          },
          submissions: (submissions || []).map((s: any) => ({
            project_name: s.project_name,
            event_name: s.organizer_hackathons?.hackathon_name,
            event_slug: s.organizer_hackathons?.slug,
            track: s.track,
            placement: s.prize_won,
            date: s.created_at,
          })),
          outcomes: outcomes || [],
          skills: mentorData?.skills || [],
          generated_at: new Date().toISOString(),
        }
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // GET /api/portfolio/:username/export — returns structured data for PDF generation
  app.get('/api/portfolio/:username/export', async (req: Request, res: Response) => {
    try {
      // Reuse the same logic as above but format for PDF
      const portfolioRes = await fetch(`http://localhost:${process.env.PORT || 5000}/api/portfolio/${req.params.username}`);
      // Fallback: just redirect to the main endpoint with a flag
      const { username } = req.params;
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, username, full_name, reputation_tier, tier_updated_at, projects_submitted, projects_placed, peer_reviews_given, created_at')
        .eq('username', username)
        .single();
      if (!profile) return res.status(404).json({ success: false, message: 'User not found' });

      const { data: submissions } = await supabaseAdmin
        .from('hackathon_submissions')
        .select('project_name, created_at, prize_won, organizer_hackathons:hackathon_id(hackathon_name)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      const { data: outcomes } = await supabaseAdmin
        .from('builder_outcomes')
        .select('outcome_type, description, verified_at')
        .eq('user_id', profile.id).eq('is_public', true).not('verified_at', 'is', null);

      return res.json({
        success: true,
        export: {
          header: `${profile.full_name || profile.username} — Maximally Builder Portfolio`,
          tier: `${profile.reputation_tier} since ${profile.tier_updated_at ? new Date(profile.tier_updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}`,
          member_since: new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          stats: { projects: profile.projects_submitted || 0, placements: profile.projects_placed || 0, reviews: profile.peer_reviews_given || 0 },
          projects: (submissions || []).map((s: any) => ({ name: s.project_name, event: s.organizer_hackathons?.hackathon_name, placement: s.prize_won, date: s.created_at })),
          outcomes: (outcomes || []).map((o: any) => ({ type: o.outcome_type, description: o.description, verified: o.verified_at })),
          disclaimer: 'This record was generated from verified Maximally platform activity.',
          generated_at: new Date().toISOString(),
        }
      });
    } catch (err: any) { return res.status(500).json({ success: false, message: err.message }); }
  });
}
