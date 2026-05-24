import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import {
  Users, MapPin, Globe, Linkedin, Twitter, Github,
  Phone, CheckCircle2, ArrowLeft, Sparkles, User, BookOpen
} from 'lucide-react';

interface FormData {
  bio: string;
  location: string;
  skills: string;
  expertiseAreas: string;
  yearsOfExperience: string;
  whyMentor: string;
  availability: string;
  maxMentees: string;
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
  phone: string;
  timezone: string;
  agreed_to_terms: boolean;
}

const MentorApplicationForm = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    bio: '',
    location: '',
    skills: '',
    expertiseAreas: '',
    yearsOfExperience: '0',
    whyMentor: '',
    availability: 'weekends',
    maxMentees: '3',
    linkedin: '',
    github: '',
    twitter: '',
    website: '',
    phone: '',
    timezone: '',
    agreed_to_terms: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/mentor/apply');
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
        user_id: user.id,
        username: profile.username,
        email: profile.email || user.email,
        full_name: profile.full_name || profile.username,
        bio: formData.bio,
        location: formData.location,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        expertise_areas: formData.expertiseAreas.split(',').map(s => s.trim()).filter(Boolean),
        years_of_experience: parseInt(formData.yearsOfExperience) || 0,
        why_mentor: formData.whyMentor,
        availability: formData.availability,
        max_mentees: parseInt(formData.maxMentees) || 3,
        linkedin: formData.linkedin,
        github: formData.github,
        twitter: formData.twitter,
        website: formData.website,
        phone: formData.phone,
        timezone: formData.timezone,
        agreed_to_terms: formData.agreed_to_terms,
      };

      await apiRequest('/api/mentor/apply', { method: 'POST', body: JSON.stringify(submitData) });
      toast({ title: 'Application Submitted!', description: "We'll review your application and get back to you soon." });
      setTimeout(() => navigate('/mentors'), 2000);
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
      <SEO title="Mentor Application — Maximally" description="Apply to become a mentor on the Maximally platform." />
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />

        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate('/mentors')} className="bg-gradient-to-r from-gray-800 to-gray-900 border border-orange-500/30 hover:border-orange-500 text-gray-300 hover:text-white mb-8 flex items-center gap-2 transition-all px-4 py-2 text-sm">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-space font-bold">BACK TO MENTORS</span>
            </button>

            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-500/30 mb-6">
                <Users className="h-5 w-5 text-orange-400" />
                <span className="font-space font-bold text-sm text-orange-400">MENTOR APPLICATION</span>
                <Sparkles className="h-5 w-5 text-orange-400" />
              </div>
              <h1 className="font-space font-bold text-3xl md:text-5xl mb-6">
                <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">BECOME A MENTOR</span>
              </h1>
              <p className="text-gray-300 text-base max-w-2xl mx-auto font-space leading-relaxed">
                Help hackathon participants build better products. Share your expertise and guide the next generation of builders.
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
                    <label className="block text-sm font-space text-gray-300 mb-2">Bio <span className="text-orange-400">*</span></label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} required rows={3} className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors resize-none" placeholder="Tell us about yourself and your background..." />
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
                </div>
              </div>

              {/* Expertise */}
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-orange-500/30 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="h-6 w-6 text-orange-400" />
                  <h2 className="font-space font-bold text-lg bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">EXPERTISE & MENTORING</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-space text-gray-300 mb-2">Skills <span className="text-orange-400">*</span></label>
                    <input type="text" name="skills" value={formData.skills} onChange={handleChange} required className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors" placeholder="React, Node.js, Machine Learning (comma-separated)" />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-space text-gray-300 mb-2">Expertise Areas</label>
                    <input type="text" name="expertiseAreas" value={formData.expertiseAreas} onChange={handleChange} className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors" placeholder="Web Development, AI/ML, Product Design (comma-separated)" />
                  </div>
                  <div>
                    <label className="block text-sm font-space text-gray-300 mb-2">Availability</label>
                    <select name="availability" value={formData.availability} onChange={handleChange} className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors">
                      <option value="weekends">Weekends only</option>
                      <option value="evenings">Evenings (weekdays)</option>
                      <option value="flexible">Flexible</option>
                      <option value="limited">Limited availability</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-space text-gray-300 mb-2">Max Mentees at Once</label>
                    <input type="number" name="maxMentees" value={formData.maxMentees} onChange={handleChange} min="1" max="10" className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-space text-gray-300 mb-2">Why do you want to mentor? <span className="text-orange-400">*</span></label>
                    <textarea name="whyMentor" value={formData.whyMentor} onChange={handleChange} required rows={4} className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space focus:border-orange-500 focus:outline-none transition-colors resize-none" placeholder="Tell us why you want to mentor and what you can offer to participants..." />
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
                </div>
              </div>

              {/* Terms */}
              <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-500/40 p-8">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input type="checkbox" name="agreed_to_terms" checked={formData.agreed_to_terms} onChange={handleChange} required className="mt-1 h-5 w-5 bg-black border-2 border-gray-700 checked:bg-orange-600 checked:border-orange-500 cursor-pointer" />
                  <span className="text-sm font-space text-gray-300 group-hover:text-white transition-colors">
                    I agree to the terms and conditions. I understand my application will be reviewed by the Maximally team and I commit to being responsive and helpful to mentees. <span className="text-orange-400">*</span>
                  </span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button type="button" onClick={() => navigate('/mentors')} className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 text-gray-300 hover:text-white px-8 py-4 font-space font-bold text-sm transition-all">CANCEL</button>
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

export default MentorApplicationForm;
