import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Upload,
  Scale,
  Users,
  LayoutDashboard,
  GitBranch,
  Trophy,
  ClipboardList,
  BarChart3,
  CreditCard,
  Globe,
  Check,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

/* ─── Animation helpers ─── */
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};
const pipelineStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const pipelineFade = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

/* ─── Data ─── */
const pipelineSteps = ["Competition", "Participants", "Submissions", "Evaluation", "Results"];

const coreModules = [
  { icon: FileText, title: "Competition Pages", desc: "Structured pages with tracks, rules, timelines, eligibility, and branding." },
  { icon: ClipboardList, title: "Applications & Registrations", desc: "Customizable forms for participant applications with team or individual support." },
  { icon: Upload, title: "Artifact Submissions", desc: "Accept projects, pitch decks, research papers, designs, or prototypes." },
  { icon: GitBranch, title: "Multi-Stage Workflows", desc: "Run competitions across multiple rounds — applications, submissions, review, finals." },
  { icon: Scale, title: "Evaluation Engine", desc: "Assign judges, score with structured rubrics, and aggregate results automatically." },
  { icon: Trophy, title: "Results & Leaderboards", desc: "Automatic rankings, winner selection, and public result pages." },
  { icon: Users, title: "Participant Management", desc: "Manage individuals, teams, startups, or organizations in one system." },
  { icon: LayoutDashboard, title: "Organizer Dashboard", desc: "Track registrations, submissions, judging progress, and results in real time." },
];

const organizerTools = [
  { icon: BarChart3, title: "Analytics", desc: "Real-time metrics on registrations, submissions, engagement, and judge progress." },
  { icon: Globe, title: "Public Pages", desc: "Auto-generated competition pages, result pages, and project galleries." },
  { icon: CreditCard, title: "Payments", desc: "Sponsorship management, prize distribution, and registration fee collection.", soon: true },
];

const competitionTypes = [
  "Hackathons", "Startup Competitions", "Innovation Challenges", "Design Contests",
  "Research Competitions", "Developer Challenges", "Student Competitions", "Grant Programs",
  "AI Competitions", "Game Jams", "Open Innovation Programs", "Science Fairs",
];

const comparisonRows = [
  { us: "Submission-based competitions", them: "Meetups" },
  { us: "Structured judging workflows", them: "Conferences" },
  { us: "Rubric-based evaluation", them: "Webinars" },
  { us: "Automated rankings & results", them: "Networking events" },
];

