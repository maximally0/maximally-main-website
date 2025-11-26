import { useEffect, useState } from "react";
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
  Network,
  Gift,
  Layers,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { supabase, supabasePublic } from "@/lib/supabaseClient";

interface HackathonData {
  id: number;
  title: string;
  subtitle?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  duration?: string | null;
  location?: string | null;
  focus_areas?: string[] | any;
  devpost_url?: string | null;
  devpost_register_url?: string | null;
  registration_url?: string | null;
}

const categories = [
  { icon: Code, title: "Hackathons", description: "Build, ship, win", color: "text-red-500", bgColor: "bg-red-500/10", borderColor: "border-red-500/30" },
  { icon: Rocket, title: "Startup Competitions", description: "Pitch your ideas", color: "text-orange-500", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30" },
  { icon: Brain, title: "AI & Tech Challenges", description: "Solve hard problems", color: "text-purple-500", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30" },
  { icon: Award, title: "Fellowships", description: "Get mentored", color: "text-blue-500", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30" },
  { icon: Zap, title: "Accelerators", description: "Scale your startup", color: "text-yellow-500", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30" },
  { icon: GraduationCap, title: "Bootcamps", description: "Level up skills", color: "text-green-500", bgColor: "bg-green-500/10", borderColor: "border-green-500/30" },
  { icon: DollarSign, title: "Grants & Funding", description: "Get backed", color: "text-emerald-500", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/30" },
  { icon: Briefcase, title: "Internships & Gigs", description: "Join startups", color: "text-cyan-500", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/30" },
  { icon: Wrench, title: "Workshops & Events", description: "Learn hands-on", color: "text-pink-500", bgColor: "bg-pink-500/10", borderColor: "border-pink-500/30" },
];

const filterChips = ["hackathons", "ai/tech", "fellowships", "accelerators", "funding", "gigs"];

const ecosystemItems = [
  { icon: Calendar, title: "Maximally Events", description: "High-stakes hackathons" },
  { icon: Users, title: "Maximally Community", description: "10,000+ builders" },
  { icon: Building, title: "Federation of Organizers", description: "100+ partner orgs" },
  { icon: Star, title: "Mentor & Judge Network", description: "Industry experts" },
  { icon: Target, title: "Micro-challenges", description: "Quick skill tests" },
  { icon: Gift, title: "Maximally Fund", description: "Builder grants" },
];

const trustedCompanies = [
  "Google", "Meta", "Microsoft", "McKinsey", "Replit", "Amazon", "Visa", "FedEx", "Atlassian", "Oracle", "Y Combinator"
];

const Index = () => {
  const [text, setText] = useState("");
  const fullText = "the opportunity platform for young builders";
  const [floatingPixels, setFloatingPixels] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [featured, setFeatured] = useState<{
    title: string;
    subtitle?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    duration?: string | null;
    location?: string | null;
    tag?: string | null;
    register_url?: string | null;
    details_url?: string | null;
  } | null>(null);

  useEffect(() => {
    const pixels = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setFloatingPixels(pixels);

    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadFeatured = async () => {
      if (!supabasePublic) {
        setFeatured({
          title: "Maximally Hacktober",
          subtitle: "Build slow. Build loud. Finish strong.",
          start_date: "Oct 1, 2025",
          end_date: "Oct 31, 2025",
          duration: "1 month",
          location: "Online",
          tag: "Ongoing",
          register_url: "https://maximallyhacktober.devpost.com/",
          details_url: "https://maximally.in/hacktober",
        });
        return;
      }

      try {
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

        const dashboardResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/dashboard?select=featured_hackathon_id&id=eq.1`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!dashboardResponse.ok) throw new Error("Dashboard fetch failed");

        const dashboardData = await dashboardResponse.json();
        const dashboardRow = dashboardData?.[0];

        if (!dashboardRow?.featured_hackathon_id) {
          await loadLatestHackathon();
          return;
        }

        const featuredId = typeof dashboardRow.featured_hackathon_id === "string" 
          ? parseInt(dashboardRow.featured_hackathon_id, 10) 
          : Number(dashboardRow.featured_hackathon_id);

        if (Number.isNaN(featuredId)) {
          await loadLatestHackathon();
          return;
        }

        const hackathonResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/hackathons?select=id,title,subtitle,start_date,end_date,duration,location,focus_areas,devpost_url,devpost_register_url,registration_url&id=eq.${featuredId}`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!hackathonResponse.ok) {
          await loadLatestHackathon();
          return;
        }

        const hackathonData = await hackathonResponse.json();
        const hack = hackathonData?.[0] as HackathonData | undefined;

        if (!hack) {
          await loadLatestHackathon();
          return;
        }

        const firstTag = Array.isArray(hack.focus_areas)
          ? String(hack.focus_areas[0] ?? "")
          : typeof hack.focus_areas === "object" && hack.focus_areas !== null
          ? String(Object.values(hack.focus_areas as any)[0] ?? "")
          : "";

        setFeatured({
          title: hack.title ?? "FEATURED HACKATHON",
          subtitle: hack.subtitle ?? null,
          start_date: hack.start_date ?? null,
          end_date: hack.end_date ?? null,
          duration: hack.duration ?? null,
          location: hack.location ?? null,
          tag: firstTag || null,
          register_url: hack.devpost_register_url ?? hack.registration_url ?? null,
          details_url: hack.devpost_url ?? null,
        });
      } catch (error) {
        await loadLatestHackathon();
      }
    };

    const loadLatestHackathon = async () => {
      if (!supabasePublic) return;
      try {
        const { data: latestData, error: latestErr } = await supabasePublic
          .from("hackathons")
          .select("id, title, subtitle, start_date, end_date, duration, location, focus_areas, devpost_url, devpost_register_url, registration_url")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1);
        const latestHack = latestData?.[0] as HackathonData | undefined;

        if (!latestErr && latestHack) {
          const firstTag = Array.isArray(latestHack.focus_areas) ? String(latestHack.focus_areas[0] ?? "") : "";
          setFeatured({
            title: latestHack.title ?? "LATEST HACKATHON",
            subtitle: latestHack.subtitle ?? null,
            start_date: latestHack.start_date ?? null,
            end_date: latestHack.end_date ?? null,
            duration: latestHack.duration ?? null,
            location: latestHack.location ?? null,
            tag: firstTag || null,
            register_url: latestHack.devpost_register_url ?? latestHack.registration_url ?? null,
            details_url: latestHack.devpost_url ?? null,
          });
        }
      } catch (err) {
        console.error("Failed to load latest hackathon:", err);
      }
    };

    loadFeatured();
  }, []);

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

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Grid */}
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Floating Pixels */}
        {floatingPixels.map((pixel) => (
          <div
            key={pixel.id}
            className="fixed w-1 h-1 bg-maximally-red/50 rounded-full animate-float pointer-events-none"
            style={{
              left: `${pixel.x}%`,
              top: `${pixel.y}%`,
              animationDelay: `${pixel.delay}s`,
              animationDuration: `${6 + pixel.delay}s`,
            }}
          />
        ))}

        {/* SECTION 1: HERO */}
        <section className="min-h-screen relative flex items-center justify-center pt-20 pb-20">
          <div className="container mx-auto px-4 sm:px-6 z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">{text}</span>
                <span className="inline-block w-0.5 h-8 sm:h-10 md:h-12 lg:h-14 bg-maximally-red ml-1 animate-[cursor-blink_1s_infinite]" />
              </h1>

              <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                discover hackathons, startup competitions, fellowships, accelerators, tech challenges, and more — curated for developers, creators, and founders.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/events" data-testid="button-explore-opportunities">
                  <Button size="lg" className="bg-maximally-red hover:bg-maximally-red/90 text-white px-8 py-6 text-base gap-2 w-full sm:w-auto">
                    <Terminal className="w-5 h-5" />
                    Explore opportunities
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/host-hackathon" data-testid="button-list-program">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-base w-full sm:w-auto">
                    List your program
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Floating category cards in background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            {["hackathon", "fellowship", "accelerator", "ai challenge"].map((label, i) => (
              <div
                key={label}
                className="absolute px-4 py-2 bg-white/5 border border-white/10 rounded-md text-xs text-gray-400"
                style={{
                  left: `${15 + i * 20}%`,
                  top: `${30 + (i % 2) * 25}%`,
                  transform: `rotate(${-5 + i * 3}deg)`,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: CATEGORY GRID */}
        <section className="py-20 md:py-28 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              explore by category
            </h2>
            <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
              Find the perfect opportunity for your journey
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
              {categories.map((cat, i) => (
                <Link
                  key={cat.title}
                  to={`/events?category=${cat.title.toLowerCase()}`}
                  data-testid={`card-category-${cat.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Card className={`group p-6 bg-black border ${cat.borderColor} hover:border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer`}>
                    <div className={`w-12 h-12 rounded-md ${cat.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <cat.icon className={`w-6 h-6 ${cat.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{cat.title}</h3>
                    <p className="text-sm text-gray-500">{cat.description}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: FEATURED OPPORTUNITIES */}
        <section className="py-20 relative bg-gradient-to-b from-black via-white/[0.02] to-black">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              trending opportunities this week
            </h2>
            <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
              Hot picks curated for ambitious builders
            </p>

            {/* Featured Card */}
            {featured && (
              <div className="max-w-3xl mx-auto">
                <Card className="p-8 bg-gradient-to-br from-maximally-red/10 to-transparent border border-maximally-red/30 hover:border-maximally-red/50 transition-all">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-16 h-16 bg-maximally-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-8 h-8 text-maximally-red" />
                    </div>
                    <div className="flex-1">
                      <Badge className="bg-maximally-red/20 text-maximally-red border-maximally-red/30 mb-3">
                        Featured
                      </Badge>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{featured.title}</h3>
                      {featured.subtitle && (
                        <p className="text-gray-400 mb-4">{featured.subtitle}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                        {featured.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {featured.duration}
                          </span>
                        )}
                        {featured.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {featured.location}
                          </span>
                        )}
                      </div>
                      {featured.register_url && (
                        <a href={featured.register_url} target="_blank" rel="noopener noreferrer" data-testid="button-featured-register">
                          <Button className="bg-maximally-red hover:bg-maximally-red/90 text-white gap-2">
                            Register Now
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 4: SEARCH + FILTER */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search opportunities..."
                  className="w-full pl-12 pr-4 py-6 bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-base"
                  data-testid="input-search"
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {filterChips.map((chip) => (
                  <Badge
                    key={chip}
                    variant="outline"
                    className="px-4 py-2 border-white/20 text-gray-400 hover:bg-white/5 hover:text-white cursor-pointer transition-colors"
                    data-testid={`filter-${chip}`}
                  >
                    {chip}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: WHY MAXIMALLY */}
        <section className="py-20 md:py-28 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              built for developers, founders, and creators
            </h2>
            <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
              Everything you need in one place
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              <Card className="p-8 bg-black border border-white/10 text-center">
                <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">discover everything in one place</h3>
                <p className="text-sm text-gray-500">all the best builder-focused opportunities curated for you.</p>
              </Card>

              <Card className="p-8 bg-black border border-white/10 text-center">
                <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">register once, apply everywhere</h3>
                <p className="text-sm text-gray-500">simple, clean, and fast — your applications saved in one dashboard.</p>
              </Card>

              <Card className="p-8 bg-black border border-white/10 text-center">
                <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Layers className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">run programs with zero setup</h3>
                <p className="text-sm text-gray-500">organizers get microsites, analytics, registration, and notifications.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* SECTION 6: ECOSYSTEM */}
        <section className="py-20 relative bg-gradient-to-b from-black via-white/[0.02] to-black">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              the maximally ecosystem
            </h2>
            <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
              More than just a listing site
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
              {ecosystemItems.map((item) => (
                <Card key={item.title} className="p-5 bg-black border border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon className="w-5 h-5 text-maximally-red" />
                    <h3 className="text-sm font-medium text-white">{item.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: TRUST INDICATORS */}
        <section className="py-16 relative border-y border-white/5">
          <div className="container mx-auto px-4 sm:px-6">
            <p className="text-center text-sm text-gray-500 mb-8">
              Trusted by mentors and judges from
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
              {trustedCompanies.map((company) => (
                <span key={company} className="text-gray-600 text-sm font-medium hover:text-gray-400 transition-colors">
                  {company}
                </span>
              ))}
            </div>
            <p className="text-center text-xs text-gray-600">
              Used by 100+ schools, colleges, clubs, and communities
            </p>
          </div>
        </section>

        {/* SECTION 8: DUAL CTA */}
        <section className="py-20 md:py-28 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <Card className="p-8 md:p-10 bg-gradient-to-br from-maximally-red/10 to-transparent border border-maximally-red/30">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">For Builders</h3>
                <p className="text-gray-400 mb-6">ready to find your next opportunity?</p>
                <Link to="/events" data-testid="button-browse-opportunities">
                  <Button className="bg-maximally-red hover:bg-maximally-red/90 text-white gap-2">
                    Browse opportunities
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Card>

              <Card className="p-8 md:p-10 bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">For Organizers</h3>
                <p className="text-gray-400 mb-2">host your hackathon, fellowship, or accelerator.</p>
                <p className="text-gray-500 text-sm mb-6">build a microsite in minutes.</p>
                <Link to="/host-hackathon" data-testid="button-list-your-program">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 gap-2">
                    List your program
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* SECTION 9: COMMUNITY CTA */}
        <section className="py-20 relative bg-gradient-to-b from-transparent via-maximally-red/5 to-transparent">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              join thousands of builders shaping the future
            </h2>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">
              discord + IRL meetups + micro challenges + mentorship + exclusive drops
            </p>
            <a href="https://discord.gg/MpBnYk8qMX" target="_blank" rel="noopener noreferrer" data-testid="button-join-community">
              <Button size="lg" className="bg-maximally-red hover:bg-maximally-red/90 text-white px-8 gap-2">
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
