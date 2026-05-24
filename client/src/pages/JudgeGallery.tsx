/**
 * JudgeGallery — public directory of platform judges
 * Route: /judges
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Award, Users, Shield } from 'lucide-react';
import SEO from '../components/SEO';

interface Judge {
  id: string;
  username: string;
  fullName: string;
  profilePhoto: string | null;
  headline: string | null;
  shortBio: string | null;
  location: string | null;
  currentRole: string | null;
  company: string | null;
  primaryExpertise: string[];
  secondaryExpertise: string[];
  totalEventsJudged: number;
  totalTeamsEvaluated: number;
  yearsOfExperience: number;
  averageFeedbackRating: number | null;
  availabilityStatus: 'available' | 'busy' | 'unavailable';
  tier: 'starter' | 'rising' | 'established' | 'expert' | 'legend';
  linkedin: string | null;
  github: string | null;
  twitter: string | null;
  website: string | null;
}

const TIER_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  legend:      { label: 'Legend',      className: 'bg-yellow-900/30 text-yellow-300 border border-yellow-700',  icon: <Award className="h-3 w-3" /> },
  expert:      { label: 'Expert',      className: 'bg-purple-900/30 text-purple-300 border border-purple-700',  icon: <Shield className="h-3 w-3" /> },
  established: { label: 'Established', className: 'bg-blue-900/30 text-blue-300 border border-blue-700',        icon: <Star className="h-3 w-3" /> },
  rising:      { label: 'Rising',      className: 'bg-green-900/30 text-green-300 border border-green-700',     icon: <Star className="h-3 w-3" /> },
  starter:     { label: 'Starter',     className: 'bg-gray-800 text-gray-400 border border-gray-700',           icon: <Star className="h-3 w-3" /> },
};

const AVAILABILITY_CONFIG: Record<string, { label: string; className: string }> = {
  available:   { label: 'Available',   className: 'bg-green-900/20 text-green-400 border border-green-800' },
  busy:        { label: 'Busy',        className: 'bg-yellow-900/20 text-yellow-400 border border-yellow-800' },
  unavailable: { label: 'Unavailable', className: 'bg-gray-800 text-gray-400 border border-gray-700' },
};

function TierBadge({ tier }: { tier: string }) {
  const cfg = TIER_CONFIG[tier] ?? TIER_CONFIG.starter;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

function AvailabilityBadge({ status }: { status: string }) {
  const cfg = AVAILABILITY_CONFIG[status] ?? AVAILABILITY_CONFIG.unavailable;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export default function JudgeGallery() {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [filtered, setFiltered] = useState<Judge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('');
  const [availFilter, setAvailFilter] = useState('all');
  const [allExpertise, setAllExpertise] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/judges');
        if (!res.ok) throw new Error(`Failed to load judges (${res.status})`);
        const data = await res.json();
        const list: Judge[] = Array.isArray(data) ? data : (data.judges ?? []);
        setJudges(list);
        const exp = new Set<string>();
        list.forEach(j => [...(j.primaryExpertise ?? []), ...(j.secondaryExpertise ?? [])].forEach(e => exp.add(e)));
        setAllExpertise(Array.from(exp).sort());
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load judges');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let list = judges;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(j =>
        j.fullName?.toLowerCase().includes(q) ||
        j.headline?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.primaryExpertise?.some(e => e.toLowerCase().includes(q))
      );
    }
    if (expertiseFilter) {
      list = list.filter(j =>
        j.primaryExpertise?.includes(expertiseFilter) || j.secondaryExpertise?.includes(expertiseFilter)
      );
    }
    if (availFilter !== 'all') {
      list = list.filter(j => j.availabilityStatus === availFilter);
    }
    setFiltered(list);
  }, [judges, search, expertiseFilter, availFilter]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin h-10 w-10 border-2 border-orange-600 border-t-transparent rounded-full" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black text-white px-4 py-16 text-center">
      <p className="text-red-400 mb-4">{error}</p>
      <button onClick={() => window.location.reload()} className="text-orange-400 hover:underline">Retry</button>
    </div>
  );

  return (
    <>
      <SEO title="Judges — Maximally" description="Meet the expert judges on the Maximally platform." />
      <div className="min-h-screen bg-black py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Meet Our Judges</h1>
            <p className="text-gray-400 max-w-xl mx-auto mb-5">
              Industry experts who evaluate hackathon submissions and mentor builders.
            </p>
            <Link
              to="/judge/apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Award className="h-4 w-4" />
              Apply to Become a Judge
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, expertise, company…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
            </div>
            <select
              value={expertiseFilter}
              onChange={e => setExpertiseFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">All Expertise</option>
              {allExpertise.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <select
              value={availFilter}
              onChange={e => setAvailFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <p className="text-sm text-gray-500 mb-6">{filtered.length} judge{filtered.length !== 1 ? 's' : ''}</p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p>No judges found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(judge => (
                <Link
                  key={judge.id}
                  to={`/judges/${judge.username}`}
                  className="bg-gray-900 rounded-xl border border-gray-800 p-5 hover:border-orange-500/50 transition-colors group"
                >
                  {/* Avatar + name */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={judge.profilePhoto ?? '/default-avatar.svg'}
                      alt={judge.fullName ?? ''}
                      className="w-14 h-14 rounded-full object-cover bg-gray-800 shrink-0"
                      onError={e => { (e.currentTarget as HTMLImageElement).src = '/default-avatar.svg'; }}
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors truncate">
                        {judge.fullName ?? judge.username}
                      </h3>
                      {judge.headline && <p className="text-xs text-gray-400 truncate">{judge.headline}</p>}
                      {judge.company && <p className="text-xs text-gray-500 truncate">{judge.company}</p>}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <TierBadge tier={judge.tier} />
                    <AvailabilityBadge status={judge.availabilityStatus} />
                  </div>

                  {/* Expertise */}
                  {judge.primaryExpertise?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {judge.primaryExpertise.slice(0, 3).map(e => (
                        <span key={e} className="px-2 py-0.5 bg-orange-900/20 text-orange-400 text-xs rounded-full border border-orange-800">
                          {e}
                        </span>
                      ))}
                      {judge.primaryExpertise.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-full">
                          +{judge.primaryExpertise.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-800">
                    <span className="flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" />
                      {judge.totalEventsJudged} events
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {judge.totalTeamsEvaluated} teams
                    </span>
                    {judge.averageFeedbackRating && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" />
                        {judge.averageFeedbackRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
