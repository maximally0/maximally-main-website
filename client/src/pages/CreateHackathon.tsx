import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Calendar, Link as LinkIcon, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

export default function CreateHackathon() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hackathonName: '',
    slug: '',
    startDate: '',
    endDate: '',
  });

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
        title="Create Your Hackathon - Maximally"
        description="Start hosting your own hackathon with Maximally. Get full support, mentorship, and access to a global network."
        keywords="create hackathon, host hackathon, organize event"
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Pixel Grid Background */}
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-maximally-red/20 blur-3xl rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-maximally-yellow/20 blur-3xl rounded-full animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-red-500/20 blur-3xl rounded-full animate-pulse delay-500" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="minecraft-block bg-gradient-to-r from-maximally-yellow via-orange-500 to-maximally-yellow text-black px-8 py-4 inline-block mb-8 animate-[glow_2s_ease-in-out_infinite] shadow-2xl shadow-maximally-yellow/50">
                  <span className="font-press-start text-sm sm:text-base flex items-center gap-3">
                    <Rocket className="h-5 w-5 animate-bounce" />
                    CREATE YOUR HACKATHON
                    <Sparkles className="h-5 w-5 animate-spin-slow" />
                  </span>
                </div>

                <h1 className="font-press-start text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 minecraft-text">
                  <span className="text-maximally-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:drop-shadow-[6px_6px_0px_rgba(255,215,0,0.5)] transition-all duration-300">
                    LET'S GET STARTED
                  </span>
                </h1>

                <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-jetbrains leading-relaxed">
                  Fill in the basic details to create your hackathon. You can add more information and customize everything later.
                </p>
              </div>

              {/* Form Card */}
              <div className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-maximally-red hover:border-maximally-yellow transition-all duration-500 p-8 sm:p-12 relative overflow-hidden group">
                {/* Animated Border Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-maximally-red via-maximally-yellow to-maximally-red opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

                {/* Corner Decorations */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-maximally-yellow animate-pulse" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-maximally-yellow animate-pulse delay-200" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-maximally-yellow animate-pulse delay-400" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-maximally-yellow animate-pulse delay-600" />

                <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                  {/* Hackathon Name */}
                  <div>
                    <label className="font-press-start text-sm text-maximally-red mb-3 block flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      HACKATHON NAME *
                    </label>
                    <input
                      type="text"
                      name="hackathonName"
                      value={formData.hackathonName}
                      onChange={handleChange}
                      required
                      className="w-full pixel-card bg-gray-900 border-2 border-maximally-red text-white px-6 py-4 font-jetbrains text-lg focus:border-maximally-yellow outline-none transition-colors"
                      placeholder="e.g., AI Innovation Hackathon 2025"
                    />
                    <p className="font-jetbrains text-xs text-gray-500 mt-2">
                      Choose a catchy name that describes your hackathon
                    </p>
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="font-press-start text-sm text-maximally-red mb-3 block flex items-center gap-2">
                      <LinkIcon className="h-5 w-5" />
                      URL SLUG *
                    </label>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-jetbrains text-sm text-gray-400 whitespace-nowrap">
                        maximally.in/hackathon/
                      </span>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                        pattern="[a-z0-9\-]+"
                        className="flex-1 pixel-card bg-gray-900 border-2 border-maximally-red text-white px-6 py-4 font-jetbrains text-lg focus:border-maximally-yellow outline-none transition-colors"
                        placeholder="ai-innovation-2025"
                      />
                    </div>
                    <p className="font-jetbrains text-xs text-gray-500">
                      Only lowercase letters, numbers, and hyphens. This will be your hackathon's unique URL.
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-press-start text-sm text-maximally-red mb-3 block flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        START DATE & TIME *
                      </label>
                      <input
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full pixel-card bg-gray-900 border-2 border-maximally-red text-white px-6 py-4 font-jetbrains text-lg focus:border-maximally-yellow outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="font-press-start text-sm text-maximally-red mb-3 block flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        END DATE & TIME *
                      </label>
                      <input
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="w-full pixel-card bg-gray-900 border-2 border-maximally-red text-white px-6 py-4 font-jetbrains text-lg focus:border-maximally-yellow outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="pixel-card bg-maximally-yellow/10 border-2 border-maximally-yellow p-6">
                    <p className="font-jetbrains text-sm text-gray-300 leading-relaxed">
                      <span className="text-maximally-yellow font-bold">💡 What's next?</span> After creating your hackathon, 
                      you'll be able to add detailed information including description, prizes, tracks, judging criteria, 
                      and much more. Don't worry, you can save as draft and come back anytime!
                    </p>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => navigate('/host-hackathon')}
                      className="flex-1 pixel-button bg-gray-700 text-white py-5 font-press-start text-sm hover:bg-gray-600 transition-colors"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 pixel-button bg-maximally-red text-white py-5 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-maximally-yellow opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                      <Rocket className="h-5 w-5 group-hover:animate-bounce" />
                      <span>{loading ? 'CREATING...' : 'CREATE_HACKATHON'}</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Help Text */}
              <div className="text-center mt-8">
                <p className="font-jetbrains text-sm text-gray-400">
                  Need help? Check out our{' '}
                  <a href="/partner" className="text-maximally-yellow hover:text-maximally-red transition-colors underline">
                    organizer guide
                  </a>
                  {' '}or{' '}
                  <a href="/contact" className="text-maximally-yellow hover:text-maximally-red transition-colors underline">
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
