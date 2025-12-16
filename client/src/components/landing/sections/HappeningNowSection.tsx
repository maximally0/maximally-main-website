import { Radio, Zap } from "lucide-react";
import { HappeningNowCard } from "../HappeningNowCard";
import happeningNowData from "@/data/happeningNow.json";

export function HappeningNowSection() {
  const { happeningNow } = happeningNowData;

  if (!happeningNow || happeningNow.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 via-transparent to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.08)_0%,transparent_60%)]" />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
      
      <div className="absolute top-20 right-[10%] w-64 h-64 bg-red-500/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-20 left-[10%] w-48 h-48 bg-orange-500/10 rounded-full blur-[60px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/40">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="font-press-start text-[10px] sm:text-xs text-red-400 tracking-wider">
                LIVE UPDATES
              </span>
            </div>
          </div>
          <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl text-white mb-4">
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Happening Now
            </span>
          </h2>
          <p className="font-jetbrains text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            Don't miss these live opportunities from the Maximally ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
          {happeningNow.map((item, index) => (
            <div 
              key={item.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <HappeningNowCard
                id={item.id}
                type={item.type as "featured" | "closing-soon" | "new"}
                title={item.title}
                description={item.description}
                badge={item.badge}
                ctaText={item.ctaText}
                ctaUrl={item.ctaUrl}
                endDate={item.endDate}
                icon={item.icon}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
    </section>
  );
}

export default HappeningNowSection;
