import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy,
  Clock,
  ExternalLink,
  Share2,
  Zap,
  CheckCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import HackathonRegistration from '@/components/HackathonRegistration';
import HackathonAnnouncements from '@/components/HackathonAnnouncements';
import ProjectsGallery from '@/components/ProjectsGallery';
import SocialShare from '@/components/SocialShare';
import RequestToJudge from '@/components/RequestToJudge';
import HackathonTracks from '@/components/HackathonTracks';
import HackathonSponsors from '@/components/HackathonSponsors';
import HackathonFeedback from '@/components/HackathonFeedback';

interface Hackathon {
  id: number;
  hackathon_name: string;
  slug: string;
  tagline?: string;
  description?: string;
  start_date: string;
  end_date: string;
  format: string;
  venue?: string;
  registration_deadline?: string;
  team_size_min?: number;
  team_size_max?: number;
  registration_fee?: number;
  total_prize_pool?: string;
  prize_breakdown?: string;
  rules_content?: string;
  eligibility_criteria?: string;
  submission_guidelines?: string;
  judging_process?: string;
  code_of_conduct?: string;
  tracks?: string;
  themes?: string[];
  open_innovation?: boolean;
  sponsors?: string[];
  partners?: string[];
  perks?: string[];
  faqs?: string;
  discord_link?: string;
  whatsapp_link?: string;
  website_url?: string;
  contact_email?: string;
  views_count: number;
  registrations_count: number;
  // Timeline fields
  registration_opens_at?: string;
  registration_closes_at?: string;
  submission_opens_at?: string;
  submission_closes_at?: string;
  judging_starts_at?: string;
  judging_ends_at?: string;
  results_announced_at?: string;
  hackathon_status?: string;
}

