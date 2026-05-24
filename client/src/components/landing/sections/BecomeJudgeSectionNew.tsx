import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, CheckCircle, Star, Trophy, Zap } from "lucide-react";

const perks = [
  "Evaluate real hackathon submissions",
  "Flexible time commitment — pick your events",
  "Verified judge badge & public profile",
  "Access to judge dashboard & organizer invitations",
  "Build reputation in the builder ecosystem",
];

export function BecomeJudgeSectionNew() {
  return (
    <section className="relative bg-black overflow-hidden py-24 sm:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(249,115,22,0.08)_0%,transparent_100%)]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800/50 to-transparent" />

      {/* Floating orbs */}
      <div className="absolute top-20 right-[10%] w-72 h-72 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-[5%] w-56 h-56 bg-orange-500/4 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6">
                <Trophy className="w-3.5 h-3.5 text-orange-400" />
                <span className="font-space font-bold text-[10px] text-orange-400 tracking-widest uppercase">For Experts</span>
              </div>

              <h2 className="font-space font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-6">
                Become a<br />
                <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  Judge
                </span>
              </h2>

              <p className="font-space text-base text-gray-400 leading-relaxed mb-8 max-w-md">
                Evaluate hackathon submissions from builders worldwide. Provide structured feedback, score projects, and help determine winners. Your expertise shapes what gets built.
              </p>

              {/* Perks */}
              <ul className="space-y-3 mb-10">
                {perks.map(perk => (
                  <li key={perk} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                    <span className="font-space text-sm text-gray-300">{perk}</span>
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/judge/apply"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-space font-bold text-xs tracking-wider transition-all duration-300 hover:scale-[1.02]"
                >
                  <Star className="w-3.5 h-3.5" />
                  APPLY TO JUDGE
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/judges"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white font-space font-bold text-xs tracking-wider transition-all duration-300"
                >
                  <Users className="w-3.5 h-3.5" />
                  VIEW JUDGES
                </Link>
              </div>
            </div>

            {/* Right — Visual card */}
            <div className="relative">
              {/* Main card */}
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-900/80 border border-gray-800 p-8 sm:p-10 overflow-hidden">
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/8 blur-[60px]" />
                <div className="absolute top-0 right-0 w-px h-20 bg-gradient-to-b from-orange-500/40 to-transparent" />
                <div className="absolute top-0 right-0 w-20 h-px bg-gradient-to-l from-orange-500/40 to-transparent" />

                {/* Icon */}
                <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6">
                  <Award className="w-7 h-7 text-orange-400" />
                </div>

                <h3 className="font-space font-bold text-2xl text-white mb-2">Judge Profile</h3>
                <p className="font-space text-sm text-gray-500 mb-8">What you get after approval</p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-800">
                  {[
                    { label: "Verified Badge", icon: "✓" },
                    { label: "Public Profile", icon: "👤" },
                    { label: "Dashboard", icon: "⚡" },
                  ].map(item => (
                    <div key={item.label} className="text-center">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <p className="font-space text-[10px] text-gray-500 uppercase tracking-wider">{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* Tier badges */}
                <p className="font-space text-[10px] text-gray-600 uppercase tracking-wider mb-3">Judge Tiers</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Starter", cls: "bg-gray-800 text-gray-400 border-gray-700" },
                    { label: "Rising", cls: "bg-green-900/30 text-green-400 border-green-800" },
                    { label: "Established", cls: "bg-blue-900/30 text-blue-400 border-blue-800" },
                    { label: "Expert", cls: "bg-purple-900/30 text-purple-400 border-purple-800" },
                    { label: "Legend", cls: "bg-yellow-900/30 text-yellow-400 border-yellow-800" },
                  ].map(tier => (
                    <span key={tier.label} className={`px-2.5 py-1 text-[10px] font-space font-bold border rounded-full ${tier.cls}`}>
                      {tier.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Floating mini card */}
              <div className="absolute -bottom-4 -left-4 bg-gray-900 border border-orange-500/30 px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-space text-xs text-gray-300">Applications reviewed in 3–5 days</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default BecomeJudgeSectionNew;
