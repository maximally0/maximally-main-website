import { useState, useEffect } from 'react';
import { Trophy, Award, ExternalLink, Check, RefreshCw, AlertTriangle, Scale } from 'lucide-react';
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
  criteria_scores?: string;
  submitted_at?: string;
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

interface TieGroup {
  score: number;
  submissions: Submission[];
}

interface WinnersManagerProps {
  hackathonId: number;
  prizes: Prize[] | string | null | undefined;
  onWinnersAnnounced?: () => void;
}

// Tie-break criteria weights (higher = more important)
const TIE_BREAK_CRITERIA = [
  { key: 'innovation', label: 'Innovation', weight: 5 },
  { key: 'technical', label: 'Technical', weight: 4 },
  { key: 'impact', label: 'Impact', weight: 3 },
  { key: 'design', label: 'Design', weight: 2 },
  { key: 'presentation', label: 'Presentation', weight: 1 },
];

// Function to resolve ties using criteria scores
function resolveTies(submissions: Submission[]): Submission[] {
  // Group by score
  const scoreGroups = new Map<number, Submission[]>();
  submissions.forEach(sub => {
    const score = sub.score || 0;
    if (!scoreGroups.has(score)) {
      scoreGroups.set(score, []);
    }
    scoreGroups.get(score)!.push(sub);
  });

  // Sort each group with ties using criteria
  const sortedGroups: Submission[] = [];
  const sortedScores = Array.from(scoreGroups.keys()).sort((a, b) => b - a);

  for (const score of sortedScores) {
    const group = scoreGroups.get(score)!;
    
    if (group.length === 1) {
      sortedGroups.push(group[0]);
    } else {
      // Sort tied submissions by criteria
      const sortedGroup = group.sort((a, b) => {
        const aScores = a.criteria_scores ? JSON.parse(a.criteria_scores) : {};
        const bScores = b.criteria_scores ? JSON.parse(b.criteria_scores) : {};

        // Compare by each criterion in order of weight
        for (const criterion of TIE_BREAK_CRITERIA) {
          const aVal = aScores[criterion.key] || 0;
          const bVal = bScores[criterion.key] || 0;
          if (aVal !== bVal) {
            return bVal - aVal; // Higher is better
          }
        }

        // If still tied, use submission time (earlier is better)
        if (a.submitted_at && b.submitted_at) {
          return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
        }

        return 0;
      });
      sortedGroups.push(...sortedGroup);
    }
  }

  return sortedGroups;
}

// Function to detect ties
function detectTies(submissions: Submission[]): TieGroup[] {
  const scoreGroups = new Map<number, Submission[]>();
  submissions.forEach(sub => {
    const score = sub.score || 0;
    if (!scoreGroups.has(score)) {
      scoreGroups.set(score, []);
    }
    scoreGroups.get(score)!.push(sub);
  });

  return Array.from(scoreGroups.entries())
    .filter(([_, subs]) => subs.length > 1)
    .map(([score, subs]) => ({ score, submissions: subs }))
    .sort((a, b) => b.score - a.score);
}

