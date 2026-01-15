-- Create featured_hackathons table to store which hackathons are featured on landing page
CREATE TABLE IF NOT EXISTS public.featured_hackathons (
  id integer PRIMARY KEY DEFAULT 1,
  slot_1_type text CHECK (slot_1_type IN ('admin', 'organizer')),
  slot_1_id integer,
  slot_2_type text CHECK (slot_2_type IN ('admin', 'organizer')),
  slot_2_id integer,
  slot_3_type text CHECK (slot_3_type IN ('admin', 'organizer')),
  slot_3_id integer,
  slot_4_type text CHECK (slot_4_type IN ('admin', 'organizer')),
  slot_4_id integer,
  slot_5_type text CHECK (slot_5_type IN ('admin', 'organizer')),
  slot_5_id integer,
  slot_6_type text CHECK (slot_6_type IN ('admin', 'organizer')),
  slot_6_id integer,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Insert default row
INSERT INTO public.featured_hackathons (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.featured_hackathons ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.featured_hackathons
  FOR SELECT USING (true);

-- Allow admins to update
CREATE POLICY "Allow admins to update" ON public.featured_hackathons
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE user_id = auth.uid()
      AND role IN ('super_admin', 'admin')
    )
  );
