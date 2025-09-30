import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Make Supabase optional - only create client if credentials are provided
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  author_name: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  tags: string;
  reading_time_minutes: number | null;
}
