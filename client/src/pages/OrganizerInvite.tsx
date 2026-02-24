import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, XCircle, Clock, Shield, Eye, UserPlus } from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

interface InviteData {
  role: string;
  hackathon: {
    id: number;
    hackathon_name: string;
    slug: string;
  };
  inviter: {
    full_name: string;
    username: string;
  };
  inviteeEmail: string;
  expiresAt: string;
}

const roleIcons = {
  'co-organizer': Users,
  'admin': Shield,
  'viewer': Eye,
};

const roleColors = {
  'co-organizer': 'bg-orange-500/10 text-orange-400 border-gray-800',
  'admin': 'bg-gray-800 text-blue-400 border-gray-700',
  'viewer': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const roleDescriptions = {
  'co-organizer': 'Full access to manage the hackathon except judge management',
  'admin': 'Manage registrations and submissions',
  'viewer': 'View-only access to analytics and data',
};

export default function OrganizerInvite() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchInvite();
    }
  }, [token]);

  const fetchInvite = async () => {
    try {
      const response = await fetch(`/api/organizer/invite/${token}`);
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Invalid or expired invitation');
        return;
      }
      
      setInvite(data.data);
    } catch (err) {
      setError('Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!user) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/organizer/invite/${token}`);
      return;
    }

    setAccepting(true);
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        navigate(`/login?redirect=/organizer/invite/${token}`);
        return;
      }

      const response = await fetch(`/api/organizer/invite/${token}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to accept invitation');
      }
      
      toast({
        title: 'Welcome to the team! 🎉',
        description: `You're now a ${invite?.role} for ${invite?.hackathon.hackathon_name}`,
      });
      
      // Redirect to the hackathon dashboard
      navigate(`/organizer/hackathons/${invite?.hackathon.id}`);
    } catch (err: any) {
      toast({
        title: 'Failed to accept invitation',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setAccepting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-space font-bold text-orange-400 animate-pulse">LOADING...</div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <SEO title="Invalid Invitation - Maximally" />
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-lg">
            <Card className="bg-red-900/20 border-red-500/30">
              <CardContent className="p-8 text-center">
                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h1 className="font-space font-bold text-xl text-red-400 mb-4">INVALID INVITATION</h1>
                <p className="text-gray-400 mb-6">{error}</p>
                <Button onClick={() => navigate('/organizer/dashboard')} variant="outline">
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!invite) return null;

  const RoleIcon = roleIcons[invite.role as keyof typeof roleIcons] || UserPlus;
  const roleDisplay = invite.role === 'co-organizer' ? 'Co-Organizer' : invite.role.charAt(0).toUpperCase() + invite.role.slice(1);
  const inviterName = invite.inviter?.full_name || invite.inviter?.username || 'Someone';

  return (
    <>
      <SEO 
        title={`Join ${invite.hackathon.hackathon_name} - Maximally`}
        description={`You've been invited to join ${invite.hackathon.hackathon_name} as a ${roleDisplay}`}
      />
      
      <div className="min-h-screen bg-black text-white pt-24 pb-12 relative overflow-hidden">
        {/* Background effects */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
        
        <div className="container mx-auto px-4 max-w-lg relative z-10">
          <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-orange-500/50">
            <CardHeader className="text-center pb-2">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-orange-500 flex items-center justify-center">
                <RoleIcon className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="font-space font-bold text-xl text-orange-400">
                YOU'RE INVITED!
              </CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                {inviterName} wants you to join their team
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Hackathon Info */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="font-space font-bold text-sm text-orange-400 mb-3">
                  {invite.hackathon.hackathon_name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Your Role:</span>
                  <Badge className={roleColors[invite.role as keyof typeof roleColors]}>
                    {roleDisplay}
                  </Badge>
                </div>
              </div>
              
              {/* Role Description */}
              <div className="p-4 bg-orange-500/10 rounded-lg border border-gray-800">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-orange-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Role Permissions</p>
                    <p className="text-xs text-gray-400">
                      {roleDescriptions[invite.role as keyof typeof roleDescriptions]}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Expiry Warning */}
              {invite.expiresAt && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    Expires: {new Date(invite.expiresAt).toLocaleDateString('en-US', { 
                      dateStyle: 'medium' 
                    })}
                  </span>
                </div>
              )}
              
              {/* Login Notice */}
              {!user && (
                <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <p className="text-xs text-yellow-400">
                    ⚠️ You need to log in with <strong>{invite.inviteeEmail}</strong> to accept this invitation.
                  </p>
                </div>
              )}
              
              {/* Wrong Account Notice */}
              {user && user.email !== invite.inviteeEmail && (
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                  <p className="text-xs text-red-400">
                    ⚠️ This invitation was sent to <strong>{invite.inviteeEmail}</strong>. 
                    You're logged in as <strong>{user.email}</strong>. 
                    Please log in with the correct account.
                  </p>
                </div>
              )}

              {/* Not an organizer notice */}
              {user && user.email === invite.inviteeEmail && profile?.role !== 'organizer' && profile?.role !== 'admin' && (
                <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                  <p className="text-xs text-orange-400">
                    ⚠️ You must be an approved organizer to accept this invitation. 
                    <a href="/organizer/apply" className="underline ml-1">Apply to become an organizer</a>
                  </p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate('/organizer/dashboard')}
                  variant="outline"
                  className="flex-1"
                >
                  Decline
                </Button>
                <Button
                  onClick={handleAccept}
                  disabled={accepting || (user && user.email !== invite.inviteeEmail) || (user && profile?.role !== 'organizer' && profile?.role !== 'admin')}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-500"
                >
                  {accepting ? (
                    'Accepting...'
                  ) : !user ? (
                    'Login & Accept'
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept Invitation
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
