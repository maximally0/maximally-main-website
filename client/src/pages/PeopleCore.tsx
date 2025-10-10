import { Star, Users, Code, GraduationCap, Linkedin, Twitter, Github, Globe, Loader2, LucideIcon } from 'lucide-react';
import { FaLinkedin, FaTwitter, FaGithub, FaGlobe } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

interface TeamMember {
  id: number;
  name: string;
  role_in_company: string;
  company?: string;
  description?: string;
  category: 'advisors' | 'organizing_board' | 'developers' | 'alumni';
  linkedin_url?: string;
  twitter_url?: string;
  github_url?: string;
  website_url?: string;
  display_order: number;
}

interface ColorTheme {
  bg: string;
  text: string;
  border: string;
}

interface TeamSectionProps {
  title: string;
  members: TeamMember[];
  icon: LucideIcon;
  colorTheme: ColorTheme;
  emptyMessage: string;
}

const PeopleCore = () => {
  const [people, setPeople] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch people from database
  useEffect(() => {
    const fetchPeople = async () => {
      if (!supabase) {
        setError('Database not available');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('people')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) {
          throw error;
        }

        setPeople(data || []);
      } catch (err: any) {
        console.error('Error fetching people:', err);
        setError(err.message || 'Failed to load team members');
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  // Helper function to get people by category
  const getPeopleByCategory = (category: TeamMember['category']): TeamMember[] => {
    return people.filter(person => person.category === category)
                 .sort((a, b) => a.display_order - b.display_order);
  };

  const advisors = getPeopleByCategory('advisors');
  const organizingBoard = getPeopleByCategory('organizing_board');
  const developers = getPeopleByCategory('developers');
  const alumni = getPeopleByCategory('alumni');

  const TeamSection = ({ title, members, icon: Icon, colorTheme, emptyMessage }: TeamSectionProps) => (
    <section className="mb-16">
      <div className="text-center mb-8">
        <div className={`minecraft-block ${colorTheme.bg} text-black px-6 py-3 inline-block mb-4`}>
          <span className="font-press-start text-sm flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {title.toUpperCase()}
          </span>
        </div>
        <h2 className="font-press-start text-2xl md:text-4xl mb-4 minecraft-text">
          <span className={`${colorTheme.text} drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]`}>
            {title}
          </span>
        </h2>
      </div>
      
      {members.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div 
              key={member.id} 
              className={`pixel-card bg-black border-2 ${colorTheme.border} p-6 hover:scale-105 transition-all duration-300 hover:border-maximally-yellow`}
            >
              <div className={`minecraft-block ${colorTheme.bg} w-12 h-12 mx-auto mb-4 flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-black" />
              </div>
              
              <h3 className="font-press-start text-sm mb-2 text-center text-white">
                {member.name}
              </h3>
              
              <p className="font-jetbrains text-xs text-gray-300 text-center mb-1">
                {member.role_in_company}
              </p>
              
              {member.company && (
                <p className="font-jetbrains text-xs font-bold text-white text-center mb-3">
                  {member.company}
                </p>
              )}
              
              {member.description && (
                <p className="font-jetbrains text-xs text-gray-300 text-center italic mb-4">
                  "{member.description}"
                </p>
              )}
              
              {/* Social Media Links */}
              {(member.linkedin_url || member.twitter_url || member.github_url || member.website_url) && (
                <div className="flex justify-center gap-2 mt-4">
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-200"
                      title="LinkedIn"
                    >
                      <FaLinkedin className="w-4 h-4 text-white" />
                    </a>
                  )}
                  {member.twitter_url && (
                    <a
                      href={member.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors duration-200"
                      title="Twitter"
                    >
                      <FaTwitter className="w-4 h-4 text-white" />
                    </a>
                  )}
                  {member.github_url && (
                    <a
                      href={member.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200"
                      title="GitHub"
                    >
                      <FaGithub className="w-4 h-4 text-white" />
                    </a>
                  )}
                  {member.website_url && (
                    <a
                      href={member.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors duration-200"
                      title="Website"
                    >
                      <FaGlobe className="w-4 h-4 text-white" />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="minecraft-block bg-gray-700 text-gray-300 px-6 py-4 inline-block">
            <span className="font-jetbrains text-sm">{emptyMessage}</span>
          </div>
        </div>
      )}
    </section>
  );

  return (
    <>
      <SEO
        title="Core Team | Maximally"
        description="Meet Maximally's core team - advisors, organizing board, developers, and alumni building the world's premier hackathon league."
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Pixel Grid Background */}
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating Pixels */}
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="fixed w-2 h-2 bg-maximally-red pixel-border animate-float pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}

        <main className="min-h-screen pt-24 pb-16 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-16">
              <div className="minecraft-block bg-maximally-red text-black px-6 py-3 inline-block mb-8">
                <span className="font-press-start text-sm">⚡ THE CORE TEAM</span>
              </div>
              <h1 className="font-press-start text-4xl md:text-6xl lg:text-8xl mb-8 minecraft-text">
                <span className="text-maximally-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  CORE TEAM
                </span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl font-jetbrains max-w-4xl mx-auto leading-relaxed mb-8">
                The builders, mentors, and organizers making Maximally the world's premier hackathon league.
              </p>
              
              {/* Back to People Button */}
              <Link
                to="/people"
                className="inline-block minecraft-block bg-maximally-yellow text-black px-4 py-2 hover:bg-maximally-red transition-colors"
              >
                <span className="font-press-start text-xs">← BACK TO PEOPLE</span>
              </Link>
            </section>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-16">
                <div className="minecraft-block bg-maximally-red text-white px-6 py-4 inline-block mb-4">
                  <span className="font-press-start text-sm flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    LOADING TEAM DATA
                  </span>
                </div>
                <p className="text-gray-400 font-jetbrains">Fetching our amazing team members...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-16">
                <div className="minecraft-block bg-red-600 text-white px-6 py-4 inline-block mb-4">
                  <span className="font-press-start text-sm">ERROR LOADING TEAM</span>
                </div>
                <p className="text-red-400 font-jetbrains mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="minecraft-block bg-maximally-red text-white px-4 py-2 hover:bg-red-700 transition-colors"
                >
                  <span className="font-press-start text-xs">RETRY</span>
                </button>
              </div>
            )}

            {/* Team Sections - Only show when data is loaded */}
            {!loading && !error && (
              <>
                <TeamSection
                  title="Advisors"
                  members={advisors}
                  icon={Star}
                  colorTheme={{
                    bg: "bg-maximally-red",
                    text: "text-maximally-red", 
                    border: "border-maximally-red"
                  }}
                  emptyMessage="Our amazing advisors guide our strategic direction."
                />

                <TeamSection
                  title="Organizing Board"
                  members={organizingBoard}
                  icon={Users}
                  colorTheme={{
                    bg: "bg-maximally-yellow",
                    text: "text-maximally-yellow",
                    border: "border-maximally-yellow"
                  }}
                  emptyMessage="The leadership team driving Maximally forward."
                />

                <TeamSection
                  title="Developers"
                  members={developers}
                  icon={Code}
                  colorTheme={{
                    bg: "bg-green-500",
                    text: "text-green-500",
                    border: "border-green-500"
                  }}
                  emptyMessage="The technical team building our platform."
                />

                <TeamSection
                  title="Alumni"
                  members={alumni}
                  icon={GraduationCap}
                  colorTheme={{
                    bg: "bg-blue-500",
                    text: "text-blue-500",
                    border: "border-blue-500"
                  }}
                  emptyMessage="Past core members who helped build our foundation."
                />
              </>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PeopleCore;