import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Save, 
  Send, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Trophy,
  Link as LinkIcon,
  FileText,
  Zap,
  Plus,
  X,
  Sparkles,
  Palette,
  UserPlus,
  Scale,
  Eye,
  BarChart3,
  Megaphone,
  Award,
  Download,
  Search,
  Globe
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';
import { deleteHackathonImage } from '@/lib/supabaseClient';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import DateTimePicker from '@/components/DateTimePicker';
import MultiOrganizerManager from '@/components/MultiOrganizerManager';
import RegistrationAnalytics from '@/components/RegistrationAnalytics';
import AnnouncementsManager from '@/components/AnnouncementsManager';
import OrganizerFeedbackViewer from '@/components/OrganizerFeedbackViewer';
import WinnersManager from '@/components/WinnersManager';
import CertificateGenerator from '@/components/CertificateGenerator';
import OrganizerInsights from '@/components/OrganizerInsights';
import SimplifiedJudgesManager from '@/components/SimplifiedJudgesManager';

interface HackathonData {
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
  eligibility?: string[];
  team_size_min?: number;
  team_size_max?: number;
  registration_fee?: number;
  max_participants?: number;
  expected_participants?: number;
  communication_channel?: string;
  communication_link?: string;
  tracks?: string;
  themes?: string[];
  open_innovation?: boolean;
  total_prize_pool?: string;
  prize_breakdown?: string;
  perks?: string[];
  judging_criteria?: string;
  judges_mentors?: string;
  discord_link?: string;
  whatsapp_link?: string;
  website_url?: string;
  submission_platform?: string;
  submission_platform_link?: string;
  contact_email?: string;
  key_rules?: string;
  rules_content?: string;
  eligibility_criteria?: string;
  submission_guidelines?: string;
  judging_process?: string;
  code_of_conduct?: string;
  sponsors?: string[];
  partners?: string[];
  faqs?: string;
  promo_video_link?: string;
  cover_image?: string;
  status: string;
  hackathon_status?: string;
  banner_image?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_style?: string;
  gallery_public?: boolean;
  auto_publish_gallery?: boolean;
}

interface Registration {
  id: number;
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  registration_type: 'individual' | 'team';
  status: 'pending' | 'confirmed' | 'checked_in' | 'cancelled' | 'waitlist';
  phone_number?: string;
  college_university?: string;
  registration_number: string;
  created_at: string;
  team?: {
    id: number;
    team_name: string;
    team_code: string;
  };
}

interface Submission {
  id: number;
  project_name: string;
  team_name?: string;
  status: string;
  created_at: string;
}

type DashboardTab = 
  | 'overview'
  | 'details'
  | 'schedule'
  | 'participation'
  | 'prizes'
  | 'rules'
  | 'tracks'
  | 'sponsors'
  | 'links'
  | 'branding'
  | 'team'
  | 'registrations'
  | 'submissions'
  | 'judges'
  | 'announcements'
  | 'analytics'
  | 'winners'
  | 'certificates'
  | 'feedback';

interface UserPermissions {
  isOwner: boolean;
  role: string;
  permissions: {
    can_view_judges: boolean;
    can_manage_judges: boolean;
    can_view_registrations: boolean;
    can_manage_registrations: boolean;
    can_view_submissions: boolean;
    can_manage_submissions: boolean;
    can_view_announcements: boolean;
    can_manage_announcements: boolean;
    can_view_analytics: boolean;
    can_view_winners: boolean;
    can_manage_winners: boolean;
    can_view_certificates: boolean;
    can_manage_certificates: boolean;
    can_view_feedback: boolean;
    can_view_settings: boolean;
    can_manage_settings: boolean;
  };
}

