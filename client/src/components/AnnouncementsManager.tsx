import { useState, useEffect } from 'react';
import { Megaphone, Plus, Send, Eye, X, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';

interface AnnouncementsProps {
  hackathonId: number;
}

export default function AnnouncementsManager({ hackathonId }: AnnouncementsProps) {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    announcement_type: 'general',
    target_audience: 'all',
    send_email: false,
    is_published: false
  });

  useEffect(() => {
    fetchAnnouncements();
  }, [hackathonId]);

  const fetchAnnouncements = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/announcements`, { headers });
      const data = await response.json();

      if (data.success) {
        setAnnouncements(data.data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleCreate = async (publishNow: boolean = false) => {
    try {
      const headers = await getAuthHeaders();
      const dataToSend = {
        ...formData,
        is_published: publishNow
      };
      
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/announcements`, {
        method: 'POST',
        headers,
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Announcement Created!",
          description: publishNow ? "Announcement published successfully" : "Saved as draft",
        });
        setShowCreateModal(false);
        resetForm();
        fetchAnnouncements();
      } else {
        throw new Error(data.message || 'Failed to create announcement');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      announcement_type: announcement.announcement_type,
      target_audience: announcement.target_audience,
      send_email: announcement.send_email || false,
      is_published: announcement.is_published
    });
    setShowCreateModal(true);
  };

  const handleUpdate = async (publishNow?: boolean) => {
    if (!editingAnnouncement) return;

    try {
      const headers = await getAuthHeaders();
      const dataToSend = {
        ...formData,
        is_published: publishNow !== undefined ? publishNow : formData.is_published
      };
      
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/announcements/${editingAnnouncement.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Announcement Updated!",
          description: publishNow ? "Announcement published successfully" : "Changes saved",
        });
        setShowCreateModal(false);
        setEditingAnnouncement(null);
        resetForm();
        fetchAnnouncements();
      } else {
        throw new Error(data.message || 'Failed to update announcement');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePublish = async (announcementId: number) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/announcements/${announcementId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ is_published: true })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Announcement Published!",
          description: "Your announcement is now live",
        });
        fetchAnnouncements();
      } else {
        throw new Error(data.message || 'Failed to publish announcement');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (announcementId: number) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/announcements/${announcementId}`, {
        method: 'DELETE',
        headers
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Announcement Deleted",
          description: "The announcement has been removed",
        });
        setShowDeleteConfirm(null);
        fetchAnnouncements();
      } else {
        throw new Error(data.message || 'Failed to delete announcement');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      announcement_type: 'general',
      target_audience: 'all',
      send_email: false,
      is_published: false
    });
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingAnnouncement(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Megaphone className="h-6 w-6 text-purple-400" />
          <h2 className="font-press-start text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ANNOUNCEMENTS</h2>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 font-press-start text-sm transition-all flex items-center gap-2 border border-pink-500/50"
        >
          <Plus className="h-4 w-4" />
          CREATE
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-12 text-center">
            <Megaphone className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="font-press-start text-gray-400">NO_ANNOUNCEMENTS_YET</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-gradient-to-br from-gray-900/60 to-gray-900/30 border p-6 transition-all ${
                announcement.is_published ? 'border-green-500/50 hover:border-green-400/70' : 'border-gray-700 hover:border-purple-500/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-press-start text-lg text-white">{announcement.title}</h3>
                    <span className={`px-3 py-1 text-xs font-press-start ${
                      announcement.is_published 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                    }`}>
                      {announcement.is_published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                    <span className="px-3 py-1 text-xs font-press-start bg-purple-500/20 text-purple-300 border border-purple-500/50 uppercase">
                      {announcement.announcement_type}
                    </span>
                  </div>
                  <p className="text-gray-300 font-jetbrains text-sm mb-3">{announcement.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-jetbrains flex-wrap">
                    <span>Target: {announcement.target_audience}</span>
                    <span>•</span>
                    <span>
                      {new Date(announcement.created_at).toLocaleDateString()}
                      {announcement.updated_at && announcement.updated_at !== announcement.created_at && (
                        <span className="text-amber-400"> (edited)</span>
                      )}
                    </span>
                    {announcement.send_email && (
                      <>
                        <span>•</span>
                        <span className="text-cyan-400">Email Sent</span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {!announcement.is_published && (
                    <button
                      onClick={() => handlePublish(announcement.id)}
                      className="bg-gradient-to-r from-green-600/60 to-emerald-500/40 border border-green-500/50 hover:border-green-400 text-green-200 px-3 py-2 font-press-start text-xs transition-all flex items-center gap-1"
                      title="Publish Draft"
                    >
                      <Send className="h-3 w-3" />
                      PUBLISH
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="bg-gradient-to-r from-cyan-600/60 to-blue-500/40 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 px-3 py-2 font-press-start text-xs transition-all flex items-center gap-1"
                    title="Edit Announcement"
                  >
                    <Edit2 className="h-3 w-3" />
                    EDIT
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(announcement.id)}
                    className="bg-gradient-to-r from-red-600/60 to-rose-500/40 border border-red-500/50 hover:border-red-400 text-red-200 px-3 py-2 font-press-start text-xs transition-all flex items-center gap-1"
                    title="Delete Announcement"
                  >
                    <Trash2 className="h-3 w-3" />
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-purple-500/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-pink-900/20">
              <div className="flex items-center justify-between">
                <h2 className="font-press-start text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {editingAnnouncement ? 'EDIT_ANNOUNCEMENT' : 'CREATE_ANNOUNCEMENT'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-pink-400 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none"
                  placeholder="Announcement title"
                />
              </div>

              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none resize-none"
                  placeholder="Announcement content..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Type</label>
                  <select
                    value={formData.announcement_type}
                    onChange={(e) => setFormData({ ...formData, announcement_type: e.target.value })}
                    className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none"
                  >
                    <option value="general">General</option>
                    <option value="important">Important</option>
                    <option value="reminder">Reminder</option>
                    <option value="update">Update</option>
                  </select>
                </div>

                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Target Audience</label>
                  <select
                    value={formData.target_audience}
                    onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                    className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none"
                  >
                    <option value="all">All Participants</option>
                    <option value="confirmed">Confirmed Only</option>
                    <option value="waitlist">Waitlist Only</option>
                    <option value="teams">Teams Only</option>
                    <option value="individuals">Individuals Only</option>
                    <option value="public">Public (Everyone)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="send_email"
                  checked={formData.send_email}
                  onChange={(e) => setFormData({ ...formData, send_email: e.target.checked })}
                  className="w-5 h-5 accent-purple-500"
                />
                <label htmlFor="send_email" className="font-jetbrains text-sm text-gray-300">
                  Send email notification to participants
                </label>
              </div>

              <div className="flex gap-3">
                {editingAnnouncement ? (
                  <>
                    <button
                      onClick={() => handleUpdate()}
                      className="flex-1 bg-gray-800/50 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white px-6 py-3 font-press-start text-sm transition-all"
                    >
                      SAVE_CHANGES
                    </button>
                    {!editingAnnouncement.is_published && (
                      <button
                        onClick={() => handleUpdate(true)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 font-press-start text-sm transition-all flex items-center justify-center gap-2 border border-pink-500/50"
                      >
                        <Send className="h-4 w-4" />
                        PUBLISH
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleCreate(false)}
                      className="flex-1 bg-gray-800/50 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white px-6 py-3 font-press-start text-sm transition-all"
                    >
                      SAVE_DRAFT
                    </button>
                    <button
                      onClick={() => handleCreate(true)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 font-press-start text-sm transition-all flex items-center justify-center gap-2 border border-pink-500/50"
                    >
                      <Send className="h-4 w-4" />
                      PUBLISH
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-red-500/50 max-w-md w-full">
            <div className="p-6 border-b border-red-500/30 bg-gradient-to-r from-red-900/30 to-rose-900/20">
              <h2 className="font-press-start text-xl text-red-400">DELETE_ANNOUNCEMENT</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="font-jetbrains text-gray-300">
                Are you sure you want to delete this announcement? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-gray-800/50 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white px-6 py-3 font-press-start text-sm transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 bg-gradient-to-r from-red-600/60 to-rose-500/40 border border-red-500/50 hover:border-red-400 text-red-200 px-6 py-3 font-press-start text-sm transition-all"
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
