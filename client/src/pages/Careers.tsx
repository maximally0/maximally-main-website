import { ArrowRight, Code, Users, Megaphone, Palette, Globe, Target } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import TallyFormDialog from "@/components/TallyFormDialog";
import { useState } from "react";

const Careers = () => {
  const [isTallyFormOpen, setIsTallyFormOpen] = useState(false);
  
  const openRoles = [
    {
      title: "Platform Engineer",
      department: "Engineering",
      type: "Full-time",
      location: "Remote",
      icon: Code,
      color: "maximally-red",
      description: "Build and scale MaximallyHack platform infrastructure",
      requirements: [
        "3+ years full-stack development",
        "Experience with React, Node.js, PostgreSQL",
        "DevOps and cloud deployment experience",
        "High-agency, builder mindset"
      ]
    },
    {
      title: "Community Manager", 
      department: "Community",
      type: "Full-time",
      location: "Remote",
      icon: Users,
      color: "maximally-blue",
      description: "Grow and engage our global builder community",
      requirements: [
        "2+ years community management",
        "Experience with Discord, social media",
        "Strong communication skills",
        "Passion for hackathon culture"
      ]
    },
    {
      title: "Content Creator",
      department: "Studios",
      type: "Part-time",
      location: "Remote",
      icon: Palette,
      color: "maximally-green", 
      description: "Create engaging content for our media vertical",
      requirements: [
        "Video editing and design skills",
        "Social media content experience",
        "Understanding of tech/startup culture",
        "Portfolio of creative work"
      ]
    },
    {
      title: "Marketing Lead",
      department: "Growth",
      type: "Full-time", 
      location: "Remote",
      icon: Megaphone,
      color: "maximally-yellow",
      description: "Drive growth and brand awareness globally",
      requirements: [
        "3+ years marketing experience", 
        "B2B and B2C marketing background",
        "Data-driven approach",
        "Experience with tech/developer audiences"
      ]
    }
  ];

  const taskForceValues = [
    {
      title: "High Agency",
      description: "We take ownership and drive initiatives forward without waiting for permission",
      icon: Target,
    },
    {
      title: "Builder First",
      description: "We ship real products and value proof-of-work over credentials",
      icon: Code,
    },
    {
      title: "Move Fast",
      description: "We iterate quickly, learn from feedback, and adapt rapidly",
      icon: ArrowRight,
    },
    {
      title: "Global Impact", 
      description: "We think beyond borders and build for builders worldwide",
      icon: Globe,
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      <SEO 
        title="Careers | Join the Task Force | Maximally"
        description="Join the Maximally Task Force - a high-agency team building the future of hackathons. Remote opportunities for builders, creators, and innovators."
      />

      {/* Hero Section */}
      <section className="py-20 bg-maximally-black relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 animate-grid-flow" />
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="font-press-start text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Join the <span className="bg-maximally-red/20 px-2">Task Force</span>
          </h1>
          <p className="font-jetbrains text-white/90 text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
            High-agency builders who move fast and ship real products. Join us in building the future of hackathons.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsTallyFormOpen(true)}
              className="pixel-button bg-maximally-red text-black px-8 py-4 hover:bg-maximally-yellow transition-all"
            >
              Apply Now
            </button>
            <a href="#open-roles" className="pixel-button bg-black border-2 border-maximally-red text-white px-8 py-4 hover:border-maximally-yellow transition-all">
              View Open Roles
            </a>
          </div>
          <TallyFormDialog open={isTallyFormOpen} onOpenChange={setIsTallyFormOpen} />
        </div>
      </section>

      {/* Task Force Culture */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-press-start text-3xl mb-6">Task Force DNA</h2>
            <p className="font-jetbrains text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just a team - we're a collective of high-agency builders who believe in shipping real products and creating genuine impact.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {taskForceValues.map((value, index) => (
              <div key={index} className="text-center bg-gray-50 p-6 rounded-lg hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-maximally-red rounded-full mx-auto mb-4 flex items-center justify-center">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-press-start text-lg mb-3">{value.title}</h3>
                <p className="font-jetbrains text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section id="open-roles" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-press-start text-3xl mb-6">Open Positions</h2>
            <p className="font-jetbrains text-xl text-gray-600">
              We're looking for builders who want to make a real impact
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {openRoles.map((role, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:scale-105 transition-transform">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 bg-${role.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <role.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-press-start text-xl">{role.title}</h3>
                      <span className="bg-gray-200 px-2 py-1 rounded text-xs font-jetbrains">{role.type}</span>
                    </div>
                    <div className="font-jetbrains text-gray-600 mb-1">{role.department} • {role.location}</div>
                  </div>
                </div>
                
                <p className="font-jetbrains text-gray-600 mb-6">{role.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-press-start text-sm mb-3">Requirements:</h4>
                  <ul className="space-y-2">
                    {role.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="font-jetbrains text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-maximally-red mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  onClick={() => setIsTallyFormOpen(true)}
                  className={`pixel-button bg-${role.color} text-white px-6 py-3 hover:scale-105 transition-all w-full flex items-center justify-center gap-2`}
                >
                  <span>Apply for this role</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Perks */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-press-start text-3xl mb-6">Why Join Us?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center bg-maximally-red/10 p-6 rounded-lg">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="font-press-start text-lg mb-3">Remote First</h3>
              <p className="font-jetbrains text-gray-600">Work from anywhere in the world with flexible hours</p>
            </div>
            <div className="text-center bg-maximally-blue/10 p-6 rounded-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-press-start text-lg mb-3">Equity & Growth</h3>
              <p className="font-jetbrains text-gray-600">Ownership in what we build and accelerated learning</p>
            </div>
            <div className="text-center bg-maximally-green/10 p-6 rounded-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-press-start text-lg mb-3">Real Impact</h3>
              <p className="font-jetbrains text-gray-600">Shape the future of hackathons and builder culture</p>
            </div>
            <div className="text-center bg-maximally-yellow/10 p-6 rounded-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-press-start text-lg mb-3">Move Fast</h3>
              <p className="font-jetbrains text-gray-600">Ship products quickly without bureaucracy</p>
            </div>
            <div className="text-center bg-purple-100 p-6 rounded-lg">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-press-start text-lg mb-3">Amazing Network</h3>
              <p className="font-jetbrains text-gray-600">Work with judges, founders, and industry leaders</p>
            </div>
            <div className="text-center bg-pink-100 p-6 rounded-lg">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-press-start text-lg mb-3">Creative Freedom</h3>
              <p className="font-jetbrains text-gray-600">Bring your ideas to life with minimal constraints</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-press-start text-3xl mb-6">Application Process</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-maximally-red rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="font-press-start text-white text-lg">1</span>
              </div>
              <h3 className="font-press-start text-lg mb-3">Apply</h3>
              <p className="font-jetbrains text-gray-600 text-sm">Submit your application with portfolio/work samples</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-maximally-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="font-press-start text-white text-lg">2</span>
              </div>
              <h3 className="font-press-start text-lg mb-3">Screen</h3>
              <p className="font-jetbrains text-gray-600 text-sm">Initial conversation about fit and interests</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-maximally-green rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="font-press-start text-white text-lg">3</span>
              </div>
              <h3 className="font-press-start text-lg mb-3">Build</h3>
              <p className="font-jetbrains text-gray-600 text-sm">Work on a small project together</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-maximally-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="font-press-start text-white text-lg">4</span>
              </div>
              <h3 className="font-press-start text-lg mb-3">Join</h3>
              <p className="font-jetbrains text-gray-600 text-sm">Welcome to the Task Force!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-maximally-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-press-start text-3xl mb-8">Ready to Build the Future?</h2>
          <p className="font-jetbrains text-xl mb-8 max-w-3xl mx-auto">
            Don't see a role that fits? We're always looking for exceptional builders. 
            Tell us what you want to work on and how you can contribute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsTallyFormOpen(true)}
              className="pixel-button bg-maximally-red text-black px-8 py-4 hover:bg-maximally-yellow transition-all"
            >
              Apply to Task Force
            </button>
            <Link to="/contact" className="pixel-button bg-black border-2 border-maximally-red text-white px-8 py-4 hover:border-maximally-yellow transition-all">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;