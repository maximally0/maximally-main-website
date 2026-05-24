import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, CheckCircle, Heart, MessageCircle, Zap } from "lucide-react";

const perks = [
  "1-on-1 mentorship sessions with builders",
  "Choose your own availability & schedule",
  "Featured in the public mentor gallery",
  "Help teams ship faster and learn more",
  "Build your reputation as a thought leader",
];

export function BecomeMentorSection() {
  return (
    <section className="relative bg-black overflow-hidden py-24 sm:py-32">
      {/* Background — slightly different from judge section */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(249,115,22,0.07)_0%,transparent_100%)]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

      <div className="absolute top-10 left-[8%] w-64 h-64 bg-orange-500/4 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-10 right-[8%] w-80 h-80 bg-orange-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Reversed layout — visual on left, text on right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — Visual card */}
            <div className="relative order-2 lg:order-1">
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-900/80 border border-gray-800 p-8 sm:p-10 overflow-hidden">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/8 blur-[60px]" />
                <div className="absolute bottom-0 left-0 w-px h-20 bg-gradient-to-t from-orange-500/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-20 h-px bg-gradient-to-r from-orange-500/40 to-transparent" />

                {/* Icon */}
                <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6">
                  <BookOpen className="w-7 h-7 text-orange-400" />
                </div>

                <h3 className="font-space font-bold text-2xl text-white mb-2">Mentor Profile</h3>
                <p className="font-space text-sm text-gray-500 mb-8">What you get after approval</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-800">
                  {[
                    { label: "Gallery Listing", icon: "🌟" },
                    { label: "Session Mgmt", icon: "📅" },
                    { label: "Mentor Badge", icon: "🏅" },
                  ].map(item => (
                    <div key={item.label} className="text-center">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <p className="font-space text-[10px] text-gray-500 uppercase tracking-wider">{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* Availability options */}
                <p className="font-space text-[10px] text-gray-600 uppercase tracking-wider mb-3">Availability Options</p>
                <div className="flex flex-wrap gap-2">
                  {["Weekends", "Evenings", "Flexible", "Limited"].map(opt => (
                    <span key={opt} className="px-3 py-1 text-[10px] font-space font-bold border border-gray-700 text-gray-400 bg-gray-800/50 rounded-full">
                      {opt}
                    </span>
                  ))}
                </div>

                {/* Sample mentor card preview */}
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <p className="font-space text-[10px] text-gray-600 uppercase tracking-wider mb-3">How you'll appear</p>
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
                      <span className="font-space font-bold text-orange-400 text-sm">Y</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-space text-sm font-bold text-white truncate">Your Name</p>
                      <p className="font-space text-xs text-gray-500 truncate">Your expertise · Available</p>
                    </div>
                    <span className="text-[10px] font-space font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full shrink-0">Online</span>
                  </div>
                </div>
              </div>

              {/* Floating mini card */}
              <div className="absolute -top-4 -right-4 bg-gray-900 border border-orange-500/30 px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-space text-xs text-gray-300">Make a real impact on builders</span>
                </div>
              </div>
            </div>

            {/* Right — Text */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6">
                <MessageCircle className="w-3.5 h-3.5 text-orange-400" />
                <span className="font-space font-bold text-[10px] text-orange-400 tracking-widest uppercase">For Practitioners</span>
              </div>

              <h2 className="font-space font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-6">
                Become a<br />
                <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  Mentor
                </span>
              </h2>

              <p className="font-space text-base text-gray-400 leading-relaxed mb-8 max-w-md">
                Guide hackathon participants through technical challenges, product decisions, and execution. Your experience helps builders ship faster and learn more.
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
                  to="/mentor/apply"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-space font-bold text-xs tracking-wider transition-all duration-300 hover:scale-[1.02]"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  APPLY TO MENTOR
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/mentors"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white font-space font-bold text-xs tracking-wider transition-all duration-300"
                >
                  <Users className="w-3.5 h-3.5" />
                  VIEW MENTORS
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default BecomeMentorSection;
