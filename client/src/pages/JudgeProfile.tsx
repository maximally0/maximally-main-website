import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Building2, Globe, Linkedin, Github, Twitter, Award, Users, Clock, Star, ArrowLeft, Calendar, ExternalLink, Languages, Mail, Shield } from 'lucide-react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import TierBadge from '@/components/judges/TierBadge';
import VerificationIndicator from '@/components/judges/VerificationIndicator';
import { getTierLabel } from '@/lib/judgesData';
import { useQuery } from '@tanstack/react-query';
import type { Judge, JudgeEvent } from '@shared/schema';

const JudgeProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  
  // Get current user to check if they're an admin
  const { data: currentUser } = useQuery({
    queryKey: ['auth:me'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) return null;
      return response.json();
    }
  });
  
  const isAdmin = currentUser?.profile?.role === 'admin';
  
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
          <div className="minecraft-block bg-cyan-400 text-black px-6 py-3 inline-block animate-pulse">
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
          <h1 className="font-press-start text-2xl mb-4 text-cyan-400">404: JUDGE NOT FOUND</h1>
          <Link to="/people/judges" className="minecraft-block bg-cyan-400 text-black px-4 py-2 hover:bg-maximally-yellow transition-colors inline-block">
            <span className="font-press-start text-xs">← BACK TO JUDGES</span>
          </Link>
        </div>
      </div>
    );
  }

  const availabilityColors = {
    'available': 'text-green-400 border-green-400 bg-green-400/10',
    'not-available': 'text-red-400 border-red-400 bg-red-400/10',
    'seasonal': 'text-yellow-400 border-yellow-400 bg-yellow-400/10',
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
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating Pixels */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="fixed w-2 h-2 bg-cyan-400 pixel-border animate-float pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}

        <main className="min-h-screen pt-24 pb-16 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="minecraft-block bg-cyan-400 text-black px-4 py-2 hover:bg-maximally-yellow transition-colors mb-8 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-press-start text-xs">BACK</span>
            </button>

            {/* Profile Header */}
            <section className="pixel-card bg-gradient-to-br from-gray-900 to-black border-2 border-cyan-400 p-8 mb-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Photo & Tier */}
                <div className="text-center">
                  <div className="minecraft-block bg-gradient-to-br from-cyan-400 to-maximally-blue w-48 h-48 mx-auto overflow-hidden mb-4">
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
                  <TierBadge tier={judge.tier} size="md" />
                  <div className={`minecraft-block ${availabilityColors[judge.availabilityStatus]} border-2 px-3 py-2 mt-4 inline-flex items-center gap-2`}>
                    <span className="font-press-start text-xs uppercase">{judge.availabilityStatus.replace('-', ' ')}</span>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="md:col-span-2">
                  <h1 className="font-press-start text-3xl md:text-4xl mb-3 text-cyan-400 minecraft-text">
                    {judge.fullName}
                  </h1>
                  <p className="font-jetbrains text-xl text-gray-300 mb-4">{judge.headline}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Building2 className="h-5 w-5 text-cyan-400" />
                      <span className="font-jetbrains">{judge.currentRole} at <strong className="text-white">{judge.company}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="h-5 w-5 text-cyan-400" />
                      <span className="font-jetbrains">{judge.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="h-5 w-5 text-cyan-400" />
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
                        className="minecraft-block bg-blue-600 text-white px-3 py-2 hover:bg-blue-700 transition-colors flex items-center gap-2"
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
                        className="minecraft-block bg-gray-700 text-white px-3 py-2 hover:bg-gray-600 transition-colors flex items-center gap-2"
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
                        className="minecraft-block bg-sky-600 text-white px-3 py-2 hover:bg-sky-700 transition-colors flex items-center gap-2"
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
                        className="minecraft-block bg-purple-600 text-white px-3 py-2 hover:bg-purple-700 transition-colors flex items-center gap-2"
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
                <section className="pixel-card bg-gray-900 border-2 border-cyan-400 p-6">
                  <h2 className="font-press-start text-xl mb-4 text-cyan-400">ABOUT</h2>
                  <p className="font-jetbrains text-gray-300 leading-relaxed mb-6">{judge.shortBio}</p>
                  
                  {/* Expertise Tags */}
                  <div className="mb-6">
                    <h3 className="font-press-start text-sm text-cyan-400 mb-3">PRIMARY EXPERTISE</h3>
                    <div className="flex flex-wrap gap-2">
                      {judge.primaryExpertise.map((exp, i) => (
                        <span
                          key={i}
                          className="minecraft-block bg-maximally-red/20 border border-maximally-red text-maximally-red px-3 py-1 text-xs font-press-start"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {judge.secondaryExpertise.length > 0 && (
                    <div>
                      <h3 className="font-press-start text-sm text-cyan-400 mb-3">SECONDARY EXPERTISE</h3>
                      <div className="flex flex-wrap gap-2">
                        {judge.secondaryExpertise.map((exp, i) => (
                          <span
                            key={i}
                            className="minecraft-block bg-blue-600/20 border border-blue-400 text-blue-400 px-3 py-1 text-xs font-jetbrains"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* Mentorship Statement */}
                <section className="pixel-card bg-gray-900 border-2 border-maximally-yellow p-6">
                  <h2 className="font-press-start text-xl mb-4 text-maximally-yellow">MENTORSHIP PHILOSOPHY</h2>
                  <p className="font-jetbrains text-gray-300 leading-relaxed italic">"{judge.mentorshipStatement}"</p>
                </section>

                {/* Event Portfolio */}
                <section className="pixel-card bg-gray-900 border-2 border-cyan-400 p-6">
                  <h2 className="font-press-start text-xl mb-4 text-cyan-400">EVENT PORTFOLIO</h2>
                  <div className="space-y-4">
                    {judge.topEventsJudged.map((event, i) => (
                      <div
                        key={i}
                        className="minecraft-block bg-gray-800 border border-gray-600 p-4 hover:border-cyan-400 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-jetbrains text-white font-bold flex items-center gap-2 mb-1">
                              {event.link ? (
                                <Link to={event.link} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
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
                <section className="pixel-card bg-gray-900 border-2 border-purple-400 p-6">
                  <h2 className="font-press-start text-xl mb-4 text-purple-400 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    ACHIEVEMENTS
                  </h2>
                  <p className="font-jetbrains text-gray-300 leading-relaxed">{judge.publicAchievements}</p>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Admin Only - Private Information */}
                {isAdmin && (
                  <section className="pixel-card bg-red-900/20 border-2 border-red-500 p-6">
                    <h2 className="font-press-start text-sm mb-4 text-red-400 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      ADMIN ONLY - PRIVATE DATA
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
                <section className="pixel-card bg-gray-900 border-2 border-maximally-red p-6">
                  <h2 className="font-press-start text-lg mb-4 text-maximally-red">STATS</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-cyan-400" />
                          <span className="font-jetbrains text-sm text-gray-400">Events Judged</span>
                        </div>
                        <VerificationIndicator verified={judge.eventsJudgedVerified} size="sm" />
                      </div>
                      <div className="font-press-start text-2xl text-white">{judge.totalEventsJudged}</div>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-cyan-400" />
                          <span className="font-jetbrains text-sm text-gray-400">Teams Evaluated</span>
                        </div>
                        <VerificationIndicator verified={judge.teamsEvaluatedVerified} size="sm" />
                      </div>
                      <div className="font-press-start text-2xl text-white">{judge.totalTeamsEvaluated}</div>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-cyan-400" />
                          <span className="font-jetbrains text-sm text-gray-400">Mentorship Hours</span>
                        </div>
                        <VerificationIndicator verified={judge.mentorshipHoursVerified} size="sm" />
                      </div>
                      <div className="font-press-start text-2xl text-white">{judge.totalMentorshipHours}h</div>
                    </div>

                    {judge.averageFeedbackRating && (
                      <div className="border-t border-gray-700 pt-4">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="font-jetbrains text-sm text-gray-400">Avg Rating</span>
                          </div>
                          <VerificationIndicator verified={judge.feedbackRatingVerified} size="sm" />
                        </div>
                        <div className="font-press-start text-2xl text-white">{judge.averageFeedbackRating}/5.0</div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Languages */}
                <section className="pixel-card bg-gray-900 border-2 border-cyan-400 p-6">
                  <h2 className="font-press-start text-sm mb-3 text-cyan-400 flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    LANGUAGES
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {judge.languagesSpoken.map((lang, i) => (
                      <span
                        key={i}
                        className="minecraft-block bg-cyan-400/10 border border-cyan-400 text-cyan-400 px-2 py-1 text-xs font-jetbrains"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </section>

                {/* CTA: Invite to Judge */}
                {judge.availabilityStatus !== 'not-available' && (
                  <section className="pixel-card bg-gradient-to-br from-maximally-red to-maximally-yellow border-2 border-maximally-red p-6">
                    <h2 className="font-press-start text-sm mb-3 text-black">INVITE TO JUDGE</h2>
                    <p className="font-jetbrains text-sm mb-4 text-black">
                      Want {judge.fullName.split(' ')[0]} to judge your hackathon?
                    </p>
                    <a
                      href={`mailto:judges@maximally.org?subject=Judge Invitation for ${judge.fullName}&body=Hi ${judge.fullName.split(' ')[0]},%0D%0A%0D%0AWe would love to have you judge our upcoming hackathon!`}
                      className="minecraft-block bg-black text-white px-4 py-3 hover:bg-gray-800 transition-colors w-full text-center block"
                    >
                      <Mail className="inline h-4 w-4 mr-2" />
                      <span className="font-press-start text-xs">SEND INVITE</span>
                    </a>
                  </section>
                )}
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default JudgeProfile;
