/**
 * MentorDashboard - Production-ready dashboard for mentors to manage their mentorship activities
 * Fully integrated with Supabase database and real API endpoints
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface MentorData {
  id: string;
  user_id: string;
  skills: string[];
  status: 'available' | 'in_session' | 'offline';
  availability: any[];
  total_mentorship_hours: number;
  max_concurrent_teams: number;
  booking_url: string | null;
  is_active: boolean;
}

interface MentorshipSession {
  id: string;
  team_id: string | null;
  problem_description: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  duration_minutes: number | null;
  created_at: string;
  started_at: string | null;
  ended_at: string | null;
  session_type: string;
  team_name?: string;
}

interface HackathonInvitation {
  id: string;
  hackathon_name: string;
  organizer_name: string;
  status: 'pending' | 'accepted' | 'declined';
  invited_at: string;
  hackathon_date: string;
}

interface HelpInboxItem {
  id: string;
  session_id: string;
  read_at: string | null;
  created_at: string;
  mentorship_sessions?: {
    problem_description: string;
    status: string;
    team_id: number | null;
    requested_time: string | null;
  } | null;
}

export default function MentorDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [mentorData, setMentorData] = useState<MentorData | null>(null);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [invitations, setInvitations] = useState<HackathonInvitation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [bookingUrlEdit, setBookingUrlEdit] = useState('');
  const [maxConcurrentEdit, setMaxConcurrentEdit] = useState('3');
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [helpInbox, setHelpInbox] = useState<{ unread_count: number; items: HelpInboxItem[] } | null>(null);

  // Check if user has mentor role
  const isMentor = profile?.role === 'mentor' || profile?.role === 'admin';

  useEffect(() => {
    if (!authLoading && user && isMentor) {
      loadMentorData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading, user, isMentor]);

  useEffect(() => {
    if (!mentorData) return;
    setBookingUrlEdit(mentorData.booking_url ?? '');
    setMaxConcurrentEdit(String(mentorData.max_concurrent_teams ?? 3));
  }, [mentorData]);

  const loadMentorData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token
      const token = localStorage.getItem('sb-session') || sessionStorage.getItem('sb-session');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const parsedToken = JSON.parse(token);
      const accessToken = parsedToken.access_token;

      if (!accessToken) {
        throw new Error('No access token found');
      }

      // Fetch mentor data
      const mentorResponse = await fetch('/api/mentors/current', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!mentorResponse.ok) {
        throw new Error('Failed to fetch mentor data');
      }

      const mentorResult = await mentorResponse.json();
      setMentorData(mentorResult);

      // Fetch mentor sessions
      const sessionsResponse = await fetch(`/api/mentors/${mentorResult.id}/sessions`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (sessionsResponse.ok) {
        const sessionsResult = await sessionsResponse.json();
        setSessions(sessionsResult.sessions || []);
      }

      const inboxRes = await fetch('/api/mentors/current/help-inbox', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (inboxRes.ok) {
        const inboxJson = await inboxRes.json();
        setHelpInbox({
          unread_count: inboxJson.unread_count ?? 0,
          items: inboxJson.items ?? [],
        });
      } else {
        setHelpInbox({ unread_count: 0, items: [] });
      }

      // Fetch hackathon invitations (mock for now - would need real API)
      // setInvitations([]);

    } catch (err: any) {
      console.error('Error loading mentor data:', err);
      setError(err.message || 'Failed to load mentor data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSession = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('sb-session') || sessionStorage.getItem('sb-session');
      if (!token) return;

      const parsedToken = JSON.parse(token);
      const accessToken = parsedToken.access_token;

      const response = await fetch(`/api/mentors/sessions/${sessionId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Session accepted successfully!');
        loadMentorData(); // Refresh data
      } else {
        toast.error('Failed to accept session');
      }
    } catch (err) {
      toast.error('Error accepting session');
    }
  };

  const handleDeclineSession = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('sb-session') || sessionStorage.getItem('sb-session');
      if (!token) return;

      const parsedToken = JSON.parse(token);
      const accessToken = parsedToken.access_token;

      const response = await fetch(`/api/mentors/sessions/${sessionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Session declined');
        loadMentorData(); // Refresh data
      } else {
        toast.error('Failed to decline session');
      }
    } catch (err) {
      toast.error('Error declining session');
    }
  };

  const handleCompleteSession = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('sb-session') || sessionStorage.getItem('sb-session');
      if (!token) return;

      const parsedToken = JSON.parse(token);
      const accessToken = parsedToken.access_token;

      const response = await fetch(`/api/mentors/sessions/${sessionId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Session completed! Duration: ${result.duration_minutes} minutes`);
        loadMentorData(); // Refresh data
      } else {
        toast.error('Failed to complete session');
      }
    } catch (err) {
      toast.error('Error completing session');
    }
  };

  const handleSaveMentorSettings = async () => {
    if (!mentorData) return;
    const maxN = Number(maxConcurrentEdit);
    if (!Number.isFinite(maxN) || maxN < 1 || maxN > 50) {
      toast.error('Max concurrent teams must be between 1 and 50.');
      return;
    }

    try {
      const token = localStorage.getItem('sb-session') || sessionStorage.getItem('sb-session');
      if (!token) {
        toast.error('Not signed in');
        return;
      }
      const accessToken = JSON.parse(token).access_token as string | undefined;
      if (!accessToken) {
        toast.error('No access token found');
        return;
      }

      setSettingsSaving(true);
      const res = await fetch(`/api/mentors/${mentorData.id}/settings`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_url: bookingUrlEdit.trim() === '' ? null : bookingUrlEdit.trim(),
          max_concurrent_teams: Math.floor(maxN),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.message ?? `Save failed (${res.status})`);
      }
      toast.success('Mentor settings saved.');
      await loadMentorData();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save settings');
    } finally {
      setSettingsSaving(false);
    }
  };

  const markHelpInboxRead = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('sb-session') || sessionStorage.getItem('sb-session');
      if (!token) return;
      const accessToken = JSON.parse(token).access_token as string | undefined;
      if (!accessToken) return;

      const res = await fetch(`/api/mentors/current/help-inbox/${sessionId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) await loadMentorData();
    } catch {
      toast.error('Could not update inbox');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please Log In</h1>
          <p className="text-muted-foreground">You need to be logged in to access the mentor dashboard.</p>
        </div>
      </div>
    );
  }

  if (!isMentor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You need mentor privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadMentorData}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!mentorData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Mentor Profile Not Found</h1>
          <p className="text-muted-foreground">Your mentor profile hasn't been set up yet.</p>
        </div>
      </div>
    );
  }

  const completedSessions = sessions.filter(s => s.status === 'completed');
  const pendingSessions = sessions.filter(s => s.status === 'pending');
  const activeSessions = sessions.filter(s => s.status === 'active');
  const totalHoursThisMonth = completedSessions
    .filter(s => new Date(s.created_at).getMonth() === new Date().getMonth())
    .reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / 60;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mentor Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {profile?.full_name || user.email}!</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              mentorData.status === 'available' ? 'bg-green-500' : 
              mentorData.status === 'in_session' ? 'bg-yellow-500' : 'bg-gray-500'
            }`}></div>
            <span className="text-sm capitalize">{mentorData.status.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Hours</h3>
          <div className="text-2xl font-bold text-foreground">{mentorData.total_mentorship_hours}h</div>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">This Month</h3>
          <div className="text-2xl font-bold text-foreground">{totalHoursThisMonth.toFixed(1)}h</div>
          <p className="text-xs text-muted-foreground mt-1">{completedSessions.filter(s => new Date(s.created_at).getMonth() === new Date().getMonth()).length} sessions</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Pending Requests</h3>
          <div className="text-2xl font-bold text-foreground">{pendingSessions.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Sessions</h3>
          <div className="text-2xl font-bold text-foreground">{activeSessions.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Currently mentoring</p>
        </div>
      </div>

      {helpInbox && helpInbox.unread_count > 0 && (
        <div className="mb-6 p-4 rounded-lg border border-orange-500/40 bg-orange-950/20 text-sm">
          <p className="font-medium text-foreground mb-3">
            You have {helpInbox.unread_count} new in-app help request alert(s).
          </p>
          <ul className="space-y-2">
            {helpInbox.items
              .filter((i) => !i.read_at)
              .slice(0, 6)
              .map((i) => (
                <li
                  key={i.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-muted-foreground border border-border rounded-md p-3"
                >
                  <span className="line-clamp-2 flex-1">
                    {i.mentorship_sessions?.problem_description ?? 'New mentorship request'}
                  </span>
                  <Button type="button" variant="outline" size="sm" onClick={() => markHelpInboxRead(i.session_id)}>
                    Mark read
                  </Button>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'sessions', label: 'Sessions' },
            { id: 'availability', label: 'Availability' },
            { id: 'profile', label: 'Profile' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Sessions */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Sessions</h3>
              <div className="space-y-4">
                {completedSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex items-start space-x-3 p-3 bg-secondary/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Team Session</h4>
                      <p className="text-sm text-muted-foreground mt-1">{session.problem_description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span>{session.duration_minutes} minutes</span>
                        <span>{new Date(session.created_at).toLocaleDateString()}</span>
                        <span className="capitalize">{session.session_type}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {completedSessions.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No completed sessions yet</p>
                )}
              </div>
            </div>

            {/* Skills & Expertise */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {mentorData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{profile?.bio || 'No bio available'}</p>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-6">
            {/* Pending Sessions */}
            {pendingSessions.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Pending Requests</h3>
                <div className="space-y-4">
                  {pendingSessions.map((session) => (
                    <div key={session.id} className="flex items-start justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">Mentorship Request</h4>
                        <p className="text-sm text-muted-foreground mt-1">{session.problem_description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span>Requested: {new Date(session.created_at).toLocaleDateString()}</span>
                          <span className="capitalize">{session.session_type}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button 
                          size="sm" 
                          onClick={() => handleAcceptSession(session.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => handleDeclineSession(session.id)}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Sessions */}
            {activeSessions.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Active Sessions</h3>
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="flex items-start justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">Active Session</h4>
                        <p className="text-sm text-muted-foreground mt-1">{session.problem_description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span>Started: {session.started_at ? new Date(session.started_at).toLocaleString() : 'Just now'}</span>
                          <span className="capitalize">{session.session_type}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button 
                          size="sm" 
                          onClick={() => handleCompleteSession(session.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Complete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Sessions */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Completed Sessions</h3>
              <div className="space-y-4">
                {completedSessions.map((session) => (
                  <div key={session.id} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Completed Session</h4>
                      <p className="text-sm text-muted-foreground mt-1">{session.problem_description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span>Duration: {session.duration_minutes} minutes</span>
                        <span>Date: {new Date(session.created_at).toLocaleDateString()}</span>
                        <span className="capitalize">{session.session_type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        +{Math.ceil((session.duration_minutes || 0) / 60)}h
                      </div>
                    </div>
                  </div>
                ))}
                {completedSessions.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No completed sessions yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-1">Availability Schedule</h3>
            <p className="text-sm text-muted-foreground mb-6">Set your weekly availability. Participants will see these slots when requesting mentorship.</p>

            {/* Status toggle */}
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg mb-6">
              <div>
                <p className="font-medium text-foreground">Current Status</p>
                <p className="text-sm text-muted-foreground">Toggle your availability for new requests</p>
              </div>
              <div className="flex gap-2">
                {(['available', 'in_session', 'offline'] as const).map(s => (
                  <button
                    key={s}
                    onClick={async () => {
                      const token = localStorage.getItem('sb-session') || sessionStorage.getItem('sb-session');
                      if (!token) return;
                      const accessToken = JSON.parse(token).access_token;
                      await fetch('/api/mentors/current/profile', {
                        method: 'PATCH',
                        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: s })
                      });
                      await loadMentorData();
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors ${
                      mentorData.status === s
                        ? s === 'available' ? 'bg-green-600 text-white' : s === 'in_session' ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-white'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Existing slots */}
            <div className="space-y-2 mb-6">
              <h4 className="font-medium text-foreground">Your Slots ({(mentorData.availability || []).length})</h4>
              {(mentorData.availability || []).length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-lg">No availability slots set yet. Add slots below.</p>
              )}
              {(mentorData.availability || []).map((slot: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-medium capitalize text-foreground w-24">{slot.day}</span>
                    <span className="text-muted-foreground">{slot.start_time} – {slot.end_time}</span>
                    <span className="text-xs text-muted-foreground">({slot.timezone || 'UTC'})</span>
                  </div>
                  <button
                    onClick={async () => {
                      const newSlots = (mentorData.availability || []).filter((_: any, idx: number) => idx !== i);
                      const token = localStorage.getItem('sb-session') || sessionStorage.getItem('sb-session');
                      if (!token) return;
                      const accessToken = JSON.parse(token).access_token;
                      await fetch('/api/mentors/current/profile', {
                        method: 'PATCH',
                        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ availability: newSlots })
                      });
                      await loadMentorData();
                    }}
                    className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Add slot form */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-foreground">Add Time Slot</h4>
              <AvailabilitySlotForm onAdd={async (slot) => {
                const newSlots = [...(mentorData.availability || []), slot];
                const token = localStorage.getItem('sb-session') || sessionStorage.getItem('sb-session');
                if (!token) return;
                const accessToken = JSON.parse(token).access_token;
                await fetch('/api/mentors/current/profile', {
                  method: 'PATCH',
                  headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                  body: JSON.stringify({ availability: newSlots })
                });
                await loadMentorData();
              }} />
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <MentorProfileEditor mentorData={mentorData} profile={profile} user={user} onSaved={loadMentorData} />
        )}
      </div>
    </div>
  );
}

// ─── AvailabilitySlotForm ─────────────────────────────────────────────────────
function AvailabilitySlotForm({ onAdd }: { onAdd: (slot: any) => Promise<void> }) {
  const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timezone, setTimezone] = useState('IST');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!day || !startTime || !endTime) { toast.error('Fill in day, start time, and end time'); return; }
    setSaving(true);
    try {
      await onAdd({ day, start_time: startTime, end_time: endTime, timezone });
      setDay(''); setStartTime(''); setEndTime('');
      toast.success('Slot added');
    } catch { toast.error('Failed to add slot'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Day</label>
          <select
            value={day}
            onChange={e => setDay(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select day</option>
            {DAYS.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Timezone</label>
          <Input value={timezone} onChange={e => setTimezone(e.target.value)} placeholder="IST" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Start Time</label>
          <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="[color-scheme:dark]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">End Time</label>
          <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="[color-scheme:dark]" />
        </div>
      </div>
      <Button onClick={handleAdd} disabled={saving} className="w-full">
        {saving ? 'Adding…' : '+ Add Slot'}
      </Button>
    </div>
  );
}

// ─── MentorProfileEditor ──────────────────────────────────────────────────────
function MentorProfileEditor({ mentorData, profile, user, onSaved }: { mentorData: any; profile: any; user: any; onSaved: () => Promise<void> }) {
  const [bio, setBio] = useState(profile?.bio || '');
  const [bookingUrl, setBookingUrl] = useState(mentorData.booking_url || '');
  const [maxTeams, setMaxTeams] = useState(String(mentorData.max_concurrent_teams || 3));
  const [skills, setSkills] = useState<string[]>(mentorData.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  const getToken = () => {
    const raw = localStorage.getItem('sb-session') || sessionStorage.getItem('sb-session');
    if (!raw) return null;
    try { return JSON.parse(raw).access_token; } catch { return null; }
  };

  const handleSave = async () => {
    const token = getToken();
    if (!token) { toast.error('Not authenticated'); return; }
    const n = Number(maxTeams);
    if (!Number.isFinite(n) || n < 1 || n > 50) { toast.error('Max teams must be 1–50'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/mentors/current/profile', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, booking_url: bookingUrl.trim() || null, max_concurrent_teams: Math.floor(n), skills })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Save failed');
      toast.success('Profile saved');
      await onSaved();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) { setSkills(prev => [...prev, s]); setNewSkill(''); }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Edit Mentor Profile</h3>
      <p className="text-sm text-muted-foreground -mt-4">Changes are reflected on your public mentor gallery profile.</p>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
        <Textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Tell participants about yourself, your expertise, and how you can help..." />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Booking URL</label>
        <Input type="url" value={bookingUrl} onChange={e => setBookingUrl(e.target.value)} placeholder="https://cal.com/your-handle" />
        <p className="text-xs text-muted-foreground mt-1">Participants can book time directly via this link.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Max Concurrent Teams (1–50)</label>
        <Input type="number" min={1} max={50} value={maxTeams} onChange={e => setMaxTeams(e.target.value)} className="w-32" />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Skills</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              {s}
              <button onClick={() => setSkills(prev => prev.filter((_, idx) => idx !== i))} className="ml-1 text-primary/60 hover:text-primary">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add skill (e.g. React, ML, Design)" onKeyDown={e => e.key === 'Enter' && addSkill()} />
          <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
          <div className="px-3 py-2 border border-border rounded-md bg-secondary/50 text-foreground text-sm">{profile?.full_name || 'Not set'}</div>
          <p className="text-xs text-muted-foreground mt-1">Edit via your main profile page.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Email</label>
          <div className="px-3 py-2 border border-border rounded-md bg-secondary/50 text-foreground text-sm">{user?.email}</div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? 'Saving…' : 'Save Profile'}
      </Button>
    </div>
  );
}
