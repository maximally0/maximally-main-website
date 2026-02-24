import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Github, ExternalLink, Video, FileText, Trophy, Users, Calendar, Star, ArrowLeft, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SocialShare from '@/components/SocialShare';

interface Project {
  id: number;
  project_name: string;
  tagline?: string;
  description: string;
  track?: string;
  github_repo?: string;
  demo_url?: string;
  video_url?: string;
  presentation_url?: string;
  cover_image?: string;
  project_logo?: string;
  technologies_used?: string[];
  score?: number;
  feedback?: string;
  prize_won?: string;
  source?: 'gallery' | 'hackathon';
  team?: {
    team_name: string;
    team_code: string;
  } | null;
  user_name: string;
  submitted_at: string;
  hackathon?: {
    hackathon_name: string;
    slug: string;
  } | null;
}

export default function ProjectDetail() {
  const { projectId, source } = useParams();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [projectId, source]);

  const fetchProject = async () => {
    try {
      // If source is provided, use the specific endpoint
      const url = source 
        ? `/api/projects/${source}/${projectId}`
        : `/api/projects/${projectId}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setProject(data.data);
      } else {
        toast({
          title: "Project Not Found",
          description: "This project doesn't exist or is not public",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast({
        title: "Error",
        description: "Failed to load project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-space font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">LOADING...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-space font-bold text-2xl bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-4">PROJECT NOT FOUND</h1>
          <Link to="/events" className="text-orange-400 hover:text-orange-400 font-space font-bold text-sm">
            ← BACK TO EVENTS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-black" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />

      <div className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            {project.hackathon ? (
              <Link 
                to={`/hackathon/${project.hackathon.slug}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-500 text-white px-4 py-2 font-space font-bold text-xs mb-6 transition-all border border-orange-500/40"
              >
                <ArrowLeft className="h-4 w-4" />
                BACK TO HACKATHON
              </Link>
            ) : (
              <Link 
                to="/explore"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-500 text-white px-4 py-2 font-space font-bold text-xs mb-6 transition-all border border-orange-500/40"
              >
                <ArrowLeft className="h-4 w-4" />
                BACK TO EXPLORE
              </Link>
            )}

            {/* Project Header */}
            <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-orange-500/40 p-8 mb-8">
              {/* Cover Image */}
              {project.cover_image && (
                <div className="mb-6 -mx-8 -mt-8">
                  <img 
                    src={project.cover_image} 
                    alt={project.project_name}
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                </div>
              )}

              {/* Project Logo & Title */}
              <div className="flex items-start gap-4 mb-4">
                {project.project_logo && (
                  <img 
                    src={project.project_logo} 
                    alt={project.project_name}
                    className="w-16 h-16 border border-gray-700 object-contain bg-white flex-shrink-0"
                  />
                )}
                <div>
                  {/* Winner Badge */}
                  {project.prize_won && (
                    <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/50 px-4 py-2 mb-4">
                      <Trophy className="h-5 w-5 text-orange-400" />
                      <span className="font-space font-bold text-sm text-orange-400">{project.prize_won}</span>
                    </div>
                  )}

                  <h1 className="font-space font-bold text-2xl sm:text-3xl text-white mb-4">{project.project_name}</h1>
                  
                  {project.tagline && (
                    <p className="text-xl text-gray-300 font-space italic mb-6">"{project.tagline}"</p>
                  )}
                </div>
              </div>

              {/* Project Meta */}
              <div className="flex flex-wrap gap-6 text-sm font-space text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-400" />
                  {project.team ? `Team: ${project.team.team_name}` : `By: ${project.user_name}`}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-400" />
                  Submitted {new Date(project.submitted_at).toLocaleDateString()}
                </div>
                {project.track && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-orange-500/10 border border-orange-500/50 text-orange-400 font-space font-bold text-xs">
                      {project.track}
                    </span>
                  </div>
                )}
              </div>

              {/* Score */}
              {project.score && (
                <div className="flex items-center gap-3 mb-6">
                  <Star className="h-6 w-6 text-orange-400" />
                  <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-400 bg-clip-text text-transparent font-space font-bold">{project.score}</span>
                  <span className="text-gray-400 font-space">/ 100</span>
                </div>
              )}

              {/* Action Links */}
              <div className="flex flex-wrap gap-3">
                {project.github_repo && (
                  <a
                    href={project.github_repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 font-space font-bold text-sm transition-all flex items-center gap-2 border border-gray-700"
                  >
                    <Github className="h-4 w-4" />
                    VIEW CODE
                  </a>
                )}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-orange-600 to-orange-500 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white px-6 py-3 font-space font-bold text-sm transition-all flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    LIVE DEMO
                  </a>
                )}
                {project.video_url && (
                  <a
                    href={project.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-500 hover:bg-orange-500 text-white px-6 py-3 font-space font-bold text-sm transition-all flex items-center gap-2 border border-orange-500/40"
                  >
                    <Video className="h-4 w-4" />
                    WATCH VIDEO
                  </a>
                )}
                {project.presentation_url && (
                  <a
                    href={project.presentation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 font-space font-bold text-sm transition-all flex items-center gap-2 border border-orange-500/50"
                  >
                    <FileText className="h-4 w-4" />
                    PRESENTATION
                  </a>
                )}
              </div>

              {/* Social Share */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-sm text-gray-400 font-space mb-3">Share this project:</p>
                <SocialShare
                  title={`Check out ${project.project_name}!`}
                  description={project.tagline || project.description.substring(0, 150)}
                  hashtags={['hackathon', 'project', 'maximally']}
                  variant="menu"
                />
              </div>
            </div>

            {/* Project Description */}
            <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-orange-500/30 p-8 mb-8">
              <h2 className="font-space font-bold text-xl bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-6">ABOUT PROJECT</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 font-space leading-relaxed whitespace-pre-wrap text-lg">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Technologies Used */}
            {project.technologies_used && project.technologies_used.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-orange-500/30 p-8 mb-8">
                <h2 className="font-space font-bold text-xl bg-gradient-to-r from-orange-400 to-orange-400 bg-clip-text text-transparent mb-6">TECHNOLOGIES USED</h2>
                <div className="flex flex-wrap gap-3">
                  {project.technologies_used.map((tech, i) => (
                    <span key={i} className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-300 font-space text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Hackathon Info - only show if project has hackathon */}
            {project.hackathon && (
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-orange-500/30 p-8">
                <h2 className="font-space font-bold text-xl bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-6">HACKATHON INFO</h2>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-space font-bold text-lg text-white mb-2">{project.hackathon.hackathon_name}</h3>
                    <p className="text-gray-400 font-space">This project was submitted to the hackathon above</p>
                  </div>
                  <Link
                    to={`/hackathon/${project.hackathon.slug}`}
                    className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-500 text-white px-6 py-3 font-space font-bold text-sm transition-all border border-orange-500/40"
                  >
                    VIEW HACKATHON
                  </Link>
                </div>
              </div>
            )}

            {/* Gallery Project Info - show if no hackathon */}
            {!project.hackathon && (
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-orange-500/30 p-8">
                <h2 className="font-space font-bold text-xl bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-6">PROJECT INFO</h2>
                <div className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-orange-400" />
                  <p className="text-gray-400 font-space">This is a community project from the Maximally Gallery</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
