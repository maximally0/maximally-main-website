import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

interface LoadingBarProps {
  isLoading?: boolean;
}

export function LoadingBar({ isLoading = false }: LoadingBarProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  
  // Track React Query loading states
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isQueryLoading = isFetching > 0 || isMutating > 0;

  // Combine all loading states
  const combinedLoading = isLoading || isQueryLoading;

  // Handle route changes
  useEffect(() => {
    setIsVisible(true);
    setProgress(0);
    
    // Simulate loading progress
    const timer1 = setTimeout(() => setProgress(30), 50);
    const timer2 = setTimeout(() => setProgress(60), 150);
    const timer3 = setTimeout(() => setProgress(90), 300);
    const timer4 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsVisible(false), 200);
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [location.pathname]);

  // Handle external loading state (like auth loading or API calls)
  useEffect(() => {
    if (combinedLoading) {
      setIsVisible(true);
      setProgress(0);
      
      // Gradual progress while loading
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return 90; // Cap at 90% until loading completes
          return prev + Math.random() * 10;
        });
      }, 300);

      return () => clearInterval(interval);
    } else if (isVisible && progress < 100 && progress > 0) {
      // Complete the progress when loading finishes
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 200);
    }
  }, [combinedLoading]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1">
      <div
        className="h-full bg-maximally-red transition-all duration-300 ease-out shadow-[0_0_10px_rgba(229,9,20,0.5)]"
        style={{
          width: `${progress}%`,
          transition: progress === 100 ? 'width 0.2s ease-out' : 'width 0.3s ease-out',
        }}
      />
    </div>
  );
}
