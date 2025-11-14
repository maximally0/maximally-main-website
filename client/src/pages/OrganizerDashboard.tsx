import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, Users, Eye, Clock, Edit, Trash2, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';
import Footer from '@/components/Footer';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/organizer/dashboard');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchHackathons();
    }
  }, [user]);

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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this hackathon? This action cannot be undone.')) {
      return;
    }

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

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-600 text-white',
      pending_review: 'bg-yellow-600 text-white',
      published: 'bg-green-600 text-white',
      rejected: 'bg-red-600 text-white',
      ended: 'bg-gray-500 text-white',
    };

    return (
      <span className={`pixel-card ${styles[status as keyof typeof styles]} px-3 py-1 text-xs font-press-start`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-press-start text-maximally-red">LOADING...</div>
      </div>
    );
  }

  const publishedHackathons = hackathons.filter(h => h.status === 'published' || h.status === 'ended');
  const unpublishedHackathons = hackathons.filter(h => h.status !== 'published' && h.status !== 'ended');

  return (
    <>
      <div className="min-h-screen bg-black text-white pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-press-start text-2xl sm:text-3xl md:text-4xl text-maximally-red mb-4">
              ORGANIZER DASHBOARD
            </h1>
            <p className="font-jetbrains text-gray-400">
              Manage your hackathons and track their performance
            </p>
          </div>

          {/* Create New Button */}
          <Link
            to="/create-hackathon"
            className="pixel-button bg-maximally-red text-white flex items-center gap-2 px-6 py-4 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors mb-8 inline-flex"
          >
            <Plus className="h-5 w-5" />
            CREATE_NEW_HACKATHON
          </Link>

          {/* Unpublished Hackathons */}
          {unpublishedHackathons.length > 0 && (
            <div className="mb-12">
              <h2 className="font-press-start text-xl text-maximally-yellow mb-6">
                DRAFTS & PENDING ({unpublishedHackathons.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unpublishedHackathons.map((hackathon) => (
                  <div
                    key={hackathon.id}
                    className="pixel-card bg-gray-900 border-2 border-maximally-red p-6 hover:border-maximally-yellow transition-all duration-300"
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
                      <div className="pixel-card bg-red-900/20 border border-red-600 p-3 mb-4">
                        <p className="font-press-start text-xs text-red-400 mb-1">REJECTED:</p>
                        <p className="font-jetbrains text-xs text-gray-300">
                          {hackathon.rejection_reason}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link
                        to={`/organizer/hackathons/${hackathon.id}`}
                        className="flex-1 pixel-button bg-maximally-yellow text-black text-center py-2 font-press-start text-xs hover:bg-maximally-red hover:text-white transition-colors"
                      >
                        <Edit className="h-4 w-4 inline mr-1" />
                        EDIT
                      </Link>
                      {hackathon.status === 'draft' && (
                        <button
                          onClick={() => handleDelete(hackathon.id)}
                          className="pixel-button bg-red-600 text-white px-3 py-2 hover:bg-red-700 transition-colors"
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
                    className="pixel-card bg-gray-900 border-2 border-green-600 p-6 hover:border-maximally-yellow transition-all duration-300"
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

                    {/* Analytics */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="pixel-card bg-black/50 border border-maximally-red p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Eye className="h-3 w-3 text-maximally-yellow" />
                          <span className="font-press-start text-xs text-gray-400">VIEWS</span>
                        </div>
                        <p className="font-press-start text-sm text-white">{hackathon.views_count}</p>
                      </div>
                      <div className="pixel-card bg-black/50 border border-maximally-red p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Users className="h-3 w-3 text-maximally-yellow" />
                          <span className="font-press-start text-xs text-gray-400">REGS</span>
                        </div>
                        <p className="font-press-start text-sm text-white">{hackathon.registrations_count}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/hackathon/${hackathon.slug}`}
                        className="flex-1 pixel-button bg-green-600 text-white text-center py-2 font-press-start text-xs hover:bg-green-700 transition-colors"
                      >
                        VIEW_PAGE
                      </Link>
                      <Link
                        to={`/organizer/hackathons/${hackathon.id}`}
                        className="pixel-button bg-maximally-yellow text-black px-3 py-2 hover:bg-maximally-red hover:text-white transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {hackathons.length === 0 && (
            <div className="pixel-card bg-gray-900 border-2 border-maximally-red p-12 text-center">
              <div className="minecraft-block bg-maximally-red w-20 h-20 mx-auto mb-6 flex items-center justify-center">
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
                className="pixel-button bg-maximally-red text-white px-8 py-4 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors inline-block"
              >
                CREATE_YOUR_FIRST_HACKATHON
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
