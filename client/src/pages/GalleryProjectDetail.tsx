import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Video,
  Globe,
  Heart,
  Eye,
  Trophy,
  Calendar,
  User,
  Share2,
  Edit,
  Trash2,
  Code2,
  AlertTriangle,
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProjectDetail {
  id: number;
  name: string;
  tagline?: string;
  description: string;
  logo_url?: string;
  cover_image_url?: string;
  github_url?: string;
  demo_url?: string;
  video_url?: string;
  website_url?: string;
  category?: string;
  tags?: string[];
  technologies?: string[];
  readme_content?: string;
  hackathon_id?: number;
  hackathon_position?: string;
  like_count: number;
  view_count: number;
  created_at: string;
  user_id: string;
  hasLiked?: boolean;
  profiles?: {
    username: string;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
  };
  hackathons?: {
    title: string;
    slug: string;
    start_date?: string;
    end_date?: string;
  };
}

export default function GalleryProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`/api/gallery/projects/${id}`, { headers });
      const data = await res.json();

      if (data.success) {
        setProject(data.data);
        setLiked(data.data.hasLiked || false);
        setLikeCount(data.data.like_count || 0);
      } else {
        toast.error('Project not found');
        navigate('/gallery');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like projects');
      return;
    }

    setLiking(true);
    try {
      const res = await fetch(`/api/gallery/projects/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        setLiked(data.liked);
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
      }
    } catch (err) {
      toast.error('Failed to like project');
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.name,
          text: project?.tagline || project?.description,
          url,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/gallery/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Project deleted');
        navigate('/gallery');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to delete project');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="font-press-start text-sm text-gray-400 animate-pulse">LOADING...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-purple-500/10 border border-purple-500/30">
            <Code2 className="h-10 w-10 text-purple-500/50" />
          </div>
          <h2 className="font-press-start text-sm sm:text-base text-gray-400 mb-4">PROJECT NOT FOUND</h2>
          <Link to="/gallery" className="text-purple-400 hover:text-purple-300 font-jetbrains text-sm transition-colors">
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === project.user_id;

  return (
    <>
      <SEO
        title={`${project.name} - Project Gallery | Maximally`}
        description={project.tagline || project.description.slice(0, 160)}
        keywords={project.technologies?.join(', ')}
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
        <div className="absolute top-20 left-[5%] w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-40 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />

        {/* Header */}
        <div className="relative z-10 pt-20 sm:pt-24 pb-8 border-b border-purple-500/20">
          <div className="container mx-auto px-4 sm:px-6">
            <Link
              to="/gallery"
              className="group inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 mb-6 font-jetbrains text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Gallery
            </Link>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Project Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  {project.logo_url && (
                    <img
                      src={project.logo_url}
                      alt={project.name}
                      className="w-16 h-16 border border-gray-700 object-contain bg-white"
                    />
                  )}
                  <div>
                    <h1 className="font-press-start text-xl sm:text-2xl md:text-3xl mb-2">
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                        {project.name}
                      </span>
                    </h1>
                    {project.tagline && (
                      <p className="text-gray-400 font-jetbrains text-sm sm:text-base">{project.tagline}</p>
                    )}
                  </div>
                </div>

                {/* Hackathon Badge */}
                {project.hackathons && (
                  <div className="mb-4">
                    <Link
                      to={`/hackathon/${project.hackathons.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 hover:border-purple-400 transition-colors"
                    >
                      {project.hackathon_position ? (
                        <>
                          <Trophy className="h-4 w-4 text-amber-400" />
                          <span className="font-press-start text-[10px] text-amber-300">
                            {project.hackathon_position}
                          </span>
                          <span className="text-gray-400 text-sm">at</span>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">Submitted to</span>
                      )}
                      <span className="font-press-start text-[10px] text-purple-300">
                        {project.hackathons.title}
                      </span>
                    </Link>
                  </div>
                )}

                {/* Creator */}
                {project.profiles && (
                  <Link
                    to={`/profile/${project.profiles.username}`}
                    className="inline-flex items-center gap-3 mb-4 hover:opacity-80"
                  >
                    {project.profiles.avatar_url ? (
                      <img
                        src={project.profiles.avatar_url}
                        alt={project.profiles.username}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-white font-jetbrains">
                        {project.profiles.full_name || project.profiles.username}
                      </p>
                      <p className="text-xs text-gray-500">@{project.profiles.username}</p>
                    </div>
                  </Link>
                )}

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    {project.view_count} views
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart className={`h-4 w-4 ${liked ? 'text-pink-500 fill-pink-500' : ''}`} />
                    {likeCount} likes
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 lg:w-64">
                {/* Primary Links */}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-press-start text-[10px] transition-all duration-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                    LIVE DEMO
                  </a>
                )}

                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-black/50 border border-gray-700 hover:border-purple-500/50 text-gray-300 hover:text-white font-press-start text-[10px] transition-all duration-300"
                  >
                    <Github className="h-4 w-4" />
                    VIEW CODE
                  </a>
                )}

                {project.video_url && (
                  <a
                    href={project.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-pink-500/20 border border-pink-500/40 hover:border-pink-400 text-pink-300 hover:text-white font-press-start text-[10px] transition-all duration-300"
                  >
                    <Video className="h-4 w-4" />
                    WATCH VIDEO
                  </a>
                )}

                {project.website_url && (
                  <a
                    href={project.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-black/50 border border-gray-700 hover:border-purple-500/50 text-gray-300 hover:text-white font-press-start text-[10px] transition-all duration-300"
                  >
                    <Globe className="h-4 w-4" />
                    WEBSITE
                  </a>
                )}

                {/* Like & Share */}
                <div className="flex gap-2">
                  <button
                    onClick={handleLike}
                    disabled={liking}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 font-press-start text-[10px] transition-all duration-300 ${
                      liked
                        ? 'bg-pink-500/30 border border-pink-500/50 text-pink-300'
                        : 'bg-black/50 border border-gray-700 text-gray-400 hover:text-white hover:border-pink-500/50'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${liked ? 'fill-pink-400' : ''}`} />
                    {liked ? 'LIKED' : 'LIKE'}
                  </button>

                  <button
                    onClick={handleShare}
                    className="bg-black/50 border border-gray-700 text-gray-400 hover:text-white hover:border-purple-500/50 px-4 py-3 transition-all duration-300"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Owner Actions */}
                {isOwner && (
                  <div className="flex gap-2 pt-2 border-t border-purple-500/20">
                    <Link
                      to={`/gallery/edit/${project.id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-press-start text-[10px] transition-all duration-300"
                    >
                      <Edit className="h-3 w-3" />
                      EDIT
                    </Link>
                    <button
                      onClick={() => setShowDeleteDialog(true)}
                      className="bg-red-500/20 border border-red-500/40 hover:border-red-400 text-red-400 px-4 py-2 transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                {/* Cover Image */}
                {project.cover_image_url && (
                  <div className="border border-purple-500/20 overflow-hidden">
                    <img
                      src={project.cover_image_url}
                      alt={project.name}
                      className="w-full h-auto"
                    />
                  </div>
                )}

                {/* Description */}
                <div className="bg-gray-900/50 border border-purple-500/20 p-5 sm:p-6">
                  <h2 className="font-press-start text-sm sm:text-base text-purple-300 mb-4">ABOUT</h2>
                  <p className="text-gray-300 font-jetbrains text-sm leading-relaxed whitespace-pre-wrap">
                    {project.description}
                  </p>
                </div>

                {/* README */}
                {project.readme_content && (
                  <div className="bg-gray-900/50 border border-purple-500/20 p-5 sm:p-6">
                    <h2 className="font-press-start text-sm sm:text-base text-purple-300 mb-4">README</h2>
                    <div className="prose prose-invert prose-sm max-w-none font-jetbrains">
                      <ReactMarkdown>{project.readme_content}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-5 sm:space-y-6">
                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="bg-gray-900/50 border border-green-500/20 p-4 sm:p-5">
                    <h3 className="font-press-start text-xs text-green-300 mb-3">TECH STACK</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 text-purple-300 font-jetbrains"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="bg-gray-900/50 border border-pink-500/20 p-4 sm:p-5">
                    <h3 className="font-press-start text-xs text-pink-300 mb-3">TAGS</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <Link
                          key={i}
                          to={`/gallery?search=${encodeURIComponent(tag)}`}
                          className="text-[10px] bg-pink-500/10 border border-pink-500/30 px-2.5 py-1 text-pink-300 font-jetbrains hover:bg-pink-500/20 transition-colors"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category */}
                {project.category && (
                  <div className="bg-gray-900/50 border border-amber-500/20 p-4 sm:p-5">
                    <h3 className="font-press-start text-xs text-amber-300 mb-3">CATEGORY</h3>
                    <Link
                      to={`/gallery?category=${encodeURIComponent(project.category)}`}
                      className="text-sm text-purple-400 font-jetbrains hover:text-purple-300 transition-colors"
                    >
                      {project.category}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !deleting && setShowDeleteDialog(false)}
            />
            
            {/* Dialog */}
            <div className="relative z-[101] bg-gray-900/95 border border-red-500/50 p-6 max-w-md w-full shadow-2xl shadow-red-500/10">
              {/* Close button */}
              <button
                onClick={() => !deleting && setShowDeleteDialog(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
                disabled={deleting}
              >
                <X className="h-5 w-5" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/50 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-press-start text-sm sm:text-base text-white text-center mb-2">
                DELETE PROJECT?
              </h3>
              <p className="text-gray-400 text-center font-jetbrains text-sm mb-6">
                Are you sure you want to delete "{project?.name}"? This action cannot be undone.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={deleting}
                  className="flex-1 py-3 bg-black/50 border border-gray-700 text-gray-300 font-press-start text-[10px] hover:border-gray-600 disabled:opacity-50 transition-all duration-300"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 bg-red-500/20 border border-red-500/50 text-red-300 font-press-start text-[10px] hover:border-red-400 disabled:opacity-50 flex items-center justify-center gap-2 transition-all duration-300"
                >
                  {deleting ? (
                    'DELETING...'
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      DELETE
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
