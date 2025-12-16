import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to check moderation status and show appropriate messages
 */
export function useModeration() {
  const { isBanned, isMuted, isSuspended, moderationStatus } = useAuth();
  const { toast } = useToast();

  /**
   * Check if user can post/comment. Shows toast if muted.
   * Returns true if user can post, false if blocked.
   */
  const canPost = (): boolean => {
    if (isBanned) {
      toast({
        title: 'Account Banned',
        description: 'Your account has been banned. You cannot perform this action.',
        variant: 'destructive',
      });
      return false;
    }

    if (isMuted) {
      const expiresAt = moderationStatus?.mute_expires_at;
      const message = expiresAt 
        ? `Your account is muted until ${new Date(expiresAt).toLocaleDateString()}.`
        : 'Your account is muted.';
      
      toast({
        title: 'Account Muted',
        description: `${message} You cannot post or comment.`,
        variant: 'destructive',
      });
      return false;
    }

    if (isSuspended) {
      const expiresAt = moderationStatus?.suspend_expires_at;
      const message = expiresAt 
        ? `Your account is suspended until ${new Date(expiresAt).toLocaleDateString()}.`
        : 'Your account is suspended.';
      
      toast({
        title: 'Account Suspended',
        description: `${message} You cannot perform this action.`,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  /**
   * Check if user can participate in hackathons
   */
  const canParticipate = (): boolean => {
    if (isBanned || isSuspended) {
      toast({
        title: 'Action Blocked',
        description: 'Your account is restricted. You cannot participate in hackathons.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  /**
   * Check if user can submit projects
   */
  const canSubmit = (): boolean => {
    if (isBanned || isSuspended) {
      toast({
        title: 'Submission Blocked',
        description: 'Your account is restricted. You cannot submit projects.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  /**
   * Check if user can join teams
   */
  const canJoinTeam = (): boolean => {
    if (isBanned || isSuspended) {
      toast({
        title: 'Action Blocked',
        description: 'Your account is restricted. You cannot join teams.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  return {
    isBanned,
    isMuted,
    isSuspended,
    moderationStatus,
    canPost,
    canParticipate,
    canSubmit,
    canJoinTeam,
  };
}
