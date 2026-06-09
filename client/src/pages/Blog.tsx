import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, ArrowRight, BookOpen, Folder, Tag } from 'lucide-react';
import Footer from '@/components/Footer';
import { generateExcerpt, formatReadingTime } from '@/hooks/useBlog';
import { format } from 'date-fns';
import SEO from '@/components/SEO';

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  link: string;
  coverImage?: string;
  authorName?: string;
}

const POSTS_PER_PAGE = 8;

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [rawPosts, setRawPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Fetch blogs directly from /api/blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        const json = await res.json();
        if (json.success) {
          // Handle both { data: [...] } and { data: { blogs: [...] } } formats
          const posts = Array.isArray(json.data) ? json.data : (json.data?.blogs || []);
          setRawPosts(posts);
        }
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const allPosts: BlogPost[] = useMemo(() => {
    const posts: BlogPost[] = rawPosts.map((post: any) => ({
      title: post.title,
      excerpt: generateExcerpt(post.content || ''),
      date: format(new Date(post.created_at || ''), 'MMM d, yyyy'),
      readTime: formatReadingTime(post.reading_time_minutes ?? null, post.content || ''),
      category: Array.isArray(post.tags) ? (post.tags[0] || 'Building') : (typeof post.tags === 'string' ? post.tags : 'Building'),
      link: `/blog/${post.slug ?? ''}`,
      coverImage: post.cover_image ?? undefined,
      authorName: post.author_name ?? undefined,
    }));
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [rawPosts]);

  // Derive categories with counts
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    allPosts.forEach(p => map.set(p.category, (map.get(p.category) || 0) + 1));
    return [{ name: 'All', count: allPosts.length }, ...Array.from(map.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)];
  }, [allPosts]);

  // Popular topics (top tags)
  const popularTopics = useMemo(() => {
    const tags = new Set<string>();
    allPosts.forEach(p => { if (p.category) tags.add(p.category); });
    return Array.from(tags).slice(0, 8);
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch = !debouncedSearchTerm || post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || post.excerpt.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allPosts, activeCategory, debouncedSearchTerm]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [debouncedSearchTerm, activeCategory]);

  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), []);

  return (
    <>
      <SEO title="Blog — Ideas, Insights, and Lessons | Maximally" description="Practical articles on building, organizing, and shipping products that matter." canonicalUrl="https://maximally.org/blog" />
      <div className="min-h-screen bg-black text-white pt-20 sm:pt-24">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 pb-20">
          {/* Sub-nav */}
          <div className="flex items-center gap-6 border-b border-gray-800 mb-12 pt-8">
            {[
              { label: "Articles", href: "/blog", active: true },
              { label: "Podcasts", href: "/resources/podcasts" },
              { label: "Interviews", href: "/resources/interviews" },
              { label: "Builder Stories", href: "/resources/stories" },
            ].map(tab => (
              <Link key={tab.label} to={tab.href} className={`font-space text-sm pb-3 border-b-2 transition-colors ${tab.active ? "text-orange-400 border-orange-400" : "text-gray-500 border-transparent hover:text-gray-300"}`}>
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
            {/* Main content */}
            <div>
              {/* Header */}
              <div className="mb-10">
                <span className="font-space text-sm text-orange-400 tracking-wide uppercase block mb-3">Articles</span>
                <h1 className="font-space text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight max-w-lg">
                  Ideas, insights, and lessons from the ecosystem
                </h1>
                <p className="font-space text-base text-gray-400 max-w-lg">
                  Practical articles on building, organizing, and shipping products that matter.
                </p>
              </div>

              {/* Search */}
              <div className="relative max-w-md mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search articles..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 text-white font-space text-sm placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50" />
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-5 bg-gray-900/40 border border-gray-800 animate-pulse">
                      <div className="h-4 bg-gray-800 w-20 mb-3" />
                      <div className="h-5 bg-gray-800 w-3/4 mb-2" />
                      <div className="h-4 bg-gray-800 w-full mb-1" />
                      <div className="h-4 bg-gray-800 w-2/3" />
                    </div>
                  ))}
                </div>
              )}

              {/* Posts */}
              {!isLoading && (
                <div className="space-y-5">
                  {paginatedPosts.map((post, i) => (
                    <Link key={i} to={post.link} className="group flex gap-5 p-5 bg-gray-900/40 border border-gray-800 hover:border-orange-500/25 transition-all">
                      {/* Cover image */}
                      {post.coverImage && (
                        <div className="w-40 h-24 bg-gray-800 border border-gray-700 shrink-0 overflow-hidden hidden sm:block">
                          <img src={post.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        </div>
                      )}
                      {!post.coverImage && (
                        <div className="w-40 h-24 bg-gray-800 border border-gray-700 shrink-0 hidden sm:flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="font-space text-[10px] text-orange-400 uppercase tracking-wider font-semibold">{post.category}</span>
                        <h3 className="font-space text-base font-semibold text-white mt-1 group-hover:text-orange-400 transition-colors line-clamp-2">{post.title}</h3>
                        <p className="font-space text-sm text-gray-400 mt-1 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center gap-3 mt-2 font-space text-xs text-gray-500">
                          {post.authorName && <span>{post.authorName}</span>}
                          {post.authorName && <span>•</span>}
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {paginatedPosts.length === 0 && !isLoading && (
                    <div className="text-center py-16">
                      <BookOpen className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                      <p className="font-space text-gray-500">No articles found.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); scrollToTop(); }} disabled={currentPage === 1} className="p-2 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-30 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => { setCurrentPage(page); scrollToTop(); }} className={`w-9 h-9 font-space text-sm font-medium border transition-colors ${currentPage === page ? "bg-orange-500/15 border-orange-500/40 text-orange-400" : "border-gray-800 text-gray-500 hover:text-white hover:border-gray-600"}`}>
                      {page}
                    </button>
                  ))}
                  {totalPages > 5 && <span className="font-space text-gray-600 px-1">…</span>}
                  {totalPages > 5 && (
                    <button onClick={() => { setCurrentPage(totalPages); scrollToTop(); }} className={`w-9 h-9 font-space text-sm font-medium border transition-colors ${currentPage === totalPages ? "bg-orange-500/15 border-orange-500/40 text-orange-400" : "border-gray-800 text-gray-500 hover:text-white hover:border-gray-600"}`}>
                      {totalPages}
                    </button>
                  )}
                  <button onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); scrollToTop(); }} disabled={currentPage === totalPages} className="p-2 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-30 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Categories */}
              <div className="p-5 bg-gray-900/40 border border-gray-800">
                <h3 className="font-space text-sm font-semibold text-white mb-4">Categories</h3>
                <div className="space-y-1.5">
                  {categories.slice(0, 8).map(cat => (
                    <button key={cat.name} onClick={() => setActiveCategory(cat.name)} className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${activeCategory === cat.name ? "text-orange-400" : "text-gray-400 hover:text-gray-300"}`}>
                      <div className="flex items-center gap-2">
                        <Folder className="w-3 h-3" />
                        <span className="font-space text-xs">{cat.name}</span>
                      </div>
                      <span className={`font-space text-xs font-semibold ${activeCategory === cat.name ? "text-orange-400" : "text-gray-600"}`}>{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular topics */}
              {popularTopics.length > 0 && (
                <div className="p-5 bg-gray-900/40 border border-gray-800">
                  <h3 className="font-space text-sm font-semibold text-white mb-4">Popular topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTopics.map(topic => (
                      <button key={topic} onClick={() => setActiveCategory(topic)} className={`px-3 py-1.5 font-space text-xs border transition-colors ${activeCategory === topic ? "bg-orange-500/15 border-orange-500/40 text-orange-400" : "border-gray-700 text-gray-400 hover:text-gray-300 hover:border-gray-600"}`}>
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Blog;
