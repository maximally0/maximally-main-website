import { lazy } from 'react';

// Static blog components disabled - now using only Supabase blogs
export const staticBlogComponents = {
  // All static blog components commented out to use only Supabase blogs
};

export const isStaticBlogPost = (slug: string): boolean => {
  // Always return false to disable static blogs and use only Supabase blogs
  return false;
};

export const getStaticBlogComponent = (slug: string) => {
  // Return null since static blogs are disabled
  return null;
};
