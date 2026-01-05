-- Feature Enhancements Migration Script
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. BASIC BRANDING CONTROLS
-- Add custom branding fields to organizer_hackathons
-- ============================================

ALTER TABLE public.organizer_hackathons 
ADD COLUMN IF NOT EXISTS banner_image text,
ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#8B5CF6',
ADD COLUMN IF NOT EXISTS secondary_color text DEFAULT '#EC4899',
ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#06B6D4',
ADD COLUMN IF NOT EXISTS font_style text DEFAULT 'default';

-- Add check constraint for font_style if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'organizer_hackathons_font_style_check'
  ) THEN
    ALTER TABLE public.organizer_hackathons 
    ADD CONSTRAINT organizer_hackathons_font_style_check 
    CHECK (font_style IS NULL OR font_style IN ('default', 'modern', 'retro', 'minimal'));
  END IF;
END $$;

COMMENT ON COLUMN public.organizer_hackathons.banner_image IS 'Custom banner image URL for hackathon page';
COMMENT ON COLUMN public.organizer_hackathons.primary_color IS 'Primary brand color (hex)';
COMMENT ON COLUMN public.organizer_hackathons.secondary_color IS 'Secondary brand color (hex)';
COMMENT ON COLUMN public.organizer_hackathons.accent_color IS 'Accent brand color (hex)';
COMMENT ON COLUMN public.organizer_hackathons.font_style IS 'Font style theme for hackathon page';

-- ============================================
-- 2. ROLE TAGS FOR TEAM MEMBERS
-- Add role field to hackathon_registrations for team roles
-- ============================================

ALTER TABLE public.hackathon_registrations
ADD COLUMN IF NOT EXISTS team_role text;

-- Add check constraint for team_role if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'hackathon_registrations_team_role_check'
  ) THEN
    ALTER TABLE public.hackathon_registrations 
    ADD CONSTRAINT hackathon_registrations_team_role_check 
    CHECK (team_role IS NULL OR team_role IN ('leader', 'developer', 'designer', 'pm', 'marketing', 'other'));
  END IF;
END $$;

COMMENT ON COLUMN public.hackathon_registrations.team_role IS 'Role within the team (developer, designer, pm, etc.)';

-- Update existing team leaders
UPDATE public.hackathon_registrations hr
SET team_role = 'leader'
WHERE EXISTS (
  SELECT 1 FROM public.hackathon_teams ht 
  WHERE ht.id = hr.team_id AND ht.team_leader_id = hr.user_id
) AND hr.team_role IS NULL;

-- ============================================
-- 3. SUBMISSION GALLERY IMAGES
-- Add gallery_images field to submissions if not exists
-- ============================================

ALTER TABLE public.hackathon_submissions
ADD COLUMN IF NOT EXISTS gallery_images text[] DEFAULT '{}';

COMMENT ON COLUMN public.hackathon_submissions.gallery_images IS 'Array of screenshot/gallery image URLs';

-- ============================================
-- 4. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_registrations_team_role ON public.hackathon_registrations(team_role);
CREATE INDEX IF NOT EXISTS idx_submissions_track ON public.hackathon_submissions(track);
CREATE INDEX IF NOT EXISTS idx_submissions_score ON public.hackathon_submissions(score);

-- ============================================
-- 5. POST-EVENT STATS SUMMARY VIEW
-- Create a view for comprehensive hackathon statistics
-- ============================================

