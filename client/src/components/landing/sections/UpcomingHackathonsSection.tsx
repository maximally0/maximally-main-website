import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { HackathonCard } from "../HackathonCard";
import hackathonsData from "@/data/hackathons.json";

export function UpcomingHackathonsSection() {
  const { hackathons } = hackathonsData;
  const upcomingHackathons = hackathons.filter(h => h.status === "upcoming").slice(0, 6);

  return (
    <section className="py-20 sm:py-28 relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="font-press-start text-[10px] sm:text-xs text-purple-400 tracking-wider">
              UPCOMING EVENTS
            </span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <h2 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              Join The Next Wave
            </span>
          </h2>
          <p className="font-jetbrains text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            High-stakes hackathons designed for ambitious builders. 
            Pick your challenge and start building.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-14">
          {upcomingHackathons.map((hackathon) => (
            <HackathonCard
              key={hackathon.id}
              id={hackathon.id}
              name={hackathon.name}
              theme={hackathon.theme}
              startDate={hackathon.startDate}
              endDate={hackathon.endDate}
              prize={hackathon.prize}
              registrationUrl={hackathon.registrationUrl}
              tags={hackathon.tags}
              status={hackathon.status as "upcoming" | "ongoing" | "completed"}
              type={hackathon.type as "flagship" | "ai" | "security" | "creative" | "general" | "science"}
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/events"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600/20 to-purple-500/10 border border-purple-500/40 hover:border-purple-400 hover:from-purple-600/30 hover:to-purple-500/20 text-purple-300 hover:text-purple-200 font-press-start text-[10px] sm:text-xs transition-all duration-300"
            data-testid="button-view-all-hackathons"
          >
            <span>VIEW ALL HACKATHONS</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </section>
  );
}

export default UpcomingHackathonsSection;
