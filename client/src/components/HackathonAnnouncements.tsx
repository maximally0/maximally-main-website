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
        return 'border-red-500 bg-red-900/20';
      case 'reminder':
        return 'border-orange-500 bg-orange-900/20';
      case 'update':
        return 'border-blue-500 bg-blue-900/20';
      default:
        return 'border-maximally-yellow bg-maximally-yellow/10';
    }
  };

  const getTypeTextColor = (type: string) => {
    switch (type) {
      case 'important':
        return 'text-red-500';
      case 'reminder':
        return 'text-orange-500';
      case 'update':
        return 'text-blue-500';
      default:
        return 'text-maximally-yellow';
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
        <Megaphone className="h-6 w-6 text-maximally-yellow" />
        <h2 className="font-press-start text-2xl text-maximally-yellow">ANNOUNCEMENTS</h2>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className={`pixel-card border-2 p-6 ${getTypeColor(announcement.announcement_type)}`}
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
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-2 font-jetbrains focus:border-maximally-yellow outline-none"
                  />
                </div>
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Content</label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    rows={4}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-2 font-jetbrains focus:border-maximally-yellow outline-none"
                  />
                </div>
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Type</label>
                  <select
                    value={editForm.announcement_type}
                    onChange={(e) => setEditForm({ ...editForm, announcement_type: e.target.value as any })}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-2 font-jetbrains focus:border-maximally-yellow outline-none"
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
                    className="pixel-button bg-maximally-yellow text-black px-4 py-2 font-press-start text-xs hover:bg-maximally-red hover:text-white"
                  >
                    SAVE
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="pixel-button bg-gray-700 text-white px-4 py-2 font-press-start text-xs hover:bg-gray-600"
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
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-press-start text-lg text-white">
                      {announcement.title}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-press-start uppercase border ${
                      announcement.announcement_type === 'important' 
                        ? 'bg-red-500/20 text-red-500 border-red-500'
                        : announcement.announcement_type === 'reminder'
                        ? 'bg-orange-500/20 text-orange-500 border-orange-500'
                        : announcement.announcement_type === 'update'
                        ? 'bg-blue-500/20 text-blue-500 border-blue-500'
                        : 'bg-maximally-yellow/20 text-maximally-yellow border-maximally-yellow'
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
                          className="text-gray-400 hover:text-maximally-yellow transition-colors p-2"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ show: true, id: announcement.id })}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2"
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
