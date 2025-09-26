import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Zap,
  Clock,
  Globe,
  Users,
  Code,
  Skull,
  AlertTriangle,
  Target,
  Trophy,
  Star,
  ExternalLink,
  FileText,
  Video,
  Flame,
  Shield,
} from 'lucide-react';

export default function Codepocalypse() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fastFacts = [
    {
      icon: <Clock className="h-5 w-5" />,
      label: 'Date',
      value: 'Oct 18–19, 2025',
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: 'Duration',
      value: '48 hours',
    },
    { icon: <Globe className="h-5 w-5" />, label: 'Format', value: 'Online' },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Team size',
      value: 'Solo or up to 4',
    },
    {
      icon: <Target className="h-5 w-5" />,
      label: 'Judging',
      value: 'Async with optional pitch',
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      label: 'Results',
      value: 'Mid-November ceremony',
    },
  ];

  const whoJoins = [
    'Anyone, anywhere',
    'No age, no filters',
    'Teams up to 4 or solo',
    'Beginners welcome',
    'No-coders welcome',
    'Designers welcome',
    'Tinkerers welcome',
    'No prep, no pressure',
  ];

  const techRules = [
    'Any stack, any tool',
    'AI tools allowed',
    'No-code allowed',
    'Cursed workflows encouraged',
    'Plagiarism = disqualification',
    'Must include code or files',
    'Short readme required',
    'Optional 60s video',
  ];

  const funAwards = [
    'Most cursed build',
    "Shouldn't have worked but did",
    'Built while sleep-deprived',
    'Best bug that became a feature',
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <SEO
        title="Maximally Codepocalypse 2025 - 48 Hour Chaos Hackathon"
        description="What would you build if the internet had 48 hours left? 48-hour chaotic hackathon. Oct 18-19, 2025. Grand Indian Hackathon Season."
        keywords="hackathon, chaos coding, apocalypse theme, 48 hour hackathon, broken prototypes, cursed ideas, code competition"
      />

      {/* Apocalyptic Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* Glitch sparks */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`spark-${i}`}
            className="absolute opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `glitch ${1 + Math.random() * 2}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <Zap className="h-4 w-4 text-red-500" />
          </div>
        ))}

        {/* Scattered arrows */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`arrow-${i}`}
            className="absolute opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `drift ${4 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <div className="w-8 h-1 bg-yellow-400 relative">
              <div className="absolute right-0 top-0 w-0 h-0 border-l-4 border-l-yellow-400 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
            </div>
          </div>
        ))}

        {/* Distressed texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900 opacity-90"></div>

        {/* Nuclear warning symbols */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`warning-${i}`}
            className="absolute opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `pulse ${3 + Math.random() * 2}s infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center relative px-4 pt-32">
          {/* Badge */}
          <div
            className={`mb-6 transform transition-all duration-1000 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="bg-red-600 text-yellow-400 px-6 py-2 border-4 border-yellow-400 shadow-2xl relative">
              <span className="font-press-start text-xs">
                ☢ GRAND INDIAN HACKATHON SEASON ☢
              </span>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-red-600"></div>
            </div>
          </div>

          {/* Title with apocalyptic styling */}
          <div
            className={`text-center mb-8 transform transition-all duration-1000 delay-200 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            <h1 className="font-press-start text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              <span className="text-red-500 drop-shadow-2xl filter brightness-110">
                MAXIMALLY
              </span>
              <br />
              <span className="text-yellow-400 drop-shadow-2xl relative">
                CODEPOCALYPSE
                <div className="absolute -top-2 -right-2 text-red-500 text-xs opacity-70">
                  ⚡
                </div>
              </span>
            </h1>
            <h2 className="font-jetbrains text-xl md:text-2xl text-gray-300 mb-4 font-bold">
              48 hour online hackathon
            </h2>
            <div className="bg-black border-4 border-red-500 p-4 inline-block max-w-2xl">
              <p className="font-press-start text-base md:text-lg text-yellow-400 leading-relaxed">
                "what would you build if the internet had 48 hours left?"
              </p>
            </div>
          </div>

          {/* CTAs with brutal styling */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-400 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            <Button
              onClick={() => window.open('https://codepocalypse.devpost.com/', '_self')}
              className="bg-red-600 text-white font-press-start py-4 px-8 text-lg hover:scale-105 transition-all duration-300 border-4 border-yellow-400 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-700 transform skew-x-12 -translate-x-full hover:translate-x-0 transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center">
                <Flame className="h-5 w-5 mr-2" />
                REGISTER NOW
              </span>
            </Button>
            <Button
              onClick={() =>
                document
                  .getElementById('prizes')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="bg-black text-yellow-400 font-press-start py-4 px-8 text-lg hover:scale-105 transition-all duration-300 border-4 border-red-500 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gray-900 transform skew-x-12 -translate-x-full hover:translate-x-0 transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                VIEW PRIZES
              </span>
            </Button>
          </div>

          {/* Apocalyptic decoration */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-6 opacity-60">
              <Skull className="h-8 w-8 text-red-500 animate-pulse" />
              <AlertTriangle className="h-8 w-8 text-yellow-400 animate-bounce" />
              <Flame className="h-8 w-8 text-red-500 animate-pulse" />
            </div>
          </div>
        </section>

        {/* Fast Facts Bar */}
        <section className="py-8 bg-red-900 border-y-4 border-yellow-400 relative">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {fastFacts.map((fact, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center mb-2 text-yellow-400 group-hover:text-white transition-colors">
                    {fact.icon}
                  </div>
                  <div className="font-press-start text-xs text-white mb-1">
                    {fact.label}
                  </div>
                  <div className="font-jetbrains text-sm text-yellow-400 font-bold">
                    {fact.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What It Is */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-press-start text-3xl md:text-4xl mb-8 text-red-500 flex items-center justify-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
              WHAT IT IS
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </h2>
            <div className="bg-black border-4 border-red-500 p-8 relative">
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-red-500"></div>
              <p className="font-jetbrains text-lg md:text-xl text-gray-300 leading-relaxed">
                A chaotic 48-hour hackathon where the only rule is to ship
                something wild. Broken prototypes, cursed ideas, internet-core
                genius — all collide here. No themes, no prep. Just code, crash,
                and deploy.
              </p>
            </div>
          </div>
        </section>

        {/* The Idea */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-900 via-black to-gray-900">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-press-start text-3xl md:text-4xl mb-8 text-yellow-400 flex items-center justify-center gap-3">
              <Skull className="h-8 w-8 text-red-500" />
              THE IDEA
              <Skull className="h-8 w-8 text-red-500" />
            </h2>
            <div className="bg-red-900 border-4 border-yellow-400 p-8 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400"></div>
              <p className="font-jetbrains text-lg md:text-xl text-gray-200 leading-relaxed">
                This event asks one question — what would you build if you had
                48 hours before the internet exploded? Codepocalypse is a love
                letter to bizarre, ambitious, half-baked builds. No neat slides.
                No neat stacks. Just mayhem and maybe magic.
              </p>
            </div>
          </div>
        </section>

        {/* Who Joins */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-12 text-red-500 text-center flex items-center justify-center gap-3">
              <Users className="h-8 w-8 text-yellow-400" />
              WHO JOINS
              <Users className="h-8 w-8 text-yellow-400" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {whoJoins.map((person, index) => (
                <div
                  key={index}
                  className="bg-black border-2 border-red-500 p-4 hover:border-yellow-400 transition-all duration-300 hover:scale-105 relative"
                >
                  <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500"></div>
                    <span className="font-jetbrains text-gray-300 font-medium">
                      {person}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Rules */}
        <section className="py-20 px-4 bg-gradient-to-b from-black via-red-900 to-black">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-12 text-yellow-400 text-center flex items-center justify-center gap-3">
              <Code className="h-8 w-8 text-red-500" />
              TECH RULES
              <Code className="h-8 w-8 text-red-500" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {techRules.map((rule, index) => (
                <div
                  key={index}
                  className="bg-black border-l-4 border-yellow-400 p-4 hover:bg-gray-900 transition-colors duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rotate-45"></div>
                    <span className="font-jetbrains text-gray-300">{rule}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prizes */}
        <section id="prizes" className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-8 text-red-500 text-center flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-400" />
              PRIZES & PERKS
              <Trophy className="h-8 w-8 text-yellow-400" />
            </h2>

            {/* Cash Pool */}
            <div className="text-center mb-8">
              <div className="bg-yellow-400 text-black px-8 py-4 border-4 border-red-500 inline-block relative">
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-black"></div>
                <span className="font-press-start text-xl">
                  CASH POOL: ₹5000
                </span>
              </div>
            </div>

            {/* Perks */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-black border-4 border-yellow-400">
                <CardContent className="p-6">
                  <h3 className="font-press-start text-xl text-yellow-400 mb-4">
                    PERKS
                  </h3>
                  <ul className="space-y-2">
                    <li className="font-jetbrains text-gray-300 flex items-center gap-2">
                      <Star className="h-4 w-4 text-red-500" />
                      LORs from elite judges
                    </li>
                    <li className="font-jetbrains text-gray-300 flex items-center gap-2">
                      <Star className="h-4 w-4 text-red-500" />
                      Feature on wall of fame
                    </li>
                    <li className="font-jetbrains text-gray-300 flex items-center gap-2">
                      <Star className="h-4 w-4 text-red-500" />
                      Internship referrals
                    </li>
                    <li className="font-jetbrains text-gray-300 flex items-center gap-2">
                      <Star className="h-4 w-4 text-red-500" />
                      Maximally socials shoutouts
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-red-900 border-4 border-yellow-400">
                <CardContent className="p-6">
                  <h3 className="font-press-start text-xl text-yellow-400 mb-4">
                    FUN AWARDS
                  </h3>
                  <ul className="space-y-2">
                    {funAwards.map((award, index) => (
                      <li
                        key={index}
                        className="font-jetbrains text-gray-200 flex items-center gap-2"
                      >
                        <Skull className="h-4 w-4 text-yellow-400" />
                        {award}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Judging */}
        <section className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-8 text-yellow-400 text-center flex items-center justify-center gap-3">
              <Shield className="h-8 w-8 text-red-500" />
              JUDGING
              <Shield className="h-8 w-8 text-red-500" />
            </h2>
            <div className="bg-black border-4 border-red-500 p-8 relative">
              <div className="absolute -top-1 left-4 right-4 h-2 bg-yellow-400"></div>
              <div className="mb-6">
                <h3 className="font-press-start text-lg text-yellow-400 mb-4">
                  REVIEWERS
                </h3>
                <p className="font-jetbrains text-gray-300">
                  Async judging by external reviewers from top companies
                  (OpenAI, Meta, etc.)
                </p>
              </div>
              <div>
                <h3 className="font-press-start text-lg text-yellow-400 mb-4">
                  CRITERIA
                </h3>
                <p className="font-jetbrains text-gray-300">
                  Scored on originality, execution, technical complexity (or
                  no-code creativity), and gut reaction —{' '}
                  <span className="text-yellow-400 font-bold">
                    is this insane and awesome?
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Submission */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-12 text-red-500 text-center flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-yellow-400" />
              SUBMISSION
              <FileText className="h-8 w-8 text-yellow-400" />
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-900 border-4 border-yellow-400 p-6 relative">
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 flex items-center justify-center">
                  <span className="font-press-start text-xs text-black">!</span>
                </div>
                <h3 className="font-press-start text-xl text-yellow-400 mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  REQUIRED
                </h3>
                <ul className="space-y-3">
                  <li className="font-jetbrains text-gray-200 flex items-start gap-2">
                    <span className="text-yellow-400">▸</span>
                    Code/files
                  </li>
                  <li className="font-jetbrains text-gray-200 flex items-start gap-2">
                    <span className="text-yellow-400">▸</span>
                    Short readme
                  </li>
                  <li className="font-jetbrains text-gray-200 flex items-start gap-2">
                    <span className="text-yellow-400">▸</span>
                    Link to output
                  </li>
                </ul>
              </div>

              <div className="bg-black border-4 border-red-500 p-6 relative">
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-red-500 flex items-center justify-center">
                  <span className="font-press-start text-xs text-white">?</span>
                </div>
                <h3 className="font-press-start text-xl text-red-500 mb-6 flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  OPTIONAL
                </h3>
                <ul className="space-y-3">
                  <li className="font-jetbrains text-gray-300 flex items-start gap-2">
                    <span className="text-red-500">▸</span>
                    60s demo video
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-gradient-to-r from-red-900 via-black to-red-900 p-12 border-4 border-yellow-400 relative">
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="relative z-10">
                <h2 className="font-press-start text-2xl md:text-3xl mb-6 text-white">
                  READY FOR THE CODEPOCALYPSE?
                </h2>
                <p className="font-jetbrains text-gray-300 mb-8">
                  Join the chaos. Build something wild. Ship before the world
                  ends.
                </p>
                <button
                  onClick={() => window.open('https://codepocalypse.devpost.com/', '_self')}
                  className="bg-yellow-400 text-black font-bold py-3 px-4 sm:py-6 sm:px-12 text-xs sm:text-base md:text-lg lg:text-xl hover:scale-105 transition-all duration-300 border-2 sm:border-4 border-red-500 shadow-2xl relative overflow-hidden w-full sm:w-auto max-w-sm sm:max-w-none"
                >
                  <div className="absolute inset-0 bg-red-500 transform skew-x-12 -translate-x-full hover:translate-x-0 transition-transform duration-300"></div>
                  <span className="relative z-10 flex items-center justify-center text-black">
                    <Flame className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 flex-shrink-0" />
                    ENTER THE APOCALYPSE
                    <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ml-2 flex-shrink-0" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
