import { useEffect, useState } from "react";
import { ExternalLink, Calendar, Clock, Globe, Users, Code, Zap, Award, Star, Heart, Coffee, ChevronDown, ChevronRight } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Demo hackathon data structure
const hackathonData = {
  // Core identifiers
  title: "Demo Future Hack",
  subtitle: "Summer Edition 2025",
  tagline: "Build the next generation of digital solutions",
  
  // Event basics
  dates: {
    start: "July 15, 2025",
    end: "July 17, 2025",
    resultsDate: "July 24, 2025"
  },
  mode: "Hybrid",
  duration: "48 hours",
  location: "Bangalore + Online",
  
  // Badge and links
  distinctionBadge: "Maximally Partnered",
  links: {
    register: "https://example.com/register",
    devpost: "https://example.com/devpost",
    discord: "https://discord.gg/example",
    whatsapp: "https://chat.whatsapp.com/example",
    infoDeck: "https://example.com/deck.pdf",
    instagram: "https://instagram.com/example"
  },
  
  // Content sections
  about: {
    theme: "Future Technology",
    description: "A weekend to prototype breakthrough solutions using emerging technologies. Whether you're building AI-powered apps, climate tech solutions, or the next big consumer product, this is your playground to experiment and create.",
    vibe: "collaborative, high-energy, innovation-focused",
    rules: [
      "Teams of 1-4 people",
      "48 hours to build your prototype",
      "All skill levels welcome",
      "Open source preferred but not required"
    ]
  },
  
  facts: {
    participants: "200+ builders",
    teams: "50+ teams expected",
    tracks: "4 themed tracks",
    prizes: "$10,000+ prize pool",
    mentors: "20+ industry mentors",
    sponsors: "15+ partner companies"
  },
  
  whoShouldJoin: [
    { icon: "💻", text: "Developers ready to experiment", color: "bg-blue-200 border-blue-600" },
    { icon: "🎨", text: "Designers who think in systems", color: "bg-purple-200 border-purple-600" },
    { icon: "🚀", text: "Entrepreneurs with bold ideas", color: "bg-green-200 border-green-600" },
    { icon: "🔬", text: "Students exploring tech careers", color: "bg-yellow-200 border-yellow-600" },
    { icon: "🌱", text: "Anyone passionate about impact", color: "bg-pink-200 border-pink-600" }
  ],
  
  howItWorks: [
    { step: "Step 1", text: "Register and join our community", color: "bg-blue-200 border-blue-600" },
    { step: "Step 2", text: "Form teams or join existing ones", color: "bg-purple-200 border-purple-600" },
    { step: "Step 3", text: "48 hours of intensive building", color: "bg-green-200 border-green-600" },
    { step: "Step 4", text: "Present to judges and community", color: "bg-yellow-200 border-yellow-600" },
    { step: "Step 5", text: "Continue building post-event", color: "bg-pink-200 border-pink-600" }
  ],
  
  timeline: [
    { date: "July 15, 10:00 AM", event: "Opening ceremony & team formation", type: "start" },
    { date: "July 15, 12:00 PM", event: "Building period begins", type: "build" },
    { date: "July 16, 6:00 PM", event: "Mentor speed dating session", type: "support" },
    { date: "July 17, 12:00 PM", event: "Submission deadline", type: "deadline" },
    { date: "July 17, 2:00 PM", event: "Project presentations", type: "present" },
    { date: "July 17, 6:00 PM", event: "Awards ceremony", type: "end" }
  ],
  
  judging: {
    process: "Projects evaluated by expert panel in two rounds",
    judges: [
      { name: "Dr. Sarah Chen", role: "AI Research Director, TechCorp", bio: "Leading AI researcher with 10+ years in machine learning" },
      { name: "Rahul Kumar", role: "Founder, StartupXYZ", bio: "Serial entrepreneur, 3 successful exits in fintech" },
      { name: "Maya Patel", role: "Design Lead, BigTech", bio: "Award-winning product designer, ex-Google, ex-Airbnb" }
    ],
    criteria: [
      { name: "Innovation", weight: "30%", description: "Uniqueness and creativity of the solution" },
      { name: "Technical Implementation", weight: "25%", description: "Quality of code and technical execution" },
      { name: "Impact Potential", weight: "20%", description: "Real-world applicability and scalability" },
      { name: "Presentation", weight: "15%", description: "Clarity of communication and demo quality" },
      { name: "Team Collaboration", weight: "10%", description: "Evidence of effective teamwork" }
    ]
  },
  
  prizes: [
    { place: "🥇", title: "Grand Prize Winner", prize: "$5,000 + Mentorship package", color: "bg-yellow-200 border-yellow-600" },
    { place: "🥈", title: "Second Place", prize: "$3,000 + API credits bundle", color: "bg-gray-200 border-gray-600" },
    { place: "🥉", title: "Third Place", prize: "$2,000 + Co-working space access", color: "bg-orange-200 border-orange-600" },
    { place: "🏆", title: "Best Technical Innovation", prize: "$1,500 + Developer tools", color: "bg-blue-200 border-blue-600" },
    { place: "🎨", title: "Best Design & UX", prize: "$1,500 + Design software licenses", color: "bg-purple-200 border-purple-600" },
    { place: "🌍", title: "Most Impactful Solution", prize: "$1,000 + NGO partnership opportunity", color: "bg-green-200 border-green-600" }
  ],
  
  submissionGuidelines: {
    required: [
      "Working prototype or detailed mockup",
      "2-minute demo video",
      "Technical documentation (README)",
      "Pitch deck (max 10 slides)"
    ],
    optional: [
      "Live demo during presentations",
      "User testing results or feedback",
      "Future roadmap and business model",
      "Open source repository"
    ]
  },
  
  tracks: [
    { name: "AI & Machine Learning", description: "Harness the power of artificial intelligence", icon: "🤖" },
    { name: "Climate Tech", description: "Build solutions for environmental challenges", icon: "🌱" },
    { name: "FinTech & Future Commerce", description: "Reimagine financial services and e-commerce", icon: "💳" },
    { name: "Social Impact & Education", description: "Create positive change in communities", icon: "📚" }
  ],
  
  mentorsAndSpeakers: [
    { name: "Alex Thompson", role: "Senior Engineer, Meta", speciality: "Full-stack development", image: null },
    { name: "Priya Sharma", role: "Product Manager, Stripe", speciality: "Product strategy", image: null },
    { name: "David Kim", role: "ML Engineer, DeepMind", speciality: "Machine learning", image: null }
  ],
  
  resources: [
    { name: "AWS Credits", value: "$100 per team", provider: "Amazon" },
    { name: "OpenAI API Access", value: "Premium tier", provider: "OpenAI" },
    { name: "Figma Pro", value: "6 months free", provider: "Figma" },
    { name: "GitHub Copilot", value: "Free during event", provider: "GitHub" }
  ],
  
  partners: [
    { name: "TechCorp", logo: null, tier: "Title Sponsor" },
    { name: "StartupHub", logo: null, tier: "Gold Sponsor" },
    { name: "DevTools Inc", logo: null, tier: "Technology Partner" }
  ],
  
  faqs: [
    { q: "Do I need to have a team before registering?", a: "No! You can register individually and form teams during the event, or you can register as a pre-formed team." },
    { q: "What if I'm a beginner programmer?", a: "This hackathon welcomes all skill levels! We'll have mentors available and workshops for beginners." },
    { q: "Are there any restrictions on what we can build?", a: "Projects should be original work created during the event. You can use existing frameworks, APIs, and tools." },
    { q: "Will food and accommodation be provided?", a: "Meals will be provided throughout the event. Accommodation is not provided, but we can help you find nearby options." }
  ],
  
  community: {
    discord: "Join 500+ builders in our Discord",
    socialUpdates: "Follow @DemoHack on Twitter for live updates",
    hashtag: "#DemoFutureHack2025"
  }
};

