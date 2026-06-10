import { useEffect, useState } from 'react';
import { Trophy, ExternalLink, Github, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

interface ShowcaseProject {
  id: number;
  placement?: string;
  highlight_description?: string;
  featured_at: string;
  hackathon_submissions: {
    id: number; project_name: string; description?: string;
    demo_url?: string; github_url?: string; track?: string;
    profiles: { full_name: string; username: string; reputation_tier: string };
  };
  organizer_hackathons: { hackathon_name: string; slug: string };
}

export default function Showcase() {
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/showcase').then(r => r.json()).then(j => { if (j.success) setProjects(j.data); }).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO title="Project Showcase — Featured Builder Projects | Maximally" description="Standout projects from Maximally hackathons, curated by our team." />
      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="mb-10">
            <span className="font-space text-xs text-orange-400 uppercase tracking-wider">Curated by Maximally</span>
            <h1 className="font-space font-bold text-3xl sm:text-4xl text-white mt-2 mb-3">Project Showcase</h1>
            <p className="font-space text-base text-gray-400">Standout submissions from past hackathons. Each project was selected by our team for its quality and impact.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-gray-900 animate-pulse border border-gray-800" />)}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 border border-gray-800 bg-gray-900/40">
              <Trophy className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <p className="font-space text-sm text-gray-500">No showcase projects yet. Stay tuned.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(p => (
                <div key={p.id} className="border border-gray-800 bg-gray-900/40 hover:border-orange-500/30 transition-colors flex flex-col">
                  <div className="p-5 flex-1">
                    {p.placement && (
                      <span className="font-space text-[10px] text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 border border-amber-500/30 mb-3 inline-block">{p.placement}</span>
                    )}
                    <h3 className="font-space font-bold text-sm text-white mb-2 line-clamp-2">{p.hackathon_submissions?.project_name}</h3>
                    {p.highlight_description && <p className="font-space text-xs text-gray-400 mb-3 line-clamp-3">{p.highlight_description}</p>}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-space text-xs text-gray-500">{p.hackathon_submissions?.profiles?.full_name}</span>
                      <span className="font-space text-[10px] text-gray-600 capitalize bg-gray-800 px-1.5 py-0.5">{p.hackathon_submissions?.profiles?.reputation_tier}</span>
                    </div>
                    <Link to={`/hackathon/${p.organizer_hackathons?.slug}`} className="font-space text-[10px] text-orange-400 hover:text-orange-300">{p.organizer_hackathons?.hackathon_name} →</Link>
                  </div>
                  <div className="border-t border-gray-800 px-5 py-3 flex items-center gap-3">
                    {p.hackathon_submissions?.demo_url && (
                      <a href={p.hackathon_submissions.demo_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-400 transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>
                    )}
                    {p.hackathon_submissions?.github_url && (
                      <a href={p.hackathon_submissions.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-400 transition-colors"><Github className="w-3.5 h-3.5" /></a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-16"><Footer /></div>
      </div>
    </>
  );
}
