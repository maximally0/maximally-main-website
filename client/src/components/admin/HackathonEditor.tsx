/**
 * HackathonEditor — Admin panel component for managing hackathon content
 * Simplified: Add judges directly with all fields, manage announcements, sponsors, prizes
 */
import { useState, useEffect, type ElementType } from 'react';
import { 
  ArrowLeft, Scale, Megaphone, Trophy, Star, MessageCircle, 
  Plus, Trash2, Save, X, Loader2, Edit2, ExternalLink,
  FileText, UserCheck
} from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

interface HackathonEditorProps {
  hackathonId: number;
  hackathonName: string;
  onBack: () => void;
}

type EditorTab = 'details' | 'judges' | 'mentors' | 'announcements' | 'sponsors' | 'prizes' | 'winners' | 'feedback';

export default function HackathonEditor({ hackathonId, hackathonName, onBack }: HackathonEditorProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('details');

  const tabs: { id: EditorTab; label: string; icon: ElementType }[] = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'judges', label: 'Judges', icon: Scale },
    { id: 'mentors', label: 'Mentors', icon: UserCheck },
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

      {activeTab === 'details' && <DetailsTab hackathonId={hackathonId} />}
      {activeTab === 'judges' && <JudgesTab hackathonId={hackathonId} />}
      {activeTab === 'mentors' && <MentorsTab hackathonId={hackathonId} />}
      {activeTab === 'announcements' && <AnnouncementsTab hackathonId={hackathonId} />}
      {activeTab === 'sponsors' && <SponsorsTab hackathonId={hackathonId} />}
      {activeTab === 'prizes' && <PrizesTab hackathonId={hackathonId} />}
      {activeTab === 'winners' && <WinnersTab hackathonId={hackathonId} />}
      {activeTab === 'feedback' && <FeedbackTab hackathonId={hackathonId} />}
    </div>
  );
}


async function fetchAdminHackathon(hackathonId: number) {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/admin/hackathons', { headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to load hackathon');

  const hackathon = (json.data || []).find((h: any) => Number(h.id) === Number(hackathonId));
  if (!hackathon) throw new Error('Hackathon not found');
  return hackathon;
}

