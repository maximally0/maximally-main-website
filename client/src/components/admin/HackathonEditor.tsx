/**
 * HackathonEditor — Admin panel component for managing hackathon content
 * Simplified: Add judges directly with all fields, manage announcements, sponsors, prizes
 */
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Scale, Megaphone, Trophy, Star, MessageCircle, 
  Plus, Trash2, Save, X, Loader2, Edit2, ExternalLink
} from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

interface HackathonEditorProps {
  hackathonId: number;
  hackathonName: string;
  onBack: () => void;
}

type EditorTab = 'judges' | 'announcements' | 'sponsors' | 'prizes' | 'winners' | 'feedback';

export default function HackathonEditor({ hackathonId, hackathonName, onBack }: HackathonEditorProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('judges');

  const tabs: { id: EditorTab; label: string; icon: React.ElementType }[] = [
    { id: 'judges', label: 'Judges', icon: Scale },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'sponsors', label: 'Sponsors', icon: Star },
    { id: 'prizes', label: 'Prizes', icon: Trophy },
    { id: 'winners', label: 'Winners', icon: Trophy },
    { id: 'feedback', label: 'Feedback', icon: MessageCircle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 text-gray-400 hover:text-orange-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-space font-bold text-lg text-white">{hackathonName}</h2>
          <p className="font-space text-xs text-gray-500">Manage hackathon content</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-gray-800 pb-0">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 font-space text-xs font-bold transition-colors border-b-2 ${activeTab === tab.id ? 'text-orange-400 border-orange-400' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>
            <tab.icon className="w-3.5 h-3.5" />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'judges' && <JudgesTab hackathonId={hackathonId} />}
      {activeTab === 'announcements' && <AnnouncementsTab hackathonId={hackathonId} />}
      {activeTab === 'sponsors' && <SponsorsTab hackathonId={hackathonId} />}
      {activeTab === 'prizes' && <PrizesTab hackathonId={hackathonId} />}
      {activeTab === 'winners' && <WinnersTab hackathonId={hackathonId} />}
      {activeTab === 'feedback' && <FeedbackTab hackathonId={hackathonId} />}
    </div>
  );
}


