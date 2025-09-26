import { BookOpen, Download, FileText, HelpCircle, Users, Gavel } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const Docs = () => {
  const docCategories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      color: "maximally-red",
      docs: [
        { name: "Platform Overview", desc: "Complete guide to Maximally ecosystem", link: "#overview" },
        { name: "Quick Start Guide", desc: "Get up and running in 5 minutes", link: "#quickstart" },
        { name: "Account Setup", desc: "Setting up your builder profile", link: "#account" },
      ]
    },
    {
      title: "For Participants",
      icon: Users,
      color: "maximally-blue", 
      docs: [
        { name: "Participant Handbook", desc: "Everything you need to know about participating", link: "#participant-handbook" },
        { name: "Hackathon Rules", desc: "Standard rules and guidelines", link: "#rules" },
        { name: "Team Formation", desc: "How to form and manage teams", link: "#teams" },
        { name: "Submission Guidelines", desc: "Project submission requirements", link: "#submissions" },
      ]
    },
    {
      title: "For Judges",
      icon: Gavel,
      color: "maximally-green",
      docs: [
        { name: "Judge Handbook", desc: "Complete judging guidelines and criteria", link: "#judge-handbook" },
        { name: "Scoring Rubric", desc: "How to evaluate projects fairly", link: "#scoring" },
        { name: "Judge Dashboard", desc: "Using the judging platform", link: "#judge-dashboard" },
        { name: "Best Practices", desc: "Tips for effective judging", link: "#judge-tips" },
      ]
    },
    {
      title: "For Partners",
      icon: FileText,
      color: "maximally-yellow",
      docs: [
        { name: "Partnership Guide", desc: "How to partner with Maximally", link: "#partnership" },
        { name: "Sponsor Deck", desc: "Sponsorship opportunities and benefits", link: "#sponsor-deck" },
        { name: "Brand Guidelines", desc: "Using Maximally brand assets", link: "#brand" },
        { name: "Press Kit", desc: "Media resources and guidelines", link: "/press" },
      ]
    }
  ];

  const quickLinks = [
    { name: "FAQ", desc: "Frequently asked questions", link: "#faq", color: "bg-maximally-red" },
    { name: "API Reference", desc: "MaximallyHack API documentation", link: "#api", color: "bg-maximally-blue" },
    { name: "Changelog", desc: "Platform updates and changes", link: "#changelog", color: "bg-maximally-green" },
    { name: "Support", desc: "Get help and support", link: "/contact", color: "bg-maximally-yellow" },
  ];

  return (
    <div className="min-h-screen pt-20">
      <SEO 
        title="Documentation | Complete Resource Library | Maximally"
        description="Access comprehensive documentation for Maximally platform including participant guides, judge handbook, partnership information, and technical resources."
      />

      {/* Hero Section */}
      <section className="py-20 bg-maximally-black relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 animate-grid-flow" />
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="font-press-start text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            <span className="bg-maximally-red/20 px-2">Documentation</span> Center
          </h1>
          <p className="font-jetbrains text-white/90 text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
            Complete resource library with guides, handbooks, and documentation for all things Maximally.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link key={index} to={link.link} 
                    className={`${link.color} text-white p-6 rounded-lg hover:scale-105 transition-transform text-center`}>
                <h3 className="font-press-start text-lg mb-3">{link.name}</h3>
                <p className="font-jetbrains text-sm opacity-90">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">Documentation</h2>
          <div className="space-y-12">
            {docCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-12 h-12 bg-${category.color} rounded-lg flex items-center justify-center`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-press-start text-2xl">{category.title}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.docs.map((doc, docIndex) => (
                    <Link key={docIndex} to={doc.link} 
                          className="p-6 bg-gray-50 rounded-lg hover:scale-105 transition-transform">
                      <h4 className="font-press-start text-lg mb-3">{doc.name}</h4>
                      <p className="font-jetbrains text-gray-600 text-sm">{doc.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-press-start text-3xl mb-6">Frequently Asked Questions</h2>
            <Link to="/docs/faq" className="pixel-button bg-maximally-red text-white px-6 py-3 hover:bg-maximally-yellow hover:text-black transition-all">
              View All FAQs
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-press-start text-lg mb-4">What is Maximally?</h3>
              <p className="font-jetbrains text-gray-600">
                Maximally is a builder-first platform for hackathons, competitions, and creative systems where ambitious builders worldwide prove their worth.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-press-start text-lg mb-4">How do I participate?</h3>
              <p className="font-jetbrains text-gray-600">
                Check our Events page for upcoming hackathons, register for the ones that interest you, and start building amazing projects.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-press-start text-lg mb-4">Can I judge events?</h3>
              <p className="font-jetbrains text-gray-600">
                Yes! We're always looking for experienced professionals to join our judging panel. Apply through our People page.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-press-start text-lg mb-4">How do partnerships work?</h3>
              <p className="font-jetbrains text-gray-600">
                We offer various partnership opportunities from sponsorships to collaborations. Check our Partnership Guide for details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-maximally-black text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <HelpCircle className="h-8 w-8 text-maximally-red" />
            <h2 className="font-press-start text-3xl">Need Help?</h2>
          </div>
          <p className="font-jetbrains text-xl mb-8 max-w-3xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="pixel-button bg-maximally-red text-white px-8 py-4 hover:bg-maximally-yellow hover:text-black transition-all">
              Contact Support
            </Link>
            <Link to="/docs/faq" className="pixel-button bg-black border-2 border-maximally-red text-white px-8 py-4 hover:border-maximally-yellow transition-all">
              Browse FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Docs;