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
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-orange-500/10 border border-gray-800">
            <Layers className="h-8 w-8 text-orange-400" />
          </div>
          <h2 className="font-space font-bold text-sm sm:text-base text-gray-400 mb-4">LOGIN REQUIRED</h2>
          <p className="text-gray-500 font-space text-sm mb-6">You need to be logged in to submit a project</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-500/50 hover:border-orange-500 text-white hover:text-white font-space font-bold text-xs transition-all duration-300"
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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
        <div className="absolute top-20 left-[5%] w-80 h-80 bg-orange-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-40 right-[10%] w-60 h-60 bg-orange-500/3 rounded-full blur-[80px]" />

        <div className="relative z-10 pt-20 sm:pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <Link
              to="/gallery"
              className="group inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 font-space text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Gallery
            </Link>

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-500/10 border border-gray-800">
                <Layers className="w-4 h-4 text-orange-400" />
                <span className="font-space font-bold text-[10px] sm:text-xs text-orange-400 tracking-wider">
                  SUBMIT PROJECT
                </span>
                <Sparkles className="w-4 h-4 text-orange-400" />
              </div>
              <h1 className="font-space font-bold text-xl sm:text-2xl md:text-3xl text-white mb-4">
                <span className="bg-gradient-to-r from-orange-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  Showcase Your Work
                </span>
              </h1>
              <p className="text-gray-400 font-space text-sm sm:text-base">
                Share your project with the Maximally community
              </p>
            </div>

            {/* Info Banner */}
            <div className="bg-gray-800 border border-gray-700 p-4 mb-8 flex gap-3">
              <Info className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300 font-space">
                <p className="mb-1">Your project will be reviewed before appearing in the gallery.</p>
                <p>Projects submitted to hackathons are automatically added to the gallery.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-900/50 border border-gray-800 p-5 sm:p-6">
                <h2 className="font-space font-bold text-xs sm:text-sm text-orange-400 mb-4">BASIC INFO</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 font-space mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My Awesome Project"
                      className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space text-sm focus:border-orange-500 outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 font-space mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={form.tagline}
                      onChange={(e) => setForm(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="A short catchy description"
                      maxLength={200}
                      className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space text-sm focus:border-orange-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 font-space mb-2">
                      Description *
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Tell us about your project..."
                      rows={5}
                      className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space text-sm focus:border-orange-500 outline-none resize-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 font-space mb-2">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space text-sm focus:border-orange-500 outline-none transition-colors"
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
              <div className="bg-gray-900/50 border border-orange-500/20 p-5 sm:p-6">
                <h2 className="font-space font-bold text-xs sm:text-sm text-orange-400 mb-4">IMAGES</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 font-space mb-2">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={form.logo_url}
                      onChange={(e) => setForm(prev => ({ ...prev, logo_url: e.target.value }))}
                      placeholder="https://example.com/logo.png"
                      className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space text-sm focus:border-orange-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 font-space mb-2">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={form.cover_image_url}
                      onChange={(e) => setForm(prev => ({ ...prev, cover_image_url: e.target.value }))}
                      placeholder="https://example.com/cover.png"
                      className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space text-sm focus:border-orange-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="bg-gray-900/50 border border-gray-700/20 p-5 sm:p-6">
                <h2 className="font-space font-bold text-xs sm:text-sm text-gray-300 mb-4">LINKS</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 font-space mb-2 flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      GitHub Repository
                    </label>
                    <input
                      type="url"
                      value={form.github_url}
                      onChange={(e) => setForm(prev => ({ ...prev, github_url: e.target.value }))}
                      placeholder="https://github.com/username/repo"
                      className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space text-sm focus:border-orange-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 font-space mb-2 flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      value={form.demo_url}
                      onChange={(e) => setForm(prev => ({ ...prev, demo_url: e.target.value }))}
                      placeholder="https://myproject.vercel.app"
                      className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space text-sm focus:border-orange-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 font-space mb-2 flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video URL (YouTube, Loom, etc.)
                    </label>
                    <input
                      type="url"
                      value={form.video_url}
                      onChange={(e) => setForm(prev => ({ ...prev, video_url: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space text-sm focus:border-orange-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 font-space mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={form.website_url}
                      onChange={(e) => setForm(prev => ({ ...prev, website_url: e.target.value }))}
                      placeholder="https://myproject.com"
                      className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space text-sm focus:border-orange-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div className="bg-gray-900/50 border border-green-500/20 p-5 sm:p-6">
                <h2 className="font-space font-bold text-xs sm:text-sm text-green-300 mb-4">TECH STACK</h2>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    placeholder="React, Node.js, PostgreSQL..."
                    className="flex-1 bg-black/50 border border-gray-800 text-white px-4 py-2 font-space text-sm focus:border-orange-500 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-4 py-2 bg-orange-500/10 border border-orange-500/50 text-orange-400 hover:bg-orange-500/20 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {form.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs bg-orange-500/10 border border-gray-800 px-3 py-1 text-orange-400 font-space flex items-center gap-2"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="text-orange-400/50 hover:text-orange-400 transition-colors"
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
                <h2 className="font-space font-bold text-xs sm:text-sm text-amber-300 mb-4">TAGS</h2>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="ai, productivity, open-source..."
                    className="flex-1 bg-black/50 border border-gray-800 text-white px-4 py-2 font-space text-sm focus:border-orange-500 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-orange-500/10 border border-orange-500/40 text-orange-400 hover:bg-orange-500/20 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-orange-500/5 border border-gray-800 px-3 py-1 text-orange-400 font-space flex items-center gap-2"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-orange-400/50 hover:text-orange-400 transition-colors"
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
                <h2 className="font-space font-bold text-xs sm:text-sm text-gray-300 mb-4">README (Markdown)</h2>
                
                <textarea
                  value={form.readme_content}
                  onChange={(e) => setForm(prev => ({ ...prev, readme_content: e.target.value }))}
                  placeholder="# My Project&#10;&#10;## Features&#10;- Feature 1&#10;- Feature 2&#10;&#10;## Installation&#10;```bash&#10;npm install&#10;```"
                  rows={12}
                  className="w-full bg-black/50 border border-gray-800 text-white px-4 py-3 font-space text-sm focus:border-orange-500 outline-none resize-none transition-colors"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-500/50 hover:border-orange-500 text-white hover:text-white font-space font-bold text-[10px] sm:text-xs disabled:opacity-50 flex items-center justify-center gap-2 transition-all duration-300"
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
                  className="px-6 sm:px-8 py-4 bg-black/50 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 font-space font-bold text-[10px] sm:text-xs transition-all duration-300 flex items-center justify-center"
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
