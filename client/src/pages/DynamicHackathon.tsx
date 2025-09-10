import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Zap,
  Clock,
  Globe,
  Users,
  Code,
  Skull,
  AlertTriangle,
  Target,
  Trophy,
  Star,
  ExternalLink,
  FileText,
  Video,
  Flame,
  Shield,
} from 'lucide-react';

interface HackathonData {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  tagline: string;
  badge_text?: string;
  description: string;
  registration_url?: string;
  start_date: string;
  end_date: string;
  duration: string;
  format: string;
  team_size: string;
  judging_type: string;
  results_date: string;
  what_it_is: string;
  the_idea: string;
  who_joins: string[];
  tech_rules: string[];
  fun_awards: string[];
  perks: string[];
  cash_pool?: string;
  judging_description: string;
  judging_criteria: string;
  required_submissions: string[];
  optional_submissions?: string[];
  theme_color_primary: string;
  theme_color_secondary: string;
  theme_color_accent: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function DynamicHackathon() {
  const { slug } = useParams<{ slug: string }>();
  const [hackathon, setHackathon] = useState<HackathonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchHackathon = async () => {
      if (!slug) return;
      
      try {
        const response = await fetch(`/api/hackathons/${slug}`);
        if (!response.ok) {
          throw new Error('Hackathon not found');
        }
        const data = await response.json();
        setHackathon(data);
        setIsVisible(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hackathon');
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white font-press-start">Loading...</div>
      </div>
    );
  }

  if (error || !hackathon) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-press-start text-2xl text-red-500 mb-4">404</h1>
          <p className="text-white">Hackathon not found</p>
        </div>
      </div>
    );
  }

