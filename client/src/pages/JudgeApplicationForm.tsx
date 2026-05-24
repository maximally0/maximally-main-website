import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import {
  Award, MapPin, Globe, Linkedin, Twitter, Github,
  Phone, CheckCircle2, ArrowLeft, Sparkles, User,
  Lock, Eye, EyeOff
} from 'lucide-react';

interface FormData {
  // PUBLIC — shown on judge profile
  headline: string;
  shortBio: string;
  location: string;
  currentRole: string;
  company: string;
  primaryExpertise: string;
  yearsOfExperience: string;
  totalEventsJudged: string;
  availabilityStatus: string;
  mentorshipStatement: string;
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
  // PRIVATE — only visible to admins & the judge themselves
  phone: string;
  address: string;
  timezone: string;
  compensationPreference: string;
  agreedToNDA: boolean;
  agreed_to_terms: boolean;
}

const inputCls = "w-full bg-black/60 border border-gray-800 text-white px-4 py-3 font-space text-sm focus:border-orange-500 focus:outline-none transition-colors placeholder:text-gray-600 rounded-sm";
const labelCls = "block text-xs font-space font-semibold text-gray-400 uppercase tracking-wider mb-2";

const JudgeApplicationForm = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [showPrivate, setShowPrivate] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    headline: '', shortBio: '', location: '', currentRole: '', company: '',
    primaryExpertise: '', yearsOfExperience: '0', totalEventsJudged: '0',
    availabilityStatus: 'available', mentorshipStatement: '',
    linkedin: '', github: '', twitter: '', website: '',
    phone: '', address: '', timezone: '', compensationPreference: 'volunteer',
    agreedToNDA: false, agreed_to_terms: false,
  });

  useEffect(() => {
    if (!authLoading && !user) navigate('/login?redirect=/judge/apply');
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
      const res = await fetch('/api/judges/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
          availabilityStatus: formData.availabilityStatus,
          mentorshipStatement: formData.mentorshipStatement,
          linkedin: formData.linkedin,
          github: formData.github,
          twitter: formData.twitter,
          website: formData.website,
          // private
          phone: formData.phone,
          address: formData.address,
          timezone: formData.timezone,
          compensationPreference: formData.compensationPreference,
          agreedToNDA: formData.agreedToNDA,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit');
      toast({ title: '🎉 Application Submitted!', description: "We'll review it within 3–5 business days." });
      setTimeout(() => navigate('/judges'), 2000);
    } catch (err: any) {
      toast({ title: 'Submission Failed', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-orange-400 font-space text-sm animate-pulse">LOADING...</div></div>;

  return (
    <>
      <SEO title="Judge Application — Maximally" description="Apply to become a judge on the Maximally platform." />
      <div className="min-h-screen bg-black text-white">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.06)_0%,transparent_60%)] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 py-16 relative z-10">
          <div className="max-w-3xl mx-auto">

            {/* Back */}
            <button onClick={() => navigate('/judges')} className="flex items-center gap-2 text-gray-500 hover:text-orange-400 transition-colors mb-10 text-sm font-space">
              <ArrowLeft className="h-4 w-4" /> Back to Judges
            </button>

            {/* Header */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
                <Award className="h-3.5 w-3.5 text-orange-400" />
                <span className="font-space font-bold text-[10px] text-orange-400 tracking-widest uppercase">Judge Application</span>
              </div>
              <h1 className="font-space font-bold text-3xl sm:text-4xl text-white mb-3">Become a Judge</h1>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                Evaluate hackathon submissions and help builders grow. Applications are reviewed within 3–5 business days.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── SECTION 1: PUBLIC PROFILE ── */}
              <div className="border border-gray-800 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 bg-gray-900/60 border-b border-gray-800">
                  <div className="p-1.5 bg-orange-500/10 rounded-lg"><User className="h-4 w-4 text-orange-400" /></div>
                  <div>
                    <h2 className="font-space font-bold text-sm text-white">Public Profile</h2>
                    <p className="text-xs text-gray-500 font-space">Visible to everyone on your judge profile</p>
                  </div>
                  <span className="ml-auto text-[10px] font-space font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">PUBLIC</span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className={labelCls}>Professional Headline <span className="text-orange-400">*</span></label>
                    <input type="text" name="headline" value={formData.headline} onChange={handleChange} required className={inputCls} placeholder="e.g. Senior Engineer at Google | AI/ML Expert" />
                  </div>
                  <div>
                    <label className={labelCls}>Current Role</label>
                    <input type="text" name="currentRole" value={formData.currentRole} onChange={handleChange} className={inputCls} placeholder="Software Engineer" />
                  </div>
                  <div>
                    <label className={labelCls}>Company / Organization</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} className={inputCls} placeholder="Google, MIT, etc." />
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
                    <label className={labelCls}>Short Bio <span className="text-orange-400">*</span></label>
                    <textarea name="shortBio" value={formData.shortBio} onChange={handleChange} required rows={3} className={inputCls + " resize-none"} placeholder="Tell us about yourself and your background..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Primary Expertise Areas <span className="text-orange-400">*</span></label>
                    <input type="text" name="primaryExpertise" value={formData.primaryExpertise} onChange={handleChange} required className={inputCls} placeholder="AI/ML, Web3, Product Design (comma-separated)" />
                    <p className="text-xs text-gray-600 mt-1 font-space">Separate with commas</p>
                  </div>
                  <div>
                    <label className={labelCls}>Hackathons Judged Previously</label>
                    <input type="number" name="totalEventsJudged" value={formData.totalEventsJudged} onChange={handleChange} min="0" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Availability</label>
                    <select name="availabilityStatus" value={formData.availabilityStatus} onChange={handleChange} className={inputCls}>
                      <option value="available">Available</option>
                      <option value="busy">Busy (limited)</option>
                      <option value="unavailable">Not available right now</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Why do you want to judge? <span className="text-orange-400">*</span></label>
                    <textarea name="mentorshipStatement" value={formData.mentorshipStatement} onChange={handleChange} required rows={4} className={inputCls + " resize-none"} placeholder="What do you bring to the table as a judge?" />
                  </div>
                  {/* Social links */}
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
                    <div className="md:col-span-2">
                      <label className={labelCls + " text-amber-500/70"}>Address / City</label>
                      <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputCls + " border-amber-800/40 focus:border-amber-500"} placeholder="Your city or full address" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls + " text-amber-500/70"}>Compensation Preference</label>
                      <select name="compensationPreference" value={formData.compensationPreference} onChange={handleChange} className={inputCls + " border-amber-800/40 focus:border-amber-500"}>
                        <option value="volunteer">Volunteer (no compensation needed)</option>
                        <option value="paid">Paid engagements only</option>
                        <option value="either">Either is fine</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" name="agreedToNDA" checked={formData.agreedToNDA} onChange={handleChange} className="mt-0.5 h-4 w-4 bg-black border-2 border-gray-700 checked:bg-amber-600 checked:border-amber-500 cursor-pointer rounded-sm" />
                        <span className="text-xs font-space text-amber-600/80 group-hover:text-amber-400 transition-colors leading-relaxed">
                          I agree to maintain confidentiality of all submissions and hackathon materials I review as a judge.
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* ── TERMS ── */}
              <div className="border border-gray-800 rounded-xl p-5 bg-gray-900/30">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" name="agreed_to_terms" checked={formData.agreed_to_terms} onChange={handleChange} required className="mt-0.5 h-4 w-4 bg-black border-2 border-gray-700 checked:bg-orange-600 checked:border-orange-500 cursor-pointer rounded-sm" />
                  <span className="text-sm font-space text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">
                    I agree to the terms and conditions. I understand my application will be reviewed by the Maximally team and I may be contacted for additional information. <span className="text-orange-400">*</span>
                  </span>
                </label>
              </div>

              {/* ── SUBMIT ── */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="button" onClick={() => navigate('/judges')} className="px-6 py-3 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 font-space font-bold text-xs transition-all rounded-sm">
                  CANCEL
                </button>
                <button type="submit" disabled={submitting || !formData.agreed_to_terms} className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-sm">
                  {submitting ? <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /><span>SUBMITTING...</span></> : <><CheckCircle2 className="h-4 w-4" /><span>SUBMIT JUDGE APPLICATION</span></>}
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
