import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="min-h-screen relative flex items-center pt-20 sm:pt-28 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="absolute inset-0 bg-gradient-to-br from-orange-950/15 via-transparent to-gray-950/20" />
      
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-orange-500/8 rounded-full blur-[200px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-gray-500/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          <h1 className="font-space text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 sm:mb-10 leading-[1.1] tracking-tight px-2">
            <span className="block text-white">
              The world's most serious
            </span>
            <span className="block mt-2 sm:mt-3 bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              builder ecosystem.
            </span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-space leading-relaxed mb-10 sm:mb-14 px-4">
            Where extraordinary operators, builders, and innovators converge. Not the largest. The best.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center px-4">
            <a
              href="#explore"
              className="group flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02]"
              data-testid="button-join-ecosystem"
            >
              <span>Join the Ecosystem</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              to="/partner"
              className="group flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-transparent border border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-space text-sm sm:text-base font-semibold transition-all duration-300"
              data-testid="button-partner-with-us"
            >
              <span>Partner With Us</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
