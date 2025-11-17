import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Trophy, Users, MapPin, ExternalLink, Mail, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

interface OrganizerProfile {
  user_id: string;
  organization_name?: string;
  bio?: string;
  website_url?: string;
  contact_email?: string;
  total_hackathons_hosted: number;
  total_participants_reached: number;
  total_prize_money_distributed?: string;
  created_at: string;
}

interface Hackathon {
  id: number;
  hackathon_name: string;
  slug: string;
  tagline?: string;
  start_date: string;
  end_date: string;
  format: string;
  venue?: string;
  total_prize_pool?: string;
  status: string;
  registrations_count: number;
}

export default function OrganizerProfile() {
  const { username } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<OrganizerProfile | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'published' | 'upcoming' | 'past'>('published');

  const isOwnProfile = userProfile && user?.id === userProfile.id;

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const fetchProfile = async () => {
    try {
      // First get the user profile by username
      const userResponse = await fetch(`/api/profile/${username}`);
      const userData = await userResponse.json();

      if (!userData.success || !userData.data) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      setUserProfile(userData.data);

      // Then get organizer profile
      const orgResponse = await fetch(`/api/organizer/profile/${userData.data.id}`);
      const orgData = await orgResponse.json();

      if (orgData.success) {
        setProfile(orgData.data);
      }

      // Fetch hackathons
      const hackResponse = await fetch(`/api/organizer/${userData.data.id}/hackathons`);
      const hackData = await hackResponse.json();

      if (hackData.success) {
        setHackathons(hackData.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHackathons = hackathons.filter(h => {
    const now = new Date();
    const end = new Date(h.end_date);

    if (activeTab === 'published') return h.status === 'published';
    if (activeTab === 'past') return h.status === 'published' && end < now;
    return false;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-press-start text-maximally-red">LOADING...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-press-start text-2xl text-maximally-red mb-4">404</h1>
          <p className="font-jetbrains text-gray-400 mb-6">Organizer not found</p>
          <Link to="/events" className="pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm">
            BROWSE_HACKATHONS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${profile.organization_name || 'Organizer'} - Maximally`}
        description={profile.bio || 'Hackathon organizer profile'}
      />

      <div className="min-h-screen bg-black text-white pt-24">
        {/* Hero Section - Enhanced */}
        <section className="relative bg-gradient-to-b from-gray-900 via-black to-black border-b-4 border-maximally-red py-20 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(229,9,20,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-maximally-yellow animate-float pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${5 + i * 0.5}s`,
              }}
            />
          ))}

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Avatar */}
                <div className="relative group">
                  {userProfile?.avatar_url ? (
                    <img
                      src={userProfile.avatar_url}
                      alt={userProfile.full_name || userProfile.username}
                      className="w-32 h-32 rounded-lg border-4 border-maximally-red object-cover group-hover:border-maximally-yellow transition-colors"
                    />
                  ) : (
                    <div className="minecraft-block bg-maximally-red w-32 h-32 flex items-center justify-center border-4 border-maximally-red group-hover:border-maximally-yellow transition-colors">
                      <span className="font-press-start text-5xl text-white">
                        {(userProfile?.full_name || userProfile?.username || 'O')[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 minecraft-block bg-maximally-blue text-white w-10 h-10 flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h1 className="font-press-start text-3xl md:text-5xl text-white mb-2 drop-shadow-[4px_4px_0px_rgba(229,9,20,1)]">
                        {userProfile?.full_name || profile?.organization_name || userProfile?.username || 'Organizer'}
                      </h1>
                      <p className="font-jetbrains text-maximally-yellow text-lg">
                        @{userProfile?.username}
                      </p>
                    </div>
                    {isOwnProfile && (
                      <Link
                        to="/organizer/dashboard"
                        className="pixel-button bg-maximally-yellow text-black px-6 py-3 font-press-start text-xs hover:bg-maximally-red hover:text-white transition-all hover:scale-105"
                      >
                        DASHBOARD
                      </Link>
                    )}
                  </div>

                  {(userProfile?.bio || profile?.bio) && (
                    <div className="pixel-card bg-black/50 border-2 border-gray-800 p-4 mb-4 backdrop-blur-sm">
                      <p className="font-jetbrains text-gray-300 text-base leading-relaxed">
                        {userProfile?.bio || profile?.bio}
                      </p>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex flex-wrap gap-3">
                    {userProfile?.location && (
                      <div className="flex items-center gap-2 text-gray-400 font-jetbrains text-sm">
                        <MapPin className="h-4 w-4 text-maximally-yellow" />
                        {userProfile.location}
                      </div>
                    )}
                    {profile?.website_url && (
                      <a
                        href={profile.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-maximally-yellow hover:text-maximally-red transition-colors font-jetbrains text-sm"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                      </a>
                    )}
                    {profile?.contact_email && (
                      <a
                        href={`mailto:${profile.contact_email}`}
                        className="flex items-center gap-2 text-maximally-yellow hover:text-maximally-red transition-colors font-jetbrains text-sm"
                      >
                        <Mail className="h-4 w-4" />
                        Contact
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Enhanced */}
        <section className="py-12 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="pixel-card bg-black/50 border-4 border-maximally-yellow p-8 text-center hover:border-maximally-red transition-all hover:scale-105 hover:shadow-glow-yellow backdrop-blur-sm group">
                  <Trophy className="w-12 h-12 text-maximally-yellow mx-auto mb-4 group-hover:animate-pulse" />
                  <div className="text-5xl font-bold text-maximally-yellow mb-3 font-press-start group-hover:text-maximally-red transition-colors">
                    {profile?.total_hackathons_hosted || 0}
                  </div>
                  <div className="text-xs text-gray-400 font-press-start">HACKATHONS_HOSTED</div>
                </div>

                <div className="pixel-card bg-black/50 border-4 border-maximally-yellow p-8 text-center hover:border-maximally-red transition-all hover:scale-105 hover:shadow-glow-yellow backdrop-blur-sm group">
                  <Users className="w-12 h-12 text-maximally-yellow mx-auto mb-4 group-hover:animate-pulse" />
                  <div className="text-5xl font-bold text-maximally-yellow mb-3 font-press-start group-hover:text-maximally-red transition-colors">
                    {profile?.total_participants_reached || 0}
                  </div>
                  <div className="text-xs text-gray-400 font-press-start">PARTICIPANTS</div>
                </div>

                <div className="pixel-card bg-black/50 border-4 border-maximally-red p-8 text-center hover:border-maximally-yellow transition-all hover:scale-105 hover:shadow-glow-red backdrop-blur-sm group">
                  <Trophy className="w-12 h-12 text-maximally-red mx-auto mb-4 group-hover:animate-pulse" />
                  <div className="text-5xl font-bold text-maximally-red mb-3 font-press-start group-hover:text-maximally-yellow transition-colors">
                    {profile?.total_prize_money_distributed || 'TBD'}
                  </div>
                  <div className="text-xs text-gray-400 font-press-start">PRIZE_MONEY</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hackathons Section */}
        <section className="py-12 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-press-start text-2xl text-maximally-red mb-6">HACKATHONS</h2>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b-2 border-gray-800">
                {['published', 'past'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-3 font-press-start text-xs transition-all relative ${
                      activeTab === tab
                        ? 'text-maximally-red border-b-4 border-maximally-red bg-maximally-red/10'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Hackathon List */}
              <div className="space-y-6">
                {filteredHackathons.map((hackathon) => (
                  <Link
                    key={hackathon.id}
                    to={`/hackathon/${hackathon.slug}`}
                    className="pixel-card bg-gray-900 border-2 border-gray-800 p-6 hover:border-maximally-red transition-all hover:scale-[1.02] hover:shadow-glow-red block group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-press-start text-lg text-white mb-2">
                          {hackathon.hackathon_name}
                        </h3>
                        {hackathon.tagline && (
                          <p className="font-jetbrains text-gray-400 mb-3">{hackathon.tagline}</p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-maximally-yellow" />
                            <span className="font-jetbrains">
                              {new Date(hackathon.start_date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-maximally-yellow" />
                            <span className="font-jetbrains capitalize">{hackathon.format}</span>
                          </div>
                          {hackathon.total_prize_pool && (
                            <div className="flex items-center gap-2">
                              <Trophy className="h-4 w-4 text-maximally-yellow" />
                              <span className="font-jetbrains">{hackathon.total_prize_pool}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-maximally-yellow" />
                            <span className="font-jetbrains">{hackathon.registrations_count} registered</span>
                          </div>
                        </div>
                      </div>

                      <ExternalLink className="h-5 w-5 text-gray-500" />
                    </div>
                  </Link>
                ))}

                {filteredHackathons.length === 0 && (
                  <div className="text-center py-12 text-gray-500 font-jetbrains">
                    No {activeTab} hackathons
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
