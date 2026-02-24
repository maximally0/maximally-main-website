import { ArrowRight, Rocket, Trophy, Zap, Code, Users, Sparkles, Target, Gift, ScrollText, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const Hackathon = () => {
  const tracks = [
    { name: "AI & No-Code Innovation", description: "Build the future without writing code", icon: "🤖", color: "orange" },
    { name: "Social Impact", description: "Solve real problems for real people", icon: "🌍", color: "green" },
    { name: "Gaming & Web3", description: "Create immersive digital experiences", icon: "🎮", color: "orange" },
    { name: "Open Innovation", description: "Your wild card to build anything", icon: "💫", color: "orange" }
  ];

  const colorClasses: Record<string, { gradient: string; border: string; text: string; iconBg: string }> = {
    purple: { gradient: 'from-orange-500/10 to-violet-500/20', border: 'border-orange-500/30', text: 'text-orange-400', iconBg: 'bg-orange-500/10' },
    green: { gradient: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/40', text: 'text-green-300', iconBg: 'bg-green-500/20' },
    cyan: { gradient: 'from-gray-800/50 to-blue-500/20', border: 'border-gray-700', text: 'text-gray-300', iconBg: 'bg-gray-800' },
    pink: { gradient: 'from-orange-500/10 to-rose-500/20', border: 'border-orange-500/30', text: 'text-orange-400', iconBg: 'bg-orange-500/10' },
    amber: { gradient: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/40', text: 'text-amber-300', iconBg: 'bg-amber-500/20' },
  };

  return (
    <>
      <SEO
        title="Maximally Hack: Future Founders Quest | Global Innovation Challenge"
        description="Join one of India's most ambitious innovation challenges. 48 hours of building, innovating, and launching the future. Open to coders, creators, and community builders."
        keywords="hackathon India, innovation challenge, coding competition, future founders, startup competition"
      />
      
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.04)_0%,transparent_50%)]" />
        
        <div className="absolute top-20 left-[5%] w-80 h-80 bg-orange-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-60 right-[10%] w-60 h-60 bg-orange-500/3 rounded-full blur-[80px]" />
        <div className="absolute bottom-40 left-[20%] w-72 h-72 bg-gray-800 rounded-full blur-[90px]" />
        
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

        <div className="container mx-auto px-4 pt-24 md:pt-32 pb-16 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-gray-800 mb-6">
                <Rocket className="w-4 h-4 text-orange-400" />
                <span className="font-space font-bold text-[10px] sm:text-xs text-orange-400">FUTURE FOUNDERS QUEST</span>
              </div>
              
              <h1 className="font-space font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 leading-relaxed">
                <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  Maximally Hack
                </span>
              </h1>
              
              <p className="font-space text-base sm:text-lg md:text-xl text-gray-300 mb-4">
                July 1–3, 2025 | Virtual | Open to Builders Worldwide
              </p>
              <p className="font-space text-sm text-gray-400">
                $1,000 in Prizes | Beginner Friendly | AI & No-Code Welcome
              </p>
            </div>

            {/* What to Expect & Prizes */}
            <div className="grid gap-6 md:grid-cols-2 mb-16">
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-orange-500/10 border border-orange-500/30 w-10 h-10 flex items-center justify-center">
                    <Rocket className="h-5 w-5 text-orange-400" />
                  </div>
                  <h2 className="font-space font-bold text-sm text-orange-400">WHAT TO EXPECT</h2>
                </div>
                <ul className="space-y-3 font-space text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">💡</span>
                    <span>Theme reveal + kickoff on July 1st</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">🔧</span>
                    <span>Build solo or with a team (max 4)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">🚀</span>
                    <span>Use any tools: AI, no-code, or full-code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">🔥</span>
                    <span>Get mentorship throughout</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">🎤</span>
                    <span>Submit by July 3rd at 11:59 PM IST</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-amber-500/20 border border-amber-500/40 w-10 h-10 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-amber-400" />
                  </div>
                  <h2 className="font-space font-bold text-sm text-amber-300">PRIZES</h2>
                </div>
                <ul className="space-y-3 font-space text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">🥇</span>
                    <span>Maker of the Year: $500</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">🌟</span>
                    <span>Best No-Code Project: $250</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">💫</span>
                    <span>Social Impact Award: $250</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">✨</span>
                    <span>Special mentions & swag</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">🎯</span>
                    <span>Featured on Maximally's Hall of Fame</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quest Tracks */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 mb-4">
                  <Code className="w-4 h-4 text-gray-300" />
                  <span className="font-space font-bold text-[10px] sm:text-xs text-gray-300">QUEST TRACKS</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {tracks.map((track, index) => {
                  const c = colorClasses[track.color];
                  return (
                    <div 
                      key={track.name} 
                      className={`group bg-gradient-to-br ${c.gradient} border ${c.border} p-6 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
                    >
                      <div className="text-3xl mb-3">{track.icon}</div>
                      <h3 className={`font-space font-bold text-xs sm:text-sm mb-2 ${c.text}`}>{track.name}</h3>
                      <p className="font-space text-gray-400 text-sm">{track.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Epic Rewards */}
            <div className="mb-16 bg-gradient-to-br from-gray-900/40 via-black to-gray-900/20 border border-gray-800 p-8 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.05)_0%,transparent_70%)]" />
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/5 border border-gray-800 mb-4">
                    <Gift className="w-4 h-4 text-orange-400" />
                    <span className="font-space font-bold text-[10px] sm:text-xs text-orange-400">EPIC REWARDS</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-orange-500/10 border border-orange-500/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl">💎</span>
                    </div>
                    <h3 className="font-space font-bold text-xs text-orange-400 mb-2">Cash Prizes</h3>
                    <p className="font-space text-gray-400 text-sm">Win up to $500 for your innovation</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gray-800 border border-gray-700 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <h3 className="font-space font-bold text-xs text-gray-300 mb-2">Mentorship</h3>
                    <p className="font-space text-gray-400 text-sm">1:1 guidance from industry experts</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-500/10 border border-orange-500/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl">🚀</span>
                    </div>
                    <h3 className="font-space font-bold text-xs text-orange-400 mb-2">Launch Support</h3>
                    <p className="font-space text-gray-400 text-sm">Help taking your project live</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quest Rules */}
            <div className="mb-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 p-8 backdrop-blur-sm">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 mb-4">
                  <ScrollText className="w-4 h-4 text-green-400" />
                  <span className="font-space font-bold text-[10px] sm:text-xs text-green-300">QUEST RULES</span>
                </div>
              </div>
              
              <div className="space-y-3 font-space text-gray-300 max-w-2xl mx-auto">
                <p className="flex items-start gap-3">
                  <span className="text-green-400">•</span>
                  <span>Open to all builders across India</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-green-400">•</span>
                  <span>Build something new during the hackathon</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-green-400">•</span>
                  <span>Teams of 1-4 players allowed</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-green-400">•</span>
                  <span>All code must be your own or openly licensed</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-green-400">•</span>
                  <span>AI tools and no-code platforms are welcome</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-green-400">•</span>
                  <span>Projects must solve a real problem</span>
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center space-y-6">
              <a 
                href="https://maximally-makeathon-2025.devpost.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-500/50 hover:border-orange-500 text-white hover:text-white font-space font-bold text-xs sm:text-sm transition-all duration-300 hover:scale-[1.02]"
              >
                <Sparkles className="h-5 w-5" />
                JOIN THE QUEST
                <ArrowRight className="h-5 w-5" />
              </a>
              <p className="font-space text-sm text-gray-500">
                Questions? Email hack@maximally.in
              </p>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Hackathon;
