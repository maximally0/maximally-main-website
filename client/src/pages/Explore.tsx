import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Users, Laptop, ArrowRight, Lightbulb } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const exploreTiles = [
  {
    id: "hackathons",
    title: "Hackathons",
    description: "Browse all open and upcoming hackathons. The core product.",
    icon: Trophy,
    url: "/events",
    color: "text-orange-400",
    borderColor: "border-orange-500/20",
    hoverBorder: "hover:border-orange-500/50",
  },
  {
    id: "senior-council",
    title: "Senior Council",
    description: "Operators selected for documented extraordinary achievement who evaluate Maximally programs.",
    icon: Users,
    url: "/senior-council",
    color: "text-white",
    borderColor: "border-gray-700",
    hoverBorder: "hover:border-gray-500",
  },
  {
    id: "platform",
    title: "Platform",
    description: "Host your own hackathon on the Maximally platform.",
    icon: Laptop,
    url: "/host-hackathon",
    color: "text-gray-300",
    borderColor: "border-gray-700",
    hoverBorder: "hover:border-gray-500",
  },
];

const Explore = () => {
  return (
    <>
      <SEO
        title="Explore — Builder Ecosystem | Maximally"
        description="Explore the Maximally ecosystem. Events, Senior Council operators, platform infrastructure, and builder tools."
        keywords="builder ecosystem, hackathons, Senior Council, platform tools, Maximally explore"
        keywords="builder ecosystem, hackathons, Senior Council, serious builders, explore"
        canonicalUrl="https://maximally.in/explore"
      />

      <div className="min-h-screen bg-black text-white pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 relative overflow-x-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Ambient orange glows */}
        <div className="absolute top-20 left-[5%] w-72 h-72 bg-orange-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-40 right-[10%] w-60 h-60 bg-gray-500/5 rounded-full blur-[80px]" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <Link 
            to="/"
            className="group inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 font-space text-sm mb-8 transition-colors"
            data-testid="link-back-home"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 sm:mb-20">
              <span className="font-space text-sm text-orange-400 tracking-wide font-medium mb-4 block">
                THE ECOSYSTEM
              </span>
              <h1 className="font-space text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5">
                Explore Maximally
              </h1>
              <p className="font-space text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Everything we're building. Each piece serves the ecosystem.
              </p>
            </div>

            {/* Tile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto mb-20">
              {exploreTiles.map((tile) => (
                <Link
                  key={tile.id}
                  to={tile.url}
                  className={`group relative p-6 sm:p-8 bg-gray-900/40 border ${tile.borderColor} ${tile.hoverBorder} transition-all duration-300`}
                  data-testid={`explore-tile-${tile.id}`}
                >
                  {tile.badge && (
                    <span className="absolute top-4 right-4 px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 text-orange-300 font-space text-[10px] font-medium">
                      {tile.badge}
                    </span>
                  )}
                  <div className="mb-5">
                    <tile.icon className={`w-7 h-7 ${tile.color}`} />
                  </div>
                  <h3 className={`font-space text-lg font-semibold mb-2 ${tile.color} group-hover:text-white transition-colors`}>
                    {tile.title}
                  </h3>
                  <p className="font-space text-sm text-gray-400 leading-relaxed mb-5">
                    {tile.description}
                  </p>
                  <div className="flex items-center gap-2 text-gray-500 group-hover:text-orange-400 font-space text-sm font-medium transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Suggestion CTA Section */}
            <div className="relative p-5 sm:p-8 md:p-10 bg-gray-900/40 border border-orange-500/20 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.05)_0%,transparent_70%)]" />
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 bg-orange-500/20 border border-orange-500/30">
                  <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                </div>
                <h3 className="font-space text-base sm:text-lg md:text-xl font-semibold text-white mb-3 sm:mb-4">
                  Want to suggest something?
                </h3>
                <p className="font-space text-sm text-gray-400 mb-5 sm:mb-6 max-w-lg mx-auto leading-relaxed">
                  We're always looking for new ideas. If you have a suggestion for something we should build, let us know!
                </p>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                  data-testid="button-contact-suggestion"
                >
                  <span>Send a Suggestion</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
