import { useState } from 'react';
import { ArrowRight, Users, Globe, Trophy, Target, ExternalLink, MessageCircle, FileText, CheckCircle, Mail, Copy, X, Sparkles, Network, Shield, Award } from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const MFHOP = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleContactUs = () => {
    setShowEmailModal(true);
    navigator.clipboard.writeText('mfhop@maximally.in');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('mfhop@maximally.in');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const benefits = [
    { title: 'Cross-Promotion', description: 'Share posts, newsletters, and reach new student bases.', icon: Globe, color: 'cyan' },
    { title: 'Sponsors & Partnerships', description: 'Exchange leads, pitch bigger packages together.', icon: Trophy, color: 'amber' },
    { title: 'Judges & Mentors', description: 'Tap into a shared circuit of experienced names.', icon: Users, color: 'purple' },
    { title: 'Marketing & Media', description: 'Swap press contacts, email copy, and community shoutouts.', icon: Target, color: 'pink' },
    { title: 'Community Exchange', description: 'Pass on leftover applicants, keep participants cycling.', icon: MessageCircle, color: 'green' },
    { title: 'Credibility Boost', description: 'Proud MFHOP badge + peer validation.', icon: Award, color: 'rose' }
  ];

  const colorClasses: Record<string, { gradient: string; border: string; text: string; iconBg: string }> = {
    cyan: { gradient: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/40', text: 'text-cyan-300', iconBg: 'bg-cyan-500/20' },
    amber: { gradient: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/40', text: 'text-amber-300', iconBg: 'bg-amber-500/20' },
    purple: { gradient: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/40', text: 'text-purple-300', iconBg: 'bg-purple-500/20' },
    pink: { gradient: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/40', text: 'text-pink-300', iconBg: 'bg-pink-500/20' },
    green: { gradient: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/40', text: 'text-green-300', iconBg: 'bg-green-500/20' },
    rose: { gradient: 'from-rose-500/20 to-red-500/20', border: 'border-rose-500/40', text: 'text-rose-300', iconBg: 'bg-rose-500/20' },
  };

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
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Effects */}
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

        {/* Hero Section */}
        <section className="min-h-screen relative flex items-center pt-24 sm:pt-32">
          <div className="container mx-auto px-4 z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 mb-6">
                <Network className="w-4 h-4 text-purple-400" />
                <span className="font-press-start text-[10px] sm:text-xs text-purple-300">MFHOP</span>
              </div>

              <h1 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 leading-relaxed">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  MAXIMALLY FEDERATION
                </span>
              </h1>

              <h2 className="font-press-start text-sm sm:text-base md:text-lg text-gray-400 mb-6">
                OF HACKATHON ORGANIZERS AND PARTNERS
              </h2>

              <p className="text-gray-400 text-sm sm:text-base max-w-3xl mx-auto font-jetbrains leading-relaxed mb-8">
                A global network of hackathon organizers working together to grow reach, share sponsors, and strengthen events.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a
                  href="https://forms.gle/DcjBJx9uT5LMG8538"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-press-start text-xs transition-all duration-300"
                >
                  <FileText className="h-4 w-4" />
                  APPLY TO JOIN
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <button
                  onClick={handleContactUs}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 font-press-start text-xs transition-all duration-300"
                >
                  <Mail className="h-4 w-4" />
                  CONTACT US
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* What is MFHOP Section */}
        <section className="py-16 sm:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 mb-4">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="font-press-start text-[10px] sm:text-xs text-cyan-300">ABOUT</span>
                </div>
                <h2 className="font-press-start text-lg sm:text-xl md:text-2xl text-white">
                  WHAT IS <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">MFHOP?</span>
                </h2>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-8 text-center">
                <p className="font-jetbrains text-gray-300 text-sm sm:text-base leading-relaxed">
                  MFHOP is an initiative led by Maximally to bring hackathon organizers out of silos. Whether you run a college hackathon, an indie Devpost event, or a community competition, MFHOP helps you connect with peers, trade sponsor leads, cross-promote events, and build credibility. 
                  <span className="text-purple-300 font-semibold"> Membership is free</span>, and open to any organizer who has hosted at least one hackathon.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Help Each Other Section */}
        <section className="py-16 sm:py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 mb-4">
                  <Users className="w-4 h-4 text-pink-400" />
                  <span className="font-press-start text-[10px] sm:text-xs text-pink-300">BENEFITS</span>
                </div>
                <h2 className="font-press-start text-lg sm:text-xl md:text-2xl text-white">
                  HOW WE <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">HELP EACH OTHER</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {benefits.map((benefit, i) => {
                  const c = colorClasses[benefit.color];
                  return (
                    <div
                      key={i}
                      className={`group bg-gradient-to-br ${c.gradient} border ${c.border} p-6 hover:scale-[1.02] transition-all duration-300`}
                    >
                      <div className={`${c.iconBg} border ${c.border} w-12 h-12 flex items-center justify-center mb-4`}>
                        <benefit.icon className={`h-6 w-6 ${c.text}`} />
                      </div>
                      <h3 className={`font-press-start text-xs ${c.text} mb-3`}>
                        {benefit.title.toUpperCase()}
                      </h3>
                      <p className="font-jetbrains text-gray-400 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="text-center">
                <p className="font-press-start text-sm text-purple-300">
                  WE GROW STRONGER BY BUILDING TOGETHER.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership & Structure Section */}
        <section className="py-16 sm:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 mb-4">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="font-press-start text-[10px] sm:text-xs text-amber-300">STRUCTURE</span>
                </div>
                <h2 className="font-press-start text-lg sm:text-xl md:text-2xl text-white">
                  LEADERSHIP & <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">STRUCTURE</span>
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-6">
                  <h3 className="font-press-start text-xs text-purple-300 mb-2">PRESIDENT</h3>
                  <p className="font-jetbrains text-white">Raghwender Vasisth</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-6">
                  <h3 className="font-press-start text-xs text-amber-300 mb-2">VICE PRESIDENTS</h3>
                  <p className="font-jetbrains text-white">Outreach, Partnerships, Community, Marketing</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 p-6">
                  <h3 className="font-press-start text-xs text-green-300 mb-2">COUNCIL</h3>
                  <p className="font-jetbrains text-white">Regional and Event Collaboration leads elected from members</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 p-6">
                  <h3 className="font-press-start text-xs text-cyan-300 mb-2">MEMBERS</h3>
                  <p className="font-jetbrains text-white">All approved hackathon organizers</p>
                </div>
              </div>

              <div className="text-center mt-8">
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-6">
                  <p className="font-press-start text-xs text-purple-300">
                    MFHOP IS NOT JUST A DISCORD — IT'S A FEDERATION WITH CLEAR ROLES AND RESPONSIBILITIES.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Eligibility & Requirements Section */}
        <section className="py-16 sm:py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 mb-4">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="font-press-start text-[10px] sm:text-xs text-green-300">REQUIREMENTS</span>
                </div>
                <h2 className="font-press-start text-lg sm:text-xl md:text-2xl text-white">
                  ELIGIBILITY & <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">REQUIREMENTS</span>
                </h2>
              </div>

              <div className="space-y-4">
                {requirements.map((requirement, i) => (
                  <div key={i} className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 p-6 flex items-center gap-4">
                    <div className="bg-green-500/20 border border-green-500/40 w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <p className="font-jetbrains text-gray-300 text-sm sm:text-base">
                      {requirement}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How to Join Section */}
        <section className="py-16 sm:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 mb-4">
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                  <span className="font-press-start text-[10px] sm:text-xs text-cyan-300">PROCESS</span>
                </div>
                <h2 className="font-press-start text-lg sm:text-xl md:text-2xl text-white">
                  HOW TO <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">JOIN</span>
                </h2>
              </div>

              <div className="space-y-4">
                {steps.map((step, i) => (
                  <div key={i} className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 p-6 flex items-center gap-4">
                    <div className="bg-cyan-500/20 border border-cyan-500/40 w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <span className="font-press-start text-sm text-cyan-300">{i + 1}</span>
                    </div>
                    <p className="font-jetbrains text-gray-300 text-sm sm:text-base">
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
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-press-start text-xs transition-all duration-300"
                >
                  <FileText className="h-4 w-4" />
                  APPLY NOW
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 mb-4">
                  <MessageCircle className="w-4 h-4 text-pink-400" />
                  <span className="font-press-start text-[10px] sm:text-xs text-pink-300">QUESTIONS</span>
                </div>
                <h2 className="font-press-start text-lg sm:text-xl md:text-2xl text-white">
                  <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">FAQ</span>
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-6">
                  <h3 className="font-press-start text-xs text-purple-300 mb-3">IS THERE A FEE?</h3>
                  <p className="font-jetbrains text-gray-300">No, membership is free.</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-6">
                  <h3 className="font-press-start text-xs text-amber-300 mb-3">WHO CAN JOIN?</h3>
                  <p className="font-jetbrains text-gray-300">Any team or organizer that has hosted a hackathon.</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 p-6">
                  <h3 className="font-press-start text-xs text-green-300 mb-3">WHAT IF WE'RE SMALL?</h3>
                  <p className="font-jetbrains text-gray-300">Size doesn't matter. What matters is you've actually run an event.</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 p-6">
                  <h3 className="font-press-start text-xs text-cyan-300 mb-3">WHAT'S IN IT FOR MAXIMALLY?</h3>
                  <p className="font-jetbrains text-gray-300">We're building the ecosystem and leading the initiative. Stronger organizers = stronger hackathons for everyone.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="p-8 sm:p-12 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 border border-purple-500/30 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                
                <div className="relative z-10">
                  <h2 className="font-press-start text-base sm:text-lg md:text-xl text-white mb-6">
                    READY TO JOIN THE <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">FEDERATION?</span>
                  </h2>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    <a
                      href="https://forms.gle/DcjBJx9uT5LMG8538"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-press-start text-xs transition-all duration-300"
                    >
                      <FileText className="h-4 w-4" />
                      APPLY TO JOIN
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <span className="text-gray-500 font-press-start text-xs">OR</span>

                    <button
                      onClick={handleContactUs}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 font-press-start text-xs transition-all duration-300"
                    >
                      CONTACT US
                    </button>
                  </div>

                  <div className="bg-black/40 border border-purple-500/20 p-4">
                    <p className="font-jetbrains text-gray-400 text-sm">
                      Learn more at <span className="text-purple-400">maximally.in/mfhop</span> | Contact us at <span className="text-purple-400">cal.com/maximally</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900/40 via-black to-pink-900/40 border border-purple-500/30 p-8 max-w-md w-full relative">
              <button
                onClick={() => setShowEmailModal(false)}
                className="absolute top-4 right-4 bg-purple-500/20 border border-purple-500/40 p-2 hover:bg-purple-500/30 transition-colors"
              >
                <X className="h-4 w-4 text-purple-400" />
              </button>
              
              <div className="text-center">
                <div className="bg-purple-500/20 border border-purple-500/40 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-purple-400" />
                </div>
                
                <h3 className="font-press-start text-sm text-purple-300 mb-4">
                  CONTACT MFHOP
                </h3>
                
                <p className="font-jetbrains text-gray-400 mb-6">
                  Reach out to us at:
                </p>
                
                <div className="bg-black/40 border border-amber-500/30 p-4 mb-6">
                  <p className="font-jetbrains text-amber-300 text-lg break-all">
                    mfhop@maximally.in
                  </p>
                </div>
                
                <button
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 font-press-start text-xs transition-all duration-300"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? 'COPIED!' : 'COPY EMAIL'}
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
