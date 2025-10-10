import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Globe, 
  Code, 
  Users, 
  Trophy, 
  Calendar, 
  ExternalLink,
  Target,
  Zap,
  Heart,
  MapPin,
  Mail,
  Loader2
} from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { supabase } from '@/lib/supabaseClient';

// Interfaces for dynamic data
interface CoreTeamMember {
  id: number;
  name: string;
  role_in_company: string;
  company?: string;
  description?: string;
}

interface FeaturedJudge {
  id: number;
  name: string;
  role_in_company: string;
  company: string;
}

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="min-h-screen bg-black text-white relative overflow-hidden flex items-center">
      {/* Pixel Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(229,9,20,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      
      {/* Floating Pixels */}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-maximally-red pixel-border animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + i}s`,
          }}
        />
      ))}
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <div className="minecraft-block bg-maximally-red p-4 inline-block mb-6">
          <Code className="h-8 w-8 text-black" />
        </div>
        
        <h1 className="font-press-start text-3xl md:text-4xl lg:text-6xl mb-6 text-white drop-shadow-[4px_4px_0px_rgba(229,9,20,1)]">
          ABOUT MAXIMALLY
        </h1>
        
        <div className="pixel-card bg-black/80 border-2 border-maximally-red p-6 md:p-8 max-w-4xl mx-auto">
          <p className="font-press-start text-maximally-red text-lg md:text-xl mb-4">
            HACKATHONS AS CULTURE, NOT JUST CODE
          </p>
          
          <p className="font-jetbrains text-gray-300 text-base md:text-lg leading-relaxed">
            Hackathons have always been more than just code. They are experiments in how people think, 
            create, and work together under pressure. They are places where rules bend, ideas collide, 
            and the boundaries of what's possible shift overnight.
          </p>
          
          <p className="font-jetbrains text-gray-300 text-base md:text-lg leading-relaxed mt-4">
            Yet, for too long, hackathons have been scattered — run in silos, limited by geography, 
            or tied to a single school or company. Maximally was born out of a simple belief: 
            hackathons deserve to be open, accessible, and cultural.
          </p>
        </div>
      </div>
    </section>
  );
};

// What We're Building Component
const WhatWereBuilding = () => {
  const colorClasses = {
    'maximally-red': {
      border: 'border-maximally-red',
      bg: 'bg-maximally-red',
      text: 'text-maximally-red'
    },
    'maximally-yellow': {
      border: 'border-maximally-yellow',
      bg: 'bg-maximally-yellow', 
      text: 'text-maximally-yellow'
    },
    'green-500': {
      border: 'border-green-500',
      bg: 'bg-green-500',
      text: 'text-green-500'
    },
    'blue-500': {
      border: 'border-blue-500',
      bg: 'bg-blue-500',
      text: 'text-blue-500'
    },
    'purple-500': {
      border: 'border-purple-500',
      bg: 'bg-purple-500',
      text: 'text-purple-500'
    }
  };

  const buildingBlocks = [
    {
      title: "HACKATHONS (EVENTS)",
      description: "Where it all started. We run global online and hybrid hackathons with open themes, beginner-friendly tracks, and experimental formats.",
      icon: Calendar,
      color: "maximally-red",
      link: "/events"
    },
    {
      title: "MAXIMALLY PLATFORM",
      description: "An AI-native hackathon platform that gives organizers creative tools for submissions, judging, and community engagement.",
      icon: Code,
      color: "maximally-yellow",
      link: "#"
    },
    {
      title: "FEDERATION (MFHOP)",
      description: "A cross-school, cross-company network where organizers share resources, partnerships, and reach.",
      icon: Globe,
      color: "green-500",
      link: "/mfhop"
    },
    {
      title: "STUDIOS",
      description: "Content around hackathons, innovation, and youth culture — documenting stories and voices of builders.",
      icon: Users,
      color: "blue-500",
      link: "/blog"
    },
    {
      title: "COMMUNITY",
      description: "A living network of participants, mentors, and judges that stays connected long after events end.",
      icon: Heart,
      color: "purple-500",
      link: "https://discord.gg/MpBnYk8qMX"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-900 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,203,71,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,203,71,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-press-start text-2xl md:text-3xl lg:text-4xl mb-4 text-maximally-yellow drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            WHAT WE'RE BUILDING
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildingBlocks.map((block, index) => {
            const colors = colorClasses[block.color as keyof typeof colorClasses];
            return (
              <div key={index} className={`pixel-card bg-black border-2 ${colors.border} p-6 hover:scale-105 transition-all duration-300 group`}>
                <div className={`minecraft-block ${colors.bg} p-3 inline-block mb-4 group-hover:animate-pulse`}>
                  <block.icon className="h-6 w-6 text-black" />
                </div>
                
                <h3 className="font-press-start text-sm md:text-base mb-4 text-white">
                  {block.title}
                </h3>
                
                <p className="font-jetbrains text-gray-300 text-sm leading-relaxed mb-4">
                  {block.description}
                </p>
                
                {block.link.startsWith('http') ? (
                  <a 
                    href={block.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`inline-flex items-center font-press-start text-xs ${colors.text} hover:text-white transition-colors`}
                  >
                    EXPLORE <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                ) : (
                  <Link 
                    to={block.link}
                    className={`inline-flex items-center font-press-start text-xs ${colors.text} hover:text-white transition-colors`}
                  >
                    EXPLORE <ArrowRight className="h-3 w-3 ml-2" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// People Preview Component
const PeoplePreview = () => {
  // State management for dynamic data
  const [coreTeam, setCoreTeam] = useState<CoreTeamMember[]>([]);
  const [featuredJudges, setFeaturedJudges] = useState<FeaturedJudge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard configuration and people/judges data
  useEffect(() => {
    const fetchPeopleData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, fetch dashboard configuration
        const { data: dashboardData, error: dashboardError } = await supabase
          .from('dashboard')
          .select('featured_core_id_1, featured_core_id_2, featured_core_id_3, featured_judge_id_1, featured_judge_id_2, featured_judge_id_3')
          .eq('id', 1)
          .single();

        if (dashboardError) {
          throw new Error(`Dashboard fetch failed: ${dashboardError.message}`);
        }

        // Extract core team IDs
        const coreIds = [
          dashboardData?.featured_core_id_1,
          dashboardData?.featured_core_id_2,
          dashboardData?.featured_core_id_3
        ].filter(id => id !== null);

        // Extract judge IDs
        const judgeIds = [
          dashboardData?.featured_judge_id_1,
          dashboardData?.featured_judge_id_2,
          dashboardData?.featured_judge_id_3
        ].filter(id => id !== null);

        // Fetch core team members
        if (coreIds.length > 0) {
          const { data: coreData, error: coreError } = await supabase
            .from('people')
            .select('id, name, role_in_company, company, description')
            .in('id', coreIds);

          if (coreError) {
            throw new Error(`Core team fetch failed: ${coreError.message}`);
          }

          // Sort core team members by the order they appear in dashboard configuration
          const sortedCoreTeam = coreIds.map(id => 
            coreData?.find(member => member.id === id)
          ).filter(member => member !== undefined) as CoreTeamMember[];

          setCoreTeam(sortedCoreTeam);
        }

        // Fetch featured judges
        if (judgeIds.length > 0) {
          const { data: judgeData, error: judgeError } = await supabase
            .from('judges')
            .select('id, name, role_in_company, company')
            .in('id', judgeIds);

          if (judgeError) {
            throw new Error(`Judges fetch failed: ${judgeError.message}`);
          }

          // Sort judges by the order they appear in dashboard configuration
          const sortedJudges = judgeIds.map(id => 
            judgeData?.find(judge => judge.id === id)
          ).filter(judge => judge !== undefined) as FeaturedJudge[];

          setFeaturedJudges(sortedJudges);
        }

      } catch (err: any) {
        setError(err.message || 'Failed to load people data');
      } finally {
        setLoading(false);
      }
    };

    fetchPeopleData();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-press-start text-2xl md:text-3xl lg:text-4xl mb-4 text-maximally-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            OUR PEOPLE
          </h2>
          <p className="font-jetbrains text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            Meet the students and builders behind Maximally
          </p>
        </div>
        
        {/* Core Team Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="minecraft-block bg-maximally-red p-3 inline-block mb-4">
              <Users className="h-6 w-6 text-black" />
            </div>
            <h3 className="font-press-start text-xl md:text-2xl text-maximally-red mb-2">
              CORE TEAM
            </h3>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="minecraft-block bg-maximally-red text-black px-6 py-4 inline-block mb-4">
                <span className="font-press-start text-sm flex items-center gap-2 justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  LOADING CORE TEAM
                </span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="minecraft-block bg-red-600 text-white px-6 py-4 inline-block mb-4">
                <span className="font-press-start text-sm">ERROR LOADING TEAM</span>
              </div>
              <p className="text-red-400 font-jetbrains mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="minecraft-block bg-maximally-red text-black px-4 py-2 hover:bg-maximally-yellow transition-colors"
              >
                <span className="font-press-start text-xs">RETRY</span>
              </button>
            </div>
          )}

          {/* Core Team Grid - Only show when data is loaded */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {coreTeam.map((member) => (
                <div key={member.id} className="pixel-card bg-black/90 border-2 border-maximally-red p-6 hover:scale-105 transition-all duration-300">
                  <div className="text-center">
                    <div className="minecraft-block bg-maximally-red p-2 inline-block mb-4">
                      <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                        <span className="font-press-start text-xs text-black">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="font-press-start text-sm text-white mb-2">
                      {member.name}
                    </h4>
                    
                    <p className="font-press-start text-xs text-maximally-red mb-3">
                      {member.role_in_company}
                    </p>
                    
                    {member.company && (
                      <p className="font-jetbrains text-xs text-gray-400 mb-2">
                        {member.company}
                      </p>
                    )}
                    
                    {member.description && (
                      <p className="font-jetbrains text-xs text-gray-300 leading-relaxed">
                        {member.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && !error && (
            <div className="text-center">
              <Link to="/people/core" className="pixel-button bg-maximally-red text-black font-press-start text-xs px-6 py-3 hover:bg-maximally-yellow transition-colors inline-flex items-center">
                SEE FULL TEAM <ArrowRight className="h-3 w-3 ml-2" />
              </Link>
            </div>
          )}
        </div>

        {/* Judges Preview */}
        <div>
          <div className="text-center mb-8">
            <div className="minecraft-block bg-maximally-yellow p-3 inline-block mb-4">
              <Trophy className="h-6 w-6 text-black" />
            </div>
            <h3 className="font-press-start text-xl md:text-2xl text-maximally-yellow mb-2">
              FEATURED JUDGES
            </h3>
          </div>
          
          {/* Loading State for Judges */}
          {loading && (
            <div className="text-center py-12">
              <div className="minecraft-block bg-maximally-yellow text-black px-6 py-4 inline-block mb-4">
                <span className="font-press-start text-sm flex items-center gap-2 justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  LOADING FEATURED JUDGES
                </span>
              </div>
            </div>
          )}

          {/* Error State for Judges */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="minecraft-block bg-red-600 text-white px-6 py-4 inline-block mb-4">
                <span className="font-press-start text-sm">ERROR LOADING JUDGES</span>
              </div>
              <p className="text-red-400 font-jetbrains mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="minecraft-block bg-maximally-yellow text-black px-4 py-2 hover:bg-maximally-red transition-colors"
              >
                <span className="font-press-start text-xs">RETRY</span>
              </button>
            </div>
          )}

          {/* Featured Judges Grid - Only show when data is loaded */}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {featuredJudges.map((judge) => (
                  <div key={judge.id} className="pixel-card bg-black/90 border-2 border-maximally-yellow p-6 hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                      <div className="minecraft-block bg-maximally-yellow p-2 inline-block mb-4">
                        <Trophy className="h-5 w-5 text-black" />
                      </div>
                      
                      <h4 className="font-press-start text-sm text-white mb-2">
                        {judge.name}
                      </h4>
                      
                      <p className="font-press-start text-xs text-maximally-yellow mb-1">
                        {judge.role_in_company}
                      </p>
                      
                      <p className="font-jetbrains text-xs text-gray-300">
                        {judge.company}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Link to="/people/judges" className="pixel-button bg-maximally-yellow text-black font-press-start text-xs px-6 py-3 hover:bg-maximally-red transition-colors inline-flex items-center">
                  ALL JUDGES & MENTORS <ArrowRight className="h-3 w-3 ml-2" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

// Partners Component
const Partners = () => {
  const partners = [
    {
      name: "Masters' Union",
      type: "Educational Partnership",
      description: "Leading business school backing our vision of creating entrepreneurial leaders",
      highlight: "Education Partner",
      color: {
        border: 'border-maximally-red',
        bg: 'bg-maximally-red',
        text: 'text-maximally-red'
      }
    },
    {
      name: "MakeX",
      type: "Technology Partnership", 
      description: "Innovative technology company supporting our hackathon infrastructure",
      highlight: "Tech Partner",
      color: {
        border: 'border-maximally-yellow',
        bg: 'bg-maximally-yellow',
        text: 'text-maximally-yellow'
      }
    },
    {
      name: "Young Researchers Institute",
      type: "Research Partnership",
      description: "Advancing research and innovation in youth-led technology initiatives",
      highlight: "Research Partner", 
      color: {
        border: 'border-green-500',
        bg: 'bg-green-500',
        text: 'text-green-500'
      }
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-900 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="minecraft-block bg-white p-4 inline-block mb-6">
            <Heart className="h-8 w-8 text-black" />
          </div>
          <h2 className="font-press-start text-2xl md:text-3xl lg:text-4xl mb-4 text-white drop-shadow-[4px_4px_0px_rgba(229,9,20,1)]">
            OUR PARTNERS
          </h2>
          <p className="font-press-start text-maximally-red text-lg">
            THEY BELIEVE IN OUR VISION
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {partners.map((partner, index) => (
            <div key={index} className={`pixel-card bg-black/90 border-2 ${partner.color.border} p-8 hover:scale-105 transition-all duration-300 group relative overflow-hidden`}>
              {/* Background glow effect */}
              <div className={`absolute inset-0 ${partner.color.bg} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative z-10">
                {/* Partner highlight badge */}
                <div className={`minecraft-block ${partner.color.bg} px-4 py-2 inline-block mb-4`}>
                  <span className="font-press-start text-xs text-black">
                    {partner.highlight}
                  </span>
                </div>
                
                {/* Partner name */}
                <h3 className="font-press-start text-lg md:text-xl text-white mb-2">
                  {partner.name}
                </h3>
                
                {/* Partner type */}
                <p className={`font-press-start text-sm ${partner.color.text} mb-4`}>
                  {partner.type}
                </p>
                
                {/* Description */}
                <p className="font-jetbrains text-gray-300 text-sm leading-relaxed mb-6">
                  {partner.description}
                </p>
                
                {/* Partnership indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${partner.color.bg} pixel-border mr-2`} />
                    <span className="font-press-start text-xs text-gray-400">
                      ACTIVE PARTNER
                    </span>
                  </div>
                  
                  <div className={`minecraft-block ${partner.color.bg} p-2 group-hover:animate-pulse`}>
                    <Heart className="h-4 w-4 text-black" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


// Culture Section Component
const Culture = () => {
  const culturePoints = [
    {
      title: "OBSESSION WITH BUILDING",
      icon: Target,
      description: "We live and breathe creation. Every line of code, every event, every interaction is about building something better."
    },
    {
      title: "WORK THAT FEELS ALIVE",
      icon: Zap,
      description: "Not mechanical, not corporate. Our work has soul, energy, and the kind of passion that keeps you up at night."
    },
    {
      title: "TEENS AT FULL SPEED",
      icon: Users,
      description: "Young builders running at maximum velocity. No speed limits, no \"wait until you're older.\" The future is now."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-press-start text-2xl md:text-3xl lg:text-4xl mb-4 text-maximally-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            CULTURE / TASK FORCE
          </h2>
          <p className="font-press-start text-maximally-yellow text-lg">
            OUR DNA IS SIMPLE
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {culturePoints.map((point, index) => (
            <div key={index} className="pixel-card bg-black border-2 border-maximally-red p-6 text-center hover:border-maximally-yellow transition-colors">
              <div className="minecraft-block bg-maximally-red p-4 inline-block mb-4 hover:bg-maximally-yellow transition-colors">
                <point.icon className="h-6 w-6 text-black" />
              </div>
              
              <h3 className="font-press-start text-sm md:text-base mb-4 text-maximally-red">
                {point.title}
              </h3>
              
              <p className="font-jetbrains text-gray-300 text-sm leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Future Vision Component
const FutureVision = () => {
  return (
    <section className="py-16 md:py-24 bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-maximally-red/10 via-maximally-yellow/10 to-maximally-red/10 animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <div className="pixel-card bg-black/90 border-2 border-maximally-yellow p-8 md:p-12 max-w-4xl mx-auto">
          <div className="minecraft-block bg-maximally-yellow p-4 inline-block mb-6">
            <Globe className="h-8 w-8 text-black" />
          </div>
          
          <h2 className="font-press-start text-2xl md:text-3xl lg:text-4xl mb-6 text-maximally-yellow drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            FUTURE VISION
          </h2>
          
          <p className="font-press-start text-maximally-red text-lg md:text-xl mb-6">
            BY 2027, MAXIMALLY WILL BE THE BIGGEST HACKATHON ENGINE IN ASIA
          </p>
          
          <p className="font-jetbrains text-gray-300 text-base md:text-lg leading-relaxed">
            A system where hackathons are constant, connected, and central to how people learn and innovate.
            Where every student, every builder, every dreamer has access to the tools and community they need to create the future.
          </p>
        </div>
      </div>
    </section>
  );
};

// Media Kit Component
const MediaKit = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <h2 className="font-press-start text-2xl md:text-3xl lg:text-4xl mb-8 text-white drop-shadow-[4px_4px_0px_rgba(229,9,20,1)]">
          MEDIA KIT
        </h2>
        
        <div className="pixel-card bg-black border-2 border-maximally-red p-8 max-w-2xl mx-auto">
          <div className="minecraft-block bg-maximally-red p-4 inline-block mb-6">
            <Mail className="h-8 w-8 text-black" />
          </div>
          
          <p className="font-jetbrains text-gray-300 text-base md:text-lg mb-6">
            Need logos, colors, or press materials? We've got you covered.
          </p>
          
          <a 
            href="mailto:brand@maximally.in" 
            className="pixel-button bg-maximally-red text-black font-press-start text-sm px-6 py-3 hover:bg-maximally-yellow transition-colors inline-flex items-center"
          >
            CONTACT: BRAND@MAXIMALLY.IN <Mail className="h-4 w-4 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

// Main About Component
const About = () => {
  return (
    <div className="min-h-screen bg-black">
      <SEO 
        title="About Maximally - Hackathons as Culture, Not Just Code"
        description="Learn about Maximally's mission to make hackathons open, accessible, and cultural. Discover our platform, events, and global community of teen builders."
        keywords="about Maximally, hackathon platform, teen builders, global hackathons, MFHOP, hackathon culture"
      />
      
      <HeroSection />
      <WhatWereBuilding />
      <PeoplePreview />
      <Partners />
      <Culture />
      <FutureVision />
      <MediaKit />
      
      <Footer />
    </div>
  );
};

export default About;