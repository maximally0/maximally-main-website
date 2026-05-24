/**
 * JudgeDashboard page — Requirements 9.1, 9.3, 9.9
 *
 * Shows:
 * - Pending invitations from organizers + judge's own requests
 * - Assigned submissions grouped by hackathon with traffic-light status
 * - "Hackathons Judged" section
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, ChevronRight, AlertCircle, Loader2, Bell, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import { getStoredSession } from '@/lib/supabaseClient';

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

// ─── Traffic-light status indicator ──────────────────────────────────────────

/**
 * Requirement 9.3: Traffic-light status indicator
 * 🔴 not_started | 🟡 in_progress | 🟢 submitted
 */
function StatusIndicator({ status }: { status: EvaluationStatus }) {
  const config: Record<EvaluationStatus, { emoji: string; label: string; className: string }> = {
    not_started: {
      emoji: '🔴',
      label: 'Not Started',
      className: 'bg-red-900/20 text-red-400 border border-red-800',
    },
    in_progress: {
      emoji: '🟡',
      label: 'In Progress',
      className: 'bg-yellow-900/20 text-yellow-400 border border-yellow-800',
    },
    submitted: {
      emoji: '🟢',
      label: 'Submitted',
      className: 'bg-green-900/20 text-green-400 border border-green-800',
    },
  };

  const { emoji, label, className } = config[status] ?? config.not_started;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      aria-label={`Status: ${label}`}
    >
      <span aria-hidden="true">{emoji}</span>
      {label}
    </span>
  );
}

// ─── JudgeDashboard page ──────────────────────────────────────────────────────

const JudgeDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [requests, setRequests] = useState<JudgeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  const getToken = () => getStoredSession()?.access_token;

  // ── Fetch assignments and requests on mount ───────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        toast.error('Please sign in to access the judge dashboard.');
        navigate('/login');
        return;
      }

      try {
        const [assignRes, reqRes] = await Promise.all([
          fetch('/api/judging/assignments', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/judge/requests', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (assignRes.status === 401 || assignRes.status === 403) {
          toast.error("You don't have permission to access this page.");
          navigate('/');
          return;
        }

        if (assignRes.ok) {
          const json = await assignRes.json();
          setEvaluations(json.evaluations ?? json.data ?? []);
        }

        if (reqRes.ok) {
          const json = await reqRes.json();
          setRequests(json.data ?? []);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load data';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

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
        const err = await res.json();
        toast.error(err.message || `Failed to ${action} request`);
        return;
      }
      toast.success(action === 'accept' ? 'Invitation accepted!' : 'Invitation declined.');
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: action === 'accept' ? 'accepted' : 'rejected' } : r));
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setRespondingTo(null);
    }
  };

  // ── Derived: hackathons with at least one submitted evaluation ────────────
  /**
   * Requirement 9.9: "Hackathons Judged" section — hackathons with ≥1 submitted evaluation
   */
  const hackathonsJudged = React.useMemo(() => {
    const map = new Map<number, Hackathon>();
    for (const ev of evaluations) {
      if (ev.status === 'submitted' && ev.hackathon) {
        map.set(ev.hackathon.id, ev.hackathon);
      }
    }
    return Array.from(map.values());
  }, [evaluations]);

  // ── Group evaluations by hackathon for display ────────────────────────────
  const byHackathon = React.useMemo(() => {
    const map = new Map<number, { hackathon: Hackathon; items: Evaluation[] }>();
    for (const ev of evaluations) {
      if (!ev.hackathon) continue;
      const key = ev.hackathon.id;
      if (!map.has(key)) {
        map.set(key, { hackathon: ev.hackathon, items: [] });
      }
      map.get(key)!.items.push(ev);
    }
    return Array.from(map.values());
  }, [evaluations]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <SEO
        title="Judge Dashboard — Maximally"
        description="View and manage your assigned hackathon submissions."
      />

      <div className="min-h-screen bg-black py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-900/20 rounded-full flex items-center justify-center border border-orange-800">
                <Trophy className="h-5 w-5 text-orange-400" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-bold text-white">Judge Dashboard</h1>
            </div>
            <p className="text-gray-400 text-sm ml-13">
              Review and score your assigned hackathon submissions.
            </p>
          </div>

          {/* ── Loading ── */}
          {loading && (
            <div
              className="flex justify-center items-center h-48"
              aria-live="polite"
              aria-busy="true"
            >
              <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
          )}

          {/* ── Error ── */}
          {error && !loading && (
            <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-400 mb-6">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium text-sm">Failed to load assignments</p>
                <p className="text-sm mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* ── Invitations & Requests ── */}
              {requests.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-orange-400" />
                    Invitations & Requests
                    {requests.filter(r => r.status === 'pending').length > 0 && (
                      <span className="ml-1 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {requests.filter(r => r.status === 'pending').length}
                      </span>
                    )}
                  </h2>
                  <div className="space-y-3">
                    {requests.map(req => (
                      <div key={req.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">
                              {req.request_type === 'organizer_invite' ? '📨 Organizer Invitation' : '📤 Your Request'}
                            </p>
                            <p className="text-sm text-gray-400 mt-0.5">
                              {req.hackathon?.hackathon_name ?? `Hackathon #${req.hackathon_id}`}
                            </p>
                            {req.message && <p className="text-xs text-gray-500 mt-1 italic">"{req.message}"</p>}
                            <div className="flex items-center gap-2 mt-2">
                              {req.status === 'pending' && <span className="inline-flex items-center gap-1 text-xs text-yellow-400 bg-yellow-900/20 border border-yellow-800 px-2 py-0.5 rounded-full"><Clock className="h-3 w-3" />Pending</span>}
                              {req.status === 'accepted' && <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-900/20 border border-green-800 px-2 py-0.5 rounded-full"><CheckCircle className="h-3 w-3" />Accepted</span>}
                              {req.status === 'rejected' && <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-900/20 border border-red-800 px-2 py-0.5 rounded-full"><XCircle className="h-3 w-3" />Declined</span>}
                            </div>
                          </div>
                          {req.status === 'pending' && req.request_type === 'organizer_invite' && (
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => handleRespond(req.id, 'accept')}
                                disabled={respondingTo === req.id}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleRespond(req.id, 'reject')}
                                disabled={respondingTo === req.id}
                                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
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
              {/* ── Hackathons Judged section — Requirement 9.9 ── */}
              {hackathonsJudged.length > 0 && (
                <section className="mb-8" aria-labelledby="hackathons-judged-heading">
                  <h2
                    id="hackathons-judged-heading"
                    className="text-lg font-semibold text-white mb-3"
                  >
                    Hackathons Judged
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {hackathonsJudged.map(h => (
                      <span
                        key={h.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-900/20 text-green-400 border border-green-800 rounded-full text-sm font-medium"
                      >
                        <span aria-hidden="true">🟢</span>
                        {h.title}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Assignments ── */}
              {evaluations.length === 0 ? (
                <div className="text-center py-16 bg-gray-900 rounded-xl border border-gray-800 shadow-sm">
                  <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-medium text-white mb-1">No assignments yet</h3>
                  <p className="text-gray-400 text-sm">
                    You have no submissions assigned for evaluation.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {byHackathon.map(({ hackathon, items }) => (
                    <section key={hackathon.id} aria-labelledby={`hackathon-${hackathon.id}-heading`}>
                      <h2
                        id={`hackathon-${hackathon.id}-heading`}
                        className="text-base font-semibold text-gray-300 mb-3 flex items-center gap-2"
                      >
                        <Trophy className="h-4 w-4 text-orange-500" aria-hidden="true" />
                        {hackathon.title}
                        <span className="text-xs font-normal text-gray-500">
                          ({items.length} submission{items.length !== 1 ? 's' : ''})
                        </span>
                      </h2>

                      <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-sm overflow-hidden">
                        <ul role="list" className="divide-y divide-gray-800">
                          {items.map(ev => (
                            <li key={ev.id}>
                              {/* Requirement 9.3: Link to /judging/evaluate/:evaluationId */}
                              <Link
                                to={`/judging/evaluate/${ev.id}`}
                                className="flex items-center justify-between px-5 py-4 hover:bg-gray-800 transition-colors group"
                                aria-label={`Evaluate ${ev.submission?.project_name ?? 'submission'} — ${ev.status.replace('_', ' ')}`}
                              >
                                <div className="flex-1 min-w-0 mr-4">
                                  <p className="text-sm font-medium text-white truncate group-hover:text-orange-400 transition-colors">
                                    {ev.submission?.project_name ?? `Submission #${ev.submission?.id}`}
                                  </p>
                                  {ev.submission?.project_description && (
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                                      {ev.submission.project_description}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0">
                                  {/* Requirement 9.3: Traffic-light status indicator */}
                                  <StatusIndicator status={ev.status} />
                                  <ChevronRight
                                    className="h-4 w-4 text-gray-500 group-hover:text-orange-400 transition-colors"
                                    aria-hidden="true"
                                  />
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </section>
                  ))}
                </div>
              )}

              {/* ── Summary stats ── */}
              {evaluations.length > 0 && (
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {(
                    [
                      { status: 'not_started', label: 'Not Started', color: 'text-red-400 bg-red-900/20 border-red-800' },
                      { status: 'in_progress', label: 'In Progress', color: 'text-yellow-400 bg-yellow-900/20 border-yellow-800' },
                      { status: 'submitted', label: 'Submitted', color: 'text-green-400 bg-green-900/20 border-green-800' },
                    ] as const
                  ).map(({ status, label, color }) => {
                    const count = evaluations.filter(e => e.status === status).length;
                    return (
                      <div
                        key={status}
                        className={`rounded-xl border p-4 text-center ${color}`}
                      >
                        <p className="text-2xl font-bold">{count}</p>
                        <p className="text-xs font-medium mt-0.5">{label}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default JudgeDashboard;
