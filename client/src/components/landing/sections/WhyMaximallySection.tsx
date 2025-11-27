import { 
  Palette, 
  Zap, 
  Heart, 
  Award, 
  Users, 
  Lightbulb,
  Star
} from "lucide-react";

const reasons = [
  {
    icon: Palette,
    title: "Creative Themes",
    description: "Not your typical hackathons. Each event has a unique, exciting theme.",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    hoverBorder: "hover:border-pink-500/50"
  },
  {
    icon: Zap,
    title: "High-Energy Formats",
    description: "Fast-paced challenges designed to push your limits and skills.",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    hoverBorder: "hover:border-yellow-500/50"
  },
  {
    icon: Heart,
    title: "Beginner-Friendly",
    description: "Whether you're new or experienced, there's a place for you here.",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    hoverBorder: "hover:border-red-500/50"
  },
  {
    icon: Award,
    title: "Real Judges",
    description: "Industry experts from top companies who provide genuine feedback.",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    hoverBorder: "hover:border-cyan-500/50"
  },
  {
    icon: Users,
    title: "Builder Community",
    description: "Join a thriving network of ambitious creators and innovators.",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    hoverBorder: "hover:border-purple-500/50"
  },
  {
    icon: Lightbulb,
    title: "Innovation-First",
    description: "We celebrate bold ideas and unconventional solutions.",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    hoverBorder: "hover:border-green-500/50"
  }
];

export function WhyMaximallySection() {
  return (
    <section className="py-20 sm:py-28 relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
      
      <div className="absolute top-40 right-[10%] w-72 h-72 bg-green-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-40 left-[10%] w-60 h-60 bg-emerald-500/10 rounded-full blur-[80px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-6">
            <Star className="w-4 h-4 text-green-400" />
            <span className="font-press-start text-[10px] sm:text-xs text-green-400 tracking-wider">
              THE DIFFERENCE
            </span>
            <Star className="w-4 h-4 text-green-400" />
          </div>
          <h2 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
              Why Maximally?
            </span>
          </h2>
          <p className="font-jetbrains text-sm sm:text-base md:text-lg text-gray-400 max-w-xl mx-auto">
            We make building fun, competitive, and meaningful.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className={`group p-6 sm:p-8 bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 ${reason.hoverBorder} transition-all duration-300`}
              data-testid={`reason-${index}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 ${reason.bgColor} border ${reason.borderColor} group-hover:scale-110 transition-transform`}>
                  <reason.icon className={`w-5 h-5 ${reason.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-press-start text-xs sm:text-sm text-white mb-3">
                    {reason.title}
                  </h3>
                  <p className="font-jetbrains text-sm text-gray-400 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
    </section>
  );
}

export default WhyMaximallySection;
