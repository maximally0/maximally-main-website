import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter, MessageCircle, Code } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.10)_0%,transparent_50%)]" />

      <div className="absolute bottom-20 left-[5%] w-60 h-60 bg-purple-500/10 rounded-full blur-[80px]" />
      <div className="absolute top-20 right-[10%] w-48 h-48 bg-pink-500/8 rounded-full blur-[60px]" />
      <div className="absolute bottom-40 right-[20%] w-40 h-40 bg-cyan-500/8 rounded-full blur-[50px]" />

      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 animate-float pointer-events-none"
          style={{
            left: `${8 + (i * 9)}%`,
            top: `${15 + Math.sin(i) * 25}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${4 + (i % 3)}s`,
            backgroundColor: ['#a855f7', '#ec4899', '#06b6d4', '#22c55e', '#f59e0b'][i % 5],
            boxShadow: `0 0 8px ${['#a855f7', '#ec4899', '#06b6d4', '#22c55e', '#f59e0b'][i % 5]}30`
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 mb-4">
            <Code className="w-4 h-4 text-purple-400" />
            <span className="font-press-start text-[10px] sm:text-xs text-purple-300 tracking-wider">
              BUILD. SHIP. WIN.
            </span>
          </div>
          
          <h2 className="font-press-start text-lg sm:text-xl md:text-2xl lg:text-3xl mb-3 sm:mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            MAXIMALLY
          </h2>
          <p className="font-jetbrains text-gray-400 max-w-2xl mx-auto text-xs sm:text-sm md:text-base px-2 sm:px-4">
            The global hackathon league for builders, creators, and
            innovators. High-stakes events for ambitious youth worldwide.
          </p>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-8 sm:mb-10 md:mb-14"></div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 p-4 sm:p-5 md:p-6 h-fit">
            <h3 className="font-press-start text-[10px] sm:text-xs md:text-sm mb-4 sm:mb-5 text-cyan-300 flex items-center gap-2">
              EVENTS
            </h3>
            <ul className="space-y-2 sm:space-y-3 font-jetbrains text-white text-[11px] sm:text-xs md:text-sm">
              <li>
                <Link
                  to="/events"
                  className="hover:text-cyan-300 transition-colors block"
                >
                  Hackathons
                </Link>
              </li>
              <li>
                <Link
                  to="/people"
                  className="hover:text-cyan-300 transition-colors block"
                >
                  People
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/30 p-4 sm:p-5 md:p-6 h-fit">
            <h3 className="font-press-start text-[10px] sm:text-xs md:text-sm mb-4 sm:mb-5 text-pink-300 flex items-center gap-2">
              COMMUNITY
            </h3>
            <ul className="space-y-2 sm:space-y-3 font-jetbrains text-white text-[11px] sm:text-xs md:text-sm">
              <li>
                <a
                  href="https://discord.gg/MpBnYk8qMX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-300 transition-colors block"
                >
                  Join Discord
                </a>
              </li>
              <li>
                <Link
                  to="/mfhop"
                  className="hover:text-pink-300 transition-colors block"
                >
                  MFHOP
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 p-4 sm:p-5 md:p-6 h-fit">
            <h3 className="font-press-start text-[10px] sm:text-xs md:text-sm mb-4 sm:mb-5 text-green-300 flex items-center gap-2">
              CONTENT
            </h3>
            <ul className="space-y-2 sm:space-y-3 font-jetbrains text-white text-[11px] sm:text-xs md:text-sm">
              <li>
                <Link
                  to="/blog"
                  className="hover:text-green-300 transition-colors block"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="hover:text-green-300 transition-colors block"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/explore"
                  className="hover:text-green-300 transition-colors block"
                >
                  Explore
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-4 sm:p-5 md:p-6 h-fit">
            <h3 className="font-press-start text-[10px] sm:text-xs md:text-sm mb-4 sm:mb-5 text-amber-300 flex items-center gap-2">
              COMPANY
            </h3>
            <ul className="space-y-2 sm:space-y-3 font-jetbrains text-white text-[11px] sm:text-xs md:text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-amber-300 transition-colors block"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-amber-300 transition-colors block"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/30 p-4 sm:p-5 md:p-6 h-fit col-span-2 sm:col-span-1">
            <h3 className="font-press-start text-[10px] sm:text-xs md:text-sm mb-4 sm:mb-5 text-purple-300 flex items-center gap-2">
              LEGAL
            </h3>
            <ul className="space-y-2 sm:space-y-3 font-jetbrains text-white text-[11px] sm:text-xs md:text-sm grid grid-cols-2 sm:grid-cols-1 gap-x-4 sm:gap-x-0">
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-purple-300 transition-colors block"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-purple-300 transition-colors block"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  to="/thank-you"
                  className="hover:text-purple-300 transition-colors block"
                >
                  Thank You
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 md:mt-16 text-center">
          <h3 className="font-press-start text-xs sm:text-sm md:text-base mb-4 sm:mb-5 md:mb-6 text-white">
            STAY CONNECTED
          </h3>
          <div className="flex justify-center gap-3 sm:gap-4 md:gap-5">
            {[
              {
                name: 'Instagram',
                url: 'https://www.instagram.com/maximally.in/',
                gradient: 'from-pink-500/30 to-purple-500/30',
                border: 'border-pink-500/40',
                icon: Instagram,
                iconColor: 'text-pink-400'
              },
              {
                name: 'LinkedIn',
                url: 'https://www.linkedin.com/company/maximallyedu',
                gradient: 'from-blue-500/30 to-cyan-500/30',
                border: 'border-blue-500/40',
                icon: Linkedin,
                iconColor: 'text-blue-400'
              },
              {
                name: 'X',
                url: 'https://twitter.com/maximally_in',
                gradient: 'from-gray-500/30 to-gray-600/30',
                border: 'border-gray-500/40',
                icon: Twitter,
                iconColor: 'text-gray-300'
              },
              {
                name: 'Discord',
                url: 'https://discord.gg/WmSXVzDYuq',
                gradient: 'from-indigo-500/30 to-purple-500/30',
                border: 'border-indigo-500/40',
                icon: MessageCircle,
                iconColor: 'text-indigo-400'
              },
            ].map((social, i) => (
              <a
                key={i}
                href={social.url}
                className="group"
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`social-${social.name.toLowerCase()}`}
              >
                <div
                  className={`bg-gradient-to-br ${social.gradient} border ${social.border} hover:scale-110 transition-all duration-300 p-3 sm:p-4 w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]`}
                >
                  <social.icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${social.iconColor}`} />
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-purple-500/20 text-center">
          <p className="font-jetbrains text-gray-500 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} Maximally. Built by builders, for builders.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
