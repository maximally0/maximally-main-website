import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Layers,
  Trophy,
  Eye,
  Heart,
  Code2,
  Github,
  ExternalLink,
  Sparkles,
  Grid,
  List,
  ChevronDown,
  X,
  Plus,
  ArrowLeft
} from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useAuth } from '@/contexts/AuthContext';
import RecommendedProjects from '@/components/RecommendedProjects';

interface GalleryProject {
  id: number;
  name: string;
  tagline?: string;
  description: string;
  logo_url?: string;
  cover_image_url?: string;
  category?: string;
  technologies?: string[];
  github_url?: string;
  demo_url?: string;
  like_count: number;
  view_count: number;
  hackathon_id?: number;
  hackathon_position?: string;
  created_at: string;
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

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Liked' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'oldest', label: 'Oldest First' },
];

export default function Gallery() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [hackathonOnly, setHackathonOnly] = useState(searchParams.get('hackathon') === 'true');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProjects();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (sort !== 'newest') params.set('sort', sort);
    if (hackathonOnly) params.set('hackathon', 'true');
    setSearchParams(params);
  }, [search, category, sort, hackathonOnly, pagination.page]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/gallery/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '12',
        sort,
      });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (hackathonOnly) params.set('hackathon_only', 'true');

      const res = await fetch(`/api/gallery/projects?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setProjects(data.data);
        setPagination(prev => ({
          ...prev,
          totalPages: data.pagination.totalPages,
          total: data.pagination.total
        }));
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setSort('newest');
    setHackathonOnly(false);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = search || category || sort !== 'newest' || hackathonOnly;

  return (
    <>
      <SEO
        title="Project Gallery - Maximally"
        description="Explore amazing projects built by the Maximally community. From hackathon winners to indie creations."
        keywords="project gallery, hackathon projects, developer showcase, tech projects"
      />

      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="pt-20 sm:pt-28 pb-12 sm:pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.04)_0%,transparent_50%)]" />
          
          <div className="absolute top-20 left-[5%] w-80 h-80 bg-orange-500/5 rounded-full blur-[100px]" />
          <div className="absolute top-40 right-[10%] w-60 h-60 bg-orange-500/3 rounded-full blur-[80px]" />
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <Link 
              to="/"
              className="group inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 font-space text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-500/10 border border-gray-800">
                <Layers className="w-4 h-4 text-orange-400" />
                <span className="font-space font-bold text-[10px] sm:text-xs text-orange-400 tracking-wider">
                  PROJECT GALLERY
                </span>
                <Sparkles className="w-4 h-4 text-orange-400" />
              </div>

              <h1 className="font-space font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
                <span className="bg-gradient-to-r from-orange-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  Built by Builders
                </span>
              </h1>

              <p className="font-space text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
                Discover projects from our community. Hackathon submissions, 
                side projects, and everything in between.
              </p>

              {user && (
                <Link
                  to="/gallery/submit"
                  className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-500/50 hover:border-orange-500 text-white hover:text-white font-space font-bold text-[10px] sm:text-xs transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  SUBMIT PROJECT
                </Link>
              )}
            </div>
          </div>
        </section>


        {/* Filters Section */}
        <section className="py-4 sm:py-6 border-y border-gray-800 bg-gray-900/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className="w-full bg-black/50 border border-gray-800 text-white pl-12 pr-4 py-3 font-space text-sm focus:border-orange-500 outline-none transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-400 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 font-space font-bold text-[10px] flex items-center gap-2 border transition-all ${
                    showFilters || hasActiveFilters 
                      ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' 
                      : 'bg-black/50 border-gray-700 text-gray-400 hover:border-gray-800'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  FILTERS
                  {hasActiveFilters && <span className="w-2 h-2 bg-orange-500 rounded-full" />}
                </button>

                <div className="flex border border-gray-700">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-orange-500/10 text-orange-400' : 'bg-black/50 text-gray-500 hover:text-orange-400'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-orange-500/10 text-orange-400' : 'bg-black/50 text-gray-500 hover:text-orange-400'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-800">
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    className="appearance-none bg-black/50 border border-gray-800 text-white px-4 py-2 pr-10 font-space text-sm focus:border-orange-500 outline-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    className="appearance-none bg-black/50 border border-gray-800 text-white px-4 py-2 pr-10 font-space text-sm focus:border-orange-500 outline-none"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hackathonOnly}
                    onChange={(e) => {
                      setHackathonOnly(e.target.checked);
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-sm text-gray-400 font-space">Hackathon Projects Only</span>
                </label>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-orange-400 hover:text-orange-400 font-space flex items-center gap-1 transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500 font-space">
              {loading ? 'Loading...' : `${pagination.total} project${pagination.total !== 1 ? 's' : ''} found`}
            </div>
          </div>
        </section>


        {/* Projects Grid */}
        <section className="py-12 sm:py-16 relative">
          <div className="container mx-auto px-4 sm:px-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-900/50 border border-gray-800 animate-pulse">
                    <div className="h-40 bg-gray-800" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-800 w-3/4" />
                      <div className="h-3 bg-gray-800 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-orange-500/10 border border-gray-800">
                  <Code2 className="h-10 w-10 text-orange-400" />
                </div>
                <h3 className="font-space font-bold text-sm sm:text-base text-gray-400 mb-3">NO PROJECTS FOUND</h3>
                <p className="text-gray-500 font-space text-sm">Try adjusting your filters or search terms</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <ProjectListItem key={project.id} project={project} />
                ))}
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-12">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-5 py-2.5 bg-black/50 border border-gray-800 text-orange-400 font-space font-bold text-[10px] disabled:opacity-30 disabled:cursor-not-allowed hover:border-orange-500 transition-colors"
                >
                  PREV
                </button>
                <span className="px-5 py-2.5 font-space font-bold text-[10px] text-gray-500">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-5 py-2.5 bg-black/50 border border-gray-800 text-orange-400 font-space font-bold text-[10px] disabled:opacity-30 disabled:cursor-not-allowed hover:border-orange-500 transition-colors"
                >
                  NEXT
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Recommended Projects Section */}
        {user && (
          <section className="py-8 sm:py-12">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12">
              <RecommendedProjects limit={6} />
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  );
}

function ProjectCard({ project }: { project: GalleryProject }) {
  return (
    <Link
      to={`/gallery/${project.id}`}
      className="group bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 hover:border-orange-500/30 transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-40 bg-gray-800/50 overflow-hidden">
        {project.cover_image_url ? (
          <img
            src={project.cover_image_url}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900/40 to-gray-900/20">
            <Code2 className="h-12 w-12 text-orange-400/30" />
          </div>
        )}
        
        {project.hackathon_id && (
          <div className="absolute top-3 left-3">
            <div className={`px-2.5 py-1 text-[10px] font-space font-bold flex items-center gap-1.5 ${
              project.hackathon_position 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black' 
                : 'bg-orange-500/80 text-white'
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

        <div className="absolute bottom-3 right-3 flex gap-2">
          <div className="bg-black/70 backdrop-blur-sm px-2 py-1 flex items-center gap-1 text-[10px] text-gray-300">
            <Eye className="h-3 w-3" />
            {project.view_count}
          </div>
          <div className="bg-black/70 backdrop-blur-sm px-2 py-1 flex items-center gap-1 text-[10px] text-gray-300">
            <Heart className="h-3 w-3" />
            {project.like_count}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          {project.logo_url && (
            <img
              src={project.logo_url}
              alt={project.name}
              className="w-10 h-10 border border-gray-700 object-contain bg-white"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-space font-bold text-xs text-white truncate group-hover:text-orange-400 transition-colors">
              {project.name}
            </h3>
            {project.profiles && (
              <p className="text-[10px] text-gray-500 font-space mt-1">
                by @{project.profiles.username}
              </p>
            )}
          </div>
        </div>

        {project.tagline && (
          <p className="text-xs text-gray-400 font-space line-clamp-2 mb-3 leading-relaxed">
            {project.tagline}
          </p>
        )}

        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 3).map((tech, i) => (
              <span key={i} className="text-[10px] bg-orange-500/10 border border-gray-800 px-2 py-0.5 text-orange-400 font-space">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-[10px] text-gray-500">+{project.technologies.length - 3}</span>
            )}
          </div>
        )}

        {project.hackathons && (
          <div className="mt-4 pt-3 border-t border-gray-800">
            <p className="text-[10px] text-gray-500 font-space">
              Submitted to <span className="text-orange-400">{project.hackathons.title}</span>
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

function ProjectListItem({ project }: { project: GalleryProject }) {
  return (
    <Link
      to={`/gallery/${project.id}`}
      className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 hover:border-orange-500/30 transition-all p-5 flex gap-5 group"
    >
      <div className="w-24 h-24 flex-shrink-0 bg-gray-800/50 overflow-hidden">
        {project.cover_image_url ? (
          <img src={project.cover_image_url} alt={project.name} className="w-full h-full object-cover" />
        ) : project.logo_url ? (
          <img src={project.logo_url} alt={project.name} className="w-full h-full object-contain bg-white p-2" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900/40 to-gray-900/20">
            <Code2 className="h-8 w-8 text-orange-400/30" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-space font-bold text-xs text-white group-hover:text-orange-400 transition-colors">
              {project.name}
            </h3>
            {project.profiles && (
              <p className="text-[10px] text-gray-500 font-space mt-1">by @{project.profiles.username}</p>
            )}
          </div>
          
          {project.hackathon_position && (
            <div className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[10px] font-space font-bold flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              {project.hackathon_position}
            </div>
          )}
        </div>

        {project.tagline && (
          <p className="text-xs text-gray-400 font-space mt-2 line-clamp-1">{project.tagline}</p>
        )}

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Eye className="h-3 w-3" /> {project.view_count}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Heart className="h-3 w-3" /> {project.like_count}
          </div>
          {project.hackathons && (
            <span className="text-[10px] text-orange-400 font-space">{project.hackathons.title}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
