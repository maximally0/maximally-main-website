import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Users, Network, Laptop } from "lucide-react";

const exploreTiles = [
  {
    id: "hackathons",
    title: "Hackathons",
    description: "Browse all open and upcoming hackathons. The core product.",
    icon: Trophy,
    url: "/events",
    color: "text-orange-400",
    borderColor: "border-orange-500/20",
    hoverBorder: "hover:border-orange-500/50",
  },
  {
    id: "senior-council",
    title: "Senior Council",
    description: "Meet the operators who judge and mentor across Maximally programs.",
    icon: Users,
    url: "/senior-council",
    color: "text-white",
    borderColor: "border-gray-700",
    hoverBorder: "hover:border-gray-500",
  },
  {
    id: "mfhop",
    title: "MFHOP",
    description: "The Maximally Federation of Hackathon Organizers. Apply to join.",
    icon: Network,
    url: "/mfhop",
    color: "text-orange-400",
    borderColor: "border-orange-500/20",
    hoverBorder: "hover:border-orange-500/50",
  },
  {
    id: "platform",
    title: "Platform",
    description: "Host your own hackathon on the Maximally platform.",
    icon: Laptop,
    url: "/host-hackathon",
    color: "text-gray-300",
    borderColor: "border-gray-700",
    hoverBorder: "hover:border-gray-500",
  },
];

export function ExploreMaximallySection() {
  return (
    <section id="explore" className="py-24 sm:py-32 relative bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
      
      <div className="absolute top-20 left-[5%] w-72 h-72 bg-orange-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-40 right-[10%] w-60 h-60 bg-gray-500/5 rounded-full blur-[80px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16 sm:mb-20">
          <span className="font-space text-sm text-orange-400 tracking-wide font-medium mb-4 block">
            THE ECOSYSTEM
          </span>
          <h2 className="font-space text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
            Explore Maximally
          </h2>
          <p className="font-space text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Everything we're building. Each piece serves the ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {exploreTiles.map((tile) => (
            <Link
              key={tile.id}
              to={tile.url}
              className={`group relative p-6 sm:p-8 bg-gray-900/40 border ${tile.borderColor} ${tile.hoverBorder} transition-all duration-300`}
              data-testid={`explore-tile-${tile.id}`}
            >
              {tile.badge && (
                <span className="absolute top-4 right-4 px-2 py-0.5 bg-orange-500/10 border border-gray-800 text-orange-400 font-space text-[10px] font-medium">
                  {tile.badge}
                </span>
              )}
              <div className="mb-5">
                <tile.icon className={`w-7 h-7 ${tile.color}`} />
              </div>
              <h3 className={`font-space text-lg font-semibold mb-2 ${tile.color} group-hover:text-white transition-colors`}>
                {tile.title}
              </h3>
              <p className="font-space text-sm text-gray-400 leading-relaxed mb-5">
                {tile.description}
              </p>
              <div className="flex items-center gap-2 text-gray-500 group-hover:text-orange-400 font-space text-sm font-medium transition-colors">
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
    </section>
  );
}

export default ExploreMaximallySection;
