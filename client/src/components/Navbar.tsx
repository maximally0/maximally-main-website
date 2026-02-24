import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Terminal, Mail, User, LogOut, Trophy } from "lucide-react";
import { signOut } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useJudgeUnreadCount } from "@/hooks/useJudgeUnreadCount";
import { useOrganizerUnreadCount } from "@/hooks/useOrganizerUnreadCount";
import { getAuthHeaders } from "@/lib/auth";

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
  const navigate = useNavigate();
  const location = useLocation();

  const { user, profile, loading, refreshProfile } = useAuth();
  const { unreadCount } = useJudgeUnreadCount();
  const { unreadCount: organizerUnreadCount } = useOrganizerUnreadCount();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
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

  const isProfileLoaded = !!profile;
  const isLoggedIn = !!user && !loading && isProfileLoaded;
  const profileUrl = profile?.username ? `/profile/${profile.username}` : '/profile';
  const isOrganizer = (profile?.role as string) === 'organizer';

  useEffect(() => {
    if (user && !loading) {
      refreshProfile();
    }
  }, [user?.id]);

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
    navigate('/');
  };

  const navItems = [
    { path: "/events", label: "Hackathons" },
    { path: "/senior-council", label: "Senior Council" },
    { path: "/explore", label: "Explore" },
  ];

  const isActiveRoute = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out'
      }}
      className={`fixed top-0 w-full z-50 ${
        isScrolled 
          ? "py-2 sm:py-3 bg-black/98 backdrop-blur-md border-b border-orange-500/20 shadow-lg shadow-black/20" 
          : "py-3 sm:py-4 bg-black/95 backdrop-blur-md border-b border-gray-800/50"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center group" data-testid="link-home">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-1.5 sm:p-2 mr-2 sm:mr-3 group-hover:from-orange-400 group-hover:to-orange-500 transition-all duration-300">
              <Terminal className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-black" />
            </div>
            <span className="font-press-start text-white text-xs sm:text-sm md:text-base lg:text-lg group-hover:text-orange-400 transition-colors">
              MAXIMALLY
            </span>
          </Link>

          <div className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 space-x-1 xl:space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative font-space text-sm font-medium px-4 py-2 transition-colors duration-200 group ${
                  isActiveRoute(item.path) 
                    ? 'text-orange-400' 
                    : 'text-gray-300 hover:text-white'
                }`}
                data-testid={`link-nav-${item.label.toLowerCase()}`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-200 ${
                  isActiveRoute(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            {loading || (user && !profile) ? (
              <div className="font-space text-sm px-4 py-2 text-gray-500 animate-pulse">
                Loading...
              </div>
            ) : isLoggedIn ? (
              <>
                {isOrganizer && (
                  <>
                    <Link
                      to="/organizer/dashboard"
                      className="relative font-space text-sm font-medium px-3 py-2 text-purple-400 hover:text-purple-300 transition-all duration-200"
                      data-testid="button-organizer-dashboard"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/organizer-inbox"
                      className="relative p-2 transition-colors duration-200"
                      data-testid="button-organizer-inbox"
                      aria-label={`Organizer inbox${organizerUnreadCount > 0 ? ` - ${organizerUnreadCount} unread` : ''}`}
                    >
                      <Mail className="h-5 w-5 text-purple-400" />
                      {organizerUnreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-space px-1.5 py-0.5 min-w-[18px] text-center leading-none rounded-full">
                          {organizerUnreadCount > 99 ? '99+' : organizerUnreadCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="group relative"
                    data-testid="button-profile-dropdown"
                    aria-label="User profile"
                  >
                    {profile?.avatar_url ? (
                      <div className="w-10 h-10 border-2 border-gray-700 group-hover:border-orange-500 transition-colors duration-200 overflow-hidden rounded-full">
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.username || user?.email || 'User'} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.parentElement) {
                              e.currentTarget.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-orange-600 text-white font-space text-lg font-bold">${(profile?.username || user?.email || 'U')[0].toUpperCase()}</div>`;
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 border-2 border-gray-700 group-hover:border-orange-500 transition-colors duration-200 flex items-center justify-center bg-gray-900 rounded-full">
                        {profile?.username || user?.email ? (
                          <span className="font-space text-lg font-bold text-orange-400">
                            {(profile?.username || user?.email || 'U')[0].toUpperCase()}
                          </span>
                        ) : (
                          <PixelUserIcon className="w-6 h-6 text-gray-400 group-hover:text-orange-400 transition-colors duration-200" />
                        )}
                      </div>
                    )}
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 border border-gray-700 shadow-2xl z-50 overflow-hidden bg-gray-900/98 backdrop-blur-sm rounded-lg">
                      <div className="px-5 py-4 border-b border-gray-800">
                        <p className="font-space text-xs text-gray-500 mb-1">Signed in as</p>
                        <p className="font-space text-sm font-medium text-white truncate">
                          @{profile?.username || 'user'}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          to={profileUrl}
                          className="flex items-center space-x-3 px-5 py-3 font-space text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User className="h-4 w-4 text-gray-500 group-hover:text-white transition-all" />
                          <span>My Profile</span>
                        </Link>
                        {!isOrganizer && (
                          <Link
                            to="/my-hackathons"
                            className="flex items-center space-x-3 px-5 py-3 font-space text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <Trophy className="h-4 w-4 text-gray-500 group-hover:text-white transition-all" />
                            <span>My Hackathons</span>
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-3 px-5 py-3 font-space text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
                        >
                          <LogOut className="h-4 w-4 text-gray-500 group-hover:text-white transition-all" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="font-space text-sm font-medium text-gray-300 hover:text-white px-4 py-2 transition-colors"
                  data-testid="button-join-ecosystem"
                >
                  Join the Ecosystem
                </Link>
                <Link
                  to="/contact"
                  className="font-space text-sm font-medium px-5 py-2.5 border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-black transition-all duration-300"
                  data-testid="button-partner"
                >
                  Partner With Us
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center lg:hidden">
            <button
              className="p-2 bg-gray-900 border border-gray-700 hover:border-orange-500 text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              data-testid="button-menu-toggle"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[60px] sm:top-[70px] bg-black z-40">
            <div className="container mx-auto px-4 py-8 relative z-10">
              <div className="flex flex-col space-y-3 max-w-md mx-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-space text-center py-4 px-6 text-base font-medium border transition-all duration-300 ${
                      isActiveRoute(item.path)
                        ? 'bg-orange-600 text-white border-orange-500'
                        : 'bg-gray-900 text-gray-300 border-gray-800 hover:border-orange-500 hover:text-white'
                    }`}
                    data-testid={`link-nav-mobile-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                <div className="border-t border-gray-800 pt-4 mt-2">
                  {loading || (user && !profile) ? (
                    <div className="font-space text-center py-4 text-gray-500 animate-pulse">
                      Loading...
                    </div>
                  ) : isLoggedIn ? (
                    <div className="space-y-3">
                      {isOrganizer && (
                        <>
                          <Link
                            to="/organizer/dashboard"
                            onClick={() => setIsMenuOpen(false)}
                            className="block font-space text-center py-4 px-6 text-base font-medium bg-purple-900/30 text-purple-400 border border-purple-500/50 hover:bg-purple-900/50 transition-all duration-300"
                            data-testid="button-organizer-dashboard-mobile"
                          >
                            Organizer Dashboard
                          </Link>
                          <Link
                            to="/organizer-inbox"
                            onClick={() => setIsMenuOpen(false)}
                            className="block font-space text-center py-4 px-6 text-base font-medium bg-purple-900/30 text-purple-400 border border-purple-500/50 hover:bg-purple-900/50 transition-all duration-300 relative"
                            data-testid="button-organizer-inbox-mobile"
                          >
                            Organizer Inbox
                            {organizerUnreadCount > 0 && (
                              <span className="ml-2 bg-green-500 text-white text-xs font-space px-2 py-0.5 rounded-full">
                                {organizerUnreadCount > 99 ? '99+' : organizerUnreadCount}
                              </span>
                            )}
                          </Link>
                        </>
                      )}
                      <Link
                        to={profileUrl}
                        onClick={() => setIsMenuOpen(false)}
                        className="block font-space text-center py-4 px-6 text-base font-medium bg-gray-900 text-white border border-gray-700 hover:border-orange-500 transition-all duration-300"
                        data-testid="button-profile-mobile"
                      >
                        My Profile
                      </Link>
                      {!isOrganizer && (
                        <Link
                          to="/my-hackathons"
                          onClick={() => setIsMenuOpen(false)}
                          className="block font-space text-center py-4 px-6 text-base font-medium bg-gray-900 text-white border border-gray-700 hover:border-orange-500 transition-all duration-300"
                          data-testid="button-my-hackathons-mobile"
                        >
                          My Hackathons
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full font-space text-center py-4 px-6 text-base font-medium bg-gray-900 text-red-400 border border-gray-700 hover:bg-red-900/20 hover:border-red-500 transition-all duration-300"
                        data-testid="button-signout-mobile"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block font-space text-center py-4 px-6 text-base font-medium bg-gray-900 text-white border border-gray-700 hover:border-orange-500 transition-all duration-300"
                        data-testid="button-login-mobile"
                      >
                        Join the Ecosystem
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => setIsMenuOpen(false)}
                        className="block font-space text-center py-4 px-6 text-base font-medium border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-black transition-all duration-300"
                        data-testid="button-partner-mobile"
                      >
                        Partner With Us
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
