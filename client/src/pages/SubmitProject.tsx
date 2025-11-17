import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Upload, Github, Link as LinkIcon, Video, FileText, ArrowLeft, Check, X, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
      
      // Fetch hackathon details
      const hackathonRes = await fetch(`/api/organizer/hackathons/${hackathonId}`, { headers });
      const hackathonData = await hackathonRes.json();
      if (hackathonData.success) {
        setHackathon(hackathonData.data);
      }

      // Fetch existing submission
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
      delete payload.tech_input;

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
          description: isDraft ? "Your draft has been saved" : "Your project has been submitted successfully"
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
        <div className="text-maximally-yellow font-press-start">LOADING...</div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-maximally-red font-press-start">HACKATHON_NOT_FOUND</div>
      </div>
    );
  }

  const parsedTracks = hackathon.tracks ? JSON.parse(hackathon.tracks) : [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b-4 border-maximally-red bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          <Link 
            to={`/hackathons/${hackathon.slug}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-maximally-yellow transition-colors font-jetbrains mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hackathon
          </Link>
          <h1 className="font-press-start text-2xl md:text-3xl text-maximally-red">
            {submission ? 'EDIT_SUBMISSION' : 'SUBMIT_PROJECT'}
          </h1>
          <p className="font-jetbrains text-gray-400 mt-2">{hackathon.hackathon_name}</p>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="font-press-start text-sm text-maximally-red mb-2 block">
              PROJECT_NAME *
            </label>
            <input
              type="text"
              value={formData.project_name}
              onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              placeholder="My Awesome Project"
              className="w-full pixel-card bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
              required
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="font-press-start text-sm text-maximally-red mb-2 block">
              TAGLINE
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="A short catchy description"
              className="w-full pixel-card bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-press-start text-sm text-maximally-red mb-2 block">
              DESCRIPTION *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your project, what it does, and how you built it..."
              rows={8}
              className="w-full pixel-card bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none resize-none"
              required
            />
          </div>

          {/* Track */}
          {parsedTracks.length > 0 && (
            <div>
              <label className="font-press-start text-sm text-maximally-red mb-2 block">
                TRACK
              </label>
              <select
                value={formData.track}
                onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                className="w-full pixel-card bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
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
              <label className="font-press-start text-sm text-maximally-red mb-2 block flex items-center gap-2">
                <Github className="h-4 w-4" />
                GITHUB_REPO
              </label>
              <input
                type="url"
                value={formData.github_repo}
                onChange={(e) => setFormData({ ...formData, github_repo: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full pixel-card bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
              />
            </div>

            <div>
              <label className="font-press-start text-sm text-maximally-red mb-2 block flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                DEMO_URL
              </label>
              <input
                type="url"
                value={formData.demo_url}
                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                placeholder="https://demo.com"
                className="w-full pixel-card bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
              />
            </div>

            <div>
              <label className="font-press-start text-sm text-maximally-red mb-2 block flex items-center gap-2">
                <Video className="h-4 w-4" />
                VIDEO_URL
              </label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://youtube.com/..."
                className="w-full pixel-card bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
              />
            </div>

            <div>
              <label className="font-press-start text-sm text-maximally-red mb-2 block flex items-center gap-2">
                <FileText className="h-4 w-4" />
                PRESENTATION
              </label>
              <input
                type="url"
                value={formData.presentation_url}
                onChange={(e) => setFormData({ ...formData, presentation_url: e.target.value })}
                placeholder="https://slides.com/..."
                className="w-full pixel-card bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
              />
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="font-press-start text-sm text-maximally-red mb-2 block">
              TECHNOLOGIES_USED
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={formData.tech_input}
                onChange={(e) => setFormData({ ...formData, tech_input: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                placeholder="React, Node.js, etc."
                className="flex-1 pixel-card bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
              />
              <button
                type="button"
                onClick={addTechnology}
                className="pixel-button bg-maximally-yellow text-black px-4 py-3 hover:bg-maximally-red hover:text-white transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies_used.map((tech, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="pixel-card bg-gray-800 text-white px-3 py-1 font-jetbrains flex items-center gap-2"
                >
                  {tech}
                  <button
                    onClick={() => removeTechnology(index)}
                    className="hover:text-maximally-red transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t-2 border-gray-800">
            <button
              onClick={() => handleSubmit(true)}
              disabled={submitting || !formData.project_name || !formData.description}
              className="flex-1 pixel-button bg-gray-700 text-white px-6 py-4 font-press-start text-sm hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              SAVE_DRAFT
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting || !formData.project_name || !formData.description}
              className="flex-1 pixel-button bg-maximally-red text-white px-6 py-4 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Upload className="h-5 w-5" />
              {submitting ? 'SUBMITTING...' : 'SUBMIT_PROJECT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
