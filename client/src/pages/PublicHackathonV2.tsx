/**
 * PublicHackathonV2 — New two-column hackathon page design
 * Route: /event/:slug (separate from old /hackathon/:slug)
 * Uses the same data as PublicHackathon but renders with new layout
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import HackathonPageLayout from '@/components/hackathon/HackathonPageLayout';

export default function PublicHackathonV2() {
  const { slug } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [hackathon, setHackathon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [judgeProfiles, setJudgeProfiles] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);

  useEffect(() => { if (slug) fetchHackathon(); }, [slug]);

  const fetchHackathon = async () => {
    try {
      const res = await fetch(`/api/hackathons/${slug}`);
      const data = await res.json();
      if (data.success) {
        setHackathon(data.data);
        // Fetch judges and winners in parallel
        const [judgesRes, winnersRes] = await Promise.all([
          fetch(`/api/hackathons/${data.data.id}/judge-profiles`),
          fetch(`/api/hackathons/${data.data.id}/winners`),
        ]);
        const judgesData = await judgesRes.json();
        const winnersData = await winnersRes.json();
        if (judgesData.success) setJudgeProfiles(judgesData.data || []);
        if (winnersData.success) setWinners(winnersData.data || []);
      } else {
        toast({ title: "Not Found", description: "Hackathon not found.", variant: "destructive" });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-2xl px-4">
          <div className="h-8 bg-gray-800 w-3/4" /><div className="h-4 bg-gray-800 w-1/2" />
          <div className="h-64 bg-gray-800" />
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-space font-bold text-2xl text-orange-400 mb-4">404</h1>
          <p className="font-space text-gray-400 mb-6">Hackathon not found</p>
          <Link to="/events" className="font-space text-orange-400 hover:underline">Browse events →</Link>
        </div>
      </div>
    );
  }

  const startDate = new Date(hackathon.start_date);
  const endDate = new Date(hackathon.end_date);
  const now = new Date();

  const getStatus = () => {
    if (hackathon.winners_announced) return { label: 'Winners Announced', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30' };
    if (now > endDate) return { label: 'Completed', color: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-600' };
    if (now >= startDate) return { label: 'In Progress', color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' };
    return { label: 'Registration open', color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' };
  };

  const primaryColor = hackathon.primary_color || '#f97316';
  const secondaryColor = hackathon.secondary_color || '#ea580c';
  const accentColor = hackathon.accent_color || '#06B6D4';

  return (
    <>
      <SEO title={`${hackathon.hackathon_name} - Maximally`} description={hackathon.tagline || hackathon.description || ''} />
      <div className="min-h-screen bg-black text-white relative">
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
        <HackathonPageLayout
          hackathon={hackathon}
          status={getStatus()}
          startDate={startDate}
          endDate={endDate}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
          judgeProfiles={judgeProfiles}
          winners={winners}
          fetchHackathon={fetchHackathon}
          onViewWinners={() => {}}
        />
        <Footer />
      </div>
    </>
  );
}
