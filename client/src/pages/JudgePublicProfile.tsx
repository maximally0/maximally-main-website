/**
 * JudgePublicProfile — public judge profile page
 * Route: /judges/:username
 * Private fields (email, phone, address) only shown to admins.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Award, Star, Users, MapPin, ExternalLink, Github, Linkedin, Twitter, Globe, Shield, Calendar } from 'lucide-react';
import SEO from '../components/SEO';
import { useAuth } from '@/contexts/AuthContext';

interface JudgeProfile {
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
  totalMentorshipHours: number;
  yearsOfExperience: number;
  averageFeedbackRating: number | null;
  eventsJudgedVerified: boolean;
  teamsEvaluatedVerified: boolean;
  mentorshipHoursVerified: boolean;
  availabilityStatus: string;
  tier: string;
  linkedin: string | null;
  github: string | null;
  twitter: string | null;
  website: string | null;
  languagesSpoken: string[];
  publicAchievements: string | null;
  mentorshipStatement: string | null;
  topEventsJudged: Array<{ eventName: string; role: string; date: string; link?: string; verified: boolean }>;
  // Admin-only fields
  email?: string;
  phone?: string;
  address?: string;
  timezone?: string;
  compensationPreference?: string;
}

const TIER_CONFIG: Record<string, { label: string; className: string }> = {
  legend:      { label: 'Legend',      className: 'bg-yellow-900/30 text-yellow-300 border border-yellow-700' },
  expert:      { label: 'Expert',      className: 'bg-purple-900/30 text-purple-300 border border-purple-700' },
  established: { label: 'Established', className: 'bg-blue-900/30 text-blue-300 border border-blue-700' },
  rising:      { label: 'Rising',      className: 'bg-green-900/30 text-green-300 border border-green-700' },
  starter:     { label: 'Starter',     className: 'bg-gray-800 text-gray-400 border border-gray-700' },
};

function StatCard({ label, value, verified }: { label: string; value: number | string; verified?: boolean }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
        {label}
        {verified && <Shield className="h-3 w-3 text-green-400" aria-label="Verified" />}
      </div>
    </div>
  );
}

export default function JudgePublicProfile() {
  const { username } = useParams<{ username: string }>();
  const { profile: authProfile } = useAuth();
  const isAdmin = authProfile?.role === 'admin';

  const [judge, setJudge] = useState<JudgeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    (async () => {
      try {
        const res = await fetch(`/api/judges/${username}`);
        if (!res.ok) throw new Error(res.status === 404 ? 'Judge not found' : `Error ${res.status}`);
        const data = await res.json();
        setJudge(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin h-10 w-10 border-2 border-orange-600 border-t-transparent rounded-full" />
    </div>
  );

  if (error || !judge) return (
    <div className="min-h-screen bg-black text-white px-4 py-16 text-center">
      <p className="text-red-400 mb-6">{error ?? 'Judge not found'}</p>
      <Link to="/judges" className="text-orange-400 hover:underline">Back to Judges</Link>
    </div>
  );

  const tier = TIER_CONFIG[judge.tier] ?? TIER_CONFIG.starter;

  return (
    <>
      <SEO
        title={`${judge.fullName ?? judge.username} — Maximally Judge`}
        description={judge.shortBio ?? `Judge profile for ${judge.fullName} on Maximally.`}
      />
      <div className="min-h-screen bg-black py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/judges" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 mb-8">
            <ArrowLeft className="h-4 w-4" /> All Judges
          </Link>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 mb-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <img
                src={judge.profilePhoto ?? '/default-avatar.svg'}
                alt={judge.fullName ?? ''}
                className="w-24 h-24 rounded-full object-cover bg-gray-800 shrink-0"
                onError={e => { (e.currentTarget as HTMLImageElement).src = '/default-avatar.svg'; }}
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">{judge.fullName ?? judge.username}</h1>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${tier.className}`}>
                    <Award className="h-3 w-3" />{tier.label}
                  </span>
                </div>
                {judge.headline && <p className="text-gray-300 mb-1">{judge.headline}</p>}
                {(judge.currentRole || judge.company) && (
                  <p className="text-sm text-gray-400 mb-2">
                    {[judge.currentRole, judge.company].filter(Boolean).join(' @ ')}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  {judge.location && (
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{judge.location}</span>
                  )}
                  {judge.yearsOfExperience > 0 && (
                    <span>{judge.yearsOfExperience}y experience</span>
                  )}
                  {judge.averageFeedbackRating && (
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-yellow-400" />{judge.averageFeedbackRating.toFixed(1)} rating</span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <StatCard label="Events Judged" value={judge.totalEventsJudged} verified={judge.eventsJudgedVerified} />
              <StatCard label="Teams Evaluated" value={judge.totalTeamsEvaluated} verified={judge.teamsEvaluatedVerified} />
              <StatCard label="Mentorship Hours" value={judge.totalMentorshipHours} verified={judge.mentorshipHoursVerified} />
            </div>

            {/* Bio */}
            {judge.shortBio && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">About</h2>
                <p className="text-gray-300 leading-relaxed">{judge.shortBio}</p>
              </div>
            )}

            {/* Primary Expertise */}
            {judge.primaryExpertise?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Primary Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {judge.primaryExpertise.map(e => (
                    <span key={e} className="px-3 py-1 bg-orange-900/20 text-orange-400 text-sm rounded-full border border-orange-800">{e}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Secondary Expertise */}
            {judge.secondaryExpertise?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Secondary Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {judge.secondaryExpertise.map(e => (
                    <span key={e} className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700">{e}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Hackathons Judged */}
            {judge.topEventsJudged?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Hackathons Judged</h2>
                <div className="space-y-2">
                  {judge.topEventsJudged.map((ev, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white flex items-center gap-2">
                          {ev.eventName}
                          {ev.verified && <Shield className="h-3.5 w-3.5 text-green-400" aria-label="Verified" />}
                        </p>
                        <p className="text-xs text-gray-400">{ev.role} · {ev.date}</p>
                      </div>
                      {ev.link && (
                        <a href={ev.link} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mentorship Statement */}
            {judge.mentorshipStatement && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Mentorship Philosophy</h2>
                <p className="text-gray-300 leading-relaxed italic">"{judge.mentorshipStatement}"</p>
              </div>
            )}

            {/* Public Achievements */}
            {judge.publicAchievements && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Achievements</h2>
                <p className="text-gray-300 leading-relaxed">{judge.publicAchievements}</p>
              </div>
            )}

            {/* Social Links */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-800">
              {judge.linkedin && (
                <a href={judge.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              )}
              {judge.github && (
                <a href={judge.github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              )}
              {judge.twitter && (
                <a href={judge.twitter} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-sky-400 transition-colors">
                  <Twitter className="h-4 w-4" /> Twitter
                </a>
              )}
              {judge.website && (
                <a href={judge.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors">
                  <Globe className="h-4 w-4" /> Website
                </a>
              )}
            </div>
          </div>

          {/* Admin-only private data */}
          {isAdmin && (judge.email || judge.phone || judge.address || judge.timezone || judge.compensationPreference) && (
            <div className="bg-amber-900/10 border border-amber-700/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-4 w-4 text-amber-400" />
                <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Admin Only — Private Data</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {judge.email && <div><span className="text-gray-500">Email:</span> <span className="text-white">{judge.email}</span></div>}
                {judge.phone && <div><span className="text-gray-500">Phone:</span> <span className="text-white">{judge.phone}</span></div>}
                {judge.address && <div><span className="text-gray-500">Address:</span> <span className="text-white">{judge.address}</span></div>}
                {judge.timezone && <div><span className="text-gray-500">Timezone:</span> <span className="text-white">{judge.timezone}</span></div>}
                {judge.compensationPreference && <div><span className="text-gray-500">Compensation:</span> <span className="text-white">{judge.compensationPreference}</span></div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
