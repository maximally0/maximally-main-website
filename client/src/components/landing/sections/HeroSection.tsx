import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Marquee from "react-fast-marquee";

const credibilityCompanies = [
  "Google", "Microsoft", "Meta", "OpenAI", "DeepMind", "Y Combinator",
  "AWS", "Intuit", "Visa", "Salesforce", "Atlassian", "Replit",
];

export function HeroSection() {
  return (
    <section className="min-h-screen relative flex items-center pt-20 sm:pt-28 pb-16 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-orange-950/15 via-transparent to-gray-950/20" />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-orange-500/8 rounded-full blur-[200px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-gray-500/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-space text-sm text-orange-400 tracking-[0.3em] font-medium mb-6 block uppercase"
          >
            MAXIMALLY
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="font-space text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 sm:mb-10 leading-[1.1] tracking-tight px-2"
          >
            <span className="block text-white">Serious competitions</span>
            <span className="block mt-2 sm:mt-3">
              <span className="text-white">for </span>
              <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                <TypeAnimation
                  sequence={[
                    "builders.", 2200,
                    "founders.", 2200,
                    "developers.", 2200,
                    "designers.", 2200,
                    "creatives.", 2200,
                    "students.", 2200,
                  ]}
                  wrapper="span"
                  speed={40}
                  repeat={Infinity}
                  cursor={true}
                />
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-space leading-relaxed mb-10 sm:mb-14 px-4"
          >
            Where builders compete, ship real products, and get evaluated by top operators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center px-4"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/events"
                className="group flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                data-testid="button-explore-events"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/host-hackathon"
                className="group flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-transparent border border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-space text-sm sm:text-base font-semibold transition-all duration-300"
                data-testid="button-host-event"
              >
                <span>Host a Competition</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Credibility marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-16 sm:mt-20"
          >
            <p className="font-space text-xs text-gray-500 tracking-wide mb-5 uppercase text-center">
              Judges, mentors, and partners from
            </p>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
              <Marquee speed={25} gradient={false} pauseOnHover>
                {credibilityCompanies.map((company, i) => (
                  <span key={i} className="flex items-center mx-4 sm:mx-6">
                    <span className="font-space text-base sm:text-lg text-gray-500 font-semibold tracking-wide hover:text-orange-400 transition-colors duration-300 whitespace-nowrap">
                      {company}
                    </span>
                    <span className="text-gray-700 ml-4 sm:ml-6">&bull;</span>
                  </span>
                ))}
              </Marquee>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
