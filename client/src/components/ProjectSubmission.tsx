import { useState, useEffect } from 'react';
import { Upload, Github, Link as LinkIcon, Video, FileText, X, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';

interface Props {
  hackathonId: number;
  hackathonName: string;
  tracks?: string;
  submissionDeadline?: string;
}

export default function ProjectSubmission({ hackathonId, hackathonName, tracks, submissionDeadline }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
          tech_input: ''
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

  const handleSubmit = async (isDraft: boolean) => {
    if (!formData.project_name || !formData.description) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in project name and description",
        variant: "destructive",
      });
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...formData,
          status: isDraft ? 'draft' : 'submitted'
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: isDraft ? "Draft Saved!" : "Project Submitted!",
          description: isDraft 
            ? "Your project has been saved as draft" 
            : "Your project has been submitted successfully!",
        });
        setSubmission(data.data);
        setShowModal(false);
        fetchSubmission();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Check if submissions are closed
  const isSubmissionClosed = () => {
    if (!submissionDeadline) return false;
    return new Date() > new Date(submissionDeadline);
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="font-press-start text-sm text-gray-400">LOADING...</div>
      </div>
    );
  }

  // If submissions are closed and no existing submission
  if (isSubmissionClosed() && (!submission || submission.status === 'draft')) {
    return (
      <div className="pixel-card bg-red-900/20 border-2 border-red-500 p-6 text-center">
        <h3 className="font-press-start text-red-500 mb-2">SUBMISSIONS_CLOSED</h3>
        <p className="font-jetbrains text-gray-300">
          Submission deadline was {new Date(submissionDeadline!).toLocaleString()}
        </p>
      </div>
    );
  }

  // Already submitted
  if (submission && submission.status === 'submitted') {
    return (
      <div className="pixel-card bg-green-900/20 border-2 border-green-500 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Check className="h-6 w-6 text-green-500" />
          <div>
            <h3 className="font-press-start text-sm text-green-500">PROJECT_SUBMITTED</h3>
            <p className="font-jetbrains text-gray-300 text-sm">{submission.project_name}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm font-jetbrains text-gray-300">
          {submission.tagline && <p className="italic">"{submission.tagline}"</p>}
          {submission.github_repo && (
            <a href={submission.github_repo} target="_blank" rel="noopener noreferrer" 
               className="flex items-center gap-2 text-maximally-yellow hover:text-maximally-red">
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          )}
          {submission.demo_url && (
            <a href={submission.demo_url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 text-maximally-yellow hover:text-maximally-red">
              <LinkIcon className="h-4 w-4" />
              Live Demo
            </a>
          )}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="pixel-button bg-maximally-yellow text-black px-6 py-3 font-press-start text-sm hover:bg-maximally-red hover:text-white transition-colors w-full mt-4"
        >
          EDIT_SUBMISSION
        </button>
      </div>
    );
  }

  // Draft or no submission
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="pixel-button bg-maximally-red hover:bg-maximally-yellow text-white hover:text-black px-8 py-4 font-press-start text-sm transition-all flex items-center gap-2 border-2 border-maximally-red hover:border-maximally-yellow w-full justify-center"
      >
        <Upload className="h-5 w-5" />
        {submission ? 'CONTINUE_DRAFT' : 'SUBMIT_PROJECT'}
      </button>

      {/* Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="pixel-card bg-black border-4 border-maximally-red max-w-4xl w-full my-8">
            <div className="p-6 border-b-2 border-maximally-red">
              <div className="flex items-center justify-between">
                <h2 className="font-press-start text-xl text-maximally-red">SUBMIT_PROJECT</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Project Name */}
              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  placeholder="My Awesome Project"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  placeholder="A short catchy description"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none resize-none"
                  placeholder="Describe your project, what it does, and how you built it..."
                />
              </div>

              {/* Track */}
              {parsedTracks.length > 0 && (
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Track</label>
                  <select
                    value={formData.track}
                    onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                  >
                    <option value="">Select a track</option>
                    {parsedTracks.map((track: any, i: number) => (
                      <option key={i} value={track.name}>{track.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub Repository
                  </label>
                  <input
                    type="url"
                    value={formData.github_repo}
                    onChange={(e) => setFormData({ ...formData, github_repo: e.target.value })}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                    placeholder="https://github.com/user/repo"
                  />
                </div>

                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.demo_url}
                    onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                    placeholder="https://demo.example.com"
                  />
                </div>

                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <label className="font-jetbrains text-sm text-gray-300 mb-2 block flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Presentation URL
                  </label>
                  <input
                    type="url"
                    value={formData.presentation_url}
                    onChange={(e) => setFormData({ ...formData, presentation_url: e.target.value })}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                    placeholder="https://slides.com/..."
                  />
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Technologies Used</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.tech_input}
                    onChange={(e) => setFormData({ ...formData, tech_input: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                    className="flex-1 bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none"
                    placeholder="React, Node.js, etc."
                  />
                  <button
                    onClick={handleAddTech}
                    className="pixel-button bg-maximally-yellow text-black px-6 py-3 font-press-start text-sm hover:bg-maximally-red hover:text-white"
                  >
                    ADD
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies_used.map((tech, i) => (
                    <span key={i} className="inline-flex items-center gap-2 bg-maximally-yellow/20 border border-maximally-yellow px-3 py-1 rounded font-jetbrains text-sm text-maximally-yellow">
                      {tech}
                      <button onClick={() => handleRemoveTech(i)} className="hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleSubmit(true)}
                  className="flex-1 pixel-button bg-gray-700 text-white px-6 py-3 font-press-start text-sm hover:bg-gray-600 transition-colors"
                >
                  SAVE_DRAFT
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  className="flex-1 pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors"
                >
                  SUBMIT_PROJECT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
