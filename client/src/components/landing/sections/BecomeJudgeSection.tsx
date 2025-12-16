import { Link } from "react-router-dom";
import { ArrowRight, Star, Award, Clock, Users, Sparkles, Gift } from "lucide-react";

const judgePerks = [
  {
    icon: Clock,
    title: "Flexible Commitment",
    description: "Choose events that match your schedule and expertise across 5 judge tiers.",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30"
  },
  {
    icon: Gift,
    title: "Judge Perks",
    description: "Access exclusive lounges, premium swag, and VIP networking events.",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30"
  },
  {
    icon: Award,
    title: "Build Your Profile",
    description: "Get recognized in the community with a verified judge profile and badges.",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30"
  },
];

export function BecomeJudgeSection() {
  return (
    <section className="py-20 sm:py-24 relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-950/10 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.1)_0%,transparent_50%)]" />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      
      <div className="absolute top-40 left-[10%] w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-[15%] w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30">
            <Star className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-press-start text-[10px] sm:text-xs text-cyan-300 tracking-wider">
              BECOME A JUDGE
            </span>
            <Award className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Shape the Future
            </span>
          </h2>
          <p className="font-jetbrains text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Join our network of industry experts and help evaluate the next generation of builders.
            Your expertise matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto mb-12">
          {judgePerks.map((perk, index) => (
            <div
              key={index}
              className={`group p-6 sm:p-8 bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 hover:border-cyan-500/40 transition-all duration-300`}
              data-testid={`judge-perk-${index}`}
            >
              <div className={`p-4 ${perk.bgColor} border ${perk.borderColor} inline-block mb-5 group-hover:scale-110 transition-transform`}>
                <perk.icon className={`w-6 h-6 ${perk.color}`} />
              </div>
              <h3 className="font-press-start text-xs sm:text-sm text-white mb-3 group-hover:text-cyan-400 transition-colors">
                {perk.title}
              </h3>
              <p className="font-jetbrains text-sm text-gray-400 leading-relaxed">
                {perk.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
          <Link
            to="/people/judges"
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white font-press-start text-[10px] sm:text-xs transition-all duration-300"
            data-testid="button-view-judges"
          >
            <Users className="w-4 h-4" />
            <span>VIEW JUDGES</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to="/judges"
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600/30 to-purple-500/20 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 hover:text-white font-press-start text-[10px] sm:text-xs transition-all duration-300"
            data-testid="button-apply-judge"
          >
            <Star className="w-4 h-4" />
            <span>APPLY TO JUDGE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
    </section>
  );
}

export default BecomeJudgeSection;
