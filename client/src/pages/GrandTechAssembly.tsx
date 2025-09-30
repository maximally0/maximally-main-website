import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Target,
  Clock,
  Globe,
  Users,
  Code,
  Star,
  Trophy,
  Zap,
  Gamepad2,
  Map,
  Shield,
  Crown,
  MessageSquare,
  ExternalLink,
  FileText,
  Video,
  Flame,
  Bot,
} from 'lucide-react';

export default function GrandTechAssembly() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fastFacts = [
    {
      icon: <Clock className="h-5 w-5" />,
      label: 'Date',
      value: 'Nov 1–7, 2025',
    },
    { icon: <Clock className="h-5 w-5" />, label: 'Duration', value: '7 days' },
    {
      icon: <Globe className="h-5 w-5" />,
      label: 'Format',
      value: 'Online, Devpost submissions',
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Team size',
      value: 'Solo or up to 4',
    },
    { icon: <Globe className="h-5 w-5" />, label: 'Region', value: 'Global' },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: 'Comms',
      value: 'Discord',
    },
  ];

  const whoJoins = [
    'Anyone anywhere',
    'Beginners and no-coders',
    'Designers',
    'Hackers',
    'Indie makers',
    'No prep needed',
    'Any stack works',
  ];

  const howItWorksSteps = [
    {
      step: 1,
      title: 'Pick a mission track, then add side quests if you like.',
      icon: <Target className="h-6 w-6" />,
    },
    {
      step: 2,
      title: 'Build your "city" project during the week.',
      icon: <Map className="h-6 w-6" />,
    },
    {
      step: 3,
      title: 'Submit on Devpost with links and a short writeup.',
      icon: <FileText className="h-6 w-6" />,
    },
    {
      step: 4,
      title: 'Optional 60s video pitch.',
      icon: <Video className="h-6 w-6" />,
    },
  ];

  const missionTracks = [
    {
      name: 'The Heist',
      description: 'Automation, AI, time or resource saving',
      icon: <Bot className="h-8 w-8" />,
      color: 'bg-green-500',
      textColor: 'text-green-400',
    },
    {
      name: 'Street Hustle',
      description: 'Scrappy fast MVPs, memes, tools',
      icon: <Zap className="h-8 w-8" />,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-400',
    },
    {
      name: 'Chaos Mode',
      description: 'Cursed, weird, experimental, art-tech',
      icon: <Flame className="h-8 w-8" />,
      color: 'bg-purple-500',
      textColor: 'text-purple-400',
    },
    {
      name: 'Rise to Power',
      description: 'Ambitious, startup-scale builds',
      icon: <Crown className="h-8 w-8" />,
      color: 'bg-red-500',
      textColor: 'text-red-400',
    },
    {
      name: 'Vice Streets',
      description: 'Beginner lane, no-code and first projects',
      icon: <Shield className="h-8 w-8" />,
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
    },
  ];

  const sideQuests = [
    'Meme contest',
    '3 hour speed build',
    'Chaos drop',
    'Funniest demo',
  ];

  const timeline = [
    {
      date: 'Nov 1',
      time: '12:00 AM IST',
      event: 'Start',
      icon: <Star className="h-5 w-5" />,
    },
    {
      date: 'Nov 3',
      time: 'TBD',
      event: 'Side quest drops',
      icon: <Target className="h-5 w-5" />,
    },
    {
      date: 'Nov 5',
      time: 'TBD',
      event: 'Side quest drops',
      icon: <Target className="h-5 w-5" />,
    },
    {
      date: 'Nov 7',
      time: '11:59 PM IST',
      event: 'Submissions close',
      icon: <Clock className="h-5 w-5" />,
    },
    {
      date: 'Mid Nov',
      time: 'TBD',
      event: 'Winners at Grand Ceremony',
      icon: <Trophy className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <SEO
        title="Grand Tech Assembly 2025 - GTA-Themed 7-Day Hackathon"
        description="Pick your mission, build your city, earn respect. 7-day GTA-themed hackathon. Nov 1-7, 2025. Grand Indian Hackathon Season."
        keywords="GTA hackathon, mission tracks, 7 day hackathon, Grand Tech Assembly, coding missions, tech competition"
      />

      {/* GTA Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* City grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {[...Array(144)].map((_, i) => (
              <div
                key={i}
                className="border border-green-400 border-opacity-20"
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center relative px-4 pt-20">
          {/* Badge */}
          <div
            className={`mb-6 transform transition-all duration-1000 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="bg-red-600 text-yellow-400 px-6 py-2 border-2 border-green-400 relative">
              <span className="font-press-start text-xs">
                🎮 GRAND INDIAN HACKATHON SEASON 🎮
              </span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400"></div>
            </div>
          </div>

          {/* Title with GTA styling */}
          <div
            className={`text-center mb-8 transform transition-all duration-1000 delay-200 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            <h1 className="font-press-start text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              <span className="text-red-500 drop-shadow-2xl">GRAND</span>
              <br />
              <span className="text-yellow-400 drop-shadow-2xl">TECH</span>
              <span className="text-green-400 drop-shadow-2xl"> ASSEMBLY</span>
            </h1>
            <h2 className="font-jetbrains text-xl md:text-2xl text-gray-300 mb-4 font-bold">
              7 day online GTA-themed hackathon
            </h2>
            <div className="bg-gray-800 border-2 border-purple-400 p-4 inline-block max-w-2xl">
              <p className="font-press-start text-base md:text-lg text-green-400 leading-relaxed">
                Pick your mission, build your city, earn respect.
              </p>
            </div>
          </div>

          {/* Mission icons decoration */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-6 opacity-60">
              <div className="bg-gray-800 p-2 border border-green-400">
                <Target className="h-6 w-6 text-green-400" />
              </div>
              <div className="bg-gray-800 p-2 border border-purple-400">
                <Map className="h-6 w-6 text-purple-400" />
              </div>
              <div className="bg-gray-800 p-2 border border-yellow-400">
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* CTAs with mission-style design */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-400 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            <Button
              onClick={() => window.open('https://gta-maximally.devpost.com/', '_self')}
              className="bg-green-500 text-black font-press-start py-4 px-8 text-lg hover:scale-105 transition-all duration-300 border-2 border-purple-400 shadow-xl relative overflow-hidden z-50"
            >
              <div className="absolute inset-0 bg-green-600 transform skew-x-6 -translate-x-full hover:translate-x-0 transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center">
                <Gamepad2 className="h-5 w-5 mr-2" />
                REGISTER NOW
              </span>
            </Button>
            <Button
              onClick={() =>
                window.open('https://discord.gg/WmSXVzDYuq', '_self')
              }
              className="bg-purple-500 text-white font-press-start py-4 px-8 text-lg hover:scale-105 transition-all duration-300 border-2 border-green-400 shadow-xl relative overflow-hidden z-50"
            >
              <div className="absolute inset-0 bg-purple-600 transform skew-x-6 -translate-x-full hover:translate-x-0 transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                JOIN DISCORD
              </span>
            </Button>
          </div>
        </section>

        {/* Fast Facts Bar */}
        <section className="py-8 bg-gray-900 border-y-2 border-green-400 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-transparent to-purple-400/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {fastFacts.map((fact, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center mb-2 text-green-400 group-hover:text-purple-400 transition-colors">
                    {fact.icon}
                  </div>
                  <div className="font-press-start text-xs text-gray-300 mb-1">
                    {fact.label}
                  </div>
                  <div className="font-jetbrains text-sm text-green-400 font-bold">
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
            <h2 className="font-press-start text-3xl md:text-4xl mb-8 text-green-400 flex items-center justify-center gap-3">
              <Gamepad2 className="h-8 w-8 text-purple-400" />
              WHAT IT IS
              <Gamepad2 className="h-8 w-8 text-purple-400" />
            </h2>
            <div className="bg-gray-900 border-2 border-green-400 p-8 relative">
              <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-purple-400 to-green-400"></div>
              <p className="font-jetbrains text-lg md:text-xl text-gray-300 leading-relaxed">
                A 7 day global online hackathon styled after Grand Theft Auto.
                Not crime, just missions, respect, and chaos. Open world vibe.
                You choose your path.
              </p>
            </div>
          </div>
        </section>

        {/* Who Joins */}
        <section className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-12 text-purple-400 text-center flex items-center justify-center gap-3">
              <Users className="h-8 w-8 text-green-400" />
              WHO JOINS
              <Users className="h-8 w-8 text-green-400" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {whoJoins.map((person, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-purple-400 p-4 hover:border-green-400 hover:scale-105 transition-all duration-300 relative"
                >
                  <div className="absolute top-0 right-0 w-2 h-2 bg-green-400"></div>
                  <div className="flex items-center gap-3">
                    <Star
                      className="h-4 w-4 text-yellow-400"
                      fill="currentColor"
                    />
                    <span className="font-jetbrains text-gray-300 font-medium">
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
            <h2 className="font-press-start text-3xl md:text-4xl mb-12 text-green-400 text-center flex items-center justify-center gap-3">
              <Map className="h-8 w-8 text-purple-400" />
              HOW IT WORKS
              <Map className="h-8 w-8 text-purple-400" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {howItWorksSteps.map((step, index) => (
                <Card
                  key={index}
                  className="bg-gray-900 border-2 border-green-400 hover:border-purple-400 hover:scale-105 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-500 text-black w-12 h-12 border border-purple-400 flex items-center justify-center font-press-start text-lg flex-shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <div className="text-purple-400 mb-2">{step.icon}</div>
                        <p className="font-jetbrains text-gray-300 leading-relaxed">
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

        {/* Mission Tracks */}
        <section className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="container mx-auto max-w-6xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-12 text-yellow-400 text-center flex items-center justify-center gap-3">
              <Target className="h-8 w-8 text-green-400" />
              MISSION TRACKS
              <Target className="h-8 w-8 text-green-400" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {missionTracks.map((track, index) => (
                <Card
                  key={index}
                  className="bg-gray-800 border-2 border-gray-600 hover:border-green-400 hover:scale-105 transition-all duration-300 relative"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`${track.color} text-white w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 border-2 border-gray-700`}
                    >
                      {track.icon}
                    </div>
                    <h3
                      className={`font-press-start text-lg ${track.textColor} mb-3 leading-tight`}
                    >
                      {track.name}
                    </h3>
                    <p className="font-jetbrains text-gray-300 text-sm">
                      {track.description}
                    </p>
                    <div className="absolute top-2 right-2">
                      <Star
                        className="h-4 w-4 text-yellow-400"
                        fill="currentColor"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Side Quests */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-12 text-purple-400 text-center flex items-center justify-center gap-3">
              <Zap className="h-8 w-8 text-yellow-400" />
              SIDE QUESTS
              <Zap className="h-8 w-8 text-yellow-400" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sideQuests.map((quest, index) => (
                <div
                  key={index}
                  className="bg-purple-900 border border-purple-400 p-4 hover:bg-purple-800 transition-colors duration-300 relative"
                >
                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-green-400"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-yellow-400 flex items-center justify-center">
                      <span className="font-press-start text-xs text-black">
                        ?
                      </span>
                    </div>
                    <span className="font-jetbrains text-gray-300 font-medium">
                      {quest}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 px-4 bg-gray-900">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-12 text-green-400 text-center flex items-center justify-center gap-3">
              <Clock className="h-8 w-8 text-purple-400" />
              TIMELINE
              <Clock className="h-8 w-8 text-purple-400" />
            </h2>
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-6 bg-gray-800 border border-green-400 p-6 hover:border-purple-400 transition-colors duration-300"
                >
                  <div className="text-center flex-shrink-0">
                    <div className="font-press-start text-lg text-green-400">
                      {item.date}
                    </div>
                    <div className="font-jetbrains text-sm text-gray-400">
                      {item.time}
                    </div>
                  </div>
                  <div className="text-purple-400">{item.icon}</div>
                  <div className="w-px h-12 bg-gradient-to-b from-green-400 to-purple-400"></div>
                  <div className="font-jetbrains text-gray-300 text-lg">
                    {item.event}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Judging */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-8 text-purple-400 text-center flex items-center justify-center gap-3">
              <Crown className="h-8 w-8 text-yellow-400" />
              JUDGING
              <Crown className="h-8 w-8 text-yellow-400" />
            </h2>
            <div className="bg-gray-800 border-2 border-purple-400 p-8 relative">
              <div className="absolute -top-1 left-4 right-4 h-2 bg-gradient-to-r from-green-400 to-purple-400"></div>
              <div className="mb-6">
                <h3 className="font-press-start text-lg text-green-400 mb-4">
                  MODE
                </h3>
                <p className="font-jetbrains text-gray-300">
                  Async on Devpost, judges are City Kingpins
                </p>
              </div>
              <div className="mb-6">
                <h3 className="font-press-start text-lg text-green-400 mb-4">
                  CRITERIA
                </h3>
                <p className="font-jetbrains text-gray-300">
                  Originality, execution, creativity (including no-code), gut
                  feel that it screams GTA chaos
                </p>
              </div>
              <div>
                <h3 className="font-press-start text-lg text-green-400 mb-4">
                  FEEDBACK
                </h3>
                <p className="font-jetbrains text-gray-300">
                  Short written notes for teams
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Submission */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-press-start text-3xl md:text-4xl mb-12 text-green-400 text-center flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-purple-400" />
              SUBMISSION
              <FileText className="h-8 w-8 text-purple-400" />
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-900 border-2 border-green-400 p-6 relative">
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-400 flex items-center justify-center">
                  <span className="font-press-start text-xs text-white">!</span>
                </div>
                <h3 className="font-press-start text-xl text-green-400 mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  REQUIRED
                </h3>
                <ul className="space-y-3">
                  <li className="font-jetbrains text-gray-200 flex items-start gap-2">
                    <span className="text-green-400">▸</span>
                    Link to repo or build
                  </li>
                  <li className="font-jetbrains text-gray-200 flex items-start gap-2">
                    <span className="text-green-400">▸</span>
                    Short writeup on what changed or why it matters
                  </li>
                </ul>
              </div>

              <div className="bg-purple-900 border-2 border-purple-400 p-6 relative">
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-green-400 flex items-center justify-center">
                  <span className="font-press-start text-xs text-black">?</span>
                </div>
                <h3 className="font-press-start text-xl text-purple-400 mb-6 flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  OPTIONAL
                </h3>
                <ul className="space-y-3">
                  <li className="font-jetbrains text-gray-200 flex items-start gap-2">
                    <span className="text-purple-400">▸</span>
                    60s demo video
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-gray-800 border border-yellow-400 p-4">
              <p className="font-jetbrains text-gray-300 text-sm">
                <span className="text-yellow-400 font-bold">Note:</span>{' '}
                Plagiarism without change is not allowed, credit sources when
                used
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-12 border-2 border-green-400 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-transparent to-purple-400/10"></div>
              <div className="relative z-10">
                <h2 className="font-press-start text-2xl md:text-3xl mb-6 text-green-400">
                  READY TO RUN THE CITY?
                </h2>
                <p className="font-jetbrains text-gray-300 mb-8">
                  Choose your mission. Build your empire. Earn respect in the
                  streets.
                </p>
                <Button
                  onClick={() => window.open('https://gta-maximally.devpost.com/', '_self')}
                  className="bg-purple-500 text-white font-press-start py-4 px-6 md:py-6 md:px-12 text-sm md:text-xl hover:scale-105 transition-all duration-300 border-2 border-green-400 shadow-xl relative overflow-hidden z-50 w-full max-w-sm mx-auto"
                >
                  <div className="absolute inset-0 bg-green-500 transform skew-x-6 -translate-x-full hover:translate-x-0 transition-transform duration-300"></div>
                  <span className="relative z-10 flex items-center justify-center text-white">
                    <Gamepad2 className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-3" />
                    START YOUR MISSION
                    <ExternalLink className="h-4 w-4 md:h-6 md:w-6 ml-2 md:ml-3" />
                  </span>
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
