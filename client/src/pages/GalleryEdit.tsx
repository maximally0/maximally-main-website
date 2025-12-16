import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Github,
  Globe,
  Video,
  ExternalLink,
  Plus,
  X,
  Save,
  Info,
  Layers,
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

export default function GalleryEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/gallery/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        const p = data.data;
        // Check ownership
        if (p.user_id !== user?.id) {
          toast.error('You can only edit your own projects');
          navigate('/gallery');
          return;
        }
        setForm({
          name: p.name || '',
          tagline: p.tagline || '',
          description: p.description || '',
          logo_url: p.logo_url || '',
          cover_image_url: p.cover_image_url || '',
          github_url: p.github_url || '',
          demo_url: p.demo_url || '',
          video_url: p.video_url || '',
          website_url: p.website_url || '',
          category: p.category || '',
          technologies: p.technologies || [],
          tags: p.tags || [],
          readme_content: p.readme_content || ''
        });
      } else {
        toast.error('Project not found');
        navigate('/gallery');
      }
    } catch (err) {
      toast.error('Failed to load project');
      navigate('/gallery');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-purple-500/10 border border-purple-500/30">
            <Layers className="h-8 w-8 text-purple-500/50" />
          </div>
          <h2 className="font-press-start text-sm sm:text-base text-gray-400 mb-4">LOGIN REQUIRED</h2>
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

    setSaving(true);
    try {
      const res = await fetch(`/api/gallery/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Project updated!');
        navigate(`/gallery/${id}`);
      } else {
        toast.error(data.message || 'Failed to update project');
      }
    } catch (err) {
      toast.error('Failed to update project');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="font-press-start text-sm text-gray-400 animate-pulse">LOADING...</div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Edit Project - Project Gallery | Maximally"
        description="Edit your project in the Maximally gallery"
      />

      <div className="min-h-screen bg-black text-white">
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <Link
              to={`/gallery/${id}`}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 font-jetbrains text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Project
            </Link>

            <div className="text-center mb-8">
              <h1 className="font-press-start text-2xl sm:text-3xl text-white mb-2">
                EDIT PROJECT
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
                <h2 className="font-press-start text-sm text-white mb-4">BASIC_INFO</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 font-jetbrains mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-red outline-none"
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
                      maxLength={200}
                      className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-red outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 font-jetbrains mb-2">
                      Description *
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={5}
                      className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-red outline-none resize-none"
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
                      className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-red outline-none"
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
              <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
                <h2 className="font-press-start text-sm text-white mb-4">IMAGES</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 font-jetbrains mb-2">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={form.logo_url}
                      onChange={(e) => setForm(prev => ({ ...prev, logo_url: e.target.value }))}
                      className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-red outline-none"
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
                      className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-red outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
                <h2 className="font-press-start text-sm text-white mb-4">LINKS</h2>
                
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
                      className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-red outline-none"
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
                      className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-red outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 font-jetbrains mb-2 flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video URL
                    </label>
                    <input
                      type="url"
                      value={form.video_url}
                      onChange={(e) => setForm(prev => ({ ...prev, video_url: e.target.value }))}
                      className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-red outline-none"
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
                      className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-red outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
                <h2 className="font-press-start text-sm text-white mb-4">TECH_STACK</h2>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    placeholder="Add technology..."
                    className="flex-1 bg-gray-800 border-2 border-gray-700 text-white px-4 py-2 font-jetbrains focus:border-maximally-red outline-none"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="pixel-button bg-maximally-red text-white px-4 py-2"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {form.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="text-sm bg-gray-800 border border-gray-700 px-3 py-1 text-gray-300 font-jetbrains flex items-center gap-2"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="text-gray-500 hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
                <h2 className="font-press-start text-sm text-white mb-4">TAGS</h2>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                    className="flex-1 bg-gray-800 border-2 border-gray-700 text-white px-4 py-2 font-jetbrains focus:border-maximally-red outline-none"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="pixel-button bg-maximally-red text-white px-4 py-2"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-sm bg-maximally-red/20 border border-maximally-red px-3 py-1 text-maximally-red font-jetbrains flex items-center gap-2"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-maximally-red/50 hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* README */}
              <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
                <h2 className="font-press-start text-sm text-white mb-4">README (Markdown)</h2>
                
                <textarea
                  value={form.readme_content}
                  onChange={(e) => setForm(prev => ({ ...prev, readme_content: e.target.value }))}
                  rows={12}
                  className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-maximally-red outline-none resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 pixel-button bg-maximally-red text-white py-4 font-press-start text-sm hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    'SAVING...'
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      SAVE_CHANGES
                    </>
                  )}
                </button>

                <Link
                  to={`/gallery/${id}`}
                  className="pixel-button bg-gray-800 text-gray-400 px-8 py-4 font-press-start text-sm hover:text-white"
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
