import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Play, Clock } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

interface Podcast {
  id: number;
  title: string;
  description: string;
  guest_name: string;
  guest_role: string;
  guest_company: string;
  guest_avatar: string | null;
  category: string;
  duration: string;
  audio_url: string | null;
  spotify_url: string | null;
  published_at: string;
}

const FALLBACK_CATEGORIES = ["All Episodes", "Building", "Leadership", "Engineering", "Product", "Culture"];

export default function ResourcesPodcasts() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Episodes");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await fetch('/api/podcasts');
        const json = await res.json();
        if (json.success) setPodcasts(json.data);
      } catch (err) {
        console.error('Failed to fetch podcasts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPodcasts();
  }, []);

  const categories = useMemo(() => {
    if (podcasts.length === 0) return FALLBACK_CATEGORIES;
    const cats = new Set(podcasts.map(p => p.category));
    return ["All Episodes", ...Array.from(cats)];
  }, [podcasts]);

  const filtered = useMemo(() => {
    return podcasts.filter(ep => {
      const matchesCategory = activeCategory === "All Episodes" || ep.category === activeCategory;
      const matchesSearch = !searchTerm || ep.title.toLowerCase().includes(searchTerm.toLowerCase()) || ep.guest_name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [podcasts, activeCategory, searchTerm]);

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

  return (
    <>
      <SEO title="Podcasts — Conversations with Builders | Maximally" description="Conversations with builders, operators, and founders shaping the ecosystem." canonicalUrl="https://maximally.in/resources/podcasts" />
      <div className="min-h-screen bg-black text-white pt-20 sm:pt-24">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 pb-20">
          {/* Sub-nav */}
          <div className="flex items-center gap-6 border-b border-gray-800 mb-12 pt-8">
            {[
              { label: "Blog", href: "/blog" },
              { label: "Podcasts", href: "/resources/podcasts", active: true },
              { label: "Interviews", href: "/resources/interviews" },
              { label: "Builder Stories", href: "/resources/stories" },
            ].map(tab => (
              <Link key={tab.label} to={tab.href} className={`font-space text-sm pb-3 border-b-2 transition-colors ${tab.active ? "text-orange-400 border-orange-400" : "text-gray-500 border-transparent hover:text-gray-300"}`}>
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Header */}
          <div className="mb-10">
            <span className="font-space text-sm text-orange-400 tracking-wide uppercase block mb-3">Podcasts</span>
            <h1 className="font-space text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-xl">
              Conversations with builders and operators.
            </h1>
            <p className="font-space text-base text-gray-400 max-w-lg">
              Long-form conversations with the people building, shipping, and scaling real products.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Search episodes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 text-white font-space text-sm placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50" />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 font-space text-xs font-medium border transition-all ${activeCategory === cat ? "bg-orange-500/15 border-orange-500/40 text-orange-400" : "bg-gray-900/60 border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-600"}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-5 bg-gray-900/40 border border-gray-800 animate-pulse h-24" />
              ))}
            </div>
          )}

          {/* Episodes list */}
          {!loading && (
            <div className="space-y-4">
              {filtered.map(ep => (
                <div key={ep.id} className="group flex items-start gap-5 p-5 bg-gray-900/40 border border-gray-800 hover:border-orange-500/25 transition-all">
                  <div className="w-16 h-16 bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 group-hover:border-orange-500/30 transition-colors overflow-hidden">
                    {ep.guest_avatar ? (
                      <img src={ep.guest_avatar} alt={ep.guest_name} className="w-full h-full object-cover" />
                    ) : (
                      <Play className="w-5 h-5 text-orange-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-space text-[10px] text-orange-400 uppercase tracking-wider font-semibold">{ep.category}</span>
                    <h3 className="font-space text-base font-semibold text-white mt-1 group-hover:text-orange-400 transition-colors">{ep.title}</h3>
                    <p className="font-space text-sm text-gray-400 mt-1 line-clamp-2">{ep.description}</p>
                    <div className="flex items-center gap-4 mt-2 font-space text-xs text-gray-500">
                      <span>{ep.guest_name}</span>
                      {ep.guest_role && <><span>|</span><span>{ep.guest_role}</span></>}
                      <span>|</span>
                      <span>{formatDate(ep.published_at)}</span>
                    </div>
                  </div>
                  {ep.duration && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                      <Clock className="w-3 h-3" />
                      <span className="font-space">{ep.duration}</span>
                    </div>
                  )}
                </div>
              ))}
              {filtered.length === 0 && !loading && (
                <div className="text-center py-16">
                  <Play className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="font-space text-gray-500">{podcasts.length === 0 ? "No episodes yet. Check back soon." : "No episodes found."}</p>
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
