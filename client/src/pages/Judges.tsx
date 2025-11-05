import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Users, Target, Award, Globe, Rocket, CheckCircle2, ArrowRight, Star, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Judges = () => {
  const [floatingPixels, setFloatingPixels] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  useEffect(() => {
    const pixels = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setFloatingPixels(pixels);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <SEO
        title="Become a Maximally Judge - The Standard of Innovation"
        description="Join the world's top 0.1% of innovators mentoring and evaluating the next generation of builders. Become a Maximally Judge — the global standard of innovation credibility."
        keywords="innovation judges, hackathon judges, startup mentors, tech mentors, builder community, innovation evaluation"
      />

      {/* Floating Pixels Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {floatingPixels.map((pixel) => (
          <motion.div
            key={pixel.id}
            className="absolute w-2 h-2 bg-maximally-red"
            style={{
              left: `${pixel.x}%`,
              top: `${pixel.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: pixel.delay,
            }}
          />
        ))}
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-maximally-red/20 via-black to-maximally-yellow/10 z-0" />
        
        {/* Faint M watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 z-0">
          <div className="font-press-start text-[40vw] text-maximally-red">M</div>
        </div>

        <div className="container mx-auto px-4 py-24 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="minecraft-block bg-maximally-red text-black px-6 py-3 inline-block mb-8">
              <span className="font-press-start text-sm">⚡ THE STANDARD OF JUDGMENT</span>
            </div>

            <h1 className="font-press-start text-3xl md:text-5xl lg:text-6xl mb-8 text-white leading-tight">
              <span className="text-maximally-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                The Builders of the Future
              </span>
              <br />
              <span className="text-white">
                Deserve Judges Who've Built Before.
              </span>
            </h1>

            <p className="text-gray-300 text-lg md:text-xl font-jetbrains max-w-4xl mx-auto leading-relaxed mb-12">
              Join the world's top 0.1% of innovators mentoring and evaluating the next generation of builders.
              <br />
              <span className="text-maximally-yellow font-bold">Become a Maximally Judge — the global standard of innovation credibility.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://tally.so/r/wkjbE9"
                target="_blank"
                rel="noopener noreferrer"
                className="minecraft-block bg-maximally-yellow text-black px-8 py-4 font-press-start text-sm hover:scale-105 transition-all duration-300 hover:bg-maximally-red flex items-center gap-2"
              >
                <Star className="h-5 w-5" />
                APPLY TO BECOME A JUDGE
              </a>
              <Link
                to="#directory"
                className="pixel-card border-2 border-white text-white px-8 py-4 font-press-start text-sm hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2"
              >
                <Users className="h-5 w-5" />
                VIEW VERIFIED JUDGES
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY THIS EXISTS SECTION */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="text-center font-press-start text-6xl text-maximally-red"
          >
            CHAOS INNOVATION BIAS JUDGMENT CREDIBILITY
          </motion.div>
        </div>

        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-press-start text-3xl md:text-5xl mb-8 text-white">
              <span className="text-maximally-red">Innovation evolved.</span>
              <br />
              Judging didn't.
            </h2>

            <div className="max-w-4xl mx-auto space-y-6 font-jetbrains text-lg md:text-xl text-gray-300 leading-relaxed">
              <p>
                Every hackathon, competition, and challenge celebrates innovation —
              </p>
              <p className="text-white font-bold">
                but the system that evaluates it is broken.
              </p>
              <p className="text-maximally-yellow font-bold text-2xl">
                We're fixing that.
              </p>
              <p className="mt-8">
                Maximally Judges is building the world's first <span className="text-maximally-red font-bold">identity and credibility layer</span> for judging innovation — a verified network of builders, founders, engineers, and thinkers who define what "good" means in the age of creation.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT MAKES A MAXIMALLY JUDGE */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-maximally-red/10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-press-start text-3xl md:text-5xl mb-4 text-white">
              <span className="text-maximally-red">Not anyone</span> can judge innovation.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Rocket className="h-12 w-12" />,
                title: "Built Something Real.",
                description: "People who've shipped, scaled, or led something that mattered.",
                bgClass: "bg-maximally-red",
              },
              {
                icon: <Users className="h-12 w-12" />,
                title: "Teach and Mentor.",
                description: "Builders who lift others with insight, not just opinion.",
                bgClass: "bg-maximally-yellow",
              },
              {
                icon: <Target className="h-12 w-12" />,
                title: "Think Systems, Not Scores.",
                description: "Evaluation rooted in frameworks, not bias.",
                bgClass: "bg-green-500",
              },
              {
                icon: <Award className="h-12 w-12" />,
                title: "Represent the 0.1%.",
                description: "The best of the best — globally verified and publicly visible.",
                bgClass: "bg-purple-500",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="pixel-card bg-black border-2 border-white p-6 hover:scale-105 transition-all duration-300 hover:border-maximally-red"
              >
                <div className={`minecraft-block ${item.bgClass} text-black w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                  {item.icon}
                </div>
                <h3 className="font-press-start text-sm mb-4 text-white">
                  {item.title}
                </h3>
                <p className="font-jetbrains text-gray-300 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="#directory"
              className="inline-block text-maximally-red font-press-start text-sm hover:text-maximally-yellow transition-colors"
            >
              Meet the Judges Who Set the Standard →
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4 bg-black">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-press-start text-3xl md:text-5xl mb-4 text-white">
              The Judging Standard, <span className="text-maximally-red">Simplified.</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                step: "1",
                title: "Apply",
                description: "Fill out your application — credentials, experience, motivations.",
                icon: <CheckCircle2 className="h-8 w-8" />,
              },
              {
                step: "2",
                title: "Get Verified",
                description: "Our team screens every applicant for authenticity and expertise.",
                icon: <Target className="h-8 w-8" />,
              },
              {
                step: "3",
                title: "Go Public",
                description: "You receive your Maximally Judge Profile — your public page of expertise and events judged.",
                icon: <Globe className="h-8 w-8" />,
              },
              {
                step: "4",
                title: "Judge, Mentor, Lead",
                description: "You're invited to panels, hackathons, and mentorship opportunities worldwide.",
                icon: <Trophy className="h-8 w-8" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="minecraft-block bg-maximally-red text-black w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <span className="font-press-start text-2xl">{item.step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-press-start text-xl mb-2 text-white">
                    {item.title}
                  </h3>
                  <p className="font-jetbrains text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="text-maximally-yellow hidden md:block">
                  {item.icon}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="pixel-card bg-maximally-yellow/10 border-2 border-maximally-yellow p-8 mt-12 max-w-4xl mx-auto"
          >
            <p className="font-jetbrains text-xl text-center text-white leading-relaxed">
              Once verified, your profile becomes a <span className="text-maximally-yellow font-bold">credential.</span>
              <br />
              A Maximally Judge ID that travels across events, hackathons, and ecosystems.
            </p>
          </motion.div>
        </div>
      </section>

      {/* THE MAXIMALLY JUDGE PROFILE */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-maximally-red/10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-press-start text-3xl md:text-5xl mb-4 text-white">
              The Maximally <span className="text-maximally-red">Judge Profile</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="pixel-card bg-black border-4 border-maximally-red p-8"
            >
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="minecraft-block bg-maximally-red w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <Users className="h-8 w-8 text-black" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-press-start text-xl mb-2 text-white">
                      Dr. Yue Cheng
                    </h3>
                    <p className="font-jetbrains text-gray-300 text-sm mb-3">
                      CMU Alum • Product Designer • AI & Systems Mentor
                    </p>
                    <div className="space-y-2 font-jetbrains text-sm">
                      <p className="text-gray-400">
                        💬 Judged 6 Hackathons | 2x Devpost Mentor | <span className="text-maximally-yellow">Level 2 Badge</span>
                      </p>
                      <p className="text-gray-400">
                        🌎 Singapore | <span className="text-green-400">Verified by Maximally</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-maximally-red/30 pt-6">
                  <p className="font-jetbrains text-gray-300 leading-relaxed">
                    Every verified judge gets a live profile — your public identity as a global mentor.
                  </p>
                  <p className="font-jetbrains text-white mt-4 leading-relaxed">
                    It's your portfolio of credibility, built around what you've judged, taught, and led.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="text-center mt-8">
              <a
                href="#profile"
                className="minecraft-block bg-maximally-yellow text-black px-8 py-4 font-press-start text-sm inline-block hover:scale-105 transition-all duration-300"
              >
                VIEW SAMPLE PROFILE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOR ORGANIZERS */}
      <section className="py-24 px-4 bg-black">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="minecraft-block bg-maximally-yellow text-black px-6 py-3 inline-block mb-8">
              <span className="font-press-start text-sm">FOR EVENT ORGANIZERS</span>
            </div>
            <h2 className="font-press-start text-3xl md:text-5xl mb-8 text-white">
              Great judges make <span className="text-maximally-red">great hackathons.</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="pixel-card bg-maximally-red/10 border-2 border-maximally-red p-8 mb-8"
            >
              <p className="font-jetbrains text-lg text-gray-300 leading-relaxed mb-6">
                Organizers can now access the <span className="text-maximally-yellow font-bold">Maximally Judge Directory</span> — a global pool of verified judges across AI, product, design, systems, and creativity.
              </p>
              <div className="space-y-4 font-jetbrains text-gray-300">
                <p className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                  Add credibility to your event.
                </p>
                <p className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                  Elevate your participants' learning.
                </p>
                <p className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                  And be "Powered by Maximally Judges."
                </p>
              </div>
            </motion.div>

            <div className="text-center">
              <a
                href="https://tally.so/r/wkjbE9"
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-card border-2 border-white text-white px-8 py-4 font-press-start text-sm inline-block hover:bg-white hover:text-black transition-all duration-300"
              >
                REQUEST JUDGES FOR YOUR EVENT
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* THE VISION */}
      <section className="py-32 px-4 relative overflow-hidden bg-gradient-to-b from-black via-maximally-red/20 to-black">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h2 className="font-press-start text-3xl md:text-5xl mb-12 text-white">
              We're building the world's <span className="text-maximally-red">credibility layer</span> for innovation.
            </h2>

            <div className="space-y-8 font-jetbrains text-xl md:text-2xl text-gray-300 leading-relaxed">
              <p>Just as YC standardized founders,</p>
              <p>and FIDE standardized chess mastery —</p>
              <p className="text-white font-bold text-3xl">
                Maximally is standardizing <span className="text-maximally-red">judgment itself.</span>
              </p>
              <div className="pt-8 space-y-4">
                <p>The future of innovation will not be random.</p>
                <p className="text-maximally-yellow font-bold">It will be verified.</p>
                <p className="text-green-400 font-bold">It will be earned.</p>
                <p className="text-maximally-red font-bold text-4xl">It will be Maximally.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* JOIN THE STANDARD */}
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-r from-maximally-red/30 via-black to-maximally-red/30">
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e50914' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-press-start text-3xl md:text-5xl mb-8 text-white">
              Ready to shape the <span className="text-maximally-red">future of innovation?</span>
            </h2>

            <p className="text-gray-300 text-xl font-jetbrains max-w-3xl mx-auto leading-relaxed mb-12">
              Become part of the 0.1%. Mentor the next 1%.
              <br />
              <span className="text-maximally-yellow font-bold text-2xl">Apply to become a Maximally Judge.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://tally.so/r/wkjbE9"
                target="_blank"
                rel="noopener noreferrer"
                className="minecraft-block bg-maximally-yellow text-black px-12 py-6 font-press-start text-lg hover:scale-105 transition-all duration-300 hover:bg-maximally-red flex items-center gap-3"
              >
                <Star className="h-6 w-6" />
                APPLY NOW
              </a>
              <Link
                to="/about"
                className="pixel-card border-2 border-white text-white px-12 py-6 font-press-start text-lg hover:bg-white hover:text-black transition-all duration-300"
              >
                LEARN MORE
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Judges;
