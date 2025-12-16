import { ExternalLink, Book, Video, Users, Target, Mail, Share2, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { useBlogs } from '@/hooks/useBlog';

const Resources = () => {
  const { data: blogData, isLoading: isBlogsLoading } = useBlogs(1, 5);
  
  const staticBlogPosts = [
    { title: "Maximally AI Shipathon Guide", slug: "/blog/maximally-ai-shipathon-guide" },
    { title: "Top AI Hackathons for Students 2025", slug: "/blog/top-ai-hackathons-students-2025" },
    { title: "No-Code AI Shipathon", slug: "/blog/no-code-ai-shipathon" },
    { title: "First AI Project in 48 Hours", slug: "/blog/first-ai-project-48-hours" },
    { title: "Why Hackathons Got Boring", slug: "/blog/why-hackathons-got-boring-code-hypothesis" }
  ];
  
  const allBlogPosts = [
    ...(blogData?.data || []).map(post => ({
      title: post.title,
      slug: `/blog/${post.slug}`
    })),
    ...staticBlogPosts.filter(staticPost => 
      !(blogData?.data || []).some(dynamicPost => dynamicPost.slug === staticPost.slug.replace('/blog/', ''))
    )
  ].slice(0, 5);

  const initiatives = [
    { title: "MFHOP", link: "/mfhop", description: "Our federation for hackathon organizers and partners" },
    { title: "Events", link: "/events", description: "Our hackathon events and competitions" },
    { title: "Community", link: "https://discord.gg/MpBnYk8qMX", description: "Join our Discord community" }
  ];

  const socialLinks = [
    { name: "Instagram", url: "https://www.instagram.com/maximally.in/", icon: "📸" },
    { name: "LinkedIn", url: "https://www.linkedin.com/company/maximallyedu", icon: "💼" },
    { name: "X (Twitter)", url: "https://twitter.com/maximally_in", icon: "🐦" }
  ];

  const ResourceSection = ({ title, icon: Icon, children, color = "purple" }: {
    title: string;
    icon: any;
    children: React.ReactNode;
    color?: string;
  }) => {
    const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
      purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-300' },
      amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-300' },
      cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-300' },
      pink: { bg: 'bg-pink-500/20', border: 'border-pink-500/40', text: 'text-pink-300' },
      green: { bg: 'bg-green-500/20', border: 'border-green-500/40', text: 'text-green-300' },
      red: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-300' },
      indigo: { bg: 'bg-indigo-500/20', border: 'border-indigo-500/40', text: 'text-indigo-300' },
    };
    const c = colorClasses[color] || colorClasses.purple;
    
    return (
      <section className="mb-12">
        <div className={`inline-flex items-center gap-2 px-4 py-2 ${c.bg} border ${c.border} mb-6`}>
          <Icon className={`h-4 w-4 ${c.text}`} />
          <h2 className={`font-press-start text-xs ${c.text}`}>
            {title.toUpperCase()}
          </h2>
        </div>
        {children}
      </section>
    );
  };

  return (
    <>
      <SEO
        title="Resources | Maximally"
        description="Everything you need for hackathons - blog posts, guides, community links, handbooks, and resources for builders worldwide."
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.10)_0%,transparent_50%)]" />
        
        <div className="absolute top-20 left-[5%] w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-60 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />
        <div className="absolute bottom-40 left-[20%] w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px]" />
        
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 animate-float pointer-events-none"
            style={{
              left: `${5 + (i * 8)}%`,
              top: `${10 + Math.sin(i) * 20}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + (i % 3)}s`,
              backgroundColor: ['#a855f7', '#ec4899', '#06b6d4', '#22c55e', '#f59e0b'][i % 5],
              boxShadow: `0 0 10px ${['#a855f7', '#ec4899', '#06b6d4', '#22c55e', '#f59e0b'][i % 5]}40`
            }}
          />
        ))}

        <main className="min-h-screen pt-24 pb-16 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 mb-6">
                <Book className="w-4 h-4 text-purple-400" />
                <span className="font-press-start text-[10px] sm:text-xs text-purple-300">CONTENT & COMMUNITY HUB</span>
              </div>
              <h1 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  RESOURCES
                </span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg font-jetbrains max-w-4xl mx-auto leading-relaxed">
                Everything someone can use, read, or join. Your one-stop hub for all Maximally content, guides, and community connections.
              </p>
            </section>

            {/* Blog Section */}
            <ResourceSection title="Blog" icon={Book} color="amber">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                {(isBlogsLoading ? staticBlogPosts : allBlogPosts).map((post: {title: string, slug: string}, index: number) => (
                  <Link
                    key={index}
                    to={post.slug}
                    className="group bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-6 hover:border-amber-400/60 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="bg-amber-500/20 border border-amber-500/40 w-10 h-10 mb-4 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                      <Book className="h-5 w-5 text-amber-400" />
                    </div>
                    <h3 className="font-press-start text-[10px] sm:text-xs mb-3 text-amber-300 group-hover:text-amber-200 transition-colors leading-relaxed">
                      {post.title}
                    </h3>
                  </Link>
                ))}
                <Link
                  to="/blog"
                  className="group bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700/50 p-6 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="bg-gray-700/30 border border-gray-600/50 w-10 h-10 mx-auto mb-4 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                      <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-purple-400" />
                    </div>
                    <span className="font-press-start text-[10px] text-gray-400 group-hover:text-purple-300 transition-colors">
                      VIEW ALL POSTS
                    </span>
                  </div>
                </Link>
              </div>
            </ResourceSection>

            {/* Webinars Section */}
            <ResourceSection title="Webinars" icon={Video} color="green">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 p-6">
                  <div className="bg-green-500/20 border border-green-500/40 w-10 h-10 mb-4 flex items-center justify-center">
                    <Video className="h-5 w-5 text-green-400" />
                  </div>
                  <h3 className="font-press-start text-xs mb-3 text-green-300">UPCOMING</h3>
                  <p className="font-jetbrains text-gray-400 text-sm">
                    Stay tuned for upcoming webinars and live sessions with industry experts.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 p-6">
                  <div className="bg-cyan-500/20 border border-cyan-500/40 w-10 h-10 mb-4 flex items-center justify-center">
                    <Video className="h-5 w-5 text-cyan-400" />
                  </div>
                  <h3 className="font-press-start text-xs mb-3 text-cyan-300">RECORDINGS</h3>
                  <p className="font-jetbrains text-gray-400 text-sm">
                    Access past webinar recordings and educational content.
                  </p>
                </div>
              </div>
            </ResourceSection>

            {/* YouTube Section */}
            <ResourceSection title="YouTube" icon={Video} color="red">
              <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/30 p-8">
                <div className="text-center">
                  <div className="bg-red-500/20 border border-red-500/40 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Video className="h-8 w-8 text-red-400" />
                  </div>
                  <h3 className="font-press-start text-sm sm:text-base mb-4 text-red-300">MAXIMALLY CHANNEL</h3>
                  <p className="font-jetbrains text-gray-400 mb-6">
                    Watch our latest videos, event highlights, and builder stories.
                  </p>
                  <a
                    href="https://www.youtube.com/@MaximallyYT"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/20 border border-red-500/40 hover:border-red-400 text-red-300 hover:text-red-200 font-press-start text-[10px] sm:text-xs transition-all duration-300"
                  >
                    VISIT CHANNEL <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </ResourceSection>

            {/* Community Section */}
            <ResourceSection title="Community" icon={Users} color="indigo">
              <div className="grid md:grid-cols-1 gap-5">
                <a
                  href="https://discord.gg/MpBnYk8qMX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/30 p-6 hover:border-indigo-400/60 transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="bg-indigo-500/20 border border-indigo-500/40 w-10 h-10 mb-4 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                    <Users className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h3 className="font-press-start text-xs mb-3 text-indigo-300 group-hover:text-indigo-200 transition-colors">
                    DISCORD
                  </h3>
                  <p className="font-jetbrains text-gray-400 text-sm">
                    Join our main community server for real-time discussions and updates.
                  </p>
                </a>
              </div>
            </ResourceSection>

            {/* Initiatives Section */}
            <ResourceSection title="Initiatives" icon={Target} color="purple">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {initiatives.map((initiative, index) => (
                  <Link
                    key={index}
                    to={initiative.link}
                    className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-6 hover:border-purple-400/60 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="bg-purple-500/20 border border-purple-500/40 w-10 h-10 mb-4 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <Target className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="font-press-start text-xs mb-3 text-purple-300 group-hover:text-purple-200 transition-colors">
                      {initiative.title}
                    </h3>
                    <p className="font-jetbrains text-gray-400 text-sm">
                      {initiative.description}
                    </p>
                  </Link>
                ))}
              </div>
            </ResourceSection>

            {/* Newsletter Section */}
            <ResourceSection title="Newsletter & Updates" icon={Mail} color="cyan">
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 p-8">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="bg-cyan-500/20 border border-cyan-500/40 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h3 className="font-press-start text-sm sm:text-base mb-4 text-cyan-300">STAY UPDATED</h3>
                  <p className="font-jetbrains text-gray-400 mb-6">
                    Get the latest hackathon announcements, opportunities, and builder stories delivered to your inbox.
                  </p>
                  <div className="bg-gray-800/50 border border-gray-700/50 px-6 py-4 inline-block">
                    <span className="font-jetbrains text-sm text-gray-400">Newsletter signup coming soon</span>
                  </div>
                </div>
              </div>
            </ResourceSection>

            {/* Social Media Section */}
            <ResourceSection title="Social Media" icon={Share2} color="pink">
              <div className="grid md:grid-cols-3 gap-5">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/30 p-6 hover:border-pink-400/60 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{social.icon}</div>
                      <h3 className="font-press-start text-xs text-pink-300 group-hover:text-pink-200 transition-colors">
                        {social.name.toUpperCase()}
                      </h3>
                    </div>
                  </a>
                ))}
              </div>
            </ResourceSection>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Resources;
