import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function JoinEcosystemCTA() {
  return (
    <section className="py-28 sm:py-36 relative bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[160px]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-space text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5">
            Ready to build and compete?
          </h2>
          <p className="font-space text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed mb-12">
            Join serious competitions, ship real projects, and get evaluated by top operators.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/events"
                className="group flex items-center justify-center gap-3 px-8 py-4 sm:py-5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space text-sm font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/host-hackathon"
                className="flex items-center justify-center gap-3 px-8 py-4 sm:py-5 border border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-space text-sm font-semibold transition-all duration-300"
              >
                Host a Competition
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
    </section>
  );
}

export default JoinEcosystemCTA;
