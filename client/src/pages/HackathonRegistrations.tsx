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
  Star,
  MoreVertical,
  Ban,
  UserMinus,
  CheckSquare,
  Square,
  Trash2,
  X,
  Eye,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';
import RegistrationAnalytics from '@/components/RegistrationAnalytics';
import AnnouncementsManager from '@/components/AnnouncementsManager';
import JudgesManager from '@/components/JudgesManager';
import OrganizerFeedbackViewer from '@/components/OrganizerFeedbackViewer';
import WinnersManager from '@/components/WinnersManager';
import CertificateGenerator from '@/components/CertificateGenerator';
import OrganizerInsights from '@/components/OrganizerInsights';

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

interface UserRole {
  isOwner: boolean;
  role: string;
  permissions: {
    can_view_registrations: boolean;
    can_manage_registrations: boolean;
    can_view_teams: boolean;
    can_manage_teams: boolean;
    can_view_submissions: boolean;
    can_manage_submissions: boolean;
    can_view_judges: boolean;
    can_manage_judges: boolean;
    can_view_announcements: boolean;
    can_manage_announcements: boolean;
    can_view_analytics: boolean;
    can_view_insights: boolean;
    can_view_feedback: boolean;
    can_view_winners: boolean;
    can_manage_winners: boolean;
    can_view_certificates: boolean;
    can_manage_certificates: boolean;
    can_view_settings: boolean;
    can_manage_settings: boolean;
  };
}

