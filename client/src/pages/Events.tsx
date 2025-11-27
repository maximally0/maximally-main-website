import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  X,
  ChevronDown,
  Sparkles,
  Code,
  Users,
  GraduationCap,
  Coffee,
  Rocket,
  Presentation,
  Globe,
  Trophy,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { EventCard } from '@/components/landing/EventCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase, supabasePublic } from '@/lib/supabaseClient';
import type { SelectHackathon } from '@shared/schema';
import { grandIndianHackathonSeason } from '@shared/schema';
import techEventsData from '@/data/techEvents.json';

type EventType = "hackathon" | "conference" | "workshop" | "meetup" | "bootcamp" | "demo-day";
type EventFormat = "online" | "in-person" | "hybrid";
type EventStatus = "upcoming" | "ongoing" | "completed";

interface TechEvent {
  id: string;
  name: string;
  description: string;
  type: EventType;
  startDate: string;
  endDate: string;
  location: string;
  format: EventFormat;
  prizes: string | null;
  tags: string[];
  registerUrl: string;
  featured: boolean;
  status: EventStatus;
  organizer: string;
  isMaximallyOfficial?: boolean;
}

const categoryIcons: Record<string, typeof Sparkles> = {
  all: Sparkles,
  hackathon: Code,
  conference: Users,
  workshop: GraduationCap,
  meetup: Coffee,
  bootcamp: Rocket,
  "demo-day": Presentation
};

