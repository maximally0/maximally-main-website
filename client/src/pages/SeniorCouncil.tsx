import { useEffect, useState } from 'react';
import { Shield, Calendar } from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

interface CouncilMember {
  id: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  reputation_tier: string;
  council_assigned_at: string;
  // Joined data
  events_judged?: number;
  mentored_hours?: number;
  projects_reviewed?: number;
}

export default function SeniorCouncil() {
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profiles?tier=council')
      .then(r => r.json())
      .then(j => {
        if (j.success) setMembers(j.data || []);
        else {
          // Fallback: fetch all profiles and filter council
          fetch('/api/profiles').then(r => r.json()).then(all => {
            if (Array.isArray(all)) setMembers(all.filter((p: any) => p.reputation_tier === 'council'));
            else if (all.data) setMembers((all.data || []).filter((p: any) => p.reputation_tier === 'council'));
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO title="Senior Council — Maximally" description="Practitioners who evaluate projects and mentor builders on Maximally." />
      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-400" />
              <span className="font-space text-xs text-orange-400 uppercase tracking-wider">Senior Council</span>
            </div>
            <h1 className="font-space font-bold text-3xl sm:text-4xl text-white mb-4">Senior Council</h1>
            <p className="font-space text-base text-gray-400 max-w-2xl">
              These are practitioners who have evaluated projects and mentored builders on Maximally. Their presence is a service to the community.
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-gray-900 animate-pulse border border-gray-800" />)}</div>
          ) : members.length === 0 ? (
            <div className="text-center py-16 border border-gray-800 bg-gray-900/40">
              <Shield className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <p className="font-space text-sm text-gray-500">No council members to display. Council membership is invitation-only.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {members.map(member => (
                <div key={member.id} className="border border-gray-800 bg-gray-900/40 p-6 hover:border-orange-500/20 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-800 shrink-0 border border-gray-700">
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt={member.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-orange-400 font-space font-bold text-xl">{(member.full_name || member.username || 'U')[0].toUpperCase()}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-space font-bold text-base text-white">{member.full_name || member.username}</h3>
                        <span className="font-space text-[10px] text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5">Council</span>
                      </div>
                      {member.bio && <p className="font-space text-xs text-gray-400 mb-3">{member.bio}</p>}
                      <div className="flex flex-wrap gap-4 text-xs">
                        {member.events_judged !== undefined && member.events_judged > 0 && (
                          <span className="font-space text-gray-500">{member.events_judged} events judged</span>
                        )}
                        {member.projects_reviewed !== undefined && member.projects_reviewed > 0 && (
                          <span className="font-space text-gray-500">{member.projects_reviewed} projects reviewed</span>
                        )}
                        {member.mentored_hours !== undefined && member.mentored_hours > 0 && (
                          <span className="font-space text-gray-500">{member.mentored_hours}h mentored</span>
                        )}
                        {member.council_assigned_at && (
                          <span className="font-space text-gray-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Since {new Date(member.council_assigned_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
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
