import { Link } from 'react-router-dom';
import { Terminal } from 'lucide-react';
import { SiInstagram, SiLinkedin, SiDiscord } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16 md:py-20 relative border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Opportunities */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Opportunities</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/events?category=hackathons" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Hackathons
                </Link>
              </li>
              <li>
                <Link to="/events?category=fellowships" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Fellowships
                </Link>
              </li>
              <li>
                <Link to="/events?category=accelerators" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Accelerators
                </Link>
              </li>
              <li>
                <Link to="/events?category=bootcamps" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Bootcamps
                </Link>
              </li>
              <li>
                <Link to="/events?category=funding" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Funding
                </Link>
              </li>
              <li>
                <Link to="/events?category=gigs" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Gigs
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizers */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">For Organizers</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/host-hackathon" className="text-sm text-gray-500 hover:text-white transition-colors">
                  List Opportunity
                </Link>
              </li>
              <li>
                <Link to="/host-hackathon" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Microsite Builder
                </Link>
              </li>
              <li>
                <Link to="/mfhop" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Federation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-gray-500 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Social</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://www.instagram.com/maximally.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                >
                  <SiInstagram className="w-4 h-4" />
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/company/maximallyedu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                >
                  <SiLinkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="https://discord.gg/MpBnYk8qMX" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                >
                  <SiDiscord className="w-4 h-4" />
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-maximally-red p-1.5">
              <Terminal className="h-4 w-4 text-black" />
            </div>
            <span className="font-press-start text-xs text-white">MAXIMALLY</span>
          </Link>
          <p className="text-xs text-gray-600">
            {new Date().getFullYear()} Maximally. Built for builders.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
