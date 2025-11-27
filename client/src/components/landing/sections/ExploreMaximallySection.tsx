import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ExploreCard } from "../ExploreCard";
import exploreData from "@/data/exploreCards.json";

export function ExploreMaximallySection() {
  const { exploreCards } = exploreData;
  const activeCards = exploreCards.filter(c => c.status === "active");
  const comingSoonCards = exploreCards.filter(c => c.status === "coming-soon");

  return (
    <section className="py-16 sm:py-24 relative bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05)_0%,transparent_50%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4">
            <span className="font-press-start text-xs sm:text-sm text-blue-400 bg-blue-500/10 border border-blue-500/30 px-4 py-2">
              EXPLORE
            </span>
          </div>
          <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-4">
            Explore Maximally
          </h2>
          <p className="font-jetbrains text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            All the other things we're building around the hackathon ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {activeCards.map((card) => (
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

        {comingSoonCards.length > 0 && (
          <>
            <div className="text-center mb-6 mt-12">
              <p className="font-press-start text-xs text-gray-500">COMING SOON</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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

        <div className="text-center mt-12">
          <Link
            to="/explore"
            className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-blue-500/50 hover:border-blue-400 hover:bg-blue-500/10 text-blue-400 hover:text-blue-300 font-press-start text-xs sm:text-sm transition-all duration-300 group"
            data-testid="button-explore-all"
          >
            <span>EXPLORE ALL</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ExploreMaximallySection;
