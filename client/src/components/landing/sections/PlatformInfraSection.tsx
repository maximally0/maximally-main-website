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
} from "lucide-react";
import { motion } from "framer-motion";

const pipelineSteps = ["Competition", "Participants", "Submissions", "Evaluation", "Results"];

const modules = [
  { icon: FileText, title: "Competition Pages", description: "Structured pages with tracks, rules, eligibility, and schedules." },
  { icon: ClipboardList, title: "Applications & Registrations", description: "Collect participant applications and manage teams or individuals." },
  { icon: Upload, title: "Artifact Submissions", description: "Submit projects, pitch decks, designs, or research papers." },
  { icon: Scale, title: "Evaluation Engine", description: "Structured judging with rubrics and score aggregation." },
  { icon: GitBranch, title: "Multi-Stage Workflows", description: "Run competitions with multiple rounds and advancement." },
  { icon: Trophy, title: "Results & Leaderboards", description: "Automatic rankings, winners, and public result pages." },
  { icon: Users, title: "Participant Management", description: "Manage builders, teams, startups, and organizations." },
  { icon: LayoutDashboard, title: "Organizer Dashboard", description: "Track submissions, judging progress, and results." },
];

const competitionTypes = [
  "Hackathons", "Startup Competitions", "Innovation Challenges", "Design Contests",
  "Research Competitions", "Developer Challenges", "Student Competitions", "Grant Programs",
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};
const pipelineStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const pipelineFade = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function PlatformInfraSection() {
  return (
    <section className="py-28 sm:py-36 relative bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
      <div className="absolute bottom-20 left-[10%] w-72 h-72 bg-orange-500/5 rounded-full blur-[100px]" />
      <div className="absolute top-40 right-[5%] w-60 h-60 bg-gray-500/5 rounded-full blur-[80px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/3 rounded-full blur-[200px]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16 sm:mb-20"
        >
          <span className="font-space text-sm text-orange-400 tracking-wide font-medium mb-4 block uppercase">Infrastructure</span>
          <h2 className="font-space text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
            The infrastructure behind serious competitions
          </h2>
          <p className="font-space text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Everything needed to run and participate in high-quality competitions.
          </p>
        </motion.div>

        {/* ── Part A: System Flow Diagram ── */}
        <motion.div
          variants={pipelineStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-20 sm:mb-24 max-w-3xl mx-auto"
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

        {/* ── Part B: Infrastructure Modules ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto mb-20 sm:mb-24"
        >
          {modules.map((mod, i) => (
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
                <h3 className="font-space text-sm font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors duration-200">
                  {mod.title}
                </h3>
                <p className="font-space text-xs text-gray-400 leading-relaxed">{mod.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Part C: Competitions Powered ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <p className="font-space text-xs text-gray-500 tracking-wide uppercase text-center mb-6">
            Competitions powered by Maximally
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {competitionTypes.map((type, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="px-4 py-2 bg-gray-900/50 border border-gray-800 font-space text-xs text-gray-400 hover:border-orange-500/30 hover:text-gray-300 transition-all duration-200"
              >
                {type}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Platform link */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center"
        >
          <Link
            to="/platform"
            className="group inline-flex items-center gap-2 px-6 py-3 border border-gray-700 hover:border-orange-500/60 text-gray-300 hover:text-white font-space text-sm font-medium transition-all duration-200"
          >
            <span>Explore the Platform</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
    </section>
  );
}

export default PlatformInfraSection;
