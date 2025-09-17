import { ExternalLink, Book, Video, Users, Target, FileText, Mail, Search, Share2 } from 'lucide-react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Resources = () => {
  const blogPosts = [
    { title: "Maximally AI Shipathon Guide", slug: "/blog/maximally-ai-shipathon-guide" },
    { title: "Top AI Hackathons for Students 2025", slug: "/blog/top-ai-hackathons-students-2025" },
    { title: "No-Code AI Shipathon", slug: "/blog/no-code-ai-shipathon" },
    { title: "First AI Project in 48 Hours", slug: "/blog/first-ai-project-48-hours" },
    { title: "Why Hackathons Got Boring", slug: "/blog/why-hackathons-got-boring-code-hypothesis" }
  ];

  const initiatives = [
    { title: "Code Hypothesis", link: "/codehypothesis", description: "Science meets wild ideas" },
    { title: "Protocol 404", link: "/protocol-404", description: "When systems break, build anyway" },
    { title: "Project CodeGen", link: "/project-codegen", description: "Play might be the future of building" },
    { title: "MFHOP", link: "/mfhop", description: "Maximally Federation of Hackathon Platforms" },
    { title: "PromptStorm", link: "/promptstorm", description: "AI prompt engineering challenge" },
    { title: "Steal-A-Thon", link: "/steal-a-thon", description: "Build by learning from the best" }
  ];

  const socialLinks = [
    { name: "Instagram", url: "https://www.instagram.com/maximally.in/", icon: "📸" },
    { name: "LinkedIn", url: "https://www.linkedin.com/company/maximallyedu", icon: "💼" },
    { name: "X (Twitter)", url: "https://twitter.com/maximally_in", icon: "🐦" }
  ];

  const ResourceSection = ({ title, icon: Icon, children, className = "" }: {
    title: string;
    icon: any;
    children: React.ReactNode;
    className?: string;
  }) => (
    <section className={`mb-12 ${className}`}>
      <div className="minecraft-block bg-maximally-red text-black px-6 py-3 inline-block mb-6">
        <h2 className="font-press-start text-sm flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title.toUpperCase()}
        </h2>
      </div>
      {children}
    </section>
  );

  return (
    <>
      <SEO
        title="Resources | Maximally"
        description="Everything you need for hackathons - blog posts, guides, community links, handbooks, and resources for builders worldwide."
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Pixel Grid Background */}
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating Pixels */}
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="fixed w-2 h-2 bg-maximally-red pixel-border animate-float pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}

        <main className="min-h-screen pt-24 pb-16 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-16">
              <div className="minecraft-block bg-maximally-red text-black px-6 py-3 inline-block mb-8">
                <span className="font-press-start text-sm">🚀 CONTENT & COMMUNITY HUB</span>
              </div>
              <h1 className="font-press-start text-4xl md:text-6xl lg:text-8xl mb-8 minecraft-text">
                <span className="text-maximally-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  RESOURCES
                </span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl font-jetbrains max-w-4xl mx-auto leading-relaxed">
                Everything someone can use, read, or join. Your one-stop hub for all Maximally content, guides, and community connections.
              </p>
            </section>

            {/* Blog Section */}
            <ResourceSection title="Blog" icon={Book}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {blogPosts.map((post, index) => (
                  <Link
                    key={index}
                    to={post.slug}
                    className="pixel-card bg-black border-2 border-maximally-yellow p-6 hover:scale-105 transition-all duration-300 hover:border-maximally-red group"
                  >
                    <div className="minecraft-block bg-maximally-yellow w-10 h-10 mb-4 flex items-center justify-center group-hover:bg-maximally-red transition-colors">
                      <Book className="h-5 w-5 text-black" />
                    </div>
                    <h3 className="font-press-start text-sm mb-3 text-maximally-yellow group-hover:text-maximally-red transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                ))}
                <Link
                  to="/blog"
                  className="pixel-card bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 p-6 hover:scale-105 transition-all duration-300 hover:border-maximally-yellow flex items-center justify-center group"
                >
                  <div className="text-center">
                    <div className="minecraft-block bg-gray-700 w-10 h-10 mx-auto mb-4 flex items-center justify-center group-hover:bg-maximally-yellow transition-colors">
                      <ExternalLink className="h-5 w-5 text-white group-hover:text-black" />
                    </div>
                    <span className="font-press-start text-xs text-gray-300 group-hover:text-maximally-yellow transition-colors">
                      VIEW ALL POSTS
                    </span>
                  </div>
                </Link>
              </div>
            </ResourceSection>

            {/* Webinars Section */}
            <ResourceSection title="Webinars" icon={Video}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="pixel-card bg-black border-2 border-green-500 p-6">
                  <div className="minecraft-block bg-green-500 w-10 h-10 mb-4 flex items-center justify-center">
                    <Video className="h-5 w-5 text-black" />
                  </div>
                  <h3 className="font-press-start text-sm mb-3 text-green-500">UPCOMING</h3>
                  <p className="font-jetbrains text-gray-300 text-sm">
                    Stay tuned for upcoming webinars and live sessions with industry experts.
                  </p>
                </div>
                <div className="pixel-card bg-black border-2 border-blue-500 p-6">
                  <div className="minecraft-block bg-blue-500 w-10 h-10 mb-4 flex items-center justify-center">
                    <Video className="h-5 w-5 text-black" />
                  </div>
                  <h3 className="font-press-start text-sm mb-3 text-blue-500">RECORDINGS</h3>
                  <p className="font-jetbrains text-gray-300 text-sm">
                    Access past webinar recordings and educational content.
                  </p>
                </div>
              </div>
            </ResourceSection>

            {/* YouTube Section */}
            <ResourceSection title="YouTube" icon={Video}>
              <div className="pixel-card bg-black border-2 border-red-500 p-8">
                <div className="text-center">
                  <div className="minecraft-block bg-red-500 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Video className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="font-press-start text-lg mb-4 text-red-500">MAXIMALLY CHANNEL</h3>
                  <p className="font-jetbrains text-gray-300 mb-6">
                    Watch our latest videos, event highlights, and builder stories.
                  </p>
                  <a
                    href="https://youtube.com/@maximally"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block minecraft-block bg-red-500 text-black px-6 py-3 hover:bg-maximally-yellow transition-colors"
                  >
                    <span className="font-press-start text-sm flex items-center gap-2">
                      VISIT CHANNEL <ExternalLink className="h-4 w-4" />
                    </span>
                  </a>
                </div>
              </div>
            </ResourceSection>

            {/* Community Section */}
            <ResourceSection title="Community" icon={Users}>
              <div className="grid md:grid-cols-3 gap-6">
                <a
                  href="https://discord.gg/MpBnYk8qMX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-card bg-black border-2 border-indigo-500 p-6 hover:scale-105 transition-all duration-300 hover:border-maximally-yellow group"
                >
                  <div className="minecraft-block bg-indigo-500 w-10 h-10 mb-4 flex items-center justify-center group-hover:bg-maximally-yellow transition-colors">
                    <Users className="h-5 w-5 text-black" />
                  </div>
                  <h3 className="font-press-start text-sm mb-3 text-indigo-500 group-hover:text-maximally-yellow transition-colors">
                    DISCORD
                  </h3>
                  <p className="font-jetbrains text-gray-300 text-xs">
                    Join our main community server for real-time discussions and updates.
                  </p>
                </a>
                <div className="pixel-card bg-black border-2 border-gray-700 p-6">
                  <div className="minecraft-block bg-gray-700 w-10 h-10 mb-4 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-press-start text-sm mb-3 text-gray-300">TELEGRAM</h3>
                  <p className="font-jetbrains text-gray-500 text-xs">Coming soon</p>
                </div>
                <div className="pixel-card bg-black border-2 border-gray-700 p-6">
                  <div className="minecraft-block bg-gray-700 w-10 h-10 mb-4 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-press-start text-sm mb-3 text-gray-300">WHATSAPP</h3>
                  <p className="font-jetbrains text-gray-500 text-xs">Coming soon</p>
                </div>
              </div>
            </ResourceSection>

            {/* Initiatives Section */}
            <ResourceSection title="Initiatives" icon={Target}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initiatives.map((initiative, index) => (
                  <Link
                    key={index}
                    to={initiative.link}
                    className="pixel-card bg-black border-2 border-purple-500 p-6 hover:scale-105 transition-all duration-300 hover:border-maximally-yellow group"
                  >
                    <div className="minecraft-block bg-purple-500 w-10 h-10 mb-4 flex items-center justify-center group-hover:bg-maximally-yellow transition-colors">
                      <Target className="h-5 w-5 text-black" />
                    </div>
                    <h3 className="font-press-start text-sm mb-3 text-purple-500 group-hover:text-maximally-yellow transition-colors">
                      {initiative.title}
                    </h3>
                    <p className="font-jetbrains text-gray-300 text-xs">
                      {initiative.description}
                    </p>
                  </Link>
                ))}
              </div>
            </ResourceSection>

            {/* Docs & Guides Section */}
            <ResourceSection title="Docs & Guides" icon={FileText}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Judge Handbook", desc: "Guidelines for hackathon judges" },
                  { title: "Participant Handbook", desc: "How to participate in our events" },
                  { title: "Sponsor Deck", desc: "Partnership opportunities" },
                  { title: "Press Kit", desc: "Media resources and brand assets" },
                  { title: "FAQs", desc: "Frequently asked questions" },
                  { title: "Getting Started", desc: "New to Maximally? Start here" }
                ].map((doc, index) => (
                  <div
                    key={index}
                    className="pixel-card bg-black border-2 border-orange-500 p-6 hover:scale-105 transition-all duration-300 hover:border-maximally-yellow group cursor-pointer"
                  >
                    <div className="minecraft-block bg-orange-500 w-10 h-10 mb-4 flex items-center justify-center group-hover:bg-maximally-yellow transition-colors">
                      <FileText className="h-5 w-5 text-black" />
                    </div>
                    <h3 className="font-press-start text-xs mb-2 text-orange-500 group-hover:text-maximally-yellow transition-colors">
                      {doc.title}
                    </h3>
                    <p className="font-jetbrains text-gray-300 text-xs">{doc.desc}</p>
                    <span className="font-jetbrains text-xs text-gray-500 mt-2 block">Coming soon</span>
                  </div>
                ))}
              </div>
            </ResourceSection>

            {/* Newsletter Section */}
            <ResourceSection title="Newsletter & Updates" icon={Mail}>
              <div className="pixel-card bg-black border-2 border-cyan-500 p-8">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="minecraft-block bg-cyan-500 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="font-press-start text-lg mb-4 text-cyan-500">STAY UPDATED</h3>
                  <p className="font-jetbrains text-gray-300 mb-6">
                    Get the latest hackathon announcements, opportunities, and builder stories delivered to your inbox.
                  </p>
                  <div className="minecraft-block bg-gray-800 text-gray-300 px-6 py-4 inline-block">
                    <span className="font-jetbrains text-sm">Newsletter signup coming soon</span>
                  </div>
                </div>
              </div>
            </ResourceSection>

            {/* Research & Reports Section */}
            <ResourceSection title="Research & Reports" icon={Search}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="pixel-card bg-black border-2 border-pink-500 p-6">
                  <div className="minecraft-block bg-pink-500 w-10 h-10 mb-4 flex items-center justify-center">
                    <Search className="h-5 w-5 text-black" />
                  </div>
                  <h3 className="font-press-start text-sm mb-3 text-pink-500">WHITEPAPERS</h3>
                  <p className="font-jetbrains text-gray-300 text-sm mb-3">
                    In-depth research on hackathon ecosystems and innovation patterns.
                  </p>
                  <span className="font-jetbrains text-xs text-gray-500">Coming soon</span>
                </div>
                <div className="pixel-card bg-black border-2 border-teal-500 p-6">
                  <div className="minecraft-block bg-teal-500 w-10 h-10 mb-4 flex items-center justify-center">
                    <Search className="h-5 w-5 text-black" />
                  </div>
                  <h3 className="font-press-start text-sm mb-3 text-teal-500">CASE STUDIES</h3>
                  <p className="font-jetbrains text-gray-300 text-sm mb-3">
                    Project SYMBIONT and other impact studies from our hackathons.
                  </p>
                  <span className="font-jetbrains text-xs text-gray-500">Coming soon</span>
                </div>
              </div>
            </ResourceSection>

            {/* Social Media Section */}
            <ResourceSection title="Social Media" icon={Share2}>
              <div className="grid md:grid-cols-3 gap-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pixel-card bg-black border-2 border-maximally-yellow p-6 hover:scale-105 transition-all duration-300 hover:border-maximally-red group"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{social.icon}</div>
                      <h3 className="font-press-start text-sm text-maximally-yellow group-hover:text-maximally-red transition-colors">
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