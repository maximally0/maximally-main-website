import { useEffect, useState } from 'react';
import { MessageCircle, Star, User, ThumbsUp, BarChart3, Quote } from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

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
    email?: string;
  };
}

interface FeedbackStats {
  total_responses: number;
  avg_overall: number;
  avg_organization: number;
  avg_mentorship: number;
  recommend_percentage: number;
}

interface Props {
  hackathonId: number;
}

export default function OrganizerFeedbackViewer({ hackathonId }: Props) {
  const [feedbacks, setFeedbacks] = useState<ParticipantFeedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, [hackathonId]);

  const fetchFeedback = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/participant-feedback/all`, { headers });
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

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`h-4 w-4 ${rating >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
      ))}
    </div>
  );

  if (loading) {
    return <div className="text-center py-8 text-gray-400 font-press-start text-sm">LOADING...</div>;
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-8 inline-block">
          <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="font-press-start text-sm text-gray-400 mb-2">NO_FEEDBACK_YET</p>
          <p className="text-gray-500 font-jetbrains text-sm">Participants can submit feedback after the hackathon ends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && stats.total_responses > 0 && (
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            <span className="font-press-start text-sm text-purple-300">STATS</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="font-press-start text-2xl text-white">{stats.total_responses}</div>
              <div className="text-xs text-gray-400 font-jetbrains mt-1">Responses</div>
            </div>
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
        </div>
      )}

      {/* Feedback List */}
      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {feedback.profiles?.avatar_url ? (
                  <img src={feedback.profiles.avatar_url} alt="" className="w-12 h-12 rounded-full border-2 border-purple-500/30 object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-press-start text-sm text-white">
                    {feedback.profiles?.full_name || feedback.profiles?.username || 'Anonymous'}
                  </span>
                  {feedback.profiles?.email && (
                    <span className="text-xs text-gray-500 font-jetbrains">{feedback.profiles.email}</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 font-press-start ${feedback.is_public ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-700 text-gray-400 border border-gray-600'}`}>
                    {feedback.is_public ? 'PUBLIC' : 'PRIVATE'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Overall:</span>
                    {renderStars(feedback.overall_rating)}
                  </div>
                  {feedback.would_recommend && (
                    <div className="flex items-center gap-1 text-green-400">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-xs">Recommends</span>
                    </div>
                  )}
                </div>

                {feedback.testimonial && (
                  <div className="bg-purple-500/10 border-l-4 border-purple-500 p-3 mb-3">
                    <Quote className="h-3 w-3 text-purple-400 mb-1" />
                    <p className="text-gray-300 font-jetbrains text-sm italic">"{feedback.testimonial}"</p>
                  </div>
                )}

                {feedback.experience_highlights && (
                  <p className="text-gray-400 font-jetbrains text-sm mb-2">
                    <span className="text-green-400">✓ Highlights:</span> {feedback.experience_highlights}
                  </p>
                )}
                {feedback.improvement_suggestions && (
                  <p className="text-gray-400 font-jetbrains text-sm mb-2">
                    <span className="text-amber-400">💡 Suggestions:</span> {feedback.improvement_suggestions}
                  </p>
                )}

                <p className="text-xs text-gray-500 font-jetbrains">{new Date(feedback.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
