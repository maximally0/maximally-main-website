import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Github,
  Globe,
  Video,
  ExternalLink,
  Plus,
  X,
  Layers,
  Info,
  Sparkles
} from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const CATEGORIES = [
  'AI/ML',
  'Web App',
  'Mobile App',
  'Developer Tools',
  'Productivity',
  'Education',
  'Healthcare',
  'Finance',
  'Gaming',
  'Social',
  'E-commerce',
  'IoT/Hardware',
  'Blockchain/Web3',
  'Other'
];

export default function GallerySubmit() {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    description: '',
    logo_url: '',
    cover_image_url: '',
    github_url: '',
    demo_url: '',
    video_url: '',
    website_url: '',
    category: '',
    technologies: [] as string[],
    tags: [] as string[],
    readme_content: ''
  });
  
  const [techInput, setTechInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-purple-500/10 border border-purple-500/30">
            <Layers className="h-8 w-8 text-purple-500/50" />
          </div>
          <h2 className="font-press-start text-sm sm:text-base text-gray-400 mb-4">LOGIN REQUIRED</h2>
          <p className="text-gray-500 font-jetbrains text-sm mb-6">You need to be logged in to submit a project</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/30 to-pink-500/20 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-press-start text-xs transition-all duration-300"
          >
            LOGIN
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      toast.error('Project name is required');
      return;
    }
    if (!form.description.trim()) {
      toast.error('Description is required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/gallery/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Project submitted for review!');
        navigate('/gallery');
      } else {
        toast.error(data.message || 'Failed to submit project');
      }
    } catch (err) {
      toast.error('Failed to submit project');
    } finally {
      setLoading(false);
    }
  };

  const addTech = () => {
    if (techInput.trim() && !form.technologies.includes(techInput.trim())) {
      setForm(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setForm(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <>
      <SEO
        title="Submit Project - Project Gallery | Maximally"
        description="Showcase your project to the Maximally community"
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
        <div className="absolute top-20 left-[5%] w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-40 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />

        <div className="relative z-10 pt-20 sm:pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <Link
              to="/gallery"
              className="group inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 font-jetbrains text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Gallery
            </Link>

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-purple-500/10 border border-purple-500/30">
                <Layers className="w-4 h-4 text-purple-400" />
                <span className="font-press-start text-[10px] sm:text-xs text-purple-300 tracking-wider">
                  SUBMIT PROJECT
                </span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <h1 className="font-press-start text-xl sm:text-2xl md:text-3xl text-white mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Showcase Your Work
                </span>
              </h1>
              <p className="text-gray-400 font-jetbrains text-sm sm:text-base">
                Share your project with the Maximally community
              </p>
            </div>

            {/* Info Banner */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 mb-8 flex gap-3">
              <Info className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-cyan-200 font-jetbrains">
                <p className="mb-1">Your project will be reviewed before appearing in the gallery.</p>
                <p>Projects submitted to hackathons are automatically added to the gallery.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-900/50 border border-purple-500/20 p-5 sm:p-6">
                <h2 className="font-press-start text-xs sm:text-sm text-purple-300 mb-4">BASIC INFO</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 font-jetbrains mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My Awesome Project"
                      className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains text-sm focus:border-purple-400 outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 font-jetbrains mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={form.tagline}
                      onChange={(e) => setForm(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="A short catchy description"
                      maxLength={200}
                      className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains text-sm focus:border-purple-400 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 font-jetbrains mb-2">
                      Description *
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Tell us about your project..."
                      rows={5}
                      className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains text-sm focus:border-purple-400 outline-none resize-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 font-jetbrains mb-2">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains text-sm focus:border-purple-400 outline-none transition-colors"
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="bg-gray-900/50 border border-pink-500/20 p-5 sm:p-6">
                <h2 className="font-press-start text-xs sm:text-sm text-pink-300 mb-4">IMAGES</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 font-jetbrains mb-2">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={form.logo_url}
                      onChange={(e) => setForm(prev => ({ ...prev, logo_url: e.target.value }))}
                      placeholder="https://example.com/logo.png"
                      className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains text-sm focus:border-purple-400 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 font-jetbrains mb-2">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={form.cover_image_url}
                      onChange={(e) => setForm(prev => ({ ...prev, cover_image_url: e.target.value }))}
                      placeholder="https://example.com/cover.png"
                      className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains text-sm focus:border-purple-400 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="bg-gray-900/50 border border-cyan-500/20 p-5 sm:p-6">
                <h2 className="font-press-start text-xs sm:text-sm text-cyan-300 mb-4">LINKS</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 font-jetbrains mb-2 flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      GitHub Repository
                    </label>
                    <input
                      type="url"
                      value={form.github_url}
                      onChange={(e) => setForm(prev => ({ ...prev, github_url: e.target.value }))}
                      placeholder="https://github.com/username/repo"
                      className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains text-sm focus:border-purple-400 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 font-jetbrains mb-2 flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      value={form.demo_url}
                      onChange={(e) => setForm(prev => ({ ...prev, demo_url: e.target.value }))}
                      placeholder="https://myproject.vercel.app"
                      className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains text-sm focus:border-purple-400 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 font-jetbrains mb-2 flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video URL (YouTube, Loom, etc.)
                    </label>
                    <input
                      type="url"
                      value={form.video_url}
                      onChange={(e) => setForm(prev => ({ ...prev, video_url: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains text-sm focus:border-purple-400 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 font-jetbrains mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={form.website_url}
                      onChange={(e) => setForm(prev => ({ ...prev, website_url: e.target.value }))}
                      placeholder="https://myproject.com"
                      className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains text-sm focus:border-purple-400 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div className="bg-gray-900/50 border border-green-500/20 p-5 sm:p-6">
                <h2 className="font-press-start text-xs sm:text-sm text-green-300 mb-4">TECH STACK</h2>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    placeholder="React, Node.js, PostgreSQL..."
                    className="flex-1 bg-black/50 border border-purple-500/30 text-white px-4 py-2 font-jetbrains text-sm focus:border-purple-400 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-300 hover:bg-purple-500/30 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {form.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-purple-300 font-jetbrains flex items-center gap-2"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="text-purple-400/50 hover:text-pink-400 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="bg-gray-900/50 border border-amber-500/20 p-5 sm:p-6">
                <h2 className="font-press-start text-xs sm:text-sm text-amber-300 mb-4">TAGS</h2>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="ai, productivity, open-source..."
                    className="flex-1 bg-black/50 border border-purple-500/30 text-white px-4 py-2 font-jetbrains text-sm focus:border-purple-400 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-pink-500/20 border border-pink-500/50 text-pink-300 hover:bg-pink-500/30 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-pink-500/10 border border-pink-500/30 px-3 py-1 text-pink-300 font-jetbrains flex items-center gap-2"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-pink-400/50 hover:text-pink-300 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* README */}
              <div className="bg-gray-900/50 border border-gray-700/50 p-5 sm:p-6">
                <h2 className="font-press-start text-xs sm:text-sm text-gray-300 mb-4">README (Markdown)</h2>
                
                <textarea
                  value={form.readme_content}
                  onChange={(e) => setForm(prev => ({ ...prev, readme_content: e.target.value }))}
                  placeholder="# My Project&#10;&#10;## Features&#10;- Feature 1&#10;- Feature 2&#10;&#10;## Installation&#10;```bash&#10;npm install&#10;```"
                  rows={12}
                  className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains text-sm focus:border-purple-400 outline-none resize-none transition-colors"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-press-start text-[10px] sm:text-xs disabled:opacity-50 flex items-center justify-center gap-2 transition-all duration-300"
                >
                  {loading ? (
                    'SUBMITTING...'
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      SUBMIT PROJECT
                    </>
                  )}
                </button>

                <Link
                  to="/gallery"
                  className="px-6 sm:px-8 py-4 bg-black/50 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 font-press-start text-[10px] sm:text-xs transition-all duration-300 flex items-center justify-center"
                >
                  CANCEL
                </Link>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
