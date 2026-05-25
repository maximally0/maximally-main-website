import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Users } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const stages = ["All", "Early Stage", "Growth Stage", "Enterprise", "Solo Builder"];
const teamSizes = ["All Sizes", "1-10", "11-50", "51-100", "101-250", "251+"];

const stories = [
  { id: 1, company: "Supabase", title: "Building Supabase: Open Source at Scale", description: "How we went from a weekend hack to a category-defining open source platform.", founder: "Ant Wilson", founderRole: "Co-founder & CEO, Supabase", stage: "Growth Stage", teamSize: "51-100", founded: "2020" },
  { id: 2, company: "Linear", title: "Linear: Obsessing Over Developer Experience", description: "The principles and trade-offs behind building the issue tracker developers love.", founder: "Karri Saarinen", founderRole: "Co-founder & CEO, Linear", stage: "Growth Stage", teamSize: "11-50", founded: "2019" },
  { id: 3, company: "Vercel", title: "Vercel: From Next.js to Full-Stack Platform", description: "How we expanded beyond frameworks to become the platform for frontend developers.", founder: "Guillermo Rauch", founderRole: "CEO, Vercel", stage: "Enterprise", teamSize: "251+", founded: "2015" },
  { id: 4, company: "Retool", title: "Retool: Empowering Builders in Every Company", description: "Why internal tools are the new apps — and how we're making them easy to build.", founder: "David Hsu", founderRole: "CEO, Retool", stage: "Growth Stage", teamSize: "101-250", founded: "2017" },
  { id: 5, company: "Railway", title: "Railway: Simple Infrastructure for Modern Apps", description: "Building a better developer experience for deploying and scaling apps.", founder: "Nadia Eghbal", founderRole: "Co-founder, Railway", stage: "Early Stage", teamSize: "11-50", founded: "2020" },
  { id: 6, company: "Cal.com", title: "Cal.com: Open Source Scheduling for Everyone", description: "Why we bet on open source and how it became our distribution moat.", founder: "Peer Richelsen", founderRole: "Co-founder, Cal.com", stage: "Early Stage", teamSize: "11-50", founded: "2021" },
];

const featuredStory = {
  company: "Basecamp",
  title: "Basecamp: Sustained by Simplicity",
  description: "Inside Basecamp's philosophy of focus, sustainability, and building products that last.",
  founder: "Jason Fried",
  founderRole: "Co-founder, Basecamp",
};

const popularTopics = [
  { name: "Product Strategy", count: 12 },
  { name: "Developer Experience", count: 11 },
  { name: "Team & Culture", count: 10 },
  { name: "Scaling", count: 9 },
  { name: "Open Source", count: 6 },
];

