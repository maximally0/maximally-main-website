import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Trophy, Users, MapPin, ExternalLink, Mail, Globe, Award, Shield, Star, Crown, Flame, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

type OrganizerTier = 'starter' | 'verified' | 'senior' | 'chief' | 'legacy';

interface OrganizerProfile {
  user_id: string;
  organization_name?: string;
  bio?: string;
  website_url?: string;
  contact_email?: string;
  total_hackathons_hosted: number;
  total_participants_reached: number;
  total_prize_money_distributed?: string;
  tier?: OrganizerTier;
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

      const orgResponse = await fetch(`/api/organizer/profile/${userData.data.id}`);
      const orgData = await orgResponse.json();

      if (orgData.success) {
        setProfile(orgData.data);
      }

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

  const getTierInfo = (tier: OrganizerTier) => {
    const tierConfig = {
      starter: { 
        label: 'Starter Organizer', 
        gradient: 'from-gray-600/40 to-slate-600/30',
        border: 'border-gray-500/50',
        text: 'text-gray-400',
        icon: <Award className="h-4 w-4" />
      },
      verified: { 
        label: 'Verified Organizer', 
        gradient: 'from-blue-600/40 to-cyan-600/30',
        border: 'border-blue-500/50',
        text: 'text-blue-400',
        icon: <Shield className="h-4 w-4" />
      },
      senior: { 
        label: 'Senior Organizer', 
        gradient: 'from-purple-600/40 to-pink-600/30',
        border: 'border-purple-500/50',
        text: 'text-purple-400',
        icon: <Star className="h-4 w-4" />
      },
      chief: { 
        label: 'Chief Organizer', 
        gradient: 'from-amber-600/40 to-yellow-600/30',
        border: 'border-amber-500/50',
        text: 'text-amber-400',
        icon: <Crown className="h-4 w-4" />
      },
      legacy: { 
        label: 'Legacy Organizer', 
        gradient: 'from-red-600/40 to-orange-600/30',
        border: 'border-red-500/50',
        text: 'text-red-400',
        icon: <Flame className="h-4 w-4" />
      }
    };
    return tierConfig[tier] || tierConfig.starter;
  };

