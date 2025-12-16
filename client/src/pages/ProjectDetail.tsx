import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Github, ExternalLink, Video, FileText, Trophy, Users, Calendar, Star, ArrowLeft } from 'lucide-react';
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
  technologies_used?: string[];
  score?: number;
  feedback?: string;
  prize_won?: string;
  team?: {
    team_name: string;
    team_code: string;
  };
  user_name: string;
  submitted_at: string;
  hackathon: {
    hackathon_name: string;
    slug: string;
  };
}

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
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
        <div className="font-press-start text-maximally-red">LOADING...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-press-start text-2xl text-maximally-red mb-4">PROJECT_NOT_FOUND</h1>
          <Link to="/events" className="text-maximally-yellow hover:text-maximally-red font-press-start text-sm">
            ← BACK_TO_EVENTS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            to={`/hackathon/${project.hackathon.slug}`}
            className="inline-flex items-center gap-2 text-maximally-yellow hover:text-maximally-red font-press-start text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK_TO_HACKATHON
          </Link>

          {/* Project Header */}
          <div className="pixel-card bg-gray-900 border-2 border-maximally-yellow p-8 mb-8">
            {/* Winner Badge */}
            {project.prize_won && (
              <div className="inline-flex items-center gap-2 bg-maximally-yellow/20 border border-maximally-yellow px-4 py-2 mb-4">
                <Trophy className="h-5 w-5 text-maximally-yellow" />
                <span className="font-press-start text-sm text-maximally-yellow">{project.prize_won}</span>
              </div>
            )}

            <h1 className="font-press-start text-3xl text-white mb-4">{project.project_name}</h1>
            
            {project.tagline && (
              <p className="text-xl text-gray-300 font-jetbrains italic mb-6">"{project.tagline}"</p>
            )}

            {/* Project Meta */}
            <div className="flex flex-wrap gap-6 text-sm font-jetbrains text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {project.team ? `Team: ${project.team.team_name}` : `By: ${project.user_name}`}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Submitted {new Date(project.submitted_at).toLocaleDateString()}
              </div>
              {project.track && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-maximally-red/20 border border-maximally-red text-maximally-red font-press-start text-xs">
                    {project.track}
                  </span>
                </div>
              )}
            </div>

            {/* Score */}
            {project.score && (
              <div className="flex items-center gap-3 mb-6">
                <Star className="h-6 w-6 text-maximally-yellow" />
                <span className="text-3xl font-bold text-maximally-yellow font-press-start">{project.score}</span>
                <span className="text-gray-400 font-jetbrains">/ 100</span>
              </div>
            )}

            {/* Action Links */}
            <div className="flex flex-wrap gap-3">
              {project.github_repo && (
                <a
                  href={project.github_repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-button bg-gray-800 text-white px-6 py-3 font-press-start text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  VIEW_CODE
                </a>
              )}
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-button bg-maximally-yellow text-black px-6 py-3 font-press-start text-sm hover:bg-maximally-red hover:text-white transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  LIVE_DEMO
                </a>
              )}
              {project.video_url && (
                <a
                  href={project.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-button bg-red-600 text-white px-6 py-3 font-press-start text-sm hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  WATCH_VIDEO
                </a>
              )}
              {project.presentation_url && (
                <a
                  href={project.presentation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-button bg-blue-600 text-white px-6 py-3 font-press-start text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  PRESENTATION
                </a>
              )}
            </div>

            {/* Social Share */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400 font-jetbrains mb-3">Share this project:</p>
              <SocialShare
                title={`Check out ${project.project_name}!`}
                description={project.tagline || project.description.substring(0, 150)}
                hashtags={['hackathon', 'project', 'maximally']}
                variant="menu"
              />
            </div>
          </div>

          {/* Project Description */}
          <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-8 mb-8">
            <h2 className="font-press-start text-xl text-maximally-red mb-6">ABOUT_PROJECT</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 font-jetbrains leading-relaxed whitespace-pre-wrap text-lg">
                {project.description}
              </p>
            </div>
          </div>

          {/* Technologies Used */}
          {project.technologies_used && project.technologies_used.length > 0 && (
            <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-8 mb-8">
              <h2 className="font-press-start text-xl text-maximally-red mb-6">TECHNOLOGIES_USED</h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies_used.map((tech, i) => (
                  <span key={i} className="px-4 py-2 bg-maximally-yellow/20 border border-maximally-yellow text-maximally-yellow font-jetbrains text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hackathon Info */}
          <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-8">
            <h2 className="font-press-start text-xl text-maximally-red mb-6">HACKATHON_INFO</h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-press-start text-lg text-white mb-2">{project.hackathon.hackathon_name}</h3>
                <p className="text-gray-400 font-jetbrains">This project was submitted to the hackathon above</p>
              </div>
              <Link
                to={`/hackathon/${project.hackathon.slug}`}
                className="pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors"
              >
                VIEW_HACKATHON
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
