import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Calendar, Link as LinkIcon, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/lib/auth';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

export default function CreateHackathon() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hackathonName: '',
    slug: '',
    startDate: '',
    endDate: '',
  });

  // Check if user is an organizer, redirect if not
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Not logged in - redirect to login
        navigate('/login?redirect=/organizer/apply');
        return;
      }
      
      const isOrganizer = profile?.role === 'organizer' || profile?.role === 'admin';
      if (!isOrganizer) {
        // Logged in but not an organizer - redirect to application form
        toast({
          title: "Organizer Access Required",
          description: "Please apply to become an organizer first.",
          variant: "destructive",
        });
        navigate('/organizer/apply');
      }
    }
  }, [user, profile, authLoading, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-generate slug from hackathon name
    if (name === 'hackathonName' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/organizer/hackathons', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create hackathon');
      }

      toast({
        title: "Hackathon Created!",
        description: "Your hackathon draft has been created successfully.",
      });

      // Navigate to hackathon dashboard
      navigate(`/organizer/hackathons/${data.data.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to create hackathon',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Create Your Hackathon — Builder Event Setup | Maximally"
        description="Set up and launch your hackathon on Maximally infrastructure. Full event management, submissions, judging, and analytics."
        keywords="create hackathon, launch event, hackathon setup, builder event, Maximally organizer"
        keywords="create hackathon, host hackathon, organize event"
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Pixel Grid Background */}
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />

        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500/10 blur-3xl rounded-full animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-orange-600/20 blur-3xl rounded-full animate-pulse delay-500" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-500/50 text-white px-8 py-4 inline-block mb-8 shadow-lg shadow-orange-500/20">
                  <span className="font-space font-bold text-sm sm:text-base flex items-center gap-3">
                    <Rocket className="h-5 w-5 animate-bounce" />
                    CREATE YOUR HACKATHON
                    <Sparkles className="h-5 w-5 animate-spin-slow" />
                  </span>
                </div>

                <h1 className="font-space font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-orange-400 via-orange-400 to-orange-400 bg-clip-text text-transparent">
                    LET'S GET STARTED
                  </span>
                </h1>

                <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-space leading-relaxed">
                  Fill in the basic details to create your hackathon. You can add more information and customize everything later.
                </p>
              </div>

              {/* Form Card */}
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-orange-500/30 hover:border-orange-500 transition-all duration-500 p-8 sm:p-12 relative overflow-hidden group">
                {/* Animated Border Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500" />

                {/* Corner Decorations */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-orange-500 animate-pulse" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-orange-500 animate-pulse delay-200" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-orange-500 animate-pulse delay-400" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-orange-500 animate-pulse delay-600" />

                <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                  {/* Hackathon Name */}
                  <div>
                    <label className="font-space font-bold text-sm bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-3 block flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-400" />
                      HACKATHON NAME *
                    </label>
                    <input
                      type="text"
                      name="hackathonName"
                      value={formData.hackathonName}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/50 border border-orange-500/50 text-white px-6 py-4 font-space text-lg focus:border-orange-500 outline-none transition-colors"
                      placeholder="e.g., AI Innovation Hackathon 2025"
                    />
                    <p className="font-space text-xs text-gray-500 mt-2">
                      Choose a catchy name that describes your hackathon
                    </p>
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="font-space font-bold text-sm bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-3 block flex items-center gap-2">
                      <LinkIcon className="h-5 w-5 text-orange-400" />
                      URL SLUG *
                    </label>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-space text-sm text-gray-400 whitespace-nowrap">
                        maximally.in/hackathon/
                      </span>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                        pattern="[a-z0-9\-]+"
                        className="flex-1 bg-black/50 border border-orange-500/50 text-white px-6 py-4 font-space text-lg focus:border-orange-500 outline-none transition-colors"
                        placeholder="ai-innovation-2025"
                      />
                    </div>
                    <p className="font-space text-xs text-gray-500">
                      Only lowercase letters, numbers, and hyphens. This will be your hackathon's unique URL.
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-space font-bold text-sm bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-3 block flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-orange-400" />
                        START DATE & TIME *
                      </label>
                      <input
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full bg-black/50 border border-orange-500/50 text-white px-6 py-4 font-space text-lg focus:border-orange-500 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="font-space font-bold text-sm bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-3 block flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-orange-400" />
                        END DATE & TIME *
                      </label>
                      <input
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="w-full bg-black/50 border border-orange-500/50 text-white px-6 py-4 font-space text-lg focus:border-orange-500 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-orange-500/10 border border-orange-500/50 p-6">
                    <p className="font-space text-sm text-gray-300 leading-relaxed">
                      <span className="text-orange-400 font-bold">💡 What's next?</span> After creating your hackathon, 
                      you'll be able to add detailed information including description, prizes, tracks, judging criteria, 
                      and much more. Don't worry, you can save as draft and come back anytime!
                    </p>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => navigate('/host-hackathon')}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-5 font-space font-bold text-sm border border-gray-700 transition-all"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-500/50 hover:border-orange-500 text-white hover:text-white py-5 font-space font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                      <Rocket className="h-5 w-5 group-hover:animate-bounce" />
                      <span>{loading ? 'CREATING...' : 'CREATE HACKATHON'}</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Help Text */}
              <div className="text-center mt-8">
                <p className="font-space text-sm text-gray-400">
                  Need help? Check out our{' '}
                  <a href="/partner" className="text-orange-400 hover:text-orange-400 transition-colors underline">
                    organizer guide
                  </a>
                  {' '}or{' '}
                  <a href="/contact" className="text-orange-400 hover:text-orange-400 transition-colors underline">
                    contact us
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
