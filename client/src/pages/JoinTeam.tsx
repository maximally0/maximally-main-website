import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, Calendar, ArrowRight, Loader2, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

interface InvitationData {
  id: number;
  status: string;
  expires_at: string;
  invited_email: string;
  team: {
    id: number;
    team_name: string;
    hackathon: {
      id: number;
      hackathon_name: string;
      slug: string;
      hackathon_logo?: string;
      start_date: string;
      end_date: string;
    };
  };
}

export default function JoinTeam() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [requiresRegistration, setRequiresRegistration] = useState(false);
  const [hackathonSlug, setHackathonSlug] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchInvitation();
    }
  }, [token]);

  const fetchInvitation = async () => {
    try {
      const response = await fetch(`/api/teams/invite/${token}`);
      const data = await response.json();

      if (data.success) {
        setInvitation(data.data);
      } else {
        setError(data.message || 'Invalid invitation');
      }
    } catch (err) {
      setError('Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!user) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/team/join/${token}`);
      return;
    }

    setJoining(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/teams/join/${token}`, {
        method: 'POST',
        headers,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        toast({
          title: "You're in! 🎉",
          description: `You've joined team ${data.data.teamName}`,
        });

        // Redirect to hackathon page after 2 seconds
        setTimeout(() => {
          navigate(`/hackathon/${data.data.hackathonSlug}`);
        }, 2000);
      } else if (data.requiresRegistration) {
        // User needs to register first
        setRequiresRegistration(true);
        setHackathonSlug(data.hackathonSlug || invitation?.team.hackathon.slug || null);
      } else {
        toast({
          title: "Couldn't join team",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to join team',
        variant: "destructive",
      });
    } finally {
      setJoining(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEO
        title={invitation ? `Join ${invitation.team.team_name}` : 'Team Invitation'}
        description="You've been invited to join a hackathon team"
      />

      <div className="min-h-screen bg-black text-white pt-24 pb-12 relative overflow-hidden">
        <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />

        <div className="container mx-auto px-4 relative z-10 max-w-2xl">
          {error ? (
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-500/50 p-8 text-center">
              <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
              <h1 className="font-press-start text-xl text-red-400 mb-4">INVITATION_ERROR</h1>
              <p className="font-jetbrains text-gray-400 mb-6">{error}</p>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 font-press-start text-sm transition-colors"
              >
                BROWSE_HACKATHONS
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : requiresRegistration ? (
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-amber-500/50 p-8 text-center">
              <UserPlus className="h-16 w-16 text-amber-400 mx-auto mb-6" />
              <h1 className="font-press-start text-xl text-amber-400 mb-4">REGISTRATION_REQUIRED</h1>
              <p className="font-jetbrains text-gray-400 mb-2">
                You need to register for <span className="text-purple-400">{invitation?.team.hackathon.hackathon_name}</span> before joining this team.
              </p>
              <p className="font-jetbrains text-gray-500 text-sm mb-6">
                Register first, then come back to this link to join the team.
              </p>
              <Link
                to={hackathonSlug ? `/hackathon/${hackathonSlug}` : '/events'}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white px-6 py-4 font-press-start text-sm transition-all"
              >
                REGISTER_NOW
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : success ? (
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-green-500/50 p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
              <h1 className="font-press-start text-xl text-green-400 mb-4">YOU'RE_IN!</h1>
              <p className="font-jetbrains text-gray-400 mb-2">
                You've successfully joined team <span className="text-purple-400">{invitation?.team.team_name}</span>
              </p>
              <p className="font-jetbrains text-gray-500 text-sm">
                Redirecting to hackathon page...
              </p>
            </div>
          ) : invitation ? (
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/50 overflow-hidden">
              {/* Header with hackathon image */}
              {invitation.team.hackathon.hackathon_logo && (
                <div className="h-48 relative">
                  <img
                    src={invitation.team.hackathon.hackathon_logo}
                    alt={invitation.team.hackathon.hackathon_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h1 className="font-press-start text-xl text-purple-400 mb-2">TEAM_INVITATION</h1>
                  <p className="font-jetbrains text-gray-400">
                    You've been invited to join a hackathon team!
                  </p>
                </div>

                <div className="bg-black/50 border border-purple-500/30 p-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-jetbrains text-gray-400">Team</span>
                      <span className="font-press-start text-sm text-purple-400">{invitation.team.team_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-jetbrains text-gray-400">Hackathon</span>
                      <span className="font-jetbrains text-white">{invitation.team.hackathon.hackathon_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-jetbrains text-gray-400">Dates</span>
                      <span className="font-jetbrains text-gray-300 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(invitation.team.hackathon.start_date).toLocaleDateString()} - {new Date(invitation.team.hackathon.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {!user ? (
                  <div className="space-y-4">
                    <p className="font-jetbrains text-center text-gray-400 text-sm">
                      Please log in or create an account to join this team
                    </p>
                    <button
                      onClick={handleJoinTeam}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-4 font-press-start text-sm transition-all flex items-center justify-center gap-2"
                    >
                      LOGIN_TO_JOIN
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleJoinTeam}
                    disabled={joining}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-4 font-press-start text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {joining ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        JOINING...
                      </>
                    ) : (
                      <>
                        JOIN_TEAM
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}

                <p className="font-jetbrains text-center text-gray-500 text-xs mt-4">
                  This invitation expires on {new Date(invitation.expires_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Footer />
    </>
  );
}
