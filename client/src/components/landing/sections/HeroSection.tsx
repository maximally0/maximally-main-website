import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Zap, Code2, Rocket } from "lucide-react";

interface FloatingPixel {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

export function HeroSection() {
  const [floatingPixels, setFloatingPixels] = useState<FloatingPixel[]>([]);

  useEffect(() => {
    const colors = ["bg-red-500", "bg-purple-500", "bg-cyan-500", "bg-yellow-500"];
    const pixels = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 6 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setFloatingPixels(pixels);
  }, []);

  return (
    <section className="min-h-screen relative flex items-center pt-20 sm:pt-28 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:60px_60px]" />
      
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-purple-950/20" />
      
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-500/15 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 left-1/3 w-[350px] h-[350px] bg-yellow-500/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '3s' }} />
      
      {floatingPixels.map((pixel) => (
        <div
          key={pixel.id}
          className={`absolute ${pixel.color} pointer-events-none animate-float opacity-30`}
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
      
      <div className="absolute top-40 left-[10%] opacity-20 animate-pulse">
        <Code2 className="w-12 h-12 text-cyan-500" />
      </div>
      <div className="absolute top-60 right-[15%] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}>
        <Zap className="w-10 h-10 text-yellow-500" />
      </div>
      <div className="absolute bottom-40 left-[20%] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}>
        <Rocket className="w-14 h-14 text-red-500" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="font-press-start text-[10px] text-red-400 tracking-wider">
              THE GLOBAL HACKATHON LEAGUE
            </span>
          </div>
          
          <h1 className="font-press-start text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 sm:mb-10 leading-tight px-2">
            <span className="block bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Welcome to the
            </span>
            <span className="block mt-2 sm:mt-4 bg-gradient-to-r from-red-500 via-orange-500 to-red-400 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(239,68,68,0.6)]">
              Hackathon
            </span>
            <span className="block mt-2 sm:mt-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(168,85,247,0.6)]">
              Universe.
            </span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto font-jetbrains leading-relaxed mb-10 sm:mb-14 px-4">
            High-energy hackathons and programs for ambitious builders. 
            Discover events, join challenges, and explore everything Maximally has to offer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <Link
              to="/events"
              className="group flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:via-red-400 hover:to-orange-400 text-white font-press-start text-[10px] sm:text-xs transition-all duration-300 shadow-xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02]"
              data-testid="button-explore-hackathons"
            >
              <span>EXPLORE HACKATHONS</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/explore"
              className="group flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-gray-600 hover:border-purple-500 hover:from-purple-900/30 hover:to-gray-800 text-gray-300 hover:text-white font-press-start text-[10px] sm:text-xs transition-all duration-300"
              data-testid="button-explore-everything"
            >
              <Compass className="w-5 h-5" />
              <span>EXPLORE EVERYTHING</span>
            </Link>
          </div>
          
          <div className="mt-16 sm:mt-20 flex flex-wrap justify-center gap-8 sm:gap-12 text-center">
            <div className="group">
              <div className="font-press-start text-2xl sm:text-3xl text-red-400 mb-2 group-hover:scale-110 transition-transform">
                50+
              </div>
              <div className="font-jetbrains text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                Hackathons
              </div>
            </div>
            <div className="group">
              <div className="font-press-start text-2xl sm:text-3xl text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                10K+
              </div>
              <div className="font-jetbrains text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                Builders
              </div>
            </div>
            <div className="group">
              <div className="font-press-start text-2xl sm:text-3xl text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
                $500K+
              </div>
              <div className="font-jetbrains text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                In Prizes
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-gradient-to-b from-red-500 to-purple-500 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
