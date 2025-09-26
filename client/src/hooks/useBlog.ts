import { useQuery } from '@tanstack/react-query';
import { supabase, BlogPost } from '@/lib/supabaseClient';

export const useBlogs = (page = 1, pageSize = 10, search = '') => {
  return useQuery({
    queryKey: ['blogs', page, pageSize, search],
    queryFn: async (): Promise<{ data: BlogPost[]; total: number }> => {
      // If Supabase is not configured, return empty results
      if (!supabase) {
        return {
          data: [],
          total: 0,
        };
      }

      let query = supabase
        .from('blogs')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (search.trim()) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Failed to fetch blogs: ${error.message}`);
      }

      return {
        data: data || [],
        total: count || 0,
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useBlog = (slug: string) => {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async (): Promise<BlogPost | null> => {
      // If Supabase is not configured, return null
      if (!supabase) {
        return null;
      }

      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to fetch blog: ${error.message}`);
      }

      return data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const generateExcerpt = (content: string, maxLength = 150): string => {
  const plainText = content
    .replace(/[#*_~`]/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/\n/g, ' ')
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

export const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};
