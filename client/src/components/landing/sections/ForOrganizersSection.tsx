import { Link } from "react-router-dom";
import { ArrowRight, Building2, BookOpen, Users, Crown } from "lucide-react";

const organizerCards = [
  {
    icon: Building2,
    title: "Host With Maximally",
    description: "Partner with us to run your hackathon. We handle the tech, you bring the vision.",
    url: "/host-hackathon",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20"
  },
  {
    icon: BookOpen,
    title: "Join MFHOP",
    description: "Maximally For Hackathon Organizer Program - resources and support for event organizers.",
    url: "/mfhop",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20"
  },
  {
    icon: Users,
    title: "Judges & Mentors",
    description: "Access our network of industry experts to judge and mentor at your events.",
    url: "/judges",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20"
  },
];

export function ForOrganizersSection() {
  return (
    <section className="py-20 sm:py-24 relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-green-950/5 via-transparent to-amber-950/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(251,191,36,0.08)_0%,transparent_50%)]" />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      
      <div className="absolute bottom-20 right-[15%] w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="font-press-start text-[10px] sm:text-xs text-amber-400 tracking-wider">
              FOR ORGANIZERS
            </span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-4">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Run Better Events
            </span>
          </h2>
          <p className="font-jetbrains text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            Everything you need to host successful hackathons
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {organizerCards.map((card, index) => (
            <Link
              key={index}
              to={card.url}
              className="group p-6 sm:p-8 bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 hover:border-amber-500/40 transition-all duration-300"
              data-testid={`organizer-card-${index}`}
            >
              <div className={`p-4 ${card.bgColor} border ${card.borderColor} inline-block mb-5 group-hover:scale-110 transition-transform`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <h3 className="font-press-start text-xs sm:text-sm text-white mb-3 group-hover:text-amber-400 transition-colors">
                {card.title}
              </h3>
              <p className="font-jetbrains text-sm text-gray-400 mb-5 leading-relaxed">
                {card.description}
              </p>
              <div className="flex items-center gap-2 text-amber-500 font-press-start text-[10px] group-hover:translate-x-1 transition-transform">
                <span>LEARN MORE</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
    </section>
  );
}

export default ForOrganizersSection;
