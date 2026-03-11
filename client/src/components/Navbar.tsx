import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Terminal, Mail, User, LogOut, Trophy, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useJudgeUnreadCount } from "@/hooks/useJudgeUnreadCount";
import { useOrganizerUnreadCount } from "@/hooks/useOrganizerUnreadCount";
import { getAuthHeaders } from "@/lib/auth";
import { NavDropdown } from "./NavDropdown";

const PixelUserIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg fill="currentColor" viewBox="0 0 22 22" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 2H18V3H19V4H20V18H19V19H18V20H4V19H3V18H2V4H3V3H4V2M4 16H5V15H7V14H15V15H17V16H18V5H17V4H5V5H4V16M16 18V17H14V16H8V17H6V18H16M9 5H13V6H14V7H15V11H14V12H13V13H9V12H8V11H7V7H8V6H9V5M12 8V7H10V8H9V10H10V11H12V10H13V8H12Z" />
  </svg>
);

const dropdownMenus = {
  Events: [
    { title: "Browse Events", description: "All active and upcoming builder events.", href: "/events" },
    { title: "Hackathons", description: "Competitive building events with prizes and judges.", href: "/events" },
    { title: "Build Sprints", description: "Focused short-form building challenges.", href: "/events" },
  ],
  Platform: [
    { title: "Host an Event", description: "Launch your hackathon on Maximally infrastructure.", href: "/host-hackathon" },
    { title: "Event Infrastructure", description: "Submissions, judging, team formation, and more.", href: "/platform" },
    { title: "Payments Infrastructure", description: "Sponsorships, prizes, and ticketing.", href: "/platform" },
    { title: "Organizer Dashboard", description: "Manage events, analytics, and participants.", href: "/organizer/dashboard" },
  ],
  Network: [
    { title: "Senior Council", description: "Directory of operators who judge Maximally programs.", href: "/senior-council" },
    { title: "Builder Community", description: "The live community of Maximally builders on Discord.", href: "https://discord.gg/MpBnYk8qMX", external: true },
  ],
  Resources: [
    { title: "Blog", description: "Articles on building, organizing, and the ecosystem.", href: "/blog" },
    { title: "Podcasts", description: "Conversations with builders and operators.", href: "/resources" },
    { title: "Interviews", description: "Deep dives with people shaping the ecosystem.", href: "/resources" },
    { title: "Builder Stories", description: "Profiles of builders who shipped through Maximally.", href: "/resources" },
  ],
};

type DropdownKey = keyof typeof dropdownMenus;

