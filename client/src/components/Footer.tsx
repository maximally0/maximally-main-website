import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 sm:py-12 md:py-16 relative overflow-hidden">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Floating Pixels */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-maximally-red pixel-border animate-float pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + i}s`,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="font-press-start text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-3 md:mb-4 text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            MAXIMALLY
          </h2>
          <p className="font-jetbrains text-gray-300 max-w-2xl mx-auto text-xs sm:text-sm md:text-base lg:text-lg px-2 sm:px-4">
            The global hackathon league for builders, creators, and
            innovators. High-stakes events for ambitious youth worldwide.
          </p>
        </div>

        {/* Pixel Divider */}
        <div className="w-full h-1.5 sm:h-2 bg-maximally-red mb-6 sm:mb-8 md:mb-12 pixel-border"></div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {/* Events Section */}
          <div className="pixel-card bg-black border-2 border-maximally-red p-3 sm:p-4 md:p-5 h-fit">
            <h3 className="font-press-start text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-4 md:mb-6 text-maximally-red flex items-center gap-1.5 sm:gap-2">
              <span>🚀</span> EVENTS
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-3 font-jetbrains text-white text-[10px] sm:text-xs md:text-sm">
              <li>
                <Link
                  to="/events"
                  className="hover:text-maximally-red transition-colors block"
                >
                  All Events
                </Link>
              </li>
              <li>
                <Link
                  to="/people"
                  className="hover:text-maximally-red transition-colors block"
                >
                  People
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="pixel-card bg-black border-2 border-maximally-yellow p-3 sm:p-4 md:p-5 h-fit">
            <h3 className="font-press-start text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-4 md:mb-6 text-maximally-yellow flex items-center gap-1.5 sm:gap-2">
              <span>🤝</span> COMMUNITY
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-3 font-jetbrains text-white text-[10px] sm:text-xs md:text-sm">
              <li>
                <a
                  href="https://discord.gg/MpBnYk8qMX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-maximally-yellow transition-colors block"
                >
                  Join Discord
                </a>
              </li>
              <li>
                <Link
                  to="/mfhop"
                  className="hover:text-maximally-yellow transition-colors block"
                >
                  MFHOP
                </Link>
              </li>
            </ul>
          </div>

          {/* Content */}
          <div className="pixel-card bg-black border-2 border-green-500 p-3 sm:p-4 md:p-5 h-fit">
            <h3 className="font-press-start text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-4 md:mb-6 text-green-400 flex items-center gap-1.5 sm:gap-2">
              <span>📖</span> CONTENT
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-3 font-jetbrains text-white text-[10px] sm:text-xs md:text-sm">
              <li>
                <Link
                  to="/blog"
                  className="hover:text-green-400 transition-colors block"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="hover:text-green-400 transition-colors block"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/people"
                  className="hover:text-green-400 transition-colors block"
                >
                  People
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="pixel-card bg-black border-2 border-blue-500 p-3 sm:p-4 md:p-5 h-fit">
            <h3 className="font-press-start text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-4 md:mb-6 text-blue-400 flex items-center gap-1.5 sm:gap-2">
              <span>🏢</span> COMPANY
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-3 font-jetbrains text-white text-[10px] sm:text-xs md:text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-400 transition-colors block"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-400 transition-colors block"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="pixel-card bg-black border-2 border-purple-500 p-3 sm:p-4 md:p-5 h-fit col-span-2 sm:col-span-1">
            <h3 className="font-press-start text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-4 md:mb-6 text-purple-400 flex items-center gap-1.5 sm:gap-2">
              <span>⚖️</span> LEGAL
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-3 font-jetbrains text-white text-[10px] sm:text-xs md:text-sm grid grid-cols-2 sm:grid-cols-1 gap-x-4 sm:gap-x-0">
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-purple-400 transition-colors block"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-purple-400 transition-colors block"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  to="/thank-you"
                  className="hover:text-purple-400 transition-colors block"
                >
                  Thank You
                </Link>
              </li>
            </ul>
          </div>
        </div>


        {/* Social Media Section */}
        <div className="mt-6 sm:mt-6 md:mt-8 text-center">
          <h3 className="font-press-start text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-4 md:mb-6 text-white">
            STAY CONNECTED
          </h3>
          <div className="flex justify-center space-x-3 sm:space-x-4 md:space-x-6">
            {[
              {
                name: 'Instagram',
                url: 'https://www.instagram.com/maximally.in/',
                color: 'bg-gradient-to-br from-pink-500 to-purple-600',
                icon: Instagram,
              },
              {
                name: 'LinkedIn',
                url: 'https://www.linkedin.com/company/maximallyedu',
                color: 'bg-gradient-to-br from-blue-500 to-blue-700',
                icon: Linkedin,
              },
              {
                name: 'X',
                url: 'https://twitter.com/maximally_in',
                color: 'bg-gradient-to-br from-black to-gray-800',
                icon: Twitter,
              },
              {
                name: 'Discord',
                url: 'https://discord.gg/WmSXVzDYuq',
                color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
                icon: MessageCircle,
              },
            ].map((social, i) => (
              <a
                key={i}
                href={social.url}
                className="group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  className={`pixel-card ${social.color} hover:scale-110 transition-transform p-2 sm:p-3 md:p-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center`}
                >
                  <div className="minecraft-block bg-white w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex items-center justify-center">
                    <social.icon className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-black" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