export default function HackathonRegistrations() {
  const { hackathonId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [hackathon, setHackathon] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'registrations' | 'teams' | 'submissions' | 'analytics' | 'announcements' | 'judges' | 'winners' | 'timeline' | 'settings' | 'feedback' | 'certificates' | 'insights'>('registrations');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRegistrations, setSelectedRegistrations] = useState<number[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showParticipantMenu, setShowParticipantMenu] = useState<number | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [registrationControl, setRegistrationControl] = useState<'auto' | 'open' | 'closed'>('auto');
  const [buildingControl, setBuildingControl] = useState<'auto' | 'open' | 'closed'>('auto');
  const [submissionControl, setSubmissionControl] = useState<'auto' | 'open' | 'closed'>('auto');
  const [judgingControl, setJudgingControl] = useState<'auto' | 'open' | 'closed'>('auto');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  useEffect(() => {
    if (hackathonId) {
      fetchData();
    }
  }, [hackathonId]);

  const fetchData = async () => {
    try {
      const headers = await getAuthHeaders();
      
      // First fetch user role to know what data to fetch
      const roleResponse = await fetch(`/api/organizer/hackathons/${hackathonId}/my-role`, { headers });
      const roleData = await roleResponse.json();
      
      if (roleData.success) {
        setUserRole(roleData.data);
        
        // Set initial active tab based on permissions
        const perms = roleData.data.permissions;
        if (roleData.data.isOwner || perms.can_view_registrations) {
          setActiveTab('registrations');
        } else if (perms.can_view_submissions) {
          setActiveTab('submissions');
        } else if (perms.can_view_analytics) {
          setActiveTab('analytics');
        }
      }
      
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

      if (regData.success) setRegistrations(regData.data || []);
      if (teamsData.success) setTeams(teamsData.data || []);
      if (submissionsData.success) setSubmissions(submissionsData.data || []);
      if (hackathonData.success) {
        setHackathon(hackathonData.data);
        // Load period controls from hackathon data
        if (hackathonData.data.registration_control) setRegistrationControl(hackathonData.data.registration_control);
        if (hackathonData.data.building_control) setBuildingControl(hackathonData.data.building_control);
        if (hackathonData.data.submission_control) setSubmissionControl(hackathonData.data.submission_control);
        if (hackathonData.data.judging_control) setJudgingControl(hackathonData.data.judging_control);
      }
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

  // Helper to check if user has a specific permission
  const hasPermission = (permission: keyof UserRole['permissions']) => {
    if (!userRole) return false;
    if (userRole.isOwner) return true;
    return userRole.permissions?.[permission] === true;
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

  // Toggle selection for a single registration
  const toggleSelection = (regId: number) => {
    setSelectedRegistrations(prev => 
      prev.includes(regId) 
        ? prev.filter(id => id !== regId)
        : [...prev, regId]
    );
  };

  // Select/deselect all visible registrations
  const toggleSelectAll = () => {
    if (selectedRegistrations.length === filteredRegistrations.length) {
      setSelectedRegistrations([]);
    } else {
      setSelectedRegistrations(filteredRegistrations.map(r => r.id));
    }
  };

  // Bulk check-in
  const handleBulkCheckIn = async () => {
    if (selectedRegistrations.length === 0) return;
    setBulkActionLoading(true);
    try {
      const headers = await getAuthHeaders();
      const results = await Promise.all(
        selectedRegistrations.map(regId =>
          fetch(`/api/organizer/registrations/${regId}/check-in`, {
            method: 'POST',
            headers
          })
        )
      );
      const successCount = results.filter(r => r.ok).length;
      toast({
        title: "Bulk Check-in Complete",
        description: `${successCount} of ${selectedRegistrations.length} participants checked in`,
      });
      setSelectedRegistrations([]);
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to check in participants", variant: "destructive" });
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Save period control to database
  const savePeriodControl = async (controlType: string, value: 'auto' | 'open' | 'closed') => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/period-control`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [controlType]: value })
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Period control updated" });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update period control", variant: "destructive" });
    }
  };

  // Bulk unregister
  const handleBulkUnregister = async () => {
    if (selectedRegistrations.length === 0) return;
    if (!confirm(`Are you sure you want to unregister ${selectedRegistrations.length} participants?`)) return;
    setBulkActionLoading(true);
    try {
      const headers = await getAuthHeaders();
      const results = await Promise.all(
        selectedRegistrations.map(regId =>
          fetch(`/api/organizer/registrations/${regId}/unregister`, {
            method: 'POST',
            headers
          })
        )
      );
      const successCount = results.filter(r => r.ok).length;
      toast({
        title: "Bulk Unregister Complete",
        description: `${successCount} of ${selectedRegistrations.length} participants unregistered`,
      });
      setSelectedRegistrations([]);
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to unregister participants", variant: "destructive" });
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Single participant actions
  const handleUnregister = async (regId: number) => {
    if (!confirm('Are you sure you want to unregister this participant?')) return;
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/registrations/${regId}/unregister`, {
        method: 'POST',
        headers
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Participant unregistered" });
        fetchData();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setShowParticipantMenu(null);
  };

  const handleBlockUser = async (regId: number, userId: string) => {
    if (!confirm('Are you sure you want to block this user from this hackathon? They will be unregistered and cannot re-register.')) return;
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/block-user`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ user_id: userId, registration_id: regId })
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "User blocked", description: "User has been blocked from this hackathon" });
        fetchData();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setShowParticipantMenu(null);
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
      <div className="min-h-screen bg-black text-white relative">
        <div className="fixed inset-0 bg-black pointer-events-none" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
        <div className="relative z-10 pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto animate-pulse space-y-8">
              {/* Header skeleton */}
              <div className="space-y-4">
                <div className="h-4 w-32 bg-purple-900/30 rounded"></div>
                <div className="h-10 w-80 bg-purple-900/30 rounded"></div>
                <div className="h-4 w-96 bg-gray-800/50 rounded"></div>
              </div>

              {/* Stats skeleton */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-4">
                    <div className="h-8 w-12 bg-purple-900/30 rounded mb-2"></div>
                    <div className="h-3 w-16 bg-gray-800/50 rounded"></div>
                  </div>
                ))}
              </div>

              {/* Tabs skeleton */}
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-12 w-32 bg-gray-800/50 border border-gray-700 rounded"></div>
                ))}
              </div>

              {/* Content skeleton */}
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-6">
                    <div className="h-6 w-48 bg-gray-800 rounded mb-4"></div>
                    <div className="h-4 w-full bg-gray-800 rounded mb-2"></div>
                    <div className="h-4 w-3/4 bg-gray-800 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-black pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950/20 via-transparent to-pink-950/20 pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[250px] h-[250px] bg-pink-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link 
                to="/organizer/dashboard"
                className="text-purple-400 hover:text-pink-400 font-press-start text-sm mb-4 inline-flex items-center gap-2 transition-colors"
              >
                ← BACK_TO_DASHBOARD
              </Link>
              <h1 className="font-press-start text-3xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                MANAGE_HACKATHON
              </h1>
              <p className="text-gray-400 font-jetbrains">
                Manage participants, teams, judges, and announcements for your hackathon
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-500/30 p-4 hover:border-purple-400/50 transition-all">
                <div className="text-2xl font-bold text-purple-300 mb-1 font-press-start">
                  {stats.total}
                </div>
                <div className="text-xs text-gray-500 font-press-start">TOTAL</div>
              </div>
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/20 border border-green-500/30 p-4 hover:border-green-400/50 transition-all">
                <div className="text-2xl font-bold text-green-300 mb-1 font-press-start">
                  {stats.confirmed}
                </div>
                <div className="text-xs text-gray-500 font-press-start">CONFIRMED</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/20 border border-cyan-500/30 p-4 hover:border-cyan-400/50 transition-all">
                <div className="text-2xl font-bold text-cyan-300 mb-1 font-press-start">
                  {stats.checkedIn}
                </div>
                <div className="text-xs text-gray-500 font-press-start">CHECKED_IN</div>
              </div>
              <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/20 border border-amber-500/30 p-4 hover:border-amber-400/50 transition-all">
                <div className="text-2xl font-bold text-amber-300 mb-1 font-press-start">
                  {stats.waitlist}
                </div>
                <div className="text-xs text-gray-500 font-press-start">WAITLIST</div>
              </div>
              <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/20 border border-pink-500/30 p-4 hover:border-pink-400/50 transition-all">
                <div className="text-2xl font-bold text-pink-300 mb-1 font-press-start">
                  {stats.teams}
                </div>
                <div className="text-xs text-gray-500 font-press-start">TEAMS</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { id: 'registrations', label: 'REGISTRATIONS', permission: 'can_view_registrations' },
                { id: 'teams', label: 'TEAMS', permission: 'can_view_teams' },
                { id: 'submissions', label: 'SUBMISSIONS', permission: 'can_view_submissions' },
                { id: 'analytics', label: 'ANALYTICS', permission: 'can_view_analytics' },
                { id: 'insights', label: 'INSIGHTS', permission: 'can_view_insights' },
                { id: 'announcements', label: 'ANNOUNCEMENTS', permission: 'can_view_announcements' },
                { id: 'judges', label: 'JUDGES', permission: 'can_view_judges' },
                { id: 'feedback', label: 'FEEDBACK', permission: 'can_view_feedback' },
                { id: 'winners', label: 'WINNERS', permission: 'can_view_winners' },
                { id: 'certificates', label: 'CERTIFICATES', permission: 'can_view_certificates' },
                { id: 'settings', label: 'SETTINGS', permission: 'can_view_settings' },
              ].filter(tab => {
                // Filter tabs based on user permissions
                if (!userRole) return false;
                if (userRole.isOwner) return true;
                return userRole.permissions?.[tab.permission as keyof UserRole['permissions']] === true;
              }).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 font-press-start text-xs whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 text-purple-200'
                      : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          {/* Registrations Tab */}
          {activeTab === 'registrations' && (
            <div className="space-y-6">
              {/* Filters & Actions */}
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, email, or registration #"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/50 border border-purple-500/30 text-white pl-10 pr-4 py-3 font-jetbrains focus:border-purple-400 outline-none"
                      />
                    </div>
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="waitlist">Waitlist</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={exportToCSV}
                    className="bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white px-6 py-3 font-press-start text-xs transition-all flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    EXPORT_CSV
                  </button>
                </div>
              </div>

              {/* Bulk Actions Bar */}
              {selectedRegistrations.length > 0 && (
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-500/10 border border-purple-500/50 p-4">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <CheckSquare className="h-5 w-5 text-purple-400" />
                      <span className="font-press-start text-sm text-white">
                        {selectedRegistrations.length} SELECTED
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleBulkCheckIn}
                        disabled={bulkActionLoading}
                        className="bg-gradient-to-r from-cyan-600/40 to-blue-500/30 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 px-4 py-2 font-press-start text-xs flex items-center gap-2 disabled:opacity-50 transition-all"
                      >
                        <UserCheck className="h-4 w-4" />
                        BULK_CHECK_IN
                      </button>
                      <button
                        onClick={handleBulkUnregister}
                        disabled={bulkActionLoading}
                        className="bg-gradient-to-r from-red-600/40 to-rose-500/30 border border-red-500/50 hover:border-red-400 text-red-200 px-4 py-2 font-press-start text-xs flex items-center gap-2 disabled:opacity-50 transition-all"
                      >
                        <UserMinus className="h-4 w-4" />
                        BULK_UNREGISTER
                      </button>
                      <button
                        onClick={() => setSelectedRegistrations([])}
                        className="bg-gray-800/50 border border-gray-700 text-gray-300 hover:text-white px-4 py-2 font-press-start text-xs hover:border-gray-600 transition-all"
                      >
                        CLEAR
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Select All Header */}
              <div className="flex items-center gap-3 px-2">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  {selectedRegistrations.length === filteredRegistrations.length && filteredRegistrations.length > 0 ? (
                    <CheckSquare className="h-5 w-5 text-maximally-yellow" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                  <span className="font-jetbrains text-sm">
                    {selectedRegistrations.length === filteredRegistrations.length && filteredRegistrations.length > 0
                      ? 'Deselect All'
                      : 'Select All'}
                  </span>
                </button>
                <span className="text-gray-500 font-jetbrains text-sm">
                  ({filteredRegistrations.length} participants)
                </span>
              </div>

              {/* Registrations List */}
              <div className="space-y-4">
                {filteredRegistrations.length === 0 ? (
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-12 text-center">
                    <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="font-press-start text-gray-400">NO_REGISTRATIONS_FOUND</p>
                  </div>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <div
                      key={reg.id}
                      className={`bg-gradient-to-br from-gray-900/60 to-gray-900/30 border p-6 transition-all ${
                        selectedRegistrations.includes(reg.id) 
                          ? 'border-purple-500/50 bg-purple-500/5' 
                          : 'border-gray-700 hover:border-purple-500/30'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleSelection(reg.id)}
                          className="flex-shrink-0"
                        >
                          {selectedRegistrations.includes(reg.id) ? (
                            <CheckSquare className="h-6 w-6 text-maximally-yellow" />
                          ) : (
                            <Square className="h-6 w-6 text-gray-600 hover:text-gray-400" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-press-start text-lg text-white">
                              {reg.full_name}
                            </h3>
                            <span className={`px-3 py-1 text-xs font-press-start ${
                              reg.status === 'confirmed' ? 'bg-green-500/20 text-green-500 border border-green-500' :
                              reg.status === 'checked_in' ? 'bg-blue-500/20 text-blue-500 border border-blue-500' :
                              reg.status === 'waitlist' ? 'bg-orange-500/20 text-orange-500 border border-orange-500' :
                              reg.status === 'cancelled' ? 'bg-red-500/20 text-red-500 border border-red-500' :
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
                                  className="text-gray-400 hover:text-purple-400 transition-colors"
                                >
                                  <Github className="h-5 w-5" />
                                </a>
                              )}
                              {reg.linkedin_url && (
                                <a
                                  href={reg.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-purple-400 transition-colors"
                                >
                                  <Linkedin className="h-5 w-5" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                          <div className="text-xs font-press-start text-gray-500">
                            #{reg.registration_number}
                          </div>
                          
                          <div className="flex items-center gap-2">
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
                                className="bg-gradient-to-r from-cyan-600/40 to-blue-500/30 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 px-4 py-2 font-press-start text-xs flex items-center gap-2 transition-all"
                              >
                                <UserCheck className="h-4 w-4" />
                                CHECK_IN
                              </button>
                            )}

                            {/* Actions Menu */}
                            <div className="relative">
                              <button
                                onClick={() => setShowParticipantMenu(showParticipantMenu === reg.id ? null : reg.id)}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                              >
                                <MoreVertical className="h-5 w-5" />
                              </button>

                              {showParticipantMenu === reg.id && (
                                <div className="absolute right-0 top-full mt-1 bg-gray-900/95 border border-purple-500/30 shadow-lg z-50 min-w-[180px] backdrop-blur-sm">
                                  {reg.status !== 'cancelled' && (
                                    <button
                                      onClick={() => handleUnregister(reg.id)}
                                      className="w-full px-4 py-3 text-left text-sm font-jetbrains text-amber-400 hover:bg-purple-500/10 flex items-center gap-2 transition-colors"
                                    >
                                      <UserMinus className="h-4 w-4" />
                                      Unregister
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleBlockUser(reg.id, reg.user_id)}
                                    className="w-full px-4 py-3 text-left text-sm font-jetbrains text-red-400 hover:bg-gray-800 flex items-center gap-2"
                                  >
                                    <Ban className="h-4 w-4" />
                                    Block User
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
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
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-12 text-center">
                  <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="font-press-start text-gray-400">NO_TEAMS_FORMED_YET</p>
                </div>
              ) : (
                teams.map((team) => (
                  <div
                    key={team.id}
                    className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-6 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-press-start text-lg text-white mb-2">
                          {team.team_name}
                        </h3>
                        <p className="text-sm text-gray-400 font-jetbrains">
                          Team Code: <span className="text-purple-400 font-press-start">{team.team_code}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-300 font-press-start">
                          {team.members[0]?.count || 0}
                        </div>
                        <div className="text-xs text-gray-500 font-press-start">MEMBERS</div>
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
              {/* Track-wise Scoring Analytics */}
              {submissions.length > 0 && (() => {
                // Get unique tracks from submissions
                const trackStats = submissions.reduce((acc: any, sub: any) => {
                  const track = sub.track || 'No Track';
                  if (!acc[track]) {
                    acc[track] = { count: 0, scored: 0, totalScore: 0, avgScore: 0 };
                  }
                  acc[track].count++;
                  if (sub.average_score || sub.score) {
                    acc[track].scored++;
                    acc[track].totalScore += parseFloat(sub.average_score || sub.score);
                  }
                  return acc;
                }, {});
                
                // Calculate averages
                Object.keys(trackStats).forEach(track => {
                  if (trackStats[track].scored > 0) {
                    trackStats[track].avgScore = (trackStats[track].totalScore / trackStats[track].scored).toFixed(1);
                  }
                });

                const tracks = Object.keys(trackStats);
                if (tracks.length <= 1 && tracks[0] === 'No Track') return null;

                return (
                  <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/10 border border-purple-500/30 p-6 mb-6">
                    <h3 className="font-press-start text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                      TRACK-WISE SCORING SUMMARY
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tracks.map(track => (
                        <div key={track} className="bg-black/30 border border-gray-700 p-4 hover:border-purple-500/50 transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-press-start text-xs text-cyan-400 truncate max-w-[150px]" title={track}>
                              {track.toUpperCase()}
                            </span>
                            {trackStats[track].avgScore > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-amber-400" />
                                <span className="font-press-start text-sm text-amber-300">{trackStats[track].avgScore}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-400 font-jetbrains">
                            <span>{trackStats[track].count} submissions</span>
                            <span>{trackStats[track].scored} scored</span>
                          </div>
                          {trackStats[track].count > 0 && (
                            <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                                style={{ width: `${(trackStats[track].scored / trackStats[track].count) * 100}%` }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {submissions.length === 0 ? (
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-12 text-center">
                  <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="font-press-start text-gray-400">NO_SUBMISSIONS_YET</p>
                </div>
              ) : (
                submissions.map((submission) => (
                  <div key={submission.id} className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-6 hover:border-purple-500/30 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          {submission.project_logo && (
                            <img src={submission.project_logo} alt="" className="w-12 h-12 object-contain rounded border border-gray-700" />
                          )}
                          <div>
                            <h3 className="font-press-start text-lg text-white">{submission.project_name}</h3>
                            {submission.tagline && (
                              <p className="text-sm text-gray-400 font-jetbrains italic">"{submission.tagline}"</p>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-300 font-jetbrains mb-3 line-clamp-2">{submission.description}</p>
                        
                        {submission.technologies_used && submission.technologies_used.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {submission.technologies_used.slice(0, 4).map((tech: string, i: number) => (
                              <span key={i} className="text-xs bg-gray-800 border border-gray-700 px-2 py-1 text-gray-400 font-jetbrains">
                                {tech}
                              </span>
                            ))}
                            {submission.technologies_used.length > 4 && (
                              <span className="text-xs text-gray-500">+{submission.technologies_used.length - 4}</span>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3 mb-3">
                          {submission.github_repo && (
                            <a href={submission.github_repo} target="_blank" rel="noopener noreferrer"
                               className="text-purple-400 hover:text-pink-400 text-sm font-jetbrains flex items-center gap-1 transition-colors">
                              <Github className="h-4 w-4" />
                              Code
                            </a>
                          )}
                          {submission.demo_url && (
                            <a href={submission.demo_url} target="_blank" rel="noopener noreferrer"
                               className="text-cyan-400 hover:text-cyan-300 text-sm font-jetbrains flex items-center gap-1 transition-colors">
                              <ExternalLink className="h-4 w-4" />
                              Demo
                            </a>
                          )}
                        </div>

                        <div className="text-xs text-gray-500 font-jetbrains">
                          {submission.team ? `Team: ${submission.team.team_name}` : `By: ${submission.user_name}`}
                          {submission.track && (
                            <span className="ml-2 px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded">
                              {submission.track}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Scores Section */}
                      <div className="flex-shrink-0 min-w-[200px]">
                        {/* Average Score */}
                        <div className="text-right mb-3">
                          {(submission.average_score || submission.score) ? (
                            <>
                              <div className="flex items-center justify-end gap-2">
                                <Star className="h-5 w-5 text-amber-400" />
                                <span className="text-2xl font-bold text-amber-300 font-press-start">
                                  {submission.average_score || submission.score}
                                </span>
                              </div>
                              {submission.judges_count > 0 && (
                                <p className="text-xs text-gray-500 font-jetbrains">
                                  avg from {submission.judges_count} judge{submission.judges_count !== 1 ? 's' : ''}
                                </p>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-gray-500 font-jetbrains">Not scored yet</span>
                          )}
                        </div>

                        {/* Prize Badge */}
                        {submission.prize_won && (
                          <div className="text-right mb-3">
                            <span className="px-3 py-1 text-xs font-press-start bg-amber-500/20 text-amber-300 border border-amber-500/50">
                              {submission.prize_won}
                            </span>
                          </div>
                        )}

                        {/* View Details Button - always show for scored submissions */}
                        {(submission.average_score || submission.score) && (
                          <div className="text-right mb-3">
                            <button
                              onClick={() => setSelectedSubmission(submission)}
                              className="bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 px-3 py-2 text-xs font-press-start flex items-center gap-2 ml-auto transition-all"
                            >
                              <Eye className="h-4 w-4" /> DETAILS
                            </button>
                          </div>
                        )}

                        {/* Individual Judge Scores */}
                        {submission.judge_scores && submission.judge_scores.length > 0 && (
                          <div className="bg-gray-800/50 border border-gray-700 p-3 rounded">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs text-gray-400 font-press-start">JUDGE_SCORES</p>
                              <button
                                onClick={() => setSelectedSubmission(submission)}
                                className="text-xs text-maximally-yellow hover:text-maximally-red font-jetbrains flex items-center gap-1"
                              >
                                <Eye className="h-3 w-3" /> Details
                              </button>
                            </div>
                            <div className="space-y-2">
                              {submission.judge_scores.slice(0, 3).map((js: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between text-xs">
                                  <span className="text-gray-400 font-jetbrains truncate max-w-[100px]" title={js.judge_name}>
                                    {js.judge_name}
                                  </span>
                                  <span className="text-maximally-yellow font-press-start">{js.score}</span>
                                </div>
                              ))}
                              {submission.judge_scores.length > 3 && (
                                <button
                                  onClick={() => setSelectedSubmission(submission)}
                                  className="text-xs text-gray-500 hover:text-purple-400 font-jetbrains transition-colors"
                                >
                                  +{submission.judge_scores.length - 3} more judges...
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Submission Details Modal */}
              {selectedSubmission && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-purple-500/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-purple-900/50 to-pink-900/30 border-b border-purple-500/30 p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-press-start text-lg text-white">{selectedSubmission.project_name}</h3>
                        <p className="text-sm text-gray-400 font-jetbrains">
                          {selectedSubmission.team ? `Team: ${selectedSubmission.team.team_name}` : `By: ${selectedSubmission.user_name}`}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedSubmission(null)}
                        className="text-gray-400 hover:text-pink-400 p-2 transition-colors"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6">
                      {/* Overall Score */}
                      <div className="text-center p-4 bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-500/30">
                        <p className="text-xs text-gray-400 font-press-start mb-2">AVERAGE_SCORE</p>
                        <div className="flex items-center justify-center gap-2">
                          <Star className="h-8 w-8 text-amber-400" />
                          <span className="text-4xl font-bold text-amber-300 font-press-start">
                            {selectedSubmission.average_score || selectedSubmission.score || 'N/A'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-jetbrains mt-2">
                          from {selectedSubmission.judges_count || 0} judge{selectedSubmission.judges_count !== 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Individual Judge Scores */}
                      <div>
                        <h4 className="font-press-start text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">SCORES_BY_JUDGE</h4>
                        {selectedSubmission.judge_scores && selectedSubmission.judge_scores.length > 0 ? (
                          <div className="space-y-4">
                            {selectedSubmission.judge_scores.map((js: any, idx: number) => (
                              <div key={idx} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-purple-500/20 p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                      <span className="text-white font-press-start text-sm">
                                        {js.judge_name?.charAt(0)?.toUpperCase() || 'J'}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="text-white font-jetbrains font-medium">{js.judge_name}</p>
                                      <p className="text-xs text-gray-500 font-jetbrains">
                                        Scored on {new Date(js.scored_at).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-2xl font-bold text-amber-300 font-press-start">{js.score}</span>
                                    <span className="text-gray-500 font-jetbrains">/100</span>
                                  </div>
                                </div>
                                
                                {/* Criteria Scores if available */}
                                {js.criteria_scores && (
                                  <div className="mt-3 pt-3 border-t border-gray-700">
                                    <p className="text-xs text-gray-400 font-press-start mb-2">CRITERIA_BREAKDOWN</p>
                                    <div className="grid grid-cols-2 gap-2">
                                      {Object.entries(js.criteria_scores).map(([criterion, score]: [string, any]) => (
                                        <div key={criterion} className="flex items-center justify-between text-xs">
                                          <span className="text-gray-400 font-jetbrains capitalize">{criterion}</span>
                                          <span className="text-white font-jetbrains">{score}/20</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Judge Notes */}
                                {js.notes && (
                                  <div className="mt-3 pt-3 border-t border-gray-700">
                                    <p className="text-xs text-gray-400 font-press-start mb-2">NOTES</p>
                                    <p className="text-sm text-gray-300 font-jetbrains">{js.notes}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500 font-jetbrains">
                            No judge scores yet
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="sticky bottom-0 bg-gradient-to-r from-gray-900 to-gray-950 border-t border-purple-500/30 p-4">
                      <button
                        onClick={() => setSelectedSubmission(null)}
                        className="w-full bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white px-4 py-3 font-press-start text-sm transition-all"
                      >
                        CLOSE
                      </button>
                    </div>
                  </div>
                </div>
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

          {/* Feedback Tab */}
          {activeTab === 'feedback' && hackathonId && (
            <OrganizerFeedbackViewer hackathonId={parseInt(hackathonId)} />
          )}

          {/* Winners Tab */}
          {activeTab === 'winners' && hackathonId && hackathon && (
            <WinnersManager 
              hackathonId={parseInt(hackathonId)} 
              prizes={hackathon.prize_breakdown || []}
              onWinnersAnnounced={() => fetchData()}
            />
          )}

          {/* Settings Tab - Period Controls */}
          {activeTab === 'settings' && hackathon && (
            <div className="space-y-6">
              <h2 className="font-press-start text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">PERIOD_CONTROLS</h2>
              <p className="text-gray-400 font-jetbrains text-sm mb-6">
                Control when registrations, submissions, and judging are open. Use AUTO to follow timeline dates.
              </p>
              
              {/* Registration Period Control */}
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-press-start text-lg text-white mb-2">REGISTRATION_PERIOD</h3>
                    {hackathon.registration_opens_at && hackathon.registration_closes_at && (
                      <p className="text-xs text-gray-500 font-jetbrains">
                        Timeline: {new Date(hackathon.registration_opens_at).toLocaleDateString()} - {new Date(hackathon.registration_closes_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {(() => {
                    const now = new Date();
                    const regClosed = hackathon.registration_closes_at && new Date(hackathon.registration_closes_at) < now;
                    const regNotOpen = hackathon.registration_opens_at && new Date(hackathon.registration_opens_at) > now;
                    
                    if (registrationControl === 'closed') {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="font-press-start text-red-500 text-sm">CLOSED</span>
                        </div>
                      );
                    }
                    if (registrationControl === 'open') {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="font-press-start text-green-500 text-sm">OPEN</span>
                        </div>
                      );
                    }
                    // Auto mode
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
                </div>

                {/* Toggle Control */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() => { setRegistrationControl('closed'); savePeriodControl('registration_control', 'closed'); }}
                    className={`px-6 py-3 font-press-start text-xs transition-all ${
                      registrationControl === 'closed'
                        ? 'bg-gradient-to-r from-red-600/60 to-red-500/40 text-white border border-red-400/50'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    CLOSED
                  </button>
                  <button
                    onClick={() => { setRegistrationControl('auto'); savePeriodControl('registration_control', 'auto'); }}
                    className={`px-6 py-3 font-press-start text-xs transition-all ${
                      registrationControl === 'auto'
                        ? 'bg-gradient-to-r from-blue-600/60 to-cyan-500/40 text-white border border-blue-400/50'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    AUTO
                  </button>
                  <button
                    onClick={() => { setRegistrationControl('open'); savePeriodControl('registration_control', 'open'); }}
                    className={`px-6 py-3 font-press-start text-xs transition-all ${
                      registrationControl === 'open'
                        ? 'bg-gradient-to-r from-green-600/60 to-emerald-500/40 text-white border border-green-400/50'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    OPEN
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 font-jetbrains">
                    {registrationControl === 'auto' && '⚙️ Following timeline dates'}
                    {registrationControl === 'open' && '🟢 Force open - ignoring timeline'}
                    {registrationControl === 'closed' && '🔴 Force closed - ignoring timeline'}
                  </p>
                </div>
              </div>

              {/* Building Phase Control */}
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-orange-500/30 p-6 hover:border-orange-400/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-press-start text-lg text-white mb-2">BUILDING_PHASE</h3>
                    <p className="text-xs text-gray-400 font-jetbrains mb-1">Hacking time - no submissions allowed</p>
                    {hackathon.building_starts_at && hackathon.building_ends_at && (
                      <p className="text-xs text-gray-500 font-jetbrains">
                        Timeline: {new Date(hackathon.building_starts_at).toLocaleDateString()} - {new Date(hackathon.building_ends_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {(() => {
                    const now = new Date();
                    const buildingEnded = hackathon.building_ends_at && new Date(hackathon.building_ends_at) < now;
                    const buildingNotStarted = hackathon.building_starts_at && new Date(hackathon.building_starts_at) > now;
                    
                    if (buildingControl === 'closed') {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="font-press-start text-red-500 text-sm">ENDED</span>
                        </div>
                      );
                    }
                    if (buildingControl === 'open') {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                          <span className="font-press-start text-orange-500 text-sm">ACTIVE</span>
                        </div>
                      );
                    }
                    // Auto mode
                    if (buildingEnded) {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          <span className="font-press-start text-gray-500 text-sm">ENDED</span>
                        </div>
                      );
                    }
                    if (buildingNotStarted) {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="font-press-start text-yellow-500 text-sm">NOT_STARTED</span>
                        </div>
                      );
                    }
                    return (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="font-press-start text-orange-500 text-sm">ACTIVE</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Toggle Control */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() => { setBuildingControl('closed'); savePeriodControl('building_control', 'closed'); }}
                    className={`px-6 py-3 font-press-start text-xs transition-all ${
                      buildingControl === 'closed'
                        ? 'bg-gradient-to-r from-red-600/60 to-red-500/40 text-white border border-red-400/50'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    ENDED
                  </button>
                  <button
                    onClick={() => { setBuildingControl('auto'); savePeriodControl('building_control', 'auto'); }}
                    className={`px-6 py-3 font-press-start text-xs transition-all ${
                      buildingControl === 'auto'
                        ? 'bg-gradient-to-r from-blue-600/60 to-cyan-500/40 text-white border border-blue-400/50'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    AUTO
                  </button>
                  <button
                    onClick={() => { setBuildingControl('open'); savePeriodControl('building_control', 'open'); }}
                    className={`px-6 py-3 font-press-start text-xs transition-all ${
                      buildingControl === 'open'
                        ? 'bg-gradient-to-r from-orange-600/60 to-amber-500/40 text-white border border-orange-400/50'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    ACTIVE
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 font-jetbrains">
                    {buildingControl === 'auto' && '⚙️ Following timeline dates'}
                    {buildingControl === 'open' && '🟠 Force active - participants are building'}
                    {buildingControl === 'closed' && '⚫ Force ended - building phase complete'}
                  </p>
                </div>
              </div>

              {/* Submission Period Control */}
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-green-500/30 p-6 hover:border-green-400/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-press-start text-lg text-white mb-2">SUBMISSION_PERIOD</h3>
                    {hackathon.submission_opens_at && hackathon.submission_closes_at && (
                      <p className="text-xs text-gray-500 font-jetbrains">
                        Timeline: {new Date(hackathon.submission_opens_at).toLocaleDateString()} - {new Date(hackathon.submission_closes_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {(() => {
                    const now = new Date();
                    const subClosed = hackathon.submission_closes_at && new Date(hackathon.submission_closes_at) < now;
                    const subNotOpen = hackathon.submission_opens_at && new Date(hackathon.submission_opens_at) > now;
                    
                    if (submissionControl === 'closed') {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="font-press-start text-red-500 text-sm">CLOSED</span>
                        </div>
                      );
                    }
                    if (submissionControl === 'open') {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="font-press-start text-green-500 text-sm">OPEN</span>
                        </div>
                      );
                    }
                    // Auto mode
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
                </div>

                {/* Toggle Control */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() => { setSubmissionControl('closed'); savePeriodControl('submission_control', 'closed'); }}
                    className={`px-6 py-3 font-press-start text-xs transition-all ${
                      submissionControl === 'closed'
                        ? 'bg-gradient-to-r from-red-600/60 to-red-500/40 text-white border border-red-400/50'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    CLOSED
                  </button>
                  <button
                    onClick={() => { setSubmissionControl('auto'); savePeriodControl('submission_control', 'auto'); }}
                    className={`px-6 py-3 font-press-start text-xs transition-all ${
                      submissionControl === 'auto'
                        ? 'bg-gradient-to-r from-blue-600/60 to-cyan-500/40 text-white border border-blue-400/50'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    AUTO
                  </button>
                  <button
                    onClick={() => { setSubmissionControl('open'); savePeriodControl('submission_control', 'open'); }}
                    className={`px-6 py-3 font-press-start text-xs transition-all ${
                      submissionControl === 'open'
                        ? 'bg-gradient-to-r from-green-600/60 to-emerald-500/40 text-white border border-green-400/50'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    OPEN
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 font-jetbrains">
                    {submissionControl === 'auto' && '⚙️ Following timeline dates'}
                    {submissionControl === 'open' && '🟢 Force open - ignoring timeline'}
                    {submissionControl === 'closed' && '🔴 Force closed - ignoring timeline'}
                  </p>
                </div>
              </div>

              {/* Judging Period Control */}
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-cyan-500/30 p-6 hover:border-cyan-400/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-press-start text-lg text-white mb-2">JUDGING_PERIOD</h3>
                    {hackathon.judging_starts_at && hackathon.judging_ends_at && (
                      <p className="text-xs text-gray-500 font-jetbrains">
                        Timeline: {new Date(hackathon.judging_starts_at).toLocaleDateString()} - {new Date(hackathon.judging_ends_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {(() => {
                    const now = new Date();
                    const judgingClosed = hackathon.judging_ends_at && new Date(hackathon.judging_ends_at) < now;
                    const judgingNotOpen = hackathon.judging_starts_at && new Date(hackathon.judging_starts_at) > now;
                    
                    if (judgingControl === 'closed') {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="font-press-start text-red-500 text-sm">CLOSED</span>
                        </div>
                      );
                    }
                    if (judgingControl === 'open') {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="font-press-start text-green-500 text-sm">OPEN</span>
                        </div>
                      );
                    }
                    // Auto mode
                    if (judgingClosed) {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="font-press-start text-red-500 text-sm">CLOSED</span>
                        </div>
                      );
                    }
                    if (judgingNotOpen) {
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
                </div>

                {/* Toggle Control */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() => { setJudgingControl('closed'); savePeriodControl('judging_control', 'closed'); }}
                    className={`px-6 py-3 font-press-start text-xs transition-all ${
                      judgingControl === 'closed'
                        ? 'bg-gradient-to-r from-red-600/60 to-red-500/40 text-white border border-red-400/50'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    CLOSED
                  </button>
                  <button
                    onClick={() => { setJudgingControl('auto'); savePeriodControl('judging_control', 'auto'); }}
                    className={`px-6 py-3 font-press-start text-xs transition-all ${
                      judgingControl === 'auto'
                        ? 'bg-gradient-to-r from-blue-600/60 to-cyan-500/40 text-white border border-blue-400/50'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    AUTO
                  </button>
                  <button
                    onClick={() => { setJudgingControl('open'); savePeriodControl('judging_control', 'open'); }}
                    className={`px-6 py-3 font-press-start text-xs transition-all ${
                      judgingControl === 'open'
                        ? 'bg-gradient-to-r from-green-600/60 to-emerald-500/40 text-white border border-green-400/50'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    OPEN
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 font-jetbrains">
                    {judgingControl === 'auto' && '⚙️ Following timeline dates'}
                    {judgingControl === 'open' && '🟢 Force open - ignoring timeline'}
                    {judgingControl === 'closed' && '🔴 Force closed - ignoring timeline'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && hackathon && (
            <CertificateGenerator 
              hackathonId={hackathon.id} 
              hackathonName={hackathon.hackathon_name} 
            />
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && hackathon && (
            <OrganizerInsights hackathonId={hackathon.id} />
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
