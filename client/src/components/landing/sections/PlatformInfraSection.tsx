import { Link } from "react-router-dom";
import { ArrowRight, FileText, Upload, Scale, Users, BarChart3, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const capabilities = [
  { icon: FileText, title: "Event Pages", description: "Custom event pages with tracks, rules, schedules, and branding for every event." },
  { icon: Upload, title: "Submissions", description: "Project submission pipeline with file uploads, team tagging, and deadline enforcement." },
  { icon: Scale, title: "Judging Dashboard", description: "Structured scoring rubrics, judge assignment workflows, and real-time aggregation." },
  { icon: Users, title: "Team Formation", description: "Built-in team matching, invite links, and participant management." },
  { icon: BarChart3, title: "Organizer Analytics", description: "Real-time metrics on registrations, submissions, engagement, and judge progress." },
  { icon: CreditCard, title: "Payments Infrastructure", description: "Sponsorship management, prize distribution, ticketing, and registration flows." },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function PlatformInfraSection() {
  return (
    <section className="py-24 sm:py-32 relative bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
      <div className="absolute bottom-20 left-[10%] w-72 h-72 bg-orange-500/5 rounded-full blur-[100px]" />
      <div className="absolute top-40 right-[5%] w-60 h-60 bg-gray-500/5 rounded-full blur-[80px]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-10 sm:mb-12"
        >
          <span className="font-space text-sm text-orange-400 tracking-wide font-medium mb-4 block uppercase">Platform</span>
          <h2 className="font-space text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
            Run events with Maximally infrastructure
          </h2>
          <p className="font-space text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl">
            The complete infrastructure layer for running serious builder events. From submissions to judging to payments — everything in one system.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mb-12"
        >
          {capabilities.map((cap, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="group relative p-6 bg-gray-900/40 border border-gray-800 transition-all duration-200 hover:border-orange-500/25 hover:shadow-xl hover:shadow-orange-500/[0.03]"
            >
              {/* Subtle top-left glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative z-10">
                <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 inline-block mb-4 group-hover:bg-orange-500/15 group-hover:border-orange-500/30 transition-all duration-200">
                  <cap.icon className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="font-space text-sm font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors duration-200">{cap.title}</h3>
                <p className="font-space text-xs text-gray-400 leading-relaxed">{cap.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
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
