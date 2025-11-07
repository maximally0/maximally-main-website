import { useState, useEffect } from "react";
import { Menu, X, Terminal } from "lucide-react";
import { signOut } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update scrolled state for styling
      if (currentScrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past 100px - hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up - show navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const { user, profile, loading, refreshProfile } = useAuth();
  
  const isLoggedIn = !!user && !loading;
  const profileUrl = profile?.username ? `/profile/${profile.username}` : '/profile';

  // Refresh profile when user changes to ensure judge role is detected
  useEffect(() => {
    if (user && !loading) {
      refreshProfile();
    }
  }, [user?.id]);

  const menuItems = [
    { path: "/", label: "HOME", color: "#E50914" },
    { path: "/events", label: "EVENTS", color: "#E50914" },
    { path: "/about", label: "ABOUT", color: "#E50914" },
    { path: "/resources", label: "RESOURCES", color: "#FFCB47" },
    { path: "/contact", label: "CONTACT", color: "#FF2B2B" }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isVisible ? 'top-0' : '-top-24'
    } ${
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
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="pixel-button bg-black border-2 border-gray-700 text-white hover:border-maximally-red hover:bg-maximally-red hover:text-black transition-all duration-200 font-press-start text-xs px-4 py-2"
              >
                {item.label}
              </a>
            ))}
            {loading ? (
              <div className="pixel-button bg-black border-2 border-gray-700 text-gray-500 font-press-start text-xs px-4 py-2">
                LOADING...
              </div>
            ) : isLoggedIn ? (
              <div className="flex items-center gap-2">
                {profile?.role === 'judge' && (
                  <a
                    href="/judge-dashboard"
                    className="pixel-button bg-maximally-red border-2 border-gray-700 text-white hover:border-maximally-yellow hover:bg-maximally-yellow hover:text-black transition-all duration-200 font-press-start text-xs px-4 py-2"
                    data-testid="button-judge-dashboard"
                  >
                    JUDGE
                  </a>
                )}
                <a
                  href={profileUrl}
                  className="pixel-button bg-black border-2 border-gray-700 text-white hover:border-maximally-red hover:bg-maximally-red hover:text-black transition-all duration-200 font-press-start text-xs px-4 py-2"
                  data-testid="button-profile"
                >
                  PROFILE
                </a>
              </div>
            ) : (
              <a
                href="/login"
                className="pixel-button bg-black border-2 border-gray-700 text-white hover:border-maximally-red hover:bg-maximally-red hover:text-black transition-all duration-200 font-press-start text-xs px-4 py-2"
                data-testid="button-join"
              >
                JOIN
              </a>
            )}
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            {/* Mobile Menu Toggle */}
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
                    onClick={() => setIsMenuOpen(false)}
                    className="pixel-button bg-maximally-red text-black font-press-start text-center py-4 px-6 hover:bg-maximally-yellow transition-all duration-300 hover:scale-105"
                  >
                    {item.label}
                  </a>
                ))}
                {loading ? (
                  <div className="pixel-button bg-gray-600 text-gray-400 font-press-start text-center py-4 px-6">
                    LOADING...
                  </div>
                ) : isLoggedIn ? (
                  <div className="space-y-4">
                    {profile?.role === 'judge' && (
                      <a
                        href="/judge-dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="pixel-button bg-maximally-red text-white font-press-start text-center py-4 px-6 hover:bg-maximally-yellow hover:text-black transition-all duration-300 hover:scale-105 block"
                        data-testid="button-judge-dashboard-mobile"
                      >
                        JUDGE DASHBOARD
                      </a>
                    )}
                    <a
                      href={profileUrl}
                      onClick={() => setIsMenuOpen(false)}
                      className="pixel-button bg-maximally-yellow text-black font-press-start text-center py-4 px-6 hover:bg-maximally-red transition-all duration-300 hover:scale-105 block"
                      data-testid="button-profile-mobile"
                    >
                      PROFILE
                    </a>
                  </div>
                ) : (
                  <a
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="pixel-button bg-maximally-yellow text-black font-press-start text-center py-4 px-6 hover:bg-maximally-red transition-all duration-300 hover:scale-105"
                    data-testid="button-join-mobile"
                  >
                    JOIN
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;