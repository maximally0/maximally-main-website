import { Link } from "react-router-dom";
import { ArrowRight, Crown, Building2, Users, Sparkles, Gift, Award } from "lucide-react";

const organizerPerks = [
  {
    icon: Building2,
    title: "Full Platform Access",
    description: "Get access to our hackathon management tools, registration system, and submission platform.",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30"
  },
  {
    icon: Gift,
    title: "Organizer Perks",
    description: "Access to sponsor network, judge pool, and exclusive organizer resources and templates.",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30"
  },
  {
    icon: Award,
    title: "Build Your Profile",
    description: "Get recognized with a verified organizer profile, badges, and event portfolio.",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30"
  },
];

export function BecomeOrganizerSection() {
  return (
    <section className="py-20 sm:py-24 relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-orange-950/10 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.1)_0%,transparent_50%)]" />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
      
      <div className="absolute top-40 left-[10%] w-72 h-72 bg-orange-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-[15%] w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-500/10 border border-orange-500/30">
            <Crown className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="font-press-start text-[10px] sm:text-xs text-orange-300 tracking-wider">
              BECOME AN ORGANIZER
            </span>
            <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
          </div>
          <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-4">
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              Lead the Movement
            </span>
          </h2>
          <p className="font-jetbrains text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Join our network of hackathon organizers and help build the next generation of innovation events.
            Your leadership matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto mb-12">
          {organizerPerks.map((perk, index) => (
            <div
              key={index}
              className={`group p-6 sm:p-8 bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 hover:border-orange-500/40 transition-all duration-300`}
              data-testid={`organizer-perk-${index}`}
            >
              <div className={`p-4 ${perk.bgColor} border ${perk.borderColor} inline-block mb-5 group-hover:scale-110 transition-transform`}>
                <perk.icon className={`w-6 h-6 ${perk.color}`} />
              </div>
              <h3 className="font-press-start text-xs sm:text-sm text-white mb-3 group-hover:text-orange-400 transition-colors">
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
            to="/people/organizers"
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 border border-orange-500/40 hover:border-orange-400 text-orange-300 hover:text-white font-press-start text-[10px] sm:text-xs transition-all duration-300"
            data-testid="button-view-organizers"
          >
            <Users className="w-4 h-4" />
            <span>VIEW ORGANIZERS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to="/organizer/apply"
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600/30 to-amber-500/20 border border-orange-500/50 hover:border-orange-400 text-orange-200 hover:text-white font-press-start text-[10px] sm:text-xs transition-all duration-300"
            data-testid="button-apply-organizer"
          >
            <Crown className="w-4 h-4" />
            <span>APPLY TO ORGANIZE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
    </section>
  );
}

export default BecomeOrganizerSection;
