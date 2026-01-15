import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Users, UserPlus, Check, X, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useModeration } from '@/hooks/useModeration';
import { getAuthHeaders } from '@/lib/auth';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import TeamModal from '@/components/TeamModal';
import TeamManagement from '@/components/TeamManagement';
import { canRegister as checkCanRegister } from '../../../shared/hackathonState';

interface RegistrationProps {
  hackathonId: number;
  hackathonName: string;
  hackathonSlug?: string;
  teamSizeMin: number;
  teamSizeMax: number;
  /** @deprecated Registration is now date-based only - use end_date */
  registrationOpensAt?: string;
  /** @deprecated Registration is now date-based only - use end_date */
  registrationClosesAt?: string;
  /** @deprecated Manual controls removed - registration is automatic */
  registrationControl?: 'auto' | 'open' | 'closed';
  /** @deprecated Manual controls removed - registration is automatic */
  buildingControl?: 'auto' | 'open' | 'closed';
  /** Hackathon status - used for simplified state logic */
  status?: string;
  /** Hackathon status field */
  hackathon_status?: string;
  /** End date of the hackathon - registration closes when this passes */
  end_date: string;
  winnersAnnounced?: boolean;
  winnersAnnouncedAt?: string;
  onRegistrationChange?: () => void;
  onViewWinners?: () => void;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export default function HackathonRegistration({
  hackathonId,
  hackathonName,
  hackathonSlug,
  teamSizeMin,
  teamSizeMax,
  // Deprecated props - kept for backward compatibility but ignored
  registrationOpensAt,
  registrationClosesAt,
  registrationControl = 'auto',
  buildingControl = 'auto',
  // New simplified props
  status = 'published',
  hackathon_status,
  end_date,
  winnersAnnounced = false,
  winnersAnnouncedAt,
  onRegistrationChange,
  onViewWinners,
  primaryColor = '#8B5CF6',
  secondaryColor = '#EC4899',
  accentColor = '#06B6D4'
}: RegistrationProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { canParticipate } = useModeration();
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOrganizer, setIsOrganizer] = useState(false);

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
      // Fetch both in parallel for faster loading
      Promise.all([
        checkRegistration(),
        checkIfOrganizer()
      ]).finally(() => {
        setLoading(false);
      });
    } else {
      // If not logged in, stop loading immediately
      setLoading(false);
    }
  }, [user, hackathonId]);

  const checkIfOrganizer = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/is-organizer`, { headers });
      const data = await response.json();
      setIsOrganizer(data.isOrganizer || false);
    } catch (error) {
      console.error('Error checking organizer status:', error);
      setIsOrganizer(false);
    }
  };

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
  const teamsAllowed = teamSizeMax > 1 || teamSizeMin > 1;

  // All dates are stored and compared in UTC
  const parseAsUTC = (dateStr: string) => {
    return new Date(dateStr);
  };

  // Check if hackathon has ended (UTC)
  const hackathonEndDate = end_date ? parseAsUTC(end_date) : null;
  const hackathonEnded = hackathonEndDate ? now > hackathonEndDate : false;

  // Debug logging - safely handle invalid dates
  const parsedEndDate = end_date ? new Date(end_date) : null;
  console.log('[HackathonRegistration] Registration check:', {
    status,
    hackathon_status,
    end_date,
    now: now.toISOString(),
    endDateParsed: parsedEndDate && !isNaN(parsedEndDate.getTime()) ? parsedEndDate.toISOString() : 'Invalid date',
    hackathonEndDateUTC: hackathonEndDate?.toISOString(),
    hackathonEnded
  });

  // Simplified registration logic using date-based state
  // Registration is available when hackathon is 'live' (published and before end_date)
  // Requirements: 3.1, 3.2, 3.3, 4.1
  // Also check hackathonEnded with proper UTC parsing
  const isRegistrationAvailable = !hackathonEnded && checkCanRegister(
    { status, hackathon_status, end_date },
    now
  );
  
  console.log('[HackathonRegistration] isRegistrationAvailable:', isRegistrationAvailable);
  
  // Registration is closed if not available (hackathon ended or not live)
  const isRegistrationClosed = !isRegistrationAvailable;

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
            className="bg-gradient-to-br from-gray-900/95 to-gray-900/80 border-2 border-red-500/50 w-full max-w-5xl max-h-[90vh] overflow-y-auto backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-red-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 border border-red-500/40">
                  <Users className="h-5 w-5 text-red-400" />
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
                    {/* Manage team only visible when registration is still available */}
                    {isTeamRegistration && isRegistrationAvailable && (
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

              {/* Create/join team only for team registrations and when registration is available */}
              {!hasTeam && teamsAllowed && isTeamRegistration && isRegistrationAvailable && (
                <button
                  onClick={() => setShowTeamModal(true)}
                  className="w-full mt-4 bg-gradient-to-r from-green-600/40 to-emerald-500/30 border border-green-500/50 hover:border-green-400 text-green-200 hover:text-white px-6 py-3 font-press-start text-sm transition-all duration-300"
                >
                  <Users className="h-4 w-4 inline mr-2" />
                  CREATE_OR_JOIN_TEAM
                </button>
              )}

              {/* Unregister button - only visible when registration is available */}
              {isRegistrationAvailable && (
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
          {winnersAnnounced ? (
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
          ) : isOrganizer ? (
            <Link
              to={`/organizer/hackathons/${hackathonId}`}
              className="w-full border px-6 py-3 font-press-start text-sm transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(to right, ${primaryColor}40, ${secondaryColor}30)`,
                borderColor: `${primaryColor}50`,
                color: primaryColor
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = primaryColor;
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${primaryColor}50`;
                e.currentTarget.style.color = primaryColor;
              }}
            >
              <Settings className="h-4 w-4" />
              MANAGE_HACKATHON
            </Link>
          ) : isRegistrationClosed ? (
            <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/40 p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 border border-red-500/40">
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-press-start text-sm text-red-400">REGISTRATION CLOSED</h3>
                  <p className="font-jetbrains text-gray-300 text-sm">
                    This hackathon has ended
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="w-full border px-6 py-3 font-press-start text-sm transition-all duration-300"
                style={{
                  background: `linear-gradient(to right, ${primaryColor}40, ${secondaryColor}30)`,
                  borderColor: `${primaryColor}50`,
                  color: primaryColor
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = primaryColor;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${primaryColor}50`;
                  e.currentTarget.style.color = primaryColor;
                }}
              >
                <UserPlus className="h-4 w-4 inline mr-2" />
                JOIN_HACKATHON
              </button>

              {/* Registration Modal */}
              {showRegisterModal &&
                createPortal(
                  <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-gradient-to-br from-gray-900/95 to-gray-900/80 border-2 border-red-500/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[10000] backdrop-blur-sm">
                      <div className="p-6 border-b border-red-500/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/20 border border-red-500/40">
                              <UserPlus className="h-5 w-5 text-red-400" />
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
                            <label className="font-press-start text-[10px] text-red-300 mb-3 block flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-red-400"></span>
                              REGISTRATION_TYPE
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                              <button
                                onClick={() => setRegistrationType('individual')}
                                className={`py-4 font-press-start text-sm transition-all duration-300 ${
                                  registrationType === 'individual' 
                                    ? 'bg-gradient-to-r from-red-600/40 to-orange-500/30 border border-red-500/50 text-red-200' 
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
                            className="w-full bg-black/50 border border-red-500/30 text-white px-4 py-3 font-jetbrains focus:border-red-400 outline-none placeholder:text-gray-600"
                            placeholder="+91 1234567890"
                          />
                        </div>

                        <div>
                          <label className="font-jetbrains text-sm text-gray-300 mb-2 block">College/University</label>
                          <input
                            type="text"
                            value={formData.college_university}
                            onChange={(e) => setFormData({ ...formData, college_university: e.target.value })}
                            className="w-full bg-black/50 border border-red-500/30 text-white px-4 py-3 font-jetbrains focus:border-red-400 outline-none placeholder:text-gray-600"
                          />
                        </div>

                        <div>
                          <label className="font-jetbrains text-sm text-gray-300 mb-2 block">GitHub URL (Optional)</label>
                          <input
                            type="url"
                            value={formData.github_url}
                            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                            className="w-full bg-black/50 border border-red-500/30 text-white px-4 py-3 font-jetbrains focus:border-red-400 outline-none placeholder:text-gray-600"
                            placeholder="https://github.com/username"
                          />
                        </div>

                        <div>
                          <label className="font-jetbrains text-sm text-gray-300 mb-2 block">LinkedIn URL (Optional)</label>
                          <input
                            type="url"
                            value={formData.linkedin_url}
                            onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                            className="w-full bg-black/50 border border-red-500/30 text-white px-4 py-3 font-jetbrains focus:border-red-400 outline-none placeholder:text-gray-600"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>

                        <div>
                          <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Experience Level</label>
                          <select
                            value={formData.experience_level}
                            onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                            className="w-full bg-black/50 border border-red-500/30 text-white px-4 py-3 font-jetbrains focus:border-red-400 outline-none"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>

                        <button
                          onClick={handleRegister}
                          className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 border border-red-500/50 hover:border-red-400 text-white px-6 py-3 font-press-start text-sm transition-all duration-300"
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
