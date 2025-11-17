import { useState, useEffect } from 'react';
import { Megaphone, Plus, Send, Eye, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';

interface AnnouncementsProps {
  hackathonId: number;
}

export default function AnnouncementsManager({ hackathonId }: AnnouncementsProps) {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
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
        setFormData({
          title: '',
          content: '',
          announcement_type: 'general',
          target_audience: 'all',
          send_email: false,
          is_published: false
        });
        fetchAnnouncements();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Megaphone className="h-6 w-6 text-maximally-yellow" />
          <h2 className="font-press-start text-xl text-maximally-yellow">ANNOUNCEMENTS</h2>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          CREATE
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-12 text-center">
            <Megaphone className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="font-press-start text-gray-400">NO_ANNOUNCEMENTS_YET</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`pixel-card bg-gray-900 border-2 p-6 ${
                announcement.is_published ? 'border-green-500' : 'border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-press-start text-lg text-white">{announcement.title}</h3>
                    <span className={`px-3 py-1 text-xs font-press-start ${
                      announcement.is_published 
                        ? 'bg-green-500/20 text-green-500 border border-green-500'
                        : 'bg-gray-500/20 text-gray-500 border border-gray-500'
                    }`}>
                      {announcement.is_published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                    <span className="px-3 py-1 text-xs font-press-start bg-maximally-yellow/20 text-maximally-yellow border border-maximally-yellow uppercase">
                      {announcement.announcement_type}
                    </span>
                  </div>
                  <p className="text-gray-300 font-jetbrains text-sm mb-3">{announcement.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-jetbrains">
                    <span>Target: {announcement.target_audience}</span>
                    <span>•</span>
                    <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                    {announcement.send_email && (
                      <>
                        <span>•</span>
                        <span className="text-blue-400">Email Sent</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="pixel-card bg-black border-4 border-maximally-red max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-maximally-red">
              <div className="flex items-center justify-between">
                <h2 className="font-press-start text-xl text-maximally-red">CREATE_ANNOUNCEMENT</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
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
                  className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  placeholder="Announcement title"
                />
              </div>

              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none resize-none"
                  placeholder="Announcement content..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Type</label>
                  <select
                    value={formData.announcement_type}
                    onChange={(e) => setFormData({ ...formData, announcement_type: e.target.value })}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
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
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  >
                    <option value="all">All Participants</option>
                    <option value="confirmed">Confirmed Only</option>
                    <option value="waitlist">Waitlist Only</option>
                    <option value="teams">Teams Only</option>
                    <option value="individuals">Individuals Only</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="send_email"
                  checked={formData.send_email}
                  onChange={(e) => setFormData({ ...formData, send_email: e.target.checked })}
                  className="w-5 h-5"
                />
                <label htmlFor="send_email" className="font-jetbrains text-sm text-gray-300">
                  Send email notification to participants
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleCreate(false)}
                  className="flex-1 pixel-button bg-gray-700 text-white px-6 py-3 font-press-start text-sm hover:bg-gray-600 transition-colors"
                >
                  SAVE_DRAFT
                </button>
                <button
                  onClick={() => handleCreate(true)}
                  className="flex-1 pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  PUBLISH
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
