import { useState, useEffect } from 'react';
import { Scale, Send, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';

interface RequestToJudgeProps {
  hackathonId: number;
}

export default function RequestToJudge({ hackathonId }: RequestToJudgeProps) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && profile?.role === 'judge') {
      checkStatus();
    } else {
      setLoading(false);
    }
  }, [user, profile, hackathonId]);

  const checkStatus = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/judge-status`, { headers });
      const data = await response.json();

      if (data.success) {
        setStatus(data.data);
      }
    } catch (error) {
      console.error('Error checking judge status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    setSubmitting(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/request-to-judge`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Request Sent!",
          description: "Your request to judge has been sent to the organizer",
        });
        setShowModal(false);
        setMessage('');
        checkStatus();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Don't show if not a judge
  if (!user || profile?.role !== 'judge' || loading) {
    return null;
  }

  // Already assigned
  if (status?.isAssigned) {
    return (
      <button
        disabled
        className="pixel-button bg-green-600 text-white px-6 py-3 font-press-start text-sm flex items-center gap-2 cursor-not-allowed opacity-75"
      >
        <Check className="h-4 w-4" />
        ASSIGNED_AS_JUDGE
      </button>
    );
  }

  // Already requested
  if (status?.hasRequest) {
    return (
      <button
        disabled
        className="pixel-button bg-gray-600 text-white px-6 py-3 font-press-start text-sm flex items-center gap-2 cursor-not-allowed opacity-75"
      >
        <Scale className="h-4 w-4" />
        REQUEST_{status.requestStatus?.toUpperCase()}
      </button>
    );
  }

  // Can request
  if (status?.canRequest) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="pixel-button bg-purple-600 text-white px-6 py-3 font-press-start text-sm hover:bg-purple-500 flex items-center gap-2"
        >
          <Scale className="h-4 w-4" />
          REQUEST_TO_JUDGE
        </button>

        {/* Request Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="pixel-card bg-black border-4 border-purple-600 max-w-md w-full">
              <div className="p-6 border-b-2 border-purple-600">
                <h2 className="font-press-start text-xl text-purple-600">REQUEST_TO_JUDGE</h2>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-gray-300 font-jetbrains text-sm">
                  Send a request to the organizer to judge this hackathon. Include a message about your experience and why you'd like to judge.
                </p>

                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Message (Optional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-purple-600 outline-none resize-none"
                    placeholder="Tell the organizer about your judging experience..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRequest}
                    disabled={submitting}
                    className="flex-1 pixel-button bg-purple-600 text-white px-6 py-3 font-press-start text-sm hover:bg-purple-500 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? 'SENDING...' : 'SEND_REQUEST'}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                    className="pixel-button bg-gray-700 text-white px-6 py-3 font-press-start text-sm hover:bg-gray-600"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
