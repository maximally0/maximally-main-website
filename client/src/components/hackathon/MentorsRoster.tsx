import { Link } from 'react-router-dom';
import { Users, Clock } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  avatar_url?: string;
  skills?: string[];
  total_mentorship_hours?: number;
  status?: string;
}

export default function MentorsRoster({ mentors, hackathonSlug }: { mentors: Mentor[]; hackathonSlug?: string }) {
  if (!mentors || mentors.length === 0) return null;

  const featured = mentors.slice(0, 2);

  return (
    <div className="border border-gray-800 bg-gray-900/40 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-4 h-4 text-orange-400" />
        <h3 className="font-space font-bold text-sm text-white">MENTORS</h3>
      </div>

      <div className="space-y-3">
        {featured.map(m => (
          <div key={m.id} className="flex items-center gap-3 p-3 border border-gray-800 bg-black/30">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 shrink-0 border border-gray-700">
              {m.avatar_url ? (
                <img src={m.avatar_url} alt={m.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-orange-400 font-space font-bold">{m.name[0]}</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-space text-sm text-white font-medium truncate">{m.name}</p>
                {m.status === 'available' && <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />}
              </div>
              {m.total_mentorship_hours !== undefined && (
                <p className="font-space text-[10px] text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {m.total_mentorship_hours}h mentored
                </p>
              )}
              {m.skills && m.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {m.skills.slice(0, 3).map((s, i) => (
                    <span key={i} className="font-space text-[9px] text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {mentors.length > 2 && (
        <Link to="/mentors" className="font-space text-xs text-orange-400 hover:text-orange-300 mt-3 inline-block">
          View all {mentors.length} mentors →
        </Link>
      )}
    </div>
  );
}
