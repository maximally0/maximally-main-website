import { useEffect, useState } from 'react';
import { Activity, Trophy, Users, Rocket, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

interface FeedEntry {
  id: number;
  action_type: string;
  metadata: any;
  created_at: string;
  profiles: { full_name: string; username: string; avatar_url?: string; reputation_tier: string };
}

const actionIcons: Record<string, React.ElementType> = {
  project_submitted: Rocket, project_placed: Trophy, mentorship_completed: Users,
  event_announced: Star, tier_promoted: Activity,
};
const actionLabels: Record<string, string> = {
  project_submitted: 'submitted a project', project_placed: 'placed in a hackathon',
  mentorship_completed: 'completed a mentorship session', event_announced: 'announced an event',
  tier_promoted: 'was promoted to Veteran',
};

export default function Network() {
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/feed?page=${page}`).then(r => r.json()).then(j => {
      if (j.success) { setEntries(j.data); setTotal(j.total); }
    }).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    fetch('/api/platform-stats').then(r => r.json()).then(j => { if (j.success) setStats(j.data); });
  }, []);

  const totalPages = Math.ceil(total / 20);

  return (
    <>
      <SEO title="Network — Builder Activity Feed | Maximally" description="Real-time activity from the Maximally builder ecosystem." />
      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {/* Platform Stats Strip */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              {[
                { v: stats.total_active_builders, l: 'Active Builders' },
                { v: stats.total_events_run, l: 'Events Run' },
                { v: stats.total_projects_submitted, l: 'Projects Submitted' },
                { v: stats.total_countries_represented, l: 'Countries' },
              ].map((s, i) => (
                <div key={i} className="border border-gray-800 bg-gray-900/40 p-4 text-center">
                  <p className="font-space text-2xl font-bold text-orange-400">{s.v}</p>
                  <p className="font-space text-[10px] text-gray-500 mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mb-8">
            <span className="font-space text-xs text-orange-400 uppercase tracking-wider">Builder Network</span>
            <h1 className="font-space font-bold text-3xl sm:text-4xl text-white mt-2 mb-3">Activity Feed</h1>
            <p className="font-space text-sm text-gray-400">Notable actions from the Maximally ecosystem. No likes, no comments — just signal.</p>
            <p className="font-space text-xs text-gray-600 mt-2">Maximally is built for junior and mid-level developers between 14 and 26 — people actively building, not people who have already arrived.</p>
          </div>

          {/* Feed */}
          {loading ? (
            <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-900 animate-pulse border border-gray-800" />)}</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16 border border-gray-800 bg-gray-900/40">
              <Activity className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <p className="font-space text-sm text-gray-500">No activity yet. Actions will appear here as builders submit projects, complete mentorships, and earn placements.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map(entry => {
                const Icon = actionIcons[entry.action_type] || Activity;
                return (
                  <div key={entry.id} className="flex items-center gap-4 px-4 py-3 border border-gray-800 bg-gray-900/40 hover:border-gray-700 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-space text-sm text-white">
                        <span className="font-medium">{entry.profiles?.full_name || entry.profiles?.username}</span>
                        {' '}<span className="text-gray-400">{actionLabels[entry.action_type] || entry.action_type}</span>
                        {entry.metadata?.event_name && <span className="text-gray-500"> · {entry.metadata.event_name}</span>}
                        {entry.metadata?.project_name && <span className="text-gray-500"> · {entry.metadata.project_name}</span>}
                      </p>
                    </div>
                    <span className="font-space text-[10px] text-gray-600 shrink-0">{new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border border-gray-800 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-space text-xs text-gray-500">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border border-gray-800 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <div className="mt-16"><Footer /></div>
      </div>
    </>
  );
}
