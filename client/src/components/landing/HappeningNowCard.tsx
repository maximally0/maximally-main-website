import { Rocket, Clock, Sparkles, ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface HappeningNowCardProps {
  id: string;
  type: "featured" | "closing-soon" | "new";
  title: string;
  description: string;
  badge: string;
  ctaText: string;
  ctaUrl: string;
  endDate?: string | null;
  icon: string;
}

const iconMap: Record<string, LucideIcon> = {
  rocket: Rocket,
  clock: Clock,
  sparkles: Sparkles,
};

const typeStyles: Record<string, { gradient: string; border: string; badgeBg: string }> = {
  featured: {
    gradient: "from-red-900/40 via-red-900/20 to-transparent",
    border: "border-red-500/50 hover:border-red-400",
    badgeBg: "bg-red-500",
  },
  "closing-soon": {
    gradient: "from-amber-900/40 via-amber-900/20 to-transparent",
    border: "border-amber-500/50 hover:border-amber-400",
    badgeBg: "bg-amber-500",
  },
  new: {
    gradient: "from-purple-900/40 via-purple-900/20 to-transparent",
    border: "border-purple-500/50 hover:border-purple-400",
    badgeBg: "bg-purple-500",
  },
};

export function HappeningNowCard({
  id,
  type,
  title,
  description,
  badge,
  ctaText,
  ctaUrl,
  endDate,
  icon,
}: HappeningNowCardProps) {
  const Icon = iconMap[icon] || Rocket;
  const styles = typeStyles[type] || typeStyles.featured;
  const isExternal = ctaUrl.startsWith("http");

  const calculateTimeRemaining = () => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours} hour${hours > 1 ? 's' : ''} left`;
  };

  const timeRemaining = calculateTimeRemaining();

  const CardContent = () => (
    <div className={`group relative bg-gradient-to-br from-gray-900/90 via-black to-gray-900/90 border ${styles.border} transition-all duration-300 overflow-hidden p-6`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${styles.gradient} opacity-50`} />
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-white/5 to-transparent" />
      
      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 ${styles.badgeBg}/20 border border-current/30`}>
              <Icon className="w-5 h-5" style={{ color: type === 'featured' ? '#ef4444' : type === 'closing-soon' ? '#f59e0b' : '#a855f7' }} />
            </div>
            <span className={`px-2.5 py-1 text-[10px] font-press-start text-black ${styles.badgeBg}`}>
              {badge.toUpperCase()}
            </span>
          </div>
          
          {timeRemaining && (
            <span className="text-[10px] font-jetbrains text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeRemaining}
            </span>
          )}
        </div>
        
        <div>
          <h3 className="font-press-start text-sm text-white mb-2 group-hover:text-red-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm font-jetbrains text-gray-400 line-clamp-2">
            {description}
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-white font-press-start text-xs group-hover:text-red-400 transition-colors">
          <span>{ctaText.toUpperCase()}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-testid={`card-happening-${id}`}
      >
        <CardContent />
      </a>
    );
  }

  return (
    <Link to={ctaUrl} data-testid={`card-happening-${id}`}>
      <CardContent />
    </Link>
  );
}

export default HappeningNowCard;
