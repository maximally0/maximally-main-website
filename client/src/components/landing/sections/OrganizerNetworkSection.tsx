import { Link } from "react-router-dom";
import { ArrowRight, Network } from "lucide-react";
import { motion } from "framer-motion";

export function OrganizerNetworkSection() {
  return (
    <section className="py-24 sm:py-32 relative bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
      <div className="absolute bottom-20 right-[15%] w-64 h-64 bg-orange-500/5 rounded-full blur-[80px]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-3 bg-orange-500/10 border border-orange-500/20 inline-block mb-6"
          >
            <Network className="w-6 h-6 text-orange-400" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="font-space text-sm text-orange-400 tracking-wide font-medium mb-4 block uppercase">Network</span>
            <h2 className="font-space text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
              The Organizer Federation
            </h2>
            <p className="font-space text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              The Maximally Federation of Hackathon Organizers (MFHOP) is the network of serious hackathon organizers. Shared infrastructure, collective credibility, and a community solving the same problems.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/mfhop"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space text-sm font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02]"
            >
              <span>Join the Federation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/host-hackathon"
              className="group flex items-center justify-center gap-3 px-8 py-4 border border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-space text-sm font-semibold transition-all duration-300"
            >
              <span>Host on Maximally</span>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
    </section>
  );
}

export default OrganizerNetworkSection;
