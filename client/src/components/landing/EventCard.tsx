import { Link } from "react-router-dom";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Trophy, 
  ExternalLink,
  Code,
  Users,
  GraduationCap,
  Coffee,
  Rocket,
  Presentation,
  Sparkles,
  Building
} from "lucide-react";

interface EventCardProps {
  id: string;
  name: string;
  description: string;
  type: "hackathon" | "conference" | "workshop" | "meetup" | "bootcamp" | "demo-day";
  startDate: string;
  endDate: string;
  location: string;
  format: "online" | "in-person" | "hybrid";
  prizes?: string | null;
  tags: string[];
  registerUrl: string;
  featured?: boolean;
  status: "upcoming" | "ongoing" | "completed";
  organizer?: string;
  isMaximallyOfficial?: boolean;
  onClick?: () => void;
}

const typeStyles: Record<string, {
  gradient: string;
  border: string;
  glow: string;
  badge: string;
  icon: string;
}> = {
  hackathon: {
    gradient: "from-gray-800/20 via-blue-500/20 to-gray-900/20",
    border: "border-gray-800",
    glow: "shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    badge: "bg-gray-800 text-gray-300 border border-gray-800",
    icon: "text-gray-300"
  },
  conference: {
    gradient: "from-gray-900/20 via-gray-900/20 to-rose-500/20",
    border: "border-orange-500/30",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    badge: "bg-orange-500/10 text-orange-400 border border-orange-500/30",
    icon: "text-orange-400"
  },
  workshop: {
    gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
    border: "border-green-500/40",
    glow: "shadow-[0_0_30px_rgba(34,197,94,0.15)]",
    badge: "bg-green-500/20 text-green-300 border border-green-500/40",
    icon: "text-green-400"
  },
  meetup: {
    gradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
    border: "border-orange-500/40",
    glow: "shadow-[0_0_30px_rgba(249,115,22,0.15)]",
    badge: "bg-orange-500/20 text-orange-300 border border-orange-500/40",
    icon: "text-orange-400"
  },
  bootcamp: {
    gradient: "from-rose-500/20 via-red-500/20 to-orange-500/20",
    border: "border-rose-500/40",
    glow: "shadow-[0_0_30px_rgba(244,63,94,0.15)]",
    badge: "bg-rose-500/20 text-rose-300 border border-rose-500/40",
    icon: "text-rose-400"
  },
  "demo-day": {
    gradient: "from-indigo-500/20 via-blue-500/20 to-gray-800/20",
    border: "border-indigo-500/40",
    glow: "shadow-[0_0_30px_rgba(99,102,241,0.15)]",
    badge: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40",
    icon: "text-indigo-400"
  }
};

const typeIcons: Record<string, typeof Code> = {
  hackathon: Code,
  conference: Users,
  workshop: GraduationCap,
  meetup: Coffee,
  bootcamp: Rocket,
  "demo-day": Presentation
};

const typeLabels: Record<string, string> = {
  hackathon: "Hackathon",
  conference: "Conference",
  workshop: "Workshop",
  meetup: "Meetup",
  bootcamp: "Bootcamp",
  "demo-day": "Demo Day"
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric",
    year: "numeric"
  });
};

const getDateRange = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  if (startDate.toDateString() === endDate.toDateString()) {
    return formatDate(start);
  }
  
  const startMonth = startDate.toLocaleDateString("en-US", { month: "short" });
  const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDate.getDate()}-${endDate.getDate()}, ${endDate.getFullYear()}`;
  }
  
  return `${formatDate(start)} - ${formatDate(end)}`;
};

export function EventCard({
  id,
  name,
  description,
  type,
  startDate,
  endDate,
  location,
  format,
  prizes,
  tags,
  registerUrl,
  featured,
  status,
  organizer,
  isMaximallyOfficial,
  onClick
}: EventCardProps) {
  const styles = typeStyles[type] || typeStyles.hackathon;
  const TypeIcon = typeIcons[type] || Code;
  const typeLabel = typeLabels[type] || "Event";

  const statusColors: Record<string, string> = {
    upcoming: "bg-green-500/20 text-green-300 border-green-500/40",
    ongoing: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    completed: "bg-gray-500/20 text-gray-400 border-gray-500/40"
  };

  const formatColors: Record<string, string> = {
    online: "bg-blue-500/20 text-blue-300",
    "in-person": "bg-orange-500/10 text-orange-400",
    hybrid: "bg-orange-500/10 text-orange-400"
  };

  const cardContent = (
    <>
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-black/30 border ${styles.border}`}>
              <TypeIcon className={`w-5 h-5 ${styles.icon}`} />
            </div>
            <div>
              <span className={`inline-block px-2 py-0.5 text-[10px] font-space font-bold ${styles.badge}`}>
                {typeLabel.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {featured && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-[10px] font-space font-bold">
                <Sparkles className="w-3 h-3" />
                FEATURED
              </span>
            )}
            <span className={`px-2 py-0.5 border text-[10px] font-space font-bold uppercase ${statusColors[status]}`}>
              {status}
            </span>
          </div>
        </div>

        <h3 className="font-space font-bold text-sm sm:text-base text-white mb-2 group-hover:text-orange-400 transition-colors leading-tight">
          {name}
        </h3>
        
        <p className="font-space text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap gap-3 mb-4 text-xs font-space text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span>{getDateRange(startDate, endDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>{location}</span>
          </div>
          {prizes && (
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>{prizes}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-0.5 text-[10px] font-space capitalize ${formatColors[format]}`}>
            {format}
          </span>
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] font-space text-gray-400"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] font-space text-gray-500">
              +{tags.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          {organizer && (
            <div className="flex items-center gap-1.5 text-xs font-space text-gray-500">
              <Building className="w-3 h-3" />
              <span>{organizer}</span>
              {isMaximallyOfficial && (
                <span className="ml-1 px-1.5 py-0.5 bg-orange-500/10 text-orange-400 border border-gray-800 text-[8px] font-space font-bold">
                  OFFICIAL
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-1 text-orange-400 group-hover:text-orange-400 font-space font-bold text-[10px]">
            <span>VIEW</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </>
  );

  const cardClassName = `group block relative overflow-hidden bg-gradient-to-br ${styles.gradient} border ${styles.border} ${styles.glow} hover:scale-[1.02] transition-all duration-300 cursor-pointer`;

  if (onClick) {
    return (
      <div
        onClick={onClick}
        className={cardClassName}
        data-testid={`event-card-${id}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick();
          }
        }}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      to={registerUrl}
      className={cardClassName}
      data-testid={`event-card-${id}`}
    >
      {cardContent}
    </Link>
  );
}

export default EventCard;
