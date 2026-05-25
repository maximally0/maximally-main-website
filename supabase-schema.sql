-- ═══════════════════════════════════════════════════════════════
-- Maximally Database Schema for Supabase
-- Run this in Supabase SQL Editor to set up a fresh project
-- ═══════════════════════════════════════════════════════════════

-- 1. Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  email TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  role TEXT DEFAULT 'participant' CHECK (role IN ('user', 'participant', 'mentor', 'judge', 'organizer', 'admin')),
  admin_role TEXT CHECK (admin_role IN ('super_admin', 'admin', 'moderator', 'viewer')),
  is_banned BOOLEAN DEFAULT FALSE,
  ban_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Mentors
CREATE TABLE IF NOT EXISTS mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  skills JSONB DEFAULT '[]',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_session', 'offline')),
  availability JSONB DEFAULT '[]',
  total_mentorship_hours FLOAT DEFAULT 0,
  booking_url TEXT,
  max_concurrent_teams INT DEFAULT 3,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Mentorship Sessions
CREATE TABLE IF NOT EXISTS mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES mentors(id) ON DELETE CASCADE,
  mentee_id UUID REFERENCES profiles(id),
  team_id INT,
  problem_description TEXT NOT NULL,
  requested_time TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_minutes INT,
  session_type TEXT DEFAULT 'help_request',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Mentor Help Request Inbox
CREATE TABLE IF NOT EXISTS mentor_help_request_inbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_user_id UUID REFERENCES profiles(id),
  session_id UUID REFERENCES mentorship_sessions(id),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Judges
CREATE TABLE IF NOT EXISTS judges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  username TEXT,
  full_name TEXT,
  profile_photo TEXT,
  headline TEXT,
  short_bio TEXT,
  judge_location TEXT,
  role_title TEXT,
  company TEXT,
  primary_expertise JSONB DEFAULT '[]',
  secondary_expertise JSONB DEFAULT '[]',
  total_events_judged INT DEFAULT 0,
  total_teams_evaluated INT DEFAULT 0,
  total_mentorship_hours FLOAT DEFAULT 0,
  years_of_experience INT DEFAULT 0,
  average_feedback_rating FLOAT,
  events_judged_verified BOOLEAN DEFAULT FALSE,
  teams_evaluated_verified BOOLEAN DEFAULT FALSE,
  mentorship_hours_verified BOOLEAN DEFAULT FALSE,
  feedback_rating_verified BOOLEAN DEFAULT FALSE,
  linkedin TEXT,
  github TEXT,
  twitter TEXT,
  website TEXT,
  languages_spoken JSONB DEFAULT '[]',
  public_achievements TEXT,
  mentorship_statement TEXT,
  availability_status TEXT DEFAULT 'available',
  tier TEXT DEFAULT 'starter',
  is_published BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  email TEXT,
  phone TEXT,
  resume TEXT,
  proof_of_judging TEXT,
  timezone TEXT,
  calendar_link TEXT,
  compensation_preference TEXT DEFAULT 'volunteer',
  judge_references TEXT,
  conflict_of_interest TEXT,
  agreed_to_nda BOOLEAN DEFAULT FALSE,
  address TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Judge Events (judging history)
CREATE TABLE IF NOT EXISTS judge_events (
  id SERIAL PRIMARY KEY,
  judge_id UUID REFERENCES profiles(id),
  event_name TEXT NOT NULL,
  role TEXT,
  date TEXT,
  event_link TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Judge Evaluations (new evaluation portal)
CREATE TABLE IF NOT EXISTS judge_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id UUID REFERENCES judges(id),
  submission_id INT,
  hackathon_id INT,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted')),
  rubric_scores JSONB DEFAULT '{}',
  comments TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Organizer Hackathons
CREATE TABLE IF NOT EXISTS organizer_hackathons (
  id SERIAL PRIMARY KEY,
  organizer_id UUID REFERENCES profiles(id),
  hackathon_name TEXT NOT NULL,
  name TEXT,
  title TEXT,
  slug TEXT UNIQUE,
  description TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  registration_deadline TIMESTAMPTZ,
  location TEXT,
  mode TEXT DEFAULT 'online',
  max_participants INT,
  prize_pool TEXT,
  status TEXT DEFAULT 'draft',
  cover_image TEXT,
  tags JSONB DEFAULT '[]',
  tracks JSONB DEFAULT '[]',
  rules TEXT,
  eligibility TEXT,
  schedule JSONB DEFAULT '[]',
  sponsors JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Hackathon Registrations
CREATE TABLE IF NOT EXISTS hackathon_registrations (
  id SERIAL PRIMARY KEY,
  hackathon_id INT REFERENCES organizer_hackathons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  team_name TEXT,
  status TEXT DEFAULT 'registered',
  custom_answers JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Hackathon Submissions
CREATE TABLE IF NOT EXISTS hackathon_submissions (
  id SERIAL PRIMARY KEY,
  hackathon_id INT REFERENCES organizer_hackathons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  team_id INT,
  project_name TEXT NOT NULL,
  project_description TEXT,
  demo_url TEXT,
  repo_url TEXT,
  video_url TEXT,
  submission_url TEXT,
  github_url TEXT,
  team_name TEXT,
  description TEXT,
  track TEXT,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Blogs
CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  cover_image TEXT,
  author_name TEXT,
  author_id UUID REFERENCES profiles(id),
  tags JSONB DEFAULT '[]',
  reading_time_minutes INT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- 13. Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id),
  hackathon_id INT REFERENCES organizer_hackathons(id),
  recipient_name TEXT NOT NULL,
  hackathon_name TEXT NOT NULL,
  certificate_type TEXT DEFAULT 'participation',
  issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Role Audit Logs
CREATE TABLE IF NOT EXISTS role_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id UUID REFERENCES profiles(id),
  admin_user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  previous_role TEXT,
  new_role TEXT,
  previous_admin_role TEXT,
  new_admin_role TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Admin Roles (optional separate table)
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES profiles(id),
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Judge Requests (invitations between organizers and judges)
CREATE TABLE IF NOT EXISTS judge_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hackathon_id INT REFERENCES organizer_hackathons(id),
  judge_id UUID REFERENCES profiles(id),
  organizer_id UUID REFERENCES profiles(id),
  request_type TEXT DEFAULT 'organizer_invite',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Organizer Applications
CREATE TABLE IF NOT EXISTS organizer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  organization_name TEXT,
  reason TEXT,
  experience TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- Indexes for performance
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_mentors_user_id ON mentors(user_id);
CREATE INDEX IF NOT EXISTS idx_mentors_is_active ON mentors(is_active);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_mentor ON mentorship_sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_mentee ON mentorship_sessions(mentee_id);
CREATE INDEX IF NOT EXISTS idx_judges_user_id ON judges(user_id);
CREATE INDEX IF NOT EXISTS idx_judge_evaluations_judge ON judge_evaluations(judge_id);
CREATE INDEX IF NOT EXISTS idx_hackathons_slug ON organizer_hackathons(slug);
CREATE INDEX IF NOT EXISTS idx_hackathons_organizer ON organizer_hackathons(organizer_id);
CREATE INDEX IF NOT EXISTS idx_submissions_hackathon ON hackathon_submissions(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published);
