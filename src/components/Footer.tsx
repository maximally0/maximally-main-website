
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="font-press-start text-sm mb-4">Maximally</h2>
          <p className="font-jetbrains text-gray-300 mb-4">
            Empowering teens with real-world skills for tomorrow's challenges.
          </p>
          <div className="flex space-x-4">
            <a href="https://www.instagram.com/maximally.in/" className="text-gray-300 hover:text-maximally-blue transition-colors" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/maximallyedu" className="text-gray-300 hover:text-maximally-blue transition-colors" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-press-start text-sm mb-4">Programs</h3>
          <ul className="space-y-3 font-jetbrains text-gray-300">
            <li><Link to="/bootcamps" className="hover:text-maximally-blue transition-colors block">Startup Makeathon</Link></li>
            <li><Link to="/digital-marketing" className="hover:text-maximally-blue transition-colors block">Digital Marketing</Link></li>
            <li><Link to="/entrepreneurship" className="hover:text-maximally-blue transition-colors block">Entrepreneurship</Link></li>
            <li><Link to="/public-speaking" className="hover:text-maximally-blue transition-colors block">Public Speaking</Link></li>
            <li><Link to="/no-code-ai" className="hover:text-maximally-blue transition-colors block">No-Code AI</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-press-start text-sm mb-4">Company</h3>
          <ul className="space-y-3 font-jetbrains text-gray-300">
            
            <li><Link to="/blog" className="hover:text-maximally-blue transition-colors block">Blog</Link></li>
            <li><Link to="/careers" className="hover:text-maximally-blue transition-colors block">Careers</Link></li>
            <li><Link to="/collaborate" className="hover:text-maximally-blue transition-colors block">Collaborate</Link></li>
            <li><Link to="/contact" className="hover:text-maximally-blue transition-colors block">Contact</Link></li>
            <li><Link to="/join-us" className="hover:text-maximally-blue transition-colors block">Join Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-press-start text-sm mb-4">Resources</h3>
          <ul className="space-y-3 font-jetbrains text-gray-300">
            <li><Link to="/community" className="hover:text-maximally-blue transition-colors block">Community</Link></li>
            <li><Link to="/support" className="hover:text-maximally-blue transition-colors block">Support</Link></li>
            <li><Link to="/privacy" className="hover:text-maximally-blue transition-colors block">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-maximally-blue transition-colors block">Terms of Service</Link></li>
            <li><Link to="/sponsor" className="hover:text-maximally-blue transition-colors block">Sponsor</Link></li>
            <li><Link to="/wall-of-progressive-schools" className="hover:text-maximally-blue transition-colors block">Progressive Schools</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
