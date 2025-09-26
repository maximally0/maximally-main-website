import { useEffect, useState } from "react";
import { ExternalLink, Calendar, Clock, Globe, Users, Code, Zap, Award, Star, Heart, Coffee } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Hacktober = () => {
  const [floatingLeaves, setFloatingLeaves] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);

  useEffect(() => {
    // Generate floating maple leaves for autumn effect
    const leaves = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: 20 + Math.random() * 15
    }));
    setFloatingLeaves(leaves);
  }, []);

  return (
    <>
      <SEO
        title="Maximally Hacktober - Month-Long Hackathon | October 1-31, 2025"
        description="Build slow. Build loud. Finish strong. A month-long hackathon for builders who won't quit. October 1-31, 2025 - Online hackathon with ₹5000+ prizes."
        keywords="hacktober, month-long hackathon, october hackathon, autumn coding, indie hackers, long-form building, maximally"
        canonicalUrl="https://maximally.in/hacktober"
      />
      
      {/* Main Container with Autumn Background */}
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          background: `
            linear-gradient(135deg, 
              #8B4513 0%, 
              #D2691E 25%, 
              #F5DEB3 50%, 
              #CD853F 75%, 
              #8B4513 100%
            )
          `
        }}
      >
        {/* Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(139, 69, 19, 0.1) 2px,
                rgba(139, 69, 19, 0.1) 4px
              )
            `
          }}
        />

        {/* Floating Autumn Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingLeaves.map((leaf) => (
            <div
              key={leaf.id}
              className="absolute animate-float"
              style={{
                left: `${leaf.x}%`,
                top: `${leaf.y}%`,
                animationDelay: `${leaf.delay}s`,
                animationDuration: '6s'
              }}
            >
              <svg width={leaf.size} height={leaf.size} viewBox="0 0 24 24" className="text-orange-600 opacity-70">
                <path
                  d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,7 14,7.5 17,8Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          ))}
          
          {/* Retro Code Elements */}
          <div className="absolute top-32 right-16">
            <svg width="40" height="30" viewBox="0 0 40 30" className="text-amber-800 opacity-40">
              <rect x="5" y="5" width="30" height="20" rx="2" fill="currentColor" />
              <circle cx="10" cy="12" r="1" fill="#F5DEB3" />
              <circle cx="13" cy="12" r="1" fill="#F5DEB3" />
              <rect x="16" y="10" width="8" height="1" fill="#F5DEB3" />
              <rect x="16" y="13" width="12" height="1" fill="#F5DEB3" />
            </svg>
          </div>
          
          <div className="absolute bottom-40 left-20">
            <svg width="35" height="35" viewBox="0 0 35 35" className="text-orange-700 opacity-50">
              <circle cx="17.5" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M12 18 Q17.5 25 23 18" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
          
          <div className="absolute top-96 left-12">
            <svg width="30" height="25" viewBox="0 0 30 25" className="text-red-900 opacity-60">
              <rect x="3" y="3" width="24" height="16" rx="1" fill="currentColor" />
              <circle cx="6" cy="8" r="1" fill="#F5DEB3" />
              <rect x="9" y="7" width="8" height="2" fill="#F5DEB3" />
              <rect x="6" y="12" width="15" height="1" fill="#F5DEB3" />
              <rect x="6" y="15" width="10" height="1" fill="#F5DEB3" />
            </svg>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative z-20 min-h-screen flex items-center justify-center px-6 pt-32">
          <div className="text-center max-w-6xl mx-auto">
            {/* Main Title with Retro Serif Style */}
            <h1 className="mb-6">
              <span 
                className="block text-5xl md:text-7xl lg:text-8xl font-bold text-amber-100 mb-4"
                style={{
                  fontFamily: 'Georgia, Times New Roman, serif',
                  textShadow: `
                    3px 3px 0px #8B4513,
                    6px 6px 0px rgba(139, 69, 19, 0.8),
                    9px 9px 0px rgba(139, 69, 19, 0.6),
                    12px 12px 0px rgba(139, 69, 19, 0.4)
                  `,
                  transform: 'rotate(-1deg)'
                }}
              >
                MAXIMALLY
              </span>
              <span 
                className="block text-5xl md:text-7xl lg:text-8xl font-bold text-orange-200"
                style={{
                  fontFamily: 'Georgia, Times New Roman, serif',
                  textShadow: `
                    3px 3px 0px #D2691E,
                    6px 6px 0px rgba(210, 105, 30, 0.8),
                    9px 9px 0px rgba(210, 105, 30, 0.6)
                  `,
                  transform: 'rotate(1deg)'
                }}
              >
                HACKTOBER
              </span>
            </h1>

            {/* Badge with Autumn Style */}
            <div 
              className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-6 py-3 rounded-lg font-bold text-lg mb-6 shadow-lg transform -rotate-1"
              style={{ 
                fontFamily: 'Arial, sans-serif',
                border: '3px solid #8B4513'
              }}
            >
              <Calendar className="w-5 h-5" />
              Oct 1–31, 2025 · Online · 1 Month
            </div>

            {/* Subtitle */}
            <h2 className="text-2xl md:text-4xl font-bold text-cream-100 mb-4 transform rotate-1" style={{ fontFamily: 'Georgia, serif', color: '#F5DEB3' }}>
              Build slow. Build loud. Finish strong.
            </h2>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-orange-100 mb-8 font-semibold" style={{ fontFamily: 'Arial, sans-serif' }}>
              A month-long hackathon for builders who won't quit.
            </p>

            {/* CTAs with Autumn Button Style */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-lg rounded-lg transform hover:scale-105 transition-all shadow-lg border-2 border-orange-800"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                <a href="https://maximallyhacktober.devpost.com" target="_blank" rel="noopener noreferrer">
                  <Star className="w-5 h-5 mr-2 fill-current" />
                  Register Now
                </a>
              </Button>
              <Button 
                asChild 
                size="lg" 
                className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-8 py-4 text-lg rounded-lg transform hover:scale-105 transition-all shadow-lg border-2 border-amber-900"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                <a href="#submission" rel="noopener noreferrer">
                  <Coffee className="w-5 h-5 mr-2" />
                  Submit by Oct 31
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Retro Divider */}
        <div className="relative z-20">
          <div className="h-2 bg-gradient-to-r from-orange-800 via-amber-600 to-orange-800" />
          <div className="h-1 bg-amber-900" />
        </div>

        {/* What is Maximally Hacktober Section */}
        <section className="relative z-20 py-16 px-6" style={{ backgroundColor: '#F5DEB3' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-8 transform -rotate-1" style={{ fontFamily: 'Georgia, serif' }}>
              What is Maximally Hacktober?
            </h2>
            <div 
              className="bg-white p-8 rounded-lg shadow-lg transform rotate-1 border-4 border-orange-700"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              <p className="text-xl text-amber-900 leading-relaxed font-semibold">
                Most hackathons want speed. Hacktober gives you time. A full 31 days to stick with one idea, 
                through burnout, late nights, sparks of momentum. It's about finishing what you started — 
                or finally building what you said you would.
              </p>
            </div>
          </div>
        </section>

        {/* Theme Section */}
        <section className="relative z-20 py-16 px-6" style={{ backgroundColor: '#D2691E' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-cream-100 mb-12 text-center transform rotate-1" style={{ fontFamily: 'Georgia, serif', color: '#F5DEB3' }}>
              Build Through the Fall
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div 
                className="bg-amber-100 p-6 rounded-lg shadow-lg transform -rotate-2 border-3 border-amber-800"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                <h3 className="text-xl font-bold text-amber-900 mb-4">October Vibes:</h3>
                <p className="text-lg text-amber-800 leading-relaxed font-semibold">
                  October isn't about polish, it's about process. Ideas can crumble like autumn leaves and still be beautiful. 
                  Fix an abandoned project, start a wild experiment, or just finish something — Hacktober is your season.
                </p>
              </div>
              
              <div 
                className="bg-orange-200 p-6 rounded-lg shadow-lg transform rotate-2 border-3 border-orange-800"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                <h3 className="text-xl font-bold text-orange-900 mb-4">Visual Tone:</h3>
                <ul className="text-lg text-orange-800 space-y-2 font-semibold">
                  <li>🍂 Burnt orange, dark coffee, cream beige</li>
                  <li>🍁 Faded red, midnight purple</li>
                  <li>💾 Icons: maple leaves, floppy disks</li>
                  <li>🌙 Crescent moons, retro code</li>
                  <li>🔥 Mood: journaling next to a campfire after a long build</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Who Should Join Section */}
        <section className="relative z-20 py-16 px-6" style={{ backgroundColor: '#8B4513' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-100 mb-12 text-center transform -rotate-1" style={{ fontFamily: 'Georgia, serif' }}>
              Who Should Join?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "⏰", text: "Makers tired of 24-hour rush", color: "bg-orange-200 border-orange-600" },
                { icon: "🛠️", text: "Indie hackers with half-built projects", color: "bg-amber-200 border-amber-600" },
                { icon: "🎨", text: "Designers who want closure", color: "bg-yellow-200 border-yellow-600" },
                { icon: "📚", text: "Students balancing school + builds", color: "bg-orange-300 border-orange-700" },
                { icon: "👻", text: "Anyone who ghosts their GitHub", color: "bg-amber-300 border-amber-700" }
              ].map((group, index) => (
                <div 
                  key={index} 
                  className={`${group.color} p-6 rounded-lg shadow-lg transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} border-3`}
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{group.icon}</div>
                    <p className="text-gray-800 font-bold text-lg">{group.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Format Section */}
        <section className="relative z-20 py-16 px-6" style={{ backgroundColor: '#CD853F' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-cream-100 mb-12 text-center transform rotate-1" style={{ fontFamily: 'Georgia, serif', color: '#F5DEB3' }}>
              Format
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { text: "Oct 1–31 submission window", icon: "📅" },
                { text: "Solo or teams (up to 4)", icon: "👥" },
                { text: "Any tools or stacks", icon: "🛠️" },
                { text: "No prep, no calls", icon: "😌" },
                { text: "Beginners, artists, no-coders welcome", icon: "🌟" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-amber-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all border-3 border-amber-700"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{item.icon}</div>
                    <p className="text-lg font-bold text-amber-900">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="relative z-20 py-16 px-6" style={{ backgroundColor: '#F5DEB3' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-12 text-center transform -rotate-1" style={{ fontFamily: 'Georgia, serif' }}>
              How it Works
            </h2>
            <div className="space-y-8">
              {[
                { step: "Step 1", text: "Pick one thing", color: "bg-orange-200 border-orange-600" },
                { step: "Step 2", text: "Work through October", color: "bg-amber-200 border-amber-600" },
                { step: "Step 3", text: "Submit by Oct 31", color: "bg-yellow-200 border-yellow-600" },
                { step: "Step 4", text: "Optional 2-min demo video", color: "bg-orange-300 border-orange-700" }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`${item.color} p-6 rounded-lg shadow-lg transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} border-3`}
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  <div className="flex items-center gap-6">
                    <div className="text-2xl font-bold text-gray-800 min-w-fit">{item.step}:</div>
                    <div className="text-lg font-bold text-gray-800">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div 
              className="mt-12 bg-amber-900 text-amber-100 p-6 rounded-lg shadow-lg transform rotate-1 border-3 border-amber-700"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              <p className="text-center text-lg font-bold">
                Judging happens in November
              </p>
            </div>
          </div>
        </section>

        {/* Judging Section */}
        <section className="relative z-20 py-16 px-6" style={{ backgroundColor: '#D2691E' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-cream-100 mb-12 text-center transform rotate-1" style={{ fontFamily: 'Georgia, serif', color: '#F5DEB3' }}>
              Judging
            </h2>
            
            <div className="space-y-6 mb-12">
              {[
                { text: "Async judging", icon: "🎯" },
                { text: "Panel: devs, creators, indie founders", icon: "👩‍💻" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-amber-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all border-3 border-amber-700"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{item.icon}</div>
                    <p className="text-lg font-bold text-amber-900">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <h3 className="text-2xl font-bold text-amber-100 mb-8 text-center transform -rotate-1" style={{ fontFamily: 'Georgia, serif' }}>
              Criteria:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { criteria: "📦 Build Depth", percentage: "30%", color: "bg-orange-200 border-orange-600" },
                { criteria: "🌰 Originality", percentage: "25%", color: "bg-amber-200 border-amber-600" },
                { criteria: "⏳ Commitment Over Time", percentage: "20%", color: "bg-yellow-200 border-yellow-600" },
                { criteria: "✍️ Storytelling", percentage: "15%", color: "bg-orange-300 border-orange-700" },
                { criteria: "🍂 October Vibe", percentage: "10%", color: "bg-amber-300 border-amber-700" }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`${item.color} p-4 rounded-lg shadow-lg text-center transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} border-3`}
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  <div className="font-bold text-gray-800 text-lg">{item.criteria}</div>
                  <div className="font-black text-xl mt-2 text-gray-900">({item.percentage})</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prizes Section */}
        <section className="relative z-20 py-16 px-6" style={{ backgroundColor: '#8B4513' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-100 mb-12 text-center transform -rotate-1" style={{ fontFamily: 'Georgia, serif' }}>
              Prizes
            </h2>
            <div className="space-y-6 mb-8">
              {[
                { place: "🍁", title: "Builder of the Month", prize: "₹3000 + LOR + feature", color: "bg-orange-200 border-orange-600" },
                { place: "🎃", title: "Most Seasonal Submission", prize: "₹2000", color: "bg-amber-200 border-amber-600" },
                { place: "👻", title: "Judge Mentions", prize: "zine features, shoutouts, internship intros", color: "bg-yellow-200 border-yellow-600" }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`${item.color} p-6 rounded-lg shadow-lg transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} border-3`}
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{item.place}</div>
                    <div>
                      <div className="font-bold text-lg text-gray-800">{item.title}</div>
                      <div className="font-semibold text-gray-700">{item.prize}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <div 
                className="bg-amber-200 text-amber-900 font-bold text-xl px-8 py-4 rounded-lg inline-block shadow-lg transform rotate-2 border-3 border-amber-700"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                💰 Total Pool: ₹5000
              </div>
            </div>
          </div>
        </section>

        {/* Submission Section */}
        <section id="submission" className="relative z-20 py-16 px-6" style={{ backgroundColor: '#CD853F' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-cream-100 mb-12 text-center transform rotate-1" style={{ fontFamily: 'Georgia, serif', color: '#F5DEB3' }}>
              Submission
            </h2>
            <div className="space-y-6">
              {[
                { text: "Prototype or product link (GitHub, Notion, Figma, etc.)", icon: "🔗", color: "bg-orange-200 border-orange-600" },
                { text: "Write-up: what you built, how it evolved, why it matters", icon: "📝", color: "bg-amber-200 border-amber-600" },
                { text: "Optional 2-min video", icon: "🎬", color: "bg-yellow-200 border-yellow-600" },
                { text: "Bonus: chaos diary, screenshots, funny bugs", icon: "📚", color: "bg-orange-300 border-orange-700" }
              ].map((requirement, index) => (
                <div 
                  key={index} 
                  className={`${requirement.color} p-6 rounded-lg shadow-lg transform ${index % 2 === 0 ? '-rotate-1' : 'rotate-1'} border-3`}
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{requirement.icon}</div>
                    <p className="font-bold text-lg text-gray-800">{requirement.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Line */}
        <section className="relative z-20 py-16 px-6" style={{ backgroundColor: '#F5DEB3' }}>
          <div className="text-center">
            <div 
              className="bg-amber-900 text-amber-100 p-8 rounded-lg shadow-lg transform -rotate-2 inline-block border-4 border-amber-700"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <p className="text-2xl md:text-3xl font-bold">
                Let October be the month you finally ship.
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <span className="text-2xl">🍂</span>
                <span className="text-2xl">💻</span>
                <span className="text-2xl">🚀</span>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(-20px) rotate(-5deg); }
          75% { transform: translateY(-15px) rotate(3deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default Hacktober;