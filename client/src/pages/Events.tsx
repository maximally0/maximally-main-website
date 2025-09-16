import {
  ArrowRight,
  MessageCircle,
  Calendar,
  ExternalLink,
  FileText,
  Trophy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';

const Events = () => {
  const upcomingEvents = [
    {
      name: 'Code Hypothesis',
      dates: 'September 2025',
      description: 'Test your coding theories in the ultimate development challenge',
      registerUrl: '/hackathon/codehypothesis',
      detailsUrl: '/hackathon/codehypothesis',
      icon: '🧪',
    },
    {
      name: 'Protocol 404',
      dates: 'October 2025',
      description: 'When the system is broken, build anyway',
      registerUrl: '/hackathon/protocol-404',
      detailsUrl: '/hackathon/protocol-404',
      icon: '⚡',
    },
    {
      name: 'Project CodeGen',
      dates: 'October 2025',
      description: 'Beyond hackathons - real project generation',
      registerUrl: '/hackathon/project-codegen',
      detailsUrl: '/hackathon/project-codegen',
      icon: '📝',
    },
    {
      name: 'Maximally Hacktober',
      dates: 'October 2025',
      description: "October's biggest hackathon celebration",
      registerUrl: '/hackathon/hacktober',
      detailsUrl: '/hackathon/hacktober',
      icon: '🍂',
    },
    {
      name: 'Maximally PromptStorm',
      dates: 'Oct 25-26, 2025',
      description: '24-hour AI prompt-engineering hackathon. When in doubt, prompt harder.',
      registerUrl: '/hackathon/prompt-storm',
      detailsUrl: '/hackathon/prompt-storm',
      icon: '⚡',
    },
    {
      name: 'Maximally Codepocalypse',
      dates: 'Oct 18-19, 2025',
      description: 'What would you build if the internet had 48 hours left? Chaotic 48-hour hackathon.',
      registerUrl: '/hackathon/codepocalypse',
      detailsUrl: '/hackathon/codepocalypse',
      icon: '☢️',
    },
    {
      name: 'Grand Tech Assembly',
      dates: 'Nov 1-7, 2025',
      description: 'Pick your mission, build your city, earn respect. 7-day GTA-themed hackathon.',
      registerUrl: '/hackathon/grand-tech-assembly',
      detailsUrl: '/hackathon/grand-tech-assembly',
      icon: '🎮',
    },
    {
      name: 'Maximally Steal-A-Thon',
      dates: 'Nov 9-10, 2025',
      description: "The only hackathon where original ideas are banned. If it ain't broke... steal it.",
      registerUrl: '/hackathon/steal-a-thon',
      detailsUrl: '/hackathon/steal-a-thon',
      icon: '🔥',
    },
  ];

  const pastEvents = [
    {
      name: 'Maximally Startup Makeathon',
      dates: 'July 2025',
      description: '7-day sprint from idea to MVP to public pitch',
      reportUrl: '/makeathon-report',
      icon: '🚀',
    },
    {
      name: 'Maximally AI Shipathon',
      dates: 'August 2025',
      description: '48-hour global AI hackathon for builders and creators',
      reportUrl: '/shipathon-report',
      icon: '🤖',
    },
  ];

  return (
    <>
      <SEO
        title="Events | The Grand Indian Hackathon Season | Maximally"
        description="Join the Grand Indian Hackathon Season - 10 hackathons from September to November. Experience the biggest innovation challenge series in India."
        keywords="hackathons India, Grand Indian Hackathon Season, coding competitions, innovation challenges, tech events India, student hackathons"
      />
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Pixel Grid Background */}
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating Pixels */}
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="fixed w-2 h-2 bg-maximally-red pixel-border animate-float pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + i * 0.2}s`,
            }}
          />
        ))}

        <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          {/* Header Section */}
          <section className="text-center mb-20">
            <div className="minecraft-block bg-maximally-red text-black px-6 py-3 inline-block mb-6">
              <span className="font-press-start text-sm">🇮🇳 GRAND INDIAN HACKATHON SEASON 2025</span>
            </div>
            <h1 className="font-press-start text-4xl md:text-6xl lg:text-7xl mb-6 text-maximally-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              10 HACKATHONS
            </h1>
            <p className="font-jetbrains text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              From September to November, we're hosting 10 hackathons back to back. Be a part of it. Join our Discord for all updates and community access.
            </p>
            <a
              href="https://discord.gg/MpBnYk8qMX"
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-button bg-maximally-red text-black font-press-start py-4 px-8 text-lg hover:scale-105 transition-all duration-300 hover:bg-maximally-yellow flex items-center gap-2 mx-auto"
            >
              <MessageCircle className="h-5 w-5" />
              JOIN_DISCORD
            </a>
          </section>

          {/* Upcoming Events Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-press-start text-3xl md:text-4xl mb-6 text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                UPCOMING EVENTS
              </h2>
              <div className="w-32 h-2 bg-maximally-red mx-auto pixel-border"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="pixel-card bg-black border-2 border-maximally-red p-6 hover:border-maximally-yellow transition-all duration-300 hover:scale-105 group"
                >
                  {/* Event Icon */}
                  <div className="minecraft-block bg-maximally-red w-12 h-12 mx-auto mb-4 flex items-center justify-center group-hover:bg-maximally-yellow transition-colors">
                    <span className="text-2xl">{event.icon}</span>
                  </div>
                  
                  {/* Event Details */}
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-maximally-red" />
                    <span className="font-jetbrains text-sm text-gray-300">
                      {event.dates}
                    </span>
                  </div>
                  
                  <h3 className="font-press-start text-sm mb-4 text-maximally-red group-hover:text-maximally-yellow transition-colors">
                    {event.name}
                  </h3>
                  
                  <p className="font-jetbrains text-gray-400 mb-6 text-sm leading-relaxed">
                    {event.description}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <Link
                      to={event.registerUrl}
                      className="pixel-button bg-maximally-red text-black font-press-start text-xs px-4 py-3 hover:bg-maximally-yellow transition-all flex items-center gap-2 justify-center"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>REGISTER</span>
                    </Link>
                    <Link
                      to={event.detailsUrl}
                      className="pixel-button bg-black border-2 border-gray-600 text-white font-press-start text-xs px-4 py-3 hover:border-maximally-red transition-all flex items-center gap-2 justify-center"
                    >
                      <ArrowRight className="h-3 w-3" />
                      <span>DETAILS</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Past Events Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-press-start text-3xl md:text-4xl mb-6 text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                PAST EVENTS
              </h2>
              <div className="w-32 h-2 bg-gray-600 mx-auto pixel-border"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pastEvents.map((event, index) => (
                <div
                  key={index}
                  className="pixel-card bg-black border-2 border-gray-600 p-6 hover:border-gray-400 transition-all duration-300 hover:scale-105 group relative"
                >
                  {/* Archive Badge */}
                  <div className="minecraft-block bg-yellow-500 text-black px-3 py-1 absolute top-4 right-4">
                    <span className="font-press-start text-xs">PAST</span>
                  </div>
                  
                  {/* Event Icon */}
                  <div className="minecraft-block bg-gray-600 w-12 h-12 mx-auto mb-4 flex items-center justify-center group-hover:bg-gray-500 transition-colors">
                    <span className="text-2xl">{event.icon}</span>
                  </div>
                  
                  {/* Event Details */}
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-jetbrains text-sm text-gray-400">
                      {event.dates}
                    </span>
                  </div>
                  
                  <h3 className="font-press-start text-sm mb-4 text-gray-300 group-hover:text-white transition-colors">
                    {event.name}
                  </h3>
                  
                  <p className="font-jetbrains text-gray-500 mb-6 text-sm leading-relaxed">
                    {event.description}
                  </p>
                  
                  {/* Report Button */}
                  <Link
                    to={event.reportUrl}
                    className="pixel-button bg-gray-600 text-white font-press-start text-xs px-4 py-3 hover:bg-gray-500 transition-all flex items-center gap-2 justify-center"
                  >
                    <FileText className="h-3 w-3" />
                    <span>VIEW_REPORT</span>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center pixel-card bg-black border-2 border-maximally-red p-12 md:p-16 relative">
            <div className="minecraft-block bg-maximally-red w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Trophy className="h-8 w-8 text-black" />
            </div>
            
            <h2 className="font-press-start text-2xl md:text-3xl mb-8 text-maximally-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              WANT TO PARTNER WITH US?
            </h2>
            <p className="font-jetbrains text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join the Grand Indian Hackathon Season as a sponsor, mentor, or collaborator.
            </p>
            <Link
              to="/contact"
              className="pixel-button bg-maximally-red text-black font-press-start inline-flex items-center gap-3 text-lg px-10 py-5 hover:bg-maximally-yellow transition-all duration-300"
            >
              <span>PARTNER_WITH_US</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Events;