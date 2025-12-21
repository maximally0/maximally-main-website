import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Upload, Github, Link as LinkIcon, Video, FileText, ArrowLeft, X, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';

export default function SubmitProject() {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [hackathon, setHackathon] = useState<any>(null);
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
    tech_input: ''
  });

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/hackathons/${hackathonId}/submit`);
      return;
    }
    fetchData();
  }, [user, hackathonId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      
      const hackathonRes = await fetch(`/api/organizer/hackathons/${hackathonId}`, { headers });
      const hackathonData = await hackathonRes.json();
      if (hackathonData.success) {
        setHackathon(hackathonData.data);
      }

      const submissionRes = await fetch(`/api/hackathons/${hackathonId}/my-submission`, { headers });
      const submissionData = await submissionRes.json();
      
      if (submissionData.success && submissionData.data) {
        setSubmission(submissionData.data);
        setFormData({
          project_name: submissionData.data.project_name || '',
          tagline: submissionData.data.tagline || '',
          description: submissionData.data.description || '',
          track: submissionData.data.track || '',
          github_repo: submissionData.data.github_repo || '',
          demo_url: submissionData.data.demo_url || '',
          video_url: submissionData.data.video_url || '',
          presentation_url: submissionData.data.presentation_url || '',
          technologies_used: submissionData.data.technologies_used || [],
          tech_input: ''
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (isDraft: boolean) => {
    try {
      setSubmitting(true);
      const headers = await getAuthHeaders();
      
      const payload = {
        ...formData,
        status: isDraft ? 'draft' : 'submitted'
      };
      delete (payload as any).tech_input;

      const url = submission 
        ? `/api/hackathons/${hackathonId}/submissions/${submission.id}`
        : `/api/hackathons/${hackathonId}/submissions`;
      
      const method = submission ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        toast({ 
          title: isDraft ? "✅ Draft Saved!" : "🎉 Project Submitted!",
          description: isDraft ? "Your draft has been saved" : "Your project has been submitted! Check your email for confirmation."
        });
        navigate(`/hackathons/${hackathon.slug}`);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ 
        title: "❌ Submission Failed", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const addTechnology = () => {
    if (formData.tech_input.trim()) {
      setFormData({
        ...formData,
        technologies_used: [...formData.technologies_used, formData.tech_input.trim()],
        tech_input: ''
      });
    }
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies_used: formData.technologies_used.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-300 font-press-start">LOADING...</div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-pink-400 font-press-start">HACKATHON NOT FOUND</div>
      </div>
    );
  }

  const parsedTracks = hackathon.tracks ? JSON.parse(hackathon.tracks) : [];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
      
      {/* Header */}
      <div className="border-b border-purple-500/30 bg-black/60 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-6">
          <Link 
            to={`/hackathons/${hackathon.slug}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-300 transition-colors font-jetbrains mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hackathon
          </Link>
          <h1 className="font-press-start text-xl md:text-2xl">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              {submission ? 'EDIT SUBMISSION' : 'SUBMIT PROJECT'}
            </span>
          </h1>
          <p className="font-jetbrains text-gray-400 mt-2">{hackathon.hackathon_name}</p>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="font-press-start text-xs text-purple-300 mb-2 block">
              PROJECT NAME *
            </label>
            <input
              type="text"
              value={formData.project_name}
              onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              placeholder="My Awesome Project"
              className="w-full bg-black/40 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none transition-colors"
              required
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="font-press-start text-xs text-purple-300 mb-2 block">
              TAGLINE
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="A short catchy description"
              className="w-full bg-black/40 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-press-start text-xs text-purple-300 mb-2 block">
              DESCRIPTION *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your project, what it does, and how you built it..."
              rows={8}
              className="w-full bg-black/40 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none resize-none transition-colors"
              required
            />
          </div>

          {/* Track */}
          {parsedTracks.length > 0 && (
            <div>
              <label className="font-press-start text-xs text-purple-300 mb-2 block">
                TRACK
              </label>
              <select
                value={formData.track}
                onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                className="w-full bg-black/40 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none transition-colors"
              >
                <option value="">Select a track</option>
                {parsedTracks.map((track: string, index: number) => (
                  <option key={index} value={track}>{track}</option>
                ))}
              </select>
            </div>
          )}

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-press-start text-xs text-cyan-300 mb-2 block flex items-center gap-2">
                <Github className="h-4 w-4" />
                GITHUB REPO
              </label>
              <input
                type="url"
                value={formData.github_repo}
                onChange={(e) => setFormData({ ...formData, github_repo: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full bg-black/40 border border-cyan-500/30 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="font-press-start text-xs text-pink-300 mb-2 block flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                DEMO URL
              </label>
              <input
                type="url"
                value={formData.demo_url}
                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                placeholder="https://demo.com"
                className="w-full bg-black/40 border border-pink-500/30 text-white px-4 py-3 font-jetbrains focus:border-pink-400 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="font-press-start text-xs text-amber-300 mb-2 block flex items-center gap-2">
                <Video className="h-4 w-4" />
                VIDEO URL
              </label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://youtube.com/..."
                className="w-full bg-black/40 border border-amber-500/30 text-white px-4 py-3 font-jetbrains focus:border-amber-400 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="font-press-start text-xs text-green-300 mb-2 block flex items-center gap-2">
                <FileText className="h-4 w-4" />
                PRESENTATION
              </label>
              <input
                type="url"
                value={formData.presentation_url}
                onChange={(e) => setFormData({ ...formData, presentation_url: e.target.value })}
                placeholder="https://slides.com/..."
                className="w-full bg-black/40 border border-green-500/30 text-white px-4 py-3 font-jetbrains focus:border-green-400 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="font-press-start text-xs text-purple-300 mb-2 block">
              TECHNOLOGIES USED
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={formData.tech_input}
                onChange={(e) => setFormData({ ...formData, tech_input: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                placeholder="React, Node.js, etc."
                className="flex-1 bg-black/40 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={addTechnology}
                className="bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 px-4 py-3 transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies_used.map((tech, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="bg-purple-500/20 border border-purple-500/30 text-purple-300 px-3 py-1 font-jetbrains flex items-center gap-2"
                >
                  {tech}
                  <button
                    onClick={() => removeTechnology(index)}
                    className="hover:text-pink-400 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-purple-500/20">
            <button
              onClick={() => handleSubmit(true)}
              disabled={submitting || !formData.project_name || !formData.description}
              className="flex-1 bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 text-gray-300 hover:text-purple-300 px-6 py-4 font-press-start text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              SAVE DRAFT
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting || !formData.project_name || !formData.description}
              className="flex-1 bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white px-6 py-4 font-press-start text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Upload className="h-5 w-5" />
              {submitting ? 'SUBMITTING...' : 'SUBMIT PROJECT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
