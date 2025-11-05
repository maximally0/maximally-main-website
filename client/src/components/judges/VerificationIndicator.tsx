import { CheckCircle2, Circle } from 'lucide-react';

interface VerificationIndicatorProps {
  verified: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const VerificationIndicator = ({ verified, size = 'sm', showLabel = false }: VerificationIndicatorProps) => {
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

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'md':
        return 'text-sm';
      case 'lg':
        return 'text-base';
    }
  };

  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 text-green-400" title="Verified by Maximally">
        <CheckCircle2 className={getIconSize()} />
        {showLabel && <span className={`${getTextSize()} font-jetbrains`}>Verified</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-gray-500" title="Self-declared">
      <Circle className={getIconSize()} />
      {showLabel && <span className={`${getTextSize()} font-jetbrains`}>Self-declared</span>}
    </span>
  );
};

export default VerificationIndicator;
