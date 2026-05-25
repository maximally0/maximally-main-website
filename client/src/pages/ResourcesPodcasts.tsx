import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Play, Clock, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const categories = ["All Episodes", "Building", "Leadership", "Engineering", "Product", "Culture"];

const episodes = [
  { id: 1, title: "Shipping Under Pressure", guest: "Sahil Lavingia", guestRole: "CEO, Gumroad", category: "Building", duration: "45:12", date: "May 15, 2024", description: "How constraints force better decisions and why most teams overthink before shipping." },
  { id: 2, title: "Engineering Culture at Scale", guest: "Will Larson", guestRole: "CTO, Carta", category: "Engineering", duration: "52:30", date: "May 8, 2024", description: "Building engineering organizations that maintain velocity as they grow." },
  { id: 3, title: "Product Intuition vs Data", guest: "Shreyas Doshi", guestRole: "Former PM, Stripe", category: "Product", duration: "38:45", date: "Apr 28, 2024", description: "When to trust your gut and when to let the numbers decide." },
  { id: 4, title: "The Solo Founder Playbook", guest: "Pieter Levels", guestRole: "Founder, Nomad List", category: "Building", duration: "41:20", date: "Apr 20, 2024", description: "Building multiple profitable products without a team or funding." },
  { id: 5, title: "Leading Through Ambiguity", guest: "Claire Hughes Johnson", guestRole: "Former COO, Stripe", category: "Leadership", duration: "48:55", date: "Apr 12, 2024", description: "How to make decisions when the path forward isn't clear." },
  { id: 6, title: "Open Source as a Business", guest: "Mitchell Hashimoto", guestRole: "Co-founder, HashiCorp", category: "Engineering", duration: "55:10", date: "Apr 5, 2024", description: "Building a multi-billion dollar company on open source foundations." },
];

export default function ResourcesPodcasts() {
  const [activeCategory, setActiveCategory] = useState("All Episodes");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = episodes.filter(ep => {
    const matchesCategory = activeCategory === "All Episodes" || ep.category === activeCategory;
    const matchesSearch = !searchTerm || ep.title.toLowerCase().includes(searchTerm.toLowerCase()) || ep.guest.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <SEO title="Podcasts — Conversations with Builders | Maximally" description="Conversations with builders, operators, and founders shaping the ecosystem." canonicalUrl="https://maximally.in/resources/podcasts" />
      <div className="min-h-screen bg-black text-white pt-20 sm:pt-24">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

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

          {/* Episodes list */}
          <div className="space-y-4">
            {filtered.map(ep => (
              <div key={ep.id} className="group flex items-start gap-5 p-5 bg-gray-900/40 border border-gray-800 hover:border-orange-500/25 transition-all">
                <div className="w-16 h-16 bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 group-hover:border-orange-500/30 transition-colors">
                  <Play className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-space text-[10px] text-orange-400 uppercase tracking-wider font-semibold">{ep.category}</span>
                  <h3 className="font-space text-base font-semibold text-white mt-1 group-hover:text-orange-400 transition-colors">{ep.title}</h3>
                  <p className="font-space text-sm text-gray-400 mt-1 line-clamp-2">{ep.description}</p>
                  <div className="flex items-center gap-4 mt-2 font-space text-xs text-gray-500">
                    <span>{ep.guest}</span>
                    <span>|</span>
                    <span>{ep.guestRole}</span>
                    <span>|</span>
                    <span>{ep.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                  <Clock className="w-3 h-3" />
                  <span className="font-space">{ep.duration}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="font-space text-gray-500">No episodes found.</p>
              </div>
            )}
          </div>

          {/* Coming soon note */}
          <div className="mt-16 text-center">
            <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30">
              <span className="font-space text-xs text-orange-400 font-semibold uppercase tracking-wider">Episodes launching soon — subscribe to get notified</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
