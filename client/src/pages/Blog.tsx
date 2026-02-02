import { useEffect, useState, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Footer from '@/components/Footer';
import BlogCard, { BlogCardProps } from '@/components/BlogCard';
import { useBlogs, generateExcerpt, calculateReadTime, formatReadingTime } from '@/hooks/useBlog';
import { format } from 'date-fns';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Static blog posts array removed - now using only Supabase blogs
const blogPosts: any[] = [];
const POSTS_PER_PAGE = 10;

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data: dynamicBlogData, isLoading: dynamicLoading, error: dynamicError } = useBlogs(1, 1000, '');


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allPosts = useMemo(() => {
    const staticPosts: BlogCardProps[] = blogPosts.map(post => ({
      title: post.title,
      excerpt: post.excerpt,
      date: format(new Date(post.date), 'MMMM d, yyyy'),
      readTime: post.readTime,
      category: post.category || 'Blog',
      // BlogCardProps requires a string link — ensure fallback string
      link: post.link || '#',
      // static posts have no cover image or author by design
      coverImage: undefined,
      authorName: undefined,
    }));

    const dynamicPosts: BlogCardProps[] = (dynamicBlogData?.data || []).map(post => ({
      title: post.title,
      excerpt: generateExcerpt(post.content || ''),
      date: format(new Date(post.created_at || ''), 'MMMM d, yyyy'),
      readTime: formatReadingTime(post.reading_time_minutes ?? null, post.content || ''),
      // Normalize tags which may be jsonb (array or string) into a single string category
      category: Array.isArray(post.tags) ? (post.tags[0] || 'AI Hackathons') : (typeof post.tags === 'string' ? post.tags : 'AI Hackathons'),
      link: `/blog/${post.slug ?? ''}`,
      // convert null cover_image to undefined so it matches BlogCardProps optional string
      coverImage: post.cover_image ?? undefined,
      authorName: post.author_name ?? undefined,
    }));

    // Combine and sort by date (most recent first)
    const combined = [...dynamicPosts, ...staticPosts];
    return combined.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [dynamicBlogData]);

  const filteredPosts = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return allPosts;

    const searchLower = debouncedSearchTerm.toLowerCase();
    return allPosts.filter(post =>
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.category.toLowerCase().includes(searchLower)
    );
  }, [allPosts, debouncedSearchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Handle pagination
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFirstPage = useCallback(() => {
    setCurrentPage(1);
    scrollToTop();
  }, [scrollToTop]);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
    scrollToTop();
  }, [scrollToTop]);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
    scrollToTop();
  }, [totalPages, scrollToTop]);

  const handleLastPage = useCallback(() => {
    setCurrentPage(totalPages);
    scrollToTop();
  }, [totalPages, scrollToTop]);

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
    scrollToTop();
  }, [scrollToTop]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.10)_0%,transparent_50%)]" />
      
      <div className="absolute top-20 left-[5%] w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
      <div className="absolute top-40 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-28 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-purple-500/10 border border-purple-500/30">
            <Search className="w-4 h-4 text-purple-400" />
            <span className="font-press-start text-[10px] sm:text-xs text-purple-300 tracking-wider">
              INSIGHTS & GUIDES
            </span>
          </div>
          <h1 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Maximally Blog
            </span>
          </h1>
          <p className="font-jetbrains text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Stories, guides, and insights for teen builders and innovators.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative mb-8 sm:mb-12">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="font-jetbrains pl-12 h-12 sm:h-10 text-base sm:text-sm bg-black/50 border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Loading State */}
          {dynamicLoading && (
            <div className="space-y-6 md:space-y-8 mb-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-gray-900/50 border border-purple-500/20 p-4 md:p-6 lg:p-8">
                  <div className="animate-pulse">
                    {index === 0 && (
                      <div className="mb-4">
                        <div className="relative w-full bg-gray-800" style={{ aspectRatio: '16/9' }}></div>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                      <div className="bg-gray-800 h-6 w-20"></div>
                      <div className="bg-gray-800 h-4 w-24"></div>
                      <div className="bg-gray-800 h-4 w-16"></div>
                    </div>
                    <div className="bg-gray-800 h-6 w-3/4 mb-3"></div>
                    <div className="space-y-2 mb-4">
                      <div className="bg-gray-800 h-4 w-full"></div>
                      <div className="bg-gray-800 h-4 w-2/3"></div>
                      <div className="bg-gray-800 h-4 w-1/2"></div>
                    </div>
                    <div className="bg-gray-800 h-6 w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results count */}
          {!dynamicLoading && (
            <div className="mb-6 font-jetbrains text-sm sm:text-base text-gray-400">
              {filteredPosts.length > 0 ? (
                <>
                  Showing {((currentPage - 1) * POSTS_PER_PAGE) + 1}-{Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length} posts
                  {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
                </>
              ) : (
                <>No posts found{debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}</>
              )}
            </div>
          )}

          {/* Blog Posts Grid */}
          <div className="space-y-6 md:space-y-8">
            {paginatedPosts.map((post, index) => (
              <BlogCard
                key={`${post.title}-${index}`}
                title={post.title}
                excerpt={post.excerpt}
                date={post.date}
                readTime={post.readTime}
                category={post.category}
                link={post.link}
                coverImage={post.coverImage}
                authorName={post.authorName}
              />
            ))}
          </div>

          {/* No results message */}
          {!dynamicLoading && paginatedPosts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="font-press-start text-lg text-gray-300 mb-4">
                No posts found
              </h3>
              <p className="font-jetbrains text-gray-500 mb-6">
                {debouncedSearchTerm
                  ? `No posts match your search for "${debouncedSearchTerm}"`
                  : "No posts available at the moment"}
              </p>
              {debouncedSearchTerm && (
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="outline"
                  className="font-press-start border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {!dynamicLoading && totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 sm:gap-6 mt-12 mb-8 pt-8 border-t border-purple-500/20">
              <div className="flex items-center justify-center gap-1 sm:gap-2 order-1 sm:order-2 w-full sm:w-auto">
                <Button
                  onClick={handleFirstPage}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="font-press-start min-h-[44px] px-3 sm:px-4 text-xs sm:text-sm flex-shrink-0 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-colors duration-200 disabled:opacity-30"
                  title="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">First</span>
                </Button>
                <Button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="font-press-start min-h-[44px] px-3 sm:px-4 text-xs sm:text-sm flex-shrink-0 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-colors duration-200 disabled:opacity-30"
                  title="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Prev</span>
                </Button>
                <div className="bg-purple-500/20 border border-purple-500/50 text-purple-300 px-3 sm:px-4 py-2 font-press-start text-xs sm:text-sm min-h-[44px] flex items-center">
                  <span className="hidden sm:inline">Page </span>
                  <span className="mx-1 font-bold">{currentPage}</span>
                  <span className="hidden sm:inline">of {totalPages}</span>
                  <span className="sm:hidden">/{totalPages}</span>
                </div>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="font-press-start min-h-[44px] px-3 sm:px-4 text-xs sm:text-sm flex-shrink-0 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-colors duration-200 disabled:opacity-30"
                  title="Next page"
                >
                  <span className="hidden sm:inline mr-1">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleLastPage}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="font-press-start min-h-[44px] px-3 sm:px-4 text-xs sm:text-sm flex-shrink-0 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-colors duration-200 disabled:opacity-30"
                  title="Last page"
                >
                  <span className="hidden sm:inline mr-1">Last</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Spacer before footer */}
          <div className="mt-16 sm:mt-20 md:mt-24"></div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
