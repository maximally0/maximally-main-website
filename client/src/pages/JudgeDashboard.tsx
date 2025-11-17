import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Award, 
  Calendar, 
  Users, 
  Clock, 
  Plus, 
  Edit3, 
  Eye, 
  Star, 
  Trophy, 
  Target,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Settings,
  LogOut,
  Shield,
  Crown,
  Flame,
  Mail
} from 'lucide-react';
import { useJudgeUnreadCount } from '@/hooks/useJudgeUnreadCount';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import AddEventModal from '@/components/judges/AddEventModal';
import EditEventModal from '@/components/judges/EditEventModal';
import PixelLoader from '@/components/PixelLoader';
import JudgeInvitations from '@/components/JudgeInvitations';
import { getAuthToken, getAuthHeaders } from '@/lib/auth';

interface JudgeProfile {
  id: string;
  username: string;
  fullName: string;
  profilePhoto?: string;
  headline: string;
  shortBio: string;
  location: string;
  currentRole: string;
  company: string;
  tier: 'starter' | 'verified' | 'senior' | 'chief' | 'legacy';
  totalEventsJudged: number;
  totalTeamsEvaluated: number;
  totalMentorshipHours: number;
  averageFeedbackRating?: number;
  eventsJudgedVerified: boolean;
  teamsEvaluatedVerified: boolean;
  mentorshipHoursVerified: boolean;
  availabilityStatus: 'available' | 'not-available' | 'seasonal';
  primaryExpertise: string[];
  secondaryExpertise: string[];
}

interface JudgeEvent {
  id: string;
  eventName: string;
  role: string;
  date: string;
  link?: string;
  verified: boolean;
}

interface HackathonJudged {
  id: string;
  name: string;
  date: string;
  role: string;
  teamsEvaluated: number;
  hoursSpent: number;
  verified: boolean;
}

interface AssignedHackathon {
  id: number;
  hackathon_name: string;
  slug: string;
  start_date: string;
  end_date: string;
  format: string;
  status: string;
  registrations_count: number;
  submissions_count: number;
}

const JudgeDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, refreshProfile, signOut } = useAuth();
  const [judgeProfile, setJudgeProfile] = useState<JudgeProfile | null>(null);
  const [judgeEvents, setJudgeEvents] = useState<JudgeEvent[]>([]);
  const [hackathonsJudged, setHackathonsJudged] = useState<HackathonJudged[]>([]);
  const [assignedHackathons, setAssignedHackathons] = useState<AssignedHackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'profile' | 'settings' | 'invitations'>('overview');
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<JudgeEvent | null>(null);
  const [addingEvent, setAddingEvent] = useState(false);
  const [editingEventLoading, setEditingEventLoading] = useState(false);
  const { unreadCount } = useJudgeUnreadCount();

  useEffect(() => {
    const fetchJudgeData = async () => {
      // Wait for auth to load
      if (authLoading) return;

      // Check if user is authenticated
      if (!user) {
        navigate('/login');
        return;
      }

      // Wait for profile to load
      if (!profile) {
        
        return;
      }

      // Check if user is a judge
      if (profile.role !== 'judge') {
        
        navigate('/');
        return;
      }

      try {
        // Try to fetch judge profile data first - this will tell us if the user is actually a judge
        const headers = await getAuthHeaders();
        const [profileResponse, hackathonsResponse] = await Promise.all([
          fetch('/api/judge/profile', { headers }),
          fetch('/api/judge/hackathons', { headers })
        ]);

        if (!profileResponse.ok) {
          if (profileResponse.status === 401) {
            navigate('/login');
            return;
          }
          if (profileResponse.status === 403) {
            // Check if profile role is outdated
            
            
            setError('You do not have judge permissions. Please apply to become a judge first. If you recently became a judge, try refreshing the page.');
            return;
          }
          throw new Error('Failed to fetch judge data');
        }

        const data = await profileResponse.json();
        const hackathonsData = await hackathonsResponse.json();
        
        setJudgeProfile(data.profile);
        
        // Map events to correct format
        const mappedEvents = (data.events || []).map((event: any) => ({
          id: event.id,
          eventName: event.event_name || event.eventName,
          role: event.event_role || event.role,
          date: event.event_date || event.date,
          link: event.event_link || event.link,
          verified: event.verified || false
        }));
        
        setJudgeEvents(mappedEvents);
        setHackathonsJudged(mappedEvents.map((event: any) => ({
          id: event.id,
          name: event.eventName,
          date: event.date,
          role: event.role,
          teamsEvaluated: 0,
          hoursSpent: 0,
          verified: event.verified
        })));

        // Set assigned hackathons
        if (hackathonsData.success) {
          setAssignedHackathons(hackathonsData.data || []);
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load judge data');
        setLoading(false);
      }
    };

    fetchJudgeData();
  }, [navigate, user, profile, authLoading]);

  const getTierInfo = (tier: string) => {
    const tierConfig = {
      starter: { 
        label: 'Starter Judge', 
        color: 'text-green-400 border-green-400', 
        icon: <Award className="h-4 w-4" />,
        description: 'Entry-level judge building experience'
      },
      verified: { 
        label: 'Verified Judge', 
        color: 'text-blue-400 border-blue-400', 
        icon: <Shield className="h-4 w-4" />,
        description: 'Experienced judge with proven expertise'
      },
      senior: { 
        label: 'Senior Judge', 
        color: 'text-purple-400 border-purple-400', 
        icon: <Star className="h-4 w-4" />,
        description: 'Established leader with extensive experience'
      },
      chief: { 
        label: 'Chief Judge', 
        color: 'text-yellow-400 border-yellow-400', 
        icon: <Crown className="h-4 w-4" />,
        description: 'Industry leader overseeing judging panels'
      },
      legacy: { 
        label: 'Legacy Judge', 
        color: 'text-red-400 border-red-400', 
        icon: <Flame className="h-4 w-4" />,
        description: 'Distinguished figure with exceptional contributions'
      }
    };
    return tierConfig[tier as keyof typeof tierConfig] || tierConfig.starter;
  };

  const handleAddEvent = () => {
    setShowAddEventModal(true);
  };

  const handleAddEventSubmit = async (eventData: any) => {
    setAddingEvent(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/judge/events', {
        method: 'POST',
        headers,
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error('Failed to add event');
      }

      // Refresh the data
      const updatedHeaders = await getAuthHeaders();
      const updatedResponse = await fetch('/api/judge/profile', {
        headers: updatedHeaders
      });

      if (updatedResponse.ok) {
        const data = await updatedResponse.json();
        setJudgeProfile(data.profile);
        
        // Map events to correct format
        const mappedEvents = (data.events || []).map((event: any) => ({
          id: event.id,
          eventName: event.event_name || event.eventName,
          role: event.event_role || event.role,
          date: event.event_date || event.date,
          link: event.event_link || event.link,
          verified: event.verified || false
        }));
        
        setJudgeEvents(mappedEvents);
        setHackathonsJudged(mappedEvents.map((event: any) => ({
          id: event.id,
          name: event.eventName,
          date: event.date,
          role: event.role,
          teamsEvaluated: 0,
          hoursSpent: 0,
          verified: event.verified
        })));
      }

      setShowAddEventModal(false);
    } catch (err) {
      console.error('Failed to add event:', err);
      setError('Failed to add event. Please try again.');
    } finally {
      setAddingEvent(false);
    }
  };

  const handleEditEvent = (event: JudgeEvent) => {
    setEditingEvent(event);
    setShowEditEventModal(true);
  };

  const handleEditEventSubmit = async (eventId: string, eventData: any) => {
    setEditingEventLoading(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/judge/events/${eventId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          event_name: eventData.eventName,
          event_role: eventData.role,
          event_date: eventData.date,
          event_link: eventData.link || null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      // Refresh the data
      const updatedHeaders = await getAuthHeaders();
      const updatedResponse = await fetch('/api/judge/profile', {
        headers: updatedHeaders
      });

      if (updatedResponse.ok) {
        const data = await updatedResponse.json();
        setJudgeProfile(data.profile);
        
        // Map events to correct format
        const mappedEvents = (data.events || []).map((event: any) => ({
          id: event.id,
          eventName: event.event_name || event.eventName,
          role: event.event_role || event.role,
          date: event.event_date || event.date,
          link: event.event_link || event.link,
          verified: event.verified || false
        }));
        
        setJudgeEvents(mappedEvents);
        setHackathonsJudged(mappedEvents.map((event: any) => ({
          id: event.id,
          name: event.eventName,
          date: event.date,
          role: event.role,
          teamsEvaluated: 0,
          hoursSpent: 0,
          verified: event.verified
        })));
      }

      setShowEditEventModal(false);
      setEditingEvent(null);
    } catch (err) {
      console.error('Failed to update event:', err);
      setError('Failed to update event. Please try again.');
    } finally {
      setEditingEventLoading(false);
    }
  };

  const handleEditProfile = () => {
    // Redirect to regular profile page for editing
    if (profile?.username) {
      navigate(`/profile/${profile.username}`);
    }
  };

  const handleViewPublicProfile = () => {
    if (judgeProfile?.username) {
      navigate(`/judge/${judgeProfile.username}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem('auth_token');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate even if there's an error
      localStorage.removeItem('auth_token');
      navigate('/');
    }
  };

  if (loading || authLoading || (user && !profile)) {
    return (
      <>
        <SEO
          title="Judge Dashboard | Maximally"
          description="Manage your judging profile and track events"
        />
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
          <div className="fixed inset-0 bg-black" />
          <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
          
          <main className="relative z-10 pt-24">
            <div className="container mx-auto px-4 py-8">
              <div className="animate-pulse space-y-8">
                {/* Header skeleton */}
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-8 w-64 bg-gray-800 rounded"></div>
                    <div className="h-4 w-48 bg-gray-800 rounded"></div>
                  </div>
                  <div className="h-10 w-32 bg-gray-800 rounded"></div>
                </div>

                {/* Stats skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="minecraft-block bg-gray-900/50 border-2 border-gray-800 p-6">
                      <div className="h-8 w-8 bg-gray-800 rounded mb-4"></div>
                      <div className="h-8 w-16 bg-gray-800 rounded mb-2"></div>
                      <div className="h-4 w-24 bg-gray-800 rounded"></div>
                    </div>
                  ))}
                </div>

                {/* Content skeleton */}
                <div className="minecraft-block bg-gray-900/50 border-2 border-gray-800 p-6">
                  <div className="h-6 w-48 bg-gray-800 rounded mb-6"></div>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 bg-gray-800 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (error || !judgeProfile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="font-jetbrains text-red-400 mb-6">{error || 'Failed to load judge data'}</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={async () => {
                setError(null);
                setLoading(true);
                await refreshProfile();
                // Retry after refreshing profile
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }}
              className="pixel-button bg-maximally-yellow text-maximally-black px-6 py-2 font-press-start text-sm"
            >
              Refresh Profile & Retry
            </button>
            <button 
              onClick={() => navigate('/')}
              className="pixel-button bg-cyan-600 text-white px-6 py-2 font-press-start text-sm"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tierInfo = getTierInfo(judgeProfile.tier);

  return (
    <>
      <SEO
        title="Judge Dashboard | Maximally"
        description="Manage your judging profile, track events, and mentor the next generation of innovators."
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <main className="relative z-10 pt-24">
          {/* Header */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
              <div>
                <h1 className="font-press-start text-2xl md:text-3xl text-cyan-400 mb-2">
                  JUDGE DASHBOARD
                </h1>
                <p className="font-jetbrains text-gray-300">
                  Welcome back, {judgeProfile.fullName}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`minecraft-block border-2 ${tierInfo.color} px-4 py-2 flex items-center gap-2`}>
                  {tierInfo.icon}
                  <span className="font-press-start text-xs">{tierInfo.label}</span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="pixel-button bg-red-600 text-white px-4 py-2 font-press-start text-xs hover:bg-red-700 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  LOGOUT
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { id: 'overview', label: 'Overview', icon: <Target className="h-4 w-4" /> },
                { id: 'invitations', label: 'Invitations', icon: <Mail className="h-4 w-4" /> },
                { id: 'events', label: 'Events', icon: <Calendar className="h-4 w-4" /> },
                { id: 'profile', label: 'Profile', icon: <Edit3 className="h-4 w-4" /> },
                { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pixel-button px-4 py-2 font-press-start text-xs flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-cyan-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
              
              {/* Inbox Button with Badge */}
              <button
                onClick={() => navigate('/judge-inbox')}
                className="pixel-button px-4 py-2 font-press-start text-xs flex items-center gap-2 bg-gray-800 text-gray-300 hover:bg-gray-700 relative"
              >
                <Mail className="h-4 w-4" />
                INBOX
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-maximally-red text-maximally-yellow text-xs font-press-start px-2 py-0.5 rounded-sm">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="minecraft-block bg-gray-900/50 border-2 border-cyan-400 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Award className="h-8 w-8 text-cyan-400" />
                      {judgeProfile.eventsJudgedVerified && <CheckCircle2 className="h-5 w-5 text-green-400" />}
                    </div>
                    <div className="font-press-start text-2xl text-cyan-400 mb-2">
                      {judgeProfile.totalEventsJudged + assignedHackathons.length}
                    </div>
                    <div className="font-jetbrains text-gray-300 text-sm">Events Judged</div>
                  </div>

                  <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-yellow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="h-8 w-8 text-maximally-yellow" />
                      {judgeProfile.teamsEvaluatedVerified && <CheckCircle2 className="h-5 w-5 text-green-400" />}
                    </div>
                    <div className="font-press-start text-2xl text-maximally-yellow mb-2">
                      {judgeProfile.totalTeamsEvaluated}
                    </div>
                    <div className="font-jetbrains text-gray-300 text-sm">Teams Evaluated</div>
                  </div>

                  <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-red p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Clock className="h-8 w-8 text-maximally-red" />
                      {judgeProfile.mentorshipHoursVerified && <CheckCircle2 className="h-5 w-5 text-green-400" />}
                    </div>
                    <div className="font-press-start text-2xl text-maximally-red mb-2">
                      {judgeProfile.totalMentorshipHours}
                    </div>
                    <div className="font-jetbrains text-gray-300 text-sm">Mentorship Hours</div>
                  </div>

                  <div className="minecraft-block bg-gray-900/50 border-2 border-green-400 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Star className="h-8 w-8 text-green-400" />
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="font-press-start text-2xl text-green-400 mb-2">
                      {judgeProfile.averageFeedbackRating?.toFixed(1) || 'N/A'}
                    </div>
                    <div className="font-jetbrains text-gray-300 text-sm">Avg Rating</div>
                  </div>
                </div>

                {/* Recent Events */}
                <div className="minecraft-block bg-gray-900/50 border-2 border-cyan-400 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-press-start text-xl text-cyan-400">RECENT EVENTS</h2>
                    <button
                      onClick={handleAddEvent}
                      className="pixel-button bg-maximally-yellow text-maximally-black px-4 py-2 font-press-start text-xs flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      <Plus className="h-4 w-4" />
                      ADD EVENT
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Show assigned hackathons first */}
                    {assignedHackathons.slice(0, 3).map((hackathon) => (
                      <div key={`hackathon-${hackathon.id}`} className="minecraft-block bg-gray-800 border-2 border-maximally-yellow p-4 hover:border-cyan-400 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-jetbrains text-white font-bold flex items-center gap-2 mb-1">
                              <a href={`/judge/hackathons/${hackathon.id}/submissions`} className="hover:text-cyan-400 transition-colors">
                                {hackathon.hackathon_name}
                              </a>
                              <span className="px-2 py-0.5 text-xs bg-maximally-yellow/20 text-maximally-yellow border border-maximally-yellow font-press-start">
                                ACTIVE
                              </span>
                            </h3>
                            <p className="font-jetbrains text-gray-400 text-sm">Judge</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 font-jetbrains">
                          <span>{new Date(hackathon.start_date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{hackathon.submissions_count} submissions</span>
                        </div>
                      </div>
                    ))}

                    {/* Then show manual events */}
                    {judgeEvents.slice(0, Math.max(0, 3 - assignedHackathons.length)).map((event) => (
                      <div key={event.id} className="minecraft-block bg-gray-800 border border-gray-600 p-4 hover:border-cyan-400 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-jetbrains text-white font-bold flex items-center gap-2 mb-1">
                              {event.link ? (
                                <a href={event.link} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                                  {event.eventName}
                                </a>
                              ) : (
                                event.eventName
                              )}
                              {event.verified && <CheckCircle2 className="h-4 w-4 text-green-400" />}
                            </h3>
                            <p className="font-jetbrains text-gray-400 text-sm">{event.role}</p>
                          </div>
                        </div>
                        <p className="font-jetbrains text-gray-500 text-xs">{event.date}</p>
                      </div>
                    ))}
                  </div>

                  {(judgeEvents.length + assignedHackathons.length) > 3 && (
                    <div className="text-center mt-4">
                      <button
                        onClick={() => setActiveTab('events')}
                        className="font-jetbrains text-cyan-400 hover:text-cyan-300 text-sm"
                      >
                        View all {judgeEvents.length + assignedHackathons.length} events →
                      </button>
                    </div>
                  )}
                </div>

                {/* Current Tier Status */}
                <div className="minecraft-block bg-gray-900/50 border-2 border-purple-400 p-6">
                  <h2 className="font-press-start text-xl text-purple-400 mb-6">CURRENT TIER</h2>
                  
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      {tierInfo.icon}
                      <span className="font-press-start text-lg text-white">{tierInfo.label}</span>
                    </div>
                    <p className="font-jetbrains text-gray-300 text-sm">{tierInfo.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Invitations Tab */}
            {activeTab === 'invitations' && (
              <JudgeInvitations />
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-press-start text-xl text-cyan-400">ALL JUDGING EVENTS</h2>
                  <button
                    onClick={handleAddEvent}
                    className="pixel-button bg-maximally-yellow text-maximally-black px-4 py-2 font-press-start text-xs flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <Plus className="h-4 w-4" />
                    ADD EVENT
                  </button>
                </div>

                <div className="grid gap-4">
                  {/* Show assigned hackathons */}
                  {assignedHackathons.length > 0 && (
                    <>
                      <h3 className="font-press-start text-lg text-maximally-yellow mt-4">ASSIGNED HACKATHONS</h3>
                      {assignedHackathons.map((hackathon) => (
                        <div key={`hackathon-${hackathon.id}`} className="minecraft-block bg-gray-800 border-2 border-maximally-yellow p-4 hover:border-cyan-400 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-jetbrains text-white font-bold flex items-center gap-2 mb-1">
                                <a href={`/judge/hackathons/${hackathon.id}/submissions`} className="hover:text-cyan-400 transition-colors">
                                  {hackathon.hackathon_name}
                                </a>
                                <span className="px-2 py-0.5 text-xs bg-maximally-yellow/20 text-maximally-yellow border border-maximally-yellow font-press-start">
                                  ACTIVE
                                </span>
                              </h3>
                              <p className="font-jetbrains text-gray-400 text-sm">Judge</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <a 
                                href={`/judge/hackathons/${hackathon.id}/submissions`}
                                className="pixel-button bg-maximally-red text-white px-3 py-2 text-xs hover:bg-maximally-yellow hover:text-black"
                              >
                                VIEW SUBMISSIONS
                              </a>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 font-jetbrains">
                            <span>{new Date(hackathon.start_date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{hackathon.format}</span>
                            <span>•</span>
                            <span>{hackathon.submissions_count} submissions</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Show manual events */}
                  {judgeEvents.length > 0 && (
                    <>
                      <h3 className="font-press-start text-lg text-cyan-400 mt-4">MANUAL EVENTS</h3>
                      {judgeEvents.map((event) => (
                        <div key={event.id} className="minecraft-block bg-gray-800 border border-gray-600 p-4 hover:border-cyan-400 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-jetbrains text-white font-bold flex items-center gap-2 mb-1">
                                {event.link ? (
                                  <a href={event.link} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                                    {event.eventName}
                                  </a>
                                ) : (
                                  event.eventName
                                )}
                                {event.verified ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                                )}
                              </h3>
                              <p className="font-jetbrains text-gray-400 text-sm">{event.role}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleEditEvent(event)}
                                className="pixel-button bg-cyan-600 text-white px-3 py-2 text-xs hover:bg-cyan-700"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <p className="font-jetbrains text-gray-500 text-xs">{event.date}</p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="font-press-start text-xl text-cyan-400">JUDGE PROFILE</h2>
                
                <div className="minecraft-block bg-gray-900/50 border-2 border-cyan-400 p-6">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="minecraft-block bg-gradient-to-br from-cyan-400 to-maximally-blue w-24 h-24 overflow-hidden">
                      {judgeProfile.profilePhoto ? (
                        <img
                          src={judgeProfile.profilePhoto}
                          alt={judgeProfile.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-press-start text-3xl text-white">
                            {judgeProfile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-press-start text-xl text-white mb-2">{judgeProfile.fullName}</h3>
                      <p className="font-jetbrains text-gray-300 mb-2">{judgeProfile.headline}</p>
                      <p className="font-jetbrains text-gray-400 text-sm mb-4">{judgeProfile.location}</p>
                      <div className={`inline-flex items-center gap-2 minecraft-block border ${tierInfo.color} px-3 py-1`}>
                        {tierInfo.icon}
                        <span className="font-press-start text-xs">{tierInfo.label}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleEditProfile}
                        className="pixel-button bg-maximally-yellow text-maximally-black px-4 py-2 font-press-start text-xs hover:scale-105 transition-transform"
                      >
                        EDIT PROFILE
                      </button>
                      <button 
                        onClick={handleViewPublicProfile}
                        className="pixel-button bg-cyan-600 text-white px-4 py-2 font-press-start text-xs hover:scale-105 transition-transform"
                      >
                        VIEW PUBLIC
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-press-start text-sm text-cyan-400 mb-3">PRIMARY EXPERTISE</h4>
                      <div className="flex flex-wrap gap-2">
                        {judgeProfile.primaryExpertise.map((skill, index) => (
                          <span
                            key={index}
                            className="minecraft-block bg-maximally-red/20 border border-maximally-red text-maximally-red px-2 py-1 text-xs font-press-start"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-press-start text-sm text-cyan-400 mb-3">SECONDARY EXPERTISE</h4>
                      <div className="flex flex-wrap gap-2">
                        {judgeProfile.secondaryExpertise.map((skill, index) => (
                          <span
                            key={index}
                            className="minecraft-block bg-gray-700/50 border border-gray-600 text-gray-300 px-2 py-1 text-xs font-press-start"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-press-start text-sm text-cyan-400 mb-3">BIO</h4>
                    <p className="font-jetbrains text-gray-300 leading-relaxed">{judgeProfile.shortBio}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="font-press-start text-xl text-cyan-400">SETTINGS</h2>
                
                <div className="minecraft-block bg-gray-900/50 border-2 border-cyan-400 p-6">
                  <h3 className="font-press-start text-lg text-white mb-4">AVAILABILITY STATUS</h3>
                  <div className="space-y-3">
                    {[
                      { value: 'available', label: 'Available for Judging', color: 'text-green-400' },
                      { value: 'seasonal', label: 'Seasonally Available', color: 'text-yellow-400' },
                      { value: 'not-available', label: 'Not Available', color: 'text-red-400' }
                    ].map((status) => (
                      <label key={status.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="availability"
                          value={status.value}
                          checked={judgeProfile.availabilityStatus === status.value}
                          className="w-4 h-4"
                        />
                        <span className={`font-jetbrains ${status.color}`}>{status.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="minecraft-block bg-gray-900/50 border-2 border-red-400 p-6">
                  <h3 className="font-press-start text-lg text-red-400 mb-4">DANGER ZONE</h3>
                  <p className="font-jetbrains text-gray-300 mb-4">
                    These actions cannot be undone. Please proceed with caution.
                  </p>
                  <button className="pixel-button bg-red-600 text-white px-4 py-2 font-press-start text-xs hover:bg-red-700">
                    DELETE JUDGE PROFILE
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={showAddEventModal}
        onClose={() => setShowAddEventModal(false)}
        onSubmit={handleAddEventSubmit}
        isLoading={addingEvent}
      />

      {/* Edit Event Modal */}
      <EditEventModal
        isOpen={showEditEventModal}
        onClose={() => {
          setShowEditEventModal(false);
          setEditingEvent(null);
        }}
        onSubmit={handleEditEventSubmit}
        isLoading={editingEventLoading}
        event={editingEvent}
      />
    </>
  );
};

export default JudgeDashboard;