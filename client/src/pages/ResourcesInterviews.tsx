import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Play, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const categories = ["All Interviews", "Engineering", "Product", "Leadership", "Operations", "Culture"];

const interviews = [
  { id: 1, title: "Building for Scale Without Losing Focus", guest: "Charity Majors", guestRole: "CTO, Honeycomb", category: "Engineering", duration: "48:12", date: "May 29, 2024", description: "We spoke with Charity Majors, CTO at Honeycomb, about observability, scaling teams, and staying close to customers.", image: null },
  { id: 2, title: "Product Strategy in Uncertain Times", guest: "Marty Cagan", guestRole: "Author, Inspired", category: "Product", duration: "36:05", date: "May 20, 2024", description: "A conversation with Marty Cagan on continuous discovery, product leadership, and building what matters.", image: null },
  { id: 3, title: "Operating a Global Remote Company", guest: "Melissa Di Donato", guestRole: "COO, GitLab", category: "Operations", duration: "42:18", date: "Apr 15, 2024", description: "GitLab COO Melissa Di Donato on asynchronous culture, distributed operations, and creating clarity at scale.", image: null },
  { id: 4, title: "Culture Is a System, Not a Perk", guest: "Darren Murph", guestRole: "Head of Culture, GitHub", category: "Culture", duration: "33:47", date: "Mar 28, 2024", description: "How Darren Murph builds culture intentionally at GitHub and why it's a compounding advantage.", image: null },
  { id: 5, title: "Leading Through Change", guest: "Elad Gil", guestRole: "Investor & Advisor", category: "Leadership", duration: "29:31", date: "Mar 10, 2024", description: "Elad Gil on leadership, decision-making, and helping teams navigate uncertainty.", image: null },
  { id: 6, title: "The Art of Technical Writing", guest: "Sarah Drasner", guestRole: "VP of DX, Netlify", category: "Engineering", duration: "37:22", date: "Feb 25, 2024", description: "Sarah Drasner on developer experience, technical communication, and building for developers.", image: null },
];

const featuredInterview = {
  title: "The Long-Term Builder Mindset",
  guest: "Jason Fried",
  guestRole: "Founder, Basecamp",
  duration: "52:33",
  description: "Jason Fried on sustainable companies, staying independent, and building a business that lasts.",
};

const popularTopics = [
  { name: "Leadership", count: 16 },
  { name: "Engineering", count: 14 },
  { name: "Product", count: 12 },
  { name: "Culture", count: 9 },
  { name: "Operations", count: 8 },
];

export default function ResourcesInterviews() {
  const [activeCategory, setActiveCategory] = useState("All Interviews");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = interviews.filter(item => {
    const matchesCategory = activeCategory === "All Interviews" || item.category === activeCategory;
    const matchesSearch = !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.guest.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <SEO title="Interviews — Conversations with People Shaping the Ecosystem | Maximally" description="In-depth interviews with builders, operators, and thinkers driving meaningful change." canonicalUrl="https://maximally.in/resources/interviews" />
      <div className="min-h-screen bg-black text-white pt-20 sm:pt-24">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 pb-20">
          {/* Sub-nav */}
          <div className="flex items-center gap-6 border-b border-gray-800 mb-12 pt-8">
            {[
              { label: "Blog", href: "/blog" },
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
              {/* Header */}
              <div className="mb-10">
                <span className="font-space text-sm text-orange-400 tracking-wide uppercase block mb-3">Interviews</span>
                <h1 className="font-space text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight max-w-xl">
                  Conversations with people shaping the ecosystem.
                </h1>
                <p className="font-space text-base text-gray-400 max-w-lg">
                  In-depth interviews with builders, operators, and thinkers driving meaningful change.
                </p>
              </div>

              {/* Search */}
              <div className="relative max-w-md mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search interviews..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 text-white font-space text-sm placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50" />
              </div>

              {/* Category filters */}
              <div className="flex flex-wrap gap-2 mb-10">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 font-space text-xs font-medium border transition-all ${activeCategory === cat ? "bg-orange-500/15 border-orange-500/40 text-orange-400" : "bg-gray-900/60 border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-600"}`}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Interview cards */}
              <div className="space-y-5">
                {filtered.map(item => (
                  <div key={item.id} className="group flex items-start gap-5 p-5 bg-gray-900/40 border border-gray-800 hover:border-orange-500/25 transition-all">
                    <div className="w-32 h-20 bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 relative group-hover:border-orange-500/30 transition-colors">
                      <Play className="w-4 h-4 text-orange-400" />
                      <span className="absolute bottom-1 left-1 font-space text-[10px] text-gray-400 bg-black/80 px-1">{item.duration}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-space text-[10px] text-orange-400 uppercase tracking-wider font-semibold">{item.category}</span>
                      <h3 className="font-space text-base font-semibold text-white mt-1 group-hover:text-orange-400 transition-colors">{item.title}</h3>
                      <p className="font-space text-sm text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-3 mt-2 font-space text-xs text-gray-500">
                        <span>{item.guest}</span>
                        <span>|</span>
                        <span>{item.guestRole}</span>
                        <span>|</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-16">
                    <p className="font-space text-gray-500">No interviews found.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* About */}
              <div className="p-5 bg-gray-900/40 border border-gray-800">
                <h3 className="font-space text-sm font-semibold text-white mb-3">About the series</h3>
                <p className="font-space text-xs text-gray-400 leading-relaxed mb-4">
                  We go beyond the headlines to explore career journeys, key decisions, hard lessons, and advice for the next generation of builders.
                </p>
                <div className="p-3 bg-gray-800/50 border-l-2 border-orange-500">
                  <p className="font-space text-xs text-gray-300 italic">"The best insights come from real experiences."</p>
                </div>
              </div>

              {/* Featured */}
              <div className="p-5 bg-gray-900/40 border border-gray-800">
                <h3 className="font-space text-sm font-semibold text-white mb-4">Featured interview</h3>
                <div className="w-full h-32 bg-gray-800 border border-gray-700 flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 text-orange-400" />
                </div>
                <span className="font-space text-[10px] text-orange-400 uppercase tracking-wider font-semibold">Featured</span>
                <h4 className="font-space text-sm font-semibold text-white mt-1">{featuredInterview.title}</h4>
                <p className="font-space text-xs text-gray-400 mt-1 line-clamp-3">{featuredInterview.description}</p>
                <div className="flex items-center gap-2 mt-2 font-space text-xs text-gray-500">
                  <span>{featuredInterview.guest}</span>
                  <span>|</span>
                  <span>{featuredInterview.guestRole}</span>
                </div>
              </div>

              {/* Popular topics */}
              <div className="p-5 bg-gray-900/40 border border-gray-800">
                <h3 className="font-space text-sm font-semibold text-white mb-4">Popular topics</h3>
                <div className="space-y-2.5">
                  {popularTopics.map(topic => (
                    <div key={topic.name} className="flex items-center justify-between">
                      <span className="font-space text-xs text-gray-400">{topic.name}</span>
                      <span className="font-space text-xs text-orange-400 font-semibold">{topic.count}</span>
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-1 mt-4 font-space text-xs text-orange-400 hover:text-orange-300 transition-colors">
                  View all topics <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </aside>
          </div>

          {/* Coming soon */}
          <div className="mt-16 text-center">
            <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30">
              <span className="font-space text-xs text-orange-400 font-semibold uppercase tracking-wider">Interviews launching soon</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
