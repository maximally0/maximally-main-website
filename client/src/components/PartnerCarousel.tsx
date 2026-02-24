
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PartnerLogo {
  id: string;
  name: string;
  initials?: string;
  logoUrl?: string;
}

const partnerLogos: PartnerLogo[] = [
  { id: '1', name: 'NexFellow' },
  { id: '2', name: 'Not Building Alone' },
  { id: '3', name: 'Serentia.org' },
  { id: '4', name: 'Hack Club' },
  { id: '5', name: 'Content Collective' },
  { id: '6', name: 'Builder Startup Network' },
  { id: '7', name: 'Hack the Gujarat' },
];

const PartnerCarousel: React.FC = () => {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % partnerLogos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + partnerLogos.length) % partnerLogos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-red-950 to-black relative overflow-hidden">
      {/* Grid texture background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-space font-bold text-2xl sm:text-3xl md:text-4xl mb-4 text-white glitch-effect">
            Our Allies
          </h2>
          <p className="font-space text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            From IIT hack clubs to MUNs and small-town content collectives — these orgs are building with us.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-md mx-auto">
          {/* Main carousel */}
          <div 
            className="flex justify-center items-center min-h-[80px] relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-full flex justify-center">
              <div className={cn(
                "group cursor-pointer transition-all duration-300",
                "transform hover:scale-105"
              )}>
                <div className={cn(
                  "px-6 py-4 rounded-lg border-2 border-white/20",
                  "bg-gradient-to-br from-red-900/50 to-black/50",
                  "backdrop-blur-sm",
                  "shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]",
                  "group-hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.5)]",
                  "group-hover:-translate-y-1",
                  "group-hover:border-maximally-red/50",
                  "relative overflow-hidden"
                )}>
                  <span className="font-space text-white text-base sm:text-lg font-medium whitespace-nowrap block text-center">
                    {partnerLogos[currentIndex].name}
                  </span>

                  {/* Glitch effect overlay */}
                  <div className={cn(
                    "absolute inset-0 rounded-lg",
                    "bg-gradient-to-r from-gray-700/10 to-orange-500/10",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    "mix-blend-overlay"
                  )} />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons - desktop only */}
          {!isMobile && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 rounded-full bg-red-900/50 border border-white/20 text-white hover:bg-red-800/50 transition-all"
                aria-label="Previous partner"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 rounded-full bg-red-900/50 border border-white/20 text-white hover:bg-red-800/50 transition-all"
                aria-label="Next partner"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {partnerLogos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  currentIndex === index 
                    ? "bg-maximally-red scale-110" 
                    : "bg-white/30 hover:bg-white/50"
                )}
                aria-label={`Go to partner ${index + 1}`}
              />
            ))}
          </div>

          {/* Swipe instruction for mobile */}
          {isMobile && (
            <p className="text-center text-gray-400 text-sm mt-4 font-space">
              Swipe left or right to navigate
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PartnerCarousel;
