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
      className="pixel-card bg-black p-6 hover:scale-105 transition-all duration-300 group block"
    >
      {/* Profile Photo */}
      <div className="flex justify-center mb-4">
        <div className="minecraft-block bg-gradient-to-br from-cyan-400 to-maximally-blue w-20 h-20 mx-auto overflow-hidden group-hover:from-maximally-yellow group-hover:to-maximally-red transition-all">
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

      {/* Tier Badge */}
      <div className="flex justify-center mb-3">
        <TierBadge tier={judge.tier} size="sm" showLabel={false} />
      </div>

      {/* Name */}
      <h3 className="font-press-start text-sm mb-2 text-cyan-400 group-hover:text-maximally-yellow transition-colors text-center line-clamp-1">
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
            className="minecraft-block bg-maximally-red/20 border border-maximally-red text-maximally-red px-2 py-0.5 text-[10px] font-press-start uppercase"
          >
            {expertise}
          </span>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Award className="h-3 w-3 text-cyan-400" />
            {judge.eventsJudgedVerified && <VerificationIndicator verified={true} size="sm" />}
          </div>
          <div className="font-press-start text-xs text-cyan-400">{judge.totalEventsJudged}</div>
          <div className="font-jetbrains text-[10px] text-gray-500">Events</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="h-3 w-3 text-cyan-400" />
            {judge.teamsEvaluatedVerified && <VerificationIndicator verified={true} size="sm" />}
          </div>
          <div className="font-press-start text-xs text-cyan-400">{judge.totalTeamsEvaluated}</div>
          <div className="font-jetbrains text-[10px] text-gray-500">Teams</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="h-3 w-3 text-cyan-400" />
            {judge.mentorshipHoursVerified && <VerificationIndicator verified={true} size="sm" />}
          </div>
          <div className="font-press-start text-xs text-cyan-400">{judge.totalMentorshipHours}</div>
          <div className="font-jetbrains text-[10px] text-gray-500">Hours</div>
        </div>
      </div>
    </Link>
  );
};

export default JudgeCard;
