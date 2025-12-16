import { Crown, Star, Shield, Award, Sparkles } from 'lucide-react';

type OrganizerTier = 'starter' | 'verified' | 'senior' | 'chief' | 'legacy';

interface OrganizerTierBadgeProps {
  tier: OrganizerTier;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const tierConfig = {
  legacy: {
    label: 'Legacy',
    icon: Crown,
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400',
    iconColor: 'text-purple-400',
    description: 'Legendary organizer with exceptional track record'
  },
  chief: {
    label: 'Chief',
    icon: Star,
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-400',
    iconColor: 'text-yellow-400',
    description: 'Top-tier organizer with proven excellence'
  },
  senior: {
    label: 'Senior',
    icon: Shield,
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-400',
    iconColor: 'text-blue-400',
    description: 'Experienced organizer with multiple successful events'
  },
  verified: {
    label: 'Verified',
    icon: Award,
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500',
    textColor: 'text-green-400',
    iconColor: 'text-green-400',
    description: 'Verified organizer with completed events'
  },
  starter: {
    label: 'Starter',
    icon: Sparkles,
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-500',
    textColor: 'text-gray-400',
    iconColor: 'text-gray-400',
    description: 'New organizer starting their journey'
  }
};

const sizeConfig = {
  sm: {
    padding: 'px-2 py-0.5',
    text: 'text-[8px]',
    icon: 'h-3 w-3'
  },
  md: {
    padding: 'px-3 py-1',
    text: 'text-[10px]',
    icon: 'h-4 w-4'
  },
  lg: {
    padding: 'px-4 py-2',
    text: 'text-xs',
    icon: 'h-5 w-5'
  }
};

const OrganizerTierBadge = ({ tier, size = 'md', showLabel = true }: OrganizerTierBadgeProps) => {
  const config = tierConfig[tier];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div
      className={`
        inline-flex items-center gap-1.5
        ${sizeStyles.padding}
        ${config.bgColor}
        border ${config.borderColor}
        rounded
        font-press-start
        ${sizeStyles.text}
        ${config.textColor}
        uppercase
      `}
      title={config.description}
    >
      <Icon className={`${sizeStyles.icon} ${config.iconColor}`} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
};

export default OrganizerTierBadge;
