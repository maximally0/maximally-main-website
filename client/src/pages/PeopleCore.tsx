import { Star, Users, Code, GraduationCap, Loader2, LucideIcon, Sparkles } from 'lucide-react';
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
  gradient: string;
  border: string;
  text: string;
  iconBg: string;
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

        if (error) throw error;
        setPeople(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load team members');
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  const getPeopleByCategory = (category: TeamMember['category']): TeamMember[] => {
    return people.filter(person => person.category === category)
                 .sort((a, b) => a.display_order - b.display_order);
  };

  const advisors = getPeopleByCategory('advisors');
  const organizingBoard = getPeopleByCategory('organizing_board');
  const developers = getPeopleByCategory('developers');
  const alumni = getPeopleByCategory('alumni');

  const TeamSection = ({ title, members, icon: Icon, colorTheme, emptyMessage }: TeamSectionProps) => (
    <section className="mb-20">
      <div className="text-center mb-10">
        <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${colorTheme.gradient} border ${colorTheme.border} mb-6`}>
          <Icon className={`h-5 w-5 ${colorTheme.text}`} />
          <span className={`font-press-start text-xs ${colorTheme.text}`}>{title.toUpperCase()}</span>
        </div>
        <h2 className={`font-press-start text-2xl md:text-3xl bg-gradient-to-r ${colorTheme.text === 'text-red-400' ? 'from-red-400 to-orange-400' : colorTheme.text === 'text-amber-400' ? 'from-amber-400 to-yellow-400' : colorTheme.text === 'text-green-400' ? 'from-green-400 to-emerald-400' : 'from-blue-400 to-cyan-400'} bg-clip-text text-transparent`}>
          {title}
        </h2>
      </div>
      
      {members.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div 
              key={member.id} 
              className={`bg-gradient-to-br ${colorTheme.gradient} border ${colorTheme.border} p-6 hover:scale-[1.02] transition-all`}
            >
              <div className={`${colorTheme.iconBg} w-14 h-14 mx-auto mb-4 flex items-center justify-center border ${colorTheme.border}`}>
                <Icon className={`h-7 w-7 ${colorTheme.text}`} />
              </div>
              
              <h3 className="font-press-start text-sm mb-2 text-center text-white">
                {member.name}
              </h3>
              
              <p className="font-jetbrains text-xs text-gray-400 text-center mb-1">
                {member.role_in_company}
              </p>
              
              {member.company && (
                <p className={`font-jetbrains text-xs font-bold ${colorTheme.text} text-center mb-3`}>
                  {member.company}
                </p>
              )}
              
              {member.description && (
                <p className="font-jetbrains text-xs text-gray-400 text-center italic mb-4 line-clamp-3">
                  "{member.description}"
                </p>
              )}
              
              {(member.linkedin_url || member.twitter_url || member.github_url || member.website_url) && (
                <div className="flex justify-center gap-3 mt-4">
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 flex items-center justify-center transition-all"
                    >
                      <FaLinkedin className="w-4 h-4 text-blue-400" />
                    </a>
                  )}
                  {member.twitter_url && (
                    <a
                      href={member.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 flex items-center justify-center transition-all"
                    >
                      <FaTwitter className="w-4 h-4 text-cyan-400" />
                    </a>
                  )}
                  {member.github_url && (
                    <a
                      href={member.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-gray-600/30 hover:bg-gray-600/50 border border-gray-500/50 flex items-center justify-center transition-all"
                    >
                      <FaGithub className="w-4 h-4 text-gray-400" />
                    </a>
                  )}
                  {member.website_url && (
                    <a
                      href={member.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-green-600/30 hover:bg-green-600/50 border border-green-500/50 flex items-center justify-center transition-all"
                    >
                      <FaGlobe className="w-4 h-4 text-green-400" />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className={`bg-gradient-to-br ${colorTheme.gradient} border ${colorTheme.border} px-8 py-6 inline-block`}>
            <p className="font-jetbrains text-sm text-gray-400">{emptyMessage}</p>
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
        {/* Background Effects */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.15)_0%,transparent_50%)]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(251,191,36,0.10)_0%,transparent_50%)]" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-red-500/15 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-amber-500/12 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-orange-500/10 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

        <main className="min-h-screen pt-24 pb-16 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600/30 to-orange-600/20 border border-red-500/40 mb-8">
                <Star className="h-5 w-5 text-red-400" />
                <span className="font-press-start text-xs text-red-300">THE BUILDERS</span>
                <Sparkles className="h-5 w-5 text-orange-400" />
              </div>
              
              <h1 className="font-press-start text-4xl md:text-5xl lg:text-6xl mb-8">
                <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                  CORE TEAM
                </span>
              </h1>
              
              <p className="text-gray-300 text-lg md:text-xl font-jetbrains max-w-4xl mx-auto leading-relaxed mb-8">
                The builders, mentors, and organizers making Maximally 
                <span className="text-red-400 font-bold"> the world's premier hackathon league.</span>
              </p>
              
              <Link
                to="/people"
                className="inline-block bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-6 py-3 font-press-start text-xs border border-red-500/50 transition-all hover:scale-[1.02]"
              >
                ← BACK TO PEOPLE
              </Link>
            </section>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-red-900/30 to-orange-900/20 border border-red-500/40 px-8 py-6 inline-block mb-4">
                  <Loader2 className="h-8 w-8 text-red-400 animate-spin mx-auto mb-4" />
                  <span className="font-press-start text-sm text-red-300">LOADING TEAM DATA</span>
                </div>
                <p className="text-gray-400 font-jetbrains">Fetching our amazing team members...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-red-900/30 to-rose-900/20 border border-red-500/40 px-8 py-6 inline-block mb-4">
                  <span className="font-press-start text-sm text-red-400">ERROR LOADING TEAM</span>
                </div>
                <p className="text-red-400 font-jetbrains mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-6 py-3 font-press-start text-xs border border-red-500/50 transition-all"
                >
                  RETRY
                </button>
              </div>
            )}

            {/* Team Sections */}
            {!loading && !error && (
              <>
                <TeamSection
                  title="Advisors"
                  members={advisors}
                  icon={Star}
                  colorTheme={{
                    gradient: "from-red-900/30 to-orange-900/20",
                    border: "border-red-500/40",
                    text: "text-red-400",
                    iconBg: "bg-red-600/30"
                  }}
                  emptyMessage="Our amazing advisors guide our strategic direction."
                />

                <TeamSection
                  title="Organizing Board"
                  members={organizingBoard}
                  icon={Users}
                  colorTheme={{
                    gradient: "from-amber-900/30 to-yellow-900/20",
                    border: "border-amber-500/40",
                    text: "text-amber-400",
                    iconBg: "bg-amber-600/30"
                  }}
                  emptyMessage="The leadership team driving Maximally forward."
                />

                <TeamSection
                  title="Developers"
                  members={developers}
                  icon={Code}
                  colorTheme={{
                    gradient: "from-green-900/30 to-emerald-900/20",
                    border: "border-green-500/40",
                    text: "text-green-400",
                    iconBg: "bg-green-600/30"
                  }}
                  emptyMessage="The technical team building our platform."
                />

                <TeamSection
                  title="Alumni"
                  members={alumni}
                  icon={GraduationCap}
                  colorTheme={{
                    gradient: "from-blue-900/30 to-cyan-900/20",
                    border: "border-blue-500/40",
                    text: "text-blue-400",
                    iconBg: "bg-blue-600/30"
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
