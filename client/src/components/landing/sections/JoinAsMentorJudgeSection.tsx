import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Star, BookOpen } from "lucide-react";

export function JoinAsMentorJudgeSection() {
  return (
    <section className="py-20 sm:py-24 relative bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.05)_0%,transparent_60%)]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 bg-orange-500/10 border border-orange-500/20">
            <Star className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="font-space font-bold text-[10px] sm:text-xs text-orange-400 tracking-wider">
              CONTRIBUTE TO THE ECOSYSTEM
            </span>
          </div>
          <h2 className="font-space font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4">
            Become a{" "}
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              Judge
            </span>{" "}
            or{" "}
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              Mentor
            </span>
          </h2>
          <p className="font-space text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
            Share your expertise. Evaluate submissions, guide builders, and shape the next generation of products.
          </p>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Judge card */}
          <div className="group relative p-8 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 hover:border-orange-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[60px] rounded-full" />
            <div className="relative z-10">
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 inline-block mb-5">
                <Award className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-space font-bold text-lg text-white mb-3">Become a Judge</h3>
              <p className="font-space text-sm text-gray-400 leading-relaxed mb-6">
                Evaluate hackathon submissions, provide feedback to builders, and earn recognition as a verified platform judge.
              </p>
              <ul className="space-y-2 mb-8">
                {["Evaluate real projects", "Flexible time commitment", "Verified judge profile & badge", "Access to judge dashboard"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-300 font-space">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <Link
                  to="/judge/apply"
                  className="group/btn flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-space font-bold text-xs transition-all"
                >
                  <span>APPLY NOW</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/judges"
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white font-space font-bold text-xs transition-all"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>VIEW JUDGES</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Mentor card */}
          <div className="group relative p-8 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 hover:border-orange-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[60px] rounded-full" />
            <div className="relative z-10">
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 inline-block mb-5">
                <BookOpen className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-space font-bold text-lg text-white mb-3">Become a Mentor</h3>
              <p className="font-space text-sm text-gray-400 leading-relaxed mb-6">
                Guide hackathon participants through technical challenges, product decisions, and execution. Make a real impact.
              </p>
              <ul className="space-y-2 mb-8">
                {["1-on-1 mentorship sessions", "Choose your availability", "Mentor profile in gallery", "Help builders ship faster"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-300 font-space">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <Link
                  to="/mentor/apply"
                  className="group/btn flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-space font-bold text-xs transition-all"
                >
                  <span>APPLY NOW</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/mentors"
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white font-space font-bold text-xs transition-all"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>VIEW MENTORS</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JoinAsMentorJudgeSection;
