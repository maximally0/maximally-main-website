import { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronDown,
  FileText,
  Upload,
  Scale,
  Users,
  LayoutDashboard,
  GitBranch,
  Trophy,
  ClipboardList,
  Check,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import Marquee from 'react-fast-marquee';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/lib/auth';

/* ─── Stagger helpers ─── */
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ─── Data ─── */
const competitionChips = [
  'Hackathons', 'Startup competitions', 'Innovation challenges', 'Design contests',
  'Research competitions', 'AI competitions', 'Developer challenges', 'Student competitions',
  'Grant programs', 'Open innovation programs', 'Game jams', 'Science fairs',
];

const infraItems = [
  { icon: FileText, title: 'Competition Pages', desc: 'Structured pages with tracks, rules, timelines, and eligibility.' },
  { icon: ClipboardList, title: 'Applications & Registrations', desc: 'Customizable forms for participant applications.' },
  { icon: Upload, title: 'Artifact Submissions', desc: 'Accept projects, pitch decks, papers, designs, or prototypes.' },
  { icon: GitBranch, title: 'Multi-Stage Workflows', desc: 'Multiple rounds — applications, submissions, review, finals.' },
  { icon: Scale, title: 'Evaluation Engine', desc: 'Judge assignment and structured rubric scoring.' },
  { icon: Trophy, title: 'Results & Leaderboards', desc: 'Automatic rankings, winners, and public results.' },
  { icon: Users, title: 'Participant Management', desc: 'Individuals, teams, startups, or organizations.' },
  { icon: LayoutDashboard, title: 'Organizer Dashboard', desc: 'Real-time registrations, submissions, judging, and results.' },
];

const exampleTypes = [
  { name: 'Hackathon', desc: 'Teams build projects and submit demos.' },
  { name: 'Startup Competition', desc: 'Founders submit pitch decks and demo products.' },
  { name: 'Design Contest', desc: 'Designers submit prototypes and case studies.' },
  { name: 'Research Challenge', desc: 'Students submit research papers and datasets.' },
];

const comparisonRows = [
  { maximally: 'Submission-based competitions', other: 'Meetups' },
  { maximally: 'Judging workflows', other: 'Conferences' },
  { maximally: 'Structured evaluation', other: 'Webinars' },
  { maximally: 'Ranking & results', other: 'Networking events' },
];

const audienceList = [
  'Hackathon organizers', 'Universities', 'Startup communities',
  'Accelerators', 'Companies running innovation challenges',
  'Research institutions', 'Developer communities',
];

const pipelineSteps = ['Competition Setup', 'Participants Apply', 'Artifacts Submitted', 'Judges Evaluate', 'Rankings & Winners'];

/* ─── Component ─── */
const HostHackathon = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [hasHackathons, setHasHackathons] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!authLoading) {
        if (user) {
          const org = profile?.role === 'organizer' || profile?.role === 'admin';
          setIsOrganizer(org);
          if (org) {
            try {
              const headers = await getAuthHeaders();
              const res = await fetch('/api/organizer/hackathons', { headers });
              const data = await res.json();
              if (data.success && data.data?.length > 0) setHasHackathons(true);
            } catch {}
          }
        }
        setCheckingStatus(false);
      }
    };
    check();
  }, [user, profile, authLoading]);

  const handleCTA = () => {
    if (!user) navigate('/login?redirect=/organizer/apply');
    else if (!isOrganizer) navigate('/organizer/apply');
    else if (hasHackathons) navigate('/organizer/dashboard');
    else navigate('/create-hackathon');
  };

  const ctaText = () => {
    if (authLoading || checkingStatus) return 'Loading...';
    if (!user) return 'Launch Your Competition';
    if (!isOrganizer) return 'Apply to Host';
    if (hasHackathons) return 'My Dashboard';
    return 'Create Competition';
  };

  const CTAButton = ({ className = '' }: { className?: string }) => (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleCTA}
      disabled={authLoading || checkingStatus}
      className={`group inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 disabled:opacity-50 ${className}`}
    >
      <span>{ctaText()}</span>
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </motion.button>
  );

  return (
    <>
      <SEO
        title="The Operating System for Competitions — Maximally"
        description="Run hackathons, startup competitions, design contests, and innovation challenges on one platform. Applications, submissions, judging, and results — all in one system."
        keywords="competition platform, hackathon infrastructure, startup competition, innovation challenge, judging platform, competition management"
        canonicalUrl="https://maximally.in/host-hackathon"
      />

      <div className="min-h-screen bg-black text-white relative">

        {/* ═══════════════════════════════════════════
            1 — HERO
        ═══════════════════════════════════════════ */}
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
                transition={{ duration: 0.6 }}
                className="font-space text-sm text-orange-400 tracking-[0.3em] font-medium mb-6 block uppercase"
              >
                FOR ORGANIZERS
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="font-space text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-[1.1] tracking-tight"
              >
                <span className="text-white">The operating system for</span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  <TypeAnimation
                    sequence={[
                      'competitions.', 2500,
                      'hackathons.', 2000,
                      'startup competitions.', 2000,
                      'innovation challenges.', 2000,
                      'design contests.', 2000,
                      'research competitions.', 2000,
                    ]}
                    wrapper="span"
                    speed={40}
                    repeat={Infinity}
                    cursor={true}
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-space leading-relaxed mb-10 sm:mb-12 px-4"
              >
                Run hackathons, startup competitions, design contests, and innovation challenges on one platform.
              </motion.p>

              {/* Mini pipeline in hero */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-14 px-4"
              >
                {['Applications', 'Submissions', 'Judging', 'Rankings', 'Winners'].map((s, i) => (
                  <span key={i} className="flex items-center gap-2 sm:gap-3">
                    <span className="font-space text-xs sm:text-sm text-gray-500">{s}</span>
                    {i < 4 && <span className="text-gray-700">→</span>}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center px-4"
              >
                <CTAButton />
                <a
                  href="#the-model"
                  className="group flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-transparent border border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-space text-sm sm:text-base font-semibold transition-all duration-300"
                >
                  <span>See How It Works</span>
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            2 — THE BIG IDEA (centerpiece)
        ═══════════════════════════════════════════ */}
        <section id="the-model" className="py-32 sm:py-40 relative bg-black overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-orange-950/5 via-transparent to-orange-950/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[180px]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto text-center mb-16 sm:mb-20"
            >
              <h2 className="font-space text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15]">
                If your event looks like this,{' '}
                <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  Maximally runs it.
                </span>
              </h2>
            </motion.div>

            {/* Large animated pipeline */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="max-w-sm mx-auto mb-16 sm:mb-20"
            >
              {pipelineSteps.map((step, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-center gap-5 mb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 border flex items-center justify-center transition-colors ${
                      i === 0 || i === pipelineSteps.length - 1
                        ? 'border-orange-500/60 bg-orange-500/10'
                        : 'border-gray-700 bg-gray-900/60'
                    }`}>
                      <span className={`font-space text-sm font-bold ${
                        i === 0 || i === pipelineSteps.length - 1 ? 'text-orange-400' : 'text-gray-400'
                      }`}>{i + 1}</span>
                    </div>
                    {i < pipelineSteps.length - 1 && (
                      <div className="w-px h-10 bg-gradient-to-b from-gray-700 to-gray-800" />
                    )}
                  </div>
                  <span className={`font-space text-base sm:text-lg font-medium ${
                    i === 0 || i === pipelineSteps.length - 1 ? 'text-orange-400' : 'text-gray-300'
                  }`}>
                    {step}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-space text-base sm:text-lg text-gray-400 text-center max-w-xl mx-auto"
            >
              Maximally powers competitions where participants submit work and judges evaluate it.
            </motion.p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
        </section>

        {/* ═══════════════════════════════════════════
            3 — SUPPORTED COMPETITIONS (marquee + chips)
        ═══════════════════════════════════════════ */}
        <section className="py-20 sm:py-24 relative bg-black overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-space text-xs text-gray-600 tracking-wide uppercase text-center mb-6"
            >
              Supported competitions
            </motion.p>
          </div>

          {/* Scrolling marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mb-10"
          >
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
            <Marquee speed={35} gradient={false} pauseOnHover>
              {competitionChips.map((c, i) => (
                <span key={i} className="font-space text-sm text-gray-400 mx-4 sm:mx-6 whitespace-nowrap">
                  {c}
                  <span className="text-gray-700 ml-4 sm:ml-6">·</span>
                </span>
              ))}
            </Marquee>
          </motion.div>

          {/* Static chips below for clarity */}
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto"
            >
              {competitionChips.map((c, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-gray-900/50 border border-gray-800 font-space text-xs text-gray-400 hover:border-orange-500/30 hover:text-gray-300 transition-colors duration-200"
                >
                  {c}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            4 — INFRASTRUCTURE (split layout — devtool style)
        ═══════════════════════════════════════════ */}
        <section className="py-32 sm:py-40 relative bg-black overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
          <div className="absolute top-40 left-[5%] w-80 h-80 bg-orange-500/5 rounded-full blur-[120px]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <span className="font-space text-sm text-orange-400 tracking-wide font-medium mb-4 block uppercase">Infrastructure</span>
              <h2 className="font-space text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Everything needed to run a competition
              </h2>
            </motion.div>

            {/* Split: list left, diagram right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto items-start">
              {/* Left — infrastructure list */}
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="space-y-3"
              >
                {infraItems.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    whileHover={{ x: 6 }}
                    className="group flex items-start gap-4 p-4 bg-gray-900/40 border border-gray-800 hover:border-orange-500/30 transition-all duration-200"
                  >
                    <div className="p-2 bg-orange-500/10 border border-orange-500/20 shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <item.icon className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <span className="font-space text-sm font-semibold text-white group-hover:text-orange-400 transition-colors block">
                        {item.title}
                      </span>
                      <span className="font-space text-xs text-gray-500 leading-relaxed">{item.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Right — system diagram */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="p-8 bg-gray-900/30 border border-gray-800 font-space">
                  <p className="text-xs text-gray-600 uppercase tracking-wider mb-6">System Architecture</p>
                  <div className="space-y-0">
                    {/* Root */}
                    <div className="flex items-center gap-3 py-3">
                      <span className="text-orange-400 text-sm">┌</span>
                      <span className="text-white text-sm font-semibold">Competition</span>
                    </div>
                    {/* Children */}
                    {[
                      { label: 'Participants', color: 'text-gray-300' },
                      { label: 'Artifacts', color: 'text-gray-300' },
                      { label: 'Evaluation', color: 'text-gray-300' },
                      { label: 'Results', color: 'text-gray-300' },
                    ].map((node, i, arr) => (
                      <div key={i} className="flex items-center gap-3 py-2 pl-4">
                        <span className="text-gray-600 text-sm">{i === arr.length - 1 ? '└──' : '├──'}</span>
                        <span className={`${node.color} text-sm`}>{node.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-800">
                    <p className="text-xs text-gray-600 uppercase tracking-wider mb-4">Data Flow</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {['Setup', 'Apply', 'Submit', 'Evaluate', 'Rank'].map((s, i) => (
                        <span key={i} className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 text-xs border ${
                            i === 0 || i === 4 ? 'border-orange-500/40 text-orange-400 bg-orange-500/5' : 'border-gray-700 text-gray-400'
                          }`}>{s}</span>
                          {i < 4 && <span className="text-gray-700 text-xs">→</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            5 — EXAMPLE COMPETITION TYPES (real examples, not generic cards)
        ═══════════════════════════════════════════ */}
        <section className="py-32 sm:py-40 relative bg-black overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
          <div className="absolute bottom-20 right-[10%] w-72 h-72 bg-orange-500/5 rounded-full blur-[100px]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <span className="font-space text-sm text-gray-500 tracking-wide font-medium mb-4 block uppercase">Examples</span>
              <h2 className="font-space text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                What organizers run on Maximally
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
              {exampleTypes.map((ex, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group p-6 bg-gray-900/40 border border-gray-800 hover:border-orange-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-orange-500/[0.04]"
                >
                  <h3 className="font-space text-sm font-semibold text-orange-400 mb-2">{ex.name}</h3>
                  <p className="font-space text-xs text-gray-400 leading-relaxed">{ex.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            6 — WHAT MAXIMALLY IS NOT (comparison table)
        ═══════════════════════════════════════════ */}
        <section className="py-32 sm:py-40 relative bg-black overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="font-space text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-5">
                Maximally is built for competitions — not generic events.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="max-w-2xl mx-auto"
            >
              {/* Table header */}
              <div className="grid grid-cols-2 gap-px mb-1">
                <div className="p-3 bg-orange-500/5 border border-orange-500/20">
                  <span className="font-space text-xs text-orange-400 font-semibold uppercase tracking-wider">Maximally</span>
                </div>
                <div className="p-3 bg-gray-900/40 border border-gray-800">
                  <span className="font-space text-xs text-gray-500 font-semibold uppercase tracking-wider">Typical Event Platforms</span>
                </div>
              </div>
              {/* Table rows */}
              {comparisonRows.map((row, i) => (
                <div key={i} className="grid grid-cols-2 gap-px mb-px">
                  <div className="flex items-center gap-2 p-3 bg-gray-900/20 border-x border-gray-800/30">
                    <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="font-space text-sm text-gray-300">{row.maximally}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-900/20 border-x border-gray-800/30">
                    <X className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                    <span className="font-space text-sm text-gray-500">{row.other}</span>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-space text-xs text-gray-600 text-center mt-8 max-w-lg mx-auto"
            >
              Those platforms focus on attendance. Maximally focuses on competition infrastructure — submissions, evaluation, and results.
            </motion.p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            7 — ORGANIZER AUDIENCE
        ═══════════════════════════════════════════ */}
        <section className="py-32 sm:py-40 relative bg-black overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
          <div className="absolute top-40 left-[5%] w-60 h-60 bg-orange-500/5 rounded-full blur-[80px]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto items-center">
              {/* Left — text */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
              >
                <span className="font-space text-sm text-orange-400 tracking-wide font-medium mb-4 block uppercase">Audience</span>
                <h2 className="font-space text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
                  Used by organizers running serious competitions
                </h2>
                <p className="font-space text-base text-gray-400 leading-relaxed">
                  From university hackathons to corporate innovation programs — if you run a competition, Maximally is your infrastructure.
                </p>
              </motion.div>

              {/* Right — audience tags */}
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="space-y-3"
              >
                {audienceList.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="flex items-center gap-3 p-3 bg-gray-900/40 border border-gray-800 hover:border-orange-500/25 transition-all duration-200"
                  >
                    <div className="w-1.5 h-1.5 bg-orange-400 shrink-0" />
                    <span className="font-space text-sm text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            8 — FINAL CTA
        ═══════════════════════════════════════════ */}
        <section className="py-32 sm:py-40 relative bg-black overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/5 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[160px]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="font-space text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5">
                Launch your competition on Maximally
              </h2>
              <p className="font-space text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed mb-12">
                Infrastructure for serious competitions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton />
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-3 px-8 py-4 sm:py-5 border border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-space text-sm sm:text-base font-semibold transition-all duration-300"
                >
                  Request Access
                </Link>
              </div>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HostHackathon;
