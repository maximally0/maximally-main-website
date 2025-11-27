import { HappeningNowCard } from "../HappeningNowCard";
import happeningNowData from "@/data/happeningNow.json";

export function HappeningNowSection() {
  const { happeningNow } = happeningNowData;

  if (!happeningNow || happeningNow.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 relative bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-block mb-4">
            <span className="font-press-start text-xs sm:text-sm text-red-500 bg-red-500/10 border border-red-500/30 px-4 py-2">
              HAPPENING NOW
            </span>
          </div>
          <h2 className="font-press-start text-lg sm:text-xl md:text-2xl text-white mb-4">
            Don't Miss Out
          </h2>
          <p className="font-jetbrains text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Live updates from the Maximally ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {happeningNow.map((item) => (
            <HappeningNowCard
              key={item.id}
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
          ))}
        </div>
      </div>
    </section>
  );
}

export default HappeningNowSection;