export default function PublicHackathon() {
  const { slug } = useParams();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (slug) {
      fetchHackathon();
    }
  }, [slug]);

  const fetchHackathon = async () => {
    try {
      const response = await fetch(`/api/hackathons/${slug}`);
      const data = await response.json();

      if (data.success) {
        setHackathon(data.data);
        // Increment view count
        fetch(`/api/hackathons/${slug}/view`, { method: 'POST' });
      } else {
        toast({
          title: "Not Found",
          description: "This hackathon doesn't exist or hasn't been published yet.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching hackathon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: hackathon?.hackathon_name,
        text: hackathon?.tagline,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Hackathon link copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto animate-pulse space-y-8">
            {/* Hero skeleton */}
            <div className="space-y-4">
              <div className="h-12 w-3/4 bg-gray-800 rounded"></div>
              <div className="h-6 w-1/2 bg-gray-800 rounded"></div>
              <div className="flex gap-4 mt-6">
                <div className="h-12 w-40 bg-gray-800 rounded"></div>
                <div className="h-12 w-40 bg-gray-800 rounded"></div>
              </div>
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="pixel-card bg-gray-900 border-2 border-gray-800 p-4">
                  <div className="h-8 w-16 bg-gray-800 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-gray-800 rounded"></div>
                </div>
              ))}
            </div>

            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="h-6 w-full bg-gray-800 rounded"></div>
              <div className="h-6 w-5/6 bg-gray-800 rounded"></div>
              <div className="h-6 w-4/6 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-press-start text-2xl text-maximally-red mb-4">404</h1>
          <p className="font-jetbrains text-gray-400 mb-6">Hackathon not found</p>
          <Link to="/events" className="pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm">
                BROWSE_HACKATHONS
          </Link>
        </div>
      </div>
    );
  }

  const startDate = new Date(hackathon.start_date);
  const endDate = new Date(hackathon.end_date);
  const prizes = hackathon.prize_breakdown ? JSON.parse(hackathon.prize_breakdown) : [];

  // Calculate detailed hackathon status
  const getHackathonStatus = () => {
    const now = new Date();
    const start = new Date(hackathon.start_date);
    const end = new Date(hackathon.end_date);
    
    // Parse timeline dates if they exist
    const regOpens = hackathon.registration_opens_at ? new Date(hackathon.registration_opens_at) : null;
    const regCloses = hackathon.registration_closes_at ? new Date(hackathon.registration_closes_at) : null;
    const subOpens = hackathon.submission_opens_at ? new Date(hackathon.submission_opens_at) : null;
    const subCloses = hackathon.submission_closes_at ? new Date(hackathon.submission_closes_at) : null;
    const judgingStarts = hackathon.judging_starts_at ? new Date(hackathon.judging_starts_at) : null;
    const judgingEnds = hackathon.judging_ends_at ? new Date(hackathon.judging_ends_at) : null;
    const resultsAt = hackathon.results_announced_at ? new Date(hackathon.results_announced_at) : null;

    // Check if we have detailed timeline data
    const hasDetailedTimeline = regOpens || regCloses || subOpens || subCloses || judgingStarts || judgingEnds || resultsAt;

    // If we have detailed timeline data, use it
    if (hasDetailedTimeline) {
      // Check if results announced
      if (resultsAt && now >= resultsAt) {
        return { label: 'WINNERS ANNOUNCED', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20', borderColor: 'border-yellow-400' };
      }

      // Check if results announcement is soon (within 3 days)
      if (resultsAt && now < resultsAt) {
        const daysUntilResults = Math.ceil((resultsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilResults <= 3) {
          return { label: 'RESULTS SOON', color: 'text-yellow-500', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500' };
        }
      }

      // Check if judging is happening
      if (judgingStarts && judgingEnds && now >= judgingStarts && now <= judgingEnds) {
        return { label: 'JUDGING IN PROGRESS', color: 'text-purple-500', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500' };
      }

      // Check if judging starts soon (within 2 days)
      if (judgingStarts && now < judgingStarts) {
        const daysUntilJudging = Math.ceil((judgingStarts.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilJudging <= 2) {
          return { label: 'JUDGING STARTS SOON', color: 'text-purple-400', bgColor: 'bg-purple-400/20', borderColor: 'border-purple-400' };
        }
      }

      // Check if submissions are closed but judging hasn't started
      if (subCloses && now > subCloses && (!judgingStarts || now < judgingStarts)) {
        return { label: 'SUBMISSIONS CLOSED', color: 'text-orange-600', bgColor: 'bg-orange-600/20', borderColor: 'border-orange-600' };
      }

      // Check if submissions are open
      if (subOpens && subCloses && now >= subOpens && now <= subCloses) {
        const hoursLeft = Math.ceil((subCloses.getTime() - now.getTime()) / (1000 * 60 * 60));
        if (hoursLeft <= 24) {
          return { label: 'SUBMISSIONS CLOSING SOON', color: 'text-red-500', bgColor: 'bg-red-500/20', borderColor: 'border-red-500' };
        }
        return { label: 'SUBMISSIONS OPEN', color: 'text-green-500', bgColor: 'bg-green-500/20', borderColor: 'border-green-500' };
      }

      // Check if submissions open soon (within 2 days)
      if (subOpens && now < subOpens) {
        const daysUntilSub = Math.ceil((subOpens.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilSub <= 2) {
          return { label: 'SUBMISSIONS OPEN SOON', color: 'text-green-400', bgColor: 'bg-green-400/20', borderColor: 'border-green-400' };
        }
      }

      // Check if registration is closed but hackathon hasn't started
      if (regCloses && now > regCloses && now < start) {
        return { label: 'REGISTRATION CLOSED', color: 'text-orange-500', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500' };
      }

      // Check if registration is open
      if (regOpens && regCloses && now >= regOpens && now <= regCloses) {
        const daysLeft = Math.ceil((regCloses.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 3) {
          return { label: 'REGISTRATION CLOSING SOON', color: 'text-orange-400', bgColor: 'bg-orange-400/20', borderColor: 'border-orange-400' };
        }
        return { label: 'REGISTRATION OPEN', color: 'text-blue-500', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500' };
      }

      // Check if registration opens soon (within 7 days)
      if (regOpens && now < regOpens) {
        const daysUntilReg = Math.ceil((regOpens.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilReg <= 7) {
          return { label: 'REGISTRATION OPENS SOON', color: 'text-blue-400', bgColor: 'bg-blue-400/20', borderColor: 'border-blue-400' };
        }
      }
    }

    // FALLBACK: Use broad statuses based on start/end dates only
    
    // Check if hackathon has ended
    if (now > end) {
      return { label: 'COMPLETED', color: 'text-gray-400', bgColor: 'bg-gray-400/20', borderColor: 'border-gray-400' };
    }

    // Check if hackathon is live (between start and end)
    if (now >= start && now <= end) {
      return { label: 'LIVE', color: 'text-green-500', bgColor: 'bg-green-500/20', borderColor: 'border-green-500' };
    }

    // Default: Upcoming
    return { label: 'UPCOMING', color: 'text-blue-500', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500' };
  };

  const status = getHackathonStatus();

  return (
    <>
      <SEO
        title={`${hackathon.hackathon_name} - Maximally`}
        description={hackathon.tagline || hackathon.description || ''}
        keywords={`hackathon, ${hackathon.format}, coding competition`}
      />

      <div className="min-h-screen bg-black text-white">
        {/* Hero Section - Enhanced Dark Maximally Style */}
        <section className="pt-32 pb-12 bg-gradient-to-b from-gray-900 via-black to-black border-b-4 border-maximally-red relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(229,9,20,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
          {Array.from({ length: 6 }, (_, i) => (
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
              {/* Status Badge */}
              <div className={`inline-flex items-center gap-3 bg-black/50 border-2 ${status.borderColor} px-6 py-3 mb-6 font-mono text-sm backdrop-blur-sm`}>
                <Calendar className={`h-5 w-5 ${status.color} animate-pulse`} />
                <span className="text-white font-jetbrains">{startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-gray-600">•</span>
                <span className={`${status.color} uppercase font-press-start text-xs ${status.bgColor} px-3 py-1 border ${status.borderColor}`}>{status.label}</span>
              </div>

              {/* Title */}
              <h1 className="font-press-start text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 text-white leading-tight drop-shadow-[4px_4px_0px_rgba(229,9,20,1)] animate-fade-in">
                {hackathon.hackathon_name}
              </h1>

              {/* Tagline */}
              {hackathon.tagline && (
                <p className="text-xl sm:text-2xl text-gray-400 mb-8 font-jetbrains leading-relaxed">
                  {hackathon.tagline}
                </p>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-10 animate-fade-in">
                <div className="flex-1 min-w-[250px]">
                  <HackathonRegistration
                    hackathonId={hackathon.id}
                    hackathonName={hackathon.hackathon_name}
                    teamSizeMin={hackathon.team_size_min || 1}
                    teamSizeMax={hackathon.team_size_max || 4}
                    registrationOpensAt={hackathon.registration_opens_at}
                    registrationClosesAt={hackathon.registration_closes_at}
                    onRegistrationChange={fetchHackathon}
                  />
                </div>
                <RequestToJudge hackathonId={hackathon.id} />
                <SocialShare
                  title={hackathon.hackathon_name}
                  description={hackathon.tagline || `Join ${hackathon.hackathon_name} on Maximally!`}
                  hashtags={['hackathon', 'maximally', 'coding']}
                />
              </div>

              {/* Judge Interface Button - Show if user is a judge */}
              {user && profile?.role === 'judge' && (
                <div className="mb-10 animate-fade-in">
                  <Link
                    to={`/judge/hackathons/${hackathon.id}/submissions`}
                    className="pixel-button bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 font-press-start text-sm transition-all inline-flex items-center gap-3 border-2 border-purple-500 hover:scale-105"
                  >
                    <Trophy className="h-5 w-5" />
                    JUDGE_SUBMISSIONS
                  </Link>
                </div>
              )}

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
                <div className="pixel-card bg-black/50 border-2 border-maximally-yellow p-5 hover:border-maximally-red transition-all hover:scale-105 hover:shadow-glow-yellow backdrop-blur-sm group">
                  <div className="text-2xl font-bold text-maximally-yellow mb-2 font-press-start group-hover:animate-pulse">
                    {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-xs text-gray-400 font-press-start">START_DATE</div>
                </div>
                <div className="pixel-card bg-black/50 border-2 border-maximally-yellow p-5 hover:border-maximally-red transition-all hover:scale-105 hover:shadow-glow-yellow backdrop-blur-sm group">
                  <div className="text-2xl font-bold text-maximally-yellow mb-2 font-press-start capitalize group-hover:animate-pulse">
                    {hackathon.format}
                  </div>
                  <div className="text-xs text-gray-400 font-press-start">FORMAT</div>
                </div>
                <div className="pixel-card bg-black/50 border-2 border-maximally-yellow p-5 hover:border-maximally-red transition-all hover:scale-105 hover:shadow-glow-yellow backdrop-blur-sm group">
                  <div className="text-2xl font-bold text-maximally-yellow mb-2 font-press-start group-hover:animate-pulse">
                    {hackathon.team_size_min || 1}-{hackathon.team_size_max || 4}
                  </div>
                  <div className="text-xs text-gray-400 font-press-start">TEAM_SIZE</div>
                </div>
                <div className="pixel-card bg-black/50 border-2 border-maximally-red p-5 hover:border-maximally-yellow transition-all hover:scale-105 hover:shadow-glow-red backdrop-blur-sm group">
                  <div className="text-2xl font-bold text-maximally-red mb-2 font-press-start group-hover:animate-pulse">
                    {hackathon.total_prize_pool || 'TBA'}
                  </div>
                  <div className="text-xs text-gray-400 font-press-start">PRIZE_POOL</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Navigation - Geekverse Style */}
        <section className="bg-gray-900/50 border-b border-gray-800 z-40 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex gap-0 overflow-x-auto scrollbar-hide">
                {[
                  { id: 'overview', label: 'overview' },
                  { id: 'announcements', label: 'announcements' },
                  { id: 'timeline', label: 'timeline' },
                  { id: 'prizes', label: 'prizes' },
                  { id: 'rules', label: 'rules' },
                  ...(hackathon.tracks && JSON.parse(hackathon.tracks || '[]').length > 0 ? [{ id: 'tracks', label: 'tracks' }] : []),
                  { id: 'projects', label: 'projects' },
                  ...(hackathon.sponsors && hackathon.sponsors.length > 0 ? [{ id: 'sponsors', label: 'sponsors' }] : []),
                  ...(hackathon.faqs && JSON.parse(hackathon.faqs || '[]').length > 0 ? [{ id: 'faqs', label: 'faqs' }] : []),
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 font-mono text-sm whitespace-nowrap transition-all relative ${
                      activeTab === tab.id
                        ? 'text-white bg-black/50'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-black/30'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-maximally-red"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tab Content with Sidebar Layout */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* About Section */}
                  {hackathon.description && (
                    <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-8">
                      <h2 className="font-press-start text-2xl text-maximally-red mb-6">ABOUT</h2>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-jetbrains text-lg">
                          {hackathon.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Announcements Tab */}
              {activeTab === 'announcements' && (
                <div className="space-y-8">
                  <HackathonAnnouncements hackathonId={hackathon.id} />
                </div>
              )}

              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="font-press-start text-2xl text-maximally-red mb-6">EVENT_TIMELINE</h2>
                    <div className="space-y-4">
                      {/* Registration Period */}
                      {(hackathon.registration_opens_at || hackathon.registration_closes_at) && (
                        <div className="pixel-card bg-gray-900 border-2 border-blue-500 p-6 hover:border-blue-400 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="minecraft-block bg-blue-500 w-12 h-12 flex items-center justify-center flex-shrink-0">
                              <Users className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-press-start text-sm text-blue-400 mb-2">REGISTRATION_PERIOD</h3>
                              <div className="space-y-1 font-jetbrains text-sm text-gray-300">
                                {hackathon.registration_opens_at && (
                                  <p>
                                    <span className="text-gray-500">Opens:</span>{' '}
                                    <span className="text-white">
                                      {new Date(hackathon.registration_opens_at).toLocaleString('en-IN', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                        timeZone: 'Asia/Kolkata'
                                      })} IST
                                    </span>
                                  </p>
                                )}
                                {hackathon.registration_closes_at && (
                                  <p>
                                    <span className="text-gray-500">Closes:</span>{' '}
                                    <span className="text-white">
                                      {new Date(hackathon.registration_closes_at).toLocaleString('en-IN', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                        timeZone: 'Asia/Kolkata'
                                      })} IST
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Hackathon Duration */}
                      <div className="pixel-card bg-gray-900 border-2 border-maximally-red p-6 hover:border-maximally-yellow transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="minecraft-block bg-maximally-red w-12 h-12 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-press-start text-sm text-maximally-red mb-2">HACKATHON_DURATION</h3>
                            <div className="space-y-1 font-jetbrains text-sm text-gray-300">
                              <p>
                                <span className="text-gray-500">Starts:</span>{' '}
                                <span className="text-white">
                                  {startDate.toLocaleString('en-IN', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                    timeZone: 'Asia/Kolkata'
                                  })} IST
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-500">Ends:</span>{' '}
                                <span className="text-white">
                                  {endDate.toLocaleString('en-IN', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                    timeZone: 'Asia/Kolkata'
                                  })} IST
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Submission Period */}
                      {(hackathon.submission_opens_at || hackathon.submission_closes_at) && (
                        <div className="pixel-card bg-gray-900 border-2 border-green-500 p-6 hover:border-green-400 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="minecraft-block bg-green-500 w-12 h-12 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-press-start text-sm text-green-400 mb-2">SUBMISSION_PERIOD</h3>
                              <div className="space-y-1 font-jetbrains text-sm text-gray-300">
                                {hackathon.submission_opens_at && (
                                  <p>
                                    <span className="text-gray-500">Opens:</span>{' '}
                                    <span className="text-white">
                                      {new Date(hackathon.submission_opens_at).toLocaleString('en-IN', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                        timeZone: 'Asia/Kolkata'
                                      })} IST
                                    </span>
                                  </p>
                                )}
                                {hackathon.submission_closes_at && (
                                  <p>
                                    <span className="text-gray-500">Closes:</span>{' '}
                                    <span className="text-white">
                                      {new Date(hackathon.submission_closes_at).toLocaleString('en-IN', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                        timeZone: 'Asia/Kolkata'
                                      })} IST
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Judging Period */}
                      {(hackathon.judging_starts_at || hackathon.judging_ends_at) && (
                        <div className="pixel-card bg-gray-900 border-2 border-purple-500 p-6 hover:border-purple-400 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="minecraft-block bg-purple-500 w-12 h-12 flex items-center justify-center flex-shrink-0">
                              <Trophy className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-press-start text-sm text-purple-400 mb-2">JUDGING_PERIOD</h3>
                              <div className="space-y-1 font-jetbrains text-sm text-gray-300">
                                {hackathon.judging_starts_at && (
                                  <p>
                                    <span className="text-gray-500">Starts:</span>{' '}
                                    <span className="text-white">
                                      {new Date(hackathon.judging_starts_at).toLocaleString('en-IN', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                        timeZone: 'Asia/Kolkata'
                                      })} IST
                                    </span>
                                  </p>
                                )}
                                {hackathon.judging_ends_at && (
                                  <p>
                                    <span className="text-gray-500">Ends:</span>{' '}
                                    <span className="text-white">
                                      {new Date(hackathon.judging_ends_at).toLocaleString('en-IN', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                        timeZone: 'Asia/Kolkata'
                                      })} IST
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Results Announcement */}
                      {hackathon.results_announced_at && (
                        <div className="pixel-card bg-gray-900 border-2 border-yellow-500 p-6 hover:border-yellow-400 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="minecraft-block bg-yellow-500 w-12 h-12 flex items-center justify-center flex-shrink-0">
                              <Sparkles className="h-6 w-6 text-black" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-press-start text-sm text-yellow-400 mb-2">RESULTS_ANNOUNCEMENT</h3>
                              <div className="font-jetbrains text-sm text-gray-300">
                                <p>
                                  <span className="text-gray-500">Announced on:</span>{' '}
                                  <span className="text-white">
                                    {new Date(hackathon.results_announced_at).toLocaleString('en-IN', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true,
                                      timeZone: 'Asia/Kolkata'
                                    })} IST
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* No timeline set message */}
                      {!hackathon.registration_opens_at && 
                       !hackathon.registration_closes_at && 
                       !hackathon.submission_opens_at && 
                       !hackathon.submission_closes_at && 
                       !hackathon.judging_starts_at && 
                       !hackathon.judging_ends_at && 
                       !hackathon.results_announced_at && (
                        <div className="pixel-card bg-gray-900 border-2 border-gray-700 p-8 text-center">
                          <Clock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                          <p className="font-press-start text-sm text-gray-500 mb-2">NO_TIMELINE_SET</p>
                          <p className="font-jetbrains text-sm text-gray-600">
                            The organizer hasn't set specific timeline dates yet. Check back later!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Prizes Tab */}
              {activeTab === 'prizes' && (
                <div className="space-y-8">
                  {prizes.length > 0 && (
                    <div>
                      <h2 className="font-press-start text-2xl text-maximally-red mb-6">PRIZES_&_REWARDS</h2>
                      <div className="space-y-4">
                        {prizes.map((prize: any, i: number) => (
                          <div key={i} className="pixel-card bg-gray-900 border-2 border-maximally-yellow p-6 hover:border-maximally-red transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="minecraft-block bg-maximally-yellow w-14 h-14 flex items-center justify-center flex-shrink-0">
                                <Trophy className="h-7 w-7 text-black" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-press-start text-sm text-maximally-yellow mb-2">
                                  {prize.position}
                                </h3>
                                <p className="text-3xl font-bold text-white font-press-start">{prize.amount}</p>
                                {prize.description && (
                                  <p className="text-sm text-gray-400 mt-2 font-jetbrains">{prize.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Perks Section */}
                  {hackathon.perks && hackathon.perks.length > 0 && (
                    <div className="mt-8">
                      <h2 className="font-press-start text-2xl text-maximally-red mb-6">PERKS_&_BENEFITS</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hackathon.perks.map((perk, i) => (
                          <div key={i} className="pixel-card bg-gray-900 border-2 border-gray-700 p-4 hover:border-maximally-yellow transition-colors">
                            <div className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-maximally-yellow mt-1 flex-shrink-0" />
                              <p className="text-gray-300 font-jetbrains">{perk}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Rules Tab */}
              {activeTab === 'rules' && (
                <div className="space-y-8">
                  {hackathon.rules_content && (
                    <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-8">
                      <h2 className="font-press-start text-2xl text-maximally-red mb-6">RULES_&_REGULATIONS</h2>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-jetbrains">
                          {hackathon.rules_content}
                        </p>
                      </div>
                    </div>
                  )}

                  {hackathon.eligibility_criteria && (
                    <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-8">
                      <h2 className="font-press-start text-2xl text-maximally-red mb-6">ELIGIBILITY</h2>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-jetbrains">
                          {hackathon.eligibility_criteria}
                        </p>
                      </div>
                    </div>
                  )}

                  {hackathon.submission_guidelines && (
                    <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-8">
                      <h2 className="font-press-start text-2xl text-maximally-red mb-6">SUBMISSION_GUIDELINES</h2>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-jetbrains">
                          {hackathon.submission_guidelines}
                        </p>
                      </div>
                    </div>
                  )}

                  {hackathon.judging_process && (
                    <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-8">
                      <h2 className="font-press-start text-2xl text-maximally-red mb-6">JUDGING_PROCESS</h2>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-jetbrains">
                          {hackathon.judging_process}
                        </p>
                      </div>
                    </div>
                  )}

                  {hackathon.code_of_conduct && (
                    <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-8">
                      <h2 className="font-press-start text-2xl text-maximally-red mb-6">CODE_OF_CONDUCT</h2>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-jetbrains">
                          {hackathon.code_of_conduct}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tracks Tab */}
              {activeTab === 'tracks' && (
                <div>
                  <h2 className="font-press-start text-2xl text-maximally-red mb-6">HACKATHON_TRACKS</h2>
                  
                  {/* New Tracks Component */}
                  <HackathonTracks hackathonId={hackathon.id} />

                  {/* Legacy tracks from JSON field (fallback) */}
                  {hackathon.tracks && JSON.parse(hackathon.tracks || '[]').length > 0 && (
                    <div className="mt-8 space-y-4">
                      <h3 className="font-press-start text-lg text-cyan-400 mb-4">ADDITIONAL TRACKS</h3>
                      {JSON.parse(hackathon.tracks || '[]').map((track: any, i: number) => (
                        <div key={i} className="pixel-card bg-gray-900 border-2 border-maximally-red p-6 hover:border-maximally-yellow transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-press-start text-lg text-maximally-yellow mb-3">
                                {track.name}
                              </h3>
                              <p className="text-gray-300 font-jetbrains leading-relaxed mb-3">
                                {track.description}
                              </p>
                              {track.prize && (
                                <div className="inline-flex items-center gap-2 bg-maximally-yellow/10 border border-maximally-yellow px-4 py-2 rounded">
                                  <Trophy className="h-4 w-4 text-maximally-yellow" />
                                  <span className="font-press-start text-sm text-maximally-yellow">{track.prize}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {hackathon.open_innovation && (
                    <div className="pixel-card bg-maximally-yellow/10 border-2 border-maximally-yellow p-6 mt-6">
                      <div className="flex items-start gap-3">
                        <Zap className="h-6 w-6 text-maximally-yellow mt-1" />
                        <div>
                          <h3 className="font-press-start text-sm text-maximally-yellow mb-2">OPEN_INNOVATION</h3>
                          <p className="text-gray-300 font-jetbrains">
                            Not limited to specific tracks! Feel free to work on any innovative idea.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sponsors Tab */}
              {activeTab === 'sponsors' && (
                <div className="space-y-8">
                  <h2 className="font-press-start text-2xl text-maximally-red mb-6">SPONSORS & PARTNERS</h2>
                  
                  {/* New Sponsors Component */}
                  <HackathonSponsors hackathonId={hackathon.id} />

                  {/* Legacy sponsors from JSON field (fallback) */}
                  {hackathon.sponsors && hackathon.sponsors.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-press-start text-lg text-cyan-400 mb-4">ADDITIONAL SPONSORS</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {hackathon.sponsors.map((sponsor, i) => (
                          <div key={i} className="pixel-card bg-gray-900 border-2 border-gray-700 p-6 hover:border-maximally-yellow transition-colors flex items-center justify-center">
                            <p className="font-press-start text-sm text-gray-300 text-center">{sponsor}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {hackathon.partners && hackathon.partners.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-press-start text-lg text-cyan-400 mb-4">COMMUNITY PARTNERS</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {hackathon.partners.map((partner, i) => (
                          <div key={i} className="pixel-card bg-gray-900 border-2 border-gray-700 p-6 hover:border-maximally-yellow transition-colors flex items-center justify-center">
                            <p className="font-press-start text-sm text-gray-300 text-center">{partner}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* FAQs Tab */}
              {activeTab === 'faqs' && hackathon.faqs && (
                <div>
                  <h2 className="font-press-start text-2xl text-maximally-red mb-6">FREQUENTLY_ASKED_QUESTIONS</h2>
                  <div className="space-y-4">
                    {JSON.parse(hackathon.faqs || '[]').map((faq: any, i: number) => (
                      <div key={i} className="pixel-card bg-gray-900 border-2 border-gray-800 p-6 hover:border-maximally-yellow transition-colors">
                        <h3 className="font-press-start text-sm text-maximally-yellow mb-3">
                          Q: {faq.question}
                        </h3>
                        <p className="text-gray-300 font-jetbrains leading-relaxed">
                          A: {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-8">
                  {/* Submit Project Section (for registered users) */}
                  {(() => {
                    const now = new Date();
                    const submissionClosed = hackathon.submission_closes_at && new Date(hackathon.submission_closes_at) < now;
                    const submissionNotOpen = hackathon.submission_opens_at && new Date(hackathon.submission_opens_at) > now;

                    if (submissionClosed) {
                      return (
                        <div className="pixel-card bg-gray-900 border-2 border-gray-700 p-6">
                          <h2 className="font-press-start text-xl text-gray-400 mb-4">SUBMISSIONS_CLOSED</h2>
                          <p className="text-gray-400 font-jetbrains">
                            Submissions for this hackathon have been closed. Stay tuned for results!
                          </p>
                        </div>
                      );
                    }

                    if (submissionNotOpen) {
                      return (
                        <div className="pixel-card bg-gray-900 border-2 border-gray-700 p-6">
                          <h2 className="font-press-start text-xl text-gray-400 mb-4">SUBMISSIONS_NOT_OPEN</h2>
                          <p className="text-gray-400 font-jetbrains">
                            Submissions will open on {new Date(hackathon.submission_opens_at!).toLocaleDateString()}
                          </p>
                        </div>
                      );
                    }

                    if (user) {
                      return (
                        <div className="pixel-card bg-gray-900 border-2 border-maximally-red p-6">
                          <h2 className="font-press-start text-xl text-maximally-red mb-4">SUBMIT_YOUR_PROJECT</h2>
                          <p className="text-gray-300 font-jetbrains mb-4">
                            Ready to showcase your work? Submit your project on our dedicated submission page!
                          </p>
                          <Link
                            to={`/hackathon/${slug}/submit`}
                            className="pixel-button bg-maximally-red hover:bg-maximally-yellow text-white hover:text-black px-8 py-4 font-press-start text-sm transition-all inline-flex items-center gap-3 border-2 border-maximally-red hover:border-maximally-yellow"
                          >
                            <Trophy className="h-5 w-5" />
                            SUBMIT_PROJECT
                          </Link>
                        </div>
                      );
                    }

                    return (
                      <div className="pixel-card bg-gray-900 border-2 border-gray-700 p-6">
                        <h2 className="font-press-start text-xl text-gray-400 mb-4">SUBMIT_YOUR_PROJECT</h2>
                        <p className="text-gray-400 font-jetbrains mb-4">
                          Please log in to submit your project.
                        </p>
                        <Link
                          to={`/login?redirect=/hackathon/${slug}/submit`}
                          className="pixel-button bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 font-press-start text-sm transition-all inline-flex items-center gap-3 border-2 border-gray-600"
                        >
                          LOGIN_TO_SUBMIT
                        </Link>
                      </div>
                    );
                  })()}

                  {/* Projects Gallery */}
                  <div>
                    <h2 className="font-press-start text-2xl text-maximally-red mb-6">SUBMITTED_PROJECTS</h2>
                    <ProjectsGallery hackathonId={hackathon.id} />
                  </div>
                </div>
              )}

              {/* Feedback Tab */}
              {activeTab === 'feedback' && (
                <div>
                  <HackathonFeedback hackathonId={hackathon.id} />
                </div>
              )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Event Details Card */}
                  <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6 sticky top-32">
                    <h3 className="font-press-start text-lg text-maximally-red mb-6">EVENT_DETAILS</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-black/50 rounded border border-gray-800">
                        <Calendar className="h-5 w-5 text-maximally-yellow mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-press-start text-xs text-maximally-yellow mb-1">START</div>
                          <div className="text-sm text-gray-300 font-jetbrains">
                            {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-black/50 rounded border border-gray-800">
                        <Calendar className="h-5 w-5 text-maximally-yellow mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-press-start text-xs text-maximally-yellow mb-1">END</div>
                          <div className="text-sm text-gray-300 font-jetbrains">
                            {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      {hackathon.venue && hackathon.format !== 'online' && (
                        <div className="flex items-start gap-3 p-3 bg-black/50 rounded border border-gray-800">
                          <MapPin className="h-5 w-5 text-maximally-yellow mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-press-start text-xs text-maximally-yellow mb-1">VENUE</div>
                            <div className="text-sm text-gray-300 font-jetbrains">{hackathon.venue}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-3 p-3 bg-black/50 rounded border border-gray-800">
                        <Users className="h-5 w-5 text-maximally-yellow mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-press-start text-xs text-maximally-yellow mb-1">TEAM_SIZE</div>
                          <div className="text-sm text-gray-300 font-jetbrains">
                            {hackathon.team_size_min || 1}-{hackathon.team_size_max || 4} members
                          </div>
                        </div>
                      </div>

                      {hackathon.registration_fee !== undefined && (
                        <div className="flex items-start gap-3 p-3 bg-black/50 rounded border border-gray-800">
                          <Trophy className="h-5 w-5 text-maximally-yellow mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-press-start text-xs text-maximally-yellow mb-1">FEE</div>
                            <div className="text-sm text-gray-300 font-jetbrains">
                              {hackathon.registration_fee === 0 ? 'FREE' : `₹${hackathon.registration_fee}`}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Connect Links */}
                    {(hackathon.discord_link || hackathon.whatsapp_link || hackathon.website_url || hackathon.contact_email) && (
                      <div className="mt-6 pt-6 border-t border-gray-800">
                        <h4 className="font-press-start text-sm text-maximally-red mb-4">CONNECT</h4>
                        <div className="space-y-2">
                          {hackathon.discord_link && (
                            <a
                              href={hackathon.discord_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="pixel-button bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 font-press-start text-xs transition-all flex items-center justify-center gap-2 border-2 border-indigo-500 w-full"
                            >
                              DISCORD
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}

                          {hackathon.whatsapp_link && (
                            <a
                              href={hackathon.whatsapp_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="pixel-button bg-green-600 hover:bg-green-700 text-white px-4 py-3 font-press-start text-xs transition-all flex items-center justify-center gap-2 border-2 border-green-500 w-full"
                            >
                              WHATSAPP
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}

                          {hackathon.website_url && (
                            <a
                              href={hackathon.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="pixel-button bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 font-press-start text-xs transition-all flex items-center justify-center gap-2 border-2 border-gray-600 w-full"
                            >
                              WEBSITE
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}

                          {hackathon.contact_email && (
                            <a
                              href={`mailto:${hackathon.contact_email}`}
                              className="pixel-button bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 font-press-start text-xs transition-all flex items-center justify-center gap-2 border-2 border-gray-600 w-full"
                            >
                              EMAIL
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Themes/Tags */}
                    {hackathon.themes && hackathon.themes.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-800">
                        <h4 className="font-press-start text-sm text-maximally-red mb-4">THEMES</h4>
                        <div className="flex flex-wrap gap-2">
                          {hackathon.themes.map((theme, i) => (
                            <span key={i} className="inline-block bg-maximally-yellow/10 border border-maximally-yellow px-3 py-1 rounded font-mono text-xs text-maximally-yellow">
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-gradient-to-r from-maximally-red to-red-700 border-t-4 border-maximally-yellow">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-press-start text-2xl md:text-3xl text-white mb-4">
                READY_TO_JOIN?
              </h2>
              <p className="text-xl mb-8 text-white/90 font-jetbrains">
                Register now and be part of this amazing hackathon!
              </p>
              <div className="max-w-md mx-auto">
                <HackathonRegistration
                  hackathonId={hackathon.id}
                  hackathonName={hackathon.hackathon_name}
                  teamSizeMin={hackathon.team_size_min || 1}
                  teamSizeMax={hackathon.team_size_max || 4}
                  registrationOpensAt={hackathon.registration_opens_at}
                  registrationClosesAt={hackathon.registration_closes_at}
                  onRegistrationChange={fetchHackathon}
                />
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
