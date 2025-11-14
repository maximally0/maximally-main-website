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
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

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
  code_of_conduct?: string;
  promo_video_link?: string;
  cover_image?: string;
  status: string;
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

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/organizer/dashboard');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && id) {
      fetchHackathon();
    }
  }, [user, id]);

  const fetchHackathon = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${id}`, { headers });
      const data = await response.json();

      if (data.success) {
        setHackathon(data.data);
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

  const handleRequestPublish = async () => {
    if (!confirm('Request publication? Your hackathon will be reviewed by our team.')) return;

    try {
      const headers = await getAuthHeaders();
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
    { id: 'links', label: 'LINKS', icon: LinkIcon },
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
              className="pixel-button bg-gray-700 text-white flex items-center gap-2 px-4 py-2 font-press-start text-xs hover:bg-gray-600 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              BACK_TO_DASHBOARD
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
                      onClick={handleRequestPublish}
                      disabled={!requiredFieldsFilled}
                      className="pixel-button bg-maximally-red text-white flex items-center gap-2 px-6 py-3 font-press-start text-sm hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={!requiredFieldsFilled ? 'Please fill in Name, Description, Start Date, and End Date' : 'Request publication'}
                    >
                      <Send className="h-4 w-4" />
                      PUBLISH
                    </button>
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

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-maximally-red to-red-600 text-white shadow-lg shadow-maximally-red/30'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-maximally-red/5 to-transparent pointer-events-none" />
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-maximally-red/20 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-maximally-red/20 rounded-br-2xl" />

            <div className="relative z-10">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-8">
                  <div className="bg-maximally-yellow/10 border border-maximally-yellow/30 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-300">
                      💡 <span className="text-maximally-yellow font-bold">Tip:</span> Make your hackathon stand out with a compelling name and description. This is what participants will see first!
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-200 mb-3 block flex items-center gap-2">
                      <Zap className="h-4 w-4 text-maximally-red" />
                      Hackathon Name *
                    </label>
                    <input
                      type="text"
                      value={hackathon.hackathon_name}
                      onChange={(e) => updateField('hackathon_name', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none transition-all placeholder:text-gray-500"
                      placeholder="e.g., AI Innovation Hackathon 2025"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-200 mb-3 block flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-maximally-red" />
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={hackathon.tagline || ''}
                      onChange={(e) => updateField('tagline', e.target.value)}
                      placeholder="A catchy one-liner that captures your hackathon's essence"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none transition-all placeholder:text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Example: "Build the future of AI in 48 hours"
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-200 mb-3 block flex items-center gap-2">
                      <FileText className="h-4 w-4 text-maximally-red" />
                      Description
                    </label>
                    <textarea
                      value={hackathon.description || ''}
                      onChange={(e) => updateField('description', e.target.value)}
                      rows={10}
                      placeholder="Tell participants what makes your hackathon special. Include:&#10;• What they'll build&#10;• Who should participate&#10;• What they'll learn&#10;• Why they should join"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none resize-none leading-relaxed placeholder:text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {hackathon.description?.length || 0} characters
                    </p>
                  </div>
                </div>
              )}

              {/* Schedule Tab */}
              {activeTab === 'schedule' && (
                <div className="space-y-8">
                  <div className="bg-maximally-yellow/10 border border-maximally-yellow/30 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-300">
                      📅 <span className="text-maximally-yellow font-bold">Tip:</span> Choose dates carefully! Make sure to give participants enough time to build something amazing.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-200 mb-3 block flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-maximally-red" />
                        Start Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={hackathon.start_date?.slice(0, 16)}
                        onChange={(e) => updateField('start_date', e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-200 mb-3 block flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-maximally-red" />
                        End Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={hackathon.end_date?.slice(0, 16)}
                        onChange={(e) => updateField('end_date', e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-200 mb-3 block flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-maximally-red" />
                      Format *
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {['online', 'offline', 'hybrid'].map((format) => (
                        <button
                          key={format}
                          type="button"
                          onClick={() => updateField('format', format)}
                          className={`py-3.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                            hackathon.format === format
                              ? 'bg-gradient-to-r from-maximally-red to-red-600 text-white shadow-lg shadow-maximally-red/30'
                              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
                          }`}
                        >
                          {format.charAt(0).toUpperCase() + format.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(hackathon.format === 'offline' || hackathon.format === 'hybrid') && (
                    <div className="bg-maximally-yellow/10 border border-maximally-yellow/30 rounded-xl p-6">
                      <label className="text-sm font-semibold text-maximally-yellow mb-3 block">
                        Venue Address
                      </label>
                      <input
                        type="text"
                        value={hackathon.venue || ''}
                        onChange={(e) => updateField('venue', e.target.value)}
                        placeholder="Full venue address with city and state"
                        className="w-full bg-gray-800/50 border border-maximally-yellow/50 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-yellow focus:ring-2 focus:ring-maximally-yellow/20 outline-none transition-all placeholder:text-gray-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-semibold text-gray-200 mb-3 block flex items-center gap-2">
                      <Clock className="h-4 w-4 text-maximally-red" />
                      Registration Deadline
                    </label>
                    <input
                      type="datetime-local"
                      value={hackathon.registration_deadline?.slice(0, 16) || ''}
                      onChange={(e) => updateField('registration_deadline', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Leave empty if registration stays open until the event starts
                    </p>
                  </div>
                </div>
              )}

            {/* Participation Tab */}
            {activeTab === 'participation' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-200 mb-3 block">
                      Min Team Size
                    </label>
                    <input
                      type="number"
                      value={hackathon.team_size_min || 1}
                      onChange={(e) => updateField('team_size_min', parseInt(e.target.value))}
                      min="1"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-200 mb-3 block">
                      Max Team Size
                    </label>
                    <input
                      type="number"
                      value={hackathon.team_size_max || 4}
                      onChange={(e) => updateField('team_size_max', parseInt(e.target.value))}
                      min="1"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-200 mb-3 block">
                      Registration Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={hackathon.registration_fee || 0}
                      onChange={(e) => updateField('registration_fee', parseInt(e.target.value))}
                      min="0"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-2">0 = Free</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-200 mb-3 block">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      value={hackathon.max_participants || ''}
                      onChange={(e) => updateField('max_participants', e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="Leave empty for unlimited"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none transition-all placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-200 mb-3 block">
                    Communication Channel
                  </label>
                  <input
                    type="text"
                    value={hackathon.communication_channel || ''}
                    onChange={(e) => updateField('communication_channel', e.target.value)}
                    placeholder="e.g., Discord, WhatsApp, Slack"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-200 mb-3 block">
                    Communication Link
                  </label>
                  <input
                    type="url"
                    value={hackathon.communication_link || ''}
                    onChange={(e) => updateField('communication_link', e.target.value)}
                    placeholder="https://discord.gg/..."
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>
              </div>
            )}

            {/* Prizes Tab */}
            {activeTab === 'prizes' && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-200 mb-3 block">
                    Total Prize Pool
                  </label>
                  <input
                    type="text"
                    value={hackathon.total_prize_pool || ''}
                    onChange={(e) => updateField('total_prize_pool', e.target.value)}
                    placeholder="e.g., ₹50,000 or $5,000"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-200 mb-3 block">
                    Prize Breakdown (JSON)
                  </label>
                  <textarea
                    value={hackathon.prize_breakdown || '[]'}
                    onChange={(e) => updateField('prize_breakdown', e.target.value)}
                    rows={6}
                    placeholder='[{"position": "1st Place", "amount": "₹20,000", "description": "Winner"}]'
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-sm focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none resize-none font-mono placeholder:text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">JSON array format</p>
                </div>
              </div>
            )}

            {/* Links Tab */}
            {activeTab === 'links' && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-200 mb-3 block">
                    Discord Link
                  </label>
                  <input
                    type="url"
                    value={hackathon.discord_link || ''}
                    onChange={(e) => updateField('discord_link', e.target.value)}
                    placeholder="https://discord.gg/..."
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-200 mb-3 block">
                    WhatsApp Link
                  </label>
                  <input
                    type="url"
                    value={hackathon.whatsapp_link || ''}
                    onChange={(e) => updateField('whatsapp_link', e.target.value)}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-200 mb-3 block">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={hackathon.website_url || ''}
                    onChange={(e) => updateField('website_url', e.target.value)}
                    placeholder="https://yourhackathon.com"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-200 mb-3 block">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={hackathon.contact_email || ''}
                    onChange={(e) => updateField('contact_email', e.target.value)}
                    placeholder="contact@yourhackathon.com"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-3.5 text-base focus:border-maximally-red focus:ring-2 focus:ring-maximally-red/20 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-maximally-yellow hover:bg-maximally-yellow/90 text-black py-4 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 shadow-lg shadow-maximally-yellow/30 flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            {canPublish && (
              <button
                onClick={handleRequestPublish}
                disabled={!requiredFieldsFilled}
                className="flex-1 bg-gradient-to-r from-maximally-red to-red-600 hover:from-maximally-red hover:to-red-700 text-white py-4 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-maximally-red/30 flex items-center justify-center gap-2"
                title={!requiredFieldsFilled ? 'Please fill in Name, Description, Start Date, and End Date' : 'Request publication'}
              >
                <Send className="h-4 w-4" />
                Request Publish
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
