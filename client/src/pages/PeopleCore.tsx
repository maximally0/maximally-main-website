import { Star, Users, Code, Heart, GraduationCap, LucideIcon } from 'lucide-react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

interface TeamMember {
  name: string;
  role: string;
  organization?: string;
  description?: string;
  socials?: Record<string, string>;
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
  const advisors = [
    {
      name: "Thilakavathi Sankaran",
      role: "Data & Analytics Professional",
      organization: "15+ Years Experience",
      description: "Great ideas need more than vision — they need data, direction, and people who believe in both.",
      socials: {}
    },
    {
      name: "Priyanshu Sharma",
      role: "Founder & CEO",
      organization: "ByteBrain",
      description: "Maximally is doing what the world needs more of — empowering young minds to build boldly, think independently, and lead with purpose.",
      socials: {}
    },
    {
      name: "Anusha Ravi",
      role: "Product Leader",
      organization: "Intuit",
      description: "Big fan of starting small and growing fast!",
      socials: {}
    },
    {
      name: "Hatim Kagalwala",
      role: "Applied Scientist",
      organization: "Amazon",
      description: "Maximally empowers individuals and organizations to think boldly, solve creatively, and build solutions that truly make an impact.",
      socials: {}
    },
    {
      name: "Milankumar Rana",
      role: "Software Engineer Advisor",
      organization: "FedEx",
      description: "Innovation happens when young minds are given the right platform and mentorship to transform ideas into reality.",
      socials: {}
    }
  ];

  const organizingBoard = [
    {
      name: "Rishul Chanana",
      role: "Founder & CEO",
      organization: "Maximally",
      description: "Building the future by empowering builders to create meaningful impact through innovation.",
      socials: {}
    }
  ];

  const developers: TeamMember[] = [
    // Placeholder for developer team - to be populated with actual data
  ];

  const activeContributors: TeamMember[] = [
    // Placeholder for active contributors - to be populated with actual data
  ];

  const alumni: TeamMember[] = [
    // Placeholder for alumni - to be populated with actual data
  ];

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
          {members.map((member, index) => (
            <div 
              key={index} 
              className={`pixel-card bg-black border-2 ${colorTheme.border} p-6 hover:scale-105 transition-all duration-300 hover:border-maximally-yellow`}
            >
              <div className={`minecraft-block ${colorTheme.bg} w-12 h-12 mx-auto mb-4 flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-black" />
              </div>
              
              <h3 className="font-press-start text-sm mb-2 text-center text-white">
                {member.name}
              </h3>
              
              <p className="font-jetbrains text-xs text-gray-300 text-center mb-1">
                {member.role}
              </p>
              
              {member.organization && (
                <p className="font-jetbrains text-xs font-bold text-white text-center mb-3">
                  {member.organization}
                </p>
              )}
              
              {member.description && (
                <p className="font-jetbrains text-xs text-gray-300 text-center italic">
                  "{member.description}"
                </p>
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
        description="Meet Maximally's core team - advisors, organizing board, developers, and contributors building the world's premier hackathon league."
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
                The passionate builders, advisors, and contributors making Maximally the world's premier hackathon league.
              </p>
              
              {/* Back to People Button */}
              <Link
                to="/people"
                className="inline-block minecraft-block bg-maximally-yellow text-black px-4 py-2 hover:bg-maximally-red transition-colors"
              >
                <span className="font-press-start text-xs">← BACK TO PEOPLE</span>
              </Link>
            </section>

            {/* Team Sections */}
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
              emptyMessage="The technical team building our platform - profiles coming soon!"
            />

            <TeamSection
              title="Active Contributors"
              members={activeContributors}
              icon={Heart}
              colorTheme={{
                bg: "bg-purple-500",
                text: "text-purple-500",
                border: "border-purple-500"
              }}
              emptyMessage="Community members actively contributing to our mission - profiles coming soon!"
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
              emptyMessage="Past core members who helped build our foundation - profiles coming soon!"
            />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PeopleCore;