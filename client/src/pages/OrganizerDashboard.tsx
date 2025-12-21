import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, Users, Eye, Clock, Edit, Trash2, Send, Copy, Award, Shield, Star, Crown, Flame } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';
import Footer from '@/components/Footer';
import { ConfirmDialog } from '@/components/ConfirmDialog';

type OrganizerTier = 'starter' | 'verified' | 'senior' | 'chief' | 'legacy';

interface OrganizerProfileData {
  tier: OrganizerTier;
  organization_name?: string;
  total_hackathons_hosted: number;
  total_participants_reached: number;
}

interface Hackathon {
  id: number;
  hackathon_name: string;
  slug: string;
  tagline?: string;
  start_date: string;
  end_date: string;
  format: string;
  status: 'draft' | 'pending_review' | 'published' | 'rejected' | 'ended';
  views_count: number;
  registrations_count: number;
  created_at: string;
  rejection_reason?: string;
}

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [organizerProfile, setOrganizerProfile] = useState<OrganizerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: number | null }>({ show: false, id: null });

  const getTierInfo = (tier: OrganizerTier) => {
    const tierConfig = {
      starter: { 
        label: 'Starter Organizer', 
        color: 'text-green-400 border-green-400 bg-green-400/10', 
        icon: <Award className="h-4 w-4" />,
        description: 'Entry-level organizer building experience'
      },
      verified: { 
        label: 'Verified Organizer', 
        color: 'text-blue-400 border-blue-400 bg-blue-400/10', 
        icon: <Shield className="h-4 w-4" />,
        description: 'Experienced organizer with proven track record'
      },
      senior: { 
        label: 'Senior Organizer', 
        color: 'text-purple-400 border-purple-400 bg-purple-400/10', 
        icon: <Star className="h-4 w-4" />,
        description: 'Established leader with extensive experience'
      },
      chief: { 
        label: 'Chief Organizer', 
        color: 'text-yellow-400 border-yellow-400 bg-yellow-400/10', 
        icon: <Crown className="h-4 w-4" />,
        description: 'Industry leader overseeing major events'
      },
      legacy: { 
        label: 'Legacy Organizer', 
        color: 'text-red-400 border-red-400 bg-red-400/10', 
        icon: <Flame className="h-4 w-4" />,
        description: 'Distinguished figure with exceptional contributions'
      }
    };
    return tierConfig[tier] || tierConfig.starter;
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/organizer/dashboard');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchHackathons();
      fetchOrganizerProfile();
    }
  }, [user]);

  const fetchOrganizerProfile = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/organizer/my-profile', { headers });
      const data = await response.json();
      if (data.success && data.data) {
        setOrganizerProfile(data.data);
      }
    } catch (error) {
      console.error('Error fetching organizer profile:', error);
    }
  };

  const fetchHackathons = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/organizer/hackathons', { headers });
      const data = await response.json();

      if (data.success) {
        setHackathons(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirm({ show: true, id });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ show: false, id: null });
    
    if (!id) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        toast({
          title: "Hackathon Deleted",
          description: "Your hackathon has been deleted successfully.",
        });
        fetchHackathons();
      } else {
        throw new Error('Failed to delete hackathon');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to delete hackathon',
        variant: "destructive",
      });
    }
  };

  const handleClone = async (id: number) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${id}/clone`, {
        method: 'POST',
        headers,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Hackathon Cloned!",
          description: "A copy has been created as a draft. You can now edit it.",
        });
        fetchHackathons();
      } else {
        throw new Error(data.message || 'Failed to clone hackathon');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to clone hackathon',
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-600 text-white',
      pending_review: 'bg-yellow-600 text-white',
      published: 'bg-green-600 text-white',
      rejected: 'bg-red-600 text-white',
      ended: 'bg-gray-500 text-white',
    };

    return (
      <span className={`${styles[status as keyof typeof styles]} px-3 py-1 text-xs font-press-start border border-white/20`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="space-y-4">
              <div className="h-10 w-80 bg-gray-800 rounded"></div>
              <div className="h-4 w-64 bg-gray-800 rounded"></div>
            </div>

            {/* Button skeleton */}
            <div className="h-14 w-64 bg-gray-800 rounded"></div>

            {/* Cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 p-6">
                  <div className="h-6 w-48 bg-gray-800 mb-4"></div>
                  <div className="h-4 w-32 bg-gray-800 mb-2"></div>
                  <div className="h-4 w-40 bg-gray-800 mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-10 w-20 bg-gray-800"></div>
                    <div className="h-10 w-20 bg-gray-800"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const publishedHackathons = hackathons.filter(h => h.status === 'published' || h.status === 'ended');
  const unpublishedHackathons = hackathons.filter(h => h.status !== 'published' && h.status !== 'ended');

  return (
    <>
      <div className="min-h-screen bg-black text-white pt-24 pb-12 relative overflow-hidden">
        <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="font-press-start text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  ORGANIZER DASHBOARD
                </h1>
                <p className="font-jetbrains text-gray-400">
                  Manage your hackathons and track their performance
                </p>
              </div>
              {organizerProfile && (
                <div className={`border-2 ${getTierInfo(organizerProfile.tier).color} px-4 py-2 flex items-center gap-2 bg-black/50`}>
                  {getTierInfo(organizerProfile.tier).icon}
                  <span className="font-press-start text-xs">{getTierInfo(organizerProfile.tier).label}</span>
                </div>
              )}
            </div>
          </div>

          {/* Create New Button */}
          <Link
            to="/create-hackathon"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white flex items-center gap-2 px-6 py-4 font-press-start text-sm transition-all mb-8 inline-flex border border-pink-500/50"
          >
            <Plus className="h-5 w-5" />
            CREATE_NEW_HACKATHON
          </Link>

          {/* Unpublished Hackathons */}
          {unpublishedHackathons.length > 0 && (
            <div className="mb-12">
              <h2 className="font-press-start text-xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
                DRAFTS & PENDING ({unpublishedHackathons.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unpublishedHackathons.map((hackathon) => (
                  <div
                    key={hackathon.id}
                    className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/40 p-6 hover:border-pink-400 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-press-start text-sm text-white mb-2">
                        {hackathon.hackathon_name}
                      </h3>
                      {getStatusBadge(hackathon.status)}
                    </div>

                    {hackathon.tagline && (
                      <p className="font-jetbrains text-xs text-gray-400 mb-4">
                        {hackathon.tagline}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs font-jetbrains text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {new Date(hackathon.start_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-jetbrains text-gray-400">
                        <MapPin className="h-4 w-4" />
                        {hackathon.format}
                      </div>
                    </div>

                    {hackathon.status === 'rejected' && hackathon.rejection_reason && (
                      <div className="bg-gradient-to-br from-red-900/30 to-rose-900/20 border border-red-500/40 p-3 mb-4">
                        <p className="font-press-start text-xs text-red-400 mb-1">REJECTED:</p>
                        <p className="font-jetbrains text-xs text-gray-300">
                          {hackathon.rejection_reason}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link
                        to={`/organizer/hackathons/${hackathon.id}`}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-center py-2 font-press-start text-xs border border-pink-500/50 transition-all"
                      >
                        <Edit className="h-4 w-4 inline mr-1" />
                        EDIT
                      </Link>
                      <button
                        onClick={() => handleClone(hackathon.id)}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 border border-purple-500/50 transition-all"
                        title="Clone hackathon"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      {hackathon.status === 'draft' && (
                        <button
                          onClick={() => handleDeleteClick(hackathon.id)}
                          className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 border border-red-500/50 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Published Hackathons */}
          {publishedHackathons.length > 0 && (
            <div>
              <h2 className="font-press-start text-xl text-green-400 mb-6">
                PUBLISHED ({publishedHackathons.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedHackathons.map((hackathon) => (
                  <div
                    key={hackathon.id}
                    className="bg-gradient-to-br from-green-900/20 to-purple-900/20 border border-green-500/40 p-6 hover:border-pink-400 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-press-start text-sm text-white mb-2">
                        {hackathon.hackathon_name}
                      </h3>
                      {getStatusBadge(hackathon.status)}
                    </div>

                    {hackathon.tagline && (
                      <p className="font-jetbrains text-xs text-gray-400 mb-4">
                        {hackathon.tagline}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs font-jetbrains text-gray-400">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        {new Date(hackathon.start_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-jetbrains text-gray-400">
                        <MapPin className="h-4 w-4 text-pink-400" />
                        {hackathon.format}
                      </div>
                    </div>

                    {/* Analytics */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-black/50 border border-purple-500/40 p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Eye className="h-3 w-3 text-pink-400" />
                          <span className="font-press-start text-xs text-gray-400">VIEWS</span>
                        </div>
                        <p className="font-press-start text-sm text-white">{hackathon.views_count}</p>
                      </div>
                      <div className="bg-black/50 border border-pink-500/40 p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Users className="h-3 w-3 text-purple-400" />
                          <span className="font-press-start text-xs text-gray-400">REGS</span>
                        </div>
                        <p className="font-press-start text-sm text-white">{hackathon.registrations_count}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Link
                          to={`/hackathon/${hackathon.slug}`}
                          className="flex-1 bg-green-600 hover:bg-green-500 text-white text-center py-2 font-press-start text-xs border border-green-500/50 transition-all"
                        >
                          VIEW_PAGE
                        </Link>
                        <Link
                          to={`/organizer/hackathons/${hackathon.id}`}
                          className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 border border-purple-500/50 transition-all"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleClone(hackathon.id)}
                          className="bg-pink-600 hover:bg-pink-500 text-white px-3 py-2 border border-pink-500/50 transition-all"
                          title="Clone hackathon"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(hackathon.id)}
                          className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 border border-red-500/50 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <Link
                        to={`/organizer/hackathons/${hackathon.id}/manage`}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-center py-2 font-press-start text-xs border border-pink-500/50 transition-all flex items-center justify-center gap-2"
                      >
                        <Users className="h-4 w-4" />
                        MANAGE_HACKATHON
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {hackathons.length === 0 && (
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/40 p-12 text-center">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-pink-500/50">
                <Calendar className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-press-start text-lg text-white mb-4">
                NO HACKATHONS YET
              </h3>
              <p className="font-jetbrains text-gray-400 mb-6">
                Create your first hackathon to get started!
              </p>
              <Link
                to="/create-hackathon"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 font-press-start text-sm border border-pink-500/50 transition-all inline-block"
              >
                CREATE_YOUR_FIRST_HACKATHON
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={deleteConfirm.show}
        onOpenChange={(show) => setDeleteConfirm({ show, id: null })}
        title="DELETE HACKATHON"
        description="Are you sure you want to delete this hackathon? This action cannot be undone and all data will be permanently lost."
        confirmText="DELETE"
        cancelText="CANCEL"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
    </>
  );
}
