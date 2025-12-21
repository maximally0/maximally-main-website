import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Scale, Send, Check, X } from 'lucide-react';
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
        className="bg-green-500/20 border border-green-500/40 text-green-300 px-6 py-3 font-press-start text-xs flex items-center gap-2 cursor-not-allowed opacity-75"
      >
        <Check className="h-4 w-4" />
        ASSIGNED AS JUDGE
      </button>
    );
  }

  // Already requested
  if (status?.hasRequest) {
    return (
      <button
        disabled
        className="bg-gray-800/50 border border-gray-700 text-gray-400 px-6 py-3 font-press-start text-xs flex items-center gap-2 cursor-not-allowed opacity-75"
      >
        <Scale className="h-4 w-4" />
        REQUEST {status.requestStatus?.toUpperCase()}
      </button>
    );
  }

  // Can request
  if (status?.canRequest) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-purple-600/40 to-violet-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white px-6 py-3 font-press-start text-xs transition-all duration-300 flex items-center gap-2"
        >
          <Scale className="h-4 w-4" />
          REQUEST TO JUDGE
        </button>

        {/* Request Modal - Using Portal to render at document body level */}
        {showModal && createPortal(
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
            <div className="bg-gradient-to-br from-gray-900/95 to-gray-900/80 border-2 border-purple-500/50 max-w-md w-full relative backdrop-blur-sm" style={{ zIndex: 100000 }}>
              <div className="p-6 border-b border-purple-500/30">
                <div className="flex items-center justify-between">
                  <h2 className="font-press-start text-lg text-purple-400 flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    REQUEST TO JUDGE
                  </h2>
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="text-gray-400 hover:text-white p-2 hover:bg-white/10 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-gray-300 font-jetbrains text-sm">
                  Send a request to the organizer to judge this hackathon. Include a message about your experience and why you'd like to judge.
                </p>

                <div>
                  <label className="font-press-start text-[10px] text-purple-300 mb-2 block flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400"></span>
                    MESSAGE (OPTIONAL)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none resize-none placeholder:text-gray-600"
                    placeholder="Tell the organizer about your judging experience..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRequest}
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-purple-600/40 to-violet-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white px-6 py-3 font-press-start text-xs transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? 'SENDING...' : 'SEND REQUEST'}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                    className="bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white px-6 py-3 font-press-start text-xs transition-all duration-300"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  return null;
}
