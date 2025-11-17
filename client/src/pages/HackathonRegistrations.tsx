import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  Download, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Github,
  Linkedin,
  UserCheck,
  Trophy,
  ExternalLink,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';
import RegistrationAnalytics from '@/components/RegistrationAnalytics';
import AnnouncementsManager from '@/components/AnnouncementsManager';
import JudgesManager from '@/components/JudgesManager';
import TimelineManager from '@/components/TimelineManager';
import OrganizerTracksManager from '@/components/OrganizerTracksManager';
import OrganizerSponsorsManager from '@/components/OrganizerSponsorsManager';
import OrganizerFeedbackViewer from '@/components/OrganizerFeedbackViewer';

interface Registration {
  id: number;
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  registration_type: 'individual' | 'team';
  status: 'pending' | 'confirmed' | 'checked_in' | 'cancelled' | 'waitlist';
  phone_number?: string;
  college_university?: string;
  github_url?: string;
  linkedin_url?: string;
  experience_level?: string;
  registration_number: string;
  created_at: string;
  team?: {
    id: number;
    team_name: string;
    team_code: string;
  };
}

interface Team {
  id: number;
  team_name: string;
  team_code: string;
  team_leader_id: string;
  status: string;
  created_at: string;
  members: { count: number }[];
}

export default function HackathonRegistrations() {
  const { hackathonId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [hackathon, setHackathon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'registrations' | 'teams' | 'submissions' | 'analytics' | 'announcements' | 'judges' | 'timeline' | 'settings'>('registrations');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRegistrations, setSelectedRegistrations] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (hackathonId) {
      fetchData();
    }
  }, [hackathonId]);

  const fetchData = async () => {
    try {
      const headers = await getAuthHeaders();
      
      const [regResponse, teamsResponse, submissionsResponse, hackathonResponse] = await Promise.all([
        fetch(`/api/organizer/hackathons/${hackathonId}/registrations`, { headers }),
        fetch(`/api/organizer/hackathons/${hackathonId}/teams`, { headers }),
        fetch(`/api/organizer/hackathons/${hackathonId}/submissions`, { headers }),
        fetch(`/api/organizer/hackathons/${hackathonId}`, { headers })
      ]);

      const regData = await regResponse.json();
      const teamsData = await teamsResponse.json();
      const submissionsData = await submissionsResponse.json();
      const hackathonData = await hackathonResponse.json();

      if (regData.success) setRegistrations(regData.data);
      if (teamsData.success) setTeams(teamsData.data);
      if (submissionsData.success) setSubmissions(submissionsData.data);
      if (hackathonData.success) setHackathon(hackathonData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load registrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Registration #', 'Name', 'Email', 'Phone', 'College', 'Type', 'Team', 'Status', 'Registered At'];
    const rows = filteredRegistrations.map(reg => [
      reg.registration_number,
      reg.full_name,
      reg.email,
      reg.phone_number || '',
      reg.college_university || '',
      reg.registration_type,
      reg.team?.team_name || 'N/A',
      reg.status,
      new Date(reg.created_at).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hackathon-${hackathonId}-registrations.csv`;
    a.click();
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.registration_number.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: registrations.length,
    confirmed: registrations.filter(r => r.status === 'confirmed').length,
    checkedIn: registrations.filter(r => r.status === 'checked_in').length,
    waitlist: registrations.filter(r => r.status === 'waitlist').length,
    teams: teams.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="space-y-4">
              <div className="h-4 w-32 bg-gray-800 rounded"></div>
              <div className="h-10 w-80 bg-gray-800 rounded"></div>
              <div className="h-4 w-96 bg-gray-800 rounded"></div>
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="pixel-card bg-gray-900 border-2 border-gray-800 p-4">
                  <div className="h-8 w-12 bg-gray-800 rounded mb-2"></div>
                  <div className="h-3 w-16 bg-gray-800 rounded"></div>
                </div>
              ))}
            </div>

            {/* Tabs skeleton */}
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 w-32 bg-gray-800 rounded"></div>
              ))}
            </div>

            {/* Content skeleton */}
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
                  <div className="h-6 w-48 bg-gray-800 rounded mb-4"></div>
                  <div className="h-4 w-full bg-gray-800 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-800 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/organizer/dashboard"
              className="text-maximally-yellow hover:text-maximally-red font-press-start text-sm mb-4 inline-block"
            >
              ← BACK_TO_DASHBOARD
            </Link>
            <h1 className="font-press-start text-3xl text-maximally-red mb-2">
              MANAGE_HACKATHON
            </h1>
            <p className="text-gray-400 font-jetbrains">
              Manage participants, teams, judges, and announcements for your hackathon
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="pixel-card bg-gray-900 border-2 border-maximally-yellow p-4">
              <div className="text-2xl font-bold text-maximally-yellow mb-1 font-press-start">
                {stats.total}
              </div>
              <div className="text-xs text-gray-400 font-press-start">TOTAL</div>
            </div>
            <div className="pixel-card bg-gray-900 border-2 border-green-500 p-4">
              <div className="text-2xl font-bold text-green-500 mb-1 font-press-start">
                {stats.confirmed}
              </div>
              <div className="text-xs text-gray-400 font-press-start">CONFIRMED</div>
            </div>
            <div className="pixel-card bg-gray-900 border-2 border-blue-500 p-4">
              <div className="text-2xl font-bold text-blue-500 mb-1 font-press-start">
                {stats.checkedIn}
              </div>
              <div className="text-xs text-gray-400 font-press-start">CHECKED_IN</div>
            </div>
            <div className="pixel-card bg-gray-900 border-2 border-orange-500 p-4">
              <div className="text-2xl font-bold text-orange-500 mb-1 font-press-start">
                {stats.waitlist}
              </div>
              <div className="text-xs text-gray-400 font-press-start">WAITLIST</div>
            </div>
            <div className="pixel-card bg-gray-900 border-2 border-purple-500 p-4">
              <div className="text-2xl font-bold text-purple-500 mb-1 font-press-start">
                {stats.teams}
              </div>
              <div className="text-xs text-gray-400 font-press-start">TEAMS</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('registrations')}
              className={`pixel-button px-6 py-3 font-press-start text-sm whitespace-nowrap ${
                activeTab === 'registrations'
                  ? 'bg-maximally-red text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              REGISTRATIONS
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`pixel-button px-6 py-3 font-press-start text-sm whitespace-nowrap ${
                activeTab === 'teams'
                  ? 'bg-maximally-red text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              TEAMS
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`pixel-button px-6 py-3 font-press-start text-sm whitespace-nowrap ${
                activeTab === 'submissions'
                  ? 'bg-maximally-red text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              SUBMISSIONS
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pixel-button px-6 py-3 font-press-start text-sm whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-maximally-red text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              ANALYTICS
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`pixel-button px-6 py-3 font-press-start text-sm whitespace-nowrap ${
                activeTab === 'announcements'
                  ? 'bg-maximally-red text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              ANNOUNCEMENTS
            </button>
            <button
              onClick={() => setActiveTab('judges')}
              className={`pixel-button px-6 py-3 font-press-start text-sm whitespace-nowrap ${
                activeTab === 'judges'
                  ? 'bg-maximally-red text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              JUDGES
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`pixel-button px-6 py-3 font-press-start text-sm whitespace-nowrap ${
                activeTab === 'timeline'
                  ? 'bg-maximally-red text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              TIMELINE
            </button>
            <button
              onClick={() => setActiveTab('tracks')}
              className={`pixel-button px-6 py-3 font-press-start text-sm whitespace-nowrap ${
                activeTab === 'tracks'
                  ? 'bg-maximally-red text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              TRACKS
            </button>
            <button
              onClick={() => setActiveTab('sponsors')}
              className={`pixel-button px-6 py-3 font-press-start text-sm whitespace-nowrap ${
                activeTab === 'sponsors'
                  ? 'bg-maximally-red text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              SPONSORS
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`pixel-button px-6 py-3 font-press-start text-sm whitespace-nowrap ${
                activeTab === 'feedback'
                  ? 'bg-maximally-red text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              FEEDBACK
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pixel-button px-6 py-3 font-press-start text-sm whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-maximally-red text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              SETTINGS
            </button>
          </div>

          {/* Registrations Tab */}
          {activeTab === 'registrations' && (
            <div className="space-y-6">
              {/* Filters & Actions */}
              <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, email, or registration #"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black border-2 border-gray-700 text-white pl-10 pr-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                      />
                    </div>
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-black border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="waitlist">Waitlist</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={exportToCSV}
                    className="pixel-button bg-maximally-yellow text-black px-6 py-3 font-press-start text-sm hover:bg-maximally-red hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    EXPORT_CSV
                  </button>
                </div>
              </div>

              {/* Registrations List */}
              <div className="space-y-4">
                {filteredRegistrations.length === 0 ? (
                  <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-12 text-center">
                    <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="font-press-start text-gray-400">NO_REGISTRATIONS_FOUND</p>
                  </div>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="pixel-card bg-gray-900 border-2 border-gray-800 p-6 hover:border-maximally-yellow transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-press-start text-lg text-white">
                              {reg.full_name}
                            </h3>
                            <span className={`px-3 py-1 text-xs font-press-start ${
                              reg.status === 'confirmed' ? 'bg-green-500/20 text-green-500 border border-green-500' :
                              reg.status === 'checked_in' ? 'bg-blue-500/20 text-blue-500 border border-blue-500' :
                              reg.status === 'waitlist' ? 'bg-orange-500/20 text-orange-500 border border-orange-500' :
                              'bg-gray-500/20 text-gray-500 border border-gray-500'
                            }`}>
                              {reg.status.toUpperCase()}
                            </span>
                            {reg.team && (
                              <span className="px-3 py-1 text-xs font-press-start bg-purple-500/20 text-purple-500 border border-purple-500">
                                TEAM: {reg.team.team_name}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-jetbrains text-gray-400">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {reg.email}
                            </div>
                            {reg.phone_number && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {reg.phone_number}
                              </div>
                            )}
                            {reg.college_university && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {reg.college_university}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {new Date(reg.created_at).toLocaleDateString()}
                            </div>
                          </div>

                          {(reg.github_url || reg.linkedin_url) && (
                            <div className="flex gap-3 mt-3">
                              {reg.github_url && (
                                <a
                                  href={reg.github_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-maximally-yellow transition-colors"
                                >
                                  <Github className="h-5 w-5" />
                                </a>
                              )}
                              {reg.linkedin_url && (
                                <a
                                  href={reg.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-maximally-yellow transition-colors"
                                >
                                  <Linkedin className="h-5 w-5" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="text-xs font-press-start text-gray-500">
                            #{reg.registration_number}
                          </div>
                          {reg.status === 'confirmed' && (
                            <button
                              onClick={async () => {
                                try {
                                  const headers = await getAuthHeaders();
                                  await fetch(`/api/organizer/registrations/${reg.id}/check-in`, {
                                    method: 'POST',
                                    headers
                                  });
                                  fetchData();
                                  toast({ title: "Participant checked in!" });
                                } catch (error) {
                                  toast({ title: "Error", variant: "destructive" });
                                }
                              }}
                              className="pixel-button bg-blue-600 text-white px-4 py-2 font-press-start text-xs hover:bg-blue-700 flex items-center gap-2"
                            >
                              <UserCheck className="h-4 w-4" />
                              CHECK_IN
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Teams Tab */}
          {activeTab === 'teams' && (
            <div className="space-y-4">
              {teams.length === 0 ? (
                <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-12 text-center">
                  <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="font-press-start text-gray-400">NO_TEAMS_FORMED_YET</p>
                </div>
              ) : (
                teams.map((team) => (
                  <div
                    key={team.id}
                    className="pixel-card bg-gray-900 border-2 border-gray-800 p-6 hover:border-maximally-yellow transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-press-start text-lg text-white mb-2">
                          {team.team_name}
                        </h3>
                        <p className="text-sm text-gray-400 font-jetbrains">
                          Team Code: <span className="text-maximally-yellow font-press-start">{team.team_code}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-maximally-yellow font-press-start">
                          {team.members[0]?.count || 0}
                        </div>
                        <div className="text-xs text-gray-400 font-press-start">MEMBERS</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400 font-jetbrains">
                      <Clock className="h-4 w-4" />
                      Created {new Date(team.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && hackathonId && (
            <RegistrationAnalytics hackathonId={parseInt(hackathonId)} />
          )}

          {/* Submissions Tab */}
          {activeTab === 'submissions' && (
            <div className="space-y-4">
              {submissions.length === 0 ? (
                <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-12 text-center">
                  <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="font-press-start text-gray-400">NO_SUBMISSIONS_YET</p>
                </div>
              ) : (
                submissions.map((submission) => (
                  <div key={submission.id} className="pixel-card bg-gray-900 border-2 border-gray-800 p-6 hover:border-maximally-yellow transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-press-start text-lg text-white mb-2">{submission.project_name}</h3>
                        {submission.tagline && (
                          <p className="text-sm text-gray-400 font-jetbrains italic mb-2">"{submission.tagline}"</p>
                        )}
                        <p className="text-sm text-gray-300 font-jetbrains mb-3">{submission.description}</p>
                        
                        {submission.technologies_used && submission.technologies_used.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {submission.technologies_used.map((tech: string, i: number) => (
                              <span key={i} className="text-xs bg-gray-800 border border-gray-700 px-2 py-1 text-gray-400 font-jetbrains">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mb-3">
                          {submission.github_repo && (
                            <a href={submission.github_repo} target="_blank" rel="noopener noreferrer"
                               className="text-maximally-yellow hover:text-maximally-red text-sm font-jetbrains flex items-center gap-1">
                              <Github className="h-4 w-4" />
                              Code
                            </a>
                          )}
                          {submission.demo_url && (
                            <a href={submission.demo_url} target="_blank" rel="noopener noreferrer"
                               className="text-maximally-yellow hover:text-maximally-red text-sm font-jetbrains flex items-center gap-1">
                              <ExternalLink className="h-4 w-4" />
                              Demo
                            </a>
                          )}
                        </div>

                        <div className="text-xs text-gray-500 font-jetbrains">
                          {submission.team ? `Team: ${submission.team.team_name}` : `By: ${submission.user_name}`}
                        </div>
                      </div>

                      {submission.score && (
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="h-5 w-5 text-maximally-yellow" />
                            <span className="text-2xl font-bold text-maximally-yellow font-press-start">{submission.score}</span>
                          </div>
                          {submission.prize_won && (
                            <span className="px-3 py-1 text-xs font-press-start bg-maximally-yellow/20 text-maximally-yellow border border-maximally-yellow">
                              {submission.prize_won}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && hackathonId && (
            <AnnouncementsManager hackathonId={parseInt(hackathonId)} />
          )}

          {/* Judges Tab */}
          {activeTab === 'judges' && hackathonId && (
            <JudgesManager hackathonId={parseInt(hackathonId)} />
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && hackathonId && (
            <TimelineManager hackathonId={parseInt(hackathonId)} />
          )}

          {/* Tracks Tab */}
          {activeTab === 'tracks' && hackathonId && (
            <OrganizerTracksManager hackathonId={parseInt(hackathonId)} />
          )}

          {/* Sponsors Tab */}
          {activeTab === 'sponsors' && hackathonId && (
            <OrganizerSponsorsManager hackathonId={parseInt(hackathonId)} />
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && hackathonId && (
            <OrganizerFeedbackViewer hackathonId={parseInt(hackathonId)} />
          )}

          {/* Settings Tab - Quick Actions */}
          {activeTab === 'settings' && hackathon && (
            <div className="space-y-6">
              <h2 className="font-press-start text-xl text-maximally-red">HACKATHON_SETTINGS</h2>
              
              {/* Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Registration Status */}
                <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
                  <h3 className="font-press-start text-sm text-gray-400 mb-3">REGISTRATION_STATUS</h3>
                  {(() => {
                    const now = new Date();
                    const regClosed = hackathon.registration_closes_at && new Date(hackathon.registration_closes_at) < now;
                    const regNotOpen = hackathon.registration_opens_at && new Date(hackathon.registration_opens_at) > now;
                    
                    if (regClosed) {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="font-press-start text-red-500 text-sm">CLOSED</span>
                        </div>
                      );
                    }
                    if (regNotOpen) {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="font-press-start text-yellow-500 text-sm">NOT_OPEN</span>
                        </div>
                      );
                    }
                    return (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-press-start text-green-500 text-sm">OPEN</span>
                      </div>
                    );
                  })()}
                  {hackathon.registration_closes_at ? (
                    <p className="text-xs text-gray-500 font-jetbrains mt-2">
                      {new Date(hackathon.registration_closes_at) > new Date() ? 'Closes' : 'Closed'}: {new Date(hackathon.registration_closes_at).toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-xs text-yellow-500 font-jetbrains mt-2">
                      ⚠ No closing date set - will remain open
                    </p>
                  )}
                </div>

                {/* Submission Status */}
                <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
                  <h3 className="font-press-start text-sm text-gray-400 mb-3">SUBMISSION_STATUS</h3>
                  {(() => {
                    const now = new Date();
                    const subClosed = hackathon.submission_closes_at && new Date(hackathon.submission_closes_at) < now;
                    const subNotOpen = hackathon.submission_opens_at && new Date(hackathon.submission_opens_at) > now;
                    
                    if (subClosed) {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="font-press-start text-red-500 text-sm">CLOSED</span>
                        </div>
                      );
                    }
                    if (subNotOpen) {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="font-press-start text-yellow-500 text-sm">NOT_OPEN</span>
                        </div>
                      );
                    }
                    return (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-press-start text-green-500 text-sm">OPEN</span>
                      </div>
                    );
                  })()}
                  {hackathon.submission_closes_at ? (
                    <p className="text-xs text-gray-500 font-jetbrains mt-2">
                      {new Date(hackathon.submission_closes_at) > new Date() ? 'Closes' : 'Closed'}: {new Date(hackathon.submission_closes_at).toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-xs text-yellow-500 font-jetbrains mt-2">
                      ⚠ No closing date set - will remain open
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
                <h3 className="font-press-start text-lg text-white mb-4">QUICK_ACTIONS</h3>
                
                <div className="pixel-card bg-blue-900/20 border border-blue-500 p-4 mb-4">
                  <p className="font-jetbrains text-blue-400 text-sm">
                    💡 <strong>Automatic Closure:</strong> Registrations and submissions will automatically close based on the dates you set in the Timeline tab. Use the buttons below only for emergency manual closure.
                  </p>
                </div>

                <div className="space-y-4">
                  {(() => {
                    const now = new Date();
                    const regClosed = hackathon.registration_closes_at && new Date(hackathon.registration_closes_at) < now;
                    const hasRegDate = hackathon.registration_closes_at;
                    
                    if (regClosed) {
                      return (
                        <div className="pixel-card bg-gray-800 border border-gray-700 px-6 py-3 text-center">
                          <span className="font-press-start text-sm text-gray-500">REGISTRATIONS_ALREADY_CLOSED</span>
                        </div>
                      );
                    }

                    if (hasRegDate) {
                      return (
                        <div className="pixel-card bg-gray-800 border border-green-700 px-6 py-3">
                          <p className="font-jetbrains text-green-400 text-sm text-center">
                            ✓ Registrations will auto-close on {new Date(hackathon.registration_closes_at!).toLocaleString()}
                          </p>
                          <button
                            onClick={async () => {
                              if (!confirm('Are you sure you want to close registrations immediately? This will override the scheduled closing time.')) return;
                              try {
                                const headers = await getAuthHeaders();
                                await fetch(`/api/organizer/hackathons/${hackathonId}/settings`, {
                                  method: 'PATCH',
                                  headers,
                                  body: JSON.stringify({
                                    registration_closes_at: new Date().toISOString()
                                  })
                                });
                                toast({ title: "Registrations Closed Immediately!" });
                                fetchData();
                              } catch (error) {
                                toast({ title: "Error", variant: "destructive" });
                              }
                            }}
                            className="pixel-button bg-orange-600 text-white px-4 py-2 font-press-start text-xs hover:bg-orange-700 w-full mt-2"
                          >
                            EMERGENCY_CLOSE_NOW
                          </button>
                        </div>
                      );
                    }
                    
                    return (
                      <div>
                        <div className="pixel-card bg-yellow-900/20 border border-yellow-500 px-4 py-2 mb-2">
                          <p className="font-jetbrains text-yellow-400 text-xs">
                            ⚠ No closing date set in Timeline. Set one there or close manually here.
                          </p>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const headers = await getAuthHeaders();
                              await fetch(`/api/organizer/hackathons/${hackathonId}/settings`, {
                                method: 'PATCH',
                                headers,
                                body: JSON.stringify({
                                  registration_closes_at: new Date().toISOString()
                                })
                              });
                              toast({ title: "Registrations Closed!" });
                              fetchData();
                            } catch (error) {
                              toast({ title: "Error", variant: "destructive" });
                            }
                          }}
                          className="pixel-button bg-orange-600 text-white px-6 py-3 font-press-start text-sm hover:bg-orange-700 w-full"
                        >
                          CLOSE_REGISTRATIONS_NOW
                        </button>
                      </div>
                    );
                  })()}

                  {(() => {
                    const now = new Date();
                    const subClosed = hackathon.submission_closes_at && new Date(hackathon.submission_closes_at) < now;
                    const hasSubDate = hackathon.submission_closes_at;
                    
                    if (subClosed) {
                      return (
                        <div className="pixel-card bg-gray-800 border border-gray-700 px-6 py-3 text-center">
                          <span className="font-press-start text-sm text-gray-500">SUBMISSIONS_ALREADY_CLOSED</span>
                        </div>
                      );
                    }

                    if (hasSubDate) {
                      return (
                        <div className="pixel-card bg-gray-800 border border-green-700 px-6 py-3">
                          <p className="font-jetbrains text-green-400 text-sm text-center">
                            ✓ Submissions will auto-close on {new Date(hackathon.submission_closes_at!).toLocaleString()}
                          </p>
                          <button
                            onClick={async () => {
                              if (!confirm('Are you sure you want to close submissions immediately? This will override the scheduled closing time.')) return;
                              try {
                                const headers = await getAuthHeaders();
                                await fetch(`/api/organizer/hackathons/${hackathonId}/settings`, {
                                  method: 'PATCH',
                                  headers,
                                  body: JSON.stringify({
                                    submission_closes_at: new Date().toISOString()
                                  })
                                });
                                toast({ title: "Submissions Closed Immediately!" });
                                fetchData();
                              } catch (error) {
                                toast({ title: "Error", variant: "destructive" });
                              }
                            }}
                            className="pixel-button bg-red-600 text-white px-4 py-2 font-press-start text-xs hover:bg-red-700 w-full mt-2"
                          >
                            EMERGENCY_CLOSE_NOW
                          </button>
                        </div>
                      );
                    }
                    
                    return (
                      <div>
                        <div className="pixel-card bg-yellow-900/20 border border-yellow-500 px-4 py-2 mb-2">
                          <p className="font-jetbrains text-yellow-400 text-xs">
                            ⚠ No closing date set in Timeline. Set one there or close manually here.
                          </p>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const headers = await getAuthHeaders();
                              await fetch(`/api/organizer/hackathons/${hackathonId}/settings`, {
                                method: 'PATCH',
                                headers,
                                body: JSON.stringify({
                                  submission_closes_at: new Date().toISOString()
                                })
                              });
                              toast({ title: "Submissions Closed!" });
                              fetchData();
                            } catch (error) {
                              toast({ title: "Error", variant: "destructive" });
                            }
                          }}
                          className="pixel-button bg-red-600 text-white px-6 py-3 font-press-start text-sm hover:bg-red-700 w-full"
                        >
                          CLOSE_SUBMISSIONS_NOW
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
