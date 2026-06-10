import { useEffect, useState } from 'react';
import { Award, GraduationCap, Briefcase, Rocket, Trophy, Star } from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

interface Outcome {
  id: number;
  outcome_type: string;
  description: string;
  verified_at: string;
  profiles: { full_name: string; username: string; avatar_url?: string; reputation_tier: string };
  related_event_id?: number;
}

const typeIcons: Record<string, React.ElementType> = {
  university_admission: GraduationCap, internship: Briefcase, product_launch: Rocket,
  job_offer: Briefcase, award: Trophy, other: Star
};

const typeLabels: Record<string, string> = {
  university_admission: 'University Admission', internship: 'Internship', product_launch: 'Product Launch',
  job_offer: 'Job Offer', award: 'Award', other: 'Achievement'
};

export default function Outcomes() {
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/outcomes').then(r => r.json()).then(j => { if (j.success) setOutcomes(j.data); }).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? outcomes : outcomes.filter(o => o.outcome_type === filter);

  return (
    <>
      <SEO title="Outcomes — Verified Builder Achievements | Maximally" description="Verified post-platform achievements from Maximally builders." />
      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="mb-10">
            <span className="font-space text-xs text-orange-400 uppercase tracking-wider">Verified Achievements</span>
            <h1 className="font-space font-bold text-3xl sm:text-4xl text-white mt-2 mb-3">Builder Outcomes</h1>
            <p className="font-space text-base text-gray-400">Every outcome listed here has been verified by our team. These are real results from real builders.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['all', 'university_admission', 'internship', 'product_launch', 'job_offer', 'award'].map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-3 py-1.5 font-space text-xs border transition-colors ${filter === t ? 'bg-orange-500/15 border-orange-500/40 text-orange-400' : 'border-gray-800 text-gray-500 hover:text-gray-300'}`}>
                {t === 'all' ? 'All' : typeLabels[t]}
              </button>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-900 animate-pulse border border-gray-800" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 border border-gray-800 bg-gray-900/40">
              <Award className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <p className="font-space text-sm text-gray-500">No outcomes to display yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(o => {
                const Icon = typeIcons[o.outcome_type] || Star;
                return (
                  <div key={o.id} className="flex items-start gap-4 p-4 border border-gray-800 bg-gray-900/40 hover:border-gray-700 transition-colors">
                    <div className="w-10 h-10 border border-orange-500/30 bg-orange-500/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-space text-sm text-white mb-1">{o.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-space text-xs text-gray-500">{o.profiles?.full_name || o.profiles?.username}</span>
                        <span className="font-space text-[10px] text-gray-600">·</span>
                        <span className="font-space text-[10px] text-gray-600 capitalize">{o.profiles?.reputation_tier}</span>
                        <span className="font-space text-[10px] text-gray-600">·</span>
                        <span className="font-space text-[10px] text-gray-600">Verified {new Date(o.verified_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <span className="font-space text-[10px] text-orange-400 uppercase bg-orange-500/10 px-2 py-1 border border-orange-500/30 shrink-0">{typeLabels[o.outcome_type]}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="mt-16"><Footer /></div>
      </div>
    </>
  );
}
