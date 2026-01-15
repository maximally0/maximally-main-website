-- Migration: Add auto_publish_gallery setting to organizer_hackathons
-- This allows organizers to choose between automatic gallery publication (when hackathon ends)
-- or manual publication (via "Make Gallery Public" button)

-- Add auto_publish_gallery column (default: false for manual control)
ALTER TABLE public.organizer_hackathons
ADD COLUMN IF NOT EXISTS auto_publish_gallery boolean DEFAULT false;

-- Add comment explaining the column
COMMENT ON COLUMN public.organizer_hackathons.auto_publish_gallery IS 
'When true, gallery automatically goes public when hackathon ends (UTC). When false, organizer must manually click "Make Gallery Public" button.';
