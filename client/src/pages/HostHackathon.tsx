import { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Users, 
  Globe, 
  Trophy, 
  Target, 
  Zap, 
  Rocket, 
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Network,
  Award,
  Clock,
  Gift,
  BarChart3,
  Calendar,
  FileText,
  MessageSquare,
  Handshake,
  Code,
  Star,
  Shield
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/lib/auth';

const HostHackathon = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [hasHackathons, setHasHackathons] = useState(false);
  const [checkingHackathons, setCheckingHackathons] = useState(true);

  useEffect(() => {
    const checkHackathons = async () => {
      if (!authLoading) {
        if (user) {
          try {
            const headers = await getAuthHeaders();
            const response = await fetch('/api/organizer/hackathons', { headers });
            const data = await response.json();
            if (data.success && data.data && data.data.length > 0) {
              setHasHackathons(true);
            }
          } catch (error) {
            console.error('Error checking hackathons:', error);
          }
        }
        setCheckingHackathons(false);
      }
    };

    checkHackathons();
  }, [user, authLoading]);

  const handleGetStarted = () => {
    if (!user) {
      navigate('/login?redirect=/create-hackathon');
    } else if (hasHackathons) {
      navigate('/organizer/dashboard');
    } else {
      navigate('/create-hackathon');
    }
  };

  const benefits = [
    {
      icon: Globe,
      title: 'GLOBAL NETWORK',
      description: 'Access to MFHOP, organizer events, and cross-promotion',
      features: ['Federation membership', 'Community amplification', 'Cross-promotion in newsletters'],
      gradient: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/40',
      iconBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-400'
    },
    {
      icon: Users,
      title: 'FULL SUPPORT',
      description: '1-on-1 mentorship, playbooks, and dedicated assistance',
      features: ['Organizer mentorship', 'Judging frameworks', 'Resource library access'],
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/40',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400'
    },
    {
      icon: Trophy,
      title: 'PRIZES & PERKS',
      description: 'Prize pools, swag kits, and software lab credits',
      features: ['Maximally prize pool', 'Emergency budget support', 'Digital and physical swag'],
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/40',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400'
    },
    {
      icon: Lightbulb,
      title: 'PRE-EVENT SUPPORT',
      description: 'Budget templates, sponsor lists, and best practices',
      features: ['Organizer playbook', 'Peer group insights', 'Early tool access'],
      gradient: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/40',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400'
    },
    {
      icon: Zap,
      title: 'DURING EVENT',
      description: 'Real-time support and on-site assistance',
      features: ['Maximally rep support', 'Judging system help', 'Fun mini-events'],
      gradient: 'from-rose-500/20 to-red-500/20',
      border: 'border-rose-500/40',
      iconBg: 'bg-rose-500/20',
      iconColor: 'text-rose-400'
    },
    {
      icon: BarChart3,
      title: 'POST-EVENT',
      description: 'Analytics, media coverage, and global ranking',
      features: ['Post-event surveys', 'Media coverage', 'Project integrity review'],
      gradient: 'from-indigo-500/20 to-violet-500/20',
      border: 'border-indigo-500/40',
      iconBg: 'bg-indigo-500/20',
      iconColor: 'text-indigo-400'
    }
  ];

  const stats = [
    { number: '250+', label: 'HACKATHONS ADVISED', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
    { number: '1000+', label: 'ORGANIZERS SUPPORTED', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
    { number: '50K+', label: 'PARTICIPANTS REACHED', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' }
  ];

  const steps = [
    { step: '1', title: 'SHARE YOUR VISION', description: 'Tell us about your hackathon idea, goals, and timeline.', icon: Lightbulb },
    { step: '2', title: 'GET MATCHED', description: 'We connect you with the right resources, mentors, and support.', icon: Network },
    { step: '3', title: 'PLAN TOGETHER', description: 'Work with our team to build your event roadmap and strategy.', icon: Calendar },
    { step: '4', title: 'LAUNCH & EXECUTE', description: 'Host your hackathon with full support from start to finish.', icon: Rocket }
  ];

  return (
    <>
      <SEO
        title="Host a Hackathon | Partner with Maximally"
        description="Host your own hackathon with Maximally. Get full support, mentorship, prizes, and access to a global network of organizers and participants."
        keywords="host hackathon, organize hackathon, hackathon support, event organizing, teen hackathons"
        canonicalUrl="https://maximally.in/host-hackathon"
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.10)_0%,transparent_50%)]" />
        
        <div className="absolute top-20 left-[5%] w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-60 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />
        <div className="absolute bottom-40 left-[20%] w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px]" />
        
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 animate-float pointer-events-none"
            style={{
              left: `${5 + (i * 6)}%`,
              top: `${10 + Math.sin(i) * 25}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + (i % 3)}s`,
              backgroundColor: ['#a855f7', '#ec4899', '#06b6d4', '#22c55e', '#f59e0b'][i % 5],
              boxShadow: `0 0 10px ${['#a855f7', '#ec4899', '#06b6d4', '#22c55e', '#f59e0b'][i % 5]}40`
            }}
          />
        ))}

        <section className="min-h-screen relative flex items-center pt-24 sm:pt-32 pb-12">
          <div className="container mx-auto px-4 sm:px-6 z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 mb-6">
                <Rocket className="w-4 h-4 text-purple-400" />
                <span className="font-press-start text-[10px] sm:text-xs text-purple-300 tracking-wider">
                  FOR ORGANIZERS
                </span>
                <Sparkles className="w-4 h-4 text-pink-400" />
              </div>

              <h1 className="font-press-start text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  HOST YOUR OWN
                </span>
                <br />
                <span className="text-white">HACKATHON</span>
              </h1>

              <p className="font-jetbrains text-sm sm:text-base md:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
                Turn your vision into reality. Whether you're a first-time organizer or a seasoned host,
                <span className="text-purple-300 font-semibold"> Maximally supports you every step of the way.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button
                  onClick={handleGetStarted}
                  disabled={authLoading || checkingHackathons}
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600/30 to-pink-500/20 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-press-start text-xs sm:text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-get-started"
                >
                  {user && hasHackathons ? (
                    <>
                      <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>{checkingHackathons ? 'LOADING...' : 'MY DASHBOARD'}</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-bounce" />
                      <span>{authLoading || checkingHackathons ? 'LOADING...' : 'GET STARTED'}</span>
                    </>
                  )}
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="https://discord.gg/MpBnYk8qMX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-black/40 border border-gray-700 hover:border-purple-500/50 text-gray-300 hover:text-purple-300 font-press-start text-xs sm:text-sm transition-all duration-300"
                  data-testid="button-join-discord"
                >
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>JOIN DISCORD</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className={`${stat.bg} border ${stat.border} p-5 transition-all duration-300 hover:scale-105`}
                    data-testid={`stat-${i}`}
                  >
                    <div className={`font-press-start text-2xl sm:text-3xl ${stat.color} mb-2`}>
                      {stat.number}
                    </div>
                    <div className="font-press-start text-[9px] sm:text-[10px] text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 mb-6">
                  <Star className="w-4 h-4 text-pink-400" />
                  <span className="font-press-start text-[10px] sm:text-xs text-pink-300">FULL SUPPORT PACKAGE</span>
                </div>
                <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl text-white mb-4">
                  WHAT WE{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    OFFER
                  </span>
                </h2>
                <p className="font-jetbrains text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
                  From planning to execution to post-event analytics, we've got you covered.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className={`group bg-gradient-to-br ${benefit.gradient} border ${benefit.border} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]`}
                    data-testid={`benefit-${i}`}
                  >
                    <div className={`${benefit.iconBg} border ${benefit.border} w-12 h-12 flex items-center justify-center mb-4`}>
                      <benefit.icon className={`h-6 w-6 ${benefit.iconColor}`} />
                    </div>
                    <h3 className="font-press-start text-xs text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="font-jetbrains text-sm text-gray-400 mb-4 leading-relaxed">
                      {benefit.description}
                    </p>
                    <ul className="space-y-2">
                      {benefit.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs font-jetbrains text-gray-500">
                          <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 mb-6">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span className="font-press-start text-[10px] sm:text-xs text-cyan-300">SIMPLE PROCESS</span>
                </div>
                <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl text-white mb-4">
                  HOW IT{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    WORKS
                  </span>
                </h2>
              </div>

              <div className="space-y-4">
                {steps.map((item, i) => (
                  <div
                    key={i}
                    className="group bg-black/40 border border-purple-500/20 hover:border-purple-500/40 p-6 flex items-center gap-5 transition-all duration-300 hover:bg-purple-500/5"
                    data-testid={`step-${i}`}
                  >
                    <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/20 border border-purple-500/40 w-14 h-14 flex items-center justify-center flex-shrink-0">
                      <span className="font-press-start text-lg text-purple-300">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <item.icon className="h-5 w-5 text-purple-400" />
                        <h3 className="font-press-start text-xs sm:text-sm text-purple-300 group-hover:text-purple-200 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      <p className="font-jetbrains text-sm text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-900/5 to-transparent" />
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 mb-6">
                  <Handshake className="w-4 h-4 text-green-400" />
                  <span className="font-press-start text-[10px] sm:text-xs text-green-300">INITIATIVES BY MAXIMALLY</span>
                </div>
                <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl text-white mb-4">
                  FOR{" "}
                  <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                    ORGANIZERS
                  </span>
                </h2>
                <p className="font-jetbrains text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
                  Explore our programs designed to empower hackathon organizers worldwide.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                  to="/partner"
                  className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 hover:border-blue-400/50 p-8 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
                  data-testid="link-partner-network"
                >
                  <div className="bg-blue-500/20 border border-blue-500/40 w-16 h-16 flex items-center justify-center mb-6">
                    <Handshake className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="font-press-start text-sm sm:text-base text-white mb-3 group-hover:text-blue-300 transition-colors">
                    PARTNER NETWORK
                  </h3>
                  <p className="font-jetbrains text-sm text-gray-400 mb-6 leading-relaxed">
                    Co-organize, feature, or partner with Maximally to host your hackathon with full support.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {['Global network access', 'Full operational support', 'Prizes & perks', 'Media coverage'].map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs font-jetbrains text-gray-500">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 font-press-start text-xs text-blue-400 group-hover:text-blue-300">
                    LEARN MORE <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link
                  to="/mfhop"
                  className="group bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 hover:border-amber-400/50 p-8 transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]"
                  data-testid="link-mfhop"
                >
                  <div className="bg-amber-500/20 border border-amber-500/40 w-16 h-16 flex items-center justify-center mb-6">
                    <Globe className="h-8 w-8 text-amber-400" />
                  </div>
                  <h3 className="font-press-start text-sm sm:text-base text-white mb-3 group-hover:text-amber-300 transition-colors">
                    MFHOP FEDERATION
                  </h3>
                  <p className="font-jetbrains text-sm text-gray-400 mb-6 leading-relaxed">
                    Join the Maximally Federation of Hackathon Organizer Partners for exclusive resources.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {['Exclusive organizer events', 'Shared sponsor network', 'Cross-promotion', 'Best practices library'].map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs font-jetbrains text-gray-500">
                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 font-press-start text-xs text-amber-400 group-hover:text-amber-300">
                    LEARN MORE <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="p-8 sm:p-12 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 border border-purple-500/30 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-purple-500/20 border border-purple-500/40">
                    <Rocket className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="font-press-start text-base sm:text-lg md:text-xl text-white mb-4">
                    Ready to host your hackathon?
                  </h3>
                  <p className="font-jetbrains text-sm sm:text-base text-gray-400 mb-8 max-w-xl mx-auto">
                    Join 1000+ organizers who have launched successful events with Maximally's support.
                  </p>
                  <button
                    onClick={handleGetStarted}
                    disabled={authLoading || checkingHackathons}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-press-start text-xs sm:text-sm transition-all duration-300 disabled:opacity-50"
                    data-testid="button-cta-get-started"
                  >
                    <Rocket className="h-5 w-5" />
                    {user && hasHackathons ? 'GO TO DASHBOARD' : 'START NOW'}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HostHackathon;
