import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Star, BookOpen, CheckCircle, Zap } from "lucide-react";

const judgePerks = [
  "Evaluate real hackathon submissions",
  "Flexible time commitment",
  "Verified judge badge & profile",
  "Access to judge dashboard & invitations",
];

const mentorPerks = [
  "1-on-1 sessions with builders",
  "Choose your own availability",
  "Featured in mentor gallery",
  "Help teams ship faster",
];

export function JoinAsMentorJudgeSection() {
  return (
    <section className="py-20 sm:py-28 relative bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(249,115,22,0.07)_0%,transparent_60%)]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/25 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800/40 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-space font-bold text-[10px] sm:text-xs text-orange-400 tracking-widest uppercase">
              Contribute to the Ecosystem
            </span>
          </div>
          <h2 className="font-space font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-5 leading-tight">
            Become a{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 bg-clip-text text-transparent">
                Judge
              </span>
            </span>
            {" "}or{" "}
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 bg-clip-text text-transparent">
              Mentor
            </span>
          </h2>
          <p className="font-space text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Share your expertise with the next generation of builders. Evaluate submissions, guide teams, and earn recognition in the Maximally ecosystem.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Judge Card */}
          <div className="group relative p-8 sm:p-10 bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 hover:border-orange-500/50 transition-all duration-500 overflow-hidden">
            {/* Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/8 rounded-full blur-[60px] group-hover:bg-orange-500/15 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/30 transition-all duration-500" />

            <div className="relative z-10">
              {/* Icon + label */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg group-hover:bg-orange-500/15 transition-colors">
                  <Award className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="font-space text-[10px] text-orange-400/70 tracking-widest uppercase mb-0.5">Role</p>
                  <h3 className="font-space font-bold text-xl text-white">Judge</h3>
                </div>
              </div>

              <p className="font-space text-sm text-gray-400 leading-relaxed mb-7">
                Evaluate hackathon submissions from builders worldwide. Provide structured feedback, score projects, and help determine winners.
              </p>

              {/* Perks */}
              <ul className="space-y-2.5 mb-8">
                {judgePerks.map(perk => (
                  <li key={perk} className="flex items-center gap-3 text-sm text-gray-300 font-space">
                    <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/judge/apply"
                  className="group/btn flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space font-bold text-xs transition-all duration-300 hover:scale-[1.02]"
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>APPLY TO JUDGE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/judges"
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white font-space font-bold text-xs transition-all duration-300"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>VIEW JUDGES</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Mentor Card */}
          <div className="group relative p-8 sm:p-10 bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 hover:border-orange-500/50 transition-all duration-500 overflow-hidden">
            {/* Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/8 rounded-full blur-[60px] group-hover:bg-orange-500/15 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/30 transition-all duration-500" />

            <div className="relative z-10">
              {/* Icon + label */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg group-hover:bg-orange-500/15 transition-colors">
                  <BookOpen className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="font-space text-[10px] text-orange-400/70 tracking-widest uppercase mb-0.5">Role</p>
                  <h3 className="font-space font-bold text-xl text-white">Mentor</h3>
                </div>
              </div>

              <p className="font-space text-sm text-gray-400 leading-relaxed mb-7">
                Guide hackathon participants through technical challenges, product decisions, and execution. Make a real impact on what gets built.
              </p>

              {/* Perks */}
              <ul className="space-y-2.5 mb-8">
                {mentorPerks.map(perk => (
                  <li key={perk} className="flex items-center gap-3 text-sm text-gray-300 font-space">
                    <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/mentor/apply"
                  className="group/btn flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space font-bold text-xs transition-all duration-300 hover:scale-[1.02]"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>APPLY TO MENTOR</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/mentors"
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white font-space font-bold text-xs transition-all duration-300"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>VIEW MENTORS</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-600 font-space mt-8">
          Applications are reviewed by the Maximally team within 3–5 business days.
        </p>
      </div>
    </section>
  );
}

export default JoinAsMentorJudgeSection;
