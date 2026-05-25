/**
 * Admin Panel — accessible at /pokemon
 * Full CMS for managing all site content.
 * Protected: requires admin role.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  BookOpen, Mic, Video, Users, Trophy, Shield,
  Plus, Trash2, Edit2, Save, X, Loader2, RefreshCw
} from 'lucide-react';
import SEO from '@/components/SEO';

type Tab = 'blogs' | 'podcasts' | 'interviews' | 'stories' | 'users' | 'hackathons';

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

// ─── Generic CRUD Table ───────────────────────────────────────────────────────

interface Column { key: string; label: string; type?: 'text' | 'textarea' | 'boolean' | 'select'; options?: string[]; }

function CrudTable({ endpoint, columns, title, icon: Icon }: {
  endpoint: string; columns: Column[]; title: string; icon: React.ElementType;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [creating, setCreating] = useState(false);
  const [newData, setNewData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const json = await apiFetch(endpoint);
      setItems(json.data ?? json.blogs?.data ?? []);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  }, [endpoint]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const json = await apiFetch(endpoint, { method: 'POST', body: JSON.stringify(newData) });
      if (json.success) { toast.success('Created'); setCreating(false); setNewData({}); fetchItems(); }
      else toast.error(json.message || 'Failed');
    } catch { toast.error('Failed to create'); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (id: number) => {
    setSaving(true);
    try {
      const json = await apiFetch(`${endpoint}/${id}`, { method: 'PATCH', body: JSON.stringify(editData) });
      if (json.success) { toast.success('Updated'); setEditingId(null); fetchItems(); }
      else toast.error(json.message || 'Failed');
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    try {
      const json = await apiFetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (json.success) { toast.success('Deleted'); fetchItems(); }
      else toast.error(json.message || 'Failed');
    } catch { toast.error('Failed to delete'); }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    const data: any = {};
    columns.forEach(col => { data[col.key] = item[col.key] ?? ''; });
    setEditData(data);
  };

  const renderField = (col: Column, value: any, onChange: (v: any) => void, compact = false) => {
    const cls = `w-full px-2 py-1.5 bg-gray-800 border border-gray-700 text-sm text-white font-space focus:outline-none focus:border-orange-500/50 ${compact ? 'text-xs' : ''}`;
    if (col.type === 'textarea') return <textarea value={value || ''} onChange={e => onChange(e.target.value)} className={`${cls} resize-none h-16`} placeholder={col.label} />;
    if (col.type === 'boolean') return <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} className="w-4 h-4 accent-orange-500" />;
    if (col.type === 'select') return (
      <select value={value || ''} onChange={e => onChange(e.target.value)} className={cls}>
        <option value="">Select...</option>
        {col.options?.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
    return <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} className={cls} placeholder={col.label} />;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-orange-400" />
          <h2 className="font-space text-lg font-bold text-white">{title}</h2>
          <span className="font-space text-xs text-gray-500">({items.length})</span>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchItems} className="p-2 bg-gray-800 border border-gray-700 text-gray-400 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => { setCreating(true); setNewData({}); }} className="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-400 text-white text-xs font-space font-semibold transition-colors">
            <Plus className="w-3 h-3" /> Add New
          </button>
        </div>
      </div>

      {/* Create form */}
      {creating && (
        <div className="mb-6 p-4 bg-gray-900 border border-orange-500/30 space-y-3">
          <p className="font-space text-sm text-orange-400 font-semibold">New {title.slice(0, -1)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {columns.map(col => (
              <div key={col.key}>
                <label className="font-space text-[10px] text-gray-500 uppercase block mb-1">{col.label}</label>
                {renderField(col, newData[col.key], v => setNewData((d: any) => ({ ...d, [col.key]: v })))}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={saving} className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-xs font-space font-semibold disabled:opacity-50">
              <Save className="w-3 h-3" /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setCreating(false)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 text-gray-300 text-xs font-space">
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>}

      {/* Table */}
      {!loading && items.length === 0 && (
        <div className="text-center py-12 bg-gray-900/40 border border-gray-800">
          <p className="font-space text-sm text-gray-500">No items yet. Click "Add New" to create one.</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {items.map(item => (
            <div key={item.id} className="p-4 bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition-colors">
              {editingId === item.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {columns.map(col => (
                      <div key={col.key}>
                        <label className="font-space text-[10px] text-gray-500 uppercase block mb-1">{col.label}</label>
                        {renderField(col, editData[col.key], v => setEditData((d: any) => ({ ...d, [col.key]: v })))}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(item.id)} disabled={saving} className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-xs font-space font-semibold disabled:opacity-50">
                      <Save className="w-3 h-3" /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 text-gray-300 text-xs font-space">
                      <X className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-space text-sm font-semibold text-white truncate">{item.title || item.full_name || item.hackathon_name || `#${item.id}`}</p>
                    <p className="font-space text-xs text-gray-400 mt-0.5 truncate">
                      {item.description || item.excerpt || item.bio || item.email || ''}
                    </p>
                    <div className="flex items-center gap-3 mt-1 font-space text-[10px] text-gray-600">
                      {item.category && <span>{item.category}</span>}
                      {item.stage && <span>{item.stage}</span>}
                      {item.role && <span>Role: {item.role}</span>}
                      {item.guest_name && <span>{item.guest_name}</span>}
                      {item.is_published !== undefined && <span>{item.is_published ? '✓ Published' : '✗ Draft'}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => startEdit(item)} className="p-1.5 bg-gray-800 border border-gray-700 text-gray-400 hover:text-orange-400 transition-colors">
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-gray-800 border border-gray-700 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Users Tab (special) ──────────────────────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [roleValue, setRoleValue] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const json = await apiFetch('/api/admin/users');
      setUsers(json.data ?? json.users ?? []);
    } catch { /* empty db is fine */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId: string) => {
    try {
      const json = await apiFetch(`/api/admin/users/${userId}/assign-role`, {
        method: 'POST',
        body: JSON.stringify({ role: roleValue }),
      });
      if (json.success) { toast.success('Role updated'); setEditingId(null); fetchUsers(); }
      else toast.error(json.message || 'Failed');
    } catch { toast.error('Failed to update role'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-orange-400" />
          <h2 className="font-space text-lg font-bold text-white">Users & Roles</h2>
          <span className="font-space text-xs text-gray-500">({users.length})</span>
        </div>
        <button onClick={fetchUsers} className="p-2 bg-gray-800 border border-gray-700 text-gray-400 hover:text-white transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading && <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>}

      {!loading && users.length === 0 && (
        <div className="text-center py-12 bg-gray-900/40 border border-gray-800">
          <p className="font-space text-sm text-gray-500">No users found. Users appear after they sign up.</p>
        </div>
      )}

      {!loading && users.length > 0 && (
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {users.map((user: any) => (
            <div key={user.id} className="p-4 bg-gray-900/60 border border-gray-800 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-space text-sm font-semibold text-white truncate">{user.full_name || user.username || 'No name'}</p>
                <p className="font-space text-xs text-gray-400">{user.email}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-space font-semibold border ${
                  user.role === 'admin' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                  user.role === 'mentor' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
                  user.role === 'judge' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' :
                  user.role === 'organizer' ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' :
                  'text-gray-400 border-gray-700 bg-gray-800'
                }`}>{user.role || 'participant'}</span>
              </div>
              {editingId === user.id ? (
                <div className="flex items-center gap-2">
                  <select value={roleValue} onChange={e => setRoleValue(e.target.value)} className="px-2 py-1 bg-gray-800 border border-gray-700 text-xs text-white font-space">
                    <option value="participant">participant</option>
                    <option value="mentor">mentor</option>
                    <option value="judge">judge</option>
                    <option value="organizer">organizer</option>
                    <option value="admin">admin</option>
                  </select>
                  <button onClick={() => handleRoleChange(user.id)} className="px-2 py-1 bg-orange-500 text-white text-xs font-space">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs font-space">Cancel</button>
                </div>
              ) : (
                <button onClick={() => { setEditingId(user.id); setRoleValue(user.role || 'participant'); }} className="p-1.5 bg-gray-800 border border-gray-700 text-gray-400 hover:text-orange-400 transition-colors">
                  <Edit2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────

export default function AdminPanel() {
  const { user, profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('blogs');

  if (authLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
  }

  if (!user || (profile?.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'blogs', label: 'Blogs', icon: BookOpen },
    { id: 'podcasts', label: 'Podcasts', icon: Mic },
    { id: 'interviews', label: 'Interviews', icon: Video },
    { id: 'stories', label: 'Stories', icon: Users },
    { id: 'hackathons', label: 'Hackathons', icon: Trophy },
    { id: 'users', label: 'Users', icon: Shield },
  ];

  const blogColumns: Column[] = [
    { key: 'title', label: 'Title' },
    { key: 'slug', label: 'Slug' },
    { key: 'content', label: 'Content', type: 'textarea' },
    { key: 'author_name', label: 'Author' },
    { key: 'cover_image', label: 'Cover Image URL' },
    { key: 'tags', label: 'Tags (comma sep)' },
    { key: 'is_published', label: 'Published', type: 'boolean' },
  ];

  const podcastColumns: Column[] = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'guest_name', label: 'Guest Name' },
    { key: 'guest_role', label: 'Guest Role' },
    { key: 'guest_company', label: 'Guest Company' },
    { key: 'category', label: 'Category', type: 'select', options: ['Building', 'Leadership', 'Engineering', 'Product', 'Culture', 'Operations'] },
    { key: 'duration', label: 'Duration' },
    { key: 'audio_url', label: 'Audio URL' },
    { key: 'spotify_url', label: 'Spotify URL' },
    { key: 'is_published', label: 'Published', type: 'boolean' },
  ];

  const interviewColumns: Column[] = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'guest_name', label: 'Guest Name' },
    { key: 'guest_role', label: 'Guest Role' },
    { key: 'guest_company', label: 'Guest Company' },
    { key: 'category', label: 'Category', type: 'select', options: ['Engineering', 'Product', 'Leadership', 'Operations', 'Culture'] },
    { key: 'duration', label: 'Duration' },
    { key: 'video_url', label: 'Video URL' },
    { key: 'thumbnail_url', label: 'Thumbnail URL' },
    { key: 'is_featured', label: 'Featured', type: 'boolean' },
    { key: 'is_published', label: 'Published', type: 'boolean' },
  ];

  const storyColumns: Column[] = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'company_name', label: 'Company' },
    { key: 'company_logo', label: 'Company Logo URL' },
    { key: 'founder_name', label: 'Founder Name' },
    { key: 'founder_role', label: 'Founder Role' },
    { key: 'stage', label: 'Stage', type: 'select', options: ['Early Stage', 'Growth Stage', 'Enterprise', 'Solo Builder'] },
    { key: 'team_size', label: 'Team Size' },
    { key: 'founded_year', label: 'Founded Year' },
    { key: 'category', label: 'Category' },
    { key: 'is_featured', label: 'Featured', type: 'boolean' },
    { key: 'is_published', label: 'Published', type: 'boolean' },
  ];

  const hackathonColumns: Column[] = [
    { key: 'hackathon_name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'start_date', label: 'Start Date' },
    { key: 'end_date', label: 'End Date' },
    { key: 'mode', label: 'Mode', type: 'select', options: ['online', 'offline', 'hybrid'] },
    { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'active', 'completed'] },
    { key: 'is_featured', label: 'Featured', type: 'boolean' },
  ];

  return (
    <>
      <SEO title="Admin Panel — Maximally" description="Manage all site content." />
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="font-space text-xl font-bold text-white">Admin Panel</h1>
              <p className="font-space text-xs text-gray-500">Manage all content on Maximally</p>
            </div>
            <span className="ml-auto px-3 py-1 bg-amber-500/10 border border-amber-500/30 font-space text-xs text-amber-400 font-semibold">/pokemon</span>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-800 mb-8">
            <nav className="flex gap-1 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap font-space ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab content */}
          {activeTab === 'blogs' && <CrudTable endpoint="/api/blogs" columns={blogColumns} title="Blogs" icon={BookOpen} />}
          {activeTab === 'podcasts' && <CrudTable endpoint="/api/podcasts" columns={podcastColumns} title="Podcasts" icon={Mic} />}
          {activeTab === 'interviews' && <CrudTable endpoint="/api/interviews" columns={interviewColumns} title="Interviews" icon={Video} />}
          {activeTab === 'stories' && <CrudTable endpoint="/api/builder-stories" columns={storyColumns} title="Builder Stories" icon={Users} />}
          {activeTab === 'hackathons' && <CrudTable endpoint="/api/events" columns={hackathonColumns} title="Hackathons" icon={Trophy} />}
          {activeTab === 'users' && <UsersTab />}
        </div>
      </div>
    </>
  );
}
