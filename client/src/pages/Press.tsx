import { Download, ExternalLink, Calendar, FileText } from "lucide-react";
import SEO from "@/components/SEO";

const Press = () => {
  const pressReleases = [
    {
      title: "Maximally Launches Grand Indian Hackathon Season",
      date: "September 1, 2025",
      excerpt: "8 hackathons back-to-back from September to November 2025",
      link: "/press/gihs-launch",
      category: "Launch"
    },
    {
      title: "AI Shipathon Sets New Global Participation Record", 
      date: "August 15, 2025",
      excerpt: "48-hour AI hackathon attracts builders from 50+ countries",
      link: "/press/ai-shipathon-record",
      category: "Achievement"
    },
    {
      title: "Maximally Announces MFHOP Federation",
      date: "July 20, 2025", 
      excerpt: "Network of hackathon organizers to standardize and scale events",
      link: "/press/mfhop-launch",
      category: "Launch"
    }
  ];

  const mediaMentions = [
    {
      outlet: "Tech Crunch",
      title: "The Rise of Global Hackathon Leagues",
      date: "Coming Soon",
      type: "Feature Article",
      status: "upcoming"
    },
    {
      outlet: "YourStory", 
      title: "Building the Future of Hackathon Culture",
      date: "Coming Soon",
      type: "Interview",
      status: "upcoming"
    },
    {
      outlet: "The Ken",
      title: "How Maximally is Changing Student Innovation",
      date: "Coming Soon", 
      type: "Deep Dive",
      status: "upcoming"
    }
  ];

  const mediaKit = [
    {
      name: "Logo Pack",
      description: "High-resolution logos in various formats",
      file: "maximally-logo-pack.zip",
      size: "2.4 MB"
    },
    {
      name: "Brand Guidelines", 
      description: "Colors, fonts, and usage guidelines",
      file: "maximally-brand-guide.pdf",
      size: "1.8 MB"
    },
    {
      name: "Press Kit",
      description: "Company overview, stats, and key messages",
      file: "maximally-press-kit.pdf", 
      size: "3.2 MB"
    },
    {
      name: "Founder Photos",
      description: "High-resolution team and founder photos",
      file: "maximally-team-photos.zip",
      size: "15.6 MB"
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      <SEO 
        title="Press | Media Kit & News | Maximally"
        description="Latest press releases, media mentions, and downloadable media kit for Maximally - the global hackathon league for builders."
      />

      {/* Hero Section */}
      <section className="py-20 bg-maximally-black relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 animate-grid-flow" />
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="font-press-start text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            <span className="bg-maximally-red/20 px-2">Press</span> & Media Center
          </h1>
          <p className="font-jetbrains text-white/90 text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
            Latest news, press releases, and media resources for the global hackathon league.
          </p>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:scale-105 transition-transform">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded text-xs font-jetbrains ${
                        release.category === 'Launch' ? 'bg-maximally-red text-white' : 'bg-maximally-blue text-white'
                      }`}>
                        {release.category}
                      </span>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span className="font-jetbrains text-sm">{release.date}</span>
                      </div>
                    </div>
                    <h3 className="font-press-start text-xl mb-3">{release.title}</h3>
                    <p className="font-jetbrains text-gray-600 mb-4">{release.excerpt}</p>
                  </div>
                  <a href={release.link} className="pixel-button bg-maximally-red text-white px-4 py-2 text-sm hover:bg-maximally-yellow hover:text-black transition-all flex items-center gap-2">
                    <span>Read More</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Mentions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">Media Mentions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediaMentions.map((mention, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-press-start text-lg">{mention.outlet}</div>
                  <span className={`px-2 py-1 rounded text-xs font-jetbrains ${
                    mention.status === 'upcoming' ? 'bg-maximally-yellow text-black' : 'bg-maximally-green text-white'
                  }`}>
                    {mention.status === 'upcoming' ? 'COMING SOON' : 'PUBLISHED'}
                  </span>
                </div>
                <h3 className="font-jetbrains text-lg mb-3">{mention.title}</h3>
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <FileText className="h-4 w-4" />
                  <span className="font-jetbrains text-sm">{mention.type}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span className="font-jetbrains text-sm">{mention.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit Downloads */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">Media Kit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mediaKit.map((item, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg flex items-center justify-between hover:scale-105 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-maximally-red rounded-lg flex items-center justify-center">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-press-start text-lg mb-1">{item.name}</h3>
                    <p className="font-jetbrains text-gray-600 text-sm mb-1">{item.description}</p>
                    <span className="font-jetbrains text-xs text-gray-500">{item.size}</span>
                  </div>
                </div>
                <button className="pixel-button bg-maximally-blue text-white px-4 py-2 text-sm hover:bg-maximally-green transition-all">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-maximally-black text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="text-6xl mb-8">"</div>
            <blockquote className="font-jetbrains text-2xl md:text-3xl mb-8 leading-relaxed">
              Maximally is redefining what hackathons can be. They're not just organizing events - they're building the future infrastructure of innovation.
            </blockquote>
            <div className="font-press-start text-lg text-maximally-red">
              — Industry Observer
            </div>
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-press-start text-3xl mb-8">Press Contact</h2>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="font-press-start text-xl mb-4">Media Inquiries</h3>
              <p className="font-jetbrains text-gray-600 mb-6">
                For press releases, interviews, and media requests, please contact our press team.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <span className="font-jetbrains">Email:</span>
                  <a href="mailto:press@maximally.in" className="font-jetbrains text-maximally-red hover:underline">
                    press@maximally.in
                  </a>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-jetbrains">Response Time:</span>
                  <span className="font-jetbrains text-gray-600">24-48 hours</span>
                </div>
              </div>
              <div className="mt-8">
                <a href="mailto:press@maximally.in" className="pixel-button bg-maximally-red text-white px-8 py-4 hover:bg-maximally-yellow hover:text-black transition-all">
                  Contact Press Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Press;