export default function Platform() {
  return (
    <>
      <SEO
        title="Platform — Competition Infrastructure | Maximally"
        description="The infrastructure behind serious competitions. From applications and submissions to judging and results — everything needed to run high-quality competitions."
        canonicalUrl="https://maximally.in/platform"
      />

      <div className="min-h-screen bg-black text-white relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-950/10 via-transparent to-gray-950/15" />

        {/* ═══════════════════════════════════════════
            HEADER
        ═══════════════════════════════════════════ */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-32 sm:pt-40 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <span className="font-space text-sm text-orange-400 tracking-[0.2em] font-medium mb-4 block uppercase">Platform</span>
            <h1 className="font-space text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              The infrastructure behind<br />serious competitions
            </h1>
            <p className="font-space text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Everything needed to run and participate in high-quality competitions. From applications and submissions to judging and results.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/host-hackathon" className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space text-sm font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40">
                  <span>Host a Competition</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/organizer/apply" className="flex items-center justify-center gap-3 px-8 py-4 border border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-space text-sm font-semibold transition-all duration-300">
                  Organizer Dashboard
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════
            SYSTEM FLOW
        ═══════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 relative">
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <p className="font-space text-xs text-gray-500 tracking-wide uppercase">How it works</p>
            </motion.div>

            <motion.div
              variants={pipelineStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-3xl mx-auto"
            >
              {pipelineSteps.map((step, i) => (
                <motion.span key={i} variants={pipelineFade} className="flex items-center gap-3 sm:gap-4">
                  <span className={`px-4 py-2.5 border font-space text-sm font-medium ${
                    i === 0 || i === pipelineSteps.length - 1
                      ? "border-orange-500/50 text-orange-400 bg-orange-500/5"
                      : "border-gray-700 text-gray-300 bg-gray-900/50"
                  }`}>
                    {step}
                  </span>
                  {i < pipelineSteps.length - 1 && (
                    <span className="text-gray-600 font-space text-sm">→</span>
                  )}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CORE INFRASTRUCTURE
        ═══════════════════════════════════════════ */}
        <section className="py-28 sm:py-36 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
          <div className="absolute bottom-20 left-[10%] w-72 h-72 bg-orange-500/5 rounded-full blur-[100px]" />
          <div className="absolute top-40 right-[5%] w-60 h-60 bg-gray-500/5 rounded-full blur-[80px]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <span className="font-space text-sm text-orange-400 tracking-wide font-medium mb-3 block uppercase">Core Infrastructure</span>
              <h2 className="font-space text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">Competition Modules</h2>
              <p className="font-space text-sm text-gray-400 max-w-xl mx-auto">The building blocks for running any competition.</p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto"
            >
              {coreModules.map((mod, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative p-6 bg-gray-900/40 border border-gray-800 transition-all duration-200 hover:border-orange-500/25 hover:shadow-xl hover:shadow-orange-500/[0.04]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 inline-block mb-4 group-hover:bg-orange-500/15 group-hover:border-orange-500/30 transition-all duration-200">
                      <mod.icon className="w-5 h-5 text-orange-400" />
                    </div>
                    <h3 className="font-space text-sm font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors duration-200">{mod.title}</h3>
                    <p className="font-space text-xs text-gray-400 leading-relaxed">{mod.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            ORGANIZER TOOLS
        ═══════════════════════════════════════════ */}
        <section className="py-28 sm:py-36 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <span className="font-space text-sm text-gray-500 tracking-wide font-medium mb-3 block uppercase">Organizer Tools</span>
              <h2 className="font-space text-2xl sm:text-3xl font-bold text-white mb-3">Built for Organizers</h2>
              <p className="font-space text-sm text-gray-400 max-w-xl mx-auto">Tools to manage, analyze, and grow your competitions.</p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto"
            >
              {organizerTools.map((tool, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -5 }}
                  className="group relative p-6 bg-gray-900/40 border border-gray-800 transition-all duration-200 hover:border-orange-500/25 hover:shadow-xl hover:shadow-orange-500/[0.04]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 inline-block mb-4 group-hover:bg-orange-500/15 group-hover:border-orange-500/30 transition-all duration-200">
                      <tool.icon className="w-5 h-5 text-orange-400" />
                    </div>
                    <h3 className="font-space text-sm font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors duration-200">{tool.title}</h3>
                    <p className="font-space text-xs text-gray-400 leading-relaxed">{tool.desc}</p>
                    {tool.soon && (
                      <span className="inline-block mt-3 px-2 py-0.5 bg-gray-800 border border-gray-700 text-[10px] font-space text-gray-500 font-medium">Coming Soon</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            COMPETITIONS POWERED (marquee + chips)
        ═══════════════════════════════════════════ */}
        <section className="py-20 sm:py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10 mb-8">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-space text-xs text-gray-500 tracking-wide uppercase text-center mb-6"
            >
              Competitions powered by Maximally
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mb-10"
          >
            <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
            <Marquee speed={25} gradient={false} pauseOnHover>
              {competitionTypes.map((c, i) => (
                <span key={i} className="font-space text-sm text-gray-400 hover:text-orange-400 transition-colors duration-300 mx-5 sm:mx-7 whitespace-nowrap">
                  {c}
                  <span className="text-gray-700/60 ml-5 sm:ml-7">·</span>
                </span>
              ))}
            </Marquee>
          </motion.div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto"
            >
              {competitionTypes.map((type, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="px-4 py-2 bg-gray-900/50 border border-gray-800 font-space text-xs text-gray-400 hover:border-orange-500/30 hover:text-gray-300 transition-all duration-200"
                >
                  {type}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            WHAT THIS IS NOT (comparison)
        ═══════════════════════════════════════════ */}
        <section className="py-28 sm:py-36 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
          <div className="absolute top-40 left-[5%] w-60 h-60 bg-orange-500/5 rounded-full blur-[80px]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center mb-14"
            >
              <h2 className="font-space text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                Built for competitions — not generic events
              </h2>
              <p className="font-space text-sm text-gray-400 max-w-lg mx-auto">
                Maximally is designed for programs where participants submit work and judges evaluate it.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="grid grid-cols-2 gap-px mb-1">
                <div className="p-3 bg-orange-500/5 border border-orange-500/20">
                  <span className="font-space text-xs text-orange-400 font-semibold uppercase tracking-wider">Maximally</span>
                </div>
                <div className="p-3 bg-gray-900/40 border border-gray-800">
                  <span className="font-space text-xs text-gray-500 font-semibold uppercase tracking-wider">Generic Event Platforms</span>
                </div>
              </div>
              {comparisonRows.map((row, i) => (
                <div key={i} className="grid grid-cols-2 gap-px mb-px">
                  <div className="flex items-center gap-2 p-3 bg-gray-900/20 border-x border-gray-800/30">
                    <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="font-space text-sm text-gray-300">{row.us}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-900/20 border-x border-gray-800/30">
                    <X className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                    <span className="font-space text-sm text-gray-500">{row.them}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FINAL CTA
        ═══════════════════════════════════════════ */}
        <section className="py-28 sm:py-36 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/5 to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="font-space text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5">
                Ready to run your competition?
              </h2>
              <p className="font-space text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed mb-12">
                Infrastructure for serious competitions. Launch in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/host-hackathon" className="group flex items-center justify-center gap-3 px-8 py-4 sm:py-5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space text-sm font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40">
                    <span>Host a Competition</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/events" className="flex items-center justify-center gap-3 px-8 py-4 sm:py-5 border border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-space text-sm font-semibold transition-all duration-300">
                    Explore Events
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
        </section>

        <Footer />
      </div>
    </>
  );
}
