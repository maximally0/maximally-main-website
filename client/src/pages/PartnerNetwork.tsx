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
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="minecraft-block bg-gradient-to-r from-maximally-red to-red-600 text-white px-6 py-3 inline-block mb-8">
                <span className="font-press-start text-xs sm:text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  PARTNER WITH US
                </span>
              </div>

              <h1 className="font-press-start text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 minecraft-text">
                <span className="text-maximally-red drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  JOIN THE MAXIMALLY
                </span>
                <br />
                <span className="text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  HACKATHON NETWORK
                </span>
              </h1>

              <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-jetbrains leading-relaxed mb-8">
                Host, co-organize, or feature your hackathon with Maximally — and we'll support you every step of the way.
              </p>

              <p className="text-gray-400 text-sm sm:text-base max-w-3xl mx-auto font-jetbrains leading-relaxed mb-12">
                Each year, Maximally collaborates with hundreds of student, startup, and community hackathons that inspire creativity, 
                build networks, and teach real-world innovation skills to thousands of builders worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#apply"
                  data-testid="button-apply-partner"
                  className="pixel-button bg-maximally-red text-white group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-red h-14 px-8 font-press-start text-sm"
                >
                  <Rocket className="h-5 w-5" />
                  <span>APPLY_TO_PARTNER</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#benefits"
                  data-testid="button-learn-benefits"
                  className="pixel-button bg-black border-2 border-maximally-red text-maximally-red group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:bg-maximally-red hover:text-white h-14 px-8 font-press-start text-sm"
                >
                  <Book className="h-5 w-5" />
                  <span>LEARN_MORE</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative" id="benefits">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-press-start text-2xl sm:text-3xl md:text-4xl font-bold mb-6 minecraft-text">
                  <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    WHY JOIN THE NETWORK
                  </span>
                </h2>
                <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto font-jetbrains">
                  Becoming a Maximally Partner Event gives you access to every support system we've built — 
                  from global visibility and judges to post-event analytics and community amplification.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="pixel-card bg-black border-2 border-maximally-red p-6 hover:border-maximally-yellow transition-all duration-300 hover:scale-105"
                    data-testid={`benefit-card-${i}`}
                  >
                    <div className="minecraft-block bg-maximally-red w-12 h-12 mx-auto mb-4 flex items-center justify-center text-white">
                      {benefit.icon}
                    </div>
                    <h3 className="font-press-start text-sm text-maximally-red mb-3 text-center">
                      {benefit.title}
                    </h3>
                    <p className="font-jetbrains text-gray-300 text-sm mb-4 text-center">
                      {benefit.description}
                    </p>
                    <ul className="space-y-2">
                      {benefit.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs font-jetbrains text-gray-400">
                          <CheckCircle2 className="h-4 w-4 text-maximally-yellow flex-shrink-0 mt-0.5" />
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
        <section className="py-20 bg-black relative">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-press-start text-2xl sm:text-3xl md:text-4xl font-bold mb-6 minecraft-text">
                  <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    PARTNERSHIP TRACKS
                  </span>
                </h2>
                <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto font-jetbrains">
                  Choose the partnership level that fits your event and goals.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {partnershipTracks.map((track, i) => (
                  <div
                    key={i}
                    className="pixel-card bg-gray-900 border-2 border-maximally-red p-6 hover:border-maximally-yellow transition-all duration-300"
                    data-testid={`track-card-${i}`}
                  >
                    <div className={`minecraft-block ${track.color} px-4 py-2 inline-block mb-4`}>
                      <span className="font-press-start text-xs">
                        {track.type}
                      </span>
                    </div>
                    <p className="font-press-start text-xs text-gray-400 mb-2">
                      IDEAL FOR:
                    </p>
                    <p className="font-jetbrains text-sm text-gray-300 mb-4">
                      {track.idealFor}
                    </p>
                    <p className="font-press-start text-xs text-gray-400 mb-2">
                      BENEFITS:
                    </p>
                    <p className="font-jetbrains text-sm text-white">
                      {track.benefits}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="pixel-card bg-black border-4 border-maximally-red p-8 md:p-12 text-center">
                <MessageSquare className="h-12 w-12 text-maximally-yellow mx-auto mb-6" />
                <p className="font-jetbrains text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 italic leading-relaxed">
                  "Partnering with Maximally turned our hackathon into a global experience. 
                  From judges to swag to design — everything felt professional, loud, and alive."
                </p>
                <div className="w-16 h-1 bg-maximally-red mx-auto" />
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
