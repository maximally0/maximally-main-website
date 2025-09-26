import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Zap,
  Users,
  Clock,
  Globe,
  Code,
  Sparkles,
  MessageSquare,
  Trophy,
  Target,
  Star,
  ExternalLink,
  FileText,
  Video,
} from 'lucide-react';

export default function PromptStorm() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fastFacts = [
    { icon: <Clock className="h-5 w-5" />, label: 'Date', value: 'Oct 25–26' },
    { icon: <Zap className="h-5 w-5" />, label: 'Duration', value: '24 hours' },
    { icon: <Globe className="h-5 w-5" />, label: 'Format', value: 'Online' },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Team size',
      value: 'Solo or up to 4',
    },
    {
      icon: <Code className="h-5 w-5" />,
      label: 'Tools',
      value: 'Any AI tool allowed',
    },
    { icon: <Globe className="h-5 w-5" />, label: 'Region', value: 'Global' },
  ];

  const whoJoins = [
    'AI tinkerers',
    'Writers',
    'Designers',
    'Coders',
    'No-coders',
    'Beginners who want a simple way to compete',
  ];

  const howItWorksSteps = [
    {
      step: 1,
      title: 'Register and join the kickoff space',
      icon: <Users className="h-6 w-6" />,
    },
    {
      step: 2,
      title:
        'Pick a direction. Visuals, code, stories, audio, games, anything AI-generated.',
      icon: <Target className="h-6 w-6" />,
    },
    {
      step: 3,
      title: 'Make prompts the core. Iterate fast, keep logs.',
      icon: <MessageSquare className="h-6 w-6" />,
    },
    {
      step: 4,
      title: 'Submit on time with links and your best prompt examples.',
      icon: <FileText className="h-6 w-6" />,
    },
  ];

  const rules = [
    'Prompts must be central to the build',
    'Keep it SFW and non-harmful',
    'Team work is allowed, outside assets must be credited',
    'Share prompt logs or representative prompts',
  ];

  const timeline = [
    { date: 'Oct 25', time: '12:00 AM IST', event: 'Start' },
    { date: 'Oct 26', time: '12:00 AM IST', event: 'End' },
    { date: 'Nov 2025', time: 'TBD', event: 'Winners announced' },
  ];

  const judgingCriteria = [
    { criteria: 'Prompt creativity', weight: '30%' },
    { criteria: 'Output quality', weight: '25%' },
    { criteria: 'Novel use of tools', weight: '20%' },
    { criteria: 'Execution', weight: '15%' },
    { criteria: 'Presentation', weight: '10%' },
  ];

  const prizes = [
    {
      title: 'PromptStorm Champion',
      prize: '₹3000 + LOR + social feature',
      icon: <Trophy className="h-8 w-8 text-yellow-400" />,
    },
    {
      title: 'Most Unexpected Output',
      prize: '₹2000',
      icon: <Sparkles className="h-8 w-8 text-blue-400" />,
    },
    {
      title: 'Judge Mentions',
      prize: 'zine feature + shoutouts',
      icon: <Star className="h-8 w-8 text-purple-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <SEO
        title="Maximally PromptStorm 2025 - AI Prompt Engineering Hackathon"
        description="24-hour AI prompt-engineering hackathon. When in doubt, prompt harder. Part of the Grand Indian Hackathon Season. Oct 25-26, 2025."
        keywords="AI hackathon, prompt engineering, AI tools, ChatGPT, Claude, Midjourney, prompt competition, AI creativity"
      />

      {/* Electric Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* Lightning bolts */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`lightning-${i}`}
            className="absolute opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `pulse ${2 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <Zap className="h-8 w-8 text-blue-400" />
          </div>
        ))}

        {/* Sparkles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${3 + Math.random() * 2}s infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <Sparkles className="h-4 w-4 text-yellow-400" />
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
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-full border-2 border-yellow-400 text-center">
              <span className="font-press-start text-xs">
                ⚡ GRAND INDIAN HACKATHON SEASON ⚡
              </span>
            </div>
          </div>

          {/* Title */}
          <div
            className={`text-center mb-8 transform transition-all duration-1000 delay-200 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            <h1 className="font-press-start text-4xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500 bg-clip-text text-transparent leading-tight">
              MAXIMALLY
              <br />
              PROMPTSTORM
            </h1>
            <h2 className="font-jetbrains text-xl md:text-2xl text-blue-400 mb-4">
              24 hour online prompt-engineering hackathon
            </h2>
            <p className="font-press-start text-lg md:text-xl text-yellow-400">
              When in doubt, prompt harder.
            </p>
          </div>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-400 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            <Button
              onClick={() => window.open('https://maximally-promptstorm.devpost.com/', '_self')}
              className="pixel-button bg-gradient-to-r from-blue-500 to-blue-600 text-white font-press-start py-4 px-8 text-lg hover:scale-105 transition-all duration-300 border-2 border-yellow-400 shadow-xl"
            >
              <Zap className="h-5 w-5 mr-2" />
              REGISTER NOW
            </Button>
            <Button
              onClick={() =>
                document
                  .getElementById('rules')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="pixel-button bg-gradient-to-r from-gray-900 to-black text-yellow-400 font-press-start py-4 px-8 text-lg hover:scale-105 transition-all duration-300 border-2 border-blue-400 shadow-xl"
            >
              <FileText className="h-5 w-5 mr-2" />
              READ RULES
            </Button>
          </div>

          {/* Electric decoration */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-4 opacity-60">
              <MessageSquare
                className="h-6 w-6 text-blue-400 animate-bounce"
                style={{ animationDelay: '0s' }}
              />
              <Code
                className="h-6 w-6 text-yellow-400 animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              <Sparkles
                className="h-6 w-6 text-red-500 animate-bounce"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          </div>
        </section>

        {/* Fast Facts Bar */}
        <section className="py-8 bg-gradient-to-r from-blue-600/20 via-black to-yellow-600/20 border-y-2 border-blue-400">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {fastFacts.map((fact, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center mb-2 text-blue-400 group-hover:text-yellow-400 transition-colors">
                    {fact.icon}
                  </div>
                  <div className="font-press-start text-xs text-white mb-1">
                    {fact.label}
                  </div>
                  <div className="font-jetbrains text-sm text-blue-400 font-bold">
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
            <h2 className="font-press-start text-3xl md:text-4xl mb-8 text-blue-400 flex items-center justify-center gap-3">
              <Zap className="h-8 w-8 text-yellow-400" />
              WHAT IT IS
              <Zap className="h-8 w-8 text-yellow-400" />
            </h2>
            <div className="bg-gradient-to-br from-blue-900/30 to-black p-8 rounded-lg border-2 border-blue-400">
              <p className="font-jetbrains text-lg md:text-xl text-white leading-relaxed">
                A 24 hour AI prompt-engineering hackathon where speed,
                creativity, and a bit of chaos collide. Bend tools to your will.
                Make prompts that hit. No code needed, ideas welcome.
              </p>
            </div>
          </div>
        </section>

        {/* Who Joins */}
        <section className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-12 text-yellow-400 text-center flex items-center justify-center gap-3">
              <Users className="h-8 w-8 text-blue-400" />
              WHO JOINS
              <Users className="h-8 w-8 text-blue-400" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {whoJoins.map((person, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-yellow-600/20 to-black p-4 rounded-lg border border-yellow-400 hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                    <span className="font-jetbrains text-white font-medium">
                      {person}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-12 text-blue-400 text-center flex items-center justify-center gap-3">
              <Target className="h-8 w-8 text-yellow-400" />
              HOW IT WORKS
              <Target className="h-8 w-8 text-yellow-400" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {howItWorksSteps.map((step, index) => (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-blue-900/30 to-black border-2 border-blue-400 hover:scale-105 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black w-12 h-12 rounded-full flex items-center justify-center font-press-start text-lg flex-shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <div className="text-blue-400 mb-2">{step.icon}</div>
                        <p className="font-jetbrains text-white leading-relaxed">
                          {step.title}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Rules */}
        <section
          id="rules"
          className="py-20 px-4 bg-gradient-to-b from-black via-red-900/10 to-black"
        >
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-12 text-red-500 text-center flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-yellow-400" />
              RULES
              <FileText className="h-8 w-8 text-yellow-400" />
            </h2>
            <div className="grid gap-4">
              {rules.map((rule, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-red-900/30 to-black p-4 rounded-lg border border-red-500 hover:border-yellow-400 transition-colors duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white font-press-start text-xs">
                      {index + 1}
                    </div>
                    <span className="font-jetbrains text-white">{rule}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-12 text-yellow-400 text-center flex items-center justify-center gap-3">
              <Clock className="h-8 w-8 text-blue-400" />
              TIMELINE
              <Clock className="h-8 w-8 text-blue-400" />
            </h2>
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-6 bg-gradient-to-r from-yellow-600/20 to-black p-6 rounded-lg border border-yellow-400"
                >
                  <div className="text-center flex-shrink-0">
                    <div className="font-press-start text-lg text-yellow-400">
                      {item.date}
                    </div>
                    <div className="font-jetbrains text-sm text-blue-400">
                      {item.time}
                    </div>
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-yellow-400 to-blue-400"></div>
                  <div className="font-jetbrains text-white text-lg">
                    {item.event}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Judging */}
        <section className="py-20 px-4 bg-gradient-to-b from-black via-purple-900/10 to-black">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-8 text-purple-400 text-center flex items-center justify-center gap-3">
              <Star className="h-8 w-8 text-yellow-400" />
              JUDGING
              <Star className="h-8 w-8 text-yellow-400" />
            </h2>
            <div className="bg-gradient-to-br from-purple-900/30 to-black p-8 rounded-lg border-2 border-purple-400 mb-8">
              <h3 className="font-press-start text-xl text-yellow-400 mb-6">
                CRITERIA
              </h3>
              <div className="grid gap-4">
                {judgingCriteria.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="font-jetbrains text-white">
                      {item.criteria}
                    </span>
                    <span className="font-press-start text-purple-400">
                      {item.weight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="font-jetbrains text-lg text-gray-300">
                <span className="text-yellow-400 font-bold">Judges:</span> AI
                builders, designers, creators
              </p>
            </div>
          </div>
        </section>

        {/* Prizes */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-8 text-yellow-400 text-center flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8 text-blue-400" />
              PRIZES
              <Trophy className="h-8 w-8 text-blue-400" />
            </h2>
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-6 py-3 rounded-full inline-block">
                <span className="font-press-start text-lg">
                  TOTAL POOL: ₹5000
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {prizes.map((prize, index) => (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-yellow-600/20 to-black border-2 border-yellow-400 hover:scale-105 transition-all duration-300"
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">{prize.icon}</div>
                    <h3 className="font-press-start text-lg text-white mb-3 leading-tight">
                      {prize.title}
                    </h3>
                    <p className="font-jetbrains text-yellow-400 font-bold">
                      {prize.prize}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Submission */}
        <section className="py-20 px-4 bg-gradient-to-b from-black via-blue-900/10 to-black">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-12 text-blue-400 text-center flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-yellow-400" />
              SUBMISSION
              <FileText className="h-8 w-8 text-yellow-400" />
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-900/30 to-black p-6 rounded-lg border-2 border-green-400">
                <h3 className="font-press-start text-xl text-green-400 mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  REQUIRED
                </h3>
                <ul className="space-y-3">
                  <li className="font-jetbrains text-white flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    Link to final output or repo
                  </li>
                  <li className="font-jetbrains text-white flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    Prompt logs or best examples
                  </li>
                  <li className="font-jetbrains text-white flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    Short write-up: what you tried, what worked, what surprised
                    you
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-900/30 to-black p-6 rounded-lg border-2 border-blue-400">
                <h3 className="font-press-start text-xl text-blue-400 mb-6 flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  OPTIONAL
                </h3>
                <ul className="space-y-3">
                  <li className="font-jetbrains text-white flex items-start gap-2">
                    <span className="text-blue-400">•</span>1 minute demo video
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-gradient-to-r from-blue-600/20 via-black to-red-600/20 p-8 md:p-12 rounded-lg border-2 border-yellow-400">
              <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl mb-6 text-white leading-relaxed">
                READY TO STORM THE PROMPTS?
              </h2>
              <div className="flex justify-center">
                <Button
                  onClick={() => window.open('https://maximally-promptstorm.devpost.com/', '_self')}
                  className="pixel-button bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-press-start py-5 px-6 sm:py-6 sm:px-8 md:py-6 md:px-12 text-sm sm:text-base md:text-xl hover:scale-105 transition-all duration-300 border-2 border-blue-400 shadow-xl min-h-[64px] sm:min-h-[72px] w-auto flex items-center justify-center gap-2 sm:gap-3"
                >
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0" />
                  <span className="whitespace-nowrap">REGISTER NOW</span>
                  <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
