/**
 * MentorDashboard - Dark-themed mentor dashboard
 * All existing functionality preserved; styled to match the site's dark theme.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import {
  Loader2, Users, Clock, CheckCircle, Star,
  Calendar, Bell, User, Settings, ChevronRight, Zap
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

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

type Tab = 'overview' | 'sessions' | 'availability' | 'profile';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
  const raw = localStorage.getItem('sb-session') || sessionStorage.getItem('sb-session');
  if (!raw) return null;
  try { return JSON.parse(raw).access_token; } catch { return null; }
}

function StatCard({ label, value, sub, icon: Icon, color = 'orange' }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color?: 'orange' | 'green' | 'yellow' | 'blue';
}) {
  const colors = {
    orange: 'bg-orange-900/20 border-orange-800/40 text-orange-400',
    green:  'bg-green-900/20 border-green-800/40 text-green-400',
    yellow: 'bg-yellow-900/20 border-yellow-800/40 text-yellow-400',
    blue:   'bg-blue-900/20 border-blue-800/40 text-blue-400',
  };
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center border mb-3 ${colors[color]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm font-medium text-gray-300 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MentorDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [mentorData, setMentorData] = useState<MentorData | null>(null);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [helpInbox, setHelpInbox] = useState<{ unread_count: number; items: HelpInboxItem[] } | null>(null);

  const isMentor = profile?.role === 'mentor' || profile?.role === 'admin';

  useEffect(() => {
    if (!authLoading && user && isMentor) loadMentorData();
    else if (!authLoading) setLoading(false);
  }, [authLoading, user, isMentor]);

  const loadMentorData = async () => {
    try {
      setLoading(true);
      setError(null);
      const accessToken = getToken();
      if (!accessToken) throw new Error('No authentication token found');

      const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

      const mentorRes = await fetch('/api/mentors/current', { headers });
      if (!mentorRes.ok) throw new Error('Failed to fetch mentor data');
      const mentorResult = await mentorRes.json();
      setMentorData(mentorResult);

      const sessionsRes = await fetch(`/api/mentors/${mentorResult.id}/sessions`, { headers });
      if (sessionsRes.ok) {
        const sessionsResult = await sessionsRes.json();
        setSessions(sessionsResult.sessions || []);
      }

      const inboxRes = await fetch('/api/mentors/current/help-inbox', { headers });
      if (inboxRes.ok) {
        const inboxJson = await inboxRes.json();
        setHelpInbox({ unread_count: inboxJson.unread_count ?? 0, items: inboxJson.items ?? [] });
      } else {
        setHelpInbox({ unread_count: 0, items: [] });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load mentor data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSession = async (sessionId: string) => {
    const accessToken = getToken();
    if (!accessToken) return;
    const res = await fetch(`/api/mentors/sessions/${sessionId}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    });
    if (res.ok) { toast.success('Session accepted!'); loadMentorData(); }
    else toast.error('Failed to accept session');
  };

  const handleDeclineSession = async (sessionId: string) => {
    const accessToken = getToken();
    if (!accessToken) return;
    const res = await fetch(`/api/mentors/sessions/${sessionId}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    });
    if (res.ok) { toast.success('Session declined'); loadMentorData(); }
    else toast.error('Failed to decline session');
  };

  const handleCompleteSession = async (sessionId: string) => {
    const accessToken = getToken();
    if (!accessToken) return;
    const res = await fetch(`/api/mentors/sessions/${sessionId}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const result = await res.json();
      toast.success(`Session completed! Duration: ${result.duration_minutes} minutes`);
      loadMentorData();
    } else toast.error('Failed to complete session');
  };

  const markHelpInboxRead = async (sessionId: string) => {
    const accessToken = getToken();
    if (!accessToken) return;
    const res = await fetch(`/api/mentors/current/help-inbox/${sessionId}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.ok) loadMentorData();
    else toast.error('Could not update inbox');
  };

  // ── Guards ────────────────────────────────────────────────────────────────

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Please Log In</h1>
          <p className="text-gray-500">You need to be logged in to access the mentor dashboard.</p>
        </div>
      </div>
    );
  }

  if (!isMentor) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-500">You need mentor privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={loadMentorData} className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-lg text-sm font-medium transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!mentorData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Mentor Profile Not Found</h1>
          <p className="text-gray-500">Your mentor profile hasn't been set up yet.</p>
        </div>
      </div>
    );
  }

  const completedSessions = sessions.filter(s => s.status === 'completed');
  const pendingSessions   = sessions.filter(s => s.status === 'pending');
  const activeSessions    = sessions.filter(s => s.status === 'active');
  const totalHoursThisMonth = completedSessions
    .filter(s => new Date(s.created_at).getMonth() === new Date().getMonth())
    .reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / 60;

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview',      label: 'Overview',      icon: Zap },
    { id: 'sessions',      label: 'Sessions',      icon: Users },
    { id: 'availability',  label: 'Availability',  icon: Calendar },
    { id: 'profile',       label: 'Profile',       icon: User },
  ];

  return (
    <>
      <SEO title="Mentor Dashboard — Maximally" description="Manage your mentorship sessions, availability, and profile." />

      <div className="min-h-screen bg-black py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-orange-900/20 rounded-xl flex items-center justify-center border border-orange-800/40">
                <Star className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-space">Mentor Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {profile?.full_name || user.email}</p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
              mentorData.status === 'available'  ? 'bg-green-900/20 border-green-800 text-green-400' :
              mentorData.status === 'in_session' ? 'bg-yellow-900/20 border-yellow-800 text-yellow-400' :
              'bg-gray-800 border-gray-700 text-gray-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                mentorData.status === 'available' ? 'bg-green-400' :
                mentorData.status === 'in_session' ? 'bg-yellow-400' : 'bg-gray-500'
              }`} />
              {mentorData.status.replace('_', ' ')}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Hours" value={`${mentorData.total_mentorship_hours}h`} icon={Clock} color="orange" sub="all time" />
            <StatCard label="This Month" value={`${totalHoursThisMonth.toFixed(1)}h`} icon={Star} color="blue"
              sub={`${completedSessions.filter(s => new Date(s.created_at).getMonth() === new Date().getMonth()).length} sessions`} />
            <StatCard label="Pending Requests" value={pendingSessions.length} icon={Bell} color="yellow" sub="awaiting response" />
            <StatCard label="Active Sessions" value={activeSessions.length} icon={CheckCircle} color="green" sub="currently mentoring" />
          </div>

          {/* Help Inbox Alert */}
          {helpInbox && helpInbox.unread_count > 0 && (
            <div className="mb-6 p-4 rounded-xl border border-orange-500/30 bg-orange-900/10">
              <p className="font-medium text-orange-400 mb-3 text-sm flex items-center gap-2">
                <Bell className="h-4 w-4" />
                {helpInbox.unread_count} new in-app help request alert{helpInbox.unread_count > 1 ? 's' : ''}
              </p>
              <ul className="space-y-2">
                {helpInbox.items.filter(i => !i.read_at).slice(0, 6).map(i => (
                  <li key={i.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gray-900 border border-gray-800 rounded-lg p-3">
                    <span className="line-clamp-2 flex-1 text-sm text-gray-300">
                      {i.mentorship_sessions?.problem_description ?? 'New mentorship request'}
                    </span>
                    <button
                      onClick={() => markHelpInboxRead(i.session_id)}
                      className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg transition-colors font-space shrink-0"
                    >
                      Mark read
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-800 mb-6">
            <nav className="flex gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors font-space ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && (
              <OverviewTab
                completedSessions={completedSessions}
                mentorData={mentorData}
                profile={profile}
                onTabChange={setActiveTab}
              />
            )}
            {activeTab === 'sessions' && (
              <SessionsTab
                pendingSessions={pendingSessions}
                activeSessions={activeSessions}
                completedSessions={completedSessions}
                onAccept={handleAcceptSession}
                onDecline={handleDeclineSession}
                onComplete={handleCompleteSession}
              />
            )}
            {activeTab === 'availability' && (
              <AvailabilityTab mentorData={mentorData} onRefresh={loadMentorData} />
            )}
            {activeTab === 'profile' && (
              <MentorProfileEditor mentorData={mentorData} profile={profile} user={user} onSaved={loadMentorData} />
            )}
          </div>

        </div>
      </div>
    </>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function OverviewTab({ completedSessions, mentorData, profile, onTabChange }: {
  completedSessions: MentorshipSession[];
  mentorData: MentorData;
  profile: any;
  onTabChange: (tab: Tab) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Sessions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider font-space">Recent Sessions</h3>
          <button onClick={() => onTabChange('sessions')} className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
            View all →
          </button>
        </div>
        <div className="space-y-3">
          {completedSessions.slice(0, 3).map(session => (
            <div key={session.id} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">Team Session</p>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{session.problem_description}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-600">
                  <span>{session.duration_minutes} min</span>
                  <span>{new Date(session.created_at).toLocaleDateString()}</span>
                  <span className="capitalize">{session.session_type}</span>
                </div>
              </div>
            </div>
          ))}
          {completedSessions.length === 0 && (
            <p className="text-sm text-gray-600 text-center py-6">No completed sessions yet</p>
          )}
        </div>
      </div>

      {/* Skills & Expertise */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider font-space">Skills & Expertise</h3>
          <button onClick={() => onTabChange('profile')} className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
            Edit →
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {mentorData.skills.map((skill, i) => (
            <span key={i} className="bg-orange-900/20 text-orange-400 border border-orange-800/40 px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
          {mentorData.skills.length === 0 && (
            <span className="text-xs text-gray-600 italic">No skills added yet</span>
          )}
        </div>
        {profile?.bio && (
          <p className="text-sm text-gray-400 line-clamp-3">{profile.bio}</p>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Sessions ────────────────────────────────────────────────────────────

function SessionsTab({ pendingSessions, activeSessions, completedSessions, onAccept, onDecline, onComplete }: {
  pendingSessions: MentorshipSession[];
  activeSessions: MentorshipSession[];
  completedSessions: MentorshipSession[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onComplete: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Pending */}
      {pendingSessions.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 font-space flex items-center gap-2">
            <Bell className="h-4 w-4 text-yellow-400" /> Pending Requests ({pendingSessions.length})
          </h2>
          <div className="space-y-3">
            {pendingSessions.map(session => (
              <div key={session.id} className="bg-yellow-900/10 border border-yellow-800/40 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Mentorship Request</p>
                    <p className="text-sm text-gray-400 mt-1">{session.problem_description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                      <span>Requested: {new Date(session.created_at).toLocaleDateString()}</span>
                      <span className="capitalize">{session.session_type}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => onAccept(session.id)}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded-lg transition-colors font-space"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onDecline(session.id)}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded-lg transition-colors font-space"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Active */}
      {activeSessions.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 font-space flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-400" /> Active Sessions ({activeSessions.length})
          </h2>
          <div className="space-y-3">
            {activeSessions.map(session => (
              <div key={session.id} className="bg-blue-900/10 border border-blue-800/40 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Active Session</p>
                    <p className="text-sm text-gray-400 mt-1">{session.problem_description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                      <span>Started: {session.started_at ? new Date(session.started_at).toLocaleString() : 'Just now'}</span>
                      <span className="capitalize">{session.session_type}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onComplete(session.id)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors font-space shrink-0"
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 font-space flex items-center gap-2">
          <Star className="h-4 w-4 text-green-400" /> Completed Sessions ({completedSessions.length})
        </h2>
        {completedSessions.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-xl">
            <p className="text-sm text-gray-600">No completed sessions yet</p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <ul className="divide-y divide-gray-800">
              {completedSessions.map(session => (
                <li key={session.id} className="flex items-start gap-3 px-5 py-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">Completed Session</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{session.problem_description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-600">
                      <span>Duration: {session.duration_minutes} min</span>
                      <span>Date: {new Date(session.created_at).toLocaleDateString()}</span>
                      <span className="capitalize">{session.session_type}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-semibold text-green-400">
                      +{Math.ceil((session.duration_minutes || 0) / 60)}h
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Tab: Availability ────────────────────────────────────────────────────────

function AvailabilityTab({ mentorData, onRefresh }: { mentorData: MentorData; onRefresh: () => void }) {
  const updateStatus = async (s: 'available' | 'in_session' | 'offline') => {
    const accessToken = getToken();
    if (!accessToken) return;
    await fetch('/api/mentors/current/profile', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: s }),
    });
    onRefresh();
  };

  const removeSlot = async (idx: number) => {
    const accessToken = getToken();
    if (!accessToken) return;
    const newSlots = (mentorData.availability || []).filter((_: any, i: number) => i !== idx);
    await fetch('/api/mentors/current/profile', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ availability: newSlots }),
    });
    onRefresh();
  };

  const addSlot = async (slot: any) => {
    const accessToken = getToken();
    if (!accessToken) return;
    const newSlots = [...(mentorData.availability || []), slot];
    await fetch('/api/mentors/current/profile', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ availability: newSlots }),
    });
    onRefresh();
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Status toggle */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1 font-space">Current Status</h3>
        <p className="text-xs text-gray-600 mb-4">Toggle your availability for new mentorship requests.</p>
        <div className="flex gap-2">
          {(['available', 'in_session', 'offline'] as const).map(s => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors font-space ${
                mentorData.status === s
                  ? s === 'available'  ? 'bg-green-600 text-white'
                  : s === 'in_session' ? 'bg-yellow-600 text-white'
                  : 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Existing slots */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 font-space">
          Your Slots ({(mentorData.availability || []).length})
        </h3>
        {(mentorData.availability || []).length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-6 border border-dashed border-gray-800 rounded-lg">
            No availability slots set yet. Add slots below.
          </p>
        ) : (
          <div className="space-y-2">
            {(mentorData.availability || []).map((slot: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg">
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-medium capitalize text-white w-24">{slot.day}</span>
                  <span className="text-gray-400">{slot.start_time} – {slot.end_time}</span>
                  <span className="text-xs text-gray-600">({slot.timezone || 'UTC'})</span>
                </div>
                <button
                  onClick={() => removeSlot(i)}
                  className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add slot form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 font-space">Add Time Slot</h3>
        <AvailabilitySlotForm onAdd={addSlot} />
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

  const inputCls = "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20";
  const labelCls = "block text-xs text-gray-500 mb-1";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Day</label>
          <select value={day} onChange={e => setDay(e.target.value)} className={inputCls}>
            <option value="">Select day</option>
            {DAYS.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Timezone</label>
          <input value={timezone} onChange={e => setTimezone(e.target.value)} placeholder="IST" className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Start Time</label>
          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className={`${inputCls} [color-scheme:dark]`} />
        </div>
        <div>
          <label className={labelCls}>End Time</label>
          <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className={`${inputCls} [color-scheme:dark]`} />
        </div>
      </div>
      <button
        onClick={handleAdd}
        disabled={saving}
        className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors font-space"
      >
        {saving ? 'Adding…' : '+ Add Slot'}
      </button>
    </div>
  );
}

// ─── MentorProfileEditor ──────────────────────────────────────────────────────

function MentorProfileEditor({ mentorData, profile, user, onSaved }: {
  mentorData: MentorData;
  profile: any;
  user: any;
  onSaved: () => Promise<void>;
}) {
  const [bio, setBio] = useState(profile?.bio || '');
  const [bookingUrl, setBookingUrl] = useState(mentorData.booking_url || '');
  const [maxTeams, setMaxTeams] = useState(String(mentorData.max_concurrent_teams || 3));
  const [skills, setSkills] = useState<string[]>(mentorData.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const accessToken = getToken();
    if (!accessToken) { toast.error('Not authenticated'); return; }
    const n = Number(maxTeams);
    if (!Number.isFinite(n) || n < 1 || n > 50) { toast.error('Max teams must be 1–50'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/mentors/current/profile', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, booking_url: bookingUrl.trim() || null, max_concurrent_teams: Math.floor(n), skills }),
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

  const inputCls = "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20";
  const labelCls = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div className="max-w-2xl space-y-6">
      {/* Read-only info */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 font-space">Account Info</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Full Name</label>
            <div className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
              {profile?.full_name || 'Not set'}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <div className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
              {user?.email}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3">Edit name and email via your main profile page.</p>
      </div>

      {/* Editable fields */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider font-space">Mentor Profile</h3>

        <div>
          <label className={labelCls}>Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={4}
            placeholder="Tell participants about yourself, your expertise, and how you can help..."
            className={`${inputCls} resize-none`}
          />
        </div>

        <div>
          <label className={labelCls}>Booking URL</label>
          <input
            type="url"
            value={bookingUrl}
            onChange={e => setBookingUrl(e.target.value)}
            placeholder="https://cal.com/your-handle"
            className={inputCls}
          />
          <p className="text-xs text-gray-600 mt-1">Participants can book time directly via this link.</p>
        </div>

        <div>
          <label className={labelCls}>Max Concurrent Teams (1–50)</label>
          <input
            type="number"
            min={1}
            max={50}
            value={maxTeams}
            onChange={e => setMaxTeams(e.target.value)}
            className={`${inputCls} w-32`}
          />
        </div>

        <div>
          <label className={labelCls}>Skills</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-orange-900/20 text-orange-400 border border-orange-800/40 px-3 py-1 rounded-full text-sm">
                {s}
                <button
                  onClick={() => setSkills(prev => prev.filter((_, idx) => idx !== i))}
                  className="ml-1 text-orange-400/60 hover:text-orange-400 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
            {skills.length === 0 && <span className="text-xs text-gray-600 italic">No skills added yet</span>}
          </div>
          <div className="flex gap-2">
            <input
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add skill (e.g. React, ML, Design)"
              className={inputCls}
            />
            <button
              onClick={addSkill}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors font-space shrink-0"
            >
              Add
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors font-space"
        >
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
