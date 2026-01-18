import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
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
  Sparkles,
  Gem,
  Handshake
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/lib/auth';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import HackathonRegistration from '@/components/HackathonRegistration';
import HackathonAnnouncements from '@/components/HackathonAnnouncements';
import ParticipantAnnouncements from '@/components/ParticipantAnnouncements';
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
  building_starts_at?: string;
  building_ends_at?: string;
  submission_opens_at?: string;
  submission_closes_at?: string;
  judging_starts_at?: string;
  judging_ends_at?: string;
  results_announced_at?: string;
  hackathon_status?: string;
  // Period controls
  registration_control?: 'auto' | 'open' | 'closed';
  building_control?: 'auto' | 'open' | 'closed';
  submission_control?: 'auto' | 'open' | 'closed';
  judging_control?: 'auto' | 'open' | 'closed';
  // Branding fields
  banner_image?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_style?: string;
  [key: string]: any; // Allow additional properties for type flexibility
  // Winners
  winners_announced?: boolean;
  winners_announced_at?: string;
  // Gallery
  gallery_public?: boolean;
}

export default function PublicHackathon() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [judgeStatus, setJudgeStatus] = useState<any>(null);
  const [userSubmission, setUserSubmission] = useState<any>(null);
  const [userRegistration, setUserRegistration] = useState<any>(null);
  const [winners, setWinners] = useState<any[]>([]);
  const [isOrganizer, setIsOrganizer] = useState(false);
  
  // Scroll behavior for hackathon navbar
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle tab from URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Auto-switch to winners tab if winners are announced and no tab specified
  useEffect(() => {
    if (hackathon?.winners_announced && !searchParams.get('tab')) {
      setActiveTab('winners');
    }
  }, [hackathon?.winners_announced]);

  // Scroll behavior for hackathon navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only hide/show the hackathon navbar when scrolling past the hero section
      if (currentScrollY > 200) {
        if (currentScrollY > lastScrollY && currentScrollY > 300) {
          setIsNavbarVisible(false);
        } else {
          setIsNavbarVisible(true);
        }
      } else {
        setIsNavbarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (slug) {
      fetchHackathon();
    }
  }, [slug]);

  useEffect(() => {
    if (user && hackathon) {
      // Fetch user-specific data in parallel
      Promise.all([
        fetchUserSubmission(),
        fetchUserRegistration(),
        fetchIsOrganizer()
        // Judges don't have accounts - removed judge status check
      ]);
    }
  }, [user, hackathon, profile]);

  useEffect(() => {
    if (hackathon?.winners_announced) {
      fetchWinners();
    }
  }, [hackathon]);

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

  const fetchJudgeStatus = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathon?.id}/judge-status`, { headers });
      const data = await response.json();

      if (data.success) {
        setJudgeStatus(data.data);
      }
    } catch (error) {
      console.error('Error fetching judge status:', error);
    }
  };

  const fetchUserSubmission = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathon?.id}/my-submission`, { headers });
      const data = await response.json();

      if (data.success && data.data) {
        setUserSubmission(data.data);
      }
    } catch (error) {
      console.error('Error fetching user submission:', error);
    }
  };

  const fetchUserRegistration = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathon?.id}/my-registration`, { headers });
      const data = await response.json();

      if (data.success && data.data) {
        setUserRegistration(data.data);
      }
    } catch (error) {
      console.error('Error fetching user registration:', error);
    }
  };

  const fetchIsOrganizer = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathon?.id}/is-organizer`, { headers });
      const data = await response.json();
      setIsOrganizer(data.isOrganizer || false);
    } catch (error) {
      console.error('Error checking organizer status:', error);
      setIsOrganizer(false);
    }
  };

  const fetchWinners = async () => {
    try {
      const response = await fetch(`/api/hackathons/${hackathon?.id}/winners`);
      const data = await response.json();

      if (data.success) {
        setWinners(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching winners:', error);
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
                <div key={i} className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/40 p-4">
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
          <h1 className="font-press-start text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">404</h1>
          <p className="font-jetbrains text-gray-400 mb-6">Hackathon not found</p>
          <Link to="/events" className=" bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 font-press-start text-sm">
                BROWSE_HACKATHONS
          </Link>
        </div>
      </div>
    );
  }

  const startDate = new Date(hackathon.start_date);
  const endDate = new Date(hackathon.end_date);
  const prizes = (() => {
    try {
      return hackathon.prize_breakdown ? JSON.parse(hackathon.prize_breakdown) : [];
    } catch {
      return [];
    }
  })();

  // All dates are stored and compared in UTC
  // No timezone conversion needed
  const parseAsUTC = (dateStr: string) => {
    return new Date(dateStr);
  };

  // Calculate detailed hackathon status
  const getHackathonStatus = () => {
    const now = new Date();
    const start = parseAsUTC(hackathon.start_date);
    const end = parseAsUTC(hackathon.end_date);
    
    // PRIORITY 0: Check if hackathon has ended FIRST (before any other checks)
    if (now > end) {
      // Check if winners have been announced
      if (hackathon.winners_announced) {
        return { label: '🏆 WINNERS ANNOUNCED', color: 'text-amber-300', bgColor: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10', borderColor: 'border-amber-500/50' };
      }
      return { label: 'COMPLETED', color: 'text-gray-300', bgColor: 'bg-gradient-to-r from-gray-500/20 to-gray-600/10', borderColor: 'border-gray-500/50' };
    }
    
    // Get period controls (default to 'auto' if not set)
    const regControl: 'auto' | 'open' | 'closed' = hackathon.registration_control || 'auto';
    const buildControl: 'auto' | 'open' | 'closed' = hackathon.building_control || 'auto';
    const subControl: 'auto' | 'open' | 'closed' = hackathon.submission_control || 'auto';
    const judgControl: 'auto' | 'open' | 'closed' = hackathon.judging_control || 'auto';

    // PRIORITY 1: Check forced period controls first
    // If building is force-active, show building status
    if (buildControl === 'open') {
      return { label: 'BUILDING IN PROGRESS', color: 'text-cyan-300', bgColor: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10', borderColor: 'border-cyan-500/50' };
    }
    
    // If submission is force-open, show submission status
    if (subControl === 'open') {
      return { label: 'SUBMISSIONS OPEN', color: 'text-green-300', bgColor: 'bg-gradient-to-r from-green-500/20 to-emerald-500/10', borderColor: 'border-green-500/50' };
    }
    
    // If judging is force-open, show judging status
    if (judgControl === 'open') {
      return { label: 'JUDGING IN PROGRESS', color: 'text-purple-300', bgColor: 'bg-gradient-to-r from-purple-500/20 to-pink-500/10', borderColor: 'border-purple-500/50' };
    }
    
    // If registration is force-closed (and nothing else is active), show closed
    if (regControl === 'closed' && (buildControl as string) !== 'open' && (subControl as string) !== 'open') {
      return { label: 'REGISTRATIONS CLOSED', color: 'text-red-300', bgColor: 'bg-gradient-to-r from-red-500/20 to-rose-500/10', borderColor: 'border-red-500/50' };
    }
    
    // If registration is force-open, show open
    if (regControl === 'open') {
      return { label: 'REGISTRATIONS OPEN', color: 'text-blue-300', bgColor: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/10', borderColor: 'border-blue-500/50' };
    }
    
    // Parse timeline dates if they exist (using IST interpretation)
    const regOpens = hackathon.registration_opens_at ? parseAsUTC(hackathon.registration_opens_at) : null;
    const regCloses = hackathon.registration_closes_at ? parseAsUTC(hackathon.registration_closes_at) : null;
    const buildingStarts = hackathon.building_starts_at ? parseAsUTC(hackathon.building_starts_at) : null;
    const buildingEnds = hackathon.building_ends_at ? parseAsUTC(hackathon.building_ends_at) : null;
    const subOpens = hackathon.submission_opens_at ? parseAsUTC(hackathon.submission_opens_at) : null;
    const subCloses = hackathon.submission_closes_at ? parseAsUTC(hackathon.submission_closes_at) : null;
    const judgingStarts = hackathon.judging_starts_at ? parseAsUTC(hackathon.judging_starts_at) : null;
    const judgingEnds = hackathon.judging_ends_at ? parseAsUTC(hackathon.judging_ends_at) : null;
    const resultsAt = hackathon.results_announced_at ? parseAsUTC(hackathon.results_announced_at) : null;

    // Check if we have detailed timeline data
    const hasDetailedTimeline = regOpens || regCloses || buildingStarts || buildingEnds || subOpens || subCloses || judgingStarts || judgingEnds || resultsAt;

    // PRIORITY 2: If all controls are 'auto', use timeline-based logic
    if (hasDetailedTimeline) {
      // PHASE 1: REGISTRATION (only if regControl is 'auto')
      if (regControl === 'auto') {
        // Check if registration hasn't opened yet
        if (regOpens && now < regOpens) {
          const daysUntilReg = Math.ceil((regOpens.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (daysUntilReg <= 7) {
            return { label: 'REGISTRATIONS OPEN SOON', color: 'text-blue-300', bgColor: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/10', borderColor: 'border-blue-500/50' };
          }
          return { label: 'REGISTRATIONS NOT OPENED', color: 'text-gray-300', bgColor: 'bg-gradient-to-r from-gray-500/20 to-gray-600/10', borderColor: 'border-gray-500/50' };
        }

        // Check if registration is currently open
        if (regOpens && regCloses && now >= regOpens && now <= regCloses) {
          const daysLeft = Math.ceil((regCloses.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (daysLeft <= 3) {
            return { label: 'REGISTRATION CLOSING SOON', color: 'text-amber-300', bgColor: 'bg-gradient-to-r from-amber-500/20 to-orange-500/10', borderColor: 'border-amber-500/50' };
          }
          return { label: 'REGISTRATIONS OPEN', color: 'text-blue-300', bgColor: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/10', borderColor: 'border-blue-500/50' };
        }

        // Check if registration is closed but hackathon hasn't started
        if (regCloses && now > regCloses && now < start) {
          return { label: 'REGISTRATIONS CLOSED', color: 'text-red-300', bgColor: 'bg-gradient-to-r from-red-500/20 to-rose-500/10', borderColor: 'border-red-500/50' };
        }
      }

      // PHASE 1.5: BUILDING/HACKING PHASE (only if buildControl is 'auto')
      if (buildControl === 'auto') {
        // Check if building phase hasn't started yet
        if (buildingStarts && now < buildingStarts) {
          const hoursUntilBuilding = Math.ceil((buildingStarts.getTime() - now.getTime()) / (1000 * 60 * 60));
          if (hoursUntilBuilding <= 24) {
            return { label: 'BUILDING STARTS SOON', color: 'text-cyan-300', bgColor: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10', borderColor: 'border-cyan-500/50' };
          }
          return { label: 'WAITING FOR BUILDING PHASE', color: 'text-gray-300', bgColor: 'bg-gradient-to-r from-gray-500/20 to-gray-600/10', borderColor: 'border-gray-500/50' };
        }

        // Check if currently in building phase
        if (buildingStarts && buildingEnds && now >= buildingStarts && now <= buildingEnds) {
          const hoursLeft = Math.ceil((buildingEnds.getTime() - now.getTime()) / (1000 * 60 * 60));
          if (hoursLeft <= 6) {
            return { label: 'BUILDING PHASE ENDING SOON', color: 'text-amber-300', bgColor: 'bg-gradient-to-r from-amber-500/20 to-orange-500/10', borderColor: 'border-amber-500/50' };
          }
          return { label: 'BUILDING IN PROGRESS', color: 'text-cyan-300', bgColor: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10', borderColor: 'border-cyan-500/50' };
        }

        // Check if building phase ended but submissions haven't opened
        if (buildingEnds && now > buildingEnds && subOpens && now < subOpens) {
          return { label: 'BUILDING PHASE ENDED', color: 'text-gray-300', bgColor: 'bg-gradient-to-r from-gray-500/20 to-gray-600/10', borderColor: 'border-gray-500/50' };
        }
      }

      // PHASE 2: SUBMISSIONS
      // Check if submissions haven't opened yet
      if (subOpens && now < subOpens) {
        const daysUntilSub = Math.ceil((subOpens.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilSub <= 2) {
          return { label: 'SUBMISSIONS OPEN SOON', color: 'text-green-300', bgColor: 'bg-gradient-to-r from-green-500/20 to-emerald-500/10', borderColor: 'border-green-500/50' };
        }
        return { label: 'HACKATHON STARTING SOON', color: 'text-cyan-300', bgColor: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10', borderColor: 'border-cyan-500/50' };
      }

      // Check if submissions are currently open
      if (subOpens && subCloses && now >= subOpens && now <= subCloses) {
        const hoursLeft = Math.ceil((subCloses.getTime() - now.getTime()) / (1000 * 60 * 60));
        if (hoursLeft <= 24) {
          return { label: 'SUBMISSIONS CLOSING SOON', color: 'text-red-300', bgColor: 'bg-gradient-to-r from-red-500/20 to-rose-500/10', borderColor: 'border-red-500/50' };
        }
        return { label: 'SUBMISSIONS OPEN', color: 'text-green-300', bgColor: 'bg-gradient-to-r from-green-500/20 to-emerald-500/10', borderColor: 'border-green-500/50' };
      }

      // Check if submissions are closed but judging hasn't started
      if (subCloses && now > subCloses && (!judgingStarts || now < judgingStarts)) {
        return { label: 'SUBMISSIONS CLOSED', color: 'text-gray-300', bgColor: 'bg-gradient-to-r from-gray-500/20 to-gray-600/10', borderColor: 'border-gray-500/50' };
      }

      // PHASE 3: JUDGING
      // Check if judging hasn't started yet
      if (judgingStarts && now < judgingStarts) {
        const daysUntilJudging = Math.ceil((judgingStarts.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilJudging <= 2) {
          return { label: 'JUDGING STARTS SOON', color: 'text-purple-300', bgColor: 'bg-gradient-to-r from-purple-500/20 to-pink-500/10', borderColor: 'border-purple-500/50' };
        }
        return { label: 'AWAITING JUDGING', color: 'text-purple-300', bgColor: 'bg-gradient-to-r from-purple-500/20 to-pink-500/10', borderColor: 'border-purple-500/50' };
      }

      // Check if judging is currently happening
      if (judgingStarts && judgingEnds && now >= judgingStarts && now <= judgingEnds) {
        return { label: 'JUDGING IN PROGRESS', color: 'text-purple-300', bgColor: 'bg-gradient-to-r from-purple-500/20 to-pink-500/10', borderColor: 'border-purple-500/50' };
      }

      // PHASE 4: RESULTS
      // Check if judging is done but results not announced yet
      if (judgingEnds && now > judgingEnds && (!resultsAt || now < resultsAt)) {
        if (resultsAt) {
          const daysUntilResults = Math.ceil((resultsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (daysUntilResults <= 3) {
            return { label: 'RESULTS SOON', color: 'text-amber-300', bgColor: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10', borderColor: 'border-amber-500/50' };
          }
        }
        return { label: 'AWAITING RESULTS', color: 'text-amber-300', bgColor: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10', borderColor: 'border-amber-500/50' };
      }

      // Check if results have been announced
      if (resultsAt && now >= resultsAt) {
        return { label: 'WINNERS ANNOUNCED', color: 'text-amber-300', bgColor: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10', borderColor: 'border-amber-500/50' };
      }
    }

    // FALLBACK: Use broad statuses based on start/end dates only
    
    // Check if hackathon has ended
    if (now > end) {
      return { label: 'COMPLETED', color: 'text-gray-300', bgColor: 'bg-gradient-to-r from-gray-500/20 to-gray-600/10', borderColor: 'border-gray-500/50' };
    }

    // Check if hackathon is live (between start and end)
    if (now >= start && now <= end) {
      return { label: 'LIVE', color: 'text-green-300', bgColor: 'bg-gradient-to-r from-green-500/20 to-emerald-500/10', borderColor: 'border-green-500/50' };
    }

    // Default: Upcoming
    return { label: 'UPCOMING', color: 'text-blue-300', bgColor: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/10', borderColor: 'border-blue-500/50' };
  };

  const status = getHackathonStatus();

  // Get branding colors with fallbacks
  const primaryColor = hackathon.primary_color || '#8B5CF6';
  const secondaryColor = hackathon.secondary_color || '#EC4899';
  const accentColor = hackathon.accent_color || '#06B6D4';

  return (
    <>
      <SEO
        title={`${hackathon.hackathon_name} - Maximally`}
        description={hackathon.tagline || hackathon.description || ''}
        keywords={`hackathon, ${hackathon.format}, coding competition`}
      />

      <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
        {/* Global Background Effects - Use branding colors */}
        <div className="fixed inset-0 bg-black pointer-events-none" />
        <div 
          className="fixed inset-0 pointer-events-none" 
          style={{
            backgroundImage: `linear-gradient(${primaryColor}08 1px, transparent 1px), linear-gradient(90deg, ${primaryColor}08 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom right, ${primaryColor}15, transparent, ${secondaryColor}15)`
          }}
        />
        
        {/* Glowing Orbs - Use branding colors */}
        <div 
          className="fixed top-1/4 left-1/4 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full blur-[100px] sm:blur-[150px] animate-pulse pointer-events-none" 
          style={{ backgroundColor: `${primaryColor}15` }}
        />
        <div 
          className="fixed bottom-1/4 right-1/4 w-[175px] sm:w-[350px] h-[175px] sm:h-[350px] rounded-full blur-[80px] sm:blur-[120px] animate-pulse pointer-events-none" 
          style={{ backgroundColor: `${secondaryColor}15`, animationDelay: '1s' }}
        />
        <div 
          className="fixed top-1/2 right-1/3 w-[125px] sm:w-[250px] h-[125px] sm:h-[250px] rounded-full blur-[60px] sm:blur-[100px] animate-pulse pointer-events-none" 
          style={{ backgroundColor: `${accentColor}12`, animationDelay: '2s' }}
        />

        {/* Banner Image */}
        {hackathon.banner_image && (
          <div className="absolute top-16 left-0 right-0 h-56 sm:h-64 md:h-80 lg:h-96 overflow-hidden z-10">
            <img 
              src={hackathon.banner_image} 
              alt={`${hackathon.hackathon_name} banner`}
              className="w-full h-full object-cover object-center"
            />
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.8) 80%, black 100%)`
              }}
            />
          </div>
        )}

        {/* Hero Section */}
        <section className={`${hackathon.banner_image ? 'pt-72 sm:pt-80 md:pt-96 lg:pt-[28rem]' : 'pt-24 sm:pt-32'} pb-8 sm:pb-12 relative overflow-hidden`}>
          {/* Floating Pixels - Use branding colors */}
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 opacity-30 animate-float pointer-events-none hidden sm:block"
              style={{
                backgroundColor: [primaryColor, secondaryColor, accentColor, primaryColor][i % 4],
                left: `${(i * 7) % 100}%`,
                top: `${(i * 11) % 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${6 + (i % 4)}s`,
              }}
            />
          ))}
          
          <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-20 max-w-7xl">
            <div className="max-w-5xl mx-auto w-full">
              {/* Status Badge */}
              <div className={`inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-gray-900/80 to-gray-800/50 border ${status.borderColor} px-3 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6 font-mono text-xs sm:text-sm backdrop-blur-sm flex-wrap`}>
                <Calendar className={`h-4 w-4 sm:h-5 sm:w-5 ${status.color}`} />
                <span className="text-gray-300 font-jetbrains text-xs sm:text-sm">{startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-gray-600 hidden sm:inline">•</span>
                <span className={`${status.color} uppercase font-press-start text-[10px] sm:text-xs ${status.bgColor} px-2 sm:px-3 py-1 border ${status.borderColor}`}>{status.label}</span>
              </div>

              {/* Title */}
              <h1 
                className="font-press-start text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 sm:mb-6 leading-tight animate-fade-in break-words"
                style={{
                  background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {hackathon.hackathon_name}
              </h1>

              {/* Tagline */}
              {hackathon.tagline && (
                <p 
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 sm:mb-8 font-jetbrains leading-relaxed break-words"
                  style={{ color: `${secondaryColor}cc` }}
                >
                  {hackathon.tagline}
                </p>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10 animate-fade-in">
                {/* Judges don't have accounts - always show registration */}
                  <div className="flex-1 min-w-full sm:min-w-[250px]">
                    <HackathonRegistration
                      hackathonId={hackathon.id}
                      hackathonName={hackathon.hackathon_name}
                      hackathonSlug={hackathon.slug}
                      teamSizeMin={hackathon.team_size_min || 1}
                      teamSizeMax={hackathon.team_size_max || 4}
                      registrationOpensAt={hackathon.registration_opens_at}
                      registrationClosesAt={hackathon.registration_closes_at}
                      registrationControl={hackathon.registration_control}
                      buildingControl={hackathon.building_control}
                      status={hackathon.status}
                      hackathon_status={hackathon.hackathon_status}
                      end_date={hackathon.end_date}
                      winnersAnnounced={hackathon.winners_announced}
                      winnersAnnouncedAt={hackathon.winners_announced_at}
                      onRegistrationChange={fetchHackathon}
                      onViewWinners={() => setActiveTab('winners')}
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                      accentColor={accentColor}
                    />
                  </div>
                {/* Judges don't have accounts - removed judge submissions button */}
                <RequestToJudge hackathonId={hackathon.id} />
                <SocialShare
                  title={hackathon.hackathon_name}
                  description={hackathon.tagline || `Join ${hackathon.hackathon_name} on Maximally!`}
                  hashtags={['hackathon', 'maximally', 'coding']}
                />
              </div>

              {/* Quick Stats Grid - Use branding colors */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fade-in">
                <div 
                  className="border p-3 sm:p-5 transition-all hover:scale-105 hover:shadow-lg backdrop-blur-sm group"
                  style={{
                    background: `linear-gradient(to bottom right, ${primaryColor}30, ${primaryColor}10)`,
                    borderColor: `${primaryColor}40`,
                    boxShadow: `0 0 20px ${primaryColor}10`
                  }}
                >
                  <div 
                    className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 font-press-start transition-colors break-words"
                    style={{ color: primaryColor }}
                  >
                    {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 font-press-start">START_DATE</div>
                </div>
                <div 
                  className="border p-3 sm:p-5 transition-all hover:scale-105 hover:shadow-lg backdrop-blur-sm group"
                  style={{
                    background: `linear-gradient(to bottom right, ${accentColor}30, ${accentColor}10)`,
                    borderColor: `${accentColor}40`,
                    boxShadow: `0 0 20px ${accentColor}10`
                  }}
                >
                  <div 
                    className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 font-press-start capitalize transition-colors break-words"
                    style={{ color: accentColor }}
                  >
                    {hackathon.format}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 font-press-start">FORMAT</div>
                </div>
                <div 
                  className="border p-3 sm:p-5 transition-all hover:scale-105 hover:shadow-lg backdrop-blur-sm group"
                  style={{
                    background: `linear-gradient(to bottom right, ${secondaryColor}30, ${secondaryColor}10)`,
                    borderColor: `${secondaryColor}40`,
                    boxShadow: `0 0 20px ${secondaryColor}10`
                  }}
                >
                  <div 
                    className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 font-press-start transition-colors"
                    style={{ color: secondaryColor }}
                  >
                    {hackathon.team_size_min || 1}-{hackathon.team_size_max || 4}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 font-press-start">TEAM_SIZE</div>
                </div>
                <div 
                  className="border p-3 sm:p-5 transition-all hover:scale-105 hover:shadow-lg backdrop-blur-sm group"
                  style={{
                    background: `linear-gradient(to bottom right, ${accentColor}30, ${primaryColor}10)`,
                    borderColor: `${accentColor}40`,
                    boxShadow: `0 0 20px ${accentColor}10`
                  }}
                >
                  <div 
                    className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 font-press-start transition-colors break-words"
                    style={{ color: accentColor }}
                  >
                    {hackathon.total_prize_pool || 'TBA'}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 font-press-start">PRIZE_POOL</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Navigation - Use branding colors */}
        <section 
          className="border-b sticky top-16 z-40 backdrop-blur-md w-full"
          style={{
            backgroundColor: 'rgba(17, 17, 17, 0.9)',
            borderColor: `${primaryColor}30`
          }}
        >
          <div className="w-full overflow-x-auto">
            <div className="container mx-auto px-2 sm:px-4 max-w-7xl">
              <div className="flex gap-0 min-w-max justify-center">{[
                  { id: 'overview', label: 'OVERVIEW' },
                  { id: 'announcements', label: 'ANNOUNCEMENTS' },
                  { id: 'timeline', label: 'TIMELINE' },
                  { id: 'prizes', label: 'PRIZES' },
                  { id: 'rules', label: 'RULES' },
                  ...(hackathon.tracks ? [{ id: 'tracks', label: 'TRACKS' }] : []),
                  { id: 'projects', label: 'PROJECTS' },
                  ...(hackathon.winners_announced ? [{ id: 'winners', label: '🏆 WINNERS' }] : []),
                  ...(hackathon.sponsors && hackathon.sponsors.length > 0 ? [{ id: 'sponsors', label: 'SPONSORS' }] : []),
                  ...((() => { try { return hackathon.faqs && JSON.parse(hackathon.faqs || '[]').length > 0; } catch { return false; } })() ? [{ id: 'faqs', label: 'FAQS' }] : []),
                  { id: 'feedback', label: 'FEEDBACK' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 sm:px-6 py-3 sm:py-4 font-press-start text-[10px] sm:text-xs whitespace-nowrap transition-all relative ${
                      activeTab === tab.id
                        ? 'text-white bg-black/50'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-black/30'
                    }`}
                    style={activeTab === tab.id ? { color: primaryColor } : {}}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                      ></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tab Content with Sidebar Layout */}
        <section className="py-8 sm:py-12 md:py-16 relative z-10 overflow-x-hidden">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl">
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0 w-full">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6 sm:space-y-8 w-full min-w-0">
                  {/* About Section - Use branding colors */}
                  {hackathon.description && (
                    <div 
                      className="border p-4 sm:p-6 md:p-8 w-full min-w-0"
                      style={{
                        background: `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}10)`,
                        borderColor: `${primaryColor}40`
                      }}
                    >
                      <h2 
                        className="font-press-start text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 break-words"
                        style={{
                          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >ABOUT</h2>
                      <div className="max-w-none w-full min-w-0">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-jetbrains text-sm sm:text-base break-words overflow-wrap-anywhere text-sm sm:text-base md:text-lg break-words overflow-wrap-anywhere">
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
                  {user ? (
                    <ParticipantAnnouncements 
                      hackathonId={hackathon.id} 
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                      accentColor={accentColor}
                    />
                  ) : (
                    <HackathonAnnouncements 
                      hackathonId={hackathon.id}
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                      accentColor={accentColor}
                    />
                  )}
                </div>
              )}

              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div className="space-y-8">
                  <div>
                    <h2 
                      className="font-press-start text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 break-words"
                      style={{
                        background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >EVENT_TIMELINE</h2>
                    <div className="space-y-4">
                      {/* Registration Period */}
                      {(hackathon.registration_opens_at || hackathon.registration_closes_at) && (
                        <div 
                          className="border p-6 transition-all duration-300"
                          style={{
                            background: `linear-gradient(to bottom right, ${primaryColor}15, ${accentColor}08)`,
                            borderColor: `${primaryColor}40`
                          }}
                        >
                          <div className="flex items-start gap-4">
                            <div 
                              className="p-3 border"
                              style={{
                                backgroundColor: `${primaryColor}20`,
                                borderColor: `${primaryColor}40`
                              }}
                            >
                              <Users className="h-6 w-6" style={{ color: primaryColor }} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-press-start text-sm mb-2" style={{ color: primaryColor }}>REGISTRATION_PERIOD</h3>
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
                      <div 
                        className="border p-6 transition-all duration-300"
                        style={{
                          background: `linear-gradient(to bottom right, ${primaryColor}15, ${secondaryColor}10)`,
                          borderColor: `${primaryColor}40`
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div 
                            className="p-3 border"
                            style={{
                              backgroundColor: `${primaryColor}20`,
                              borderColor: `${primaryColor}40`
                            }}
                          >
                            <Calendar className="h-6 w-6" style={{ color: primaryColor }} />
                          </div>
                          <div className="flex-1">
                            <h3 
                              className="font-press-start text-sm mb-2"
                              style={{
                                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                              }}
                            >HACKATHON_DURATION</h3>
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

                      {/* Building/Hacking Phase */}
                      {(hackathon.building_starts_at || hackathon.building_ends_at) && (
                        <div 
                          className="border p-6 transition-all duration-300"
                          style={{
                            background: `linear-gradient(to bottom right, ${accentColor}15, ${accentColor}08)`,
                            borderColor: `${accentColor}40`
                          }}
                        >
                          <div className="flex items-start gap-4">
                            <div 
                              className="p-3 border"
                              style={{
                                backgroundColor: `${accentColor}20`,
                                borderColor: `${accentColor}40`
                              }}
                            >
                              <Zap className="h-6 w-6" style={{ color: accentColor }} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-press-start text-sm mb-2" style={{ color: accentColor }}>BUILDING_PHASE</h3>
                              <p className="text-xs text-gray-500 font-jetbrains mb-2">Hacking time! No submissions during this phase.</p>
                              <div className="space-y-1 font-jetbrains text-sm text-gray-300">
                                {hackathon.building_starts_at && (
                                  <p>
                                    <span className="text-gray-500">Starts:</span>{' '}
                                    <span className="text-white">
                                      {new Date(hackathon.building_starts_at).toLocaleString('en-IN', {
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
                                {hackathon.building_ends_at && (
                                  <p>
                                    <span className="text-gray-500">Ends:</span>{' '}
                                    <span className="text-white">
                                      {new Date(hackathon.building_ends_at).toLocaleString('en-IN', {
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

                      {/* Submission Period */}
                      {(hackathon.submission_opens_at || hackathon.submission_closes_at) && (
                        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/40 p-6 hover:border-green-400/60 transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-500/20 border border-green-500/40">
                              <FileText className="h-6 w-6 text-green-400" />
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
                        <div 
                          className="border p-6 transition-all duration-300"
                          style={{
                            background: `linear-gradient(to bottom right, ${secondaryColor}15, ${primaryColor}08)`,
                            borderColor: `${secondaryColor}40`
                          }}
                        >
                          <div className="flex items-start gap-4">
                            <div 
                              className="p-3 border"
                              style={{
                                backgroundColor: `${secondaryColor}20`,
                                borderColor: `${secondaryColor}40`
                              }}
                            >
                              <Trophy className="h-6 w-6" style={{ color: secondaryColor }} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-press-start text-sm mb-2" style={{ color: secondaryColor }}>JUDGING_PERIOD</h3>
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
                        <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/40 p-6 hover:border-yellow-400/60 transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-yellow-500/20 border border-yellow-500/40">
                              <Sparkles className="h-6 w-6 text-yellow-400" />
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
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-8 text-center">
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
                      <h2 
                        className="font-press-start text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 break-words"
                        style={{
                          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >PRIZES_&_REWARDS</h2>
                      <div className="space-y-4">
                        {prizes.map((prize: any, i: number) => (
                          <div 
                            key={i} 
                            className="bg-gray-900 border-2 p-6 transition-colors"
                            style={{ borderColor: `${accentColor}40` }}
                          >
                            <div className="flex items-center gap-4">
                              <div 
                                className="w-14 h-14 flex items-center justify-center flex-shrink-0"
                                style={{ background: `linear-gradient(to right, ${primaryColor}, ${accentColor})` }}
                              >
                                <Trophy className="h-7 w-7 text-black" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-press-start text-sm mb-2" style={{ color: accentColor }}>
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
                      <h2 
                        className="font-press-start text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 break-words"
                        style={{
                          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >PERKS_&_BENEFITS</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hackathon.perks.map((perk, i) => (
                          <div 
                            key={i} 
                            className="bg-gray-900 border-2 p-4 transition-colors"
                            style={{ borderColor: `${primaryColor}30` }}
                          >
                            <div className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: accentColor }} />
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
                    <div 
                      className="border p-4 sm:p-6 md:p-8 w-full min-w-0"
                      style={{
                        background: `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}10)`,
                        borderColor: `${primaryColor}40`
                      }}
                    >
                      <h2 
                        className="font-press-start text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 break-words"
                        style={{
                          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >RULES_&_REGULATIONS</h2>
                      <div className="max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-jetbrains text-sm sm:text-base break-words overflow-wrap-anywhere">
                          {hackathon.rules_content}
                        </p>
                      </div>
                    </div>
                  )}

                  {hackathon.eligibility_criteria && (
                    <div 
                      className="border p-4 sm:p-6 md:p-8 w-full min-w-0"
                      style={{
                        background: `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}10)`,
                        borderColor: `${primaryColor}40`
                      }}
                    >
                      <h2 
                        className="font-press-start text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 break-words"
                        style={{
                          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >ELIGIBILITY</h2>
                      <div className="max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-jetbrains text-sm sm:text-base break-words overflow-wrap-anywhere">
                          {hackathon.eligibility_criteria}
                        </p>
                      </div>
                    </div>
                  )}

                  {hackathon.submission_guidelines && (
                    <div 
                      className="border p-4 sm:p-6 md:p-8 w-full min-w-0"
                      style={{
                        background: `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}10)`,
                        borderColor: `${primaryColor}40`
                      }}
                    >
                      <h2 
                        className="font-press-start text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 break-words"
                        style={{
                          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >SUBMISSION_GUIDELINES</h2>
                      <div className="max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-jetbrains text-sm sm:text-base break-words overflow-wrap-anywhere">
                          {hackathon.submission_guidelines}
                        </p>
                      </div>
                    </div>
                  )}

                  {hackathon.judging_process && (
                    <div 
                      className="border p-4 sm:p-6 md:p-8 w-full min-w-0"
                      style={{
                        background: `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}10)`,
                        borderColor: `${primaryColor}40`
                      }}
                    >
                      <h2 
                        className="font-press-start text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 break-words"
                        style={{
                          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >JUDGING_PROCESS</h2>
                      <div className="max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-jetbrains text-sm sm:text-base break-words overflow-wrap-anywhere">
                          {hackathon.judging_process}
                        </p>
                      </div>
                    </div>
                  )}

                  {hackathon.code_of_conduct && (
                    <div 
                      className="border p-4 sm:p-6 md:p-8 w-full min-w-0"
                      style={{
                        background: `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}10)`,
                        borderColor: `${primaryColor}40`
                      }}
                    >
                      <h2 
                        className="font-press-start text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 break-words"
                        style={{
                          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >CODE_OF_CONDUCT</h2>
                      <div className="max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-jetbrains text-sm sm:text-base break-words overflow-wrap-anywhere">
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
                  <h2 
                    className="font-press-start text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 break-words"
                    style={{
                      background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >HACKATHON_TRACKS</h2>
                  
                  {/* Display tracks from JSON field */}
                  <HackathonTracks tracks={hackathon.tracks} primaryColor={primaryColor} secondaryColor={secondaryColor} accentColor={accentColor} />

                  {hackathon.open_innovation && (
                    <div 
                      className="border p-6 mt-6"
                      style={{
                        background: `linear-gradient(to bottom right, ${accentColor}15, ${accentColor}08)`,
                        borderColor: `${accentColor}40`
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="p-2 border"
                          style={{
                            backgroundColor: `${accentColor}20`,
                            borderColor: `${accentColor}40`
                          }}
                        >
                          <Zap className="h-5 w-5" style={{ color: accentColor }} />
                        </div>
                        <div>
                          <h3 className="font-press-start text-sm mb-2" style={{ color: accentColor }}>OPEN_INNOVATION</h3>
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
                  <h2 
                    className="font-press-start text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 break-words"
                    style={{
                      background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >SPONSORS & PARTNERS</h2>
                  
                  {/* Display sponsors from JSON field */}
                  {hackathon.sponsors && hackathon.sponsors.length > 0 ? (
                    <div>
                      <h3 className="font-press-start text-lg mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                        <Gem className="h-5 w-5" style={{ color: accentColor }} />
                        SPONSORS
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {hackathon.sponsors.map((sponsor, i) => (
                          <div 
                            key={i} 
                            className="border p-6 transition-all duration-300 flex items-center justify-center hover:scale-105"
                            style={{
                              background: `linear-gradient(to bottom right, ${accentColor}15, ${primaryColor}08)`,
                              borderColor: `${accentColor}40`
                            }}
                          >
                            <p className="font-press-start text-sm text-white text-center">{sponsor}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-800/50 border border-gray-700 text-gray-400 px-6 py-4 inline-block">
                        <span className="font-press-start text-sm">NO SPONSORS YET</span>
                      </div>
                    </div>
                  )}

                  {hackathon.partners && hackathon.partners.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-press-start text-lg mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
                        <Handshake className="h-5 w-5" style={{ color: primaryColor }} />
                        COMMUNITY PARTNERS
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {hackathon.partners.map((partner, i) => (
                          <div 
                            key={i} 
                            className="border p-6 transition-all duration-300 flex items-center justify-center hover:scale-105"
                            style={{
                              background: `linear-gradient(to bottom right, ${primaryColor}15, ${secondaryColor}10)`,
                              borderColor: `${primaryColor}40`
                            }}
                          >
                            <p className="font-press-start text-sm text-white text-center">{partner}</p>
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
                  <h2 
                    className="font-press-start text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 break-words"
                    style={{
                      background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >FREQUENTLY_ASKED_QUESTIONS</h2>
                  <div className="space-y-4">
                    {(() => { try { return JSON.parse(hackathon.faqs || '[]'); } catch { return []; } })().map((faq: any, i: number) => (
                      <div 
                        key={i} 
                        className="border p-6 transition-colors"
                        style={{
                          background: `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}10)`,
                          borderColor: `${primaryColor}40`
                        }}
                      >
                        <h3 className="font-press-start text-sm mb-3" style={{ color: accentColor }}>
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
                  {/* Submit Project Section (for registered users) - Hidden for organizers */}
                  {!isOrganizer && (() => {
                    const now = new Date();
                    const subControl = hackathon.submission_control || 'auto';
                    
                    // Check if hackathon has ended - no edits allowed after end date
                    // Use parseAsUTC for consistent date handling
                    const hackathonEndDate = parseAsUTC(hackathon.end_date);
                    const hackathonEnded = now > hackathonEndDate;
                    
                    // Check period control first
                    const isSubmissionForceOpen = subControl === 'open';
                    const isSubmissionForceClosed = subControl === 'closed';
                    
                    // Timeline-based checks (only used if control is 'auto')
                    const submissionClosedByTimeline = hackathon.submission_closes_at && parseAsUTC(hackathon.submission_closes_at) < now;
                    const submissionNotOpenByTimeline = hackathon.submission_opens_at && parseAsUTC(hackathon.submission_opens_at) > now;
                    
                    // Final status - also check if hackathon has ended
                    const submissionClosed = hackathonEnded || isSubmissionForceClosed || (subControl === 'auto' && submissionClosedByTimeline);
                    const submissionNotOpen = !isSubmissionForceOpen && subControl === 'auto' && submissionNotOpenByTimeline;
                    const submissionOpen = !hackathonEnded && (isSubmissionForceOpen || (subControl === 'auto' && !submissionClosedByTimeline && !submissionNotOpenByTimeline));

                    if (submissionClosed) {
                      return (
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-6">
                          <h2 className="font-press-start text-xl text-gray-400 mb-4">SUBMISSIONS_CLOSED</h2>
                          <p className="text-gray-400 font-jetbrains">
                            Submissions for this hackathon have been closed. Stay tuned for results!
                          </p>
                        </div>
                      );
                    }

                    if (submissionNotOpen) {
                      return (
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-6">
                          <h2 className="font-press-start text-xl text-gray-400 mb-4">SUBMISSIONS_NOT_OPEN</h2>
                          <p className="text-gray-400 font-jetbrains">
                            Submissions will open on {new Date(hackathon.submission_opens_at!).toLocaleDateString()}
                          </p>
                        </div>
                      );
                    }

                    if (user && userSubmission) {
                      // User has already submitted - show their submission
                      const isEdited = userSubmission.updated_at && userSubmission.submitted_at && 
                        new Date(userSubmission.updated_at) > new Date(userSubmission.submitted_at);
                      
                      // Check if user is in a team but not the leader
                      const isInTeam = userRegistration?.team_id && userRegistration?.registration_type === 'team';
                      const isTeamLeader = isInTeam && userRegistration?.team?.team_leader_id === user.id;
                      const isTeamMemberNotLeader = isInTeam && !isTeamLeader;
                      const canEdit = !isTeamMemberNotLeader; // Only leader or solo can edit
                      
                      return (
                        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/40 p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-500/20 border border-green-500/40">
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            </div>
                            <h2 className="font-press-start text-xl text-green-400">
                              {isInTeam ? 'TEAM_SUBMISSION' : 'YOUR_SUBMISSION'}
                            </h2>
                          </div>
                          
                          {/* Team info for team submissions */}
                          {isInTeam && (
                            <div className="bg-blue-900/20 border border-blue-600 px-3 py-2 rounded mb-4">
                              <p className="text-blue-400 text-xs font-jetbrains">
                                👥 Team: {userRegistration?.team?.team_name}
                              </p>
                            </div>
                          )}
                          
                          <div className="bg-black/50 border border-gray-700 p-4 rounded mb-4">
                            <h3 className="font-press-start text-lg text-white mb-2">{userSubmission.project_name}</h3>
                            {userSubmission.tagline && (
                              <p className="text-gray-400 font-jetbrains text-sm mb-3 italic">"{userSubmission.tagline}"</p>
                            )}
                            {userSubmission.description && (
                              <p className="text-gray-300 font-jetbrains text-sm mb-3 line-clamp-3">{userSubmission.description}</p>
                            )}
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {userSubmission.technologies_used?.map((tech: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs font-jetbrains rounded">
                                  {tech}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex flex-wrap gap-3 text-sm">
                              {userSubmission.github_repo && (
                                <a href={userSubmission.github_repo} target="_blank" rel="noopener noreferrer" 
                                   className="text-blue-400 hover:text-blue-300 font-jetbrains flex items-center gap-1">
                                  <ExternalLink className="h-3 w-3" /> GitHub
                                </a>
                              )}
                              {userSubmission.demo_url && (
                                <a href={userSubmission.demo_url} target="_blank" rel="noopener noreferrer"
                                   className="text-green-400 hover:text-green-300 font-jetbrains flex items-center gap-1">
                                  <ExternalLink className="h-3 w-3" /> Demo
                                </a>
                              )}
                              {userSubmission.video_url && (
                                <a href={userSubmission.video_url} target="_blank" rel="noopener noreferrer"
                                   className="text-purple-400 hover:text-purple-300 font-jetbrains flex items-center gap-1">
                                  <ExternalLink className="h-3 w-3" /> Video
                                </a>
                              )}
                            </div>
                          </div>
                          
                          {/* Submission status */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-sm font-jetbrains">
                              <span className="text-gray-500">Status: </span>
                              <span className={userSubmission.status === 'submitted' ? 'text-green-400' : 'text-yellow-400'}>
                                {userSubmission.status === 'submitted' ? 'SUBMITTED' : 'DRAFT'}
                              </span>
                            </div>
                            {userSubmission.submitted_at && (
                              <div className="text-xs text-gray-500 font-jetbrains">
                                Submitted: {new Date(userSubmission.submitted_at).toLocaleString()}
                              </div>
                            )}
                          </div>
                          
                          {/* Edited indicator */}
                          {isEdited && (
                            <div className="bg-yellow-900/20 border border-yellow-600 px-3 py-2 rounded mb-4">
                              <p className="text-yellow-400 text-xs font-jetbrains">
                                ✏️ Edited on {new Date(userSubmission.updated_at).toLocaleString()}
                              </p>
                            </div>
                          )}
                          
                          {/* Edit button - only if submissions are still open AND user can edit */}
                          {submissionOpen && canEdit && (
                            <Link
                              to={`/hackathon/${slug}/submit`}
                              className="bg-gradient-to-r from-amber-600/40 to-yellow-500/30 border border-amber-500/50 hover:border-amber-400 text-amber-200 hover:text-white px-6 py-3 font-press-start text-sm transition-all duration-300 inline-flex items-center gap-2"
                            >
                              <FileText className="h-4 w-4" />
                              EDIT_SUBMISSION
                            </Link>
                          )}
                          
                          {/* Message for team members who can't edit */}
                          {submissionOpen && isTeamMemberNotLeader && (
                            <div className="bg-gray-800/50 border border-gray-600 px-4 py-3 rounded">
                              <p className="text-gray-400 text-sm font-jetbrains">
                                Only the team leader can edit the submission.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (user && submissionOpen) {
                      // Check if user is in a team but not the leader
                      const isInTeam = userRegistration?.team_id && userRegistration?.registration_type === 'team';
                      const isTeamLeader = isInTeam && userRegistration?.team?.team_leader_id === user.id;
                      const isTeamMemberNotLeader = isInTeam && !isTeamLeader;

                      if (isTeamMemberNotLeader) {
                        return (
                          <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/40 p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-yellow-500/20 border border-yellow-500/40">
                                <Users className="h-5 w-5 text-yellow-400" />
                              </div>
                              <h2 className="font-press-start text-xl text-yellow-400">TEAM_SUBMISSION</h2>
                            </div>
                            <p className="text-gray-300 font-jetbrains mb-2">
                              You are part of team <span className="text-yellow-400 font-bold">{userRegistration?.team?.team_name}</span>.
                            </p>
                            <p className="text-gray-400 font-jetbrains text-sm">
                              Only the team leader can submit a project on behalf of the team. Please coordinate with your team leader to submit your project.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div 
                          className="border p-6"
                          style={{
                            background: `linear-gradient(to bottom right, ${primaryColor}15, ${secondaryColor}10)`,
                            borderColor: `${primaryColor}40`
                          }}
                        >
                          <h2 
                            className="font-press-start text-xl mb-4"
                            style={{
                              background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                            }}
                          >SUBMIT_YOUR_PROJECT</h2>
                          <p className="text-gray-300 font-jetbrains mb-4">
                            Ready to showcase your work? Submit your project on our dedicated submission page!
                          </p>
                          <Link
                            to={`/hackathon/${slug}/submit`}
                            className="border px-8 py-4 font-press-start text-sm transition-all duration-300 inline-flex items-center gap-3"
                            style={{
                              background: `linear-gradient(to right, ${primaryColor}40, ${secondaryColor}30)`,
                              borderColor: `${primaryColor}50`,
                              color: primaryColor
                            }}
                          >
                            <Trophy className="h-5 w-5" />
                            SUBMIT_PROJECT
                          </Link>
                        </div>
                      );
                    }

                    return (
                      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-6">
                        <h2 className="font-press-start text-xl text-gray-400 mb-4">SUBMIT_YOUR_PROJECT</h2>
                        <p className="text-gray-400 font-jetbrains mb-4">
                          Please log in to submit your project.
                        </p>
                        <Link
                          to={`/login?redirect=/hackathon/${slug}/submit`}
                          className="bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white px-8 py-4 font-press-start text-sm transition-all duration-300 inline-flex items-center gap-3"
                        >
                          LOGIN_TO_SUBMIT
                        </Link>
                      </div>
                    );
                  })()}

                  {/* Projects Gallery - Only visible if gallery is public OR user is organizer OR hackathon ended */}
                  {(hackathon.gallery_public || isOrganizer || new Date() > new Date(hackathon.end_date)) ? (
                    <div>
                      <h2 
                        className="font-press-start text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 break-words"
                        style={{
                          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >SUBMITTED_PROJECTS</h2>
                      <ProjectsGallery hackathonId={hackathon.id} />
                    </div>
                  ) : (
                    <div 
                      className="border p-8 text-center"
                      style={{
                        background: `linear-gradient(to bottom right, ${primaryColor}10, ${secondaryColor}05)`,
                        borderColor: `${primaryColor}30`
                      }}
                    >
                      <div className="text-4xl mb-4">🔒</div>
                      <h2 className="font-press-start text-xl mb-4" style={{ color: primaryColor }}>GALLERY_NOT_PUBLIC_YET</h2>
                      <p className="text-gray-400 font-jetbrains">
                        Other participants' projects will be visible once the hackathon ends or the organizer makes the gallery public.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Winners Tab */}
              {activeTab === 'winners' && hackathon.winners_announced && (
                <div className="space-y-8">
                  <div>
                    <h2 
                      className="font-press-start text-2xl mb-2"
                      style={{
                        background: `linear-gradient(to right, ${accentColor}, ${primaryColor})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >🏆 WINNERS_ANNOUNCED</h2>
                    {hackathon.winners_announced_at && (
                      <p className="text-gray-400 font-jetbrains text-sm mb-6">
                        Announced on {new Date(hackathon.winners_announced_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>

                  {winners.length === 0 ? (
                    <div 
                      className="border p-12 text-center"
                      style={{
                        background: `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}10)`,
                        borderColor: `${primaryColor}40`
                      }}
                    >
                      <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="font-press-start text-gray-400">LOADING_WINNERS...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {winners.map((winner, index) => (
                        <div 
                          key={winner.id} 
                          className={`bg-gradient-to-br p-6 transition-all duration-300 hover:scale-[1.02] ${
                            index === 0 ? 'from-yellow-500/15 to-amber-500/10 border border-yellow-500/50 hover:border-yellow-400' :
                            index === 1 ? 'from-gray-400/10 to-gray-500/5 border border-gray-400/50 hover:border-gray-300' :
                            index === 2 ? 'from-orange-500/15 to-amber-500/10 border border-orange-500/50 hover:border-orange-400' :
                            'from-gray-800/50 to-gray-900/50 border border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-4 flex items-center justify-center flex-shrink-0 ${
                              index === 0 ? 'bg-yellow-500/20 border border-yellow-500/40' :
                              index === 1 ? 'bg-gray-400/20 border border-gray-400/40' :
                              index === 2 ? 'bg-orange-500/20 border border-orange-500/40' :
                              'bg-gray-700/50 border border-gray-600'
                            }`}>
                              <Trophy className={`h-8 w-8 ${
                                index === 0 ? 'text-yellow-400' :
                                index === 1 ? 'text-gray-300' :
                                index === 2 ? 'text-orange-400' :
                                'text-gray-400'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`font-press-start text-lg ${
                                  index === 0 ? 'text-yellow-400' :
                                  index === 1 ? 'text-gray-300' :
                                  index === 2 ? 'text-orange-400' :
                                  'text-gray-400'
                                }`}>
                                  {winner.prize_position}
                                </span>
                                {winner.prize_amount && (
                                  <span className="text-orange-400 font-press-start text-sm">
                                    {winner.prize_amount}
                                  </span>
                                )}
                              </div>
                              
                              <h3 className="font-press-start text-xl text-white mb-2">
                                {winner.submission?.project_name || 'Unknown Project'}
                              </h3>
                              
                              {winner.submission?.tagline && (
                                <p className="text-gray-400 font-jetbrains italic mb-3">
                                  "{winner.submission.tagline}"
                                </p>
                              )}
                              
                              <p className="text-gray-500 font-jetbrains text-sm mb-3">
                                By: {winner.team_name || winner.submission?.user_name || 'Anonymous'}
                                {winner.submission?.track && (
                                  <span className="ml-2 px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded text-xs">
                                    {winner.submission.track}
                                  </span>
                                )}
                              </p>
                              
                              <div className="flex flex-wrap gap-3">
                                {winner.submission?.id && (
                                  <Link 
                                    to={`/project/${winner.submission.id}`}
                                    className="text-purple-400 hover:text-pink-400 font-jetbrains text-sm flex items-center gap-1 transition-colors"
                                  >
                                    <ExternalLink className="h-4 w-4" /> View Project
                                  </Link>
                                )}
                                {winner.submission?.github_repo && (
                                  <a 
                                    href={winner.submission.github_repo} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 font-jetbrains text-sm flex items-center gap-1"
                                  >
                                    <ExternalLink className="h-4 w-4" /> GitHub
                                  </a>
                                )}
                                {winner.submission?.demo_url && (
                                  <a 
                                    href={winner.submission.demo_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-green-400 hover:text-green-300 font-jetbrains text-sm flex items-center gap-1"
                                  >
                                    <ExternalLink className="h-4 w-4" /> Demo
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Tab */}
              {activeTab === 'feedback' && (
                <div>
                  <HackathonFeedback 
                    hackathonId={hackathon.id} 
                    winnersAnnounced={hackathon.winners_announced}
                    isParticipant={!!userRegistration}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    accentColor={accentColor}
                  />
                </div>
              )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-4 sm:space-y-6 min-w-0 w-full">
                  {/* Event Details Card - Use branding colors */}
                  <div 
                    className="border p-4 sm:p-6 lg:sticky transition-all duration-300 ease-in-out"
                    style={{
                      background: `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}10)`,
                      borderColor: `${primaryColor}40`,
                      top: isNavbarVisible ? '8rem' : '4rem' // 32 -> 16 when navbar is hidden
                    }}
                  >
                    <h3 
                      className="font-press-start text-sm sm:text-base lg:text-lg mb-4 sm:mb-6"
                      style={{
                        background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >EVENT_DETAILS</h3>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-black/50 rounded border border-gray-800">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mt-1 flex-shrink-0" style={{ color: accentColor }} />
                        <div className="min-w-0 flex-1">
                          <div className="font-press-start text-[10px] sm:text-xs mb-1" style={{ color: accentColor }}>START</div>
                          <div className="text-xs sm:text-sm text-gray-300 font-jetbrains break-words">
                            {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-black/50 rounded border border-gray-800">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mt-1 flex-shrink-0" style={{ color: accentColor }} />
                        <div className="min-w-0 flex-1">
                          <div className="font-press-start text-[10px] sm:text-xs mb-1" style={{ color: accentColor }}>END</div>
                          <div className="text-xs sm:text-sm text-gray-300 font-jetbrains break-words">
                            {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      {hackathon.venue && hackathon.format !== 'online' && (
                        <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-black/50 rounded border border-gray-800">
                          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mt-1 flex-shrink-0" style={{ color: accentColor }} />
                          <div className="min-w-0 flex-1">
                            <div className="font-press-start text-[10px] sm:text-xs mb-1" style={{ color: accentColor }}>VENUE</div>
                            <div className="text-xs sm:text-sm text-gray-300 font-jetbrains break-words">{hackathon.venue}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-black/50 rounded border border-gray-800">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 mt-1 flex-shrink-0" style={{ color: accentColor }} />
                        <div className="min-w-0 flex-1">
                          <div className="font-press-start text-[10px] sm:text-xs mb-1" style={{ color: accentColor }}>TEAM_SIZE</div>
                          <div className="text-xs sm:text-sm text-gray-300 font-jetbrains">
                            {hackathon.team_size_min || 1}-{hackathon.team_size_max || 4} members
                          </div>
                        </div>
                      </div>

                      {hackathon.registration_fee !== undefined && (
                        <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-black/50 rounded border border-gray-800">
                          <Trophy className="h-4 w-4 sm:h-5 sm:w-5 mt-1 flex-shrink-0" style={{ color: accentColor }} />
                          <div className="min-w-0 flex-1">
                            <div className="font-press-start text-[10px] sm:text-xs mb-1" style={{ color: accentColor }}>FEE</div>
                            <div className="text-xs sm:text-sm text-gray-300 font-jetbrains">
                              {hackathon.registration_fee === 0 ? 'FREE' : `₹${hackathon.registration_fee}`}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Connect Links */}
                    {(hackathon.discord_link || hackathon.whatsapp_link || hackathon.website_url || hackathon.contact_email) && (
                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-800">
                        <h4 
                          className="font-press-start text-xs sm:text-sm mb-3 sm:mb-4"
                          style={{
                            background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        >CONNECT</h4>
                        <div className="space-y-2">
                          {hackathon.discord_link && (
                            <a
                              href={hackathon.discord_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white px-3 sm:px-4 py-2 sm:py-3 font-press-start text-[10px] sm:text-xs transition-all flex items-center justify-center gap-2 border-2 w-full"
                              style={{ 
                                backgroundColor: primaryColor,
                                borderColor: primaryColor
                              }}
                            >
                              DISCORD
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                            </a>
                          )}

                          {hackathon.whatsapp_link && (
                            <a
                              href={hackathon.whatsapp_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className=" bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 sm:py-3 font-press-start text-[10px] sm:text-xs transition-all flex items-center justify-center gap-2 border-2 border-green-500 w-full"
                            >
                              WHATSAPP
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                            </a>
                          )}

                          {hackathon.website_url && (
                            <a
                              href={hackathon.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className=" bg-gray-700 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 sm:py-3 font-press-start text-[10px] sm:text-xs transition-all flex items-center justify-center gap-2 border-2 border-gray-600 w-full"
                            >
                              WEBSITE
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                            </a>
                          )}

                          {hackathon.contact_email && (
                            <a
                              href={`mailto:${hackathon.contact_email}`}
                              className=" bg-gray-700 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 sm:py-3 font-press-start text-[10px] sm:text-xs transition-all flex items-center justify-center gap-2 border-2 border-gray-600 w-full"
                            >
                              EMAIL
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Themes/Tags */}
                    {hackathon.themes && hackathon.themes.length > 0 && (
                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-800">
                        <h4 
                          className="font-press-start text-xs sm:text-sm mb-3 sm:mb-4"
                          style={{
                            background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        >THEMES</h4>
                        <div className="flex flex-wrap gap-2">
                          {hackathon.themes.map((theme, i) => (
                            <span 
                              key={i} 
                              className="inline-block border px-2 sm:px-3 py-1 rounded font-mono text-[10px] sm:text-xs break-words"
                              style={{
                                background: `linear-gradient(to right, ${primaryColor}20, ${secondaryColor}10)`,
                                borderColor: `${primaryColor}40`,
                                color: primaryColor
                              }}
                            >
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

        {/* Bottom CTA - Hide when hackathon has ended */}
        {!hackathon.winners_announced && (
          <section 
            className="py-8 sm:py-12 md:py-16 border-t-2 sm:border-t-4"
            style={{
              background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
              borderColor: `${accentColor}60`
            }}
          >
            <div className="container mx-auto px-3 sm:px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-press-start text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-3 sm:mb-4 break-words">
                  READY_TO_JOIN?
                </h2>
                <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90 font-jetbrains">
                  Register now and be part of this amazing hackathon!
                </p>
                <div className="max-w-md mx-auto">
                  <HackathonRegistration
                    hackathonId={hackathon.id}
                    hackathonName={hackathon.hackathon_name}
                    hackathonSlug={hackathon.slug}
                    teamSizeMin={hackathon.team_size_min || 1}
                    teamSizeMax={hackathon.team_size_max || 4}
                    registrationOpensAt={hackathon.registration_opens_at}
                    registrationClosesAt={hackathon.registration_closes_at}
                    registrationControl={hackathon.registration_control}
                    buildingControl={hackathon.building_control}
                    status={hackathon.status}
                    hackathon_status={hackathon.hackathon_status}
                    end_date={hackathon.end_date}
                    winnersAnnounced={hackathon.winners_announced}
                    winnersAnnouncedAt={hackathon.winners_announced_at}
                    onRegistrationChange={fetchHackathon}
                    onViewWinners={() => setActiveTab('winners')}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    accentColor={accentColor}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  );
}



