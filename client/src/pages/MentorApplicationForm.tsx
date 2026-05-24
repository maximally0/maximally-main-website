import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import {
  Users, MapPin, Globe, Linkedin, Twitter, Github,
  Phone, CheckCircle2, ArrowLeft, User, BookOpen,
  Lock, Eye, EyeOff
} from 'lucide-react';

interface FormData {
  // PUBLIC
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
  // PRIVATE
  phone: string;
  timezone: string;
  agreed_to_terms: boolean;
}

const inputCls = "w-full bg-black/60 border border-gray-800 text-white px-4 py-3 font-space text-sm focus:border-orange-500 focus:outline-none transition-colors placeholder:text-gray-600 rounded-sm";
const labelCls = "block text-xs font-space font-semibold text-gray-400 uppercase tracking-wider mb-2";

const MentorApplicationForm = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [showPrivate, setShowPrivate] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    bio: '', location: '', skills: '', expertiseAreas: '',
    yearsOfExperience: '0', whyMentor: '', availability: 'weekends',
    maxMentees: '3', linkedin: '', github: '', twitter: '', website: '',
    phone: '', timezone: '', agreed_to_terms: false,
  });

  useEffect(() => {
    if (!authLoading && !user) navigate('/login?redirect=/mentor/apply');
  }, [user, authLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) { toast({ title: 'Login required', variant: 'destructive' }); return; }
    if (!profile?.username) { toast({ title: 'Complete your profile first', variant: 'destructive' }); return; }
    if (!formData.agreed_to_terms) { toast({ title: 'Please agree to the terms', variant: 'destructive' }); return; }
    try {
      setSubmitting(true);
      const res = await fetch('/api/mentor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit');
      toast({ title: '🎉 Application Submitted!', description: "We'll review it within 3–5 business days." });
      setTimeout(() => navigate('/mentors'), 2000);
    } catch (err: any) {
      toast({ title: 'Submission Failed', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-orange-400 font-space text-sm animate-pulse">LOADING...</div></div>;

  return (
    <>
      <SEO title="Mentor Application — Maximally" description="Apply to become a mentor on the Maximally platform." />
      <div className="min-h-screen bg-black text-white">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.06)_0%,transparent_60%)] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 py-16 relative z-10">
          <div className="max-w-3xl mx-auto">

            {/* Back */}
            <button onClick={() => navigate('/mentors')} className="flex items-center gap-2 text-gray-500 hover:text-orange-400 transition-colors mb-10 text-sm font-space">
              <ArrowLeft className="h-4 w-4" /> Back to Mentors
            </button>

            {/* Header */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
                <BookOpen className="h-3.5 w-3.5 text-orange-400" />
                <span className="font-space font-bold text-[10px] text-orange-400 tracking-widest uppercase">Mentor Application</span>
              </div>
              <h1 className="font-space font-bold text-3xl sm:text-4xl text-white mb-3">Become a Mentor</h1>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                Help hackathon participants build better products. Share your expertise and guide the next generation of builders.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── SECTION 1: PUBLIC PROFILE ── */}
              <div className="border border-gray-800 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 bg-gray-900/60 border-b border-gray-800">
                  <div className="p-1.5 bg-orange-500/10 rounded-lg"><User className="h-4 w-4 text-orange-400" /></div>
                  <div>
                    <h2 className="font-space font-bold text-sm text-white">Public Profile</h2>
                    <p className="text-xs text-gray-500 font-space">Visible to everyone on your mentor profile</p>
                  </div>
                  <span className="ml-auto text-[10px] font-space font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">PUBLIC</span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className={labelCls}>Bio <span className="text-orange-400">*</span></label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} required rows={3} className={inputCls + " resize-none"} placeholder="Tell us about yourself, your background, and what you're passionate about..." />
                  </div>
                  <div>
                    <label className={labelCls}>Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                      <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputCls + " pl-10"} placeholder="City, Country" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Years of Experience</label>
                    <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} min="0" max="50" className={inputCls} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Skills <span className="text-orange-400">*</span></label>
                    <input type="text" name="skills" value={formData.skills} onChange={handleChange} required className={inputCls} placeholder="React, Node.js, Machine Learning (comma-separated)" />
                    <p className="text-xs text-gray-600 mt-1 font-space">Separate with commas</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Expertise Areas</label>
                    <input type="text" name="expertiseAreas" value={formData.expertiseAreas} onChange={handleChange} className={inputCls} placeholder="Web Development, AI/ML, Product Design (comma-separated)" />
                  </div>
                  <div>
                    <label className={labelCls}>Availability</label>
                    <select name="availability" value={formData.availability} onChange={handleChange} className={inputCls}>
                      <option value="weekends">Weekends only</option>
                      <option value="evenings">Evenings (weekdays)</option>
                      <option value="flexible">Flexible</option>
                      <option value="limited">Limited availability</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Max Mentees at Once</label>
                    <input type="number" name="maxMentees" value={formData.maxMentees} onChange={handleChange} min="1" max="10" className={inputCls} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Why do you want to mentor? <span className="text-orange-400">*</span></label>
                    <textarea name="whyMentor" value={formData.whyMentor} onChange={handleChange} required rows={4} className={inputCls + " resize-none"} placeholder="What can you offer to participants? What's your mentoring philosophy?" />
                  </div>
                  {/* Social */}
                  <div>
                    <label className={labelCls}>LinkedIn</label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                      <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className={inputCls + " pl-10"} placeholder="https://linkedin.com/in/..." />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>GitHub</label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                      <input type="url" name="github" value={formData.github} onChange={handleChange} className={inputCls + " pl-10"} placeholder="https://github.com/..." />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Twitter / X</label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                      <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} className={inputCls + " pl-10"} placeholder="https://twitter.com/..." />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                      <input type="url" name="website" value={formData.website} onChange={handleChange} className={inputCls + " pl-10"} placeholder="https://yoursite.com" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── SECTION 2: PRIVATE DATA ── */}
              <div className="border border-amber-700/40 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowPrivate(!showPrivate)}
                  className="w-full flex items-center gap-3 px-6 py-4 bg-amber-900/10 border-b border-amber-700/30 hover:bg-amber-900/20 transition-colors"
                >
                  <div className="p-1.5 bg-amber-500/10 rounded-lg"><Lock className="h-4 w-4 text-amber-400" /></div>
                  <div className="text-left">
                    <h2 className="font-space font-bold text-sm text-amber-300">Private Information</h2>
                    <p className="text-xs text-amber-600 font-space">Only visible to admins and you — never shown publicly</p>
                  </div>
                  <span className="ml-auto text-[10px] font-space font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">PRIVATE</span>
                  {showPrivate ? <EyeOff className="h-4 w-4 text-amber-500 ml-2" /> : <Eye className="h-4 w-4 text-amber-500 ml-2" />}
                </button>
                {showPrivate && (
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 bg-amber-900/5">
                    <div>
                      <label className={labelCls + " text-amber-500/70"}>Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputCls + " pl-10 border-amber-800/40 focus:border-amber-500"} placeholder="+1 234 567 8900" />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls + " text-amber-500/70"}>Timezone</label>
                      <input type="text" name="timezone" value={formData.timezone} onChange={handleChange} className={inputCls + " border-amber-800/40 focus:border-amber-500"} placeholder="UTC+5:30, EST, PST..." />
                    </div>
                  </div>
                )}
              </div>

              {/* ── TERMS ── */}
              <div className="border border-gray-800 rounded-xl p-5 bg-gray-900/30">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" name="agreed_to_terms" checked={formData.agreed_to_terms} onChange={handleChange} required className="mt-0.5 h-4 w-4 bg-black border-2 border-gray-700 checked:bg-orange-600 checked:border-orange-500 cursor-pointer rounded-sm" />
                  <span className="text-sm font-space text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">
                    I agree to the terms and conditions. I commit to being responsive and helpful to mentees, and understand my application will be reviewed by the Maximally team. <span className="text-orange-400">*</span>
                  </span>
                </label>
              </div>

              {/* ── SUBMIT ── */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="button" onClick={() => navigate('/mentors')} className="px-6 py-3 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 font-space font-bold text-xs transition-all rounded-sm">
                  CANCEL
                </button>
                <button type="submit" disabled={submitting || !formData.agreed_to_terms} className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-sm">
                  {submitting ? <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /><span>SUBMITTING...</span></> : <><CheckCircle2 className="h-4 w-4" /><span>SUBMIT MENTOR APPLICATION</span></>}
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
