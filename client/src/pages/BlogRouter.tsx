import { Suspense, useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { isStaticBlogPost, getStaticBlogComponent } from '@/lib/staticBlogs';
import { useBlog } from '@/hooks/useBlog';
import BlogPost from '@/components/BlogPost';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { calculateReadTime, generateExcerpt } from '@/hooks/useBlog';
import { format } from 'date-fns';
import '../styles/blog-enhancements.css';

const BlogRouter = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/404" replace />;
  }

  // Check if this is a static blog post first
  if (isStaticBlogPost(slug)) {
    const StaticComponent = getStaticBlogComponent(slug);
    
    return (
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-24">
            <div className="max-w-4xl mx-auto">
              <div className="h-12 bg-gray-200 rounded animate-pulse mb-6"></div>
              <div className="flex gap-6 mb-8">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded animate-pulse mt-8"></div>
              </div>
            </div>
          </div>
        }
      >
        <StaticComponent />
        
        {/* Spacer before footer */}
        <div className="mt-16 sm:mt-20 md:mt-24"></div>
        
        <Footer />
      </Suspense>
    );
  }

  // Fallback to dynamic blog from Supabase
  return <DynamicBlog slug={slug} />;
};

// Reading progress component
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollTop / scrollHeight) * 100;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div 
      className="reading-progress" 
      style={{ width: `${progress}%` }}
    />
  );
};

