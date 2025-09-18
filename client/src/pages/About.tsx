import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Globe, 
  Code, 
  Users, 
  Trophy, 
  Calendar, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  Heart,
  MapPin,
  Mail,
  Star,
  Award,
  Rocket,
  GitBranch,
  Database,
  Activity,
  TrendingUp,
  Shield,
  Sparkles,
  Crown
} from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

// Hero Section Component
const HeroSection = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'HACKATHONS AS CULTURE, NOT JUST CODE';
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden flex items-center">
      {/* Enhanced Pixel Background with Animation */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(229,9,20,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.15)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,203,71,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,203,71,0.1)_1px,transparent_1px)] bg-[size:30px_30px] animate-bounce" style={{ animationDuration: '3s' }} />
      </div>
      
      {/* Enhanced Floating Elements */}
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i}>
          <div
            className={`absolute w-2 h-2 ${i % 3 === 0 ? 'bg-maximally-red' : i % 3 === 1 ? 'bg-maximally-yellow' : 'bg-green-500'} pixel-border animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + i * 0.2}s`,
            }}
          />
          {i < 8 && (
            <div
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              {i % 4 === 0 ? <Star className="h-3 w-3 text-maximally-yellow opacity-60" /> :
               i % 4 === 1 ? <Sparkles className="h-4 w-4 text-maximally-red opacity-50" /> :
               i % 4 === 2 ? <Crown className="h-3 w-3 text-purple-400 opacity-40" /> :
               <Rocket className="h-3 w-3 text-blue-400 opacity-50" />}
            </div>
          )}
        </div>
      ))}
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        {/* Enhanced logo with glow effect */}
        <div className="relative mb-8">
          <div className="minecraft-block bg-maximally-red p-6 inline-block relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-maximally-yellow/20 to-maximally-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Code className="h-12 w-12 text-black relative z-10 group-hover:animate-pulse" />
          </div>
          <div className="absolute inset-0 bg-maximally-red blur-xl opacity-30 animate-pulse"></div>
        </div>
        
        {/* Enhanced title with gradient */}
        <h1 className="font-press-start text-4xl md:text-5xl lg:text-7xl mb-8 relative">
          <span className="bg-gradient-to-r from-white via-maximally-red to-maximally-yellow bg-clip-text text-transparent drop-shadow-[4px_4px_0px_rgba(229,9,20,0.8)]">
            ABOUT MAXIMALLY
          </span>
        </h1>
        
        {/* Enhanced content card with better styling */}
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-maximally-red/20 via-maximally-yellow/10 to-maximally-red/20 blur-xl"></div>
          <div className="pixel-card bg-black/90 border-2 border-maximally-red p-8 md:p-12 relative backdrop-blur-sm">
            <div className="absolute top-2 right-2">
              <Crown className="h-6 w-6 text-maximally-yellow opacity-60" />
            </div>
            
            <p className="font-press-start text-maximally-red text-xl md:text-2xl mb-6 min-h-[3rem]">
              {typedText}<span className="animate-pulse">|</span>
            </p>
            
            <div className="space-y-6">
              <p className="font-jetbrains text-gray-100 text-lg md:text-xl leading-relaxed">
                Hackathons have always been more than just code. They are <span className="text-maximally-yellow font-semibold">experiments in how people think</span>, 
                create, and work together under pressure. They are places where <span className="text-maximally-red font-semibold">rules bend, ideas collide</span>, 
                and the boundaries of what's possible shift overnight.
              </p>
              
              <p className="font-jetbrains text-gray-100 text-lg md:text-xl leading-relaxed">
                Yet, for too long, hackathons have been scattered — run in silos, limited by geography, 
                or tied to a single school or company. <span className="text-maximally-yellow font-semibold">Maximally was born out of a simple belief:</span> 
                hackathons deserve to be <span className="text-maximally-red font-semibold">open, accessible, and cultural</span>.
              </p>
              
              <div className="flex justify-center mt-8">
                <Link to="/events" className="pixel-button bg-maximally-red text-black font-press-start text-sm px-8 py-4 hover:bg-maximally-yellow transition-all duration-300 hover:scale-105 inline-flex items-center">
                  EXPLORE OUR EVENTS <Rocket className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// What We're Building Component
