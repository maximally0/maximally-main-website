import { 
  Calendar, 
  MapPin, 
  Trophy, 
  ExternalLink,
  Zap,
  Building
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { getHackathonDisplayState, type HackathonDisplayState } from '@shared/hackathonState';

interface HackathonEvent {
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
  status?: string | null;
  hackathon_status?: string | null;
  organizer?: string;
  isMaximallyOfficial?: boolean;
}

interface HackathonDetailSheetProps {
  hackathon: HackathonEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { 
    weekday: "long",
    month: "long", 
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
  
  const startMonth = startDate.toLocaleDateString("en-US", { month: "long" });
  const endMonth = endDate.toLocaleDateString("en-US", { month: "long" });
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDate.getDate()}-${endDate.getDate()}, ${endDate.getFullYear()}`;
  }
  
  return `${formatDate(start)} - ${formatDate(end)}`;
};

const getDurationDays = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 0 ? 1 : diffDays + 1;
};

export function HackathonDetailSheet({ hackathon, isOpen, onClose }: HackathonDetailSheetProps) {
  if (!hackathon) return null;

  // Use simplified state logic - only 'draft', 'live', or 'ended'
  const displayState: HackathonDisplayState = getHackathonDisplayState({
    status: hackathon.status || null,
    hackathon_status: hackathon.hackathon_status,
    end_date: hackathon.endDate,
  });

  const statusColors: Record<HackathonDisplayState, string> = {
    draft: "bg-gray-500/20 text-gray-400 border-gray-500/40",
    live: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    ended: "bg-gray-500/20 text-gray-400 border-gray-500/40"
  };

  const statusLabels: Record<HackathonDisplayState, string> = {
    draft: "DRAFT",
    live: "LIVE",
    ended: "ENDED"
  };

  const formatColors: Record<string, string> = {
    online: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    "in-person": "bg-purple-500/20 text-purple-300 border-purple-500/40",
    hybrid: "bg-pink-500/20 text-pink-300 border-pink-500/40"
  };

  const durationDays = getDurationDays(hackathon.startDate, hackathon.endDate);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-lg bg-black border-l border-purple-500/30 p-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-black to-cyan-950/20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
        
        <ScrollArea className="h-full relative z-10">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 border text-[10px] font-press-start uppercase ${statusColors[displayState]}`}>
                  {statusLabels[displayState]}
                </span>
                <span className={`px-2 py-1 border text-[10px] font-jetbrains capitalize ${formatColors[hackathon.format]}`}>
                  {hackathon.format}
                </span>
                {hackathon.featured && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-[10px] font-press-start flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    FEATURED
                  </span>
                )}
              </div>
              <SheetTitle className="font-press-start text-lg sm:text-xl text-white leading-tight text-left">
                {hackathon.name}
              </SheetTitle>
              <SheetDescription className="font-jetbrains text-sm text-gray-400 mt-2 text-left leading-relaxed">
                {hackathon.description}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 p-4">
                <h3 className="font-press-start text-xs text-purple-300 mb-3">EVENT DETAILS</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-jetbrains text-sm text-white">{getDateRange(hackathon.startDate, hackathon.endDate)}</p>
                      <p className="font-jetbrains text-xs text-gray-500">{durationDays} day{durationDays > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                    <p className="font-jetbrains text-sm text-white">{hackathon.location}</p>
                  </div>
                  
                  {hackathon.prizes && (
                    <div className="flex items-start gap-3">
                      <Trophy className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                      <p className="font-jetbrains text-sm text-white">{hackathon.prizes}</p>
                    </div>
                  )}
                  
                  {hackathon.organizer && (
                    <div className="flex items-start gap-3">
                      <Building className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div className="flex items-center gap-2">
                        <p className="font-jetbrains text-sm text-white">{hackathon.organizer}</p>
                        {hackathon.isMaximallyOfficial && (
                          <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[8px] font-press-start">
                            OFFICIAL
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {hackathon.tags.length > 0 && (
                <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 p-4">
                  <h3 className="font-press-start text-xs text-pink-300 mb-3">TOPICS</h3>
                  <div className="flex flex-wrap gap-2">
                    {hackathon.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-white/5 border-white/20 text-gray-300 font-jetbrains text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {hackathon.registerUrl.startsWith('/') ? (
                <Link
                  to={hackathon.registerUrl}
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white font-press-start text-xs transition-all duration-300 hover:from-purple-500 hover:via-purple-400 hover:to-pink-400 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02]"
                  data-testid="button-register-hackathon"
                >
                  <Zap className="w-4 h-4" />
                  VIEW & REGISTER
                </Link>
              ) : (
                <a
                  href={hackathon.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white font-press-start text-xs transition-all duration-300 hover:from-purple-500 hover:via-purple-400 hover:to-pink-400 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02]"
                  data-testid="button-register-hackathon"
                >
                  <Zap className="w-4 h-4" />
                  REGISTER NOW
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default HackathonDetailSheet;
