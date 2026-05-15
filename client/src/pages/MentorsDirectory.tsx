import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Star, MapPin, Calendar, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';

interface Mentor {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  skills: string[];
  mentored_hours: number;
  status: 'available' | 'in_session' | 'busy' | 'offline';
  booking_url: string | null;
  github_username: string | null;
  linkedin_username: string | null;
  website_url: string | null;
  availability: TimeSlot[];
}

interface TimeSlot {
  day: string;
  start_time: string;
  end_time: string;
  timezone?: string;
}

const MentorsDirectory: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  useEffect(() => {
    fetchMentors();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [mentors, searchTerm, selectedSkills, statusFilter]);

  const fetchMentors = async () => {
    try {
      const response = await fetch('/api/mentors');
      if (response.ok) {
        const data = await response.json();
        setMentors(data.mentors || []);
        
        // Extract unique skills
        const skills = new Set<string>();
        data.mentors?.forEach((mentor: Mentor) => {
          mentor.skills?.forEach(skill => skills.add(skill));
        });
        setAvailableSkills(Array.from(skills));
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  }; 
  const filterMentors = () => {
    let filtered = mentors;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        mentor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by selected skills
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(mentor =>
        selectedSkills.some(skill => mentor.skills.includes(skill))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(mentor => mentor.status === statusFilter);
    }

    setFilteredMentors(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { color: 'bg-green-100 text-green-800', text: 'Available Now' },
      in_session: { color: 'bg-yellow-100 text-yellow-800', text: 'In Session' },
      busy: { color: 'bg-red-100 text-red-800', text: 'Busy' },
      offline: { color: 'bg-gray-100 text-gray-800', text: 'Offline' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.offline;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Find Mentors - Maximally"
        description="Connect with experienced mentors to guide your hackathon journey"
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Mentor</h1>
            <p className="text-lg text-gray-600">Connect with experienced mentors to guide your hackathon journey</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search mentors by name or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="lg:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available Now</option>
                  <option value="in_session">In Session</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>

            {/* Skills Filter */}
            {availableSkills.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Skills:</label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.slice(0, 10).map(skill => (
                    <button
                      key={skill}
                      onClick={() => {
                        if (selectedSkills.includes(skill)) {
                          setSelectedSkills(selectedSkills.filter(s => s !== skill));
                        } else {
                          setSelectedSkills([...selectedSkills, skill]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedSkills.includes(skill)
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map(mentor => (
              <div key={mentor.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={mentor.avatar_url || '/default-avatar.svg'}
                      alt={mentor.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{mentor.full_name}</h3>
                      <p className="text-sm text-gray-600">@{mentor.username}</p>
                    </div>
                  </div>
                  {getStatusBadge(mentor.status)}
                </div>

                {mentor.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{mentor.bio}</p>
                )}

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {mentor.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                    {mentor.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                        +{mentor.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{mentor.mentored_hours}h mentored</span>
                  </div>
                  {mentor.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{mentor.location}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    disabled={mentor.status !== 'available'}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      mentor.status === 'available'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {mentor.status === 'available' 
                      ? 'Request Help' 
                      : mentor.status === 'in_session' 
                        ? 'In Session' 
                        : 'Offline'
                    }
                  </button>
                  {mentor.booking_url && (
                    <a
                      href={mentor.booking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MentorsDirectory;