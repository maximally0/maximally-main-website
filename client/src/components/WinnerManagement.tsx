import { useState, useEffect } from 'react';
import { Trophy, CheckCircle, XCircle, Clock, Award, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';

interface WinnerManagementProps {
  hackathonId: number;
}

export default function WinnerManagement({ hackathonId }: WinnerManagementProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [calculatedWinners, setCalculatedWinners] = useState<any[]>([]);
  const [proposedWinners, setProposedWinners] = useState<any[]>([]);
  const [approvedWinners, setApprovedWinners] = useState<any[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [proposing, setProposing] = useState(false);

  useEffect(() => {
    fetchWinners();
  }, [hackathonId]);

  const fetchWinners = async () => {
    try {
      const headers = await getAuthHeaders();
      
      // Fetch all winners (pending and approved)
      const response = await fetch(`/api/hackathons/${hackathonId}/winners`, { headers });
      const data = await response.json();
      
      if (data.success) {
        const pending = data.data.filter((w: any) => w.status === 'pending');
        const approved = data.data.filter((w: any) => w.status === 'approved');
        setProposedWinners(pending);
        setApprovedWinners(approved);
      }
    } catch (error) {
      console.error('Error fetching winners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateWinners = async () => {
    setCalculating(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/calculate-winners`, {
        method: 'POST',
        headers
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCalculatedWinners(data.data);
        toast({
          title: "Winners Calculated!",
          description: `Found ${data.data.length} potential winners based on scores`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to calculate winners",
        variant: "destructive",
      });
    } finally {
      setCalculating(false);
    }
  };

  const handleProposeWinners = async () => {
    if (calculatedWinners.length === 0) {
      toast({
        title: "No Winners",
        description: "Please calculate winners first",
        variant: "destructive",
      });
      return;
    }

    setProposing(true);
    try {
      const headers = await getAuthHeaders();
      
      const winnersData = calculatedWinners.map((winner, index) => ({
        submission_id: winner.submission_id,
        position: winner.suggested_position,
        prize_name: winner.suggested_prize,
        prize_amount: null // Can be customized
      }));

      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/propose-winners`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ winners: winnersData })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Winners Proposed!",
          description: "Review and approve winners to announce them",
        });
        setCalculatedWinners([]);
        fetchWinners();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to propose winners",
        variant: "destructive",
      });
    } finally {
      setProposing(false);
    }
  };

  const handleApproveWinner = async (winnerId: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/winners/${winnerId}/approve`, {
        method: 'POST',
        headers
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Winner Approved!",
          description: "Achievement has been added to winner's profile",
        });
        fetchWinners();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve winner",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="font-press-start text-maximally-red">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-press-start text-2xl text-maximally-red mb-2">WINNER MANAGEMENT</h2>
          <p className="font-jetbrains text-gray-400">
            Calculate, review, and announce hackathon winners
          </p>
        </div>
        <button
          onClick={handleCalculateWinners}
          disabled={calculating}
          className="pixel-button bg-maximally-yellow text-black px-6 py-3 font-press-start text-sm hover:bg-maximally-red hover:text-white disabled:opacity-50 flex items-center gap-2"
        >
          <Trophy className="h-5 w-5" />
          {calculating ? 'CALCULATING...' : 'CALCULATE_WINNERS'}
        </button>
      </div>

      {/* Calculated Winners (Not Yet Proposed) */}
      {calculatedWinners.length > 0 && (
        <div className="pixel-card bg-gray-900 border-2 border-maximally-yellow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-press-start text-lg text-maximally-yellow">
              CALCULATED WINNERS ({calculatedWinners.length})
            </h3>
            <button
              onClick={handleProposeWinners}
              disabled={proposing}
              className="pixel-button bg-maximally-yellow text-black px-4 py-2 font-press-start text-xs hover:bg-maximally-red hover:text-white disabled:opacity-50"
            >
              {proposing ? 'PROPOSING...' : 'PROPOSE_THESE_WINNERS'}
            </button>
          </div>

          <div className="space-y-4">
            {calculatedWinners.map((winner, index) => (
              <div key={index} className="pixel-card bg-black border border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-maximally-yellow font-press-start">
                        #{winner.suggested_position}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-press-start text-white mb-1">{winner.project_name}</h4>
                      <p className="font-jetbrains text-sm text-gray-400">
                        Score: {winner.final_score?.toFixed(2)} | Prize: {winner.suggested_prize}
                      </p>
                    </div>
                  </div>
                  <Trophy className="h-8 w-8 text-maximally-yellow" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proposed Winners (Pending Approval) */}
      {proposedWinners.length > 0 && (
        <div className="pixel-card bg-gray-900 border-2 border-cyan-400 p-6">
          <h3 className="font-press-start text-lg text-cyan-400 mb-6">
            PENDING APPROVAL ({proposedWinners.length})
          </h3>

          <div className="space-y-4">
            {proposedWinners.map((winner) => (
              <div key={winner.id} className="pixel-card bg-black border border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-cyan-400 font-press-start">
                        #{winner.position}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-press-start text-white mb-1">
                        {winner.submission?.project_name || 'Unknown Project'}
                      </h4>
                      <p className="font-jetbrains text-sm text-gray-400">
                        Prize: {winner.prize_name}
                        {winner.prize_amount && ` - ${winner.prize_amount}`}
                      </p>
                      {winner.team && (
                        <p className="font-jetbrains text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3" />
                          Team: {winner.team.team_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleApproveWinner(winner.id)}
                    className="pixel-button bg-green-600 text-white px-4 py-2 font-press-start text-xs hover:bg-green-700 flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    APPROVE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Winners */}
      {approvedWinners.length > 0 && (
        <div className="pixel-card bg-gray-900 border-2 border-green-400 p-6">
          <h3 className="font-press-start text-lg text-green-400 mb-6">
            ANNOUNCED WINNERS ({approvedWinners.length})
          </h3>

          <div className="space-y-4">
            {approvedWinners.map((winner) => (
              <div key={winner.id} className="pixel-card bg-black border border-green-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 font-press-start">
                        #{winner.position}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-press-start text-white mb-1">
                        {winner.submission?.project_name || 'Unknown Project'}
                      </h4>
                      <p className="font-jetbrains text-sm text-gray-400">
                        Prize: {winner.prize_name}
                        {winner.prize_amount && ` - ${winner.prize_amount}`}
                      </p>
                      {winner.team && (
                        <p className="font-jetbrains text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3" />
                          Team: {winner.team.team_name}
                        </p>
                      )}
                      <p className="font-jetbrains text-xs text-green-400 mt-2">
                        ✓ Announced on {new Date(winner.announced_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Award className="h-8 w-8 text-green-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {calculatedWinners.length === 0 && proposedWinners.length === 0 && approvedWinners.length === 0 && (
        <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-12 text-center">
          <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="font-press-start text-lg text-gray-400 mb-2">NO WINNERS YET</h3>
          <p className="font-jetbrains text-gray-500 mb-6">
            Calculate winners once judging is complete
          </p>
          <button
            onClick={handleCalculateWinners}
            disabled={calculating}
            className="pixel-button bg-maximally-yellow text-black px-6 py-3 font-press-start text-sm hover:bg-maximally-red hover:text-white disabled:opacity-50"
          >
            {calculating ? 'CALCULATING...' : 'CALCULATE_WINNERS_NOW'}
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="pixel-card bg-cyan-900/20 border border-cyan-600 p-4">
        <h4 className="font-press-start text-sm text-cyan-400 mb-2">HOW IT WORKS</h4>
        <ol className="font-jetbrains text-sm text-gray-300 space-y-2 list-decimal list-inside">
          <li>Click "Calculate Winners" to rank submissions by weighted scores</li>
          <li>Review the calculated rankings and click "Propose These Winners"</li>
          <li>Winners move to "Pending Approval" - review each one</li>
          <li>Click "Approve" to officially announce winners</li>
          <li>Approved winners get achievements added to their profiles automatically</li>
        </ol>
      </div>
    </div>
  );
}
