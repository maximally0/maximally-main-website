import { useState } from 'react';
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
  Mail
} from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="min-h-screen bg-black text-white relative overflow-hidden flex items-center">
      {/* Pixel Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(229,9,20,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      
      {/* Floating Pixels */}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-maximally-red pixel-border animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + i}s`,
          }}
        />
      ))}
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <div className="minecraft-block bg-maximally-red p-4 inline-block mb-6">
          <Code className="h-8 w-8 text-black" />
        </div>
        
        <h1 className="font-press-start text-3xl md:text-4xl lg:text-6xl mb-6 text-white drop-shadow-[4px_4px_0px_rgba(229,9,20,1)]">
          ABOUT MAXIMALLY
        </h1>
        
        <div className="pixel-card bg-black/80 border-2 border-maximally-red p-6 md:p-8 max-w-4xl mx-auto">
          <p className="font-press-start text-maximally-red text-lg md:text-xl mb-4">
            HACKATHONS AS CULTURE, NOT JUST CODE
          </p>
          
          <p className="font-jetbrains text-gray-300 text-base md:text-lg leading-relaxed">
            Hackathons have always been more than just code. They are experiments in how people think, 
            create, and work together under pressure. They are places where rules bend, ideas collide, 
            and the boundaries of what's possible shift overnight.
          </p>
          
          <p className="font-jetbrains text-gray-300 text-base md:text-lg leading-relaxed mt-4">
            Yet, for too long, hackathons have been scattered — run in silos, limited by geography, 
            or tied to a single school or company. Maximally was born out of a simple belief: 
            hackathons deserve to be open, accessible, and cultural.
          </p>
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
      <WhatWereBuilding />
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