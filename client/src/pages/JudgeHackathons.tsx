import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Users } from 'lucide-react';
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
        <div className="font-press-start text-maximally-red">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/judge-dashboard" className="text-maximally-yellow hover:text-maximally-red font-press-start text-sm mb-4 inline-block">
            ← BACK
          </Link>

          <h1 className="font-press-start text-3xl text-maximally-red mb-8">HACKATHONS_TO_JUDGE</h1>

          {hackathons.length === 0 ? (
            <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-12 text-center">
              <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="font-press-start text-gray-400">NO_HACKATHONS_AVAILABLE</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hackathons.map((hackathon) => (
                <Link
                  key={hackathon.id}
                  to={`/judge/hackathons/${hackathon.id}/submissions`}
                  className="pixel-card bg-gray-900 border-2 border-gray-800 p-6 hover:border-maximally-yellow transition-all"
                >
                  <h3 className="font-press-start text-lg text-white mb-4">{hackathon.hackathon_name}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm font-jetbrains text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {new Date(hackathon.start_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-jetbrains text-gray-400">
                      <Users className="h-4 w-4" />
                      {hackathon.registrations_count} participants
                    </div>
                    <div className="flex items-center gap-2 text-sm font-jetbrains text-gray-400">
                      <Trophy className="h-4 w-4" />
                      {hackathon.submissions_count || 0} submissions
                    </div>
                  </div>

                  <div className="pixel-button bg-maximally-red text-white px-4 py-2 font-press-start text-xs text-center hover:bg-maximally-yellow hover:text-black transition-colors">
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
