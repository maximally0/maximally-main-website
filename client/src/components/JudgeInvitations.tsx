import { useState, useEffect } from 'react';
import { Mail, Check, X, Calendar, MapPin, ExternalLink, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';
import { useConfirm } from '@/components/ui/confirm-modal';

export default function JudgeInvitations() {
  const { toast } = useToast();
  const confirm = useConfirm();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/judge/requests', { headers });
      const data = await response.json();

      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/judge-requests/${requestId}/accept`, {
        method: 'POST',
        headers
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Invitation Accepted!",
          description: "You've been assigned to judge this hackathon",
        });
        fetchRequests();
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

  const handleReject = async (requestId: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/judge-requests/${requestId}/reject`, {
        method: 'POST',
        headers
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Invitation Rejected",
          description: "You've declined this invitation",
        });
        fetchRequests();
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

  const handleWithdraw = async (hackathonId: number) => {
    const confirmed = await confirm({
      title: 'WITHDRAW',
      message: 'Are you sure you want to withdraw from judging this hackathon? This action cannot be undone.',
      confirmText: 'WITHDRAW',
      cancelText: 'CANCEL',
      variant: 'danger'
    });
    if (!confirmed) return;
    
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/judge/hackathons/${hackathonId}/withdraw`, {
        method: 'POST',
        headers
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Withdrawn Successfully",
          description: "You've withdrawn from judging this hackathon",
        });
        fetchRequests();
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
    return <div className="text-center py-8 font-press-start text-gray-400 animate-pulse">LOADING...</div>;
  }

  const pendingInvites = requests.filter(r => r.request_type === 'organizer_invite' && r.status === 'pending');
  const myRequests = requests.filter(r => r.request_type === 'judge_request');
  const accepted = requests.filter(r => r.status === 'accepted');

  return (
    <div className="space-y-8">
      {/* Pending Invitations */}
      <div>
        <h2 className="font-press-start text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">PENDING_INVITATIONS</h2>
        {pendingInvites.length === 0 ? (
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/40 p-12 text-center">
            <Mail className="h-12 w-12 text-pink-400/50 mx-auto mb-4" />
            <p className="font-press-start text-gray-400">NO_PENDING_INVITATIONS</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingInvites.map((invite) => (
              <div key={invite.id} className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/40 p-6 hover:border-pink-400 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-press-start text-lg text-white mb-2">
                      {invite.hackathon?.hackathon_name || 'Hackathon'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 font-jetbrains mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        {new Date(invite.hackathon?.start_date).toLocaleDateString()} - {new Date(invite.hackathon?.end_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-pink-400" />
                        {invite.hackathon?.format || 'Online'}
                      </div>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">
                      <span className="text-gray-400">From:</span> {invite.organizer?.full_name || invite.organizer?.username || 'Organizer'}
                    </div>
                    {invite.message && (
                      <div className="text-sm text-gray-300 font-jetbrains italic bg-black/30 p-3 border-l-2 border-pink-500">
                        "{invite.message}"
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccept(invite.id)}
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 font-press-start text-sm border border-green-500/50 transition-all flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    ACCEPT
                  </button>
                  <button
                    onClick={() => handleReject(invite.id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 font-press-start text-sm border border-red-500/50 transition-all flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    DECLINE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Requests */}
      <div>
        <h2 className="font-press-start text-2xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">MY_REQUESTS</h2>
        {myRequests.length === 0 ? (
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/40 p-12 text-center">
            <p className="font-press-start text-gray-400">NO_REQUESTS_SENT</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myRequests.map((request) => (
              <div key={request.id} className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/40 p-6 hover:border-pink-400 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-press-start text-lg text-white mb-2">
                      {request.hackathon?.hackathon_name || 'Hackathon'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 font-jetbrains mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        {new Date(request.hackathon?.start_date).toLocaleDateString()}
                      </div>
                    </div>
                    {request.message && (
                      <div className="text-sm text-gray-300 font-jetbrains italic mb-3 bg-black/30 p-3 border-l-2 border-purple-500">
                        Your message: "{request.message}"
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 text-xs font-press-start ${
                    request.status === 'pending' 
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                      : request.status === 'accepted'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accepted */}
      <div>
        <h2 className="font-press-start text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">ACCEPTED_HACKATHONS</h2>
        {accepted.length === 0 ? (
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/40 p-12 text-center">
            <p className="font-press-start text-gray-400">NO_ACCEPTED_HACKATHONS</p>
          </div>
        ) : (
          <div className="space-y-4">
            {accepted.map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-green-900/20 to-purple-900/20 border border-green-500/40 p-6 hover:border-green-400 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-press-start text-lg text-white mb-2">
                      {item.hackathon?.hackathon_name || 'Hackathon'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 font-jetbrains">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-green-400" />
                        {new Date(item.hackathon?.start_date).toLocaleDateString()} - {new Date(item.hackathon?.end_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-press-start bg-green-500/20 text-green-400 border border-green-500/50">
                      ACCEPTED
                    </span>
                    <button
                      onClick={() => handleWithdraw(item.hackathon_id)}
                      className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/50 px-3 py-1 font-press-start text-xs transition-all flex items-center gap-1"
                      title="Withdraw from judging"
                    >
                      <LogOut className="h-3 w-3" />
                      WITHDRAW
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
