interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'button' | 'circle' | 'stat';
  count?: number;
}

export function Skeleton({ className = '', variant = 'text', count = 1 }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-800';
  
  const variantClasses = {
    text: 'h-4 rounded',
    card: 'h-32 rounded-lg',
    button: 'h-12 rounded',
    circle: 'rounded-full',
    stat: 'h-24 rounded-lg'
  };

  const items = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    />
  ));

  return count > 1 ? <div className="space-y-3">{items}</div> : items[0];
}

export function CardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-32 h-6" />
        <Skeleton className="w-20 h-6" />
      </div>
      <Skeleton className="w-full h-4 mb-2" />
      <Skeleton className="w-3/4 h-4 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="w-24 h-8" />
        <Skeleton className="w-24 h-8" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-6 animate-pulse">
      <Skeleton variant="circle" className="w-8 h-8 mb-4" />
      <Skeleton className="w-16 h-8 mb-2" />
      <Skeleton className="w-24 h-4" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="w-48 h-5" />
          <Skeleton className="w-32 h-4" />
        </div>
        <Skeleton className="w-24 h-8" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <Skeleton className="w-48 h-8 mb-4" />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
