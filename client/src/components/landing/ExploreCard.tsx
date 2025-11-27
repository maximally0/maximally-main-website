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
};

export function ExploreCard({
  id,
  title,
  description,
  icon,
  url,
  status,
  badge,
}: ExploreCardProps) {
  const Icon = iconMap[icon] || Rocket;
  const isExternal = url.startsWith("http");
  const isComingSoon = status === "coming-soon";

  const CardContent = () => (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className={`p-3 ${isComingSoon ? 'bg-gray-800' : 'bg-red-500/20'} border ${isComingSoon ? 'border-gray-700' : 'border-red-500/30'} group-hover:border-red-500/50 transition-colors`}>
            <Icon className={`w-6 h-6 ${isComingSoon ? 'text-gray-500' : 'text-red-500'}`} />
          </div>
          
          {badge && (
            <span className={`px-2 py-1 text-[10px] font-press-start ${
              badge === "Hiring" 
                ? "bg-green-500/20 text-green-400 border border-green-500/50" 
                : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
            }`}>
              {badge.toUpperCase()}
            </span>
          )}
        </div>
        
        <div>
          <h3 className={`font-press-start text-sm mb-2 ${isComingSoon ? 'text-gray-500' : 'text-white group-hover:text-red-400'} transition-colors`}>
            {title}
          </h3>
          <p className={`text-sm font-jetbrains ${isComingSoon ? 'text-gray-600' : 'text-gray-400'} line-clamp-2`}>
            {description}
          </p>
        </div>
        
        {!isComingSoon && (
          <div className="flex items-center gap-2 text-red-500 font-press-start text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            <span>EXPLORE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </>
  );

  const cardClasses = `group relative bg-gradient-to-br from-gray-900/80 via-black to-gray-900/80 border ${
    isComingSoon 
      ? 'border-gray-800 cursor-not-allowed' 
      : 'border-gray-800 hover:border-red-500/50 cursor-pointer'
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
