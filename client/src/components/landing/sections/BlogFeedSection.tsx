import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock, Tag, Loader2 } from "lucide-react";
import blogData from "@/data/blogPosts.json";

const categoryColors: Record<string, string> = {
  "Partnerships": "from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300",
  "Events": "from-red-500/20 to-orange-500/20 border-red-500/40 text-red-300",
  "Innovation": "from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300",
  "Guides": "from-green-500/20 to-emerald-500/20 border-green-500/40 text-green-300",
  "Tutorials": "from-yellow-500/20 to-amber-500/20 border-yellow-500/40 text-yellow-300",
};

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  slug: string;
  featured: boolean;
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const colorClass = categoryColors[post.category] || categoryColors["Guides"];
  
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block relative bg-gradient-to-br from-gray-900/80 via-black to-gray-900/80 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 overflow-hidden animate-fade-in"
      data-testid={`card-blog-${post.id}`}
      style={{ animationDelay: `${index * 100}ms`, isolation: 'isolate' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative p-6 space-y-4 z-10">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-press-start bg-gradient-to-r ${colorClass} border`}>
            <Tag className="w-3 h-3" />
            {post.category.toUpperCase()}
          </span>
          
          <div className="flex items-center gap-1.5 text-gray-500 font-jetbrains text-xs">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </div>
        </div>
        
        <div>
          <h3 className="font-press-start text-xs sm:text-sm text-white group-hover:text-purple-400 transition-colors mb-3 line-clamp-2 leading-relaxed">
            {post.title}
          </h3>
          <p className="text-sm font-jetbrains text-gray-400 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-purple-400 font-press-start text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pt-2">
          <span>READ MORE</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export function BlogFeedSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBlogs();
  }, []);

  const fetchFeaturedBlogs = async () => {
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      // Fetch featured blogs config
      const featuredRes = await fetch(
        `${SUPABASE_URL}/rest/v1/featured_blogs?id=eq.1&select=*`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          }
        }
      );
      
      const featuredData = await featuredRes.json();
      const config = featuredData?.[0];
      
      if (!config) {
        // Fallback to static data
        setPosts(blogData.featuredPosts.slice(0, 3));
        setLoading(false);
        return;
      }

      // Collect blog IDs
      const blogIds: number[] = [];
      for (let i = 1; i <= 3; i++) {
        const id = config[`slot_${i}_id`];
        if (id) blogIds.push(id);
      }

      if (blogIds.length === 0) {
        setPosts(blogData.featuredPosts.slice(0, 3));
        setLoading(false);
        return;
      }

      // Fetch blogs from database
      const blogsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/blogs?id=in.(${blogIds.join(',')})&status=eq.published&select=id,title,slug,excerpt,content,tags,reading_time_minutes`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          }
        }
      );
      
      const blogsData = await blogsRes.json();

      // Helper to extract excerpt from content
      const getExcerpt = (content: string, maxLength: number = 120) => {
        // Remove markdown/HTML tags
        const plainText = content
          .replace(/#{1,6}\s/g, '')
          .replace(/\*\*|__/g, '')
          .replace(/\*|_/g, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/<[^>]+>/g, '')
          .replace(/\n+/g, ' ')
          .trim();
        
        if (plainText.length <= maxLength) return plainText;
        return plainText.substring(0, maxLength).trim() + '...';
      };

      // Map and order by slot
      const orderedPosts: BlogPost[] = [];
      for (let i = 1; i <= 3; i++) {
        const id = config[`slot_${i}_id`];
        if (id) {
          const blog = blogsData.find((b: any) => b.id === id);
          if (blog) {
            // Extract category from tags
            const tags = Array.isArray(blog.tags) ? blog.tags : [];
            const category = tags[0] || 'Guides';
            
            // Get excerpt - use excerpt field if available, otherwise extract from content
            const excerpt = blog.excerpt || (blog.content ? getExcerpt(blog.content) : '');
            
            orderedPosts.push({
              id: blog.id.toString(),
              title: blog.title,
              excerpt: excerpt,
              category: category,
              readTime: `${blog.reading_time_minutes || 5} min`,
              date: '',
              slug: blog.slug,
              featured: true
            });
          }
        }
      }

      setPosts(orderedPosts.length > 0 ? orderedPosts : blogData.featuredPosts.slice(0, 3));
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
      setPosts(blogData.featuredPosts.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-24 relative bg-black overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 flex justify-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 via-transparent to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08)_0%,transparent_60%)]" />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      
      <div className="absolute top-20 right-[10%] w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-20 left-[10%] w-48 h-48 bg-pink-500/10 rounded-full blur-[60px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/40">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span className="font-press-start text-[10px] sm:text-xs text-purple-300 tracking-wider">
                FROM THE BLOG
              </span>
            </div>
          </div>
          <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Latest Stories
            </span>
          </h2>
          <p className="font-jetbrains text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            Insights, guides, and stories from the Maximally ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600/20 to-pink-500/10 border border-purple-500/40 hover:border-purple-400 hover:from-purple-600/30 hover:to-pink-500/20 text-purple-300 hover:text-purple-200 font-press-start text-[10px] sm:text-xs transition-all duration-300"
            data-testid="button-view-all-posts"
          >
            <span>VIEW ALL POSTS</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
    </section>
  );
}

export default BlogFeedSection;
