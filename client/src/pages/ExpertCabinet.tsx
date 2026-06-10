/**
 * Expert Cabinet — auto-logged evidence file for mentors/judges
 * Shows activity timeline, headline stats, and export functionality
 */
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/lib/auth';
import { Scale, Users, Clock, FileText, Download, Activity } from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

interface CabinetData {
  profile: any;
  submissions: any[];
  outcomes: any[];
  skills: string[];
}

export default function ExpertCabinet() {
  const { user, profile } = useAuth();
  const [data, setData] = useState<CabinetData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.username) {
      fetch(`/api/portfolio/${profile.username}`)
        .then(r => r.json())
        .then(j => { if (j.success) setData(j.data); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [profile]);

  const handleExport = async () => {
    if (!profile?.username) return;
    const res = await fetch(`/api/portfolio/${profile.username}/export`);
    const json = await res.json();
    if (json.success) {
      const blob = new Blob([JSON.stringify(json.export, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${profile.username}-maximally-portfolio.json`;
      a.click(); URL.revokeObjectURL(url);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">
        <p className="font-space text-gray-500">Please log in to view your cabinet.</p>
      </div>
    );
  }

  return (
    <>
      <SEO title="Expert Cabinet — Maximally" description="Your verified activity record on Maximally." />
      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="font-space text-xs text-orange-400 uppercase tracking-wider">Your Cabinet</span>
              <h1 className="font-space font-bold text-2xl sm:text-3xl text-white mt-1">Activity Record</h1>
              <p className="font-space text-sm text-gray-500 mt-1">Auto-logged from your platform activity. Nothing extra required.</p>
            </div>
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-space text-xs font-bold hover:bg-orange-500/20 transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-900 animate-pulse border border-gray-800" />)}</div>
          ) : !data ? (
            <div className="text-center py-16 border border-gray-800 bg-gray-900/40">
              <Activity className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <p className="font-space text-sm text-gray-500">No activity recorded yet.</p>
            </div>
          ) : (
            <>
              {/* Headline Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                  { icon: FileText, v: data.profile.stats.projects_submitted, l: 'Projects' },
                  { icon: Scale, v: data.profile.stats.projects_placed, l: 'Placements' },
                  { icon: Users, v: data.profile.stats.peer_reviews_given, l: 'Reviews Given' },
                  { icon: Clock, v: data.profile.stats.mentored_hours, l: 'Hours Mentored' },
                ].map((s, i) => (
                  <div key={i} className="border border-gray-800 bg-gray-900/40 p-4 text-center">
                    <s.icon className="w-4 h-4 text-orange-400 mx-auto mb-1.5" />
                    <p className="font-space text-xl font-bold text-white">{s.v}</p>
                    <p className="font-space text-[10px] text-gray-500">{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Tier Badge */}
              <div className="border border-gray-800 bg-gray-900/40 p-4 mb-6 flex items-center gap-3">
                <span className="font-space text-xs text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2.5 py-1 capitalize">{data.profile.reputation_tier}</span>
                {data.profile.tier_updated_at && (
                  <span className="font-space text-xs text-gray-500">since {new Date(data.profile.tier_updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                )}
                <span className="font-space text-xs text-gray-600 ml-auto">Member since {new Date(data.profile.member_since).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>

              {/* Activity Timeline */}
              <h3 className="font-space font-bold text-sm text-white mb-4">Project History</h3>
              <div className="space-y-2 mb-8">
                {data.submissions.length === 0 ? (
                  <p className="font-space text-xs text-gray-500 py-4 text-center">No project submissions yet.</p>
                ) : data.submissions.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3 border border-gray-800 bg-gray-900/40">
                    <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-space text-sm text-white truncate">{s.project_name}</p>
                      <p className="font-space text-[10px] text-gray-500">{s.event_name} · {new Date(s.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                    </div>
                    {s.placement && <span className="font-space text-[10px] text-amber-400 font-bold shrink-0">{s.placement}</span>}
                  </div>
                ))}
              </div>

              {/* Verified Outcomes */}
              {data.outcomes.length > 0 && (
                <>
                  <h3 className="font-space font-bold text-sm text-white mb-4">Verified Outcomes</h3>
                  <div className="space-y-2 mb-8">
                    {data.outcomes.map((o: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 px-4 py-3 border border-green-500/20 bg-green-500/5">
                        <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-space text-sm text-white">{o.description}</p>
                          <p className="font-space text-[10px] text-gray-500 capitalize">{o.outcome_type.replace('_', ' ')} · Verified {new Date(o.verified_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Public profile link */}
              <div className="border border-gray-800 bg-gray-900/40 p-4 text-center">
                <p className="font-space text-xs text-gray-500 mb-2">Shareable public profile</p>
                <p className="font-space text-sm text-orange-400 font-medium">maximally.org/profile/{data.profile.username}</p>
              </div>
            </>
          )}
        </div>
        <div className="mt-16"><Footer /></div>
      </div>
    </>
  );
}
