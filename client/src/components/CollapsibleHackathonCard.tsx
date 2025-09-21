import { motion, useReducedMotion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PixelCard } from '@/components/ui/pixel-card';
import type { SelectHackathon } from '@shared/schema';
import { cn } from '@/lib/utils';

interface HackathonCardProps {
  hackathon: SelectHackathon;
  className?: string;
}

const HackathonCard = ({ hackathon, className = '' }: HackathonCardProps) => {
  const shouldReduceMotion = useReducedMotion();

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
      <PixelCard 
        variant="flat"
        padding="none"
        className="border-maximally-red hover:shadow-glow-red bg-white dark:bg-card"
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
            <h3 
              className="font-press-start text-base text-gray-900 dark:text-white"
              data-testid={`name-${hackathon.id}`}
            >
              {hackathon.name}
            </h3>
            {getStatusBadge()}
          </div>
          
          {/* Description */}
          <p className="font-jetbrains text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {hackathon.description}
          </p>

          {/* Meta Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="h-3 w-3 mr-1 text-maximally-red flex-shrink-0" aria-hidden="true" />
              <span className="font-jetbrains truncate">
                {formatDate(hackathon.startDate)}
              </span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="h-3 w-3 mr-1 text-maximally-red flex-shrink-0" aria-hidden="true" />
              <span className="font-jetbrains">{hackathon.length}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPin className="h-3 w-3 mr-1 text-maximally-red flex-shrink-0" aria-hidden="true" />
              <span className="font-jetbrains">{hackathon.location}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Users className="h-3 w-3 mr-1 text-maximally-red flex-shrink-0" aria-hidden="true" />
              <span className="font-jetbrains">
                {hackathon.participants > 0 ? `${hackathon.participants}` : 'Open'}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {hackathon.tags.slice(0, 3).map(tag => (
                <span 
                  key={tag} 
                  className="minecraft-block bg-maximally-red text-white px-2 py-1 font-jetbrains text-xs"
                  data-testid={`tag-${tag.toLowerCase().replace(/\s+/g, '-')}-${hackathon.id}`}
                >
                  {tag}
                </span>
              ))}
              {hackathon.tags.length > 3 && (
                <span className="minecraft-block bg-gray-500 text-white px-2 py-1 font-jetbrains text-xs">
                  +{hackathon.tags.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {hackathon.detailsUrl.startsWith('http') ? (
              <a
                href={hackathon.detailsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-button bg-white text-maximally-black border-2 border-black hover:bg-gray-50 text-xs px-3 py-2 font-press-start flex-1 text-center"
                data-testid={`link-details-${hackathon.id}`}
              >
                DETAILS
                <ExternalLink className="w-3 h-3 ml-1 inline" aria-hidden="true" />
              </a>
            ) : (
              <Link
                to={hackathon.detailsUrl}
                className="pixel-button bg-white text-maximally-black border-2 border-black hover:bg-gray-50 text-xs px-3 py-2 font-press-start flex-1 text-center"
                data-testid={`link-details-${hackathon.id}`}
              >
                DETAILS
                <ArrowRight className="w-3 h-3 ml-1 inline" aria-hidden="true" />
              </Link>
            )}
            
            {hackathon.registerUrl.startsWith('http') ? (
              <a
                href={hackathon.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-button bg-maximally-red text-white border-2 border-black hover:bg-maximally-yellow hover:text-black text-xs px-3 py-2 font-press-start flex-1 text-center"
                data-testid={`link-register-${hackathon.id}`}
              >
                REGISTER
                <ExternalLink className="w-3 h-3 ml-1 inline" aria-hidden="true" />
              </a>
            ) : (
              <Link
                to={hackathon.registerUrl}
                className="pixel-button bg-maximally-red text-white border-2 border-black hover:bg-maximally-yellow hover:text-black text-xs px-3 py-2 font-press-start flex-1 text-center"
                data-testid={`link-register-${hackathon.id}`}
              >
                REGISTER
                <ArrowRight className="w-3 h-3 ml-1 inline" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </PixelCard>
    </motion.div>
  );
};

export default HackathonCard;