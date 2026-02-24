import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/lib/supabaseClient';

export const useBlogs = (page = 1, pageSize = 10, search = '') => {
  return useQuery({
    queryKey: ['blogs', page, pageSize, search],
    queryFn: async (): Promise<{ data: BlogPost[]; total: number }> => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (search.trim()) {
        params.set('search', search);
      }

      const res = await fetch(`/api/blogs?${params.toString()}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Failed to fetch blogs (${res.status})`);
      }

      const json = await res.json();
      return {
        data: json.data || [],
        total: json.total || 0,
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

export const useBlog = (slug: string) => {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async (): Promise<BlogPost | null> => {
      const res = await fetch(`/api/blogs/${encodeURIComponent(slug)}`);
      if (res.status === 404) {
        return null;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Failed to fetch blog (${res.status})`);
      }

      const json = await res.json();
      return json.data || null;
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
  const plain = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = plain ? plain.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
};

export const formatReadingTime = (
  databaseMinutes: number | string | null | undefined,
  fallbackContent?: string
): string => {
  if (databaseMinutes !== null && databaseMinutes !== undefined) {
    const parsed = Number(databaseMinutes);
    if (!Number.isNaN(parsed)) {
      const mins = Math.max(1, Math.floor(parsed));
      return `${mins} min read`;
    }
  }

  if (fallbackContent) {
    return calculateReadTime(fallbackContent);
  }

  return '2 min read';
};
