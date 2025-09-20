import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Trophy, 
  ChevronDown,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PixelCard } from '@/components/ui/pixel-card';
import type { SelectHackathon } from '@shared/schema';
import { cn } from '@/lib/utils';

interface CollapsibleHackathonCardProps {
  hackathon: SelectHackathon;
  className?: string;
}

const CollapsibleHackathonCard = ({ hackathon, className = '' }: CollapsibleHackathonCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const contentId = `hackathon-content-${hackathon.id}`;

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusBadge = () => {
    const baseClasses = "minecraft-block px-3 py-1 font-press-start text-xs";
    const animationClass = shouldReduceMotion ? "" : "animate-pulse";
    
    switch (hackathon.status) {
      case 'upcoming':
        return (
          <div 
            className={cn(baseClasses, "bg-green-500 text-white")}
            data-testid={`status-upcoming-${hackathon.id}`}
          >
            UPCOMING
          </div>
        );
      case 'completed':
        return (
          <div 
            className={cn(baseClasses, "bg-gray-500 text-white")}
            data-testid={`status-completed-${hackathon.id}`}
          >
            COMPLETED
          </div>
        );
      case 'ongoing':
        return (
          <div 
            className={cn(baseClasses, "bg-maximally-yellow text-black", animationClass)}
            data-testid={`status-ongoing-${hackathon.id}`}
          >
            LIVE NOW
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className={cn("transition-all duration-300", className)}
      layout={!shouldReduceMotion}
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? {} : { duration: 0.3 }}
    >
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <PixelCard 
          variant="flat"
          padding="none"
          className="border-maximally-red hover:shadow-glow-red bg-white dark:bg-card"
        >
          {/* Collapsed View - Always Visible */}
          <CollapsibleTrigger asChild>
            <button 
              className="w-full p-4 md:p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maximally-red focus-visible:ring-offset-2 transition-colors"
              aria-controls={contentId}
              data-testid={`toggle-${hackathon.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left Side - Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                    <h3 
                      id={`name-${hackathon.id}`}
                      className="font-press-start text-lg md:text-xl text-gray-900 dark:text-white truncate"
                      data-testid={`name-${hackathon.id}`}
                    >
                      {hackathon.name}
                    </h3>
                    {getStatusBadge()}
                  </div>
                  
                  {/* Mobile-friendly meta info */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1 text-maximally-red flex-shrink-0" aria-hidden="true" />
                      <span className="font-jetbrains truncate">
                        {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1 text-maximally-red flex-shrink-0" aria-hidden="true" />
                      <span className="font-jetbrains">{hackathon.length}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Expand Button & Prize */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Prize Badge - Hide on very small screens */}
                  <div className="hidden sm:block minecraft-block bg-maximally-yellow text-black px-3 py-2">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-1" aria-hidden="true" />
                      <span className="font-press-start text-xs">{hackathon.prizes}</span>
                    </div>
                  </div>
                  
                  {/* Expand/Collapse Button */}
                  <motion.div
                    animate={shouldReduceMotion ? {} : { rotate: isExpanded ? 180 : 0 }}
                    transition={shouldReduceMotion ? {} : { duration: 0.2 }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-maximally-red text-white hover:bg-maximally-yellow hover:text-black transition-colors"
                  >
                    <ChevronDown className="h-5 w-5" aria-hidden="true" />
                  </motion.div>
                </div>
              </div>
            </button>
          </CollapsibleTrigger>

          {/* Expanded View - Collapsible */}
          <CollapsibleContent 
            id={contentId}
            className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up"
          >
            <div 
              className="px-4 md:px-6 pb-4 md:pb-6 border-t border-gray-200 dark:border-gray-700"
              role="region"
              aria-labelledby={`name-${hackathon.id}`}
            >
              {/* Description */}
              <div className="mt-4 mb-6">
                <p className="font-jetbrains text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                  {hackathon.description}
                </p>
              </div>

              {/* Detailed Event Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="h-5 w-5 mr-3 text-maximally-red flex-shrink-0" aria-hidden="true" />
                  <div>
                    <span className="font-jetbrains font-medium">Location</span>
                    <p className="font-jetbrains text-sm">{hackathon.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Users className="h-5 w-5 mr-3 text-maximally-red flex-shrink-0" aria-hidden="true" />
                  <div>
                    <span className="font-jetbrains font-medium">Participants</span>
                    <p className="font-jetbrains text-sm">
                      {hackathon.participants > 0 ? `${hackathon.participants.toLocaleString()} builders` : 'Registration Open'}
                    </p>
                  </div>
                </div>

                {/* Show prize on mobile in expanded view */}
                <div className="sm:hidden flex items-center text-gray-600 dark:text-gray-400">
                  <Trophy className="h-5 w-5 mr-3 text-maximally-red flex-shrink-0" aria-hidden="true" />
                  <div>
                    <span className="font-jetbrains font-medium">Prizes</span>
                    <p className="font-jetbrains text-sm">{hackathon.prizes}</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h4 className="font-press-start text-sm text-maximally-red mb-3">FOCUS AREAS</h4>
                <div className="flex flex-wrap gap-2">
                  {hackathon.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="minecraft-block bg-maximally-red text-white px-3 py-1 font-jetbrains text-sm hover:bg-maximally-yellow hover:text-black transition-colors"
                      data-testid={`tag-${tag.toLowerCase().replace(/\s+/g, '-')}-${hackathon.id}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {hackathon.detailsUrl.startsWith('http') ? (
                  <a
                    href={hackathon.detailsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center justify-center font-press-start border-2 border-black transition-all duration-200 ease-in-out active:translate-y-1 active:shadow-none group bg-white text-maximally-black hover:bg-gray-50 hover:shadow-[3px_3px_8px_rgba(0,0,0,0.2)] h-12 px-6 py-3 text-sm shadow-[3px_3px_0_0_#000000] gap-2 flex-1"
                    data-testid={`link-details-${hackathon.id}`}
                  >
                    VIEW DETAILS
                    <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    to={hackathon.detailsUrl}
                    className="relative inline-flex items-center justify-center font-press-start border-2 border-black transition-all duration-200 ease-in-out active:translate-y-1 active:shadow-none group bg-white text-maximally-black hover:bg-gray-50 hover:shadow-[3px_3px_8px_rgba(0,0,0,0.2)] h-12 px-6 py-3 text-sm shadow-[3px_3px_0_0_#000000] gap-2 flex-1"
                    data-testid={`link-details-${hackathon.id}`}
                  >
                    VIEW DETAILS
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Link>
                )}
                
                {hackathon.registerUrl.startsWith('http') ? (
                  <a
                    href={hackathon.registerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center justify-center font-press-start border-2 border-black transition-all duration-200 ease-in-out active:translate-y-1 active:shadow-none group bg-maximally-red text-white hover:bg-maximally-yellow hover:text-black hover:shadow-[3px_3px_8px_rgba(255,215,0,0.3)] h-12 px-6 py-3 text-sm shadow-[3px_3px_0_0_#000000] gap-2 flex-1"
                    data-testid={`link-register-${hackathon.id}`}
                  >
                    REGISTER NOW
                    <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    to={hackathon.registerUrl}
                    className="relative inline-flex items-center justify-center font-press-start border-2 border-black transition-all duration-200 ease-in-out active:translate-y-1 active:shadow-none group bg-maximally-red text-white hover:bg-maximally-yellow hover:text-black hover:shadow-[3px_3px_8px_rgba(255,215,0,0.3)] h-12 px-6 py-3 text-sm shadow-[3px_3px_0_0_#000000] gap-2 flex-1"
                    data-testid={`link-register-${hackathon.id}`}
                  >
                    REGISTER NOW
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </PixelCard>
      </Collapsible>
    </motion.div>
  );
};

export default CollapsibleHackathonCard;