/**
 * Public mentor profile (PRD §5) — deep link from gallery: /mentors/:mentorId
 */

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import { format, isValid, parseISO } from 'date-fns';
import { getStoredSession } from '@/lib/supabaseClient';

type MentorStatus = 'available' | 'in_session' | 'offline';

interface Mentor {
  id: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
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

function summarizeAvailability(slots: unknown[]): string {
  if (!slots?.length) return '';
  const bits: string[] = [];
  for (const slot of slots.slice(0, 3)) {
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

export default function MentorPublicProfile() {
  const { mentorId } = useParams<{ mentorId: string }>();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<RequestFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!mentorId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/mentors/${mentorId}`);
        const json = await res.json();
        if (!res.ok || !json.success || !json.mentor) {
          throw new Error(json.message || 'Mentor not found');
        }
        if (!cancelled) setMentor(json.mentor);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load mentor');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mentorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentor) return;
    if (!formData.problemDescription.trim()) {
      toast.error('Please describe the problem you need help with.');
      return;
    }
    setSubmitting(true);
    try {
      const session = getStoredSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;

      const body: Record<string, unknown> = {
        problemDescription: formData.problemDescription.trim(),
      };
      if (formData.requestedTime) body.requestedTime = formData.requestedTime;
      if (formData.teamId) body.teamId = Number(formData.teamId);

      const res = await fetch(`/api/mentors/${mentor.id}/request`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Request failed');

      toast.success(
        'Request sent. The mentor is notified on the platform when in-app inbox is enabled, and by Resend email or Slack when those integrations are configured.'
      );
      setModalOpen(false);
      setFormData(EMPTY_FORM);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-2 border-orange-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-16 text-center">
        <p className="text-red-400 mb-6">{error ?? 'Mentor not found'}</p>
        <Link to="/mentors" className="text-orange-400 hover:underline">
          Back to Mentor Gallery
        </Link>
      </div>
    );
  }

  const availText = summarizeAvailability(mentor.availability ?? []);

  return (
    <>
      <SEO
        title={`${mentor.name ?? 'Mentor'} — Maximally Mentors`}
        description={mentor.bio ?? 'Mentor profile on Maximally.'}
      />
      <div className="min-h-screen bg-black py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/mentors"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All mentors
          </Link>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-6">
              <img
                src={mentor.avatar_url ?? '/default-avatar.svg'}
                alt=""
                className="w-24 h-24 rounded-full object-cover bg-gray-800"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/default-avatar.svg';
                }}
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">{mentor.name ?? 'Mentor'}</h1>
                  <StatusBadge status={mentor.status} />
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {mentor.total_mentorship_hours ?? 0} hours mentored
                  </span>
                  {mentor.booking_url && (
                    <a
                      href={mentor.booking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Book time
                    </a>
                  )}
                </div>
                {availText && <p className="text-sm text-gray-400 mb-4">Availability: {availText}</p>}
                {mentor.bio && <p className="text-gray-300 leading-relaxed">{mentor.bio}</p>}
              </div>
            </div>

            {mentor.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {mentor.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-orange-900/20 text-orange-400 text-sm rounded-full border border-orange-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              disabled={mentor.status !== 'available'}
              className={`w-full py-3 px-4 font-medium rounded-lg transition-colors ${
                mentor.status === 'available'
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {mentor.status === 'available' 
                ? 'Request Help' 
                : mentor.status === 'in_session' 
                  ? 'Mentor is in session' 
                  : 'Mentor is offline'
              }
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-gray-900 rounded-xl w-full max-w-lg border border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Request help from {mentor.name}</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label htmlFor="prob" className="block text-sm text-gray-300 mb-1">
                  Problem description <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="prob"
                  required
                  rows={4}
                  value={formData.problemDescription}
                  onChange={(e) => setFormData((f) => ({ ...f, problemDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm bg-gray-800 text-white"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm text-gray-300 mb-1">
                  Preferred time (optional)
                </label>
                <input
                  id="time"
                  type="datetime-local"
                  value={formData.requestedTime}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={(e) => setFormData((f) => ({ ...f, requestedTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm bg-gray-800 text-white"
                />
              </div>
              <div>
                <label htmlFor="team" className="block text-sm text-gray-300 mb-1">
                  Team ID (optional)
                </label>
                <input
                  id="team"
                  type="number"
                  value={formData.teamId}
                  onChange={(e) => setFormData((f) => ({ ...f, teamId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm bg-gray-800 text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-300 bg-gray-800 border border-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg disabled:opacity-50"
                >
                  {submitting ? 'Sending…' : 'Send request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
