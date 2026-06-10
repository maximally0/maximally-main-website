interface SpotsProgressBarProps {
  registered: number;
  maxParticipants: number;
}

export default function SpotsProgressBar({ registered, maxParticipants }: SpotsProgressBarProps) {
  const percentage = maxParticipants > 0 ? Math.min((registered / maxParticipants) * 100, 100) : 0;
  const spotsLeft = Math.max(maxParticipants - registered, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-space text-xs text-gray-400">{registered} / {maxParticipants} registered</span>
        <span className="font-space text-xs text-orange-400 font-bold">{spotsLeft} spots left</span>
      </div>
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