  const tierInfo = profile?.tier ? getTierInfo(profile.tier) : getTierInfo('starter');

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/40 px-8 py-6">
          <div className="font-press-start text-green-400 animate-pulse">LOADING...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/40 px-8 py-6 mb-6">
            <h1 className="font-press-start text-2xl text-green-400 mb-2">404</h1>
            <p className="font-jetbrains text-gray-400">Organizer not found</p>
          </div>
          <Link 
            to="/events" 
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 font-press-start text-xs border border-green-500/50 transition-all hover:scale-[1.02]"
          >
            BROWSE HACKATHONS
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

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.15)_0%,transparent_50%)]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.10)_0%,transparent_50%)]" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-500/15 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-emerald-500/12 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Hero Section */}
        <section className="relative pt-24 pb-12 px-4 z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Avatar */}
              <div className="relative group">
                {userProfile?.avatar_url ? (
                  <img
                    src={userProfile.avatar_url}
                    alt={userProfile.full_name || userProfile.username}
                    className="w-32 h-32 object-cover border-4 border-green-500/50 group-hover:border-emerald-400 transition-colors"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-green-600/40 to-emerald-600/30 border-4 border-green-500/50 flex items-center justify-center group-hover:border-emerald-400 transition-colors">
                    <span className="font-press-start text-4xl text-green-400">
                      {(userProfile?.full_name || userProfile?.username || 'O')[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-600 to-emerald-600 border border-green-500/50 w-10 h-10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                  <div>
                    <h1 className="font-press-start text-2xl md:text-4xl bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3">
                      {userProfile?.full_name || profile?.organization_name || userProfile?.username || 'Organizer'}
                    </h1>
                    <p className="font-jetbrains text-emerald-400 text-lg mb-3">
                      @{userProfile?.username}
                    </p>
                    {/* Tier Badge */}
                    <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${tierInfo.gradient} border ${tierInfo.border} px-4 py-2`}>
                      <span className={tierInfo.text}>{tierInfo.icon}</span>
                      <span className={`font-press-start text-xs ${tierInfo.text}`}>{tierInfo.label}</span>
                    </div>
                  </div>
                  {isOwnProfile && (
                    <Link
                      to="/organizer/dashboard"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 font-press-start text-xs border border-green-500/50 transition-all hover:scale-[1.02]"
                    >
                      DASHBOARD
                    </Link>
                  )}
                </div>

                {(userProfile?.bio || profile?.bio) && (
                  <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30 p-4 mb-4">
                    <p className="font-jetbrains text-gray-300 text-base leading-relaxed">
                      {userProfile?.bio || profile?.bio}
                    </p>
                  </div>
                )}

                {/* Links */}
                <div className="flex flex-wrap gap-4">
                  {userProfile?.location && (
                    <div className="flex items-center gap-2 text-gray-400 font-jetbrains text-sm">
                      <MapPin className="h-4 w-4 text-green-400" />
                      {userProfile.location}
                    </div>
                  )}
                  {profile?.website_url && (
                    <a
                      href={profile.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-400 hover:text-emerald-300 transition-colors font-jetbrains text-sm"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {profile?.contact_email && (
                    <a
                      href={`mailto:${profile.contact_email}`}
                      className="flex items-center gap-2 text-green-400 hover:text-emerald-300 transition-colors font-jetbrains text-sm"
                    >
                      <Mail className="h-4 w-4" />
                      Contact
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/40 p-8 text-center hover:border-emerald-400/60 transition-all hover:scale-[1.02]">
                <Trophy className="w-10 h-10 text-green-400 mx-auto mb-4" />
                <div className="font-press-start text-3xl text-white mb-2">
                  {profile?.total_hackathons_hosted || 0}
                </div>
                <div className="text-xs text-gray-400 font-jetbrains">Hackathons Hosted</div>
              </div>

              <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-emerald-500/40 p-8 text-center hover:border-teal-400/60 transition-all hover:scale-[1.02]">
                <Users className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                <div className="font-press-start text-3xl text-white mb-2">
                  {profile?.total_participants_reached || 0}
                </div>
                <div className="text-xs text-gray-400 font-jetbrains">Participants Reached</div>
              </div>

              <div className="bg-gradient-to-br from-teal-900/30 to-cyan-900/20 border border-teal-500/40 p-8 text-center hover:border-cyan-400/60 transition-all hover:scale-[1.02]">
                <Sparkles className="w-10 h-10 text-teal-400 mx-auto mb-4" />
                <div className="font-press-start text-3xl text-white mb-2">
                  {profile?.total_prize_money_distributed || 'TBD'}
                </div>
                <div className="text-xs text-gray-400 font-jetbrains">Prize Money</div>
              </div>
            </div>
          </div>
        </section>

        {/* Hackathons Section */}
        <section className="py-12 px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-press-start text-xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
              HACKATHONS
            </h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-green-500/30">
              {['published', 'past'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-3 font-press-start text-xs transition-all ${
                    activeTab === tab
                      ? 'text-green-400 border-b-2 border-green-400 bg-green-500/10'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Hackathon List */}
            <div className="space-y-4">
              {filteredHackathons.map((hackathon) => (
                <Link
                  key={hackathon.id}
                  to={`/hackathon/${hackathon.slug}`}
                  className="block bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-green-500/30 p-6 hover:border-emerald-400/50 transition-all hover:scale-[1.01] group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-press-start text-sm text-white mb-2 group-hover:text-green-400 transition-colors">
                        {hackathon.hackathon_name}
                      </h3>
                      {hackathon.tagline && (
                        <p className="font-jetbrains text-gray-400 text-sm mb-3">{hackathon.tagline}</p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-400" />
                          <span className="font-jetbrains">
                            {new Date(hackathon.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-emerald-400" />
                          <span className="font-jetbrains capitalize">{hackathon.format}</span>
                        </div>
                        {hackathon.total_prize_pool && (
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-teal-400" />
                            <span className="font-jetbrains">{hackathon.total_prize_pool}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-cyan-400" />
                          <span className="font-jetbrains">{hackathon.registrations_count} registered</span>
                        </div>
                      </div>
                    </div>

                    <ExternalLink className="h-5 w-5 text-gray-500 group-hover:text-green-400 transition-colors" />
                  </div>
                </Link>
              ))}

              {filteredHackathons.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/30 px-8 py-6 inline-block">
                    <p className="font-jetbrains text-gray-400">No {activeTab} hackathons</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