// Dynamic blog component
const DynamicBlog = ({ slug }: { slug: string }) => {
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useBlog(slug);

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Cover image skeleton */}
          <div className="mb-6 sm:mb-8">
            <div className="relative w-full pixel-border" style={{ aspectRatio: '16/9' }}>
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            </div>
          </div>
          
          {/* Title skeleton */}
          <div className="pixel-border bg-gray-200 animate-pulse mb-4 sm:mb-6" style={{ height: '3rem' }}></div>
          
          {/* Meta info skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            <div className="pixel-border bg-gray-200 animate-pulse h-4 w-20"></div>
            <div className="pixel-border bg-gray-200 animate-pulse h-4 w-16"></div>
            <div className="pixel-border bg-gray-200 animate-pulse h-4 w-24"></div>
            <div className="sm:ml-auto">
              <div className="pixel-border bg-gray-200 animate-pulse h-10 w-20"></div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="pixel-border bg-gray-200 animate-pulse" style={{
                height: '1rem',
                width: i === 7 ? '60%' : i === 3 ? '80%' : '100%'
              }}></div>
            ))}
            
            {/* Code block skeleton */}
            <div className="pixel-border bg-gray-100 animate-pulse p-4 my-6" style={{ height: '8rem' }}></div>
            
            {/* More content skeleton */}
            {[...Array(4)].map((_, i) => (
              <div key={i + 8} className="pixel-border bg-gray-200 animate-pulse" style={{
                height: '1rem',
                width: i === 3 ? '40%' : '100%'
              }}></div>
            ))}
          </div>
        </div>
        
        {/* Spacer before footer */}
        <div className="mt-16 sm:mt-20 md:mt-24"></div>
        
        <Footer />
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-press-start text-2xl text-maximally-red mb-4">
            Error Loading Post
          </h1>
          <p className="font-jetbrains text-gray-600 mb-6">
            {error?.message || 'Something went wrong while loading the blog post.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="font-press-start text-maximally-blue hover:underline"
          >
            Try Again
          </button>
        </div>
        
        {/* Spacer before footer */}
        <div className="mt-16 sm:mt-20 md:mt-24"></div>
        
        <Footer />
      </div>
    );
  }

  // Post not found - redirect to 404
  if (!post) {
    return <Navigate to="/404" replace />;
  }

  // Prepare data for the reusable BlogPost component
  const formattedDate = post.created_at ? format(new Date(post.created_at), 'MMMM d, yyyy') : 'Unknown date';
  const readTime = calculateReadTime(post.content);
  const excerpt = generateExcerpt(post.content);
  const title = post.title;
  const canonicalUrl = `https://maximally.in/blog/${post.slug}`;
  
  // Helper function to get production URL
  const getProductionUrl = () => {
    return `https://maximally.in/blog/${post.slug}`;
  };
  
  // Create structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": excerpt,
    "image": post.cover_image || "https://maximally.in/og-thumbnail.png",
    "author": {
      "@type": "Person",
      "name": post.author_name || "Maximally Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Maximally",
      "logo": {
        "@type": "ImageObject",
        "url": "https://maximally.in/og-thumbnail.png"
      }
    },
    "datePublished": post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  // Custom markdown components with enhanced styling
  const markdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="font-press-start text-xl sm:text-2xl md:text-3xl mb-6 mt-12 first:mt-0 leading-tight text-maximally-red relative">
        <span className="absolute -left-4 text-maximally-red/20 select-none">#</span>
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-press-start text-lg sm:text-xl md:text-2xl mb-5 mt-10 leading-tight text-maximally-red relative group">
        <span className="absolute -left-3 text-maximally-red/20 select-none group-hover:text-maximally-red/40 transition-colors">##</span>
        <div className="inline-block pixel-border-bottom pb-2">
          {children}
        </div>
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-press-start text-base sm:text-lg md:text-xl mb-4 mt-8 leading-tight text-maximally-red relative group">
        <span className="absolute -left-3 text-maximally-red/20 select-none group-hover:text-maximally-red/40 transition-colors">###</span>
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="font-press-start text-sm sm:text-base md:text-lg mb-3 mt-6 leading-tight text-maximally-blue">
        {children}
      </h4>
    ),
    h5: ({ children }: any) => (
      <h5 className="font-press-start text-xs sm:text-sm md:text-base mb-3 mt-6 leading-tight text-maximally-black/80">
        {children}
      </h5>
    ),
    p: ({ children }: any) => (
      <p className="mb-6 font-jetbrains text-base sm:text-lg leading-relaxed text-maximally-black/90 first-letter:text-2xl first-letter:font-press-start first-letter:text-maximally-red first-letter:mr-1 first-letter:float-left first-letter:leading-none">
        {children}
      </p>
    ),
    strong: ({ children }: any) => (
      <strong className="font-press-start text-maximally-red bg-maximally-red/10 px-1 py-0.5 rounded">
        {children}
      </strong>
    ),
    em: ({ children }: any) => (
      <em className="font-jetbrains italic text-maximally-blue bg-maximally-blue/5 px-1 rounded">
        {children}
      </em>
    ),
    ul: ({ children }: any) => (
      <ul className="list-none pl-0 space-y-3 mb-8 font-jetbrains">
        <div className="space-y-2">
          {children}
        </div>
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-none pl-0 space-y-3 mb-8 font-jetbrains counter-reset-list">
        <div className="space-y-2">
          {children}
        </div>
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="relative pl-8 before:content-['▸'] before:absolute before:left-0 before:text-maximally-red before:font-press-start before:text-sm">
        {children}
      </li>
    ),
    blockquote: ({ children }: any) => (
      <div className="pixel-border p-6 sm:p-8 bg-gradient-to-r from-maximally-blue/5 to-maximally-blue/10 my-8 sm:my-10 relative">
        <div className="absolute top-4 left-4 text-maximally-blue/20 font-press-start text-2xl select-none">&quot;</div>
        <div className="font-jetbrains text-maximally-black/90 leading-relaxed pl-8">
          {children}
        </div>
        <div className="absolute bottom-4 right-4 text-maximally-blue/20 font-press-start text-2xl select-none rotate-180">&quot;</div>
      </div>
    ),
    code: ({ children, className }: any) => {
      const isInline = !className;
      const language = className?.replace('language-', '') || 'text';
      
      if (isInline) {
        return (
          <code className="bg-maximally-black/10 text-maximally-red px-2 py-1 rounded font-jetbrains text-sm pixel-border-sm">
            {children}
          </code>
        );
      }
      return (
        <div className="my-8">
          <div className="pixel-border bg-maximally-black text-white overflow-hidden">
            {/* Code header */}
            <div className="bg-maximally-red px-4 py-2 font-press-start text-xs flex items-center justify-between">
              <span>{language.toUpperCase()}</span>
              <span className="text-white/60">CODE</span>
            </div>
            <pre className="p-6 overflow-x-auto bg-maximally-black custom-scrollbar">
              <code className="font-jetbrains text-sm text-green-400 leading-relaxed">
                {children}
              </code>
            </pre>
          </div>
        </div>
      );
    },
    pre: ({ children }: any) => children,
    img: ({ src, alt, ...props }: any) => (
      <div className="my-8 sm:my-10">
        <div className="pixel-border overflow-hidden bg-white p-2">
          <img
            src={src}
            alt={alt || ''}
            className="w-full h-auto rounded-lg max-w-full hover:scale-105 transition-transform duration-300"
            loading="lazy"
            style={{ maxWidth: '100%', height: 'auto' }}
            {...props}
          />
          {alt && (
            <div className="pt-2 px-2 font-jetbrains text-sm text-maximally-black/60 italic text-center">
              {alt}
            </div>
          )}
        </div>
      </div>
    ),
    a: ({ children, href, ...props }: any) => {
      const isExternal = href?.startsWith('http');
      return (
        <a
          href={href}
          className="text-maximally-blue font-medium hover:text-maximally-red transition-colors duration-200 relative group pixel-underline"
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
          {isExternal && (
            <span className="inline-block ml-1 text-xs opacity-60 group-hover:opacity-100 transition-opacity">↗</span>
          )}
        </a>
      );
    },
    hr: () => (
      <div className="my-12 flex items-center justify-center">
        <div className="pixel-border bg-maximally-red h-2 w-16"></div>
        <div className="mx-4 font-press-start text-maximally-red text-xs">***</div>
        <div className="pixel-border bg-maximally-red h-2 w-16"></div>
      </div>
    ),
    table: ({ children }: any) => (
      <div className="my-8 overflow-x-auto">
        <table className="w-full pixel-border bg-white">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-maximally-red text-white">
        {children}
      </thead>
    ),
    tbody: ({ children }: any) => (
      <tbody className="divide-y divide-maximally-black/10">
        {children}
      </tbody>
    ),
    tr: ({ children }: any) => (
      <tr className="hover:bg-maximally-blue/5 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }: any) => (
      <th className="px-4 py-3 text-left font-press-start text-xs">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-4 py-3 font-jetbrains text-sm">
        {children}
      </td>
    ),
  };

  // Render the markdown content with enhanced cover image
  const contentWithCover = (
    <>
      {/* Enhanced Cover Image */}
      {post.cover_image && (
        <div className="mb-8 sm:mb-12">
          <div className="relative w-full pixel-border overflow-hidden bg-gradient-to-br from-maximally-red/10 to-maximally-blue/10 p-2" style={{ aspectRatio: '16/9' }}>
            <img
              src={post.cover_image}
              alt={post.title}
              className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover rounded-lg hover:scale-105 transition-transform duration-500"
              loading="eager"
              width="1024"
              height="576"
            />
            {/* Image overlay gradient */}
            <div className="absolute inset-2 rounded-lg bg-gradient-to-t from-maximally-black/20 via-transparent to-transparent pointer-events-none"></div>
            
            {/* Author badge if available */}
            {post.author_name && (
              <div className="absolute bottom-4 right-4 pixel-border bg-maximally-red text-white px-3 py-1 font-press-start text-xs">
                📸 {post.author_name}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Enhanced markdown content with better prose styling */}
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {post.content}
        </ReactMarkdown>
      </div>
      
      {/* Reading completion indicator */}
      <div className="mt-16 mb-8 text-center">
        <div className="pixel-border bg-gradient-to-r from-maximally-red to-maximally-blue text-white px-6 py-3 inline-block">
          <span className="font-press-start text-sm">📖 Article Complete</span>
        </div>
        <div className="mt-4 font-jetbrains text-maximally-black/60">
          Thank you for reading! Share your thoughts below.
        </div>
      </div>
      
      {/* Social sharing buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-8 mb-12">
        <button 
          onClick={() => {
            const url = getProductionUrl();
            const text = `Check out this article: ${post.title}`;
            if (navigator.share) {
              navigator.share({ title: post.title, url, text });
            } else {
              navigator.clipboard.writeText(`${text} ${url}`);
            }
          }}
          className="pixel-border bg-maximally-blue text-white px-4 py-2 font-press-start text-xs hover:bg-maximally-red transition-colors duration-200"
        >
          📱 Share
        </button>
        <button 
          onClick={(event) => {
            const url = getProductionUrl();
            navigator.clipboard.writeText(url);
            // Show a brief feedback message
            const button = event.currentTarget as HTMLButtonElement;
            const originalText = button.textContent;
            button.textContent = '✅ Copied!';
            setTimeout(() => {
              if (originalText) {
                button.textContent = originalText;
              }
            }, 2000);
          }}
          className="pixel-border bg-maximally-black text-white px-4 py-2 font-press-start text-xs hover:bg-maximally-blue transition-colors duration-200"
        >
          🔗 Copy Link
        </button>
        <a 
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this article: ${post.title}`)}&url=${encodeURIComponent(getProductionUrl())}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-border bg-black text-white px-4 py-2 font-press-start text-xs hover:bg-maximally-blue transition-colors duration-200 no-underline"
        >
          🐦 Tweet
        </a>
      </div>
      
      {/* Divider */}
      <div className="my-16 flex items-center justify-center">
        <div className="pixel-border bg-maximally-red h-2 w-24"></div>
        <div className="mx-6 font-press-start text-maximally-red text-sm">✦ ✦ ✦</div>
        <div className="pixel-border bg-maximally-red h-2 w-24"></div>
      </div>
      
      {/* Author info section */}
      {post.author_name && (
        <div className="pixel-border bg-gradient-to-r from-maximally-blue/5 to-maximally-red/5 p-6 sm:p-8 my-12">
          <div className="flex items-start gap-4">
            <div className="pixel-border bg-maximally-red text-white w-12 h-12 flex items-center justify-center font-press-start text-lg flex-shrink-0">
              {post.author_name.charAt(0)}
            </div>
            <div>
              <h3 className="font-press-start text-maximally-black mb-2 text-sm">
                About {post.author_name}
              </h3>
              <p className="font-jetbrains text-maximally-black/70 text-sm leading-relaxed">
                Content creator at Maximally, passionate about empowering the next generation of young entrepreneurs and innovators.
              </p>
              <div className="mt-3 flex gap-2">
                <span className="pixel-border bg-maximally-blue text-white px-2 py-1 font-press-start text-xs">
                  📝 Author
                </span>
                <span className="pixel-border bg-maximally-black text-white px-2 py-1 font-press-start text-xs">
                  🚀 Maximally Team
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Related posts section */}
      <div className="pixel-border bg-maximally-black text-white p-6 sm:p-8 my-12">
        <h3 className="font-press-start text-maximally-red mb-6 text-sm flex items-center gap-2">
          🔥 More from Maximally
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/blog" 
            className="pixel-border bg-maximally-red hover:bg-maximally-red/80 hover:scale-105 transition-all duration-200 p-4 block no-underline"
          >
            <div className="font-press-start text-xs text-white mb-2">📚 Browse All Posts</div>
            <div className="font-jetbrains text-white/80 text-sm">Explore more articles about entrepreneurship and innovation</div>
          </Link>
          <Link 
            to="/events" 
            className="pixel-border bg-maximally-blue hover:bg-maximally-blue/80 hover:scale-105 transition-all duration-200 p-4 block no-underline"
          >
            <div className="font-press-start text-xs text-white mb-2">🚀 Join Our Events</div>
            <div className="font-jetbrains text-white/80 text-sm">Participate in hackathons and makeathons for young innovators</div>
          </Link>
        </div>
      </div>
      
      {/* Join Discord */}
      <div className="pixel-border bg-gradient-to-br from-maximally-red/10 to-maximally-blue/10 p-6 sm:p-8 my-12 text-center">
        <h3 className="font-press-start text-maximally-black mb-4 text-sm">
          💬 Join Our Discord
        </h3>
        <p className="font-jetbrains text-maximally-black/70 mb-6 text-sm">
          Connect with fellow young entrepreneurs, get real-time updates, and join the conversation in our vibrant community.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a 
            href="https://discord.gg/MpBnYk8qMX" 
            target="_blank" 
            rel="noopener noreferrer"
            className="pixel-border bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 font-press-start text-xs transition-colors duration-200 no-underline flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Join Discord
          </a>
          <div className="font-jetbrains text-maximally-black/60 text-xs">
            🔥 5000+ young builders already connected
          </div>
        </div>
      </div>
    </>
  );

  // Render dynamic blog post using the existing BlogPost component
  return (
    <>
      <ReadingProgress />
      <SEO
        title={`${title} | Maximally Blog`}
        description={excerpt}
        image={post.cover_image || "https://maximally.in/og-thumbnail.png"}
        article={true}
        keywords={`${title}, young entrepreneurs, startup, hackathon, Maximally`}
        canonicalUrl={canonicalUrl}
        structuredData={structuredData}
      />
      <div className="animate-fade-in-up">
        {/* Back to blog navigation */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 pixel-border bg-maximally-blue text-white px-4 py-2 font-press-start text-xs hover:bg-maximally-red transition-colors duration-200 mb-8"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Blog
          </Link>
        </div>
        
        <BlogPost
          title={title}
          date={formattedDate}
          readTime={readTime}
          content={contentWithCover}
        />
      </div>
      
      {/* Spacer before footer */}
      <div className="mt-16 sm:mt-20 md:mt-24"></div>
      
      <Footer />
    </>
  );
};

export default BlogRouter;
