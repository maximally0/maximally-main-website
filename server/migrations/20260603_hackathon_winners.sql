-- Manual hackathon winners CMS support.
-- Run this in the Supabase SQL editor or through a DB connection with DDL access.

alter table organizer_hackathons
  add column if not exists winners_announced boolean not null default false,
  add column if not exists winners_announced_at timestamptz;

alter table hackathon_submissions
  add column if not exists prize_won text;

create table if not exists hackathon_winners (
  id bigserial primary key,
  hackathon_id integer not null references organizer_hackathons(id) on delete cascade,
  submission_id integer references hackathon_submissions(id) on delete set null,
  user_id uuid references profiles(id) on delete set null,
  team_id integer,
  position integer not null default 1,
  prize_name text,
  prize_position text not null,
  prize_amount text,
  score numeric,
  team_name text,
  project_title text,
  description text,
  demo_url text,
  github_url text,
  track text,
  winner_type text not null default 'overall',
  status text not null default 'published',
  announced_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_hackathon_winners_hackathon
  on hackathon_winners(hackathon_id, position);

create index if not exists idx_hackathon_winners_submission
  on hackathon_winners(submission_id);
