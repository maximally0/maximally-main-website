import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Trophy, Github, Link as LinkIcon, Video, FileText, X, Check, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { getAuthHeaders } from '@/lib/auth';

interface Hackathon {
  id: number;
  hackathon_name: string;
  slug: string;
  tagline?: string;
  start_date: string;
  end_date: string;
  format: string;
  tracks?: string;
  submission_opens_at?: string;
  submission_closes_at?: string;
  total_prize_pool?: string;
}

// Inline Submission Form Component
function SubmissionForm({ hackathonId, hackathonName, tracks, submissionDeadline }: {
  hackathonId: number;
  hackathonName: string;
  tracks?: string;
  submissionDeadline?: string;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    project_name: '',
    tagline: '',
    description: '',
    track: '',
    github_repo: '',
    demo_url: '',
    video_url: '',
    presentation_url: '',
    technologies_used: [] as string[],
    tech_input: '',
    logo_url: ''
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const parsedTracks = tracks ? JSON.parse(tracks) : [];

  useEffect(() => {
    if (user) {
      fetchSubmission();
    }
  }, [user, hackathonId]);

  const fetchSubmission = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/my-submission`, { headers });
      const data = await response.json();

      if (data.success && data.data) {
        setSubmission(data.data);
        setFormData({
          project_name: data.data.project_name || '',
          tagline: data.data.tagline || '',
          description: data.data.description || '',
          track: data.data.track || '',
          github_repo: data.data.github_repo || '',
          demo_url: data.data.demo_url || '',
          video_url: data.data.video_url || '',
          presentation_url: data.data.presentation_url || '',
          technologies_used: data.data.technologies_used || [],
          tech_input: '',
          logo_url: data.data.logo_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTech = () => {
    if (formData.tech_input.trim()) {
      setFormData({
        ...formData,
        technologies_used: [...formData.technologies_used, formData.tech_input.trim()],
        tech_input: ''
      });
    }
  };

  const handleRemoveTech = (index: number) => {
    setFormData({
      ...formData,
      technologies_used: formData.technologies_used.filter((_, i) => i !== index)
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!submission?.id) {
      toast({
        title: "Save Draft First",
        description: "Please save your project as a draft before uploading a logo",
        variant: "destructive",
      });
      return;
    }

    setUploadingLogo(true);
    const uploadFormData = new FormData();
    uploadFormData.append('logo', file);

    try {
      const headers = await getAuthHeaders();
      delete headers['Content-Type']; // Let browser set it with boundary
      
      const response = await fetch(`/api/submissions/${submission.id}/upload-logo`, {
        method: 'POST',
        headers,
        body: uploadFormData
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, logo_url: data.logo_url }));
        toast({ title: "Logo uploaded successfully!" });
        fetchSubmission(); // Refresh to get updated data
      } else {
        toast({ title: "Failed to upload logo", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error uploading logo", variant: "destructive" });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!formData.project_name || !formData.description) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in project name and description",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          project_name: formData.project_name,
          tagline: formData.tagline,
          description: formData.description,
          track: formData.track,
          github_repo: formData.github_repo,
          demo_url: formData.demo_url,
          video_url: formData.video_url,
          presentation_url: formData.presentation_url,
          technologies_used: formData.technologies_used,
          status: isDraft ? 'draft' : 'submitted'
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: isDraft ? "Draft Saved!" : "Project Submitted!",
          description: isDraft ? "Your project has been saved as a draft" : "Your project has been submitted successfully",
        });
        fetchSubmission();
      } else {
        toast({
          title: "Submission Failed",
          description: data.message || "Failed to submit project",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while submitting",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pixel-card bg-gray-900 border-2 border-maximally-red p-8">
        <div className="text-center font-press-start text-maximally-yellow">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Existing Submission Notice */}
      {submission && (
        <div className="pixel-card bg-blue-900/20 border-2 border-blue-500 p-4">
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-blue-400" />
            <div className="flex-1">
              <p className="font-press-start text-sm text-blue-400 mb-1">ONE SUBMISSION PER HACKATHON</p>
              <p className="text-sm text-gray-300 font-jetbrains">
                You already have a submission for this hackathon. You can update it below.
              </p>
              <p className="text-xs text-gray-400 font-jetbrains mt-2">
                Current Status: <span className="text-maximally-yellow font-press-start">{submission.status?.toUpperCase()}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="pixel-card bg-gray-900 border-2 border-maximally-red p-8">
        <h2 className="font-press-start text-2xl text-maximally-red mb-6">PROJECT_DETAILS</h2>
        
        <div className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block font-press-start text-sm text-maximally-yellow mb-2">
              PROJECT_NAME *
            </label>
            <input
              type="text"
              value={formData.project_name}
              onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              className="w-full bg-black border-2 border-gray-700 focus:border-maximally-yellow px-4 py-3 text-white font-jetbrains transition-colors"
              placeholder="Enter your project name"
              required
            />
          </div>

          {/* Project Logo */}
          <div>
            <label className="block font-press-start text-sm text-maximally-yellow mb-2">
              PROJECT_LOGO
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={uploadingLogo || !submission}
              className="w-full bg-black border-2 border-gray-700 focus:border-maximally-yellow px-4 py-3 text-white font-jetbrains transition-colors file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-maximally-red file:text-white file:font-press-start file:text-xs hover:file:bg-maximally-yellow hover:file:text-black disabled:opacity-50"
            />
            {uploadingLogo && (
              <p className="text-xs text-maximally-yellow font-jetbrains mt-2">Uploading...</p>
            )}
            {formData.logo_url && (
              <div className="mt-3">
                <img 
                  src={formData.logo_url} 
                  alt="Project logo" 
                  className="w-32 h-32 object-cover border-2 border-maximally-yellow"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            )}
            {!submission && (
              <p className="text-xs text-gray-500 font-jetbrains mt-2">Save as draft first to upload logo</p>
            )}
          </div>

          {/* Tagline */}
          <div>
            <label className="block font-press-start text-sm text-maximally-yellow mb-2">
              TAGLINE
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full bg-black border-2 border-gray-700 focus:border-maximally-yellow px-4 py-3 text-white font-jetbrains transition-colors"
              placeholder="A short catchy description"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-press-start text-sm text-maximally-yellow mb-2">
              DESCRIPTION *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-black border-2 border-gray-700 focus:border-maximally-yellow px-4 py-3 text-white font-jetbrains transition-colors min-h-[200px]"
              placeholder="Describe your project, what it does, and how you built it..."
              required
            />
          </div>

          {/* Track Selection */}
          {parsedTracks.length > 0 && (
            <div>
              <label className="block font-press-start text-sm text-maximally-yellow mb-2">
                TRACK
              </label>
              <select
                value={formData.track}
                onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                className="w-full bg-black border-2 border-gray-700 focus:border-maximally-yellow px-4 py-3 text-white font-jetbrains transition-colors"
              >
                <option value="">Select a track (optional)</option>
                {parsedTracks.map((track: any, index: number) => (
                  <option key={index} value={track.name}>{track.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Technologies */}
          <div>
            <label className="block font-press-start text-sm text-maximally-yellow mb-2">
              TECHNOLOGIES_USED
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={formData.tech_input}
                onChange={(e) => setFormData({ ...formData, tech_input: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                className="flex-1 bg-black border-2 border-gray-700 focus:border-maximally-yellow px-4 py-3 text-white font-jetbrains transition-colors"
                placeholder="e.g., React, Node.js, Python"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="pixel-button bg-maximally-yellow text-black px-6 py-3 font-press-start text-sm hover:bg-maximally-red hover:text-white transition-colors"
              >
                ADD
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies_used.map((tech, index) => (
                <div key={index} className="inline-flex items-center gap-2 bg-maximally-yellow/20 border border-maximally-yellow px-3 py-1 rounded">
                  <span className="text-sm font-jetbrains text-maximally-yellow">{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(index)}
                    className="text-maximally-red hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="border-t-2 border-gray-800 pt-6">
            <h3 className="font-press-start text-lg text-maximally-yellow mb-4">PROJECT_LINKS</h3>
            
            <div className="space-y-4">
              {/* GitHub */}
              <div>
                <label className="flex items-center gap-2 font-press-start text-sm text-gray-300 mb-2">
                  <Github className="h-4 w-4" />
                  GITHUB_REPOSITORY
                </label>
                <input
                  type="url"
                  value={formData.github_repo}
                  onChange={(e) => setFormData({ ...formData, github_repo: e.target.value })}
                  className="w-full bg-black border-2 border-gray-700 focus:border-maximally-yellow px-4 py-3 text-white font-jetbrains transition-colors"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              {/* Demo URL */}
              <div>
                <label className="flex items-center gap-2 font-press-start text-sm text-gray-300 mb-2">
                  <LinkIcon className="h-4 w-4" />
                  LIVE_DEMO
                </label>
                <input
                  type="url"
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                  className="w-full bg-black border-2 border-gray-700 focus:border-maximally-yellow px-4 py-3 text-white font-jetbrains transition-colors"
                  placeholder="https://your-demo.com"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="flex items-center gap-2 font-press-start text-sm text-gray-300 mb-2">
                  <Video className="h-4 w-4" />
                  VIDEO_DEMO
                </label>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  className="w-full bg-black border-2 border-gray-700 focus:border-maximally-yellow px-4 py-3 text-white font-jetbrains transition-colors"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              {/* Presentation */}
              <div>
                <label className="flex items-center gap-2 font-press-start text-sm text-gray-300 mb-2">
                  <FileText className="h-4 w-4" />
                  PRESENTATION
                </label>
                <input
                  type="url"
                  value={formData.presentation_url}
                  onChange={(e) => setFormData({ ...formData, presentation_url: e.target.value })}
                  className="w-full bg-black border-2 border-gray-700 focus:border-maximally-yellow px-4 py-3 text-white font-jetbrains transition-colors"
                  placeholder="https://docs.google.com/presentation/..."
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-gray-800">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={submitting}
              className="flex-1 pixel-button bg-gray-700 text-white px-6 py-4 font-press-start text-sm hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'SAVING...' : 'SAVE_AS_DRAFT'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="flex-1 pixel-button bg-maximally-red text-white px-6 py-4 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'SUBMITTING...' : 'SUBMIT_PROJECT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HackathonSubmit() {
  const { slug } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your project.",
        variant: "destructive",
      });
      navigate(`/login?redirect=/hackathon/${slug}/submit`);
      return;
    }

    if (slug) {
      fetchHackathon();
    }
  }, [slug, user]);

  const fetchHackathon = async () => {
    try {
      const response = await fetch(`/api/hackathons/${slug}`);
      const data = await response.json();

      if (data.success) {
        setHackathon(data.data);
      } else {
        toast({
          title: "Not Found",
          description: "This hackathon doesn't exist or hasn't been published yet.",
          variant: "destructive",
        });
        navigate('/events');
      }
    } catch (error) {
      console.error('Error fetching hackathon:', error);
      toast({
        title: "Error",
        description: "Failed to load hackathon details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-press-start text-maximally-red">LOADING...</div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-press-start text-2xl text-maximally-red mb-4">404</h1>
          <p className="font-jetbrains text-gray-400 mb-6">Hackathon not found</p>
          <Link to="/events" className="pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm">
            BROWSE_HACKATHONS
          </Link>
        </div>
      </div>
    );
  }

  const startDate = new Date(hackathon.start_date);
  const endDate = new Date(hackathon.end_date);
  const submissionDeadline = hackathon.submission_closes_at 
    ? new Date(hackathon.submission_closes_at) 
    : endDate;

  // Check if submissions are open (using IST timezone)
  const now = new Date();
  const submissionsClosed = hackathon.submission_closes_at && new Date(hackathon.submission_closes_at) < now;
  const submissionsNotOpen = hackathon.submission_opens_at && new Date(hackathon.submission_opens_at) > now;

  // Submissions not open yet
  if (submissionsNotOpen) {
    const opensAt = new Date(hackathon.submission_opens_at!);
    const formattedDate = opensAt.toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
    const formattedTime = opensAt.toLocaleTimeString('en-IN', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });

    return (
      <>
        <SEO
          title={`Submissions Not Open - ${hackathon.hackathon_name} - Maximally`}
          description={`Submissions for ${hackathon.hackathon_name} will open soon`}
        />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center max-w-2xl px-4">
            <div className="pixel-card bg-yellow-900/20 border-4 border-yellow-500 p-12">
              <Upload className="h-16 w-16 text-yellow-500 mx-auto mb-6 animate-pulse" />
              <h1 className="font-press-start text-2xl text-yellow-400 mb-4">SUBMISSIONS_NOT_OPEN</h1>
              <p className="font-jetbrains text-gray-300 mb-2">
                Submissions for {hackathon.hackathon_name} will open on:
              </p>
              <p className="font-jetbrains text-xl text-yellow-400 font-bold mb-1">
                {formattedDate}
              </p>
              <p className="font-jetbrains text-sm text-gray-400 mb-6">
                at {formattedTime} IST
              </p>
              <Link 
                to={`/hackathon/${slug}`}
                className="pixel-button bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-3 font-press-start text-sm inline-flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                BACK_TO_HACKATHON
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Submissions closed
  if (submissionsClosed) {
    return (
      <>
        <SEO
          title={`Submissions Closed - ${hackathon.hackathon_name} - Maximally`}
          description={`Submissions for ${hackathon.hackathon_name} are now closed`}
        />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center max-w-2xl px-4">
            <div className="pixel-card bg-gray-900 border-4 border-gray-700 p-12">
              <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-6" />
              <h1 className="font-press-start text-2xl text-gray-400 mb-4">SUBMISSIONS_CLOSED</h1>
              <p className="font-jetbrains text-gray-400 mb-6">
                Submissions for {hackathon.hackathon_name} have been closed. 
                Thank you for your interest! Stay tuned for results.
              </p>
              <Link 
                to={`/hackathon/${slug}`}
                className="pixel-button bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 font-press-start text-sm inline-flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                BACK_TO_HACKATHON
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO
        title={`Submit Project - ${hackathon.hackathon_name} - Maximally`}
        description={`Submit your project for ${hackathon.hackathon_name}`}
        keywords={`hackathon, ${hackathon.format}, project submission`}
      />

      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="pt-32 pb-12 bg-gradient-to-b from-gray-900 via-black to-black border-b-4 border-maximally-red relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(229,9,20,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <Link 
                to={`/hackathon/${slug}`}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-maximally-red transition-colors mb-6 font-jetbrains"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Hackathon
              </Link>

              {/* Title */}
              <h1 className="font-press-start text-3xl sm:text-4xl md:text-5xl mb-4 text-white leading-tight drop-shadow-[4px_4px_0px_rgba(229,9,20,1)]">
                SUBMIT_PROJECT
              </h1>

              <p className="text-xl text-gray-400 mb-6 font-jetbrains">
                {hackathon.hackathon_name}
              </p>

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="pixel-card bg-black/50 border-2 border-maximally-yellow p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-maximally-yellow" />
                    <div>
                      <div className="text-xs text-gray-400 font-press-start mb-1">DEADLINE</div>
                      <div className="text-sm text-white font-jetbrains">
                        {submissionDeadline.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pixel-card bg-black/50 border-2 border-maximally-yellow p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-maximally-yellow" />
                    <div>
                      <div className="text-xs text-gray-400 font-press-start mb-1">PRIZE_POOL</div>
                      <div className="text-sm text-white font-jetbrains">
                        {hackathon.total_prize_pool || 'TBA'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pixel-card bg-black/50 border-2 border-maximally-yellow p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-maximally-yellow" />
                    <div>
                      <div className="text-xs text-gray-400 font-press-start mb-1">FORMAT</div>
                      <div className="text-sm text-white font-jetbrains capitalize">
                        {hackathon.format}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Submission Form Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Inline Submission Form */}
              <SubmissionForm 
                hackathonId={hackathon.id} 
                hackathonName={hackathon.hackathon_name}
                tracks={hackathon.tracks}
                submissionDeadline={hackathon.end_date}
              />

              {/* Submission Guidelines */}
              <div className="mt-8 pixel-card bg-gray-900/50 border-2 border-gray-800 p-6">
                <h3 className="font-press-start text-lg text-maximally-yellow mb-4">SUBMISSION_TIPS</h3>
                <ul className="space-y-3 text-gray-300 font-jetbrains">
                  <li className="flex items-start gap-3">
                    <span className="text-maximally-red mt-1">•</span>
                    <span>Make sure your project title is clear and descriptive</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-maximally-red mt-1">•</span>
                    <span>Include a detailed description of what your project does and how you built it</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-maximally-red mt-1">•</span>
                    <span>Add links to your live demo, GitHub repository, or video presentation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-maximally-red mt-1">•</span>
                    <span>List all technologies and tools you used</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-maximally-red mt-1">•</span>
                    <span>Upload screenshots or a demo video to showcase your work</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
