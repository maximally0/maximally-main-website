/**
 * React hooks for blog data using API client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured: boolean;
  published: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
  views?: number;
  profiles?: {
    username?: string;
    full_name?: string;
  };
}

interface UseBlogsOptions {
  featured?: boolean;
  limit?: number;
  offset?: number;
  autoFetch?: boolean;
}

export function useBlogs(options: UseBlogsOptions = {}) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const { autoFetch = true, ...fetchOptions } = options;

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiClient.getBlogs(fetchOptions);
      
      if (result.success) {
        setBlogs(result.data.blogs);
        setTotal(result.data.total || 0);
      } else {
        setError(result.error || 'Failed to fetch blogs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchBlogs();
    }
  }, [autoFetch, JSON.stringify(fetchOptions)]);

  return {
    blogs,
    loading,
    error,
    total,
    refetch: fetchBlogs,
  };
}

export function useBlog(slug: string) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlog = async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiClient.getBlogBySlug(slug);
      
      if (result.success) {
        setBlog(result.data.blog);
      } else {
        setError(result.error || 'Blog not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  return {
    blog,
    loading,
    error,
    refetch: fetchBlog,
  };
}