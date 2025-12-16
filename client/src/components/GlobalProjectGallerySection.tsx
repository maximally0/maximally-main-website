import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, 
  Trophy, 
  Github, 
  ExternalLink, 
  ArrowRight, 
  Sparkles,
  Eye,
  Heart,
  Code
} from 'lucide-react';

interface GalleryProject {
  id: number;
  name: string;
  tagline?: string;
  logo_url?: string;
  cover_image_url?: string;
  category?: string;
  technologies?: string[];
  like_count: number;
  view_count: number;
  hackathon_id?: number;
  hackathon_position?: string;
  profiles?: {
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
  hackathons?: {
    title: string;
    slug: string;
  };
}

export default function GlobalProjectGallerySection() {
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await fetch('/api/gallery/projects?limit=6&sort=popular&featured_only=true');
      const data = await response.json();
      
      if (data.success) {
        // If no featured, get popular ones
        if (data.data.length === 0) {
          const popularRes = await fetch('/api/gallery/projects?limit=6&sort=popular');
          const popularData = await popularRes.json();
          if (popularData.success) {
            setProjects(popularData.data);
          }
        } else {
          setProjects(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching gallery projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="font-press-start text-sm text-gray-400 animate-pulse">
              LOADING_PROJECTS...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    // Show section with CTA even when no projects yet
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-48 h-48 bg-maximally-red/10 blur-3xl rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-maximally-yellow/10 blur-3xl rounded-full animate-pulse delay-500" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="minecraft-block bg-gradient-to-r from-maximally-red via-red-600 to-maximally-red text-white px-6 py-3 inline-block mb-6 animate-[glow_2s_ease-in-out_infinite]">
              <span className="font-press-start text-xs sm:text-sm flex items-center gap-2">
                <Rocket className="h-4 w-4 animate-bounce" />
                PROJECT GALLERY
                <Sparkles className="h-4 w-4 animate-spin-slow" />
              </span>
            </div>

            <h2 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 minecraft-text">
              <span className="text-maximally-red drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                BUILT BY HACKERS
              </span>
            </h2>

            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-jetbrains mb-8">
              Showcase your projects to the world. From hackathon submissions to side projects.
            </p>

            {/* Empty State */}
            <div className="pixel-card bg-gray-900/50 border-2 border-gray-800 p-8 max-w-lg mx-auto mb-8">
              <Code className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="font-press-start text-sm text-gray-400 mb-2">NO_PROJECTS_YET</p>
              <p className="text-gray-500 font-jetbrains text-sm">
                Be the first to showcase your work!
              </p>
            </div>

            {/* CTA Button */}
            <Link
              to="/gallery/submit"
              className="pixel-button bg-maximally-yellow text-black group inline-flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-yellow h-12 sm:h-14 px-6 sm:px-8 font-press-start text-xs sm:text-sm"
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              SHOWCASE_YOUR_PROJECT
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-48 h-48 bg-maximally-red/10 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-maximally-yellow/10 blur-3xl rounded-full animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="minecraft-block bg-gradient-to-r from-maximally-red via-red-600 to-maximally-red text-white px-6 py-3 inline-block mb-6 animate-[glow_2s_ease-in-out_infinite]">
            <span className="font-press-start text-xs sm:text-sm flex items-center gap-2">
              <Rocket className="h-4 w-4 animate-bounce" />
              PROJECT GALLERY
              <Sparkles className="h-4 w-4 animate-spin-slow" />
            </span>
          </div>

          <h2 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 minecraft-text">
            <span className="text-maximally-red drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              BUILT BY HACKERS
            </span>
          </h2>

          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-jetbrains">
            Explore amazing projects built by our community. From hackathon winners to indie creations.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/gallery/${project.id}`}
              className="pixel-card bg-gray-900/80 border-2 border-gray-800 hover:border-maximally-red transition-all duration-300 group overflow-hidden"
            >
              {/* Cover Image */}
              <div className="relative h-40 bg-gray-800 overflow-hidden">
                {project.cover_image_url ? (
                  <img
                    src={project.cover_image_url}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <Code className="h-12 w-12 text-gray-600" />
                  </div>
                )}
                
                {/* Hackathon Badge */}
                {project.hackathon_id && (
                  <div className="absolute top-2 left-2">
                    <div className={`px-2 py-1 text-xs font-press-start flex items-center gap-1 ${
                      project.hackathon_position 
                        ? 'bg-maximally-yellow text-black' 
                        : 'bg-maximally-red text-white'
                    }`}>
                      {project.hackathon_position ? (
                        <>
                          <Trophy className="h-3 w-3" />
                          {project.hackathon_position}
                        </>
                      ) : (
                        'HACKATHON'
                      )}
                    </div>
                  </div>
                )}

                {/* Stats Overlay */}
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <div className="bg-black/70 px-2 py-1 flex items-center gap-1 text-xs text-gray-300">
                    <Eye className="h-3 w-3" />
                    {project.view_count}
                  </div>
                  <div className="bg-black/70 px-2 py-1 flex items-center gap-1 text-xs text-gray-300">
                    <Heart className="h-3 w-3" />
                    {project.like_count}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-2">
                  {project.logo_url && (
                    <img
                      src={project.logo_url}
                      alt={project.name}
                      className="w-10 h-10 rounded border border-gray-700 object-contain bg-white"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-press-start text-sm text-white truncate group-hover:text-maximally-yellow transition-colors">
                      {project.name}
                    </h3>
                    {project.profiles && (
                      <p className="text-xs text-gray-500 font-jetbrains">
                        by @{project.profiles.username}
                      </p>
                    )}
                  </div>
                </div>

                {project.tagline && (
                  <p className="text-xs text-gray-400 font-jetbrains line-clamp-2 mb-3">
                    {project.tagline}
                  </p>
                )}

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-gray-800 border border-gray-700 px-2 py-0.5 text-gray-400 font-jetbrains"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-[10px] text-gray-500 font-jetbrains">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Hackathon Info */}
                {project.hackathons && (
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <p className="text-[10px] text-gray-500 font-jetbrains">
                      Submitted to <span className="text-maximally-red">{project.hackathons.title}</span>
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/gallery"
            className="pixel-button bg-maximally-red text-white group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-red h-12 sm:h-14 px-6 sm:px-8 font-press-start text-xs sm:text-sm"
          >
            <Rocket className="h-4 w-4 sm:h-5 sm:w-5" />
            EXPLORE_ALL
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/gallery/submit"
            className="pixel-button bg-maximally-yellow text-black group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-yellow h-12 sm:h-14 px-6 sm:px-8 font-press-start text-xs sm:text-sm"
          >
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            SHOWCASE_PROJECT
          </Link>
        </div>
      </div>
    </section>
  );
}
