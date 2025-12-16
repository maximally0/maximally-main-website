import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  MessageSquare,
  Zap,
  Plus,
  X,
  Clock,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import DateTimePicker from '@/components/DateTimePicker';

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
  registration_opens_at?: string;
  registration_closes_at?: string;
  building_starts_at?: string;
  building_ends_at?: string;
  submission_opens_at?: string;
  submission_closes_at?: string;
  judging_starts_at?: string;
  judging_ends_at?: string;
  results_announced_at?: string;
}

export default function EditHackathon() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hackathon, setHackathon] = useState<HackathonData | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [themesInput, setThemesInput] = useState('');
  const [sponsorsInput, setSponsorsInput] = useState('');
  const [partnersInput, setPartnersInput] = useState('');
  const [perksInput, setPerksInput] = useState('');

  // Only redirect on initial load, not on subsequent auth changes
  useEffect(() => {
    if (!authLoading && !user && !hackathon) {
      navigate('/login?redirect=/organizer/dashboard');
    }
  }, [user, authLoading, navigate, hackathon]);

  useEffect(() => {
    // Only fetch if we don't have hackathon data yet
    if (user && id && !hackathon) {
      fetchHackathon();
    }
  }, [user, id]);

  // Initialize input states when hackathon data is loaded
  useEffect(() => {
    if (hackathon) {
      if (hackathon.themes) {
        setThemesInput(hackathon.themes.join(', '));
      }
      if (hackathon.sponsors) {
        setSponsorsInput(hackathon.sponsors.join('\n'));
      }
      if (hackathon.partners) {
        setPartnersInput(hackathon.partners.join('\n'));
      }
      if (hackathon.perks) {
        setPerksInput(hackathon.perks.join('\n'));
      }
    }
  }, [hackathon?.themes, hackathon?.sponsors, hackathon?.partners, hackathon?.perks]);

  const fetchHackathon = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${id}`, { headers });
      const data = await response.json();

      if (data.success) {
        // Only set hackathon if we don't already have data (prevent overwriting user edits)
        setHackathon(prev => prev ? prev : data.data);
      } else {
        toast({
          title: "Error",
          description: "Hackathon not found",
          variant: "destructive",
        });
        navigate('/organizer/dashboard');
      }
    } catch (error) {
      console.error('Error fetching hackathon:', error);
      toast({
        title: "Error",
        description: "Failed to load hackathon",
        variant: "destructive",
      });
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
        toast({
          title: "Saved!",
          description: "Your changes have been saved.",
        });
        setHackathon(data.data);
      } else if (data.requiresEditRequest) {
        // Published hackathon - need to submit edit request
        toast({
          title: "Edit Request Required",
          description: "This hackathon is published. Please submit an edit request.",
          variant: "destructive",
        });
      } else {
        throw new Error(data.message || 'Failed to save');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to save changes',
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRequestEdit = async () => {
    if (!hackathon) return;

    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      console.log('Submitting edit request for hackathon:', id);
      console.log('Changes:', hackathon);
      
      const response = await fetch(`/api/organizer/hackathons/${id}/request-edit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          changes: hackathon,
          reason: 'Update hackathon information'
        }),
      });

      console.log('Edit request response status:', response.status);
      const data = await response.json();
      console.log('Edit request response data:', data);

      if (response.ok) {
        toast({
          title: "Edit Request Submitted!",
          description: "Your edit request has been sent to admins for review.",
        });
        navigate('/organizer/dashboard');
      } else {
        throw new Error(data.message || 'Failed to submit edit request');
      }
    } catch (error: any) {
      console.error('Edit request error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to submit edit request',
        variant: "destructive",
      });
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
      
      // First, save the current changes
      const saveResponse = await fetch(`/api/organizer/hackathons/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(hackathon),
      });

      if (!saveResponse.ok) {
        const saveData = await saveResponse.json();
        throw new Error(saveData.message || 'Failed to save changes before publishing');
      }

      // Then request publication
      const response = await fetch(`/api/organizer/hackathons/${id}/request-publish`, {
        method: 'POST',
        headers,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Request Sent!",
          description: "Your hackathon has been submitted for review.",
        });
        navigate('/organizer/dashboard');
      } else {
        throw new Error(data.message || 'Failed to request publication');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setHackathon(prev => prev ? { ...prev, [field]: value } : null);
  };

  // Switch tabs without auto-save to avoid validation errors
  const handleTabChange = (newTab: string) => {
    if (activeTab !== newTab) {
      setActiveTab(newTab);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-press-start text-maximally-red">LOADING...</div>
      </div>
    );
  }

  if (!hackathon) {
    return null;
  }

  const tabs = [
    { id: 'basic', label: 'BASIC INFO', icon: FileText },
    { id: 'schedule', label: 'SCHEDULE', icon: Calendar },
    { id: 'participation', label: 'PARTICIPATION', icon: Users },
    { id: 'prizes', label: 'PRIZES', icon: Trophy },
    { id: 'rules', label: 'RULES', icon: Sparkles },
    { id: 'tracks', label: 'TRACKS', icon: Zap },
    { id: 'sponsors', label: 'SPONSORS', icon: Trophy },
    { id: 'links', label: 'LINKS', icon: LinkIcon },
    { id: 'timeline', label: 'TIMELINE', icon: Clock },
  ];

  const canPublish = hackathon.status === 'draft' || hackathon.status === 'rejected';
  
  // Check if required fields are filled
  const requiredFieldsFilled = hackathon.hackathon_name && 
    hackathon.description && 
    hackathon.description.trim() !== '' &&
    hackathon.start_date && 
    hackathon.end_date;

  return (
    <>
      <SEO
        title={`Edit ${hackathon.hackathon_name} - Maximally`}
        description="Edit your hackathon details"
      />

      <div className="min-h-screen bg-black text-white pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/organizer/dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-maximally-red font-press-start text-xs transition-all duration-300 group mb-6"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 group-hover:scale-110 transition-all" />
              <span>BACK_TO_DASHBOARD</span>
            </button>

            <div className="pixel-card bg-gradient-to-r from-gray-900 to-black border-4 border-maximally-red p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="font-press-start text-xl sm:text-2xl md:text-3xl text-maximally-red mb-3">
                    {hackathon.hackathon_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="pixel-card bg-black border-2 border-maximally-yellow px-3 py-1">
                      <span className="font-press-start text-xs text-maximally-yellow">
                        {hackathon.status.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>
                    {saving && (
                      <span className="font-jetbrains text-sm text-gray-400 animate-pulse">
                        💾 Saving...
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  {hackathon.status === 'published' ? (
                    <button
                      onClick={handleRequestEdit}
                      disabled={saving}
                      className="pixel-button bg-maximally-yellow text-black flex items-center gap-2 px-6 py-3 font-press-start text-sm hover:bg-maximally-red hover:text-white transition-colors disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                      {saving ? 'SUBMITTING...' : 'REQUEST_EDIT'}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="pixel-button bg-maximally-yellow text-black flex items-center gap-2 px-6 py-3 font-press-start text-sm hover:bg-maximally-red hover:text-white transition-colors disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? 'SAVING...' : 'SAVE'}
                      </button>

                      {canPublish && (
                        <button
                          onClick={() => setShowPublishConfirm(true)}
                          disabled={!requiredFieldsFilled}
                          className="pixel-button bg-maximally-red text-white flex items-center gap-2 px-6 py-3 font-press-start text-sm hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={!requiredFieldsFilled ? 'Please fill in Name, Description, Start Date, and End Date' : 'Request publication'}
                        >
                          <Send className="h-4 w-4" />
                          PUBLISH
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Required Fields Indicator */}
          {!requiredFieldsFilled && (
            <div className="pixel-card bg-maximally-yellow/10 border-2 border-maximally-yellow p-4 mb-6">
              <p className="font-press-start text-xs text-maximally-yellow mb-2">⚠️ REQUIRED FIELDS</p>
              <p className="font-jetbrains text-sm text-gray-300">
                Please fill in: Name, Description, Start Date, and End Date before requesting publication
              </p>
            </div>
          )}

          {/* Tabs - Maximally Style */}
          <div className="flex gap-0 mb-8 overflow-x-auto pb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative flex items-center justify-center gap-2 px-6 py-4 font-press-start text-xs whitespace-nowrap transition-all border-b-4 ${
                    isActive
                      ? 'bg-maximally-red text-white border-maximally-yellow shadow-lg shadow-maximally-red/50'
                      : 'bg-gray-900 text-gray-400 border-transparent hover:bg-gray-800 hover:text-gray-300'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-maximally-yellow rotate-45" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-maximally-red p-6 sm:p-8 relative overflow-hidden group">
            {/* Animated glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-maximally-red via-maximally-yellow to-maximally-red opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500" />
            
            {/* Corner decorations */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-maximally-yellow animate-pulse" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-maximally-yellow animate-pulse delay-200" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-maximally-yellow animate-pulse delay-400" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-maximally-yellow animate-pulse delay-600" />

            <div className="relative z-10">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-8">
                  <div className="pixel-card bg-black/50 border-2 border-maximally-yellow/30 p-4 mb-6">
                    <p className="font-jetbrains text-sm text-gray-300">
                      💡 <span className="text-maximally-yellow font-bold">Tip:</span> Make your hackathon stand out with a compelling name and description. This is what participants will see first!
                    </p>
                  </div>

                  <div>
                    <label className="font-press-start text-sm text-maximally-red mb-3 block flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      HACKATHON NAME *
                    </label>
                    <input
                      type="text"
                      value={hackathon.hackathon_name}
                      onChange={(e) => updateField('hackathon_name', e.target.value)}
                      className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains text-lg focus:border-maximally-yellow outline-none transition-colors"
                      placeholder="e.g., AI Innovation Hackathon 2025"
                    />
                  </div>

                  <div>
                    <label className="font-press-start text-sm text-maximally-red mb-3 block flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      TAGLINE
                    </label>
                    <input
                      type="text"
                      value={hackathon.tagline || ''}
                      onChange={(e) => updateField('tagline', e.target.value)}
                      placeholder="A catchy one-liner that captures your hackathon's essence"
                      className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-maximally-yellow outline-none transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-2 font-jetbrains">
                      Example: "Build the future of AI in 48 hours"
                    </p>
                  </div>

                  <div>
                    <label className="font-press-start text-sm text-maximally-red mb-3 block flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      DESCRIPTION
                    </label>
                    <textarea
                      value={hackathon.description || ''}
                      onChange={(e) => updateField('description', e.target.value)}
                      rows={10}
                      placeholder="Tell participants what makes your hackathon special. Include:&#10;• What they'll build&#10;• Who should participate&#10;• What they'll learn&#10;• Why they should join"
                      className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-maximally-yellow outline-none resize-none leading-relaxed"
                    />
                    <p className="text-xs text-gray-500 mt-2 font-jetbrains">
                      {hackathon.description?.length || 0} characters
                    </p>
                  </div>
                </div>
              )}

              {/* Schedule Tab */}
              {activeTab === 'schedule' && (
                <div className="space-y-8">
                  <div className="pixel-card bg-black/50 border-2 border-maximally-yellow/30 p-4 mb-6">
                    <p className="font-jetbrains text-sm text-gray-300">
                      📅 <span className="text-maximally-yellow font-bold">Tip:</span> Choose dates carefully! Make sure to give participants enough time to build something amazing.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-press-start text-sm text-maximally-red mb-3 block flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        START DATE & TIME *
                      </label>
                      <input
                        type="datetime-local"
                        value={hackathon.start_date?.slice(0, 16)}
                        onChange={(e) => updateField('start_date', e.target.value)}
                        className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains text-lg focus:border-maximally-yellow outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="font-press-start text-sm text-maximally-red mb-3 block flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        END DATE & TIME *
                      </label>
                      <input
                        type="datetime-local"
                        value={hackathon.end_date?.slice(0, 16)}
                        onChange={(e) => updateField('end_date', e.target.value)}
                        className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains text-lg focus:border-maximally-yellow outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-press-start text-sm text-maximally-red mb-3 block flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      FORMAT *
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {['online', 'offline', 'hybrid'].map((format) => (
                        <button
                          key={format}
                          type="button"
                          onClick={() => updateField('format', format)}
                          className={`pixel-button py-4 font-press-start text-sm transition-colors ${
                            hackathon.format === format
                              ? 'bg-maximally-red text-white'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          {format.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(hackathon.format === 'offline' || hackathon.format === 'hybrid') && (
                    <div className="pixel-card bg-maximally-yellow/10 border-2 border-maximally-yellow p-6">
                      <label className="font-press-start text-sm text-maximally-yellow mb-3 block">
                        VENUE ADDRESS
                      </label>
                      <input
                        type="text"
                        value={hackathon.venue || ''}
                        onChange={(e) => updateField('venue', e.target.value)}
                        placeholder="Full venue address with city and state"
                        className="w-full pixel-card bg-black border-2 border-maximally-yellow text-white px-6 py-4 font-jetbrains focus:border-maximally-red outline-none transition-colors"
                      />
                    </div>
                  )}

                  <div className="pixel-card bg-blue-900/20 border-2 border-blue-500 p-4">
                    <p className="font-jetbrains text-sm text-blue-300">
                      💡 <span className="text-blue-400 font-bold">Note:</span> Registration timing is now controlled by the Timeline tab. Set registration open/close dates there for strict enforcement.
                    </p>
                  </div>
                </div>
              )}

            {/* Participation Tab */}
            {activeTab === 'participation' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-press-start text-sm text-maximally-red mb-2 block">
                      MIN TEAM SIZE
                    </label>
                    <input
                      type="number"
                      value={hackathon.team_size_min || 1}
                      onChange={(e) => updateField('team_size_min', parseInt(e.target.value))}
                      min="1"
                      className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-press-start text-sm text-maximally-red mb-2 block">
                      MAX TEAM SIZE
                    </label>
                    <input
                      type="number"
                      value={hackathon.team_size_max || 4}
                      onChange={(e) => updateField('team_size_max', parseInt(e.target.value))}
                      min="1"
                      className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-press-start text-sm text-maximally-red mb-2 block">
                      REGISTRATION FEE (₹)
                    </label>
                    <input
                      type="number"
                      value={hackathon.registration_fee || 0}
                      onChange={(e) => updateField('registration_fee', parseInt(e.target.value))}
                      min="0"
                      className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1 font-jetbrains">0 = Free</p>
                  </div>

                  <div>
                    <label className="font-press-start text-sm text-maximally-red mb-2 block">
                      MAX PARTICIPANTS
                    </label>
                    <input
                      type="number"
                      value={hackathon.max_participants || ''}
                      onChange={(e) => updateField('max_participants', e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="Leave empty for unlimited"
                      className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-2 block">
                    COMMUNICATION CHANNEL
                  </label>
                  <input
                    type="text"
                    value={hackathon.communication_channel || ''}
                    onChange={(e) => updateField('communication_channel', e.target.value)}
                    placeholder="e.g., Discord, WhatsApp, Slack"
                    className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  />
                </div>

                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-2 block">
                    COMMUNICATION LINK
                  </label>
                  <input
                    type="url"
                    value={hackathon.communication_link || ''}
                    onChange={(e) => updateField('communication_link', e.target.value)}
                    placeholder="https://discord.gg/..."
                    className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  />
                </div>
              </div>
            )}

            {/* Prizes Tab */}
            {activeTab === 'prizes' && (
              <div className="space-y-8">
                <div className="pixel-card bg-black/50 border-2 border-maximally-yellow/30 p-4 mb-6">
                  <p className="font-jetbrains text-sm text-gray-300">
                    🏆 <span className="text-maximally-yellow font-bold">Tip:</span> Add prizes to attract more participants. You can add multiple prize positions.
                  </p>
                </div>

                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-3 block">
                    TOTAL PRIZE POOL
                  </label>
                  <input
                    type="text"
                    value={hackathon.total_prize_pool || ''}
                    onChange={(e) => updateField('total_prize_pool', e.target.value)}
                    placeholder="e.g., ₹50,000 or $5,000"
                    className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains text-lg focus:border-maximally-yellow outline-none"
                  />
                </div>

                {/* Prize Breakdown Builder */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="font-press-start text-sm text-maximally-red">
                      PRIZE BREAKDOWN
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const prizes = JSON.parse(hackathon.prize_breakdown || '[]');
                        prizes.push({ position: '', amount: '', description: '' });
                        updateField('prize_breakdown', JSON.stringify(prizes));
                      }}
                      className="pixel-button bg-maximally-yellow text-black px-4 py-2 font-press-start text-xs hover:bg-maximally-red hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      ADD_PRIZE
                    </button>
                  </div>

                  <div className="space-y-4">
                    {JSON.parse(hackathon.prize_breakdown || '[]').map((prize: any, index: number) => (
                      <div key={index} className="pixel-card bg-gray-900 border-2 border-gray-700 p-6 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const prizes = JSON.parse(hackathon.prize_breakdown || '[]');
                            prizes.splice(index, 1);
                            updateField('prize_breakdown', JSON.stringify(prizes));
                          }}
                          className="absolute top-4 right-4 text-gray-500 hover:text-maximally-red transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="font-jetbrains text-xs text-gray-400 mb-2 block">
                              Position
                            </label>
                            <input
                              type="text"
                              value={prize.position}
                              onChange={(e) => {
                                const prizes = JSON.parse(hackathon.prize_breakdown || '[]');
                                prizes[index].position = e.target.value;
                                updateField('prize_breakdown', JSON.stringify(prizes));
                              }}
                              placeholder="1st Place"
                              className="w-full bg-black border border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-maximally-yellow outline-none"
                            />
                          </div>

                          <div>
                            <label className="font-jetbrains text-xs text-gray-400 mb-2 block">
                              Amount
                            </label>
                            <input
                              type="text"
                              value={prize.amount}
                              onChange={(e) => {
                                const prizes = JSON.parse(hackathon.prize_breakdown || '[]');
                                prizes[index].amount = e.target.value;
                                updateField('prize_breakdown', JSON.stringify(prizes));
                              }}
                              placeholder="₹20,000"
                              className="w-full bg-black border border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-maximally-yellow outline-none"
                            />
                          </div>

                          <div>
                            <label className="font-jetbrains text-xs text-gray-400 mb-2 block">
                              Description (Optional)
                            </label>
                            <input
                              type="text"
                              value={prize.description || ''}
                              onChange={(e) => {
                                const prizes = JSON.parse(hackathon.prize_breakdown || '[]');
                                prizes[index].description = e.target.value;
                                updateField('prize_breakdown', JSON.stringify(prizes));
                              }}
                              placeholder="Winner"
                              className="w-full bg-black border border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-maximally-yellow outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {JSON.parse(hackathon.prize_breakdown || '[]').length === 0 && (
                      <div className="text-center py-8 text-gray-500 font-jetbrains">
                        No prizes added yet. Click "ADD_PRIZE" to add your first prize.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Rules Tab */}
            {activeTab === 'rules' && (
              <div className="space-y-8">
                <div className="pixel-card bg-black/50 border-2 border-maximally-yellow/30 p-4 mb-6">
                  <p className="font-jetbrains text-sm text-gray-300">
                    📋 <span className="text-maximally-yellow font-bold">Tip:</span> Clear rules help participants understand what's expected and create a fair competition.
                  </p>
                </div>

                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-3 block flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    RULES & REGULATIONS
                  </label>
                  <textarea
                    value={hackathon.rules_content || ''}
                    onChange={(e) => updateField('rules_content', e.target.value)}
                    rows={10}
                    placeholder="Detailed rules and regulations for your hackathon:&#10;&#10;1. Team Formation&#10;   • Teams can have 1-4 members&#10;   • Team formation allowed until registration closes&#10;&#10;2. Project Requirements&#10;   • All code must be written during the event&#10;   • Projects must be original work&#10;   • Open source libraries are allowed&#10;&#10;3. Submission&#10;   • Submit before the deadline&#10;   • Include demo video and source code"
                    className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-maximally-yellow outline-none resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-3 block">
                    ELIGIBILITY CRITERIA
                  </label>
                  <textarea
                    value={hackathon.eligibility_criteria || ''}
                    onChange={(e) => updateField('eligibility_criteria', e.target.value)}
                    rows={6}
                    placeholder="Who can participate?&#10;&#10;• Open to students from all universities&#10;• Professionals and working individuals welcome&#10;• Must be 18 years or older&#10;• International participants allowed"
                    className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-maximally-yellow outline-none resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-3 block">
                    SUBMISSION GUIDELINES
                  </label>
                  <textarea
                    value={hackathon.submission_guidelines || ''}
                    onChange={(e) => updateField('submission_guidelines', e.target.value)}
                    rows={8}
                    placeholder="What participants need to submit:&#10;&#10;• Working prototype or demo&#10;• Source code repository (GitHub/GitLab)&#10;• Demo video (2-3 minutes)&#10;• Project documentation&#10;• Presentation slides (optional)"
                    className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-maximally-yellow outline-none resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-3 block">
                    JUDGING PROCESS
                  </label>
                  <textarea
                    value={hackathon.judging_process || ''}
                    onChange={(e) => updateField('judging_process', e.target.value)}
                    rows={8}
                    placeholder="How projects will be evaluated:&#10;&#10;Judging Criteria:&#10;• Innovation & Creativity (30%)&#10;• Technical Implementation (25%)&#10;• Design & User Experience (20%)&#10;• Impact & Usefulness (15%)&#10;• Presentation (10%)&#10;&#10;Process:&#10;• Initial screening by organizers&#10;• Top 10 teams present to judges&#10;• Winners announced at closing ceremony"
                    className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-maximally-yellow outline-none resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-3 block">
                    CODE OF CONDUCT
                  </label>
                  <textarea
                    value={hackathon.code_of_conduct || ''}
                    onChange={(e) => updateField('code_of_conduct', e.target.value)}
                    rows={6}
                    placeholder="Expected behavior and community guidelines:&#10;&#10;• Be respectful and inclusive&#10;• No harassment or discrimination&#10;• Collaborate and help others&#10;• Follow organizer instructions"
                    className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-maximally-yellow outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* FAQs Builder */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="font-press-start text-sm text-maximally-red">
                      FREQUENTLY ASKED QUESTIONS
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const faqs = JSON.parse(hackathon.faqs || '[]');
                        faqs.push({ question: '', answer: '' });
                        updateField('faqs', JSON.stringify(faqs));
                      }}
                      className="pixel-button bg-maximally-yellow text-black px-4 py-2 font-press-start text-xs hover:bg-maximally-red hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      ADD_FAQ
                    </button>
                  </div>

                  <div className="space-y-4">
                    {JSON.parse(hackathon.faqs || '[]').map((faq: any, index: number) => (
                      <div key={index} className="pixel-card bg-gray-900 border-2 border-gray-700 p-6 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const faqs = JSON.parse(hackathon.faqs || '[]');
                            faqs.splice(index, 1);
                            updateField('faqs', JSON.stringify(faqs));
                          }}
                          className="absolute top-4 right-4 text-gray-500 hover:text-maximally-red transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>

                        <div className="space-y-4">
                          <div>
                            <label className="font-jetbrains text-xs text-gray-400 mb-2 block">
                              Question
                            </label>
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => {
                                const faqs = JSON.parse(hackathon.faqs || '[]');
                                faqs[index].question = e.target.value;
                                updateField('faqs', JSON.stringify(faqs));
                              }}
                              placeholder="Can I participate alone?"
                              className="w-full bg-black border border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                            />
                          </div>

                          <div>
                            <label className="font-jetbrains text-xs text-gray-400 mb-2 block">
                              Answer
                            </label>
                            <textarea
                              value={faq.answer}
                              onChange={(e) => {
                                const faqs = JSON.parse(hackathon.faqs || '[]');
                                faqs[index].answer = e.target.value;
                                updateField('faqs', JSON.stringify(faqs));
                              }}
                              rows={3}
                              placeholder="Yes, solo participation is allowed!"
                              className="w-full bg-black border border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {JSON.parse(hackathon.faqs || '[]').length === 0 && (
                      <div className="text-center py-8 text-gray-500 font-jetbrains">
                        No FAQs added yet. Click "ADD_FAQ" to add your first question.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tracks Tab */}
            {activeTab === 'tracks' && (
              <div className="space-y-8">
                <div className="pixel-card bg-black/50 border-2 border-maximally-yellow/30 p-4 mb-6">
                  <p className="font-jetbrains text-sm text-gray-300">
                    🎯 <span className="text-maximally-yellow font-bold">Tip:</span> Tracks help participants focus on specific problem areas or technologies.
                  </p>
                </div>

                {/* Tracks Builder */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="font-press-start text-sm text-maximally-red flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      HACKATHON TRACKS
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const tracks = JSON.parse(hackathon.tracks || '[]');
                        tracks.push({ name: '', description: '', prize: '' });
                        updateField('tracks', JSON.stringify(tracks));
                      }}
                      className="pixel-button bg-maximally-yellow text-black px-4 py-2 font-press-start text-xs hover:bg-maximally-red hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      ADD_TRACK
                    </button>
                  </div>

                  <div className="space-y-4">
                    {JSON.parse(hackathon.tracks || '[]').map((track: any, index: number) => (
                      <div key={index} className="pixel-card bg-gray-900 border-2 border-gray-700 p-6 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const tracks = JSON.parse(hackathon.tracks || '[]');
                            tracks.splice(index, 1);
                            updateField('tracks', JSON.stringify(tracks));
                          }}
                          className="absolute top-4 right-4 text-gray-500 hover:text-maximally-red transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>

                        <div className="space-y-4">
                          <div>
                            <label className="font-jetbrains text-xs text-gray-400 mb-2 block">
                              Track Name
                            </label>
                            <input
                              type="text"
                              value={track.name}
                              onChange={(e) => {
                                const tracks = JSON.parse(hackathon.tracks || '[]');
                                tracks[index].name = e.target.value;
                                updateField('tracks', JSON.stringify(tracks));
                              }}
                              placeholder="AI & Machine Learning"
                              className="w-full bg-black border border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                            />
                          </div>

                          <div>
                            <label className="font-jetbrains text-xs text-gray-400 mb-2 block">
                              Description
                            </label>
                            <textarea
                              value={track.description}
                              onChange={(e) => {
                                const tracks = JSON.parse(hackathon.tracks || '[]');
                                tracks[index].description = e.target.value;
                                updateField('tracks', JSON.stringify(tracks));
                              }}
                              rows={3}
                              placeholder="Build intelligent solutions using AI/ML technologies"
                              className="w-full bg-black border border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none resize-none"
                            />
                          </div>

                          <div>
                            <label className="font-jetbrains text-xs text-gray-400 mb-2 block">
                              Prize (Optional)
                            </label>
                            <input
                              type="text"
                              value={track.prize || ''}
                              onChange={(e) => {
                                const tracks = JSON.parse(hackathon.tracks || '[]');
                                tracks[index].prize = e.target.value;
                                updateField('tracks', JSON.stringify(tracks));
                              }}
                              placeholder="₹20,000"
                              className="w-full bg-black border border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {JSON.parse(hackathon.tracks || '[]').length === 0 && (
                      <div className="text-center py-8 text-gray-500 font-jetbrains">
                        No tracks added yet. Click "ADD_TRACK" to add your first track.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-3 block">
                    THEMES/TAGS
                  </label>
                  <input
                    type="text"
                    value={themesInput}
                    onChange={(e) => {
                      setThemesInput(e.target.value);
                    }}
                    onBlur={() => {
                      // Clean up and update themes only on blur
                      const cleanedThemes = themesInput.split(',').map(t => t.trim()).filter(Boolean);
                      const cleanedInput = cleanedThemes.join(', ');
                      setThemesInput(cleanedInput);
                      updateField('themes', cleanedThemes);
                    }}
                    placeholder="AI, Web3, Healthcare, Education (comma separated)"
                    className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-maximally-yellow outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2 font-jetbrains">
                    Comma-separated theme tags for categorization
                  </p>
                </div>

                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-3 block flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hackathon.open_innovation || false}
                      onChange={(e) => updateField('open_innovation', e.target.checked)}
                      className="w-5 h-5"
                    />
                    OPEN INNOVATION
                  </label>
                  <p className="text-sm text-gray-400 font-jetbrains ml-7">
                    Allow participants to work on any idea, not restricted to specific tracks
                  </p>
                </div>
              </div>
            )}

            {/* Sponsors Tab */}
            {activeTab === 'sponsors' && (
              <div className="space-y-8">
                <div className="pixel-card bg-black/50 border-2 border-maximally-yellow/30 p-4 mb-6">
                  <p className="font-jetbrains text-sm text-gray-300">
                    🤝 <span className="text-maximally-yellow font-bold">Tip:</span> Showcase your sponsors and partners to give them visibility.
                  </p>
                </div>

                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-3 block flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    SPONSORS
                  </label>
                  <textarea
                    value={sponsorsInput}
                    onChange={(e) => {
                      setSponsorsInput(e.target.value);
                    }}
                    onBlur={() => {
                      // Clean up and update sponsors only on blur
                      const cleanedSponsors = sponsorsInput.split('\n').map(s => s.trim()).filter(Boolean);
                      const cleanedInput = cleanedSponsors.join('\n');
                      setSponsorsInput(cleanedInput);
                      updateField('sponsors', cleanedSponsors);
                    }}
                    rows={6}
                    placeholder="List sponsor names (one per line):&#10;Google Cloud&#10;GitHub&#10;Microsoft Azure&#10;AWS"
                    className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-maximally-yellow outline-none resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2 font-jetbrains">
                    One sponsor name per line
                  </p>
                </div>

                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-3 block">
                    PARTNERS
                  </label>
                  <textarea
                    value={partnersInput}
                    onChange={(e) => {
                      setPartnersInput(e.target.value);
                    }}
                    onBlur={() => {
                      // Clean up and update partners only on blur
                      const cleanedPartners = partnersInput.split('\n').map(p => p.trim()).filter(Boolean);
                      const cleanedInput = cleanedPartners.join('\n');
                      setPartnersInput(cleanedInput);
                      updateField('partners', cleanedPartners);
                    }}
                    rows={6}
                    placeholder="List partner organizations (one per line):&#10;IEEE Computer Society&#10;ACM Student Chapter&#10;Developer Student Clubs"
                    className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-maximally-yellow outline-none resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2 font-jetbrains">
                    One partner name per line
                  </p>
                </div>

                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-3 block">
                    PERKS & BENEFITS
                  </label>
                  <textarea
                    value={perksInput}
                    onChange={(e) => {
                      setPerksInput(e.target.value);
                    }}
                    onBlur={() => {
                      // Clean up and update perks only on blur
                      const cleanedPerks = perksInput.split('\n').map(p => p.trim()).filter(Boolean);
                      const cleanedInput = cleanedPerks.join('\n');
                      setPerksInput(cleanedInput);
                      updateField('perks', cleanedPerks);
                    }}
                    rows={6}
                    placeholder="List perks for participants (one per line):&#10;Free GitHub Pro for 6 months&#10;$100 AWS credits&#10;Free domain from Domain.com&#10;Exclusive swag kit"
                    className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-6 py-4 font-jetbrains focus:border-maximally-yellow outline-none resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2 font-jetbrains">
                    One perk per line
                  </p>
                </div>
              </div>
            )}

            {/* Links Tab */}
            {activeTab === 'links' && (
              <div className="space-y-6">
                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-2 block">
                    DISCORD LINK
                  </label>
                  <input
                    type="url"
                    value={hackathon.discord_link || ''}
                    onChange={(e) => updateField('discord_link', e.target.value)}
                    placeholder="https://discord.gg/..."
                    className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  />
                </div>

                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-2 block">
                    WHATSAPP LINK
                  </label>
                  <input
                    type="url"
                    value={hackathon.whatsapp_link || ''}
                    onChange={(e) => updateField('whatsapp_link', e.target.value)}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  />
                </div>

                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-2 block">
                    WEBSITE URL
                  </label>
                  <input
                    type="url"
                    value={hackathon.website_url || ''}
                    onChange={(e) => updateField('website_url', e.target.value)}
                    placeholder="https://yourhackathon.com"
                    className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  />
                </div>

                <div>
                  <label className="font-press-start text-sm text-maximally-red mb-2 block">
                    CONTACT EMAIL
                  </label>
                  <input
                    type="email"
                    value={hackathon.contact_email || ''}
                    onChange={(e) => updateField('contact_email', e.target.value)}
                    placeholder="contact@yourhackathon.com"
                    className="w-full pixel-card bg-black border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  />
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-8">
                <div className="pixel-card bg-black/50 border-2 border-maximally-yellow/30 p-4 mb-6">
                  <p className="font-jetbrains text-sm text-gray-300">
                    ⏰ <span className="text-maximally-yellow font-bold">Timeline:</span> Set important dates for your hackathon. These dates help participants know when to register, submit, and expect results.
                  </p>
                </div>

                {/* Registration Period */}
                <div className="pixel-card bg-gray-900 border-2 border-blue-500 p-6">
                  <h3 className="font-press-start text-lg text-blue-500 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    REGISTRATION_PERIOD
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Opens At</label>
                      <DateTimePicker
                        value={hackathon.registration_opens_at}
                        onChange={(date) => updateField('registration_opens_at', date)}
                        placeholder="Select registration opening date"
                      />
                    </div>
                    <div>
                      <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Closes At</label>
                      <DateTimePicker
                        value={hackathon.registration_closes_at}
                        onChange={(date) => updateField('registration_closes_at', date)}
                        placeholder="Select registration closing date"
                        minDate={hackathon.registration_opens_at ? new Date(hackathon.registration_opens_at) : undefined}
                      />
                    </div>
                  </div>
                </div>

                {/* Building/Hacking Phase */}
                <div className="pixel-card bg-gray-900 border-2 border-orange-500 p-6">
                  <h3 className="font-press-start text-lg text-orange-500 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    BUILDING_PHASE
                  </h3>
                  <p className="text-gray-400 font-jetbrains text-sm mb-4">
                    The hacking/building period when participants work on their projects. No registrations or submissions during this phase.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Starts At</label>
                      <DateTimePicker
                        value={hackathon.building_starts_at}
                        onChange={(date) => updateField('building_starts_at', date)}
                        placeholder="Select building phase start"
                        minDate={hackathon.registration_closes_at ? new Date(hackathon.registration_closes_at) : undefined}
                      />
                    </div>
                    <div>
                      <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Ends At</label>
                      <DateTimePicker
                        value={hackathon.building_ends_at}
                        onChange={(date) => updateField('building_ends_at', date)}
                        placeholder="Select building phase end"
                        minDate={hackathon.building_starts_at ? new Date(hackathon.building_starts_at) : undefined}
                      />
                    </div>
                  </div>
                </div>

                {/* Submission Period */}
                <div className="pixel-card bg-gray-900 border-2 border-green-500 p-6">
                  <h3 className="font-press-start text-lg text-green-500 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    SUBMISSION_PERIOD
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Opens At</label>
                      <DateTimePicker
                        value={hackathon.submission_opens_at}
                        onChange={(date) => updateField('submission_opens_at', date)}
                        placeholder="Select submission opening date"
                        minDate={hackathon.building_ends_at ? new Date(hackathon.building_ends_at) : (hackathon.registration_closes_at ? new Date(hackathon.registration_closes_at) : undefined)}
                      />
                    </div>
                    <div>
                      <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Closes At</label>
                      <DateTimePicker
                        value={hackathon.submission_closes_at}
                        onChange={(date) => updateField('submission_closes_at', date)}
                        placeholder="Select submission closing date"
                        minDate={hackathon.submission_opens_at ? new Date(hackathon.submission_opens_at) : undefined}
                      />
                    </div>
                  </div>
                </div>

                {/* Judging Period */}
                <div className="pixel-card bg-gray-900 border-2 border-purple-500 p-6">
                  <h3 className="font-press-start text-lg text-purple-500 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    JUDGING_PERIOD
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Starts At</label>
                      <DateTimePicker
                        value={hackathon.judging_starts_at}
                        onChange={(date) => updateField('judging_starts_at', date)}
                        placeholder="Select judging start date"
                        minDate={hackathon.submission_closes_at ? new Date(hackathon.submission_closes_at) : undefined}
                      />
                    </div>
                    <div>
                      <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Ends At</label>
                      <DateTimePicker
                        value={hackathon.judging_ends_at}
                        onChange={(date) => updateField('judging_ends_at', date)}
                        placeholder="Select judging end date"
                        minDate={hackathon.judging_starts_at ? new Date(hackathon.judging_starts_at) : undefined}
                      />
                    </div>
                  </div>
                </div>

                {/* Results Announcement */}
                <div className="pixel-card bg-gray-900 border-2 border-yellow-500 p-6">
                  <h3 className="font-press-start text-lg text-yellow-500 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    RESULTS_ANNOUNCEMENT
                  </h3>
                  <div>
                    <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Announced At</label>
                    <DateTimePicker
                      value={hackathon.results_announced_at}
                      onChange={(date) => updateField('results_announced_at', date)}
                      placeholder="Select results announcement date"
                      minDate={hackathon.judging_ends_at ? new Date(hackathon.judging_ends_at) : undefined}
                    />
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>


        </div>
      </div>

      <Footer />

      {/* Publish Confirmation Modal */}
      <ConfirmDialog
        open={showPublishConfirm}
        onOpenChange={setShowPublishConfirm}
        title="REQUEST PUBLICATION"
        description="Your hackathon will be reviewed by our team. Once approved, it will be visible to all participants. Are you sure you want to submit it for review?"
        confirmText="SUBMIT FOR REVIEW"
        cancelText="CANCEL"
        onConfirm={handleRequestPublish}
      />
    </>
  );
}
