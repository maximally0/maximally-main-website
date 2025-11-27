import { Link } from "react-router-dom";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { ExploreCard } from "../ExploreCard";
import exploreData from "@/data/exploreCards.json";

export function ExploreMaximallySection() {
  const { exploreCards } = exploreData;
  const activeCards = exploreCards.filter(c => c.status === "active");
  const comingSoonCards = exploreCards.filter(c => c.status === "coming-soon");

  return (
    <section className="py-20 sm:py-28 relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08)_0%,transparent_50%)]" />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      
      <div className="absolute top-40 left-[5%] w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-40 right-[5%] w-60 h-60 bg-cyan-500/10 rounded-full blur-[80px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-6">
            <Compass className="w-4 h-4 text-blue-400" />
            <span className="font-press-start text-[10px] sm:text-xs text-blue-400 tracking-wider">
              DISCOVER MORE
            </span>
            <Compass className="w-4 h-4 text-blue-400" />
          </div>
          <h2 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Explore Maximally
            </span>
          </h2>
          <p className="font-jetbrains text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Everything we're building around the hackathon ecosystem. 
            Jobs, community, resources, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 mb-10">
          {activeCards.map((card, index) => (
            <div 
              key={card.id}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ExploreCard
                id={card.id}
                title={card.title}
                description={card.description}
                icon={card.icon}
                url={card.url}
                status={card.status as "active" | "coming-soon"}
                badge={card.badge}
              />
            </div>
          ))}
        </div>

        {comingSoonCards.length > 0 && (
          <>
            <div className="flex items-center justify-center gap-4 mb-8 mt-16">
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-gray-700" />
              <p className="font-press-start text-[10px] text-gray-500">COMING SOON</p>
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-gray-700" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {comingSoonCards.map((card) => (
                <ExploreCard
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  url={card.url}
                  status={card.status as "active" | "coming-soon"}
                  badge={card.badge}
                />
              ))}
            </div>
          </>
        )}

        <div className="text-center mt-14">
          <Link
            to="/explore"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600/20 to-cyan-500/10 border border-blue-500/40 hover:border-blue-400 hover:from-blue-600/30 hover:to-cyan-500/20 text-blue-300 hover:text-blue-200 font-press-start text-[10px] sm:text-xs transition-all duration-300"
            data-testid="button-explore-all"
          >
            <span>EXPLORE ALL</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
    </section>
  );
}

export default ExploreMaximallySection;
