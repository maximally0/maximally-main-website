import { useEffect, useState } from 'react';

interface PixelLoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

const PixelLoader = ({ text = 'LOADING', size = 'md' }: PixelLoaderProps) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Pixel spinner */}
      <div className="relative">
        {/* Rotating pixel blocks */}
        <div className={`${sizeClasses[size]} relative animate-spin`}>
          <div className="absolute top-0 left-0 w-1/3 h-1/3 minecraft-block bg-maximally-red"></div>
          <div className="absolute top-0 right-0 w-1/3 h-1/3 minecraft-block bg-maximally-yellow"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 minecraft-block bg-cyan-400"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 minecraft-block bg-maximally-blue"></div>
        </div>
        
        {/* Center pixel */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
          size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
        } minecraft-block bg-white animate-pulse`}></div>
      </div>

      {/* Loading text */}
      {text && (
        <div className={`font-press-start ${textSizeClasses[size]} text-cyan-400 flex items-center`}>
          <span>{text}</span>
          <span className="inline-block w-8 text-left">{dots}</span>
        </div>
      )}
    </div>
  );
};

export default PixelLoader;
