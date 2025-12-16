import { useState } from 'react';
import { X } from 'lucide-react';
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
    // Check moderation status
    if (!canJoinTeam()) {
      return;
    }
    
    console.log('🏗️ [TEAM MODAL] Creating team with name:', teamName);
    try {
      const headers = await getAuthHeaders();
      console.log('🔑 [TEAM MODAL] Got auth headers:', headers);
      
      const response = await fetch(`/api/hackathons/${hackathonId}/teams`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ team_name: teamName })
      });

      console.log('📡 [TEAM MODAL] Response status:', response.status);
      console.log('📡 [TEAM MODAL] Response headers:', response.headers);

      const data = await response.json();
      console.log('📦 [TEAM MODAL] Response data:', data);

      if (data.success) {
        console.log('✅ [TEAM MODAL] Team created successfully!');
        toast({
          title: "Team Created!",
          description: `Team code: ${data.data.team_code}. Share this with your teammates!`,
        });
        onTeamChange();
        onClose();
        setTeamName('');
      } else {
        console.log('❌ [TEAM MODAL] Team creation failed:', data.message);
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.log('💥 [TEAM MODAL] Error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleJoinTeam = async () => {
    // Check moderation status
    if (!canJoinTeam()) {
      return;
    }
    
    try {
      console.log('🔗 [TEAM MODAL] Starting join team process');
      const headers = await getAuthHeaders();
      console.log('🔑 [TEAM MODAL] Auth headers:', headers);
      console.log('🔗 [TEAM MODAL] Team code:', teamCode);
      console.log('🔗 [TEAM MODAL] Hackathon ID:', hackathonId);
      
      const response = await fetch(`/api/hackathons/${hackathonId}/teams/join`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ team_code: teamCode })
      });

      console.log('📡 [TEAM MODAL] Response status:', response.status);
      console.log('📡 [TEAM MODAL] Response headers:', response.headers);

      const data = await response.json();
      console.log('📦 [TEAM MODAL] Response data:', data);

      if (data.success) {
        console.log('✅ [TEAM MODAL] Team joined successfully!');
        toast({
          title: "Joined Team!",
          description: `You've joined ${data.data.team_name}`,
        });
        onTeamChange();
        onClose();
        setTeamCode('');
      } else {
        console.log('❌ [TEAM MODAL] Team join failed:', data.message);
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.log('💥 [TEAM MODAL] Error:', error);
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
      <div className="pixel-card bg-black border-4 border-maximally-red max-w-md w-full relative z-[100000]">
        <div className="p-6 border-b-2 border-maximally-red">
          <div className="flex items-center justify-between">
            <h2 className="font-press-start text-xl text-maximally-red">TEAM</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTeamAction('create')}
              className={`pixel-button py-3 font-press-start text-xs ${
                teamAction === 'create' ? 'bg-maximally-red text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              CREATE
            </button>
            <button
              onClick={() => setTeamAction('join')}
              className={`pixel-button py-3 font-press-start text-xs ${
                teamAction === 'join' ? 'bg-maximally-red text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              JOIN
            </button>
          </div>

          {teamAction === 'create' ? (
            <div>
              <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Team Name</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                placeholder="Enter team name"
              />
              <button
                onClick={handleCreateTeam}
                disabled={!teamName.trim()}
                className="pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors w-full mt-4 disabled:opacity-50"
              >
                CREATE_TEAM
              </button>
            </div>
          ) : (
            <div>
              <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Team Code</label>
              <input
                type="text"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none uppercase"
                placeholder="Enter team code"
                maxLength={8}
              />
              <button
                onClick={handleJoinTeam}
                disabled={teamCode.length < 4}
                className="pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors w-full mt-4 disabled:opacity-50"
              >
                JOIN_TEAM
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}