import { useState, useEffect } from 'react';
import { Github, ExternalLink, Video, Trophy, Users, Eye, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Project {
  id: number;
  project_name: string;
  tagline?: string;
  description: string;
  track?: string;
  github_repo?: string;
  demo_url?: string;
  video_url?: string;
  technologies_used?: string[];
  status: string;
  score?: number;
  prize_won?: string;
  project_logo?: string;
  cover_image?: string;
  team?: {
    team_name: string;
    team_code: string;
  };
  user_name: string;
  submitted_at: string;
}

interface Props {
  hackathonId: number;
}

export default function ProjectsGallery({ hackathonId }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [hackathonId]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/hackathons/${hackathonId}/projects`);
      const data = await response.json();

      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    // Apply search filter
    const matchesSearch = searchQuery === '' || 
      p.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.team?.team_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies_used?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    // Apply category filter
    if (filter === 'all') return true;
    if (filter === 'winners') return p.prize_won;
    return p.track === filter;
  });

  const tracks = Array.from(new Set(projects.map(p => p.track).filter(Boolean))) as string[];

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="font-press-start text-sm text-gray-400">LOADING_PROJECTS...</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-12 text-center">
        <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="font-press-start text-gray-400">NO_PROJECTS_SUBMITTED_YET</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search projects by name, team, tech..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black/50 border border-purple-500/30 text-white pl-12 pr-4 py-3 font-jetbrains focus:border-purple-400 outline-none placeholder-gray-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-press-start text-xs transition-all duration-300 ${
            filter === 'all' 
              ? 'bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 text-purple-200' 
              : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-gray-600'
          }`}
        >
          ALL ({projects.length})
        </button>
        <button
          onClick={() => setFilter('winners')}
          className={`px-4 py-2 font-press-start text-xs transition-all duration-300 ${
            filter === 'winners' 
              ? 'bg-gradient-to-r from-amber-600/40 to-yellow-500/30 border border-amber-500/50 text-amber-200' 
              : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-gray-600'
          }`}
        >
          WINNERS ({projects.filter(p => p.prize_won).length})
        </button>
        {tracks.map(track => (
          <button
            key={track}
            onClick={() => setFilter(track!)}
            className={`px-4 py-2 font-press-start text-xs transition-all duration-300 ${
              filter === track 
                ? 'bg-gradient-to-r from-cyan-600/40 to-blue-500/30 border border-cyan-500/50 text-cyan-200' 
                : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            {track?.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className="text-sm text-gray-400 font-jetbrains">
          Found {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} 
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      )}

      {/* No results message */}
      {filteredProjects.length === 0 && (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-8 text-center">
          <Search className="h-10 w-10 text-gray-600 mx-auto mb-4" />
          <p className="font-press-start text-gray-400 text-sm mb-2">NO_PROJECTS_FOUND</p>
          <p className="text-gray-500 font-jetbrains text-sm">
            Try a different search term or filter
          </p>
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={`bg-gradient-to-br p-6 transition-all duration-300 hover:scale-[1.02] ${
              project.prize_won 
                ? 'from-amber-500/15 to-yellow-500/10 border border-amber-500/50 hover:border-amber-400' 
                : 'from-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:border-purple-400/50'
            }`}
          >
            {/* Winner Badge */}
            {project.prize_won && (
              <div className="flex items-center gap-2 mb-3 bg-amber-500/20 border border-amber-500/40 px-3 py-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span className="font-press-start text-xs text-amber-300">{project.prize_won}</span>
              </div>
            )}

            {/* Project Name with Logo */}
            <div className="flex items-start gap-3 mb-2">
              {project.project_logo && (
                <img 
                  src={project.project_logo} 
                  alt={project.project_name}
                  className="w-10 h-10 object-contain rounded border border-gray-700"
                />
              )}
              <h3 className="font-press-start text-lg text-white">{project.project_name}</h3>
            </div>

            {/* Tagline */}
            {project.tagline && (
              <p className="text-sm text-gray-400 font-jetbrains italic mb-3">"{project.tagline}"</p>
            )}

            {/* Description */}
            <p className="text-sm text-gray-300 font-jetbrains mb-4 line-clamp-3">
              {project.description}
            </p>

            {/* Technologies */}
            {project.technologies_used && project.technologies_used.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies_used.slice(0, 3).map((tech, i) => (
                  <span key={i} className="text-xs bg-gray-800 border border-gray-700 px-2 py-1 text-gray-400 font-jetbrains">
                    {tech}
                  </span>
                ))}
                {project.technologies_used.length > 3 && (
                  <span className="text-xs text-gray-500 font-jetbrains">+{project.technologies_used.length - 3}</span>
                )}
              </div>
            )}

            {/* Team/User Info */}
            <div className="flex items-center gap-2 text-xs text-gray-400 font-jetbrains mb-4">
              {project.team ? (
                <>
                  <Users className="h-3 w-3" />
                  {project.team.team_name}
                </>
              ) : (
                <>
                  <Users className="h-3 w-3" />
                  {project.user_name}
                </>
              )}
            </div>

            {/* Links */}
            <div className="space-y-2">
              <Link
                to={`/project/${project.id}`}
                className="w-full bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white px-3 py-2 font-press-start text-xs transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Eye className="h-3 w-3" />
                VIEW_DETAILS
              </Link>
              <div className="flex gap-2 overflow-hidden">
                {project.github_repo && (
                  <a
                    href={project.github_repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-0 bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white px-3 py-2 font-press-start text-xs transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Github className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">CODE</span>
                  </a>
                )}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-0 bg-gradient-to-r from-cyan-600/40 to-blue-500/30 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 hover:text-white px-3 py-2 font-press-start text-xs transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">DEMO</span>
                  </a>
                )}
                {project.video_url && (
                  <a
                    href={project.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 bg-gradient-to-r from-pink-600/40 to-rose-500/30 border border-pink-500/50 hover:border-pink-400 text-pink-200 hover:text-white px-3 py-2 transition-all duration-300 flex items-center justify-center"
                  >
                    <Video className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Score (if judged) */}
            {project.score && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="font-press-start text-xs text-gray-400">SCORE</span>
                  <span className="font-press-start text-lg text-amber-400">{project.score}/100</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
