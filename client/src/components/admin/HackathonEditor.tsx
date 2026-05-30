/**
 * HackathonEditor — Admin panel component for managing hackathon content
 * Judges, Mentors, Announcements, Sponsors, Winners, Feedback, Prizes
 */
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Scale, Megaphone, Trophy, Users, Star, MessageCircle, 
  Plus, Trash2, Save, X, Loader2, Edit2, ExternalLink, Image
} from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

interface HackathonEditorProps {
  hackathonId: number;
  hackathonName: string;
  onBack: () => void;
}

type EditorTab = 'judges' | 'announcements' | 'sponsors' | 'winners' | 'feedback' | 'prizes';

export default function HackathonEditor({ hackathonId, hackathonName, onBack }: HackathonEditorProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('judges');

  const tabs: { id: EditorTab; label: string; icon: React.ElementType }[] = [
    { id: 'judges', label: 'Judges', icon: Scale },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'sponsors', label: 'Sponsors', icon: Star },
    { id: 'winners', label: 'Winners', icon: Trophy },
    { id: 'feedback', label: 'Feedback', icon: MessageCircle },
    { id: 'prizes', label: 'Prizes', icon: Trophy },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 text-gray-400 hover:text-orange-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-space font-bold text-lg text-white">{hackathonName}</h2>
          <p className="font-space text-xs text-gray-500">Manage hackathon content</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 border-b border-gray-800 pb-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 font-space text-xs font-bold transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-orange-400 border-orange-400'
                : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'judges' && <JudgesTab hackathonId={hackathonId} />}
      {activeTab === 'announcements' && <AnnouncementsTab hackathonId={hackathonId} />}
      {activeTab === 'sponsors' && <SponsorsTab hackathonId={hackathonId} />}
      {activeTab === 'winners' && <WinnersTab hackathonId={hackathonId} />}
      {activeTab === 'feedback' && <FeedbackTab hackathonId={hackathonId} />}
      {activeTab === 'prizes' && <PrizesTab hackathonId={hackathonId} />}
    </div>
  );
}