DROP VIEW IF EXISTS public.hackathon_stats_summary;
CREATE VIEW public.hackathon_stats_summary AS
SELECT 
  h.id as hackathon_id,
  h.hackathon_name,
  h.slug,
  h.start_date,
  h.end_date,
  h.status,
  h.views_count,
  h.registrations_count,
  h.organizer_id,
  
  -- Registration stats
  (SELECT COUNT(*) FROM hackathon_registrations r WHERE r.hackathon_id = h.id) as total_registrations,
  (SELECT COUNT(*) FROM hackathon_registrations r WHERE r.hackathon_id = h.id AND r.status = 'confirmed') as confirmed_registrations,
  (SELECT COUNT(*) FROM hackathon_registrations r WHERE r.hackathon_id = h.id AND r.status = 'checked_in') as checked_in_count,
  (SELECT COUNT(*) FROM hackathon_registrations r WHERE r.hackathon_id = h.id AND r.status = 'waitlist') as waitlist_count,
  
  -- Team stats
  (SELECT COUNT(*) FROM hackathon_teams t WHERE t.hackathon_id = h.id) as total_teams,
  (SELECT COUNT(*) FROM hackathon_teams t WHERE t.hackathon_id = h.id AND t.status = 'active') as active_teams,
  
  -- Submission stats
  (SELECT COUNT(*) FROM hackathon_submissions s WHERE s.hackathon_id = h.id) as total_submissions,
  (SELECT COUNT(*) FROM hackathon_submissions s WHERE s.hackathon_id = h.id AND s.status = 'submitted') as submitted_projects,
  (SELECT COUNT(DISTINCT s.track) FROM hackathon_submissions s WHERE s.hackathon_id = h.id AND s.track IS NOT NULL) as tracks_with_submissions,
  
  -- Scoring stats
  (SELECT COUNT(*) FROM hackathon_submissions s WHERE s.hackathon_id = h.id AND s.score IS NOT NULL) as scored_submissions,
  (SELECT AVG(s.score) FROM hackathon_submissions s WHERE s.hackathon_id = h.id AND s.score IS NOT NULL) as avg_score,
  
  -- Judge stats
  (SELECT COUNT(*) FROM judge_hackathon_assignments j WHERE j.hackathon_id = h.id AND j.status = 'active') as assigned_judges,
  
  -- Experience level distribution
  (SELECT COUNT(*) FROM hackathon_registrations r WHERE r.hackathon_id = h.id AND r.experience_level = 'beginner') as beginners_count,
  (SELECT COUNT(*) FROM hackathon_registrations r WHERE r.hackathon_id = h.id AND r.experience_level = 'intermediate') as intermediate_count,
  (SELECT COUNT(*) FROM hackathon_registrations r WHERE r.hackathon_id = h.id AND r.experience_level = 'advanced') as advanced_count,
  
  -- Winners
  (SELECT COUNT(*) FROM hackathon_winners w WHERE w.hackathon_id = h.id) as winners_count,
  h.winners_announced

FROM public.organizer_hackathons h;

-- ============================================
-- 6. TEAM ROLE DISTRIBUTION VIEW
-- Create a view for team role analytics
-- ============================================

DROP VIEW IF EXISTS public.hackathon_team_role_distribution;
CREATE VIEW public.hackathon_team_role_distribution AS
SELECT 
  h.id as hackathon_id,
  h.hackathon_name,
  h.organizer_id,
  r.team_role,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (PARTITION BY h.id), 0), 2) as percentage
FROM public.organizer_hackathons h
LEFT JOIN public.hackathon_registrations r ON r.hackathon_id = h.id AND r.team_id IS NOT NULL
GROUP BY h.id, h.hackathon_name, h.organizer_id, r.team_role
ORDER BY h.id, count DESC;

-- ============================================
-- 7. TRACK-WISE SCORING SUMMARY VIEW
-- Create a view for track-based scoring analytics
-- ============================================

