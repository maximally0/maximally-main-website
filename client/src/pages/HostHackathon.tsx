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
  Handshake
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useAuth } from '@/contexts/AuthContext';

const HostHackathon = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [floatingPixels, setFloatingPixels] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  useEffect(() => {
    // Generate floating pixels
    const pixels = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setFloatingPixels(pixels);
  }, []);

  const handleGetStarted = () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login?redirect=/create-hackathon');
    } else {
      // Navigate to create hackathon page
      navigate('/create-hackathon');
    }
  };

  const benefits = [
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'GLOBAL NETWORK',
      description: 'Access to MFHOP, organizer events, and cross-promotion',
      features: [
        'Federation membership',
        'Community amplification',
        'Cross-promotion in newsletters'
      ],
      color: 'bg-blue-600'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'FULL SUPPORT',
      description: '1-on-1 mentorship, playbooks, and dedicated assistance',
      features: [
        'Organizer mentorship',
        'Judging frameworks',
        'Resource library access'
      ],
      color: 'bg-green-600'
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: 'PRIZES & PERKS',
      description: 'Prize pools, swag kits, and software lab credits',
      features: [
        'Maximally prize pool',
        'Emergency budget support',
        'Digital and physical swag'
      ],
      color: 'bg-purple-600'
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: 'PRE-EVENT SUPPORT',
      description: 'Budget templates, sponsor lists, and best practices',
      features: [
        'Organizer playbook',
        'Peer group insights',
        'Early tool access'
      ],
      color: 'bg-yellow-600'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'DURING EVENT',
      description: 'Real-time support and on-site assistance',
      features: [
        'Maximally rep support',
        'Judging system help',
        'Fun mini-events'
      ],
      color: 'bg-red-600'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'POST-EVENT',
      description: 'Analytics, media coverage, and global ranking',
      features: [
        'Post-event surveys',
        'Media coverage',
        'Project integrity review'
      ],
      color: 'bg-cyan-600'
    }
  ];

  const stats = [
    { number: '250+', label: 'HACKATHONS ADVISED' },
    { number: '1000+', label: 'ORGANIZERS SUPPORTED' },
    { number: '50K+', label: 'PARTICIPANTS REACHED' }
  ];

  return (
    <>
      <SEO
        title="Host a Hackathon - Maximally"
        description="Host your own hackathon with Maximally. Get full support, mentorship, prizes, and access to a global network of organizers."
        keywords="host hackathon, organize hackathon, hackathon support, event organizing"
        canonicalUrl="https://maximally.in/host-hackathon"
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Pixel Grid Background */}
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Floating Pixels */}
        {floatingPixels.map((pixel) => (
          <div
            key={pixel.id}
            className="fixed w-2 h-2 bg-maximally-red pixel-border animate-float pointer-events-none"
            style={{
              left: `${pixel.x}%`,
              top: `${pixel.y}%`,
              animationDelay: `${pixel.delay}s`,
              animationDuration: `${4 + pixel.delay}s`,
            }}
          />
        ))}

        {/* Hero Section */}
        <section className="min-h-screen relative flex items-center pt-24 sm:pt-32 pb-12">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-maximally-red/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-maximally-yellow/20 blur-3xl rounded-full animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-red-500/20 blur-3xl rounded-full animate-pulse delay-500" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 z-10">
            <div className="max-w-6xl mx-auto text-center">
              {/* Badge */}
              <div className="minecraft-block bg-gradient-to-r from-maximally-yellow via-orange-500 to-maximally-yellow text-black px-6 xs:px-8 py-3 xs:py-4 inline-block mb-6 sm:mb-8 animate-[glow_2s_ease-in-out_infinite] shadow-2xl shadow-maximally-yellow/50">
                <span className="font-press-start text-xs xs:text-sm sm:text-base flex items-center gap-2 xs:gap-3">
                  <Rocket className="h-4 w-4 xs:h-5 xs:w-5 animate-bounce" />
                  FOR ORGANIZERS
                  <Sparkles className="h-4 w-4 xs:h-5 xs:w-5 animate-spin-slow" />
                </span>
              </div>

              {/* Main Title */}
              <h1 className="font-press-start text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 minecraft-text leading-tight px-2">
                <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:drop-shadow-[6px_6px_0px_rgba(255,215,0,0.5)] transition-all duration-300">
                  HOST YOUR OWN
                </span>
                <br />
                <span className="text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  HACKATHON
                </span>
              </h1>

              <p className="text-gray-300 text-sm xs:text-base sm:text-lg md:text-xl max-w-4xl mx-auto font-jetbrains leading-relaxed mb-6 sm:mb-8 md:mb-12 px-4">
                Turn your vision into reality. Whether you're a first-time organizer or a seasoned host,
                <span className="text-maximally-yellow font-bold"> Maximally supports you every step of the way.</span>
              </p>

              {/* Primary CTA */}
              <div className="flex flex-col xs:flex-row gap-4 xs:gap-6 justify-center mb-8 sm:mb-12 md:mb-16 px-4">
                <button
                  onClick={handleGetStarted}
                  disabled={authLoading}
                  className="pixel-button bg-maximally-red text-white group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-red h-12 xs:h-14 sm:h-16 px-6 xs:px-8 sm:px-10 font-press-start text-xs xs:text-sm sm:text-base relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-maximally-yellow opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <Rocket className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 group-hover:animate-bounce" />
                  <span>{authLoading ? 'LOADING...' : 'GET_STARTED'}</span>
                  <ArrowRight className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform" />
                </button>

                <a
                  href="https://discord.gg/MpBnYk8qMX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-button bg-black border-2 xs:border-4 border-maximally-red text-white group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:bg-maximally-red hover:text-black h-12 xs:h-14 sm:h-16 px-6 xs:px-8 sm:px-10 font-press-start text-xs xs:text-sm sm:text-base"
                >
                  <MessageSquare className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
                  <span>JOIN_DISCORD</span>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 xs:gap-6 max-w-4xl mx-auto px-4">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="pixel-card bg-black/50 border-2 border-maximally-red p-4 xs:p-6 hover:border-maximally-yellow transition-all duration-300 hover:scale-105"
                  >
                    <div className="font-press-start text-2xl xs:text-3xl sm:text-4xl text-maximally-red mb-2">
                      {stat.number}
                    </div>
                    <div className="font-press-start text-[10px] xs:text-xs text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-16 sm:py-20 md:py-24 relative bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12 sm:mb-16">
                <div className="minecraft-block bg-gradient-to-r from-maximally-red to-red-700 text-white px-6 py-3 inline-block mb-6 sm:mb-8">
                  <span className="font-press-start text-xs sm:text-sm">✨ FULL SUPPORT PACKAGE</span>
                </div>
                <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 minecraft-text">
                  <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    WHAT WE OFFER
                  </span>
                </h2>
                <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-jetbrains leading-relaxed px-4">
                  From planning to execution to post-event analytics, we've got you covered.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 xs:border-4 border-maximally-red p-6 sm:p-8 hover:border-maximally-yellow transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-maximally-red/50 group relative overflow-hidden"
                  >
                    {/* Hover Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-maximally-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Corner Decorations */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                      <div className={`minecraft-block ${benefit.color} w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 flex items-center justify-center text-white shadow-lg group-hover:animate-bounce`}>
                        {benefit.icon}
                      </div>
                      <h3 className="font-press-start text-xs sm:text-sm text-maximally-red mb-3 sm:mb-4 text-center group-hover:text-maximally-yellow transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="font-jetbrains text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6 text-center leading-relaxed group-hover:text-gray-200 transition-colors">
                        {benefit.description}
                      </p>
                      <ul className="space-y-2 sm:space-y-3">
                        {benefit.features.map((feature, j) => (
                          <li key={j} className="flex items-start gap-2 sm:gap-3 text-xs font-jetbrains text-gray-400 group-hover:text-gray-300 transition-colors">
                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-maximally-yellow flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 sm:py-20 relative bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <div className="minecraft-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 inline-block mb-6 sm:mb-8">
                  <span className="font-press-start text-xs sm:text-sm">🎯 SIMPLE PROCESS</span>
                </div>
                <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 minecraft-text">
                  <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    HOW IT WORKS
                  </span>
                </h2>
              </div>

              <div className="space-y-6 sm:space-y-8">
                {[
                  {
                    step: '1',
                    title: 'SHARE YOUR VISION',
                    description: 'Tell us about your hackathon idea, goals, and timeline.',
                    icon: <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6" />
                  },
                  {
                    step: '2',
                    title: 'GET MATCHED',
                    description: 'We connect you with the right resources, mentors, and support.',
                    icon: <Network className="h-5 w-5 sm:h-6 sm:w-6" />
                  },
                  {
                    step: '3',
                    title: 'PLAN TOGETHER',
                    description: 'Work with our team to build your event roadmap and strategy.',
                    icon: <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                  },
                  {
                    step: '4',
                    title: 'LAUNCH & EXECUTE',
                    description: 'Host your hackathon with full support from start to finish.',
                    icon: <Rocket className="h-5 w-5 sm:h-6 sm:w-6" />
                  }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 xs:border-4 border-maximally-yellow p-6 sm:p-8 flex items-center gap-4 sm:gap-6 hover:border-maximally-red transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="minecraft-block bg-maximally-yellow w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center flex-shrink-0 group-hover:animate-bounce">
                      <span className="font-press-start text-black text-base sm:text-xl">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="text-maximally-yellow group-hover:text-maximally-red transition-colors">
                          {item.icon}
                        </div>
                        <h3 className="font-press-start text-xs sm:text-sm text-maximally-yellow group-hover:text-maximally-red transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      <p className="font-jetbrains text-xs sm:text-sm text-gray-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Initiatives Section */}
        <section className="py-16 sm:py-20 md:py-24 relative bg-gradient-to-b from-black via-red-950/10 to-black overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-maximally-red/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-maximally-yellow/20 blur-3xl rounded-full animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-red-500/20 blur-3xl rounded-full animate-pulse delay-500" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12 sm:mb-16">
                <div className="minecraft-block bg-gradient-to-r from-maximally-yellow via-orange-500 to-maximally-yellow text-black px-6 py-3 inline-block mb-6 sm:mb-8 animate-[glow_2s_ease-in-out_infinite] shadow-2xl shadow-maximally-yellow/50">
                  <span className="font-press-start text-xs sm:text-sm flex items-center gap-2 sm:gap-3">
                    <Handshake className="h-4 w-4 sm:h-5 sm:w-5 animate-bounce" />
                    INITIATIVES BY MAXIMALLY
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-spin-slow" />
                  </span>
                </div>
                <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 minecraft-text">
                  <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    FOR ORGANIZERS
                  </span>
                </h2>
                <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-jetbrains leading-relaxed px-4">
                  Explore our programs designed to empower hackathon organizers worldwide.
                </p>
              </div>

              {/* Initiatives Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Partner Network Card */}
                <Link
                  to="/partner"
                  className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-maximally-red p-8 sm:p-10 hover:border-maximally-yellow transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-maximally-red/50 group relative overflow-hidden block"
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="minecraft-block bg-gradient-to-br from-blue-600 to-blue-800 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-600/50 group-hover:animate-bounce">
                      <Handshake className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <h3 className="font-press-start text-base sm:text-lg text-maximally-red mb-4 text-center group-hover:text-maximally-yellow transition-colors">
                      PARTNER NETWORK
                    </h3>
                    <p className="font-jetbrains text-sm sm:text-base text-gray-300 text-center mb-6 leading-relaxed group-hover:text-gray-200 transition-colors">
                      Co-organize, feature, or partner with Maximally to host your hackathon with full support.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {[
                        'Global network access',
                        'Full operational support',
                        'Prizes & perks',
                        'Media coverage'
                      ].map((feature, j) => (
                        <li key={j} className="flex items-start gap-3 text-xs sm:text-sm font-jetbrains text-gray-400 group-hover:text-gray-300 transition-colors">
                          <CheckCircle2 className="h-4 w-4 text-maximally-yellow flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-center gap-2 text-maximally-red group-hover:text-maximally-yellow transition-colors font-press-start text-xs sm:text-sm">
                      <span>LEARN_MORE</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>

                {/* MFHOP Card */}
                <Link
                  to="/mfhop"
                  className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-maximally-red p-8 sm:p-10 hover:border-maximally-yellow transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-maximally-red/50 group relative overflow-hidden block"
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="minecraft-block bg-gradient-to-br from-green-600 to-green-800 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 flex items-center justify-center shadow-lg shadow-green-600/50 group-hover:animate-bounce">
                      <Users className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <h3 className="font-press-start text-base sm:text-lg text-maximally-red mb-4 text-center group-hover:text-maximally-yellow transition-colors">
                      MFHOP
                    </h3>
                    <p className="font-jetbrains text-xs sm:text-sm text-gray-400 text-center mb-4 leading-relaxed">
                      Maximally Federation of Hackathon Organizers and Partners
                    </p>
                    <p className="font-jetbrains text-sm sm:text-base text-gray-300 text-center mb-6 leading-relaxed group-hover:text-gray-200 transition-colors">
                      A global network of hackathon organizers working together to grow reach and strengthen events.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {[
                        'Cross-promotion',
                        'Sponsor sharing',
                        'Judge & mentor circuit',
                        'Free membership'
                      ].map((feature, j) => (
                        <li key={j} className="flex items-start gap-3 text-xs sm:text-sm font-jetbrains text-gray-400 group-hover:text-gray-300 transition-colors">
                          <CheckCircle2 className="h-4 w-4 text-maximally-yellow flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-center gap-2 text-maximally-red group-hover:text-maximally-yellow transition-colors font-press-start text-xs sm:text-sm">
                      <span>LEARN_MORE</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-20 relative bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 minecraft-text">
                <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  READY TO HOST?
                </span>
              </h2>

              <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-jetbrains mb-8 sm:mb-12 px-4">
                Join hundreds of organizers who've successfully hosted hackathons with Maximally.
              </p>

              <div className="pixel-card bg-black border-2 xs:border-4 border-maximally-yellow p-6 sm:p-8 mb-8 sm:mb-12 hover:border-maximally-red transition-all duration-300">
                <p className="text-gray-300 text-sm sm:text-base font-jetbrains mb-2">
                  <span className="text-maximally-yellow font-bold">250+ hackathons advised.</span> You're never doing it alone.
                </p>
                <p className="text-gray-400 text-xs sm:text-sm font-jetbrains">
                  Whether you're a first-time organizer or returning host.
                </p>
              </div>

              <div className="flex flex-col xs:flex-row gap-4 xs:gap-6 justify-center">
                <button
                  onClick={handleGetStarted}
                  disabled={authLoading}
                  className="pixel-button bg-maximally-red text-white group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-red h-12 xs:h-14 sm:h-16 px-6 xs:px-8 sm:px-10 font-press-start text-xs xs:text-sm sm:text-base relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-maximally-yellow opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <Rocket className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 group-hover:animate-bounce" />
                  <span>{authLoading ? 'LOADING...' : 'GET_STARTED'}</span>
                  <ArrowRight className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform" />
                </button>

                <Link
                  to="/contact"
                  className="pixel-button bg-black border-2 xs:border-4 border-maximally-red text-white group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:bg-maximally-red hover:text-black h-12 xs:h-14 sm:h-16 px-6 xs:px-8 sm:px-10 font-press-start text-xs xs:text-sm sm:text-base"
                >
                  <MessageSquare className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
                  <span>CONTACT_US</span>
                </Link>
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
