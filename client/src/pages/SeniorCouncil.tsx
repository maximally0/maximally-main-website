import { useState } from "react";
import { ArrowRight, Search, Filter, Shield, Award, Users, BookOpen, Rocket, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const councilMembers = [
  {
    name: "Coming Soon",
    role: "AI Research Lead",
    org: "Top technology company",
    initials: "CS",
    domain: "AI",
    tags: ["AI", "CS"],
  },
  {
    name: "Coming Soon",
    role: "Founding Engineer",
    org: "YC-backed startup",
    initials: "CS",
    domain: "Engineering",
    tags: ["Engineering", "CS"],
  },
  {
    name: "Coming Soon",
    role: "Product Director",
    org: "Fortune 500 technology company",
    initials: "CS",
    domain: "Product",
    tags: ["Product", "CS"],
  },
  {
    name: "Coming Soon",
    role: "Serial Founder",
    org: "Multiple venture-backed companies",
    initials: "CS",
    domain: "Startups",
    tags: ["Startups", "CS"],
  },
  {
    name: "Coming Soon",
    role: "Biotech Researcher",
    org: "Leading research institution",
    initials: "CS",
    domain: "Biotech",
    tags: ["Biotech"],
  },
  {
    name: "Coming Soon",
    role: "Open Source Maintainer",
    org: "Major open source infrastructure project",
    initials: "CS",
    domain: "Open Source",
    tags: ["Open Source"],
  },
];

const domains = ["All", "AI", "Engineering", "Product", "Startups", "Biotech", "Open Source", "Computer Science"];

const admissionCriteria = [
  {
    icon: Rocket,
    title: "Leadership in Building or Shipping Products",
    items: [
      "Founder or early employee of a venture-backed startup",
      "Founding engineer or technical lead at a high-growth technology company",
      "Built a product used by 10,000+ users",
      "Led development of a product generating $100k+ in annual revenue",
      "Created widely adopted developer tools, APIs, or platforms",
    ],
  },
  {
    icon: BookOpen,
    title: "Recognized Technical or Research Contributions",
    items: [
      "Author of peer-reviewed research papers",
      "Published work in recognized conferences or journals",
      "Contributions to major open source projects",
      "Maintainer of repositories with 5,000+ stars",
      "Developer of infrastructure or frameworks widely used by builders",
    ],
  },
  {
    icon: Award,
    title: "Major Competition or Hackathon Achievement",
    items: [
      "Winner or finalist in major international hackathons",
      "Top placements in recognized engineering competitions",
      "Creator of projects that gained significant adoption during hackathons",
      "Organizer or judge for large-scale global competitions",
    ],
  },
  {
    icon: Users,
    title: "Industry Recognition or Thought Leadership",
    items: [
      "Invited speaker at major technical conferences",
      "Featured in credible media or industry publications",
      "Published technical writing with large developer readership",
      "Recognized community leadership in engineering or startup ecosystems",
    ],
  },
  {
    icon: Rocket,
    title: "Investment, Funding, or Startup Success",
    items: [
      "Founder of a company that raised venture funding",
      "Successful acquisition or exit",
      "Angel investor or advisor to multiple startups",
      "Builder of profitable technology businesses",
    ],
  },
  {
    icon: MessageSquare,
    title: "Mentorship and Ecosystem Contribution",
    items: [
      "Mentor or judge in major hackathons",
      "Contributor to technical communities or accelerators",
      "Operator supporting early-stage founders",
      "Creator of educational or developer resources used by builders",
    ],
  },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const SeniorCouncil = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");

  const filteredMembers = councilMembers.filter((m) => {
    const matchesDomain = selectedDomain === "All" || m.domain === selectedDomain || m.tags.includes(selectedDomain);
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.org.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <>
      <SEO
        title="Senior Council — Operators with Documented Extraordinary Achievement | Maximally"
        description="The Maximally Senior Council is a selective network of founders, researchers, engineers, and product leaders who evaluate, mentor, and set the standard across Maximally programs."
        keywords="senior council, extraordinary operators, hackathon judges, builder mentors, Maximally council"
        canonicalUrl="https://maximally.in/senior-council"
      />

      <div className="min-h-screen bg-black text-white">
        {/* ═══ HERO ═══ */}
        <section className="pt-32 sm:pt-40 pb-20 sm:pb-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 to-black" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[180px]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="font-space text-sm text-orange-400 tracking-[0.3em] font-medium mb-6 block uppercase">
                Senior Council
              </span>
              <h1 className="font-space text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                The Maximally<br />Senior Council.
              </h1>
              <p className="font-space text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mb-4">
                A council of operators who evaluate, mentor, and set the standard across Maximally programs.
              </p>
              <p className="font-space text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto">
                The Senior Council brings together founders, researchers, engineers, product leaders, and builders with documented extraordinary achievement in their fields.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══ WHAT IS THE SENIOR COUNCIL ═══ */}
        <section className="py-20 sm:py-28 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto mb-20"
            >
              <h2 className="font-space text-xl sm:text-2xl font-bold text-white mb-5">What is the Senior Council?</h2>
              <div className="space-y-4">
                <p className="font-space text-gray-400 text-sm sm:text-base leading-relaxed">
                  The Senior Council is Maximally's network of globally recognized operators. Members include founders, research scientists, engineers, product leaders, and open source builders whose work has produced meaningful impact in technology, research, or entrepreneurship.
                </p>
                <p className="font-space text-gray-400 text-sm sm:text-base leading-relaxed">
                  They bring real operating experience to Maximally programs — evaluating products, mentoring teams, and helping define what serious building looks like.
                </p>
                <p className="font-space text-gray-500 text-sm leading-relaxed">
                  The council is intentionally selective. Membership is granted only to individuals who demonstrate documented evidence of exceptional contribution to their field.
                </p>
              </div>
            </motion.div>

            {/* ═══ COUNCIL DIRECTORY ═══ */}
            <div className="max-w-5xl mx-auto mb-12">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <h2 className="font-space text-lg sm:text-xl font-bold text-white mb-1">Council Directory</h2>
                <p className="font-space text-xs text-gray-500">Search council members</p>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search council members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-gray-800 text-white font-space text-sm placeholder:text-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="w-4 h-4 text-gray-600 shrink-0" />
                  {domains.map((domain) => (
                    <button
                      key={domain}
                      onClick={() => setSelectedDomain(domain)}
                      className={`px-3 py-1.5 font-space text-xs font-medium border transition-all duration-200 ${
                        selectedDomain === domain
                          ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                          : "bg-gray-900/60 border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-400"
                      }`}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              </div>

              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    variants={fadeUp}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group p-6 bg-gray-900/50 border border-gray-800 hover:border-orange-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/[0.03]"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gray-800/80 border border-gray-700 flex items-center justify-center rounded-full flex-shrink-0 group-hover:border-orange-500/30 transition-colors">
                        <span className="font-space text-base font-bold text-gray-500 group-hover:text-orange-400 transition-colors">
                          {member.initials}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-space text-sm font-semibold text-white group-hover:text-orange-400 transition-colors">
                          {member.name}
                        </h3>
                        <p className="font-space text-xs text-gray-400 mt-0.5">
                          {member.role}
                        </p>
                        <p className="font-space text-xs text-gray-500 mt-0.5">
                          {member.org}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {member.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-800/80 border border-gray-700/60 text-[10px] font-space text-gray-400 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ THE STANDARD ═══ */}
        <section className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
          <div className="absolute top-40 right-[10%] w-60 h-60 bg-orange-500/5 rounded-full blur-[100px]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto mb-14"
            >
              <span className="font-space text-sm text-orange-400 tracking-wide font-medium mb-4 block uppercase">The Standard</span>
              <h2 className="font-space text-xl sm:text-2xl font-bold text-white mb-5">Admission Criteria</h2>
              <p className="font-space text-gray-400 text-sm sm:text-base leading-relaxed mb-3">
                Senior Council membership is reserved for operators who have demonstrated extraordinary ability and impact in their domain. Admission is based on documented achievements and evidence of contribution at scale.
              </p>
              <p className="font-space text-gray-500 text-sm leading-relaxed">
                Applicants typically meet multiple indicators of exceptional ability. No single metric guarantees admission. Each candidate is evaluated based on the total impact of their work.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto"
            >
              {admissionCriteria.map((category, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="group p-6 bg-gray-900/40 border border-gray-800 hover:border-orange-500/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-500/10 border border-orange-500/20 group-hover:bg-orange-500/15 transition-colors">
                      <category.icon className="w-4 h-4 text-orange-400" />
                    </div>
                    <h3 className="font-space text-sm font-semibold text-white">{category.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <span className="w-1 h-1 mt-2 bg-gray-600 rounded-full flex-shrink-0" />
                        <span className="font-space text-xs text-gray-400 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ PARTICIPATION & SELECTION ═══ */}
        <section className="py-20 sm:py-28 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="font-space text-lg font-semibold text-white mb-4">Participation Expectations</h3>
                <div className="space-y-3">
                  <p className="font-space text-sm text-gray-400 leading-relaxed">
                    Senior Council members actively contribute to the Maximally ecosystem. Members are expected to participate in at least one Maximally program per quarter as a judge, mentor, or evaluator.
                  </p>
                  <p className="font-space text-sm text-gray-500 leading-relaxed">
                    The council is designed to remain active, operational, and closely connected to the builders participating in Maximally programs.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="font-space text-lg font-semibold text-white mb-4">Selection Process</h3>
                <div className="space-y-3">
                  <p className="font-space text-sm text-gray-400 leading-relaxed">
                    Applications are reviewed periodically by the Maximally team and existing council members. Admission is granted only to individuals whose work demonstrates clear and documented impact in their field.
                  </p>
                  <p className="font-space text-sm text-gray-500 leading-relaxed">
                    Not all qualified applicants are admitted. Selectivity is intentional. The Senior Council exists to maintain the standard of evaluation across Maximally programs.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ APPLY CTA ═══ */}
        <section id="apply" className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/5 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[160px]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center"
            >
              <span className="font-space text-sm text-orange-400 tracking-wide font-medium mb-4 block uppercase">Apply for Review</span>
              <h2 className="font-space text-2xl sm:text-3xl font-bold text-white mb-4">
                Submit your profile for review.
              </h2>
              <p className="font-space text-gray-400 text-sm sm:text-base mb-10 leading-relaxed">
                If your work meets the criteria for exceptional contribution, you may submit your profile for review. Applications are reviewed quarterly. Not all qualified applicants are admitted — selectivity is intentional.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <a
                  href="https://tally.so/r/wvRYrv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                >
                  <span>Apply for Senior Council Review</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
        </section>

        <Footer />
      </div>
    </>
  );
};

export default SeniorCouncil;
