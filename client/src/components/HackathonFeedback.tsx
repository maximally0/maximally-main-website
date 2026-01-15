import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, Send, Star, ThumbsUp, User, Quote, BarChart3, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface ParticipantFeedback {
  id: string;
  overall_rating: number;
  organization_rating: number;
  mentorship_rating: number;
  experience_highlights?: string;
  improvement_suggestions?: string;
  would_recommend: boolean;
  testimonial?: string;
  is_public: boolean;
  created_at: string;
  profiles?: {
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
}

interface FeedbackStats {
  total_responses: number;
  avg_overall: number;
  avg_organization: number;
  avg_mentorship: number;
  recommend_percentage: number;
}

interface HackathonFeedbackProps {
  hackathonId: number;
  winnersAnnounced?: boolean;
  isParticipant?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export default function HackathonFeedback({ 
  hackathonId, 
  winnersAnnounced = false, 
  isParticipant = false,
  primaryColor = '#8B5CF6',
  secondaryColor = '#EC4899',
  accentColor = '#06B6D4'
}: HackathonFeedbackProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<ParticipantFeedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [myFeedback, setMyFeedback] = useState<ParticipantFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    overall_rating: 0,
    organization_rating: 0,
    mentorship_rating: 0,
    experience_highlights: '',
    improvement_suggestions: '',
    would_recommend: true,
    testimonial: '',
    is_public: true,
  });

  useEffect(() => {
    fetchFeedback();
    fetchStats();
    if (user && winnersAnnounced && isParticipant) {
      checkMyFeedback();
    }
  }, [hackathonId, user, winnersAnnounced, isParticipant]);

  const fetchFeedback = async () => {
    try {
      const response = await fetch(`/api/hackathons/${hackathonId}/participant-feedback`);
      const data = await response.json();
      if (data.success) {
        setFeedbacks(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/hackathons/${hackathonId}/participant-feedback/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const checkMyFeedback = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/participant-feedback/my-feedback`, { headers });
      const data = await response.json();
      if (data.success && data.data) {
        setMyFeedback(data.data);
      }
    } catch (error) {
      console.error('Error checking feedback:', error);
    }
  };

  const handleSubmitFeedback = async () => {
    if (formData.overall_rating === 0) {
      toast({ title: 'Rating required', description: 'Please provide an overall rating', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/participant-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Thank you for your feedback!' });
        setMyFeedback(data.data);
        setShowForm(false);
        fetchFeedback();
        fetchStats();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ title: 'Error submitting feedback', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onChange?.(star)}
          disabled={!interactive}
          className={`transition-colors ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <Star className={`h-6 w-6 ${rating >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="font-press-start text-sm text-gray-400">LOADING_FEEDBACK...</div>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 border"
            style={{
              backgroundColor: `${primaryColor}20`,
              borderColor: `${primaryColor}40`
            }}
          >
            <MessageCircle className="h-5 w-5" style={{ color: primaryColor }} />
          </div>
          <h3 className="font-press-start text-xl text-white">PARTICIPANT_FEEDBACK</h3>
        </div>

        {winnersAnnounced && isParticipant && user && !myFeedback && (
          <button
            onClick={() => setShowForm(true)}
            className="border px-6 py-3 font-press-start text-xs transition-all duration-300 flex items-center gap-2"
            style={{
              background: `linear-gradient(to right, ${primaryColor}40, ${secondaryColor}30)`,
              borderColor: `${primaryColor}50`,
              color: primaryColor
            }}
          >
            <Star className="h-4 w-4" />
            GIVE_FEEDBACK
          </button>
        )}

        {myFeedback && (
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-500/10 border border-green-500/40 px-4 py-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="font-press-start text-xs text-green-300">FEEDBACK_SUBMITTED</span>
          </div>
        )}
      </div>

      {/* Stats */}
      {stats && stats.total_responses > 0 && (
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            <span className="font-press-start text-sm text-purple-300">FEEDBACK_STATS</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="font-press-start text-2xl text-amber-400">{stats.avg_overall}</div>
              <div className="text-xs text-gray-400 font-jetbrains mt-1">Overall</div>
            </div>
            <div className="text-center">
              <div className="font-press-start text-2xl text-cyan-400">{stats.avg_organization}</div>
              <div className="text-xs text-gray-400 font-jetbrains mt-1">Organization</div>
            </div>
            <div className="text-center">
              <div className="font-press-start text-2xl text-pink-400">{stats.avg_mentorship}</div>
              <div className="text-xs text-gray-400 font-jetbrains mt-1">Mentorship</div>
            </div>
            <div className="text-center">
              <div className="font-press-start text-2xl text-green-400">{stats.recommend_percentage}%</div>
              <div className="text-xs text-gray-400 font-jetbrains mt-1">Recommend</div>
            </div>
          </div>
          <div className="text-center mt-4 text-xs text-gray-500 font-jetbrains">
            Based on {stats.total_responses} response{stats.total_responses !== 1 ? 's' : ''}
          </div>
        </div>
      )}


      {/* Feedback Form Modal */}
      {showForm && createPortal(
        <div className="fixed inset-0 bg-black flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
          <div className="bg-gray-900 border-2 border-purple-500/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/20">
            <div className="p-6 border-b border-purple-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 border border-purple-500/40">
                    <Star className="h-5 w-5 text-purple-400" />
                  </div>
                  <h2 className="font-press-start text-xl text-white">SHARE_YOUR_EXPERIENCE</h2>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">✕</button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="font-press-start text-xs text-purple-300 mb-3 block">OVERALL_EXPERIENCE *</label>
                {renderStars(formData.overall_rating, true, (r) => setFormData({ ...formData, overall_rating: r }))}
              </div>

              <div>
                <label className="font-press-start text-xs text-purple-300 mb-3 block">ORGANIZATION</label>
                {renderStars(formData.organization_rating, true, (r) => setFormData({ ...formData, organization_rating: r }))}
              </div>

              <div>
                <label className="font-press-start text-xs text-purple-300 mb-3 block">MENTORSHIP</label>
                {renderStars(formData.mentorship_rating, true, (r) => setFormData({ ...formData, mentorship_rating: r }))}
              </div>

              <div>
                <label className="font-press-start text-xs text-purple-300 mb-3 block">WHAT_DID_YOU_ENJOY?</label>
                <textarea
                  value={formData.experience_highlights}
                  onChange={(e) => setFormData({ ...formData, experience_highlights: e.target.value })}
                  className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none resize-none placeholder:text-gray-600"
                  rows={3}
                  placeholder="Share what you loved..."
                />
              </div>

              <div>
                <label className="font-press-start text-xs text-purple-300 mb-3 block">SUGGESTIONS</label>
                <textarea
                  value={formData.improvement_suggestions}
                  onChange={(e) => setFormData({ ...formData, improvement_suggestions: e.target.value })}
                  className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none resize-none placeholder:text-gray-600"
                  rows={3}
                  placeholder="How can we improve?"
                />
              </div>

              <div>
                <label className="font-press-start text-xs text-purple-300 mb-3 block">TESTIMONIAL (Optional)</label>
                <textarea
                  value={formData.testimonial}
                  onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                  className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none resize-none placeholder:text-gray-600"
                  rows={2}
                  placeholder="A short quote we can share..."
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="font-press-start text-xs text-purple-300">WOULD_RECOMMEND?</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, would_recommend: true })}
                    className={`px-4 py-2 font-press-start text-xs transition-all ${formData.would_recommend ? 'bg-gradient-to-r from-green-600/40 to-emerald-500/30 border border-green-500/50 text-green-200' : 'bg-gray-800/50 border border-gray-700 text-gray-400'}`}
                  >YES</button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, would_recommend: false })}
                    className={`px-4 py-2 font-press-start text-xs transition-all ${!formData.would_recommend ? 'bg-gradient-to-r from-red-600/40 to-rose-500/30 border border-red-500/50 text-red-200' : 'bg-gray-800/50 border border-gray-700 text-gray-400'}`}
                  >NO</button>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.is_public} onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })} className="w-5 h-5 accent-purple-500" />
                <span className="font-jetbrains text-gray-300 text-sm">Make my feedback public</span>
              </label>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                <button onClick={() => setShowForm(false)} className="bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white px-6 py-3 font-press-start text-xs transition-all duration-300">CANCEL</button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={submitting}
                  className="bg-gradient-to-r from-green-600/40 to-emerald-500/30 border border-green-500/50 hover:border-green-400 text-green-200 hover:text-white px-8 py-3 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span className="font-press-start text-xs">{submitting ? 'SUBMITTING...' : 'SUBMIT'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}


      {/* Feedback List */}
      {feedbacks.length > 0 ? (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-6 hover:border-purple-500/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {feedback.profiles?.avatar_url ? (
                    <img src={feedback.profiles.avatar_url} alt={feedback.profiles.full_name || feedback.profiles.username} className="w-12 h-12 rounded-full border-2 border-purple-500/30 object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center border-2 border-purple-500/30">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-press-start text-sm text-white">{feedback.profiles?.full_name || feedback.profiles?.username || 'Participant'}</span>
                    {renderStars(feedback.overall_rating)}
                    {feedback.would_recommend && (
                      <div className="flex items-center gap-1 text-green-400">
                        <ThumbsUp className="h-4 w-4" />
                        <span className="text-xs font-jetbrains">Recommends</span>
                      </div>
                    )}
                  </div>
                  {feedback.testimonial && (
                    <div className="bg-purple-500/10 border-l-4 border-purple-500 p-4 mb-3">
                      <Quote className="h-4 w-4 text-purple-400 mb-2" />
                      <p className="text-gray-300 font-jetbrains italic">"{feedback.testimonial}"</p>
                    </div>
                  )}
                  {feedback.experience_highlights && (
                    <p className="text-gray-400 font-jetbrains text-sm mb-2">
                      <span className="text-purple-400">Highlights:</span> {feedback.experience_highlights}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 font-jetbrains">{new Date(feedback.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-8 inline-block">
            <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="font-press-start text-sm text-gray-400 mb-2">NO_FEEDBACK_YET</p>
            <p className="text-gray-500 font-jetbrains text-sm">
              {winnersAnnounced ? 'Be the first to share your experience!' : 'Feedback will be available after the hackathon ends'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
