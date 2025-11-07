import { Shield, Star, Crown, Flame, Award } from 'lucide-react';

interface JudgeBadgeProps {
  tier?: 'starter' | 'verified' | 'senior' | 'chief' | 'legacy';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const JudgeBadge = ({ 
  tier = 'starter', 
  size = 'md', 
  showLabel = true, 
  className = '' 
}: JudgeBadgeProps) => {
  const tierConfig = {
    starter: {
      label: 'Judge',
      color: 'text-green-400 border-green-400 bg-green-400/10',
      icon: Award,
      description: 'Maximally Judge'
    },
    verified: {
      label: 'Verified Judge',
      color: 'text-blue-400 border-blue-400 bg-blue-400/10',
      icon: Shield,
      description: 'Verified Maximally Judge'
    },
    senior: {
      label: 'Senior Judge',
      color: 'text-purple-400 border-purple-400 bg-purple-400/10',
      icon: Star,
      description: 'Senior Maximally Judge'
    },
    chief: {
      label: 'Chief Judge',
      color: 'text-yellow-400 border-yellow-400 bg-yellow-400/10',
      icon: Crown,
      description: 'Chief Maximally Judge'
    },
    legacy: {
      label: 'Legacy Judge',
      color: 'text-red-400 border-red-400 bg-red-400/10',
      icon: Flame,
      description: 'Legacy Maximally Judge'
    }
  };

  const config = tierConfig[tier];
  const Icon = config.icon;

  const sizeConfig = {
    sm: {
      container: 'px-2 py-1',
      icon: 'h-3 w-3',
      text: 'text-xs font-press-start',
      gap: 'gap-1'
    },
    md: {
      container: 'px-3 py-1.5',
      icon: 'h-4 w-4',
      text: 'text-xs font-press-start',
      gap: 'gap-2'
    },
    lg: {
      container: 'px-4 py-2',
      icon: 'h-5 w-5',
      text: 'text-sm font-press-start',
      gap: 'gap-2'
    }
  };

  const sizeStyles = sizeConfig[size];

  return (
    <div 
      className={`
        minecraft-block ${config.color} 
        inline-flex items-center ${sizeStyles.gap} ${sizeStyles.container}
        hover:scale-105 transition-transform cursor-help
        ${className}
      `}
      title={config.description}
    >
      <Icon className={sizeStyles.icon} />
      {showLabel && (
        <span className={sizeStyles.text}>
          {config.label.toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default JudgeBadge;