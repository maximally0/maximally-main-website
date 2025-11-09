import { useState, useEffect } from "react";
import { Menu, X, Terminal, Mail } from "lucide-react";
import { signOut } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useJudgeUnreadCount } from "@/hooks/useJudgeUnreadCount";

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
  const { unreadCount } = useJudgeUnreadCount();

  const isLoggedIn = !!user && !loading;
  const profileUrl = profile?.username ? `/profile/${profile.username}` : '/profile';
  const isJudge = profile?.role === 'judge';

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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isVisible ? 'top-0' : '-top-24'
      } ${isScrolled ? "py-2 sm:py-2 bg-black/95 backdrop-blur-md border-b-2 border-maximally-red shadow-lg" : "py-3 sm:py-3 bg-black/80 backdrop-blur-xl shadow-lg lg:shadow-none lg:backdrop-blur-sm lg:bg-black/90"
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
              <>
                {isJudge && (
                  <>
                    <a
                      href="/judge-dashboard"
                      className="pixel-button bg-black border-2 border-gray-700 text-white hover:border-maximally-red hover:bg-maximally-red hover:text-black transition-all duration-200 font-press-start text-xs px-4 py-2 ml-1"
                      data-testid="button-judge-dashboard"
                    >
                      JUDGE
                    </a>
                    <a
                      href="/judge-inbox"
                      className="pixel-button bg-black border-2 border-gray-700 text-white hover:border-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-200 font-press-start text-xs relative flex items-center justify-center ml-1 aspect-square"
                      style={{ padding: '10px' }}
                      data-testid="button-judge-inbox"
                      aria-label={`Judge inbox${unreadCount > 0 ? ` - ${unreadCount} unread` : ''}`}
                      title={`Judge Inbox${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                    >
                      <Mail className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-maximally-red text-maximally-yellow text-[10px] font-press-start px-[3px] py-[1px] rounded-sm min-w-[16px] text-center leading-none">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </a>
                  </>
                )}
                <a
                  href={profileUrl}
                  className="pixel-button bg-black border-2 border-gray-700 text-white hover:border-maximally-red hover:bg-maximally-red hover:text-black transition-all duration-200 font-press-start text-xs px-4 py-2 ml-1"
                  data-testid="button-profile"
                >
                  PROFILE
                </a>
              </>
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
                    {isJudge && (
                      <>
                        <a
                          href="/judge-dashboard"
                          onClick={() => setIsMenuOpen(false)}
                          className="pixel-button bg-maximally-red text-white font-press-start text-center py-4 px-6 hover:bg-maximally-yellow hover:text-black transition-all duration-300 hover:scale-105 block"
                          data-testid="button-judge-dashboard-mobile"
                        >
                          JUDGE DASHBOARD
                        </a>
                        <a
                          href="/judge-inbox"
                          onClick={() => setIsMenuOpen(false)}
                          className="pixel-button bg-cyan-600 text-white font-press-start text-center py-4 px-6 hover:bg-cyan-700 transition-all duration-300 hover:scale-105 block relative"
                          data-testid="button-judge-inbox-mobile"
                        >
                          JUDGE INBOX
                          {unreadCount > 0 && (
                            <span className="ml-2 bg-maximally-red text-maximally-yellow text-xs font-press-start px-2 py-0.5 rounded-sm">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                        </a>
                      </>
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