import { Trophy, ExternalLink } from 'lucide-react';

interface Winner {
  project_name: string;
  team_name?: string;
  description?: string;
  prize_won?: string;
  demo_url?: string;
}

export default function WinnersPodium({ winners }: { winners: Winner[] }) {
  if (!winners || winners.length === 0) return null;

  const first = winners[0];
  const second = winners[1];
  const third = winners[2];
  const trackWinners = winners.slice(3);

  return (
    <div className="border border-amber-500/30 bg-amber-500/5 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-amber-400" />
        <h3 className="font-space font-bold text-base text-white">WINNERS</h3>
      </div>

      {/* Podium - 2nd | 1st | 3rd */}
      <div className="flex items-end justify-center gap-3 sm:gap-4 mb-6">
        {second && (
          <div className="flex-1 max-w-[200px]">
            <div className="border border-gray-700 bg-gray-900/60 p-3 sm:p-4 text-center h-full">
              <span className="font-space text-lg text-gray-400 font-bold">2nd</span>
              <h4 className="font-space text-xs text-white font-medium mt-2 line-clamp-2">{second.project_name}</h4>
              {second.team_name && <p className="font-space text-[10px] text-gray-500 mt-1">{second.team_name}</p>}
              {second.prize_won && <p className="font-space text-[10px] text-gray-400 mt-1">{second.prize_won}</p>}
            </div>
          </div>
        )}
        {first && (
          <div className="flex-1 max-w-[220px]">
            <div className="border-2 border-amber-500/50 bg-amber-500/10 p-4 sm:p-5 text-center">
              <Trophy className="w-6 h-6 text-amber-400 mx-auto" />
              <span className="font-space text-xl text-amber-400 font-bold block mt-1">1st</span>
              <h4 className="font-space text-sm text-white font-bold mt-2 line-clamp-2">{first.project_name}</h4>
              {first.team_name && <p className="font-space text-xs text-gray-400 mt-1">{first.team_name}</p>}
              {first.description && <p className="font-space text-[10px] text-gray-500 mt-2 line-clamp-2">{first.description}</p>}
              {first.prize_won && <p className="font-space text-xs text-amber-400 font-bold mt-2">{first.prize_won}</p>}
              {first.demo_url && (
                <a href={first.demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 font-space text-[10px] mt-2">
                  View Project <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )}
        {third && (
          <div className="flex-1 max-w-[200px]">
            <div className="border border-gray-700 bg-gray-900/60 p-3 sm:p-4 text-center h-full">
              <span className="font-space text-lg text-gray-400 font-bold">3rd</span>
              <h4 className="font-space text-xs text-white font-medium mt-2 line-clamp-2">{third.project_name}</h4>
              {third.team_name && <p className="font-space text-[10px] text-gray-500 mt-1">{third.team_name}</p>}
              {third.prize_won && <p className="font-space text-[10px] text-gray-400 mt-1">{third.prize_won}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Track winners */}
      {trackWinners.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-gray-800 pt-4">
          {trackWinners.map((w, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 border border-dashed border-gray-700 bg-gray-900/40">
              <Trophy className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-space text-xs text-white truncate">{w.project_name}</p>
                <p className="font-space text-[10px] text-gray-500">{w.prize_won || 'Special Prize'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
