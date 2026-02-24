import {
  ArrowLeft,
  Users,
  Trophy,
  Code,
  Target,
  Star,
  Calendar,
  Clock,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

const MakeathonReport = () => {
  const eventStats = [
    { icon: Users, label: 'Participants', value: '700+', color: 'red' },
    {
      icon: Trophy,
      label: 'Startup Submissions',
      value: '100+',
      color: 'blue',
    },
    { icon: Globe, label: 'Digital Reach', value: '70k+', color: 'green' },
    { icon: Target, label: 'Prize Pool', value: '₹10k', color: 'orange' },
  ];

  const highlights = [
    {
      title: 'First-Ever Startup Makeathon',
      description:
        "Launched Maximally's hackathon ecosystem with a 7-day startup building sprint",
      icon: Trophy,
      color: 'blue',
    },
    {
      title: 'Global Professional Judges',
      description:
        '15+ engineers and founders from Meta, Amazon, Intuit, Replit, and more',
      icon: Star,
      color: 'yellow',
    },
    {
      title: 'Masters Union Partnership',
      description:
        'First major sponsor backing, with support from NexFellow and XYZ Domains',
      icon: Target,
      color: 'green',
    },
    {
      title: 'Viral Social Impact',
      description:
        'High-energy Gen Z content across Instagram, LinkedIn, YouTube, and Devpost',
      icon: Globe,
      color: 'orange',
    },
  ];

  const judges = [
    {
      name: 'Krishna Ganeriwal',
      role: 'Senior Software Engineer @ Meta',
      color: 'blue',
    },
    {
      name: 'Harpreet Kaur Chawla',
      role: 'Senior Software Engineer @ Amazon',
      color: 'orange',
    },
    {
      name: 'Anusha Ravi',
      role: 'Product Leader @ Intuit',
      color: 'green',
    },
    {
      name: 'Saket Ozarkar',
      role: 'Software Engineer @ Replit',
      color: 'orange',
    },
    {
      name: 'Nidhi Mahajan',
      role: 'Director of Business Strategy & Ops @ Visa',
      color: 'red',
    },
    {
      name: 'Louis Demeslay',
      role: 'CTO @ Zealy.io',
      color: 'blue',
    },
  ];

  const socialLinks = [
    {
      title: 'Instagram Reel 1',
      url: 'https://www.instagram.com/p/DMTU2UVTXj_/?img_index=1',
      platform: 'Instagram',
    },
    {
      title: 'Instagram Reel 2',
      url: 'https://www.instagram.com/p/DKgyzFOPhXx/',
      platform: 'Instagram',
    },
    {
      title: 'YouTube Aftermovie',
      url: 'https://www.youtube.com/watch?v=wMgcao2H75g',
      platform: 'YouTube',
    },
    {
      title: 'Devpost Listing',
      url: 'https://maximally-makeathon-2025.devpost.com/',
      platform: 'Devpost',
    },
  ];

  const getColorClasses = (color: string, isHover = false) => {
    const colors = {
      red: isHover ? 'border-red-600 shadow-red-500/30' : 'border-red-400',
      blue: isHover ? 'border-blue-600 shadow-blue-500/30' : 'border-blue-400',
      green: isHover
        ? 'border-green-600 shadow-green-500/30'
        : 'border-green-400',
      purple: isHover
        ? 'border-orange-500 shadow-orange-500/30'
        : 'border-orange-500',
      yellow: isHover
        ? 'border-yellow-600 shadow-yellow-500/30'
        : 'border-yellow-400',
      orange: isHover
        ? 'border-orange-600 shadow-orange-500/30'
        : 'border-orange-400',
    };
    return colors[color as keyof typeof colors] || colors.red;
  };

  const getAccentColor = (color: string) => {
    const colors = {
      red: 'text-red-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-orange-500',
      yellow: 'text-yellow-600',
      orange: 'text-orange-600',
    };
    return colors[color as keyof typeof colors] || colors.red;
  };

  return (
    <>
      <SEO
        title="Maximally Startup Makeathon Report | July 2025 | Maximally"
        description="Complete report of the Maximally Startup Makeathon - 7 days, 700+ participants, 100+ startup submissions. India's first startup building sprint."
        keywords="makeathon report, startup hackathon, Indian students, innovation report, tech education impact, Masters Union"
      />
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-white overflow-hidden relative">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="pixel-grid opacity-10"></div>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className={`absolute pixel-border animate-float ${
                i % 3 === 0
                  ? 'w-3 h-3 bg-red-500/20'
                  : i % 3 === 1
                  ? 'w-4 h-4 bg-gray-800'
                  : 'w-2 h-2 bg-green-500/20'
              }`}
              style={{
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 90}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${4 + i * 0.3}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link
              to="/events"
              className="inline-flex items-center gap-2 font-space text-gray-600 hover:text-red-600 transition-colors mb-6 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:transform group-hover:-translate-x-1 transition-transform" />
              Back to Events
            </Link>

            <div className="text-center">
              <motion.h1
                className="font-space font-bold text-3xl md:text-5xl mb-6 bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent leading-tight drop-shadow-lg"
                animate={{
                  textShadow: [
                    '0 0 0px rgba(220, 38, 38, 0)',
                    '0 0 10px rgba(220, 38, 38, 0.3)',
                    '0 0 0px rgba(220, 38, 38, 0)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Maximally Startup Makeathon
              </motion.h1>
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="font-space text-gray-700">
                    July 1-7, 2025
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="font-space text-gray-700">7 Days</span>
                </div>
              </div>
              <p className="font-space text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
                India's first-ever startup building sprint - from idea to
                prototype in one week
              </p>
            </div>
          </motion.div>

          {/* Event Stats */}
          <motion.section
            className="mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {eventStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="group"
                >
                  <Card
                    className={`minecraft-block bg-gradient-to-br from-white to-gray-50/50 transition-all duration-500 border-4 ${getColorClasses(
                      stat.color
                    )} hover:${getColorClasses(
                      stat.color,
                      true
                    )} shadow-lg hover:shadow-2xl relative overflow-hidden`}
                  >
                    <div
                      className={`absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 pixel-corner opacity-20 group-hover:opacity-40 transition-opacity`}
                    ></div>
                    <CardContent className="p-6 text-center relative z-10">
                      <div
                        className={`p-3 rounded-lg bg-${stat.color}-100 pixel-border mx-auto w-fit mb-4`}
                      >
                        <stat.icon
                          className={`h-6 w-6 ${getAccentColor(stat.color)}`}
                        />
                      </div>
                      <div className="font-space font-bold text-2xl mb-2 text-gray-900">
                        {stat.value}
                      </div>
                      <div className="font-space text-sm text-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Event Highlights */}
          <motion.section
            className="mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center mb-12">
              <h2 className="font-space font-bold text-3xl md:text-4xl mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent drop-shadow-sm">
                Event Highlights
              </h2>
              <div className="w-32 h-2 bg-gradient-to-r from-red-600 to-red-500 mx-auto pixel-border shadow-lg"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02, rotateX: 2 }}
                  className="group"
                >
                  <Card
                    className={`minecraft-block bg-gradient-to-br from-white to-gray-50/50 transition-all duration-500 border-4 ${getColorClasses(
                      highlight.color
                    )} hover:${getColorClasses(
                      highlight.color,
                      true
                    )} shadow-lg hover:shadow-2xl h-full relative overflow-hidden`}
                  >
                    <div
                      className={`absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-${highlight.color}-500 to-${highlight.color}-600 pixel-corner opacity-20 group-hover:opacity-40 transition-opacity`}
                    ></div>
                    <CardContent className="p-8">
                      <div
                        className={`p-3 rounded-lg bg-${highlight.color}-100 pixel-border w-fit mb-4`}
                      >
                        <highlight.icon
                          className={`h-6 w-6 ${getAccentColor(
                            highlight.color
                          )}`}
                        />
                      </div>
                      <h3
                        className={`font-space font-bold text-lg mb-4 text-black group-hover:${getAccentColor(
                          highlight.color
                        )} transition-colors leading-tight`}
                      >
                        {highlight.title}
                      </h3>
                      <p className="font-space text-gray-700 text-sm leading-relaxed font-medium">
                        {highlight.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Judges & Mentors */}
          <motion.section
            className="mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="font-space font-bold text-3xl md:text-4xl mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent drop-shadow-sm">
                Global Judges & Mentors
              </h2>
              <div className="w-32 h-2 bg-gradient-to-r from-blue-600 to-blue-500 mx-auto pixel-border shadow-lg"></div>
              <p className="font-space text-gray-600 mt-4 max-w-2xl mx-auto">
                15+ global professionals from Meta, Amazon, Intuit, Replit,
                Visa, and more
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {judges.map((judge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, rotateY: 3 }}
                  className="group"
                >
                  <Card
                    className={`minecraft-block bg-gradient-to-br from-white to-gray-50/50 transition-all duration-500 border-4 ${getColorClasses(
                      judge.color
                    )} hover:${getColorClasses(
                      judge.color,
                      true
                    )} shadow-lg hover:shadow-2xl h-full relative overflow-hidden`}
                  >
                    <div
                      className={`absolute bottom-0 left-0 w-6 h-6 bg-gradient-to-tr from-${judge.color}-400 to-${judge.color}-500 pixel-corner opacity-20 group-hover:opacity-40 transition-opacity`}
                    ></div>
                    <CardContent className="p-6">
                      <h3
                        className={`font-space font-bold text-sm mb-3 text-black group-hover:${getAccentColor(
                          judge.color
                        )} transition-colors leading-tight`}
                      >
                        {judge.name}
                      </h3>
                      <p className="font-space text-gray-600 text-xs leading-relaxed font-medium">
                        {judge.role}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Social Media & Content */}
          <motion.section
            className="mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="text-center mb-12">
              <h2 className="font-space font-bold text-3xl md:text-4xl mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent drop-shadow-sm">
                Content & Media
              </h2>
              <div className="w-32 h-2 bg-gradient-to-r from-green-600 to-green-500 mx-auto pixel-border shadow-lg"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {socialLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, rotateX: -2 }}
                  className="group"
                >
                  <Card className="minecraft-block bg-gradient-to-br from-white to-gray-50/50 transition-all duration-500 border-4 border-green-400 hover:border-green-600 hover:shadow-green-500/30 shadow-lg hover:shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 pixel-corner opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-space font-bold text-sm text-black group-hover:text-green-600 transition-colors mb-2">
                            {link.title}
                          </h3>
                          <p className="font-space text-xs text-gray-600 font-medium">
                            {link.platform}
                          </p>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pixel-button bg-gradient-to-r from-green-600 to-green-700 text-white font-space font-bold text-xs px-4 py-2 hover:scale-105 hover:shadow-lg transition-all flex items-center gap-2 border-2 border-green-800"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>View</span>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Impact Statement */}
          <motion.section
            className="text-center pixel-border p-12 md:p-16 bg-gradient-to-r from-red-600/10 via-gray-800/5 to-blue-600/10 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <div className="absolute inset-0 opacity-5">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-red-600 pixel-border"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>

            <h2 className="font-space font-bold text-2xl md:text-3xl mb-8 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent leading-tight drop-shadow-sm relative z-10">
              Legacy & Next Steps
            </h2>
            <p className="font-space text-lg md:text-xl text-gray-700 mb-6 max-w-4xl mx-auto font-medium relative z-10">
              The Startup Makeathon was more than just an event — it was the
              kickoff to Maximally's hackathon ecosystem. It proved that
              students are hungry for startup-style building sprints, global
              professionals are willing to join as judges and mentors, and
              sponsors see value in funding Gen Z competitions.
            </p>
            <p className="font-space text-base text-gray-600 max-w-3xl mx-auto relative z-10">
              This impact carried directly into planning the Maximally AI
              Shipathon (Aug 30–Sept 1, 2025) and the upcoming Grand Indian
              Hackathon Season.
            </p>
          </motion.section>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default MakeathonReport;
