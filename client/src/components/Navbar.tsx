import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Terminal, ChevronDown, User, LogOut } from "lucide-react";
import { signOut } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { user, profile, loading, refreshProfile } = useAuth();

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

  const isLoggedIn = !!user && !loading;
  const profileUrl = profile?.username ? `/profile/${profile.username}` : '/profile';

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
    { path: "/events", label: "Opportunities" },
    { path: "/categories", label: "Categories" },
    { path: "/community", label: "Community" },
    { path: "/host-hackathon", label: "For Organizers" },
  ];

  return (
    <nav 
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out'
      }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "py-3 bg-white shadow-sm border-b border-gray-100" 
          : "py-4 bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center group" data-testid="link-home">
            <div className="bg-red-500 p-1.5 mr-2 group-hover:bg-red-600 transition-colors">
              <Terminal className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm sm:text-base tracking-tight">
              maximally
            </span>
          </Link>

          {/* Center Navigation - Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Section - Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            {loading ? (
              <div className="text-sm text-gray-400">Loading...</div>
            ) : isLoggedIn ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  data-testid="button-profile-dropdown"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 border border-red-200 flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm text-gray-900 font-medium truncate">
                        {profile?.username || user?.email?.split('@')[0]}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        to={profileUrl}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                        data-testid="link-my-profile"
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        data-testid="button-sign-out"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                  data-testid="link-login"
                >
                  Login
                </Link>
                <Link to="/signup" data-testid="link-signup">
                  <Button className="bg-red-500 hover:bg-red-600 text-white text-sm px-5">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            data-testid="button-mobile-menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[60px] bg-white z-40">
            <div className="container mx-auto px-6 py-8">
              <div className="flex flex-col space-y-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg text-gray-900 hover:text-red-500 transition-colors py-2 border-b border-gray-100"
                    data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 flex flex-col space-y-4">
                  {loading ? (
                    <div className="text-gray-400">Loading...</div>
                  ) : isLoggedIn ? (
                    <>
                      <Link
                        to={profileUrl}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-lg text-gray-900 hover:text-red-500 transition-colors"
                        data-testid="link-mobile-profile"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                        className="text-left text-lg text-gray-500 hover:text-gray-900 transition-colors"
                        data-testid="button-mobile-sign-out"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-lg text-gray-600 hover:text-gray-900 transition-colors"
                        data-testid="link-mobile-login"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsMenuOpen(false)}
                        data-testid="link-mobile-signup"
                      >
                        <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                          Sign Up
                        </Button>
                      </Link>
                    </>
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
