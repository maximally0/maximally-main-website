import { ArrowRight, BookOpen, Video, Users, FileText, Download, ExternalLink, Mail, Youtube, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const Resources = () => {
  const blogPosts = [
    { title: "AI Shipathon Guide", slug: "/blog/no-code-ai-shipathon", category: "Guide" },
    { title: "First AI Project in 48 Hours", slug: "/blog/first-ai-project-48-hours", category: "Tutorial" },
    { title: "Protocol 404: When System Broken", slug: "/blog/protocol-404-when-system-broken", category: "Event" },
    { title: "Project CodeGen: Beyond Hackathons", slug: "/blog/project-codegen-beyond-hackathons", category: "Platform" },
  ];

  const webinars = [
    { title: "Building Your First AI Project", date: "Jan 15, 2025", status: "upcoming", link: "/events" },
    { title: "Hackathon Survival Guide", date: "Dec 20, 2024", status: "recorded", link: "/blog" },
    { title: "From Idea to MVP in 7 Days", date: "Nov 15, 2024", status: "recorded", link: "/blog" },
  ];

  const docs = [
    { title: "Judge Handbook", desc: "Complete guide for hackathon judges", link: "/docs#judge-handbook" },
    { title: "Participant Handbook", desc: "Everything participants need to know", link: "/docs#participant-handbook" },
    { title: "Sponsor/Partner Deck", desc: "Partnership opportunities and benefits", link: "/docs#sponsor-deck" },
    { title: "Press Kit", desc: "Media resources and brand assets", link: "/press" },
    { title: "FAQ", desc: "Frequently asked questions", link: "/docs#faq" },
  ];

  return (
    <div className="min-h-screen pt-20">
      <SEO 
        title="Resources | Content & Community Hub | Maximally"
        description="Access Maximally's complete resource library: blog posts, webinars, community links, guides, and documentation for builders worldwide."
      />

      {/* Hero Section */}
      <section className="py-20 bg-maximally-black relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 animate-grid-flow" />
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="font-press-start text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            <span className="bg-maximally-red/20 px-2">Resources</span> & Community Hub
          </h1>
          <p className="font-jetbrains text-white/90 text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
            Everything you need to build, learn, and connect. Content, community, and tools for ambitious builders.
          </p>
        </div>
      </section>

      {/* Quick Access Initiatives */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link to="/events" className="bg-maximally-red/10 p-6 rounded-lg hover:scale-105 transition-transform border-2 border-transparent hover:border-maximally-red">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-press-start text-lg mb-3">Hackathons</h3>
              <p className="font-jetbrains text-gray-600">All our events and competitions</p>
            </Link>
            <Link to="/federation" className="bg-maximally-blue/10 p-6 rounded-lg hover:scale-105 transition-transform border-2 border-transparent hover:border-maximally-blue">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-press-start text-lg mb-3">MFHOP</h3>
              <p className="font-jetbrains text-gray-600">Hackathon organizers federation</p>
            </Link>
            <Link to="/blog" className="bg-maximally-green/10 p-6 rounded-lg hover:scale-105 transition-transform border-2 border-transparent hover:border-maximally-green">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="font-press-start text-lg mb-3">Platform</h3>
              <p className="font-jetbrains text-gray-600">MaximallyHack development</p>
            </Link>
            <Link to="/blog" className="bg-maximally-yellow/10 p-6 rounded-lg hover:scale-105 transition-transform border-2 border-transparent hover:border-maximally-yellow">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="font-press-start text-lg mb-3">Studios</h3>
              <p className="font-jetbrains text-gray-600">Content and media vertical</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-press-start text-3xl">Latest Blog Posts</h2>
            <Link to="/blog" className="pixel-button bg-maximally-red text-white px-6 py-3 hover:bg-maximally-yellow hover:text-black transition-all">
              View All Posts
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <Link key={index} to={post.slug} className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-maximally-red" />
                  <span className="font-jetbrains text-sm text-maximally-red">{post.category}</span>
                </div>
                <h3 className="font-press-start text-lg mb-3">{post.title}</h3>
                <div className="flex items-center text-maximally-red">
                  <span className="font-jetbrains text-sm">Read More</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Webinars Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">Webinars & Sessions</h2>
          <div className="space-y-6">
            {webinars.map((webinar, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    webinar.status === 'upcoming' ? 'bg-maximally-green' : 'bg-gray-400'
                  }`}>
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-press-start text-lg mb-2">{webinar.title}</h3>
                    <div className="font-jetbrains text-gray-600">{webinar.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-jetbrains text-sm px-3 py-1 rounded ${
                    webinar.status === 'upcoming' ? 'bg-maximally-green text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {webinar.status === 'upcoming' ? 'UPCOMING' : 'RECORDED'}
                  </span>
                  <Link to={webinar.link} className="pixel-button bg-maximally-red text-white px-4 py-2 text-sm hover:bg-maximally-yellow hover:text-black">
                    {webinar.status === 'upcoming' ? 'Register' : 'Watch'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">Join Our Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <a href="https://discord.gg/MpBnYk8qMX" target="_blank" rel="noopener noreferrer" 
               className="bg-[#5865F2]/10 p-8 rounded-lg text-center hover:scale-105 transition-transform border-2 border-transparent hover:border-[#5865F2]">
              <MessageCircle className="h-12 w-12 text-[#5865F2] mx-auto mb-4" />
              <h3 className="font-press-start text-lg mb-3">Discord</h3>
              <p className="font-jetbrains text-gray-600 mb-4">Real-time chat, events, and updates</p>
              <div className="font-jetbrains text-sm text-[#5865F2]">1000+ Members</div>
            </a>
            <div className="bg-[#25D366]/10 p-8 rounded-lg text-center hover:scale-105 transition-transform border-2 border-transparent hover:border-[#25D366]">
              <Users className="h-12 w-12 text-[#25D366] mx-auto mb-4" />
              <h3 className="font-press-start text-lg mb-3">WhatsApp</h3>
              <p className="font-jetbrains text-gray-600 mb-4">Regional groups and announcements</p>
              <div className="font-jetbrains text-sm text-[#25D366]">Multiple Groups</div>
            </div>
            <div className="bg-[#229ED9]/10 p-8 rounded-lg text-center hover:scale-105 transition-transform border-2 border-transparent hover:border-[#229ED9]">
              <Mail className="h-12 w-12 text-[#229ED9] mx-auto mb-4" />
              <h3 className="font-press-start text-lg mb-3">Newsletter</h3>
              <p className="font-jetbrains text-gray-600 mb-4">Weekly updates and insights</p>
              <div className="font-jetbrains text-sm text-[#229ED9]">Coming Soon</div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-press-start text-3xl mb-8">YouTube Channel</h2>
          <div className="bg-[#FF0000]/10 p-8 rounded-lg max-w-2xl mx-auto border-2 border-transparent hover:border-[#FF0000] transition-colors">
            <Youtube className="h-16 w-16 text-[#FF0000] mx-auto mb-6" />
            <h3 className="font-press-start text-2xl mb-4">Maximally Studios</h3>
            <p className="font-jetbrains text-gray-600 mb-6">
              Hackathon highlights, builder interviews, and behind-the-scenes content
            </p>
            <a href="https://youtube.com/@maximally" target="_blank" rel="noopener noreferrer" 
               className="pixel-button bg-[#FF0000] text-white px-8 py-4 hover:bg-red-600 transition-all inline-flex items-center gap-2">
              <Youtube className="h-5 w-5" />
              Watch Videos
            </a>
          </div>
        </div>
      </section>

      {/* Docs & Guides Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-press-start text-3xl">Documentation & Guides</h2>
            <Link to="/docs" className="pixel-button bg-maximally-blue text-white px-6 py-3 hover:bg-maximally-green transition-all">
              Full Docs
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docs.map((doc, index) => (
              <Link key={index} to={doc.link} className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-maximally-blue" />
                  <h3 className="font-press-start text-lg">{doc.title}</h3>
                </div>
                <p className="font-jetbrains text-gray-600 mb-4">{doc.desc}</p>
                <div className="flex items-center text-maximally-blue">
                  <span className="font-jetbrains text-sm">Access Guide</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Research & Reports */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">Research & Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Download className="h-6 w-6 text-maximally-green" />
                <h3 className="font-press-start text-xl">Project SYMBIONT</h3>
              </div>
              <p className="font-jetbrains text-gray-600 mb-6">
                Case study on AI-human collaboration in hackathon environments
              </p>
              <button className="pixel-button bg-maximally-green text-white px-6 py-3 hover:bg-green-600 transition-all">
                Download Report
              </button>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-maximally-blue" />
                <h3 className="font-press-start text-xl">Hackathon Impact Study</h3>
              </div>
              <p className="font-jetbrains text-gray-600 mb-6">
                Analysis of builder outcomes and career acceleration
              </p>
              <button className="pixel-button bg-maximally-blue text-white px-6 py-3 hover:bg-blue-600 transition-all">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Links */}
      <section className="py-16 bg-maximally-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-press-start text-3xl mb-12">Follow Us</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="https://instagram.com/maximally.in" target="_blank" rel="noopener noreferrer" 
               className="pixel-button bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 hover:scale-105 transition-all">
              Instagram
            </a>
            <a href="https://twitter.com/maximally_in" target="_blank" rel="noopener noreferrer" 
               className="pixel-button bg-black border-2 border-white text-white px-6 py-3 hover:border-maximally-red transition-all">
              X (Twitter)
            </a>
            <a href="https://linkedin.com/company/maximally" target="_blank" rel="noopener noreferrer" 
               className="pixel-button bg-[#0077B5] text-white px-6 py-3 hover:bg-blue-700 transition-all">
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;