// ─── Judges Tab — Add judges directly with all fields ─────────────────────────
function JudgesTab({ hackathonId }: { hackathonId: number }) {
  const [judges, setJudges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', title: '', profile_photo: '', link: '' });

  useEffect(() => { fetchJudges(); }, []);

  const fetchJudges = async () => {
    try {
      const res = await fetch(`/api/hackathons/${hackathonId}/judge-profiles`);
      const json = await res.json();
      if (json.success) setJudges(json.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.name || !form.email) return;
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      let judgeId = editingId;

      if (editingId) {
        // Update existing
        await fetch(`/api/judge-profiles/${editingId}`, {
          method: 'PATCH', headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        // Create new judge and assign to this hackathon
        const createRes = await fetch('/api/judge-profiles', {
          method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const createJson = await createRes.json();
        if (createJson.success) {
          judgeId = createJson.data.id;
          // Assign to this hackathon
          await fetch(`/api/judge-profiles/${judgeId}/assign`, {
            method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ hackathon_ids: [hackathonId] }),
          });
        }
      }
      await fetchJudges();
      resetForm();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleRemove = async (judgeId: number) => {
    if (!confirm('Remove this judge from this hackathon?')) return;
    const headers = await getAuthHeaders();
    await fetch(`/api/judge-profiles/${judgeId}/unassign/${hackathonId}`, { method: 'DELETE', headers });
    await fetchJudges();
  };

  const startEdit = (judge: any) => {
    setEditingId(judge.id);
    setForm({ name: judge.name, email: judge.email, title: judge.title || '', profile_photo: judge.profile_photo || '', link: judge.link || '' });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name: '', email: '', title: '', profile_photo: '', link: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-space text-sm text-gray-400">{judges.length} judge(s)</p>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-space text-xs font-bold hover:bg-orange-500/20 transition-colors">
          <Plus className="w-3 h-3" /> Add Judge
        </button>
      </div>

      {/* Inline form — add/edit judge directly */}
      {showForm && (
        <div className="border border-orange-500/30 bg-gray-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-space font-bold text-sm text-white">{editingId ? 'Edit Judge' : 'Add Judge to this Hackathon'}</h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
            <input placeholder="Email *" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
          </div>
          <input placeholder="Title / Bio (e.g. Engineering Manager at Google)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Profile Photo URL" value={form.profile_photo} onChange={e => setForm(f => ({ ...f, profile_photo: e.target.value }))}
              className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
            <input placeholder="LinkedIn / Portfolio URL" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
              className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
          </div>
          {form.profile_photo && (
            <div className="flex items-center gap-3">
              <img src={form.profile_photo} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-gray-700" onError={e => (e.currentTarget.style.display = 'none')} />
              <span className="font-space text-xs text-gray-500">Photo preview</span>
            </div>
          )}
          <button onClick={handleSave} disabled={saving || !form.name || !form.email}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-space text-xs font-bold disabled:opacity-50 transition-colors">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {editingId ? 'Update Judge' : 'Add Judge'}
          </button>
        </div>
      )}

      {/* Judges list */}
      <div className="space-y-2">
        {judges.map((judge: any) => (
          <div key={judge.id} className="flex items-center gap-4 px-4 py-3 border border-gray-800 bg-gray-900/40 hover:border-gray-700 transition-colors">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-800 shrink-0 border border-gray-700">
              {judge.profile_photo ? (
                <img src={judge.profile_photo} alt={judge.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-orange-400 font-space font-bold text-lg">{judge.name[0]}</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-space text-sm text-white font-medium truncate">{judge.name}</p>
                {judge.link && <a href={judge.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-400"><ExternalLink className="w-3 h-3" /></a>}
              </div>
              <p className="font-space text-xs text-gray-500 truncate">{judge.title || judge.email}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => startEdit(judge)} className="p-2 text-gray-500 hover:text-white transition-colors" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => handleRemove(judge.id)} className="p-2 text-gray-500 hover:text-red-400 transition-colors" title="Remove"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
        {judges.length === 0 && !showForm && (
          <div className="text-center py-8 border border-dashed border-gray-800">
            <Scale className="w-6 h-6 text-gray-700 mx-auto mb-2" />
            <p className="font-space text-xs text-gray-500">No judges added yet. Click "Add Judge" to get started.</p>
          </div>
        )}
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
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
          <textarea placeholder="Content" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3}
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
          <select value={form.announcement_type} onChange={e => setForm(f => ({ ...f, announcement_type: e.target.value }))}
            className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50">
            <option value="general">General</option><option value="important">Important</option><option value="reminder">Reminder</option><option value="update">Update</option>
          </select>
          <button onClick={handleCreate} disabled={saving || !form.title} className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-space text-xs font-bold disabled:opacity-50 transition-colors">
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
                <span className="font-space text-[10px] text-orange-400 uppercase bg-orange-500/10 px-1.5 py-0.5">{a.announcement_type}</span>
              </div>
              <p className="font-space text-xs text-gray-400 line-clamp-2">{a.content}</p>
              <p className="font-space text-[10px] text-gray-600 mt-1">{new Date(a.created_at).toLocaleDateString()}</p>
            </div>
            <button onClick={() => handleDelete(a.id)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
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
      const h = (json.organizer || []).find((h: any) => h.id === hackathonId);
      if (h?.sponsors) setSponsors(Array.isArray(h.sponsors) ? h.sponsors : JSON.parse(h.sponsors || '[]'));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const save = async (updated: string[]) => {
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/events/${hackathonId}`, { method: 'PATCH', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ sponsors: updated }) });
      setSponsors(updated);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const add = () => { if (!newSponsor.trim()) return; save([...sponsors, newSponsor.trim()]); setNewSponsor(''); };
  const remove = (i: number) => save(sponsors.filter((_, idx) => idx !== i));

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input placeholder="Sponsor name" value={newSponsor} onChange={e => setNewSponsor(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
          className="flex-1 px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
        <button onClick={add} disabled={saving || !newSponsor.trim()} className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-space text-xs font-bold disabled:opacity-50 transition-colors">Add</button>
      </div>
      <div className="space-y-2">
        {sponsors.map((s, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5 border border-gray-800 bg-gray-900/40">
            <span className="font-space text-sm text-white">{s}</span>
            <button onClick={() => remove(i)} className="p-1 text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
        {sponsors.length === 0 && <p className="font-space text-xs text-gray-500 text-center py-4">No sponsors yet.</p>}
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
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch_(); }, []);

  const fetch_ = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/events?all=true`, { headers });
      const json = await res.json();
      const h = (json.organizer || []).find((h: any) => h.id === hackathonId);
      if (h) { setPrizePool(h.total_prize_pool || h.prize_pool || ''); setPrizeBreakdown(h.prize_breakdown || ''); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/events/${hackathonId}`, { method: 'PATCH', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ total_prize_pool: prizePool, prize_breakdown: prizeBreakdown }) });
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>;

  return (
    <div className="space-y-4">
      <div>
        <label className="font-space text-xs text-gray-400 mb-1.5 block">Total Prize Pool</label>
        <input value={prizePool} onChange={e => setPrizePool(e.target.value)} placeholder="e.g. ₹3,00,000+"
          className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
      </div>
      <div>
        <label className="font-space text-xs text-gray-400 mb-1.5 block">Prize Breakdown (JSON)</label>
        <textarea value={prizeBreakdown} onChange={e => setPrizeBreakdown(e.target.value)} rows={6}
          placeholder='[{"position": "1st Place", "prize": "₹1,00,000"}, {"position": "2nd Place", "prize": "₹50,000"}]'
          className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-mono text-xs focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
      </div>
      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-space text-xs font-bold disabled:opacity-50 transition-colors">
        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
        {saved ? 'Saved ✓' : 'Save Prizes'}
      </button>
    </div>
  );
}

// ─── Winners Tab ──────────────────────────────────────────────────────────────
function WinnersTab({ hackathonId }: { hackathonId: number }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { Promise.all([fetchProjects(), fetchWinners()]).finally(() => setLoading(false)); }, []);

  const fetchProjects = async () => { try { const r = await fetch(`/api/hackathons/${hackathonId}/projects`); const j = await r.json(); if (j.success) setProjects(j.data || []); } catch {} };
  const fetchWinners = async () => { try { const r = await fetch(`/api/hackathons/${hackathonId}/winners`); const j = await r.json(); if (j.success) setWinners(j.data || []); } catch {} };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>;

  return (
    <div className="space-y-4">
      {winners.length > 0 && (
        <div className="border border-green-500/30 bg-green-500/5 p-4">
          <h4 className="font-space font-bold text-sm text-green-400 mb-3">🏆 Winners</h4>
          {winners.map((w: any, i: number) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 border border-gray-800 bg-gray-900/40 mb-1">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-space text-sm text-white flex-1 truncate">{w.project_name || w.team_name || 'Unknown'}</span>
              <span className="font-space text-[10px] text-gray-500">{w.prize_won || `#${i + 1}`}</span>
            </div>
          ))}
        </div>
      )}
      <h4 className="font-space font-bold text-sm text-white">Submissions ({projects.length})</h4>
      {projects.length === 0 ? <p className="font-space text-xs text-gray-500 text-center py-4">No submissions yet.</p> : (
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {projects.map((p: any) => (
            <div key={p.id} className="flex items-center gap-3 px-3 py-2 border border-gray-800 bg-gray-900/40">
              <span className="font-space text-xs text-white flex-1 truncate">{p.project_name}</span>
              {p.prize_won && <span className="font-space text-[10px] text-amber-400 font-bold">{p.prize_won}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Feedback Tab ─────────────────────────────────────────────────────────────
function FeedbackTab({ hackathonId }: { hackathonId: number }) {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch_(); }, []);

  const fetch_ = async () => {
    try {
      const [fbRes, stRes] = await Promise.all([fetch(`/api/hackathons/${hackathonId}/participant-feedback`), fetch(`/api/hackathons/${hackathonId}/participant-feedback/stats`)]);
      const fb = await fbRes.json(); const st = await stRes.json();
      if (fb.success) setFeedbacks(fb.data || []);
      if (st.success) setStats(st.data);
    } catch {} finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>;

  return (
    <div className="space-y-4">
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[{ v: stats.total_responses || 0, l: 'Responses' }, { v: stats.avg_overall?.toFixed(1) || '-', l: 'Avg Rating' }, { v: stats.avg_organization?.toFixed(1) || '-', l: 'Organization' }, { v: `${stats.recommend_percentage || 0}%`, l: 'Recommend' }].map((s, i) => (
            <div key={i} className="border border-gray-800 bg-gray-900/40 p-3 text-center">
              <p className="font-space text-lg font-bold text-orange-400">{s.v}</p>
              <p className="font-space text-[10px] text-gray-500">{s.l}</p>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {feedbacks.length === 0 ? <p className="font-space text-xs text-gray-500 text-center py-4">No feedback yet.</p> : feedbacks.map((fb: any) => (
          <div key={fb.id} className="border border-gray-800 bg-gray-900/40 p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-space text-xs text-white font-medium">{fb.profiles?.full_name || 'Anonymous'}</span>
              <span className="font-space text-[10px] text-gray-500">⭐ {fb.overall_rating}/5</span>
            </div>
            {fb.testimonial && <p className="font-space text-xs text-gray-300 italic">"{fb.testimonial}"</p>}
            {fb.improvement_suggestions && <p className="font-space text-[10px] text-gray-500 mt-1">💡 {fb.improvement_suggestions}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
