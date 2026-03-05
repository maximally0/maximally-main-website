import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter, MessageCircle, Terminal } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16 sm:py-20 md:py-24 relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2">
              <Terminal className="h-5 w-5 text-black" />
            </div>
            <span className="font-space font-bold text-white text-sm sm:text-base">
              MAXIMALLY
            </span>
          </div>
          
          <h2 className="font-space text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">
            The world's most serious builder ecosystem.
          </h2>
          <p className="font-space text-gray-500 text-sm">
            Where extraordinary operators converge.
          </p>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-12 sm:mb-16"></div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 max-w-4xl mx-auto">
          <div>
            <h3 className="font-space text-sm font-semibold mb-4 text-white">
              Programs
            </h3>
            <ul className="space-y-3 font-space text-sm">
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors">
                  Hackathons
                </Link>
              </li>
              <li>
                <Link to="/senior-council" className="text-gray-400 hover:text-white transition-colors">
                  Senior Council
                </Link>
              </li>
              <li>
                <Link to="/mfhop" className="text-gray-400 hover:text-white transition-colors">
                  MFHOP
                </Link>
              </li>
              <li>
                <Link to="/host-hackathon" className="text-gray-400 hover:text-white transition-colors">
                  Platform
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-space text-sm font-semibold mb-4 text-white">
              Content
            </h3>
            <ul className="space-y-3 font-space text-sm">
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-space text-sm font-semibold mb-4 text-white">
              Company
            </h3>
            <ul className="space-y-3 font-space text-sm">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-space text-sm font-semibold mb-4 text-white">
              Legal
            </h3>
            <ul className="space-y-3 font-space text-sm">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <div className="flex justify-center gap-4 mb-8">
            {[
              {
                name: 'LinkedIn',
                url: 'https://www.linkedin.com/company/maximallyedu',
                icon: Linkedin,
              },
              {
                name: 'Instagram',
                url: 'https://www.instagram.com/maximallyhq/',
                icon: Instagram,
              },
              {
                name: 'X',
                url: 'https://twitter.com/maximally_in',
                icon: Twitter,
              },
              {
                name: 'Discord',
                url: 'https://discord.gg/WmSXVzDYuq',
                icon: MessageCircle,
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
                <div className="w-10 h-10 sm:w-11 sm:h-11 border border-gray-800 hover:border-gray-600 flex items-center justify-center transition-all duration-300 group-hover:text-white">
                  <social.icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800/50 text-center">
          <p className="font-space text-gray-600 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} Maximally. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
