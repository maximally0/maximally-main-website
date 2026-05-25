import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Play, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

interface Interview {
  id: number;
  title: string;
  description: string;
  guest_name: string;
  guest_role: string;
  guest_company: string;
  guest_avatar: string | null;
  category: string;
  duration: string;
  video_url: string | null;
  thumbnail_url: string | null;
  is_featured: boolean;
  published_at: string;
}

const FALLBACK_CATEGORIES = ["All Interviews", "Engineering", "Product", "Leadership", "Operations", "Culture"];

export default function ResourcesInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Interviews");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await fetch('/api/interviews');
        const json = await res.json();
        if (json.success) setInterviews(json.data);
      } catch (err) {
        console.error('Failed to fetch interviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const categories = useMemo(() => {
    if (interviews.length === 0) return FALLBACK_CATEGORIES;
    const cats = new Set(interviews.map(i => i.category));
    return ["All Interviews", ...Array.from(cats)];
  }, [interviews]);

  const featured = useMemo(() => interviews.find(i => i.is_featured), [interviews]);

  const filtered = useMemo(() => {
    return interviews.filter(item => {
      const matchesCategory = activeCategory === "All Interviews" || item.category === activeCategory;
      const matchesSearch = !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.guest_name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [interviews, activeCategory, searchTerm]);

  const popularTopics = useMemo(() => {
    const map = new Map<string, number>();
    interviews.forEach(i => map.set(i.category, (map.get(i.category) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [interviews]);

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

  return (
    <>
      <SEO title="Interviews — Conversations with People Shaping the Ecosystem | Maximally" description="In-depth interviews with builders, operators, and thinkers driving meaningful change." canonicalUrl="https://maximally.in/resources/interviews" />
      <div className="min-h-screen bg-black text-white pt-20 sm:pt-24">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 pb-20">
          {/* Sub-nav */}
          <div className="flex items-center gap-6 border-b border-gray-800 mb-12 pt-8">
            {[
              { label: "Articles", href: "/blog" },
              { label: "Podcasts", href: "/resources/podcasts" },
              { label: "Interviews", href: "/resources/interviews", active: true },
              { label: "Builder Stories", href: "/resources/stories" },
            ].map(tab => (
              <Link key={tab.label} to={tab.href} className={`font-space text-sm pb-3 border-b-2 transition-colors ${tab.active ? "text-orange-400 border-orange-400" : "text-gray-500 border-transparent hover:text-gray-300"}`}>
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            {/* Main content */}
            <div>
              <div className="mb-10">
                <span className="font-space text-sm text-orange-400 tracking-wide uppercase block mb-3">Interviews</span>
                <h1 className="font-space text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight max-w-xl">
                  Conversations with people shaping the ecosystem.
                </h1>
                <p className="font-space text-base text-gray-400 max-w-lg">
                  In-depth interviews with builders, operators, and thinkers driving meaningful change.
                </p>
              </div>

              <div className="relative max-w-md mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search interviews..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 text-white font-space text-sm placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50" />
              </div>

              <div className="flex flex-wrap gap-2 mb-10">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 font-space text-xs font-medium border transition-all ${activeCategory === cat ? "bg-orange-500/15 border-orange-500/40 text-orange-400" : "bg-gray-900/60 border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-600"}`}>
                    {cat}
                  </button>
                ))}
              </div>

              {loading && (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="p-5 bg-gray-900/40 border border-gray-800 animate-pulse h-28" />)}
                </div>
              )}

              {!loading && (
                <div className="space-y-5">
                  {filtered.map(item => (
                    <div key={item.id} className="group flex items-start gap-5 p-5 bg-gray-900/40 border border-gray-800 hover:border-orange-500/25 transition-all">
                      <div className="w-32 h-20 bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 relative group-hover:border-orange-500/30 transition-colors overflow-hidden">
                        {item.thumbnail_url ? (
                          <img src={item.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Play className="w-4 h-4 text-orange-400" />
                        )}
                        {item.duration && <span className="absolute bottom-1 left-1 font-space text-[10px] text-gray-400 bg-black/80 px-1">{item.duration}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-space text-[10px] text-orange-400 uppercase tracking-wider font-semibold">{item.category}</span>
                        <h3 className="font-space text-base font-semibold text-white mt-1 group-hover:text-orange-400 transition-colors">{item.title}</h3>
                        <p className="font-space text-sm text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-3 mt-2 font-space text-xs text-gray-500">
                          <span>{item.guest_name}</span>
                          {item.guest_role && <><span>|</span><span>{item.guest_role}</span></>}
                          <span>|</span>
                          <span>{formatDate(item.published_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <div className="text-center py-16">
                      <Play className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                      <p className="font-space text-gray-500">{interviews.length === 0 ? "No interviews yet. Check back soon." : "No interviews found."}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="p-5 bg-gray-900/40 border border-gray-800">
                <h3 className="font-space text-sm font-semibold text-white mb-3">About the series</h3>
                <p className="font-space text-xs text-gray-400 leading-relaxed mb-4">
                  We go beyond the headlines to explore career journeys, key decisions, hard lessons, and advice for the next generation of builders.
                </p>
                <div className="p-3 bg-gray-800/50 border-l-2 border-orange-500">
                  <p className="font-space text-xs text-gray-300 italic">"The best insights come from real experiences."</p>
                </div>
              </div>

              {featured && (
                <div className="p-5 bg-gray-900/40 border border-gray-800">
                  <h3 className="font-space text-sm font-semibold text-white mb-4">Featured interview</h3>
                  <div className="w-full h-32 bg-gray-800 border border-gray-700 flex items-center justify-center mb-4 overflow-hidden">
                    {featured.thumbnail_url ? (
                      <img src={featured.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Play className="w-6 h-6 text-orange-400" />
                    )}
                  </div>
                  <span className="font-space text-[10px] text-orange-400 uppercase tracking-wider font-semibold">Featured</span>
                  <h4 className="font-space text-sm font-semibold text-white mt-1">{featured.title}</h4>
                  <p className="font-space text-xs text-gray-400 mt-1 line-clamp-3">{featured.description}</p>
                  <div className="flex items-center gap-2 mt-2 font-space text-xs text-gray-500">
                    <span>{featured.guest_name}</span>
                    {featured.guest_role && <><span>|</span><span>{featured.guest_role}</span></>}
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
                        <span className="font-space text-xs text-orange-400 font-semibold">{count}</span>
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
