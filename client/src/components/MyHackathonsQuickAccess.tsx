import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ExternalLink, X, Rocket, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/lib/auth';

interface UserHackathon {
  id: number;
  hackathon: {
    id: number;
    hackathon_name: string;
    slug: string;
    start_date: string;
    end_date: string;
    format: string;
    hackathon_status?: string;
  };
  has_submitted: boolean;
}

export default function MyHackathonsQuickAccess() {
  const { user } = useAuth();
  const [hackathons, setHackathons] = useState<UserHackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Reset dismissed state on mount (page reload)
    setDismissed(false);
    
    if (user) {
      fetchMyHackathons();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMyHackathons = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/participant/hackathons', { headers });
      const data = await response.json();

      if (data.success && data.data) {
        // Filter to show only active/upcoming hackathons
        const activeHackathons = data.data.filter((h: UserHackathon) => {
          const endDate = new Date(h.hackathon.end_date);
          return endDate >= new Date();
        });
        setHackathons(activeHackathons);
      }
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading || hackathons.length === 0 || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-xs animate-fade-in">
      <div className="pixel-card bg-gray-900 border-2 border-maximally-red p-4 shadow-2xl shadow-maximally-red/30 relative">
        {/* Close button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 text-gray-400 hover:text-maximally-red transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Rocket className="h-5 w-5 text-maximally-yellow" />
          <h3 className="font-press-start text-xs text-maximally-yellow">MY_HACKATHONS</h3>
        </div>

        {/* Hackathon List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {hackathons.slice(0, 3).map((item) => {
            const endDate = new Date(item.hackathon.end_date);
            const now = new Date();
            const isLive = now >= new Date(item.hackathon.start_date) && now <= endDate;
            
            return (
              <Link
                key={item.id}
                to={`/hackathon/${item.hackathon.slug}`}
                className="block pixel-card bg-black/50 border border-gray-700 hover:border-maximally-yellow p-3 transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-press-start text-[10px] text-white mb-2 truncate group-hover:text-maximally-yellow transition-colors">
                      {item.hackathon.hackathon_name}
                    </h4>
                    <div className="flex items-center gap-2 text-[9px] text-gray-400 font-jetbrains mb-2">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {isLive && (
                        <div className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500 px-2 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-[8px] text-green-400 font-press-start">LIVE</span>
                        </div>
                      )}
                      {!item.has_submitted && (
                        <div className="inline-flex items-center gap-1 bg-orange-500/20 border border-orange-500 px-2 py-0.5 rounded">
                          <span className="text-[8px] text-orange-400 font-press-start">NOT_SUBMITTED</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-gray-500 group-hover:text-maximally-yellow transition-colors flex-shrink-0 mt-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {hackathons.length > 3 && (
          <Link
            to="/my-hackathons"
            className="block mt-3 text-center text-[9px] text-gray-400 hover:text-maximally-yellow font-press-start transition-colors"
          >
            VIEW_ALL ({hackathons.length})
          </Link>
        )}
      </div>
    </div>
  );
}