DROP VIEW IF EXISTS public.hackathon_track_scoring;
CREATE VIEW public.hackathon_track_scoring AS
SELECT 
  h.id as hackathon_id,
  h.hackathon_name,
  h.organizer_id,
  COALESCE(s.track, 'No Track') as track_name,
  COUNT(*) as submission_count,
  COUNT(CASE WHEN s.score IS NOT NULL THEN 1 END) as scored_count,
  AVG(s.score) as avg_score,
  MIN(s.score) as min_score,
  MAX(s.score) as max_score,
  ROUND(COUNT(CASE WHEN s.score IS NOT NULL THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2) as scoring_progress
FROM public.organizer_hackathons h
LEFT JOIN public.hackathon_submissions s ON s.hackathon_id = h.id AND s.status = 'submitted'
GROUP BY h.id, h.hackathon_name, h.organizer_id, s.track
ORDER BY h.id, submission_count DESC;

-- ============================================
-- 8. FUNCTION: Get Hackathon Stats
-- ============================================

CREATE OR REPLACE FUNCTION public.get_hackathon_stats(p_hackathon_id integer)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'hackathon_id', h.id,
    'hackathon_name', h.hackathon_name,
    'total_registrations', (SELECT COUNT(*) FROM hackathon_registrations r WHERE r.hackathon_id = h.id),
    'confirmed_registrations', (SELECT COUNT(*) FROM hackathon_registrations r WHERE r.hackathon_id = h.id AND r.status = 'confirmed'),
    'checked_in_count', (SELECT COUNT(*) FROM hackathon_registrations r WHERE r.hackathon_id = h.id AND r.status = 'checked_in'),
    'total_teams', (SELECT COUNT(*) FROM hackathon_teams t WHERE t.hackathon_id = h.id),
    'total_submissions', (SELECT COUNT(*) FROM hackathon_submissions s WHERE s.hackathon_id = h.id),
    'scored_submissions', (SELECT COUNT(*) FROM hackathon_submissions s WHERE s.hackathon_id = h.id AND s.score IS NOT NULL),
    'avg_score', (SELECT ROUND(AVG(s.score)::numeric, 2) FROM hackathon_submissions s WHERE s.hackathon_id = h.id AND s.score IS NOT NULL),
    'assigned_judges', (SELECT COUNT(*) FROM judge_hackathon_assignments j WHERE j.hackathon_id = h.id AND j.status = 'active'),
    'views_count', h.views_count,
    'experience_distribution', (
      SELECT json_build_object(
        'beginner', COUNT(*) FILTER (WHERE r.experience_level = 'beginner'),
        'intermediate', COUNT(*) FILTER (WHERE r.experience_level = 'intermediate'),
        'advanced', COUNT(*) FILTER (WHERE r.experience_level = 'advanced')
      )
      FROM hackathon_registrations r WHERE r.hackathon_id = h.id
    ),
    'team_role_distribution', (
      SELECT COALESCE(json_agg(json_build_object('role', team_role, 'count', cnt)), '[]'::json)
      FROM (
        SELECT team_role, COUNT(*) as cnt
        FROM hackathon_registrations r 
        WHERE r.hackathon_id = h.id AND r.team_id IS NOT NULL AND r.team_role IS NOT NULL
        GROUP BY team_role
      ) roles
    ),
    'track_stats', (
      SELECT COALESCE(json_agg(json_build_object(
        'track', COALESCE(track, 'No Track'),
        'submissions', cnt,
        'scored', scored_cnt,
        'avg_score', avg_scr
      )), '[]'::json)
      FROM (
        SELECT 
          track, 
          COUNT(*) as cnt,
          COUNT(*) FILTER (WHERE score IS NOT NULL) as scored_cnt,
          ROUND(AVG(score)::numeric, 2) as avg_scr
        FROM hackathon_submissions s 
        WHERE s.hackathon_id = h.id
        GROUP BY track
      ) tracks
    )
  ) INTO result
  FROM organizer_hackathons h
  WHERE h.id = p_hackathon_id;
  
  RETURN result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_hackathon_stats(integer) TO authenticated;

-- ============================================
-- 9. GRANT SELECT ON VIEWS
-- Views inherit table permissions but we grant explicitly for clarity
-- ============================================

GRANT SELECT ON public.hackathon_stats_summary TO authenticated;
GRANT SELECT ON public.hackathon_team_role_distribution TO authenticated;
GRANT SELECT ON public.hackathon_track_scoring TO authenticated;
