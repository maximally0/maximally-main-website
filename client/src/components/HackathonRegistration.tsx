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
          title: data.status === 'waitlist' ? "📋 Added to Waitlist!" : "🎮 Registration Successful!",
          description: data.status === 'waitlist' 
            ? "You've been added to the waitlist. We'll notify you if a spot opens up."
            : "You're registered! A confirmation email has been sent to your inbox.",
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
            className="bg-gradient-to-br from-gray-900/95 to-gray-900/80 border-2 border-purple-500/50 w-full max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-purple-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 border border-purple-500/40">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <h2 className="font-press-start text-xl text-white">TEAM</h2>
              </div>
              <button onClick={() => setShowTeamManagementModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <X className="h-5 w-5" />
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
                    className="bg-gradient-to-r from-red-600/40 to-rose-500/30 border border-red-500/50 hover:border-red-400 text-red-200 hover:text-white px-6 py-3 font-press-start text-xs transition-all duration-300"
                  >
                    DISBAND_TEAM
                  </button>
                ) : (
                  <button
                    onClick={handleLeaveTeam}
                    className="bg-gradient-to-r from-red-600/40 to-rose-500/30 border border-red-500/50 hover:border-red-400 text-red-200 hover:text-white px-6 py-3 font-press-start text-xs transition-all duration-300"
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
          {/* Show hackathon ended message if winners announced */}
          {winnersAnnounced ? (
            <div 
              className="bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-500/50 p-6 cursor-pointer hover:border-yellow-400 transition-all duration-300"
              onClick={onViewWinners}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <h3 className="font-press-start text-sm text-yellow-400">HACKATHON_ENDED</h3>
                    <p className="font-jetbrains text-gray-300 text-sm">
                      {winnersAnnouncedAt 
                        ? `Winners announced on ${new Date(winnersAnnouncedAt).toLocaleDateString()}`
                        : 'Click to see the winning projects'}
                    </p>
                  </div>
                </div>
                <span className="font-press-start text-xs text-yellow-400 hidden sm:block">VIEW_WINNERS →</span>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-emerald-500/40 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 border border-green-500/40">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-press-start text-sm text-green-400">REGISTERED</h3>
                  <p className="font-jetbrains text-gray-300 text-sm">Registration #{registration.registration_number}</p>
                </div>
              </div>

              {/* Team Display */}
              {hasTeam && (
                <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30 p-4 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h4 className="font-press-start text-xs text-amber-400">TEAM</h4>
                      <p className="font-jetbrains text-white">{registration.team.team_name}</p>
                      <p className="font-jetbrains text-gray-400 text-sm">Code: {registration.team.team_code}</p>
                    </div>
                    {/* Manage team only visible when hackathon is still active (not in building phase or closed) */}
                    {isTeamRegistration && !isBuildingPhaseActive && !isRegistrationForceClosed && (
                      <button
                        onClick={() => setShowTeamManagementModal(true)}
                        className="bg-gradient-to-r from-amber-600/40 to-yellow-500/30 border border-amber-500/50 hover:border-amber-400 text-amber-200 hover:text-white px-4 py-2 font-press-start text-xs transition-all duration-300"
                      >
                        MANAGE_TEAM
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Create/join team only for team registrations and when hackathon is active */}
              {!hasTeam && teamsAllowed && isTeamRegistration && !isBuildingPhaseActive && !isRegistrationForceClosed && (
                <button
                  onClick={() => setShowTeamModal(true)}
                  className="w-full mt-4 bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white px-6 py-3 font-press-start text-sm transition-all duration-300"
                >
                  <Users className="h-4 w-4 inline mr-2" />
                  CREATE_OR_JOIN_TEAM
                </button>
              )}

              {/* Unregister button - hidden when building phase is active */}
              {!isBuildingPhaseActive && !isRegistrationForceClosed && (
                <button
                  onClick={() => setShowUnregisterConfirm(true)}
                  className="w-full mt-2 bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-red-600/20 hover:border-red-500/50 hover:text-red-300 px-6 py-3 font-press-start text-sm transition-all duration-300"
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
          )}
        </div>
      ) : (
        <>
          {isRegistrationNotOpen ? (
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-700/50 border border-gray-600">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
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
              className="bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-500/50 p-6 cursor-pointer hover:border-yellow-400 transition-all duration-300"
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
            <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/40 p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 border border-red-500/40">
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-press-start text-sm text-red-400">
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
                className="w-full bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white px-6 py-3 font-press-start text-sm transition-all duration-300"
              >
                <UserPlus className="h-4 w-4 inline mr-2" />
                JOIN_A_HACKATHON
              </button>

              {/* Registration Modal */}
              {showRegisterModal &&
                createPortal(
                  <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-gradient-to-br from-gray-900/95 to-gray-900/80 border-2 border-purple-500/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[10000] backdrop-blur-sm">
                      <div className="p-6 border-b border-purple-500/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 border border-purple-500/40">
                              <UserPlus className="h-5 w-5 text-purple-400" />
                            </div>
                            <h2 className="font-press-start text-xl text-white">REGISTER</h2>
                          </div>
                          <button onClick={() => setShowRegisterModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-6 space-y-6">
                        {/* Registration Type */}
                        {teamsAllowed && (
                          <div>
                            <label className="font-press-start text-[10px] text-purple-300 mb-3 block flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-purple-400"></span>
                              REGISTRATION_TYPE
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                              <button
                                onClick={() => setRegistrationType('individual')}
                                className={`py-4 font-press-start text-sm transition-all duration-300 ${
                                  registrationType === 'individual' 
                                    ? 'bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 text-purple-200' 
                                    : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-gray-600'
                                }`}
                              >
                                SOLO
                              </button>
                              <button
                                onClick={() => setRegistrationType('team')}
                                className={`py-4 font-press-start text-sm transition-all duration-300 ${
                                  registrationType === 'team' 
                                    ? 'bg-gradient-to-r from-cyan-600/40 to-blue-500/30 border border-cyan-500/50 text-cyan-200' 
                                    : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-gray-600'
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
                            className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none placeholder:text-gray-600"
                            placeholder="+91 1234567890"
                          />
                        </div>

                        <div>
                          <label className="font-jetbrains text-sm text-gray-300 mb-2 block">College/University</label>
                          <input
                            type="text"
                            value={formData.college_university}
                            onChange={(e) => setFormData({ ...formData, college_university: e.target.value })}
                            className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none placeholder:text-gray-600"
                          />
                        </div>

                        <div>
                          <label className="font-jetbrains text-sm text-gray-300 mb-2 block">GitHub URL (Optional)</label>
                          <input
                            type="url"
                            value={formData.github_url}
                            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                            className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none placeholder:text-gray-600"
                            placeholder="https://github.com/username"
                          />
                        </div>

                        <div>
                          <label className="font-jetbrains text-sm text-gray-300 mb-2 block">LinkedIn URL (Optional)</label>
                          <input
                            type="url"
                            value={formData.linkedin_url}
                            onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                            className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none placeholder:text-gray-600"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>

                        <div>
                          <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Experience Level</label>
                          <select
                            value={formData.experience_level}
                            onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                            className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>

                        <button
                          onClick={handleRegister}
                          className="w-full bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white px-6 py-3 font-press-start text-sm transition-all duration-300"
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
