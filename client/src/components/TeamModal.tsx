import { useState } from 'react';
import { X, Users, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useModeration } from '@/hooks/useModeration';
import { getAuthHeaders } from '@/lib/auth';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathonId: number;
  onTeamChange: () => void;
}

export default function TeamModal({ isOpen, onClose, hackathonId, onTeamChange }: TeamModalProps) {
  const { toast } = useToast();
  const { canJoinTeam } = useModeration();
  const [teamAction, setTeamAction] = useState<'create' | 'join'>('create');
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');

  const handleCreateTeam = async () => {
    if (!canJoinTeam()) {
      return;
    }
    
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`/api/hackathons/${hackathonId}/teams`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ team_name: teamName })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "🎯 Team Created!",
          description: `Team code: ${data.data.team_code}. Check your email for details!`,
        });
        onTeamChange();
        onClose();
        setTeamName('');
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

  const handleJoinTeam = async () => {
    if (!canJoinTeam()) {
      return;
    }
    
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`/api/hackathons/${hackathonId}/teams/join`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ team_code: teamCode })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "🤝 Joined Team!",
          description: `You've joined ${data.data.team_name}. Check your email for details!`,
        });
        onTeamChange();
        onClose();
        setTeamCode('');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[99999]">
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-900/80 border-2 border-purple-500/50 max-w-md w-full relative z-[100000] backdrop-blur-sm">
        {/* Header */}
        <div className="p-6 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 border border-purple-500/40">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="font-press-start text-lg text-white">TEAM</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Action Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTeamAction('create')}
              className={`py-3 font-press-start text-xs transition-all duration-300 ${
                teamAction === 'create' 
                  ? 'bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 text-purple-200' 
                  : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              CREATE
            </button>
            <button
              onClick={() => setTeamAction('join')}
              className={`py-3 font-press-start text-xs transition-all duration-300 ${
                teamAction === 'join' 
                  ? 'bg-gradient-to-r from-cyan-600/40 to-blue-500/30 border border-cyan-500/50 text-cyan-200' 
                  : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              JOIN
            </button>
          </div>

          {teamAction === 'create' ? (
            <div className="space-y-4">
              <div>
                <label className="font-press-start text-[10px] text-purple-300 mb-2 block flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-400"></span>
                  TEAM NAME
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none placeholder:text-gray-600"
                  placeholder="Enter team name"
                />
              </div>
              <button
                onClick={handleCreateTeam}
                disabled={!teamName.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-press-start text-xs transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CREATE TEAM
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="font-press-start text-[10px] text-cyan-300 mb-2 block flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-400"></span>
                  TEAM CODE
                </label>
                <input
                  type="text"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                  className="w-full bg-black/50 border border-cyan-500/30 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 outline-none uppercase placeholder:text-gray-600"
                  placeholder="Enter team code"
                  maxLength={8}
                />
              </div>
              <button
                onClick={handleJoinTeam}
                disabled={teamCode.length < 4}
                className="w-full py-3 bg-gradient-to-r from-cyan-600/40 to-blue-500/30 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 hover:text-white font-press-start text-xs transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                JOIN TEAM
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
