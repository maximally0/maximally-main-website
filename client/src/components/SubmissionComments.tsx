import { useEffect, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  commenter_id: string;
  commenter_role: 'judge' | 'organizer' | 'mentor';
  comment_text: string;
  is_private: boolean;
  created_at: string;
}

interface SubmissionCommentsProps {
  submissionId: number;
  userRole?: string;
}

export default function SubmissionComments({ submissionId, userRole }: SubmissionCommentsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const canComment = userRole === 'judge' || userRole === 'organizer' || userRole === 'admin';

  useEffect(() => {
    fetchComments();
  }, [submissionId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}/comments`);
      const data = await response.json();
      if (data.success) {
        setComments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !canComment) return;

    setSubmitting(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/submissions/${submissionId}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          comment_text: newComment,
          commenter_role: userRole,
          is_private: isPrivate,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Comment added!' });
        setNewComment('');
        fetchComments();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: 'Error adding comment',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      judge: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
      organizer: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
      mentor: 'bg-green-500/20 border-green-500/40 text-green-300',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-500/20 border-gray-500/40 text-gray-300';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="font-press-start text-sm text-gray-400">LOADING COMMENTS...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-cyan-400" />
        <h3 className="font-press-start text-lg text-cyan-400">
          FEEDBACK & COMMENTS ({comments.length})
        </h3>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-800/50 border border-gray-700 text-gray-400 px-6 py-4 inline-block">
              <span className="font-press-start text-sm">NO COMMENTS YET</span>
            </div>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`border p-4 ${
                comment.is_private 
                  ? 'bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/30' 
                  : 'bg-gradient-to-br from-gray-900/60 to-gray-900/30 border-gray-700'
              }`}
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`border px-2 py-1 ${getRoleBadge(comment.commenter_role)}`}>
                    <span className="font-press-start text-xs">
                      {comment.commenter_role.toUpperCase()}
                    </span>
                  </span>
                  {comment.is_private && (
                    <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2 py-1">
                      <span className="font-press-start text-xs">PRIVATE</span>
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 font-jetbrains">
                  {formatDate(comment.created_at)}
                </span>
              </div>

              {/* Comment Text */}
              <p className="text-gray-300 font-jetbrains leading-relaxed whitespace-pre-wrap">
                {comment.comment_text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form (for judges/organizers only) */}
      {canComment && user && (
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 p-6">
          <h4 className="font-press-start text-sm text-cyan-400 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-400"></span>
            ADD COMMENT
          </h4>
          <div className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your feedback or comment..."
              className="w-full bg-black/50 border border-cyan-500/30 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 outline-none resize-none placeholder:text-gray-600"
              rows={4}
            />
            
            {/* Privacy Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-5 h-5 accent-cyan-500"
              />
              <span className="font-jetbrains text-sm text-gray-300">
                Private comment (only visible to judges and organizers)
              </span>
            </label>

            <button
              onClick={handleSubmitComment}
              disabled={submitting || !newComment.trim()}
              className="bg-gradient-to-r from-cyan-600/40 to-blue-500/30 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 hover:text-white px-6 py-3 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              <span className="font-press-start text-xs">
                {submitting ? 'POSTING...' : 'POST COMMENT'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
