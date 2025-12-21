import { useState, useEffect } from 'react';
import { Megaphone, AlertCircle, Info, Bell, Edit2, Trash2, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface Announcement {
  id: number;
  title: string;
  content: string;
  announcement_type: 'general' | 'important' | 'reminder' | 'update';
  created_at: string;
  published_at: string;
  created_by: string;
}

interface Props {
  hackathonId: number;
}

export default function HackathonAnnouncements({ hackathonId }: Props) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; content: string; announcement_type: 'general' | 'important' | 'reminder' | 'update' }>({ title: '', content: '', announcement_type: 'general' });
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: number | null }>({ show: false, id: null });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAnnouncements();
    checkIfOrganizer();
  }, [hackathonId, user]);

  const checkIfOrganizer = async () => {
    if (!user) {
      setIsOrganizer(false);
      return;
    }
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/is-organizer`, { headers });
      const data = await response.json();
      setIsOrganizer(data.isOrganizer || false);
    } catch (error) {
      console.error('Error checking organizer status:', error);
      setIsOrganizer(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`/api/hackathons/${hackathonId}/announcements`);
      const data = await response.json();

      if (data.success) {
        setAnnouncements(data.data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setEditForm({
      title: announcement.title,
      content: announcement.content,
      announcement_type: announcement.announcement_type
    });
  };

  const handleUpdate = async (id: number) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/announcements/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(editForm)
      });
      const data = await response.json();

      if (data.success) {
        toast({ title: 'Announcement updated successfully' });
        setEditingId(null);
        fetchAnnouncements();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ title: 'Error updating announcement', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ show: false, id: null });
    
    if (!id) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/announcements/${id}`, {
        method: 'DELETE',
        headers
      });
      const data = await response.json();

      if (data.success) {
        toast({ title: 'Announcement deleted successfully' });
        fetchAnnouncements();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ title: 'Error deleting announcement', description: error.message, variant: 'destructive' });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'important':
        return <AlertCircle className="h-5 w-5" />;
      case 'reminder':
        return <Bell className="h-5 w-5" />;
      case 'update':
        return <Info className="h-5 w-5" />;
      default:
        return <Megaphone className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'important':
        return 'border-red-500/50 bg-gradient-to-br from-red-500/15 to-rose-500/10';
      case 'reminder':
        return 'border-orange-500/50 bg-gradient-to-br from-orange-500/15 to-amber-500/10';
      case 'update':
        return 'border-blue-500/50 bg-gradient-to-br from-blue-500/15 to-cyan-500/10';
      default:
        return 'border-purple-500/50 bg-gradient-to-br from-purple-500/15 to-pink-500/10';
    }
  };

  const getTypeTextColor = (type: string) => {
    switch (type) {
      case 'important':
        return 'text-red-400';
      case 'reminder':
        return 'text-orange-400';
      case 'update':
        return 'text-blue-400';
      default:
        return 'text-purple-400';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="font-press-start text-sm text-gray-400">LOADING...</div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return null; // Don't show section if no announcements
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/20 border border-purple-500/40">
          <Megaphone className="h-5 w-5 text-purple-400" />
        </div>
        <h2 className="font-press-start text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ANNOUNCEMENTS</h2>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className={`border p-6 transition-all duration-300 ${getTypeColor(announcement.announcement_type)}`}
          >
            {editingId === announcement.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-2 font-jetbrains focus:border-purple-400 outline-none"
                  />
                </div>
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Content</label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    rows={4}
                    className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-2 font-jetbrains focus:border-purple-400 outline-none"
                  />
                </div>
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Type</label>
                  <select
                    value={editForm.announcement_type}
                    onChange={(e) => setEditForm({ ...editForm, announcement_type: e.target.value as any })}
                    className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-2 font-jetbrains focus:border-purple-400 outline-none"
                  >
                    <option value="general">General</option>
                    <option value="important">Important</option>
                    <option value="reminder">Reminder</option>
                    <option value="update">Update</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(announcement.id)}
                    className="bg-gradient-to-r from-green-600/40 to-emerald-500/30 border border-green-500/50 hover:border-green-400 text-green-200 hover:text-white px-4 py-2 font-press-start text-xs transition-all duration-300"
                  >
                    SAVE
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white px-4 py-2 font-press-start text-xs transition-all duration-300"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-start gap-4">
                <div className={`${getTypeTextColor(announcement.announcement_type)} mt-1`}>
                  {getIcon(announcement.announcement_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 className="font-press-start text-lg text-white">
                      {announcement.title}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-press-start uppercase border ${
                      announcement.announcement_type === 'important' 
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : announcement.announcement_type === 'reminder'
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                        : announcement.announcement_type === 'update'
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        : 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                    }`}>
                      {announcement.announcement_type}
                    </span>
                  </div>
                  <p className="text-gray-300 font-jetbrains leading-relaxed whitespace-pre-wrap mb-3">
                    {announcement.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 font-jetbrains">
                      {new Date(announcement.published_at || announcement.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {isOrganizer && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="text-gray-400 hover:text-purple-400 transition-colors p-2"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ show: true, id: announcement.id })}
                          className="text-gray-400 hover:text-red-400 transition-colors p-2"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.show}
        onOpenChange={(show) => setDeleteConfirm({ show, id: null })}
        title="DELETE ANNOUNCEMENT"
        description="Are you sure you want to delete this announcement? This action cannot be undone."
        confirmText="DELETE"
        cancelText="CANCEL"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
