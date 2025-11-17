import { useState, useEffect } from 'react';
import { Users, Mail, UserPlus, X, Check, Crown, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
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
    if (!inviteEmail.trim()) return;

    setSending(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/teams/${teamId}/invite`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: inviteEmail })
      });

      const data = await response.json();

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
      <div className="pixel-card bg-gray-900 border-2 border-maximally-yellow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-press-start text-lg text-white mb-2">{team.team_name}</h3>
            <p className="text-sm text-gray-400 font-jetbrains">
              Team Code: <span className="text-maximally-yellow font-press-start">{team.team_code}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-maximally-yellow font-press-start">
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
              className="flex items-center justify-between bg-black/50 border border-gray-800 p-3 rounded"
            >
              <div className="flex items-center gap-3">
                {member.user_id === team.team_leader_id && (
                  <Crown className="h-4 w-4 text-maximally-yellow" />
                )}
                <div>
                  <p className="font-jetbrains text-white text-sm">{member.full_name}</p>
                  <p className="font-jetbrains text-gray-400 text-xs">{member.email}</p>
                </div>
              </div>
              {isLeader && member.user_id !== team.team_leader_id && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-500 hover:text-red-400 transition-colors"
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
        <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
          <h4 className="font-press-start text-sm text-maximally-red mb-4">INVITE_MEMBERS</h4>
          <div className="flex gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 bg-black border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
            />
            <button
              onClick={handleInvite}
              disabled={sending || !inviteEmail.trim()}
              className="pixel-button bg-maximally-yellow text-black px-6 py-3 font-press-start text-sm hover:bg-maximally-red hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              SEND
            </button>
          </div>
          <p className="text-xs text-gray-400 font-jetbrains mt-2">
            Share your team code <span className="text-maximally-yellow font-press-start">{team.team_code}</span> with teammates to join instantly
          </p>
        </div>
      )}

      {/* Team Tasks */}
      <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
        <TeamTasks teamId={teamId} />
      </div>
    </div>
  );
}
