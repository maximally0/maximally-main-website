/**
 * MentorGallery page — Requirements 7.5, 7.6, 7.7, 7.8
 *
 * Fetches GET /api/mentors on mount and on filter change.
 * Displays mentor cards with name, avatar, bio, skills, status badge,
 * and total_mentorship_hours.
 * Provides skill filter chips and an availability filter (no page reload).
 * "Request Help" button opens a modal that calls
 * POST /api/mentors/:mentorId/request with { teamId, problemDescription, requestedTime }.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, ExternalLink, X, Users } from 'lucide-react';
import { toast } from 'sonner';
import SEO from '../components/SEO';
import { getStoredSession } from '@/lib/supabaseClient';
import { format, isValid, parseISO } from 'date-fns';

// ─── Types ────────────────────────────────────────────────────────────────────

type MentorStatus = 'available' | 'in_session' | 'offline';

interface Mentor {
  id: string;
  /** From profiles join */
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  /** From mentors table */
  skills: string[];
  status: MentorStatus;
  total_mentorship_hours: number;
  booking_url: string | null;
  availability: unknown[];
}

interface RequestFormData {
  problemDescription: string;
  requestedTime: string;
  teamId: string;
}

const EMPTY_FORM: RequestFormData = {
  problemDescription: '',
  requestedTime: '',
  teamId: '',
};

function summarizeAvailabilitySlots(slots: unknown[]): string {
  if (!slots?.length) return '';
  const bits: string[] = [];
  for (const slot of slots.slice(0, 2)) {
    if (typeof slot === 'string') {
      const d = parseISO(slot);
      bits.push(isValid(d) ? format(d, 'MMM d, p') : slot);
    } else if (slot && typeof slot === 'object') {
      const o = slot as Record<string, unknown>;
      const line = [o.day, o.start_time ?? o.start].filter(Boolean).join(' ');
      if (line) bits.push(line);
    }
  }
  return bits.filter(Boolean).join(' · ');
}

// ─── Status badge ─────────────────────────────────────────────────────────────

/**
 * Requirement 7.5: Status badges
 * "Available Now" (green) | "In Session" (yellow) | "Offline" (grey)
 */
