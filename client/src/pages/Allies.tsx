import { Award, DollarSign, Camera, Ticket, Brain, Megaphone, CheckCircle, ArrowRight, ExternalLink, Users, Handshake, Sparkles } from "lucide-react";
import SEO from "@/components/SEO";
import PartnerCarousel from "@/components/PartnerCarousel";
import Footer from "@/components/Footer";

const Allies = () => {
  const benefits = [
    { icon: Award, title: '"Powered by Maximally" Badge', description: "Use our brand on your events, posters, and socials. Real street cred.", color: "purple" },
    { icon: DollarSign, title: "Micro-Funding & Support", description: "Get ₹1K–₹15K support for your fests, hackathons, or creative drops.", color: "green" },
    { icon: Camera, title: "Featured Collaborations", description: "Reels, content drops, design kits, or founder features — let's build together.", color: "cyan" },
    { icon: Ticket, title: "Free Passes & Perks", description: "Scholarships and fast-track access for your top members.", color: "pink" },
    { icon: Brain, title: "Mentorship + Speaker Network", description: "Plug into our builder circle — mentors, judges, and insider drops.", color: "amber" },
    { icon: Megaphone, title: "Promo Swaps & Spotlight", description: "We shout you out. You shout us out. Mutual clout. Mutual growth.", color: "rose" }
  ];

  const colorClasses: Record<string, { gradient: string; border: string; text: string; iconBg: string }> = {
    purple: { gradient: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/40', text: 'text-purple-300', iconBg: 'bg-purple-500/20' },
    green: { gradient: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/40', text: 'text-green-300', iconBg: 'bg-green-500/20' },
    cyan: { gradient: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/40', text: 'text-cyan-300', iconBg: 'bg-cyan-500/20' },
    pink: { gradient: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/40', text: 'text-pink-300', iconBg: 'bg-pink-500/20' },
    amber: { gradient: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/40', text: 'text-amber-300', iconBg: 'bg-amber-500/20' },
    rose: { gradient: 'from-rose-500/20 to-red-500/20', border: 'border-rose-500/40', text: 'text-rose-300', iconBg: 'bg-rose-500/20' },
  };

  const pactItems = [
    { from: "Partner badge + certificate", to: "Share our events once/month" },
    { from: "Funding + content support", to: "Nominate top students for community" },
    { from: "Judge/speaker access", to: "Let us host 1 mini-challenge" },
    { from: "Content collabs", to: "Refer 2 other quality orgs" }
  ];

  return (
    <>
      <SEO 
        title="Maximally Allies - Partner with India's Premier Teen Startup Platform"
        description="Join the official Maximally Allies network. Partner with India's boldest student organizations and unlock micro-funding, content collabs, and exclusive perks."
        keywords="student partnerships, college clubs, startup ecosystem, teen entrepreneurs, student funding"
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.10)_0%,transparent_50%)]" />
        
        <div className="absolute top-20 left-[5%] w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-60 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />
        <div className="absolute bottom-40 left-[20%] w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px]" />

        {/* Hero Section */}
        <section className="relative px-4 py-24 sm:py-32 text-center">
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 mb-6">
              <Handshake className="w-4 h-4 text-purple-400" />
              <span className="font-press-start text-[10px] sm:text-xs text-purple-300">PARTNERSHIP PROGRAM</span>
            </div>
            
            <h1 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 leading-relaxed">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Partner with Maximally
              </span>
              <br />
              <span className="text-white text-lg sm:text-xl md:text-2xl">Power What You Build</span>
            </h1>
            
            <p className="text-sm sm:text-base text-gray-400 mb-8 max-w-3xl mx-auto font-jetbrains leading-relaxed">
              Join the official Maximally Allies network — a curated alliance of the world's boldest student-led organizations. 
              From E-Cells and MUN clubs to content crews and youth NGOs, we back the ones who build.
            </p>
            
            <button 
              onClick={() => window.open("https://forms.gle/9buYWogTkRudX97WA", "_blank")}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-press-start text-xs transition-all duration-300"
            >
              APPLY NOW
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Partner Carousel */}
        <PartnerCarousel />

        {/* What You Get Section */}
        <section className="px-4 py-16 sm:py-24 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 mb-4">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="font-press-start text-[10px] sm:text-xs text-cyan-300">BENEFITS</span>
              </div>
              <h2 className="font-press-start text-lg sm:text-xl md:text-2xl text-white">
                WHAT YOU <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">GET</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {benefits.map((benefit, index) => {
                const c = colorClasses[benefit.color];
                return (
                  <div 
                    key={index} 
                    className={`group bg-gradient-to-br ${c.gradient} border ${c.border} p-6 hover:scale-[1.02] transition-all duration-300`}
                  >
                    <div className={`${c.iconBg} border ${c.border} w-12 h-12 flex items-center justify-center mb-4`}>
                      <benefit.icon className={`h-6 w-6 ${c.text}`} />
                    </div>
                    <h3 className={`font-press-start text-xs ${c.text} mb-3`}>{benefit.title.toUpperCase()}</h3>
                    <p className="font-jetbrains text-gray-400 text-sm">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mutual Pact Section */}
        <section className="px-4 py-16 sm:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 mb-4">
                <Users className="w-4 h-4 text-pink-400" />
                <span className="font-press-start text-[10px] sm:text-xs text-pink-300">MUTUAL PACT</span>
              </div>
              <h2 className="font-press-start text-lg sm:text-xl md:text-2xl text-white">
                WHAT YOU GET. <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">WHAT YOU GIVE.</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 p-6">
                <h3 className="font-press-start text-sm text-cyan-300 mb-6">FROM MAXIMALLY</h3>
                <div className="space-y-4">
                  {pactItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="font-jetbrains text-gray-300 text-sm">{item.from}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/30 p-6">
                <h3 className="font-press-start text-sm text-pink-300 mb-6">FROM YOUR ORG</h3>
                <div className="space-y-4">
                  {pactItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="font-jetbrains text-gray-300 text-sm">{item.to}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="px-4 py-16 sm:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-8 sm:p-12">
              <blockquote className="font-jetbrains text-base sm:text-lg italic text-gray-300 mb-6">
                "We got ₹5K funding, Insta collabs, and our president featured by Maximally. 
                This isn't a partnership — it's a revolution."
              </blockquote>
              <p className="font-press-start text-xs text-purple-300">— Team Radiant, E-Cell Partner</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-16 sm:py-24 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 sm:p-12 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 border border-purple-500/30 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]" />
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              
              <div className="relative z-10">
                <h2 className="font-press-start text-lg sm:text-xl md:text-2xl mb-4">
                  <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                    Let's Build. Together.
                  </span>
                </h2>
                <p className="font-jetbrains text-sm sm:text-base text-gray-400 mb-8 max-w-2xl mx-auto">
                  We're building the default startup and storytelling engine for global teens. 
                  Join us early and help shape the movement.
                </p>
                <button 
                  onClick={() => window.open("https://forms.gle/9buYWogTkRudX97WA", "_blank")}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600/40 to-blue-500/30 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 hover:text-white font-press-start text-xs transition-all duration-300"
                >
                  APPLY TO JOIN
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default Allies;
