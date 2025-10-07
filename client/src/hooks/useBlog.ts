import { useQuery } from '@tanstack/react-query';
import { supabase, BlogPost } from '@/lib/supabaseClient';

export const useBlogs = (page = 1, pageSize = 10, search = '') => {
  return useQuery({
    queryKey: ['blogs', page, pageSize, search],
    queryFn: async (): Promise<{ data: BlogPost[]; total: number }> => {
      if (!supabase) {
        return { data: [], total: 0 };
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
    retry: (failureCount, error: any) => {
      console.error(`⚠️ useBlogs retry attempt ${failureCount}:`, error);
      // Only retry network errors, not configuration errors
      if (failureCount >= 3) return false;
      if (error?.message?.includes('not configured')) return false;
      return true;
    }
  });
};

export const useBlog = (slug: string) => {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async (): Promise<BlogPost | null> => {
      // Return null if Supabase is not configured
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
  if (!content) return '1 min read';
  // strip HTML tags if present
  const plain = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = plain ? plain.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
};

export const formatReadingTime = (
  databaseMinutes: number | string | null | undefined,
  fallbackContent?: string
): string => {
  // Use DB value if present (not null/undefined). Accept numbers or numeric strings.
  if (databaseMinutes !== null && databaseMinutes !== undefined) {
    const parsed = Number(databaseMinutes);
    if (!Number.isNaN(parsed)) {
      const mins = Math.max(1, Math.floor(parsed));
      return `${mins} min read`;
    }
    // If DB value is present but not parseable, fall back to calculated time below
  }

  // Fallback to calculated reading time if we have content
  if (fallbackContent) {
    return calculateReadTime(fallbackContent);
  }

  // Last resort fallback
  return '2 min read';
};
