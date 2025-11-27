import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { ExploreCard } from "@/components/landing";
import exploreData from "@/data/exploreCards.json";

const Explore = () => {
  const { exploreCards } = exploreData;
  const activeCards = exploreCards.filter(c => c.status === "active");
  const comingSoonCards = exploreCards.filter(c => c.status === "coming-soon");

  return (
    <>
      <SEO
        title="Explore - Maximally"
        description="Explore everything Maximally has to offer - jobs, internships, community, resources, and more."
        keywords="hackathon resources, tech jobs, internships, developer community"
        canonicalUrl="https://maximally.in/explore"
      />

      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-jetbrains text-sm mb-8 transition-colors"
            data-testid="link-back-home"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h1 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-6">
                Explore{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Maximally
                </span>
              </h1>
              <p className="font-jetbrains text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
                Everything we're building around the hackathon ecosystem. 
                Jobs, community, resources, and more.
              </p>
            </div>

            <section className="mb-16">
              <h2 className="font-press-start text-sm sm:text-base text-blue-400 mb-6">
                AVAILABLE NOW
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
            </section>

            {comingSoonCards.length > 0 && (
              <section>
                <h2 className="font-press-start text-sm sm:text-base text-gray-500 mb-6">
                  COMING SOON
                </h2>
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
              </section>
            )}

            <div className="mt-16 p-8 bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 text-center">
              <h3 className="font-press-start text-sm sm:text-base text-white mb-4">
                Want to suggest something?
              </h3>
              <p className="font-jetbrains text-sm text-gray-400 mb-6 max-w-lg mx-auto">
                We're always looking for new ideas. If you have a suggestion for something 
                we should build, let us know!
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-press-start text-xs transition-all duration-200"
                data-testid="button-contact-suggestion"
              >
                SEND A SUGGESTION
              </Link>
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
