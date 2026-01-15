-- Create featured_blogs table to store which blogs are featured on landing page
CREATE TABLE IF NOT EXISTS public.featured_blogs (
  id integer PRIMARY KEY DEFAULT 1,
  slot_1_id integer REFERENCES public.blogs(id),
  slot_2_id integer REFERENCES public.blogs(id),
  slot_3_id integer REFERENCES public.blogs(id),
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Insert default row
INSERT INTO public.featured_blogs (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.featured_blogs ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.featured_blogs
  FOR SELECT USING (true);

-- Allow admins to update
CREATE POLICY "Allow admins to update" ON public.featured_blogs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE user_id = auth.uid()
      AND role IN ('super_admin', 'admin')
    )
  );