export default function ResourcesStories() {
  const [activeStage, setActiveStage] = useState("All");
  const [activeTeamSize, setActiveTeamSize] = useState("All Sizes");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = stories.filter(s => {
    const matchesStage = activeStage === "All" || s.stage === activeStage;
    const matchesSize = activeTeamSize === "All Sizes" || s.teamSize === activeTeamSize;
    const matchesSearch = !searchTerm || s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesSize && matchesSearch;
  });

  return (
    <>
      <SEO title="Builder Stories — Profiles of Builders Who Shipped | Maximally" description="Real stories from the builders behind the products. Lessons, challenges, and wins from the journey." canonicalUrl="https://maximally.in/resources/stories" />
      <div className="min-h-screen bg-black text-white pt-20 sm:pt-24">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 pb-20">
          {/* Sub-nav */}
          <div className="flex items-center gap-6 border-b border-gray-800 mb-12 pt-8">
            {[
              { label: "Blog", href: "/blog" },
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
              {/* Header */}
              <div className="mb-10">
                <span className="font-space text-sm text-orange-400 tracking-wide uppercase block mb-3">Builder Stories</span>
                <h1 className="font-space text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight max-w-xl">
                  Profiles of builders who shipped through Maximally.
                </h1>
                <p className="font-space text-base text-gray-400 max-w-lg">
                  Real stories from the builders behind the products. Lessons, challenges, and wins from the journey.
                </p>
              </div>

              {/* Search */}
              <div className="relative max-w-md mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search builder stories..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 text-white font-space text-sm placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50" />
              </div>

              {/* Stage filters */}
              <div className="mb-4">
                <p className="font-space text-xs text-gray-500 mb-2">All builder stories</p>
                <div className="flex flex-wrap gap-2">
                  {stages.map(stage => (
                    <button key={stage} onClick={() => setActiveStage(stage)} className={`px-4 py-2 font-space text-xs font-medium border transition-all ${activeStage === stage ? "bg-orange-500/15 border-orange-500/40 text-orange-400" : "bg-gray-900/60 border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-600"}`}>
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stories list */}
              <div className="space-y-4 mt-8">
                {filtered.map(story => (
                  <div key={story.id} className="group flex items-start gap-5 p-5 bg-gray-900/40 border border-gray-800 hover:border-orange-500/25 transition-all">
                    <div className="w-16 h-16 bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 group-hover:border-orange-500/30 transition-colors">
                      <span className="font-space text-[10px] text-gray-400 font-semibold">{story.company.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-space text-base font-semibold text-white group-hover:text-orange-400 transition-colors">{story.title}</h3>
                      <p className="font-space text-sm text-gray-400 mt-1 line-clamp-2">{story.description}</p>
                      <div className="flex items-center gap-3 mt-2 font-space text-xs text-gray-500">
                        <span>{story.founder}</span>
                        <span>•</span>
                        <span>{story.founderRole}</span>
                      </div>
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 text-right">
                      <span className="font-space text-xs text-orange-400">{story.stage}</span>
                      <span className="font-space text-[10px] text-gray-500">Team Size</span>
                      <span className="font-space text-xs text-gray-400">{story.teamSize}</span>
                      <span className="font-space text-[10px] text-gray-500">Founded</span>
                      <span className="font-space text-xs text-gray-400">{story.founded}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-orange-400 transition-colors shrink-0 mt-1" />
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-16">
                    <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                    <p className="font-space text-gray-500">No stories found.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Filter by stage */}
              <div className="p-5 bg-gray-900/40 border border-gray-800">
                <h3 className="font-space text-sm font-semibold text-white mb-4">Filter by</h3>
                <p className="font-space text-xs text-gray-500 mb-2">Stage</p>
                <div className="space-y-1.5">
                  {stages.map(stage => (
                    <button key={stage} onClick={() => setActiveStage(stage)} className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${activeStage === stage ? "text-orange-400" : "text-gray-400 hover:text-gray-300"}`}>
                      <span className="font-space text-xs">{stage}</span>
                      <span className="font-space text-xs text-orange-400 font-semibold">{stories.filter(s => stage === "All" || s.stage === stage).length}</span>
                    </button>
                  ))}
                </div>
                <p className="font-space text-xs text-gray-500 mt-4 mb-2">Team size</p>
                <div className="space-y-1.5">
                  {teamSizes.map(size => (
                    <button key={size} onClick={() => setActiveTeamSize(size)} className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${activeTeamSize === size ? "text-orange-400" : "text-gray-400 hover:text-gray-300"}`}>
                      <span className="font-space text-xs">{size}</span>
                      <span className="font-space text-xs text-gray-500">{stories.filter(s => size === "All Sizes" || s.teamSize === size).length}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured story */}
              <div className="p-5 bg-gray-900/40 border border-gray-800">
                <h3 className="font-space text-sm font-semibold text-white mb-4">Featured story</h3>
                <div className="w-full h-28 bg-gray-800 border border-gray-700 flex items-center justify-center mb-4">
                  <span className="font-space text-xs text-gray-500">{featuredStory.company}</span>
                </div>
                <h4 className="font-space text-sm font-semibold text-white">{featuredStory.title}</h4>
                <p className="font-space text-xs text-gray-400 mt-1 line-clamp-3">{featuredStory.description}</p>
                <div className="flex items-center gap-2 mt-2 font-space text-xs text-gray-500">
                  <span>{featuredStory.founder}</span>
                  <span>•</span>
                  <span>{featuredStory.founderRole}</span>
                </div>
                <button className="flex items-center gap-1 mt-3 font-space text-xs text-orange-400 hover:text-orange-300 transition-colors">
                  Read story <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Popular topics */}
              <div className="p-5 bg-gray-900/40 border border-gray-800">
                <h3 className="font-space text-sm font-semibold text-white mb-4">Popular topics</h3>
                <div className="space-y-2.5">
                  {popularTopics.map(topic => (
                    <div key={topic.name} className="flex items-center justify-between">
                      <span className="font-space text-xs text-gray-400">{topic.name}</span>
                      <span className="font-space text-xs text-gray-500">{topic.count}</span>
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
              <span className="font-space text-xs text-orange-400 font-semibold uppercase tracking-wider">Builder stories launching soon — submit yours</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