// ─── Judges Tab ───────────────────────────────────────────────────────────────
function JudgesTab({ hackathonId }: { hackathonId: number }) {
  const [judges, setJudges] = useState<any[]>([]);
  const [allJudges, setAllJudges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { fetchAssigned(); fetchAll(); }, []);

  const fetchAssigned = async () => {
    try {
      const res = await fetch(`/api/hackathons/${hackathonId}/judge-profiles`);
      const json = await res.json();
      if (json.success) setJudges(json.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchAll = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/judge-profiles', { headers });
      const json = await res.json();
      if (json.success) setAllJudges(json.data || []);
    } catch (err) { console.error(err); }
  };

  const assignJudge = async (judgeId: number) => {
    const headers = await getAuthHeaders();
    await fetch(`/api/judge-profiles/${judgeId}/assign`, {
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ hackathon_ids: [hackathonId] }),
    });
    await fetchAssigned();
    setShowAdd(false);
  };

  const removeJudge = async (judgeId: number) => {
    const headers = await getAuthHeaders();
    await fetch(`/api/judge-profiles/${judgeId}/unassign/${hackathonId}`, { method: 'DELETE', headers });
    await fetchAssigned();
  };

  const unassignedJudges = allJudges.filter(j => !judges.find((aj: any) => aj.id === j.id));

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-space text-sm text-gray-400">{judges.length} judge(s) assigned</p>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-space text-xs font-bold hover:bg-orange-500/20 transition-colors">
          <Plus className="w-3 h-3" /> Add Judge
        </button>
      </div>

      {showAdd && (
        <div className="border border-orange-500/30 bg-gray-900/60 p-4 space-y-2 max-h-48 overflow-y-auto">
          {unassignedJudges.length === 0 ? (
            <p className="font-space text-xs text-gray-500">All judges are already assigned. Create new judges in the Judges tab.</p>
          ) : unassignedJudges.map(j => (
            <button key={j.id} onClick={() => assignJudge(j.id)} className="w-full flex items-center gap-3 px-3 py-2 border border-gray-800 hover:border-orange-500/30 text-left transition-colors">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-orange-400 font-space font-bold text-xs shrink-0">
                {j.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-space text-xs text-white truncate">{j.name}</p>
                <p className="font-space text-[10px] text-gray-500 truncate">{j.title || j.email}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {judges.map((judge: any) => (
          <div key={judge.id} className="flex items-center gap-3 px-4 py-3 border border-gray-800 bg-gray-900/40">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 shrink-0">
              {judge.profile_photo ? <img src={judge.profile_photo} alt="" className="w-full h-full object-cover" /> : (
                <div className="w-full h-full flex items-center justify-center text-orange-400 font-space font-bold">{judge.name[0]}</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-space text-sm text-white font-medium truncate">{judge.name}</p>
              <p className="font-space text-xs text-gray-500 truncate">{judge.title || judge.email}</p>
            </div>
            <button onClick={() => removeJudge(judge.id)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── Announcements Tab ────────────────────────────────────────────────────────
function AnnouncementsTab({ hackathonId }: { hackathonId: number }) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', announcement_type: 'general', is_published: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/organizer/hackathons/${hackathonId}/announcements`, { headers });
      const json = await res.json();
      if (json.success) setAnnouncements(json.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/organizer/hackathons/${hackathonId}/announcements`, {
        method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, target_audience: 'public', send_email: false }),
      });
      await fetchAnnouncements();
      setShowForm(false);
      setForm({ title: '', content: '', announcement_type: 'general', is_published: true });
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this announcement?')) return;
    const headers = await getAuthHeaders();
    await fetch(`/api/organizer/hackathons/${hackathonId}/announcements/${id}`, { method: 'DELETE', headers });
    await fetchAnnouncements();
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-space text-sm text-gray-400">{announcements.length} announcement(s)</p>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-space text-xs font-bold hover:bg-orange-500/20 transition-colors">
          <Plus className="w-3 h-3" /> New
        </button>
      </div>

      {showForm && (
        <div className="border border-orange-500/30 bg-gray-900/60 p-4 space-y-3">
          <input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50" />
          <textarea placeholder="Content" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50" />
          <select value={form.announcement_type} onChange={e => setForm(f => ({ ...f, announcement_type: e.target.value }))}
            className="px-3 py-2 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50">
            <option value="general">General</option>
            <option value="important">Important</option>
            <option value="reminder">Reminder</option>
            <option value="update">Update</option>
          </select>
          <button onClick={handleCreate} disabled={saving || !form.title}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-space text-xs font-bold disabled:opacity-50 transition-colors">
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {announcements.map((a: any) => (
          <div key={a.id} className="flex items-start gap-3 px-4 py-3 border border-gray-800 bg-gray-900/40">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-space text-sm text-white font-medium truncate">{a.title}</p>
                <span className="font-space text-[10px] text-gray-500 uppercase">{a.announcement_type}</span>
              </div>
              <p className="font-space text-xs text-gray-400 line-clamp-2">{a.content}</p>
              <p className="font-space text-[10px] text-gray-600 mt-1">{new Date(a.created_at).toLocaleDateString()}</p>
            </div>
            <button onClick={() => handleDelete(a.id)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── Sponsors Tab ─────────────────────────────────────────────────────────────
function SponsorsTab({ hackathonId }: { hackathonId: number }) {
  const [sponsors, setSponsors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSponsor, setNewSponsor] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchHackathon(); }, []);

  const fetchHackathon = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/events?all=true`, { headers });
      const json = await res.json();
      const hackathon = (json.organizer || []).find((h: any) => h.id === hackathonId);
      if (hackathon?.sponsors) {
        setSponsors(Array.isArray(hackathon.sponsors) ? hackathon.sponsors : JSON.parse(hackathon.sponsors || '[]'));
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const saveSponors = async (updated: string[]) => {
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/events/${hackathonId}`, {
        method: 'PATCH', headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ sponsors: updated }),
      });
      setSponsors(updated);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const addSponsor = () => {
    if (!newSponsor.trim()) return;
    const updated = [...sponsors, newSponsor.trim()];
    saveSponors(updated);
    setNewSponsor('');
  };

  const removeSponsor = (index: number) => {
    const updated = sponsors.filter((_, i) => i !== index);
    saveSponors(updated);
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input placeholder="Sponsor name" value={newSponsor} onChange={e => setNewSponsor(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSponsor()}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50" />
        <button onClick={addSponsor} disabled={saving || !newSponsor.trim()}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-space text-xs font-bold disabled:opacity-50 transition-colors">
          Add
        </button>
      </div>
      <div className="space-y-2">
        {sponsors.map((s, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5 border border-gray-800 bg-gray-900/40">
            <span className="font-space text-sm text-white">{s}</span>
            <button onClick={() => removeSponsor(i)} className="p-1 text-gray-500 hover:text-red-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {sponsors.length === 0 && <p className="font-space text-xs text-gray-500 text-center py-4">No sponsors added yet.</p>}
      </div>
    </div>
  );
}


// ─── Winners Tab ──────────────────────────────────────────────────────────────
function WinnersTab({ hackathonId }: { hackathonId: number }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProjects(); fetchWinners(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/hackathons/${hackathonId}/projects`);
      const json = await res.json();
      if (json.success) setProjects(json.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchWinners = async () => {
    try {
      const res = await fetch(`/api/hackathons/${hackathonId}/winners`);
      const json = await res.json();
      if (json.success) setWinners(json.data || []);
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>;

  return (
    <div className="space-y-4">
      {winners.length > 0 && (
        <div className="border border-green-500/30 bg-green-500/5 p-4">
          <h4 className="font-space font-bold text-sm text-green-400 mb-3">🏆 Announced Winners</h4>
          <div className="space-y-2">
            {winners.map((w: any, i: number) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 border border-gray-800 bg-gray-900/40">
                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-space text-sm text-white truncate">{w.project_name || w.team_name || 'Unknown'}</p>
                  <p className="font-space text-[10px] text-gray-500">{w.prize_won || `Position ${i + 1}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-space font-bold text-sm text-white mb-3">Submitted Projects ({projects.length})</h4>
        {projects.length === 0 ? (
          <p className="font-space text-xs text-gray-500 text-center py-4">No submissions yet.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {projects.map((p: any) => (
              <div key={p.id} className="flex items-center gap-3 px-3 py-2 border border-gray-800 bg-gray-900/40">
                <div className="flex-1 min-w-0">
                  <p className="font-space text-xs text-white truncate">{p.project_name}</p>
                  <p className="font-space text-[10px] text-gray-500 truncate">{p.tagline || p.user_name}</p>
                </div>
                {p.prize_won && <span className="font-space text-[10px] text-amber-400 font-bold shrink-0">{p.prize_won}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// ─── Feedback Tab ─────────────────────────────────────────────────────────────
function FeedbackTab({ hackathonId }: { hackathonId: number }) {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFeedback(); }, []);

  const fetchFeedback = async () => {
    try {
      const [fbRes, statsRes] = await Promise.all([
        fetch(`/api/hackathons/${hackathonId}/participant-feedback`),
        fetch(`/api/hackathons/${hackathonId}/participant-feedback/stats`),
      ]);
      const fbJson = await fbRes.json();
      const statsJson = await statsRes.json();
      if (fbJson.success) setFeedbacks(fbJson.data || []);
      if (statsJson.success) setStats(statsJson.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>;

  return (
    <div className="space-y-4">
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border border-gray-800 bg-gray-900/40 p-3 text-center">
            <p className="font-space text-lg font-bold text-orange-400">{stats.total_responses || 0}</p>
            <p className="font-space text-[10px] text-gray-500">Responses</p>
          </div>
          <div className="border border-gray-800 bg-gray-900/40 p-3 text-center">
            <p className="font-space text-lg font-bold text-orange-400">{stats.avg_overall?.toFixed(1) || '-'}</p>
            <p className="font-space text-[10px] text-gray-500">Avg Rating</p>
          </div>
          <div className="border border-gray-800 bg-gray-900/40 p-3 text-center">
            <p className="font-space text-lg font-bold text-orange-400">{stats.avg_organization?.toFixed(1) || '-'}</p>
            <p className="font-space text-[10px] text-gray-500">Organization</p>
          </div>
          <div className="border border-gray-800 bg-gray-900/40 p-3 text-center">
            <p className="font-space text-lg font-bold text-green-400">{stats.recommend_percentage || 0}%</p>
            <p className="font-space text-[10px] text-gray-500">Would Recommend</p>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {feedbacks.length === 0 ? (
          <p className="font-space text-xs text-gray-500 text-center py-4">No feedback submitted yet.</p>
        ) : feedbacks.map((fb: any) => (
          <div key={fb.id} className="border border-gray-800 bg-gray-900/40 p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-space text-xs text-white font-medium">{fb.profiles?.full_name || fb.profiles?.username || 'Anonymous'}</span>
              <span className="font-space text-[10px] text-gray-500">⭐ {fb.overall_rating}/5</span>
            </div>
            {fb.testimonial && <p className="font-space text-xs text-gray-300 italic mb-1">"{fb.testimonial}"</p>}
            {fb.experience_highlights && <p className="font-space text-[10px] text-gray-400">{fb.experience_highlights}</p>}
            {fb.improvement_suggestions && <p className="font-space text-[10px] text-gray-500 mt-1">💡 {fb.improvement_suggestions}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── Prizes Tab ───────────────────────────────────────────────────────────────
function PrizesTab({ hackathonId }: { hackathonId: number }) {
  const [prizePool, setPrizePool] = useState('');
  const [prizeBreakdown, setPrizeBreakdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPrizes(); }, []);

  const fetchPrizes = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/events?all=true`, { headers });
      const json = await res.json();
      const hackathon = (json.organizer || []).find((h: any) => h.id === hackathonId);
      if (hackathon) {
        setPrizePool(hackathon.total_prize_pool || hackathon.prize_pool || '');
        setPrizeBreakdown(hackathon.prize_breakdown || '');
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/events/${hackathonId}`, {
        method: 'PATCH', headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ total_prize_pool: prizePool, prize_breakdown: prizeBreakdown }),
      });
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>;

  return (
    <div className="space-y-4">
      <div>
        <label className="font-space text-xs text-gray-400 mb-1.5 block">Total Prize Pool</label>
        <input value={prizePool} onChange={e => setPrizePool(e.target.value)} placeholder="e.g. ₹3,00,000+"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50" />
      </div>
      <div>
        <label className="font-space text-xs text-gray-400 mb-1.5 block">Prize Breakdown (JSON)</label>
        <textarea value={prizeBreakdown} onChange={e => setPrizeBreakdown(e.target.value)} rows={6}
          placeholder='[{"position": "1st Place", "prize": "₹1,00,000"}, {"position": "2nd Place", "prize": "₹50,000"}]'
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white font-mono text-xs focus:outline-none focus:border-orange-500/50" />
        <p className="font-space text-[10px] text-gray-600 mt-1">JSON array with position and prize fields</p>
      </div>
      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-space text-xs font-bold disabled:opacity-50 transition-colors">
        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
        Save Prizes
      </button>
    </div>
  );
}
