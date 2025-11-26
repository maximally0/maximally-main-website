import { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  Users,
  Terminal,
  Calendar,
  Zap,
  ExternalLink,
  Clock,
  MapPin,
  Rocket,
  Trophy,
  Brain,
  GraduationCap,
  Briefcase,
  DollarSign,
  Wrench,
  Code,
  Target,
  Globe,
  Search,
  Sparkles,
  CheckCircle,
  Building,
  Heart,
  Star,
  Award,
  ChevronLeft,
  ChevronRight,
  Filter,
  TrendingUp,
  Timer,
  Flame,
  BarChart3,
  Layers,
  Gift,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const categories = [
  { icon: Code, title: "Hackathons", description: "Build, ship, win", count: 24 },
  { icon: Rocket, title: "Startup Competitions", description: "Pitch your ideas", count: 18 },
  { icon: Brain, title: "AI & Tech Challenges", description: "Solve hard problems", count: 12 },
  { icon: Award, title: "Fellowships", description: "Get mentored", count: 15 },
  { icon: Zap, title: "Accelerators", description: "Scale your startup", count: 8 },
  { icon: GraduationCap, title: "Bootcamps", description: "Level up skills", count: 22 },
  { icon: DollarSign, title: "Grants & Funding", description: "Get backed", count: 10 },
  { icon: Briefcase, title: "Internships & Gigs", description: "Join startups", count: 35 },
  { icon: Wrench, title: "Workshops & Events", description: "Learn hands-on", count: 28 },
];

const mockOpportunities = [
  {
    id: 1,
    title: "ETHGlobal Bangkok 2025",
    organizer: "ETHGlobal",
    category: "Hackathon",
    deadline: "Dec 15, 2025",
    prize: "$50,000",
    mode: "In-Person",
    location: "Bangkok, Thailand",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
    trending: true,
    closingSoon: false,
    popular: true,
  },
  {
    id: 2,
    title: "AI Builders Fellowship",
    organizer: "Anthropic",
    category: "Fellowship",
    deadline: "Jan 5, 2026",
    prize: "$10,000 stipend",
    mode: "Remote",
    location: "Global",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
    trending: true,
    closingSoon: false,
    popular: true,
  },
  {
    id: 3,
    title: "Web3 Startup Accelerator",
    organizer: "a]16z Crypto",
    category: "Accelerator",
    deadline: "Dec 20, 2025",
    prize: "$500K investment",
    mode: "Hybrid",
    location: "San Francisco",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop",
    trending: true,
    closingSoon: true,
    popular: false,
  },
  {
    id: 4,
    title: "Google Summer of Code",
    organizer: "Google",
    category: "Fellowship",
    deadline: "Mar 1, 2026",
    prize: "$3,000 - $6,600",
    mode: "Remote",
    location: "Global",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&h=200&fit=crop",
    trending: false,
    closingSoon: false,
    popular: true,
  },
  {
    id: 5,
    title: "HackMIT 2025",
    organizer: "MIT",
    category: "Hackathon",
    deadline: "Dec 1, 2025",
    prize: "$20,000",
    mode: "In-Person",
    location: "Cambridge, MA",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=200&fit=crop",
    trending: false,
    closingSoon: true,
    popular: true,
  },
  {
    id: 6,
    title: "Replit AI Bounty",
    organizer: "Replit",
    category: "AI Challenge",
    deadline: "Dec 31, 2025",
    prize: "$25,000",
    mode: "Remote",
    location: "Global",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop",
    trending: true,
    closingSoon: true,
    popular: false,
  },
  {
    id: 7,
    title: "Thiel Fellowship",
    organizer: "Thiel Foundation",
    category: "Fellowship",
    deadline: "Feb 15, 2026",
    prize: "$100,000 grant",
    mode: "In-Person",
    location: "San Francisco",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop",
    trending: false,
    closingSoon: false,
    popular: true,
  },
  {
    id: 8,
    title: "Y Combinator W26",
    organizer: "Y Combinator",
    category: "Accelerator",
    deadline: "Jan 10, 2026",
    prize: "$500K investment",
    mode: "In-Person",
    location: "San Francisco",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=200&fit=crop",
    trending: true,
    closingSoon: false,
    popular: true,
  },
  {
    id: 9,
    title: "MLH Global Hack Week",
    organizer: "MLH",
    category: "Hackathon",
    deadline: "Dec 8, 2025",
    prize: "Swag + Prizes",
    mode: "Remote",
    location: "Global",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=200&fit=crop",
    trending: false,
    closingSoon: true,
    popular: false,
  },
  {
    id: 10,
    title: "OpenAI Residency",
    organizer: "OpenAI",
    category: "Fellowship",
    deadline: "Apr 1, 2026",
    prize: "Full-time offer",
    mode: "In-Person",
    location: "San Francisco",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=200&fit=crop",
    trending: true,
    closingSoon: false,
    popular: true,
  },
];

const trustedCompanies = [
  "Google", "Meta", "Microsoft", "McKinsey", "Replit", "Amazon", "Visa", "FedEx", "Atlassian", "Y Combinator", "OpenAI"
];

const ecosystemItems = [
  { icon: Calendar, title: "Maximally Events", description: "High-stakes hackathons" },
  { icon: Users, title: "Community", description: "10,000+ builders" },
  { icon: Building, title: "Federation", description: "100+ partner orgs" },
  { icon: Star, title: "Mentor Network", description: "Industry experts" },
  { icon: Target, title: "Micro-challenges", description: "Quick skill tests" },
  { icon: Gift, title: "Maximally Fund", description: "Builder grants" },
];

const OpportunityCard = ({ opportunity }: { opportunity: typeof mockOpportunities[0] }) => (
  <Card className="min-w-[300px] md:min-w-[340px] bg-white border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer" data-testid={`card-opportunity-${opportunity.id}`}>
    <div className="relative h-36 overflow-hidden">
      <img 
        src={opportunity.image} 
        alt={opportunity.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <Badge className="absolute top-3 left-3 bg-red-500 text-white text-xs">
        {opportunity.category}
      </Badge>
    </div>
    <div className="p-4">
      <p className="text-xs text-gray-500 mb-1">{opportunity.organizer}</p>
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{opportunity.title}</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {opportunity.deadline}
        </span>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {opportunity.mode}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-red-600">{opportunity.prize}</span>
        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white text-xs h-8">
          Apply Now
        </Button>
      </div>
    </div>
  </Card>
);

const HorizontalCarousel = ({ title, icon: Icon, opportunities }: { title: string; icon: any; opportunities: typeof mockOpportunities }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 360;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Badge variant="secondary" className="bg-red-100 text-red-600 text-xs">
            {opportunities.length}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => scroll('left')} data-testid={`button-scroll-left-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => scroll('right')} data-testid={`button-scroll-right-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {opportunities.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
      </div>
    </div>
  );
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const trendingOpportunities = mockOpportunities.filter(o => o.trending);
  const closingSoonOpportunities = mockOpportunities.filter(o => o.closingSoon);
  const popularOpportunities = mockOpportunities.filter(o => o.popular);

  return (
    <>
      <SEO
        title="Maximally - The Opportunity Platform for Young Builders"
        description="Discover hackathons, startup competitions, fellowships, accelerators, tech challenges, and more. Curated for developers, creators, and founders."
        keywords="hackathons, fellowships, accelerators, startup competitions, tech challenges, young builders"
        canonicalUrl="https://maximally.in"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Maximally",
          description: "The opportunity platform for young builders",
          url: "https://maximally.in",
        }}
      />

      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* HERO SECTION */}
        <section className="bg-gradient-to-b from-white to-gray-50 pt-24 pb-16 md:pt-32 md:pb-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                the opportunity platform for{" "}
                <span className="text-red-500">young builders</span>
              </h1>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                find hackathons, accelerators, fellowships, competitions, gigs, and more — built for developers, founders, and creators.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/events" data-testid="button-explore-opportunities">
                  <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 gap-2">
                    <Terminal className="w-5 h-5" />
                    Explore opportunities
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/host-hackathon" data-testid="button-list-program">
                  <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 px-8">
                    List your program
                  </Button>
                </Link>
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search hackathons, fellowships, accelerators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-6 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 text-base rounded-xl shadow-sm"
                    data-testid="input-search"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY CHIPS */}
        <section className="py-6 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {categories.map((cat) => (
                <Badge 
                  key={cat.title}
                  variant="secondary" 
                  className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600 cursor-pointer transition-colors whitespace-nowrap"
                  data-testid={`chip-${cat.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {cat.title}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <p className="text-center text-sm text-gray-500 mb-4">Trusted by mentors and judges from</p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              {trustedCompanies.map((company) => (
                <span key={company} className="text-gray-400 text-sm font-medium">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORY GRID */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
              Explore by Category
            </h2>
            <p className="text-gray-500 text-center mb-10">Find the perfect opportunity for your journey</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {categories.map((cat) => (
                <Link
                  key={cat.title}
                  to={`/events?category=${cat.title.toLowerCase()}`}
                  data-testid={`card-category-${cat.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Card className="p-5 bg-white border border-gray-200 hover:border-red-300 hover:shadow-md transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <cat.icon className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900">{cat.title}</h3>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                            {cat.count}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{cat.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED OPPORTUNITIES */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
              Featured Opportunities
            </h2>
            <p className="text-gray-500 text-center mb-10">Curated picks for ambitious builders</p>
            
            <HorizontalCarousel 
              title="Trending Now" 
              icon={TrendingUp} 
              opportunities={trendingOpportunities} 
            />
            <HorizontalCarousel 
              title="Closing Soon" 
              icon={Timer} 
              opportunities={closingSoonOpportunities} 
            />
            <HorizontalCarousel 
              title="Popular This Week" 
              icon={Flame} 
              opportunities={popularOpportunities} 
            />
          </div>
        </section>

        {/* FILTER BAR */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">Explore All Opportunities</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select>
                <SelectTrigger className="w-[160px] bg-white" data-testid="filter-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hackathon">Hackathons</SelectItem>
                  <SelectItem value="fellowship">Fellowships</SelectItem>
                  <SelectItem value="accelerator">Accelerators</SelectItem>
                  <SelectItem value="bootcamp">Bootcamps</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[160px] bg-white" data-testid="filter-difficulty">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[160px] bg-white" data-testid="filter-prize">
                  <SelectValue placeholder="Prize" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1k">Under $1,000</SelectItem>
                  <SelectItem value="1k-10k">$1,000 - $10,000</SelectItem>
                  <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                  <SelectItem value="over-50k">Over $50,000</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[160px] bg-white" data-testid="filter-mode">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* WHY MAXIMALLY */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
              Why Maximally?
            </h2>
            <p className="text-gray-500 text-center mb-10">Built for developers, founders, and creators</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="p-6 bg-gray-50 border-0 text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Discover in One Place</h3>
                <p className="text-sm text-gray-500">All the best builder-focused opportunities curated for you.</p>
              </Card>

              <Card className="p-6 bg-gray-50 border-0 text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Register Once, Apply Everywhere</h3>
                <p className="text-sm text-gray-500">Simple, clean, and fast — your applications saved in one dashboard.</p>
              </Card>

              <Card className="p-6 bg-gray-50 border-0 text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Run Programs with Zero Setup</h3>
                <p className="text-sm text-gray-500">Organizers get microsites, analytics, registration, and notifications.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* ECOSYSTEM */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
              The Maximally Ecosystem
            </h2>
            <p className="text-gray-500 text-center mb-10">More than just a listing site</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {ecosystemItems.map((item) => (
                <Card key={item.title} className="p-4 bg-white border border-gray-200 hover:border-red-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FOR ORGANIZERS */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
              For Organizers
            </h2>
            <p className="text-gray-500 text-center mb-10">Everything you need to run world-class programs</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="p-6 bg-gradient-to-br from-red-50 to-white border border-red-100">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Building className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Your Microsite</h3>
                <p className="text-sm text-gray-500 mb-4">Create a beautiful landing page for your hackathon, fellowship, or accelerator in minutes.</p>
                <Link to="/host-hackathon" data-testid="button-build-microsite">
                  <Button className="bg-red-500 hover:bg-red-600 text-white gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Registrations</h3>
                <p className="text-sm text-gray-500 mb-4">Track signups, send notifications, and get analytics — all in one dashboard.</p>
                <Link to="/host-hackathon" data-testid="button-manage-registrations">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 gap-2">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* DUAL CTA */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="p-8 bg-red-500 border-0 text-white">
                <h3 className="text-xl font-bold mb-2">For Builders</h3>
                <p className="text-red-100 mb-6">Ready to find your next opportunity?</p>
                <Link to="/events" data-testid="button-browse-opportunities">
                  <Button className="bg-white text-red-500 hover:bg-red-50 gap-2">
                    Browse opportunities
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Card>

              <Card className="p-8 bg-white border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">For Organizers</h3>
                <p className="text-gray-500 mb-6">Host your hackathon, fellowship, or accelerator.</p>
                <Link to="/host-hackathon" data-testid="button-list-your-program">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 gap-2">
                    List your program
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* COMMUNITY CTA */}
        <section className="py-16 bg-gradient-to-b from-white to-red-50">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Join thousands of builders shaping the future
            </h2>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">
              Discord + IRL meetups + micro challenges + mentorship + exclusive drops
            </p>
            <a href="https://discord.gg/MpBnYk8qMX" target="_blank" rel="noopener noreferrer" data-testid="button-join-community">
              <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 gap-2">
                <Users className="w-5 h-5" />
                Join the community
              </Button>
            </a>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Index;
