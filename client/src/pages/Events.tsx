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
      
      <div className="min-h-screen bg-white dark:bg-black">
        {/* Header */}
        <div className="bg-maximally-red text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="font-press-start text-2xl md:text-3xl mb-4">
              Join the world's best hackathons
            </h1>
            <p className="font-jetbrains text-lg">
              Discover innovation challenges, coding competitions, and tech events
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by hackathon title or keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maximally-red focus:border-maximally-red outline-none font-jetbrains"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-maximally-red text-white px-4 py-1.5 rounded font-press-start text-xs hover:bg-maximally-yellow hover:text-black transition-colors">
                Search
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-jetbrains"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>

            {/* Sidebar Filters */}
            <div className={`lg:w-80 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-press-start text-lg">Filters</h3>
                  <button
                    onClick={clearAllFilters}
                    className="text-maximally-red font-jetbrains text-sm hover:underline"
                  >
                    Clear all
                  </button>
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <h4 className="font-press-start text-sm mb-3">Location</h4>
                  <div className="space-y-2">
                    {['Online', 'In-person', 'Hybrid'].map(location => (
                      <label key={location} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.location.includes(location)}
                          onChange={() => toggleFilter('location', location)}
                          className="mr-2"
                        />
                        <span className="font-jetbrains text-sm">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="mb-6">
                  <h4 className="font-press-start text-sm mb-3">Status</h4>
                  <div className="space-y-2">
                    {['upcoming', 'ongoing', 'completed'].map(status => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.status.includes(status)}
                          onChange={() => toggleFilter('status', status)}
                          className="mr-2"
                        />
                        <span className="font-jetbrains text-sm capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Length Filter */}
                <div className="mb-6">
                  <h4 className="font-press-start text-sm mb-3">Length</h4>
                  <div className="space-y-2">
                    {['24 hours', '48 hours', '3 days', '7 days'].map(length => (
                      <label key={length} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.length.includes(length)}
                          onChange={() => toggleFilter('length', length)}
                          className="mr-2"
                        />
                        <span className="font-jetbrains text-sm">{length}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Interest Tags Filter */}
                <div className="mb-6">
                  <h4 className="font-press-start text-sm mb-3">Interest Tags</h4>
                  <div className="space-y-2">
                    {['AI', 'Machine Learning', 'Web3', 'Blockchain', 'Gaming', 'DeFi'].map(tag => (
                      <label key={tag} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.tags.includes(tag)}
                          onChange={() => toggleFilter('tags', tag)}
                          className="mr-2"
                        />
                        <span className="font-jetbrains text-sm">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Info */}
              <div className="mb-6">
                <p className="font-jetbrains text-gray-600">
                  Showing {filteredHackathons.length} hackathons
                </p>
              </div>

              {/* Hackathon Cards */}
              <div className="space-y-6">
                {filteredHackathons.map(hackathon => (
                  <div key={hackathon.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex gap-4">
                      {/* Hackathon Image */}
                      <div className="w-24 h-24 bg-maximally-red rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-press-start text-xs">
                          {hackathon.name.split(' ').map(word => word[0]).join('').slice(0, 3)}
                        </span>
                      </div>

                      {/* Hackathon Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-press-start text-lg text-gray-900 mb-1">
                              {hackathon.name}
                            </h3>
                            {hackathon.status === 'upcoming' && (
                              <div className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-jetbrains">
                                Upcoming
                              </div>
                            )}
                            {hackathon.status === 'completed' && (
                              <div className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded font-jetbrains">
                                Completed
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-gray-600 mb-1">
                              <Trophy className="h-4 w-4 mr-1" />
                              <span className="font-jetbrains text-sm">{hackathon.prizes} in prizes</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Users className="h-4 w-4 mr-1" />
                              <span className="font-jetbrains text-sm">{hackathon.participants.toLocaleString()} participants</span>
                            </div>
                          </div>
                        </div>

                        <p className="font-jetbrains text-gray-700 mb-3 line-clamp-2">
                          {hackathon.description}
                        </p>

                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="font-jetbrains">
                              {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="font-jetbrains">{hackathon.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="font-jetbrains">{hackathon.length}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {hackathon.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-1 bg-maximally-red text-white text-xs rounded font-jetbrains">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Link
                              to={hackathon.detailsUrl}
                              className="px-4 py-2 border border-maximally-red text-maximally-red rounded font-jetbrains text-sm hover:bg-maximally-red hover:text-white transition-colors"
                            >
                              View Details
                            </Link>
                            <Link
                              to={hackathon.registerUrl}
                              className="px-4 py-2 bg-maximally-red text-white rounded font-jetbrains text-sm hover:bg-maximally-yellow hover:text-black transition-colors"
                            >
                              Register
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredHackathons.length === 0 && (
                <div className="text-center py-12">
                  <p className="font-jetbrains text-gray-500">
                    No hackathons found matching your criteria. Try adjusting your filters.
                  </p>
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