async function saveHackathonPatch(hackathonId: number, body: Record<string, unknown>) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/events/${hackathonId}`, {
    method: 'PATCH',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to save hackathon');
  return json.data;
}

function toDateTimeLocal(value?: string | null) {
  return value ? String(value).slice(0, 16) : '';
}

function emptyToNull(value: string) {
  return value || null;
}

// ─── Details Tab ──────────────────────────────────────────────────────────────
function DetailsTab({ hackathonId }: { hackathonId: number }) {
  const [form, setForm] = useState({
    hackathon_name: '',
    tagline: '',
    description: '',
    start_date: '',
    end_date: '',
    registration_deadline: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchDetails(); }, []);

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const hackathon = await fetchAdminHackathon(hackathonId);
      setForm({
        hackathon_name: hackathon.hackathon_name || '',
        tagline: hackathon.tagline || '',
        description: hackathon.description || '',
        start_date: toDateTimeLocal(hackathon.start_date),
        end_date: toDateTimeLocal(hackathon.end_date),
        registration_deadline: toDateTimeLocal(hackathon.registration_deadline),
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.hackathon_name.trim()) return;
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await saveHackathonPatch(hackathonId, {
        hackathon_name: form.hackathon_name.trim(),
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        start_date: emptyToNull(form.start_date),
        end_date: emptyToNull(form.end_date),
        registration_deadline: emptyToNull(form.registration_deadline),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>;

  return (
    <div className="space-y-4">
      {error && <p className="font-space text-xs text-red-400 border border-red-500/30 bg-red-500/10 px-3 py-2">{error}</p>}
      <div>
        <label className="font-space text-xs text-gray-400 mb-1.5 block">Hackathon Name</label>
        <input value={form.hackathon_name} onChange={e => setForm(f => ({ ...f, hackathon_name: e.target.value }))}
          className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
      </div>
      <div>
        <label className="font-space text-xs text-gray-400 mb-1.5 block">Tagline</label>
        <input value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
          placeholder="Short one-line summary"
          className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
      </div>
      <div>
        <label className="font-space text-xs text-gray-400 mb-1.5 block">Description</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={8}
          placeholder="Main public description"
          className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm leading-relaxed focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
      </div>
      <div className="border border-gray-800 bg-gray-900/40 p-4 space-y-3">
        <h3 className="font-space font-bold text-sm text-white">Dates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DateInput label="Event Starts" value={form.start_date} onChange={value => setForm(f => ({ ...f, start_date: value }))} />
          <DateInput label="Event Ends" value={form.end_date} onChange={value => setForm(f => ({ ...f, end_date: value }))} />
          <DateInput label="Registration Deadline" value={form.registration_deadline} onChange={value => setForm(f => ({ ...f, registration_deadline: value }))} />
        </div>
      </div>
      <button onClick={handleSave} disabled={saving || !form.hackathon_name.trim()}
        className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-space text-xs font-bold disabled:opacity-50 transition-colors">
        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
        {saved ? 'Saved' : 'Save Details'}
      </button>
    </div>
  );
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="font-space text-xs text-gray-400 mb-1.5 block">{label}</span>
      <input
        type="datetime-local"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50"
      />
    </label>
  );
}

// ─── Judges Tab — Existing judge profile CMS ──────────────────────────────────
function JudgesTab({ hackathonId }: { hackathonId: number }) {
  const [judges, setJudges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', title: '', profile_photo: '', link: '' });

  useEffect(() => { fetchJudges(); }, []);

  const fetchJudges = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/hackathons/${hackathonId}/judge-profiles`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to load judges');
      setJudges(json.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load judges');
    }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.name || !form.email) return;
    setSaving(true);
    setError('');
    try {
      const headers = await getAuthHeaders();
      let judgeId = editingId;

      if (editingId) {
        const res = await fetch(`/api/judge-profiles/${editingId}`, {
          method: 'PATCH',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) throw new Error(json.message || 'Failed to update judge');
      } else {
        const createRes = await fetch('/api/judge-profiles', {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const createJson = await createRes.json().catch(() => ({}));
        if (!createRes.ok || !createJson.success) throw new Error(createJson.message || 'Failed to create judge');

        judgeId = createJson.data.id;
        const assignRes = await fetch(`/api/judge-profiles/${judgeId}/assign`, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ hackathon_ids: [hackathonId] }),
        });
        const assignJson = await assignRes.json().catch(() => ({}));
        if (!assignRes.ok || !assignJson.success) throw new Error(assignJson.message || 'Failed to assign judge');
      }

      await fetchJudges();
      resetForm();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save judge');
    }
    finally { setSaving(false); }
  };

  const handleRemove = async (judgeId: number) => {
    if (!confirm('Remove this judge from this hackathon?')) return;
    setError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/judge-profiles/${judgeId}/unassign/${hackathonId}`, { method: 'DELETE', headers });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to remove judge');
      await fetchJudges();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to remove judge');
    }
  };

  const startEdit = (judge: any) => {
    setEditingId(judge.id);
    setForm({
      name: judge.name || '',
      email: judge.email || '',
      title: judge.title || '',
      profile_photo: judge.profile_photo || '',
      link: judge.link || '',
    });
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
      {error && <p className="font-space text-xs text-red-400 border border-red-500/30 bg-red-500/10 px-3 py-2">{error}</p>}
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

// ─── Mentors Tab ──────────────────────────────────────────────────────────────
function MentorsTab({ hackathonId }: { hackathonId: number }) {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', title: '', profile_photo: '', link: '' });

  useEffect(() => { fetchMentors(); }, []);

  const fetchMentors = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/hackathons/${hackathonId}/mentor-profiles`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to load mentors');
      setMentors(json.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.email) return;
    setSaving(true);
    setError('');
    try {
      const headers = await getAuthHeaders();
      let mentorId = editingId;

      if (editingId) {
        const res = await fetch(`/api/mentor-profiles/${editingId}`, {
          method: 'PATCH',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) throw new Error(json.message || 'Failed to update mentor');
      } else {
        const createRes = await fetch('/api/mentor-profiles', {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const createJson = await createRes.json().catch(() => ({}));
        if (!createRes.ok || !createJson.success) throw new Error(createJson.message || 'Failed to create mentor');

        mentorId = createJson.data.id;
        const assignRes = await fetch(`/api/mentor-profiles/${mentorId}/assign`, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ hackathon_ids: [hackathonId] }),
        });
        const assignJson = await assignRes.json().catch(() => ({}));
        if (!assignRes.ok || !assignJson.success) throw new Error(assignJson.message || 'Failed to assign mentor');
      }

      await fetchMentors();
      resetForm();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save mentors');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (mentor: any) => {
    setEditingId(mentor.id);
    setForm({
      name: mentor.name || '',
      email: mentor.email || '',
      title: mentor.title || '',
      profile_photo: mentor.profile_photo || '',
      link: mentor.link || '',
    });
    setShowForm(true);
  };

  const remove = async (mentorId: number) => {
    if (!confirm('Remove this mentor from this hackathon?')) return;
    setError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/mentor-profiles/${mentorId}/unassign/${hackathonId}`, { method: 'DELETE', headers });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to remove mentor');
      await fetchMentors();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to remove mentor');
    }
  };

  const resetForm = () => {
    setForm({ name: '', email: '', title: '', profile_photo: '', link: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>;

  return (
    <div className="space-y-4">
      {error && <p className="font-space text-xs text-red-400 border border-red-500/30 bg-red-500/10 px-3 py-2">{error}</p>}
      <div className="flex items-center justify-between">
        <p className="font-space text-sm text-gray-400">{mentors.length} mentor(s)</p>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-space text-xs font-bold hover:bg-orange-500/20 transition-colors">
          <Plus className="w-3 h-3" /> Add Mentor
        </button>
      </div>

      {showForm && (
        <div className="border border-orange-500/30 bg-gray-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-space font-bold text-sm text-white">{editingId ? 'Edit Mentor' : 'Add Mentor to this Hackathon'}</h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
            <input placeholder="Email *" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
          </div>
          <input placeholder="Title / Expertise" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
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
            {editingId ? 'Update Mentor' : 'Add Mentor'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {mentors.map((mentor: any) => (
          <div key={mentor.id} className="flex items-center gap-4 px-4 py-3 border border-gray-800 bg-gray-900/40 hover:border-gray-700 transition-colors">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-800 shrink-0 border border-gray-700">
              {mentor.profile_photo ? (
                <img src={mentor.profile_photo} alt={mentor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-orange-400 font-space font-bold text-lg">{mentor.name[0]}</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-space text-sm text-white font-medium truncate">{mentor.name}</p>
                {mentor.link && <a href={mentor.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-400"><ExternalLink className="w-3 h-3" /></a>}
              </div>
              <p className="font-space text-xs text-gray-500 truncate">{mentor.title || mentor.email || 'Mentor'}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => startEdit(mentor)} className="p-2 text-gray-500 hover:text-white transition-colors" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => remove(mentor.id)} className="p-2 text-gray-500 hover:text-red-400 transition-colors" title="Remove"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
        {mentors.length === 0 && !showForm && (
          <div className="text-center py-8 border border-dashed border-gray-800">
            <UserCheck className="w-6 h-6 text-gray-700 mx-auto mb-2" />
            <p className="font-space text-xs text-gray-500">No mentors added yet.</p>
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
      const h = await fetchAdminHackathon(hackathonId);
      if (Array.isArray(h.sponsors)) {
        setSponsors(h.sponsors);
      } else if (h.sponsors) {
        setSponsors(JSON.parse(h.sponsors || '[]'));
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const save = async (updated: string[]) => {
    setSaving(true);
    try {
      await saveHackathonPatch(hackathonId, { sponsors: updated });
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch_(); }, []);

  const fetch_ = async () => {
    try {
      const h = await fetchAdminHackathon(hackathonId);
      if (h) setPrizePool(h.total_prize_pool || h.prize_pool || '');
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveHackathonPatch(hackathonId, { total_prize_pool: prizePool, prize_pool: prizePool });
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
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [schemaMissing, setSchemaMissing] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    position: '1',
    prize_position: '1st Place',
    prize_amount: '',
    team_name: '',
    project_title: '',
    description: '',
    demo_url: '',
    github_url: '',
    track: '',
    winner_type: 'overall',
    status: 'published',
  });

  useEffect(() => { fetchWinners(); }, []);

  const resetForm = () => {
    const nextPosition = winners.length + 1;
    setEditingId(null);
    setForm({
      position: String(nextPosition),
      prize_position: nextPosition === 1 ? '1st Place' : nextPosition === 2 ? '2nd Place' : nextPosition === 3 ? '3rd Place' : `${nextPosition}th Place`,
      prize_amount: '',
      team_name: '',
      project_title: '',
      description: '',
      demo_url: '',
      github_url: '',
      track: '',
      winner_type: 'overall',
      status: 'published',
    });
  };

  const fetchWinners = async () => {
    setError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/hackathons/${hackathonId}/winners`, { headers });
      const json = await res.json().catch(() => ({}));
      if (json.schemaMissing) setSchemaMissing(true);
      else setSchemaMissing(false);
      if (json.success) setWinners(json.data || []);
      else setError(json.message || 'Failed to fetch winners');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch winners');
    } finally {
      setLoading(false);
    }
  };

  const startCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const startEdit = (winner: any) => {
    setEditingId(winner.id);
    setForm({
      position: String(winner.position || 1),
      prize_position: winner.prize_position || winner.prize_name || '',
      prize_amount: winner.prize_amount || '',
      team_name: winner.team_name || '',
      project_title: winner.project_title || winner.project_name || winner.submission?.project_name || '',
      description: winner.description || winner.submission?.tagline || '',
      demo_url: winner.demo_url || winner.submission?.demo_url || '',
      github_url: winner.github_url || winner.submission?.github_repo || '',
      track: winner.track || winner.submission?.track || '',
      winner_type: winner.winner_type || 'overall',
      status: winner.status || 'published',
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        editingId
          ? `/api/admin/hackathons/${hackathonId}/winners/${editingId}`
          : `/api/admin/hackathons/${hackathonId}/winners`,
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, position: Number(form.position) || winners.length + 1 }),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        if (json.schemaMissing) setSchemaMissing(true);
        throw new Error(json.message || 'Failed to save winner');
      }
      await fetchWinners();
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to save winner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (winnerId: number) => {
    if (!confirm('Delete this winner?')) return;
    setError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/hackathons/${hackathonId}/winners/${winnerId}`, { method: 'DELETE', headers });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to delete winner');
      await fetchWinners();
    } catch (err: any) {
      setError(err.message || 'Failed to delete winner');
    }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-space text-sm text-gray-400">{winners.length} winner card(s)</p>
        <button
          onClick={startCreate}
          disabled={schemaMissing}
          className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-space text-xs font-bold hover:bg-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-3 h-3" /> New
        </button>
      </div>

      {schemaMissing && (
        <div className="border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="font-space text-sm text-amber-300 font-bold mb-1">Winners DB migration pending</p>
          <p className="font-space text-xs text-amber-100/70">
            Run server/migrations/20260603_hackathon_winners.sql in Supabase before adding winners.
          </p>
        </div>
      )}

      {error && (
        <div className="border border-red-500/30 bg-red-500/10 p-3">
          <p className="font-space text-xs text-red-300">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="border border-orange-500/30 bg-gray-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-space text-sm text-orange-400 font-semibold">{editingId ? 'Edit Winner' : 'New Winner'}</p>
            <button onClick={() => { setShowForm(false); resetForm(); }} className="p-1 text-gray-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input type="number" min="1" placeholder="Position" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
              className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
            <input placeholder="Prize label" value={form.prize_position} onChange={e => setForm(f => ({ ...f, prize_position: e.target.value }))}
              className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
            <input placeholder="Prize amount" value={form.prize_amount} onChange={e => setForm(f => ({ ...f, prize_amount: e.target.value }))}
              className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Team name" value={form.team_name} onChange={e => setForm(f => ({ ...f, team_name: e.target.value }))}
              className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
            <input placeholder="Project title" value={form.project_title} onChange={e => setForm(f => ({ ...f, project_title: e.target.value }))}
              className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
          </div>
          <textarea placeholder="What they built" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Demo / submission URL" value={form.demo_url} onChange={e => setForm(f => ({ ...f, demo_url: e.target.value }))}
              className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
            <input placeholder="GitHub URL" value={form.github_url} onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))}
              className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input placeholder="Track" value={form.track} onChange={e => setForm(f => ({ ...f, track: e.target.value }))}
              className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-gray-600" />
            <select value={form.winner_type} onChange={e => setForm(f => ({ ...f, winner_type: e.target.value }))}
              className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50">
              <option value="overall">Overall</option>
              <option value="track">Track</option>
              <option value="special">Special</option>
            </select>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="px-3 py-2.5 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving || schemaMissing || (!form.project_title.trim() && !form.team_name.trim())}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-space text-xs font-bold disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {editingId ? 'Update Winner' : 'Add Winner'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {winners.map((winner: any, index: number) => {
          const projectTitle = winner.project_title || winner.project_name || winner.submission?.project_name || 'Untitled Project';
          const teamName = winner.team_name || winner.submission?.team?.team_name || winner.submission?.user_name || 'Unknown team';
          const link = winner.demo_url || winner.github_url || winner.submission?.demo_url || winner.submission?.github_repo;
          return (
            <div key={winner.id || index} className="border border-gray-800 bg-gray-900/40 p-4 hover:border-gray-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 border border-amber-500/30 bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-space text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5">{winner.prize_position || winner.prize_name || `#${winner.position || index + 1}`}</span>
                    {winner.prize_amount && <span className="font-space text-[10px] text-orange-400">{winner.prize_amount}</span>}
                    {winner.track && <span className="font-space text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5">{winner.track}</span>}
                    {winner.status === 'draft' && <span className="font-space text-[10px] text-gray-500 bg-gray-800 px-1.5 py-0.5">Draft</span>}
                  </div>
                  <p className="font-space text-sm text-white font-semibold truncate">{projectTitle}</p>
                  <p className="font-space text-xs text-gray-500 truncate">{teamName}</p>
                  {winner.description && <p className="font-space text-xs text-gray-400 line-clamp-2 mt-2">{winner.description}</p>}
                  {link && (
                    <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-orange-400 hover:text-orange-300">
                      <ExternalLink className="w-3 h-3" /> Open link
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEdit(winner)} className="p-2 text-gray-500 hover:text-white transition-colors" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(winner.id)} className="p-2 text-gray-500 hover:text-red-400 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          );
        })}
        {winners.length === 0 && !showForm && !schemaMissing && (
          <div className="text-center py-8 border border-dashed border-gray-800">
            <Trophy className="w-6 h-6 text-gray-700 mx-auto mb-2" />
            <p className="font-space text-xs text-gray-500">No winners added yet.</p>
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