export default function UnifiedHackathonDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hackathon, setHackathon] = useState<HackathonData | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showGalleryPublishConfirm, setShowGalleryPublishConfirm] = useState(false);
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  
  const [themesInput, setThemesInput] = useState('');
  const [sponsorsInput, setSponsorsInput] = useState('');
  const [partnersInput, setPartnersInput] = useState('');
  const [perksInput, setPerksInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !user && !hackathon) {
      navigate('/login?redirect=/organizer/dashboard');
    }
  }, [user, authLoading, navigate, hackathon]);

  useEffect(() => {
    if (user && id && !hackathon) {
      fetchAllData();
    }
  }, [user, id]);

  useEffect(() => {
    if (hackathon) {
      if (hackathon.themes) setThemesInput(hackathon.themes.join(', '));
      if (hackathon.sponsors) setSponsorsInput(hackathon.sponsors.join('\n'));
      if (hackathon.partners) setPartnersInput(hackathon.partners.join('\n'));
      if (hackathon.perks) setPerksInput(hackathon.perks.join('\n'));
    }
  }, [hackathon?.themes, hackathon?.sponsors, hackathon?.partners, hackathon?.perks]);

  const fetchAllData = async () => {
    try {
      const headers = await getAuthHeaders();
      
      // Fetch hackathon data first (required for other calls)
      const hackathonRes = await fetch(`/api/organizer/hackathons/${id}`, { headers });
      const hackathonData = await hackathonRes.json();
      
      if (!hackathonRes.ok) {
        console.error('Hackathon fetch error:', hackathonData);
        toast({ title: "Error", description: hackathonData.message || `Failed to load hackathon (${hackathonRes.status})`, variant: "destructive" });
        navigate('/organizer/dashboard');
        return;
      }
      
      if (hackathonData.success) {
        setHackathon(hackathonData.data);
      } else {
        toast({ title: "Error", description: hackathonData.message || "Hackathon not found", variant: "destructive" });
        navigate('/organizer/dashboard');
        return;
      }

      // Fetch permissions, registrations, and submissions in parallel
      const [permissionsRes, regRes, subRes] = await Promise.all([
        fetch(`/api/organizer/hackathons/${id}/my-role`, { headers }).catch(() => null),
        fetch(`/api/organizer/hackathons/${id}/registrations`, { headers }),
        fetch(`/api/organizer/hackathons/${id}/submissions`, { headers })
      ]);

      // Handle permissions
      if (permissionsRes) {
        try {
          const permissionsData = await permissionsRes.json();
          if (permissionsData.success) {
            setUserPermissions(permissionsData.data);
          }
        } catch (permErr) {
          console.error('Permissions fetch error:', permErr);
        }
      }
      
      // Default permissions if not set
      if (!permissionsRes) {
        setUserPermissions({
          isOwner: true,
          role: 'owner',
          permissions: {
            can_view_judges: true,
            can_manage_judges: true,
            can_view_registrations: true,
            can_manage_registrations: true,
            can_view_submissions: true,
            can_manage_submissions: true,
            can_view_announcements: true,
            can_manage_announcements: true,
            can_view_analytics: true,
            can_view_winners: true,
            can_manage_winners: true,
            can_view_certificates: true,
            can_manage_certificates: true,
            can_view_feedback: true,
            can_view_settings: true,
            can_manage_settings: true,
          }
        });
      }

      // Handle registrations
      const regData = await regRes.json();
      if (regData.success) setRegistrations(regData.data || []);

      // Handle submissions
      const subData = await subRes.json();
      if (subData.success) setSubmissions(subData.data || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: "Error", description: "Failed to load hackathon data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!hackathon) return;
    setSaving(true);
    
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(hackathon),
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: "Saved!", description: "Your changes have been saved." });
        setHackathon(data.data);
      } else {
        throw new Error(data.message || 'Failed to save');
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || 'Failed to save changes', variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleRequestPublish = async () => {
    setShowPublishConfirm(false);
    if (!hackathon) return;

    try {
      setSaving(true);
      const headers = await getAuthHeaders();
      
      await fetch(`/api/organizer/hackathons/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(hackathon),
      });

      const response = await fetch(`/api/organizer/hackathons/${id}/request-publish`, {
        method: 'POST',
        headers,
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: "Request Sent!", description: "Your hackathon has been submitted for review." });
        navigate('/organizer/dashboard');
      } else {
        throw new Error(data.message || 'Failed to request publication');
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleMakeGalleryPublic = async () => {
    setShowGalleryPublishConfirm(false);
    if (!hackathon) return;

    try {
      setSaving(true);
      const headers = await getAuthHeaders();
      
      const response = await fetch(`/api/organizer/hackathons/${id}/publish-gallery`, {
        method: 'POST',
        headers,
      });

      const data = await response.json();

      if (response.ok) {
        toast({ 
          title: "Gallery Published!", 
          description: "Project gallery is now public and judges have been notified." 
        });
        setHackathon(prev => prev ? { ...prev, gallery_public: true } : null);
        fetchAllData();
      } else {
        throw new Error(data.message || 'Failed to publish gallery');
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAutoPublish = async (enabled: boolean) => {
    if (!hackathon) return;

    try {
      setSaving(true);
      const headers = await getAuthHeaders();
      
      const response = await fetch(`/api/organizer/hackathons/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ auto_publish_gallery: enabled }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({ 
          title: enabled ? "Auto-Publish Enabled" : "Auto-Publish Disabled", 
          description: enabled 
            ? "Gallery will automatically go public when hackathon ends (UTC)." 
            : "You will need to manually publish the gallery after the hackathon ends."
        });
        setHackathon(prev => prev ? { ...prev, auto_publish_gallery: enabled } : null);
      } else {
        throw new Error(data.message || 'Failed to update setting');
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setHackathon(prev => prev ? { ...prev, [field]: value } : null);
  };

  const exportRegistrationsToCSV = () => {
    const headers = ['Registration #', 'Name', 'Email', 'Phone', 'College', 'Type', 'Team', 'Status', 'Registered At'];
    const rows = registrations.map(reg => [
      reg.registration_number,
      reg.full_name,
      reg.email,
      reg.phone_number || '',
      reg.college_university || '',
      reg.registration_type,
      reg.team?.team_name || 'N/A',
      reg.status,
      new Date(reg.created_at).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hackathon-${id}-registrations.csv`;
    a.click();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-press-start text-purple-400">LOADING...</div>
      </div>
    );
  }

  if (!hackathon) return null;

  const stats = {
    registrations: registrations.length,
    confirmed: registrations.filter(r => r.status === 'confirmed').length,
    submissions: submissions.length,
    checkedIn: registrations.filter(r => r.status === 'checked_in').length,
  };

  const canPublish = hackathon.status === 'draft' || hackathon.status === 'rejected';
  
  // All dates are stored and compared in UTC
  // No timezone conversion needed - dates are already in UTC
  const parseAsUTC = (dateStr: string) => {
    return new Date(dateStr);
  };
  
  // Check if hackathon has ended based on end_date (UTC)
  const endDate = parseAsUTC(hackathon.end_date);
  const hasEnded = !isNaN(endDate.getTime()) && new Date() > endDate;
  
  // isLive only if published AND not ended
  const isLive = (hackathon.status === 'published' || hackathon.hackathon_status === 'live') && !hasEnded;
  
  // Determine display state for badge
  const displayState = hasEnded ? 'ENDED' : 
    (hackathon.status === 'published' || hackathon.hackathon_status === 'live') ? 'LIVE' : 
    hackathon.status?.toUpperCase().replace('_', ' ') || 'DRAFT';
  
  const requiredFieldsFilled = hackathon.hackathon_name && 
    hackathon.description?.trim() !== '' &&
    hackathon.start_date && 
    hackathon.end_date;

  // Check if user can edit (owner, co-organizer, or admin - not viewer)
  const canEdit = userPermissions?.isOwner || 
    (userPermissions?.role !== 'viewer' && userPermissions?.permissions?.can_manage_registrations);

  const editTabs = canEdit ? [
    { id: 'overview' as DashboardTab, label: 'OVERVIEW', icon: Eye },
    { id: 'details' as DashboardTab, label: 'DETAILS', icon: FileText },
    { id: 'schedule' as DashboardTab, label: 'SCHEDULE', icon: Calendar },
    { id: 'participation' as DashboardTab, label: 'PARTICIPATION', icon: Users },
    { id: 'prizes' as DashboardTab, label: 'PRIZES', icon: Trophy },
    { id: 'rules' as DashboardTab, label: 'RULES', icon: Sparkles },
    { id: 'tracks' as DashboardTab, label: 'TRACKS', icon: Zap },
    { id: 'sponsors' as DashboardTab, label: 'SPONSORS', icon: Trophy },
    { id: 'links' as DashboardTab, label: 'LINKS', icon: LinkIcon },
    { id: 'branding' as DashboardTab, label: 'BRANDING', icon: Palette },
    // Only show team management tab for owners
    ...(userPermissions?.isOwner ? [{ id: 'team' as DashboardTab, label: 'TEAM', icon: UserPlus }] : []),
  ] : [
    // Viewer only sees overview
    { id: 'overview' as DashboardTab, label: 'OVERVIEW', icon: Eye },
  ];

  // Build manageTabs based on permissions
  const manageTabs = [
    // Registrations - only if can view
    ...(userPermissions?.isOwner || userPermissions?.permissions?.can_view_registrations 
      ? [{ id: 'registrations' as DashboardTab, label: 'REGISTRATIONS', icon: Users }] 
      : []),
    // Submissions - only if can view
    ...(userPermissions?.isOwner || userPermissions?.permissions?.can_view_submissions 
      ? [{ id: 'submissions' as DashboardTab, label: 'SUBMISSIONS', icon: FileText }] 
      : []),
    // Judges - only if can view judges (owner only by default)
    ...(userPermissions?.isOwner || userPermissions?.permissions?.can_view_judges 
      ? [{ id: 'judges' as DashboardTab, label: 'JUDGES', icon: Scale }] 
      : []),
    // Announcements - only if can view
    ...(userPermissions?.isOwner || userPermissions?.permissions?.can_view_announcements 
      ? [{ id: 'announcements' as DashboardTab, label: 'ANNOUNCEMENTS', icon: Megaphone }] 
      : []),
    // Analytics - available to all roles including viewer
    ...(userPermissions?.isOwner || userPermissions?.permissions?.can_view_analytics 
      ? [{ id: 'analytics' as DashboardTab, label: 'ANALYTICS', icon: BarChart3 }] 
      : []),
    // Winners - only if can view
    ...(userPermissions?.isOwner || userPermissions?.permissions?.can_view_winners 
      ? [{ id: 'winners' as DashboardTab, label: 'WINNERS', icon: Award }] 
      : []),
    // Certificates - only if can view
    ...(userPermissions?.isOwner || userPermissions?.permissions?.can_view_certificates 
      ? [{ id: 'certificates' as DashboardTab, label: 'CERTIFICATES', icon: Award }] 
      : []),
    // Feedback - only if can view
    ...(userPermissions?.isOwner || userPermissions?.permissions?.can_view_feedback 
      ? [{ id: 'feedback' as DashboardTab, label: 'FEEDBACK', icon: FileText }] 
      : []),
  ];


  return (
    <>
      <SEO
        title={`${hackathon.hackathon_name} - Dashboard`}
        description="Manage your hackathon"
      />

      <div className="min-h-screen bg-black text-white pt-24 pb-12 relative overflow-hidden">
        <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/organizer/dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-purple-400 font-press-start text-xs transition-all duration-300 group mb-6"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-all" />
              <span>BACK_TO_DASHBOARD</span>
            </button>

            <div className="bg-gradient-to-r from-gray-900 to-black border-2 border-purple-500/50 p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="font-press-start text-xl sm:text-2xl text-purple-400 mb-3">
                    {hackathon.hackathon_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 font-press-start text-xs border ${
                      hasEnded ? 'bg-red-600/20 text-red-400 border-red-500/50' :
                      isLive ? 'bg-green-600/20 text-green-400 border-green-500/50' :
                      hackathon.status === 'pending_review' ? 'bg-yellow-600/20 text-yellow-400 border-yellow-500/50' :
                      'bg-gray-600/20 text-gray-400 border-gray-500/50'
                    }`}>
                      {displayState}
                    </span>
                    {hackathon.slug && (
                      <Link 
                        to={`/hackathon/${hackathon.slug}`}
                        target="_blank"
                        className="text-purple-400 hover:text-pink-400 font-jetbrains text-sm flex items-center gap-1"
                      >
                        <Globe className="h-4 w-4" />
                        View Public Page
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-pink-500 hover:bg-pink-400 text-black flex items-center gap-2 px-6 py-3 font-press-start text-sm transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'SAVING...' : 'SAVE'}
                  </button>

                  {canPublish && (
                    <button
                      onClick={() => setShowPublishConfirm(true)}
                      disabled={!requiredFieldsFilled}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center gap-2 px-6 py-3 font-press-start text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={!requiredFieldsFilled ? 'Please fill required fields' : 'Request publication'}
                    >
                      <Send className="h-4 w-4" />
                      GO_LIVE
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-500/30 p-4">
              <div className="text-2xl font-bold text-purple-300 mb-1 font-press-start">{stats.registrations}</div>
              <div className="text-xs text-gray-500 font-press-start">REGISTRATIONS</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/20 border border-green-500/30 p-4">
              <div className="text-2xl font-bold text-green-300 mb-1 font-press-start">{stats.confirmed}</div>
              <div className="text-xs text-gray-500 font-press-start">CONFIRMED</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/20 border border-cyan-500/30 p-4">
              <div className="text-2xl font-bold text-cyan-300 mb-1 font-press-start">{stats.submissions}</div>
              <div className="text-xs text-gray-500 font-press-start">SUBMISSIONS</div>
            </div>
            <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/20 border border-amber-500/30 p-4">
              <div className="text-2xl font-bold text-amber-300 mb-1 font-press-start">{stats.checkedIn}</div>
              <div className="text-xs text-gray-500 font-press-start">CHECKED_IN</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 space-y-4">
            {/* EDIT Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                <span className="font-press-start text-xs text-purple-400 px-2">EDIT</span>
                <div className="h-px flex-1 bg-gradient-to-l from-purple-500/50 to-transparent"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {editTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 font-press-start text-[10px] whitespace-nowrap transition-all duration-200 rounded-sm ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                          : 'bg-gray-900/80 text-gray-400 border border-gray-700/50 hover:border-purple-500/50 hover:text-purple-300 hover:bg-gray-800/80'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : ''}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MANAGE Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-gradient-to-r from-pink-500/50 to-transparent"></div>
                <span className="font-press-start text-xs text-pink-400 px-2">MANAGE</span>
                <div className="h-px flex-1 bg-gradient-to-l from-pink-500/50 to-transparent"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {manageTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 font-press-start text-[10px] whitespace-nowrap transition-all duration-200 rounded-sm ${
                        isActive
                          ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/25 scale-105'
                          : 'bg-gray-900/80 text-gray-400 border border-gray-700/50 hover:border-pink-500/50 hover:text-pink-300 hover:bg-gray-800/80'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : ''}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-purple-500/50 p-6 sm:p-8">
            {activeTab === 'overview' && (
              <OverviewTab 
                hackathon={hackathon} 
                stats={stats}
                isLive={isLive}
                hasEnded={hasEnded}
                onMakeGalleryPublic={() => setShowGalleryPublishConfirm(true)}
                onToggleAutoPublish={handleToggleAutoPublish}
              />
            )}

            {activeTab === 'details' && (
              <DetailsTab hackathon={hackathon} updateField={updateField} />
            )}

            {activeTab === 'schedule' && (
              <ScheduleTab hackathon={hackathon} updateField={updateField} />
            )}

            {activeTab === 'participation' && (
              <ParticipationTab hackathon={hackathon} updateField={updateField} />
            )}

            {activeTab === 'prizes' && (
              <PrizesTab hackathon={hackathon} updateField={updateField} />
            )}

            {activeTab === 'rules' && (
              <RulesTab hackathon={hackathon} updateField={updateField} />
            )}

            {activeTab === 'tracks' && (
              <TracksTab 
                hackathon={hackathon} 
                updateField={updateField}
                themesInput={themesInput}
                setThemesInput={setThemesInput}
              />
            )}

            {activeTab === 'sponsors' && (
              <SponsorsTab 
                hackathon={hackathon} 
                updateField={updateField}
                sponsorsInput={sponsorsInput}
                setSponsorsInput={setSponsorsInput}
                partnersInput={partnersInput}
                setPartnersInput={setPartnersInput}
                perksInput={perksInput}
                setPerksInput={setPerksInput}
              />
            )}

            {activeTab === 'links' && (
              <LinksTab hackathon={hackathon} updateField={updateField} />
            )}

            {activeTab === 'branding' && (
              <BrandingTab hackathon={hackathon} updateField={updateField} toast={toast} />
            )}

            {activeTab === 'team' && (
              <div className="space-y-8">
                <div className="bg-black/50 border-2 border-pink-500/30 p-4 mb-6">
                  <p className="font-jetbrains text-sm text-gray-300">
                    👥 <span className="text-pink-400 font-bold">Team Management:</span> Invite co-organizers to help manage your hackathon.
                  </p>
                </div>
                <MultiOrganizerManager hackathonId={hackathon.id} isOwner={true} />
              </div>
            )}

            {activeTab === 'registrations' && (
              <RegistrationsTab 
                registrations={registrations}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onExport={exportRegistrationsToCSV}
                onRefresh={fetchAllData}
              />
            )}

            {activeTab === 'submissions' && (
              <SubmissionsTab 
                hackathonId={hackathon.id}
                submissions={submissions}
                onRefresh={fetchAllData}
                galleryPublic={hackathon.gallery_public}
              />
            )}

            {activeTab === 'judges' && (
              <SimplifiedJudgesManager hackathonId={hackathon.id} />
            )}

            {activeTab === 'announcements' && (
              <AnnouncementsManager hackathonId={hackathon.id} />
            )}

            {activeTab === 'analytics' && (
              <RegistrationAnalytics hackathonId={hackathon.id} />
            )}

            {activeTab === 'winners' && (
              <WinnersManager hackathonId={hackathon.id} prizes={hackathon.prize_breakdown} />
            )}

            {activeTab === 'certificates' && (
              <CertificateGenerator hackathonId={hackathon.id} hackathonName={hackathon.hackathon_name} />
            )}

            {activeTab === 'feedback' && (
              <OrganizerFeedbackViewer hackathonId={hackathon.id} />
            )}
          </div>
        </div>
      </div>

      <Footer />

      <ConfirmDialog
        open={showPublishConfirm}
        onOpenChange={setShowPublishConfirm}
        title="REQUEST PUBLICATION"
        description="Your hackathon will be reviewed by our team. Once approved, it will be visible to all participants."
        confirmText="SUBMIT FOR REVIEW"
        cancelText="CANCEL"
        onConfirm={handleRequestPublish}
      />

      <ConfirmDialog
        open={showGalleryPublishConfirm}
        onOpenChange={setShowGalleryPublishConfirm}
        title="MAKE GALLERY PUBLIC"
        description="This will make all submitted projects visible to the public and automatically send scoring links to all judges. This action cannot be undone."
        confirmText="PUBLISH GALLERY"
        cancelText="CANCEL"
        onConfirm={handleMakeGalleryPublic}
      />
    </>
  );
}


// ============ TAB COMPONENTS ============

function OverviewTab({ 
  hackathon, 
  stats, 
  isLive,
  hasEnded,
  onMakeGalleryPublic,
  onToggleAutoPublish
}: { 
  hackathon: HackathonData; 
  stats: { registrations: number; confirmed: number; submissions: number; checkedIn: number };
  isLive: boolean;
  hasEnded: boolean;
  onMakeGalleryPublic: () => void;
  onToggleAutoPublish: (enabled: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-black/50 border-2 border-pink-500/30 p-4 mb-6">
        <p className="font-jetbrains text-sm text-gray-300">
          📊 <span className="text-pink-400 font-bold">Overview:</span> Quick summary of your hackathon status and key metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 border border-purple-500/30 p-6">
          <h3 className="font-press-start text-sm text-purple-400 mb-4">HACKATHON INFO</h3>
          <div className="space-y-3 font-jetbrains text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-white">{hackathon.hackathon_status || hackathon.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Format:</span>
              <span className="text-white">{hackathon.format || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Start Date (UTC):</span>
              <span className="text-white">{hackathon.start_date ? new Date(hackathon.start_date).toLocaleString('en-US', { timeZone: 'UTC' }) : 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">End Date (UTC):</span>
              <span className="text-white">{hackathon.end_date ? new Date(hackathon.end_date).toLocaleString('en-US', { timeZone: 'UTC' }) : 'Not set'}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <span className="text-xs text-gray-500">⏰ All times follow UTC timezone</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-purple-500/30 p-6">
          <h3 className="font-press-start text-sm text-purple-400 mb-4">GALLERY SETTINGS</h3>
          <div className="space-y-4">
            {/* Auto-Publish Toggle */}
            <div className="bg-black/50 border border-gray-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-press-start text-xs text-gray-300">AUTO-PUBLISH GALLERY</label>
                <button
                  onClick={() => onToggleAutoPublish(!hackathon.auto_publish_gallery)}
                  disabled={hackathon.gallery_public}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    hackathon.auto_publish_gallery 
                      ? 'bg-green-600' 
                      : 'bg-gray-600'
                  } ${hackathon.gallery_public ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    hackathon.auto_publish_gallery ? 'translate-x-8' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <p className="text-xs text-gray-500 font-jetbrains">
                {hackathon.auto_publish_gallery 
                  ? '✓ Gallery will automatically go public when hackathon ends (UTC). Judges will be notified immediately.'
                  : '○ You will need to manually click "Make Gallery Public" after the hackathon ends. This gives you time to moderate submissions first.'}
              </p>
            </div>

            {/* Gallery Status & Actions */}
            {hackathon.gallery_public ? (
              <div className="bg-green-900/30 border border-green-500/50 p-3 text-center">
                <span className="font-press-start text-xs text-green-400">✓ GALLERY IS PUBLIC</span>
                <p className="text-xs text-gray-400 font-jetbrains mt-1">Judges have been notified</p>
              </div>
            ) : hasEnded && !hackathon.auto_publish_gallery ? (
              <div className="space-y-3">
                <div className="bg-amber-900/30 border border-amber-500/50 p-3">
                  <p className="text-xs text-amber-400 font-jetbrains">
                    ⚠️ Hackathon has ended. Review and moderate submissions, then make the gallery public.
                  </p>
                </div>
                <button
                  onClick={onMakeGalleryPublic}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 font-press-start text-xs hover:from-green-500 hover:to-emerald-500 transition-all"
                >
                  🚀 MAKE GALLERY PUBLIC
                </button>
              </div>
            ) : hasEnded && hackathon.auto_publish_gallery ? (
              <div className="bg-blue-900/30 border border-blue-500/50 p-3 text-center">
                <span className="font-press-start text-xs text-blue-400">⏳ AUTO-PUBLISHING...</span>
                <p className="text-xs text-gray-400 font-jetbrains mt-1">Gallery will be published automatically</p>
              </div>
            ) : isLive ? (
              <div className="bg-purple-900/30 border border-purple-500/50 p-3 text-center">
                <span className="font-press-start text-xs text-purple-400">🔴 HACKATHON IN PROGRESS</span>
                <p className="text-xs text-gray-400 font-jetbrains mt-1">
                  {hackathon.auto_publish_gallery 
                    ? 'Gallery will auto-publish when hackathon ends'
                    : 'You can publish gallery after hackathon ends'}
                </p>
              </div>
            ) : (
              <div className="bg-gray-900/30 border border-gray-500/50 p-3 text-center">
                <span className="font-press-start text-xs text-gray-400">HACKATHON NOT STARTED</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailsTab({ hackathon, updateField }: { hackathon: HackathonData; updateField: (field: string, value: any) => void }) {
  return (
    <div className="space-y-8">
      <div className="bg-black/50 border-2 border-pink-500/30 p-4 mb-6">
        <p className="font-jetbrains text-sm text-gray-300">
          💡 <span className="text-pink-400 font-bold">Tip:</span> Make your hackathon stand out with a compelling name and description.
        </p>
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block flex items-center gap-2">
          <Zap className="h-4 w-4" />
          HACKATHON NAME *
        </label>
        <input
          type="text"
          value={hackathon.hackathon_name}
          onChange={(e) => updateField('hackathon_name', e.target.value)}
          placeholder="e.g., AI Innovation Hackathon 2025"
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
        />
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          TAGLINE
        </label>
        <input
          type="text"
          value={hackathon.tagline || ''}
          onChange={(e) => updateField('tagline', e.target.value)}
          placeholder="A catchy one-liner"
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
        />
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block flex items-center gap-2">
          <FileText className="h-4 w-4" />
          DESCRIPTION *
        </label>
        <textarea
          value={hackathon.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Tell participants what makes your hackathon special..."
          rows={10}
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none resize-none"
        />
        <p className="text-xs text-gray-500 mt-2 font-jetbrains">{hackathon.description?.length || 0} characters</p>
      </div>
    </div>
  );
}

function ScheduleTab({ hackathon, updateField }: { hackathon: HackathonData; updateField: (field: string, value: any) => void }) {
  return (
    <div className="space-y-8">
      <div className="bg-black/50 border-2 border-pink-500/30 p-4 mb-6">
        <p className="font-jetbrains text-sm text-gray-300">
          📅 <span className="text-pink-400 font-bold">Tip:</span> Registration and submissions are automatically managed based on these dates.
          <br />
          <span className="text-xs text-gray-500 mt-1 block">⏰ All times follow UTC timezone. Make sure to convert your local time to UTC.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-press-start text-sm text-purple-400 mb-3 block flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            START DATE & TIME (UTC) *
          </label>
          <input
            type="datetime-local"
            value={hackathon.start_date?.slice(0, 16)}
            onChange={(e) => updateField('start_date', e.target.value ? new Date(e.target.value + 'Z').toISOString() : null)}
            className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
          />
        </div>

        <div>
          <label className="font-press-start text-sm text-purple-400 mb-3 block flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            END DATE & TIME (UTC) *
          </label>
          <input
            type="datetime-local"
            value={hackathon.end_date?.slice(0, 16)}
            onChange={(e) => updateField('end_date', e.target.value ? new Date(e.target.value + 'Z').toISOString() : null)}
            className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          FORMAT *
        </label>
        <div className="grid grid-cols-3 gap-4">
          {['online', 'offline', 'hybrid'].map((format) => (
            <button
              key={format}
              onClick={() => updateField('format', format)}
              className={`py-4 font-press-start text-sm transition-colors ${
                hackathon.format === format
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {(hackathon.format === 'offline' || hackathon.format === 'hybrid') && (
        <div>
          <label className="font-press-start text-sm text-pink-400 mb-3 block">VENUE ADDRESS</label>
          <input
            type="text"
            value={hackathon.venue || ''}
            onChange={(e) => updateField('venue', e.target.value)}
            placeholder="Full venue address"
            className="w-full bg-black border-2 border-pink-500/50 text-white px-6 py-4 font-jetbrains focus:border-purple-500 outline-none"
          />
        </div>
      )}
    </div>
  );
}


function ParticipationTab({ hackathon, updateField }: { hackathon: HackathonData; updateField: (field: string, value: any) => void }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-press-start text-sm text-purple-400 mb-3 block">MIN TEAM SIZE</label>
          <input
            type="number"
            min="1"
            value={hackathon.team_size_min || 1}
            onChange={(e) => updateField('team_size_min', parseInt(e.target.value))}
            className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
          />
        </div>

        <div>
          <label className="font-press-start text-sm text-purple-400 mb-3 block">MAX TEAM SIZE</label>
          <input
            type="number"
            min="1"
            value={hackathon.team_size_max || 4}
            onChange={(e) => updateField('team_size_max', parseInt(e.target.value))}
            className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-press-start text-sm text-purple-400 mb-3 block">REGISTRATION FEE (₹)</label>
          <input
            type="number"
            min="0"
            value={hackathon.registration_fee || 0}
            onChange={(e) => updateField('registration_fee', parseInt(e.target.value))}
            className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1 font-jetbrains">0 = Free</p>
        </div>

        <div>
          <label className="font-press-start text-sm text-purple-400 mb-3 block">MAX PARTICIPANTS</label>
          <input
            type="number"
            min="0"
            value={hackathon.max_participants || ''}
            onChange={(e) => updateField('max_participants', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="Leave empty for unlimited"
            className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">COMMUNICATION CHANNEL</label>
        <input
          type="text"
          value={hackathon.communication_channel || ''}
          onChange={(e) => updateField('communication_channel', e.target.value)}
          placeholder="e.g., Discord, WhatsApp, Slack"
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
        />
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">COMMUNICATION LINK</label>
        <input
          type="url"
          value={hackathon.communication_link || ''}
          onChange={(e) => updateField('communication_link', e.target.value)}
          placeholder="https://discord.gg/..."
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
        />
      </div>
    </div>
  );
}

function PrizesTab({ hackathon, updateField }: { hackathon: HackathonData; updateField: (field: string, value: any) => void }) {
  const prizes = JSON.parse(hackathon.prize_breakdown || '[]');
  
  const addPrize = () => {
    const newPrizes = [...prizes, { position: '', amount: '', description: '' }];
    updateField('prize_breakdown', JSON.stringify(newPrizes));
  };

  const updatePrize = (index: number, field: string, value: string) => {
    const newPrizes = [...prizes];
    newPrizes[index][field] = value;
    updateField('prize_breakdown', JSON.stringify(newPrizes));
  };

  const removePrize = (index: number) => {
    const newPrizes = prizes.filter((_: any, i: number) => i !== index);
    updateField('prize_breakdown', JSON.stringify(newPrizes));
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">TOTAL PRIZE POOL</label>
        <input
          type="text"
          value={hackathon.total_prize_pool || ''}
          onChange={(e) => updateField('total_prize_pool', e.target.value)}
          placeholder="e.g., ₹50,000 or $5,000"
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
        />
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-4 flex items-center justify-between">
          <span>PRIZE BREAKDOWN</span>
          <button
            type="button"
            onClick={addPrize}
            className="bg-pink-500 text-black px-4 py-2 font-press-start text-xs hover:bg-pink-400 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            ADD_PRIZE
          </button>
        </label>

        <div className="space-y-4">
          {prizes.map((prize: any, index: number) => (
            <div key={index} className="bg-gray-900 border-2 border-gray-700 p-6 relative">
              <button
                type="button"
                onClick={() => removePrize(index)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-400"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-jetbrains text-xs text-gray-400 mb-2 block">Position</label>
                  <input
                    type="text"
                    value={prize.position}
                    onChange={(e) => updatePrize(index, 'position', e.target.value)}
                    placeholder="1st Place"
                    className="w-full bg-black border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-pink-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-jetbrains text-xs text-gray-400 mb-2 block">Amount</label>
                  <input
                    type="text"
                    value={prize.amount}
                    onChange={(e) => updatePrize(index, 'amount', e.target.value)}
                    placeholder="₹20,000"
                    className="w-full bg-black border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-pink-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-jetbrains text-xs text-gray-400 mb-2 block">Description</label>
                  <input
                    type="text"
                    value={prize.description}
                    onChange={(e) => updatePrize(index, 'description', e.target.value)}
                    placeholder="Winner"
                    className="w-full bg-black border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-pink-500 outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          {prizes.length === 0 && (
            <div className="text-center py-8 text-gray-500 font-jetbrains">
              No prizes added yet. Click "ADD_PRIZE" to add your first prize.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RulesTab({ hackathon, updateField }: { hackathon: HackathonData; updateField: (field: string, value: any) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">ELIGIBILITY CRITERIA</label>
        <textarea
          value={hackathon.eligibility_criteria || ''}
          onChange={(e) => updateField('eligibility_criteria', e.target.value)}
          placeholder="Who can participate?"
          rows={6}
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none resize-none"
        />
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">SUBMISSION GUIDELINES</label>
        <textarea
          value={hackathon.submission_guidelines || ''}
          onChange={(e) => updateField('submission_guidelines', e.target.value)}
          placeholder="What participants need to submit..."
          rows={8}
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none resize-none"
        />
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">JUDGING PROCESS</label>
        <textarea
          value={hackathon.judging_process || ''}
          onChange={(e) => updateField('judging_process', e.target.value)}
          placeholder="How projects will be evaluated..."
          rows={8}
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none resize-none"
        />
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">CODE OF CONDUCT</label>
        <textarea
          value={hackathon.code_of_conduct || ''}
          onChange={(e) => updateField('code_of_conduct', e.target.value)}
          placeholder="Expected behavior and community guidelines..."
          rows={6}
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none resize-none"
        />
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">RULES & REGULATIONS</label>
        <textarea
          value={hackathon.rules_content || ''}
          onChange={(e) => updateField('rules_content', e.target.value)}
          placeholder="Detailed rules and regulations..."
          rows={10}
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none resize-none"
        />
      </div>
    </div>
  );
}


function TracksTab({ 
  hackathon, 
  updateField,
  themesInput,
  setThemesInput
}: { 
  hackathon: HackathonData; 
  updateField: (field: string, value: any) => void;
  themesInput: string;
  setThemesInput: (value: string) => void;
}) {
  const handleThemesBlur = () => {
    const themes = themesInput.split(',').map(t => t.trim()).filter(t => t);
    updateField('themes', themes);
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">THEMES / TRACKS</label>
        <input
          type="text"
          value={themesInput}
          onChange={(e) => setThemesInput(e.target.value)}
          onBlur={handleThemesBlur}
          placeholder="AI, Web3, Healthcare, Education (comma separated)"
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
        />
        <p className="text-xs text-gray-500 mt-2 font-jetbrains">Separate themes with commas</p>
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block flex items-center gap-3">
          <span>OPEN INNOVATION</span>
          <input
            type="checkbox"
            checked={hackathon.open_innovation || false}
            onChange={(e) => updateField('open_innovation', e.target.checked)}
            className="w-5 h-5 accent-pink-500"
          />
        </label>
        <p className="text-xs text-gray-500 font-jetbrains">Allow participants to build anything, not just within specified themes</p>
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">TRACKS DESCRIPTION</label>
        <textarea
          value={hackathon.tracks || ''}
          onChange={(e) => updateField('tracks', e.target.value)}
          placeholder="Describe each track in detail..."
          rows={10}
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none resize-none"
        />
      </div>
    </div>
  );
}

function SponsorsTab({ 
  hackathon, 
  updateField,
  sponsorsInput,
  setSponsorsInput,
  partnersInput,
  setPartnersInput,
  perksInput,
  setPerksInput
}: { 
  hackathon: HackathonData; 
  updateField: (field: string, value: any) => void;
  sponsorsInput: string;
  setSponsorsInput: (value: string) => void;
  partnersInput: string;
  setPartnersInput: (value: string) => void;
  perksInput: string;
  setPerksInput: (value: string) => void;
}) {
  const handleSponsorsBlur = () => {
    const sponsors = sponsorsInput.split('\n').map(s => s.trim()).filter(s => s);
    updateField('sponsors', sponsors);
  };

  const handlePartnersBlur = () => {
    const partners = partnersInput.split('\n').map(p => p.trim()).filter(p => p);
    updateField('partners', partners);
  };

  const handlePerksBlur = () => {
    const perks = perksInput.split('\n').map(p => p.trim()).filter(p => p);
    updateField('perks', perks);
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">SPONSORS</label>
        <textarea
          value={sponsorsInput}
          onChange={(e) => setSponsorsInput(e.target.value)}
          onBlur={handleSponsorsBlur}
          placeholder="One sponsor per line"
          rows={6}
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none resize-none"
        />
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">PARTNERS</label>
        <textarea
          value={partnersInput}
          onChange={(e) => setPartnersInput(e.target.value)}
          onBlur={handlePartnersBlur}
          placeholder="One partner per line"
          rows={6}
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none resize-none"
        />
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">PERKS</label>
        <textarea
          value={perksInput}
          onChange={(e) => setPerksInput(e.target.value)}
          onBlur={handlePerksBlur}
          placeholder="One perk per line (e.g., Free domain, Cloud credits)"
          rows={6}
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none resize-none"
        />
      </div>
    </div>
  );
}

function LinksTab({ hackathon, updateField }: { hackathon: HackathonData; updateField: (field: string, value: any) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">WEBSITE URL</label>
        <input
          type="url"
          value={hackathon.website_url || ''}
          onChange={(e) => updateField('website_url', e.target.value)}
          placeholder="https://yourhackathon.com"
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
        />
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">DISCORD LINK</label>
        <input
          type="url"
          value={hackathon.discord_link || ''}
          onChange={(e) => updateField('discord_link', e.target.value)}
          placeholder="https://discord.gg/..."
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
        />
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">WHATSAPP LINK</label>
        <input
          type="url"
          value={hackathon.whatsapp_link || ''}
          onChange={(e) => updateField('whatsapp_link', e.target.value)}
          placeholder="https://chat.whatsapp.com/..."
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
        />
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">CONTACT EMAIL</label>
        <input
          type="email"
          value={hackathon.contact_email || ''}
          onChange={(e) => updateField('contact_email', e.target.value)}
          placeholder="contact@yourhackathon.com"
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
        />
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">PROMO VIDEO LINK</label>
        <input
          type="url"
          value={hackathon.promo_video_link || ''}
          onChange={(e) => updateField('promo_video_link', e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
        />
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">SUBMISSION PLATFORM</label>
        <input
          type="text"
          value={hackathon.submission_platform || ''}
          onChange={(e) => updateField('submission_platform', e.target.value)}
          placeholder="e.g., Devpost, Devfolio"
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
        />
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">SUBMISSION PLATFORM LINK</label>
        <input
          type="url"
          value={hackathon.submission_platform_link || ''}
          onChange={(e) => updateField('submission_platform_link', e.target.value)}
          placeholder="https://devpost.com/..."
          className="w-full bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-pink-500 outline-none"
        />
      </div>
    </div>
  );
}


function BrandingTab({ 
  hackathon, 
  updateField,
  toast
}: { 
  hackathon: HackathonData; 
  updateField: (field: string, value: any) => void;
  toast: any;
}) {
  const handleImageUpload = async (field: string, file: File) => {
    try {
      // Map field name to image type
      const imageType = field === 'cover_image' ? 'cover' : field === 'banner_image' ? 'banner' : 'logo';
      
      // Convert file to base64
      const reader = new FileReader();
      const fileData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Upload via server API (bypasses RLS)
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathon.id}/upload-image`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileData,
          fileName: file.name,
          fileType: file.type,
          imageType,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      updateField(field, data.url);
      toast({ title: "Success", description: "Image uploaded successfully" });
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleImageDelete = async (field: string) => {
    try {
      const imageType = field === 'cover_image' ? 'cover' : field === 'banner_image' ? 'banner' : 'logo';
      await deleteHackathonImage(hackathon.id, imageType);
      updateField(field, null);
      toast({ title: "Success", description: "Image removed" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-black/50 border-2 border-pink-500/30 p-4 mb-6">
        <p className="font-jetbrains text-sm text-gray-300">
          🎨 <span className="text-pink-400 font-bold">Branding:</span> Customize the look and feel of your hackathon page.
        </p>
      </div>

      <div>
        <label className="font-press-start text-sm text-purple-400 mb-3 block">BANNER IMAGE</label>
        <p className="text-xs text-gray-500 font-jetbrains mb-3">This image appears at the top of your hackathon's public page. Recommended size: 1920x400px</p>
        <div className="border-2 border-dashed border-gray-700 p-6 text-center">
          {hackathon.banner_image ? (
            <div className="relative">
              <img src={hackathon.banner_image} alt="Banner" className="w-full h-40 object-cover mb-4" />
              <button
                onClick={() => handleImageDelete('banner_image')}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="py-8">
              <p className="text-gray-500 font-jetbrains mb-4">No banner image</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageUpload('banner_image', e.target.files[0])}
            className="hidden"
            id="banner-upload"
          />
          <label
            htmlFor="banner-upload"
            className="bg-purple-600 text-white px-4 py-2 font-press-start text-xs cursor-pointer hover:bg-purple-500"
          >
            UPLOAD
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="font-press-start text-sm text-purple-400 mb-3 block">PRIMARY COLOR</label>
          <input
            type="color"
            value={hackathon.primary_color || '#8B5CF6'}
            onChange={(e) => updateField('primary_color', e.target.value)}
            className="w-full h-12 cursor-pointer"
          />
        </div>

        <div>
          <label className="font-press-start text-sm text-purple-400 mb-3 block">SECONDARY COLOR</label>
          <input
            type="color"
            value={hackathon.secondary_color || '#EC4899'}
            onChange={(e) => updateField('secondary_color', e.target.value)}
            className="w-full h-12 cursor-pointer"
          />
        </div>

        <div>
          <label className="font-press-start text-sm text-purple-400 mb-3 block">ACCENT COLOR</label>
          <input
            type="color"
            value={hackathon.accent_color || '#06B6D4'}
            onChange={(e) => updateField('accent_color', e.target.value)}
            className="w-full h-12 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

function RegistrationsTab({ 
  registrations,
  searchQuery,
  setSearchQuery,
  onExport,
  onRefresh
}: { 
  registrations: Registration[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onExport: () => void;
  onRefresh: () => void;
}) {
  const filteredRegistrations = registrations.filter(reg => 
    reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.registration_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search registrations..."
            className="w-full bg-black border-2 border-gray-700 text-white pl-10 pr-4 py-2 font-jetbrains focus:border-pink-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="bg-gray-800 text-white px-4 py-2 font-press-start text-xs hover:bg-gray-700"
          >
            REFRESH
          </button>
          <button
            onClick={onExport}
            className="bg-green-600 text-white px-4 py-2 font-press-start text-xs hover:bg-green-500 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            EXPORT CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 font-press-start text-xs text-purple-400">REG #</th>
              <th className="text-left py-3 px-4 font-press-start text-xs text-purple-400">NAME</th>
              <th className="text-left py-3 px-4 font-press-start text-xs text-purple-400">EMAIL</th>
              <th className="text-left py-3 px-4 font-press-start text-xs text-purple-400">TYPE</th>
              <th className="text-left py-3 px-4 font-press-start text-xs text-purple-400">STATUS</th>
              <th className="text-left py-3 px-4 font-press-start text-xs text-purple-400">DATE</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.map((reg) => (
              <tr key={reg.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                <td className="py-3 px-4 font-jetbrains text-sm text-gray-300">{reg.registration_number}</td>
                <td className="py-3 px-4 font-jetbrains text-sm text-white">{reg.full_name}</td>
                <td className="py-3 px-4 font-jetbrains text-sm text-gray-300">{reg.email}</td>
                <td className="py-3 px-4 font-jetbrains text-sm text-gray-300">{reg.registration_type}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs font-press-start ${
                    reg.status === 'confirmed' ? 'bg-green-900/50 text-green-400' :
                    reg.status === 'checked_in' ? 'bg-blue-900/50 text-blue-400' :
                    reg.status === 'cancelled' ? 'bg-red-900/50 text-red-400' :
                    'bg-gray-900/50 text-gray-400'
                  }`}>
                    {reg.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 font-jetbrains text-sm text-gray-300">
                  {new Date(reg.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12 text-gray-500 font-jetbrains">
            {searchQuery ? 'No registrations match your search' : 'No registrations yet'}
          </div>
        )}
      </div>
    </div>
  );
}

function SubmissionsTab({ 
  hackathonId,
  submissions: initialSubmissions,
  onRefresh,
  galleryPublic
}: { 
  hackathonId: number;
  submissions: Submission[];
  onRefresh: () => void;
  galleryPublic?: boolean;
}) {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSubmission, setExpandedSubmission] = useState<number | null>(null);
  const [showScoresSection, setShowScoresSection] = useState(true);
  const [showSubmissionsSection, setShowSubmissionsSection] = useState(false);
  const [showModerationSection, setShowModerationSection] = useState(true);
  const [scoresSearch, setScoresSearch] = useState('');
  const [submissionsSearch, setSubmissionsSearch] = useState('');
  const [moderationSearch, setModerationSearch] = useState('');
  const [disqualifyingId, setDisqualifyingId] = useState<number | null>(null);
  const [disqualifyReason, setDisqualifyReason] = useState('');
  const [showDisqualifyModal, setShowDisqualifyModal] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);

  useEffect(() => {
    fetchSubmissionsWithScores();
  }, [hackathonId]);

  const fetchSubmissionsWithScores = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/submissions`, { headers });
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchSubmissionsWithScores();
    onRefresh();
  };

  const handleDisqualify = async (submissionId: number) => {
    try {
      setDisqualifyingId(submissionId);
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/submissions/${submissionId}/disqualify`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ reason: disqualifyReason || 'Disqualified by organizer' }),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Submission Disqualified", description: "The submission has been marked as disqualified." });
        setShowDisqualifyModal(false);
        setDisqualifyReason('');
        setSelectedSubmissionId(null);
        handleRefresh();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setDisqualifyingId(null);
    }
  };

  const handleReinstate = async (submissionId: number) => {
    try {
      setDisqualifyingId(submissionId);
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/submissions/${submissionId}/reinstate`, {
        method: 'POST',
        headers,
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Submission Reinstated", description: "The submission is now eligible for judging." });
        handleRefresh();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setDisqualifyingId(null);
    }
  };

  const filteredScores = submissions.filter(sub => 
    sub.project_name?.toLowerCase().includes(scoresSearch.toLowerCase()) ||
    sub.team?.team_name?.toLowerCase().includes(scoresSearch.toLowerCase()) ||
    sub.user_name?.toLowerCase().includes(scoresSearch.toLowerCase())
  );

  const filteredSubmissions = submissions.filter(sub => 
    sub.project_name?.toLowerCase().includes(submissionsSearch.toLowerCase()) ||
    sub.team?.team_name?.toLowerCase().includes(submissionsSearch.toLowerCase()) ||
    sub.user_name?.toLowerCase().includes(submissionsSearch.toLowerCase())
  );

  // Filter for moderation - only submitted projects (not drafts)
  const moderationSubmissions = submissions.filter(sub => 
    (sub.status === 'submitted' || sub.status === 'disqualified') &&
    (sub.project_name?.toLowerCase().includes(moderationSearch.toLowerCase()) ||
    sub.team?.team_name?.toLowerCase().includes(moderationSearch.toLowerCase()) ||
    sub.user_name?.toLowerCase().includes(moderationSearch.toLowerCase()))
  );

  const eligibleCount = submissions.filter(s => s.status === 'submitted').length;
  const disqualifiedCount = submissions.filter(s => s.status === 'disqualified').length;

  if (loading) {
    return <div className="text-center py-8 font-press-start text-gray-400">LOADING...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-press-start text-sm text-purple-400">PROJECT SUBMISSIONS ({submissions.length})</h3>
        <button
          onClick={handleRefresh}
          className="bg-gray-800 text-white px-4 py-2 font-press-start text-xs hover:bg-gray-700"
        >
          REFRESH
        </button>
      </div>

      {/* Moderation Section - Only show if gallery is not public */}
      {!galleryPublic && (
        <div className="border border-amber-500/30 overflow-hidden">
          <button
            onClick={() => setShowModerationSection(!showModerationSection)}
            className="w-full bg-gradient-to-r from-amber-900/40 to-orange-900/20 p-4 flex items-center justify-between hover:from-amber-900/50 hover:to-orange-900/30 transition-all"
          >
            <h3 className="font-press-start text-sm text-amber-400 flex items-center gap-2">
              ⚖️ PROJECT MODERATION ({eligibleCount} eligible, {disqualifiedCount} disqualified)
            </h3>
            <span className="text-amber-400 font-press-start text-xs">
              {showModerationSection ? '▼ COLLAPSE' : '▶ EXPAND'}
            </span>
          </button>
          
          {showModerationSection && (
            <div className="bg-gradient-to-br from-amber-900/10 to-orange-900/5 p-4">
              <div className="bg-black/50 border border-amber-500/30 p-3 mb-4">
                <p className="text-xs text-amber-300 font-jetbrains">
                  ⚠️ <span className="font-bold">Moderation:</span> Review and disqualify projects before making the gallery public. 
                  Disqualified projects will not be visible to judges or in the public gallery.
                </p>
              </div>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={moderationSearch}
                  onChange={(e) => setModerationSearch(e.target.value)}
                  placeholder="Search projects to moderate..."
                  className="w-full bg-black/50 border border-amber-500/30 text-white pl-10 pr-4 py-2 font-jetbrains text-sm focus:border-amber-400 outline-none"
                />
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {moderationSubmissions.map((sub) => (
                  <div key={sub.id} className={`bg-black/30 border p-3 ${
                    sub.status === 'disqualified' ? 'border-red-500/50' : 'border-amber-500/20'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="font-jetbrains text-white font-bold">{sub.project_name}</span>
                        <div className="text-xs text-gray-400">
                          {sub.team?.team_name || sub.user_name}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-press-start ${
                          sub.status === 'disqualified' 
                            ? 'bg-red-900/50 text-red-400' 
                            : 'bg-green-900/50 text-green-400'
                        }`}>
                          {sub.status === 'disqualified' ? 'DISQUALIFIED' : 'ELIGIBLE'}
                        </span>
                        {sub.status === 'disqualified' ? (
                          <button
                            onClick={() => handleReinstate(sub.id)}
                            disabled={disqualifyingId === sub.id}
                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 font-press-start text-xs disabled:opacity-50"
                          >
                            {disqualifyingId === sub.id ? '...' : 'REINSTATE'}
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedSubmissionId(sub.id);
                              setShowDisqualifyModal(true);
                            }}
                            disabled={disqualifyingId === sub.id}
                            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 font-press-start text-xs disabled:opacity-50"
                          >
                            DISQUALIFY
                          </button>
                        )}
                      </div>
                    </div>
                    {sub.status === 'disqualified' && sub.feedback && (
                      <div className="mt-2 text-xs text-red-400 font-jetbrains italic">
                        Reason: {sub.feedback}
                      </div>
                    )}
                  </div>
                ))}
                
                {moderationSubmissions.length === 0 && (
                  <div className="text-center py-4 text-gray-500 font-jetbrains text-sm">
                    {moderationSearch ? 'No projects match your search' : 'No submitted projects to moderate'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Disqualify Modal */}
      {showDisqualifyModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border-2 border-red-500/50 p-6 max-w-md w-full mx-4">
            <h3 className="font-press-start text-sm text-red-400 mb-4">DISQUALIFY SUBMISSION</h3>
            <p className="text-sm text-gray-300 font-jetbrains mb-4">
              Are you sure you want to disqualify this submission? It will be hidden from judges and the public gallery.
            </p>
            <div className="mb-4">
              <label className="font-press-start text-xs text-gray-400 mb-2 block">REASON (OPTIONAL)</label>
              <textarea
                value={disqualifyReason}
                onChange={(e) => setDisqualifyReason(e.target.value)}
                placeholder="Enter reason for disqualification..."
                rows={3}
                className="w-full bg-black border border-gray-700 text-white px-4 py-2 font-jetbrains text-sm focus:border-red-500 outline-none resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDisqualifyModal(false);
                  setDisqualifyReason('');
                  setSelectedSubmissionId(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 font-press-start text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={() => selectedSubmissionId && handleDisqualify(selectedSubmissionId)}
                disabled={disqualifyingId !== null}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 font-press-start text-xs disabled:opacity-50"
              >
                {disqualifyingId ? 'PROCESSING...' : 'DISQUALIFY'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Public Notice */}
      {galleryPublic && (
        <div className="bg-green-900/30 border border-green-500/50 p-4">
          <p className="text-sm text-green-400 font-jetbrains">
            ✓ <span className="font-bold">Gallery is public.</span> Moderation is no longer available. 
            All eligible submissions are visible to judges and the public.
          </p>
        </div>
      )}

      {/* Judge Scores Breakdown - Collapsible */}
      <div className="border border-purple-500/30 overflow-hidden">
        <button
          onClick={() => setShowScoresSection(!showScoresSection)}
          className="w-full bg-gradient-to-r from-purple-900/40 to-pink-900/20 p-4 flex items-center justify-between hover:from-purple-900/50 hover:to-pink-900/30 transition-all"
        >
          <h3 className="font-press-start text-sm text-purple-400 flex items-center gap-2">
            <Scale className="h-4 w-4" />
            JUDGE SCORES BREAKDOWN ({submissions.length})
          </h3>
          <span className="text-purple-400 font-press-start text-xs">
            {showScoresSection ? '▼ COLLAPSE' : '▶ EXPAND'}
          </span>
        </button>
        
        {showScoresSection && (
          <div className="bg-gradient-to-br from-purple-900/10 to-pink-900/5 p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={scoresSearch}
                onChange={(e) => setScoresSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full bg-black/50 border border-purple-500/30 text-white pl-10 pr-4 py-2 font-jetbrains text-sm focus:border-purple-400 outline-none"
              />
            </div>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredScores.map((sub) => (
                <div key={sub.id} className="bg-black/30 border border-purple-500/20 p-3">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedSubmission(expandedSubmission === sub.id ? null : sub.id)}
                  >
                    <div className="flex-1">
                      <span className="font-jetbrains text-white font-bold">{sub.project_name}</span>
                      <div className="text-xs text-gray-400">
                        {sub.team?.team_name || sub.user_name} • {sub.judges_count || 0} judge(s)
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-press-start text-sm text-amber-400">
                        AVG: {(sub.average_score || sub.score)?.toFixed(1) || 'N/A'}
                      </span>
                      <span className="text-purple-400 text-xs">
                        {expandedSubmission === sub.id ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>
                  
                  {expandedSubmission === sub.id && sub.judge_scores && sub.judge_scores.length > 0 && (
                    <div className="space-y-2 mt-3 border-t border-purple-500/20 pt-3">
                      {sub.judge_scores.map((js: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-black/20 p-2 rounded">
                          <span className="text-gray-300 font-jetbrains">{js.judge_name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-purple-300 font-press-start text-xs">{js.score}/10</span>
                            {js.notes && (
                              <span className="text-gray-500 text-xs italic max-w-[200px] truncate" title={js.notes}>
                                "{js.notes}"
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {expandedSubmission === sub.id && (!sub.judge_scores || sub.judge_scores.length === 0) && (
                    <div className="text-xs text-gray-500 italic mt-2 pt-2 border-t border-purple-500/20">
                      No scores yet
                    </div>
                  )}
                </div>
              ))}
              
              {filteredScores.length === 0 && (
                <div className="text-center py-4 text-gray-500 font-jetbrains text-sm">
                  {scoresSearch ? 'No projects match your search' : 'No submissions yet'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submissions Grid - Collapsible */}
      <div className="border border-gray-700 overflow-hidden">
        <button
          onClick={() => setShowSubmissionsSection(!showSubmissionsSection)}
          className="w-full bg-gradient-to-r from-gray-800 to-gray-900 p-4 flex items-center justify-between hover:from-gray-700 hover:to-gray-800 transition-all"
        >
          <h3 className="font-press-start text-sm text-gray-300 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            ALL SUBMISSIONS ({submissions.length})
          </h3>
          <span className="text-gray-400 font-press-start text-xs">
            {showSubmissionsSection ? '▼ COLLAPSE' : '▶ EXPAND'}
          </span>
        </button>
        
        {showSubmissionsSection && (
          <div className="bg-gray-900/50 p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={submissionsSearch}
                onChange={(e) => setSubmissionsSearch(e.target.value)}
                placeholder="Search submissions..."
                className="w-full bg-black/50 border border-gray-600 text-white pl-10 pr-4 py-2 font-jetbrains text-sm focus:border-gray-400 outline-none"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
              {filteredSubmissions.map((submission) => (
                <div key={submission.id} className="bg-gray-900 border border-gray-700 p-4">
                  <h4 className="font-press-start text-sm text-white mb-2">{submission.project_name}</h4>
                  {(submission.team?.team_name || submission.user_name) && (
                    <p className="font-jetbrains text-xs text-gray-400 mb-2">
                      {submission.team?.team_name ? `Team: ${submission.team.team_name}` : submission.user_name}
                    </p>
                  )}
                  <div className="flex justify-between items-center mb-2">
                    <span className={`px-2 py-1 text-xs font-press-start ${
                      submission.status === 'submitted' ? 'bg-green-900/50 text-green-400' :
                      'bg-gray-900/50 text-gray-400'
                    }`}>
                      {submission.status?.toUpperCase() || 'DRAFT'}
                    </span>
                    <span className="font-press-start text-xs text-amber-400">
                      {(submission.average_score || submission.score)?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                  <span className="font-jetbrains text-xs text-gray-500">
                    {submission.created_at ? new Date(submission.created_at).toLocaleDateString() : ''}
                  </span>
                </div>
              ))}
            </div>
            
            {filteredSubmissions.length === 0 && (
              <div className="text-center py-4 text-gray-500 font-jetbrains text-sm">
                {submissionsSearch ? 'No submissions match your search' : 'No submissions yet'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
