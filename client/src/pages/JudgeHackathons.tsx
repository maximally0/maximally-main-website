import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Users, ArrowLeft } from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

interface Hackathon {
  id: number;
  hackathon_name: string;
  slug: string;
  start_date: string;
  end_date: string;
  format: string;
  registrations_count: number;
  submissions_count: number;
}

export default function JudgeHackathons() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/judge/hackathons', { headers });
      const data = await response.json();

      if (data.success) {
        setHackathons(data.data);
      }
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-space font-bold text-orange-400 animate-pulse">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Link 
            to="/judge-dashboard" 
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-400 font-space font-bold text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK
          </Link>

          <h1 className="font-space font-bold text-3xl bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-8">
            HACKATHONS_TO_JUDGE
          </h1>

          {hackathons.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 p-12 text-center">
              <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="font-space font-bold text-gray-400">NO_HACKATHONS_AVAILABLE</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hackathons.map((hackathon) => (
                <Link
                  key={hackathon.id}
                  to={`/judge/hackathons/${hackathon.id}/submissions`}
                  className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-gray-800 p-6 hover:border-orange-500/50 hover:scale-[1.02] transition-all group"
                >
                  <h3 className="font-space font-bold text-lg text-white mb-4 group-hover:text-orange-400 transition-colors">
                    {hackathon.hackathon_name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm font-space text-gray-400">
                      <Calendar className="h-4 w-4 text-orange-400" />
                      {new Date(hackathon.start_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-space text-gray-400">
                      <Users className="h-4 w-4 text-orange-400" />
                      {hackathon.registrations_count} participants
                    </div>
                    <div className="flex items-center gap-2 text-sm font-space text-gray-400">
                      <Trophy className="h-4 w-4 text-amber-400" />
                      {hackathon.submissions_count || 0} submissions
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-500 text-white px-4 py-2 font-space font-bold text-xs text-center border border-orange-500/40 transition-all">
                    JUDGE_SUBMISSIONS
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
