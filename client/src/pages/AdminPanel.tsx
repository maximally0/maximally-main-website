/**
 * Admin Panel — /pokemon
 * Full CMS with beautiful UI. Controls all dynamic content on the site.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Mic, Video, Users, Trophy, Shield,
  Plus, Trash2, Edit2, Save, X, Loader2, RefreshCw, Search,
  Eye, EyeOff, Star, Clock, TrendingUp, UserCheck, Zap,
  ChevronDown, ChevronRight, Mail, Globe, Award
} from 'lucide-react';
import SEO from '@/components/SEO';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'dashboard' | 'blogs' | 'podcasts' | 'interviews' | 'stories' | 'hackathons' | 'users' | 'mentors' | 'judges' | 'newsletter';

interface Column {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'boolean' | 'select' | 'url' | 'date' | 'number' | 'json';
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
  const raw = localStorage.getItem('sb-session') || sessionStorage.getItem('sb-session');
  if (!raw) return null;
  try { return JSON.parse(raw).access_token; } catch { return null; }
}

async function apiFetch(url: string, opts: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as any || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { ...opts, headers });
  return res.json();
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: React.ElementType; color: string; sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-5 bg-gray-900/60 border border-gray-800 overflow-hidden group hover:border-gray-700 transition-colors"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-500/5 to-transparent" />
      <div className={`w-9 h-9 flex items-center justify-center border mb-3 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="font-space text-2xl font-bold text-white">{value}</p>
      <p className="font-space text-xs text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="font-space text-[10px] text-gray-600 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

// ─── Field Renderer ───────────────────────────────────────────────────────────

function FormField({ col, value, onChange }: { col: Column; value: any; onChange: (v: any) => void }) {
  const baseCls = "w-full px-3 py-2.5 bg-gray-800/80 border border-gray-700 text-sm text-white font-space placeholder:text-gray-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-colors";

  if (col.type === 'textarea') return (
    <textarea value={value || ''} onChange={e => onChange(e.target.value)} className={`${baseCls} resize-none h-24`} placeholder={col.placeholder || col.label} />
  );
  if (col.type === 'boolean') return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className={`w-10 h-5 rounded-full relative transition-colors ${value ? 'bg-orange-500' : 'bg-gray-700'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
      <span className="font-space text-xs text-gray-400">{value ? 'Yes' : 'No'}</span>
    </label>
  );
  if (col.type === 'select') return (
    <select value={value || ''} onChange={e => onChange(e.target.value)} className={baseCls}>
      <option value="">Select {col.label}...</option>
      {col.options?.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
  if (col.type === 'number') return (
    <input type="number" value={value || ''} onChange={e => onChange(e.target.value)} className={baseCls} placeholder={col.placeholder || col.label} />
  );
  if (col.type === 'date') return (
    <input type="datetime-local" value={value || ''} onChange={e => onChange(e.target.value)} className={`${baseCls} [color-scheme:dark]`} />
  );
  return <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} className={baseCls} placeholder={col.placeholder || col.label} />;
}

// ─── CRUD Manager ─────────────────────────────────────────────────────────────

function CrudManager({ endpoint, columns, title, icon: Icon, emptyMessage }: {
  endpoint: string; columns: Column[]; title: string; icon: React.ElementType; emptyMessage?: string;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [creating, setCreating] = useState(false);
  const [newData, setNewData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<number | string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const json = await apiFetch(endpoint);
      // Handle various response formats from different endpoints
      let data: any[] = [];
      if (Array.isArray(json.data)) {
        data = json.data;
      } else if (json.data?.blogs && Array.isArray(json.data.blogs)) {
        data = json.data.blogs;
      } else if (Array.isArray(json.mentors)) {
        data = json.mentors;
      } else if (Array.isArray(json.organizer)) {
        // /api/events returns { admin: [], organizer: [] }
        data = [...(json.organizer || []), ...(json.admin || [])];
      } else if (Array.isArray(json.users)) {
        data = json.users;
      } else if (json.data && typeof json.data === 'object' && !Array.isArray(json.data)) {
        // Single object response
        data = [json.data];
      }
      setItems(data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [endpoint]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = useMemo(() => {
    if (!searchTerm) return items;
    const q = searchTerm.toLowerCase();
    return items.filter(item =>
      JSON.stringify(item).toLowerCase().includes(q)
    );
  }, [items, searchTerm]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const body = { ...newData };
      // Convert tags string to array if needed
      if (body.tags && typeof body.tags === 'string') {
        body.tags = body.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
      const json = await apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body) });
      if (json.success) { toast.success('Created successfully'); setCreating(false); setNewData({}); fetchItems(); }
      else toast.error(json.message || 'Failed to create');
    } catch { toast.error('Failed to create'); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (id: number | string) => {
    setSaving(true);
    try {
      const body = { ...editData };
      if (body.tags && typeof body.tags === 'string') {
        body.tags = body.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
      const json = await apiFetch(`${endpoint}/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
      if (json.success) { toast.success('Updated'); setEditingId(null); fetchItems(); }
      else toast.error(json.message || 'Failed to update');
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('Are you sure you want to delete this? This cannot be undone.')) return;
    try {
      const json = await apiFetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (json.success) { toast.success('Deleted'); fetchItems(); }
      else toast.error(json.message || 'Failed to delete');
    } catch { toast.error('Failed to delete'); }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    const data: any = {};
    columns.forEach(col => {
      const val = item[col.key];
      data[col.key] = Array.isArray(val) ? val.join(', ') : val ?? '';
    });
    setEditData(data);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Icon className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h2 className="font-space text-lg font-bold text-white">{title}</h2>
            <p className="font-space text-[10px] text-gray-500">{filtered.length} items</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchItems} className="p-2.5 bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => { setCreating(true); setNewData({}); }} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-xs font-space font-semibold transition-all shadow-lg shadow-orange-500/20">
            <Plus className="w-3.5 h-3.5" /> Add New
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" placeholder={`Search ${title.toLowerCase()}...`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-900/80 border border-gray-800 text-white font-space text-sm placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors" />
      </div>

      {/* Create form */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-5 bg-gray-900/80 border border-orange-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-space text-sm text-orange-400 font-semibold flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New {title.replace(/s$/, '')}
                </p>
                <button onClick={() => setCreating(false)} className="p-1 text-gray-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {columns.map(col => (
                  <div key={col.key} className={col.type === 'textarea' ? 'sm:col-span-2' : ''}>
                    <label className="font-space text-[10px] text-gray-500 uppercase tracking-wider block mb-1.5">
                      {col.label} {col.required && <span className="text-orange-400">*</span>}
                    </label>
                    <FormField col={col} value={newData[col.key]} onChange={v => setNewData((d: any) => ({ ...d, [col.key]: v }))} />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleCreate} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white text-xs font-space font-semibold disabled:opacity-50 transition-colors">
                  <Save className="w-3.5 h-3.5" /> {saving ? 'Creating...' : 'Create'}
                </button>
                <button onClick={() => setCreating(false)} className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 text-xs font-space transition-colors hover:bg-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 bg-gray-900/30 border border-gray-800 border-dashed">
          <Icon className="w-8 h-8 text-gray-700 mx-auto mb-3" />
          <p className="font-space text-sm text-gray-500">{emptyMessage || `No ${title.toLowerCase()} yet.`}</p>
          <p className="font-space text-xs text-gray-600 mt-1">Click "Add New" to create one.</p>
        </div>
      )}

      {/* Items */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map(item => (
            <motion.div
              key={item.id}
              layout
              className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all overflow-hidden"
            >
              {editingId === item.id ? (
                /* Edit mode */
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-space text-xs text-orange-400 font-semibold">Editing #{item.id}</p>
                    <button onClick={() => setEditingId(null)} className="p-1 text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {columns.map(col => (
                      <div key={col.key} className={col.type === 'textarea' ? 'sm:col-span-2' : ''}>
                        <label className="font-space text-[10px] text-gray-500 uppercase tracking-wider block mb-1.5">{col.label}</label>
                        <FormField col={col} value={editData[col.key]} onChange={v => setEditData((d: any) => ({ ...d, [col.key]: v }))} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => handleUpdate(item.id)} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white text-xs font-space font-semibold disabled:opacity-50 transition-colors">
                      <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={() => setEditingId(null)} className="px-5 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 text-xs font-space hover:bg-gray-700 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div className="p-4 flex items-center gap-4">
                  {/* Status indicator */}
                  <div className={`w-1.5 h-10 shrink-0 ${item.is_published !== false && item.is_active !== false ? 'bg-green-500' : 'bg-gray-600'}`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} role="button">
                    <p className="font-space text-sm font-semibold text-white truncate">
                      {item.title || item.hackathon_name || item.full_name || item.name || item.email || `#${item.id}`}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {item.category && <span className="font-space text-[10px] text-orange-400 bg-orange-500/10 px-1.5 py-0.5">{item.category}</span>}
                      {item.stage && <span className="font-space text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5">{item.stage}</span>}
                      {item.role && <span className="font-space text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5">{item.role}</span>}
                      {item.status && <span className="font-space text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5">{item.status}</span>}
                      {item.guest_name && <span className="font-space text-[10px] text-gray-500">{item.guest_name}</span>}
                      {item.author_name && <span className="font-space text-[10px] text-gray-500">by {item.author_name}</span>}
                      {item.company_name && <span className="font-space text-[10px] text-gray-500">{item.company_name}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.is_published !== undefined && (
                      <span title={item.is_published ? 'Published' : 'Draft'}>
                        {item.is_published ? <Eye className="w-3.5 h-3.5 text-green-400" /> : <EyeOff className="w-3.5 h-3.5 text-gray-600" />}
                      </span>
                    )}
                    <button onClick={() => startEdit(item)} className="p-2 text-gray-500 hover:text-orange-400 hover:bg-orange-500/10 transition-colors" title="Edit">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Expanded details */}
              {expandedId === item.id && editingId !== item.id && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-800/50">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
                    {columns.slice(0, 9).map(col => {
                      const val = item[col.key];
                      if (val === null || val === undefined || val === '') return null;
                      return (
                        <div key={col.key}>
                          <p className="font-space text-[9px] text-gray-600 uppercase">{col.label}</p>
                          <p className="font-space text-xs text-gray-300 truncate">
                            {typeof val === 'boolean' ? (val ? '✓' : '✗') : Array.isArray(val) ? val.join(', ') : String(val).slice(0, 60)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Users Manager (special) ──────────────────────────────────────────────────

function UsersManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [roleValue, setRoleValue] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const json = await apiFetch('/api/admin/users');
      setUsers(json.data ?? []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = useMemo(() => {
    if (!searchTerm) return users;
    const q = searchTerm.toLowerCase();
    return users.filter(u => (u.full_name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q) || (u.username || '').toLowerCase().includes(q));
  }, [users, searchTerm]);

  const handleRoleChange = async (userId: string) => {
    setSaving(true);
    try {
      const json = await apiFetch(`/api/admin/users/${userId}/assign-role`, { method: 'POST', body: JSON.stringify({ role: roleValue }) });
      if (json.success) { toast.success('Role updated'); setEditingId(null); fetchUsers(); }
      else toast.error(json.message || 'Failed');
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const roleColors: Record<string, string> = {
    admin: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    mentor: 'text-green-400 bg-green-500/10 border-green-500/30',
    judge: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    organizer: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    participant: 'text-gray-400 bg-gray-800 border-gray-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h2 className="font-space text-lg font-bold text-white">Users & Roles</h2>
            <p className="font-space text-[10px] text-gray-500">{users.length} registered users</p>
          </div>
        </div>
        <button onClick={fetchUsers} className="p-2.5 bg-gray-800 border border-gray-700 text-gray-400 hover:text-white transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" placeholder="Search users by name, email, or username..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-900/80 border border-gray-800 text-white font-space text-sm placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50" />
      </div>

      {loading && <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 bg-gray-900/30 border border-gray-800 border-dashed">
          <Users className="w-8 h-8 text-gray-700 mx-auto mb-3" />
          <p className="font-space text-sm text-gray-500">No users found.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map(user => (
            <div key={user.id} className="p-4 bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors flex items-center gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 overflow-hidden rounded-full">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-space text-sm font-bold text-gray-500">{(user.full_name || user.email || '?')[0].toUpperCase()}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-space text-sm font-semibold text-white truncate">{user.full_name || 'No name'}</p>
                <p className="font-space text-xs text-gray-500 truncate">{user.email}</p>
                {user.username && <p className="font-space text-[10px] text-gray-600">@{user.username}</p>}
              </div>

              {/* Role badge */}
              {editingId === user.id ? (
                <div className="flex items-center gap-2 shrink-0">
                  <select value={roleValue} onChange={e => setRoleValue(e.target.value)} className="px-3 py-1.5 bg-gray-800 border border-gray-700 text-xs text-white font-space focus:outline-none focus:border-orange-500/50">
                    <option value="participant">participant</option>
                    <option value="mentor">mentor</option>
                    <option value="judge">judge</option>
                    <option value="organizer">organizer</option>
                    <option value="admin">admin</option>
                  </select>
                  <button onClick={() => handleRoleChange(user.id)} disabled={saving} className="px-3 py-1.5 bg-orange-500 text-white text-xs font-space font-semibold disabled:opacity-50">
                    {saving ? '...' : 'Save'}
                  </button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-gray-700 text-gray-300 text-xs font-space">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-1 text-[10px] font-space font-semibold border ${roleColors[user.role] || roleColors.participant}`}>
                    {user.role || 'participant'}
                  </span>
                  <button onClick={() => { setEditingId(user.id); setRoleValue(user.role || 'participant'); }} className="p-2 text-gray-500 hover:text-orange-400 hover:bg-orange-500/10 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────

function DashboardTab() {
  const [stats, setStats] = useState({ users: 0, blogs: 0, hackathons: 0, mentors: 0, podcasts: 0, interviews: 0, stories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, blogsRes, hackRes, mentorsRes, podRes, intRes, storRes] = await Promise.allSettled([
          apiFetch('/api/admin/users'),
          apiFetch('/api/blogs'),
          apiFetch('/api/events'),
          apiFetch('/api/mentors'),
          apiFetch('/api/podcasts'),
          apiFetch('/api/interviews'),
          apiFetch('/api/builder-stories'),
        ]);
        setStats({
          users: usersRes.status === 'fulfilled' ? (usersRes.value.data?.length ?? 0) : 0,
          blogs: blogsRes.status === 'fulfilled' ? (blogsRes.value.data?.length ?? 0) : 0,
          hackathons: hackRes.status === 'fulfilled' ? ((hackRes.value.data?.length ?? 0) + (hackRes.value.admin?.length ?? 0) + (hackRes.value.organizer?.length ?? 0)) : 0,
          mentors: mentorsRes.status === 'fulfilled' ? (mentorsRes.value.mentors?.length ?? 0) : 0,
          podcasts: podRes.status === 'fulfilled' ? (podRes.value.data?.length ?? 0) : 0,
          interviews: intRes.status === 'fulfilled' ? (intRes.value.data?.length ?? 0) : 0,
          stories: storRes.status === 'fulfilled' ? (storRes.value.data?.length ?? 0) : 0,
        });
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-space text-lg font-bold text-white mb-1">Platform Overview</h2>
        <p className="font-space text-xs text-gray-500">Real-time stats from your Supabase database</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Users" value={stats.users} icon={Users} color="bg-blue-900/20 border-blue-800/40 text-blue-400" />
        <StatCard label="Blog Posts" value={stats.blogs} icon={BookOpen} color="bg-green-900/20 border-green-800/40 text-green-400" />
        <StatCard label="Hackathons" value={stats.hackathons} icon={Trophy} color="bg-purple-900/20 border-purple-800/40 text-purple-400" />
        <StatCard label="Mentors" value={stats.mentors} icon={UserCheck} color="bg-orange-900/20 border-orange-800/40 text-orange-400" />
        <StatCard label="Podcasts" value={stats.podcasts} icon={Mic} color="bg-pink-900/20 border-pink-800/40 text-pink-400" />
        <StatCard label="Interviews" value={stats.interviews} icon={Video} color="bg-cyan-900/20 border-cyan-800/40 text-cyan-400" />
        <StatCard label="Builder Stories" value={stats.stories} icon={Award} color="bg-yellow-900/20 border-yellow-800/40 text-yellow-400" />
      </div>

      <div className="p-5 bg-gray-900/40 border border-gray-800">
        <h3 className="font-space text-sm font-semibold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'New Blog Post', icon: BookOpen },
            { label: 'New Podcast', icon: Mic },
            { label: 'New Interview', icon: Video },
            { label: 'New Story', icon: Award },
          ].map(action => (
            <div key={action.label} className="p-3 bg-gray-800/50 border border-gray-700 text-center hover:border-orange-500/30 transition-colors cursor-pointer">
              <action.icon className="w-4 h-4 text-orange-400 mx-auto mb-1.5" />
              <p className="font-space text-[10px] text-gray-400">{action.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Column Definitions ───────────────────────────────────────────────────────

const blogColumns: Column[] = [
  { key: 'title', label: 'Title', required: true },
  { key: 'slug', label: 'Slug', required: true, placeholder: 'my-blog-post' },
  { key: 'content', label: 'Content (Markdown)', type: 'textarea' },
  { key: 'author_name', label: 'Author Name' },
  { key: 'cover_image', label: 'Cover Image URL', type: 'url' },
  { key: 'tags', label: 'Tags (comma separated)', placeholder: 'Building, Engineering' },
  { key: 'reading_time_minutes', label: 'Read Time (min)', type: 'number' },
  { key: 'is_published', label: 'Published', type: 'boolean' },
];

const podcastColumns: Column[] = [
  { key: 'title', label: 'Episode Title', required: true },
  { key: 'slug', label: 'Slug', placeholder: 'episode-title' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'guest_name', label: 'Guest Name' },
  { key: 'guest_role', label: 'Guest Role', placeholder: 'CEO, Startup' },
  { key: 'guest_company', label: 'Guest Company' },
  { key: 'guest_avatar', label: 'Guest Avatar URL', type: 'url' },
  { key: 'category', label: 'Category', type: 'select', options: ['Building', 'Leadership', 'Engineering', 'Product', 'Culture', 'Operations'] },
  { key: 'duration', label: 'Duration', placeholder: '45:12' },
  { key: 'audio_url', label: 'Audio URL', type: 'url' },
  { key: 'spotify_url', label: 'Spotify URL', type: 'url' },
  { key: 'youtube_url', label: 'YouTube URL', type: 'url' },
  { key: 'is_published', label: 'Published', type: 'boolean' },
];

const interviewColumns: Column[] = [
  { key: 'title', label: 'Interview Title', required: true },
  { key: 'slug', label: 'Slug' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'guest_name', label: 'Guest Name' },
  { key: 'guest_role', label: 'Guest Role' },
  { key: 'guest_company', label: 'Guest Company' },
  { key: 'guest_avatar', label: 'Guest Avatar URL', type: 'url' },
  { key: 'category', label: 'Category', type: 'select', options: ['Engineering', 'Product', 'Leadership', 'Operations', 'Culture'] },
  { key: 'duration', label: 'Duration', placeholder: '52:33' },
  { key: 'video_url', label: 'Video URL', type: 'url' },
  { key: 'thumbnail_url', label: 'Thumbnail URL', type: 'url' },
  { key: 'is_featured', label: 'Featured', type: 'boolean' },
  { key: 'is_published', label: 'Published', type: 'boolean' },
];

const storyColumns: Column[] = [
  { key: 'title', label: 'Story Title', required: true },
  { key: 'slug', label: 'Slug' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'content', label: 'Full Content (Markdown)', type: 'textarea' },
  { key: 'company_name', label: 'Company Name' },
  { key: 'company_logo', label: 'Company Logo URL', type: 'url' },
  { key: 'founder_name', label: 'Founder Name' },
  { key: 'founder_role', label: 'Founder Role' },
  { key: 'stage', label: 'Stage', type: 'select', options: ['Early Stage', 'Growth Stage', 'Enterprise', 'Solo Builder'] },
  { key: 'team_size', label: 'Team Size', placeholder: '11-50' },
  { key: 'founded_year', label: 'Founded Year', placeholder: '2020' },
  { key: 'category', label: 'Topic Category', placeholder: 'Product Strategy' },
  { key: 'is_featured', label: 'Featured', type: 'boolean' },
  { key: 'is_published', label: 'Published', type: 'boolean' },
];

const hackathonColumns: Column[] = [
  { key: 'hackathon_name', label: 'Hackathon Name', required: true },
  { key: 'slug', label: 'Slug' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'start_date', label: 'Start Date', type: 'date' },
  { key: 'end_date', label: 'End Date', type: 'date' },
  { key: 'registration_deadline', label: 'Registration Deadline', type: 'date' },
  { key: 'location', label: 'Location' },
  { key: 'mode', label: 'Mode', type: 'select', options: ['online', 'offline', 'hybrid'] },
  { key: 'max_participants', label: 'Max Participants', type: 'number' },
  { key: 'prize_pool', label: 'Prize Pool' },
  { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'active', 'completed', 'cancelled'] },
  { key: 'is_featured', label: 'Featured', type: 'boolean' },
];

const mentorColumns: Column[] = [
  { key: 'skills', label: 'Skills (comma separated)' },
  { key: 'status', label: 'Status', type: 'select', options: ['available', 'in_session', 'offline'] },
  { key: 'booking_url', label: 'Booking URL', type: 'url' },
  { key: 'max_concurrent_teams', label: 'Max Teams', type: 'number' },
  { key: 'total_mentorship_hours', label: 'Total Hours', type: 'number' },
  { key: 'is_active', label: 'Active', type: 'boolean' },
];

// ─── Main Admin Panel Component ───────────────────────────────────────────────

export default function AdminPanel() {
  const { user, profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'blogs', label: 'Blogs', icon: BookOpen },
    { id: 'podcasts', label: 'Podcasts', icon: Mic },
    { id: 'interviews', label: 'Interviews', icon: Video },
    { id: 'stories', label: 'Stories', icon: Award },
    { id: 'hackathons', label: 'Hackathons', icon: Trophy },
    { id: 'mentors', label: 'Mentors', icon: UserCheck },
    { id: 'users', label: 'Users', icon: Shield },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
  ];

  return (
    <>
      <SEO title="Admin Panel — Maximally" description="Manage all site content." />
      <div className="min-h-screen bg-black text-white">
        <div className="flex">
          {/* Sidebar */}
          <aside className="fixed left-0 top-0 h-screen w-56 bg-gray-950 border-r border-gray-800 pt-20 pb-6 overflow-y-auto z-40 hidden lg:block">
            <div className="px-4 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-orange-400" />
                <span className="font-space text-sm font-bold text-white">Admin</span>
              </div>
              <p className="font-space text-[10px] text-gray-600">/pokemon</p>
            </div>
            <nav className="px-2 space-y-0.5">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors font-space text-xs ${
                    activeTab === tab.id
                      ? 'bg-orange-500/10 text-orange-400 border-l-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50 border-l-2 border-transparent'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Mobile tab bar */}
          <div className="lg:hidden fixed top-16 left-0 right-0 z-30 bg-gray-950 border-b border-gray-800 overflow-x-auto">
            <div className="flex px-2 py-2 gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-space whitespace-nowrap transition-colors ${
                    activeTab === tab.id ? 'bg-orange-500/10 text-orange-400' : 'text-gray-500'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 lg:ml-56 pt-20 lg:pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-5xl mx-auto mt-12 lg:mt-0">
              {activeTab === 'dashboard' && <DashboardTab />}
              {activeTab === 'blogs' && <CrudManager endpoint="/api/blogs" columns={blogColumns} title="Blog Posts" icon={BookOpen} />}
              {activeTab === 'podcasts' && <CrudManager endpoint="/api/podcasts" columns={podcastColumns} title="Podcasts" icon={Mic} />}
              {activeTab === 'interviews' && <CrudManager endpoint="/api/interviews" columns={interviewColumns} title="Interviews" icon={Video} />}
              {activeTab === 'stories' && <CrudManager endpoint="/api/builder-stories" columns={storyColumns} title="Builder Stories" icon={Award} />}
              {activeTab === 'hackathons' && <CrudManager endpoint="/api/events" columns={hackathonColumns} title="Hackathons" icon={Trophy} />}
              {activeTab === 'mentors' && <CrudManager endpoint="/api/mentors" columns={mentorColumns} title="Mentors" icon={UserCheck} emptyMessage="No mentors registered yet." />}
              {activeTab === 'users' && <UsersManager />}
              {activeTab === 'newsletter' && <CrudManager endpoint="/api/newsletter/subscribers" columns={[
                { key: 'email', label: 'Email', required: true },
                { key: 'is_active', label: 'Active', type: 'boolean' },
              ]} title="Newsletter Subscribers" icon={Mail} />}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
