import { Link } from 'react-router-dom';
import { Instagram, Linkedin, MessageCircle, Terminal } from 'lucide-react';

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
            <span className="font-space font-bold text-white text-sm sm:text-base">MAXIMALLY</span>
          </div>
          <h2 className="font-space text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">
            Infrastructure for serious builders.
          </h2>
          <p className="font-space text-gray-500 text-sm">
            Run events. Compete in events. Ship real products.
          </p>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-12 sm:mb-16" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 max-w-4xl mx-auto">
          <div>
            <h3 className="font-space text-sm font-semibold mb-4 text-white">Events</h3>
            <ul className="space-y-3 font-space text-sm">
              <li><Link to="/events" className="text-gray-400 hover:text-white transition-colors">Browse Events</Link></li>
              <li><Link to="/host-hackathon" className="text-gray-400 hover:text-white transition-colors">Host an Event</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-space text-sm font-semibold mb-4 text-white">Platform</h3>
            <ul className="space-y-3 font-space text-sm">
              <li><Link to="/platform" className="text-gray-400 hover:text-white transition-colors">Infrastructure</Link></li>
              <li><Link to="/host-hackathon" className="text-gray-400 hover:text-white transition-colors">Host on Maximally</Link></li>
              <li><Link to="/organizer/apply" className="text-gray-400 hover:text-white transition-colors">Organizer Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-space text-sm font-semibold mb-4 text-white">Network</h3>
            <ul className="space-y-3 font-space text-sm">
              <li><Link to="/senior-council" className="text-gray-400 hover:text-white transition-colors">Senior Council</Link></li>
              <li><Link to="/mfhop" className="text-gray-400 hover:text-white transition-colors">Organizer Federation</Link></li>
              <li><a href="https://discord.gg/MpBnYk8qMX" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Builder Community</a></li>
              <li><Link to="/network" className="text-gray-400 hover:text-white transition-colors">View Network</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-space text-sm font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-3 font-space text-sm">
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/resources" className="text-gray-400 hover:text-white transition-colors">All Resources</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-12 sm:my-16" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-5">
            <a href="https://www.linkedin.com/company/maximallyedu" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com/maximallyhq/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://discord.gg/MpBnYk8qMX" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="Discord">
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
          <div className="flex items-center gap-6 font-space text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <span>© {new Date().getFullYear()} Maximally</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