const WhatWereBuilding = () => {
  const colorClasses = {
    'maximally-red': {
      border: 'border-maximally-red',
      bg: 'bg-maximally-red',
      text: 'text-maximally-red'
    },
    'maximally-yellow': {
      border: 'border-maximally-yellow',
      bg: 'bg-maximally-yellow', 
      text: 'text-maximally-yellow'
    },
    'green-500': {
      border: 'border-green-500',
      bg: 'bg-green-500',
      text: 'text-green-500'
    },
    'blue-500': {
      border: 'border-blue-500',
      bg: 'bg-blue-500',
      text: 'text-blue-500'
    },
    'purple-500': {
      border: 'border-purple-500',
      bg: 'bg-purple-500',
      text: 'text-purple-500'
    }
  };

  const buildingBlocks = [
    {
      title: "HACKATHONS (EVENTS)",
      description: "Where it all started. We run global online and hybrid hackathons with open themes, beginner-friendly tracks, and experimental formats.",
      icon: Calendar,
      color: "maximally-red",
      link: "/events"
    },
    {
      title: "MAXIMALLY PLATFORM",
      description: "An AI-native hackathon platform that gives organizers creative tools for submissions, judging, and community engagement.",
      icon: Code,
      color: "maximally-yellow",
      link: "#"
    },
    {
      title: "FEDERATION (MFHOP)",
      description: "A cross-school, cross-company network where organizers share resources, partnerships, and reach.",
      icon: Globe,
      color: "green-500",
      link: "/mfhop"
    },
    {
      title: "STUDIOS",
      description: "Content around hackathons, innovation, and youth culture — documenting stories and voices of builders.",
      icon: Users,
      color: "blue-500",
      link: "/blog"
    },
    {
      title: "COMMUNITY",
      description: "A living network of participants, mentors, and judges that stays connected long after events end.",
      icon: Heart,
      color: "purple-500",
      link: "https://discord.gg/MpBnYk8qMX"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-900 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,203,71,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,203,71,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-press-start text-2xl md:text-3xl lg:text-4xl mb-4 text-maximally-yellow drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            WHAT WE'RE BUILDING
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildingBlocks.map((block, index) => {
            const colors = colorClasses[block.color as keyof typeof colorClasses];
            return (
              <div key={index} className={`pixel-card bg-black border-2 ${colors.border} p-6 hover:scale-105 transition-all duration-300 group`}>
                <div className={`minecraft-block ${colors.bg} p-3 inline-block mb-4 group-hover:animate-pulse`}>
                  <block.icon className="h-6 w-6 text-black" />
                </div>
                
                <h3 className="font-press-start text-sm md:text-base mb-4 text-white">
                  {block.title}
                </h3>
                
                <p className="font-jetbrains text-gray-300 text-sm leading-relaxed mb-4">
                  {block.description}
                </p>
                
                {block.link.startsWith('http') ? (
                  <a 
                    href={block.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`inline-flex items-center font-press-start text-xs ${colors.text} hover:text-white transition-colors`}
                  >
                    EXPLORE <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                ) : (
                  <Link 
                    to={block.link}
                    className={`inline-flex items-center font-press-start text-xs ${colors.text} hover:text-white transition-colors`}
                  >
                    EXPLORE <ArrowRight className="h-3 w-3 ml-2" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// People Preview Component
const PeoplePreview = () => {
  return (
    <section className="py-16 md:py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-press-start text-2xl md:text-3xl lg:text-4xl mb-4 text-maximally-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            PEOPLE PREVIEW
          </h2>
          <p className="font-jetbrains text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            Meet the students and builders behind Maximally
          </p>
        </div>
        
        <div className="pixel-card bg-black/80 border-2 border-maximally-red p-8 text-center">
          <div className="minecraft-block bg-maximally-red p-4 inline-block mb-6">
            <Users className="h-8 w-8 text-black" />
          </div>
          
          <p className="font-jetbrains text-gray-300 text-lg mb-6">
            Discover our core team, judges, and the amazing community of builders who make Maximally possible.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/people/core" className="pixel-button bg-maximally-red text-black font-press-start text-xs px-6 py-3 hover:bg-maximally-yellow transition-colors">
              CORE TEAM
            </Link>
            <Link to="/people/judges" className="pixel-button bg-black border-2 border-maximally-red text-maximally-red font-press-start text-xs px-6 py-3 hover:bg-maximally-red hover:text-black transition-colors">
              JUDGES & MENTORS
            </Link>
            <Link to="/people" className="pixel-button bg-black border-2 border-maximally-yellow text-maximally-yellow font-press-start text-xs px-6 py-3 hover:bg-maximally-yellow hover:text-black transition-colors">
              ALL PEOPLE
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Partners Component
const Partners = () => {
  const colorClasses = {
    'maximally-red': {
      border: 'border-maximally-red',
      bg: 'bg-maximally-red',
      text: 'text-maximally-red'
    },
    'maximally-yellow': {
      border: 'border-maximally-yellow',
      bg: 'bg-maximally-yellow', 
      text: 'text-maximally-yellow'
    },
    'green-500': {
      border: 'border-green-500',
      bg: 'bg-green-500',
      text: 'text-green-500'
    }
  };

  const partnerCategories = [
    {
      title: "SPONSORS",
      partners: ["Masters' Union", "MakeX"],
      color: "maximally-red"
    },
    {
      title: "COLLABORATION ORGS",
      partners: ["Young Researchers Institute", "Calyptus", "Others"],
      color: "maximally-yellow"
    },
    {
      title: "SCHOOLS & COLLEGES",
      partners: ["Chandigarh Schools", "Delhi NCR Colleges", "International Collaborators"],
      color: "green-500"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-press-start text-2xl md:text-3xl lg:text-4xl mb-4 text-white drop-shadow-[4px_4px_0px_rgba(229,9,20,1)]">
            PARTNERS
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partnerCategories.map((category, index) => {
            const colors = colorClasses[category.color as keyof typeof colorClasses];
            return (
              <div key={index} className={`pixel-card bg-black border-2 ${colors.border} p-6`}>
                <h3 className={`font-press-start text-sm md:text-base mb-4 ${colors.text}`}>
                  {category.title}
                </h3>
                
                <ul className="space-y-2 font-jetbrains text-gray-300 text-sm">
                  {category.partners.map((partner, pIndex) => (
                    <li key={pIndex} className="flex items-center">
                      <div className={`w-2 h-2 ${colors.bg} pixel-border mr-3`} />
                      {partner}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Timeline Component
const Timeline = () => {
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);
  
  const milestones = [
    {
      title: "CODEQUEST",
      description: "Our first hackathon that started it all. A small but passionate group of students came together to build something amazing.",
      year: "2023"
    },
    {
      title: "MAXIMALLY STARTUP MAKEATHON",
      description: "Evolved into a full startup-focused event with real mentors, judges, and prizes. The foundation of what Maximally would become.",
      year: "2024"
    },
    {
      title: "MAXIMALLY AI SHIPATHON",
      description: "Our breakthrough AI-focused hackathon that attracted global attention and set new standards for virtual events.",
      year: "2024"
    },
    {
      title: "GRAND INDIAN HACKATHON SEASON",
      description: "A massive undertaking - 10 events across different themes, bringing together thousands of builders from around the world.",
      year: "2024"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-press-start text-2xl md:text-3xl lg:text-4xl mb-4 text-maximally-yellow drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            TIMELINE
          </h2>
        </div>
        
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="pixel-card bg-black border-2 border-maximally-yellow">
              <button
                onClick={() => setExpandedMilestone(expandedMilestone === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-center">
                  <div className="minecraft-block bg-maximally-yellow p-2 mr-4">
                    <Calendar className="h-4 w-4 text-black" />
                  </div>
                  <div>
                    <h3 className="font-press-start text-sm md:text-base text-maximally-yellow">
                      {milestone.title}
                    </h3>
                    <p className="font-jetbrains text-gray-400 text-sm mt-1">
                      {milestone.year}
                    </p>
                  </div>
                </div>
                
                {expandedMilestone === index ? (
                  <ChevronUp className="h-5 w-5 text-maximally-yellow" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-maximally-yellow" />
                )}
              </button>
              
              {expandedMilestone === index && (
                <div className="px-6 pb-6">
                  <p className="font-jetbrains text-gray-300 text-sm md:text-base leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Culture Section Component
const Culture = () => {
  const culturePoints = [
    {
      title: "OBSESSION WITH BUILDING",
      icon: Target,
      description: "We live and breathe creation. Every line of code, every event, every interaction is about building something better."
    },
    {
      title: "WORK THAT FEELS ALIVE",
      icon: Zap,
      description: "Not mechanical, not corporate. Our work has soul, energy, and the kind of passion that keeps you up at night."
    },
    {
      title: "TEENS AT FULL SPEED",
      icon: Users,
      description: "Young builders running at maximum velocity. No speed limits, no \"wait until you're older.\" The future is now."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-press-start text-2xl md:text-3xl lg:text-4xl mb-4 text-maximally-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            CULTURE / TASK FORCE
          </h2>
          <p className="font-press-start text-maximally-yellow text-lg">
            OUR DNA IS SIMPLE
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {culturePoints.map((point, index) => (
            <div key={index} className="pixel-card bg-black border-2 border-maximally-red p-6 text-center hover:border-maximally-yellow transition-colors">
              <div className="minecraft-block bg-maximally-red p-4 inline-block mb-4 hover:bg-maximally-yellow transition-colors">
                <point.icon className="h-6 w-6 text-black" />
              </div>
              
              <h3 className="font-press-start text-sm md:text-base mb-4 text-maximally-red">
                {point.title}
              </h3>
              
              <p className="font-jetbrains text-gray-300 text-sm leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Future Vision Component
const FutureVision = () => {
  return (
    <section className="py-16 md:py-24 bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-maximally-red/10 via-maximally-yellow/10 to-maximally-red/10 animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <div className="pixel-card bg-black/90 border-2 border-maximally-yellow p-8 md:p-12 max-w-4xl mx-auto">
          <div className="minecraft-block bg-maximally-yellow p-4 inline-block mb-6">
            <Globe className="h-8 w-8 text-black" />
          </div>
          
          <h2 className="font-press-start text-2xl md:text-3xl lg:text-4xl mb-6 text-maximally-yellow drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            FUTURE VISION
          </h2>
          
          <p className="font-press-start text-maximally-red text-lg md:text-xl mb-6">
            BY 2027, MAXIMALLY WILL BE THE BIGGEST HACKATHON ENGINE IN ASIA
          </p>
          
          <p className="font-jetbrains text-gray-300 text-base md:text-lg leading-relaxed">
            A system where hackathons are constant, connected, and central to how people learn and innovate.
            Where every student, every builder, every dreamer has access to the tools and community they need to create the future.
          </p>
        </div>
      </div>
    </section>
  );
};

// Media Kit Component
const MediaKit = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <h2 className="font-press-start text-2xl md:text-3xl lg:text-4xl mb-8 text-white drop-shadow-[4px_4px_0px_rgba(229,9,20,1)]">
          MEDIA KIT
        </h2>
        
        <div className="pixel-card bg-black border-2 border-maximally-red p-8 max-w-2xl mx-auto">
          <div className="minecraft-block bg-maximally-red p-4 inline-block mb-6">
            <Mail className="h-8 w-8 text-black" />
          </div>
          
          <p className="font-jetbrains text-gray-300 text-base md:text-lg mb-6">
            Need logos, colors, or press materials? We've got you covered.
          </p>
          
          <a 
            href="mailto:brand@maximally.in" 
            className="pixel-button bg-maximally-red text-black font-press-start text-sm px-6 py-3 hover:bg-maximally-yellow transition-colors inline-flex items-center"
          >
            CONTACT: BRAND@MAXIMALLY.IN <Mail className="h-4 w-4 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

// Statistics Section Component
const StatisticsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({ events: 0, builders: 0, countries: 0, projects: 0 });

  useEffect(() => {
    setIsVisible(true);
    if (isVisible) {
      const targets = { events: 15, builders: 5000, countries: 25, projects: 800 };
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 steps for smooth animation
      const stepDuration = duration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        setCounts({
          events: Math.floor(targets.events * progress),
          builders: Math.floor(targets.builders * progress),
          countries: Math.floor(targets.countries * progress),
          projects: Math.floor(targets.projects * progress)
        });
        
        if (step >= steps) {
          clearInterval(timer);
          setCounts(targets);
        }
      }, stepDuration);
      
      return () => clearInterval(timer);
    }
  }, [isVisible]);

  const stats = [
    { label: "HACKATHONS HOSTED", value: counts.events, suffix: "+", icon: Trophy, color: "maximally-red" },
    { label: "GLOBAL BUILDERS", value: counts.builders, suffix: "+", icon: Users, color: "maximally-yellow" },
    { label: "COUNTRIES REACHED", value: counts.countries, suffix: "+", icon: Globe, color: "green-500" },
    { label: "PROJECTS BUILT", value: counts.projects, suffix: "+", icon: Rocket, color: "blue-500" }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-maximally-yellow animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${2 + i * 0.3}s`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-press-start text-3xl md:text-4xl lg:text-5xl mb-4 bg-gradient-to-r from-maximally-red to-maximally-yellow bg-clip-text text-transparent drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            BY THE NUMBERS
          </h2>
          <p className="font-jetbrains text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Our impact speaks for itself. Join thousands of builders changing the world.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const colorClasses = {
              'maximally-red': { border: 'border-maximally-red', bg: 'bg-maximally-red', text: 'text-maximally-red' },
              'maximally-yellow': { border: 'border-maximally-yellow', bg: 'bg-maximally-yellow', text: 'text-maximally-yellow' },
              'green-500': { border: 'border-green-500', bg: 'bg-green-500', text: 'text-green-500' },
              'blue-500': { border: 'border-blue-500', bg: 'bg-blue-500', text: 'text-blue-500' }
            };
            const colors = colorClasses[stat.color as keyof typeof colorClasses];
            
            return (
              <div key={index} className={`pixel-card bg-black/80 border-2 ${colors.border} p-6 text-center hover:scale-105 transition-all duration-300 group backdrop-blur-sm`}>
                <div className={`minecraft-block ${colors.bg} p-4 inline-block mb-4 group-hover:animate-bounce`}>
                  <stat.icon className="h-8 w-8 text-black" />
                </div>
                
                <div className={`font-press-start text-2xl md:text-3xl lg:text-4xl mb-2 ${colors.text}`}>
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                
                <p className="font-jetbrains text-gray-300 text-xs md:text-sm font-semibold">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Awards & Recognition Section
const AwardsSection = () => {
  const awards = [
    {
      title: "Best Hackathon Platform 2024",
      organization: "Global Innovation Awards",
      description: "Recognized for revolutionizing virtual hackathon experiences",
      icon: Award,
      year: "2024"
    },
    {
      title: "Youth Innovation Excellence",
      organization: "Education Technology Summit",
      description: "Outstanding contribution to teen skill development",
      icon: Star,
      year: "2024"
    },
    {
      title: "Community Impact Award",
      organization: "Asia Hackathon Federation",
      description: "Building the largest teen builder community in Asia",
      icon: Heart,
      year: "2024"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-press-start text-3xl md:text-4xl lg:text-5xl mb-4 text-maximally-yellow drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            AWARDS & RECOGNITION
          </h2>
          <p className="font-jetbrains text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
            Our dedication to excellence has been recognized by industry leaders worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {awards.map((award, index) => (
            <div key={index} className="pixel-card bg-gradient-to-br from-gray-900 to-black border-2 border-maximally-yellow p-8 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-maximally-yellow/10 transform rotate-45 translate-x-8 -translate-y-8"></div>
              
              <div className="minecraft-block bg-maximally-yellow p-4 inline-block mb-6 group-hover:animate-pulse">
                <award.icon className="h-8 w-8 text-black" />
              </div>
              
              <div className="text-maximally-yellow font-press-start text-xs mb-2">
                {award.year}
              </div>
              
              <h3 className="font-press-start text-sm md:text-base mb-4 text-white">
                {award.title}
              </h3>
              
              <p className="font-jetbrains text-maximally-yellow text-sm font-semibold mb-4">
                {award.organization}
              </p>
              
              <p className="font-jetbrains text-gray-300 text-sm leading-relaxed">
                {award.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Community Highlights Section
const CommunityHighlights = () => {
  const highlights = [
    {
      title: "GLOBAL DISCORD COMMUNITY",
      description: "24/7 active community with builders from every continent sharing ideas and collaborating",
      stat: "5,000+ Members",
      icon: Users,
      color: "maximally-red"
    },
    {
      title: "MENTORSHIP NETWORK",
      description: "Industry veterans from top companies providing guidance to the next generation",
      stat: "200+ Mentors",
      icon: Shield,
      color: "maximally-yellow"
    },
    {
      title: "SUCCESS STORIES",
      description: "Alumni launching startups, landing dream jobs, and changing their communities",
      stat: "500+ Graduates",
      icon: TrendingUp,
      color: "green-500"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(229,9,20,0.05)_25%,transparent_25%,transparent_75%,rgba(229,9,20,0.05)_75%),linear-gradient(45deg,rgba(229,9,20,0.05)_25%,transparent_25%,transparent_75%,rgba(229,9,20,0.05)_75%)] bg-[size:40px_40px] bg-[position:0_0,20px_20px] animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-press-start text-3xl md:text-4xl lg:text-5xl mb-4 text-maximally-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            COMMUNITY HIGHLIGHTS
          </h2>
          <p className="font-jetbrains text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
            More than just events - we're building a movement of young innovators
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => {
            const colorClasses = {
              'maximally-red': { border: 'border-maximally-red', bg: 'bg-maximally-red', text: 'text-maximally-red' },
              'maximally-yellow': { border: 'border-maximally-yellow', bg: 'bg-maximally-yellow', text: 'text-maximally-yellow' },
              'green-500': { border: 'border-green-500', bg: 'bg-green-500', text: 'text-green-500' }
            };
            const colors = colorClasses[highlight.color as keyof typeof colorClasses];
            
            return (
              <div key={index} className={`pixel-card bg-black/90 border-2 ${colors.border} p-8 hover:scale-105 transition-all duration-300 group backdrop-blur-sm`}>
                <div className={`minecraft-block ${colors.bg} p-4 inline-block mb-6 group-hover:animate-spin`} style={{ animationDuration: '2s' }}>
                  <highlight.icon className="h-8 w-8 text-black" />
                </div>
                
                <h3 className="font-press-start text-sm md:text-base mb-4 text-white">
                  {highlight.title}
                </h3>
                
                <p className="font-jetbrains text-gray-300 text-sm leading-relaxed mb-6">
                  {highlight.description}
                </p>
                
                <div className={`font-press-start text-xl ${colors.text} text-center`}>
                  {highlight.stat}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Main About Component
const About = () => {
  return (
    <div className="min-h-screen bg-black">
      <SEO 
        title="About Maximally - Hackathons as Culture, Not Just Code"
        description="Learn about Maximally's mission to make hackathons open, accessible, and cultural. Discover our platform, events, and global community of teen builders."
        keywords="about Maximally, hackathon platform, teen builders, global hackathons, MFHOP, hackathon culture"
      />
      
      <HeroSection />
      <StatisticsSection />
      <WhatWereBuilding />
      <CommunityHighlights />
      <AwardsSection />
      <PeoplePreview />
      <Partners />
      <Timeline />
      <Culture />
      <FutureVision />
      <MediaKit />
      
      <Footer />
    </div>
  );
};

export default About;