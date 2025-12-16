import { useState, useEffect } from 'react';
import { Trophy, Award, ExternalLink, Check, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';

interface Submission {
  id: number;
  project_name: string;
  tagline?: string;
  score?: number;
  demo_url?: string;
  github_repo?: string;
  user_name: string;
  team?: { team_name: string };
}

interface Prize {
  position: string;
  amount: string;
  description?: string;
}

interface Winner {
  id?: number;
  submission_id: number;
  prize_position: string;
  prize_amount?: string;
  submission?: Submission;
}

interface WinnersManagerProps {
  hackathonId: number;
  prizes: Prize[] | string | null | undefined;
  onWinnersAnnounced?: () => void;
}

export default function WinnersManager({ hackathonId, prizes: prizesProp, onWinnersAnnounced }: WinnersManagerProps) {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [canAnnounce, setCanAnnounce] = useState(false);

  // Parse prizes - handle string, array, or empty
  const prizes: Prize[] = (() => {
    if (!prizesProp) return [];
    if (Array.isArray(prizesProp)) return prizesProp;
    if (typeof prizesProp === 'string') {
      try {
        const parsed = JSON.parse(prizesProp);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  })();

  // Refetch data when component mounts or hackathonId changes
  // Also refetch periodically to catch settings changes
  useEffect(() => {
    fetchData();
  }, [hackathonId]);

  // Refetch when tab becomes visible (user switches to Winners tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [hackathonId]);

  const fetchData = async () => {
    try {
      const headers = await getAuthHeaders();
      
      // Fetch submissions with scores
      const subResponse = await fetch(`/api/organizer/hackathons/${hackathonId}/submissions`, { headers });
      const subData = await subResponse.json();
      
      // Fetch existing winners
      const winResponse = await fetch(`/api/organizer/hackathons/${hackathonId}/winners`, { headers });
      const winData = await winResponse.json();
      
      // Check if can announce (judging closed or results phase)
      const hackResponse = await fetch(`/api/organizer/hackathons/${hackathonId}`, { headers });
      const hackData = await hackResponse.json();
      
      if (subData.success) {
        // Sort by score descending
        const sorted = (subData.data || []).sort((a: Submission, b: Submission) => 
          (b.score || 0) - (a.score || 0)
        );
        setSubmissions(sorted);
      }
      
      if (winData.success) {
        setWinners(winData.data || []);
      }
      
      if (hackData.success) {
        const h = hackData.data;
        const judgingControl = h.judging_control || 'auto';
        const now = new Date();
        
        // Can announce if judging is closed or ended
        const judgingEnded = judgingControl === 'closed' || 
          (judgingControl === 'auto' && h.judging_ends_at && new Date(h.judging_ends_at) < now);
        setCanAnnounce(judgingEnded);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWinner = (prizePosition: string, submissionId: number | null) => {
    setWinners(prev => {
      const filtered = prev.filter(w => w.prize_position !== prizePosition);
      if (submissionId) {
        const prize = prizes.find(p => p.position === prizePosition);
        return [...filtered, { 
          submission_id: submissionId, 
          prize_position: prizePosition,
          prize_amount: prize?.amount
        }];
      }
      return filtered;
    });
  };

  const getWinnerForPrize = (prizePosition: string) => {
    return winners.find(w => w.prize_position === prizePosition);
  };

  const handleAnnounceWinners = async () => {
    if (winners.length === 0) {
      toast({ title: "No winners selected", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/announce-winners`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ winners })
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: "Winners Announced!", description: "Winners have been published to the hackathon page" });
        onWinnersAnnounced?.();
        fetchData();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 font-press-start text-gray-400">LOADING...</div>;
  }

  if (prizes.length === 0) {
    return (
      <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-8 text-center">
        <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <h2 className="font-press-start text-lg text-gray-400 mb-2">NO_PRIZES_CONFIGURED</h2>
        <p className="text-gray-500 font-jetbrains text-sm">
          Please add prize breakdown in the hackathon settings before announcing winners.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-press-start text-xl text-maximally-red">ANNOUNCE_WINNERS</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setLoading(true); fetchData(); }}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          {canAnnounce ? (
            <span className="text-xs text-green-500 font-jetbrains flex items-center gap-1">
              ✓ Ready to announce
            </span>
          ) : (
            <span className="text-xs text-yellow-500 font-jetbrains">
              ⏳ Close judging first
            </span>
          )}
        </div>
      </div>

      {/* Prize Selection */}
      <div className="space-y-4">
        {prizes.map((prize, index) => {
          const winner = getWinnerForPrize(prize.position);
          const selectedSubmission = winner ? submissions.find(s => s.id === winner.submission_id) : null;
          
          return (
            <div key={index} className="pixel-card bg-gray-900 border-2 border-gray-700 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className={`h-6 w-6 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-orange-400'}`} />
                <div>
                  <h3 className="font-press-start text-sm text-white">{prize.position}</h3>
                  <p className="text-maximally-yellow font-jetbrains text-lg">{prize.amount}</p>
                </div>
              </div>
              
              <select
                value={winner?.submission_id || ''}
                onChange={(e) => handleSelectWinner(prize.position, e.target.value ? parseInt(e.target.value) : null)}
                disabled={!canAnnounce}
                className="w-full bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Winner...</option>
                {submissions.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.project_name} - {sub.team?.team_name || sub.user_name} (Score: {sub.score || 'N/A'})
                  </option>
                ))}
              </select>
              
              {selectedSubmission && (
                <div className="mt-3 bg-green-900/20 border border-green-600 p-3 rounded">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-green-400 font-jetbrains text-sm">
                      {selectedSubmission.project_name}
                    </span>
                  </div>
                  {selectedSubmission.demo_url && (
                    <a href={selectedSubmission.demo_url} target="_blank" rel="noopener noreferrer"
                       className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1">
                      <ExternalLink className="h-3 w-3" /> View Demo
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Top Submissions by Score */}
      <div className="pixel-card bg-gray-900/50 border-2 border-gray-800 p-4">
        <h3 className="font-press-start text-sm text-gray-400 mb-3">TOP_SUBMISSIONS_BY_SCORE</h3>
        <div className="space-y-2">
          {submissions.slice(0, 5).map((sub, i) => (
            <div key={sub.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-300 font-jetbrains">
                {i + 1}. {sub.project_name}
              </span>
              <span className="text-maximally-yellow font-press-start text-xs">
                {sub.score?.toFixed(1) || 'N/A'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Announce Button */}
      <button
        onClick={handleAnnounceWinners}
        disabled={!canAnnounce || saving || winners.length === 0}
        className="w-full pixel-button bg-maximally-red text-white px-6 py-4 font-press-start text-sm hover:bg-maximally-yellow hover:text-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Award className="h-5 w-5" />
        {saving ? 'ANNOUNCING...' : 'ANNOUNCE_WINNERS'}
      </button>
      
      {winners.length > 0 && (
        <p className="text-center text-xs text-gray-500 font-jetbrains">
          {winners.length} winner(s) selected
        </p>
      )}
    </div>
  );
}
