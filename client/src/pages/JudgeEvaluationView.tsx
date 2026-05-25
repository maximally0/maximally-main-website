/**
 * JudgeEvaluationView page — Requirements 9.5, 9.6, 9.8
 *
 * Two-column layout:
 *   Left  — project submission data (name, description, links)
 *   Right — scoring form with numeric inputs (1–10) per rubric criterion,
 *            "Comments for Organizers" text area,
 *            "Save Draft" and "Submit" buttons
 *
 * Uses useParams() to get evaluationId from the URL.
 * Fetches evaluation data from GET /api/judging/assignments and finds the match.
 * Save Draft → POST /api/judging/evaluations/:evaluationId/save
 * Submit     → POST /api/judging/evaluations/:evaluationId/submit
 *              (validates all rubric fields are filled before calling)
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Video,
  Save,
  Send,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
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
  video_url?: string | null;
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

// ─── Default rubric keys (used when rubric_scores is empty) ──────────────────
const DEFAULT_RUBRIC_KEYS = [
  'Innovation',
  'Technical Complexity',
  'Design & UX',
  'Impact',
  'Presentation',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRubricKeys(evaluation: Evaluation): string[] {
  const keys = Object.keys(evaluation.rubric_scores ?? {});
  return keys.length > 0 ? keys : DEFAULT_RUBRIC_KEYS;
}

function buildInitialScores(evaluation: Evaluation): Record<string, string> {
  const keys = getRubricKeys(evaluation);
  const scores: Record<string, string> = {};
  for (const key of keys) {
    const existing = evaluation.rubric_scores?.[key];
    scores[key] = existing != null ? String(existing) : '';
  }
  return scores;
}

// ─── JudgeEvaluationView page ─────────────────────────────────────────────────

const JudgeEvaluationView: React.FC = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const navigate = useNavigate();

  // ── Data state ──────────────────────────────────────────────────────────────
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Form state ──────────────────────────────────────────────────────────────
  const [scores, setScores] = useState<Record<string, string>>({});
  const [comments, setComments] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // ── Action state ────────────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Fetch assignments and find matching evaluation ────────────────────────
  const fetchEvaluation = useCallback(async () => {
    setLoading(true);
    setError(null);

    const session = getStoredSession();
    if (!session?.access_token) {
      toast.error('Please sign in to access this page.');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('/api/judging/assignments', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.status === 401) {
        toast.error('Your session has expired. Please sign in again.');
        navigate('/login');
        return;
      }

      if (res.status === 403) {
        toast.error("You don't have permission to access this page.");
        navigate('/');
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to load evaluation data (${res.status})`);
      }

      const json = await res.json();
      const list: Evaluation[] = json.evaluations ?? json.data ?? [];
      const found = list.find(e => e.id === evaluationId) ?? null;

      if (!found) {
        setError('Evaluation not found or you do not have access to it.');
        return;
      }

      setEvaluation(found);
      setScores(buildInitialScores(found));
      setComments(found.comments ?? '');
      setSubmitted(found.status === 'submitted');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load evaluation';
      setError(msg);
      console.error('[JudgeEvaluationView] fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [evaluationId, navigate]);

  useEffect(() => {
    fetchEvaluation();
  }, [fetchEvaluation]);

  // ── Score input handler ───────────────────────────────────────────────────
  const handleScoreChange = (key: string, value: string) => {
    // Allow empty string or numbers 1–10
    if (value === '' || (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 10)) {
      setScores(prev => ({ ...prev, [key]: value }));
      setValidationError(null);
    }
  };

  // ── Build numeric rubric scores from string state ─────────────────────────
  const buildNumericScores = (): Record<string, number> => {
    const result: Record<string, number> = {};
    for (const [key, val] of Object.entries(scores)) {
      result[key] = Number(val);
    }
    return result;
  };

  // ── Validate all rubric fields are filled ─────────────────────────────────
  const validateScores = (): boolean => {
    const rubricKeys = evaluation ? getRubricKeys(evaluation) : [];
    const missing = rubricKeys.filter(k => !scores[k] || scores[k].trim() === '');
    if (missing.length > 0) {
      setValidationError(
        `Please fill in all rubric scores before submitting. Missing: ${missing.join(', ')}.`
      );
      return false;
    }
    return true;
  };

  // ── Save Draft — Requirement 9.5 ──────────────────────────────────────────
  const handleSaveDraft = async () => {
    if (!evaluation) return;
    setSaving(true);
    setValidationError(null);

    const session = getStoredSession();
    if (!session?.access_token) {
      toast.error('Please sign in to save.');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/judging/evaluations/${evaluation.id}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          rubricScores: buildNumericScores(),
          comments: comments.trim() || null,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message ?? `Save failed (${res.status})`);
      }

      toast.success('Draft saved successfully.');
      // Refresh to get updated status
      await fetchEvaluation();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save draft';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ── Submit — Requirement 9.6 ──────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!evaluation) return;

    // Requirement 9.6: Show validation error if any rubric field is empty
    if (!validateScores()) return;

    setSubmitting(true);
    setValidationError(null);

    const session = getStoredSession();
    if (!session?.access_token) {
      toast.error('Please sign in to submit.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/judging/evaluations/${evaluation.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          rubricScores: buildNumericScores(),
          comments: comments.trim() || null,
        }),
      });

      const json = await res.json();

      if (res.status === 400) {
        // Server-side rubric validation error
        setValidationError(json.message ?? 'All rubric fields are required.');
        return;
      }

      if (!res.ok || !json.success) {
        throw new Error(json.message ?? `Submit failed (${res.status})`);
      }

      toast.success('Evaluation submitted successfully!');
      setSubmitted(true);
      await fetchEvaluation();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to submit evaluation';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" aria-label="Loading evaluation" />
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-xl font-semibold text-white mb-2">Evaluation Not Found</h1>
          <p className="text-gray-500 text-sm mb-6">{error ?? 'This evaluation could not be loaded.'}</p>
          <Link
            to="/judging/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const rubricKeys = getRubricKeys(evaluation);
  const isReadOnly = submitted;

  return (
    <>
      <SEO
        title={`Evaluate: ${evaluation.submission?.project_name ?? 'Submission'} — Maximally`}
        description="Score and submit your evaluation for this hackathon submission."
      />

      <div className="min-h-screen bg-black py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back link */}
          <Link
            to="/judging/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-400 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          {/* Hackathon label */}
          {evaluation.hackathon && (
            <p className="text-xs font-medium text-orange-400 uppercase tracking-wide mb-1">
              {evaluation.hackathon.title}
            </p>
          )}

          <h1 className="text-2xl font-bold text-white mb-6">
            {evaluation.submission?.project_name ?? 'Submission'}
          </h1>

          {/* Submitted banner */}
          {submitted && (
            <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-800 rounded-xl text-green-400 mb-6">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <p className="text-sm font-medium">
                This evaluation has been submitted
                {evaluation.submitted_at
                  ? ` on ${new Date(evaluation.submitted_at).toLocaleDateString()}`
                  : ''}
                .
              </p>
            </div>
          )}

          {/* ── Two-column layout — Requirement 9.8 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── Left column: project submission data ── */}
            <section
              className="bg-gray-900 rounded-xl border border-gray-800 shadow-sm p-6 space-y-5"
              aria-labelledby="submission-heading"
            >
              <h2 id="submission-heading" className="text-base font-semibold text-white">
                Project Submission
              </h2>

              {/* Project name */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Project Name
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {evaluation.submission?.project_name ?? '—'}
                </p>
              </div>

              {/* Description */}
              {evaluation.submission?.project_description && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Description
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {evaluation.submission.project_description}
                  </p>
                </div>
              )}

              {/* Links */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Links
                </p>

                {evaluation.submission?.demo_url ? (
                  <a
                    href={evaluation.submission.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    Live Demo
                  </a>
                ) : null}

                {evaluation.submission?.repo_url ? (
                  <a
                    href={evaluation.submission.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Github className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    Repository
                  </a>
                ) : null}

                {evaluation.submission?.video_url ? (
                  <a
                    href={evaluation.submission.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Video className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    Demo Video
                  </a>
                ) : null}

                {!evaluation.submission?.demo_url &&
                  !evaluation.submission?.repo_url &&
                  !evaluation.submission?.video_url && (
                    <p className="text-sm text-gray-400 italic">No links provided.</p>
                  )}
              </div>

              {/* Submission metadata */}
              <div className="pt-4 border-t border-gray-50 text-xs text-gray-400 space-y-1">
                <p>Submission ID: #{evaluation.submission?.id}</p>
                {evaluation.created_at && (
                  <p>Assigned: {new Date(evaluation.created_at).toLocaleDateString()}</p>
                )}
              </div>
            </section>

            {/* ── Right column: scoring form — Requirement 9.8 ── */}
            <section
              className="bg-gray-900 rounded-xl border border-gray-800 shadow-sm p-6 space-y-5"
              aria-labelledby="scoring-heading"
            >
              <h2 id="scoring-heading" className="text-base font-semibold text-white">
                Scoring Form
              </h2>

              {/* Rubric inputs — Requirement 9.8: numeric inputs 1–10 */}
              <fieldset disabled={isReadOnly}>
                <legend className="sr-only">Rubric scores (1–10 each)</legend>
                <div className="space-y-4">
                  {rubricKeys.map(key => (
                    <div key={key}>
                      <label
                        htmlFor={`rubric-${key}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {key}
                        {!isReadOnly && (
                          <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
                        )}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          id={`rubric-${key}`}
                          type="number"
                          min={1}
                          max={10}
                          step={1}
                          value={scores[key] ?? ''}
                          onChange={e => handleScoreChange(key, e.target.value)}
                          placeholder="1–10"
                          readOnly={isReadOnly}
                          className={`w-24 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                            isReadOnly
                              ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'
                              : 'border-gray-300 bg-white'
                          }`}
                          aria-describedby={`rubric-${key}-hint`}
                        />
                        <span
                          id={`rubric-${key}-hint`}
                          className="text-xs text-gray-400"
                        >
                          out of 10
                        </span>
                        {/* Visual score bar */}
                        {scores[key] && (
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-400 rounded-full transition-all"
                              style={{ width: `${(Number(scores[key]) / 10) * 100}%` }}
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>

              {/* Comments for Organizers — Requirement 9.8 */}
              <div>
                <label
                  htmlFor="comments"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Comments for Organizers
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <textarea
                  id="comments"
                  rows={4}
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  readOnly={isReadOnly}
                  placeholder="Share any additional feedback or notes for the organizers…"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-colors ${
                    isReadOnly
                      ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'
                      : 'border-gray-300 bg-white'
                  }`}
                />
              </div>

              {/* Validation error */}
              {validationError && (
                <div
                  className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <p>{validationError}</p>
                </div>
              )}

              {/* Action buttons */}
              {!isReadOnly && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {/* Save Draft — Requirement 9.5 */}
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={saving || submitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Save className="h-4 w-4" aria-hidden="true" />
                    )}
                    {saving ? 'Saving…' : 'Save Draft'}
                  </button>

                  {/* Submit — Requirement 9.6 */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving || submitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Send className="h-4 w-4" aria-hidden="true" />
                    )}
                    {submitting ? 'Submitting…' : 'Submit Evaluation'}
                  </button>
                </div>
              )}

              {isReadOnly && (
                <p className="text-xs text-gray-400 text-center pt-2">
                  This evaluation has been submitted and can no longer be edited.
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default JudgeEvaluationView;
