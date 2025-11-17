import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Users, UserPlus, Check, X, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface RegistrationProps {
  hackathonId: number;
  hackathonName: string;
  teamSizeMin: number;
  teamSizeMax: number;
  registrationOpensAt?: string;
  registrationClosesAt?: string;
  onRegistrationChange?: () => void;
}

export default function HackathonRegistration({
  hackathonId,
  hackathonName,
  teamSizeMin,
  teamSizeMax,
  registrationOpensAt,
  registrationClosesAt,
  onRegistrationChange
}: RegistrationProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showUnregisterConfirm, setShowUnregisterConfirm] = useState(false);
  const [registrationType, setRegistrationType] = useState<'individual' | 'team'>('individual');
  const [teamAction, setTeamAction] = useState<'create' | 'join'>('create');
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [formData, setFormData] = useState({
    phone_number: '',
    college_university: '',
    github_url: '',
    linkedin_url: '',
    experience_level: 'intermediate'
  });

  useEffect(() => {
    if (user) {
      checkRegistration();
    } else {
      // If not logged in, stop loading immediately
      setLoading(false);
    }
  }, [user, hackathonId]);

  const checkRegistration = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/my-registration`, { headers });
      const data = await response.json();

      if (data.success && data.data) {
        setRegistration(data.data);
      }
    } catch (error) {
      console.error('Error checking registration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to register for this hackathon",
        variant: "destructive",
      });
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: data.status === 'waitlist' ? "Added to Waitlist!" : "Registration Successful!",
          description: data.status === 'waitlist' 
            ? "You've been added to the waitlist. We'll notify you if a spot opens up."
            : "You're registered! Check your email for confirmation.",
        });
        setRegistration(data.data);
        setShowRegisterModal(false);
        onRegistrationChange?.();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateTeam = async () => {
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
          title: "Team Created!",
          description: `Team code: ${data.data.team_code}. Share this with your teammates!`,
        });
        checkRegistration();
        setShowTeamModal(false);
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
          title: "Joined Team!",
          description: `You've joined ${data.data.team_name}`,
        });
        checkRegistration();
        setShowTeamModal(false);
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

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-14 bg-gray-800 rounded"></div>
      </div>
    );
  }

  // Already registered
  if (registration) {
    return (
      <div className="space-y-4">
        <div className="pixel-card bg-green-900/20 border-2 border-green-500 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Check className="h-6 w-6 text-green-500" />
            <div>
              <h3 className="font-press-start text-sm text-green-500">REGISTERED</h3>
              <p className="font-jetbrains text-gray-300 text-sm">
                Registration #{registration.registration_number}
              </p>
            </div>
          </div>

          {registration.team && (
            <div className="pixel-card bg-black/50 border border-gray-700 p-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-press-start text-xs text-maximally-yellow mb-1">TEAM</p>
                  <p className="font-jetbrains text-white">{registration.team.team_name}</p>
                  <p className="font-jetbrains text-gray-400 text-sm">Code: {registration.team.team_code}</p>
                </div>
                {registration.team.team_leader_id !== user?.id && (
                  <button
                    onClick={async () => {
                      try {
                        const headers = await getAuthHeaders();
                        await fetch(`/api/teams/${registration.team_id}/leave`, {
                          method: 'POST',
                          headers
                        });
                        checkRegistration();
                        toast({ title: "Left team successfully" });
                      } catch (error) {
                        toast({ title: "Error leaving team", variant: "destructive" });
                      }
                    }}
                    className="pixel-button bg-red-600 text-white px-4 py-2 font-press-start text-xs hover:bg-red-700"
                  >
                    LEAVE
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Show Manage Team only for team registrations */}
          {!registration.team && registration.registration_type === 'team' && teamSizeMax > 1 && (
            <button
              onClick={() => setShowTeamModal(true)}
              className="pixel-button bg-maximally-yellow text-black px-6 py-3 font-press-start text-sm hover:bg-maximally-red hover:text-white transition-colors w-full mt-4"
            >
              <Users className="h-4 w-4 inline mr-2" />
              MANAGE_TEAM
            </button>
          )}

          {/* Unregister button */}
          <button
            onClick={() => setShowUnregisterConfirm(true)}
            className="pixel-button bg-gray-700 text-white px-6 py-3 font-press-start text-sm hover:bg-red-600 transition-colors w-full mt-2"
          >
            <X className="h-4 w-4 inline mr-2" />
            UNREGISTER
          </button>

          {/* Unregister Confirmation Dialog */}
          <ConfirmDialog
            open={showUnregisterConfirm}
            onOpenChange={setShowUnregisterConfirm}
            title="UNREGISTER FROM HACKATHON"
            description={`Are you sure you want to unregister from ${hackathonName}? This action cannot be undone.`}
            confirmText="UNREGISTER"
            cancelText="CANCEL"
            variant="destructive"
            onConfirm={async () => {
              try {
                const headers = await getAuthHeaders();
                const response = await fetch(`/api/hackathons/${hackathonId}/register`, {
                  method: 'DELETE',
                  headers
                });
                const data = await response.json();
                if (data.success) {
                  toast({ title: "✅ Unregistered successfully" });
                  checkRegistration();
                  if (onRegistrationChange) onRegistrationChange();
                } else {
                  throw new Error(data.message);
                }
              } catch (error: any) {
                toast({ title: "❌ Error unregistering", description: error.message, variant: "destructive" });
              }
            }}
          />
        </div>
      </div>
    );
  }

  // Check if registrations are closed or not open (using IST timezone)
  const now = new Date();
  const registrationsClosed = registrationClosesAt && new Date(registrationClosesAt) < now;
  const registrationsNotOpen = registrationOpensAt && new Date(registrationOpensAt) > now;

  // Registrations closed
  if (registrationsClosed) {
    const closedAt = new Date(registrationClosesAt);
    const formattedDate = closedAt.toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
    const formattedTime = closedAt.toLocaleTimeString('en-IN', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
    
    return (
      <div className="pixel-card bg-gray-900 border-2 border-gray-700 p-6 text-center">
        <X className="h-8 w-8 text-gray-500 mx-auto mb-3" />
        <h3 className="font-press-start text-sm text-gray-400 mb-2">REGISTRATIONS_CLOSED</h3>
        <p className="font-jetbrains text-gray-500 text-sm">
          Closed on {formattedDate} at {formattedTime} IST
        </p>
      </div>
    );
  }

  // Registrations not open yet
  if (registrationsNotOpen) {
    const opensAt = new Date(registrationOpensAt);
    const formattedDate = opensAt.toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
    const formattedTime = opensAt.toLocaleTimeString('en-IN', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
    
    return (
      <div className="pixel-card bg-yellow-900/20 border-2 border-yellow-500 p-6 text-center">
        <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-3 animate-pulse" />
        <h3 className="font-press-start text-sm text-yellow-400 mb-2">REGISTRATIONS_NOT_OPEN</h3>
        <p className="font-jetbrains text-gray-300 text-sm mb-1">
          Opens on <span className="text-yellow-400 font-bold">{formattedDate}</span>
        </p>
        <p className="font-jetbrains text-gray-400 text-xs">
          at {formattedTime} IST
        </p>
      </div>
    );
  }

  // Calculate time remaining if registration closes soon
  let timeRemainingMessage = '';
  if (registrationClosesAt) {
    const closesAt = new Date(registrationClosesAt);
    const hoursRemaining = Math.floor((closesAt.getTime() - now.getTime()) / (1000 * 60 * 60));
    const daysRemaining = Math.floor(hoursRemaining / 24);
    
    if (hoursRemaining < 24 && hoursRemaining > 0) {
      timeRemainingMessage = `⏰ Closes in ${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''}`;
    } else if (daysRemaining <= 3 && daysRemaining > 0) {
      timeRemainingMessage = `⏰ Closes in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`;
    }
  }

  // Not registered
  return (
    <>
      <div className="space-y-2">
        <button
          onClick={() => {
            if (!user) {
              // Redirect to login with return URL
              window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
            } else {
              setShowRegisterModal(true);
            }
          }}
          className="pixel-button bg-maximally-red hover:bg-maximally-yellow text-white hover:text-black px-8 py-4 font-press-start text-sm transition-all flex items-center gap-2 border-2 border-maximally-red hover:border-maximally-yellow w-full justify-center hover:scale-105"
        >
          <UserPlus className="h-5 w-5" />
          {user ? 'REGISTER_NOW' : 'LOGIN_TO_REGISTER'}
        </button>
        {timeRemainingMessage && (
          <p className="text-center font-jetbrains text-xs text-yellow-400 animate-pulse">
            {timeRemainingMessage}
          </p>
        )}
      </div>

      {/* Registration Modal */}
      {showRegisterModal && createPortal(
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
          <div className="pixel-card bg-black border-4 border-maximally-red max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[10000]">
            <div className="p-6 border-b-2 border-maximally-red">
              <div className="flex items-center justify-between">
                <h2 className="font-press-start text-xl text-maximally-red">REGISTER</h2>
                <button onClick={() => setShowRegisterModal(false)} className="text-gray-400 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Registration Type */}
              {teamSizeMax > 1 && (
                <div>
                  <label className="font-press-start text-sm text-maximally-yellow mb-3 block">
                    REGISTRATION_TYPE
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setRegistrationType('individual')}
                      className={`pixel-button py-4 font-press-start text-sm ${
                        registrationType === 'individual'
                          ? 'bg-maximally-red text-white'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      SOLO
                    </button>
                    <button
                      onClick={() => setRegistrationType('team')}
                      className={`pixel-button py-4 font-press-start text-sm ${
                        registrationType === 'team'
                          ? 'bg-maximally-red text-white'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      TEAM
                    </button>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  placeholder="+91 1234567890"
                />
              </div>

              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">College/University</label>
                <input
                  type="text"
                  value={formData.college_university}
                  onChange={(e) => setFormData({ ...formData, college_university: e.target.value })}
                  className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">GitHub</label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Experience Level</label>
                <select
                  value={formData.experience_level}
                  onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                  className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <button
                onClick={handleRegister}
                className="pixel-button bg-maximally-red text-white px-8 py-4 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors w-full"
              >
                CONFIRM_REGISTRATION
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Team Modal */}
      {showTeamModal && createPortal(
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
          <div className="pixel-card bg-black border-4 border-maximally-red max-w-md w-full relative z-[10000]">
            <div className="p-6 border-b-2 border-maximally-red">
              <div className="flex items-center justify-between">
                <h2 className="font-press-start text-xl text-maximally-red">TEAM</h2>
                <button onClick={() => setShowTeamModal(false)} className="text-gray-400 hover:text-white">
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
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                  <button
                    onClick={handleJoinTeam}
                    disabled={teamCode.length !== 6}
                    className="pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors w-full mt-4 disabled:opacity-50"
                  >
                    JOIN_TEAM
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
