-- Create signup_otps table for persistent OTP storage in serverless environment
CREATE TABLE IF NOT EXISTS public.signup_otps (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  otp_hash text NOT NULL,
  password_encrypted text NOT NULL,
  name text,
  username text,
  expires_at timestamp with time zone NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT signup_otps_pkey PRIMARY KEY (id)
);

-- Create index for faster lookups by email
CREATE INDEX IF NOT EXISTS idx_signup_otps_email ON public.signup_otps(email);

-- Create index for cleanup of expired OTPs
CREATE INDEX IF NOT EXISTS idx_signup_otps_expires_at ON public.signup_otps(expires_at);

-- Enable RLS
ALTER TABLE public.signup_otps ENABLE ROW LEVEL SECURITY;

-- Only service role can access this table (no public access)
-- This is handled by default since we're not creating any policies

-- Create a function to automatically clean up expired OTPs
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM public.signup_otps WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create a scheduled job to clean up expired OTPs (requires pg_cron extension)
-- If pg_cron is available, uncomment the following:
-- SELECT cron.schedule('cleanup-expired-otps', '*/10 * * * *', 'SELECT cleanup_expired_otps()');

COMMENT ON TABLE public.signup_otps IS 'Temporary storage for signup OTPs - entries are deleted after verification or expiration';
