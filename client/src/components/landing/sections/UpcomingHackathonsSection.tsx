import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HackathonCard } from "../HackathonCard";
import hackathonsData from "@/data/hackathons.json";

export function UpcomingHackathonsSection() {
  const { hackathons } = hackathonsData;
  const upcomingHackathons = hackathons.filter(h => h.status === "upcoming").slice(0, 6);

  return (
    <section className="py-16 sm:py-24 relative bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4">
            <span className="font-press-start text-xs sm:text-sm text-purple-400 bg-purple-500/10 border border-purple-500/30 px-4 py-2">
              HACKATHONS
            </span>
          </div>
          <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-4">
            Upcoming Events
          </h2>
          <p className="font-jetbrains text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Join the next wave of high-stakes hackathons. Build, compete, and win.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {upcomingHackathons.map((hackathon) => (
            <HackathonCard
              key={hackathon.id}
              id={hackathon.id}
              name={hackathon.name}
              theme={hackathon.theme}
              startDate={hackathon.startDate}
              endDate={hackathon.endDate}
              prize={hackathon.prize}
              posterUrl={hackathon.posterUrl}
              registrationUrl={hackathon.registrationUrl}
              tags={hackathon.tags}
              status={hackathon.status as "upcoming" | "ongoing" | "completed"}
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 text-purple-400 hover:text-purple-300 font-press-start text-xs sm:text-sm transition-all duration-300 group"
            data-testid="button-view-all-hackathons"
          >
            <span>VIEW ALL HACKATHONS</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default UpcomingHackathonsSection;
