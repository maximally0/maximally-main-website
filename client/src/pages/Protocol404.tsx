import { useEffect, useState } from "react";
import { ExternalLink, Calendar, Clock, Globe, Users, Code, Zap, Award, AlertTriangle } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Protocol404 = () => {
  const [glitchText, setGlitchText] = useState("PROTOCOL 404");
  const [scanlinePosition, setScanlinePosition] = useState(0);

  useEffect(() => {
    const glitchTexts = ["PROTOCOL 404", "SYSTEM ERROR", "404 NOT FOUND", "BREAK THE SYSTEM"];
    const glitchInterval = setInterval(() => {
      setGlitchText(glitchTexts[Math.floor(Math.random() * glitchTexts.length)]);
    }, 2000);

    const scanlineInterval = setInterval(() => {
      setScanlinePosition(prev => (prev + 1) % 100);
    }, 100);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(scanlineInterval);
    };
  }, []);

  return (
    <>
      <SEO
        title="Protocol 404 - 48-Hour Hackathon | October 4-5, 2025"
        description="Break the system. Build yours. A 48-hour hackathon for system-breakers. October 4-5, 2025 - Online hackathon for indie builders and chaos creators."
        keywords="protocol 404, hackathon, system breakers, coding competition, october 2025, chaos utility, indie hackers"
        canonicalUrl="https://maximally.in/protocol-404"
      />
      
      {/* Main Container with Black Base */}
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Glitch Background Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                #ff0000 2px,
                #ff0000 4px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 3px,
                #ffff00 3px,
                #ffff00 5px
              )
            `,
            backgroundSize: '100% 20px, 25px 100%'
          }}
        />

        {/* Scanline Effect */}
        <div 
          className="absolute w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-70 z-10"
          style={{ top: `${scanlinePosition}%` }}
        />

        {/* Glitch Lines and Broken Grid */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Red streak overlays */}
          <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-red-500 via-transparent to-red-500 opacity-80" />
          <div className="absolute top-40 left-0 w-2/3 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60" />
          <div className="absolute top-60 right-0 w-1/2 h-px bg-gradient-to-l from-red-500 via-transparent to-transparent opacity-70" />
          
          {/* Yellow warning motifs */}
          <div className="absolute top-32 right-12 flex items-center text-yellow-400 opacity-60">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-mono ml-1">WARNING</span>
          </div>
          <div className="absolute top-80 left-16 flex items-center text-yellow-400 opacity-50">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-xs font-mono ml-1">SYSTEM_ERROR</span>
          </div>
          
          {/* Broken grid elements */}
          <div className="absolute top-1/4 left-10 w-16 h-16 border border-red-500 opacity-40 transform rotate-12" />
          <div className="absolute bottom-1/3 right-20 w-12 h-12 border border-yellow-400 opacity-30 transform -rotate-6" />
          <div className="absolute top-2/3 left-1/3 w-8 h-8 border border-red-500 opacity-50 transform rotate-45" />
        </div>

        {/* Hero Section */}
        <section className="relative z-20 min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-6xl mx-auto">
            {/* Main Title */}
            <h1 className="mb-6">
              <span 
                className="block text-6xl md:text-8xl lg:text-9xl font-black text-red-500 font-mono tracking-wider"
                style={{
                  fontFamily: 'Monument Extended, monospace',
                  textShadow: `
                    0 0 20px #ff0000,
                    0 0 40px #ff0000,
                    3px 3px 0px #000,
                    6px 6px 0px rgba(0,0,0,0.8),
                    -2px 0px 0px #ffff00,
                    2px 0px 0px #ffff00
                  `,
                  filter: 'contrast(1.3) brightness(1.1)'
                }}
              >
                {glitchText}
              </span>
            </h1>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded font-bold text-sm mb-4">
              <Calendar className="w-4 h-4" />
              Oct 4–5, 2025 · Online · 48 Hours
            </div>

            {/* Subtitle */}
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 font-mono">
              Break the system. Build yours.
            </h2>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-gray-300 mb-8 font-mono">
              A 48-hour hackathon for system-breakers.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3 text-lg border-2 border-red-500 shadow-lg hover:shadow-red-500/50 transition-all"
              >
                <a href="https://protocol404.devpost.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Register on Devpost
                </a>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold px-8 py-3 text-lg"
              >
                <a href="https://discord.gg/WmSXVzDYuq" target="_blank" rel="noopener noreferrer">
                  Join Discord
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Sharp Divider */}
        <div className="relative z-20">
          <div className="h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-red-500" />
          <div className="h-px bg-black" />
        </div>

        {/* What is Protocol 404 Section */}
        <section className="relative z-20 py-16 px-6 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-red-500 mb-8 font-mono">
              What is Protocol 404?
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed font-mono">
              A 48-hour hackathon where the system is already broken. You're not fixing it — you're building in the wreckage. 
              No tracks, no filters, no safe plans. Just chaos, utility, and speed.
            </p>
          </div>
        </section>

        {/* Facts Section */}
        <section className="relative z-20 py-16 px-6 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-yellow-400 mb-12 text-center font-mono">
              Facts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "📅", text: "Oct 4–5, 2025" },
                { icon: "⏱", text: "48 Hours" },
                { icon: "🌍", text: "Online" },
                { icon: "🎤", text: "Results at Grand Indian Hackathon Ceremony (Nov 2025)" },
                { icon: "👥", text: "Solo or teams (up to 4)" },
                { icon: "🛠", text: "Any stack, no-code welcome" }
              ].map((fact, index) => (
                <Card key={index} className="bg-black border-red-500 border-2">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">{fact.icon}</div>
                    <p className="text-white font-mono">{fact.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Who Joins Section */}
        <section className="relative z-20 py-16 px-6 bg-black">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-red-500 mb-12 text-center font-mono">
              Who Joins
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
              {[
                "Chaos coders",
                "Indie hackers", 
                "Designers, meme builders",
                "Gen Z generalists",
                "Beginners and no-coders"
              ].map((group, index) => (
                <div key={index} className="bg-gray-900 border border-yellow-400 p-6 rounded-lg">
                  <p className="text-yellow-400 font-bold font-mono text-lg">{group}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="relative z-20 py-16 px-6 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-yellow-400 mb-12 text-center font-mono">
              How it Works
            </h2>
            <div className="space-y-8">
              {[
                { step: "Step 1", text: "Show up" },
                { step: "Step 2", text: "Build something that works in a broken world" },
                { step: "Step 3", text: "Submit prototype + short write-up" },
                { step: "Step 4", text: "Wait for the Grand Ceremony in November" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-6 bg-black p-6 border-l-4 border-red-500">
                  <div className="text-2xl font-black text-red-500 font-mono min-w-fit">{item.step}:</div>
                  <div className="text-lg text-white font-mono">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="relative z-20 py-16 px-6 bg-black">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-red-500 mb-12 text-center font-mono">
              Timeline
            </h2>
            <div className="space-y-6">
              {[
                { date: "Oct 4, 12:00 AM IST", event: "Hackathon begins" },
                { date: "Oct 5, 11:59 PM IST", event: "Hackathon ends" },
                { date: "Nov 2025", event: "Results announced at Grand Indian Hackathon Ceremony" }
              ].map((item, index) => (
                <div key={index} className="bg-gray-900 border border-yellow-400 p-6 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="text-yellow-400 font-bold font-mono text-lg min-w-fit">{item.date}</div>
                    <div className="text-white font-mono text-lg">– {item.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Judging Section */}
        <section className="relative z-20 py-16 px-6 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-yellow-400 mb-12 text-center font-mono">
              Judging
            </h2>
            <div className="space-y-6 mb-12">
              <div className="bg-black border border-red-500 p-6 rounded-lg">
                <p className="text-white font-mono text-lg">Async judging (no live calls)</p>
              </div>
              <div className="bg-black border border-red-500 p-6 rounded-lg">
                <p className="text-white font-mono text-lg">Judges: builders, operators, indie founders, major tech reps</p>
              </div>
              <div className="bg-black border border-red-500 p-6 rounded-lg">
                <p className="text-white font-mono text-lg">Optional 1-min pitch video</p>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-red-500 mb-8 text-center font-mono">Criteria:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { criteria: "⚡ Chaos Utility", percentage: "30%" },
                { criteria: "🧠 Speed Thinking", percentage: "25%" },
                { criteria: "💥 WTF Energy", percentage: "25%" },
                { criteria: "🎯 Presentation", percentage: "20%" }
              ].map((item, index) => (
                <div key={index} className="bg-black border border-yellow-400 p-6 rounded-lg text-center">
                  <div className="text-yellow-400 font-bold font-mono text-lg">{item.criteria}</div>
                  <div className="text-white font-mono text-xl mt-2">({item.percentage})</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Submission Section */}
        <section className="relative z-20 py-16 px-6 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-yellow-400 mb-12 text-center font-mono">
              Submission
            </h2>
            <div className="space-y-6">
              {[
                "Prototype link (GitHub, Notion, Figma, etc.)",
                "Short write-up: what broke, why it still works",
                "Optional 1-min video pitch"
              ].map((requirement, index) => (
                <div key={index} className="bg-black border border-red-500 p-6 rounded-lg">
                  <p className="text-white font-mono text-lg">{requirement}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Line */}
        <section className="relative z-20 py-16 px-6 bg-black">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-black text-red-500 font-mono">
              The system's down. You're still here. Build anyway.
            </p>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default Protocol404;