import { useState, useEffect } from 'react';
import { Award, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

interface Judge {
  id: number;
  name: string;
  role_in_company: string;
  company: string;
  display_order: number;
}

const PeopleJudges = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 12;

  // Fetch judges from database
  useEffect(() => {
    const fetchJudges = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('judges')
          .select('*')
          .order('display_order', { ascending: true });

        if (fetchError) {
          setError('Failed to load judges. Please try again.');
        } else {
          setJudges(data || []);
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJudges();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(judges.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJudges = judges.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of judges section
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
            <section className="text-center mb-16">
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
              {!loading && !error && (
                <div className="flex justify-center gap-8 mb-8">
                  <div className="minecraft-block bg-maximally-red text-black px-4 py-2">
                    <span className="font-press-start text-xs">{judges.length} JUDGES</span>
                  </div>
                  <div className="minecraft-block bg-maximally-yellow text-black px-4 py-2">
                    <span className="font-press-start text-xs">20+ COMPANIES</span>
                  </div>
                </div>
              )}
              
              {/* Back to People Button */}
              <Link
                to="/people"
                className="inline-block minecraft-block bg-maximally-yellow text-black px-4 py-2 hover:bg-maximally-red transition-colors"
              >
                <span className="font-press-start text-xs">← BACK TO PEOPLE</span>
              </Link>
            </section>

            {/* Judges Grid Section */}
            <section id="judges-section">
              {/* Loading State */}
              {loading && (
                <div className="text-center py-16">
                  <div className="minecraft-block bg-cyan-400 text-black px-6 py-4 inline-block mb-4">
                    <span className="font-press-start text-sm flex items-center gap-2 justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      LOADING JUDGES
                    </span>
                  </div>
                  <p className="text-gray-400 font-jetbrains">Fetching our esteemed panel of judges...</p>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="text-center py-16">
                  <div className="minecraft-block bg-red-600 text-white px-6 py-4 inline-block mb-4">
                    <span className="font-press-start text-sm">ERROR LOADING JUDGES</span>
                  </div>
                  <p className="text-red-400 font-jetbrains mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="minecraft-block bg-cyan-400 text-black px-4 py-2 hover:bg-maximally-yellow transition-colors"
                  >
                    <span className="font-press-start text-xs">RETRY</span>
                  </button>
                </div>
              )}

              {/* Judges Grid - Only show when data is loaded */}
              {!loading && !error && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {currentJudges.map((judge) => (
                    <div 
                      key={judge.id}
                      className="pixel-card bg-black border-2 border-cyan-400 p-6 hover:scale-105 transition-all duration-300 hover:border-maximally-yellow group"
                    >
                      <div className="minecraft-block bg-cyan-400 w-10 h-10 mx-auto mb-4 flex items-center justify-center group-hover:bg-maximally-yellow transition-colors">
                        <Award className="h-5 w-5 text-black" />
                      </div>
                      <h3 className="font-press-start text-sm mb-3 text-cyan-400 group-hover:text-maximally-yellow transition-colors text-center">
                        {judge.name}
                      </h3>
                      <p className="font-jetbrains text-gray-300 text-xs mb-2 text-center">
                        {judge.role_in_company}
                      </p>
                      <p className="font-jetbrains text-white font-bold text-xs text-center">
                        {judge.company}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && totalPages > 1 && (
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

              {/* Judges will be announced message (for future events) */}
              <div className="text-center mt-12">
                <div className="minecraft-block bg-gray-800 text-gray-300 px-6 py-4 inline-block">
                  <span className="font-jetbrains text-sm">
                    More judges will be announced for upcoming hackathons!
                  </span>
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

export default PeopleJudges;