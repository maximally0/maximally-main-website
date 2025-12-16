import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import OrganizerCard from '@/components/organizers/OrganizerCard';
import { useQuery } from '@tanstack/react-query';
import { supabasePublic } from '@/lib/supabaseClient';

type OrganizerTier = 'starter' | 'verified' | 'senior' | 'chief' | 'legacy';

interface Organizer {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  profilePhoto: string | null;
  headline: string;
  shortBio: string;
  location: string;
  organizationName: string;
  organizationType: string;
  tier: OrganizerTier;
  totalHackathonsHosted: number;
  totalParticipantsReached: number;
  website: string | null;
  linkedin: string | null;
  twitter: string | null;
  isPublished: boolean;
}

const PeopleOrganizers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<OrganizerTier | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 12;

  // Fetch organizers
  const { data: apiOrganizers = [], isLoading } = useQuery<Organizer[]>({
    queryKey: ['organizers-public'],
    queryFn: async () => {
      if (!supabasePublic) return [];
      
      // Get organizer profiles that are published
      const { data: orgProfiles, error: orgError } = await (supabasePublic as any)
        .from('organizer_profiles')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });
      
      if (orgError) throw new Error(orgError.message);
      
      // Get user profiles for these organizers
      const userIds = (orgProfiles || []).map((p: any) => p.user_id);
      const { data: profiles, error: profilesError } = await (supabasePublic as any)
        .from('profiles')
        .select('id, username, full_name, avatar_url, bio, location')
        .in('id', userIds);
      
      if (profilesError) throw new Error(profilesError.message);
      
      const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));
      
      return (orgProfiles || []).map((org: any) => {
        const profile = profileMap.get(org.user_id) || {};
        return {
          id: org.id,
          userId: org.user_id,
          username: profile.username || '',
          fullName: profile.full_name || org.display_name || '',
          profilePhoto: profile.avatar_url || org.logo_url,
          headline: org.headline || org.organization_name || 'Organizer',
          shortBio: org.bio || profile.bio || '',
          location: org.location || profile.location || '',
          organizationName: org.organization_name || '',
          organizationType: org.organization_type || 'individual',
          tier: org.tier || 'starter',
          totalHackathonsHosted: org.total_hackathons_hosted || 0,
          totalParticipantsReached: org.total_participants_reached || 0,
          website: org.website,
          linkedin: org.linkedin,
          twitter: org.twitter,
          isPublished: org.is_published
        };
      });
    }
  });

  const allOrganizers = apiOrganizers;

  // Filter organizers
  const filteredOrganizers = useMemo(() => {
    return allOrganizers.filter(org => {
      const matchesSearch = searchQuery === '' ||
        org.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier = selectedTier === 'all' || org.tier === selectedTier;

      return matchesSearch && matchesTier;
    });
  }, [allOrganizers, searchQuery, selectedTier]);

  // Pagination
  const totalPages = Math.ceil(filteredOrganizers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrganizers = filteredOrganizers.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = () => setCurrentPage(1);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document.getElementById('organizers-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1, '...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...', totalPages);
      }
    }
    return pages;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTier('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery !== '' || selectedTier !== 'all';


  return (
    <>
      <SEO
        title="Organizers | Maximally"
        description="Meet the amazing organizers who host Maximally hackathons - community leaders building the future of tech events."
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="fixed w-2 h-2 bg-maximally-red pixel-border animate-float pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}

        <main className="min-h-screen pt-24 pb-16 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-12">
              <div className="minecraft-block bg-green-400 text-black px-6 py-3 inline-block mb-8">
                <span className="font-press-start text-sm">🎯 EVENT HOSTS</span>
              </div>
              <h1 className="font-press-start text-4xl md:text-6xl lg:text-8xl mb-8 minecraft-text">
                <span className="text-green-400 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">ORGANIZERS</span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl font-jetbrains max-w-4xl mx-auto leading-relaxed mb-8">
                The community leaders who bring Maximally hackathons to life. Event hosts from around the world.
              </p>
              
              <div className="flex justify-center gap-8 mb-8">
                <div className="minecraft-block bg-maximally-red text-black px-4 py-2">
                  <span className="font-press-start text-xs">{allOrganizers.length} ORGANIZERS</span>
                </div>
                <div className="minecraft-block bg-maximally-yellow text-black px-4 py-2">
                  <span className="font-press-start text-xs">5 TIERS</span>
                </div>
              </div>
              
              <Link to="/people" className="inline-block minecraft-block bg-maximally-yellow text-black px-4 py-2 hover:bg-maximally-red transition-colors">
                <span className="font-press-start text-xs">← BACK TO PEOPLE</span>
              </Link>
            </section>

            {/* Search and Filters */}
            <section className="mb-8">
              <div className="max-w-4xl mx-auto">
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search organizers by name, organization, location..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); handleFilterChange(); }}
                    className="w-full pixel-card bg-gray-900 border-2 border-green-400 text-white pl-12 pr-4 py-3 font-jetbrains focus:border-maximally-yellow focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="minecraft-block bg-green-400 text-black px-4 py-2 hover:bg-maximally-yellow transition-colors flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="font-press-start text-xs">{showFilters ? 'HIDE FILTERS' : 'SHOW FILTERS'}</span>
                  </button>

                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="minecraft-block bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors flex items-center gap-2">
                      <X className="h-4 w-4" />
                      <span className="font-press-start text-xs">CLEAR ALL</span>
                    </button>
                  )}
                </div>

                {showFilters && (
                  <div className="mb-6">
                    <label className="font-press-start text-xs text-green-400 mb-2 block">TIER</label>
                    <select
                      value={selectedTier}
                      onChange={(e) => { setSelectedTier(e.target.value as OrganizerTier | 'all'); handleFilterChange(); }}
                      className="w-full pixel-card bg-gray-900 border-2 border-green-400 text-white px-4 py-2 font-jetbrains focus:border-maximally-yellow focus:outline-none transition-colors"
                    >
                      <option value="all">All Tiers</option>
                      <option value="legacy">Legacy Organizer</option>
                      <option value="chief">Chief Organizer</option>
                      <option value="senior">Senior Organizer</option>
                      <option value="verified">Verified Organizer</option>
                      <option value="starter">Starter Organizer</option>
                    </select>
                  </div>
                )}

                <div className="text-center">
                  <span className="font-jetbrains text-gray-400 text-sm">
                    Showing {filteredOrganizers.length} {filteredOrganizers.length === 1 ? 'organizer' : 'organizers'}
                    {hasActiveFilters && ' (filtered)'}
                  </span>
                </div>
              </div>
            </section>

            {/* Organizers Grid */}
            <section id="organizers-section">
              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="pixel-card bg-gray-900 border-2 border-gray-700 p-6 animate-pulse">
                      <div className="h-32 bg-gray-800 mb-4"></div>
                      <div className="h-4 bg-gray-800 mb-2"></div>
                      <div className="h-3 bg-gray-800"></div>
                    </div>
                  ))}
                </div>
              ) : currentOrganizers.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {currentOrganizers.map((organizer) => (
                      <OrganizerCard key={organizer.id} organizer={organizer} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mb-8">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`minecraft-block px-3 py-2 ${currentPage === 1 ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-green-400 text-black hover:bg-maximally-yellow'} transition-colors`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      
                      {getPageNumbers().map((page, index) => (
                        <button
                          key={index}
                          onClick={() => typeof page === 'number' ? goToPage(page) : undefined}
                          disabled={typeof page === 'string'}
                          className={`minecraft-block px-3 py-2 font-press-start text-xs transition-colors ${
                            page === currentPage ? 'bg-maximally-red text-white' :
                            typeof page === 'number' ? 'bg-green-400 text-black hover:bg-maximally-yellow' :
                            'bg-gray-700 text-gray-400 cursor-default'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`minecraft-block px-3 py-2 ${currentPage === totalPages ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-green-400 text-black hover:bg-maximally-yellow'} transition-colors`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="minecraft-block bg-gray-800 text-gray-300 px-6 py-4 inline-block mb-4">
                    <span className="font-press-start text-sm">NO ORGANIZERS FOUND</span>
                  </div>
                  <p className="text-gray-400 font-jetbrains mb-4">Try adjusting your search or filters.</p>
                  <button onClick={clearFilters} className="minecraft-block bg-green-400 text-black px-4 py-2 hover:bg-maximally-yellow transition-colors">
                    <span className="font-press-start text-xs">CLEAR FILTERS</span>
                  </button>
                </div>
              )}

              {/* CTA Section */}
              <div className="text-center mt-12">
                <div className="minecraft-block bg-gray-800 text-gray-300 px-6 py-4 inline-block mb-6">
                  <span className="font-jetbrains text-sm">Want to become a Maximally Organizer?</span>
                </div>
                <Link to="/organizer/apply" className="minecraft-block bg-maximally-red text-white px-6 py-3 hover:bg-maximally-yellow hover:text-black transition-colors inline-block">
                  <span className="font-press-start text-sm">APPLY TO BE AN ORGANIZER</span>
                </Link>
              </div>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PeopleOrganizers;
