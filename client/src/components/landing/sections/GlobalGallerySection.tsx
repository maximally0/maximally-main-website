import { Link } from "react-router-dom";
import { ArrowRight, Layers, Eye, Upload, Sparkles, Code2 } from "lucide-react";
import { useState, useEffect } from "react";

interface GalleryProject {
  id: number;
  title: string;
  description: string;
  thumbnail_url?: string;
  hackathon_name?: string;
  tags?: string[];
}

export function GlobalGallerySection() {
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/gallery/projects?limit=3&status=approved');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setProjects(data.data.slice(0, 3));
          }
        }
      } catch (error) {
        console.error('Error fetching gallery projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="py-20 sm:py-24 relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950/10 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08)_0%,transparent_50%)]" />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-900/20 to-transparent" />
      
      <div className="absolute top-20 right-[10%] w-80 h-80 bg-orange-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-40 left-[15%] w-64 h-64 bg-orange-500/5 rounded-full blur-[80px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-500/10 border border-gray-800">
            <Layers className="w-4 h-4 text-orange-400" />
            <span className="font-space font-bold text-[10px] sm:text-xs text-orange-400 tracking-wider">
              PROJECT GALLERY
            </span>
            <Sparkles className="w-4 h-4 text-orange-400" />
          </div>
          <h2 className="font-space font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-4">
            <span className="bg-gradient-to-r from-orange-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Built by Builders
            </span>
          </h2>
          <p className="font-space text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Explore projects created at Maximally hackathons. Get inspired, learn from others, 
            and showcase your own work.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 bg-gray-900/50 border border-gray-800 animate-pulse">
                <div className="w-full h-40 bg-gray-800 mb-4" />
                <div className="h-4 bg-gray-800 w-3/4 mb-2" />
                <div className="h-3 bg-gray-800 w-full" />
              </div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto mb-12">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                to={`/gallery/${project.id}`}
                className="group p-5 bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 hover:border-orange-500/30 transition-all duration-300"
                data-testid={`gallery-project-${index}`}
              >
                {project.thumbnail_url ? (
                  <div className="w-full h-40 mb-4 overflow-hidden bg-gray-800">
                    <img 
                      src={project.thumbnail_url} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 mb-4 bg-gradient-to-br from-gray-900/30 to-gray-900/30 flex items-center justify-center">
                    <Code2 className="w-12 h-12 text-orange-500/50" />
                  </div>
                )}
                <h3 className="font-space font-bold text-xs text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="font-space text-xs text-gray-500 mb-2 line-clamp-2">
                  {project.description}
                </p>
                {project.hackathon_name && (
                  <span className="inline-block px-2 py-1 bg-orange-500/10 text-orange-400 text-[10px] font-space">
                    {project.hackathon_name}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mb-12 p-8 bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 text-center">
            <Code2 className="w-16 h-16 text-orange-500/30 mx-auto mb-4" />
            <h3 className="font-space font-bold text-sm text-white mb-2">No Projects Yet</h3>
            <p className="font-space text-sm text-gray-400">
              Be the first to showcase your hackathon project!
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
          <Link
            to="/gallery"
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 border border-orange-500/30 hover:border-orange-500 text-orange-400 hover:text-white font-space font-bold text-[10px] sm:text-xs transition-all duration-300"
            data-testid="button-browse-gallery"
          >
            <Eye className="w-4 h-4" />
            <span>BROWSE GALLERY</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to="/gallery/submit"
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900/30 to-gray-900/20 border border-orange-500/50 hover:border-orange-500 text-gray-300 hover:text-white font-space font-bold text-[10px] sm:text-xs transition-all duration-300"
            data-testid="button-submit-project"
          >
            <Upload className="w-4 h-4" />
            <span>SUBMIT PROJECT</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-900/20 to-transparent" />
    </section>
  );
}

export default GlobalGallerySection;
