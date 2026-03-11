import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";

const competitions = [
  "Hackathons", "Startup Competitions", "Innovation Challenges", "AI Competitions",
  "Design Contests", "Research Competitions", "Developer Challenges", "Student Competitions",
  "Grant Programs", "Game Jams", "Open Innovation Programs", "Science Fairs",
];

export function CompetitionMarqueeSection() {
  return (
    <section className="py-10 sm:py-14 relative bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        <Marquee speed={25} gradient={false} pauseOnHover>
          {competitions.map((c, i) => (
            <span key={i} className="font-space text-sm text-gray-500 hover:text-orange-400 transition-colors duration-300 mx-5 sm:mx-7 whitespace-nowrap">
              {c}
              <span className="text-gray-700/60 ml-5 sm:ml-7">·</span>
            </span>
          ))}
        </Marquee>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
    </section>
  );
}

export default CompetitionMarqueeSection;
