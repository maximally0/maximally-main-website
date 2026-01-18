import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Globe, 
  Code, 
  Calendar, 
  ExternalLink,
  Zap,
  Heart,
  Mail,
  Sparkles,
  Rocket,
  MessageSquare
} from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

// REMOVED - Judge account system deprecated (Platform Simplification)
// FeaturedJudge interface removed - judges are now managed per-hackathon without accounts

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-black text-white relative overflow-hidden flex items-center pt-24 sm:pt-32">
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
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 mb-6">
          <Code className="w-4 h-4 text-purple-400" />
          <span className="font-press-start text-[10px] sm:text-xs text-purple-300 tracking-wider">
            OUR STORY
          </span>
        </div>
        
        <h1 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
          ABOUT{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            MAXIMALLY
          </span>
        </h1>
        
        <div className="bg-black/40 border border-purple-500/30 p-6 sm:p-8 max-w-4xl mx-auto backdrop-blur-sm">
          <p className="font-press-start text-purple-300 text-sm sm:text-base mb-4">
            HACKATHONS AS CULTURE, NOT JUST CODE
          </p>
          
          <p className="font-jetbrains text-gray-400 text-sm sm:text-base leading-relaxed">
            Hackathons have always been more than just code. They are experiments in how people think, 
            create, and work together under pressure. They are places where rules bend, ideas collide, 
            and the boundaries of what's possible shift overnight.
          </p>
          
          <p className="font-jetbrains text-gray-400 text-sm sm:text-base leading-relaxed mt-4">
            Yet, for too long, hackathons have been scattered — run in silos, limited by geography, 
            or tied to a single school or company. Maximally was born out of a simple belief: 
            <span className="text-purple-300 font-semibold"> hackathons deserve to be open, accessible, and cultural.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

const WhatWereBuilding = () => {
  const buildingBlocks = [
    {
      title: "HACKATHONS (EVENTS)",
      description: "Where it all started. We run global online and hybrid hackathons with open themes, beginner-friendly tracks, and experimental formats.",
      icon: Calendar,
      gradient: 'from-rose-500/20 to-red-500/20',
      border: 'border-rose-500/40',
      iconBg: 'bg-rose-500/20',
      iconColor: 'text-rose-400',
      link: "/events"
    },
    {
      title: "MAXIMALLY PLATFORM",
      description: "An AI-native hackathon platform that gives organizers creative tools for submissions, judging, and community engagement.",
      icon: Code,
      gradient: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/40',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      link: "#"
    },
    {
      title: "EXPLORE MAXIMALLY",
      description: "Your gateway to opportunities beyond hackathons — careers, resources, labs, fellowships, and community initiatives.",
      icon: Sparkles,
      gradient: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/40',
      iconBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-400',
      link: "/explore"
    },
    {
      title: "FEDERATION (MFHOP)",
      description: "A cross-school, cross-company network where organizers share resources, partnerships, and reach.",
      icon: Globe,
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/40',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400',
      link: "/mfhop"
    },
    {
      title: "COMMUNITY",
      description: "A living network of participants, mentors, and judges that stays connected long after events end.",
      icon: Heart,
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/40',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      link: "https://discord.gg/MpBnYk8qMX"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 mb-6">
            <Rocket className="w-4 h-4 text-amber-400" />
            <span className="font-press-start text-[10px] sm:text-xs text-amber-300">OUR VISION</span>
          </div>
          <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl text-white mb-4">
            WHAT WE'RE{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              BUILDING
            </span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {buildingBlocks.map((block, index) => (
            <div 
              key={index} 
              className={`group bg-gradient-to-br ${block.gradient} border ${block.border} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]`}
              data-testid={`building-block-${index}`}
            >
              <div className={`${block.iconBg} border ${block.border} w-12 h-12 flex items-center justify-center mb-4`}>
                <block.icon className={`h-6 w-6 ${block.iconColor}`} />
              </div>
              
              <h3 className="font-press-start text-xs text-white mb-3 group-hover:text-purple-300 transition-colors">
                {block.title}
              </h3>
              
              <p className="font-jetbrains text-gray-400 text-sm leading-relaxed mb-4">
                {block.description}
              </p>
              
              {block.link.startsWith('http') ? (
                <a 
                  href={block.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center font-press-start text-[10px] ${block.iconColor} hover:text-white transition-colors`}
                >
                  EXPLORE <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              ) : (
                <Link 
                  to={block.link}
                  className={`inline-flex items-center font-press-start text-[10px] ${block.iconColor} hover:text-white transition-colors`}
                >
                  EXPLORE <ArrowRight className="h-3 w-3 ml-2" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



const Partners = () => {
  const partners = [
    {
      name: "Masters' Union",
      type: "Educational Partnership",
      description: "Leading business school backing our vision of creating entrepreneurial leaders",
      highlight: "Education Partner",
      gradient: 'from-rose-500/20 to-red-500/20',
      border: 'border-rose-500/40',
      iconBg: 'bg-rose-500/20',
      iconColor: 'text-rose-400'
    },
    {
      name: "MakeX",
      type: "Technology Partnership", 
      description: "Innovative technology company supporting our hackathon infrastructure",
      highlight: "Tech Partner",
      gradient: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/40',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400'
    },
    {
      name: "Young Researchers Institute",
      type: "Research Partnership",
      description: "Advancing research and innovation in youth-led technology initiatives",
      highlight: "Research Partner",
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/40',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400'
    },
    {
      name: "NexFellow",
      type: "Media Partnership",
      description: "Amplifying stories of young builders and innovators through strategic media coverage",
      highlight: "Media Partner",
      gradient: 'from-purple-500/20 to-violet-500/20',
      border: 'border-purple-500/40',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 mb-6">
            <Heart className="w-4 h-4 text-cyan-400" />
            <span className="font-press-start text-[10px] sm:text-xs text-cyan-300">SUPPORTERS</span>
          </div>
          <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl text-white mb-4">
            OUR{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              PARTNERS
            </span>
          </h2>
          <p className="font-press-start text-purple-300 text-xs sm:text-sm">
            THEY BELIEVE IN OUR VISION
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className={`group bg-gradient-to-br ${partner.gradient} border ${partner.border} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]`}
              data-testid={`partner-${index}`}
            >
              <div className={`${partner.iconBg} border ${partner.border} px-3 py-1.5 inline-block mb-4`}>
                <span className="font-press-start text-[10px] text-white">
                  {partner.highlight}
                </span>
              </div>
              
              <h3 className="font-press-start text-sm text-white mb-2 group-hover:text-purple-300 transition-colors">
                {partner.name}
              </h3>
              
              <p className={`font-press-start text-[10px] ${partner.iconColor} mb-4`}>
                {partner.type}
              </p>
              
              <p className="font-jetbrains text-gray-400 text-sm leading-relaxed mb-4">
                {partner.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${partner.iconBg}`} />
                  <span className="font-press-start text-[9px] text-gray-500">
                    ACTIVE PARTNER
                  </span>
                </div>
                
                <div className={`${partner.iconBg} border ${partner.border} p-2`}>
                  <Heart className={`h-4 w-4 ${partner.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            to="/sponsor" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 border border-purple-500/40 hover:border-purple-400 text-purple-300 hover:text-purple-200 font-press-start text-[10px] transition-all duration-300"
            data-testid="link-become-partner"
          >
            BECOME A PARTNER <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-black relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 sm:p-12 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 border border-purple-500/30 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-purple-500/20 border border-purple-500/40">
                <Mail className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="font-press-start text-base sm:text-lg md:text-xl text-white mb-4">
                Get in Touch
              </h3>
              <p className="font-jetbrains text-sm sm:text-base text-gray-400 mb-8 max-w-xl mx-auto">
                Have questions or want to collaborate? We'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:hello@maximally.in"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-press-start text-[10px] sm:text-xs transition-all duration-300"
                  data-testid="button-email-us"
                >
                  <Mail className="h-4 w-4" />
                  EMAIL US
                </a>
                <a
                  href="https://discord.gg/MpBnYk8qMX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black/40 border border-gray-700 hover:border-purple-500/50 text-gray-300 hover:text-purple-300 font-press-start text-[10px] sm:text-xs transition-all duration-300"
                  data-testid="button-join-discord"
                >
                  <MessageSquare className="h-4 w-4" />
                  JOIN DISCORD
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <>
      <SEO
        title="About Maximally | Global Hackathon Platform for Teen Builders"
        description="Learn about Maximally's mission to make hackathons open, accessible, and cultural. Meet our team, partners, and discover what we're building."
        keywords="about maximally, hackathon platform, teen hackers, global hackathons, youth innovation"
        canonicalUrl="https://maximally.in/about"
      />
      
      <div className="min-h-screen bg-black text-white">
        <HeroSection />
        <WhatWereBuilding />
        <Partners />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
};

export default About;