// Collapsible section component
const CollapsibleSection = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between p-6 h-auto text-left bg-amber-100 hover:bg-amber-200 border-3 border-amber-700 rounded-lg mb-4 font-bold text-lg text-amber-900"
          style={{ fontFamily: 'Arial, sans-serif' }}
          data-testid={`button-toggle-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <span>{title}</span>
          {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mb-8">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

const DemoHackathon1 = () => {
  const [floatingElements, setFloatingElements] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);

  useEffect(() => {
    // Generate floating tech elements
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: 20 + Math.random() * 15
    }));
    setFloatingElements(elements);
  }, []);

  return (
    <>
      <SEO
        title={`${hackathonData.title} - ${hackathonData.subtitle} | ${hackathonData.dates.start}`}
        description={hackathonData.tagline}
        keywords="hackathon, demo, future tech, ai, climate tech, fintech, social impact"
        canonicalUrl="https://maximally.in/events/demo-hackathon1"
      />
      
      {/* Main Container with Tech-Future Background */}
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          background: `
            linear-gradient(135deg, 
              #1e3a8a 0%, 
              #3b82f6 25%, 
              #60a5fa 50%, 
              #93c5fd 75%, 
              #dbeafe 100%
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
                rgba(59, 130, 246, 0.1) 2px,
                rgba(59, 130, 246, 0.1) 4px
              )
            `
          }}
        />

        {/* Floating Tech Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingElements.map((element) => (
            <div
              key={element.id}
              className="absolute animate-float"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                animationDelay: `${element.delay}s`,
                animationDuration: '6s'
              }}
            >
              <svg width={element.size} height={element.size} viewBox="0 0 24 24" className="text-blue-600 opacity-70">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill="currentColor"
                />
              </svg>
            </div>
          ))}
        </div>

        {/* Hero Section */}
        <section className="relative z-20 min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="text-center max-w-6xl mx-auto">
            {/* Distinction Badge */}
            <div 
              className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold text-lg mb-6 shadow-lg transform -rotate-1"
              style={{ 
                fontFamily: 'Arial, sans-serif',
                border: '3px solid #f59e0b'
              }}
              data-testid="badge-distinction"
            >
              <Star className="w-5 h-5 fill-current" />
              {hackathonData.distinctionBadge}
            </div>

            {/* Main Title */}
            <h1 className="mb-6">
              <span 
                className="block text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4"
                style={{
                  fontFamily: 'Georgia, Times New Roman, serif',
                  textShadow: `
                    3px 3px 0px #1e3a8a,
                    6px 6px 0px rgba(30, 58, 138, 0.8),
                    9px 9px 0px rgba(30, 58, 138, 0.6),
                    12px 12px 0px rgba(30, 58, 138, 0.4)
                  `,
                  transform: 'rotate(-1deg)'
                }}
              >
                {hackathonData.title}
              </span>
              <span 
                className="block text-3xl md:text-5xl lg:text-6xl font-bold text-blue-200"
                style={{
                  fontFamily: 'Georgia, Times New Roman, serif',
                  textShadow: `
                    2px 2px 0px #3b82f6,
                    4px 4px 0px rgba(59, 130, 246, 0.8)
                  `,
                  transform: 'rotate(1deg)'
                }}
              >
                {hackathonData.subtitle}
              </span>
            </h1>

            {/* Event Badge */}
            <div 
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-6 py-3 rounded-lg font-bold text-lg mb-6 shadow-lg transform rotate-1"
              style={{ 
                fontFamily: 'Arial, sans-serif',
                border: '3px solid #1e40af'
              }}
              data-testid="badge-event-info"
            >
              <Calendar className="w-5 h-5" />
              {hackathonData.dates.start} – {hackathonData.dates.end} · {hackathonData.mode} · {hackathonData.duration}
            </div>

            {/* Subtitle */}
            <h2 className="text-2xl md:text-4xl font-bold text-blue-100 mb-4 transform -rotate-1" style={{ fontFamily: 'Georgia, serif' }}>
              {hackathonData.tagline}
            </h2>

            {/* Links Row */}
            <div className="flex flex-wrap gap-3 justify-center mb-8 mt-8">
              {hackathonData.links.register && (
                <Button 
                  asChild 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 text-sm rounded-lg transform hover:scale-105 transition-all shadow-lg border-2 border-green-800"
                  data-testid="link-register"
                >
                  <a href={hackathonData.links.register} target="_blank" rel="noopener noreferrer">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    Register
                  </a>
                </Button>
              )}
              {hackathonData.links.devpost && (
                <Button 
                  asChild 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 text-sm rounded-lg transform hover:scale-105 transition-all shadow-lg border-2 border-blue-800"
                  data-testid="link-devpost"
                >
                  <a href={hackathonData.links.devpost} target="_blank" rel="noopener noreferrer">
                    <Code className="w-4 h-4 mr-1" />
                    Devpost
                  </a>
                </Button>
              )}
              {hackathonData.links.discord && (
                <Button 
                  asChild 
                  size="sm" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 text-sm rounded-lg transform hover:scale-105 transition-all shadow-lg border-2 border-indigo-800"
                  data-testid="link-discord"
                >
                  <a href={hackathonData.links.discord} target="_blank" rel="noopener noreferrer">
                    <Users className="w-4 h-4 mr-1" />
                    Discord
                  </a>
                </Button>
              )}
              {hackathonData.links.whatsapp && (
                <Button 
                  asChild 
                  size="sm" 
                  className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 text-sm rounded-lg transform hover:scale-105 transition-all shadow-lg border-2 border-green-700"
                  data-testid="link-whatsapp"
                >
                  <a href={hackathonData.links.whatsapp} target="_blank" rel="noopener noreferrer">
                    <Heart className="w-4 h-4 mr-1" />
                    WhatsApp
                  </a>
                </Button>
              )}
              {hackathonData.links.infoDeck && (
                <Button 
                  asChild 
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 text-sm rounded-lg transform hover:scale-105 transition-all shadow-lg border-2 border-purple-800"
                  data-testid="link-info-deck"
                >
                  <a href={hackathonData.links.infoDeck} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Info Deck
                  </a>
                </Button>
              )}
              {hackathonData.links.instagram && (
                <Button 
                  asChild 
                  size="sm" 
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2 text-sm rounded-lg transform hover:scale-105 transition-all shadow-lg border-2 border-pink-800"
                  data-testid="link-instagram"
                >
                  <a href={hackathonData.links.instagram} target="_blank" rel="noopener noreferrer">
                    <Coffee className="w-4 h-4 mr-1" />
                    Instagram
                  </a>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="relative z-20 py-16 px-6" style={{ backgroundColor: '#dbeafe' }}>
          <div className="max-w-6xl mx-auto">
            
            {/* About Section */}
            {hackathonData.about && (
              <CollapsibleSection title="About the Event" defaultOpen={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    className="bg-white p-6 rounded-lg shadow-lg transform -rotate-1 border-3 border-blue-600"
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  >
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Theme: {hackathonData.about.theme}</h3>
                    <p className="text-lg text-blue-800 leading-relaxed font-semibold mb-4">
                      {hackathonData.about.description}
                    </p>
                    <p className="text-base text-blue-700 italic">
                      Vibe: {hackathonData.about.vibe}
                    </p>
                  </div>
                  
                  <div 
                    className="bg-blue-100 p-6 rounded-lg shadow-lg transform rotate-1 border-3 border-blue-700"
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  >
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Rules:</h3>
                    <ul className="text-lg text-blue-800 space-y-2 font-semibold">
                      {hackathonData.about.rules.map((rule, index) => (
                        <li key={index}>• {rule}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {/* Event Facts */}
            {hackathonData.facts && (
              <CollapsibleSection title="Event Facts">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(hackathonData.facts).map(([key, value], index) => (
                    <div 
                      key={key}
                      className="bg-blue-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all border-3 border-blue-600"
                      style={{ fontFamily: 'Arial, sans-serif' }}
                      data-testid={`fact-${key}`}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-900 mb-2">{value}</div>
                        <p className="text-lg font-semibold text-blue-800 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Who Should Join */}
            {hackathonData.whoShouldJoin && hackathonData.whoShouldJoin.length > 0 && (
              <CollapsibleSection title="Who Should Join">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hackathonData.whoShouldJoin.map((group, index) => (
                    <div 
                      key={index} 
                      className={`${group.color} p-6 rounded-lg shadow-lg transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} border-3`}
                      style={{ fontFamily: 'Arial, sans-serif' }}
                      data-testid={`who-join-${index}`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">{group.icon}</div>
                        <p className="text-gray-800 font-bold text-lg">{group.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* How It Works */}
            {hackathonData.howItWorks && hackathonData.howItWorks.length > 0 && (
              <CollapsibleSection title="How It Works">
                <div className="space-y-6">
                  {hackathonData.howItWorks.map((item, index) => (
                    <div 
                      key={index} 
                      className={`${item.color} p-6 rounded-lg shadow-lg transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} border-3`}
                      style={{ fontFamily: 'Arial, sans-serif' }}
                      data-testid={`how-works-${index}`}
                    >
                      <div className="flex items-center gap-6">
                        <div className="text-2xl font-bold text-gray-800 min-w-fit">{item.step}:</div>
                        <div className="text-lg font-bold text-gray-800">{item.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Timeline */}
            {hackathonData.timeline && hackathonData.timeline.length > 0 && (
              <CollapsibleSection title="Timeline">
                <div className="space-y-4">
                  {hackathonData.timeline.map((item, index) => (
                    <div 
                      key={index}
                      className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all border-3 border-blue-600"
                      style={{ fontFamily: 'Arial, sans-serif' }}
                      data-testid={`timeline-${index}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-bold text-blue-900 min-w-fit">{item.date}</div>
                        <div className="text-lg text-blue-800">{item.event}</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          item.type === 'start' ? 'bg-green-200 text-green-800' :
                          item.type === 'build' ? 'bg-blue-200 text-blue-800' :
                          item.type === 'support' ? 'bg-purple-200 text-purple-800' :
                          item.type === 'deadline' ? 'bg-red-200 text-red-800' :
                          item.type === 'present' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-gray-200 text-gray-800'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Judging */}
            {hackathonData.judging && (
              <CollapsibleSection title="Judging">
                <div className="space-y-6">
                  <div 
                    className="bg-white p-6 rounded-lg shadow-lg border-3 border-blue-600"
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  >
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Process</h3>
                    <p className="text-lg text-blue-800 font-semibold">{hackathonData.judging.process}</p>
                  </div>

                  {hackathonData.judging.judges && hackathonData.judging.judges.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold text-blue-900 mb-4">Judges</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {hackathonData.judging.judges.map((judge, index) => (
                          <div 
                            key={index}
                            className="bg-blue-100 p-4 rounded-lg shadow-lg border-3 border-blue-600"
                            style={{ fontFamily: 'Arial, sans-serif' }}
                            data-testid={`judge-${index}`}
                          >
                            <div className="font-bold text-lg text-blue-900">{judge.name}</div>
                            <div className="text-base text-blue-800 font-semibold">{judge.role}</div>
                            <div className="text-sm text-blue-700 mt-2">{judge.bio}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {hackathonData.judging.criteria && hackathonData.judging.criteria.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold text-blue-900 mb-4">Judging Criteria</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {hackathonData.judging.criteria.map((criterion, index) => (
                          <div 
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-lg border-3 border-blue-600 text-center"
                            style={{ fontFamily: 'Arial, sans-serif' }}
                            data-testid={`criteria-${index}`}
                          >
                            <div className="font-bold text-lg text-blue-900">{criterion.name}</div>
                            <div className="font-black text-xl text-blue-800">({criterion.weight})</div>
                            <div className="text-sm text-blue-700 mt-2">{criterion.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            )}

            {/* Prizes */}
            {hackathonData.prizes && hackathonData.prizes.length > 0 && (
              <CollapsibleSection title="Prizes">
                <div className="space-y-6">
                  {hackathonData.prizes.map((prize, index) => (
                    <div 
                      key={index} 
                      className={`${prize.color} p-6 rounded-lg shadow-lg transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} border-3`}
                      style={{ fontFamily: 'Arial, sans-serif' }}
                      data-testid={`prize-${index}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{prize.place}</div>
                        <div>
                          <div className="font-bold text-lg text-gray-800">{prize.title}</div>
                          <div className="font-semibold text-gray-700">{prize.prize}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Submission Guidelines */}
            {hackathonData.submissionGuidelines && (
              <CollapsibleSection title="Submission Guidelines">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    className="bg-white p-6 rounded-lg shadow-lg transform -rotate-1 border-3 border-green-600"
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  >
                    <h3 className="text-xl font-bold text-green-900 mb-4">Required</h3>
                    <ul className="text-lg text-green-800 space-y-2 font-semibold">
                      {hackathonData.submissionGuidelines.required.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div 
                    className="bg-green-100 p-6 rounded-lg shadow-lg transform rotate-1 border-3 border-green-700"
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  >
                    <h3 className="text-xl font-bold text-green-900 mb-4">Optional (Bonus Points)</h3>
                    <ul className="text-lg text-green-800 space-y-2 font-semibold">
                      {hackathonData.submissionGuidelines.optional.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {/* Tracks */}
            {hackathonData.tracks && hackathonData.tracks.length > 0 && (
              <CollapsibleSection title="Tracks & Themes">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hackathonData.tracks.map((track, index) => (
                    <div 
                      key={index}
                      className="bg-purple-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all border-3 border-purple-600"
                      style={{ fontFamily: 'Arial, sans-serif' }}
                      data-testid={`track-${index}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{track.icon}</div>
                        <div>
                          <div className="font-bold text-lg text-purple-900">{track.name}</div>
                          <div className="text-base text-purple-800">{track.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* FAQs */}
            {hackathonData.faqs && hackathonData.faqs.length > 0 && (
              <CollapsibleSection title="FAQs">
                <div className="space-y-4">
                  {hackathonData.faqs.map((faq, index) => (
                    <div 
                      key={index}
                      className="bg-white p-6 rounded-lg shadow-lg border-3 border-gray-600"
                      style={{ fontFamily: 'Arial, sans-serif' }}
                      data-testid={`faq-${index}`}
                    >
                      <h4 className="font-bold text-lg text-gray-900 mb-2">Q: {faq.q}</h4>
                      <p className="text-base text-gray-800">A: {faq.a}</p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

          </div>
        </section>

        {/* Footer Section */}
        <section className="relative z-20 py-16 px-6" style={{ backgroundColor: '#1e3a8a' }}>
          <div className="text-center">
            <div 
              className="bg-white text-blue-900 p-8 rounded-lg shadow-lg transform -rotate-2 inline-block border-4 border-blue-700"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <p className="text-2xl md:text-3xl font-bold">
                Ready to build the future?
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <span className="text-2xl">💻</span>
                <span className="text-2xl">🚀</span>
                <span className="text-2xl">🌟</span>
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
          75% { transform: translateY(-10px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default DemoHackathon1;