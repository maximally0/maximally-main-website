import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Building2, Globe, Linkedin, Github, Twitter, Award, Users, Clock, Star, ArrowLeft, Calendar, ExternalLink, Languages, Mail, Shield, X } from 'lucide-react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import TierBadge from '@/components/judges/TierBadge';
import VerificationIndicator from '@/components/judges/VerificationIndicator';
import { getTierLabel } from '@/lib/judgesData';
import { useQuery } from '@tanstack/react-query';
import type { Judge, JudgeEvent } from '@shared/schema';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';

const JudgeProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  // State for invite modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState<number | null>(null);
  const [inviteMessage, setInviteMessage] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);
  const [organizerHackathons, setOrganizerHackathons] = useState<any[]>([]);
  
  // Check if user is admin or viewing their own profile
  const isAdmin = profile?.role === 'admin';
  const isOrganizer = profile?.role === 'organizer';
  const isOwnProfile = profile?.username === username;
  
  // Fetch organizer's hackathons when modal opens
  useEffect(() => {
    if (showInviteModal && isOrganizer) {
      fetchOrganizerHackathons();
    }
  }, [showInviteModal, isOrganizer]);
  
  const fetchOrganizerHackathons = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/organizer/hackathons', { headers });
      const data = await response.json();
      if (data.success) {
        // Filter to only show published hackathons
        setOrganizerHackathons(data.data.filter((h: any) => h.status === 'published'));
      }
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    }
  };
  
  const handleSendInvite = async () => {
    if (!selectedHackathon || !judge?.email) return;
    
    setSendingInvite(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${selectedHackathon}/invite-judge`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          judge_email: judge.email,
          message: inviteMessage
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Invitation Sent!",
          description: `${judge.fullName} has been invited to judge your hackathon`,
        });
        setShowInviteModal(false);
        setSelectedHackathon(null);
        setInviteMessage('');
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setSendingInvite(false);
    }
  };
  
  
  
  
  
  
  
  
  const { data: judge, isLoading } = useQuery<Judge & { topEventsJudged: JudgeEvent[] }>({
    queryKey: ['/api/judges', username],
    queryFn: async () => {
      const response = await fetch(`/api/judges/${username}`);
      if (!response.ok) {
        throw new Error('Judge not found');
      }
      return response.json();
    },
    enabled: !!username,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 inline-block animate-pulse border border-pink-500/50">
            <span className="font-press-start text-sm">LOADING...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!judge) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-press-start text-2xl mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">404: JUDGE NOT FOUND</h1>
          <Link to="/people/judges" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 border border-pink-500/50 transition-all inline-block">
            <span className="font-press-start text-xs">← BACK TO JUDGES</span>
          </Link>
        </div>
      </div>
    );
  }

  const availabilityColors = {
    'available': 'text-green-400 border-green-400/50 bg-green-400/10',
    'not-available': 'text-red-400 border-red-400/50 bg-red-400/10',
    'seasonal': 'text-orange-400 border-orange-400/50 bg-orange-400/10',
  };

  return (
    <>
      <SEO
        title={`${judge.fullName} - ${getTierLabel(judge.tier)} | Maximally`}
        description={judge.shortBio}
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Pixel Grid Background */}
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />

        <main className="min-h-screen pt-24 pb-16 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 border border-pink-500/50 transition-all mb-8 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-press-start text-xs">BACK</span>
            </button>

            {/* Profile Header */}
            <section className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/40 p-8 mb-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Photo & Tier */}
                <div className="text-center">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-48 h-48 mx-auto overflow-hidden mb-4 border border-pink-500/50">
                    {judge.profilePhoto ? (
                      <img
                        src={judge.profilePhoto}
                        alt={judge.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-press-start text-6xl text-white">
                          {judge.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row items-center justify-center gap-3 flex-wrap">
                    <TierBadge tier={judge.tier} size="md" />
                    <div className={`minecraft-block ${availabilityColors[judge.availabilityStatus]} border-2 px-3 py-1.5 inline-flex items-center gap-2`}>
                      <span className="font-press-start text-xs uppercase">{judge.availabilityStatus.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="md:col-span-2">
                  <h1 className="font-press-start text-3xl md:text-4xl mb-3 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {judge.fullName}
                  </h1>
                  <p className="font-jetbrains text-xl text-gray-300 mb-4">{judge.headline}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Building2 className="h-5 w-5 text-purple-400" />
                      <span className="font-jetbrains">{judge.currentRole} at <strong className="text-white">{judge.company}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="h-5 w-5 text-pink-400" />
                      <span className="font-jetbrains">{judge.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="h-5 w-5 text-orange-400" />
                      <span className="font-jetbrains">{judge.yearsOfExperience}+ years of experience</span>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-3">
                    {judge.linkedin && (
                      <a
                        href={judge.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 border border-blue-500/50 transition-all flex items-center gap-2"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span className="font-jetbrains text-xs">LinkedIn</span>
                      </a>
                    )}
                    {judge.github && (
                      <a
                        href={judge.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 border border-gray-600/50 transition-all flex items-center gap-2"
                      >
                        <Github className="h-4 w-4" />
                        <span className="font-jetbrains text-xs">GitHub</span>
                      </a>
                    )}
                    {judge.twitter && (
                      <a
                        href={judge.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-2 border border-sky-500/50 transition-all flex items-center gap-2"
                      >
                        <Twitter className="h-4 w-4" />
                        <span className="font-jetbrains text-xs">Twitter</span>
                      </a>
                    )}
                    {judge.website && (
                      <a
                        href={judge.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 border border-purple-500/50 transition-all flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="font-jetbrains text-xs">Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About Section */}
                <section className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/40 p-6">
                  <h2 className="font-press-start text-xl mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ABOUT</h2>
                  <p className="font-jetbrains text-gray-300 leading-relaxed mb-6">{judge.shortBio}</p>
                  
                  {/* Expertise Tags */}
                  <div className="mb-6">
                    <h3 className="font-press-start text-sm text-pink-400 mb-3">PRIMARY EXPERTISE</h3>
                    <div className="flex flex-wrap gap-2">
                      {judge.primaryExpertise.map((exp, i) => (
                        <span
                          key={i}
                          className="bg-pink-500/20 border border-pink-500/50 text-pink-300 px-3 py-1 text-xs font-press-start"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {judge.secondaryExpertise.length > 0 && (
                    <div>
                      <h3 className="font-press-start text-sm text-purple-400 mb-3">SECONDARY EXPERTISE</h3>
                      <div className="flex flex-wrap gap-2">
                        {judge.secondaryExpertise.map((exp, i) => (
                          <span
                            key={i}
                            className="bg-purple-500/20 border border-purple-500/50 text-purple-300 px-3 py-1 text-xs font-jetbrains"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* Mentorship Statement */}
                <section className="bg-gradient-to-br from-orange-900/20 to-pink-900/20 border border-orange-500/40 p-6">
                  <h2 className="font-press-start text-xl mb-4 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">MENTORSHIP PHILOSOPHY</h2>
                  <p className="font-jetbrains text-gray-300 leading-relaxed italic">"{judge.mentorshipStatement}"</p>
                </section>

                {/* Event Portfolio */}
                <section className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/40 p-6">
                  <h2 className="font-press-start text-xl mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">EVENT PORTFOLIO</h2>
                  <div className="space-y-4">
                    {judge.topEventsJudged.map((event, i) => (
                      <div
                        key={i}
                        className="bg-black/30 border border-purple-500/30 p-4 hover:border-pink-400 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-jetbrains text-white font-bold flex items-center gap-2 mb-1">
                              {event.link ? (
                                <Link to={event.link} className="hover:text-pink-400 transition-colors flex items-center gap-1">
                                  {event.eventName}
                                  <ExternalLink className="h-3 w-3" />
                                </Link>
                              ) : (
                                event.eventName
                              )}
                            </h3>
                            <p className="font-jetbrains text-gray-400 text-sm">{event.role}</p>
                          </div>
                          <VerificationIndicator verified={event.verified} size="sm" showLabel />
                        </div>
                        <p className="font-jetbrains text-gray-500 text-xs">{event.date}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Achievements */}
                <section className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/40 p-6">
                  <h2 className="font-press-start text-xl mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-400" />
                    ACHIEVEMENTS
                  </h2>
                  <p className="font-jetbrains text-gray-300 leading-relaxed">{judge.publicAchievements}</p>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Private Information - Admin or Own Profile */}
                {(isAdmin || isOwnProfile) && (
                  <section className="pixel-card bg-red-900/20 border-2 border-red-500 p-6">
                    <h2 className="font-press-start text-sm mb-4 text-red-400 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {isAdmin ? 'ADMIN VIEW - PRIVATE DATA' : 'YOUR PRIVATE DATA'}
                    </h2>
                    <div className="space-y-3 text-sm">
                      {judge.email && (
                        <div>
                          <span className="text-gray-400">Email:</span>
                          <div className="font-jetbrains text-white break-all">{judge.email}</div>
                        </div>
                      )}
                      {judge.phone && (
                        <div>
                          <span className="text-gray-400">Phone:</span>
                          <div className="font-jetbrains text-white">{judge.phone}</div>
                        </div>
                      )}
                      {judge.address && (
                        <div>
                          <span className="text-gray-400">Address:</span>
                          <div className="font-jetbrains text-white">{judge.address}</div>
                        </div>
                      )}
                      {judge.timezone && (
                        <div>
                          <span className="text-gray-400">Timezone:</span>
                          <div className="font-jetbrains text-white">{judge.timezone}</div>
                        </div>
                      )}
                      {judge.compensationPreference && (
                        <div>
                          <span className="text-gray-400">Compensation:</span>
                          <div className="font-jetbrains text-white capitalize">{judge.compensationPreference}</div>
                        </div>
                      )}
                    </div>
                  </section>
                )}
                
                {/* Stats Card */}
                <section className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/40 p-6 rounded-lg shadow-lg shadow-purple-500/10">
                  <h2 className="font-press-start text-lg mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">STATS</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-purple-400" />
                          <span className="font-jetbrains text-sm text-gray-300">Events Judged</span>
                        </div>
                        <VerificationIndicator verified={judge.eventsJudgedVerified} size="sm" />
                      </div>
                      <div className="font-press-start text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{judge.totalEventsJudged}</div>
                    </div>

                    <div className="border-t border-purple-500/30 pt-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-pink-400" />
                          <span className="font-jetbrains text-sm text-gray-300">Teams Evaluated</span>
                        </div>
                        <VerificationIndicator verified={judge.teamsEvaluatedVerified} size="sm" />
                      </div>
                      <div className="font-press-start text-2xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{judge.totalTeamsEvaluated}</div>
                    </div>

                    <div className="border-t border-purple-500/30 pt-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-400" />
                          <span className="font-jetbrains text-sm text-gray-300">Mentorship Hours</span>
                        </div>
                        <VerificationIndicator verified={judge.mentorshipHoursVerified} size="sm" />
                      </div>
                      <div className="font-press-start text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{judge.totalMentorshipHours}h</div>
                    </div>

                    {judge.averageFeedbackRating && (
                      <div className="border-t border-purple-500/30 pt-4">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="font-jetbrains text-sm text-gray-300">Avg Rating</span>
                          </div>
                          <VerificationIndicator verified={judge.feedbackRatingVerified} size="sm" />
                        </div>
                        <div className="font-press-start text-2xl bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{judge.averageFeedbackRating}/5.0</div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Languages */}
                <section className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/40 p-6 rounded-lg shadow-lg shadow-purple-500/10">
                  <h2 className="font-press-start text-sm mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                    <Languages className="h-4 w-4 text-purple-400" />
                    LANGUAGES
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {judge.languagesSpoken.map((lang, i) => (
                      <span
                        key={i}
                        className="bg-purple-500/20 border border-purple-500/50 text-purple-300 px-3 py-2 text-xs font-jetbrains"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </section>

                {/* CTA: Invite to Judge - Only visible to organizers */}
                {isOrganizer && judge.availabilityStatus !== 'not-available' && (
                  <section className="pixel-card bg-gradient-to-br from-maximally-red to-maximally-yellow border-2 border-maximally-red p-6">
                    <h2 className="font-press-start text-sm mb-3 text-black">INVITE TO JUDGE</h2>
                    <p className="font-jetbrains text-sm mb-4 text-black">
                      Want {judge.fullName.split(' ')[0]} to judge your hackathon?
                    </p>
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="minecraft-block bg-black text-white px-4 py-3 hover:bg-gray-800 transition-colors w-full text-center block"
                    >
                      <Mail className="inline h-4 w-4 mr-2" />
                      <span className="font-press-start text-xs">SEND INVITE</span>
                    </button>
                  </section>
                )}
              </div>
            </div>
          </div>
        </main>
        
        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-purple-500/50 max-w-2xl w-full">
              <div className="p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-pink-900/20">
                <div className="flex items-center justify-between">
                  <h2 className="font-press-start text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">INVITE {judge.fullName.split(' ')[0].toUpperCase()}</h2>
                  <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-pink-400 transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {organizerHackathons.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 font-jetbrains mb-4">You don't have any published hackathons yet.</p>
                    <Link
                      to="/organizer/dashboard"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 font-press-start text-sm transition-all inline-block"
                    >
                      CREATE HACKATHON
                    </Link>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Select Hackathon</label>
                      <select
                        value={selectedHackathon || ''}
                        onChange={(e) => setSelectedHackathon(Number(e.target.value))}
                        className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none"
                      >
                        <option value="">-- Select a hackathon --</option>
                        {organizerHackathons.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.hackathon_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Message (Optional)</label>
                      <textarea
                        value={inviteMessage}
                        onChange={(e) => setInviteMessage(e.target.value)}
                        rows={4}
                        className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none resize-none"
                        placeholder={`Hi ${judge.fullName.split(' ')[0]}, we'd love to have you judge our hackathon...`}
                      />
                    </div>

                    <button
                      onClick={handleSendInvite}
                      disabled={!selectedHackathon || sendingInvite}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 font-press-start text-sm transition-all flex items-center justify-center gap-2 border border-pink-500/50"
                    >
                      <Mail className="h-4 w-4" />
                      {sendingInvite ? 'SENDING...' : 'SEND_INVITATION'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        <Footer />
      </div>
    </>
  );
};

export default JudgeProfile;
