import { useEffect, useState } from "react";
import { ExternalLink, ArrowDown, Code, Users, Clock, Trophy, CheckCircle, Github, Video, Globe, Zap, Terminal, Target } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const CodeHypothesis = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "this is where code meets graffiti";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setTypedText("");
          index = 0;
        }, 2000);
      }
    }, 80);

    return () => clearInterval(timer);
  }, []);

  const scrollToDetails = () => {
    document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="Code Hypothesis - Grand Indian Hackathon Season | Maximally"
        description="A 24-hour hackathon for wild ideas. Test theories instead of pitching. Part of Maximally Grand Indian Hackathon Season."
        keywords="code hypothesis, hackathon, grand indian hackathon, maximally, coding competition, developers, graffiti, hacker"
        canonicalUrl="https://maximally.in/codehypothesis"
      />
      
      {/* Black Brick Wall Background */}
      <div 
        className="min-h-screen bg-black relative"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              #1a1a1a,
              #1a1a1a 15px,
              #0f0f0f 15px,
              #0f0f0f 30px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 60px,
              #0d0d0d 60px,
              #0d0d0d 62px
            )
          `,
          backgroundSize: '100% 30px, 60px 100%'
        }}
      >
        {/* Graffiti Splatters and Tags */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Paint drips */}
          <div className="absolute top-20 left-10 w-2 h-32 bg-gradient-to-b from-green-400 to-transparent opacity-60 animate-pulse"></div>
          <div className="absolute top-32 right-24 w-1 h-24 bg-gradient-to-b from-red-500 to-transparent opacity-70"></div>
          <div className="absolute top-64 left-1/3 w-3 h-40 bg-gradient-to-b from-yellow-400 to-transparent opacity-50 animate-pulse"></div>
          
          {/* Spray paint splatters */}
          <div className="absolute top-40 right-16 w-16 h-16 rounded-full bg-green-400 opacity-20 blur-sm animate-ping"></div>
          <div className="absolute top-96 left-20 w-12 h-12 rounded-full bg-red-500 opacity-25 blur-md"></div>
          <div className="absolute bottom-40 right-32 w-8 h-8 rounded-full bg-yellow-400 opacity-30 animate-bounce"></div>
          
          {/* Graffiti tags scattered around */}
          <div className="absolute top-80 left-16 text-green-400 font-mono text-xs opacity-40 rotate-12 tracking-widest">HACK_THE_SYSTEM</div>
          <div className="absolute top-[30rem] right-20 text-red-500 font-mono text-xs opacity-30 -rotate-6 tracking-widest">CODE_REBEL</div>
          <div className="absolute bottom-80 left-1/4 text-yellow-400 font-mono text-xs opacity-35 rotate-6 tracking-widest">BREAK_RULES</div>
          
          {/* Scratches and marks */}
          <div className="absolute top-60 left-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-60 rotate-12"></div>
          <div className="absolute top-[20rem] right-1/3 w-24 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-40 -rotate-12"></div>
        </div>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Chaotic Background Elements */}
          <div className="absolute inset-0">
            {/* Glitch scan lines - more chaotic */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-scan-line opacity-80"></div>
            <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-scan-line" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-40 left-0 w-3/4 h-px bg-gradient-to-r from-green-400 via-transparent to-red-500 animate-scan-line" style={{ animationDelay: '2.5s' }}></div>
            
            {/* More graffiti chaos */}
            <div className="absolute top-32 left-20 w-12 h-12 rounded-full bg-green-400 opacity-15 animate-pulse blur-sm"></div>
            <div className="absolute top-80 right-32 w-8 h-8 rounded-full bg-red-500 opacity-25 animate-ping blur-md"></div>
            <div className="absolute bottom-40 left-16 w-6 h-6 rounded-full bg-yellow-400 opacity-20 animate-bounce blur-sm"></div>
            <div className="absolute top-60 right-16 w-10 h-10 rounded-full bg-purple-500 opacity-15 animate-pulse blur-md"></div>
            
            {/* Random paint streaks */}
            <div className="absolute top-1/4 left-8 w-1 h-20 bg-gradient-to-b from-green-400 to-transparent opacity-40 animate-pulse rotate-12"></div>
            <div className="absolute top-1/3 right-12 w-2 h-16 bg-gradient-to-b from-red-500 to-transparent opacity-50 -rotate-6"></div>
            <div className="absolute bottom-1/4 left-24 w-1 h-24 bg-gradient-to-b from-yellow-400 to-transparent opacity-35 rotate-45"></div>
          </div>

          <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
            {/* Main Title - Rough Neon Green Spray Paint Style */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 relative">
              <span 
                className="block text-green-400 font-mono tracking-wider relative glitch-text"
                style={{
                  textShadow: `
                    0 0 15px #10b981,
                    0 0 30px #10b981,
                    0 0 60px #10b981,
                    3px 3px 0px #000,
                    6px 6px 0px rgba(0,0,0,0.8),
                    -2px 0px 0px #e50914,
                    2px 0px 0px #ffd700
                  `,
                  fontFamily: 'VT323, monospace',
                  filter: 'contrast(1.2) brightness(1.1)'
                }}
              >
                CODE
                <div className="absolute -top-4 -right-6 w-8 h-8 bg-red-500 rounded-full animate-pulse opacity-70 blur-sm"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rotate-45 animate-spin opacity-80"></div>
                {/* Paint drip effect */}
                <div className="absolute -bottom-2 left-8 w-1 h-8 bg-gradient-to-b from-green-400 to-transparent opacity-60"></div>
              </span>
              <span 
                className="block text-green-400 font-mono tracking-wider -mt-4 relative glitch-text"
                style={{
                  textShadow: `
                    0 0 15px #10b981,
                    0 0 30px #10b981,
                    0 0 60px #10b981,
                    3px 3px 0px #000,
                    6px 6px 0px rgba(0,0,0,0.8),
                    -2px 0px 0px #e50914,
                    2px 0px 0px #ffd700
                  `,
                  fontFamily: 'VT323, monospace',
                  filter: 'contrast(1.2) brightness(1.1)'
                }}
              >
                HYPOTHESIS
                <div className="absolute -bottom-6 -left-8 w-6 h-6 bg-yellow-400 rotate-45 animate-spin opacity-60 blur-sm"></div>
                <div className="absolute -bottom-3 -left-4 w-3 h-3 bg-red-500 rounded-full animate-pulse opacity-70"></div>
                {/* More paint effects */}
                <div className="absolute -bottom-4 right-12 w-1 h-12 bg-gradient-to-b from-red-500 to-transparent opacity-50 rotate-12"></div>
                <div className="absolute top-2 right-4 w-2 h-6 bg-gradient-to-b from-yellow-400 to-transparent opacity-40 -rotate-6"></div>
              </span>
            </h1>

            {/* Grand Indian Hackathon Badge - Rough Style */}
            <div className="inline-block mb-6 px-6 py-3 border-2 border-red-500 bg-black/90 backdrop-blur-sm relative transform -rotate-1">
              <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-yellow-400 rounded blur opacity-40 animate-pulse"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-60"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-400 rounded-full opacity-70"></div>
              <span className="relative text-white font-bold text-sm md:text-base tracking-wide font-mono glitch-text">
                GRAND INDIAN HACKATHON SEASON
              </span>
              {/* Distressed corners */}
              <div className="absolute top-0 left-0 w-1 h-1 bg-black transform rotate-45"></div>
              <div className="absolute bottom-0 right-0 w-1 h-1 bg-black transform rotate-45"></div>
            </div>

            {/* Subtitle */}
            <p className="text-2xl md:text-4xl text-white/90 mb-4 font-mono tracking-wide">
              A 24-hour hackathon for{' '}
              <span className="text-yellow-400 animate-pulse">wild ideas</span>
            </p>

            {/* Animated Tagline */}
            <div className="h-12 mb-12">
              <p className="text-lg md:text-xl text-green-400 font-mono tracking-wider terminal-cursor">
                {typedText}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="https://codehypothesis.devpost.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 bg-red-500 text-white font-bold text-lg tracking-wide hover:bg-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-red font-mono border-2 border-red-500 hover:border-yellow-400"
              >
                <div className="absolute inset-0 bg-red-500 animate-pulse opacity-20"></div>
                <span className="relative flex items-center gap-2">
                  REGISTER ON DEVPOST
                  <ExternalLink size={20} className="group-hover:animate-bounce" />
                </span>
              </a>
              
              <button
                onClick={scrollToDetails}
                className="group relative px-8 py-4 bg-transparent border-2 border-green-400 text-green-400 font-bold text-lg tracking-wide hover:bg-green-400 hover:text-black transition-all duration-300 transform hover:scale-105 font-mono"
              >
                <span className="flex items-center gap-2">
                  READ DETAILS
                  <ArrowDown size={20} className="group-hover:animate-bounce" />
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* What is Code Hypothesis */}
        <section id="details" className="py-20 px-6 relative">
          {/* More graffiti chaos in background */}
          <div className="absolute top-10 right-20 text-red-500 font-mono text-xs opacity-25 rotate-45 tracking-widest">NO_RULES</div>
          <div className="absolute bottom-20 left-16 text-green-400 font-mono text-xs opacity-30 -rotate-12 tracking-widest">PURE_CHAOS</div>
          <div className="absolute top-32 left-1/3 w-2 h-16 bg-gradient-to-b from-yellow-400 to-transparent opacity-30 rotate-45"></div>
          
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-green-400 mb-8 font-mono tracking-wider text-center relative transform -rotate-1">
              <span className="glitch-text" style={{
                textShadow: `
                  0 0 10px #10b981,
                  0 0 20px #10b981,
                  -2px 0px 0px #e50914,
                  2px 0px 0px #ffd700
                `
              }}>
                WHAT IS CODE HYPOTHESIS?
              </span>
              {/* Paint splatter on title */}
              <div className="absolute -top-2 right-8 w-4 h-4 bg-red-500 rounded-full opacity-60 blur-sm"></div>
            </h2>
            <div className="bg-black/70 border-2 border-red-500/60 p-8 backdrop-blur-sm relative transform rotate-0.5">
              {/* Rough distressed corners */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-yellow-400 rotate-3"></div>
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-yellow-400 -rotate-3"></div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-yellow-400 -rotate-3"></div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-yellow-400 rotate-3"></div>
              
              {/* Spray paint marks */}
              <div className="absolute top-4 right-6 w-6 h-6 bg-green-400 rounded-full opacity-15 blur-md"></div>
              <div className="absolute bottom-8 left-8 w-4 h-4 bg-yellow-400 opacity-20 blur-sm rotate-45"></div>
              
              <p className="text-white/90 text-lg leading-relaxed font-mono relative">
                Not your average hackathon. Instead of pitching polished ideas, you{' '}
                <span className="text-yellow-400 font-bold bg-yellow-400/10 px-1 -skew-x-3">test theories</span> and{' '}
                <span className="text-green-400 font-bold bg-green-400/10 px-1 skew-x-3">challenge assumptions</span>. 
                This is about raw experimentation, fast prototyping, and proving (or disproving) 
                your wildest coding hypotheses in just 24 hours. No fluff, no presentations — 
                just pure, unfiltered{' '}
                <span className="text-red-500 font-bold animate-pulse bg-red-500/10 px-1 -rotate-1 inline-block">code rebellion</span>.
              </p>
            </div>
          </div>
        </section>

        {/* Event Facts */}
        <section className="py-20 px-6 bg-gradient-to-r from-black via-gray-900 to-black relative">
          {/* More chaos */}
          <div className="absolute top-16 left-10 w-3 h-20 bg-gradient-to-b from-red-500 to-transparent opacity-40 rotate-12 animate-pulse"></div>
          <div className="absolute bottom-16 right-12 w-2 h-16 bg-gradient-to-b from-green-400 to-transparent opacity-50 -rotate-12"></div>
          <div className="absolute top-32 right-1/4 text-yellow-400 font-mono text-xs opacity-30 rotate-6 tracking-widest">FACTS_ONLY</div>
          
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-green-400 mb-12 font-mono tracking-wider text-center relative">
              <span className="glitch-text" style={{
                textShadow: `
                  0 0 10px #10b981,
                  0 0 20px #10b981,
                  -2px 0px 0px #e50914,
                  2px 0px 0px #ffd700
                `
              }}>
                EVENT FACTS
              </span>
              <div className="absolute -bottom-2 left-16 w-1 h-8 bg-gradient-to-b from-red-500 to-transparent opacity-60"></div>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Clock size={40} />, label: "DATE", value: "SEPT 28, 2025", color: "text-red-500" },
                { icon: <Code size={40} />, label: "DURATION", value: "24 HOURS", color: "text-yellow-400" },
                { icon: <Globe size={40} />, label: "MODE", value: "ONLINE", color: "text-green-400" },
                { icon: <Trophy size={40} />, label: "RESULTS", value: "NOVEMBER", color: "text-blue-400" }
              ].map((fact, index) => (
                <div key={index} className="bg-black/80 border-2 border-gray-600 p-6 text-center hover:border-red-500 transition-all duration-300 relative group transform hover:rotate-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {/* Rough distressed effects */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 opacity-40 rotate-45"></div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 opacity-50 rotate-45"></div>
                  
                  <div className={`${fact.color} mb-4 flex justify-center group-hover:animate-pulse`}>
                    {fact.icon}
                  </div>
                  <p className="text-gray-400 text-sm font-mono mb-2">{fact.label}</p>
                  <p className={`${fact.color} font-bold text-lg font-mono tracking-wide`}>{fact.value}</p>
                  
                  {/* Random paint spots */}
                  {index % 2 === 0 && <div className="absolute top-2 right-2 w-1 h-6 bg-gradient-to-b from-red-500 to-transparent opacity-30 rotate-12"></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who Should Join */}
        <section className="py-20 px-6 relative">
          {/* Scattered graffiti */}
          <div className="absolute top-24 left-8 text-red-500 font-mono text-xs opacity-25 rotate-12 tracking-widest">REBELS_WELCOME</div>
          <div className="absolute bottom-32 right-16 text-yellow-400 font-mono text-xs opacity-30 -rotate-6 tracking-widest">JOIN_US</div>
          <div className="absolute top-40 right-8 w-2 h-12 bg-gradient-to-b from-green-400 to-transparent opacity-40 rotate-45"></div>
          
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-green-400 mb-12 font-mono tracking-wider text-center relative transform rotate-0.5">
              <span className="glitch-text" style={{
                textShadow: `
                  0 0 10px #10b981,
                  0 0 20px #10b981,
                  -2px 0px 0px #e50914,
                  2px 0px 0px #ffd700
                `
              }}>
                WHO SHOULD JOIN?
              </span>
              <div className="absolute -top-3 right-12 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "BUILDERS WITH WEIRD IDEAS", icon: <Code className="text-red-500" size={24} /> },
                { title: "ABSOLUTE BEGINNERS", icon: <Users className="text-yellow-400" size={24} /> },
                { title: "NO-CODE REBELS", icon: <Zap className="text-green-400" size={24} /> },
                { title: "STUDENTS & DROPOUTS", icon: <Terminal className="text-blue-400" size={24} /> },
                { title: "INDIE HACKERS", icon: <Code className="text-purple-400" size={24} /> },
                { title: "THEORY BREAKERS", icon: <Target className="text-pink-400" size={24} /> }
              ].map((type, index) => (
                <div key={index} className="bg-black/60 border border-gray-600 p-6 text-center hover:border-green-400 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="mb-4 flex justify-center group-hover:animate-pulse">
                      {type.icon}
                    </div>
                    <p className="text-white font-mono text-sm tracking-wide leading-relaxed">
                      {type.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-green-400 mb-12 font-mono tracking-wider text-center">
              HOW IT WORKS
            </h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "THINK OF A HYPOTHESIS",
                  description: "What coding assumption do you want to challenge? What theory needs testing?",
                  color: "border-red-500 text-red-500"
                },
                {
                  step: "02", 
                  title: "BUILD TO TEST IT",
                  description: "24 hours to code, break, rebuild. Test your theory through raw experimentation.",
                  color: "border-yellow-400 text-yellow-400"
                },
                {
                  step: "03",
                  title: "SUBMIT ON DEVPOST", 
                  description: "Share your findings, whether you proved or destroyed your hypothesis.",
                  color: "border-green-400 text-green-400"
                }
              ].map((step, index) => (
                <div key={index} className={`bg-black/80 border-2 ${step.color.split(' ')[0]} p-8 relative group hover:scale-105 transition-all duration-300`}>
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-black border-2 border-current rounded-full flex items-center justify-center">
                    <span className={`font-bold font-mono ${step.color.split(' ')[1]}`}>{step.step}</span>
                  </div>
                  <div className="mt-6">
                    <h3 className={`text-xl font-bold font-mono mb-4 tracking-wide ${step.color.split(' ')[1]}`}>
                      {step.title}
                    </h3>
                    <p className="text-white/80 font-mono text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-current opacity-30 rotate-45"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-green-400 mb-12 font-mono tracking-wider text-center">
              TIMELINE
            </h2>
            <div className="bg-black/80 border border-gray-600 overflow-hidden">
              <div className="bg-red-500 text-black font-bold font-mono text-center py-3 tracking-wider">
                CRITICAL DATES
              </div>
              {[
                { date: "SEPT 28, 2025", event: "Hackathon Start & End (24h)", status: "HACK TIME" },
                { date: "OCT 1 - NOV 1", event: "Async Judging Period", status: "REVIEW" },
                { date: "MID NOVEMBER", event: "Results Ceremony", status: "RESULTS" }
              ].map((item, index) => (
                <div key={index} className="border-b border-gray-600 last:border-b-0">
                  <div className="grid md:grid-cols-3 gap-4 p-6 hover:bg-gray-900/50 transition-colors duration-300">
                    <div className="text-yellow-400 font-mono font-bold">{item.date}</div>
                    <div className="text-white/90 font-mono">{item.event}</div>
                    <div className={`font-mono text-sm px-3 py-1 inline-block border ${
                      item.status === 'HACK TIME' ? 'text-red-500 border-red-500' :
                      item.status === 'REVIEW' ? 'text-yellow-400 border-yellow-400' :
                      'text-green-400 border-green-400'
                    }`}>
                      {item.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Judging */}
        <section className="py-20 px-6 bg-gradient-to-r from-black via-gray-900 to-black">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-green-400 mb-8 font-mono tracking-wider text-center">
              JUDGING
            </h2>
            <div className="bg-black/60 border-2 border-yellow-400/50 p-8 backdrop-blur-sm">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-yellow-400 font-mono font-bold text-lg mb-4">EVALUATION PROCESS</h3>
                  <p className="text-white/90 font-mono text-sm leading-relaxed mb-4">
                    Async judging by experts from <span className="text-red-500 font-bold">OpenAI</span>, {' '}
                    <span className="text-blue-400 font-bold">Google</span>, and {' '}
                    <span className="text-green-400 font-bold">Meta</span>. 
                    No live presentations required.
                  </p>
                </div>
                <div>
                  <h3 className="text-yellow-400 font-mono font-bold text-lg mb-4">OPTIONAL VIDEOS</h3>
                  <p className="text-white/90 font-mono text-sm leading-relaxed">
                    Submit an optional <span className="text-green-400 font-bold">2-minute video</span> {' '}
                    explaining your hypothesis and findings. Not required, but can help showcase your work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Submission Requirements */}
        <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-green-400 mb-12 font-mono tracking-wider text-center">
              SUBMISSION
            </h2>
            <div className="space-y-6">
              {[
                {
                  icon: <Github size={24} />,
                  title: "GITHUB/PROTOTYPE LINK",
                  description: "Your code repository or working prototype link",
                  required: true
                },
                {
                  icon: <Code size={24} />,
                  title: "HYPOTHESIS WRITEUP",
                  description: "Short explanation of your hypothesis, test approach, and results",
                  required: true
                },
                {
                  icon: <Video size={24} />,
                  title: "2-MINUTE VIDEO",
                  description: "Optional video explaining your process and findings",
                  required: false
                }
              ].map((req, index) => (
                <div key={index} className="bg-black/60 border border-gray-600 p-6 flex items-start gap-6 hover:border-green-400 transition-all duration-300">
                  <div className="text-green-400 mt-1">
                    {req.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-mono font-bold tracking-wide">{req.title}</h3>
                      <span className={`text-xs px-2 py-1 border font-mono ${
                        req.required 
                          ? 'text-red-500 border-red-500' 
                          : 'text-yellow-400 border-yellow-400'
                      }`}>
                        {req.required ? 'REQUIRED' : 'OPTIONAL'}
                      </span>
                    </div>
                    <p className="text-white/80 font-mono text-sm">{req.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="py-12 px-6 border-t border-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white/60 font-mono text-sm mb-4">
              part of{' '}
              <span className="text-red-500 font-bold">Maximally Grand Indian Hackathon Season</span>
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default CodeHypothesis;