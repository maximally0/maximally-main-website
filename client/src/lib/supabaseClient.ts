import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Make Supabase optional - only create client if credentials are provided
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface BlogPost {
  // DB uses integer ids
  id: number;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  author_name?: string | null;
  status: 'draft' | 'published';
  created_at: string | null;
  updated_at: string | null;
  // tags is jsonb in the database — could be an array or a string or null
  tags?: string | string[] | null;
  reading_time_minutes?: number | null;
}