export default function WinnersManager({ hackathonId, prizes: prizesProp, onWinnersAnnounced }: WinnersManagerProps) {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [canAnnounce, setCanAnnounce] = useState(false);
  const [showTieBreaker, setShowTieBreaker] = useState(false);
  const [ties, setTies] = useState<TieGroup[]>([]);

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

  useEffect(() => {
    fetchData();
  }, [hackathonId]);

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
      
      const subResponse = await fetch(`/api/organizer/hackathons/${hackathonId}/submissions`, { headers });
      const subData = await subResponse.json();
      
      const winResponse = await fetch(`/api/organizer/hackathons/${hackathonId}/winners`, { headers });
      const winData = await winResponse.json();
      
      const hackResponse = await fetch(`/api/organizer/hackathons/${hackathonId}`, { headers });
      const hackData = await hackResponse.json();
      
      if (subData.success) {
        // Apply tie-break logic to sort submissions
        const sorted = resolveTies(subData.data || []);
        setSubmissions(sorted);
        
        // Detect ties for display
        const detectedTies = detectTies(subData.data || []);
        setTies(detectedTies);
      }
      
      if (winData.success) {
        setWinners(winData.data || []);
      }
      
      if (hackData.success) {
        const h = hackData.data;
        const judgingControl = h.judging_control || 'auto';
        const now = new Date();
        
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
      <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-8 text-center">
        <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <h2 className="font-press-start text-lg text-gray-400 mb-2">NO PRIZES CONFIGURED</h2>
        <p className="text-gray-500 font-jetbrains text-sm">
          Please add prize breakdown in the hackathon settings before announcing winners.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-press-start text-lg text-purple-400 flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-400"></span>
          ANNOUNCE WINNERS
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setLoading(true); fetchData(); }}
            className="text-gray-400 hover:text-white p-2 hover:bg-white/10 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          {canAnnounce ? (
            <span className="text-xs text-green-400 font-jetbrains flex items-center gap-1">
              ✓ Ready to announce
            </span>
          ) : (
            <span className="text-xs text-amber-400 font-jetbrains">
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
            <div key={index} className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className={`h-6 w-6 ${index === 0 ? 'text-amber-400' : index === 1 ? 'text-gray-300' : 'text-orange-400'}`} />
                <div>
                  <h3 className="font-press-start text-sm text-white">{prize.position}</h3>
                  <p className="text-amber-400 font-jetbrains text-lg">{prize.amount}</p>
                </div>
              </div>
              
              <select
                value={winner?.submission_id || ''}
                onChange={(e) => handleSelectWinner(prize.position, e.target.value ? parseInt(e.target.value) : null)}
                disabled={!canAnnounce}
                className="w-full bg-black/50 border border-amber-500/30 text-white px-4 py-3 font-jetbrains focus:border-amber-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Winner...</option>
                {submissions.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.project_name} - {sub.team?.team_name || sub.user_name} (Score: {sub.score || 'N/A'})
                  </option>
                ))}
              </select>
              
              {selectedSubmission && (
                <div className="mt-3 bg-green-500/10 border border-green-500/30 p-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
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
      <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-gray-800 p-4">
        <h3 className="font-press-start text-sm text-gray-400 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-gray-400"></span>
          TOP SUBMISSIONS BY SCORE
        </h3>
        <div className="space-y-2">
          {submissions.slice(0, 5).map((sub, i) => (
            <div key={sub.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-300 font-jetbrains">
                {i + 1}. {sub.project_name}
              </span>
              <span className="text-amber-400 font-press-start text-xs">
                {sub.score?.toFixed(1) || 'N/A'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tie-Breaker Section */}
      {ties.length > 0 && (
        <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/10 border border-amber-500/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-press-start text-sm text-amber-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              TIES DETECTED
            </h3>
            <button
              onClick={() => setShowTieBreaker(!showTieBreaker)}
              className="text-xs text-amber-400 hover:text-amber-300 font-jetbrains"
            >
              {showTieBreaker ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          
          <p className="text-sm text-gray-400 font-jetbrains mb-3">
            {ties.length} tie(s) found. Ties are resolved using criteria scores in order: 
            Innovation → Technical → Impact → Design → Presentation → Submission Time
          </p>

          {showTieBreaker && (
            <div className="space-y-4 mt-4">
              {ties.map((tie, tieIndex) => (
                <div key={tieIndex} className="bg-black/30 border border-amber-500/20 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="h-4 w-4 text-amber-400" />
                    <span className="font-press-start text-xs text-amber-400">
                      SCORE: {tie.score.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500 font-jetbrains">
                      ({tie.submissions.length} submissions tied)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {tie.submissions.map((sub, subIndex) => {
                      const criteria = sub.criteria_scores ? JSON.parse(sub.criteria_scores) : {};
                      return (
                        <div key={sub.id} className="flex items-center justify-between text-xs">
                          <span className="text-gray-300 font-jetbrains">
                            {sub.project_name}
                          </span>
                          <div className="flex gap-2">
                            {TIE_BREAK_CRITERIA.map(c => (
                              <span key={c.key} className="text-gray-500" title={c.label}>
                                {c.label.charAt(0)}: {criteria[c.key] || 0}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Announce Button */}
      <button
        onClick={handleAnnounceWinners}
        disabled={!canAnnounce || saving || winners.length === 0}
        className="w-full bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white px-6 py-4 font-press-start text-xs transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Award className="h-5 w-5" />
        {saving ? 'ANNOUNCING...' : 'ANNOUNCE WINNERS'}
      </button>
      
      {winners.length > 0 && (
        <p className="text-center text-xs text-gray-500 font-jetbrains">
          {winners.length} winner(s) selected
        </p>
      )}
    </div>
  );
}
