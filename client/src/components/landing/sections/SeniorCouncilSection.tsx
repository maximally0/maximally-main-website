import { Link } from "react-router-dom";
import { ArrowRight, Shield, Network } from "lucide-react";
import { motion } from "framer-motion";

const councilMembers = [
  { name: "Coming Soon", role: "AI Research Lead", org: "Top Tech Company", initials: "CS", domain: "AI" },
  { name: "Coming Soon", role: "Founding Engineer", org: "YC-Backed Startup", initials: "CS", domain: "Engineering" },
  { name: "Coming Soon", role: "Product Director", org: "Fortune 500", initials: "CS", domain: "Product" },
  { name: "Coming Soon", role: "Serial Founder", org: "Multiple Exits", initials: "CS", domain: "Startups" },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function SeniorCouncilSection() {
  return (
    <section className="py-24 sm:py-32 relative bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
      <div className="absolute top-40 right-[5%] w-80 h-80 bg-orange-500/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Split layout: text left, cards right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          {/* Left — text + network cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-space text-sm text-orange-400 tracking-wide font-medium mb-4 block uppercase">
              The Network
            </span>
            <h2 className="font-space text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
              Evaluated by people who build the future
            </h2>
            <p className="font-space text-base text-gray-400 leading-relaxed mb-8">
              The people layer of the Maximally ecosystem. Operators who judge, organizers who run events, and builders who ship.
            </p>

            {/* Two network entry cards */}
            <div className="space-y-3 mb-8">
              <Link
                to="/senior-council"
                className="group flex items-start gap-4 p-4 bg-gray-900/50 border border-gray-800 hover:border-orange-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/5"
              >
                <div className="p-2 bg-orange-500/10 border border-orange-500/20 shrink-0 group-hover:bg-orange-500/20 transition-colors">
                  <Shield className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <span className="font-space text-sm font-semibold text-white group-hover:text-orange-400 transition-colors block">Senior Council</span>
                  <span className="font-space text-xs text-gray-500 leading-relaxed">Directory of operators who judge Maximally programs.</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all mt-1 ml-auto shrink-0" />
              </Link>

              <Link
                to="/mfhop"
                className="group flex items-start gap-4 p-4 bg-gray-900/50 border border-gray-800 hover:border-orange-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/5"
              >
                <div className="p-2 bg-orange-500/10 border border-orange-500/20 shrink-0 group-hover:bg-orange-500/20 transition-colors">
                  <Network className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <span className="font-space text-sm font-semibold text-white group-hover:text-orange-400 transition-colors block">Organizer Federation</span>
                  <span className="font-space text-xs text-gray-500 leading-relaxed">Network of serious hackathon organizers (MFHOP).</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all mt-1 ml-auto shrink-0" />
              </Link>
            </div>

            <Link
              to="/network"
              className="group inline-flex items-center gap-2 font-space text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200"
            >
              <span>View the full Network</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right — council member cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 gap-4"
          >
            {councilMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="p-5 bg-gray-900/60 border border-gray-800 text-center transition-all duration-200 hover:border-orange-500/20 hover:shadow-lg hover:shadow-orange-500/5"
              >
                <div className="w-14 h-14 mx-auto mb-3 bg-gray-800 border border-gray-700 flex items-center justify-center rounded-full">
                  <span className="font-space text-base font-bold text-gray-400">{member.initials}</span>
                </div>
                <h3 className="font-space text-sm font-semibold text-white mb-0.5">{member.name}</h3>
                <p className="font-space text-[11px] text-gray-400 mb-0.5">{member.role}</p>
                <p className="font-space text-[11px] text-gray-500">{member.org}</p>
                <span className="inline-block mt-2.5 px-2 py-0.5 bg-gray-800 border border-gray-700 text-[10px] font-space text-gray-400 font-medium">{member.domain}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
    </section>
  );
}

export default SeniorCouncilSection;