const Events = () => {
  const [events, setEvents] = useState<TechEvent[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("hackathon");
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);
  const [showOtherEvents, setShowOtherEvents] = useState<boolean>(false);
  
  const [selectedFilters, setSelectedFilters] = useState<{
    format: string[];
    status: string[];
    tags: string[];
  }>({
    format: [],
    status: [],
    tags: []
  });

  const [expandedFilters, setExpandedFilters] = useState<{ 
    format: boolean; 
    status: boolean; 
    tags: boolean 
  }>({ format: true, status: true, tags: false });

  const calcStatus = (status?: string | null, start?: string): EventStatus => {
    if (status) return status as EventStatus;
    if (!start) return 'upcoming';
    try {
      const now = new Date();
      const s = new Date(start);
      if (isNaN(s.getTime())) return 'upcoming';
      if (s > now) return 'upcoming';
      const delta = (now.getTime() - s.getTime()) / (1000 * 60 * 60 * 24);
      if (delta < 7) return 'ongoing';
      return 'completed';
    } catch {
      return 'upcoming';
    }
  };

  const fetchEvents = async () => {
    const staticEvents: TechEvent[] = techEventsData.featuredEvents.map(e => ({
      ...e,
      type: e.type as EventType,
      format: e.format as EventFormat,
      status: e.status as EventStatus,
      isMaximallyOfficial: e.organizer === "Maximally"
    }));

    if (!supabasePublic) {
      const fallbackEvents: TechEvent[] = grandIndianHackathonSeason.map((h, idx) => ({
        id: h.id?.toString() || `hackathon-${idx}`,
        name: h.name,
        description: h.description,
        type: "hackathon" as EventType,
        startDate: h.startDate instanceof Date ? h.startDate.toISOString() : h.startDate,
        endDate: h.endDate instanceof Date ? h.endDate.toISOString() : h.endDate,
        location: h.location,
        format: h.location.toLowerCase().includes('online') ? 'online' as EventFormat : 'hybrid' as EventFormat,
        prizes: h.prizes,
        tags: h.tags || [],
        registerUrl: h.registerUrl || '#',
        featured: false,
        status: calcStatus(h.status, h.startDate instanceof Date ? h.startDate.toISOString() : h.startDate),
        organizer: "Maximally",
        isMaximallyOfficial: true
      }));
      
      setEvents([...staticEvents, ...fallbackEvents]);
      return;
    }
    
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const [adminResponse, organizerResponse] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/hackathons?select=id,title,subtitle,start_date,end_date,location,duration,status,focus_areas,devpost_url,devpost_register_url,registration_url,sort_order&is_active=eq.true&order=sort_order.asc,created_at.desc`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${SUPABASE_URL}/rest/v1/organizer_hackathons?select=id,hackathon_name,tagline,start_date,end_date,format,venue,slug,total_prize_pool,themes&status=eq.published&order=start_date.desc`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        })
      ]);
      
      const adminData = adminResponse.ok ? await adminResponse.json() : [];
      const organizerData = organizerResponse.ok ? await organizerResponse.json() : [];
      
      const adminItems = Array.isArray(adminData) ? adminData : [];
      const organizerItems = Array.isArray(organizerData) ? organizerData : [];
      
      const mappedAdmin: TechEvent[] = adminItems.map((h: any) => ({
        id: h.id?.toString() || `admin-${Math.random()}`,
        name: h.title ?? '',
        description: h.subtitle ?? '',
        type: "hackathon" as EventType,
        startDate: h.start_date || new Date().toISOString(),
        endDate: h.end_date || h.start_date || new Date().toISOString(),
        location: h.location ?? 'Online',
        format: (h.location?.toLowerCase().includes('online') ? 'online' : 'hybrid') as EventFormat,
        prizes: 'TBD',
        tags: Array.isArray(h.focus_areas) ? h.focus_areas.map(String) : [],
        registerUrl: h.devpost_register_url ?? h.registration_url ?? '#',
        featured: false,
        status: calcStatus(h.status, h.start_date),
        organizer: 'Maximally',
        isMaximallyOfficial: true
      }));
      
      const mappedOrganizer: TechEvent[] = organizerItems.map((h: any) => ({
        id: `org-${h.id}`,
        name: h.hackathon_name ?? '',
        description: h.tagline ?? '',
        type: "hackathon" as EventType,
        startDate: h.start_date || new Date().toISOString(),
        endDate: h.end_date || new Date().toISOString(),
        location: h.format === 'online' ? 'Online' : (h.venue || 'TBD'),
        format: (h.format || 'hybrid') as EventFormat,
        prizes: h.total_prize_pool || 'TBD',
        tags: Array.isArray(h.themes) ? h.themes : [],
        registerUrl: `/hackathon/${h.slug}`,
        featured: false,
        status: calcStatus('published', h.start_date),
        organizer: 'Community Organizer',
        isMaximallyOfficial: false
      }));
      
      const allEvents = [...staticEvents, ...mappedAdmin, ...mappedOrganizer].sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      
      setEvents(allEvents.length > 0 ? allEvents : staticEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setEvents(staticEvents);
    }
  };

  useEffect(() => {
    fetchEvents();
    
    const sb = supabase;
    if (!sb) return;
    
    try {
      const channel = sb
        .channel('realtime-events-page')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'hackathons' }, () => {
          fetchEvents();
        })
        .subscribe();
      return () => {
        sb.removeChannel(channel);
      };
    } catch (err) {
      console.error('Failed to set up real-time subscriptions:', err);
    }
  }, []);

  const filterOptions = useMemo(() => {
    const formats = ['online', 'in-person', 'hybrid'];
    const statuses = ['upcoming', 'ongoing', 'completed'];
    const allTags = Array.from(new Set(events.flatMap(e => e.tags))).sort();
    
    return { formats, statuses, tags: allTags };
  }, [events]);

  const normalizeString = (str: string) => str.toLowerCase().trim();

  const hackathonEvents = useMemo(() => {
    return events.filter(event => {
      if (event.type !== 'hackathon') return false;

      const normalizedSearchQuery = searchQuery ? normalizeString(searchQuery) : '';
      if (normalizedSearchQuery && 
          !normalizeString(event.name).includes(normalizedSearchQuery) && 
          !normalizeString(event.description).includes(normalizedSearchQuery) &&
          !event.tags.some(tag => normalizeString(tag).includes(normalizedSearchQuery))) {
        return false;
      }

      if (selectedFilters.format.length > 0 && 
          !selectedFilters.format.includes(event.format)) {
        return false;
      }

      if (selectedFilters.status.length > 0 && 
          !selectedFilters.status.includes(event.status)) {
        return false;
      }

      if (selectedFilters.tags.length > 0 && 
          !selectedFilters.tags.some(tag => event.tags.includes(tag))) {
        return false;
      }

      return true;
    });
  }, [events, searchQuery, selectedFilters]);

  const otherEvents = useMemo(() => {
    return events.filter(event => {
      if (event.type === 'hackathon') return false;

      const normalizedSearchQuery = searchQuery ? normalizeString(searchQuery) : '';
      if (normalizedSearchQuery && 
          !normalizeString(event.name).includes(normalizedSearchQuery) && 
          !normalizeString(event.description).includes(normalizedSearchQuery) &&
          !event.tags.some(tag => normalizeString(tag).includes(normalizedSearchQuery))) {
        return false;
      }

      if (selectedFilters.format.length > 0 && 
          !selectedFilters.format.includes(event.format)) {
        return false;
      }

      if (selectedFilters.status.length > 0 && 
          !selectedFilters.status.includes(event.status)) {
        return false;
      }

      if (selectedFilters.tags.length > 0 && 
          !selectedFilters.tags.some(tag => event.tags.includes(tag))) {
        return false;
      }

      return true;
    });
  }, [events, searchQuery, selectedFilters]);

  const toggleFilter = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value) 
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({ format: [], status: [], tags: [] });
    setSearchQuery('');
  };

  const toggleFilterSection = (section: keyof typeof expandedFilters) => {
    setExpandedFilters(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const hackathonCount = events.filter(e => e.type === 'hackathon').length;
  const totalPrizes = events.filter(e => e.type === 'hackathon' && e.prizes).length;

  return (
    <>
      <SEO
        title="Hackathons | Discover & Join Global Hackathons | Maximally"
        description="Find the best hackathons for teen builders. Join coding competitions, innovation challenges, and build projects that matter. Plus workshops, conferences & more."
        keywords="hackathons, coding competitions, teen hackathons, programming contests, innovation challenges, builder events, coding events"
      />
      
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.10)_0%,transparent_50%)]" />
        
        <div className="absolute top-20 left-[5%] w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-60 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />
        <div className="absolute bottom-40 left-[20%] w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px]" />
        
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 animate-float pointer-events-none"
            style={{
              left: `${5 + (i * 8)}%`,
              top: `${10 + Math.sin(i) * 20}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + (i % 3)}s`,
              backgroundColor: ['#a855f7', '#ec4899', '#06b6d4', '#22c55e', '#f59e0b'][i % 5],
              boxShadow: `0 0 10px ${['#a855f7', '#ec4899', '#06b6d4', '#22c55e', '#f59e0b'][i % 5]}40`
            }}
          />
        ))}

        <div className="relative z-10 pt-24 sm:pt-28 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 mb-6">
                <Code className="w-4 h-4 text-purple-400" />
                <span className="font-press-start text-[10px] sm:text-xs text-purple-300 tracking-wider">
                  BUILD. SHIP. WIN.
                </span>
              </div>
              
              <h1 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight">
                Discover{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Hackathons
                </span>
              </h1>
              
              <p className="font-jetbrains text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
                Join the best coding competitions and innovation challenges. Build projects that matter, 
                win prizes, and connect with builders worldwide.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30">
                  <Code className="w-4 h-4 text-cyan-400" />
                  <span className="font-press-start text-[10px] text-cyan-300">{hackathonCount}+ HACKATHONS</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30">
                  <Trophy className="w-4 h-4 text-pink-400" />
                  <span className="font-press-start text-[10px] text-pink-300">$100K+ IN PRIZES</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30">
                  <Globe className="w-4 h-4 text-green-400" />
                  <span className="font-press-start text-[10px] text-green-300">GLOBAL ACCESS</span>
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto mb-10">
              <div className="relative bg-black/40 border border-purple-500/30 p-1 backdrop-blur-sm">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search hackathons by name, topic, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none font-jetbrains text-base"
                  data-testid="search-events"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-purple-500/10 border border-purple-500/30 text-purple-300 font-press-start text-xs"
                data-testid="mobile-filter-toggle"
              >
                <Filter className="h-4 w-4" />
                FILTERS
                {(selectedFilters.format.length + selectedFilters.status.length + selectedFilters.tags.length) > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-purple-500/30 text-purple-200 text-[10px]">
                    {selectedFilters.format.length + selectedFilters.status.length + selectedFilters.tags.length}
                  </span>
                )}
              </button>
            </div>

            <div className={`lg:w-72 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-24 bg-black/40 border border-purple-500/20 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-press-start text-sm text-purple-300">FILTERS</h3>
                  <button
                    onClick={clearAllFilters}
                    className="text-gray-500 font-jetbrains text-xs hover:text-purple-400 transition-colors"
                    data-testid="clear-all-filters"
                  >
                    Clear all
                  </button>
                </div>

                <Collapsible open={expandedFilters.format} onOpenChange={() => toggleFilterSection('format')} className="mb-6">
                  <CollapsibleTrigger className="flex items-center justify-between w-full group">
                    <h4 className="font-press-start text-xs text-gray-400">FORMAT</h4>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedFilters.format ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="space-y-2">
                      {filterOptions.formats.map(format => (
                        <label key={format} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters.format.includes(format)}
                            onChange={() => toggleFilter('format', format)}
                            className="mr-3 h-4 w-4 accent-purple-500 bg-transparent border-gray-600"
                            data-testid={`filter-format-${format}`}
                          />
                          <span className="font-jetbrains text-sm text-gray-400 group-hover:text-purple-300 transition-colors capitalize">{format}</span>
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={expandedFilters.status} onOpenChange={() => toggleFilterSection('status')} className="mb-6">
                  <CollapsibleTrigger className="flex items-center justify-between w-full group">
                    <h4 className="font-press-start text-xs text-gray-400">STATUS</h4>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedFilters.status ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="space-y-2">
                      {filterOptions.statuses.map(status => (
                        <label key={status} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters.status.includes(status)}
                            onChange={() => toggleFilter('status', status)}
                            className="mr-3 h-4 w-4 accent-purple-500 bg-transparent border-gray-600"
                            data-testid={`filter-status-${status}`}
                          />
                          <span className="font-jetbrains text-sm text-gray-400 group-hover:text-purple-300 transition-colors capitalize">{status}</span>
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={expandedFilters.tags} onOpenChange={() => toggleFilterSection('tags')} className="mb-4">
                  <CollapsibleTrigger className="flex items-center justify-between w-full group">
                    <h4 className="font-press-start text-xs text-gray-400">TOPICS</h4>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedFilters.tags ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
                      {filterOptions.tags.map(tag => (
                        <label key={tag} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters.tags.includes(tag)}
                            onChange={() => toggleFilter('tags', tag)}
                            className="mr-3 h-4 w-4 accent-purple-500 bg-transparent border-gray-600"
                            data-testid={`filter-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                          />
                          <span className="font-jetbrains text-sm text-gray-400 group-hover:text-purple-300 transition-colors">{tag}</span>
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/20 border border-purple-500/40 p-2">
                    <Code className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="font-press-start text-sm sm:text-base text-white">HACKATHONS</h2>
                    <p className="font-jetbrains text-xs text-gray-500">
                      {hackathonEvents.length} events found
                    </p>
                  </div>
                </div>
                {(selectedFilters.format.length + selectedFilters.status.length + selectedFilters.tags.length > 0) && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-jetbrains hover:bg-purple-500/20 transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Clear filters
                  </button>
                )}
              </div>

              {hackathonEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
                  {hackathonEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      {...event}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-black/40 border border-purple-500/20 p-12 text-center mb-12">
                  <Code className="h-12 w-12 text-purple-400/50 mx-auto mb-4" />
                  <h3 className="font-press-start text-sm text-gray-400 mb-2">NO HACKATHONS FOUND</h3>
                  <p className="font-jetbrains text-gray-500 text-sm mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-purple-500/20 border border-purple-500/40 text-purple-300 font-press-start text-xs hover:bg-purple-500/30 transition-colors"
                  >
                    CLEAR FILTERS
                  </button>
                </div>
              )}

              {otherEvents.length > 0 && (
                <div className="mt-8">
                  <button
                    onClick={() => setShowOtherEvents(!showOtherEvents)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 group"
                    data-testid="toggle-other-events"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-500/20 border border-amber-500/40 p-2">
                        <Sparkles className="h-5 w-5 text-amber-400" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-press-start text-xs sm:text-sm text-amber-300">OTHER COOL STUFF</h3>
                        <p className="font-jetbrains text-xs text-gray-500">
                          {otherEvents.length} conferences, workshops, meetups & more
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-amber-400 transition-transform duration-300 ${showOtherEvents ? 'rotate-180' : ''}`} />
                  </button>

                  {showOtherEvents && (
                    <div className="mt-5 pt-5 border-t border-amber-500/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {otherEvents.map(event => (
                          <EventCard 
                            key={event.id} 
                            {...event}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-16 p-8 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 border border-purple-500/30 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                
                <div className="relative z-10">
                  <h3 className="font-press-start text-sm sm:text-base text-white mb-3">
                    Want to host your own hackathon?
                  </h3>
                  <p className="font-jetbrains text-sm text-gray-400 mb-6 max-w-lg mx-auto">
                    Join 1000+ organizers who have launched successful events with Maximally's support.
                  </p>
                  <Link
                    to="/host-hackathon"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-press-start text-xs transition-all duration-300"
                    data-testid="link-host-hackathon"
                  >
                    <Rocket className="h-4 w-4" />
                    HOST A HACKATHON
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Events;
