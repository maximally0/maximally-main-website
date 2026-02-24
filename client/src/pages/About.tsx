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
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
      
      <div className="absolute top-20 left-[5%] w-80 h-80 bg-orange-500/5 rounded-full blur-[100px]" />
      <div className="absolute top-60 right-[10%] w-60 h-60 bg-orange-500/3 rounded-full blur-[80px]" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 mb-6">
          <Code className="w-4 h-4 text-orange-400" />
          <span className="font-space font-semibold text-[10px] sm:text-xs text-orange-400 tracking-wider">
            OUR STORY
          </span>
        </div>
        
        <h1 className="font-space font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
          ABOUT{" "}
          <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
            MAXIMALLY
          </span>
        </h1>
        
        <div className="bg-black/40 border border-gray-800 p-6 sm:p-8 max-w-4xl mx-auto backdrop-blur-sm">
          <p className="font-space font-semibold text-orange-400 text-sm sm:text-base mb-4">
            HACKATHONS AS CULTURE, NOT JUST CODE
          </p>
          
          <p className="font-space text-gray-400 text-sm sm:text-base leading-relaxed">
            Hackathons have always been more than just code. They are experiments in how people think, 
            create, and work together under pressure. They are places where rules bend, ideas collide, 
            and the boundaries of what's possible shift overnight.
          </p>
          
          <p className="font-space text-gray-400 text-sm sm:text-base leading-relaxed mt-4">
            Yet, for too long, hackathons have been scattered — run in silos, limited by geography, 
            or tied to a single school or company. Maximally was born out of a simple belief: 
            <span className="text-white font-semibold"> hackathons deserve to be open, accessible, and cultural.</span>
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
      gradient: 'from-orange-500/10 to-orange-500/5',
      border: 'border-gray-800',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
      link: "/events"
    },
    {
      title: "MAXIMALLY PLATFORM",
      description: "An AI-native hackathon platform that gives organizers creative tools for submissions, judging, and community engagement.",
      icon: Code,
      gradient: 'from-orange-500/10 to-orange-500/5',
      border: 'border-gray-800',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
      link: "#"
    },
    {
      title: "EXPLORE MAXIMALLY",
      description: "Your gateway to opportunities beyond hackathons — careers, resources, labs, fellowships, and community initiatives.",
      icon: Sparkles,
      gradient: 'from-orange-500/10 to-orange-500/5',
      border: 'border-gray-800',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
      link: "/explore"
    },
    {
      title: "FEDERATION (MFHOP)",
      description: "A cross-school, cross-company network where organizers share resources, partnerships, and reach.",
      icon: Globe,
      gradient: 'from-orange-500/10 to-orange-500/5',
      border: 'border-gray-800',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
      link: "/mfhop"
    },
    {
      title: "COMMUNITY",
      description: "A living network of participants, mentors, and judges that stays connected long after events end.",
      icon: Heart,
      gradient: 'from-orange-500/10 to-orange-500/5',
      border: 'border-gray-800',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
      link: "https://discord.gg/MpBnYk8qMX"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/5 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 mb-6">
            <Rocket className="w-4 h-4 text-orange-400" />
            <span className="font-space font-semibold text-[10px] sm:text-xs text-orange-400">OUR VISION</span>
          </div>
          <h2 className="font-space font-bold text-xl sm:text-2xl md:text-3xl text-white mb-4">
            WHAT WE'RE{" "}
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              BUILDING
            </span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {buildingBlocks.map((block, index) => (
            <div 
              key={index} 
              className={`group bg-gradient-to-br ${block.gradient} border ${block.border} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] hover:border-orange-500/50`}
              data-testid={`building-block-${index}`}
            >
              <div className={`${block.iconBg} border ${block.border} w-12 h-12 flex items-center justify-center mb-4`}>
                <block.icon className={`h-6 w-6 ${block.iconColor}`} />
              </div>
              
              <h3 className="font-space font-semibold text-xs text-white mb-3 group-hover:text-orange-400 transition-colors">
                {block.title}
              </h3>
              
              <p className="font-space text-gray-400 text-sm leading-relaxed mb-4">
                {block.description}
              </p>
              
              {block.link.startsWith('http') ? (
                <a 
                  href={block.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center font-space font-semibold text-[10px] ${block.iconColor} hover:text-white transition-colors`}
                >
                  EXPLORE <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              ) : (
                <Link 
                  to={block.link}
                  className={`inline-flex items-center font-space font-semibold text-[10px] ${block.iconColor} hover:text-white transition-colors`}
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
      gradient: 'from-orange-500/10 to-orange-500/5',
      border: 'border-gray-800',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400'
    },
    {
      name: "MakeX",
      type: "Technology Partnership", 
      description: "Innovative technology company supporting our hackathon infrastructure",
      highlight: "Tech Partner",
      gradient: 'from-orange-500/10 to-orange-500/5',
      border: 'border-gray-800',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400'
    },
    {
      name: "Young Researchers Institute",
      type: "Research Partnership",
      description: "Advancing research and innovation in youth-led technology initiatives",
      highlight: "Research Partner",
      gradient: 'from-orange-500/10 to-orange-500/5',
      border: 'border-gray-800',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400'
    },
    {
      name: "NexFellow",
      type: "Media Partnership",
      description: "Amplifying stories of young builders and innovators through strategic media coverage",
      highlight: "Media Partner",
      gradient: 'from-orange-500/10 to-orange-500/5',
      border: 'border-gray-800',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/5 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 mb-6">
            <Heart className="w-4 h-4 text-orange-400" />
            <span className="font-space font-semibold text-[10px] sm:text-xs text-orange-400">SUPPORTERS</span>
          </div>
          <h2 className="font-space font-bold text-xl sm:text-2xl md:text-3xl text-white mb-4">
            OUR{" "}
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              PARTNERS
            </span>
          </h2>
          <p className="font-space font-semibold text-orange-400 text-xs sm:text-sm">
            THEY BELIEVE IN OUR VISION
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className={`group bg-gradient-to-br ${partner.gradient} border ${partner.border} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] hover:border-orange-500/50`}
              data-testid={`partner-${index}`}
            >
              <div className={`${partner.iconBg} border ${partner.border} px-3 py-1.5 inline-block mb-4`}>
                <span className="font-space font-semibold text-[10px] text-white">
                  {partner.highlight}
                </span>
              </div>
              
              <h3 className="font-space font-semibold text-sm text-white mb-2 group-hover:text-orange-400 transition-colors">
                {partner.name}
              </h3>
              
              <p className={`font-space font-semibold text-[10px] ${partner.iconColor} mb-4`}>
                {partner.type}
              </p>
              
              <p className="font-space text-gray-400 text-sm leading-relaxed mb-4">
                {partner.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${partner.iconBg}`} />
                  <span className="font-space font-semibold text-[9px] text-gray-500">
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/10 border border-orange-500/30 hover:border-orange-500 text-orange-400 hover:text-orange-300 font-space font-semibold text-[10px] transition-all duration-300"
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
          <div className="p-8 sm:p-12 bg-gradient-to-br from-orange-950/15 via-black to-gray-950/20 border border-orange-500/30 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.08)_0%,transparent_70%)]" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-orange-500/10 border border-orange-500/30">
                <Mail className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="font-space font-bold text-base sm:text-lg md:text-xl text-white mb-4">
                Get in Touch
              </h3>
              <p className="font-space text-sm sm:text-base text-gray-400 mb-8 max-w-xl mx-auto">
                Have questions or want to collaborate? We'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:hello@maximally.in"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-500/50 hover:border-orange-400 text-white hover:text-white font-space font-semibold text-[10px] sm:text-xs transition-all duration-300"
                  data-testid="button-email-us"
                >
                  <Mail className="h-4 w-4" />
                  EMAIL US
                </a>
                <a
                  href="https://discord.gg/MpBnYk8qMX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black/40 border border-gray-700 hover:border-orange-500/50 text-gray-300 hover:text-orange-400 font-space font-semibold text-[10px] sm:text-xs transition-all duration-300"
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
        title="About Maximally | Builder Ecosystem Platform"
        description="Learn about Maximally's mission to make hackathons open, accessible, and cultural. Meet our team, partners, and discover what we're building."
        keywords="about maximally, hackathon platform, builders, global hackathons, builder ecosystem"
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
