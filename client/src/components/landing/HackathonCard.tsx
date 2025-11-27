import { Calendar, MapPin, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HackathonCardProps {
  id: string;
  name: string;
  theme: string;
  startDate: string;
  endDate: string;
  prize: string;
  posterUrl?: string;
  registrationUrl: string;
  tags: string[];
  status: "upcoming" | "ongoing" | "completed";
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

export function HackathonCard({
  id,
  name,
  theme,
  startDate,
  endDate,
  prize,
  posterUrl,
  registrationUrl,
  tags,
  status,
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

  return (
    <div 
      className="group relative bg-gradient-to-br from-gray-900/80 via-black to-gray-900/80 border border-gray-800 hover:border-red-500/50 transition-all duration-300 overflow-hidden"
      data-testid={`card-hackathon-${id}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative aspect-video bg-gradient-to-br from-red-900/20 to-purple-900/20 overflow-hidden">
        {posterUrl ? (
          <img 
            src={posterUrl} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl font-press-start text-red-500/30">
              {name.charAt(0)}
            </div>
          </div>
        )}
        
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={`px-2 py-0.5 text-[10px] font-press-start border ${tagColors[tag] || "bg-gray-500/20 text-gray-400 border-gray-500/50"}`}
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
      
      <div className="relative p-5 space-y-4">
        <div>
          <h3 className="font-press-start text-sm text-white group-hover:text-red-400 transition-colors mb-2 line-clamp-1">
            {name}
          </h3>
          <p className="text-gray-400 text-sm font-jetbrains line-clamp-2">
            {theme}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-jetbrains">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-red-500" />
            <span>{formatDateRange(startDate, endDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-yellow-400">{prize}</span>
          </div>
        </div>
        
        <a
          href={registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-500 text-white font-press-start text-xs transition-all duration-200 group/btn"
          data-testid={`button-register-${id}`}
        >
          <span>REGISTER</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}

export default HackathonCard;
