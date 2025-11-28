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
  Loader2,
  Sparkles,
  Star,
  Rocket,
  MessageSquare
} from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { supabase } from '@/lib/supabaseClient';

interface CoreTeamMember {
  id: number;
  name: string;
  role_in_company: string;
  company?: string;
  description?: string;
}

interface FeaturedJudge {
  id: number;
  full_name: string;
  role_title: string;
  company: string;
}

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

const PeoplePreview = () => {
  const [coreTeam, setCoreTeam] = useState<CoreTeamMember[]>([]);
  const [featuredJudges, setFeaturedJudges] = useState<FeaturedJudge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeopleData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!supabase) throw new Error('Supabase client not available');
        
        type DashboardRow = {
          featured_core_id_1?: number | null;
          featured_core_id_2?: number | null;
          featured_core_id_3?: number | null;
          featured_judge_id_1?: number | null;
          featured_judge_id_2?: number | null;
          featured_judge_id_3?: number | null;
        };

        const db = supabase as any;
        const { data: dashboardData, error: dashboardError } = await db
          .from('dashboard')
          .select('featured_core_id_1, featured_core_id_2, featured_core_id_3, featured_judge_id_1, featured_judge_id_2, featured_judge_id_3')
          .eq('id', 1)
          .single() as { data?: DashboardRow; error?: any };

        if (dashboardError) {
          throw new Error(`Dashboard fetch failed: ${dashboardError.message}`);
        }

        const coreIds = [
          dashboardData?.featured_core_id_1,
          dashboardData?.featured_core_id_2,
          dashboardData?.featured_core_id_3
        ].filter(id => id !== null);

        const judgeIds = [
          dashboardData?.featured_judge_id_1,
          dashboardData?.featured_judge_id_2,
          dashboardData?.featured_judge_id_3
        ].filter(id => id !== null);

        if (coreIds.length > 0) {
          const { data: coreData, error: coreError } = await db
            .from('people')
            .select('id, name, role_in_company, company, description')
            .in('id', coreIds) as { data?: any[]; error?: any };

          if (coreError) {
            throw new Error(`Core team fetch failed: ${coreError.message}`);
          }

          const coreDataArr: any[] = coreData || [];
          const sortedCoreTeam = coreIds.map(id => 
            coreDataArr.find(member => member.id === id)
          ).filter(member => member !== undefined) as CoreTeamMember[];

          setCoreTeam(sortedCoreTeam);
        }

        if (judgeIds.length > 0) {
          const { data: judgeData, error: judgeError } = await db
            .from('judges')
            .select('id, full_name, role_title, company')
            .in('id', judgeIds) as { data?: any[]; error?: any };

          if (judgeError) {
            throw new Error(`Judges fetch failed: ${judgeError.message}`);
          }

          const judgeDataArr: any[] = judgeData || [];
          const sortedJudges = judgeIds.map(id => 
            judgeDataArr.find(judge => judge.id === id)
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
    <section className="py-16 sm:py-24 bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08)_0%,transparent_60%)]" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 mb-6">
            <Users className="w-4 h-4 text-pink-400" />
            <span className="font-press-start text-[10px] sm:text-xs text-pink-300">THE TEAM</span>
          </div>
          <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl text-white mb-4">
            OUR{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              PEOPLE
            </span>
          </h2>
          <p className="font-jetbrains text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Meet the students and builders behind Maximally
          </p>
        </div>
        
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="bg-rose-500/20 border border-rose-500/40 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-rose-400" />
            </div>
            <h3 className="font-press-start text-sm sm:text-base text-rose-300 mb-2">
              CORE TEAM
            </h3>
          </div>
          
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/10 border border-purple-500/30">
                <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                <span className="font-press-start text-xs text-purple-300">LOADING TEAM</span>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-12">
              <div className="bg-red-500/10 border border-red-500/30 px-6 py-4 inline-block mb-4">
                <span className="font-press-start text-xs text-red-300">ERROR LOADING TEAM</span>
              </div>
              <p className="text-red-400 font-jetbrains text-sm mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-500/20 border border-purple-500/40 px-4 py-2 hover:bg-purple-500/30 transition-colors"
              >
                <span className="font-press-start text-xs text-purple-300">RETRY</span>
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {coreTeam.map((member) => (
                <div 
                  key={member.id} 
                  className="group bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/30 p-6 transition-all duration-300 hover:scale-[1.02] hover:border-rose-400/50"
                  data-testid={`team-member-${member.id}`}
                >
                  <div className="text-center">
                    <div className="bg-rose-500/20 border border-rose-500/40 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <span className="font-press-start text-xs text-rose-300">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <h4 className="font-press-start text-xs text-white mb-2">
                      {member.name}
                    </h4>
                    
                    <p className="font-press-start text-[10px] text-rose-400 mb-3">
                      {member.role_in_company}
                    </p>
                    
                    {member.company && (
                      <p className="font-jetbrains text-xs text-gray-500 mb-2">
                        {member.company}
                      </p>
                    )}
                    
                    {member.description && (
                      <p className="font-jetbrains text-xs text-gray-400 leading-relaxed">
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
              <Link 
                to="/people/core" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500/20 border border-rose-500/40 hover:border-rose-400 text-rose-300 hover:text-rose-200 font-press-start text-[10px] transition-all duration-300"
                data-testid="link-see-full-team"
              >
                SEE FULL TEAM <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>

        <div>
          <div className="text-center mb-8">
            <div className="bg-amber-500/20 border border-amber-500/40 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="font-press-start text-sm sm:text-base text-amber-300 mb-2">
              FEATURED JUDGES
            </h3>
          </div>
          
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/30">
                <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                <span className="font-press-start text-xs text-amber-300">LOADING JUDGES</span>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-12">
              <div className="bg-red-500/10 border border-red-500/30 px-6 py-4 inline-block mb-4">
                <span className="font-press-start text-xs text-red-300">ERROR LOADING JUDGES</span>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {featuredJudges.map((judge) => (
                  <div 
                    key={judge.id} 
                    className="group bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-6 transition-all duration-300 hover:scale-[1.02] hover:border-amber-400/50"
                    data-testid={`judge-${judge.id}`}
                  >
                    <div className="text-center">
                      <div className="bg-amber-500/20 border border-amber-500/40 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <Trophy className="h-5 w-5 text-amber-400" />
                      </div>
                      
                      <h4 className="font-press-start text-xs text-white mb-2">
                        {judge.full_name}
                      </h4>
                      
                      <p className="font-press-start text-[10px] text-amber-400 mb-1">
                        {judge.role_title}
                      </p>
                      
                      <p className="font-jetbrains text-xs text-gray-400">
                        {judge.company}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Link 
                  to="/people/judges" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 font-press-start text-[10px] transition-all duration-300"
                  data-testid="link-all-judges"
                >
                  ALL JUDGES & MENTORS <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </>
          )}
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
        <PeoplePreview />
        <Partners />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
};

export default About;
