import { Rocket, Shield, Star, Users } from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
  {
    icon: Rocket,
    title: "Build real products",
    description: "Work on real projects during competitions. Ship something that matters.",
  },
  {
    icon: Shield,
    title: "Get evaluated by experts",
    description: "Judges include experienced operators, founders, and engineers from top companies.",
  },
  {
    icon: Star,
    title: "Earn reputation",
    description: "Stand out through real competition results. Build a track record that speaks for itself.",
  },
  {
    icon: Users,
    title: "Meet serious builders",
    description: "Collaborate with ambitious builders globally. Find co-founders, teammates, and mentors.",
  },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function WhyBuildersJoinSection() {
  return (
    <section className="py-24 sm:py-32 relative bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
      <div className="absolute top-40 left-[5%] w-72 h-72 bg-orange-500/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <span className="font-space text-sm text-orange-400 tracking-wide font-medium mb-4 block uppercase">
            For Builders
          </span>
          <h2 className="font-space text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
            Why builders join Maximally
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto"
        >
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative p-6 bg-gray-900/40 border border-gray-800 transition-all duration-200 hover:border-orange-500/25 hover:shadow-xl hover:shadow-orange-500/[0.04]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative z-10">
                <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 inline-block mb-4 group-hover:bg-orange-500/15 group-hover:border-orange-500/30 transition-all duration-200">
                  <reason.icon className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="font-space text-sm font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors duration-200">
                  {reason.title}
                </h3>
                <p className="font-space text-xs text-gray-400 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
    </section>
  );
}

export default WhyBuildersJoinSection;
