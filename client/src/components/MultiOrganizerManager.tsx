import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Mail, Shield, Eye, Trash2, Check, X, Crown } from 'lucide-react';

interface HackathonOrganizer {
  id: string;
  hackathon_id: number;
  user_id: string;
  role: 'owner' | 'co-organizer' | 'admin' | 'viewer';
  permissions: {
    can_edit: boolean;
    can_manage_registrations: boolean;
    can_manage_submissions: boolean;
    can_manage_judges: boolean;
    can_manage_announcements: boolean;
    can_view_analytics: boolean;
  };
  status: 'pending' | 'accepted' | 'declined' | 'removed';
  invited_at: string;
  accepted_at: string | null;
  profile?: {
    full_name: string;
    email: string;
    avatar_url: string;
    username: string;
  };
}

interface MultiOrganizerManagerProps {
  hackathonId: number;
  isOwner: boolean;
}

const roleColors = {
  owner: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'co-organizer': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  admin: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  viewer: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const statusColors = {
  pending: 'bg-orange-500/20 text-orange-400',
  accepted: 'bg-green-500/20 text-green-400',
  declined: 'bg-red-500/20 text-red-400',
  removed: 'bg-gray-500/20 text-gray-400',
};

export function MultiOrganizerManager({ hackathonId, isOwner }: MultiOrganizerManagerProps) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'co-organizer' | 'admin' | 'viewer'>('co-organizer');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch organizers for this hackathon
  const { data: organizers, isLoading } = useQuery({
    queryKey: ['hackathon-organizers', hackathonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hackathon_organizers')
        .select(`
          *,
          profile:profiles!hackathon_organizers_user_id_fkey (
            full_name,
            email,
            avatar_url,
            username
          )
        `)
        .eq('hackathon_id', hackathonId)
        .neq('status', 'removed')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as HackathonOrganizer[];
    },
  });

  // Invite new organizer mutation
  const inviteMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      // Use the API to create invite and send email (handles token generation server-side)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/send-team-invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          inviteeEmail: email,
          inviteeName: email.split('@')[0], // Will be replaced with actual name from profile
          role,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send invitation');
      }
      
      return { email };
    },
    onSuccess: (result) => {
      toast({
        title: 'Invitation sent!',
        description: `An invitation email has been sent to ${result.email}.`,
      });
      setInviteEmail('');
      queryClient.invalidateQueries({ queryKey: ['hackathon-organizers', hackathonId] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to invite',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update organizer role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ organizerId, role }: { organizerId: string; role: string }) => {
      const { error } = await (supabase as any)
        .from('hackathon_organizers')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', organizerId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Role updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['hackathon-organizers', hackathonId] });
    },
    onError: () => {
      toast({ title: 'Failed to update role', variant: 'destructive' });
    },
  });

  // Remove organizer mutation
  const removeMutation = useMutation({
    mutationFn: async (organizerId: string) => {
      const { error } = await (supabase as any)
        .from('hackathon_organizers')
        .update({ status: 'removed', updated_at: new Date().toISOString() })
        .eq('id', organizerId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Organizer removed' });
      queryClient.invalidateQueries({ queryKey: ['hackathon-organizers', hackathonId] });
    },
    onError: () => {
      toast({ title: 'Failed to remove organizer', variant: 'destructive' });
    },
  });

  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      toast({ title: 'Please enter an email address', variant: 'destructive' });
      return;
    }
    inviteMutation.mutate({ email: inviteEmail.trim(), role: inviteRole });
  };

  if (isLoading) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-white/10 rounded w-1/3"></div>
            <div className="h-10 bg-white/10 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="w-5 h-5 text-purple-400" />
          Team Management
        </CardTitle>
        <CardDescription className="text-gray-400">
          Invite co-organizers to help manage this hackathon
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invite Form */}
        {isOwner && (
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-green-400" />
              Invite New Organizer
            </h4>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-black/40 border-white/20 text-white"
                />
              </div>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as any)}>
                <SelectTrigger className="w-40 bg-black/40 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="co-organizer">Co-Organizer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleInvite}
                disabled={inviteMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {inviteMutation.isPending ? 'Inviting...' : 'Invite'}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              The user must have a Maximally account and be an approved organizer to accept the invite.
            </p>
          </div>
        )}

        {/* Organizers List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-400">Current Team</h4>
          {organizers && organizers.length > 0 ? (
            <div className="space-y-2">
              {organizers.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {org.profile?.full_name?.[0] || org.profile?.username?.[0] || '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {org.profile?.full_name || org.profile?.username || 'Unknown'}
                        </span>
                        {org.role === 'owner' && (
                          <Crown className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <span className="text-sm text-gray-400">
                        {org.profile?.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={roleColors[org.role]}>
                      {org.role === 'co-organizer' ? 'Co-Organizer' : org.role.charAt(0).toUpperCase() + org.role.slice(1)}
                    </Badge>
                    {org.status === 'pending' && (
                      <Badge className={statusColors[org.status]}>Pending</Badge>
                    )}
                    {isOwner && org.role !== 'owner' && (
                      <div className="flex items-center gap-2">
                        <Select
                          value={org.role}
                          onValueChange={(v) => updateRoleMutation.mutate({ organizerId: org.id, role: v })}
                        >
                          <SelectTrigger className="w-32 h-8 bg-black/40 border-white/20 text-white text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="co-organizer">Co-Organizer</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMutation.mutate(org.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No co-organizers yet. Invite team members to help manage this hackathon.</p>
          )}
        </div>

        {/* Permissions Legend */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <h4 className="text-sm font-medium text-white mb-3">Role Permissions</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <Badge className={roleColors['co-organizer']}>Co-Organizer</Badge>
              <p className="text-gray-400 mt-1">Full access except judge management</p>
            </div>
            <div>
              <Badge className={roleColors['admin']}>Admin</Badge>
              <p className="text-gray-400 mt-1">Manage registrations & submissions</p>
            </div>
            <div>
              <Badge className={roleColors['viewer']}>Viewer</Badge>
              <p className="text-gray-400 mt-1">View-only access to analytics</p>
            </div>
            <div>
              <Badge className={roleColors['owner']}>Owner</Badge>
              <p className="text-gray-400 mt-1">Full control including team management</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MultiOrganizerManager;
