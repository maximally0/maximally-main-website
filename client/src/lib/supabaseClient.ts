import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create supabase client only if environment variables are provided
// This allows the app to run without Supabase for static content
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Narrow type for event listings (used by dynamic Events page)
export type HackathonListItem = {
  title: string;
  subtitle: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
  duration: string;
  status: string | null;
  focus_areas: any; // jsonb (array of strings or object)
  devpost_url: string | null;
  devpost_register_url: string | null;
};

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