/* ─── Mobile accordion section ─── */
function MobileAccordion({
  label,
  items,
  isActive,
  onNavigate,
}: {
  label: string;
  items: typeof dropdownMenus.Events;
  isActive: boolean;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-800/60">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-150 active:bg-white/5 ${
          isActive ? "text-orange-400" : "text-gray-200"
        }`}
      >
        <span className="font-space text-[15px] font-semibold tracking-wide">{label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-2 px-3">
              {items.map((item) => {
                const isExternal = !!(item as any).external;
                const inner = (
                  <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] active:bg-white/[0.08] transition-colors duration-150">
                    <div className="flex-1 min-w-0">
                      <span className="font-space text-sm font-medium text-white block">{item.title}</span>
                      <span className="font-space text-xs text-gray-500 leading-relaxed block mt-0.5">{item.description}</span>
                    </div>
                    {isExternal && <ExternalLink className="h-3.5 w-3.5 text-gray-600 mt-0.5 flex-shrink-0" />}
                  </div>
                );

                return isExternal ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onNavigate}
                    className="block mb-1.5"
                  >
                    {inner}
                  </a>
                ) : (
                  <Link
                    key={item.href + item.title}
                    to={item.href}
                    onClick={onNavigate}
                    className="block mb-1.5"
                  >
                    {inner}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Navbar ─── */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, profile, loading, refreshProfile } = useAuth();
  const { unreadCount } = useJudgeUnreadCount();
  const { unreadCount: organizerUnreadCount } = useOrganizerUnreadCount();

  /* scroll hide/show */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
      if (currentScrollY > lastScrollY && currentScrollY > 100) setIsVisible(false);
      else setIsVisible(true);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /* lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  /* close mobile menu on route change */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isProfileLoaded = !!profile;
  const isLoggedIn = !!user && !loading && isProfileLoaded;
  const profileUrl = profile?.username ? `/profile/${profile.username}` : "/profile";
  const isOrganizer = (profile?.role as string) === "organizer";

  useEffect(() => { if (user && !loading) refreshProfile(); }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node))
        setProfileDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setProfileDropdownOpen(false);
    navigate("/");
  };

  const closeMobileMenu = useCallback(() => setIsMenuOpen(false), []);

  const isActiveRoute = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navKeys = Object.keys(dropdownMenus) as DropdownKey[];
  const routeMap: Record<string, string> = { Events: "/events", Platform: "/platform", Network: "/network", Resources: "/resources" };

  /* measure navbar height for mobile panel offset */
  const [navHeight, setNavHeight] = useState(60);
  useEffect(() => {
    if (!navRef.current) return;
    const ro = new ResizeObserver(([entry]) => setNavHeight(entry.contentRect.height));
    ro.observe(navRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <nav
      ref={navRef}
      style={{ transform: isVisible ? "translateY(0)" : "translateY(-100%)", transition: "transform 0.3s ease-in-out" }}
      className={`fixed top-0 w-full z-50 ${
        isScrolled
          ? "py-2 sm:py-3 bg-black/98 backdrop-blur-md border-b border-orange-500/20 shadow-lg shadow-black/20"
          : "py-3 sm:py-4 bg-black/95 backdrop-blur-md border-b border-gray-800/50"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group" data-testid="link-home" onClick={closeMobileMenu}>
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-1.5 sm:p-2 mr-2 sm:mr-3 group-hover:from-orange-400 group-hover:to-orange-500 transition-all duration-300">
              <Terminal className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-black" />
            </div>
            <span className="font-space font-bold text-white text-xs sm:text-sm md:text-base lg:text-lg group-hover:text-orange-400 transition-colors">MAXIMALLY</span>
          </Link>

          {/* Desktop nav with dropdowns */}
          <div className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 space-x-0.5 xl:space-x-1">
            {navKeys.map((key) => (
              <NavDropdown key={key} label={key} items={dropdownMenus[key]} isActive={isActiveRoute(routeMap[key])} />
            ))}
          </div>

          {/* Desktop right side — profile/login */}
          <div className="hidden lg:flex items-center space-x-3">
            {loading || (user && !profile) ? (
              <div className="font-space text-sm px-4 py-2 text-gray-500 animate-pulse">Loading...</div>
            ) : isLoggedIn ? (
              <>
                {isOrganizer && (
                  <>
                    <Link to="/organizer/dashboard" className="relative font-space text-sm font-medium px-3 py-2 text-orange-400 hover:text-orange-300 transition-all duration-200" data-testid="button-organizer-dashboard">Dashboard</Link>
                    <Link to="/organizer-inbox" className="relative p-2 transition-colors duration-200" data-testid="button-organizer-inbox" aria-label={`Organizer inbox${organizerUnreadCount > 0 ? ` - ${organizerUnreadCount} unread` : ""}`}>
                      <Mail className="h-5 w-5 text-orange-400" />
                      {organizerUnreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-space px-1.5 py-0.5 min-w-[18px] text-center leading-none rounded-full">{organizerUnreadCount > 99 ? "99+" : organizerUnreadCount}</span>
                      )}
                    </Link>
                  </>
                )}
                <div className="relative" ref={profileDropdownRef}>
                  <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="group relative" data-testid="button-profile-dropdown" aria-label="User profile">
                    {profile?.avatar_url ? (
                      <div className="w-10 h-10 border-2 border-gray-700 group-hover:border-orange-500 transition-colors duration-200 overflow-hidden rounded-full">
                        <img src={profile.avatar_url} alt={profile.username || user?.email || "User"} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-orange-600 text-white font-space text-lg font-bold">${(profile?.username || user?.email || "U")[0].toUpperCase()}</div>`; }} />
                      </div>
                    ) : (
                      <div className="w-10 h-10 border-2 border-gray-700 group-hover:border-orange-500 transition-colors duration-200 flex items-center justify-center bg-gray-900 rounded-full">
                        {profile?.username || user?.email ? (
                          <span className="font-space text-lg font-bold text-orange-400">{(profile?.username || user?.email || "U")[0].toUpperCase()}</span>
                        ) : (
                          <PixelUserIcon className="w-6 h-6 text-gray-400 group-hover:text-orange-400 transition-colors duration-200" />
                        )}
                      </div>
                    )}
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 border border-gray-700 shadow-2xl z-50 overflow-hidden bg-gray-950/98 backdrop-blur-xl rounded-lg">
                      <div className="px-5 py-4 border-b border-gray-800">
                        <p className="font-space text-xs text-gray-500 mb-1">Signed in as</p>
                        <p className="font-space text-sm font-medium text-white truncate">@{profile?.username || "user"}</p>
                      </div>
                      <div className="py-1">
                        <Link to={profileUrl} className="flex items-center space-x-3 px-5 py-3 font-space text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-150 group" onClick={() => setProfileDropdownOpen(false)}>
                          <User className="h-4 w-4 text-gray-500 group-hover:text-white transition-all" /><span>My Profile</span>
                        </Link>
                        {!isOrganizer && (
                          <Link to="/my-hackathons" className="flex items-center space-x-3 px-5 py-3 font-space text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-150 group" onClick={() => setProfileDropdownOpen(false)}>
                            <Trophy className="h-4 w-4 text-gray-500 group-hover:text-white transition-all" /><span>My Hackathons</span>
                          </Link>
                        )}
                        <button onClick={handleSignOut} className="w-full flex items-center space-x-3 px-5 py-3 font-space text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-150 group">
                          <LogOut className="h-4 w-4 text-gray-500 group-hover:text-white transition-all" /><span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="group relative" data-testid="button-login" aria-label="Sign in">
                <div className="w-10 h-10 border-2 border-gray-700 group-hover:border-orange-500 transition-colors duration-200 flex items-center justify-center bg-gray-900 rounded-full">
                  <PixelUserIcon className="w-6 h-6 text-gray-400 group-hover:text-orange-400 transition-colors duration-200" />
                </div>
              </Link>
            )}
          </div>

          {/* Mobile: profile icon + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            {!loading && isLoggedIn && (
              <Link to={profileUrl} onClick={closeMobileMenu} aria-label="Profile" className="p-1.5">
                {profile?.avatar_url ? (
                  <div className="w-8 h-8 border-2 border-gray-700 overflow-hidden rounded-full">
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-8 h-8 border-2 border-gray-700 flex items-center justify-center bg-gray-900 rounded-full">
                    <span className="font-space text-sm font-bold text-orange-400">{(profile?.username || user?.email || "U")[0].toUpperCase()}</span>
                  </div>
                )}
              </Link>
            )}
            <button
              className="relative p-2.5 rounded-lg bg-gray-900/80 border border-gray-700 hover:border-orange-500 text-white transition-colors active:scale-95"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              data-testid="button-menu-toggle"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMenuOpen ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile fullscreen menu ─── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-lg"
            style={{ top: navHeight }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="h-full overflow-y-auto overscroll-contain pb-24"
            >
              {/* Accordion sections */}
              <div className="pt-2">
                {navKeys.map((key) => (
                  <MobileAccordion
                    key={key}
                    label={key}
                    items={dropdownMenus[key]}
                    isActive={isActiveRoute(routeMap[key])}
                    onNavigate={closeMobileMenu}
                  />
                ))}
              </div>

              {/* Quick links */}
              <div className="px-5 pt-5 pb-3">
                <p className="font-space text-[11px] font-semibold uppercase tracking-widest text-gray-600 mb-3">Quick Links</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Host an Event", path: "/host-hackathon" },
                    { label: "Senior Council", path: "/senior-council" },
                    { label: "Blog", path: "/blog" },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`font-space text-center text-[13px] font-medium py-3 rounded-xl border transition-colors duration-150 active:scale-[0.98] ${
                        isActiveRoute(item.path)
                          ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
                          : "bg-white/[0.03] text-gray-400 border-gray-800/60 hover:text-white hover:border-gray-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Auth section */}
              <div className="px-5 pt-3 pb-8">
                <div className="border-t border-gray-800/60 pt-5">
                  {loading || (user && !profile) ? (
                    <div className="font-space text-center py-4 text-gray-500 animate-pulse text-sm">Loading...</div>
                  ) : isLoggedIn ? (
                    <div className="space-y-2">
                      {isOrganizer && (
                        <>
                          <Link
                            to="/organizer/dashboard"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 active:bg-orange-500/15 transition-colors"
                          >
                            <Terminal className="h-4 w-4 text-orange-400" />
                            <span className="font-space text-sm font-medium text-orange-400">Organizer Dashboard</span>
                          </Link>
                          <Link
                            to="/organizer-inbox"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-gray-800/60 active:bg-white/[0.06] transition-colors"
                          >
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="font-space text-sm font-medium text-gray-300">Organizer Inbox</span>
                            {organizerUnreadCount > 0 && (
                              <span className="ml-auto bg-green-500 text-white text-[11px] font-space font-bold px-2 py-0.5 rounded-full">{organizerUnreadCount > 99 ? "99+" : organizerUnreadCount}</span>
                            )}
                          </Link>
                        </>
                      )}
                      <Link
                        to={profileUrl}
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-gray-800/60 active:bg-white/[0.06] transition-colors"
                      >
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-space text-sm font-medium text-gray-300">My Profile</span>
                        <ChevronRight className="h-4 w-4 text-gray-600 ml-auto" />
                      </Link>
                      {!isOrganizer && (
                        <Link
                          to="/my-hackathons"
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-gray-800/60 active:bg-white/[0.06] transition-colors"
                        >
                          <Trophy className="h-4 w-4 text-gray-400" />
                          <span className="font-space text-sm font-medium text-gray-300">My Hackathons</span>
                          <ChevronRight className="h-4 w-4 text-gray-600 ml-auto" />
                        </Link>
                      )}
                      <button
                        onClick={() => { handleSignOut(); closeMobileMenu(); }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-gray-800/60 active:bg-red-500/10 transition-colors mt-3"
                      >
                        <LogOut className="h-4 w-4 text-red-400" />
                        <span className="font-space text-sm font-medium text-red-400">Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 active:from-orange-600 active:to-red-700 transition-all"
                      data-testid="button-login-mobile"
                    >
                      <PixelUserIcon className="w-5 h-5 text-black" />
                      <span className="font-space text-sm font-bold text-black">Sign In</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
