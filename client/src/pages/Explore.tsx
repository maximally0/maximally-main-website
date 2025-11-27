import { Link } from "react-router-dom";
import { ArrowLeft, Compass, Sparkles, Rocket, Lightbulb } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { ExploreCard } from "@/components/landing";
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

const Explore = () => {
  const { exploreCards } = exploreData as { exploreCards: ExploreCardData[] };
  const activeCards = exploreCards.filter(c => c.status === "active");
  const comingSoonCards = exploreCards.filter(c => c.status === "coming-soon");

  return (
    <>
      <SEO
        title="Explore - Maximally"
        description="Explore everything Maximally has to offer - blog, jobs, internships, community, resources, and more."
        keywords="hackathon resources, tech jobs, internships, developer community, blog"
        canonicalUrl="https://maximally.in/explore"
      />

      <div className="min-h-screen bg-black text-white pt-20 sm:pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.10)_0%,transparent_50%)]" />
        
        <div className="absolute top-20 left-[5%] w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-40 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />
        <div className="absolute bottom-60 left-[20%] w-72 h-72 bg-blue-500/10 rounded-full blur-[90px]" />
        <div className="absolute bottom-20 right-[15%] w-48 h-48 bg-cyan-500/10 rounded-full blur-[70px]" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <Link 
            to="/"
            className="group inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 font-jetbrains text-sm mb-8 transition-colors"
            data-testid="link-back-home"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30">
                  <Compass className="w-4 h-4 text-purple-400" />
                  <span className="font-press-start text-[10px] sm:text-xs text-purple-300 tracking-wider">
                    DISCOVER MORE
                  </span>
                </div>
              </div>
              <h1 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-6">
                Explore{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Maximally
                </span>
              </h1>
              <p className="font-jetbrains text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Everything we're building around the hackathon ecosystem. 
                Blog, jobs, community, resources, and more.
              </p>
            </div>

            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-purple-400" />
                  <h2 className="font-press-start text-sm sm:text-base text-purple-400">
                    AVAILABLE NOW
                  </h2>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-500/40 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
            </section>

            {comingSoonCards.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gray-500" />
                    <h2 className="font-press-start text-sm sm:text-base text-gray-500">
                      COMING SOON
                    </h2>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-700/40 to-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
              </section>
            )}

            <div className="relative p-8 sm:p-10 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 border border-purple-500/30 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]" />
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-purple-500/20 border border-purple-500/40">
                  <Lightbulb className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-press-start text-sm sm:text-base text-white mb-4">
                  Want to suggest something?
                </h3>
                <p className="font-jetbrains text-sm text-gray-400 mb-6 max-w-lg mx-auto leading-relaxed">
                  We're always looking for new ideas. If you have a suggestion for something 
                  we should build, let us know!
                </p>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/30 to-pink-500/20 border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-purple-200 font-press-start text-[10px] sm:text-xs transition-all duration-300"
                  data-testid="button-contact-suggestion"
                >
                  SEND A SUGGESTION
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Explore;
