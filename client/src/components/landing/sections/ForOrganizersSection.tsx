import { Link } from "react-router-dom";
import { ArrowRight, Building2, BookOpen, Users } from "lucide-react";

const organizerCards = [
  {
    icon: Building2,
    title: "Host With Maximally",
    description: "Partner with us to run your hackathon. We handle the tech, you bring the vision.",
    url: "/host-hackathon",
  },
  {
    icon: BookOpen,
    title: "Join MFHOP",
    description: "Maximally For Hackathon Organizer Program - resources and support for event organizers.",
    url: "/mfhop",
  },
  {
    icon: Users,
    title: "Judges & Mentors",
    description: "Access our network of industry experts to judge and mentor at your events.",
    url: "/judges",
  },
];

export function ForOrganizersSection() {
  return (
    <section className="py-16 sm:py-20 relative bg-gradient-to-b from-black via-amber-950/10 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(251,191,36,0.05)_0%,transparent_50%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-block mb-4">
            <span className="font-press-start text-xs sm:text-sm text-amber-400 bg-amber-500/10 border border-amber-500/30 px-4 py-2">
              FOR ORGANIZERS
            </span>
          </div>
          <h2 className="font-press-start text-lg sm:text-xl md:text-2xl text-white mb-4">
            Run Better Events
          </h2>
          <p className="font-jetbrains text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Everything you need to host successful hackathons
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {organizerCards.map((card, index) => (
            <Link
              key={index}
              to={card.url}
              className="group p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 hover:border-amber-500/30 transition-all duration-300"
              data-testid={`organizer-card-${index}`}
            >
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 inline-block mb-4 group-hover:border-amber-500/40 transition-colors">
                <card.icon className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="font-press-start text-xs sm:text-sm text-white mb-3">
                {card.title}
              </h3>
              <p className="font-jetbrains text-sm text-gray-400 mb-4">
                {card.description}
              </p>
              <div className="flex items-center gap-2 text-amber-500 font-press-start text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <span>LEARN MORE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ForOrganizersSection;
