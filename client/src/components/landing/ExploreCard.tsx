import { 
  Briefcase, 
  Users, 
  FlaskConical, 
  GraduationCap, 
  Rocket, 
  MessageCircle, 
  BookOpen, 
  Calendar,
  ArrowRight,
  Award,
  Lightbulb,
  LucideIcon
} from "lucide-react";
import { Link } from "react-router-dom";

interface ExploreCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string;
  status: "active" | "coming-soon";
  badge?: string | null;
  color?: string;
}

const iconMap: Record<string, LucideIcon> = {
  "briefcase": Briefcase,
  "users": Users,
  "flask": FlaskConical,
  "graduation-cap": GraduationCap,
  "rocket": Rocket,
  "message-circle": MessageCircle,
  "book-open": BookOpen,
  "calendar": Calendar,
  "award": Award,
  "lightbulb": Lightbulb,
};

const colorStyles: Record<string, { icon: string; border: string; glow: string; badge: string; text: string }> = {
  purple: {
    icon: "bg-purple-500/20 border-purple-500/30 group-hover:border-purple-400",
    border: "hover:border-purple-500/50",
    glow: "from-purple-500/10 to-pink-500/10",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/50",
    text: "text-purple-400",
  },
  blue: {
    icon: "bg-blue-500/20 border-blue-500/30 group-hover:border-blue-400",
    border: "hover:border-blue-500/50",
    glow: "from-blue-500/10 to-cyan-500/10",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/50",
    text: "text-blue-400",
  },
  green: {
    icon: "bg-green-500/20 border-green-500/30 group-hover:border-green-400",
    border: "hover:border-green-500/50",
    glow: "from-green-500/10 to-emerald-500/10",
    badge: "bg-green-500/20 text-green-300 border-green-500/50",
    text: "text-green-400",
  },
  cyan: {
    icon: "bg-cyan-500/20 border-cyan-500/30 group-hover:border-cyan-400",
    border: "hover:border-cyan-500/50",
    glow: "from-cyan-500/10 to-blue-500/10",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/50",
    text: "text-cyan-400",
  },
  orange: {
    icon: "bg-orange-500/20 border-orange-500/30 group-hover:border-orange-400",
    border: "hover:border-orange-500/50",
    glow: "from-orange-500/10 to-yellow-500/10",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/50",
    text: "text-orange-400",
  },
  red: {
    icon: "bg-red-500/20 border-red-500/30 group-hover:border-red-400",
    border: "hover:border-red-500/50",
    glow: "from-red-500/10 to-orange-500/10",
    badge: "bg-red-500/20 text-red-300 border-red-500/50",
    text: "text-red-400",
  },
  pink: {
    icon: "bg-pink-500/20 border-pink-500/30 group-hover:border-pink-400",
    border: "hover:border-pink-500/50",
    glow: "from-pink-500/10 to-purple-500/10",
    badge: "bg-pink-500/20 text-pink-300 border-pink-500/50",
    text: "text-pink-400",
  },
  indigo: {
    icon: "bg-indigo-500/20 border-indigo-500/30 group-hover:border-indigo-400",
    border: "hover:border-indigo-500/50",
    glow: "from-indigo-500/10 to-purple-500/10",
    badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/50",
    text: "text-indigo-400",
  },
  yellow: {
    icon: "bg-yellow-500/20 border-yellow-500/30 group-hover:border-yellow-400",
    border: "hover:border-yellow-500/50",
    glow: "from-yellow-500/10 to-orange-500/10",
    badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
    text: "text-yellow-400",
  },
  amber: {
    icon: "bg-amber-500/20 border-amber-500/30 group-hover:border-amber-400",
    border: "hover:border-amber-500/50",
    glow: "from-amber-500/10 to-yellow-500/10",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/50",
    text: "text-amber-400",
  },
};

export function ExploreCard({
  id,
  title,
  description,
  icon,
  url,
  status,
  badge,
  color = "red",
}: ExploreCardProps) {
  const Icon = iconMap[icon] || Rocket;
  const isExternal = url.startsWith("http");
  const isComingSoon = status === "coming-soon";
  const styles = colorStyles[color] || colorStyles.red;

  const CardContent = () => (
    <div className="relative h-full overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
      
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${styles.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      
      <div className="relative p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 h-full flex flex-col min-h-[140px] sm:min-h-[160px]">
        <div className="flex items-start justify-between gap-2">
          <div className={`p-2.5 sm:p-3 ${isComingSoon ? 'bg-gray-800 border-gray-700' : styles.icon} border transition-colors`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isComingSoon ? 'text-gray-500' : styles.text}`} />
          </div>
          
          {badge && (
            <span className={`px-2 py-1 text-[10px] sm:text-[11px] font-press-start border whitespace-nowrap ${
              badge === "Hiring" 
                ? "bg-green-500/20 text-green-400 border-green-500/50" 
                : badge === "New Posts" || badge === "New"
                ? styles.badge
                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
            }`}>
              {badge.toUpperCase()}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-press-start text-[11px] sm:text-xs md:text-sm mb-2 ${isComingSoon ? 'text-gray-500' : `text-white group-hover:${styles.text}`} transition-colors leading-relaxed`}>
            {title}
          </h3>
          <p className={`text-xs sm:text-sm font-jetbrains ${isComingSoon ? 'text-gray-600' : 'text-gray-400'} line-clamp-2 leading-relaxed`}>
            {description}
          </p>
        </div>
        
        {!isComingSoon && (
          <div className={`flex items-center gap-2 ${styles.text} font-press-start text-[10px] sm:text-[11px] opacity-0 group-hover:opacity-100 sm:transition-opacity mt-auto`}>
            <span>EXPLORE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </div>
  );

  const cardClasses = `group relative h-full bg-gradient-to-br from-gray-900/80 via-black to-gray-900/80 border ${
    isComingSoon 
      ? 'border-gray-800/60 cursor-not-allowed opacity-60' 
      : `border-gray-800 ${styles.border} cursor-pointer`
  } transition-all duration-300 overflow-hidden`;

  if (isComingSoon) {
    return (
      <div className={cardClasses} data-testid={`card-explore-${id}`}>
        <CardContent />
      </div>
    );
  }

  if (isExternal) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClasses}
        data-testid={`card-explore-${id}`}
      >
        <CardContent />
      </a>
    );
  }

  return (
    <Link to={url} className={cardClasses} data-testid={`card-explore-${id}`}>
      <CardContent />
    </Link>
  );
}

export default ExploreCard;
