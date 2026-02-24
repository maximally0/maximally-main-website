import { useState } from "react";
import { ArrowRight, Search, Filter } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const councilMembers = [
  {
    name: "Coming Soon",
    role: "AI Research Lead",
    org: "Top Tech Company",
    initials: "CS",
    domain: "AI",
    bio: "Council member details will be published once the Senior Council is formally launched.",
  },
  {
    name: "Coming Soon",
    role: "Founding Engineer",
    org: "YC-Backed Startup",
    initials: "CS",
    domain: "Engineering",
    bio: "Council member details will be published once the Senior Council is formally launched.",
  },
  {
    name: "Coming Soon",
    role: "Product Director",
    org: "Fortune 500",
    initials: "CS",
    domain: "Product",
    bio: "Council member details will be published once the Senior Council is formally launched.",
  },
  {
    name: "Coming Soon",
    role: "Serial Founder",
    org: "Multiple Exits",
    initials: "CS",
    domain: "Startups",
    bio: "Council member details will be published once the Senior Council is formally launched.",
  },
  {
    name: "Coming Soon",
    role: "Biotech Researcher",
    org: "Research Institution",
    initials: "CS",
    domain: "Biotech",
    bio: "Council member details will be published once the Senior Council is formally launched.",
  },
  {
    name: "Coming Soon",
    role: "Open Source Maintainer",
    org: "Major OSS Project",
    initials: "CS",
    domain: "Open Source",
    bio: "Council member details will be published once the Senior Council is formally launched.",
  },
];

const domains = ["All", "AI", "Engineering", "Product", "Startups", "Biotech", "Open Source"];

const criteria = [
  "Track record of published work, patents, or recognized innovation",
  "Leadership and demonstrated expertise in their domain",
  "Commitment to active participation in at least one Maximally program per quarter",
  "Documented extraordinary contribution to their field",
];

const SeniorCouncil = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");

  const filteredMembers = councilMembers.filter((m) => {
    const matchesDomain = selectedDomain === "All" || m.domain === selectedDomain;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.org.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <>
      <SEO
        title="Senior Council - Maximally"
        description="The Maximally Senior Council — a directory of extraordinary operators who judge, mentor, and set the standard for serious building."
        keywords="senior council, mentors, judges, hackathon experts, industry leaders"
        canonicalUrl="https://maximally.in/senior-council"
      />

      <div className="min-h-screen bg-black text-white">
        <section className="pt-32 sm:pt-40 pb-16 sm:pb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 to-black" />
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-space text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                The Maximally Senior Council.
              </h1>
              <p className="font-space text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                A directory of extraordinary operators who judge, mentor, and set the standard for serious building.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto mb-16">
              <h2 className="font-space text-xl sm:text-2xl font-bold text-white mb-4">What is the Senior Council?</h2>
              <p className="font-space text-gray-400 text-sm sm:text-base leading-relaxed">
                The Senior Council is Maximally's network of operators who have achieved documented recognition in their fields — researchers, founders, engineers, and builders operating at the highest level globally. They bring that standard to every program they're involved in.
              </p>
            </div>

            <div className="max-w-5xl mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search council members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 text-white font-space text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="w-4 h-4 text-gray-500" />
                  {domains.map((domain) => (
                    <button
                      key={domain}
                      onClick={() => setSelectedDomain(domain)}
                      className={`px-3 py-1.5 font-space text-xs font-medium border transition-all ${
                        selectedDomain === domain
                          ? "bg-orange-500/20 border-orange-500/40 text-orange-300"
                          : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMembers.map((member, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gray-800 border border-gray-700 flex items-center justify-center rounded-full flex-shrink-0">
                        <span className="font-space text-base font-bold text-gray-400">
                          {member.initials}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-space text-sm font-semibold text-white">
                          {member.name}
                        </h3>
                        <p className="font-space text-xs text-gray-400">
                          {member.role}
                        </p>
                        <p className="font-space text-xs text-gray-500">
                          {member.org}
                        </p>
                      </div>
                    </div>
                    <span className="inline-block px-2 py-0.5 bg-gray-800 border border-gray-700 text-[10px] font-space text-gray-400 font-medium">
                      {member.domain}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 relative bg-gray-950/50">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-space text-xl sm:text-2xl font-bold text-white mb-4">The Standard</h2>
              <p className="font-space text-gray-400 text-sm sm:text-base leading-relaxed mb-8">
                Council members are selected based on demonstrated extraordinary contribution to their field. Membership is by review, not by application alone.
              </p>

              <h3 className="font-space text-lg font-semibold text-white mb-4">What we look for</h3>
              <ul className="space-y-3 mb-12">
                {criteria.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 mt-2 bg-orange-400 flex-shrink-0" />
                    <span className="font-space text-sm text-gray-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="apply" className="py-16 sm:py-20 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-space text-2xl sm:text-3xl font-bold text-white mb-4">
                Think you qualify?
              </h2>
              <p className="font-space text-gray-400 text-sm sm:text-base mb-8 leading-relaxed">
                Apply to be reviewed for the Senior Council. Reviews happen quarterly. Not everyone who applies gets in — that's the whole point.
              </p>
              <a
                href="https://tally.so/r/wvRYrv"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-space text-sm font-semibold transition-all duration-300"
              >
                <span>Apply for Review</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default SeniorCouncil;
