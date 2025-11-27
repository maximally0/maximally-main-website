import { 
  Palette, 
  Zap, 
  Heart, 
  Award, 
  Users, 
  Lightbulb 
} from "lucide-react";

const reasons = [
  {
    icon: Palette,
    title: "Creative Themes",
    description: "Not your typical hackathons. Each event has a unique, exciting theme."
  },
  {
    icon: Zap,
    title: "High-Energy Formats",
    description: "Fast-paced challenges designed to push your limits and skills."
  },
  {
    icon: Heart,
    title: "Beginner-Friendly",
    description: "Whether you're new or experienced, there's a place for you here."
  },
  {
    icon: Award,
    title: "Real Judges",
    description: "Industry experts from top companies who provide genuine feedback."
  },
  {
    icon: Users,
    title: "Builder Community",
    description: "Join a thriving network of ambitious creators and innovators."
  },
  {
    icon: Lightbulb,
    title: "Innovation-First",
    description: "We celebrate bold ideas and unconventional solutions."
  }
];

export function WhyMaximallySection() {
  return (
    <section className="py-16 sm:py-24 relative bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4">
            <span className="font-press-start text-xs sm:text-sm text-green-400 bg-green-500/10 border border-green-500/30 px-4 py-2">
              WHY US
            </span>
          </div>
          <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-4">
            Why Maximally?
          </h2>
          <p className="font-jetbrains text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            We make building fun, competitive, and meaningful.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className="group p-6 bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 hover:border-green-500/30 transition-all duration-300"
              data-testid={`reason-${index}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-500/10 border border-green-500/20 group-hover:border-green-500/40 transition-colors">
                  <reason.icon className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="font-press-start text-xs sm:text-sm text-white">
                  {reason.title}
                </h3>
              </div>
              <p className="font-jetbrains text-sm text-gray-400">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyMaximallySection;