function StatusBadge({ status }: { status: MentorStatus }) {
  const config: Record<MentorStatus, { label: string; className: string }> = {
    available: {
      label: 'Available Now',
      className: 'bg-green-900/20 text-green-400 border border-green-800',
    },
    in_session: {
      label: 'In Session',
      className: 'bg-yellow-900/20 text-yellow-400 border border-yellow-800',
    },
    offline: {
      label: 'Offline',
      className: 'bg-gray-800 text-gray-400 border border-gray-700',
    },
  };

  const { label, className } = config[status] ?? config.offline;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

// ─── MentorGallery page ───────────────────────────────────────────────────────

const MentorGallery: React.FC = () => {
  // ── Data state ──────────────────────────────────────────────────────────────
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Filter state ────────────────────────────────────────────────────────────
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  /** PRD: filter mentors whose availability JSON/slots contain this text */
  const [availabilitySlotQuery, setAvailabilitySlotQuery] = useState('');

  // Derived: all unique skills across fetched mentors
  const [allSkills, setAllSkills] = useState<string[]>([]);

  // ── Request Help modal state ────────────────────────────────────────────────
  const [requestMentor, setRequestMentor] = useState<Mentor | null>(null);
  const [formData, setFormData] = useState<RequestFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch mentors (re-fetches when filters change) ──────────────────────────
  /**
   * Requirement 7.7: Re-fetch with query params on filter change (no page reload)
   */
  const fetchMentors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      // Send all selected skills to the API (mentor must have every skill)
      if (selectedSkills.length > 0) {
        params.set('skills', selectedSkills.join(','));
      }
      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }
      if (availabilitySlotQuery.trim()) {
        params.set('availability', availabilitySlotQuery.trim());
      }

      const query = params.toString();
      const url = `/api/mentors${query ? `?${query}` : ''}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to load mentors (${res.status})`);
      }

      const json = await res.json();
      const list: Mentor[] = Array.isArray(json) ? json : json.mentors ?? json.data ?? [];
      if (!Array.isArray(list)) {
        throw new Error(json.message || 'Invalid mentors response');
      }

      setMentors(list);

      // Derive skill list from the full (unfiltered) mentor set when no filters active
      if (selectedSkills.length === 0 && statusFilter === 'all' && !availabilitySlotQuery.trim()) {
        const skillSet = new Set<string>();
        list.forEach(m => m.skills?.forEach(s => skillSet.add(s)));
        setAllSkills(Array.from(skillSet).sort());
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load mentors';
      setError(msg);
      console.error('[MentorGallery] fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedSkills, statusFilter, availabilitySlotQuery]);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  // ── Client-side search filter (applied on top of server results) ────────────
  const displayed = mentors.filter(m => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.bio?.toLowerCase().includes(q) ||
      m.skills?.some(s => s.toLowerCase().includes(q))
    );
  });

  // When multiple skills are selected, server returns mentors matching all skills
  const finalMentors = displayed;

  // ── Skill chip toggle ───────────────────────────────────────────────────────
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // ── Request Help handlers ───────────────────────────────────────────────────
  const openRequestModal = (mentor: Mentor) => {
    setRequestMentor(mentor);
    setFormData(EMPTY_FORM);
  };

  const closeRequestModal = () => {
    setRequestMentor(null);
    setFormData(EMPTY_FORM);
  };

  /**
   * Requirement 7.8: "Request Help" calls POST /api/mentors/:mentorId/request
   * with { teamId, problemDescription, requestedTime }
   */
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestMentor) return;

    if (!formData.problemDescription.trim()) {
      toast.error('Please describe the problem you need help with.');
      return;
    }

    setSubmitting(true);
    try {
      const session = getStoredSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const body: Record<string, unknown> = {
        problemDescription: formData.problemDescription.trim(),
      };
      if (formData.requestedTime) body.requestedTime = formData.requestedTime;
      if (formData.teamId) body.teamId = Number(formData.teamId);

      const res = await fetch(`/api/mentors/${requestMentor.id}/request`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message ?? `Request failed (${res.status})`);
      }

      toast.success(
        'Request sent. Your mentor sees it on their dashboard; Resend email, Slack, or in-app inbox run when those are configured.'
      );
      closeRequestModal();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send request';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <SEO
        title="Mentor Gallery — Maximally"
        description="Browse available mentors and request help for your hackathon project."
      />

      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Mentor Gallery</h1>
            <p className="text-lg text-gray-300 mb-5">
              Find an expert mentor to guide your hackathon journey.
            </p>
            <a
              href="/mentor/apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Apply to Become a Mentor
            </a>
          </div>

          {/* ── Filters ── */}
          <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-6 mb-8 space-y-4">

            {/* Search + availability filter row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Search by name, skill, or bio…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-700 rounded-lg text-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  aria-label="Search mentors"
                />
              </div>

              {/* Availability filter — Requirement 7.7 */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="sm:w-48 px-3 py-2 border border-gray-700 rounded-lg text-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                aria-label="Filter by availability"
              >
                <option value="all">All Availability</option>
                <option value="available">Available Now</option>
                <option value="in_session">In Session</option>
                <option value="offline">Offline</option>
              </select>

              <input
                type="text"
                placeholder="Match schedule (e.g. Monday, 15:00)…"
                value={availabilitySlotQuery}
                onChange={e => setAvailabilitySlotQuery(e.target.value)}
                className="sm:flex-1 min-w-[12rem] px-3 py-2 border border-gray-700 rounded-lg text-sm bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                aria-label="Filter by availability slots"
              />
            </div>

            {/* Skill filter chips — Requirement 7.7 */}
            {allSkills.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  Filter by skill
                </p>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedSkills.includes(skill)
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                      }`}
                      aria-pressed={selectedSkills.includes(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active filter summary */}
            {(selectedSkills.length > 0 || statusFilter !== 'all' || searchTerm || availabilitySlotQuery.trim()) && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Active filters:</span>
                {selectedSkills.map(s => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-900/20 text-orange-400 rounded-full border border-orange-800"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => toggleSkill(s)}
                      aria-label={`Remove ${s} filter`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {statusFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-900/20 text-orange-400 rounded-full border border-orange-800">
                    {statusFilter === 'available'
                      ? 'Available Now'
                      : statusFilter === 'in_session'
                      ? 'In Session'
                      : 'Offline'}
                    <button
                      type="button"
                      onClick={() => setStatusFilter('all')}
                      aria-label="Remove availability filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {availabilitySlotQuery.trim() && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-900/20 text-orange-400 rounded-full border border-orange-800 max-w-[200px] truncate" title={availabilitySlotQuery}>
                    Schedule: {availabilitySlotQuery.trim()}
                    <button
                      type="button"
                      onClick={() => setAvailabilitySlotQuery('')}
                      aria-label="Remove schedule filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSkills([]);
                    setStatusFilter('all');
                    setSearchTerm('');
                    setAvailabilitySlotQuery('');
                  }}
                  className="ml-auto text-xs text-gray-500 hover:text-gray-300 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* ── Loading ── */}
          {loading && (
            <div
              className="flex justify-center items-center h-48"
              aria-live="polite"
              aria-busy="true"
            >
              <div className="animate-spin h-10 w-10 border-2 border-orange-600 border-t-transparent rounded-full" />
            </div>
          )}

          {/* ── Error ── */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                type="button"
                onClick={fetchMentors}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                Retry
              </button>
            </div>
          )}

          {/* ── Results count ── */}
          {!loading && !error && (
            <p className="text-sm text-gray-400 mb-4">
              {finalMentors.length === 0
                ? 'No mentors found'
                : `${finalMentors.length} mentor${finalMentors.length !== 1 ? 's' : ''}`}
            </p>
          )}

          {/* ── Mentor grid ── */}
          {!loading && !error && finalMentors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {finalMentors.map(mentor => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onRequestHelp={openRequestModal}
                  availabilitySummary={summarizeAvailabilitySlots(mentor.availability ?? [])}
                />
              ))}
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && !error && finalMentors.length === 0 && (
            <div className="text-center py-16">
              <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-lg font-medium text-white mb-1">No mentors found</h3>
              <p className="text-gray-400 text-sm">
                Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Request Help Modal — Requirement 7.8 ── */}
      {requestMentor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-modal-title"
        >
          <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-lg border border-gray-800">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 id="request-modal-title" className="text-lg font-semibold text-white">
                Request Help from {requestMentor.name}
              </h2>
              <button
                type="button"
                onClick={closeRequestModal}
                className="text-gray-400 hover:text-gray-300 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmitRequest} className="px-6 py-5 space-y-4">
              {/* Problem description */}
              <div>
                <label
                  htmlFor="problemDescription"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Problem Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="problemDescription"
                  rows={4}
                  required
                  placeholder="Describe the specific challenge you're facing…"
                  value={formData.problemDescription}
                  onChange={e =>
                    setFormData(f => ({ ...f, problemDescription: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Requested time */}
              <div>
                <label
                  htmlFor="requestedTime"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Preferred Time <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  id="requestedTime"
                  type="datetime-local"
                  value={formData.requestedTime}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={e =>
                    setFormData(f => ({ ...f, requestedTime: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Team ID */}
              <div>
                <label
                  htmlFor="teamId"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Team ID <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  id="teamId"
                  type="number"
                  placeholder="e.g. 42"
                  value={formData.teamId}
                  onChange={e => setFormData(f => ({ ...f, teamId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeRequestModal}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.problemDescription.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Sending…' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// ─── MentorCard ───────────────────────────────────────────────────────────────

interface MentorCardProps {
  mentor: Mentor;
  onRequestHelp: (mentor: Mentor) => void;
  availabilitySummary: string;
}

/**
 * Requirement 7.5: Status badge
 * Requirement 7.6: total_mentorship_hours display
 */
function MentorCard({ mentor, onRequestHelp, availabilitySummary }: MentorCardProps) {
  return (
    <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 hover:shadow-md hover:border-gray-700 transition-all p-6 flex flex-col">
      {/* Header: avatar + name + status */}
      <div className="flex items-start justify-between mb-4">
        <Link to={`/mentors/${mentor.id}`} className="flex items-center gap-3 group text-left min-w-0">
          <img
            src={mentor.avatar_url ?? '/default-avatar.svg'}
            alt={mentor.name ?? ''}
            className="w-12 h-12 rounded-full object-cover bg-gray-800 shrink-0"
            onError={e => {
              (e.currentTarget as HTMLImageElement).src = '/default-avatar.svg';
            }}
          />
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-white leading-tight group-hover:text-orange-400 transition-colors truncate">
              {mentor.name}
            </h3>
            {availabilitySummary && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{availabilitySummary}</p>
            )}
          </div>
        </Link>
        {/* Requirement 7.5: Status badge */}
        <StatusBadge status={mentor.status} />
      </div>

      {/* Bio */}
      {mentor.bio && (
        <p className="text-sm text-gray-300 mb-4 line-clamp-3 flex-1">{mentor.bio}</p>
      )}

      {/* Skills */}
      {mentor.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {mentor.skills.slice(0, 4).map(skill => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-orange-900/20 text-orange-400 text-xs rounded-full border border-orange-800"
            >
              {skill}
            </span>
          ))}
          {mentor.skills.length > 4 && (
            <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-full border border-gray-700">
              +{mentor.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Stats row — Requirement 7.6 */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{mentor.total_mentorship_hours ?? 0} hours mentored</span>
        </div>
        {mentor.booking_url && (
          <a
            href={mentor.booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-orange-400 hover:text-orange-300"
            aria-label="Open booking page"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Book</span>
          </a>
        )}
      </div>

      {/* Request Help button — Requirement 7.8 */}
      <button
        type="button"
        onClick={() => onRequestHelp(mentor)}
        className="w-full py-2 px-4 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 active:bg-orange-800 transition-colors"
      >
        Request Help
      </button>
    </div>
  );
}

export default MentorGallery;
