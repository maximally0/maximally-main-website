import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy, Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface MyHackathon {
  id: number;
  hackathon_name: string;
  slug: string;
  start_date: string;
  end_date: string;
  format: string;
  registration: {
    id: number;
    status: string;
    registration_number: string;
    registration_type: string;
    team?: {
      team_name: string;
      team_code: string;
    };
  };
  submission?: {
    id: number;
    project_name: string;
    status: string;
    score?: number;
    prize_won?: string;
  };
}

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hackathons, setHackathons] = useState<MyHackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  useEffect(() => {
    if (user) {
      fetchMyHackathons();
    }
  }, [user]);

  const fetchMyHackathons = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/participant/my-hackathons', { headers });
      const data = await response.json();

      if (data.success) {
        setHackathons(data.data);
      }
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      toast({
        title: "Error",
        description: "Failed to load your hackathons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-500 border-green-500';
      case 'checked_in': return 'text-blue-500 border-blue-500';
      case 'waitlist': return 'text-orange-500 border-orange-500';
      default: return 'text-gray-500 border-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'checked_in': return <CheckCircle className="h-4 w-4" />;
      case 'waitlist': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const isActive = (hackathon: MyHackathon) => {
    const now = new Date();
    const endDate = new Date(hackathon.end_date);
    return endDate >= now;
  };

  const filteredHackathons = hackathons.filter(h => 
    activeTab === 'active' ? isActive(h) : !isActive(h)
  );

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
        <div className="max-w-6xl mx-auto">
          <h1 className="font-press-start text-3xl text-maximally-red mb-8">MY_HACKATHONS</h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`pixel-button px-6 py-3 font-press-start text-sm ${
                activeTab === 'active'
                  ? 'bg-maximally-red text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              ACTIVE ({hackathons.filter(isActive).length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`pixel-button px-6 py-3 font-press-start text-sm ${
                activeTab === 'past'
                  ? 'bg-maximally-red text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              PAST ({hackathons.filter(h => !isActive(h)).length})
            </button>
          </div>

          {filteredHackathons.length === 0 ? (
            <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-12 text-center">
              <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="font-press-start text-gray-400 mb-4">
                {activeTab === 'active' ? 'NO_ACTIVE_HACKATHONS' : 'NO_PAST_HACKATHONS'}
              </p>
              <Link
                to="/events"
                className="pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors"
              >
                BROWSE_HACKATHONS
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredHackathons.map((hackathon) => (
                <div key={hackathon.id} className="pixel-card bg-gray-900 border-2 border-gray-800 p-6 hover:border-maximally-yellow transition-colors">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Hackathon Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-press-start text-xl text-white mb-2">{hackathon.hackathon_name}</h3>
                          <div className="flex items-center gap-4 text-sm font-jetbrains text-gray-400 mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {new Date(hackathon.start_date).toLocaleDateString()} - {new Date(hackathon.end_date).toLocaleDateString()}
                            </div>
                            <span className="px-2 py-1 bg-gray-800 border border-gray-700 text-xs font-press-start">
                              {hackathon.format.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Registration Status */}
                      <div className="mb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-press-start border ${getStatusColor(hackathon.registration.status)}`}>
                            {getStatusIcon(hackathon.registration.status)}
                            {hackathon.registration.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 font-jetbrains">
                            #{hackathon.registration.registration_number}
                          </span>
                        </div>

                        {/* Team Info */}
                        {hackathon.registration.team && (
                          <div className="flex items-center gap-2 text-sm font-jetbrains text-gray-400">
                            <Users className="h-4 w-4" />
                            Team: {hackathon.registration.team.team_name} ({hackathon.registration.team.team_code})
                          </div>
                        )}
                      </div>

                      {/* Submission Status */}
                      {hackathon.submission ? (
                        <div className="pixel-card bg-black/50 border border-gray-700 p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-press-start text-sm text-maximally-yellow">PROJECT_SUBMITTED</h4>
                            {hackathon.submission.score && (
                              <div className="flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-maximally-yellow" />
                                <span className="font-press-start text-sm text-maximally-yellow">{hackathon.submission.score}</span>
                              </div>
                            )}
                          </div>
                          <p className="font-jetbrains text-gray-300 text-sm mb-2">{hackathon.submission.project_name}</p>
                          {hackathon.submission.prize_won && (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-maximally-yellow/20 border border-maximally-yellow text-maximally-yellow font-press-start text-xs">
                              <Trophy className="h-3 w-3" />
                              {hackathon.submission.prize_won}
                            </span>
                          )}
                        </div>
                      ) : isActive(hackathon) && (
                        <div className="pixel-card bg-red-900/20 border border-red-500 p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Upload className="h-4 w-4 text-red-500" />
                            <span className="font-press-start text-sm text-red-500">NO_SUBMISSION_YET</span>
                          </div>
                          <p className="font-jetbrains text-gray-300 text-sm">Don't forget to submit your project!</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="lg:w-48 flex flex-col gap-2">
                      <Link
                        to={`/hackathon/${hackathon.slug}`}
                        className="pixel-button bg-maximally-red text-white px-4 py-3 font-press-start text-xs hover:bg-maximally-yellow hover:text-black transition-colors text-center"
                      >
                        VIEW_HACKATHON
                      </Link>
                      {hackathon.submission && (
                        <Link
                          to={`/project/${hackathon.submission.id}`}
                          className="pixel-button bg-green-600 text-white px-4 py-3 font-press-start text-xs hover:bg-green-700 transition-colors text-center"
                        >
                          VIEW_PROJECT
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
