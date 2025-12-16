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
  Code,
  AlertTriangle,
  X
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
          <Code className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="font-press-start text-lg text-gray-400">PROJECT_NOT_FOUND</h2>
          <Link to="/gallery" className="text-maximally-red hover:underline mt-4 inline-block">
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

      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="pt-20 pb-8 border-b border-gray-800">
          <div className="container mx-auto px-4">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 font-jetbrains text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
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
                      className="w-16 h-16 rounded border-2 border-gray-700 object-contain bg-white"
                    />
                  )}
                  <div>
                    <h1 className="font-press-start text-2xl sm:text-3xl text-white mb-2">
                      {project.name}
                    </h1>
                    {project.tagline && (
                      <p className="text-gray-400 font-jetbrains text-lg">{project.tagline}</p>
                    )}
                  </div>
                </div>

                {/* Hackathon Badge */}
                {project.hackathons && (
                  <div className="mb-4">
                    <Link
                      to={`/hackathon/${project.hackathons.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 border-2 border-maximally-red hover:bg-maximally-red/20 transition-colors"
                    >
                      {project.hackathon_position ? (
                        <>
                          <Trophy className="h-4 w-4 text-maximally-yellow" />
                          <span className="font-press-start text-xs text-maximally-yellow">
                            {project.hackathon_position}
                          </span>
                          <span className="text-gray-400">at</span>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">Submitted to</span>
                      )}
                      <span className="font-press-start text-xs text-maximally-red">
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
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {project.view_count} views
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className={`h-4 w-4 ${liked ? 'text-red-500 fill-red-500' : ''}`} />
                    {likeCount} likes
                  </div>
                  <div className="flex items-center gap-1">
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
                    className="pixel-button bg-maximally-red text-white flex items-center justify-center gap-2 py-3 font-press-start text-xs hover:bg-red-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                    LIVE_DEMO
                  </a>
                )}

                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pixel-button bg-gray-800 text-white flex items-center justify-center gap-2 py-3 font-press-start text-xs hover:bg-gray-700"
                  >
                    <Github className="h-4 w-4" />
                    VIEW_CODE
                  </a>
                )}

                {project.video_url && (
                  <a
                    href={project.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pixel-button bg-red-600 text-white flex items-center justify-center gap-2 py-3 font-press-start text-xs hover:bg-red-700"
                  >
                    <Video className="h-4 w-4" />
                    WATCH_VIDEO
                  </a>
                )}

                {project.website_url && (
                  <a
                    href={project.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pixel-button bg-gray-800 text-white flex items-center justify-center gap-2 py-3 font-press-start text-xs hover:bg-gray-700"
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
                    className={`flex-1 pixel-button flex items-center justify-center gap-2 py-3 font-press-start text-xs ${
                      liked
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${liked ? 'fill-white' : ''}`} />
                    {liked ? 'LIKED' : 'LIKE'}
                  </button>

                  <button
                    onClick={handleShare}
                    className="pixel-button bg-gray-800 text-gray-400 hover:text-white px-4 py-3"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Owner Actions */}
                {isOwner && (
                  <div className="flex gap-2 pt-2 border-t border-gray-800">
                    <Link
                      to={`/gallery/edit/${project.id}`}
                      className="flex-1 pixel-button bg-maximally-yellow text-black flex items-center justify-center gap-2 py-2 font-press-start text-xs"
                    >
                      <Edit className="h-3 w-3" />
                      EDIT
                    </Link>
                    <button
                      onClick={() => setShowDeleteDialog(true)}
                      className="pixel-button bg-red-900 text-red-400 hover:bg-red-800 px-4 py-2"
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
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Cover Image */}
                {project.cover_image_url && (
                  <div className="pixel-card border-2 border-gray-800 overflow-hidden">
                    <img
                      src={project.cover_image_url}
                      alt={project.name}
                      className="w-full h-auto"
                    />
                  </div>
                )}

                {/* Description */}
                <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
                  <h2 className="font-press-start text-lg text-white mb-4">ABOUT</h2>
                  <p className="text-gray-300 font-jetbrains whitespace-pre-wrap">
                    {project.description}
                  </p>
                </div>

                {/* README */}
                {project.readme_content && (
                  <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
                    <h2 className="font-press-start text-lg text-white mb-4">README</h2>
                    <div className="prose prose-invert prose-sm max-w-none font-jetbrains">
                      <ReactMarkdown>{project.readme_content}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-4">
                    <h3 className="font-press-start text-sm text-white mb-3">TECH_STACK</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-800 border border-gray-700 px-3 py-1 text-gray-300 font-jetbrains"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-4">
                    <h3 className="font-press-start text-sm text-white mb-3">TAGS</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <Link
                          key={i}
                          to={`/gallery?search=${encodeURIComponent(tag)}`}
                          className="text-xs bg-maximally-red/20 border border-maximally-red px-3 py-1 text-maximally-red font-jetbrains hover:bg-maximally-red/30"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category */}
                {project.category && (
                  <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-4">
                    <h3 className="font-press-start text-sm text-white mb-3">CATEGORY</h3>
                    <Link
                      to={`/gallery?category=${encodeURIComponent(project.category)}`}
                      className="text-sm text-maximally-yellow font-jetbrains hover:underline"
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
            <div className="relative z-[101] bg-gray-900 border-2 border-red-500 p-6 max-w-md w-full shadow-2xl shadow-red-500/20">
              {/* Close button */}
              <button
                onClick={() => !deleting && setShowDeleteDialog(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-white"
                disabled={deleting}
              >
                <X className="h-5 w-5" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-press-start text-lg text-white text-center mb-2">
                DELETE_PROJECT?
              </h3>
              <p className="text-gray-400 text-center font-jetbrains text-sm mb-6">
                Are you sure you want to delete "{project?.name}"? This action cannot be undone.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={deleting}
                  className="flex-1 pixel-button bg-gray-800 text-gray-300 py-3 font-press-start text-xs hover:bg-gray-700 disabled:opacity-50"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 pixel-button bg-red-600 text-white py-3 font-press-start text-xs hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
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