  const fastFacts = [
    {
      icon: <Clock className="h-5 w-5" />,
      label: 'Date',
      value: `${hackathon.start_date} – ${hackathon.end_date}`,
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: 'Duration',
      value: hackathon.duration,
    },
    { icon: <Globe className="h-5 w-5" />, label: 'Format', value: hackathon.format },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Team size',
      value: hackathon.team_size,
    },
    {
      icon: <Target className="h-5 w-5" />,
      label: 'Judging',
      value: hackathon.judging_type,
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      label: 'Results',
      value: hackathon.results_date,
    },
  ];

  // Convert hex colors to CSS custom properties for dynamic theming
  const themeStyle = {
    '--theme-primary': hackathon.theme_color_primary,
    '--theme-secondary': hackathon.theme_color_secondary,
    '--theme-accent': hackathon.theme_color_accent,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden" style={themeStyle}>
      <SEO
        title={`${hackathon.title} - ${hackathon.tagline}`}
        description={hackathon.description}
        keywords={`hackathon, ${hackathon.slug}, coding competition, ${hackathon.format.toLowerCase()}`}
      />

      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* Glitch sparks */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`spark-${i}`}
            className="absolute opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `glitch ${1 + Math.random() * 2}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <Zap className="h-4 w-4" style={{ color: hackathon.theme_color_primary }} />
          </div>
        ))}

        {/* Scattered arrows */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`arrow-${i}`}
            className="absolute opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `drift ${4 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <div 
              className="w-8 h-1 relative"
              style={{ backgroundColor: hackathon.theme_color_accent }}
            >
              <div 
                className="absolute right-0 top-0 w-0 h-0 border-l-4 border-t-2 border-b-2 border-t-transparent border-b-transparent"
                style={{ borderLeftColor: hackathon.theme_color_accent }}
              ></div>
            </div>
          </div>
        ))}

        {/* Distressed texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900 opacity-90"></div>

        {/* Warning symbols */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`warning-${i}`}
            className="absolute opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `pulse ${3 + Math.random() * 2}s infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <AlertTriangle className="h-12 w-12" style={{ color: hackathon.theme_color_primary }} />
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center relative px-4 pt-20">
          {/* Badge */}
          {hackathon.badge_text && (
            <div
              className={`mb-6 transform transition-all duration-1000 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}
            >
              <div 
                className="px-6 py-2 border-4 shadow-2xl relative"
                style={{
                  backgroundColor: hackathon.theme_color_primary,
                  color: hackathon.theme_color_accent,
                  borderColor: hackathon.theme_color_accent
                }}
              >
                <span className="font-press-start text-xs">
                  {hackathon.badge_text}
                </span>
                <div 
                  className="absolute -top-1 -right-1 w-4 h-4"
                  style={{ backgroundColor: hackathon.theme_color_accent }}
                ></div>
                <div 
                  className="absolute -bottom-1 -left-1 w-4 h-4"
                  style={{ backgroundColor: hackathon.theme_color_primary }}
                ></div>
              </div>
            </div>
          )}

          {/* Title */}
          <div
            className={`text-center mb-8 transform transition-all duration-1000 delay-200 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            <h1 className="font-press-start text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              <span 
                className="drop-shadow-2xl filter brightness-110"
                style={{ color: hackathon.theme_color_primary }}
              >
                {hackathon.title.split(' ')[0]}
              </span>
              <br />
              <span 
                className="drop-shadow-2xl relative"
                style={{ color: hackathon.theme_color_accent }}
              >
                {hackathon.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <h2 className="font-jetbrains text-xl md:text-2xl text-gray-300 mb-4 font-bold">
              {hackathon.tagline}
            </h2>
            <div 
              className="border-4 p-4 inline-block max-w-2xl"
              style={{
                backgroundColor: 'black',
                borderColor: hackathon.theme_color_primary
              }}
            >
              <p 
                className="font-press-start text-base md:text-lg leading-relaxed"
                style={{ color: hackathon.theme_color_accent }}
              >
                "{hackathon.description}"
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-400 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            {hackathon.registration_url && (
              <Button
                onClick={() => window.open(hackathon.registration_url, '_self')}
                className="font-press-start py-4 px-8 text-lg hover:scale-105 transition-all duration-300 border-4 shadow-2xl relative overflow-hidden"
                style={{
                  backgroundColor: hackathon.theme_color_primary,
                  color: 'white',
                  borderColor: hackathon.theme_color_accent
                }}
              >
                <span className="relative z-10 flex items-center">
                  <Flame className="h-5 w-5 mr-2" />
                  REGISTER NOW
                </span>
              </Button>
            )}
            <Button
              onClick={() =>
                document
                  .getElementById('prizes')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="font-press-start py-4 px-8 text-lg hover:scale-105 transition-all duration-300 border-4 shadow-2xl relative overflow-hidden"
              style={{
                backgroundColor: 'black',
                color: hackathon.theme_color_accent,
                borderColor: hackathon.theme_color_primary
              }}
            >
              <span className="relative z-10 flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                VIEW PRIZES
              </span>
            </Button>
          </div>
        </section>

        {/* Fast Facts Bar */}
        <section 
          className="py-8 border-y-4 relative"
          style={{
            backgroundColor: hackathon.theme_color_primary,
            borderColor: hackathon.theme_color_accent
          }}
        >
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {fastFacts.map((fact, index) => (
                <div key={index} className="text-center group">
                  <div 
                    className="flex items-center justify-center mb-2 group-hover:text-white transition-colors"
                    style={{ color: hackathon.theme_color_accent }}
                  >
                    {fact.icon}
                  </div>
                  <div className="font-press-start text-xs text-white mb-1">
                    {fact.label}
                  </div>
                  <div 
                    className="font-jetbrains text-sm font-bold"
                    style={{ color: hackathon.theme_color_accent }}
                  >
                    {fact.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What It Is */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 
              className="font-press-start text-3xl md:text-4xl mb-8 flex items-center justify-center gap-3"
              style={{ color: hackathon.theme_color_primary }}
            >
              <AlertTriangle className="h-8 w-8" style={{ color: hackathon.theme_color_accent }} />
              WHAT IT IS
              <AlertTriangle className="h-8 w-8" style={{ color: hackathon.theme_color_accent }} />
            </h2>
            <div 
              className="border-4 p-8 relative"
              style={{
                backgroundColor: 'black',
                borderColor: hackathon.theme_color_primary
              }}
            >
              <div 
                className="absolute -top-2 -left-2 w-6 h-6"
                style={{ backgroundColor: hackathon.theme_color_accent }}
              ></div>
              <div 
                className="absolute -bottom-2 -right-2 w-6 h-6"
                style={{ backgroundColor: hackathon.theme_color_primary }}
              ></div>
              <p className="font-jetbrains text-lg md:text-xl text-gray-300 leading-relaxed">
                {hackathon.what_it_is}
              </p>
            </div>
          </div>
        </section>

        {/* The Idea */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-900 via-black to-gray-900">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 
              className="font-press-start text-3xl md:text-4xl mb-8 flex items-center justify-center gap-3"
              style={{ color: hackathon.theme_color_accent }}
            >
              <Skull className="h-8 w-8" style={{ color: hackathon.theme_color_primary }} />
              THE IDEA
              <Skull className="h-8 w-8" style={{ color: hackathon.theme_color_primary }} />
            </h2>
            <div 
              className="border-4 p-8 relative"
              style={{
                backgroundColor: hackathon.theme_color_primary,
                borderColor: hackathon.theme_color_accent
              }}
            >
              <div 
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r"
                style={{
                  background: `linear-gradient(to right, ${hackathon.theme_color_accent}, ${hackathon.theme_color_primary}, ${hackathon.theme_color_accent})`
                }}
              ></div>
              <p className="font-jetbrains text-lg md:text-xl text-gray-200 leading-relaxed">
                {hackathon.the_idea}
              </p>
            </div>
          </div>
        </section>

        {/* Who Joins */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 
              className="font-press-start text-3xl md:text-4xl mb-12 text-center flex items-center justify-center gap-3"
              style={{ color: hackathon.theme_color_primary }}
            >
              <Users className="h-8 w-8" style={{ color: hackathon.theme_color_accent }} />
              WHO JOINS
              <Users className="h-8 w-8" style={{ color: hackathon.theme_color_accent }} />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {hackathon.who_joins.map((person, index) => (
                <div
                  key={index}
                  className="border-2 p-4 hover:scale-105 transition-all duration-300 relative"
                  style={{
                    backgroundColor: 'black',
                    borderColor: hackathon.theme_color_primary
                  }}
                >
                  <div 
                    className="absolute top-0 right-0 w-3 h-3"
                    style={{ backgroundColor: hackathon.theme_color_accent }}
                  ></div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-2 h-2"
                      style={{ backgroundColor: hackathon.theme_color_primary }}
                    ></div>
                    <span className="font-jetbrains text-gray-300 font-medium">
                      {person}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Rules */}
        <section 
          className="py-20 px-4 bg-gradient-to-b via-black"
          style={{
            background: `linear-gradient(to bottom, black, ${hackathon.theme_color_primary}30, black)`
          }}
        >
          <div className="container mx-auto max-w-4xl">
            <h2 
              className="font-press-start text-3xl md:text-4xl mb-12 text-center flex items-center justify-center gap-3"
              style={{ color: hackathon.theme_color_accent }}
            >
              <Code className="h-8 w-8" style={{ color: hackathon.theme_color_primary }} />
              TECH RULES
              <Code className="h-8 w-8" style={{ color: hackathon.theme_color_primary }} />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hackathon.tech_rules.map((rule, index) => (
                <div
                  key={index}
                  className="border-l-4 p-4 hover:bg-gray-900 transition-colors duration-300"
                  style={{
                    backgroundColor: 'black',
                    borderLeftColor: hackathon.theme_color_accent
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rotate-45"
                      style={{ backgroundColor: hackathon.theme_color_primary }}
                    ></div>
                    <span className="font-jetbrains text-gray-300">{rule}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prizes */}
        <section id="prizes" className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 
              className="font-press-start text-3xl md:text-4xl mb-8 text-center flex items-center justify-center gap-3"
              style={{ color: hackathon.theme_color_primary }}
            >
              <Trophy className="h-8 w-8" style={{ color: hackathon.theme_color_accent }} />
              PRIZES & PERKS
              <Trophy className="h-8 w-8" style={{ color: hackathon.theme_color_accent }} />
            </h2>

            {/* Cash Pool */}
            {hackathon.cash_pool && (
              <div className="text-center mb-8">
                <div 
                  className="px-8 py-4 border-4 inline-block relative"
                  style={{
                    backgroundColor: hackathon.theme_color_accent,
                    color: 'black',
                    borderColor: hackathon.theme_color_primary
                  }}
                >
                  <div 
                    className="absolute -top-2 -left-2 w-6 h-6"
                    style={{ backgroundColor: hackathon.theme_color_primary }}
                  ></div>
                  <div 
                    className="absolute -bottom-2 -right-2 w-6 h-6 bg-black"
                  ></div>
                  <span className="font-press-start text-xl">
                    CASH POOL: {hackathon.cash_pool}
                  </span>
                </div>
              </div>
            )}

            {/* Perks */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card 
                className="border-4"
                style={{
                  backgroundColor: 'black',
                  borderColor: hackathon.theme_color_accent
                }}
              >
                <CardContent className="p-6">
                  <h3 
                    className="font-press-start text-xl mb-4"
                    style={{ color: hackathon.theme_color_accent }}
                  >
                    PERKS
                  </h3>
                  <ul className="space-y-2">
                    {hackathon.perks.map((perk, index) => (
                      <li key={index} className="font-jetbrains text-gray-300 flex items-center gap-2">
                        <Star className="h-4 w-4" style={{ color: hackathon.theme_color_primary }} />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card 
                className="border-4"
                style={{
                  backgroundColor: hackathon.theme_color_primary,
                  borderColor: hackathon.theme_color_accent
                }}
              >
                <CardContent className="p-6">
                  <h3 
                    className="font-press-start text-xl mb-4"
                    style={{ color: hackathon.theme_color_accent }}
                  >
                    FUN AWARDS
                  </h3>
                  <ul className="space-y-2">
                    {hackathon.fun_awards.map((award, index) => (
                      <li
                        key={index}
                        className="font-jetbrains text-gray-200 flex items-center gap-2"
                      >
                        <Skull className="h-4 w-4" style={{ color: hackathon.theme_color_accent }} />
                        {award}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Judging */}
        <section className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="container mx-auto max-w-4xl">
            <h2 
              className="font-press-start text-3xl md:text-4xl mb-8 text-center flex items-center justify-center gap-3"
              style={{ color: hackathon.theme_color_accent }}
            >
              <Shield className="h-8 w-8" style={{ color: hackathon.theme_color_primary }} />
              JUDGING
              <Shield className="h-8 w-8" style={{ color: hackathon.theme_color_primary }} />
            </h2>
            <div 
              className="border-4 p-8 relative"
              style={{
                backgroundColor: 'black',
                borderColor: hackathon.theme_color_primary
              }}
            >
              <div 
                className="absolute -top-1 left-4 right-4 h-2"
                style={{ backgroundColor: hackathon.theme_color_accent }}
              ></div>
              <div className="mb-6">
                <h3 
                  className="font-press-start text-lg mb-4"
                  style={{ color: hackathon.theme_color_accent }}
                >
                  REVIEWERS
                </h3>
                <p className="font-jetbrains text-gray-300">
                  {hackathon.judging_description}
                </p>
              </div>
              <div>
                <h3 
                  className="font-press-start text-lg mb-4"
                  style={{ color: hackathon.theme_color_accent }}
                >
                  CRITERIA
                </h3>
                <p className="font-jetbrains text-gray-300">
                  {hackathon.judging_criteria}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Submission */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 
              className="font-press-start text-3xl md:text-4xl mb-12 text-center flex items-center justify-center gap-3"
              style={{ color: hackathon.theme_color_primary }}
            >
              <FileText className="h-8 w-8" style={{ color: hackathon.theme_color_accent }} />
              SUBMISSION
              <FileText className="h-8 w-8" style={{ color: hackathon.theme_color_accent }} />
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div 
                className="border-4 p-6 relative"
                style={{
                  backgroundColor: hackathon.theme_color_primary,
                  borderColor: hackathon.theme_color_accent
                }}
              >
                <div 
                  className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center"
                  style={{ backgroundColor: hackathon.theme_color_accent }}
                >
                  <span className="font-press-start text-xs text-black">!</span>
                </div>
                <h3 
                  className="font-press-start text-xl mb-6 flex items-center gap-2"
                  style={{ color: hackathon.theme_color_accent }}
                >
                  <FileText className="h-5 w-5" />
                  REQUIRED
                </h3>
                <ul className="space-y-3">
                  {hackathon.required_submissions.map((requirement, index) => (
                    <li key={index} className="font-jetbrains text-gray-200 flex items-start gap-2">
                      <span style={{ color: hackathon.theme_color_accent }}>▸</span>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>

              {hackathon.optional_submissions && hackathon.optional_submissions.length > 0 && (
                <div 
                  className="border-4 p-6 relative"
                  style={{
                    backgroundColor: 'black',
                    borderColor: hackathon.theme_color_primary
                  }}
                >
                  <div 
                    className="absolute -top-2 -left-2 w-8 h-8 flex items-center justify-center"
                    style={{ backgroundColor: hackathon.theme_color_primary }}
                  >
                    <span className="font-press-start text-xs text-white">?</span>
                  </div>
                  <h3 
                    className="font-press-start text-xl mb-6 flex items-center gap-2"
                    style={{ color: hackathon.theme_color_primary }}
                  >
                    <Video className="h-5 w-5" />
                    OPTIONAL
                  </h3>
                  <ul className="space-y-3">
                    {hackathon.optional_submissions.map((optional, index) => (
                      <li key={index} className="font-jetbrains text-gray-300 flex items-start gap-2">
                        <span style={{ color: hackathon.theme_color_primary }}>▸</span>
                        {optional}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div 
              className="p-12 border-4 relative"
              style={{
                background: `linear-gradient(to right, ${hackathon.theme_color_primary}80, black, ${hackathon.theme_color_primary}80)`,
                borderColor: hackathon.theme_color_accent
              }}
            >
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="relative z-10">
                <h2 className="font-press-start text-2xl md:text-3xl mb-6 text-white">
                  READY FOR {hackathon.title.toUpperCase()}?
                </h2>
                <p className="font-jetbrains text-gray-300 mb-8">
                  {hackathon.tagline}
                </p>
                {hackathon.registration_url && (
                  <button
                    onClick={() => window.open(hackathon.registration_url, '_self')}
                    className="font-bold py-3 px-4 sm:py-6 sm:px-12 text-xs sm:text-base md:text-lg lg:text-xl hover:scale-105 transition-all duration-300 border-2 sm:border-4 shadow-2xl relative overflow-hidden w-full sm:w-auto max-w-sm sm:max-w-none"
                    style={{
                      backgroundColor: hackathon.theme_color_accent,
                      color: 'black',
                      borderColor: hackathon.theme_color_primary
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center text-black">
                      <Flame className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 flex-shrink-0" />
                      REGISTER NOW
                      <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ml-2 flex-shrink-0" />
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}