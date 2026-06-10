interface TimelinePhase {
  label: string;
  date: string;
  note?: string;
}

interface EventTimelineProps {
  phases: TimelinePhase[];
}

export default function EventTimeline({ phases }: EventTimelineProps) {
  const now = new Date();

  const getStatus = (phase: TimelinePhase, idx: number) => {
    const phaseDate = new Date(phase.date);
    const nextPhase = phases[idx + 1];
    const nextDate = nextPhase ? new Date(nextPhase.date) : null;

    if (now > phaseDate && (!nextDate || now < nextDate)) return 'current';
    if (now > phaseDate) return 'complete';
    return 'upcoming';
  };

  return (
    <div className="border border-gray-800 bg-gray-900/40 p-4">
      <h4 className="font-space font-bold text-xs text-orange-400 mb-4">EVENT TIMELINE</h4>
      <div className="space-y-0">
        {phases.map((phase, i) => {
          const status = getStatus(phase, i);
          return (
            <div key={i} className="flex gap-3 relative">
              {/* Line connector */}
              {i < phases.length - 1 && (
                <div className="absolute left-[7px] top-4 bottom-0 w-px bg-gray-800" />
              )}
              {/* Dot */}
              <div className={`w-[15px] h-[15px] rounded-full border-2 shrink-0 mt-0.5 relative z-10 ${
                status === 'complete' ? 'bg-green-500 border-green-500' :
                status === 'current' ? 'bg-orange-500 border-orange-500' :
                'bg-transparent border-gray-700'
              }`} />
              {/* Content */}
              <div className="pb-4">
                <p className={`font-space text-xs font-medium ${status === 'current' ? 'text-orange-400' : status === 'complete' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {phase.label}
                </p>
                <p className="font-space text-[10px] text-gray-600">{new Date(phase.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                {phase.note && <p className="font-space text-[10px] text-gray-500 mt-0.5">{phase.note}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
