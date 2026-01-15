import { useState, useEffect } from 'react';
import { Users, Mail, Crown, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useModeration } from '@/hooks/useModeration';
import { getAuthHeaders } from '@/lib/auth';
import TeamTasks from '@/components/TeamTasks';

interface TeamMember {
  id: number;
  user_id: string;
  username: string;
  full_name: string;
  email: string;
}

interface TeamDetails {
  id: number;
  team_name: string;
  team_code: string;
  team_leader_id: string;
  members: TeamMember[];
}

interface Props {
  teamId: number;
  hackathonId: number;
  isLeader: boolean;
  onUpdate?: () => void;
}

export default function TeamManagement({ teamId, hackathonId, isLeader, onUpdate }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { canJoinTeam } = useModeration();
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/teams/${teamId}`, { headers });
      const data = await response.json();

      if (data.success) {
        setTeam(data.data);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    console.log('[TeamManagement] handleInvite called, email:', inviteEmail);
    if (!inviteEmail.trim()) {
      console.log('[TeamManagement] Empty email, returning');
      return;
    }

    if (!canJoinTeam()) {
      console.log('[TeamManagement] canJoinTeam returned false');
      return;
    }

    setSending(true);
    try {
      const headers = await getAuthHeaders();
      console.log('[TeamManagement] Sending invite to:', `/api/teams/${teamId}/invite`);
      const response = await fetch(`/api/teams/${teamId}/invite`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: inviteEmail })
      });

      const data = await response.json();
      console.log('[TeamManagement] Invite response:', data);

      if (data.success) {
        toast({
          title: "Invitation Sent!",
          description: `Invitation sent to ${inviteEmail}`,
        });
        setInviteEmail('');
        fetchTeamDetails();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error('[TeamManagement] Invite error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/teams/${teamId}/members/${memberId}`, {
        method: 'DELETE',
        headers
      });

      toast({ title: "Member removed from team" });
      fetchTeamDetails();
      onUpdate?.();
    } catch (error) {
      toast({ title: "Error removing member", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="font-press-start text-sm text-gray-400">LOADING...</div>
      </div>
    );
  }

  if (!team) return null;

  return (
    <div className="space-y-6">
      {/* Team Info */}
      <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-press-start text-lg text-white mb-2">{team.team_name}</h3>
            <p className="text-sm text-gray-400 font-jetbrains">
              Team Code: <span className="text-amber-400 font-press-start">{team.team_code}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-400 font-press-start">
              {team.members.length}
            </div>
            <div className="text-xs text-gray-400 font-press-start">MEMBERS</div>
          </div>
        </div>

        {/* Members List */}
        <div className="space-y-2">
          {team.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between bg-black/30 border border-gray-800 p-3"
            >
              <div className="flex items-center gap-3">
                {member.user_id === team.team_leader_id && (
                  <Crown className="h-4 w-4 text-amber-400" />
                )}
                <div>
                  <p className="font-jetbrains text-white text-sm">{member.full_name}</p>
                  <p className="font-jetbrains text-gray-400 text-xs">{member.email}</p>
                </div>
              </div>
              {isLeader && member.user_id !== team.team_leader_id && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invite Members (Leader Only) */}
      {isLeader && (
        <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-6">
          <h4 className="font-press-start text-sm text-cyan-400 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-400"></span>
            INVITE MEMBERS
          </h4>
          <div className="flex gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 bg-black/50 border border-cyan-500/30 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 outline-none placeholder:text-gray-600"
            />
            <button
              onClick={handleInvite}
              disabled={sending || !inviteEmail.trim()}
              className="bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 border border-cyan-500/50 text-white px-6 py-3 font-press-start text-xs transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              SEND
            </button>
          </div>
          <p className="text-xs text-gray-400 font-jetbrains mt-2">
            Share your team code <span className="text-amber-400 font-press-start">{team.team_code}</span> with teammates to join instantly
          </p>
        </div>
      )}

      {/* Team Tasks */}
      <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-6">
        <TeamTasks teamId={teamId} />
      </div>
    </div>
  );
}
