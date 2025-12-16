import { Link } from 'react-router-dom';
import { Users, Award, Calendar, ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';

const People = () => {
  return (
    <>
      <SEO
        title="People | Maximally"
        description="Meet the amazing people powering Maximally - our core team and industry judges from top companies."
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.10)_0%,transparent_50%)]" />
        
        <div className="absolute top-20 left-[5%] w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-40 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />
        <div className="absolute bottom-40 left-[20%] w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px]" />

        <main className="min-h-screen pt-20 sm:pt-28 pb-16 px-4 sm:px-6 relative z-10">
          <div className="container mx-auto max-w-5xl">
            {/* Back Link */}
            <Link 
              to="/"
              className="group inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 font-jetbrains text-sm mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>

            {/* Hero Section */}
            <section className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-purple-500/10 border border-purple-500/30">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="font-press-start text-[10px] sm:text-xs text-purple-300 tracking-wider">
                  MEET THE TEAM
                </span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              
              <h1 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Our People
                </span>
              </h1>
              
              <p className="font-jetbrains text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                The builders, innovators, and industry legends making Maximally 
                the world's premier hackathon league.
              </p>
            </section>

            {/* Navigation Cards */}
            <section className="grid md:grid-cols-3 gap-5 sm:gap-6">
              {/* Core Team Card */}
              <Link to="/people/core" className="group">
                <div className="h-full p-6 sm:p-8 bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:translate-y-[-4px]">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5 sm:mb-6 bg-purple-500/20 border border-purple-500/40 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <Users className="h-7 w-7 sm:h-8 sm:w-8 text-purple-400" />
                  </div>
                  
                  <h2 className="font-press-start text-sm sm:text-base md:text-lg mb-3 sm:mb-4 text-purple-400 group-hover:text-purple-300 transition-colors text-center">
                    CORE TEAM
                  </h2>
                  
                  <p className="font-jetbrains text-xs sm:text-sm text-gray-400 text-center leading-relaxed mb-5 sm:mb-6">
                    Meet our advisors, organizing board, developers, and active contributors building the future of student hackathons.
                  </p>
                  
                  <div className="text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/40 text-purple-300 font-press-start text-[10px] group-hover:bg-purple-500/30 transition-colors">
                      VIEW TEAM
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Judges Card */}
              <Link to="/people/judges" className="group">
                <div className="h-full p-6 sm:p-8 bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 hover:translate-y-[-4px]">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5 sm:mb-6 bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                    <Award className="h-7 w-7 sm:h-8 sm:w-8 text-cyan-400" />
                  </div>
                  
                  <h2 className="font-press-start text-sm sm:text-base md:text-lg mb-3 sm:mb-4 text-cyan-400 group-hover:text-cyan-300 transition-colors text-center">
                    JUDGES
                  </h2>
                  
                  <p className="font-jetbrains text-xs sm:text-sm text-gray-400 text-center leading-relaxed mb-5 sm:mb-6">
                    Industry experts from top companies who evaluate our competitions and mentor participants.
                  </p>
                  
                  <div className="text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-press-start text-[10px] group-hover:bg-cyan-500/30 transition-colors">
                      VIEW JUDGES
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Organizers Card */}
              <Link to="/people/organizers" className="group">
                <div className="h-full p-6 sm:p-8 bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-green-500/30 hover:border-green-400/60 transition-all duration-300 hover:translate-y-[-4px]">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5 sm:mb-6 bg-green-500/20 border border-green-500/40 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Calendar className="h-7 w-7 sm:h-8 sm:w-8 text-green-400" />
                  </div>
                  
                  <h2 className="font-press-start text-sm sm:text-base md:text-lg mb-3 sm:mb-4 text-green-400 group-hover:text-green-300 transition-colors text-center">
                    ORGANIZERS
                  </h2>
                  
                  <p className="font-jetbrains text-xs sm:text-sm text-gray-400 text-center leading-relaxed mb-5 sm:mb-6">
                    Community leaders who host and organize Maximally hackathons worldwide.
                  </p>
                  
                  <div className="text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 text-green-300 font-press-start text-[10px] group-hover:bg-green-500/30 transition-colors">
                      VIEW ORGANIZERS
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default People;
