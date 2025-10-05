import { 
  Globe, 
  Users, 
  Target, 
  Calendar, 
  Zap, 
  Award, 
  Rocket, 
  Shield, 
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Book,
  Gift,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';

const PartnerNetwork = () => {
  const benefits = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'COMMUNITY',
      description: 'Join a global network of builders, founders, and organizers who believe hackathons are more than competitions.',
      features: [
        'Access to MFHOP (Maximally Federation of Hackathon Organizers & Partners)',
        'Discounted tickets to exclusive organizer events, meetups, and workshops',
        'Cross-promotion in newsletters, Discord, and community spaces',
        'Monthly community digest showcase'
      ]
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: 'PRE-EVENT SUPPORT',
      description: 'Our team has advised over 250 hackathons — from school projects to global virtual marathons.',
      features: [
        '1-on-1 Mentorship Calls with Community Managers',
        'Organizer Playbook (budget templates, sponsor lists, judging frameworks)',
        'Peer groups for insights and best practices',
        'Early access to Hackathon Builder Stack'
      ]
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'BEFORE HACKATHON',
      description: 'Get everything you need to launch successfully.',
      features: [
        'Dedicated support from hackathon specialists',
        'Featured on Maximally Hackathon Map & Event Calendar',
        'Exclusive vendor & tool discounts',
        'Organizer resource library access'
      ]
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'DURING HACKATHON',
      description: 'Real-time support to ensure smooth event execution.',
      features: [
        'On-site or virtual Maximally Rep support',
        'Judging system assistance',
        'Access to Maximally Prize Pool',
        'Software Lab credits for participants',
        'Emergency budget support up to $1,000',
        'Digital and physical swag kits',
        'Fun mini-events (Prompt Battles, AI Speed Builds)'
      ]
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'AFTER HACKATHON',
      description: 'Complete the cycle with insights and amplification.',
      features: [
        'Post-event surveys and analytics',
        'Maximally Global Ranking inclusion',
        'Media coverage through Maximally Studios',
        'Project integrity review support'
      ]
    }
  ];

  const partnershipTracks = [
    {
      type: 'CO-ORGANIZER',
      idealFor: 'Hackathons seeking end-to-end operational or creative support',
      benefits: 'Full Maximally team guidance, judges, media, software lab, swag, funding support',
      color: 'bg-maximally-red'
    },
    {
      type: 'COMMUNITY PARTNER',
      idealFor: 'Clubs, orgs, or networks that want to run or promote events',
      benefits: 'Shared visibility, listing, and Discord inclusion',
      color: 'bg-blue-600'
    },
    {
      type: 'MEDIA PARTNER',
      idealFor: 'Newsletters, platforms, and media collectives',
      benefits: 'Co-branded coverage, press features, and video collabs',
      color: 'bg-purple-600'
    },
    {
      type: 'VISIBILITY PARTNER',
      idealFor: 'Small or first-time hackathons seeking credibility & amplification',
      benefits: 'Event listing, basic support, and promotional features',
      color: 'bg-green-600'
    },
    {
      type: 'PLATFORM PARTNER',
      idealFor: 'SaaS or Dev tool companies that want to sponsor or power events',
      benefits: 'Brand placements, access to hackers, and feature integration',
      color: 'bg-maximally-yellow text-black'
    }
  ];

  return (
    <>
      <SEO
        title="Partner Network - Maximally"
        description="Host, co-organize, or feature your hackathon with Maximally. Join hundreds of student, startup, and community hackathons worldwide."
        keywords="hackathon partnership, co-organize hackathon, hackathon network, organizer support"
      />

      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.05)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
          
          {/* Glowing Orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 bg-maximally-red/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute top-40 right-10 w-80 h-80 bg-maximally-yellow/15 blur-3xl rounded-full animate-pulse delay-500" />
            <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-orange-500/20 blur-3xl rounded-full animate-pulse delay-700" />
          </div>

          {/* Floating Pixels */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-maximally-yellow/50 pixel-border animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${5 + i}s`
                }}
              />
            ))}
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="minecraft-block bg-gradient-to-r from-maximally-red via-red-600 to-maximally-red text-white px-8 py-4 inline-block mb-10 animate-[glow_2s_ease-in-out_infinite] shadow-2xl shadow-maximally-red/50">
                <span className="font-press-start text-sm sm:text-base flex items-center gap-3">
                  <Sparkles className="h-5 w-5 animate-spin-slow" />
                  PARTNER WITH US
                  <Sparkles className="h-5 w-5 animate-spin-slow" />
                </span>
              </div>

              <h1 className="font-press-start text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 minecraft-text">
                <span className="text-maximally-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:drop-shadow-[6px_6px_0px_rgba(255,215,0,0.5)] transition-all duration-300">
                  JOIN THE MAXIMALLY
                </span>
                <br />
                <span className="text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:drop-shadow-[6px_6px_0px_rgba(220,38,38,0.5)] transition-all duration-300">
                  HACKATHON NETWORK
                </span>
              </h1>

              <div className="max-w-4xl mx-auto mb-8">
                <p className="text-gray-200 text-lg sm:text-xl md:text-2xl font-jetbrains leading-relaxed mb-6">
                  Host, co-organize, or feature your hackathon with Maximally — 
                  <span className="text-maximally-yellow font-bold"> and we'll support you every step of the way.</span>
                </p>

                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-maximally-red" />
                  <Rocket className="h-6 w-6 text-maximally-red animate-bounce" />
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-maximally-red" />
                </div>

                <p className="text-gray-300 text-base sm:text-lg font-jetbrains leading-relaxed">
                  Each year, Maximally collaborates with <span className="text-maximally-yellow font-bold">hundreds</span> of student, startup, and community hackathons that inspire creativity, 
                  build networks, and teach real-world innovation skills to <span className="text-maximally-yellow font-bold">thousands</span> of builders worldwide.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="#apply"
                  data-testid="button-apply-partner"
                  className="pixel-button bg-maximally-red text-white group flex items-center justify-center gap-3 hover:scale-110 transform transition-all hover:shadow-2xl hover:shadow-maximally-red/50 h-16 px-10 font-press-start text-sm sm:text-base relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-maximally-yellow opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <Rocket className="h-6 w-6 group-hover:animate-bounce" />
                  <span>APPLY_TO_PARTNER</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </a>

                <a
                  href="#benefits"
                  data-testid="button-learn-benefits"
                  className="pixel-button bg-black border-4 border-maximally-red text-maximally-red group flex items-center justify-center gap-3 hover:scale-110 transform transition-all hover:bg-maximally-red hover:text-white hover:shadow-2xl hover:shadow-maximally-red/50 h-16 px-10 font-press-start text-sm sm:text-base"
                >
                  <Book className="h-6 w-6 group-hover:animate-pulse" />
                  <span>LEARN_MORE</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden" id="benefits">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                <div className="minecraft-block bg-gradient-to-r from-maximally-yellow to-orange-500 text-black px-6 py-3 inline-block mb-8">
                  <span className="font-press-start text-xs sm:text-sm">✨ FULL SUPPORT PACKAGE</span>
                </div>
                <h2 className="font-press-start text-3xl sm:text-4xl md:text-5xl font-bold mb-8 minecraft-text">
                  <span className="text-maximally-red drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:drop-shadow-[5px_5px_0px_rgba(255,215,0,0.5)] transition-all duration-300">
                    WHY JOIN THE NETWORK
                  </span>
                </h2>
                <p className="text-gray-200 text-lg sm:text-xl max-w-4xl mx-auto font-jetbrains leading-relaxed">
                  Becoming a Maximally Partner Event gives you access to <span className="text-maximally-yellow font-bold">every support system</span> we've built — 
                  from global visibility and judges to post-event analytics and community amplification.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-maximally-red p-8 hover:border-maximally-yellow transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-maximally-red/50 group relative overflow-hidden"
                    data-testid={`benefit-card-${i}`}
                  >
                    {/* Hover Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-maximally-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Corner Decorations */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                      <div className="minecraft-block bg-gradient-to-br from-maximally-red to-red-800 w-16 h-16 mx-auto mb-6 flex items-center justify-center text-white shadow-lg shadow-maximally-red/50 group-hover:animate-bounce">
                        {benefit.icon}
                      </div>
                      <h3 className="font-press-start text-sm sm:text-base text-maximally-red mb-4 text-center group-hover:text-maximally-yellow transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="font-jetbrains text-sm text-gray-300 mb-6 text-center leading-relaxed group-hover:text-gray-200 transition-colors">
                        {benefit.description}
                      </p>
                      <ul className="space-y-3">
                        {benefit.features.map((feature, j) => (
                          <li key={j} className="flex items-start gap-3 text-xs font-jetbrains text-gray-400 group-hover:text-gray-300 transition-colors">
                            <CheckCircle2 className="h-4 w-4 text-maximally-yellow flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
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

        {/* Partnership Tracks */}
        <section className="py-20 bg-black relative overflow-hidden">
          {/* Glowing Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 w-48 h-48 bg-maximally-red/10 blur-3xl rounded-full animate-pulse" />
            <div className="absolute bottom-20 right-20 w-64 h-64 bg-maximally-yellow/10 blur-3xl rounded-full animate-pulse delay-500" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                <div className="minecraft-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 inline-block mb-8 shadow-lg shadow-blue-600/50">
                  <span className="font-press-start text-xs sm:text-sm">🎯 CHOOSE YOUR LEVEL</span>
                </div>
                <h2 className="font-press-start text-3xl sm:text-4xl md:text-5xl font-bold mb-8 minecraft-text">
                  <span className="text-maximally-red drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:drop-shadow-[5px_5px_0px_rgba(255,215,0,0.5)] transition-all duration-300">
                    PARTNERSHIP TRACKS
                  </span>
                </h2>
                <p className="text-gray-200 text-lg sm:text-xl max-w-3xl mx-auto font-jetbrains">
                  Choose the partnership level that <span className="text-maximally-yellow font-bold">fits your event and goals.</span>
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {partnershipTracks.map((track, i) => (
                  <div
                    key={i}
                    className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-maximally-red p-8 hover:border-maximally-yellow transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-maximally-red/50 group relative overflow-hidden"
                    data-testid={`track-card-${i}`}
                  >
                    {/* Animated Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-maximally-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Track Badge */}
                    <div className={`minecraft-block ${track.color} px-6 py-3 inline-block mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <span className="font-press-start text-xs sm:text-sm">
                        {track.type}
                      </span>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="mb-6">
                        <p className="font-press-start text-xs text-maximally-yellow mb-3">
                          IDEAL FOR:
                        </p>
                        <p className="font-jetbrains text-sm sm:text-base text-gray-200 leading-relaxed">
                          {track.idealFor}
                        </p>
                      </div>
                      
                      <div className="h-px bg-gradient-to-r from-maximally-red via-maximally-yellow to-maximally-red mb-6 opacity-50" />
                      
                      <div>
                        <p className="font-press-start text-xs text-maximally-yellow mb-3">
                          BENEFITS:
                        </p>
                        <p className="font-jetbrains text-sm sm:text-base text-white leading-relaxed">
                          {track.benefits}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-maximally-yellow/10 blur-3xl rounded-full animate-pulse" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-maximally-yellow p-10 md:p-16 text-center hover:border-maximally-red transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-maximally-yellow/50 relative overflow-hidden group">
                {/* Quote Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-maximally-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <MessageSquare className="h-16 w-16 text-maximally-yellow mx-auto mb-8 group-hover:animate-bounce" />
                  <p className="font-jetbrains text-xl sm:text-2xl md:text-3xl text-gray-100 mb-8 italic leading-relaxed">
                    "Partnering with Maximally turned our hackathon into a <span className="text-maximally-yellow font-bold">global experience</span>. 
                    From judges to swag to design — everything felt <span className="text-maximally-red font-bold">professional, loud, and alive</span>."
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-1 w-20 bg-gradient-to-r from-transparent to-maximally-red" />
                    <Sparkles className="h-6 w-6 text-maximally-yellow" />
                    <div className="h-1 w-20 bg-gradient-to-l from-transparent to-maximally-red" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-black relative" id="apply">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-press-start text-2xl sm:text-3xl md:text-4xl font-bold mb-6 minecraft-text">
                <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  BE PART OF THE
                </span>
                <br />
                <span className="text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  NEXT GENERATION
                </span>
              </h2>

              <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto font-jetbrains mb-12">
                Host with Maximally.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <div className="pixel-card bg-gray-900 border-2 border-maximally-red p-6 hover:border-maximally-yellow transition-all duration-300">
                  <div className="minecraft-block bg-maximally-red w-12 h-12 mx-auto mb-4 flex items-center justify-center text-white">
                    <span className="font-press-start text-lg">1</span>
                  </div>
                  <p className="font-press-start text-xs text-maximally-red mb-2">STEP ONE</p>
                  <p className="font-jetbrains text-sm text-gray-300">
                    Read the Partnership Guide
                  </p>
                </div>

                <div className="pixel-card bg-gray-900 border-2 border-maximally-red p-6 hover:border-maximally-yellow transition-all duration-300">
                  <div className="minecraft-block bg-maximally-red w-12 h-12 mx-auto mb-4 flex items-center justify-center text-white">
                    <span className="font-press-start text-lg">2</span>
                  </div>
                  <p className="font-press-start text-xs text-maximally-red mb-2">STEP TWO</p>
                  <p className="font-jetbrains text-sm text-gray-300">
                    Submit Your Application
                  </p>
                </div>

                <div className="pixel-card bg-gray-900 border-2 border-maximally-red p-6 hover:border-maximally-yellow transition-all duration-300">
                  <div className="minecraft-block bg-maximally-red w-12 h-12 mx-auto mb-4 flex items-center justify-center text-white">
                    <span className="font-press-start text-lg">3</span>
                  </div>
                  <p className="font-press-start text-xs text-maximally-red mb-2">STEP THREE</p>
                  <p className="font-jetbrains text-sm text-gray-300">
                    Hop on a Call
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://forms.gle/partnership"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="button-apply-now"
                  className="pixel-button bg-maximally-red text-white group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-red h-16 px-10 font-press-start text-base"
                >
                  <Rocket className="h-6 w-6" />
                  <span>APPLY_TO_PARTNER</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </a>

                <Link
                  href="/contact"
                  data-testid="button-contact"
                  className="pixel-button bg-black border-2 border-maximally-red text-maximally-red group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:bg-maximally-red hover:text-white h-16 px-10 font-press-start text-base"
                >
                  <MessageSquare className="h-6 w-6" />
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

export default PartnerNetwork;
