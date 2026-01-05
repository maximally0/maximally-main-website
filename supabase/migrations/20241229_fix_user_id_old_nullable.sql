-- Make user_id_old nullable since we're now using user_id (uuid) as the primary user reference
ALTER TABLE public.hackathon_registrations 
ALTER COLUMN user_id_old DROP NOT NULL;
