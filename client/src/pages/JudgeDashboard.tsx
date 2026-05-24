/**
 * JudgeDashboard — Comprehensive judge dashboard with tabs:
 * Overview | Invitations | Assignments | Scoring Links | Past Hackathons | Profile
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy, Bell, ClipboardList, Link2, History, User,
  CheckCircle, XCircle, Clock, Loader2, AlertCircle,
  Copy, Check, ExternalLink, ChevronRight, Star,
  Calendar, Hash, Shield, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import { getStoredSession } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type EvaluationStatus = 'not_started' | 'in_progress' | 'submitted';

interface Submission {
  id: number;
  project_name: string;
  project_description?: string | null;
  demo_url?: string | null;
  repo_url?: string | null;
}

interface Hackathon {
  id: number;
  title: string;
}

interface Evaluation {
  id: string;
  status: EvaluationStatus;
  rubric_scores: Record<string, number>;
  comments: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
  submission: Submission;
  hackathon: Hackathon;
}

interface JudgeRequest {
  id: string;
  hackathon_id: number;
  request_type: 'organizer_invite' | 'judge_request';
  status: 'pending' | 'accepted' | 'rejected';
  message: string | null;
  created_at: string;
  hackathon?: { id: number; hackathon_name: string; start_date: string; end_date: string };
  organizer?: { username: string; full_name: string; avatar_url: string };
}

interface ScoringLink {
  judge_id: string;
  hackathon_id: number;
  hackathon_name: string;
  hackathon_slug: string | null;
  token: string | null;
  expires_at: string | null;
  scoring_url: string | null;
}

interface JudgeProfile {
  id: string;
  username: string;
  full_name: string;
  bio: string | null;
  skills: string[];
  availability_status: string;
  avatar_url: string | null;
}

type Tab = 'overview' | 'invitations' | 'assignments' | 'scoring-links' | 'past' | 'profile';

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: EvaluationStatus }) {
  const cfg = {
    not_started: { label: 'Not Started', cls: 'bg-red-900/20 text-red-400 border-red-800' },
    in_progress:  { label: 'In Progress', cls: 'bg-yellow-900/20 text-yellow-400 border-yellow-800' },
    submitted:    { label: 'Submitted',   cls: 'bg-green-900/20 text-green-400 border-green-800' },
  };
  const { label, cls } = cfg[status] ?? cfg.not_started;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {label}
    </span>
  );
}

function RequestStatusBadge({ status }: { status: 'pending' | 'accepted' | 'rejected' }) {
  if (status === 'pending')  return <span className="inline-flex items-center gap-1 text-xs text-yellow-400 bg-yellow-900/20 border border-yellow-800 px-2 py-0.5 rounded-full"><Clock className="h-3 w-3" />Pending</span>;
  if (status === 'accepted') return <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-900/20 border border-green-800 px-2 py-0.5 rounded-full"><CheckCircle className="h-3 w-3" />Accepted</span>;
  return <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-900/20 border border-red-800 px-2 py-0.5 rounded-full"><XCircle className="h-3 w-3" />Declined</span>;
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

function EmptyState({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="text-center py-16 bg-gray-900 rounded-xl border border-gray-800">
      <Icon className="h-12 w-12 text-gray-700 mx-auto mb-4" />
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const JudgeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [requests, setRequests] = useState<JudgeRequest[]>([]);
  const [scoringLinks, setScoringLinks] = useState<ScoringLink[]>([]);
  const [judgeProfile, setJudgeProfile] = useState<JudgeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  // Profile edit state
  const [bioEdit, setBioEdit] = useState('');
  const [skillsEdit, setSkillsEdit] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [availabilityEdit, setAvailabilityEdit] = useState('available');
  const [profileSaving, setProfileSaving] = useState(false);

  const getToken = useCallback(() => getStoredSession()?.access_token, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = getToken();
    if (!token) {
      toast.error('Please sign in to access the judge dashboard.');
      navigate('/login');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [assignRes, reqRes, linksRes, profileRes] = await Promise.allSettled([
        fetch('/api/judging/assignments', { headers }),
        fetch('/api/judge/requests', { headers }),
        fetch('/api/judge/scoring-links', { headers }),
        fetch('/api/judge/profile', { headers }),
      ]);

      if (assignRes.status === 'fulfilled') {
        if (assignRes.value.status === 401) {
          toast.error('Session expired. Please sign in again.');
          navigate('/login');
          return;
        }
        if (assignRes.value.ok) {
          const json = await assignRes.value.json();
          setEvaluations(json.evaluations ?? json.data ?? []);
        }
      }

      if (reqRes.status === 'fulfilled' && reqRes.value.ok) {
        const json = await reqRes.value.json();
        setRequests(json.data ?? []);
      }

      if (linksRes.status === 'fulfilled' && linksRes.value.ok) {
        const json = await linksRes.value.json();
        setScoringLinks(json.data ?? []);
      }

      if (profileRes.status === 'fulfilled' && profileRes.value.ok) {
        const json = await profileRes.value.json();
        const p = json.profile ?? json;
        setJudgeProfile(p);
        setBioEdit(p.shortBio ?? p.bio ?? '');
        setSkillsEdit(p.primaryExpertise ?? p.skills ?? []);
        setAvailabilityEdit(p.availabilityStatus ?? p.availability_status ?? 'available');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [getToken, navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRespond = async (requestId: string, action: 'accept' | 'reject') => {
    const token = getToken();
    if (!token) return;
    setRespondingTo(requestId);
    try {
      const res = await fetch(`/api/judge-requests/${requestId}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || `Failed to ${action} request`);
        return;
      }
      toast.success(action === 'accept' ? 'Invitation accepted!' : 'Invitation declined.');
      setRequests(prev => prev.map(r =>
        r.id === requestId ? { ...r, status: action === 'accept' ? 'accepted' : 'rejected' } : r
      ));
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setRespondingTo(null);
    }
  };

  const handleSaveProfile = async () => {
    const token = getToken();
    if (!token) { toast.error('Not authenticated'); return; }
    setProfileSaving(true);
    try {
      const res = await fetch('/api/judge/profile', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: bioEdit, skills: skillsEdit, availability_status: availabilityEdit }),
      });
      if (res.ok) {
        toast.success('Profile updated');
        await fetchData();
      } else {
        const json = await res.json().catch(() => ({}));
        toast.error(json.message || 'Failed to save profile');
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setProfileSaving(false);
    }
  };

  // Derived data
  const byHackathon = React.useMemo(() => {
    const map = new Map<number, { hackathon: Hackathon; items: Evaluation[] }>();
    for (const ev of evaluations) {
      if (!ev.hackathon) continue;
      const key = ev.hackathon.id;
      if (!map.has(key)) map.set(key, { hackathon: ev.hackathon, items: [] });
      map.get(key)!.items.push(ev);
    }
    return Array.from(map.values());
  }, [evaluations]);

  const hackathonsJudged = React.useMemo(() => {
    const map = new Map<number, Hackathon>();
    for (const ev of evaluations) {
      if (ev.status === 'submitted' && ev.hackathon) map.set(ev.hackathon.id, ev.hackathon);
    }
    return Array.from(map.values());
  }, [evaluations]);

  const pendingInvites = requests.filter(r => r.status === 'pending' && r.request_type === 'organizer_invite');
  const submittedCount = evaluations.filter(e => e.status === 'submitted').length;

  const tabs: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview',      label: 'Overview',      icon: Zap },
    { id: 'invitations',   label: 'Invitations',   icon: Bell,        badge: pendingInvites.length || undefined },
    { id: 'assignments',   label: 'Assignments',   icon: ClipboardList },
    { id: 'scoring-links', label: 'Scoring Links', icon: Link2 },
    { id: 'past',          label: 'Past Hackathons', icon: History },
    { id: 'profile',       label: 'Profile',       icon: User },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Judge Dashboard — Maximally" description="Manage your hackathon judging assignments, invitations, and scoring links." />

      <div className="min-h-screen bg-black py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-orange-900/20 rounded-xl flex items-center justify-center border border-orange-800/40">
                <Trophy className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-space">Judge Dashboard</h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {profile?.full_name || user?.email || 'Judge'}
                </p>
              </div>
            </div>
            {judgeProfile && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                judgeProfile.availabilityStatus === 'available' || availabilityEdit === 'available'
                  ? 'bg-green-900/20 border-green-800 text-green-400'
                  : 'bg-gray-800 border-gray-700 text-gray-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${availabilityEdit === 'available' ? 'bg-green-400' : 'bg-gray-500'}`} />
                {availabilityEdit === 'available' ? 'Available' : 'Unavailable'}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-400 mb-6">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Failed to load data</p>
                <p className="text-sm mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-800 mb-6 overflow-x-auto">
            <nav className="flex gap-1 min-w-max">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap font-space ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {tab.badge ? (
                    <span className="bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && (
              <OverviewTab
                evaluations={evaluations}
                requests={requests}
                scoringLinks={scoringLinks}
                hackathonsJudged={hackathonsJudged}
                submittedCount={submittedCount}
                pendingInvites={pendingInvites}
                onTabChange={setActiveTab}
              />
            )}
            {activeTab === 'invitations' && (
              <InvitationsTab
                requests={requests}
                respondingTo={respondingTo}
                onRespond={handleRespond}
              />
            )}
            {activeTab === 'assignments' && (
              <AssignmentsTab evaluations={evaluations} byHackathon={byHackathon} />
            )}
            {activeTab === 'scoring-links' && (
              <ScoringLinksTab scoringLinks={scoringLinks} />
            )}
            {activeTab === 'past' && (
              <PastHackathonsTab hackathonsJudged={hackathonsJudged} evaluations={evaluations} />
            )}
            {activeTab === 'profile' && (
              <ProfileTab
                judgeProfile={judgeProfile}
                profile={profile}
                user={user}
                bioEdit={bioEdit}
                setBioEdit={setBioEdit}
                skillsEdit={skillsEdit}
                setSkillsEdit={setSkillsEdit}
                newSkill={newSkill}
                setNewSkill={setNewSkill}
                availabilityEdit={availabilityEdit}
                setAvailabilityEdit={setAvailabilityEdit}
                saving={profileSaving}
                onSave={handleSaveProfile}
              />
            )}
          </div>

        </div>
      </div>
    </>
  );
};

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function OverviewTab({ evaluations, requests, scoringLinks, hackathonsJudged, submittedCount, pendingInvites, onTabChange }: {
  evaluations: Evaluation[];
  requests: JudgeRequest[];
  scoringLinks: ScoringLink[];
  hackathonsJudged: Hackathon[];
  submittedCount: number;
  pendingInvites: JudgeRequest[];
  onTabChange: (tab: Tab) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Hackathons Judged" value={hackathonsJudged.length} icon={Trophy} color="orange" sub="with submissions" />
        <StatCard label="Pending Invites" value={pendingInvites.length} icon={Bell} color="yellow" sub="awaiting response" />
        <StatCard label="Active Assignments" value={evaluations.filter(e => e.status !== 'submitted').length} icon={ClipboardList} color="blue" sub="to evaluate" />
        <StatCard label="Submissions Scored" value={submittedCount} icon={CheckCircle} color="green" sub="completed" />
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 font-space">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'View Invitations', desc: `${pendingInvites.length} pending`, tab: 'invitations' as Tab, icon: Bell, color: 'text-yellow-400' },
            { label: 'My Assignments', desc: `${evaluations.length} total`, tab: 'assignments' as Tab, icon: ClipboardList, color: 'text-blue-400' },
            { label: 'Scoring Links', desc: `${scoringLinks.length} links`, tab: 'scoring-links' as Tab, icon: Link2, color: 'text-orange-400' },
          ].map(item => (
            <button
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              className="flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-xl transition-colors text-left"
            >
              <item.icon className={`h-5 w-5 ${item.color} flex-shrink-0`} />
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-600 ml-auto" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Assignments */}
      {evaluations.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider font-space">Recent Assignments</h2>
            <button onClick={() => onTabChange('assignments')} className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {evaluations.slice(0, 4).map(ev => (
              <div key={ev.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm font-medium text-white truncate">{ev.submission?.project_name ?? `Submission #${ev.submission?.id}`}</p>
                  <p className="text-xs text-gray-500">{ev.hackathon?.title}</p>
                </div>
                <StatusBadge status={ev.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Invites preview */}
      {pendingInvites.length > 0 && (
        <div className="bg-yellow-900/10 border border-yellow-800/40 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-yellow-400 font-space flex items-center gap-2">
              <Bell className="h-4 w-4" /> {pendingInvites.length} Pending Invitation{pendingInvites.length > 1 ? 's' : ''}
            </h2>
            <button onClick={() => onTabChange('invitations')} className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors">
              Respond →
            </button>
          </div>
          <div className="space-y-2">
            {pendingInvites.slice(0, 2).map(req => (
              <p key={req.id} className="text-sm text-gray-300">
                📨 {req.hackathon?.hackathon_name ?? `Hackathon #${req.hackathon_id}`}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Invitations ─────────────────────────────────────────────────────────

function InvitationsTab({ requests, respondingTo, onRespond }: {
  requests: JudgeRequest[];
  respondingTo: string | null;
  onRespond: (id: string, action: 'accept' | 'reject') => void;
}) {
  const organiserInvites = requests.filter(r => r.request_type === 'organizer_invite');
  const judgeRequests = requests.filter(r => r.request_type === 'judge_request');

  if (requests.length === 0) {
    return <EmptyState icon={Bell} title="No invitations yet" desc="Organizers can invite you to judge their hackathons. Check back later." />;
  }

  return (
    <div className="space-y-6">
      {organiserInvites.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 font-space flex items-center gap-2">
            <Bell className="h-4 w-4 text-orange-400" /> Organizer Invitations ({organiserInvites.length})
          </h2>
          <div className="space-y-3">
            {organiserInvites.map(req => (
              <div key={req.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {req.hackathon?.hackathon_name ?? `Hackathon #${req.hackathon_id}`}
                    </p>
                    {req.organizer && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        From: {req.organizer.full_name || req.organizer.username}
                      </p>
                    )}
                    {req.hackathon?.start_date && (
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(req.hackathon.start_date).toLocaleDateString()} – {new Date(req.hackathon.end_date).toLocaleDateString()}
                      </p>
                    )}
                    {req.message && (
                      <p className="text-xs text-gray-400 mt-2 italic bg-gray-800 rounded-lg px-3 py-2">
                        "{req.message}"
                      </p>
                    )}
                    <div className="mt-2">
                      <RequestStatusBadge status={req.status} />
                    </div>
                  </div>
                  {req.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => onRespond(req.id, 'accept')}
                        disabled={respondingTo === req.id}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 font-space"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => onRespond(req.id, 'reject')}
                        disabled={respondingTo === req.id}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 font-space"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {judgeRequests.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 font-space flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-400" /> Your Requests ({judgeRequests.length})
          </h2>
          <div className="space-y-3">
            {judgeRequests.map(req => (
              <div key={req.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {req.hackathon?.hackathon_name ?? `Hackathon #${req.hackathon_id}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Submitted {new Date(req.created_at).toLocaleDateString()}
                    </p>
                    {req.message && (
                      <p className="text-xs text-gray-400 mt-2 italic bg-gray-800 rounded-lg px-3 py-2">
                        "{req.message}"
                      </p>
                    )}
                    <div className="mt-2">
                      <RequestStatusBadge status={req.status} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Tab: Assignments ─────────────────────────────────────────────────────────

function AssignmentsTab({ evaluations, byHackathon }: {
  evaluations: Evaluation[];
  byHackathon: { hackathon: Hackathon; items: Evaluation[] }[];
}) {
  if (evaluations.length === 0) {
    return <EmptyState icon={ClipboardList} title="No assignments yet" desc="You have no submissions assigned for evaluation." />;
  }

  const notStarted = evaluations.filter(e => e.status === 'not_started').length;
  const inProgress = evaluations.filter(e => e.status === 'in_progress').length;
  const submitted  = evaluations.filter(e => e.status === 'submitted').length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-900/20 border border-red-800/40 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{notStarted}</p>
          <p className="text-xs text-red-400/80 mt-0.5 font-space">Not Started</p>
        </div>
        <div className="bg-yellow-900/20 border border-yellow-800/40 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{inProgress}</p>
          <p className="text-xs text-yellow-400/80 mt-0.5 font-space">In Progress</p>
        </div>
        <div className="bg-green-900/20 border border-green-800/40 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{submitted}</p>
          <p className="text-xs text-green-400/80 mt-0.5 font-space">Submitted</p>
        </div>
      </div>

      {/* By hackathon */}
      {byHackathon.map(({ hackathon, items }) => (
        <section key={hackathon.id}>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 font-space flex items-center gap-2">
            <Trophy className="h-4 w-4 text-orange-400" />
            {hackathon.title}
            <span className="text-gray-600 normal-case font-normal">({items.length} submission{items.length !== 1 ? 's' : ''})</span>
          </h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <ul className="divide-y divide-gray-800">
              {items.map(ev => (
                <li key={ev.id}>
                  <a
                    href={`/judging/evaluate/${ev.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-medium text-white truncate group-hover:text-orange-400 transition-colors">
                        {ev.submission?.project_name ?? `Submission #${ev.submission?.id}`}
                      </p>
                      {ev.submission?.project_description && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{ev.submission.project_description}</p>
                      )}
                      {ev.submitted_at && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          Scored {new Date(ev.submitted_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <StatusBadge status={ev.status} />
                      <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-orange-400 transition-colors" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}

// ─── Tab: Scoring Links ───────────────────────────────────────────────────────

function ScoringLinksTab({ scoringLinks }: { scoringLinks: ScoringLink[] }) {
  if (scoringLinks.length === 0) {
    return (
      <EmptyState
        icon={Link2}
        title="No scoring links yet"
        desc="When an organizer assigns you to judge a hackathon, your tokenized scoring link will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        These are your personal tokenized scoring links. Keep them private — they grant direct access to score submissions.
      </p>
      {scoringLinks.map(link => {
        const isExpired = link.expires_at ? new Date(link.expires_at) < new Date() : false;
        return (
          <div key={link.judge_id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-sm font-semibold text-white">{link.hackathon_name}</p>
                {link.hackathon_slug && (
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <Hash className="h-3 w-3" />{link.hackathon_slug}
                  </p>
                )}
              </div>
              {isExpired ? (
                <span className="text-xs text-red-400 bg-red-900/20 border border-red-800 px-2 py-0.5 rounded-full">Expired</span>
              ) : link.token ? (
                <span className="text-xs text-green-400 bg-green-900/20 border border-green-800 px-2 py-0.5 rounded-full">Active</span>
              ) : (
                <span className="text-xs text-gray-500 bg-gray-800 border border-gray-700 px-2 py-0.5 rounded-full">No token</span>
              )}
            </div>

            {link.scoring_url ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                  <Link2 className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                  <span className="text-xs text-gray-300 font-mono truncate flex-1">{link.scoring_url}</span>
                  <CopyButton text={link.scoring_url} />
                  <a
                    href={link.scoring_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
                    title="Open scoring page"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                {link.expires_at && (
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {isExpired ? 'Expired' : 'Expires'} {new Date(link.expires_at).toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-600 italic">No scoring link generated yet for this hackathon.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Tab: Past Hackathons ─────────────────────────────────────────────────────

function PastHackathonsTab({ hackathonsJudged, evaluations }: {
  hackathonsJudged: Hackathon[];
  evaluations: Evaluation[];
}) {
  if (hackathonsJudged.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No past hackathons"
        desc="Hackathons where you've submitted at least one evaluation will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Hackathons where you've submitted at least one evaluation.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {hackathonsJudged.map(h => {
          const hackathonEvals = evaluations.filter(e => e.hackathon?.id === h.id);
          const scored = hackathonEvals.filter(e => e.status === 'submitted').length;
          const total  = hackathonEvals.length;
          const pct    = total > 0 ? Math.round((scored / total) * 100) : 0;
          return (
            <div key={h.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 bg-orange-900/20 border border-orange-800/40 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-4 w-4 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{h.title}</p>
                  <p className="text-xs text-gray-500">Hackathon #{h.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-white">{total}</p>
                  <p className="text-xs text-gray-500">Assigned</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-400">{scored}</p>
                  <p className="text-xs text-gray-500">Scored</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-orange-400">{pct}%</p>
                  <p className="text-xs text-gray-500">Complete</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab: Profile ─────────────────────────────────────────────────────────────

function ProfileTab({ judgeProfile, profile, user, bioEdit, setBioEdit, skillsEdit, setSkillsEdit,
  newSkill, setNewSkill, availabilityEdit, setAvailabilityEdit, saving, onSave }: {
  judgeProfile: JudgeProfile | null;
  profile: any;
  user: any;
  bioEdit: string;
  setBioEdit: (v: string) => void;
  skillsEdit: string[];
  setSkillsEdit: (v: string[]) => void;
  newSkill: string;
  setNewSkill: (v: string) => void;
  availabilityEdit: string;
  setAvailabilityEdit: (v: string) => void;
  saving: boolean;
  onSave: () => void;
}) {
  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skillsEdit.includes(s)) {
      setSkillsEdit([...skillsEdit, s]);
      setNewSkill('');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Read-only info */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 font-space">Account Info</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Full Name</label>
            <div className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
              {profile?.full_name || judgeProfile?.full_name || 'Not set'}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <div className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
              {user?.email || 'Not set'}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Username</label>
            <div className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
              {profile?.username || judgeProfile?.username || 'Not set'}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3">Edit name and email via your main profile page.</p>
      </div>

      {/* Editable fields */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-5">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider font-space">Judge Profile</h2>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Availability Status</label>
          <div className="flex gap-2">
            {(['available', 'unavailable'] as const).map(s => (
              <button
                key={s}
                onClick={() => setAvailabilityEdit(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors font-space ${
                  availabilityEdit === s
                    ? s === 'available'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
          <textarea
            value={bioEdit}
            onChange={e => setBioEdit(e.target.value)}
            rows={4}
            placeholder="Tell organizers about your expertise and judging experience..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 resize-none"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Skills / Expertise</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {skillsEdit.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-orange-900/20 text-orange-400 border border-orange-800/40 px-3 py-1 rounded-full text-sm">
                {s}
                <button
                  onClick={() => setSkillsEdit(skillsEdit.filter((_, idx) => idx !== i))}
                  className="ml-1 text-orange-400/60 hover:text-orange-400 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
            {skillsEdit.length === 0 && (
              <span className="text-xs text-gray-600 italic">No skills added yet</span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add skill (e.g. React, ML, Design)"
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
            />
            <button
              onClick={addSkill}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors font-space"
            >
              Add
            </button>
          </div>
        </div>

        <button
          onClick={onSave}
          disabled={saving}
          className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors font-space"
        >
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}

export default JudgeDashboard;
