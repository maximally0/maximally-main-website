import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, Check, X, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'wouter';

interface OrganizerInvitation {
  id: string;
  hackathon_id: number;
  role: string;
  status: string;
  invited_at: string;
  invited_by: string | null;
  hackathon: {
    id: number;
    hackathon_name: string;
    slug: string;
    start_date: string;
    format: string;
  } | null;
  inviter: {
    id: string;
    full_name: string;
    email: string;
  } | null;
}

export function OrganizerInvitations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: invitations, isLoading, error } = useQuery({
    queryKey: ['organizer-invitations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // First get the invitations
      const { data: invites, error: inviteError } = await (supabase as any)
        .from('hackathon_organizers')
        .select('id, hackathon_id, role, status, invited_at, invited_by')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('invited_at', { ascending: false });

      if (inviteError) {
        console.error('Error fetching invitations:', inviteError);
        throw inviteError;
      }

      if (!invites || invites.length === 0) return [];

      // Fetch hackathon details separately
      const hackathonIds = (invites as any[]).map((i: any) => i.hackathon_id);
      const { data: hackathons } = await supabase
        .from('organizer_hackathons')
        .select('id, hackathon_name, slug, start_date, format')
        .in('id', hackathonIds);

      // Fetch inviter profiles separately
      const inviterIds = (invites as any[]).map((i: any) => i.invited_by).filter(Boolean);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', inviterIds);

      // Combine the data
      return (invites as any[]).map((invite: any) => ({
        ...invite,
        hackathon: hackathons?.find((h: any) => h.id === invite.hackathon_id) || null,
        inviter: profiles?.find((p: any) => p.id === invite.invited_by) || null,
      })) as OrganizerInvitation[];
    },
    enabled: !!user?.id,
  });

  const respondMutation = useMutation({
    mutationFn: async ({ invitationId, accept }: { invitationId: string; accept: boolean }) => {
      const { error } = await (supabase as any)
        .from('hackathon_organizers')
        .update({
          status: accept ? 'accepted' : 'declined',
          accepted_at: accept ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', invitationId);

      if (error) throw error;
    },
    onSuccess: (_, { accept }) => {
      toast({
        title: accept ? 'Invitation accepted!' : 'Invitation declined',
        description: accept 
          ? 'You can now help manage this hackathon.' 
          : 'The invitation has been declined.',
      });
      queryClient.invalidateQueries({ queryKey: ['organizer-invitations'] });
    },
    onError: () => {
      toast({
        title: 'Failed to respond',
        description: 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-white/10 rounded w-1/3"></div>
            <div className="h-20 bg-white/10 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!invitations || invitations.length === 0) {
    return null; // Don't show anything if no pending invitations
  }

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Mail className="w-5 h-5 text-purple-400" />
          Organizer Invitations
        </CardTitle>
        <CardDescription className="text-gray-400">
          You've been invited to help organize these hackathons
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="p-4 bg-black/40 rounded-lg border border-white/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Link href={`/hackathon/${invitation.hackathon?.slug}`}>
                  <h4 className="text-white font-medium hover:text-purple-400 cursor-pointer">
                    {invitation.hackathon?.hackathon_name}
                  </h4>
                </Link>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {invitation.hackathon?.start_date && 
                      format(new Date(invitation.hackathon.start_date), 'MMM d, yyyy')}
                  </span>
                  <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                    {invitation.role}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Invited by {invitation.inviter?.full_name || invitation.inviter?.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => respondMutation.mutate({ invitationId: invitation.id, accept: true })}
                  disabled={respondMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => respondMutation.mutate({ invitationId: invitation.id, accept: false })}
                  disabled={respondMutation.isPending}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <X className="w-4 h-4 mr-1" />
                  Decline
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default OrganizerInvitations;
