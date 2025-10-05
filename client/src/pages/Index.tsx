import { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { Link } from 'react-router-dom';

import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { supabase } from '@/lib/supabaseClient';

const Index = () => {
  const [text, setText] = useState('');
  const fullText = 'WE HOST HACKATHONS';
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
      if (!supabase) return;
      const { data: dashboardRow, error: dashErr } = await supabase
        .from('dashboard')
        .select('featured_hackathon_id')
        .eq('id', 1)
        .single();
      if (dashErr || !dashboardRow) {
        console.error('Failed to load dashboard row for featured hackathon', dashErr);
        return;
      }

      const rawId =
        (dashboardRow as any).featured_hackathon_id
      if (rawId === undefined || rawId === null || rawId === '') {
        console.warn('No featured hackathon id found on dashboard row');
        return;
      }
      const featuredId = typeof rawId === 'string' ? parseInt(rawId, 10) : Number(rawId);
      if (Number.isNaN(featuredId)) {
        console.warn('Featured hackathon id is not a valid number:', rawId);
        return;
      }

      const { data: hack, error: hackErr } = await supabase
        .from('hackathons')
        .select('id, title, subtitle, start_date, end_date, duration, location, focus_areas, devpost_url, devpost_register_url, registration_url')
        .eq('id', featuredId)
        .single();
      if (hackErr || !hack) {
        console.error('Failed to load hackathon by featured id', { featuredId, error: hackErr });
        return;
      }

      const firstTag = Array.isArray(hack.focus_areas)
        ? String(hack.focus_areas[0] ?? '')
        : (typeof hack.focus_areas === 'object' && hack.focus_areas !== null)
          ? String(Object.values(hack.focus_areas as any)[0] ?? '')
          : '';
      console.log("Fetched hackathon:", hack);
      setFeatured({
        title: hack.title ?? 'FEATURED HACKATHON',
        subtitle: hack.subtitle ?? null,
        start_date: hack.start_date ?? null,
        end_date: hack.end_date ?? null,
        duration: hack.duration ?? null,
        location: hack.location ?? null,
        tag: firstTag || null,
        register_url: hack.devpost_register_url ?? hack.registration_url ?? null,
        details_url: hack.devpost_url ?? null,
      });
    };

    loadFeatured();
    const sb = supabase;
    if (!sb) return;
    const channel = sb
      .channel('realtime-featured-hackathon')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dashboard' }, loadFeatured)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hackathons' }, loadFeatured)
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  }, []);

  const companies = [
    'OpenAI',
    'Meta',
    'Amazon',
    'Google',
    'DeepMind',
    'Intuit',
    'Visa',
    'Salesforce',
    'FedEx',
    'Atlassian',
    'McKinsey',
    'Replit',
    'General Motors',
    'Warner Bros. Discovery',
    'Oracle',
    'ADP',
    'Graphite Health',
    'Mercury Financial',
    'Y Combinator',
    'JustPaid.ai',
    'Zealy.io',
    'Fig',
    'MakeX',
    'DarinX',
  ];

  return (
    <>
      <SEO
        title="Maximally - World's First AI-Native Hackathon Platform"
        description="Built by hackers, for hackers. Not another DevPost clone. Join the global innovation league hosting high-stakes hackathons."
        keywords="hackathon platform, AI-native, hacker culture, Grand Indian Hackathon Season, developer tools"
        canonicalUrl="https://maximally.in"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Maximally',
          description:
            "World's first AI-native hackathon platform built by hackers, for hackers",
          url: 'https://maximally.in',
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
        <section className="min-h-screen relative flex items-center pt-32">
          <div className="container mx-auto px-4 z-10">
            <div className="max-w-6xl mx-auto text-center">
              {/* Main Title */}
              <h1 className="font-press-start text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-bold mb-6 minecraft-text leading-tight">
                <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  {text}
                </span>
                <span className="inline-block w-1 h-6 sm:w-1.5 sm:h-8 md:w-2 md:h-12 lg:w-3 lg:h-16 xl:w-4 xl:h-20 bg-maximally-red ml-1 sm:ml-1.5 md:ml-2 lg:ml-3 xl:ml-4 animate-[cursor-blink_1s_infinite]" />
              </h1>

              <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-press-start text-gray-300 mb-4 px-2">
                <span className="text-maximally-red">
                  but not the boring ones
                </span>{' '}
                ⚡
              </div>

              <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-jetbrains leading-relaxed mb-8 sm:mb-12 px-4">
                A global innovation league that hosts high-stakes hackathons for
                ambitious builders. Built by hackers, for hackers.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
                <Link
                  to="/events"
                  className="pixel-button bg-maximally-red text-white group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-red h-12 sm:h-16 px-6 sm:px-8 font-press-start text-xs sm:text-sm"
                >
                  <Terminal className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">EXPLORE_EVENTS</span>
                  <span className="sm:hidden">EVENTS</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="https://discord.gg/MpBnYk8qMX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-button bg-maximally-yellow text-maximally-black group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-yellow h-12 sm:h-16 px-6 sm:px-8 font-press-start text-xs sm:text-sm"
                >
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">JOIN_DISCORD</span>
                  <span className="sm:hidden">DISCORD</span>
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
        <section className="py-20 relative bg-gradient-to-b from-black via-red-950/10 to-black overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 bg-maximally-red/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-maximally-yellow/20 blur-3xl rounded-full animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-red-500/20 blur-3xl rounded-full animate-pulse delay-500" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Badge */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="minecraft-block bg-gradient-to-r from-maximally-red via-red-600 to-maximally-red text-white px-6 py-3 inline-block animate-[glow_2s_ease-in-out_infinite]">
                  <span className="font-press-start text-xs sm:text-sm flex items-center gap-2">
                    <Flame className="h-4 w-4 animate-bounce" />
                    FEATURED EVENT
                    <Sparkles className="h-4 w-4 animate-spin-slow" />
                  </span>
                </div>
              </div>

              {/* Main Card */}
              <div className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-maximally-red hover:border-maximally-yellow transition-all duration-500 p-6 sm:p-8 md:p-12 relative group overflow-hidden">
                {/* Animated Border Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-maximally-red via-maximally-yellow to-maximally-red opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                
                {/* Corner Decorations */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-maximally-yellow animate-pulse" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-maximally-yellow animate-pulse delay-200" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-maximally-yellow animate-pulse delay-400" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-maximally-yellow animate-pulse delay-600" />

                <div className="relative z-10">
                  {/* Event Title */}
                  <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-block mb-4">
                      <div className="minecraft-block bg-maximally-yellow text-maximally-black px-4 py-2 text-4xl sm:text-5xl md:text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        ⚡
                      </div>
                    </div>
                    <h2 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 minecraft-text">
                      <span className="text-maximally-red drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:drop-shadow-[5px_5px_0px_rgba(255,215,0,0.5)] transition-all duration-300">
                        {featured?.title ?? 'FEATURED HACKATHON'}
                      </span>
                    </h2>
                    <p className="font-press-start text-xs sm:text-sm md:text-base text-maximally-yellow mb-4">
                      {featured?.tag ? String(featured.tag).toUpperCase() : (featured?.duration ? featured.duration.toUpperCase() : '24-HOUR AI HACKATHON')}
                    </p>
                  </div>

                  {/* Event Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
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
                          const s = featured?.start_date ? new Date(featured.start_date) : null;
                          const e = featured?.end_date ? new Date(featured.end_date) : null;
                          if (!s || !e || isNaN(s.getTime()) || isNaN(e.getTime())) return 'TBD';
                          const month = s.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                          const range = s.getDate() === e.getDate() ? `${s.getDate()}` : `${s.getDate()}-${e.getDate()}`;
                          return `${month} ${range}`;
                        })()}
                      </p>
                      <p className="font-jetbrains text-xs text-gray-400 mt-1">
                        {(() => {
                          const s = featured?.start_date ? new Date(featured.start_date) : null;
                          if (!s || isNaN(s.getTime())) return '';
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
                        {(featured?.duration ?? '24 hours').toString().toUpperCase()}
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
                        {(featured?.location ?? 'Online').toString().toUpperCase()}
                      </p>
                      <p className="font-jetbrains text-xs text-gray-400 mt-1">
                        Join anywhere
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8 text-center">
                    <p className="font-jetbrains text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                      {featured?.subtitle ?? 'Build the next generation of AI applications in 24 hours.'}
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to={featured?.register_url ?? '/events'}
                      data-testid="button-featured-register"
                      className="pixel-button bg-maximally-red text-white group/btn flex items-center justify-center gap-2 hover:scale-110 transform transition-all hover:shadow-glow-red h-14 sm:h-16 px-8 sm:px-10 font-press-start text-sm sm:text-base relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-maximally-yellow opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300" />
                      <Zap className="h-5 w-5 sm:h-6 sm:w-6 group-hover/btn:animate-pulse" />
                      <span>REGISTER_NOW</span>
                      <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover/btn:translate-x-2 transition-transform" />
                    </Link>

                    <Link
                      to={featured?.details_url ?? '/events'}
                      data-testid="button-featured-details"
                      className="pixel-button bg-black border-2 border-maximally-red text-maximally-red group/btn flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:bg-maximally-red hover:text-white h-14 sm:h-16 px-8 sm:px-10 font-press-start text-sm sm:text-base"
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

        {/* Grand Indian Hackathon Season Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <div className="minecraft-block bg-gradient-to-r from-orange-500 to-red-500 text-black px-6 py-3 inline-block mb-6">
                  <span className="font-press-start text-sm">
                    🇮🇳 GRAND INDIAN HACKATHON SEASON 2025
                  </span>
                </div>
                <h2 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 minecraft-text">
                  <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    10 HACKATHONS
                  </span>
                </h2>
                <p className="text-gray-300 text-sm sm:text-lg md:text-xl font-press-start px-4">
                  September → November • India's Biggest Hackathon Season
                </p>
              </div>

              {/* Event Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
                {[
                  { name: 'CODE HYPOTHESIS', date: 'SEP 2025', icon: '🧪' },
                  { name: 'PROTOCOL 404', date: 'OCT 2025', icon: '⚡' },
                  { name: 'PROJECT CODEGEN', date: 'OCT 2025', icon: '📝' },
                  { name: 'HACKTOBER', date: 'OCT 2025', icon: '🍂' },
                  { name: 'PROMPTSTORM', date: 'OCT 25-26', icon: '⚡' },
                  { name: 'TECH ASSEMBLY', date: 'NOV 1-7', icon: '🎮' },
                  { name: 'STEAL-A-THON', date: 'NOV 9-10', icon: '🔥' },
                  { name: 'CODEPOCALYPSE', date: 'OCT 18-19', icon: '☢️' },
                ]
                  .slice(0, 10)
                  .map((event, i) => (
                    <div
                      key={i}
                      className="pixel-card bg-gray-900 border-2 border-maximally-red hover:border-maximally-yellow transition-all duration-300 hover:scale-105 p-4 sm:p-3 lg:p-4 min-h-[120px] sm:min-h-[100px] flex flex-col justify-center"
                    >
                      <div className="text-2xl sm:text-xl lg:text-2xl mb-3 sm:mb-2 text-center">
                        {event.icon}
                      </div>
                      <div className="font-press-start text-sm sm:text-xs lg:text-sm text-maximally-red text-center mb-2 sm:mb-1 leading-tight">
                        {event.name}
                      </div>
                      <div className="font-press-start text-xs sm:text-[10px] lg:text-xs text-gray-400 text-center leading-tight">
                        {event.date}
                      </div>
                    </div>
                  ))}
              </div>

              <div className="text-center">
                <Link
                  to="/events"
                  className="pixel-button bg-maximally-red text-white inline-flex items-center gap-2 px-8 py-4 font-press-start hover:scale-105 transition-all duration-300"
                >
                  <Calendar className="h-5 w-5" />
                  <span>VIEW_ALL_EVENTS</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
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
                  animationDuration: `${4 + i}s`
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
                    Co-organize, feature, or partner with Maximally to host your hackathon — 
                    <span className="text-maximally-yellow font-bold"> and we'll support you every step of the way.</span>
                  </p>
                  <div className="flex items-center justify-center gap-2 text-maximally-red">
                    <div className="h-px w-12 bg-maximally-red" />
                    <Sparkles className="h-4 w-4" />
                    <div className="h-px w-12 bg-maximally-red" />
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-jetbrains">
                  Join <span className="text-maximally-yellow font-bold">hundreds</span> of student, startup, and community hackathons worldwide.
                </p>
              </div>

              {/* Benefits Grid - Enhanced */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-maximally-red p-8 hover:border-maximally-yellow transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-maximally-red/50 group relative overflow-hidden" data-testid="partner-benefit-1">
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

                <div className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-maximally-red p-8 hover:border-maximally-yellow transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-maximally-red/50 group relative overflow-hidden" data-testid="partner-benefit-2">
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

                <div className="pixel-card bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-maximally-red p-8 hover:border-maximally-yellow transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-maximally-red/50 group relative overflow-hidden" data-testid="partner-benefit-3">
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
                    <span className="text-maximally-yellow font-bold">250+ hackathons advised.</span> You're never doing it alone.
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
                    className="pixel-button bg-black border-4 border-maximally-red text-maximally-red group flex items-center justify-center gap-3 hover:scale-110 transform transition-all hover:bg-maximally-red hover:text-white hover:shadow-2xl hover:shadow-maximally-red/50 h-16 px-10 font-press-start text-sm sm:text-base"
                  >
                    <FileText className="h-6 w-6 group-hover:animate-pulse" />
                    <span>VIEW_GUIDE</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12 sm:mb-16 minecraft-text px-4">
                <span className="text-maximally-red drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  BUILT GLOBAL. MADE FOR BUILDERS.
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center">
                  <div className="pixel-card bg-black border-2 border-maximally-red p-8 hover:scale-105 transition-all duration-300 hover:border-maximally-yellow">
                    <div className="minecraft-block bg-maximally-red w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Globe className="h-8 w-8 text-black" />
                    </div>
                    <h3 className="font-press-start text-lg text-maximally-red mb-2">
                      GLOBAL
                    </h3>
                    <p className="font-jetbrains text-gray-300">
                      Borderless innovation for builders worldwide
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="pixel-card bg-black border-2 border-maximally-red p-8 hover:scale-105 transition-all duration-300 hover:border-maximally-yellow">
                    <div className="minecraft-block bg-maximally-red w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Terminal className="h-8 w-8 text-black" />
                    </div>
                    <h3 className="font-press-start text-lg text-maximally-red mb-2">
                      DIGITAL
                    </h3>
                    <p className="font-jetbrains text-gray-300">
                      Internet-native events for digital builders
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="pixel-card bg-black border-2 border-maximally-red p-8 hover:scale-105 transition-all duration-300 hover:border-maximally-yellow">
                    <div className="minecraft-block bg-maximally-red w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Zap className="h-8 w-8 text-black" />
                    </div>
                    <h3 className="font-press-start text-lg text-maximally-red mb-2">
                      FAST
                    </h3>
                    <p className="font-jetbrains text-gray-300">
                      High-pressure sprints for real proof of work
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-16">
                <p className="font-jetbrains text-sm sm:text-base md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
                  At Maximally, we believe innovation has no borders — and no
                  traditional limits. Whether you're from a major city or a
                  small town, if you're building bold things,
                  <span className="text-maximally-red"> you belong here</span>.
                </p>
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
                  <span className="font-press-start text-sm">
                    🤝 MFHOP
                  </span>
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
                  A global network of hackathon organizers working together to grow reach, share sponsors, and strengthen events.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    title: 'Cross-Promotion',
                    description: 'Share posts, newsletters, and reach new student bases.',
                    icon: <Globe className="h-6 w-6" />,
                    color: 'bg-blue-600'
                  },
                  {
                    title: 'Sponsors & Partnerships',
                    description: 'Exchange leads, pitch bigger packages together.',
                    icon: <Trophy className="h-6 w-6" />,
                    color: 'bg-green-600'
                  },
                  {
                    title: 'Judges & Mentors',
                    description: 'Tap into a shared circuit of experienced names.',
                    icon: <Users className="h-6 w-6" />,
                    color: 'bg-purple-600'
                  }
                ].map((benefit, i) => (
                  <div
                    key={i}
                    className="pixel-card bg-black border-2 border-maximally-red p-6 hover:border-maximally-yellow transition-all duration-300 hover:scale-105"
                  >
                    <div className={`minecraft-block ${benefit.color} w-12 h-12 mx-auto mb-4 flex items-center justify-center text-white`}>
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
                    MFHOP is an initiative led by Maximally to bring hackathon organizers out of silos. 
                    <span className="text-maximally-red font-bold"> Membership is free</span>, and open to any organizer who has hosted at least one hackathon.
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

        <Footer />
      </div>
    </>
  );
};

export default Index;
