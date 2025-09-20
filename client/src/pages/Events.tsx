import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Trophy,
  Users,
  Clock,
  Tag,
  ExternalLink,
  ArrowRight,
  Globe,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';

const Events = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<{
    location: string[];
    status: string[];
    length: string[];
    tags: string[];
    type: string[];
  }>({
    location: [],
    status: [],
    length: [],
    tags: [],
    type: []
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  // Enhanced hackathon data structure inspired by DevPost
  const hackathons = [
    {
      id: 1,
      name: 'Code Hypothesis',
      description: 'Test your coding theories in the ultimate development challenge. Build experiments that push the boundaries of what code can do.',
      startDate: '2025-09-15',
      endDate: '2025-09-17',
      prizes: '$15,000',
      participants: 2847,
      location: 'Online',
      status: 'upcoming',
      length: '3 days',
      tags: ['Machine Learning', 'Web3', 'AI'],
      type: 'Community',
      image: '/api/placeholder/300/200',
      registerUrl: '/codehypothesis',
      detailsUrl: '/codehypothesis',
      organizer: 'Maximally'
    },
    {
      id: 2,
      name: 'Protocol 404',
      description: 'When the system is broken, build anyway. Create solutions for problems that don\'t have traditional fixes.',
      startDate: '2025-10-05',
      endDate: '2025-10-06',
      prizes: '$25,000',
      participants: 1543,
      location: 'Online',
      status: 'upcoming',
      length: '48 hours',
      tags: ['Blockchain', 'DeFi', 'Web3'],
      type: 'Community',
      image: '/api/placeholder/300/200',
      registerUrl: '/protocol-404',
      detailsUrl: '/protocol-404',
      organizer: 'Maximally'
    },
    {
      id: 3,
      name: 'AI Shipathon 2025',
      description: '48-hour global AI hackathon for builders and creators. Ship production-ready AI applications.',
      startDate: '2025-08-15',
      endDate: '2025-08-17',
      prizes: '$50,000',
      participants: 4291,
      location: 'Online',
      status: 'completed',
      length: '48 hours',
      tags: ['AI', 'Machine Learning', 'NLP'],
      type: 'Community',
      image: '/api/placeholder/300/200',
      registerUrl: '/shipathon-report',
      detailsUrl: '/shipathon-report',
      organizer: 'Maximally'
    },
    {
      id: 4,
      name: 'PromptStorm 2025',
      description: '24-hour AI prompt-engineering hackathon. When in doubt, prompt harder. Master the art of AI conversation.',
      startDate: '2025-10-25',
      endDate: '2025-10-26',
      prizes: '$10,000',
      participants: 892,
      location: 'Online',
      status: 'upcoming',
      length: '24 hours',
      tags: ['AI', 'Prompt Engineering', 'GPT'],
      type: 'Community',
      image: '/api/placeholder/300/200',
      registerUrl: '/promptstorm',
      detailsUrl: '/promptstorm',
      organizer: 'Maximally'
    },
    {
      id: 5,
      name: 'Grand Tech Assembly',
      description: 'Pick your mission, build your city, earn respect. 7-day GTA-themed hackathon with missions and achievements.',
      startDate: '2025-11-01',
      endDate: '2025-11-07',
      prizes: '$75,000',
      participants: 3642,
      location: 'Online',
      status: 'upcoming',
      length: '7 days',
      tags: ['Gaming', 'Web3', 'Metaverse'],
      type: 'Community',
      image: '/api/placeholder/300/200',
      registerUrl: '/grand-tech-assembly',
      detailsUrl: '/grand-tech-assembly',
      organizer: 'Maximally'
    },
    {
      id: 6,
      name: 'Codepocalypse 2025',
      description: 'What would you build if the internet had 48 hours left? Chaotic 48-hour hackathon for end-times builders.',
      startDate: '2025-10-18',
      endDate: '2025-10-19',
      prizes: '$20,000',
      participants: 2156,
      location: 'Online',
      status: 'upcoming',
      length: '48 hours',
      tags: ['Survival Tech', 'Decentralized', 'Emergency'],
      type: 'Community',
      image: '/api/placeholder/300/200',
      registerUrl: '/codepocalypse',
      detailsUrl: '/codepocalypse',
      organizer: 'Maximally'
    }
  ];

  // Filter and search functionality
  const filteredHackathons = useMemo(() => {
    return hackathons.filter(hackathon => {
      // Search query filter
      if (searchQuery && !hackathon.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !hackathon.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !hackathon.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }

      // Location filter
      if (selectedFilters.location.length > 0 && !selectedFilters.location.includes(hackathon.location)) {
        return false;
      }

      // Status filter  
      if (selectedFilters.status.length > 0 && !selectedFilters.status.includes(hackathon.status)) {
        return false;
      }

      // Length filter
      if (selectedFilters.length.length > 0 && !selectedFilters.length.includes(hackathon.length)) {
        return false;
      }

      // Tags filter
      if (selectedFilters.tags.length > 0 && 
          !selectedFilters.tags.some(tag => hackathon.tags.includes(tag))) {
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
      tags: [],
      type: []
    });
    setSearchQuery('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
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
                <div className="mb-8">
                  <h4 className="font-press-start text-sm mb-4 text-maximally-red">LOCATION</h4>
                  <div className="space-y-3">
                    {['Online', 'In-person', 'Hybrid'].map(location => (
                      <label key={location} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedFilters.location.includes(location)}
                          onChange={() => toggleFilter('location', location)}
                          className="mr-3 h-4 w-4 text-maximally-red focus:ring-maximally-red border-gray-300 dark:border-gray-600 rounded-none"
                          data-testid={`filter-location-${location.toLowerCase()}`}
                        />
                        <span className="font-jetbrains text-sm text-gray-700 dark:text-gray-300 group-hover:text-maximally-red transition-colors">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="mb-8">
                  <h4 className="font-press-start text-sm mb-4 text-maximally-red">STATUS</h4>
                  <div className="space-y-3">
                    {['upcoming', 'ongoing', 'completed'].map(status => (
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
                </div>

                {/* Length Filter */}
                <div className="mb-8">
                  <h4 className="font-press-start text-sm mb-4 text-maximally-red">DURATION</h4>
                  <div className="space-y-3">
                    {['24 hours', '48 hours', '3 days', '7 days'].map(length => (
                      <label key={length} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedFilters.length.includes(length)}
                          onChange={() => toggleFilter('length', length)}
                          className="mr-3 h-4 w-4 text-maximally-red focus:ring-maximally-red border-gray-300 dark:border-gray-600 rounded-none"
                          data-testid={`filter-length-${length.replace(' ', '-')}`}
                        />
                        <span className="font-jetbrains text-sm text-gray-700 dark:text-gray-300 group-hover:text-maximally-red transition-colors">{length}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Interest Tags Filter */}
                <div className="mb-6">
                  <h4 className="font-press-start text-sm mb-4 text-maximally-red">TECH FOCUS</h4>
                  <div className="space-y-3">
                    {['AI', 'Machine Learning', 'Web3', 'Blockchain', 'Gaming', 'DeFi'].map(tag => (
                      <label key={tag} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedFilters.tags.includes(tag)}
                          onChange={() => toggleFilter('tags', tag)}
                          className="mr-3 h-4 w-4 text-maximally-red focus:ring-maximally-red border-gray-300 dark:border-gray-600 rounded-none"
                          data-testid={`filter-tag-${tag.toLowerCase().replace(' ', '-')}`}
                        />
                        <span className="font-jetbrains text-sm text-gray-700 dark:text-gray-300 group-hover:text-maximally-red transition-colors">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
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

              {/* Hackathon Cards */}
              <div className="space-y-8">
                {filteredHackathons.map(hackathon => (
                  <div 
                    key={hackathon.id} 
                    className="pixel-card bg-white dark:bg-card border-2 border-maximally-red p-8 hover:shadow-glow-red hover:scale-[1.02] transition-all duration-300 group animate-fade-in"
                    data-testid={`hackathon-card-${hackathon.id}`}
                  >
                    <div className="flex gap-6">
                      {/* Hackathon Logo/Avatar */}
                      <div className="w-32 h-32 minecraft-block bg-maximally-red flex items-center justify-center flex-shrink-0 group-hover:bg-maximally-yellow transition-colors">
                        <span className="text-black font-press-start text-lg text-center leading-tight">
                          {hackathon.name.split(' ').map(word => word[0]).join('').slice(0, 3)}
                        </span>
                      </div>

                      {/* Hackathon Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-press-start text-xl text-gray-900 dark:text-white mb-3 group-hover:text-maximally-red transition-colors">
                              {hackathon.name}
                            </h3>
                            
                            {/* Status Badge */}
                            <div className="flex gap-2">
                              {hackathon.status === 'upcoming' && (
                                <div className="minecraft-block bg-green-500 text-white px-4 py-2 font-press-start text-xs">
                                  UPCOMING
                                </div>
                              )}
                              {hackathon.status === 'completed' && (
                                <div className="minecraft-block bg-gray-500 text-white px-4 py-2 font-press-start text-xs">
                                  COMPLETED
                                </div>
                              )}
                              {hackathon.status === 'ongoing' && (
                                <div className="minecraft-block bg-maximally-yellow text-black px-4 py-2 font-press-start text-xs animate-pulse">
                                  LIVE NOW
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Prize & Participants Info */}
                          <div className="text-right">
                            <div className="pixel-card bg-maximally-yellow text-black p-3 mb-3">
                              <div className="flex items-center justify-center">
                                <Trophy className="h-5 w-5 mr-2" />
                                <span className="font-press-start text-sm">{hackathon.prizes}</span>
                              </div>
                              <div className="font-jetbrains text-xs mt-1">IN PRIZES</div>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <Users className="h-4 w-4 mr-2" />
                              <span className="font-jetbrains text-sm">{hackathon.participants.toLocaleString()} builders</span>
                            </div>
                          </div>
                        </div>

                        <p className="font-jetbrains text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                          {hackathon.description}
                        </p>

                        {/* Event Details Row */}
                        <div className="flex flex-wrap gap-6 mb-6 text-sm">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Calendar className="h-5 w-5 mr-2 text-maximally-red" />
                            <span className="font-jetbrains">
                              {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPin className="h-5 w-5 mr-2 text-maximally-red" />
                            <span className="font-jetbrains">{hackathon.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Clock className="h-5 w-5 mr-2 text-maximally-red" />
                            <span className="font-jetbrains">{hackathon.length}</span>
                          </div>
                        </div>

                        {/* Tags and Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {hackathon.tags.slice(0, 4).map(tag => (
                              <span 
                                key={tag} 
                                className="minecraft-block bg-maximally-red text-white px-3 py-1 font-jetbrains text-sm hover:bg-maximally-yellow hover:text-black transition-colors cursor-pointer"
                              >
                                {tag}
                              </span>
                            ))}
                            {hackathon.tags.length > 4 && (
                              <span className="minecraft-block bg-gray-500 text-white px-3 py-1 font-jetbrains text-sm">
                                +{hackathon.tags.length - 4} more
                              </span>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <Link
                              to={hackathon.detailsUrl}
                              className="pixel-button bg-black border-2 border-maximally-red text-white hover:bg-maximally-red hover:text-black transition-all px-6 py-3 font-press-start text-sm"
                              data-testid={`view-details-${hackathon.id}`}
                            >
                              VIEW_DETAILS
                            </Link>
                            <Link
                              to={hackathon.registerUrl}
                              className="pixel-button bg-maximally-red text-black hover:bg-maximally-yellow hover:scale-105 transition-all px-6 py-3 font-press-start text-sm"
                              data-testid={`register-${hackathon.id}`}
                            >
                              REGISTER_NOW
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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