import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

interface OrganizerCardProps {
  name: string;
  username?: string;
  eventsCount?: number;
  description?: string;
}

export default function OrganizerCard({ name, username, eventsCount, description }: OrganizerCardProps) {
  return (
    <div className="border border-gray-800 bg-gray-900/40 p-4">
      <h4 className="font-space font-bold text-xs text-orange-400 mb-3">ORGANIZER</h4>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-space font-bold text-sm shrink-0">
          {name[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-space text-sm text-white font-medium truncate">{name}</p>
          {eventsCount !== undefined && (
            <p className="font-space text-[10px] text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {eventsCount} events on Maximally
            </p>
          )}
        </div>
      </div>
      {description && <p className="font-space text-xs text-gray-500 mt-3">{description}</p>}
      {username && (
        <Link to={`/organizer/${username}`} className="font-space text-[10px] text-orange-400 hover:text-orange-300 mt-2 inline-block">
          View profile →
        </Link>
      )}
    </div>
  );
}
