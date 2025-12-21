import { ArrowLeft, Users, Zap, Cpu, Globe, Rocket, Star, Calendar, Clock, Code2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

const ShipathonReport = () => {
  const eventStats = [
    { icon: Users, label: 'Global Participants', value: '610', gradient: 'from-blue-600/40 to-cyan-600/30', border: 'border-blue-500/50', textColor: 'text-blue-400' },
    { icon: Zap, label: 'AI Project Submissions', value: '100+', gradient: 'from-purple-600/40 to-pink-600/30', border: 'border-purple-500/50', textColor: 'text-purple-400' },
    { icon: Clock, label: 'Duration', value: '48hrs', gradient: 'from-green-600/40 to-emerald-600/30', border: 'border-green-500/50', textColor: 'text-green-400' },
    { icon: Globe, label: 'Format', value: 'Online', gradient: 'from-amber-600/40 to-orange-600/30', border: 'border-amber-500/50', textColor: 'text-amber-400' },
  ];

  const highlights = [
    { title: 'Organic Growth Success', description: "Event grew organically with minimal promotion, showing Maximally's brand strength", icon: Rocket, gradient: 'from-purple-600/40 to-pink-600/30', border: 'border-purple-500/50' },
    { title: 'AI Experimentation Focus', description: 'Encouraged creativity, beginner-friendly participation, and team collaboration', icon: Zap, gradient: 'from-blue-600/40 to-cyan-600/30', border: 'border-blue-500/50' },
    { title: 'Global Professional Judges', description: 'Senior engineers and analysts from Meta, Atlassian, Warner Bros., McKinsey, Oracle', icon: Star, gradient: 'from-amber-600/40 to-orange-600/30', border: 'border-amber-500/50' },
    { title: 'MakeX Partnership', description: 'Supported by MakeX as the key partner for this AI-focused hackathon', icon: Globe, gradient: 'from-green-600/40 to-emerald-600/30', border: 'border-green-500/50' },
  ];

  const judges = [
    { name: 'Senthilkumaran Rajagopalan', role: 'Tech Lead Manager, Video Recommendations @ Meta' },
    { name: 'Sahil Deshpande', role: 'Software Engineer @ Meta' },
    { name: 'Venkataram Poosapati', role: 'Senior Data Engineer @ Atlassian' },
    { name: 'Ashwini Joshi', role: 'Senior ML Engineer @ Warner Bros. Discovery' },
    { name: 'Shreesh Agarwal', role: 'Sr. Business Analyst @ McKinsey & Company' },
    { name: 'Karthik Ramamurthy', role: 'Engineering Lead @ Mercury Financial' },
    { name: 'Rakesh Pullayikodi', role: 'Staff Software Engineer @ Graphite Health' },
    { name: 'Vikranth Kumar Shivaa', role: 'Founding Engineer @ Fig' },
    { name: 'Raja Sekhar Rao Dheekonda', role: 'Distinguished Engineer @ Dreadnode' },
  ];

  const projectTypes = [
    { label: 'No-Code AI Tools', description: 'Beginner-friendly AI applications', icon: '🛠️' },
    { label: 'ML Experiments', description: 'Serious machine learning projects', icon: '🧠' },
    { label: 'Product Integrations', description: 'AI integrated into existing products', icon: '⚡' },
    { label: 'Creative Applications', description: 'Artistic and innovative AI uses', icon: '🎨' },
  ];

  const socialLinks = [
    { title: 'Event Website', url: 'https://maximally.in/shipathon', platform: 'Website' },
    { title: 'Devpost Listing', url: 'https://maximally-ai-shipathon-2025.devpost.com/', platform: 'Devpost' },
    { title: 'Instagram Highlight', url: 'https://www.instagram.com/p/DL75H0jy3tX/?img_index=1', platform: 'Instagram' },
  ];

  return (
    <>
      <SEO title="Maximally AI Shipathon Report | August 2025 | Maximally" description="Complete report of the Maximally AI Shipathon - 48 hours, 610 global participants, 100+ AI projects." keywords="AI hackathon report, shipathon, artificial intelligence, student developers" />
      
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15)_0%,transparent_50%)]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.10)_0%,transparent_50%)]" />
        
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/15 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/12 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <Link to="/events" className="inline-flex items-center gap-2 font-jetbrains text-purple-400 hover:text-pink-400 transition-colors mb-6 group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Events
            </Link>

            <div className="text-center">
              <motion.h1 className="font-press-start text-3xl md:text-5xl mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                Maximally AI Shipathon
              </motion.h1>
              <div className="flex items-center justify-center gap-6 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <span className="font-jetbrains text-gray-300">Aug 30 - Sept 1, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-pink-400" />
                  <span className="font-jetbrains text-gray-300">48 Hours</span>
                </div>
              </div>
              <p className="font-jetbrains text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                A 48-hour sprint designed to get builders experimenting with AI in creative ways
              </p>
            </div>
          </motion.div>

          {/* Event Stats */}
          <motion.section className="mb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {eventStats.map((stat, index) => (
                <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05 }}>
                  <div className={`bg-gradient-to-br ${stat.gradient} border ${stat.border} p-6 text-center transition-all hover:scale-[1.02]`}>
                    <stat.icon className={`h-8 w-8 ${stat.textColor} mx-auto mb-4`} />
                    <div className="font-press-start text-2xl text-white mb-2">{stat.value}</div>
                    <div className="font-jetbrains text-sm text-gray-400">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Project Types */}
          <motion.section className="mb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="text-center mb-12">
              <h2 className="font-press-start text-2xl md:text-3xl mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Project Categories</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {projectTypes.map((type, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.1 }} whileHover={{ scale: 1.05 }}>
                  <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/40 p-6 text-center hover:border-pink-400/50 transition-all">
                    <div className="text-4xl mb-3">{type.icon}</div>
                    <div className="font-press-start text-xs text-purple-400 mb-2">{type.label}</div>
                    <div className="font-jetbrains text-xs text-gray-400">{type.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Event Highlights */}
          <motion.section className="mb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="text-center mb-12">
              <h2 className="font-press-start text-2xl md:text-3xl mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Shipathon Highlights</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {highlights.map((highlight, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.1 }} whileHover={{ scale: 1.02 }}>
                  <div className={`bg-gradient-to-br ${highlight.gradient} border ${highlight.border} p-8 h-full hover:border-pink-400/50 transition-all`}>
                    <highlight.icon className="h-8 w-8 text-purple-400 mb-4" />
                    <h3 className="font-press-start text-sm text-white mb-4">{highlight.title}</h3>
                    <p className="font-jetbrains text-gray-300 text-sm leading-relaxed">{highlight.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Judges & Mentors */}
          <motion.section className="mb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <div className="text-center mb-12">
              <h2 className="font-press-start text-2xl md:text-3xl mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Global Judges & Mentors</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto" />
              <p className="font-jetbrains text-gray-400 mt-4 max-w-2xl mx-auto">Engineers, founders, and product leaders from Meta, Atlassian, Warner Bros., McKinsey, Oracle, and YC-backed startups</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {judges.map((judge, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02 }}>
                  <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-500/40 p-6 hover:border-orange-400/50 transition-all h-full">
                    <h3 className="font-press-start text-xs text-white mb-3">{judge.name}</h3>
                    <p className="font-jetbrains text-gray-400 text-xs leading-relaxed">{judge.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Event Links */}
          <motion.section className="mb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <div className="text-center mb-12">
              <h2 className="font-press-start text-2xl md:text-3xl mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Event Links</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-cyan-600 to-blue-600 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialLinks.map((link, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + index * 0.1 }} whileHover={{ scale: 1.02 }}>
                  <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-cyan-500/40 p-6 hover:border-blue-400/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-press-start text-xs text-white mb-2">{link.title}</h3>
                        <p className="font-jetbrains text-xs text-gray-400">{link.platform}</p>
                      </div>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-press-start text-xs px-4 py-2 border border-cyan-500/50 transition-all flex items-center gap-2">
                        <ExternalLink className="h-3 w-3" />
                        View
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Impact Statement */}
          <motion.section className="text-center bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/40 p-12 md:p-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
            <h2 className="font-press-start text-2xl md:text-3xl mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Legacy & Next Steps</h2>
            <p className="font-jetbrains text-lg text-gray-300 mb-6 max-w-4xl mx-auto">
              The AI Shipathon cemented Maximally's position as a hub for AI-native competitions. Key takeaways: Maximally's brand now has pull - events can succeed with limited promotion. The judge base grew stronger, adding senior engineers and analysts from global companies.
            </p>
            <p className="font-jetbrains text-base text-gray-400 max-w-3xl mx-auto mb-8">
              AI Shipathon acts as a bridge to the Grand Indian Hackathon Season, showing Maximally can scale beyond school-level hackathons into broader tech-driven themes.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/30 to-purple-600/20 border border-blue-500/40">
              <Code2 className="h-5 w-5 text-blue-400" />
              <span className="font-jetbrains text-sm text-gray-300">Next: Grand Indian Hackathon Season</span>
            </div>
          </motion.section>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ShipathonReport;
