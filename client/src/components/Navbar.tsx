import { useState, useEffect, useRef } from "react";
import { Menu, X, Terminal, Mail, ChevronDown, User, LogOut } from "lucide-react";
import { signOut } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useJudgeUnreadCount } from "@/hooks/useJudgeUnreadCount";

// Pixelated User Icon Component
const PixelUserIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg fill="currentColor" viewBox="0 0 22 22" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 2H18V3H19V4H20V18H19V19H18V20H4V19H3V18H2V4H3V3H4V2M4 16H5V15H7V14H15V15H17V16H18V5H17V4H5V5H4V16M16 18V17H14V16H8V17H6V18H16M9 5H13V6H14V7H15V11H14V12H13V13H9V12H8V11H7V7H8V6H9V5M12 8V7H10V8H9V10H10V11H12V10H13V8H12Z" />
  </svg>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setProfileDropdownOpen(false);
    window.location.href = '/';
  };

  const menuItems = [
    { path: "/", label: "HOME", color: "#E50914" },
    { path: "/events", label: "EVENTS", color: "#E50914" },
    { path: "/contact", label: "CONTACT", color: "#FF2B2B" }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isVisible ? 'top-0' : '-top-24'
      } ${isScrolled ? "py-2 sm:py-3 bg-black/98 backdrop-blur-md border-b border-maximally-red/30 shadow-lg" : "py-3 sm:py-4 bg-black/95 backdrop-blur-md border-b border-gray-800/50"
      }`}>
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center group">
            <div className="minecraft-block bg-maximally-red p-1.5 sm:p-2 mr-2 sm:mr-3 group-hover:bg-maximally-yellow transition-colors">
              <Terminal className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-black" />
            </div>
            <span className="font-press-start text-white text-xs sm:text-sm md:text-base lg:text-lg group-hover:text-maximally-red transition-colors">
              MAXIMALLY
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {menuItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="relative font-press-start text-[10px] lg:text-xs px-2 lg:px-4 py-2 text-white hover:text-maximally-red transition-colors duration-200 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-maximally-red transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
            {loading ? (
              <div className="font-press-start text-xs px-4 py-2 text-gray-500">
                LOADING...
              </div>
            ) : isLoggedIn ? (
              <>
                {isJudge && (
                  <>
                    <a
                      href="/judge-dashboard"
                      className="relative font-press-start text-xs px-4 py-2 text-white hover:text-maximally-red transition-colors duration-200 group ml-2"
                      data-testid="button-judge-dashboard"
                    >
                      JUDGE
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-maximally-red transition-all duration-200 group-hover:w-full"></span>
                    </a>
                    <a
                      href="/judge-inbox"
                      className="relative p-2 text-white hover:text-cyan-400 transition-colors duration-200 ml-2"
                      data-testid="button-judge-inbox"
                      aria-label={`Judge inbox${unreadCount > 0 ? ` - ${unreadCount} unread` : ''}`}
                      title={`Judge Inbox${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                    >
                      <Mail className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-maximally-red text-white text-[10px] font-press-start px-1.5 py-0.5 rounded-sm min-w-[18px] text-center leading-none shadow-lg">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </a>
                  </>
                )}
                <div className="relative ml-4" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="group relative"
                    data-testid="button-profile-dropdown"
                    aria-label="User profile"
                  >
                    {profile?.avatar_url ? (
                      <div className="w-10 h-10 border-2 border-gray-700 group-hover:border-maximally-red transition-colors duration-200 overflow-hidden" style={{ imageRendering: 'pixelated' }}>
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.username || 'User'} 
                          className="w-full h-full object-cover"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 minecraft-block border-2 group-hover:border-maximally-red transition-colors duration-200 flex items-center justify-center" style={{ backgroundColor: '#121212', borderColor: '#2a2a2a' }}>
                        <PixelUserIcon className="w-6 h-6 text-gray-300 group-hover:text-maximally-red transition-colors duration-200" />
                      </div>
                    )}
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 minecraft-block border-2 border-maximally-red shadow-2xl shadow-maximally-red/30 z-50 overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
                      <div className="px-5 py-4 border-b-2 border-maximally-red/40" style={{ backgroundColor: '#121212' }}>
                        <p className="font-press-start text-[9px] text-gray-500 mb-1.5">SIGNED IN AS</p>
                        <p className="font-press-start text-xs text-white truncate">{profile?.username?.toUpperCase() || 'USER'}</p>
                      </div>
                      <div className="py-2">
                        <a
                          href={profileUrl}
                          className="flex items-center space-x-3 px-5 py-3.5 font-press-start text-xs text-gray-300 hover:bg-maximally-red hover:text-black transition-all duration-200 group"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span>MY PROFILE</span>
                        </a>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-3 px-5 py-3.5 font-press-start text-xs text-gray-300 hover:bg-maximally-red hover:text-black transition-all duration-200 group"
                        >
                          <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span>SIGN OUT</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <a
                href="/login"
                className="group ml-4"
                data-testid="button-join"
                aria-label="Sign in"
              >
                <div className="w-10 h-10 minecraft-block border-2 group-hover:border-maximally-red transition-colors duration-200 flex items-center justify-center" style={{ backgroundColor: '#121212', borderColor: '#2a2a2a' }}>
                  <PixelUserIcon className="w-6 h-6 text-gray-300 group-hover:text-maximally-red transition-colors duration-200" />
                </div>
              </a>
            )}
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Menu Toggle */}
            <button
              className="pixel-button bg-maximally-red text-black p-1.5 sm:p-2 hover:bg-maximally-yellow transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[60px] sm:top-[70px] bg-black z-40">
            <div className="pixel-grid-bg absolute inset-0 opacity-20"></div>
            <div className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
              <div className="grid grid-cols-1 gap-3 sm:gap-4 max-w-sm mx-auto">
                {menuItems.map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="pixel-button bg-maximally-red text-black font-press-start text-center py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm hover:bg-maximally-yellow transition-all duration-300 hover:scale-105"
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