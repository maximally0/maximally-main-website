import { useEffect, useState } from "react";
import { ExternalLink, Calendar, Clock, Globe, Users, Code, Zap, Award, Star, Heart, Smile } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ProjectCodeGen = () => {
  const [floatingStars, setFloatingStars] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate floating stars for playful effect
    const stars = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setFloatingStars(stars);
  }, []);

  return (
    <>
      <SEO
        title="Project CodeGen - 48-Hour Playful Hackathon | October 11-12, 2025"
        description="Build like you're 6. Ship like you're 16. A 48-hour hackathon for builders who play. October 11-12, 2025 - Online hackathon for creative teen builders."
        keywords="project codegen, playful hackathon, teen builders, creative coding, october 2025, fun programming, kid-friendly hackathon"
        canonicalUrl="https://maximally.in/project-codegen"
      />
      
      {/* Main Container with Notebook Paper Background */}
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundColor: '#f8f8ff',
          backgroundImage: `
            repeating-linear-gradient(
              transparent,
              transparent 31px,
              #e6e6fa 32px
            ),
            linear-gradient(
              90deg,
              #ffb6c1 0px,
              #ffb6c1 2px,
              transparent 2px
            )
          `,
          backgroundSize: '100% 32px, 100% 100%'
        }}
      >
        {/* Floating Stars and Doodles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingStars.map((star) => (
            <div
              key={star.id}
              className="absolute animate-bounce"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                animationDelay: `${star.delay}s`,
                animationDuration: '3s'
              }}
            >
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
          ))}
          
          {/* Hand-drawn style doodles */}
          <div className="absolute top-20 right-16">
            <svg width="40" height="40" viewBox="0 0 40 40" className="text-red-500">
              <path
                d="M20,5 C25,10 35,15 30,25 C25,35 15,30 10,20 C5,10 15,5 20,5 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="animate-pulse"
              />
            </svg>
          </div>
          
          <div className="absolute top-96 left-12">
            <svg width="50" height="30" viewBox="0 0 50 30" className="text-blue-500">
              <path
                d="M5,15 Q15,5 25,15 Q35,25 45,15"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          
          <div className="absolute bottom-40 right-24">
            <svg width="30" height="30" viewBox="0 0 30 30" className="text-green-500">
              <circle cx="15" cy="10" r="3" fill="currentColor" />
              <rect x="10" y="13" width="10" height="12" rx="3" fill="currentColor" />
              <circle cx="12" cy="18" r="1" fill="#f8f8ff" />
              <circle cx="18" cy="18" r="1" fill="#f8f8ff" />
              <path d="M12,21 Q15,23 18,21" stroke="#f8f8ff" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative z-20 min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="text-center max-w-6xl mx-auto">
            {/* Main Title with Crayon Style */}
            <h1 className="mb-6">
              <span 
                className="block text-5xl md:text-7xl lg:text-8xl font-black text-red-500 mb-4"
                style={{
                  fontFamily: 'Comic Sans MS, Quicksand, sans-serif',
                  textShadow: `
                    3px 3px 0px #ffeb3b,
                    6px 6px 0px #4caf50,
                    9px 9px 0px #2196f3,
                    12px 12px 0px #9c27b0
                  `,
                  transform: 'rotate(-2deg)'
                }}
              >
                PROJECT
              </span>
              <span 
                className="block text-5xl md:text-7xl lg:text-8xl font-black text-blue-500"
                style={{
                  fontFamily: 'Comic Sans MS, Quicksand, sans-serif',
                  textShadow: `
                    3px 3px 0px #ff9800,
                    6px 6px 0px #e91e63,
                    9px 9px 0px #00bcd4
                  `,
                  transform: 'rotate(2deg)'
                }}
              >
                CODEGEN
              </span>
            </h1>

            {/* Badge with Sticky Note Style */}
            <div 
              className="inline-flex items-center gap-2 bg-yellow-300 text-purple-800 px-6 py-3 rounded-lg font-bold text-lg mb-6 transform -rotate-1 shadow-lg"
              style={{ 
                fontFamily: 'Comic Sans MS, Quicksand, sans-serif',
                boxShadow: '4px 4px 8px rgba(0,0,0,0.2)'
              }}
            >
              <Calendar className="w-5 h-5" />
              Oct 11–12, 2025 · Online · 48 Hours
            </div>

            {/* Subtitle */}
            <h2 className="text-2xl md:text-4xl font-bold text-green-600 mb-4 transform rotate-1" style={{ fontFamily: 'Comic Sans MS, Quicksand, sans-serif' }}>
              Build like you're 6. Ship like you're 16.
            </h2>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-purple-600 mb-8 font-bold" style={{ fontFamily: 'Comic Sans MS, Quicksand, sans-serif' }}>
              A 48-hour hackathon for builders who play.
            </p>

            {/* CTAs with Crayon Button Style */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 text-lg rounded-full transform hover:scale-105 transition-all shadow-lg"
                style={{ fontFamily: 'Comic Sans MS, Quicksand, sans-serif' }}
              >
                <a href="https://projectcodegen.devpost.com" target="_blank" rel="noopener noreferrer">
                  <Star className="w-5 h-5 mr-2 fill-current" />
                  Register Now
                </a>
              </Button>
              <Button 
                asChild 
                size="lg" 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 text-lg rounded-full transform hover:scale-105 transition-all shadow-lg"
                style={{ fontFamily: 'Comic Sans MS, Quicksand, sans-serif' }}
              >
                <a href="https://discord.gg/WmSXVzDYuq" target="_blank" rel="noopener noreferrer">
                  <Heart className="w-5 h-5 mr-2 fill-current" />
                  Join Discord
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Fun Wavy Divider */}
        <div className="relative z-20">
          <svg width="100%" height="60" viewBox="0 0 1200 60" className="text-green-400">
            <path
              d="M0,30 Q150,10 300,30 Q450,50 600,30 Q750,10 900,30 Q1050,50 1200,30 L1200,60 L0,60 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* What is Project CodeGen Section */}
        <section className="relative z-20 py-16 px-6 bg-green-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-red-500 mb-8 transform -rotate-1" style={{ fontFamily: 'Comic Sans MS, Quicksand, sans-serif' }}>
              What is Project CodeGen?
            </h2>
            <div 
              className="bg-white p-8 rounded-3xl shadow-lg transform rotate-1"
              style={{ 
                border: '4px solid #ff9800',
                fontFamily: 'Comic Sans MS, Quicksand, sans-serif'
              }}
            >
              <p className="text-xl text-gray-700 leading-relaxed font-bold">
                Not about disruption or MVPs. It's about play. Drop the pitch decks, pick up crayons. 
                Build like a kid — silly ideas, joyful logic, weird prototypes. Make tech fun again.
              </p>
            </div>
          </div>
        </section>

        {/* Vibe + Theme Section */}
        <section className="relative z-20 py-16 px-6 bg-blue-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-blue-600 mb-12 text-center transform rotate-1" style={{ fontFamily: 'Comic Sans MS, Quicksand, sans-serif' }}>
              Vibe + Theme
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div 
                className="bg-yellow-200 p-6 rounded-2xl shadow-lg transform -rotate-2"
                style={{ border: '3px solid #e91e63', fontFamily: 'Comic Sans MS, Quicksand, sans-serif' }}
              >
                <h3 className="text-xl font-bold text-purple-600 mb-4">Inspired by:</h3>
                <ul className="text-lg text-gray-700 space-y-2 font-bold">
                  <li>📝 Notebooks, toys, science fairs</li>
                  <li>🧱 Feels like Lego builds</li>
                  <li>🎨 Scratch projects, doodles in class</li>
                </ul>
              </div>
              
              <div 
                className="bg-pink-200 p-6 rounded-2xl shadow-lg transform rotate-2"
                style={{ border: '3px solid #4caf50', fontFamily: 'Comic Sans MS, Quicksand, sans-serif' }}
              >
                <h3 className="text-xl font-bold text-green-600 mb-4">The Rules:</h3>
                <ul className="text-lg text-gray-700 space-y-2 font-bold">
                  <li>✅ Serious design? Allowed.</li>
                  <li>❌ Serious tone? Nope.</li>
                  <li>🎯 You're building for your younger self.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Who Should Join Section */}
        <section className="relative z-20 py-16 px-6 bg-purple-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-purple-600 mb-12 text-center transform -rotate-1" style={{ fontFamily: 'Comic Sans MS, Quicksand, sans-serif' }}>
              Who Should Join?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "👶", text: "Teen builders", color: "bg-red-200 border-red-400" },
                { icon: "🌟", text: "First-timers", color: "bg-yellow-200 border-yellow-400" },
                { icon: "🎨", text: "Designers + no-coders", color: "bg-blue-200 border-blue-400" },
                { icon: "🐱", text: "Scratch veterans", color: "bg-green-200 border-green-400" },
                { icon: "🌈", text: "Makers who like color, fun, and zero stress", color: "bg-pink-200 border-pink-400" }
              ].map((group, index) => (
                <div 
                  key={index} 
                  className={`${group.color} p-6 rounded-2xl shadow-lg transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
                  style={{ 
                    border: '3px solid',
                    fontFamily: 'Comic Sans MS, Quicksand, sans-serif'
                  }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{group.icon}</div>
                    <p className="text-gray-700 font-bold text-lg">{group.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Format Section */}
        <section className="relative z-20 py-16 px-6 bg-yellow-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-orange-600 mb-12 text-center transform rotate-1" style={{ fontFamily: 'Comic Sans MS, Quicksand, sans-serif' }}>
              Format
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { text: "48-hour online event", icon: "⏰" },
                { text: "Solo or teams (max 4)", icon: "👥" },
                { text: "Open to all ages, worldwide", icon: "🌍" },
                { text: "Any stack or tool", icon: "🛠️" },
                { text: "No prep, no live calls", icon: "😌" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all"
                  style={{ 
                    border: '3px solid #ff5722',
                    fontFamily: 'Comic Sans MS, Quicksand, sans-serif'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{item.icon}</div>
                    <p className="text-lg font-bold text-gray-700">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="relative z-20 py-16 px-6 bg-green-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-green-600 mb-12 text-center transform -rotate-1" style={{ fontFamily: 'Comic Sans MS, Quicksand, sans-serif' }}>
              How it Works
            </h2>
            <div className="space-y-8">
              {[
                { step: "Step 1", text: "Think of a playful idea (the sillier the better)", color: "bg-red-200 border-red-400" },
                { step: "Step 2", text: "Build a version in 48 hours", color: "bg-blue-200 border-blue-400" },
                { step: "Step 3", text: "Submit with short write-up", color: "bg-yellow-200 border-yellow-400" },
                { step: "Step 4", text: "Optional 1-min fun demo video", color: "bg-purple-200 border-purple-400" }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`${item.color} p-6 rounded-2xl shadow-lg transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
                  style={{ 
                    border: '3px solid',
                    fontFamily: 'Comic Sans MS, Quicksand, sans-serif'
                  }}
                >
                  <div className="flex items-center gap-6">
                    <div className="text-2xl font-black text-gray-700 min-w-fit">{item.step}:</div>
                    <div className="text-lg font-bold text-gray-700">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div 
              className="mt-12 bg-orange-200 p-8 rounded-3xl shadow-lg transform rotate-1"
              style={{ 
                border: '4px solid #9c27b0',
                fontFamily: 'Comic Sans MS, Quicksand, sans-serif'
              }}
            >
              <h3 className="text-xl font-bold text-purple-600 mb-4 text-center">Example Ideas:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                {[
                  "🏴‍☠️ Pirate chatbot",
                  "😱 Screaming Pomodoro app", 
                  "🎮 Tutorial-as-game",
                  "🎭 Voice-to-emoji tool"
                ].map((idea, index) => (
                  <div key={index} className="text-lg font-bold text-gray-700">{idea}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Judging Section */}
        <section className="relative z-20 py-16 px-6 bg-pink-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-pink-600 mb-12 text-center transform rotate-1" style={{ fontFamily: 'Comic Sans MS, Quicksand, sans-serif' }}>
              Judging
            </h2>
            
            <div className="space-y-6 mb-12">
              {[
                { text: "Async judging, no live pitch", icon: "🎯" },
                { text: "Judges: creators, designers, founders, educators", icon: "👩‍🏫" },
                { text: "Results before Nov ceremony", icon: "🎉" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all"
                  style={{ 
                    border: '3px solid #ff9800',
                    fontFamily: 'Comic Sans MS, Quicksand, sans-serif'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{item.icon}</div>
                    <p className="text-lg font-bold text-gray-700">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <h3 className="text-2xl font-black text-red-500 mb-8 text-center transform -rotate-1" style={{ fontFamily: 'Comic Sans MS, Quicksand, sans-serif' }}>
              Criteria:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { criteria: "🧠 Imagination", percentage: "30%", color: "bg-purple-200 border-purple-400" },
                { criteria: "🛠 Execution", percentage: "25%", color: "bg-blue-200 border-blue-400" },
                { criteria: "🤓 Usefulness in Disguise", percentage: "20%", color: "bg-green-200 border-green-400" },
                { criteria: "🎨 Presentation", percentage: "15%", color: "bg-yellow-200 border-yellow-400" },
                { criteria: "😄 Joy Factor", percentage: "10%", color: "bg-red-200 border-red-400" }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`${item.color} p-4 rounded-2xl shadow-lg text-center transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
                  style={{ 
                    border: '3px solid',
                    fontFamily: 'Comic Sans MS, Quicksand, sans-serif'
                  }}
                >
                  <div className="font-bold text-gray-700 text-lg">{item.criteria}</div>
                  <div className="font-black text-xl mt-2 text-gray-800">({item.percentage})</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Submission Section */}
        <section className="relative z-20 py-16 px-6 bg-blue-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-blue-600 mb-12 text-center transform rotate-1" style={{ fontFamily: 'Comic Sans MS, Quicksand, sans-serif' }}>
              Submission
            </h2>
            <div className="space-y-6">
              {[
                { text: "Prototype link (GitHub, Notion, Figma, no-code, etc.)", icon: "🔗", color: "bg-green-200 border-green-400" },
                { text: "Write-up: what you built, why it's playful, hidden smartness", icon: "📝", color: "bg-yellow-200 border-yellow-400" },
                { text: "Optional 1-min silly demo video", icon: "🎬", color: "bg-pink-200 border-pink-400" }
              ].map((requirement, index) => (
                <div 
                  key={index} 
                  className={`${requirement.color} p-6 rounded-2xl shadow-lg transform ${index % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
                  style={{ 
                    border: '3px solid',
                    fontFamily: 'Comic Sans MS, Quicksand, sans-serif'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{requirement.icon}</div>
                    <p className="font-bold text-lg text-gray-700">{requirement.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Line */}
        <section className="relative z-20 py-16 px-6 bg-purple-100">
          <div className="text-center">
            <div 
              className="bg-white p-8 rounded-3xl shadow-lg transform -rotate-2 inline-block"
              style={{ 
                border: '4px solid #e91e63',
                fontFamily: 'Comic Sans MS, Quicksand, sans-serif'
              }}
            >
              <p className="text-2xl md:text-3xl font-black text-pink-600">
                Build something fun. Surprise yourself.
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <Smile className="w-8 h-8 text-yellow-400 fill-current" />
                <Heart className="w-8 h-8 text-red-400 fill-current" />
                <Star className="w-8 h-8 text-blue-400 fill-current" />
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default ProjectCodeGen;