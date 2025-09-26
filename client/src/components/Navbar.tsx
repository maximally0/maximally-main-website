import { useState, useEffect } from "react";
import { Menu, X, Terminal } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const menuItems = [
    { path: "/", label: "HOME", color: "#E50914" },
    { path: "/events", label: "EVENTS", color: "#E50914" },
    { path: "/featured", label: "FEATURED", color: "#FFCB47" },
    { path: "https://discord.gg/MpBnYk8qMX", label: "DISCORD", color: "#FF2B2B", external: true },
    { path: "/blog", label: "BLOG", color: "#FFCB47" },
    { path: "/contact", label: "CONTACT", color: "#FF2B2B" }
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "py-2 sm:py-2 bg-black/95 backdrop-blur-md border-b-2 border-maximally-red shadow-lg" : "py-3 sm:py-3 bg-black/80 backdrop-blur-xl shadow-lg lg:shadow-none lg:backdrop-blur-sm lg:bg-black/90"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center group">
            <div className="minecraft-block bg-maximally-red p-2 mr-3 group-hover:bg-maximally-yellow transition-colors">
              <Terminal className="h-6 w-6 text-black" />
            </div>
            <span className="font-press-start text-white text-lg group-hover:text-maximally-red transition-colors">
              MAXIMALLY
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1">
            {menuItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="pixel-button bg-black border-2 border-gray-700 text-white hover:border-maximally-red hover:bg-maximally-red hover:text-black transition-all duration-200 font-press-start text-xs px-4 py-2"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button 
              className="pixel-button bg-maximally-red text-black p-2 hover:bg-maximally-yellow transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[70px] bg-black z-40">
            <div className="pixel-grid-bg absolute inset-0 opacity-20"></div>
            <div className="container mx-auto px-4 py-8 relative z-10">
              <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                {menuItems.map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onClick={() => setIsMenuOpen(false)}
                    className="pixel-button bg-maximally-red text-black font-press-start text-center py-4 px-6 hover:bg-maximally-yellow transition-all duration-300 hover:scale-105"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;