import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Users } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

interface BuilderStory {
  id: number;
  title: string;
  description: string;
  company_name: string;
  company_logo: string | null;
  founder_name: string;
  founder_role: string;
  founder_avatar: string | null;
  stage: string;
  team_size: string;
  founded_year: string;
  category: string;
  is_featured: boolean;
  published_at: string;
}

const STAGES = ["All", "Early Stage", "Growth Stage", "Enterprise", "Solo Builder"];
const TEAM_SIZES = ["All Sizes", "1-10", "11-50", "51-100", "101-250", "251+"];

export default function ResourcesStories() {
  const [stories, setStories] = useState<BuilderStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState("All");
  const [activeTeamSize, setActiveTeamSize] = useState("All Sizes");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch('/api/builder-stories');
        const json = await res.json();
        if (json.success) setStories(json.data);
      } catch (err) {
        console.error('Failed to fetch builder stories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const featured = useMemo(() => stories.find(s => s.is_featured), [stories]);

  const filtered = useMemo(() => {
    return stories.filter(s => {
      const matchesStage = activeStage === "All" || s.stage === activeStage;
      const matchesSize = activeTeamSize === "All Sizes" || s.team_size === activeTeamSize;
      const matchesSearch = !searchTerm || s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStage && matchesSize && matchesSearch;
    });
  }, [stories, activeStage, activeTeamSize, searchTerm]);

  const stageCounts = useMemo(() => {
    return STAGES.map(stage => ({
      name: stage,
      count: stage === "All" ? stories.length : stories.filter(s => s.stage === stage).length,
    }));
  }, [stories]);

  const popularTopics = useMemo(() => {
    const map = new Map<string, number>();
    stories.forEach(s => { if (s.category) map.set(s.category, (map.get(s.category) || 0) + 1); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [stories]);

  return (
    <>
      <SEO title="Builder Stories — Profiles of Builders Who Shipped | Maximally" description="Real stories from the builders behind the products. Lessons, challenges, and wins from the journey." canonicalUrl="https://maximally.in/resources/stories" />
      <div className="min-h-screen bg-black text-white pt-20 sm:pt-24">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 pb-20">
          {/* Sub-nav */}
          <div className="flex items-center gap-6 border-b border-gray-800 mb-12 pt-8">
            {[
              { label: "Articles", href: "/blog" },
              { label: "Podcasts", href: "/resources/podcasts" },
              { label: "Interviews", href: "/resources/interviews" },
              { label: "Builder Stories", href: "/resources/stories", active: true },
            ].map(tab => (
              <Link key={tab.label} to={tab.href} className={`font-space text-sm pb-3 border-b-2 transition-colors ${tab.active ? "text-orange-400 border-orange-400" : "text-gray-500 border-transparent hover:text-gray-300"}`}>
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            {/* Main */}
            <div>
              <div className="mb-10">
                <span className="font-space text-sm text-orange-400 tracking-wide uppercase block mb-3">Builder Stories</span>
                <h1 className="font-space text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight max-w-xl">
                  Profiles of builders who shipped through Maximally.
                </h1>
                <p className="font-space text-base text-gray-400 max-w-lg">
                  Real stories from the builders behind the products. Lessons, challenges, and wins from the journey.
                </p>
              </div>

              <div className="relative max-w-md mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search builder stories..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 text-white font-space text-sm placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50" />
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {STAGES.map(stage => (
                  <button key={stage} onClick={() => setActiveStage(stage)} className={`px-4 py-2 font-space text-xs font-medium border transition-all ${activeStage === stage ? "bg-orange-500/15 border-orange-500/40 text-orange-400" : "bg-gray-900/60 border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-600"}`}>
                    {stage}
                  </button>
                ))}
              </div>

              {loading && (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="p-5 bg-gray-900/40 border border-gray-800 animate-pulse h-28" />)}
                </div>
              )}

              {!loading && (
                <div className="space-y-4">
                  {filtered.map(story => (
                    <div key={story.id} className="group flex items-start gap-5 p-5 bg-gray-900/40 border border-gray-800 hover:border-orange-500/25 transition-all">
                      <div className="w-16 h-16 bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 group-hover:border-orange-500/30 transition-colors overflow-hidden">
                        {story.company_logo ? (
                          <img src={story.company_logo} alt={story.company_name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-space text-[10px] text-gray-400 font-semibold">{story.company_name?.slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-space text-base font-semibold text-white group-hover:text-orange-400 transition-colors">{story.title}</h3>
                        <p className="font-space text-sm text-gray-400 mt-1 line-clamp-2">{story.description}</p>
                        <div className="flex items-center gap-3 mt-2 font-space text-xs text-gray-500">
                          <span>{story.founder_name}</span>
                          <span>•</span>
                          <span>{story.founder_role}</span>
                        </div>
                      </div>
                      <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 text-right">
                        <span className="font-space text-xs text-orange-400">{story.stage}</span>
                        {story.team_size && <>
                          <span className="font-space text-[10px] text-gray-500">Team Size</span>
                          <span className="font-space text-xs text-gray-400">{story.team_size}</span>
                        </>}
                        {story.founded_year && <>
                          <span className="font-space text-[10px] text-gray-500">Founded</span>
                          <span className="font-space text-xs text-gray-400">{story.founded_year}</span>
                        </>}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-orange-400 transition-colors shrink-0 mt-1" />
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <div className="text-center py-16">
                      <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                      <p className="font-space text-gray-500">{stories.length === 0 ? "No stories yet. Check back soon." : "No stories found."}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="p-5 bg-gray-900/40 border border-gray-800">
                <h3 className="font-space text-sm font-semibold text-white mb-4">Filter by</h3>
                <p className="font-space text-xs text-gray-500 mb-2">Stage</p>
                <div className="space-y-1.5">
                  {stageCounts.map(({ name, count }) => (
                    <button key={name} onClick={() => setActiveStage(name)} className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${activeStage === name ? "text-orange-400" : "text-gray-400 hover:text-gray-300"}`}>
                      <span className="font-space text-xs">{name}</span>
                      <span className={`font-space text-xs font-semibold ${activeStage === name ? "text-orange-400" : "text-gray-600"}`}>{count}</span>
                    </button>
                  ))}
                </div>
                <p className="font-space text-xs text-gray-500 mt-4 mb-2">Team size</p>
                <div className="space-y-1.5">
                  {TEAM_SIZES.map(size => (
                    <button key={size} onClick={() => setActiveTeamSize(size)} className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${activeTeamSize === size ? "text-orange-400" : "text-gray-400 hover:text-gray-300"}`}>
                      <span className="font-space text-xs">{size}</span>
                    </button>
                  ))}
                </div>
              </div>

              {featured && (
                <div className="p-5 bg-gray-900/40 border border-gray-800">
                  <h3 className="font-space text-sm font-semibold text-white mb-4">Featured story</h3>
                  <div className="w-full h-28 bg-gray-800 border border-gray-700 flex items-center justify-center mb-4 overflow-hidden">
                    {featured.company_logo ? (
                      <img src={featured.company_logo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-space text-xs text-gray-500">{featured.company_name}</span>
                    )}
                  </div>
                  <h4 className="font-space text-sm font-semibold text-white">{featured.title}</h4>
                  <p className="font-space text-xs text-gray-400 mt-1 line-clamp-3">{featured.description}</p>
                  <div className="flex items-center gap-2 mt-2 font-space text-xs text-gray-500">
                    <span>{featured.founder_name}</span>
                    <span>•</span>
                    <span>{featured.founder_role}</span>
                  </div>
                </div>
              )}

              {popularTopics.length > 0 && (
                <div className="p-5 bg-gray-900/40 border border-gray-800">
                  <h3 className="font-space text-sm font-semibold text-white mb-4">Popular topics</h3>
                  <div className="space-y-2.5">
                    {popularTopics.map(([name, count]) => (
                      <div key={name} className="flex items-center justify-between">
                        <span className="font-space text-xs text-gray-400">{name}</span>
                        <span className="font-space text-xs text-gray-500">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
