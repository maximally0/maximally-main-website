import { Users, Trophy, MapPin, ExternalLink, Mail, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const People = () => {
  const coreTeam = [
    {
      name: "Task Force Alpha",
      role: "Core Builder",
      bio: "High-agency builder driving hackathon innovation",
      avatar: "bg-maximally-red",
    },
    {
      name: "Task Force Beta", 
      role: "Platform Lead",
      bio: "Building MaximallyHack and infrastructure",
      avatar: "bg-maximally-blue",
    },
    {
      name: "Task Force Gamma",
      role: "Community Lead", 
      bio: "Growing the global builder network",
      avatar: "bg-maximally-green",
    },
    {
      name: "Task Force Delta",
      role: "Content Lead",
      bio: "Managing Studios and content creation",
      avatar: "bg-maximally-yellow",
    },
  ];

  const judges = [
    {
      name: "Industry Leader",
      title: "Tech Veteran",
      company: "Major Tech Company",
      expertise: "AI, ML, Product",
      bio: "20+ years in technology innovation",
      avatar: "bg-blue-500",
    },
    {
      name: "Startup Founder", 
      title: "Serial Entrepreneur",
      company: "Multiple Exits",
      expertise: "Scaling, Strategy",
      bio: "Built and sold 3 startups",
      avatar: "bg-green-500",
    },
    {
      name: "Innovation Expert",
      title: "Future Builder",
      company: "Research Institute", 
      expertise: "Emerging Tech",
      bio: "PhD in Computer Science, 50+ patents",
      avatar: "bg-purple-500",
    },
    {
      name: "Product Designer",
      title: "UX/UI Expert",
      company: "Design Studio",
      expertise: "Design, UX Research",
      bio: "Award-winning product designer",
      avatar: "bg-pink-500",
    },
    {
      name: "Investment Partner",
      title: "VC Partner", 
      company: "Early Stage VC",
      expertise: "Funding, Growth",
      bio: "Invested in 100+ startups",
      avatar: "bg-orange-500",
    },
    {
      name: "Engineering Manager",
      title: "Tech Lead",
      company: "FAANG Company",
      expertise: "Engineering, Scale",
      bio: "Managing 50+ engineer teams",
      avatar: "bg-cyan-500",
    },
  ];

  const mentors = [
    {
      name: "Growth Advisor",
      expertise: "Marketing, Growth Hacking",
      company: "Growth Agency",
      avatar: "bg-red-400",
    },
    {
      name: "Sales Expert", 
      expertise: "B2B Sales, Enterprise",
      company: "Sales Consultancy",
      avatar: "bg-blue-400",
    },
    {
      name: "Technical Mentor",
      expertise: "Full Stack Development", 
      company: "Tech Consultancy",
      avatar: "bg-green-400",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      <SEO 
        title="People | Core Team, Judges & Mentors | Maximally"
        description="Meet the Maximally Task Force, our distinguished judges, and experienced mentors who make our global hackathon league possible."
      />

      {/* Hero Section */}
      <section className="py-20 bg-maximally-black relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 animate-grid-flow" />
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="font-press-start text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            The <span className="bg-maximally-red/20 px-2">People</span> Behind Maximally
          </h1>
          <p className="font-jetbrains text-white/90 text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
            Meet our Task Force, distinguished judges, and experienced mentors who make the global hackathon league possible.
          </p>
        </div>
      </section>

      {/* Core Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-press-start text-3xl mb-6">The Maximally Task Force</h2>
            <p className="font-jetbrains text-xl text-gray-600 max-w-3xl mx-auto">
              High-agency builders who move fast and ship real products. Our core team embodies the builder-first culture.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreTeam.map((member, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:scale-105 transition-transform">
                <div className={`w-20 h-20 ${member.avatar} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-press-start text-lg mb-2">{member.name}</h3>
                <div className="font-jetbrains text-maximally-red mb-3">{member.role}</div>
                <p className="font-jetbrains text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/careers" className="pixel-button bg-maximally-red text-white px-8 py-4 hover:bg-maximally-yellow hover:text-black transition-all">
              Join the Task Force
            </Link>
          </div>
        </div>
      </section>

      {/* Judges Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-press-start text-3xl mb-6">Our Judges</h2>
            <p className="font-jetbrains text-xl text-gray-600 max-w-3xl mx-auto">
              Industry veterans, successful founders, and innovation experts who evaluate and mentor our participants.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {judges.map((judge, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 ${judge.avatar} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-press-start text-lg mb-1">{judge.name}</h3>
                    <div className="font-jetbrains text-maximally-blue mb-2">{judge.title}</div>
                    <div className="font-jetbrains text-gray-600 text-sm mb-2">{judge.company}</div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {judge.expertise.split(', ').map((skill, skillIndex) => (
                        <span key={skillIndex} className="bg-gray-100 px-2 py-1 rounded text-xs font-jetbrains">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="font-jetbrains text-gray-600 text-sm">{judge.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <div className="bg-maximally-red/10 p-6 rounded-lg max-w-2xl mx-auto">
              <h3 className="font-press-start text-xl mb-4">Want to Judge?</h3>
              <p className="font-jetbrains text-gray-600 mb-6">
                Join our panel of judges and help evaluate the next generation of builders.
              </p>
              <Link to="/contact" className="pixel-button bg-maximally-red text-white px-6 py-3 hover:bg-maximally-yellow hover:text-black transition-all">
                Apply to Judge
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mentors & Advisors Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-press-start text-3xl mb-6">Mentors & Advisors</h2>
            <p className="font-jetbrains text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced professionals who provide ongoing guidance and support to our community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mentors.map((mentor, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:scale-105 transition-transform">
                <div className={`w-16 h-16 ${mentor.avatar} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-press-start text-lg mb-2">{mentor.name}</h3>
                <div className="font-jetbrains text-maximally-green mb-3">{mentor.expertise}</div>
                <div className="font-jetbrains text-gray-600 text-sm">{mentor.company}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <div className="bg-maximally-blue/10 p-6 rounded-lg max-w-2xl mx-auto">
              <h3 className="font-press-start text-xl mb-4">Become a Mentor</h3>
              <p className="font-jetbrains text-gray-600 mb-6">
                Share your expertise and help guide the next generation of builders.
              </p>
              <Link to="/contact" className="pixel-button bg-maximally-blue text-white px-6 py-3 hover:bg-maximally-green transition-all">
                Apply to Mentor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-maximally-black text-white">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">Our Network</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-press-start text-4xl text-maximally-red mb-2">50+</div>
              <div className="font-jetbrains text-gray-300">Judges</div>
            </div>
            <div>
              <div className="font-press-start text-4xl text-maximally-blue mb-2">20+</div>
              <div className="font-jetbrains text-gray-300">Mentors</div>
            </div>
            <div>
              <div className="font-press-start text-4xl text-maximally-green mb-2">10+</div>
              <div className="font-jetbrains text-gray-300">Task Force</div>
            </div>
            <div>
              <div className="font-press-start text-4xl text-maximally-yellow mb-2">5+</div>
              <div className="font-jetbrains text-gray-300">Advisors</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default People;