import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import {
  Award, MapPin, Globe, Linkedin, Twitter, Github,
  Phone, FileText, CheckCircle2, ArrowLeft, Sparkles, User
} from 'lucide-react';

interface FormData {
  headline: string;
  shortBio: string;
  location: string;
  currentRole: string;
  company: string;
  primaryExpertise: string;
  yearsOfExperience: string;
  totalEventsJudged: string;
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
  phone: string;
  timezone: string;
  availabilityStatus: string;
  compensationPreference: string;
  mentorshipStatement: string;
  agreedToNDA: boolean;
  agreed_to_terms: boolean;
}

const JudgeApplicationForm = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    headline: '',
    shortBio: '',
    location: '',
    currentRole: '',
    company: '',
    primaryExpertise: '',
    yearsOfExperience: '0',
    totalEventsJudged: '0',
    linkedin: '',
    github: '',
    twitter: '',
    website: '',
    phone: '',
    timezone: '',
    availabilityStatus: 'available',
    compensationPreference: 'volunteer',
    mentorshipStatement: '',
    agreedToNDA: false,
    agreed_to_terms: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/judge/apply');
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
    if (!profile?.username) {
      toast({ title: 'Profile Incomplete', description: 'Please complete your profile with a username before applying.', variant: 'destructive' });
      return;
    }
    if (!formData.agreed_to_terms) {
      toast({ title: 'Terms Required', description: 'Please agree to the terms and conditions.', variant: 'destructive' });
      return;
    }

    try {
      setSubmitting(true);
      const submitData = {
        username: profile.username,
        fullName: profile.full_name || profile.username,
        email: profile.email || user.email,
        headline: formData.headline,
        shortBio: formData.shortBio,
        location: formData.location,
        currentRole: formData.currentRole,
        company: formData.company,
        primaryExpertise: formData.primaryExpertise.split(',').map(s => s.trim()).filter(Boolean),
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        totalEventsJudged: parseInt(formData.totalEventsJudged) || 0,
        linkedin: formData.linkedin,
        github: formData.github,
        twitter: formData.twitter,
        website: formData.website,
        phone: formData.phone,
        timezone: formData.timezone,
        availabilityStatus: formData.availabilityStatus,
        compensationPreference: formData.compensationPreference,
        mentorshipStatement: formData.mentorshipStatement,
        agreedToNDA: formData.agreedToNDA,
      };

      await apiRequest('/api/judges/apply', { method: 'POST', body: JSON.stringify(submitData) });
      toast({ title: 'Application Submitted!', description: "We'll review your application and get back to you soon." });
      setTimeout(() => navigate('/judges'), 2000);
    } catch (error: any) {
      toast({ title: 'Submission Failed', description: error.message || 'Failed to submit application. Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-orange-400 font-space font-bold text-sm animate-pulse">LOADING...</div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Judge Application — Maximally" description="Apply to become a judge on the Maximally platform." />
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />

        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate('/judges')} className="bg-gradient-to-r from-gray-800 to-gray-900 border border-orange-500/30 hover:border-orange-500 text-gray-300 hover:text-white mb-8 flex items-center gap-2 transition-all px-4 py-2 text-sm">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-space font-bold">BACK TO JUDGES</span>
            </button>

            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-500/30 mb-6">
                <Award className="h-5 w-5 text-orange-400" />
                <span className="font-space font-bold text-sm text-orange-400">JUDGE APPLICATION</span>
                <Sparkles className="h-5 w-5 text-orange-400" />
              </div>
              <h1 className="font-space font-bold text-3xl md:text-5xl mb-6">
                <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">BECOME A JUDGE</span>
              </h1>
              <p className="text-gray-300 text-base max-w-2xl mx-auto font-space leading-relaxed">
                Apply to evaluate hackathon submissions and help builders grow. We'll review your application within 3-5 business days.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile */}
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-orange-500/30 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <User className="h-6 w-6 text-orange-400" />
                  <h2 className="font-space font-bold text-lg bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">YOUR PROFILE</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-space text-gray-300 mb-2">Professional Headline <span className="text-orange-400">*</span></label>
                    <input type="text" name="headline" value={formData.headline} onChange={handleChange} required className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors" placeholder="e.g. Senior Engineer at Google | AI/ML Expert" />
                  </div>
                  <div>
                    <label className="block text-sm font-space text-gray-300 mb-2">Current Role</label>
                    <input type="text" name="currentRole" value={formData.currentRole} onChange={handleChange} className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors" placeholder="Software Engineer" />
                  </div>
                  <div>
                    <label className="block text-sm font-space text-gray-300 mb-2">Company / Organization</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors" placeholder="Google, MIT, etc." />
                  </div>
                  <div>
                    <label className="block text-sm font-space text-gray-300 mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 pl-12 font-space focus:border-orange-500 focus:outline-none transition-colors" placeholder="City, Country" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-space text-gray-300 mb-2">Years of Experience</label>
                    <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} min="0" max="50" className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-space text-gray-300 mb-2">Short Bio <span className="text-orange-400">*</span></label>
                    <textarea name="shortBio" value={formData.shortBio} onChange={handleChange} required rows={3} className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors resize-none" placeholder="Tell us about yourself and your background..." />
                  </div>
                </div>
              </div>

              {/* Expertise */}
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-orange-500/30 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="h-6 w-6 text-orange-400" />
                  <h2 className="font-space font-bold text-lg bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">EXPERTISE & EXPERIENCE</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-space text-gray-300 mb-2">Primary Expertise Areas <span className="text-orange-400">*</span></label>
                    <input type="text" name="primaryExpertise" value={formData.primaryExpertise} onChange={handleChange} required className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors" placeholder="AI/ML, Web3, Product Design (comma-separated)" />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple areas with commas</p>
                  </div>
                  <div>
                    <label className="block text-sm font-space text-gray-300 mb-2">Hackathons Judged Previously</label>
                    <input type="number" name="totalEventsJudged" value={formData.totalEventsJudged} onChange={handleChange} min="0" className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-space text-gray-300 mb-2">Availability</label>
                    <select name="availabilityStatus" value={formData.availabilityStatus} onChange={handleChange} className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors">
                      <option value="available">Available</option>
                      <option value="busy">Busy (limited availability)</option>
                      <option value="unavailable">Not available right now</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-space text-gray-300 mb-2">Why do you want to judge? <span className="text-orange-400">*</span></label>
                    <textarea name="mentorshipStatement" value={formData.mentorshipStatement} onChange={handleChange} required rows={4} className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors resize-none" placeholder="Tell us why you want to judge hackathons and what you bring to the table..." />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-gradient-to-br from-gray-900/30 to-gray-900/20 border border-gray-700 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="h-6 w-6 text-gray-300" />
                  <h2 className="font-space font-bold text-lg bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">SOCIAL & CONTACT</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-space text-gray-300 mb-2">LinkedIn</label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 pl-12 font-space focus:border-orange-500 focus:outline-none transition-colors" placeholder="https://linkedin.com/in/yourprofile" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-space text-gray-300 mb-2">GitHub</label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input type="url" name="github" value={formData.github} onChange={handleChange} className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 pl-12 font-space focus:border-orange-500 focus:outline-none transition-colors" placeholder="https://github.com/yourhandle" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-space text-gray-300 mb-2">Twitter</label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 pl-12 font-space focus:border-orange-500 focus:outline-none transition-colors" placeholder="https://twitter.com/yourhandle" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-space text-gray-300 mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 pl-12 font-space focus:border-orange-500 focus:outline-none transition-colors" placeholder="+1 234 567 8900" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-space text-gray-300 mb-2">Timezone</label>
                    <input type="text" name="timezone" value={formData.timezone} onChange={handleChange} className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors" placeholder="UTC+5:30, EST, etc." />
                  </div>
                  <div>
                    <label className="block text-sm font-space text-gray-300 mb-2">Compensation Preference</label>
                    <select name="compensationPreference" value={formData.compensationPreference} onChange={handleChange} className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors">
                      <option value="volunteer">Volunteer (no compensation)</option>
                      <option value="paid">Paid only</option>
                      <option value="either">Either is fine</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-500/40 p-8 space-y-4">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input type="checkbox" name="agreedToNDA" checked={formData.agreedToNDA} onChange={handleChange} className="mt-1 h-5 w-5 bg-black border-2 border-gray-700 checked:bg-orange-600 checked:border-orange-500 cursor-pointer" />
                  <span className="text-sm font-space text-gray-300 group-hover:text-white transition-colors">
                    I agree to maintain confidentiality of all submissions and hackathon materials I review as a judge.
                  </span>
                </label>
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input type="checkbox" name="agreed_to_terms" checked={formData.agreed_to_terms} onChange={handleChange} required className="mt-1 h-5 w-5 bg-black border-2 border-gray-700 checked:bg-orange-600 checked:border-orange-500 cursor-pointer" />
                  <span className="text-sm font-space text-gray-300 group-hover:text-white transition-colors">
                    I agree to the terms and conditions. I understand my application will be reviewed by the Maximally team. <span className="text-orange-400">*</span>
                  </span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button type="button" onClick={() => navigate('/judges')} className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 text-gray-300 hover:text-white px-8 py-4 font-space font-bold text-sm transition-all">CANCEL</button>
                <button type="submit" disabled={submitting || !formData.agreed_to_terms} className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-500 text-white px-8 py-4 font-space font-bold text-sm border border-orange-500/40 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {submitting ? <><div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /><span>SUBMITTING...</span></> : <><CheckCircle2 className="h-5 w-5" /><span>SUBMIT APPLICATION</span></>}
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

export default JudgeApplicationForm;
