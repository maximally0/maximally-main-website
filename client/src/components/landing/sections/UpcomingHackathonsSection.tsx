import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Trophy, Code, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface FeaturedHackathon {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  prize: string;
  format: "online" | "in-person" | "hybrid";
  tags: string[];
  status: "upcoming" | "ongoing" | "completed";
  registerUrl: string;
  type: "admin" | "organizer";
}

const formatColors: Record<string, string> = {
  online: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  "in-person": "bg-orange-500/10 text-orange-400 border-orange-500/30",
  hybrid: "bg-orange-500/20 text-orange-300 border-orange-500/40",
};

const getDateRange = (start: string, end: string) => {
  const s = new Date(start), e = new Date(end);
  const sm = s.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const em = e.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  if (sm === em) return `${sm} ${s.getDate()}-${e.getDate()}, ${s.getFullYear()}`;
  return `${sm} ${s.getDate()} - ${em} ${e.getDate()}, ${s.getFullYear()}`;
};

const calcStatus = (start: string, end: string): "upcoming" | "ongoing" | "completed" => {
  const now = new Date(), s = new Date(start), e = new Date(end);
  if (s > now) return "upcoming";
  if (e < now) return "completed";
  return "ongoing";
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function UpcomingHackathonsSection() {
  const [hackathons, setHackathons] = useState<FeaturedHackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/featured-hackathons');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setHackathons(json.data.map((h: any) => ({
            ...h, status: calcStatus(h.startDate, h.endDate || h.startDate),
          })));
        }
      } catch (e: any) {
        console.error('Error fetching featured hackathons:', e?.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="py-20 sm:py-28 relative bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-500/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="font-space text-sm text-orange-400 tracking-wide font-medium mb-4 block">LIVE NOW</span>
          <h2 className="font-space text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">Live Builder Events</h2>
          <p className="font-space text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">Active and upcoming events for serious builders. Apply, build, and ship.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
          </div>
        ) : hackathons.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <Code className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="font-space text-gray-500">No live events right now. Check back soon.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12 max-w-6xl mx-auto"
          >
            {hackathons.map((hackathon) => (
              <motion.div
                key={hackathon.id}
                variants={cardVariants}
                className="group relative bg-gray-900/50 border border-gray-800 hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/5"
              >
                <div className="relative p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <span className={`px-2 py-0.5 text-[10px] font-space font-medium capitalize border ${formatColors[hackathon.format] || formatColors.hybrid}`}>
                      {hackathon.format}
                    </span>
                    <span className={`px-2 py-0.5 border text-[10px] font-space font-medium uppercase ${
                      hackathon.status === 'upcoming' ? 'bg-green-500/20 text-green-300 border-green-500/40' :
                      hackathon.status === 'ongoing' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                      'bg-gray-500/20 text-gray-400 border-gray-500/40'
                    }`}>
                      {hackathon.status}
                    </span>
                  </div>
                  <h3 className="font-space text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">{hackathon.name}</h3>
                  <p className="font-space text-sm text-gray-400 mb-4 line-clamp-2">{hackathon.description}</p>
                  <div className="flex flex-wrap gap-3 mb-4 text-xs font-space text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      <span>{getDateRange(hackathon.startDate, hackathon.endDate)}</span>
                    </div>
                    {hackathon.prize && hackathon.prize !== 'TBD' && (
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-orange-300">{hackathon.prize}</span>
                      </div>
                    )}
                  </div>
                  {hackathon.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {hackathon.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 text-xs font-space text-gray-400">{tag}</span>
                      ))}
                    </div>
                  )}
                  <a
                    href={hackathon.registerUrl}
                    target={hackathon.registerUrl.startsWith('http') ? '_blank' : undefined}
                    rel={hackathon.registerUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500/10 border border-orange-500/30 hover:border-orange-400 hover:bg-orange-500/20 text-orange-300 hover:text-orange-200 font-space text-sm font-medium transition-all duration-300"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <Link
            to="/events"
            className="group inline-flex items-center gap-3 px-6 py-3 border border-gray-700 hover:border-orange-500/60 text-gray-300 hover:text-white font-space text-sm font-medium transition-all duration-300"
          >
            <span>Browse All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
    </section>
  );
}

export default UpcomingHackathonsSection;
