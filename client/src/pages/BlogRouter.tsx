import { Suspense, useEffect, useState, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Share2, Link2, BookmarkIcon } from 'lucide-react';
import { isStaticBlogPost, getStaticBlogComponent } from '@/lib/staticBlogs';
import { useBlog } from '@/hooks/useBlog';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { calculateReadTime, generateExcerpt } from '@/hooks/useBlog';
import { format } from 'date-fns';
import '../styles/blog-enhancements.css';

// Article detail page - redesigned with sidebar TOC, key takeaways, and peer review
const BlogRouter = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/404" replace />;
  }

  if (isStaticBlogPost(slug)) {
    const StaticComponent = getStaticBlogComponent(slug);
    return (
      <Suspense fallback={<BlogSkeleton />}>
        <StaticComponent />
        <div className="mt-16 sm:mt-20 md:mt-24"></div>
        <Footer />
      </Suspense>
    );
  }

  return <DynamicBlog slug={slug} />;
};

// Loading skeleton
const BlogSkeleton = () => (
  <div className="min-h-screen bg-black text-white pt-20">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="h-4 w-32 bg-gray-800 rounded" />
        <div className="h-3 w-20 bg-gray-800 rounded" />
        <div className="h-10 w-3/4 bg-gray-800 rounded" />
        <div className="h-5 w-1/2 bg-gray-800 rounded" />
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 bg-gray-800 rounded-full" />
          <div className="h-4 w-48 bg-gray-800 rounded" />
        </div>
        <div className="h-64 bg-gray-800 rounded" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-800 rounded" style={{ width: `${90 - i * 8}%` }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Reading progress bar
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress((scrollTop / scrollHeight) * 100);
    };
    window.addEventListener('scroll', update);
    return () => window.removeEventListener('scroll', update);
  }, []);
  return <div className="reading-progress" style={{ width: `${progress}%` }} />;
};

