import { useState, useEffect } from 'react';
import { ArrowRight, Users, Globe, Trophy, Target, ExternalLink, MessageCircle, Calendar, FileText, CheckCircle, Mail, Copy, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const MFHOP = () => {
  const [floatingPixels, setFloatingPixels] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleContactUs = () => {
    setShowEmailModal(true);
    // Auto copy to clipboard
    navigator.clipboard.writeText('mfhop@maximally.in');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('mfhop@maximally.in');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // Generate floating pixels
    const pixels = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setFloatingPixels(pixels);
  }, []);

  const benefits = [
    {
      title: 'Cross-Promotion',
      description: 'Share posts, newsletters, and reach new student bases.',
      icon: <Globe className="h-6 w-6" />,
      color: 'bg-blue-600'
    },
    {
      title: 'Sponsors & Partnerships',
      description: 'Exchange leads, pitch bigger packages together.',
      icon: <Trophy className="h-6 w-6" />,
      color: 'bg-green-600'
    },
    {
      title: 'Judges & Mentors',
      description: 'Tap into a shared circuit of experienced names.',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-purple-600'
    },
    {
      title: 'Marketing & Media',
      description: 'Swap press contacts, email copy, and community shoutouts.',
      icon: <Target className="h-6 w-6" />,
      color: 'bg-red-600'
    },
    {
      title: 'Community Exchange',
      description: 'Pass on leftover applicants, keep participants cycling.',
      icon: <MessageCircle className="h-6 w-6" />,
      color: 'bg-yellow-600'
    },
    {
      title: 'Credibility Boost',
      description: 'Proud MFHOP badge + peer validation.',
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'bg-cyan-600'
    }
  ];

  const requirements = [
    'Must have hosted at least one hackathon (online, offline, or hybrid)',
    'Commit to active collaboration (cross-promos, Discord, sharing resources)',
    'Fill out the application form for review'
  ];

  const steps = [
    'Fill out the application form',
    'If approved, receive your membership confirmation + Discord invite',
    'Get listed in the MFHOP directory and access resources'
  ];

  return (
    <>
      <SEO
        title="MFHOP - Maximally Federation of Hackathon Organizers and Partners"
        description="A global network of hackathon organizers working together to grow reach, share sponsors, and strengthen events."
        keywords="hackathon organizers, federation, hackathon community, event collaboration, MFHOP"
        canonicalUrl="https://maximally.in/mfhop"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Maximally Federation of Hackathon Organizers and Partners (MFHOP)',
          description: 'A global network of hackathon organizers working together to grow reach, share sponsors, and strengthen events.',
          url: 'https://maximally.in/mfhop',
        }}
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
        <section className="min-h-screen relative flex items-center pt-32">
          <div className="container mx-auto px-4 z-10">
            <div className="max-w-6xl mx-auto text-center">
              {/* Badge */}
              <div className="minecraft-block bg-gradient-to-r from-maximally-red to-red-700 text-black px-6 py-3 inline-block mb-8">
                <span className="font-press-start text-sm">
                  🤝 MFHOP
                </span>
              </div>

              {/* Main Title */}
              <h1 className="font-press-start text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 minecraft-text leading-tight">
                <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  MAXIMALLY FEDERATION
                </span>
              </h1>

              <h2 className="font-press-start text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-gray-300">
                OF HACKATHON ORGANIZERS AND PARTNERS
              </h2>

              <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-4xl mx-auto font-jetbrains leading-relaxed mb-8 sm:mb-12 px-4">
                A global network of hackathon organizers working together to grow reach, share sponsors, and strengthen events.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
                <a
                  href="https://forms.gle/DcjBJx9uT5LMG8538"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-button bg-maximally-red text-white group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-red h-12 sm:h-16 px-6 sm:px-8 font-press-start text-xs sm:text-sm"
                >
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>APPLY_TO_JOIN</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </a>

                <button
                  onClick={handleContactUs}
                  className="pixel-button bg-maximally-yellow text-maximally-black group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-yellow h-12 sm:h-16 px-6 sm:px-8 font-press-start text-xs sm:text-sm"
                >
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>CONTACT_US</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* What is MFHOP Section */}
        <section className="py-20 relative bg-gradient-to-b from-gray-900 to-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 minecraft-text">
                <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  WHAT IS MFHOP?
                </span>
              </h2>

              <div className="pixel-card bg-black border-2 border-maximally-red p-8 text-center">
                <p className="font-jetbrains text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                  MFHOP is an initiative led by Maximally to bring hackathon organizers out of silos. Whether you run a college hackathon, an indie Devpost event, or a community competition, MFHOP helps you connect with peers, trade sponsor leads, cross-promote events, and build credibility. 
                  <span className="text-maximally-red font-bold"> Membership is free</span>, and open to any organizer who has hosted at least one hackathon.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Help Each Other Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 minecraft-text">
                <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  HOW WE HELP EACH OTHER
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
                {benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="pixel-card bg-black border-2 border-maximally-red p-6 hover:border-maximally-yellow transition-all duration-300 hover:scale-105"
                  >
                    <div className={`minecraft-block ${benefit.color} w-12 h-12 mx-auto mb-4 flex items-center justify-center text-white`}>
                      {benefit.icon}
                    </div>
                    <h3 className="font-press-start text-sm text-maximally-red mb-3 text-center">
                      {benefit.title.toUpperCase()}
                    </h3>
                    <p className="font-jetbrains text-gray-300 text-sm text-center">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="font-press-start text-lg text-maximally-red">
                  WE GROW STRONGER BY BUILDING TOGETHER.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership & Structure Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 minecraft-text">
                <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  LEADERSHIP & STRUCTURE
                </span>
              </h2>

              <div className="space-y-6">
                <div className="pixel-card bg-black border-2 border-maximally-red p-6">
                  <h3 className="font-press-start text-sm text-maximally-red mb-2">PRESIDENT</h3>
                  <p className="font-jetbrains text-white">Raghwender Vasisth</p>
                </div>

                <div className="pixel-card bg-black border-2 border-maximally-yellow p-6">
                  <h3 className="font-press-start text-sm text-maximally-yellow mb-2">VICE PRESIDENTS</h3>
                  <p className="font-jetbrains text-white">Outreach, Partnerships, Community, Marketing</p>
                </div>

                <div className="pixel-card bg-black border-2 border-green-500 p-6">
                  <h3 className="font-press-start text-sm text-green-400 mb-2">COUNCIL</h3>
                  <p className="font-jetbrains text-white">Regional and Event Collaboration leads elected from members</p>
                </div>

                <div className="pixel-card bg-black border-2 border-blue-500 p-6">
                  <h3 className="font-press-start text-sm text-blue-400 mb-2">MEMBERS</h3>
                  <p className="font-jetbrains text-white">All approved hackathon organizers</p>
                </div>
              </div>

              <div className="text-center mt-8">
                <div className="pixel-card bg-gray-900 border-2 border-maximally-red p-6">
                  <p className="font-press-start text-sm text-maximally-red">
                    MFHOP IS NOT JUST A DISCORD — IT'S A FEDERATION WITH CLEAR ROLES AND RESPONSIBILITIES.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Eligibility & Requirements Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 minecraft-text">
                <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  ELIGIBILITY & REQUIREMENTS
                </span>
              </h2>

              <div className="space-y-4">
                {requirements.map((requirement, i) => (
                  <div key={i} className="pixel-card bg-black border-2 border-maximally-red p-6 flex items-center gap-4">
                    <div className="minecraft-block bg-maximally-red w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-black" />
                    </div>
                    <p className="font-jetbrains text-white text-sm sm:text-base">
                      {requirement}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How to Join Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 minecraft-text">
                <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  HOW TO JOIN
                </span>
              </h2>

              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div key={i} className="pixel-card bg-black border-2 border-maximally-yellow p-6 flex items-center gap-4">
                    <div className="minecraft-block bg-maximally-yellow w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <span className="font-press-start text-black text-sm">{i + 1}</span>
                    </div>
                    <p className="font-jetbrains text-white text-sm sm:text-base">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <a
                  href="https://forms.gle/DcjBJx9uT5LMG8538"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-button bg-maximally-red text-white inline-flex items-center gap-2 px-8 py-4 font-press-start hover:scale-105 transition-all duration-300"
                >
                  <FileText className="h-5 w-5" />
                  <span>APPLY_NOW</span>
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 minecraft-text">
                <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  FAQ
                </span>
              </h2>

              <div className="space-y-6">
                <div className="pixel-card bg-black border-2 border-maximally-red p-6">
                  <h3 className="font-press-start text-sm text-maximally-red mb-3">IS THERE A FEE?</h3>
                  <p className="font-jetbrains text-white">No, membership is free.</p>
                </div>

                <div className="pixel-card bg-black border-2 border-maximally-yellow p-6">
                  <h3 className="font-press-start text-sm text-maximally-yellow mb-3">WHO CAN JOIN?</h3>
                  <p className="font-jetbrains text-white">Any team or organizer that has hosted a hackathon.</p>
                </div>

                <div className="pixel-card bg-black border-2 border-green-500 p-6">
                  <h3 className="font-press-start text-sm text-green-400 mb-3">WHAT IF WE'RE SMALL?</h3>
                  <p className="font-jetbrains text-white">Size doesn't matter. What matters is you've actually run an event.</p>
                </div>

                <div className="pixel-card bg-black border-2 border-blue-500 p-6">
                  <h3 className="font-press-start text-sm text-blue-400 mb-3">WHAT'S IN IT FOR MAXIMALLY?</h3>
                  <p className="font-jetbrains text-white">We're building the ecosystem and leading the initiative. Stronger organizers = stronger hackathons for everyone.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-8 minecraft-text">
                <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  READY TO JOIN THE FEDERATION?
                </span>
              </h2>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <a
                  href="https://forms.gle/DcjBJx9uT5LMG8538"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-button bg-maximally-red text-white group flex items-center gap-2 px-8 py-4 font-press-start hover:scale-105 transition-all"
                >
                  <FileText className="h-5 w-5" />
                  <span>APPLY_TO_JOIN</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="text-gray-400 font-press-start text-sm">OR</div>

                <button
                  onClick={handleContactUs}
                  className="pixel-button bg-maximally-yellow text-maximally-black flex items-center gap-2 px-8 py-4 font-press-start hover:scale-105 transition-all"
                >
                  <span>CONTACT_US</span>
                </button>
              </div>

              <div className="pixel-card bg-black border-2 border-maximally-red p-6">
                <p className="font-jetbrains text-gray-300 text-sm">
                  Learn more at <span className="text-maximally-red">maximally.in/mfhop</span> | Contact us at <span className="text-maximally-red">cal.com/maximally</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="pixel-card bg-black border-4 border-maximally-red p-8 max-w-md w-full relative">
              <button
                onClick={() => setShowEmailModal(false)}
                className="absolute top-4 right-4 pixel-button bg-maximally-red text-white p-2 hover:scale-105 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="text-center">
                <div className="minecraft-block bg-maximally-red w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-black" />
                </div>
                
                <h3 className="font-press-start text-lg text-maximally-red mb-4">
                  CONTACT MFHOP
                </h3>
                
                <p className="font-jetbrains text-gray-300 mb-6">
                  Reach out to us at:
                </p>
                
                <div className="pixel-card bg-gray-900 border-2 border-maximally-yellow p-4 mb-6">
                  <p className="font-jetbrains text-maximally-yellow text-lg break-all">
                    mfhop@maximally.in
                  </p>
                </div>
                
                <button
                  onClick={copyEmail}
                  className="pixel-button bg-maximally-yellow text-maximally-black flex items-center gap-2 px-6 py-3 font-press-start text-sm hover:scale-105 transition-all mx-auto"
                >
                  <Copy className="h-4 w-4" />
                  <span>{copied ? 'COPIED!' : 'COPY_EMAIL'}</span>
                </button>
                
                {copied && (
                  <p className="font-jetbrains text-green-400 text-sm mt-3">
                    ✓ Email copied to clipboard!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MFHOP;