import { Star, Users, Code, GraduationCap, LucideIcon } from 'lucide-react';
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
      name: "Milankumar Rana",
      role: "Software Engineer Advisor",
      organization: "FedEx",
      description: "Innovation happens when young minds are given the right platform and mentorship to transform ideas into reality.",
      socials: {}
    },
    {
      name: "Vikranth Kumar Shivaa",
      role: "Advisor & Mentor",
      organization: "Maximally",
      description: "Vikranth has been central to Maximally's growth — helping us shape the Grand Indian Hackathon season and guiding our organizing efforts with clarity and consistency.",
      socials: {}
    }
  ];

  const organizingBoard = [
    {
      name: "Rishul Chanana",
      role: "Founder & CEO",
      organization: "Maximally",
      description: "Building the future by creating a culture where young builders can thrive through high-stakes competitions.",
      socials: {}
    },
    {
      name: "Drishti Arora",
      role: "Chief Operating Officer (COO)",
      organization: "Maximally",
      description: "Keeps Maximally's gears running smoothly, balancing scale with execution.",
      socials: {}
    },
    {
      name: "Raghwender (Raghav) Vasisth",
      role: "President, Maximally Federation of Hackathon Organizers and Partners (MFHOP)",
      organization: "Maximally",
      description: "Spearheading our federation, connecting hackathon leaders across India into one network.",
      socials: {}
    },
    {
      name: "Pranav Marjara",
      role: "Operations & Coordination Lead",
      organization: "Maximally",
      description: "The glue of the org — manages internal flow, ensures teams stay in sync, and keeps chaos in check.",
      socials: {}
    }
  ];

  const developers: TeamMember[] = [
    {
      name: "Gautam Gambhir",
      role: "Head of Engineering",
      organization: "Maximally",
      description: "Architects the tech behind Maximally.in and pushes our platform to new heights.",
      socials: {}
    },
    {
      name: "Pranati Dubey",
      role: "Culture & Systems Engineer",
      organization: "Maximally",
      description: "Bridges code and culture, shaping both our platform and our community experience.",
      socials: {}
    }
  ];


  const alumni: TeamMember[] = [
    {
      name: "Janak Walia",
      role: "Founding Contributor",
      organization: "Maximally",
      description: "Helped shape Maximally during its earliest days and played a key role in launching our first Startup Makeathon.",
      socials: {}
    }
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
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PeopleCore;