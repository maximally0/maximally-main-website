import { Link } from 'react-router-dom';
import { Users, Award, Calendar } from 'lucide-react';
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
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-20">
              <div className="minecraft-block bg-maximally-red text-black px-6 py-3 inline-block mb-8">
                <span className="font-press-start text-sm">👥 MEET THE TEAM</span>
              </div>
              <h1 className="font-press-start text-4xl md:text-6xl lg:text-8xl mb-8 minecraft-text">
                <span className="text-maximally-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  PEOPLE
                </span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl font-jetbrains max-w-3xl mx-auto leading-relaxed">
                The builders, innovators, and industry legends making Maximally the world's premier hackathon league.
              </p>
            </section>

            {/* Navigation Blocks */}
            <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Core Team Block */}
              <Link
                to="/people/core"
                className="group"
              >
                <div className="pixel-card bg-black border-4 border-maximally-red p-8 hover:scale-105 transition-all duration-300 hover:border-maximally-yellow hover:bg-gradient-to-br hover:from-gray-900 hover:to-black">
                  <div className="minecraft-block bg-maximally-red w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:bg-maximally-yellow transition-colors">
                    <Users className="h-8 w-8 text-black" />
                  </div>
                  <h2 className="font-press-start text-xl md:text-2xl mb-4 text-maximally-red group-hover:text-maximally-yellow transition-colors text-center">
                    CORE TEAM
                  </h2>
                  <p className="font-jetbrains text-gray-300 text-center leading-relaxed">
                    Meet our advisors, organizing board, developers, and active contributors building the future of student hackathons.
                  </p>
                  <div className="mt-6 text-center">
                    <div className="inline-block minecraft-block bg-maximally-red text-black px-4 py-2 group-hover:bg-maximally-yellow transition-colors">
                      <span className="font-press-start text-xs">VIEW TEAM →</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Judges Block */}
              <Link
                to="/people/judges"
                className="group"
              >
                <div className="pixel-card bg-black border-4 border-cyan-400 p-8 hover:scale-105 transition-all duration-300 hover:border-maximally-yellow hover:bg-gradient-to-br hover:from-gray-900 hover:to-black">
                  <div className="minecraft-block bg-cyan-400 w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:bg-maximally-yellow transition-colors">
                    <Award className="h-8 w-8 text-black" />
                  </div>
                  <h2 className="font-press-start text-xl md:text-2xl mb-4 text-cyan-400 group-hover:text-maximally-yellow transition-colors text-center">
                    JUDGES
                  </h2>
                  <p className="font-jetbrains text-gray-300 text-center leading-relaxed">
                    Industry experts from top companies who evaluate our competitions.
                  </p>
                  <div className="mt-6 text-center">
                    <div className="inline-block minecraft-block bg-cyan-400 text-black px-4 py-2 group-hover:bg-maximally-yellow transition-colors">
                      <span className="font-press-start text-xs">VIEW JUDGES →</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Organizers Block */}
              <Link
                to="/people/organizers"
                className="group"
              >
                <div className="pixel-card bg-black border-4 border-green-400 p-8 hover:scale-105 transition-all duration-300 hover:border-maximally-yellow hover:bg-gradient-to-br hover:from-gray-900 hover:to-black">
                  <div className="minecraft-block bg-green-400 w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:bg-maximally-yellow transition-colors">
                    <Calendar className="h-8 w-8 text-black" />
                  </div>
                  <h2 className="font-press-start text-xl md:text-2xl mb-4 text-green-400 group-hover:text-maximally-yellow transition-colors text-center">
                    ORGANIZERS
                  </h2>
                  <p className="font-jetbrains text-gray-300 text-center leading-relaxed">
                    Community leaders who host and organize Maximally hackathons worldwide.
                  </p>
                  <div className="mt-6 text-center">
                    <div className="inline-block minecraft-block bg-green-400 text-black px-4 py-2 group-hover:bg-maximally-yellow transition-colors">
                      <span className="font-press-start text-xs">VIEW ORGANIZERS →</span>
                    </div>
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