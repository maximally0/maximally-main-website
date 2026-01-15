-- Migration: Add invite_token to hackathon_organizers
-- This enables direct link-based organizer team joining

-- Add invite_token column
ALTER TABLE public.hackathon_organizers 
ADD COLUMN IF NOT EXISTS invite_token text UNIQUE;

-- Add expires_at column for token expiry
ALTER TABLE public.hackathon_organizers 
ADD COLUMN IF NOT EXISTS invite_expires_at timestamptz;

-- Create index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_hackathon_organizers_invite_token 
ON public.hackathon_organizers(invite_token) 
WHERE invite_token IS NOT NULL;

-- Comment
COMMENT ON COLUMN public.hackathon_organizers.invite_token IS 'Secure token for direct link-based organizer team joining';
COMMENT ON COLUMN public.hackathon_organizers.invite_expires_at IS 'Expiry time for the invite token';
