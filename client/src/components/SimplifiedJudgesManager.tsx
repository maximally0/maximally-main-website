import { useState, useEffect, useRef } from 'react';
import { Scale, UserPlus, X, Mail, Trash2, Edit2, Save, Upload, Image, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';
import { useConfirm } from '@/components/ui/confirm-modal';

interface Judge {
  id: string;
  hackathon_id: number;
  name: string;
  email: string;
  role_title?: string;
  company?: string;
  bio?: string;
  profile_photo?: string;
  created_at: string;
}

interface SimplifiedJudgesManagerProps {
  hackathonId: number;
}

export default function SimplifiedJudgesManager({ hackathonId }: SimplifiedJudgesManagerProps) {
  const { toast } = useToast();
  const confirm = useConfirm();
  const [judges, setJudges] = useState<Judge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSendLinksModal, setShowSendLinksModal] = useState(false);
  const [editingJudge, setEditingJudge] = useState<Judge | null>(null);
  const [saving, setSaving] = useState(false);
  const [sendingLinks, setSendingLinks] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role_title: '',
    company: '',
    bio: '',
    profile_photo: ''
  });

  useEffect(() => {
    fetchJudges();
  }, [hackathonId]);

  const fetchJudges = async () => {
    try {
      const headers = await getAuthHeaders();
      console.log('[SimplifiedJudgesManager] Fetching judges for hackathonId:', hackathonId);
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/judges`, { headers });
      const data = await response.json();
      console.log('[SimplifiedJudgesManager] Response:', data);

      if (data.success) {
        setJudges(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching judges:', error);
      toast({ title: "Error", description: "Failed to load judges", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role_title: '',
      company: '',
      bio: '',
      profile_photo: ''
    });
    setEditingJudge(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEditModal = (judge: Judge) => {
    setFormData({
      name: judge.name,
      email: judge.email,
      role_title: judge.role_title || '',
      company: judge.company || '',
      bio: judge.bio || '',
      profile_photo: judge.profile_photo || ''
    });
    setEditingJudge(judge);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({ title: "Error", description: "Name and email are required", variant: "destructive" });
      return;
    }

    // Validate bio length
    if (formData.bio && formData.bio.length > 100) {
      toast({ title: "Error", description: "Bio must be 100 characters or less", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      const url = editingJudge 
        ? `/api/organizer/hackathons/${hackathonId}/judges/${editingJudge.id}`
        : `/api/organizer/hackathons/${hackathonId}/judges`;
      
      const response = await fetch(url, {
        method: editingJudge ? 'PATCH' : 'POST',
        headers,
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: editingJudge ? "Judge Updated!" : "Judge Added!",
          description: editingJudge ? "Judge information has been updated" : "New judge has been added to your hackathon"
        });
        handleCloseModal();
        fetchJudges();
      } else {
        throw new Error(data.message || 'Failed to save judge');
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJudge = async (judgeId: string) => {
    const confirmed = await confirm({
      title: 'REMOVE_JUDGE',
      message: 'Are you sure you want to remove this judge? This action cannot be undone.',
      confirmText: 'REMOVE',
      cancelText: 'CANCEL',
      variant: 'danger'
    });

    if (!confirmed) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/judges/${judgeId}`, {
        method: 'DELETE',
        headers
      });

      const data = await response.json();

      if (data.success) {
        toast({ title: "Judge Removed", description: "Judge has been removed from this hackathon" });
        fetchJudges();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleResendScoringLinks = async () => {
    if (judges.length === 0) {
      toast({ title: "No Judges", description: "Add judges first before sending scoring links", variant: "destructive" });
      return;
    }

    // Show confirmation modal
    setShowSendLinksModal(true);
  };

  const confirmSendLinks = async () => {
    setShowSendLinksModal(false);
    setSendingLinks(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/resend-judge-links`, {
        method: 'POST',
        headers
      });

      const data = await response.json();

      if (data.success) {
        toast({ 
          title: "Scoring Links Sent!", 
          description: `Successfully sent scoring links to ${data.emailsSent || judges.length} judge(s)` 
        });
      } else {
        throw new Error(data.message || 'Failed to send scoring links');
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSendingLinks(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 font-press-start text-gray-400">LOADING...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Scale className="h-6 w-6 text-purple-400" />
          <h2 className="font-press-start text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            JUDGES
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {judges.length > 0 && (
            <button
              onClick={handleResendScoringLinks}
              disabled={sendingLinks}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-3 font-press-start text-xs transition-all flex items-center gap-2 border border-green-500/50 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {sendingLinks ? 'SENDING...' : 'SEND_SCORING_LINKS'}
            </button>
          )}
          <button
            onClick={handleOpenAddModal}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 font-press-start text-sm transition-all flex items-center gap-2 border border-pink-500/50"
          >
            <UserPlus className="h-4 w-4" />
            ADD_JUDGE
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-900/20 border border-blue-500/50 p-4">
        <p className="font-jetbrains text-sm text-blue-300">
          💡 <span className="text-blue-400 font-bold">Simplified Judging:</span> Add judges here with their basic info. 
          When you make the project gallery public, they'll automatically receive secure scoring links via email - no account needed!
        </p>
      </div>

      {/* Judges List */}
      <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-green-500/30 p-6">
        <h3 className="font-press-start text-lg text-white mb-4">HACKATHON_JUDGES ({judges.length})</h3>
        
        {judges.length === 0 ? (
          <div className="text-center py-12">
            <Scale className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-jetbrains">No judges added yet</p>
            <p className="text-gray-500 font-jetbrains text-sm mt-2">
              Add judges to enable project scoring
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {judges.map((judge) => (
              <div 
                key={judge.id} 
                className="flex items-center justify-between p-4 bg-black/30 border border-green-500/20 hover:border-green-500/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  {judge.profile_photo ? (
                    <img 
                      src={judge.profile_photo} 
                      alt={judge.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/50"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <span className="font-press-start text-white text-sm">
                        {judge.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-jetbrains text-white font-bold">{judge.name}</div>
                    <div className="text-sm text-gray-400">{judge.email}</div>
                    {(judge.role_title || judge.company) && (
                      <div className="text-xs text-purple-400 mt-1">
                        {judge.role_title}{judge.role_title && judge.company && ' at '}{judge.company}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(judge)}
                    className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                    title="Edit judge"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteJudge(judge.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    title="Remove judge"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-purple-500/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-pink-900/20">
              <div className="flex items-center justify-between">
                <h2 className="font-press-start text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {editingJudge ? 'EDIT_JUDGE' : 'ADD_JUDGE'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-pink-400 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="font-press-start text-sm text-purple-400 mb-2 block">NAME *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none"
                  placeholder="Judge's full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="font-press-start text-sm text-purple-400 mb-2 block">EMAIL *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none"
                  placeholder="judge@example.com"
                />
                <p className="text-xs text-gray-500 mt-1 font-jetbrains">
                  Scoring link will be sent to this email
                </p>
              </div>

              {/* Role Title */}
              <div>
                <label className="font-press-start text-sm text-purple-400 mb-2 block">ROLE/TITLE</label>
                <input
                  type="text"
                  value={formData.role_title}
                  onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                  className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none"
                  placeholder="e.g., CTO, Senior Engineer, Founder"
                />
              </div>

              {/* Company */}
              <div>
                <label className="font-press-start text-sm text-purple-400 mb-2 block">COMPANY</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none"
                  placeholder="e.g., Google, Microsoft, Startup Inc."
                />
              </div>

              {/* Bio */}
              <div>
                <label className="font-press-start text-sm text-purple-400 mb-2 block">
                  BIO <span className="text-gray-500">(max 100 chars)</span>
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value.slice(0, 100) })}
                  rows={3}
                  className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none resize-none"
                  placeholder="Brief bio about the judge..."
                />
                <p className="text-xs text-gray-500 mt-1 font-jetbrains">
                  {formData.bio.length}/100 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 font-press-start text-sm transition-all flex items-center justify-center gap-2 border border-pink-500/50 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'SAVING...' : (editingJudge ? 'UPDATE_JUDGE' : 'ADD_JUDGE')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Scoring Links Confirmation Modal */}
      {showSendLinksModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-green-500/50 max-w-md w-full">
            <div className="p-4 border-b border-green-500/30 bg-gradient-to-r from-green-900/30 to-emerald-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Send className="h-5 w-5 text-green-400" />
                  <h2 className="font-press-start text-sm bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    SEND_SCORING_LINKS
                  </h2>
                </div>
                <button 
                  onClick={() => setShowSendLinksModal(false)} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-300 font-jetbrains text-sm leading-relaxed mb-6">
                This will send scoring link emails to all <span className="text-green-400 font-bold">{judges.length}</span> judge(s). 
                Each judge will receive a unique link to score projects.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSendLinksModal(false)}
                  className="flex-1 bg-gray-800/50 border border-gray-600/50 hover:border-gray-500 text-gray-300 hover:text-white px-4 py-3 font-press-start text-xs transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={confirmSendLinks}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-3 font-press-start text-xs transition-all border border-green-500/50"
                >
                  SEND_LINKS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
