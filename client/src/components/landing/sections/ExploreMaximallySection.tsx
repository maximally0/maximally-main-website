import { Link } from "react-router-dom";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { ExploreCard } from "../ExploreCard";
import exploreData from "@/data/exploreCards.json";

interface ExploreCardData {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string;
  status: string;
  badge: string | null;
  color?: string;
}

export function ExploreMaximallySection() {
  const { exploreCards } = exploreData as { exploreCards: ExploreCardData[] };
  const activeCards = exploreCards.filter(c => c.status === "active");
  const comingSoonCards = exploreCards.filter(c => c.status === "coming-soon");

  return (
    <section className="py-20 sm:py-28 relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.12)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.08)_0%,transparent_50%)]" />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      <div className="absolute top-20 left-[5%] w-72 h-72 bg-purple-500/15 rounded-full blur-[100px]" />
      <div className="absolute top-60 right-[10%] w-48 h-48 bg-pink-500/12 rounded-full blur-[80px]" />
      <div className="absolute bottom-40 left-[20%] w-60 h-60 bg-blue-500/10 rounded-full blur-[80px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30">
              <Compass className="w-4 h-4 text-purple-400" />
              <span className="font-press-start text-[10px] sm:text-xs text-purple-300 tracking-wider">
                DISCOVER MORE
              </span>
            </div>
          </div>
          <h2 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Explore Maximally
            </span>
          </h2>
          <p className="font-jetbrains text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Everything we're building around the hackathon ecosystem. 
            Blog, jobs, community, resources, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto mb-10">
          {activeCards.map((card, index) => (
            <div 
              key={card.id}
              className="animate-fade-in"
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
                color={card.color}
              />
            </div>
          ))}
        </div>

        {comingSoonCards.length > 0 && (
          <>
            <div className="flex items-center justify-center gap-4 mb-8 mt-16">
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-gray-700" />
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-gray-600" />
                <p className="font-press-start text-[10px] text-gray-500">COMING SOON</p>
                <Sparkles className="w-3 h-3 text-gray-600" />
              </div>
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-gray-700" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
              {comingSoonCards.map((card, index) => (
                <div 
                  key={card.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${(activeCards.length + index) * 50}ms` }}
                >
                  <ExploreCard
                    id={card.id}
                    title={card.title}
                    description={card.description}
                    icon={card.icon}
                    url={card.url}
                    status={card.status as "active" | "coming-soon"}
                    badge={card.badge}
                    color={card.color}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <div className="text-center mt-14">
          <Link
            to="/explore"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600/20 to-pink-500/10 border border-purple-500/40 hover:border-purple-400 hover:from-purple-600/30 hover:to-pink-500/20 text-purple-300 hover:text-purple-200 font-press-start text-[10px] sm:text-xs transition-all duration-300"
            data-testid="button-explore-all"
          >
            <span>EXPLORE ALL</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />
    </section>
  );
}

export default ExploreMaximallySection;
