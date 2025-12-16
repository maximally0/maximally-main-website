import { Link } from 'react-router-dom';
import { MapPin, Building, Users, Trophy, ExternalLink, Linkedin, Twitter } from 'lucide-react';

type OrganizerTier = 'starter' | 'verified' | 'senior' | 'chief' | 'legacy';

interface Organizer {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  profilePhoto: string | null;
  headline: string;
  shortBio: string;
  location: string;
  organizationName: string;
  organizationType: string;
  tier: OrganizerTier;
  totalHackathonsHosted: number;
  totalParticipantsReached: number;
  website: string | null;
  linkedin: string | null;
  twitter: string | null;
  isPublished: boolean;
}

interface OrganizerCardProps {
  organizer: Organizer;
}

const tierConfig: Record<OrganizerTier, { label: string; color: string; bgColor: string }> = {
  legacy: { label: 'LEGACY', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20 border-yellow-400' },
  chief: { label: 'CHIEF', color: 'text-orange-400', bgColor: 'bg-orange-400/20 border-orange-400' },
  senior: { label: 'SENIOR', color: 'text-purple-400', bgColor: 'bg-purple-400/20 border-purple-400' },
  verified: { label: 'VERIFIED', color: 'text-blue-400', bgColor: 'bg-blue-400/20 border-blue-400' },
  starter: { label: 'STARTER', color: 'text-gray-400', bgColor: 'bg-gray-400/20 border-gray-400' }
};

const OrganizerCard = ({ organizer }: OrganizerCardProps) => {
  const tier = tierConfig[organizer.tier] || tierConfig.starter;

  return (
    <div className={`pixel-card bg-gray-900 border-2 ${tier.bgColor} p-4 hover:scale-105 transition-transform duration-200`}>
      {/* Tier Badge */}
      <div className="flex justify-between items-start mb-3">
        <span className={`font-press-start text-xs ${tier.color}`}>{tier.label}</span>
        <div className="flex gap-2">
          {organizer.linkedin && (
            <a href={organizer.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {organizer.twitter && (
            <a href={organizer.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400">
              <Twitter className="h-4 w-4" />
            </a>
          )}
          {organizer.website && (
            <a href={organizer.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400">
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* Profile Photo */}
      <div className="flex justify-center mb-4">
        {organizer.profilePhoto ? (
          <img
            src={organizer.profilePhoto}
            alt={organizer.fullName}
            className="w-20 h-20 rounded-lg object-cover border-2 border-green-400"
          />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center border-2 border-green-400">
            <span className="font-press-start text-xl text-white">
              {organizer.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Name & Headline */}
      <div className="text-center mb-3">
        <h3 className="font-press-start text-sm text-green-400 mb-1 truncate">{organizer.fullName}</h3>
        <p className="font-jetbrains text-xs text-gray-400 line-clamp-2">{organizer.headline}</p>
      </div>

      {/* Organization */}
      {organizer.organizationName && (
        <div className="flex items-center justify-center gap-2 mb-3 text-xs text-gray-500">
          <Building className="h-3 w-3" />
          <span className="font-jetbrains truncate">{organizer.organizationName}</span>
        </div>
      )}

      {/* Location */}
      {organizer.location && (
        <div className="flex items-center justify-center gap-2 mb-3 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          <span className="font-jetbrains">{organizer.location}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-black/50 rounded p-2 text-center">
          <Trophy className="h-4 w-4 text-maximally-yellow mx-auto mb-1" />
          <p className="font-press-start text-xs text-white">{organizer.totalHackathonsHosted}</p>
          <p className="font-jetbrains text-xs text-gray-500">Events</p>
        </div>
        <div className="bg-black/50 rounded p-2 text-center">
          <Users className="h-4 w-4 text-cyan-400 mx-auto mb-1" />
          <p className="font-press-start text-xs text-white">{organizer.totalParticipantsReached}</p>
          <p className="font-jetbrains text-xs text-gray-500">Reached</p>
        </div>
      </div>

      {/* View Profile Button */}
      <Link
        to={`/organizer/${organizer.username}`}
        className="block w-full minecraft-block bg-green-600 text-white text-center py-2 hover:bg-green-500 transition-colors"
      >
        <span className="font-press-start text-xs">VIEW PROFILE</span>
      </Link>
    </div>
  );
};

export default OrganizerCard;
