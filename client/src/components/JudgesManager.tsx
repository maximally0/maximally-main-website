import { useState, useEffect } from 'react';
import { Scale, UserPlus, Check, X, Mail, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';

interface JudgesManagerProps {
  hackathonId: number;
}

export default function JudgesManager({ hackathonId }: JudgesManagerProps) {
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [judgeEmail, setJudgeEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [hackathonId]);

  const fetchData = async () => {
    try {
      const headers = await getAuthHeaders();
      
      const [requestsRes, assignmentsRes] = await Promise.all([
        fetch(`/api/organizer/hackathons/${hackathonId}/judge-requests`, { headers }),
        fetch(`/api/organizer/hackathons/${hackathonId}/judge-assignments`, { headers })
      ]);

      const requestsData = await requestsRes.json();
      const assignmentsData = await assignmentsRes.json();

      if (requestsData.success) setRequests(requestsData.data);
      if (assignmentsData.success) setAssignments(assignmentsData.data);
    } catch (error) {
      console.error('Error fetching judge data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteJudge = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/invite-judge`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          judge_email: judgeEmail,
          message: inviteMessage
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Invitation Sent!",
          description: "Judge has been invited to your hackathon",
        });
        setShowInviteModal(false);
        setJudgeEmail('');
        setInviteMessage('');
        fetchData();
      } else {
        // Check if judge is not available
        if (data.availability_status === 'not-available') {
          toast({
            title: "Judge Not Available",
            description: "This judge has set their status to 'Not Available' and cannot receive invitations at this time.",
            variant: "destructive",
          });
        } else {
          throw new Error(data.message);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/judge-requests/${requestId}/accept`, {
        method: 'POST',
        headers
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Request Accepted!",
          description: "Judge has been assigned to your hackathon",
        });
        fetchData();
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

  const handleRejectRequest = async (requestId: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/judge-requests/${requestId}/reject`, {
        method: 'POST',
        headers
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Request Rejected",
          description: "Judge request has been rejected",
        });
        fetchData();
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

  const handleRemoveJudge = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to remove this judge from the hackathon?')) return;
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/judges/${assignmentId}`, {
        method: 'DELETE',
        headers
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Judge Removed",
          description: "Judge has been removed from this hackathon",
        });
        fetchData();
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

  if (loading) {
    return <div className="text-center py-8 font-press-start text-gray-400">LOADING...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scale className="h-6 w-6 text-purple-400" />
          <h2 className="font-press-start text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">JUDGES</h2>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 font-press-start text-sm transition-all flex items-center gap-2 border border-pink-500/50"
        >
          <UserPlus className="h-4 w-4" />
          INVITE_JUDGE
        </button>
      </div>

      {/* Assigned Judges */}
      <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-green-500/30 p-6 hover:border-green-400/50 transition-all">
        <h3 className="font-press-start text-lg text-white mb-4">ASSIGNED_JUDGES</h3>
        {assignments.length === 0 ? (
          <p className="text-gray-400 font-jetbrains text-center py-8">No judges assigned yet</p>
        ) : (
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 bg-black/30 border border-green-500/20 hover:border-green-500/40 transition-all">
                <div className="flex items-center gap-3">
                  <Scale className="h-5 w-5 text-green-400" />
                  <div>
                    <div className="font-jetbrains text-white">{assignment.judge_name}</div>
                    <div className="text-sm text-gray-400">{assignment.judge_email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-xs font-press-start bg-green-500/20 text-green-400 border border-green-500/50">
                    ACTIVE
                  </span>
                  <button
                    onClick={() => handleRemoveJudge(assignment.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    title="Remove judge"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Requests */}
      <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-amber-500/30 p-6 hover:border-amber-400/50 transition-all">
        <h3 className="font-press-start text-lg text-white mb-4">PENDING_REQUESTS</h3>
        {requests.filter(r => r.status === 'pending').length === 0 ? (
          <p className="text-gray-400 font-jetbrains text-center py-8">No pending requests</p>
        ) : (
          <div className="space-y-3">
            {requests.filter(r => r.status === 'pending').map((request) => (
              <div key={request.id} className="p-4 bg-black/30 border border-amber-500/20 hover:border-amber-500/40 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="font-jetbrains text-white">{request.judge_name}</div>
                      <span className={`px-2 py-1 text-xs font-press-start ${
                        request.request_type === 'judge_request'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                      }`}>
                        {request.request_type === 'judge_request' ? 'REQUEST' : 'INVITE'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">{request.judge_email}</div>
                    {request.message && (
                      <div className="text-sm text-gray-300 font-jetbrains italic">
                        "{request.message}"
                      </div>
                    )}
                  </div>
                </div>
                {request.request_type === 'judge_request' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-gradient-to-r from-green-600/60 to-emerald-500/40 border border-green-500/50 hover:border-green-400 text-green-200 px-4 py-2 font-press-start text-xs transition-all flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      ACCEPT
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="bg-gradient-to-r from-red-600/60 to-rose-500/40 border border-red-500/50 hover:border-red-400 text-red-200 px-4 py-2 font-press-start text-xs transition-all flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      REJECT
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-purple-500/50 max-w-2xl w-full">
            <div className="p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-pink-900/20">
              <div className="flex items-center justify-between">
                <h2 className="font-press-start text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">INVITE_JUDGE</h2>
                <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-pink-400 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Availability Notice */}
              <div className="bg-amber-500/10 border border-amber-500/30 p-4">
                <p className="text-amber-300 font-jetbrains text-sm">
                  ⚠️ Note: Judges who have set their status to "Not Available" cannot receive invitations. 
                  Check the judge's availability on their profile before inviting.
                </p>
              </div>

              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Judge Email</label>
                <input
                  type="email"
                  value={judgeEmail}
                  onChange={(e) => setJudgeEmail(e.target.value)}
                  className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none"
                  placeholder="judge@example.com"
                />
              </div>

              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Message (Optional)</label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none resize-none"
                  placeholder="Why you'd like them to judge your hackathon..."
                />
              </div>

              <button
                onClick={handleInviteJudge}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 font-press-start text-sm transition-all flex items-center justify-center gap-2 border border-pink-500/50"
              >
                <Mail className="h-4 w-4" />
                SEND_INVITATION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
