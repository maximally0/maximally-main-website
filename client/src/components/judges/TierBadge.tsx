import { JudgeTier, getTierColor, getTierLabel } from '@/lib/judgesData';
import { Award, Shield, Star, Crown, Flame } from 'lucide-react';

interface TierBadgeProps {
  tier: JudgeTier;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const TierBadge = ({ tier, size = 'md', showLabel = true }: TierBadgeProps) => {
  const getIcon = () => {
    switch (tier) {
      case 'starter':
        return <Award className={getIconSize()} />;
      case 'verified':
        return <Shield className={getIconSize()} />;
      case 'senior':
        return <Star className={getIconSize()} />;
      case 'chief':
        return <Crown className={getIconSize()} />;
      case 'legacy':
        return <Flame className={getIconSize()} />;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'md':
        return 'h-4 w-4';
      case 'lg':
        return 'h-5 w-5';
    }
  };

  const getBadgeSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'md':
        return 'text-xs px-3 py-1.5';
      case 'lg':
        return 'text-sm px-4 py-2';
    }
  };

  const getBgColor = () => {
    switch (tier) {
      case 'starter':
        return 'bg-green-400/10';
      case 'verified':
        return 'bg-blue-400/10';
      case 'senior':
        return 'bg-purple-400/10';
      case 'chief':
        return 'bg-yellow-400/10';
      case 'legacy':
        return 'bg-red-400/10';
    }
  };

  if (!showLabel) {
    return (
      <div
        className={`minecraft-block ${getBgColor()} border-2 ${getTierColor(tier)} ${getBadgeSize()} inline-flex items-center justify-center`}
        title={getTierLabel(tier)}
      >
        {getIcon()}
      </div>
    );
  }

  return (
    <div
      className={`minecraft-block ${getBgColor()} border-2 ${getTierColor(tier)} ${getBadgeSize()} inline-flex items-center gap-2 font-press-start`}
    >
      {getIcon()}
      <span className="uppercase">{tier}</span>
    </div>
  );
};

export default TierBadge;
