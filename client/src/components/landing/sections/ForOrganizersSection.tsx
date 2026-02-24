import { Link } from "react-router-dom";
import { ArrowRight, Building2, Network } from "lucide-react";

const organizerCards = [
  {
    icon: Building2,
    title: "Host on Maximally",
    description: "Our platform handles submissions, judging, and visibility. You run the event. We handle the infrastructure.",
    url: "/host-hackathon",
    cta: "Start Hosting",
  },
  {
    icon: Network,
    title: "Join the Federation",
    description: "MFHOP is Maximally's invite-reviewed network of serious hackathon organizers. Shared infrastructure, collective credibility, and a community of people solving the same problems.",
    url: "/mfhop",
    cta: "Apply to Join",
  },
];

export function ForOrganizersSection() {
  return (
    <section className="py-24 sm:py-32 relative bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
      
      <div className="absolute bottom-20 right-[15%] w-64 h-64 bg-orange-500/5 rounded-full blur-[80px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-14 sm:mb-18">
          <span className="font-space text-sm text-orange-400 tracking-wide font-medium mb-4 block">
            FOR ORGANIZERS
          </span>
          <h2 className="font-space text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
            Build Events That Attract Serious Builders
          </h2>
          <p className="font-space text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Two ways to work with Maximally — host on our platform, or join the federation of organizers shaping the standard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {organizerCards.map((card, index) => (
            <Link
              key={index}
              to={card.url}
              className="group p-7 sm:p-9 bg-gray-900/40 border border-gray-800 hover:border-orange-500/40 transition-all duration-300"
              data-testid={`organizer-card-${index}`}
            >
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 inline-block mb-6 group-hover:bg-orange-500/20 transition-colors">
                <card.icon className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-space text-lg sm:text-xl font-semibold text-white mb-3 group-hover:text-orange-400 transition-colors">
                {card.title}
              </h3>
              <p className="font-space text-sm text-gray-400 mb-6 leading-relaxed">
                {card.description}
              </p>
              <div className="flex items-center gap-2 text-orange-400 font-space text-sm font-medium group-hover:translate-x-1 transition-transform">
                <span>{card.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
    </section>
  );
}

export default ForOrganizersSection;
