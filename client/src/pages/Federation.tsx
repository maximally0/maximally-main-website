import { ArrowRight, Users, Globe, Handshake, Target, Award, Network, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import TallyFormDialog from "@/components/TallyFormDialog";
import { useState } from "react";

const Federation = () => {
  const [isTallyFormOpen, setIsTallyFormOpen] = useState(false);

  const federationBenefits = [
    {
      title: "Standardized Framework",
      description: "Use our proven hackathon framework and best practices",
      icon: Target,
      color: "maximally-red"
    },
    {
      title: "Shared Resources", 
      description: "Access judge pools, mentors, and promotional channels",
      icon: Network,
      color: "maximally-blue"
    },
    {
      title: "Cross-Promotion",
      description: "Tap into our global network of builders and participants", 
      icon: Globe,
      color: "maximally-green"
    },
    {
      title: "Quality Assurance",
      description: "Maintain high standards with our certification process",
      icon: Award,
      color: "maximally-yellow"
    }
  ];

  const memberOrganizations = [
    {
      name: "Masters' Union",
      type: "Educational Institution", 
      contribution: "Student outreach and mentorship",
      region: "India",
      logo: "bg-blue-500"
    },
    {
      name: "MakeX",
      type: "Innovation Platform",
      contribution: "Sponsorship and technical resources", 
      region: "Asia-Pacific",
      logo: "bg-green-500"
    },
    {
      name: "YRI (Young Researcher Initiative)",
      type: "Research Network",
      contribution: "Academic mentors and validation",
      region: "Global",
      logo: "bg-purple-500"
    },
    {
      name: "Calyptus", 
      type: "Tech Platform",
      contribution: "Platform infrastructure and tools",
      region: "North America",
      logo: "bg-orange-500"
    }
  ];

  const upcomingEvents = [
    {
      name: "MFHOP Annual Summit",
      date: "March 15-17, 2025",
      location: "Virtual + Regional Hubs",
      description: "Connect with organizers worldwide and share best practices"
    },
    {
      name: "Regional Organizer Meetup",
      date: "January 20, 2025", 
      location: "Mumbai, India",
      description: "Local networking and collaboration planning"
    },
    {
      name: "Best Practices Workshop",
      date: "February 10, 2025",
      location: "Online",
      description: "Deep dive into successful hackathon organization"
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      <SEO 
        title="MFHOP Federation | Network of Hackathon Organizers | Maximally"
        description="Join MFHOP (Maximally Federation of Hackathon Organizer Professionals) - the global network standardizing and scaling hackathon experiences worldwide."
      />

      {/* Hero Section */}
      <section className="py-20 bg-maximally-black relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 animate-grid-flow" />
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="font-press-start text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            <span className="bg-maximally-red/20 px-2">MFHOP</span><br/>
            Federation of Hackathon Organizers
          </h1>
          <p className="font-jetbrains text-white/90 text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
            The global network standardizing and scaling hackathon experiences. Join organizers worldwide in building better events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsTallyFormOpen(true)}
              className="pixel-button bg-maximally-red text-black px-8 py-4 hover:bg-maximally-yellow transition-all"
            >
              Join Federation
            </button>
            <Link to="/contact" className="pixel-button bg-black border-2 border-maximally-red text-white px-8 py-4 hover:border-maximally-yellow transition-all">
              Partnership Inquiry
            </Link>
          </div>
          <TallyFormDialog open={isTallyFormOpen} onOpenChange={setIsTallyFormOpen} />
        </div>
      </section>

      {/* What is MFHOP */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-press-start text-3xl mb-8">What is MFHOP?</h2>
            <p className="font-jetbrains text-xl text-gray-600 mb-12 leading-relaxed">
              <strong>Maximally Federation of Hackathon Organizer Professionals</strong> is a global network that connects 
              hackathon organizers, shares best practices, and maintains quality standards across events worldwide.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-maximally-red rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-press-start text-lg mb-4">Unite Organizers</h3>
                <p className="font-jetbrains text-gray-600">Connect hackathon organizers from around the world</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-maximally-blue rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-press-start text-lg mb-4">Standardize Quality</h3>
                <p className="font-jetbrains text-gray-600">Establish best practices and quality benchmarks</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-maximally-green rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-press-start text-lg mb-4">Scale Impact</h3>
                <p className="font-jetbrains text-gray-600">Amplify reach and impact through collaboration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Federation Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-press-start text-3xl mb-6">Why Join MFHOP?</h2>
            <p className="font-jetbrains text-xl text-gray-600 max-w-3xl mx-auto">
              Access resources, networks, and expertise to level up your hackathon organizing game
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {federationBenefits.map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:scale-105 transition-transform">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-${benefit.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-press-start text-xl mb-3">{benefit.title}</h3>
                    <p className="font-jetbrains text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member Organizations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-press-start text-3xl mb-6">Member Organizations</h2>
            <p className="font-jetbrains text-xl text-gray-600">
              Leading organizations already part of the federation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {memberOrganizations.map((org, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:scale-105 transition-transform">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 ${org.logo} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Handshake className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-press-start text-lg">{org.name}</h3>
                      <span className="bg-gray-200 px-2 py-1 rounded text-xs font-jetbrains">{org.region}</span>
                    </div>
                    <div className="font-jetbrains text-maximally-blue mb-2">{org.type}</div>
                    <p className="font-jetbrains text-gray-600 text-sm">{org.contribution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <div className="bg-maximally-red/10 p-6 rounded-lg max-w-2xl mx-auto">
              <h3 className="font-press-start text-xl mb-4">Your Organization Here</h3>
              <p className="font-jetbrains text-gray-600 mb-6">
                Join these leading organizations in shaping the future of hackathons
              </p>
              <button 
                onClick={() => setIsTallyFormOpen(true)}
                className="pixel-button bg-maximally-red text-white px-6 py-3 hover:bg-maximally-yellow hover:text-black transition-all"
              >
                Apply for Membership
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-press-start text-3xl mb-6">Federation Events</h2>
            <p className="font-jetbrains text-xl text-gray-600">
              Connect, learn, and collaborate with fellow organizers
            </p>
          </div>
          <div className="space-y-6">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-maximally-blue rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-press-start text-xl mb-2">{event.name}</h3>
                      <div className="font-jetbrains text-maximally-red mb-2">{event.date}</div>
                      <div className="font-jetbrains text-gray-500 mb-3">{event.location}</div>
                      <p className="font-jetbrains text-gray-600">{event.description}</p>
                    </div>
                  </div>
                  <Link to="/contact" className="pixel-button bg-maximally-blue text-white px-4 py-2 text-sm hover:bg-maximally-green transition-all">
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-press-start text-3xl mb-6">How to Join</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-maximally-red rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="font-press-start text-white text-lg">1</span>
              </div>
              <h3 className="font-press-start text-lg mb-3">Apply</h3>
              <p className="font-jetbrains text-gray-600 text-sm">Submit membership application with your organization details</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-maximally-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="font-press-start text-white text-lg">2</span>
              </div>
              <h3 className="font-press-start text-lg mb-3">Review</h3>
              <p className="font-jetbrains text-gray-600 text-sm">Federation committee reviews your hackathon experience</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-maximally-green rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="font-press-start text-white text-lg">3</span>
              </div>
              <h3 className="font-press-start text-lg mb-3">Onboard</h3>
              <p className="font-jetbrains text-gray-600 text-sm">Get access to resources and connect with members</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-maximally-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="font-press-start text-white text-lg">4</span>
              </div>
              <h3 className="font-press-start text-lg mb-3">Collaborate</h3>
              <p className="font-jetbrains text-gray-600 text-sm">Start organizing better hackathons together</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-maximally-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-press-start text-3xl mb-8">Ready to Level Up Your Events?</h2>
          <p className="font-jetbrains text-xl mb-8 max-w-3xl mx-auto">
            Join the global federation of hackathon organizers and take your events to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsTallyFormOpen(true)}
              className="pixel-button bg-maximally-red text-black px-8 py-4 hover:bg-maximally-yellow transition-all"
            >
              Join MFHOP
            </button>
            <Link to="/contact" className="pixel-button bg-black border-2 border-maximally-red text-white px-8 py-4 hover:border-maximally-yellow transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Federation;