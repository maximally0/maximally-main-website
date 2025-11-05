import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import JudgeCard from '@/components/judges/JudgeCard';
import { getPublishedJudges, type JudgeTier, type ExpertiseArea } from '@/lib/judgesData';

const PeopleJudges = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<JudgeTier | 'all'>('all');
  const [selectedExpertise, setSelectedExpertise] = useState<ExpertiseArea | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 12;

  // Get all published judges from mock data
  const allJudges = getPublishedJudges();

  // All possible expertise areas for filter
  const expertiseAreas: ExpertiseArea[] = [
    'AI', 'Product', 'Systems', 'Education', 'Design', 'Backend',
    'Frontend', 'Mobile', 'DevOps', 'Security', 'Blockchain',
    'Data Science', 'Game Development', 'Hardware', 'IoT'
  ];

  // Filter judges based on search and filters
  const filteredJudges = useMemo(() => {
    return allJudges.filter(judge => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        judge.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        judge.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        judge.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        judge.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Tier filter
      const matchesTier = selectedTier === 'all' || judge.tier === selectedTier;

      // Expertise filter
      const matchesExpertise = selectedExpertise === 'all' ||
        judge.primaryExpertise.includes(selectedExpertise) ||
        judge.secondaryExpertise.includes(selectedExpertise);

      return matchesSearch && matchesTier && matchesExpertise;
    });
  }, [allJudges, searchQuery, selectedTier, selectedExpertise]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredJudges.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJudges = filteredJudges.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const judgesSection = document.getElementById('judges-section');
      if (judgesSection) {
        judgesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTier('all');
    setSelectedExpertise('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery !== '' || selectedTier !== 'all' || selectedExpertise !== 'all';

  return (
    <>
      <SEO
        title="Judges | Maximally"
        description="Meet the industry experts who judge Maximally hackathons - professionals from Meta, Amazon, Google, and top companies worldwide."
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Pixel Grid Background */}
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating Pixels */}
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
              <div className="minecraft-block bg-cyan-400 text-black px-6 py-3 inline-block mb-8">
                <span className="font-press-start text-sm">⚡ ELITE PANEL</span>
              </div>
              <h1 className="font-press-start text-4xl md:text-6xl lg:text-8xl mb-8 minecraft-text">
                <span className="text-cyan-400 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  JUDGES
                </span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl font-jetbrains max-w-4xl mx-auto leading-relaxed mb-8">
                The tech elite who evaluate innovation at Maximally hackathons. Industry legends from the world's top companies.
              </p>
              
              {/* Stats */}
              <div className="flex justify-center gap-8 mb-8">
                <div className="minecraft-block bg-maximally-red text-black px-4 py-2">
                  <span className="font-press-start text-xs">{allJudges.length} JUDGES</span>
                </div>
                <div className="minecraft-block bg-maximally-yellow text-black px-4 py-2">
                  <span className="font-press-start text-xs">5 TIERS</span>
                </div>
              </div>
              
              {/* Back to People Button */}
              <Link
                to="/people"
                className="inline-block minecraft-block bg-maximally-yellow text-black px-4 py-2 hover:bg-maximally-red transition-colors"
              >
                <span className="font-press-start text-xs">← BACK TO PEOPLE</span>
              </Link>
            </section>

            {/* Search and Filters Section */}
            <section className="mb-8">
              <div className="max-w-4xl mx-auto">
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search judges by name, company, location..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full pixel-card bg-gray-900 border-2 border-cyan-400 text-white pl-12 pr-4 py-3 font-jetbrains focus:border-maximally-yellow focus:outline-none transition-colors"
                  />
                </div>

                {/* Filters Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="minecraft-block bg-cyan-400 text-black px-4 py-2 hover:bg-maximally-yellow transition-colors flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="font-press-start text-xs">
                      {showFilters ? 'HIDE FILTERS' : 'SHOW FILTERS'}
                    </span>
                  </button>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="minecraft-block bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      <span className="font-press-start text-xs">CLEAR ALL</span>
                    </button>
                  )}
                </div>

                {/* Filter Dropdowns */}
                {showFilters && (
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {/* Tier Filter */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">TIER</label>
                      <select
                        value={selectedTier}
                        onChange={(e) => {
                          setSelectedTier(e.target.value as JudgeTier | 'all');
                          handleFilterChange();
                        }}
                        className="w-full pixel-card bg-gray-900 border-2 border-cyan-400 text-white px-4 py-2 font-jetbrains focus:border-maximally-yellow focus:outline-none transition-colors"
                      >
                        <option value="all">All Tiers</option>
                        <option value="legacy">Legacy Judge</option>
                        <option value="chief">Chief Judge</option>
                        <option value="senior">Senior Judge</option>
                        <option value="verified">Verified Judge</option>
                        <option value="starter">Starter Judge</option>
                      </select>
                    </div>

                    {/* Expertise Filter */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">EXPERTISE</label>
                      <select
                        value={selectedExpertise}
                        onChange={(e) => {
                          setSelectedExpertise(e.target.value as ExpertiseArea | 'all');
                          handleFilterChange();
                        }}
                        className="w-full pixel-card bg-gray-900 border-2 border-cyan-400 text-white px-4 py-2 font-jetbrains focus:border-maximally-yellow focus:outline-none transition-colors"
                      >
                        <option value="all">All Expertise</option>
                        {expertiseAreas.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Results count */}
                <div className="text-center">
                  <span className="font-jetbrains text-gray-400 text-sm">
                    Showing {filteredJudges.length} {filteredJudges.length === 1 ? 'judge' : 'judges'}
                    {hasActiveFilters && ' (filtered)'}
                  </span>
                </div>
              </div>
            </section>

            {/* Judges Grid Section */}
            <section id="judges-section">
              {currentJudges.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {currentJudges.map((judge) => (
                      <JudgeCard key={judge.id} judge={judge} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mb-8">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`minecraft-block px-3 py-2 ${
                          currentPage === 1 
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                            : 'bg-cyan-400 text-black hover:bg-maximally-yellow'
                        } transition-colors`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      
                      {getPageNumbers().map((page, index) => (
                        <button
                          key={index}
                          onClick={() => typeof page === 'number' ? goToPage(page) : undefined}
                          disabled={typeof page === 'string'}
                          className={`minecraft-block px-3 py-2 font-press-start text-xs transition-colors ${
                            page === currentPage
                              ? 'bg-maximally-red text-white'
                              : typeof page === 'number'
                              ? 'bg-cyan-400 text-black hover:bg-maximally-yellow'
                              : 'bg-gray-700 text-gray-400 cursor-default'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`minecraft-block px-3 py-2 ${
                          currentPage === totalPages 
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                            : 'bg-cyan-400 text-black hover:bg-maximally-yellow'
                        } transition-colors`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="minecraft-block bg-gray-800 text-gray-300 px-6 py-4 inline-block mb-4">
                    <span className="font-press-start text-sm">NO JUDGES FOUND</span>
                  </div>
                  <p className="text-gray-400 font-jetbrains mb-4">
                    Try adjusting your search or filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="minecraft-block bg-cyan-400 text-black px-4 py-2 hover:bg-maximally-yellow transition-colors"
                  >
                    <span className="font-press-start text-xs">CLEAR FILTERS</span>
                  </button>
                </div>
              )}

              {/* CTA Section */}
              <div className="text-center mt-12">
                <div className="minecraft-block bg-gray-800 text-gray-300 px-6 py-4 inline-block mb-6">
                  <span className="font-jetbrains text-sm">
                    Want to become a Maximally Judge?
                  </span>
                </div>
                <Link
                  to="/judges/apply"
                  className="minecraft-block bg-maximally-red text-white px-6 py-3 hover:bg-maximally-yellow hover:text-black transition-colors inline-block"
                >
                  <span className="font-press-start text-sm">APPLY TO BE A JUDGE</span>
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

export default PeopleJudges;
