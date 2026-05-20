/**
 * OrganizersGallery — public directory of platform organizers
 * Route: /organizers
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Users, Trophy, MapPin, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';

interface Organizer {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website_url: string | null;
  organizer_status: string;
  events_organized: number;
  total_participants_managed: number;
  organizer_tier?: string;
}

const TIER_CONFIG: Record<string, { label: string; className: string }> = {
  platinum: { label: 'Platinum', className: 'bg-purple-900/30 text-purple-300 border border-purple-700' },
  gold:     { label: 'Gold',     className: 'bg-yellow-900/30 text-yellow-300 border border-yellow-700' },
  silver:   { label: 'Silver',   className: 'bg-gray-700 text-gray-200 border border-gray-500' },
  bronze:   { label: 'Bronze',   className: 'bg-orange-900/30 text-orange-300 border border-orange-700' },
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active:    { label: 'Active',    className: 'bg-green-900/20 text-green-400 border border-green-800' },
  inactive:  { label: 'Inactive',  className: 'bg-gray-800 text-gray-400 border border-gray-700' },
  pending:   { label: 'Pending',   className: 'bg-yellow-900/20 text-yellow-400 border border-yellow-800' },
  suspended: { label: 'Suspended', className: 'bg-red-900/20 text-red-400 border border-red-800' },
};

export default function OrganizersGallery() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [filtered, setFiltered] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/organizers');
        if (!res.ok) throw new Error(`Failed to load organizers (${res.status})`);
        const data = await res.json();
        const list: Organizer[] = Array.isArray(data) ? data : (data.organizers ?? []);
        setOrganizers(list);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load organizers');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let list = organizers;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.full_name?.toLowerCase().includes(q) ||
        o.username?.toLowerCase().includes(q) ||
        o.bio?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      list = list.filter(o => o.organizer_status === statusFilter);
    }
    setFiltered(list);
  }, [organizers, search, statusFilter]);

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
      <SEO title="Organizers — Maximally" description="Meet the event organizers on the Maximally platform." />
      <div className="min-h-screen bg-black py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Event Organizers</h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              The builders behind Maximally hackathons and events.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search organizers…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <p className="text-sm text-gray-500 mb-6">{filtered.length} organizer{filtered.length !== 1 ? 's' : ''}</p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p>No organizers found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(org => {
                const statusCfg = STATUS_CONFIG[org.organizer_status] ?? STATUS_CONFIG.inactive;
                const tierCfg = org.organizer_tier ? TIER_CONFIG[org.organizer_tier] : null;
                return (
                  <Link
                    key={org.id}
                    to={`/organizer/${org.username}`}
                    className="bg-gray-900 rounded-xl border border-gray-800 p-5 hover:border-orange-500/50 transition-colors group"
                  >
                    {/* Avatar + name */}
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={org.avatar_url ?? '/default-avatar.svg'}
                        alt={org.full_name ?? ''}
                        className="w-14 h-14 rounded-full object-cover bg-gray-800 shrink-0"
                        onError={e => { (e.currentTarget as HTMLImageElement).src = '/default-avatar.svg'; }}
                      />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors truncate">
                          {org.full_name ?? org.username}
                        </h3>
                        <p className="text-xs text-gray-500">@{org.username}</p>
                        {org.location && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" />{org.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusCfg.className}`}>
                        {statusCfg.label}
                      </span>
                      {tierCfg && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tierCfg.className}`}>
                          {tierCfg.label}
                        </span>
                      )}
                    </div>

                    {/* Bio */}
                    {org.bio && (
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">{org.bio}</p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-800">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {org.events_organized} events
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {org.total_participants_managed} participants
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
