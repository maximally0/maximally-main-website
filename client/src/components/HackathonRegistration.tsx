import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Users, UserPlus, Check, X, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useModeration } from '@/hooks/useModeration';
import { getAuthHeaders } from '@/lib/auth';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import TeamModal from '@/components/TeamModal';
import TeamManagement from '@/components/TeamManagement';

interface RegistrationProps {
  hackathonId: number;
  hackathonName: string;
  teamSizeMin: number;
  teamSizeMax: number;
  registrationOpensAt?: string;
  registrationClosesAt?: string;
  registrationControl?: 'auto' | 'open' | 'closed';
  buildingControl?: 'auto' | 'open' | 'closed';
  winnersAnnounced?: boolean;
  winnersAnnouncedAt?: string;
  onRegistrationChange?: () => void;
  onViewWinners?: () => void;
}

export default function HackathonRegistration({
  hackathonId,
  hackathonName,
  teamSizeMin,
  teamSizeMax,
  registrationOpensAt,
  registrationClosesAt,
  registrationControl = 'auto',
  buildingControl = 'auto',
  winnersAnnounced = false,
  winnersAnnouncedAt,
  onRegistrationChange,
  onViewWinners
}: RegistrationProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { canParticipate } = useModeration();
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false); // create/join team
  const [showTeamManagementModal, setShowTeamManagementModal] = useState(false); // view/manage existing team
  const [showUnregisterConfirm, setShowUnregisterConfirm] = useState(false);

  const [registrationType, setRegistrationType] = useState<'individual' | 'team'>('individual');

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

      if (data.success) {
        setRegistration(data.data || null);
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

    // Check moderation status
    if (!canParticipate()) {
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...formData,
          registration_type: registrationType
        })
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

  const handleUnregister = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/register`, {
        method: 'DELETE',
        headers,
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to unregister');
      }

      toast({ title: 'Unregistered', description: 'You have been unregistered from this hackathon.' });
      setRegistration(null);
      onRegistrationChange?.();
    } catch (error: any) {
      toast({ title: 'Unregister failed', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const handleLeaveTeam = async () => {
    const teamId = registration?.team?.id;
    if (!teamId) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/teams/${teamId}/leave`, {
        method: 'POST',
        headers,
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to leave team');
      }

      toast({ title: 'Left team' });
      setShowTeamManagementModal(false);
      await checkRegistration();
      onRegistrationChange?.();
    } catch (error: any) {
      toast({ title: 'Leave failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleDisbandTeam = async () => {
    const teamId = registration?.team?.id;
    if (!teamId) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/teams/${teamId}/disband`, {
        method: 'POST',
        headers,
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to disband team');
      }

      toast({ title: 'Team disbanded' });
      setShowTeamManagementModal(false);
      await checkRegistration();
      onRegistrationChange?.();
    } catch (error: any) {
      toast({ title: 'Disband failed', description: error.message, variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-14 bg-gray-800 rounded"></div>
      </div>
    );
  }

  const now = new Date();
  const opensAt = registrationOpensAt ? new Date(registrationOpensAt) : null;
  const closesAt = registrationClosesAt ? new Date(registrationClosesAt) : null;
  const teamsAllowed = teamSizeMax > 1 || teamSizeMin > 1;

  // Determine if registration is open based on period control
  const isRegistrationForceClosed = registrationControl === 'closed';
  const isRegistrationForceOpen = registrationControl === 'open';
  const isBuildingPhaseActive = buildingControl === 'open';
  
  // Registration is closed if: force closed, OR building phase is active, OR (auto mode and past deadline)
  const isRegistrationClosed = isRegistrationForceClosed || isBuildingPhaseActive || 
    (registrationControl === 'auto' && closesAt && now > closesAt);
  
  // Registration hasn't opened if: auto mode and before open date (and not force open)
  const isRegistrationNotOpen = !isRegistrationForceOpen && 
    registrationControl === 'auto' && opensAt && now < opensAt;

  const hasTeam = !!registration?.team;
  const isTeamRegistration = registration?.registration_type === 'team';
  const isLeader = hasTeam && registration.team.team_leader_id === user?.id;

  const teamModalPortal = typeof document !== 'undefined'
    ? createPortal(
        <TeamModal
          isOpen={showTeamModal}
          onClose={() => setShowTeamModal(false)}
          hackathonId={hackathonId}
          onTeamChange={async () => {
            await checkRegistration();
            onRegistrationChange?.();
          }}
        />,
        document.body
      )
    : null;

  const teamManagementPortal =
    typeof document !== 'undefined' && showTeamManagementModal && hasTeam && isTeamRegistration
      ? createPortal(
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[99999]"
          onClick={() => setShowTeamManagementModal(false)}
        >
          <div
            className="pixel-card bg-black border-4 border-maximally-red w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b-2 border-maximally-red flex items-center justify-between">
              <h2 className="font-press-start text-xl text-maximally-red">TEAM</h2>
              <button onClick={() => setShowTeamManagementModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <TeamManagement
                teamId={registration.team.id}
                hackathonId={hackathonId}
                isLeader={isLeader}
                onUpdate={async () => {
                  await checkRegistration();
                  onRegistrationChange?.();
                }}
              />

              <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row gap-3 sm:justify-end">
                {isLeader ? (
                  <button
                    onClick={handleDisbandTeam}
                    className="pixel-button bg-red-600 text-white px-6 py-3 font-press-start text-xs hover:bg-red-700"
                  >
                    DISBAND_TEAM
                  </button>
                ) : (
                  <button
                    onClick={handleLeaveTeam}
                    className="pixel-button bg-red-600 text-white px-6 py-3 font-press-start text-xs hover:bg-red-700"
                  >
                    LEAVE_TEAM
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {registration ? (
        <div className="space-y-4">
          <div className="pixel-card bg-green-900/20 border-2 border-green-500 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Check className="h-6 w-6 text-green-500" />
              <div>
                <h3 className="font-press-start text-sm text-green-500">REGISTERED</h3>
                <p className="font-jetbrains text-gray-300 text-sm">Registration #{registration.registration_number}</p>
              </div>
            </div>

            {/* Team Display */}
            {hasTeam && (
              <div className="bg-gray-900/50 border border-gray-700 p-4 rounded mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h4 className="font-press-start text-xs text-maximally-yellow">TEAM</h4>
                    <p className="font-jetbrains text-white">{registration.team.team_name}</p>
                    <p className="font-jetbrains text-gray-400 text-sm">Code: {registration.team.team_code}</p>
                  </div>
                  {/* Manage team should only be visible for team registrations */}
                  {isTeamRegistration && (
                    <button
                      onClick={() => setShowTeamManagementModal(true)}
                      className="pixel-button bg-maximally-yellow text-black px-4 py-2 font-press-start text-xs hover:bg-maximally-red hover:text-white transition-colors"
                    >
                      MANAGE_TEAM
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Create/join team only for team registrations */}
            {!hasTeam && teamsAllowed && isTeamRegistration && (
              <button
                onClick={() => setShowTeamModal(true)}
                className="pixel-button bg-maximally-yellow text-black px-6 py-3 font-press-start text-sm hover:bg-maximally-red hover:text-white transition-colors w-full mt-4"
              >
                <Users className="h-4 w-4 inline mr-2" />
                CREATE_OR_JOIN_TEAM
              </button>
            )}

            {/* Unregister button - hidden when building phase is active */}
            {!isBuildingPhaseActive && !isRegistrationForceClosed && (
              <button
                onClick={() => setShowUnregisterConfirm(true)}
                className="pixel-button bg-gray-700 text-white px-6 py-3 font-press-start text-sm hover:bg-red-600 transition-colors w-full mt-2"
              >
                <X className="h-4 w-4 inline mr-2" />
                UNREGISTER
              </button>
            )}

            <ConfirmDialog
              open={showUnregisterConfirm}
              onOpenChange={setShowUnregisterConfirm}
              title="UNREGISTER FROM HACKATHON"
              description={`Are you sure you want to unregister from ${hackathonName}? This action cannot be undone.`}
              confirmText="UNREGISTER"
              cancelText="CANCEL"
              variant="destructive"
              onConfirm={async () => {
                await handleUnregister();
              }}
            />
          </div>
        </div>
      ) : (
        <>
          {isRegistrationNotOpen ? (
            <div className="pixel-card bg-gray-900/50 border-2 border-gray-700 p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-gray-400" />
                <div>
                  <h3 className="font-press-start text-sm text-gray-400">REGISTRATION OPENS</h3>
                  <p className="font-jetbrains text-gray-300 text-sm">
                    {opensAt?.toLocaleDateString()} at {opensAt?.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ) : winnersAnnounced ? (
            <div 
              className="pixel-card bg-yellow-500/20 border-2 border-yellow-500 p-6 cursor-pointer hover:bg-yellow-500/30 transition-colors"
              onClick={onViewWinners}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <h3 className="font-press-start text-sm text-yellow-400">WINNERS_ANNOUNCED!</h3>
                    <p className="font-jetbrains text-gray-300 text-sm">
                      {winnersAnnouncedAt 
                        ? `Announced on ${new Date(winnersAnnouncedAt).toLocaleDateString()}`
                        : 'Click to see the winning projects'}
                    </p>
                  </div>
                </div>
                <span className="font-press-start text-xs text-yellow-400 hidden sm:block">VIEW_WINNERS →</span>
              </div>
            </div>
          ) : isRegistrationClosed ? (
            <div className="pixel-card bg-red-900/20 border-2 border-red-500 p-6">
              <div className="flex items-center gap-3">
                <X className="h-6 w-6 text-red-500" />
                <div>
                  <h3 className="font-press-start text-sm text-red-500">
                    {isBuildingPhaseActive ? 'BUILDING PHASE ACTIVE' : 'REGISTRATION CLOSED'}
                  </h3>
                  <p className="font-jetbrains text-gray-300 text-sm">
                    {isBuildingPhaseActive 
                      ? 'Registrations are closed during the building phase'
                      : closesAt 
                        ? `Registration closed on ${closesAt.toLocaleDateString()}`
                        : 'Registration is currently closed'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors w-full"
              >
                <UserPlus className="h-4 w-4 inline mr-2" />
                JOIN_A_HACKATHON
              </button>

              {/* Registration Modal */}
              {showRegisterModal &&
                createPortal(
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
                        {teamsAllowed && (
                          <div>
                            <label className="font-press-start text-sm text-maximally-yellow mb-3 block">REGISTRATION_TYPE</label>
                            <div className="grid grid-cols-2 gap-4">
                              <button
                                onClick={() => setRegistrationType('individual')}
                                className={`pixel-button py-4 font-press-start text-sm ${
                                  registrationType === 'individual' ? 'bg-maximally-red text-white' : 'bg-gray-800 text-gray-400'
                                }`}
                              >
                                SOLO
                              </button>
                              <button
                                onClick={() => setRegistrationType('team')}
                                className={`pixel-button py-4 font-press-start text-sm ${
                                  registrationType === 'team' ? 'bg-maximally-red text-white' : 'bg-gray-800 text-gray-400'
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

                        <div>
                          <label className="font-jetbrains text-sm text-gray-300 mb-2 block">GitHub URL (Optional)</label>
                          <input
                            type="url"
                            value={formData.github_url}
                            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                            className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                            placeholder="https://github.com/username"
                          />
                        </div>

                        <div>
                          <label className="font-jetbrains text-sm text-gray-300 mb-2 block">LinkedIn URL (Optional)</label>
                          <input
                            type="url"
                            value={formData.linkedin_url}
                            onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                            className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                            placeholder="https://linkedin.com/in/username"
                          />
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
                          className="pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors w-full"
                        >
                          REGISTER
                        </button>
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
            </>
          )}
        </>
      )}

      {teamModalPortal}
      {teamManagementPortal}
    </>
  );
}
