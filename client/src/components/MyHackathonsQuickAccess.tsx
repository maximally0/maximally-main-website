import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ExternalLink, X, Rocket, Sparkles } from 'lucide-react';
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

  // DEBUG: Set to true to always show the component for testing
  const DEBUG_ALWAYS_SHOW = false;

  useEffect(() => {
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

  // Show component if DEBUG mode or if user has hackathons
  const shouldShow = DEBUG_ALWAYS_SHOW || (user && !loading && hackathons.length > 0 && !dismissed);
  
  if (!shouldShow) {
    return null;
  }

  // Mock data for debugging when no hackathons
  const displayHackathons = hackathons.length > 0 ? hackathons : DEBUG_ALWAYS_SHOW ? [
    {
      id: 1,
      hackathon: {
        id: 1,
        hackathon_name: 'Demo Hackathon',
        slug: 'demo-hackathon',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        format: 'online',
        hackathon_status: 'ongoing'
      },
      has_submitted: false
    }
  ] : [];

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm animate-fade-in">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-lg" />
      
      <div className="relative bg-black/90 border border-purple-500/50 backdrop-blur-sm shadow-2xl shadow-purple-500/30">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-pink-900/20 pointer-events-none" />
        
        {/* Content */}
        <div className="relative p-5">
          {/* Close button */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-3 right-3 p-1 text-gray-400 hover:text-pink-400 transition-colors hover:bg-pink-500/20 border border-transparent hover:border-pink-500/40"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-600/40 to-pink-600/30 border border-purple-500/50">
              <Rocket className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-press-start text-xs text-purple-300">MY HACKATHONS</h3>
              <p className="font-jetbrains text-[10px] text-gray-500 mt-0.5">Quick access to your events</p>
            </div>
            <Sparkles className="h-4 w-4 text-pink-400 ml-auto animate-pulse" />
          </div>

          {/* Hackathon List */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {displayHackathons.slice(0, 3).map((item) => {
              const endDate = new Date(item.hackathon.end_date);
              const now = new Date();
              const isLive = now >= new Date(item.hackathon.start_date) && now <= endDate;
              
              return (
                <Link
                  key={item.id}
                  to={`/hackathon/${item.hackathon.slug}`}
                  className="block bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-gray-700/50 hover:border-purple-500/60 p-4 transition-all hover:scale-[1.02] group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-press-start text-[10px] text-white mb-2 truncate group-hover:text-purple-300 transition-colors">
                        {item.hackathon.hackathon_name}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-jetbrains mb-3">
                        <Calendar className="h-3 w-3 flex-shrink-0 text-pink-400" />
                        <span>
                          Ends {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {isLive && (
                          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-600/30 to-emerald-600/20 border border-green-500/50 px-2 py-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-[8px] text-green-400 font-press-start">LIVE</span>
                          </div>
                        )}
                        {!item.has_submitted && (
                          <div className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-600/30 to-amber-600/20 border border-orange-500/50 px-2 py-1">
                            <span className="text-[8px] text-orange-400 font-press-start">SUBMIT</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-purple-400 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>

          {displayHackathons.length > 3 && (
            <Link
              to="/my-hackathons"
              className="block mt-4 text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-2 font-press-start text-[10px] border border-purple-500/50 transition-all hover:scale-[1.02]"
            >
              VIEW ALL ({displayHackathons.length})
            </Link>
          )}

          {/* Debug indicator */}
          {DEBUG_ALWAYS_SHOW && hackathons.length === 0 && (
            <div className="mt-3 text-center">
              <span className="text-[8px] text-yellow-500 font-jetbrains bg-yellow-500/10 border border-yellow-500/30 px-2 py-1">
                DEBUG MODE - Mock Data
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
