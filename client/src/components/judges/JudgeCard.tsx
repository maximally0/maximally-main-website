import { Link } from 'react-router-dom';
import { MapPin, Award, Users, Clock } from 'lucide-react';
import TierBadge from './TierBadge';
import VerificationIndicator from './VerificationIndicator';
import type { Judge } from '@shared/schema';

interface JudgeCardProps {
  judge: Judge;
}

const JudgeCard = ({ judge }: JudgeCardProps) => {
  return (
    <Link
      to={`/judge/${judge.username}`}
      className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/40 p-6 hover:border-pink-400 hover:scale-105 transition-all duration-300 group block"
    >
      {/* Profile Photo */}
      <div className="flex justify-center mb-4">
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-20 h-20 mx-auto overflow-hidden group-hover:from-orange-500 group-hover:to-pink-500 transition-all border border-pink-500/50">
          {judge.profilePhoto ? (
            <img
              src={judge.profilePhoto}
              alt={judge.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-press-start text-2xl text-white">
                {judge.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tier Badge & Availability */}
      <div className="flex justify-center items-center gap-2 mb-3">
        <TierBadge tier={judge.tier} size="sm" showLabel={false} />
        {judge.availabilityStatus === 'not-available' && (
          <span className="px-2 py-0.5 text-[8px] font-press-start bg-red-500/20 text-red-400 border border-red-500/50">
            UNAVAILABLE
          </span>
        )}
        {judge.availabilityStatus === 'seasonal' && (
          <span className="px-2 py-0.5 text-[8px] font-press-start bg-orange-500/20 text-orange-400 border border-orange-500/50">
            SEASONAL
          </span>
        )}
        {judge.availabilityStatus === 'available' && (
          <span className="px-2 py-0.5 text-[8px] font-press-start bg-green-500/20 text-green-400 border border-green-500/50">
            AVAILABLE
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className="font-press-start text-sm mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-orange-400 group-hover:to-pink-400 transition-colors text-center line-clamp-1">
        {judge.fullName}
      </h3>

      {/* Headline */}
      <p className="font-jetbrains text-gray-300 text-xs mb-3 text-center line-clamp-2 min-h-[2.5rem]">
        {judge.headline}
      </p>

      {/* Company */}
      <p className="font-jetbrains text-white font-bold text-xs text-center mb-4 line-clamp-1">
        {judge.company}
      </p>

      {/* Location */}
      <div className="flex items-center justify-center gap-1 mb-4 text-gray-400">
        <MapPin className="h-3 w-3" />
        <span className="font-jetbrains text-xs line-clamp-1">{judge.location}</span>
      </div>

      {/* Expertise Tags */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-4 min-h-[2rem]">
        {judge.primaryExpertise.slice(0, 3).map((expertise, i) => (
          <span
            key={i}
            className="bg-orange-500/20 border border-orange-500/50 text-orange-400 px-2 py-0.5 text-[10px] font-press-start uppercase"
          >
            {expertise}
          </span>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-purple-500/30">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Award className="h-3 w-3 text-purple-400" />
            {judge.eventsJudgedVerified && <VerificationIndicator verified={true} size="sm" />}
          </div>
          <div className="font-press-start text-xs text-pink-400">{judge.totalEventsJudged}</div>
          <div className="font-jetbrains text-[10px] text-gray-500">Events</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="h-3 w-3 text-purple-400" />
            {judge.teamsEvaluatedVerified && <VerificationIndicator verified={true} size="sm" />}
          </div>
          <div className="font-press-start text-xs text-pink-400">{judge.totalTeamsEvaluated}</div>
          <div className="font-jetbrains text-[10px] text-gray-500">Teams</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="h-3 w-3 text-purple-400" />
            {judge.mentorshipHoursVerified && <VerificationIndicator verified={true} size="sm" />}
          </div>
          <div className="font-press-start text-xs text-pink-400">{judge.totalMentorshipHours}</div>
          <div className="font-jetbrains text-[10px] text-gray-500">Hours</div>
        </div>
      </div>
    </Link>
  );
};

export default JudgeCard;
