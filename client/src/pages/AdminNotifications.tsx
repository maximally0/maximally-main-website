import { useState, useEffect } from 'react';
import { Bell, Plus, Edit, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: 'info' | 'success' | 'warning' | 'announcement';
  icon?: string;
  link_url?: string;
  link_text?: string;
  target_audience: 'all' | 'organizers' | 'participants' | 'judges';
  priority: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export default function AdminNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: number | null }>({ show: false, id: null });
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    notification_type: 'info' as 'info' | 'success' | 'warning' | 'announcement',
    icon: '',
    link_url: '',
    link_text: '',
    target_audience: 'all' as 'all' | 'organizers' | 'participants' | 'judges',
    priority: 0,
    expires_at: '',
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/admin/notifications', { headers });
      const data = await response.json();

      if (data.success) {
        setNotifications(data.data);
      } else if (response.status === 403) {
        toast({
          title: "Access Denied",
          description: "Admin access required",
          variant: "destructive",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.message) {
      toast({
        title: "Missing Fields",
        description: "Title and message are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Notification Created!",
          description: "Users will see this notification now",
        });
        setShowCreateModal(false);
        resetForm();
        fetchNotifications();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingNotification) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/admin/notifications/${editingNotification.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Notification Updated!",
        });
        setEditingNotification(null);
        resetForm();
        fetchNotifications();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ show: false, id: null });
    
    if (!id) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Notification Deleted",
        });
        fetchNotifications();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (notification: Notification) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/admin/notifications/${notification.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ is_active: !notification.is_active }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: notification.is_active ? "Notification Hidden" : "Notification Activated",
        });
        fetchNotifications();
      } else {
        throw new Error(data.message);
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
      message: '',
      notification_type: 'info',
      icon: '',
      link_url: '',
      link_text: '',
      target_audience: 'all',
      priority: 0,
      expires_at: '',
    });
  };

  const startEdit = (notification: Notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      notification_type: notification.notification_type,
      icon: notification.icon || '',
      link_url: notification.link_url || '',
      link_text: notification.link_text || '',
      target_audience: notification.target_audience,
      priority: notification.priority,
      expires_at: notification.expires_at || '',
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500 border-green-500';
      case 'warning': return 'text-orange-500 border-orange-500';
      case 'announcement': return 'text-maximally-yellow border-maximally-yellow';
      default: return 'text-blue-500 border-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-press-start text-maximally-red">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-press-start text-3xl text-maximally-red mb-2">
                PLATFORM_NOTIFICATIONS
              </h1>
              <p className="text-gray-400 font-jetbrains">
                Send notifications to all users on Maximally
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              CREATE_NOTIFICATION
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="pixel-card bg-gray-900 border-2 border-blue-500 p-4">
              <div className="text-2xl font-bold text-blue-500 mb-1 font-press-start">
                {notifications.length}
              </div>
              <div className="text-xs text-gray-400 font-press-start">TOTAL</div>
            </div>
            <div className="pixel-card bg-gray-900 border-2 border-green-500 p-4">
              <div className="text-2xl font-bold text-green-500 mb-1 font-press-start">
                {notifications.filter(n => n.is_active).length}
              </div>
              <div className="text-xs text-gray-400 font-press-start">ACTIVE</div>
            </div>
            <div className="pixel-card bg-gray-900 border-2 border-maximally-yellow p-4">
              <div className="text-2xl font-bold text-maximally-yellow mb-1 font-press-start">
                {notifications.filter(n => n.target_audience === 'all').length}
              </div>
              <div className="text-xs text-gray-400 font-press-start">ALL_USERS</div>
            </div>
            <div className="pixel-card bg-gray-900 border-2 border-purple-500 p-4">
              <div className="text-2xl font-bold text-purple-500 mb-1 font-press-start">
                {notifications.filter(n => n.notification_type === 'announcement').length}
              </div>
              <div className="text-xs text-gray-400 font-press-start">ANNOUNCEMENTS</div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-12 text-center">
                <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="font-press-start text-gray-400">NO_NOTIFICATIONS_YET</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`pixel-card bg-gray-900 border-2 p-6 ${
                    notification.is_active ? 'border-gray-800' : 'border-red-900 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {notification.icon && (
                          <span className="text-2xl">{notification.icon}</span>
                        )}
                        <h3 className="font-press-start text-lg text-white">
                          {notification.title}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-press-start border ${getTypeColor(notification.notification_type)}`}>
                          {notification.notification_type.toUpperCase()}
                        </span>
                        {!notification.is_active && (
                          <span className="px-3 py-1 text-xs font-press-start border border-red-500 text-red-500">
                            INACTIVE
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-300 font-jetbrains mb-3">
                        {notification.message}
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-jetbrains">
                        <span>Target: <strong className="text-maximally-yellow">{notification.target_audience.toUpperCase()}</strong></span>
                        <span>Priority: <strong className="text-maximally-yellow">{notification.priority}</strong></span>
                        <span>Created: {new Date(notification.created_at).toLocaleDateString()}</span>
                        {notification.expires_at && (
                          <span>Expires: {new Date(notification.expires_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(notification)}
                        className={`pixel-button p-2 ${
                          notification.is_active
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white transition-colors`}
                        title={notification.is_active ? 'Hide' : 'Activate'}
                      >
                        {notification.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => startEdit(notification)}
                        className="pixel-button bg-blue-600 text-white p-2 hover:bg-blue-700 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ show: true, id: notification.id })}
                        className="pixel-button bg-red-600 text-white p-2 hover:bg-red-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingNotification) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="pixel-card bg-black border-4 border-maximally-red max-w-2xl w-full my-8">
            <div className="p-6 border-b-2 border-maximally-red">
              <div className="flex items-center justify-between">
                <h2 className="font-press-start text-xl text-maximally-red">
                  {editingNotification ? 'EDIT_NOTIFICATION' : 'CREATE_NOTIFICATION'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingNotification(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  placeholder="Welcome to Maximally!"
                />
              </div>

              {/* Message */}
              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none resize-none"
                  placeholder="Your notification message here..."
                />
              </div>

              {/* Type & Icon */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Type</label>
                  <select
                    value={formData.notification_type}
                    onChange={(e) => setFormData({ ...formData, notification_type: e.target.value as any })}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Icon (Emoji)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                    placeholder="🎮"
                  />
                </div>
              </div>

              {/* Target & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Target Audience</label>
                  <select
                    value={formData.target_audience}
                    onChange={(e) => setFormData({ ...formData, target_audience: e.target.value as any })}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  >
                    <option value="all">All Users</option>
                    <option value="organizers">Organizers Only</option>
                    <option value="participants">Participants Only</option>
                    <option value="judges">Judges Only</option>
                  </select>
                </div>
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Priority</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Link */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Link URL</label>
                  <input
                    type="url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Link Text</label>
                  <input
                    type="text"
                    value={formData.link_text}
                    onChange={(e) => setFormData({ ...formData, link_text: e.target.value })}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                    placeholder="Learn More"
                  />
                </div>
              </div>

              {/* Expires At */}
              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Expires At (Optional)</label>
                <input
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingNotification(null);
                    resetForm();
                  }}
                  className="flex-1 pixel-button bg-gray-700 text-white px-6 py-3 font-press-start text-sm hover:bg-gray-600 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={editingNotification ? handleUpdate : handleCreate}
                  className="flex-1 pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingNotification ? 'UPDATE' : 'CREATE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.show}
        onOpenChange={(show) => setDeleteConfirm({ show, id: null })}
        title="DELETE NOTIFICATION"
        description="Are you sure you want to delete this notification? This action cannot be undone."
        confirmText="DELETE"
        cancelText="CANCEL"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
