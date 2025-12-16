import { Calendar, Trophy, ArrowRight, Sparkles, Zap, Rocket, Code2, Brain, Shield, Palette, Globe, Users } from "lucide-react";

interface HackathonCardProps {
  id: string;
  name: string;
  theme: string;
  startDate: string;
  endDate: string;
  prize: string;
  registrationUrl: string;
  tags: string[];
  status: "upcoming" | "ongoing" | "completed";
  type?: "flagship" | "ai" | "security" | "creative" | "general" | "science";
}

const tagColors: Record<string, string> = {
  online: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  offline: "bg-green-500/20 text-green-400 border-green-500/50",
  hybrid: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  AI: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
  "beginner-friendly": "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
  intermediate: "bg-amber-500/20 text-amber-400 border-amber-500/50",
  advanced: "bg-red-500/20 text-red-400 border-red-500/50",
  flagship: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  science: "bg-indigo-500/20 text-indigo-400 border-indigo-500/50",
  security: "bg-rose-500/20 text-rose-400 border-rose-500/50",
  creative: "bg-pink-500/20 text-pink-400 border-pink-500/50",
  "all-levels": "bg-teal-500/20 text-teal-400 border-teal-500/50",
};

const typeStyles: Record<string, { gradient: string; icon: typeof Sparkles; accentColor: string; glowColor: string }> = {
  flagship: {
    gradient: "from-yellow-600/30 via-orange-600/20 to-red-600/30",
    icon: Sparkles,
    accentColor: "text-yellow-400",
    glowColor: "shadow-yellow-500/20",
  },
  ai: {
    gradient: "from-cyan-600/30 via-blue-600/20 to-purple-600/30",
    icon: Brain,
    accentColor: "text-cyan-400",
    glowColor: "shadow-cyan-500/20",
  },
  security: {
    gradient: "from-rose-600/30 via-red-600/20 to-orange-600/30",
    icon: Shield,
    accentColor: "text-rose-400",
    glowColor: "shadow-rose-500/20",
  },
  creative: {
    gradient: "from-pink-600/30 via-purple-600/20 to-indigo-600/30",
    icon: Palette,
    accentColor: "text-pink-400",
    glowColor: "shadow-pink-500/20",
  },
  science: {
    gradient: "from-indigo-600/30 via-blue-600/20 to-cyan-600/30",
    icon: Zap,
    accentColor: "text-indigo-400",
    glowColor: "shadow-indigo-500/20",
  },
  general: {
    gradient: "from-red-600/30 via-purple-600/20 to-blue-600/30",
    icon: Rocket,
    accentColor: "text-red-400",
    glowColor: "shadow-red-500/20",
  },
};

export function HackathonCard({
  id,
  name,
  theme,
  startDate,
  endDate,
  prize,
  registrationUrl,
  tags,
  status,
  type = "general",
}: HackathonCardProps) {
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startMonth = startDate.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const endMonth = endDate.toLocaleString("en-US", { month: "short" }).toUpperCase();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
    }
    return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${startDate.getFullYear()}`;
  };

  const style = typeStyles[type] || typeStyles.general;
  const IconComponent = style.icon;

  return (
    <div 
      className={`group relative bg-black border border-gray-800 hover:border-red-500/60 transition-all duration-500 overflow-hidden hover:shadow-xl ${style.glowColor}`}
      data-testid={`card-hackathon-${id}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-60`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
      
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} blur-2xl`} />
      </div>
      
      <div className="relative p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className={`p-3 bg-gradient-to-br ${style.gradient} border border-white/10`}>
            <IconComponent className={`w-6 h-6 ${style.accentColor}`} />
          </div>
          
          <div className="flex flex-wrap gap-1.5 justify-end">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`px-2 py-0.5 text-[9px] font-press-start border ${tagColors[tag] || "bg-gray-500/20 text-gray-400 border-gray-500/50"}`}
              >
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-press-start text-sm text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-relaxed">
            {name}
          </h3>
          <p className="text-gray-400 text-sm font-jetbrains line-clamp-2 leading-relaxed">
            {theme}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 text-xs font-jetbrains">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{formatDateRange(startDate, endDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            <span className="text-yellow-400 font-semibold">{prize}</span>
          </div>
        </div>
        
        <div className="pt-2">
          <a
            href={registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-press-start text-[10px] transition-all duration-300 group/btn shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
            data-testid={`button-register-${id}`}
          >
            <span>REGISTER NOW</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

export default HackathonCard;
