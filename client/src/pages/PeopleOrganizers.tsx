import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter, X, Users, Sparkles, Building2 } from 'lucide-react';
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

  const { data: apiOrganizers = [], isLoading, error } = useQuery<Organizer[]>({
    queryKey: ['organizers-public'],
    queryFn: async () => {
      if (!supabasePublic) {
        console.error('supabasePublic is null');
        return [];
      }
      const { data: orgProfiles, error: orgError } = await (supabasePublic as any)
        .from('organizer_profiles').select('*').eq('is_published', true).order('sort_order', { ascending: true });
      if (orgError) throw new Error(orgError.message);
      const userIds = (orgProfiles || []).map((p: any) => p.user_id);
      const { data: profiles, error: profilesError } = await (supabasePublic as any)
        .from('profiles').select('id, username, full_name, avatar_url, bio, location').in('id', userIds);
      if (profilesError) throw new Error(profilesError.message);
      const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));
      return (orgProfiles || []).map((org: any) => {
        const profile: any = profileMap.get(org.user_id) || {};
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

  const filteredOrganizers = useMemo(() => {
    return apiOrganizers.filter(org => {
      const matchesSearch = searchQuery === '' || 
        org.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        org.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = selectedTier === 'all' || org.tier === selectedTier;
      return matchesSearch && matchesTier;
    });
  }, [apiOrganizers, searchQuery, selectedTier]);

  const totalPages = Math.ceil(filteredOrganizers.length / itemsPerPage);
  const currentOrganizers = filteredOrganizers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const clearFilters = () => { setSearchQuery(''); setSelectedTier('all'); setCurrentPage(1); };
  const hasActiveFilters = searchQuery !== '' || selectedTier !== 'all';

  return (
    <>
      <SEO title="Organizers | Maximally" description="Meet the amazing organizers who host Maximally hackathons - community leaders building the future of tech events." />
      
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Green Gradient Background Effects */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.15)_0%,transparent_50%)]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.10)_0%,transparent_50%)]" />
        
        {/* Glowing Green Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-500/15 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-emerald-500/12 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-teal-500/10 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

        <main className="min-h-screen pt-24 pb-16 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600/30 to-emerald-600/20 border border-green-500/40 mb-8">
                <Building2 className="h-5 w-5 text-green-400" />
                <span className="font-press-start text-xs text-green-300">EVENT HOSTS</span>
                <Sparkles className="h-5 w-5 text-emerald-400" />
              </div>
              
              <h1 className="font-press-start text-4xl md:text-5xl lg:text-6xl mb-8">
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  ORGANIZERS
                </span>
              </h1>
              
              <p className="text-gray-300 text-lg md:text-xl font-jetbrains max-w-4xl mx-auto leading-relaxed mb-8">
                The community leaders who bring Maximally hackathons to life. 
                <span className="text-green-400 font-bold"> Event hosts from around the world</span> making innovation happen.
              </p>
              
              <div className="flex justify-center gap-4 mb-8 flex-wrap">
                <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/20 border border-green-500/40 px-5 py-3">
                  <span className="font-press-start text-xs text-green-300">{apiOrganizers.length} ORGANIZERS</span>
                </div>
                <div className="bg-gradient-to-r from-teal-600/30 to-cyan-600/20 border border-teal-500/40 px-5 py-3">
                  <span className="font-press-start text-xs text-teal-300">5 TIERS</span>
                </div>
              </div>
              
              <Link 
                to="/people" 
                className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 font-press-start text-xs border border-green-500/50 transition-all hover:scale-[1.02]"
              >
                ← BACK TO PEOPLE
              </Link>
            </section>

            {/* Search and Filters */}
            <section className="mb-10 max-w-4xl mx-auto">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                <input 
                  type="text" 
                  placeholder="Search organizers by name, organization, location..." 
                  value={searchQuery} 
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
                  className="w-full bg-black/50 border border-green-500/40 text-white pl-12 pr-4 py-4 font-jetbrains focus:border-emerald-400 focus:outline-none transition-colors placeholder:text-gray-500" 
                />
              </div>
              
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <button 
                  onClick={() => setShowFilters(!showFilters)} 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-5 py-2 font-press-start text-xs border border-green-500/50 flex items-center gap-2 transition-all"
                >
                  <Filter className="h-4 w-4" />
                  {showFilters ? 'HIDE FILTERS' : 'SHOW FILTERS'}
                </button>
                
                {hasActiveFilters && (
                  <button 
                    onClick={clearFilters} 
                    className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-2 font-press-start text-xs border border-red-500/50 flex items-center gap-2 transition-all"
                  >
                    <X className="h-4 w-4" />
                    CLEAR ALL
                  </button>
                )}
              </div>
              
              {showFilters && (
                <div className="mb-6 bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/40 p-6">
                  <label className="font-press-start text-xs text-green-400 mb-3 block">FILTER BY TIER</label>
                  <select 
                    value={selectedTier} 
                    onChange={(e) => { setSelectedTier(e.target.value as OrganizerTier | 'all'); setCurrentPage(1); }} 
                    className="w-full bg-black/50 border border-green-500/40 text-white px-4 py-3 font-jetbrains focus:border-emerald-400 focus:outline-none transition-colors"
                  >
                    <option value="all">All Tiers</option>
                    <option value="legacy">🔥 Legacy Organizer</option>
                    <option value="chief">👑 Chief Organizer</option>
                    <option value="senior">⭐ Senior Organizer</option>
                    <option value="verified">✓ Verified Organizer</option>
                    <option value="starter">🌱 Starter Organizer</option>
                  </select>
                </div>
              )}
              
              <p className="text-center font-jetbrains text-gray-400 text-sm">
                Showing <span className="text-green-400 font-bold">{filteredOrganizers.length}</span> organizers
                {hasActiveFilters && ' (filtered)'}
              </p>
            </section>

            {/* Organizers Grid */}
            <section id="organizers-section">
              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/30 p-6 animate-pulse">
                      <div className="h-20 w-20 bg-gray-800 mx-auto mb-4" />
                      <div className="h-4 bg-gray-800 mb-2" />
                      <div className="h-3 bg-gray-800 w-3/4 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : currentOrganizers.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {currentOrganizers.map((org) => (
                      <OrganizerCard key={org.id} organizer={org} />
                    ))}
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mb-8">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                        disabled={currentPage === 1} 
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white border border-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      <span className="px-6 py-2 font-press-start text-sm text-green-400 bg-green-900/20 border border-green-500/30">
                        {currentPage} / {totalPages}
                      </span>
                      
                      <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                        disabled={currentPage === totalPages} 
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white border border-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/30 px-8 py-6 inline-block mb-6">
                    <Users className="h-12 w-12 text-green-500/50 mx-auto mb-4" />
                    <p className="font-press-start text-sm text-gray-400">NO ORGANIZERS FOUND</p>
                  </div>
                  <p className="text-gray-500 font-jetbrains mb-6">Try adjusting your search or filters.</p>
                  <button 
                    onClick={clearFilters} 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 font-press-start text-xs border border-green-500/50 transition-all"
                  >
                    CLEAR FILTERS
                  </button>
                </div>
              )}

              {/* CTA Section */}
              <div className="mt-16 text-center">
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/40 p-10 max-w-2xl mx-auto">
                  <Sparkles className="h-12 w-12 text-green-400 mx-auto mb-6" />
                  <h3 className="font-press-start text-lg bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                    BECOME AN ORGANIZER
                  </h3>
                  <p className="font-jetbrains text-gray-300 mb-6">
                    Want to host hackathons with Maximally? Join our community of organizers and bring innovation to your city.
                  </p>
                  <Link 
                    to="/organizer/apply" 
                    className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8 py-4 font-press-start text-sm border border-green-500/50 transition-all hover:scale-[1.02]"
                  >
                    APPLY TO BE AN ORGANIZER
                  </Link>
                </div>
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
