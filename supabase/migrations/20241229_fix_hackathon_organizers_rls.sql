-- Fix infinite recursion in hackathon_organizers RLS policies
-- The issue is that the "Co-organizers can view hackathon organizers" policy 
-- references the same table it's protecting, causing infinite recursion

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Co-organizers can view hackathon organizers" ON public.hackathon_organizers;
DROP POLICY IF EXISTS "Owners can manage hackathon organizers" ON public.hackathon_organizers;
DROP POLICY IF EXISTS "Users can manage own organizer invitations" ON public.hackathon_organizers;
DROP POLICY IF EXISTS "Users can view hackathon organizers" ON public.hackathon_organizers;

-- Policy 1: Hackathon owners can do everything (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Owners can manage hackathon organizers" ON public.hackathon_organizers
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM organizer_hackathons oh
    WHERE oh.id = hackathon_organizers.hackathon_id 
    AND oh.organizer_id = auth.uid()::text
  )
);

-- Policy 2: Users can view their own invitations (for the invitations dashboard)
CREATE POLICY "Users can view own invitations" ON public.hackathon_organizers
FOR SELECT
USING (user_id::text = auth.uid()::text);

-- Policy 3: Users can update their own invitations (accept/decline)
CREATE POLICY "Users can update own invitations" ON public.hackathon_organizers
FOR UPDATE
USING (user_id::text = auth.uid()::text);