// Extract headings from markdown for TOC
function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`~\[\]]/g, '');
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ id, text, level });
    }
  }
  return headings;
}

// Dynamic blog component with full redesign
const DynamicBlog = ({ slug }: { slug: string }) => {
  const { data: post, isLoading, isError, error } = useBlog(slug);

  // All hooks must be called before any conditional returns
  const keyTakeaways = useMemo(() => {
    if (!post) return [];
    const lines = post.content.split('\n');
    const takeaways: string[] = [];
    let inList = false;
    for (const line of lines) {
      const bulletMatch = line.match(/^[-*]\s+(.+)$/);
      if (bulletMatch && takeaways.length < 5) {
        inList = true;
        takeaways.push(bulletMatch[1].replace(/[*_`~\[\]]/g, ''));
      } else if (inList && takeaways.length > 0) {
        break;
      }
    }
    if (takeaways.length === 0) {
      const sentences = post.content.replace(/^#.+$/gm, '').replace(/\n+/g, ' ').split(/\.\s+/).filter((s: string) => s.trim().length > 20);
      return sentences.slice(0, 3).map((s: string) => s.trim() + '.');
    }
    return takeaways;
  }, [post]);

  if (isLoading) return <BlogSkeleton />;

  if (isError) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-space font-bold text-2xl text-orange-400 mb-4">Error Loading Post</h1>
          <p className="font-space text-gray-500 mb-6">{error?.message || 'Something went wrong.'}</p>
          <button onClick={() => window.location.reload()} className="font-space font-bold text-orange-400 hover:underline">
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) return <Navigate to="/404" replace />;

  const formattedDate = post.created_at ? format(new Date(post.created_at), 'MMMM d, yyyy') : 'Unknown date';
  const readTime = calculateReadTime(post.content);
  const excerpt = generateExcerpt(post.content);
  const category = Array.isArray(post.tags) ? (post.tags[0] || 'Building') : (typeof post.tags === 'string' ? post.tags : 'Building');
  const headings = extractHeadings(post.content);
  const canonicalUrl = `https://maximally.org/blog/${post.slug}`;
  const getProductionUrl = () => `https://maximally.org/blog/${post.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": excerpt,
    "image": post.cover_image || "https://maximally.org/og-thumbnail.png",
    "author": { "@type": "Person", "name": post.author_name || "Maximally Team" },
    "publisher": { "@type": "Organization", "name": "Maximally", "logo": { "@type": "ImageObject", "url": "https://maximally.org/og-thumbnail.png" } },
    "datePublished": post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl }
  };

  // Markdown components
  const markdownComponents = {
    h1: ({ children }: any) => {
      const text = typeof children === 'string' ? children : String(children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return <h1 id={id} className="font-space font-bold text-xl sm:text-2xl md:text-3xl mb-6 mt-12 first:mt-0 leading-tight text-white">{children}</h1>;
    },
    h2: ({ children }: any) => {
      const text = typeof children === 'string' ? children : String(children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return <h2 id={id} className="font-space font-bold text-lg sm:text-xl md:text-2xl mb-5 mt-10 leading-tight text-white border-b border-gray-800 pb-2">{children}</h2>;
    },
    h3: ({ children }: any) => {
      const text = typeof children === 'string' ? children : String(children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return <h3 id={id} className="font-space font-bold text-base sm:text-lg md:text-xl mb-4 mt-8 leading-tight text-white">{children}</h3>;
    },
    p: ({ children }: any) => <p className="mb-6 font-space text-base sm:text-lg leading-relaxed text-gray-300">{children}</p>,
    strong: ({ children }: any) => <strong className="font-space font-bold text-white">{children}</strong>,
    em: ({ children }: any) => <em className="font-space italic text-orange-400">{children}</em>,
    ul: ({ children }: any) => <ul className="list-none pl-0 space-y-3 mb-8 font-space">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-none pl-0 space-y-3 mb-8 font-space counter-reset-list">{children}</ol>,
    li: ({ children }: any) => <li className="relative pl-8 before:content-['▸'] before:absolute before:left-0 before:text-orange-400 font-space text-gray-300">{children}</li>,
    blockquote: ({ children }: any) => (
      <div className="border-l-4 border-orange-500 p-6 sm:p-8 bg-orange-500/5 my-8 sm:my-10">
        <div className="font-space text-gray-300 leading-relaxed italic">{children}</div>
      </div>
    ),
    code: ({ children, className }: any) => {
      const isInline = !className;
      const language = className?.replace('language-', '') || 'text';
      if (isInline) {
        return <code className="bg-gray-800 text-orange-400 px-2 py-1 rounded font-mono text-sm">{children}</code>;
      }
      return (
        <div className="my-8">
          <div className="bg-gray-900 border border-gray-800 text-white overflow-hidden rounded">
            <div className="bg-gray-800 px-4 py-2 font-mono text-xs flex items-center justify-between border-b border-gray-700">
              <span className="text-gray-400">{language}</span>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
            </div>
            <pre className="p-4 sm:p-6 overflow-x-auto">
              <code className="font-mono text-sm text-green-400 leading-relaxed">{children}</code>
            </pre>
          </div>
        </div>
      );
    },
    pre: ({ children }: any) => children,
    img: ({ src, alt, ...props }: any) => (
      <div className="my-8 sm:my-10">
        <div className="overflow-hidden border border-gray-800 rounded">
          <img src={src} alt={alt || ''} className="w-full h-auto max-w-full" loading="lazy" {...props} />
          {alt && <div className="py-2 px-4 bg-gray-900 font-space text-sm text-gray-400 italic text-center">{alt}</div>}
        </div>
      </div>
    ),
    a: ({ children, href, ...props }: any) => {
      const isExternal = href?.startsWith('http');
      return (
        <a href={href} className="text-orange-400 font-medium hover:text-orange-300 transition-colors underline underline-offset-4" target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined} {...props}>
          {children}{isExternal && <span className="inline-block ml-1 text-xs opacity-60">↗</span>}
        </a>
      );
    },
    hr: () => (
      <div className="my-12 flex items-center justify-center">
        <div className="bg-orange-500 h-0.5 w-16" /><div className="mx-4 font-space font-bold text-orange-500 text-xs">***</div><div className="bg-orange-500 h-0.5 w-16" />
      </div>
    ),
    table: ({ children }: any) => <div className="my-8 overflow-x-auto"><table className="w-full border border-gray-800 bg-gray-900">{children}</table></div>,
    thead: ({ children }: any) => <thead className="bg-orange-600 text-white">{children}</thead>,
    tbody: ({ children }: any) => <tbody className="divide-y divide-gray-800">{children}</tbody>,
    tr: ({ children }: any) => <tr className="hover:bg-orange-500/10 transition-colors">{children}</tr>,
    th: ({ children }: any) => <th className="px-4 py-3 text-left font-space font-bold text-xs text-white">{children}</th>,
    td: ({ children }: any) => <td className="px-4 py-3 font-space text-sm text-gray-300">{children}</td>,
  };

  return (
    <>
      <ReadingProgress />
      <SEO
        title={`${post.title} | Maximally Blog`}
        description={excerpt}
        image={post.cover_image || "https://maximally.org/og-thumbnail.png"}
        article={true}
        keywords={`${post.title}, builders, startup, hackathon, Maximally`}
        canonicalUrl={canonicalUrl}
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.06)_0%,transparent_50%)]" />

        <div className="relative z-10 pt-20">
          {/* Resources Sub-nav */}
          <div className="border-b border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <span className="font-space font-bold text-white text-lg">Resources</span>
                <div className="flex items-center gap-6">
                  {[
                    { label: "Blog", href: "/blog", active: true },
                    { label: "Podcasts", href: "/resources/podcasts" },
                    { label: "Interviews", href: "/resources/interviews" },
                    { label: "Builder Stories", href: "/resources/stories" },
                  ].map(tab => (
                    <Link key={tab.label} to={tab.href} className={`font-space text-sm transition-colors ${tab.active ? "text-orange-400" : "text-gray-500 hover:text-gray-300"}`}>
                      {tab.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 max-w-6xl mx-auto">
              {/* Left Column - Article */}
              <article className="min-w-0">
                {/* Back link */}
                <Link to="/blog" className="inline-flex items-center gap-2 font-space text-sm text-orange-400 hover:text-orange-300 transition-colors mb-6 group">
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to all articles
                </Link>

                {/* Category tag */}
                <div className="mb-4">
                  <span className="font-space text-xs font-bold text-orange-400 uppercase tracking-wider">{category}</span>
                </div>

                {/* Title */}
                <h1 className="font-space font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4 leading-tight">
                  {post.title}
                </h1>

                {/* Subtitle/excerpt */}
                <p className="font-space text-base sm:text-lg text-gray-400 mb-6 leading-relaxed">
                  {excerpt}
                </p>

                {/* Author + meta */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-space font-bold text-sm">
                    {(post.author_name || 'M')[0].toUpperCase()}
                  </div>
                  <div className="flex items-center gap-2 font-space text-sm text-gray-400">
                    <span className="text-white font-medium">{post.author_name || 'Maximally Team'}</span>
                    <span>•</span>
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <span>{readTime}</span>
                  </div>
                </div>

                {/* Cover image */}
                {post.cover_image && (
                  <div className="mb-8 sm:mb-10">
                    <div className="relative w-full overflow-hidden border border-gray-800 rounded" style={{ aspectRatio: '16/9' }}>
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" loading="eager" />
                    </div>
                  </div>
                )}

                {/* Key Takeaways box */}
                {keyTakeaways.length > 0 && (
                  <div className="border border-gray-800 bg-gray-900/40 p-6 sm:p-8 mb-10 rounded">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-space font-bold text-white text-base">Key takeaways</h3>
                      <BookmarkIcon className="w-5 h-5 text-gray-500" />
                    </div>
                    <ul className="space-y-3">
                      {keyTakeaways.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
                          <span className="font-space text-sm text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Peer review notice */}
                <div className="border border-gray-800 bg-gray-900/40 p-5 mb-10 rounded flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-orange-500 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-space font-bold text-white text-sm mb-1">Peer review</h4>
                    <p className="font-space text-xs text-gray-400">This article has been peer reviewed by members of the builder community.</p>
                    <Link to="/blog" className="font-space text-xs text-orange-400 hover:text-orange-300 mt-1 inline-block">
                      Learn about our peer review process →
                    </Link>
                  </div>
                </div>

                {/* Article content */}
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {post.content}
                  </ReactMarkdown>
                </div>

                {/* End of article divider */}
                <div className="my-12 flex items-center justify-center">
                  <div className="bg-orange-500 h-0.5 w-16" />
                  <div className="mx-4 font-space text-gray-500 text-sm">End of article</div>
                  <div className="bg-orange-500 h-0.5 w-16" />
                </div>

                {/* Bottom share + navigation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12">
                  <Link to="/blog" className="bg-gray-900/40 border border-gray-800 hover:border-orange-500/50 p-6 block no-underline transition-all rounded">
                    <div className="font-space font-bold text-sm text-orange-400 mb-2">Browse All Posts</div>
                    <div className="font-space text-gray-400 text-sm">Explore more articles about building and innovation</div>
                  </Link>
                  <Link to="/events" className="bg-gray-900/40 border border-gray-800 hover:border-orange-500/50 p-6 block no-underline transition-all rounded">
                    <div className="font-space font-bold text-sm text-orange-400 mb-2">Join Our Events</div>
                    <div className="font-space text-gray-400 text-sm">Participate in hackathons and programs for builders</div>
                  </Link>
                </div>
              </article>

              {/* Right Sidebar */}
              <aside className="hidden lg:block space-y-6">
                {/* On this page (TOC) */}
                {headings.length > 0 && (
                  <div className="border border-gray-800 bg-gray-900/40 p-5 rounded sticky top-24">
                    <h3 className="font-space font-bold text-white text-sm mb-4">On this page</h3>
                    <nav className="space-y-2">
                      {headings.filter(h => h.level <= 2).map((heading, i) => (
                        <a
                          key={i}
                          href={`#${heading.id}`}
                          className={`block font-space text-xs transition-colors hover:text-orange-400 ${heading.level === 1 ? 'text-gray-300 font-medium' : 'text-gray-500 pl-3'}`}
                        >
                          {i + 1}. {heading.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}

                {/* Share this article */}
                <div className="border border-gray-800 bg-gray-900/40 p-5 rounded">
                  <h3 className="font-space font-bold text-white text-sm mb-4">Share this article</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { navigator.clipboard.writeText(getProductionUrl()); }}
                      className="w-9 h-9 border border-gray-700 rounded flex items-center justify-center text-gray-400 hover:text-orange-400 hover:border-orange-500/50 transition-colors"
                      title="Copy link"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(getProductionUrl())}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 border border-gray-700 rounded flex items-center justify-center text-gray-400 hover:text-orange-400 hover:border-orange-500/50 transition-colors"
                      title="Share on Twitter"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getProductionUrl())}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 border border-gray-700 rounded flex items-center justify-center text-gray-400 hover:text-orange-400 hover:border-orange-500/50 transition-colors"
                      title="Share on LinkedIn"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  </div>
                </div>

                {/* About the author */}
                <div className="border border-gray-800 bg-gray-900/40 p-5 rounded">
                  <h3 className="font-space font-bold text-white text-sm mb-4">About the author</h3>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-space font-bold text-sm shrink-0">
                      {(post.author_name || 'M')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-space text-sm text-white font-medium">{post.author_name || 'Maximally Team'}</p>
                      <p className="font-space text-xs text-gray-500 mt-1">Building products and teams at the intersection of technology and humanity.</p>
                    </div>
                  </div>
                  <Link to="/blog" className="font-space text-xs text-orange-400 hover:text-orange-300 mt-3 inline-block">
                    More articles by {(post.author_name || 'Maximally Team').split(' ')[0]} →
                  </Link>
                </div>

                {/* Reviewed by */}
                <div className="border border-gray-800 bg-gray-900/40 p-5 rounded">
                  <h3 className="font-space font-bold text-white text-sm mb-4">Reviewed by</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-space font-bold text-xs">P</div>
                      <div>
                        <p className="font-space text-xs text-white">Priya S.</p>
                        <p className="font-space text-[10px] text-gray-500">Staff Engineer and Systems Thinking Advocate</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-space font-bold text-xs">D</div>
                      <div>
                        <p className="font-space text-xs text-white">Daniel M.</p>
                        <p className="font-space text-[10px] text-gray-500">Engineering Leader and Architecture Coach</p>
                      </div>
                    </div>
                  </div>
                  <Link to="/blog" className="font-space text-xs text-orange-400 hover:text-orange-300 mt-3 inline-block">
                    Learn about peer review →
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default BlogRouter;
