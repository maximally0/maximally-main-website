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
      ],
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/40',
      iconColor: 'text-purple-400'
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
      ],
      gradient: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/40',
      iconColor: 'text-amber-400'
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
      ],
      gradient: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/40',
      iconColor: 'text-cyan-400'
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
      ],
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/40',
      iconColor: 'text-green-400'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'AFTER HACKATHON',
      description: 'Complete the cycle with insights and amplification.',
      features: [
        'Post-event surveys and analytics',
        'Maximally Global Ranking inclusion',
        'Media coverage through Maximally',
        'Project integrity review support'
      ],
      gradient: 'from-pink-500/20 to-rose-500/20',
      border: 'border-pink-500/40',
      iconColor: 'text-pink-400'
    }
  ];

  const partnershipTracks = [
    {
      type: 'CO-ORGANIZER',
      idealFor: 'Hackathons seeking end-to-end operational or creative support',
      benefits: 'Full Maximally team guidance, judges, media, software lab, swag, funding support',
      gradient: 'from-purple-600/40 to-pink-600/30',
      border: 'border-purple-500/50'
    },
    {
      type: 'COMMUNITY PARTNER',
      idealFor: 'Clubs, orgs, or networks that want to run or promote events',
      benefits: 'Shared visibility, listing, and Discord inclusion',
      gradient: 'from-cyan-600/40 to-blue-600/30',
      border: 'border-cyan-500/50'
    },
    {
      type: 'MEDIA PARTNER',
      idealFor: 'Newsletters, platforms, and media collectives',
      benefits: 'Co-branded coverage, press features, and video collabs',
      gradient: 'from-pink-600/40 to-rose-600/30',
      border: 'border-pink-500/50'
    },
    {
      type: 'VISIBILITY PARTNER',
      idealFor: 'Small or first-time hackathons seeking credibility & amplification',
      benefits: 'Event listing, basic support, and promotional features',
      gradient: 'from-green-600/40 to-emerald-600/30',
      border: 'border-green-500/50'
    },
    {
      type: 'PLATFORM PARTNER',
      idealFor: 'SaaS or Dev tool companies that want to sponsor or power events',
      benefits: 'Brand placements, access to hackers, and feature integration',
      gradient: 'from-amber-600/40 to-orange-600/30',
      border: 'border-amber-500/50'
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
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.10)_0%,transparent_50%)]" />
          
          {/* Glowing Orbs */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute top-40 right-10 w-80 h-80 bg-pink-500/15 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-cyan-500/15 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/30 to-pink-600/20 border border-purple-500/40 mb-10">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="font-press-start text-xs text-purple-300">PARTNER WITH US</span>
                <Sparkles className="h-4 w-4 text-purple-400" />
              </div>

              <h1 className="font-press-start text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  JOIN THE MAXIMALLY
                </span>
                <span className="block mt-4 text-white">
                  HACKATHON NETWORK
                </span>
              </h1>

              <div className="max-w-4xl mx-auto mb-10">
                <p className="text-gray-300 text-lg sm:text-xl font-jetbrains leading-relaxed mb-6">
                  Host, co-organize, or feature your hackathon with Maximally — 
                  <span className="text-purple-400 font-bold"> and we'll support you every step of the way.</span>
                </p>

                <p className="text-gray-400 text-base sm:text-lg font-jetbrains leading-relaxed">
                  Each year, Maximally collaborates with <span className="text-pink-400 font-bold">hundreds</span> of student, startup, and community hackathons that inspire creativity, 
                  build networks, and teach real-world innovation skills to <span className="text-cyan-400 font-bold">thousands</span> of builders worldwide.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://forms.gle/Pcxr6vDVuN9GLjav5"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="button-apply-partner"
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-press-start text-xs transition-all duration-300 border border-pink-500/50 hover:scale-[1.02] shadow-lg shadow-purple-500/25"
                >
                  <Rocket className="h-5 w-5 group-hover:animate-bounce" />
                  <span>APPLY_TO_PARTNER</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#benefits"
                  data-testid="button-learn-benefits"
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 border border-purple-500/40 hover:border-purple-400 text-gray-300 hover:text-white font-press-start text-xs transition-all duration-300"
                >
                  <Book className="h-5 w-5" />
                  <span>LEARN_MORE</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-20 relative overflow-hidden" id="benefits">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 via-transparent to-pink-950/10" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 mb-6">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-press-start text-[10px] sm:text-xs text-amber-300">FULL SUPPORT PACKAGE</span>
                </div>
                <h2 className="font-press-start text-2xl sm:text-3xl md:text-4xl text-white mb-6">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    WHY JOIN THE NETWORK
                  </span>
                </h2>
                <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto font-jetbrains leading-relaxed">
                  Becoming a Maximally Partner Event gives you access to <span className="text-purple-400 font-bold">every support system</span> we've built — 
                  from global visibility and judges to post-event analytics and community amplification.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className={`bg-gradient-to-br ${benefit.gradient} border ${benefit.border} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] group`}
                    data-testid={`benefit-card-${i}`}
                  >
                    <div className={`w-14 h-14 bg-black/30 border ${benefit.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <div className={benefit.iconColor}>{benefit.icon}</div>
                    </div>
                    <h3 className={`font-press-start text-xs sm:text-sm ${benefit.iconColor} mb-3 group-hover:text-white transition-colors`}>
                      {benefit.title}
                    </h3>
                    <p className="font-jetbrains text-sm text-gray-400 mb-5 leading-relaxed">
                      {benefit.description}
                    </p>
                    <ul className="space-y-2">
                      {benefit.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs font-jetbrains text-gray-500 group-hover:text-gray-400 transition-colors">
                          <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
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

        {/* Partnership Tracks */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08)_0%,transparent_50%)]" />
          
          <div className="absolute top-20 left-20 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 mb-6">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span className="font-press-start text-[10px] sm:text-xs text-cyan-300">CHOOSE YOUR LEVEL</span>
                </div>
                <h2 className="font-press-start text-2xl sm:text-3xl md:text-4xl text-white mb-6">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    PARTNERSHIP TRACKS
                  </span>
                </h2>
                <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-jetbrains">
                  Choose the partnership level that <span className="text-purple-400 font-bold">fits your event and goals.</span>
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {partnershipTracks.map((track, i) => (
                  <div
                    key={i}
                    className={`bg-gradient-to-br ${track.gradient} border ${track.border} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] group`}
                    data-testid={`track-card-${i}`}
                  >
                    <div className="inline-block px-4 py-2 bg-black/30 border border-white/10 mb-5">
                      <span className="font-press-start text-xs text-white">
                        {track.type}
                      </span>
                    </div>
                    
                    <div className="mb-5">
                      <p className="font-press-start text-[10px] text-purple-400 mb-2">
                        IDEAL FOR:
                      </p>
                      <p className="font-jetbrains text-sm text-gray-300 leading-relaxed">
                        {track.idealFor}
                      </p>
                    </div>
                    
                    <div className="h-px bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 mb-5" />
                    
                    <div>
                      <p className="font-press-start text-[10px] text-pink-400 mb-2">
                        BENEFITS:
                      </p>
                      <p className="font-jetbrains text-sm text-white leading-relaxed">
                        {track.benefits}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full animate-pulse" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/40 p-10 md:p-14 text-center transition-all duration-300 hover:border-pink-400/50 group">
                <MessageSquare className="h-12 w-12 text-purple-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                <p className="font-jetbrains text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 italic leading-relaxed">
                  "Partnering with Maximally turned our hackathon into a <span className="text-purple-400 font-bold">global experience</span>. 
                  From judges to swag to design — everything felt <span className="text-pink-400 font-bold">professional, loud, and alive</span>."
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500" />
                  <Sparkles className="h-5 w-5 text-pink-400" />
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative" id="apply">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.12)_0%,transparent_50%)]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  BE PART OF THE
                </span>
                <br />
                <span className="text-white mt-2 block">
                  NEXT GENERATION
                </span>
              </h2>

              <p className="text-gray-400 text-lg max-w-xl mx-auto font-jetbrains mb-10">
                Host with Maximally.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 p-5 hover:border-purple-400/50 transition-all">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 mx-auto mb-3 flex items-center justify-center">
                    <span className="font-press-start text-sm text-white">1</span>
                  </div>
                  <p className="font-press-start text-[10px] text-purple-400 mb-2">STEP ONE</p>
                  <p className="font-jetbrains text-sm text-gray-400">
                    Read the Partnership Guide
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 p-5 hover:border-purple-400/50 transition-all">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 mx-auto mb-3 flex items-center justify-center">
                    <span className="font-press-start text-sm text-white">2</span>
                  </div>
                  <p className="font-press-start text-[10px] text-purple-400 mb-2">STEP TWO</p>
                  <p className="font-jetbrains text-sm text-gray-400">
                    Submit Your Application
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 p-5 hover:border-purple-400/50 transition-all">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 mx-auto mb-3 flex items-center justify-center">
                    <span className="font-press-start text-sm text-white">3</span>
                  </div>
                  <p className="font-press-start text-[10px] text-purple-400 mb-2">STEP THREE</p>
                  <p className="font-jetbrains text-sm text-gray-400">
                    Hop on a Call
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://forms.gle/Pcxr6vDVuN9GLjav5"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="button-apply-now"
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-press-start text-xs transition-all duration-300 border border-pink-500/50 hover:scale-[1.02]"
                >
                  <Rocket className="h-5 w-5" />
                  <span>APPLY_TO_PARTNER</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>

                <Link
                  href="/contact"
                  data-testid="button-contact"
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 border border-purple-500/40 hover:border-purple-400 text-gray-300 hover:text-white font-press-start text-xs transition-all duration-300"
                >
                  <MessageSquare className="h-5 w-5" />
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
