import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  X,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import HackathonCard from '@/components/CollapsibleHackathonCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { grandIndianHackathonSeason, calculateHackathonStatus } from '@shared/schema';

const Events = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<{
    location: string[];
    status: string[];
    length: string[];
    tags: string[];
  }>({
    location: [],
    status: [],
    length: [],
    tags: []
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);
  const [expandedFilters, setExpandedFilters] = useState<{
    location: boolean;
    status: boolean;
    duration: boolean;
    tags: boolean;
  }>({
    location: true,
    status: true,
    duration: true,
    tags: true
  });

  // Use the real hackathon data from shared schema with dynamic status calculation
  const hackathons = useMemo(() => 
    grandIndianHackathonSeason.map(hackathon => ({
      ...hackathon,
      status: calculateHackathonStatus(hackathon.startDate, hackathon.endDate)
    })), []);

  // Derive filter options from actual data
  const filterOptions = useMemo(() => {
    const uniqueLocations = Array.from(new Set(hackathons.map(h => h.location))).sort();
    const uniqueStatuses = Array.from(new Set(hackathons.map(h => h.status))).sort();
    const uniqueLengths = Array.from(new Set(hackathons.map(h => h.length))).sort();
    const uniqueTags = Array.from(new Set(hackathons.flatMap(h => h.tags))).sort();
    
    return {
      locations: uniqueLocations,
      statuses: uniqueStatuses,
      lengths: uniqueLengths,
      tags: uniqueTags
    };
  }, [hackathons]);

  // Utility function for normalized string comparison
  const normalizeString = (str: string) => str.toLowerCase().trim();

  // Filter and search functionality with normalized string comparisons
  const filteredHackathons = useMemo(() => {
    return hackathons.filter(hackathon => {
      const normalizedSearchQuery = searchQuery ? normalizeString(searchQuery) : '';
      
      // Search query filter - case insensitive and trimmed
      if (normalizedSearchQuery && 
          !normalizeString(hackathon.name).includes(normalizedSearchQuery) && 
          !normalizeString(hackathon.description).includes(normalizedSearchQuery) &&
          !hackathon.tags.some(tag => normalizeString(tag).includes(normalizedSearchQuery))) {
        return false;
      }

      // Location filter - case insensitive comparison
      if (selectedFilters.location.length > 0 && 
          !selectedFilters.location.some(filter => normalizeString(filter) === normalizeString(hackathon.location))) {
        return false;
      }

      // Status filter - case insensitive comparison
      if (selectedFilters.status.length > 0 && 
          !selectedFilters.status.some(filter => normalizeString(filter) === normalizeString(hackathon.status))) {
        return false;
      }

      // Length filter - case insensitive comparison
      if (selectedFilters.length.length > 0 && 
          !selectedFilters.length.some(filter => normalizeString(filter) === normalizeString(hackathon.length))) {
        return false;
      }

      // Tags filter - case insensitive comparison
      if (selectedFilters.tags.length > 0 && 
          !selectedFilters.tags.some(filterTag => 
            hackathon.tags.some(hackathonTag => normalizeString(filterTag) === normalizeString(hackathonTag)))) {
        return false;
      }

      return true;
    });
  }, [hackathons, searchQuery, selectedFilters]);

  const toggleFilter = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value) 
        ? prev[category].filter((item: string) => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      location: [],
      status: [],
      length: [],
      tags: []
    });
    setSearchQuery('');
  };

  const toggleFilterSection = (section: keyof typeof expandedFilters) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <>
      <SEO
        title="Find Hackathons | Join Global Innovation Challenges | Maximally"
        description="Discover and join the world's best hackathons. Find upcoming coding competitions, AI challenges, and innovation contests from around the globe."
        keywords="hackathons, coding competitions, AI hackathons, programming contests, innovation challenges, tech events, developer competitions"
      />
      
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors">
        {/* Pixel Grid Background */}
        <div className="fixed inset-0 bg-white dark:bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(229,9,20,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.1)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(229,9,20,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.2)_1px,transparent_1px)]" />
        
        {/* Header */}
        <div className="bg-maximally-red text-white py-16 mt-16 relative z-10">
          {/* Floating Pixels Animation */}
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-maximally-yellow pixel-border animate-float pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i * 0.3}s`,
              }}
            />
          ))}
          
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <div className="minecraft-block bg-maximally-yellow text-black px-6 py-3 inline-block mb-6 animate-pulse">
              <span className="font-press-start text-sm">🌟 GLOBAL HACKATHON LEAGUE</span>
            </div>
            <h1 className="font-press-start text-3xl md:text-4xl lg:text-5xl mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-fade-in">
              Join the world's best hackathons
            </h1>
            <p className="font-jetbrains text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Discover innovation challenges, coding competitions, and tech events from around the globe
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="pixel-card bg-white dark:bg-card border-2 border-maximally-red p-6 max-w-3xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by hackathon title or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-28 py-4 bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-none focus:ring-2 focus:ring-maximally-red focus:border-maximally-red outline-none font-jetbrains text-lg"
                  data-testid="search-hackathons"
                />
                <button className="pixel-button absolute right-2 top-1/2 transform -translate-y-1/2 bg-maximally-red text-white px-6 py-2 font-press-start text-xs hover:bg-maximally-yellow hover:text-black transition-colors hover:scale-105">
                  SEARCH
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="pixel-button bg-white dark:bg-card border-2 border-maximally-red text-gray-900 dark:text-white hover:bg-maximally-red hover:text-white transition-all px-6 py-3 font-press-start text-sm flex items-center gap-2"
                data-testid="mobile-filter-toggle"
              >
                <Filter className="h-4 w-4" />
                FILTERS
              </button>
            </div>

            {/* Sidebar Filters */}
            <div className={`lg:w-80 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="pixel-card bg-white dark:bg-card border-2 border-maximally-red p-6 sticky top-24 hover:shadow-glow-red transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-press-start text-lg text-gray-900 dark:text-white">FILTERS</h3>
                  <button
                    onClick={clearAllFilters}
                    className="text-maximally-red font-jetbrains text-sm hover:text-maximally-yellow transition-colors underline-offset-4 hover:underline"
                    data-testid="clear-all-filters"
                  >
                    Clear all
                  </button>
                </div>

                {/* Location Filter */}
                <Collapsible open={expandedFilters.location} onOpenChange={() => toggleFilterSection('location')} className="mb-8">
                  <CollapsibleTrigger className="flex items-center justify-between w-full group">
                    <h4 className="font-press-start text-sm text-maximally-red">LOCATION</h4>
                    <ChevronDown className={`h-4 w-4 text-maximally-red transition-transform ${expandedFilters.location ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <div className="space-y-3">
                      {filterOptions.locations.map(location => (
                        <label key={location} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters.location.includes(location)}
                            onChange={() => toggleFilter('location', location)}
                            className="mr-3 h-4 w-4 text-maximally-red focus:ring-maximally-red border-gray-300 dark:border-gray-600 rounded-none"
                            data-testid={`filter-location-${normalizeString(location).replace(/\s+/g, '-')}`}
                          />
                          <span className="font-jetbrains text-sm text-gray-700 dark:text-gray-300 group-hover:text-maximally-red transition-colors">{location}</span>
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Status Filter */}
                <Collapsible open={expandedFilters.status} onOpenChange={() => toggleFilterSection('status')} className="mb-8">
                  <CollapsibleTrigger className="flex items-center justify-between w-full group">
                    <h4 className="font-press-start text-sm text-maximally-red">STATUS</h4>
                    <ChevronDown className={`h-4 w-4 text-maximally-red transition-transform ${expandedFilters.status ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <div className="space-y-3">
                      {filterOptions.statuses.map(status => (
                        <label key={status} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters.status.includes(status)}
                            onChange={() => toggleFilter('status', status)}
                            className="mr-3 h-4 w-4 text-maximally-red focus:ring-maximally-red border-gray-300 dark:border-gray-600 rounded-none"
                            data-testid={`filter-status-${status}`}
                          />
                          <span className="font-jetbrains text-sm text-gray-700 dark:text-gray-300 group-hover:text-maximally-red transition-colors capitalize">{status}</span>
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Length Filter */}
                <Collapsible open={expandedFilters.duration} onOpenChange={() => toggleFilterSection('duration')} className="mb-8">
                  <CollapsibleTrigger className="flex items-center justify-between w-full group">
                    <h4 className="font-press-start text-sm text-maximally-red">DURATION</h4>
                    <ChevronDown className={`h-4 w-4 text-maximally-red transition-transform ${expandedFilters.duration ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <div className="space-y-3">
                      {filterOptions.lengths.map(length => (
                        <label key={length} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters.length.includes(length)}
                            onChange={() => toggleFilter('length', length)}
                            className="mr-3 h-4 w-4 text-maximally-red focus:ring-maximally-red border-gray-300 dark:border-gray-600 rounded-none"
                            data-testid={`filter-length-${normalizeString(length).replace(/\s+/g, '-')}`}
                          />
                          <span className="font-jetbrains text-sm text-gray-700 dark:text-gray-300 group-hover:text-maximally-red transition-colors">{length}</span>
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Tags Filter */}
                <Collapsible open={expandedFilters.tags} onOpenChange={() => toggleFilterSection('tags')} className="mb-6">
                  <CollapsibleTrigger className="flex items-center justify-between w-full group">
                    <h4 className="font-press-start text-sm text-maximally-red">FOCUS AREAS</h4>
                    <ChevronDown className={`h-4 w-4 text-maximally-red transition-transform ${expandedFilters.tags ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {filterOptions.tags.map(tag => (
                        <label key={tag} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters.tags.includes(tag)}
                            onChange={() => toggleFilter('tags', tag)}
                            className="mr-3 h-4 w-4 text-maximally-red focus:ring-maximally-red border-gray-300 dark:border-gray-600 rounded-none"
                            data-testid={`filter-tag-${normalizeString(tag).replace(/\s+/g, '-')}`}
                          />
                          <span className="font-jetbrains text-sm text-gray-700 dark:text-gray-300 group-hover:text-maximally-red transition-colors">{tag}</span>
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Info */}
              <div className="mb-8">
                <div className="pixel-card bg-white dark:bg-card border-2 border-gray-300 dark:border-gray-600 p-4">
                  <p className="font-press-start text-sm text-gray-700 dark:text-gray-300">
                    SHOWING {filteredHackathons.length} HACKATHONS
                  </p>
                </div>
              </div>

              {/* Hackathon Cards - Now using HackathonCard */}
              <div className="space-y-4">
                {filteredHackathons.map(hackathon => (
                  <HackathonCard 
                    key={hackathon.id}
                    hackathon={hackathon}
                    className="animate-fade-in"
                  />
                ))}
              </div>

              {/* Empty State */}
              {filteredHackathons.length === 0 && (
                <div className="pixel-card bg-white dark:bg-card border-2 border-gray-400 dark:border-gray-600 p-12 text-center">
                  <div className="minecraft-block bg-gray-500 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-press-start text-lg text-gray-700 dark:text-gray-300 mb-4">
                    NO HACKATHONS FOUND
                  </h3>
                  <p className="font-jetbrains text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    No hackathons match your current search and filter criteria. Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="pixel-button bg-maximally-red text-white hover:bg-maximally-yellow hover:text-black transition-all px-6 py-3 font-press-start text-sm"
                    data-testid="clear-filters-empty-state"
                  >
                    CLEAR_ALL_FILTERS
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Events;