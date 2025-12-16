import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Rocket,
  Trophy,
  Eye,
  Heart,
  Code,
  Github,
  ExternalLink,
  Sparkles,
  Grid,
  List,
  ChevronDown,
  X,
  Plus
} from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useAuth } from '@/contexts/AuthContext';

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
    // Update URL params
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
        <section className="pt-24 pb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-8">
              <div className="minecraft-block bg-maximally-red text-white px-6 py-3 inline-block mb-6">
                <span className="font-press-start text-sm flex items-center gap-2">
                  <Rocket className="h-4 w-4" />
                  PROJECT GALLERY
                </span>
              </div>

              <h1 className="font-press-start text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="text-maximally-red">BUILT BY HACKERS</span>
              </h1>

              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-jetbrains mb-8">
                Discover projects from our community. Hackathon submissions, side projects, and everything in between.
              </p>

              {user && (
                <Link
                  to="/gallery/submit"
                  className="pixel-button bg-maximally-yellow text-black inline-flex items-center gap-2 px-6 py-3 font-press-start text-sm hover:scale-105 transition-transform"
                >
                  <Plus className="h-4 w-4" />
                  SUBMIT_PROJECT
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-6 border-y border-gray-800 bg-gray-900/50 sticky top-16 z-20">
          <div className="container mx-auto px-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className="w-full bg-gray-800 border-2 border-gray-700 text-white pl-12 pr-4 py-3 font-jetbrains focus:border-maximally-red outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`pixel-button px-4 py-3 font-press-start text-xs flex items-center gap-2 ${
                    showFilters || hasActiveFilters ? 'bg-maximally-red text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  FILTERS
                  {hasActiveFilters && <span className="w-2 h-2 bg-maximally-yellow rounded-full" />}
                </button>

                <div className="flex border-2 border-gray-700">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 ${viewMode === 'grid' ? 'bg-maximally-red text-white' : 'bg-gray-800 text-gray-400'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 ${viewMode === 'list' ? 'bg-maximally-red text-white' : 'bg-gray-800 text-gray-400'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-800">
                {/* Category */}
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    className="appearance-none bg-gray-800 border-2 border-gray-700 text-white px-4 py-2 pr-10 font-jetbrains text-sm focus:border-maximally-red outline-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    className="appearance-none bg-gray-800 border-2 border-gray-700 text-white px-4 py-2 pr-10 font-jetbrains text-sm focus:border-maximally-red outline-none"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Hackathon Only */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hackathonOnly}
                    onChange={(e) => {
                      setHackathonOnly(e.target.checked);
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    className="w-4 h-4 accent-maximally-red"
                  />
                  <span className="text-sm text-gray-300 font-jetbrains">Hackathon Projects Only</span>
                </label>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-maximally-red hover:text-maximally-yellow font-jetbrains flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-400 font-jetbrains">
              {loading ? 'Loading...' : `${pagination.total} project${pagination.total !== 1 ? 's' : ''} found`}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="pixel-card bg-gray-900 border-2 border-gray-800 animate-pulse">
                    <div className="h-40 bg-gray-800" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-800 rounded w-3/4" />
                      <div className="h-3 bg-gray-800 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16">
                <Code className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="font-press-start text-lg text-gray-400 mb-2">NO_PROJECTS_FOUND</h3>
                <p className="text-gray-500 font-jetbrains">Try adjusting your filters or search terms</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="pixel-button bg-gray-800 text-white px-4 py-2 font-press-start text-xs disabled:opacity-50"
                >
                  PREV
                </button>
                <span className="px-4 py-2 font-press-start text-xs text-gray-400">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="pixel-button bg-gray-800 text-white px-4 py-2 font-press-start text-xs disabled:opacity-50"
                >
                  NEXT
                </button>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

function ProjectCard({ project }: { project: GalleryProject }) {
  return (
    <Link
      to={`/gallery/${project.id}`}
      className="pixel-card bg-gray-900 border-2 border-gray-800 hover:border-maximally-red transition-all duration-300 group overflow-hidden"
    >
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

        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech, i) => (
              <span key={i} className="text-[10px] bg-gray-800 border border-gray-700 px-2 py-0.5 text-gray-400 font-jetbrains">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-[10px] text-gray-500">+{project.technologies.length - 3}</span>
            )}
          </div>
        )}

        {project.hackathons && (
          <div className="mt-3 pt-3 border-t border-gray-800">
            <p className="text-[10px] text-gray-500 font-jetbrains">
              Submitted to <span className="text-maximally-red">{project.hackathons.title}</span>
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
      className="pixel-card bg-gray-900 border-2 border-gray-800 hover:border-maximally-red transition-all p-4 flex gap-4 group"
    >
      <div className="w-24 h-24 flex-shrink-0 bg-gray-800 overflow-hidden">
        {project.cover_image_url ? (
          <img src={project.cover_image_url} alt={project.name} className="w-full h-full object-cover" />
        ) : project.logo_url ? (
          <img src={project.logo_url} alt={project.name} className="w-full h-full object-contain bg-white p-2" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Code className="h-8 w-8 text-gray-600" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-press-start text-sm text-white group-hover:text-maximally-yellow transition-colors">
              {project.name}
            </h3>
            {project.profiles && (
              <p className="text-xs text-gray-500 font-jetbrains">by @{project.profiles.username}</p>
            )}
          </div>
          
          {project.hackathon_position && (
            <div className="px-2 py-1 bg-maximally-yellow text-black text-xs font-press-start flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              {project.hackathon_position}
            </div>
          )}
        </div>

        {project.tagline && (
          <p className="text-sm text-gray-400 font-jetbrains mt-2 line-clamp-1">{project.tagline}</p>
        )}

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye className="h-3 w-3" /> {project.view_count}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Heart className="h-3 w-3" /> {project.like_count}
          </div>
          {project.hackathons && (
            <span className="text-xs text-maximally-red font-jetbrains">{project.hackathons.title}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
