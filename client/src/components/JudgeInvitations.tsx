import { useState, useEffect } from 'react';
import { Mail, Check, X, Calendar, MapPin, ExternalLink, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';

export default function JudgeInvitations() {
  const { toast } = useToast();
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
    if (!confirm('Are you sure you want to withdraw from judging this hackathon? This action cannot be undone.')) return;
    
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
    return <div className="text-center py-8 font-press-start text-gray-400">LOADING...</div>;
  }

  const pendingInvites = requests.filter(r => r.request_type === 'organizer_invite' && r.status === 'pending');
  const myRequests = requests.filter(r => r.request_type === 'judge_request');
  const accepted = requests.filter(r => r.status === 'accepted');

  return (
    <div className="space-y-8">
      {/* Pending Invitations */}
      <div>
        <h2 className="font-press-start text-2xl text-maximally-yellow mb-6">PENDING_INVITATIONS</h2>
        {pendingInvites.length === 0 ? (
          <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-12 text-center">
            <Mail className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="font-press-start text-gray-400">NO_PENDING_INVITATIONS</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingInvites.map((invite) => (
              <div key={invite.id} className="pixel-card bg-gray-900 border-2 border-maximally-yellow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-press-start text-lg text-white mb-2">
                      {invite.hackathon?.hackathon_name || 'Hackathon'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 font-jetbrains mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(invite.hackathon?.start_date).toLocaleDateString()} - {new Date(invite.hackathon?.end_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {invite.hackathon?.format || 'Online'}
                      </div>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">
                      <span className="text-gray-400">From:</span> {invite.organizer?.full_name || invite.organizer?.username || 'Organizer'}
                    </div>
                    {invite.message && (
                      <div className="text-sm text-gray-300 font-jetbrains italic bg-gray-800 p-3 border-l-2 border-maximally-yellow">
                        "{invite.message}"
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccept(invite.id)}
                    className="pixel-button bg-green-600 text-white px-6 py-3 font-press-start text-sm hover:bg-green-500 flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    ACCEPT
                  </button>
                  <button
                    onClick={() => handleReject(invite.id)}
                    className="pixel-button bg-red-600 text-white px-6 py-3 font-press-start text-sm hover:bg-red-500 flex items-center gap-2"
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
        <h2 className="font-press-start text-2xl text-maximally-yellow mb-6">MY_REQUESTS</h2>
        {myRequests.length === 0 ? (
          <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-12 text-center">
            <p className="font-press-start text-gray-400">NO_REQUESTS_SENT</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myRequests.map((request) => (
              <div key={request.id} className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-press-start text-lg text-white mb-2">
                      {request.hackathon?.hackathon_name || 'Hackathon'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 font-jetbrains mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(request.hackathon?.start_date).toLocaleDateString()}
                      </div>
                    </div>
                    {request.message && (
                      <div className="text-sm text-gray-300 font-jetbrains italic mb-3">
                        Your message: "{request.message}"
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 text-xs font-press-start ${
                    request.status === 'pending' 
                      ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500'
                      : request.status === 'accepted'
                      ? 'bg-green-500/20 text-green-500 border border-green-500'
                      : 'bg-red-500/20 text-red-500 border border-red-500'
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
        <h2 className="font-press-start text-2xl text-maximally-yellow mb-6">ACCEPTED_HACKATHONS</h2>
        {accepted.length === 0 ? (
          <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-12 text-center">
            <p className="font-press-start text-gray-400">NO_ACCEPTED_HACKATHONS</p>
          </div>
        ) : (
          <div className="space-y-4">
            {accepted.map((item) => (
              <div key={item.id} className="pixel-card bg-gray-900 border-2 border-green-500 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-press-start text-lg text-white mb-2">
                      {item.hackathon?.hackathon_name || 'Hackathon'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 font-jetbrains">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.hackathon?.start_date).toLocaleDateString()} - {new Date(item.hackathon?.end_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-press-start bg-green-500/20 text-green-500 border border-green-500">
                      ACCEPTED
                    </span>
                    <button
                      onClick={() => handleWithdraw(item.hackathon_id)}
                      className="pixel-button bg-red-600/20 text-red-400 border border-red-500 px-3 py-1 font-press-start text-xs hover:bg-red-600 hover:text-white transition-colors flex items-center gap-1"
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
