import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";

interface FloatingPixel {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export function HeroSection() {
  const [floatingPixels, setFloatingPixels] = useState<FloatingPixel[]>([]);

  useEffect(() => {
    const pixels = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
      duration: Math.random() * 4 + 4,
    }));
    setFloatingPixels(pixels);
  }, []);

  return (
    <section className="min-h-screen relative flex items-center pt-24 sm:pt-32 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-purple-950/10" />
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      {floatingPixels.map((pixel) => (
        <div
          key={pixel.id}
          className="fixed bg-red-500 pointer-events-none animate-float opacity-40"
          style={{
            left: `${pixel.x}%`,
            top: `${pixel.y}%`,
            width: `${pixel.size}px`,
            height: `${pixel.size}px`,
            animationDelay: `${pixel.delay}s`,
            animationDuration: `${pixel.duration}s`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 sm:px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-press-start text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight px-2">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Welcome to the
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(239,68,68,0.5)]">
              Hackathon Universe.
            </span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto font-jetbrains leading-relaxed mb-8 sm:mb-12 px-4">
            High-energy hackathons and programs for ambitious builders. 
            Discover events, join challenges, and explore everything Maximally has to offer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <Link
              to="/events"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-press-start text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
              data-testid="button-explore-hackathons"
            >
              <span>EXPLORE HACKATHONS</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/explore"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-gray-600 hover:border-purple-500 text-gray-300 hover:text-white font-press-start text-xs sm:text-sm transition-all duration-300"
              data-testid="button-explore-everything"
            >
              <Compass className="w-5 h-5" />
              <span>EXPLORE EVERYTHING</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-red-500 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
