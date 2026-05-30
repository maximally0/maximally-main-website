/**
 * Judge Profiles Manager — Admin panel component
 * Manages global judge pool and hackathon assignments
 */
import { useState, useEffect } from 'react';
import { Scale, Plus, Trash2, Edit2, Save, X, Loader2, Search, Link as LinkIcon, Image } from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

interface JudgeProfile {
  id: number;
  name: string;
  email: string;
  title?: string;
  profile_photo?: string;
  link?: string;
  created_at: string;
}

interface Hackathon {
  id: number;
  hackathon_name: string;
  slug: string;
}

export default function JudgeProfilesManager() {
  const [judges, setJudges] = useState<JudgeProfile[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignModalJudge, setAssignModalJudge] = useState<JudgeProfile | null>(null);
  const [assignedHackathons, setAssignedHackathons] = useState<number[]>([]);
  const [assignLoading, setAssignLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', title: '', profile_photo: '', link: ''
  });

  useEffect(() => { fetchJudges(); fetchHackathons(); }, []);

  const fetchJudges = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/judge-profiles', { headers });
      const json = await res.json();
      if (json.success) setJudges(json.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchHackathons = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/events?all=true', { headers });
      const json = await res.json();
      if (json.success) {
        // /api/events returns { admin: [], organizer: [] }
        const orgItems = json.organizer || [];
        const items = orgItems.map((h: any) => ({ id: h.id, hackathon_name: h.hackathon_name || h.title, slug: h.slug }));
        setHackathons(items);
      }
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    if (!form.name || !form.email) return;
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      const url = editingId ? `/api/judge-profiles/${editingId}` : '/api/judge-profiles';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method, headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        await fetchJudges();
        resetForm();
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this judge profile?')) return;
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/judge-profiles/${id}`, { method: 'DELETE', headers });
      await fetchJudges();
    } catch (err) { console.error(err); }
  };

  const startEdit = (judge: JudgeProfile) => {
    setEditingId(judge.id);
    setForm({ name: judge.name, email: judge.email, title: judge.title || '', profile_photo: judge.profile_photo || '', link: judge.link || '' });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name: '', email: '', title: '', profile_photo: '', link: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const openAssignModal = async (judge: JudgeProfile) => {
    setAssignModalJudge(judge);
    setAssignLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/judge-profiles/${judge.id}/hackathons`, { headers });
      const json = await res.json();
      if (json.success) {
        setAssignedHackathons((json.data || []).map((a: any) => a.hackathon_id));
      }
    } catch (err) { console.error(err); }
    finally { setAssignLoading(false); }
  };

  const toggleHackathonAssignment = async (hackathonId: number) => {
    if (!assignModalJudge) return;
    const headers = await getAuthHeaders();
    if (assignedHackathons.includes(hackathonId)) {
      // Remove
      await fetch(`/api/judge-profiles/${assignModalJudge.id}/unassign/${hackathonId}`, { method: 'DELETE', headers });
      setAssignedHackathons(prev => prev.filter(id => id !== hackathonId));
    } else {
      // Add
      await fetch(`/api/judge-profiles/${assignModalJudge.id}/assign`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ hackathon_ids: [hackathonId] }),
      });
      setAssignedHackathons(prev => [...prev, hackathonId]);
    }
  };

  const filtered = judges.filter(j =>
    j.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scale className="w-5 h-5 text-orange-400" />
          <h2 className="font-space font-bold text-lg text-white">Judge Profiles</h2>
          <span className="font-space text-xs text-gray-500">({judges.length})</span>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-space text-xs font-bold hover:bg-orange-500/20 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Judge
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" placeholder="Search judges..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 text-white font-space text-sm placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50" />
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="border border-orange-500/30 bg-gray-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-space font-bold text-sm text-white">{editingId ? 'Edit Judge' : 'New Judge Profile'}</h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="px-3 py-2 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50" />
            <input placeholder="Email *" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="px-3 py-2 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50" />
            <input placeholder="Title (e.g. Software Engineer at Google)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="px-3 py-2 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50 sm:col-span-2" />
            <input placeholder="Profile Photo URL" value={form.profile_photo} onChange={e => setForm(f => ({ ...f, profile_photo: e.target.value }))}
              className="px-3 py-2 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50" />
            <input placeholder="LinkedIn / Portfolio URL" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
              className="px-3 py-2 bg-gray-800 border border-gray-700 text-white font-space text-sm focus:outline-none focus:border-orange-500/50" />
          </div>
          <button onClick={handleSave} disabled={saving || !form.name || !form.email}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-space text-xs font-bold disabled:opacity-50 transition-colors">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {editingId ? 'Update' : 'Create'}
          </button>
        </div>
      )}

      {/* Judges List */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-orange-400" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 border border-gray-800 bg-gray-900/40">
          <Scale className="w-8 h-8 text-gray-700 mx-auto mb-3" />
          <p className="font-space text-sm text-gray-500">No judges yet. Add your first judge profile.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(judge => (
            <div key={judge.id} className="border border-gray-800 bg-gray-900/40 p-4 flex items-center gap-4 hover:border-gray-700 transition-colors">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 shrink-0 border border-gray-700">
                {judge.profile_photo ? (
                  <img src={judge.profile_photo} alt={judge.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-orange-400 font-space font-bold text-lg">
                    {judge.name[0].toUpperCase()}
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-space font-bold text-sm text-white truncate">{judge.name}</h4>
                  {judge.link && (
                    <a href={judge.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-400">
                      <LinkIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <p className="font-space text-xs text-gray-400 truncate">{judge.title || judge.email}</p>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openAssignModal(judge)} className="px-2.5 py-1.5 border border-gray-700 text-gray-400 hover:text-orange-400 hover:border-orange-500/30 font-space text-[10px] font-bold transition-colors">
                  ASSIGN
                </button>
                <button onClick={() => startEdit(judge)} className="p-1.5 text-gray-500 hover:text-white transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(judge.id)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign to Hackathons Modal */}
      {assignModalJudge && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setAssignModalJudge(null)}>
          <div className="bg-gray-900 border border-gray-800 w-full max-w-md max-h-[70vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="font-space font-bold text-sm text-white">Assign to Hackathons</h3>
                <p className="font-space text-xs text-gray-500 mt-0.5">{assignModalJudge.name}</p>
              </div>
              <button onClick={() => setAssignModalJudge(null)} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {assignLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>
              ) : hackathons.length === 0 ? (
                <p className="font-space text-xs text-gray-500 text-center py-8">No hackathons found.</p>
              ) : (
                hackathons.map(h => (
                  <button
                    key={h.id}
                    onClick={() => toggleHackathonAssignment(h.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 border transition-colors text-left ${
                      assignedHackathons.includes(h.id)
                        ? 'border-orange-500/40 bg-orange-500/10 text-orange-400'
                        : 'border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-300'
                    }`}
                  >
                    <span className="font-space text-xs truncate">{h.hackathon_name}</span>
                    {assignedHackathons.includes(h.id) && (
                      <span className="font-space text-[10px] font-bold text-orange-400 shrink-0 ml-2">ASSIGNED</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
