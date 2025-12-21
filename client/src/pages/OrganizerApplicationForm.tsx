import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import {
  Rocket,
  Building2,
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface FormData {
  organization_name: string;
  organization_type: string;
  organization_website: string;
  phone: string;
  location: string;
  previous_organizing_experience: string;
  why_maximally: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  additional_info: string;
  agreed_to_terms: boolean;
}

const OrganizerApplicationForm = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    organization_name: '',
    organization_type: '',
    organization_website: '',
    phone: '',
    location: '',
    previous_organizing_experience: '',
    why_maximally: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    additional_info: '',
    agreed_to_terms: false
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/organizer/apply');
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      toast({ title: 'Authentication Required', description: 'Please log in to submit your application.', variant: 'destructive' });
      return;
    }

    if (!formData.agreed_to_terms) {
      toast({ title: 'Terms Required', description: 'Please agree to the terms and conditions.', variant: 'destructive' });
      return;
    }

    try {
      setSubmitting(true);

      if (!profile?.username) {
        toast({ title: 'Profile Incomplete', description: 'Please complete your profile with a username before applying.', variant: 'destructive' });
        return;
      }

      if (!profile?.full_name) {
        toast({ title: 'Profile Incomplete', description: 'Please complete your profile with your full name before applying.', variant: 'destructive' });
        return;
      }

      const submitData = {
        user_id: user.id,
        username: profile.username,
        email: profile.email || user.email,
        full_name: profile.full_name,
        ...formData
      };

      await apiRequest('/api/organizer/apply', {
        method: 'POST',
        body: JSON.stringify(submitData)
      });

      toast({ title: 'Application Submitted!', description: 'Your organizer application has been received. We\'ll review it and get back to you soon.' });
      setTimeout(() => navigate('/'), 2000);
    } catch (error: any) {
      toast({ title: 'Submission Failed', description: error.message || 'Failed to submit application. Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-400 font-press-start text-sm animate-pulse">LOADING...</div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Organizer Application - Maximally"
        description="Apply to become a Maximally organizer and host your hackathon with full support."
        keywords="organizer application, host hackathon, hackathon organizer"
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.10)_0%,transparent_50%)]" />

        {/* Glowing Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/15 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-pink-500/12 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate('/host-hackathon')}
              className="bg-gradient-to-r from-gray-800 to-gray-900 border border-purple-500/40 hover:border-purple-400 text-gray-300 hover:text-white mb-8 flex items-center gap-2 transition-all px-4 py-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-press-start">BACK</span>
            </button>

            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/30 to-pink-600/20 border border-purple-500/40 mb-6">
                <Rocket className="h-5 w-5 text-purple-400 animate-bounce" />
                <span className="font-press-start text-sm text-purple-300">ORGANIZER APPLICATION</span>
                <Sparkles className="h-5 w-5 text-pink-400" />
              </div>
              
              <h1 className="font-press-start text-3xl md:text-5xl mb-6">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  HOST WITH MAXIMALLY
                </span>
              </h1>

              <p className="text-gray-300 text-base max-w-2xl mx-auto font-jetbrains leading-relaxed">
                Fill out this application to host your hackathon with full support from Maximally.
                We'll review your application and get back to you within 3-5 business days.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Organization Details */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/40 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="h-6 w-6 text-purple-400" />
                  <h2 className="font-press-start text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ORGANIZATION DETAILS</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-jetbrains text-gray-300 mb-2">
                      Organization Name <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="organization_name"
                      value={formData.organization_name}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-pink-400 focus:outline-none transition-colors"
                      placeholder="Your organization or club name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-jetbrains text-gray-300 mb-2">
                      Organization Type <span className="text-pink-400">*</span>
                    </label>
                    <select
                      name="organization_type"
                      value={formData.organization_type}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-pink-400 focus:outline-none transition-colors"
                    >
                      <option value="">Select type</option>
                      <option value="individual">Individual</option>
                      <option value="student_club">Student Club</option>
                      <option value="company">Company</option>
                      <option value="nonprofit">Non-Profit</option>
                      <option value="community">Community</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-jetbrains text-gray-300 mb-2">Organization Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="url"
                        name="organization_website"
                        value={formData.organization_website}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 pl-12 font-jetbrains focus:border-pink-400 focus:outline-none transition-colors"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/20 border border-pink-500/40 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="h-6 w-6 text-pink-400" />
                  <h2 className="font-press-start text-lg bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">CONTACT INFORMATION</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-jetbrains text-gray-300 mb-2">
                      Phone Number <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 pl-12 font-jetbrains focus:border-pink-400 focus:outline-none transition-colors"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-jetbrains text-gray-300 mb-2">
                      Location <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 pl-12 font-jetbrains focus:border-pink-400 focus:outline-none transition-colors"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/40 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-6 w-6 text-purple-400" />
                  <h2 className="font-press-start text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">EXPERIENCE & MOTIVATION</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-jetbrains text-gray-300 mb-2">
                      Previous Organizing Experience <span className="text-pink-400">*</span>
                    </label>
                    <textarea
                      name="previous_organizing_experience"
                      value={formData.previous_organizing_experience}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-pink-400 focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about any events you've organized before..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-jetbrains text-gray-300 mb-2">
                      Why Maximally? <span className="text-pink-400">*</span>
                    </label>
                    <textarea
                      name="why_maximally"
                      value={formData.why_maximally}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-pink-400 focus:outline-none transition-colors resize-none"
                      placeholder="Why do you want to host your hackathon with Maximally?"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-purple-900/20 border border-cyan-500/40 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="h-6 w-6 text-cyan-400" />
                  <h2 className="font-press-start text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">SOCIAL LINKS</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-jetbrains text-gray-300 mb-2">LinkedIn</label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 pl-12 font-jetbrains focus:border-pink-400 focus:outline-none transition-colors" placeholder="https://linkedin.com/in/yourprofile" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-jetbrains text-gray-300 mb-2">Twitter</label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 pl-12 font-jetbrains focus:border-pink-400 focus:outline-none transition-colors" placeholder="https://twitter.com/yourhandle" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-jetbrains text-gray-300 mb-2">Instagram</label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 pl-12 font-jetbrains focus:border-pink-400 focus:outline-none transition-colors" placeholder="https://instagram.com/yourhandle" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-purple-500/30 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-6 w-6 text-gray-400" />
                  <h2 className="font-press-start text-lg text-gray-300">ADDITIONAL INFORMATION</h2>
                </div>
                <textarea
                  name="additional_info"
                  value={formData.additional_info}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-pink-400 focus:outline-none transition-colors resize-none"
                  placeholder="Any additional information, special requirements, or questions..."
                />
              </div>

              {/* Terms */}
              <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-500/40 p-8">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="agreed_to_terms"
                    checked={formData.agreed_to_terms}
                    onChange={handleChange}
                    required
                    className="mt-1 h-5 w-5 bg-black border-2 border-gray-700 checked:bg-purple-600 checked:border-purple-600 focus:ring-2 focus:ring-purple-500 transition-colors cursor-pointer"
                  />
                  <span className="text-sm font-jetbrains text-gray-300 group-hover:text-white transition-colors">
                    I agree to the terms and conditions. I understand that my application will be reviewed by the Maximally team,
                    and I may be contacted for additional information.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => navigate('/host-hackathon')}
                  className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 text-gray-300 hover:text-white px-8 py-4 font-press-start text-sm transition-all"
                >
                  CANCEL
                </button>
                
                <button
                  type="submit"
                  disabled={submitting || !formData.agreed_to_terms}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 font-press-start text-sm border border-pink-500/50 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      <span>SUBMITTING...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span>SUBMIT APPLICATION</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default OrganizerApplicationForm;
