import { useEffect, useState } from "react";
import {
  ArrowRight,
  Users,
  Target,
  Trophy,
  Globe,
  Terminal,
  Github,
  Calendar,
  Zap,
  FileText,
  ExternalLink,
  Clock,
  MapPin,
  Flame,
  Sparkles,
  Rocket,
  Handshake,
  CheckCircle2,
  Star,
  Award,
  Lightbulb,
  Network,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";

import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { supabase, supabasePublic } from "@/lib/supabaseClient";

// Type definitions for hackathon data
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

const Index = () => {
  const [text, setText] = useState("");
  const fullText = "WE HOST HACKATHONS";
  const [floatingPixels, setFloatingPixels] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  useEffect(() => {
    // Generate floating pixels
    const pixels = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setFloatingPixels(pixels);

    // Typing effect
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

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
    const loadFeatured = async () => {
      // Loading featured hackathon (debug logs removed)

      if (!supabasePublic) {
        
        // Set a default featured hackathon
        setFeatured({
          title: "Maximally Hacktober",
          subtitle:
            "Build slow. Build loud. Finish strong. A month-long hackathon for builders who won't quit.",
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
        // Use direct fetch to bypass Supabase client issues
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Step 1: Fetching dashboard via direct fetch

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

        if (!dashboardResponse.ok) {
          throw new Error(
            `Dashboard fetch failed: ${dashboardResponse.status}`
          );
        }

        const dashboardData = await dashboardResponse.json();
        const dashboardRow = dashboardData?.[0];

  // Dashboard query result (debug logging removed)

        if (!dashboardRow || !dashboardRow.featured_hackathon_id) {
          console.error(
            "❌ Failed to load dashboard row for featured hackathon"
          );
          // Falling back to latest hackathon
          await loadLatestHackathon(); // Fallback to latest hackathon
          return;
        }

    // Dashboard loaded
        const rawId = dashboardRow.featured_hackathon_id;

        if (rawId === undefined || rawId === null || rawId === "") {
          
          await loadLatestHackathon(); // Fallback to latest hackathon
          return;
        }

        const featuredId = typeof rawId === "string" ? parseInt(rawId, 10) : Number(rawId);
        // Featured ID processed

        if (Number.isNaN(featuredId)) {
          
          await loadLatestHackathon(); // Fallback to latest hackathon
          return;
        }

        // Get the featured hackathon via direct fetch
  // Fetching hackathon by ID

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

  // Raw hackathon data (debug logging removed)

        const firstTag = Array.isArray(hack.focus_areas)
          ? String(hack.focus_areas[0] ?? "")
          : typeof hack.focus_areas === "object" && hack.focus_areas !== null
          ? String(Object.values(hack.focus_areas as any)[0] ?? "")
          : "";

        const processedFeatured = {
          title: hack.title ?? "FEATURED HACKATHON",
          subtitle: hack.subtitle ?? null,
          start_date: hack.start_date ?? null,
          end_date: hack.end_date ?? null,
          duration: hack.duration ?? null,
          location: hack.location ?? null,
          tag: firstTag || null,
          register_url:
            hack.devpost_register_url ?? hack.registration_url ?? null,
          details_url: hack.devpost_url ?? null,
        };

    // Processed featured object (logging removed)
    setFeatured(processedFeatured);
      } catch (error) {
        
        await loadLatestHackathon(); // Fallback to latest hackathon
      }
    };

    // Fallback function to load the latest hackathon
    const loadLatestHackathon = async () => {
      if (!supabasePublic) return;
      try {
        const { data: latestData, error: latestErr } = await supabasePublic
          .from("hackathons")
          .select(
            "id, title, subtitle, start_date, end_date, duration, location, focus_areas, devpost_url, devpost_register_url, registration_url"
          )
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1);
        const latestHack = latestData?.[0] as HackathonData | undefined; // Get first row from array

        if (!latestErr && latestHack) {
          const firstTag = Array.isArray(latestHack.focus_areas)
            ? String(latestHack.focus_areas[0] ?? "")
            : "";

          setFeatured({
            title: latestHack.title ?? "LATEST HACKATHON",
            subtitle: latestHack.subtitle ?? null,
            start_date: latestHack.start_date ?? null,
            end_date: latestHack.end_date ?? null,
            duration: latestHack.duration ?? null,
            location: latestHack.location ?? null,
            tag: firstTag || null,
            register_url:
              latestHack.devpost_register_url ??
              latestHack.registration_url ??
              null,
            details_url: latestHack.devpost_url ?? null,
          });
        }
      } catch (err) {
        console.error("Failed to load latest hackathon:", err);
      }
    };

    loadFeatured();
    const sb = supabase;
    if (!sb) return;
    const channel = sb
      .channel("realtime-featured-hackathon")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dashboard" },
        loadFeatured
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "hackathons" },
        loadFeatured
      )
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  }, []);

  const companies = [
    "OpenAI",
    "Meta",
    "Amazon",
    "Google",
    "DeepMind",
    "Intuit",
    "Visa",
    "Salesforce",
    "FedEx",
    "Atlassian",
    "McKinsey",
    "Replit",
    "General Motors",
    "Warner Bros. Discovery",
    "Oracle",
    "ADP",
    "Graphite Health",
    "Mercury Financial",
    "Y Combinator",
    "JustPaid.ai",
    "Zealy.io",
    "Fig",
    "MakeX",
    "DarinX",
  ];

  return (
    <>
      <SEO
        title="Maximally - World's First AI-Native Hackathon Platform"
        description="Built by hackers, for hackers. Not another DevPost clone. Join the global innovation league hosting high-stakes hackathons."
        keywords="hackathon platform, AI-native, hacker culture, Grand Indian Hackathon Season, developer tools"
        canonicalUrl="https://maximally.in"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Maximally",
          description:
            "World's first AI-native hackathon platform built by hackers, for hackers",
          url: "https://maximally.in",
        }}
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Pixel Grid Background */}
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Floating Pixels */}
        {floatingPixels.map((pixel) => (
          <div
            key={pixel.id}
            className="fixed w-2 h-2 bg-maximally-red pixel-border animate-float pointer-events-none"
            style={{
              left: `${pixel.x}%`,
              top: `${pixel.y}%`,
              animationDelay: `${pixel.delay}s`,
              animationDuration: `${4 + pixel.delay}s`,
            }}
          />
        ))}

        {/* Hero Section */}
        <section className="min-h-screen relative flex items-center pt-24 sm:pt-32 pb-12">
          <div className="container mx-auto px-4 sm:px-6 z-10">
            <div className="max-w-6xl mx-auto text-center">
              {/* Main Title */}
              <h1 className="font-press-start text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 minecraft-text leading-tight px-2">
                <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  {text}
                </span>
                <span className="inline-block w-0.5 h-5 xs:w-1 xs:h-6 sm:w-1.5 sm:h-8 md:w-2 md:h-12 lg:w-3 lg:h-16 xl:w-4 xl:h-20 bg-maximally-red ml-0.5 xs:ml-1 sm:ml-1.5 md:ml-2 lg:ml-3 xl:ml-4 animate-[cursor-blink_1s_infinite]" />
              </h1>

              <div className="text-xs xs:text-sm sm:text-lg md:text-xl lg:text-2xl font-press-start text-gray-300 mb-3 sm:mb-4 px-2">
                <span className="text-maximally-red">
                  but not the boring ones
                </span>{" "}
                ⚡
              </div>

              <p className="text-gray-400 text-xs xs:text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-jetbrains leading-relaxed mb-6 sm:mb-8 md:mb-12 px-4">
                A global innovation league that hosts high-stakes hackathons for
                ambitious builders. Built by hackers, for hackers.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 md:mb-16 px-4">
                <Link
                  to="/events"
                  className="pixel-button bg-maximally-red text-white group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-red h-11 xs:h-12 sm:h-14 md:h-16 px-5 xs:px-6 sm:px-8 font-press-start text-[10px] xs:text-xs sm:text-sm"
                >
                  <Terminal className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                  <span className="hidden xs:inline">EXPLORE_EVENTS</span>
                  <span className="xs:hidden">EVENTS</span>
                  <ArrowRight className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="https://discord.gg/MpBnYk8qMX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-button bg-maximally-yellow text-maximally-black group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-yellow h-11 xs:h-12 sm:h-14 md:h-16 px-5 xs:px-6 sm:px-8 font-press-start text-[10px] xs:text-xs sm:text-sm"
                >
                  <Users className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                  <span className="hidden xs:inline">JOIN_DISCORD</span>
                  <span className="xs:hidden">DISCORD</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted by Engineers Section */}
        <section className="py-16 relative bg-black border-y-2 border-maximally-red">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h3 className="font-press-start text-sm sm:text-base md:text-lg text-gray-400 mb-4">
                TRUSTED BY ENGINEERS FROM
              </h3>
            </div>

            {/* Marquee for all screen sizes */}
            <div className="overflow-hidden">
              <div className="flex animate-marquee hover:pause-marquee whitespace-nowrap">
                <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8 text-white font-press-start text-xs sm:text-sm">
                  {companies
                    .concat(companies) // Duplicate array for seamless loop
                    .map((company, index) => (
                      <span
                        key={index}
                        className="flex items-center space-x-4 sm:space-x-6 md:space-x-8"
                      >
                        <span className="hover:text-maximally-red transition-colors duration-300 whitespace-nowrap">
                          {company}
                        </span>
                        <span className="text-maximally-red">•</span>
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Hackathon Section */}
        <section className="py-12 sm:py-16 md:py-20 relative bg-gradient-to-b from-black via-red-950/10 to-black overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 bg-maximally-red/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-maximally-yellow/20 blur-3xl rounded-full animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-red-500/20 blur-3xl rounded-full animate-pulse delay-500" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Badge */}
              <div className="text-center mb-4 sm:mb-6 md:mb-8">
                <div className="minecraft-block bg-gradient-to-r from-maximally-red via-red-600 to-maximally-red text-white px-4 xs:px-6 py-2 xs:py-3 inline-block animate-[glow_2s_ease-in-out_infinite]">
                  <span className="font-press-start text-[10px] xs:text-xs sm:text-sm flex items-center gap-1.5 xs:gap-2">
                    <Flame className="h-3 w-3 xs:h-4 xs:w-4 animate-bounce" />
                    FEATURED EVENT
                    <Sparkles className="h-3 w-3 xs:h-4 xs:w-4 animate-spin-slow" />
                  </span>
                </div>
              </div>

              {/* Main Card */}
              <div className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 xs:border-4 border-maximally-red hover:border-maximally-yellow transition-all duration-500 p-4 xs:p-6 sm:p-8 md:p-12 relative group overflow-hidden">
                {/* Animated Border Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-maximally-red via-maximally-yellow to-maximally-red opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

                {/* Corner Decorations */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-maximally-yellow animate-pulse" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-maximally-yellow animate-pulse delay-200" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-maximally-yellow animate-pulse delay-400" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-maximally-yellow animate-pulse delay-600" />

                <div className="relative z-10">
                  {/* Event Title */}
                  <div className="text-center mb-4 xs:mb-6 sm:mb-8">
                    <div className="inline-block mb-3 xs:mb-4">
                      <div className="minecraft-block bg-maximally-yellow text-maximally-black px-3 xs:px-4 py-1.5 xs:py-2 text-3xl xs:text-4xl sm:text-5xl md:text-6xl mb-3 xs:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        ⚡
                      </div>
                    </div>
                    <h2 className="font-press-start text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 xs:mb-4 minecraft-text px-2">
                      <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:drop-shadow-[5px_5px_0px_rgba(255,215,0,0.5)] transition-all duration-300">
                        {featured?.title ?? "FEATURED HACKATHON"}
                      </span>
                    </h2>
                    <p className="font-press-start text-[10px] xs:text-xs sm:text-sm md:text-base text-maximally-yellow mb-3 xs:mb-4 px-2">
                      {featured?.tag
                        ? String(featured.tag).toUpperCase()
                        : featured?.duration
                        ? featured.duration.toUpperCase()
                        : "24-HOUR AI HACKATHON"}
                    </p>
                  </div>

                  {/* Event Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 mb-6 xs:mb-8">
                    <div className="pixel-card bg-black/50 border-2 border-maximally-red p-4 hover:scale-105 transition-transform duration-300 hover:border-maximally-yellow group/card">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="minecraft-block bg-maximally-red w-10 h-10 flex items-center justify-center group-hover/card:animate-bounce">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-press-start text-xs text-gray-400">
                          DATE
                        </span>
                      </div>
                      <p className="font-press-start text-sm text-white">
                        {(() => {
                          const s = featured?.start_date
                            ? new Date(featured.start_date)
                            : null;
                          const e = featured?.end_date
                            ? new Date(featured.end_date)
                            : null;
                          if (
                            !s ||
                            !e ||
                            isNaN(s.getTime()) ||
                            isNaN(e.getTime())
                          )
                            return "TBD";
                          const month = s
                            .toLocaleString("en-US", { month: "short" })
                            .toUpperCase();
                          const range =
                            s.getDate() === e.getDate()
                              ? `${s.getDate()}`
                              : `${s.getDate()}-${e.getDate()}`;
                          return `${month} ${range}`;
                        })()}
                      </p>
                      <p className="font-jetbrains text-xs text-gray-400 mt-1">
                        {(() => {
                          const s = featured?.start_date
                            ? new Date(featured.start_date)
                            : null;
                          if (!s || isNaN(s.getTime())) return "";
                          return s.getFullYear();
                        })()}
                      </p>
                    </div>

                    <div className="pixel-card bg-black/50 border-2 border-maximally-red p-4 hover:scale-105 transition-transform duration-300 hover:border-maximally-yellow group/card">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="minecraft-block bg-maximally-red w-10 h-10 flex items-center justify-center group-hover/card:animate-bounce">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-press-start text-xs text-gray-400">
                          DURATION
                        </span>
                      </div>
                      <p className="font-press-start text-sm text-white">
                        {(featured?.duration ?? "24 hours")
                          .toString()
                          .toUpperCase()}
                      </p>
                      <p className="font-jetbrains text-xs text-gray-400 mt-1">
                        Non-stop
                      </p>
                    </div>

                    <div className="pixel-card bg-black/50 border-2 border-maximally-red p-4 hover:scale-105 transition-transform duration-300 hover:border-maximally-yellow group/card">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="minecraft-block bg-maximally-red w-10 h-10 flex items-center justify-center group-hover/card:animate-bounce">
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-press-start text-xs text-gray-400">
                          MODE
                        </span>
                      </div>
                      <p className="font-press-start text-sm text-white">
                        {(featured?.location ?? "Online")
                          .toString()
                          .toUpperCase()}
                      </p>
                      <p className="font-jetbrains text-xs text-gray-400 mt-1">
                        Join anywhere
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6 xs:mb-8 text-center px-2">
                    <p className="font-jetbrains text-xs xs:text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                      {featured?.subtitle ??
                        "Build the next generation of AI applications in 24 hours."}
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center">
                    <Link
                      to={featured?.register_url ?? "/events"}
                      data-testid="button-featured-register"
                      className="pixel-button bg-maximally-red text-white group/btn flex items-center justify-center gap-2 hover:scale-105 xs:hover:scale-110 transform transition-all hover:shadow-glow-red h-12 xs:h-14 sm:h-16 px-6 xs:px-8 sm:px-10 font-press-start text-xs xs:text-sm sm:text-base relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-maximally-yellow opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300" />
                      <Zap className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 group-hover/btn:animate-pulse" />
                      <span className="hidden xs:inline">REGISTER_NOW</span>
                      <span className="xs:hidden">REGISTER</span>
                      <ArrowRight className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 group-hover/btn:translate-x-2 transition-transform" />
                    </Link>

                    <Link
                      to={featured?.details_url ?? "/events"}
                      data-testid="button-featured-details"
                      className="pixel-button bg-black border-2 border-maximally-red text-[#ffff] group/btn flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:bg-maximally-red hover:text-black h-12 xs:h-14 sm:h-16 px-6 xs:px-8 sm:px-10 font-press-start text-xs xs:text-sm sm:text-base"
                    >
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span>VIEW_DETAILS</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Partner Network Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse" />

          {/* Glowing Orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-1/4 w-40 h-40 bg-maximally-yellow/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-maximally-red/20 blur-3xl rounded-full animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-orange-500/15 blur-3xl rounded-full animate-pulse delay-300" />
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-maximally-yellow/40 pixel-border animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${4 + i}s`,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-16">
                <div className="minecraft-block bg-gradient-to-r from-maximally-yellow via-orange-500 to-maximally-yellow text-black px-8 py-4 inline-block mb-8 animate-[glow_2s_ease-in-out_infinite] shadow-lg shadow-maximally-yellow/50">
                  <span className="font-press-start text-sm sm:text-base flex items-center gap-3">
                    <Handshake className="h-5 w-5 animate-bounce" />
                    PARTNERSHIP PROGRAM
                    <Sparkles className="h-5 w-5 animate-spin-slow" />
                  </span>
                </div>

                <h2 className="font-press-start text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 minecraft-text">
                  <span className="text-maximally-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:drop-shadow-[6px_6px_0px_rgba(255,215,0,0.5)] transition-all duration-300">
                    HOST WITH MAXIMALLY
                  </span>
                </h2>

                <div className="max-w-4xl mx-auto mb-6">
                  <p className="text-gray-200 text-base sm:text-lg md:text-xl font-jetbrains leading-relaxed mb-4">
                    Co-organize, feature, or partner with Maximally to host your
                    hackathon —
                    <span className="text-maximally-yellow font-bold">
                      {" "}
                      and we'll support you every step of the way.
                    </span>
                  </p>
                  <div className="flex items-center justify-center gap-2 text-maximally-red">
                    <div className="h-px w-12 bg-maximally-red" />
                    <Sparkles className="h-4 w-4" />
                    <div className="h-px w-12 bg-maximally-red" />
                  </div>
                </div>

                <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-jetbrains">
                  Join{" "}
                  <span className="text-maximally-yellow font-bold">
                    hundreds
                  </span>{" "}
                  of student, startup, and community hackathons worldwide.
                </p>
              </div>

              {/* Benefits Grid - Enhanced */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div
                  className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-maximally-red p-8 hover:border-maximally-yellow transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-maximally-red/50 group relative overflow-hidden"
                  data-testid="partner-benefit-1"
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="minecraft-block bg-gradient-to-br from-blue-600 to-blue-800 w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-600/50 group-hover:animate-bounce">
                      <Globe className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-press-start text-sm sm:text-base text-maximally-red mb-4 text-center group-hover:text-maximally-yellow transition-colors">
                      GLOBAL NETWORK
                    </h3>
                    <p className="font-jetbrains text-sm text-gray-300 text-center mb-4 leading-relaxed">
                      Access to MFHOP, organizer events, and cross-promotion
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-xs font-jetbrains text-gray-400 group-hover:text-gray-300 transition-colors">
                        <CheckCircle2 className="h-4 w-4 text-maximally-yellow flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span>Federation membership</span>
                      </li>
                      <li className="flex items-start gap-3 text-xs font-jetbrains text-gray-400 group-hover:text-gray-300 transition-colors">
                        <CheckCircle2 className="h-4 w-4 text-maximally-yellow flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span>Community amplification</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div
                  className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-maximally-red p-8 hover:border-maximally-yellow transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-maximally-red/50 group relative overflow-hidden"
                  data-testid="partner-benefit-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="minecraft-block bg-gradient-to-br from-green-600 to-green-800 w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg shadow-green-600/50 group-hover:animate-bounce">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-press-start text-sm sm:text-base text-maximally-red mb-4 text-center group-hover:text-maximally-yellow transition-colors">
                      FULL SUPPORT
                    </h3>
                    <p className="font-jetbrains text-sm text-gray-300 text-center mb-4 leading-relaxed">
                      1-on-1 mentorship, playbooks, and dedicated assistance
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-xs font-jetbrains text-gray-400 group-hover:text-gray-300 transition-colors">
                        <CheckCircle2 className="h-4 w-4 text-maximally-yellow flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span>Organizer mentorship</span>
                      </li>
                      <li className="flex items-start gap-3 text-xs font-jetbrains text-gray-400 group-hover:text-gray-300 transition-colors">
                        <CheckCircle2 className="h-4 w-4 text-maximally-yellow flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span>Judging frameworks</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div
                  className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-maximally-red p-8 hover:border-maximally-yellow transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-maximally-red/50 group relative overflow-hidden"
                  data-testid="partner-benefit-3"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-maximally-yellow opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="minecraft-block bg-gradient-to-br from-purple-600 to-purple-800 w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg shadow-purple-600/50 group-hover:animate-bounce">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-press-start text-sm sm:text-base text-maximally-red mb-4 text-center group-hover:text-maximally-yellow transition-colors">
                      PRIZES & PERKS
                    </h3>
                    <p className="font-jetbrains text-sm text-gray-300 text-center mb-4 leading-relaxed">
                      Prize pools, swag kits, and software lab credits
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-xs font-jetbrains text-gray-400 group-hover:text-gray-300 transition-colors">
                        <CheckCircle2 className="h-4 w-4 text-maximally-yellow flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span>Maximally prize pool</span>
                      </li>
                      <li className="flex items-start gap-3 text-xs font-jetbrains text-gray-400 group-hover:text-gray-300 transition-colors">
                        <CheckCircle2 className="h-4 w-4 text-maximally-yellow flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span>Emergency budget support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Enhanced CTA */}
              <div className="text-center">
                <div className="pixel-card bg-gradient-to-r from-gray-900 via-black to-gray-900 border-2 border-maximally-yellow/50 p-8 mb-8 hover:border-maximally-yellow transition-all duration-300">
                  <p className="text-gray-300 text-base sm:text-lg font-jetbrains mb-2">
                    <span className="text-maximally-yellow font-bold">
                      250+ hackathons advised.
                    </span>{" "}
                    You're never doing it alone.
                  </p>
                  <p className="text-gray-400 text-sm font-jetbrains">
                    Whether you're a first-time organizer or returning host.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    to="/partner"
                    data-testid="button-partner-learn"
                    className="pixel-button bg-maximally-red text-white group flex items-center justify-center gap-3 hover:scale-110 transform transition-all hover:shadow-2xl hover:shadow-maximally-red/50 h-16 px-10 font-press-start text-sm sm:text-base relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-maximally-yellow opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    <Rocket className="h-6 w-6 group-hover:animate-bounce" />
                    <span>BECOME_A_PARTNER</span>
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Link>

                  <Link
                    to="/partner"
                    data-testid="button-partner-guide"
                    className="pixel-button bg-black border-2 border-maximally-red text-[#ffff] group/btn flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:bg-maximally-red hover:text-black h-14 sm:h-16 px-8 sm:px-10 font-press-start text-sm sm:text-base"
                  >
                    <FileText className="h-6 w-6 group-hover:animate-pulse" />
                    <span>VIEW_GUIDE</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* MFHOP Section */}
        <section className="py-20 relative bg-gradient-to-b from-gray-900 to-black">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="minecraft-block bg-gradient-to-r from-maximally-red to-red-700 text-white px-6 py-3 inline-block mb-6">
                  <span className="font-press-start text-sm">🤝 MFHOP</span>
                </div>
                <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 minecraft-text">
                  <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    MAXIMALLY FEDERATION
                  </span>
                </h2>
                <h3 className="font-press-start text-sm sm:text-base md:text-lg text-gray-300 mb-6">
                  OF HACKATHON ORGANIZERS AND PARTNERS
                </h3>
                <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-jetbrains leading-relaxed mb-8 px-4">
                  A global network of hackathon organizers working together to
                  grow reach, share sponsors, and strengthen events.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    title: "Cross-Promotion",
                    description:
                      "Share posts, newsletters, and reach new student bases.",
                    icon: <Globe className="h-6 w-6" />,
                    color: "bg-blue-600",
                  },
                  {
                    title: "Sponsors & Partnerships",
                    description:
                      "Exchange leads, pitch bigger packages together.",
                    icon: <Trophy className="h-6 w-6" />,
                    color: "bg-green-600",
                  },
                  {
                    title: "Judges & Mentors",
                    description:
                      "Tap into a shared circuit of experienced names.",
                    icon: <Users className="h-6 w-6" />,
                    color: "bg-purple-600",
                  },
                ].map((benefit, i) => (
                  <div
                    key={i}
                    className="pixel-card bg-black border-2 border-maximally-red p-6 hover:border-maximally-yellow transition-all duration-300 hover:scale-105"
                  >
                    <div
                      className={`minecraft-block ${benefit.color} w-12 h-12 mx-auto mb-4 flex items-center justify-center text-white`}
                    >
                      {benefit.icon}
                    </div>
                    <h4 className="font-press-start text-sm text-maximally-red mb-3 text-center">
                      {benefit.title.toUpperCase()}
                    </h4>
                    <p className="font-jetbrains text-gray-300 text-sm text-center">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div className="pixel-card bg-black border-2 border-maximally-red p-6 mb-8">
                  <p className="font-jetbrains text-gray-300 text-sm sm:text-base">
                    MFHOP is an initiative led by Maximally to bring hackathon
                    organizers out of silos.
                    <span className="text-maximally-red font-bold">
                      {" "}
                      Membership is free
                    </span>
                    , and open to any organizer who has hosted at least one
                    hackathon.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                  <Link
                    to="/mfhop"
                    className="pixel-button bg-maximally-red text-white group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-red h-12 px-6 font-press-start text-xs sm:text-sm"
                  >
                    <FileText className="h-4 w-4" />
                    <span>LEARN_MORE</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href="https://forms.gle/DcjBJx9uT5LMG8538"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pixel-button bg-maximally-yellow text-maximally-black group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-yellow h-12 px-6 font-press-start text-xs sm:text-sm"
                  >
                    <Users className="h-4 w-4" />
                    <span>APPLY_TO_JOIN</span>
                    <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Become a Judge Section */}
        <section className="py-20 relative bg-gradient-to-b from-black via-cyan-950/10 to-black overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 right-10 w-20 h-20 bg-cyan-600/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute bottom-20 left-20 w-32 h-32 bg-maximally-yellow/20 blur-3xl rounded-full animate-pulse delay-700" />
            <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-cyan-500/20 blur-3xl rounded-full animate-pulse delay-500" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-16">
                <div className="minecraft-block bg-gradient-to-r from-cyan-600 to-cyan-800 text-white px-6 py-3 inline-block mb-6 animate-[glow_2s_ease-in-out_infinite]">
                  <span className="font-press-start text-sm flex items-center gap-2 justify-center">
                    <Star className="h-4 w-4 animate-spin-slow" />
                    BECOME A JUDGE
                    <Award className="h-4 w-4 animate-bounce" />
                  </span>
                </div>
                <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 minecraft-text">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-maximally-yellow to-cyan-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    JOIN THE ELITE PANEL
                  </span>
                </h2>
                <h3 className="font-press-start text-sm sm:text-base md:text-lg text-gray-300 mb-6">
                  EVALUATE INNOVATION AT MAXIMALLY
                </h3>
                <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-jetbrains leading-relaxed mb-8 px-4">
                  The tech elite who evaluate innovation at Maximally hackathons. Industry legends from the world's top companies.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    title: "Elite Status",
                    description:
                      "Join industry legends from Meta, Google, Amazon, and top tech companies worldwide.",
                    icon: <Star className="h-6 w-6" />,
                    color: "bg-cyan-600",
                  },
                  {
                    title: "Discover Talent",
                    description:
                      "Get early access to exceptional builders for your team or company.",
                    icon: <Users className="h-6 w-6" />,
                    color: "bg-blue-600",
                  },
                  {
                    title: "Shape Innovation",
                    description:
                      "Guide the next generation of builders and evaluate cutting-edge projects.",
                    icon: <Lightbulb className="h-6 w-6" />,
                    color: "bg-yellow-600",
                  },
                  {
                    title: "Expand Network",
                    description:
                      "Connect with fellow tech elite and build relationships across the industry.",
                    icon: <Network className="h-6 w-6" />,
                    color: "bg-green-600",
                  },
                  {
                    title: "Flexible Commitment",
                    description:
                      "Choose events that match your schedule and expertise across 5 judge tiers.",
                    icon: <Clock className="h-6 w-6" />,
                    color: "bg-purple-600",
                  },
                  {
                    title: "Judge Perks",
                    description:
                      "Access exclusive lounges, premium swag, and VIP networking events.",
                    icon: <Award className="h-6 w-6" />,
                    color: "bg-red-600",
                  },
                ].map((benefit, i) => (
                  <div
                    key={i}
                    className="pixel-card bg-black border-2 border-cyan-600 p-6 hover:border-maximally-yellow transition-all duration-300 hover:scale-105 group"
                    data-testid={`benefit-card-${i}`}
                  >
                    <div
                      className={`minecraft-block ${benefit.color} w-12 h-12 mx-auto mb-4 flex items-center justify-center text-white group-hover:animate-bounce`}
                    >
                      {benefit.icon}
                    </div>
                    <h4 className="font-press-start text-sm text-cyan-400 mb-3 text-center group-hover:text-maximally-yellow transition-colors">
                      {benefit.title.toUpperCase()}
                    </h4>
                    <p className="font-jetbrains text-gray-300 text-sm text-center">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="text-center">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                  <Link
                    to="/people/judges"
                    className="pixel-button bg-cyan-600 text-white group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-purple h-12 px-6 font-press-start text-xs sm:text-sm hover:bg-cyan-700"
                    data-testid="button-view-judges"
                  >
                    <Users className="h-4 w-4" />
                    <span>MEET_THE_ELITE</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/judges"
                    className="pixel-button bg-maximally-yellow text-maximally-black group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-yellow h-12 px-6 font-press-start text-xs sm:text-sm"
                    data-testid="button-apply-judge"
                  >
                    <Star className="h-4 w-4" />
                    <span>APPLY_TO_JUDGE</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Index;
