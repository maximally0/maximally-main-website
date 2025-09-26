
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import TallyFormDialog from "@/components/TallyFormDialog";
import { useState } from "react";

const About = () => {
  const [isTallyFormOpen, setIsTallyFormOpen] = useState(false);
  return (
    <div className="min-h-screen pt-32">
      <SEO 
        title="About Maximally | Where Global Innovators Are Born"
        description="Join the global community for ambitious builders. Learn entrepreneurship, AI, and innovation through our transformative hackathons."
      />

      {/* Hero Section */}
      <section className="py-20 bg-maximally-black relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 animate-grid-flow" />
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="font-press-start text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            <span className="bg-[#39FF14]/20 px-2">Maximally:</span> Where Global{" "}
            <span className="bg-[#FF5F5F]/20 px-2">Innovators</span> Are Born
          </h1>
          <p className="font-jetbrains text-white/80 text-xl md:text-2xl mb-8">
            Ready to change the world?
          </p>
          <TallyFormDialog open={isTallyFormOpen} onOpenChange={setIsTallyFormOpen} />
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-press-start text-3xl mb-8">Our Mission</h2>
          <p className="font-jetbrains text-xl max-w-3xl mx-auto">
            Maximally isn't just an{" "}
            <span className="bg-[#39FF14]/20 px-2">educational platform</span>;
            it's a{" "}
            <span className="bg-[#FF5F5F]/20 px-2">launchpad</span> for global
            innovators and leaders.
          </p>
        </div>
      </section>

      {/* Bootcamp Experience */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">The Hackathon Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="font-press-start text-lg mb-3">Expert-Led Sessions</h3>
              <p className="font-jetbrains">Learn from industry leaders and successful founders</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-press-start text-lg mb-3">IRL Meetups</h3>
              <p className="font-jetbrains">Connect with peers in exclusive networking events</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-press-start text-lg mb-3">1:1 Mentorship</h3>
              <p className="font-jetbrains">Personal guidance from industry veterans</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-press-start text-lg mb-3">Project Building</h3>
              <p className="font-jetbrains">Create real products with cutting-edge tech</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-6">1️⃣</div>
              <h3 className="font-press-start text-xl mb-4">Apply</h3>
              <p className="font-jetbrains">Submit your application and show us your potential</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-6">2️⃣</div>
              <h3 className="font-press-start text-xl mb-4">Learn</h3>
              <p className="font-jetbrains">Master real-world skills through intensive training</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-6">3️⃣</div>
              <h3 className="font-press-start text-xl mb-4">Succeed</h3>
              <p className="font-jetbrains">Join our alumni network and access lifetime opportunities</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Inner Circle */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">The Inner Circle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#39FF14]/10 p-6 rounded-lg">
              <h3 className="font-press-start text-xl mb-4">🏆 Certificate of Excellence</h3>
              <p className="font-jetbrains">Your badge of honor in the digital age</p>
            </div>
            <div className="bg-[#FF5F5F]/10 p-6 rounded-lg">
              <h3 className="font-press-start text-xl mb-4">🌐 Lifetime Network</h3>
              <p className="font-jetbrains">Connect with India's future leaders</p>
            </div>
            <div className="bg-[#B400FF]/10 p-6 rounded-lg">
              <h3 className="font-press-start text-xl mb-4">💼 Career Growth</h3>
              <p className="font-jetbrains">Access to internships and collaborations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-press-start text-3xl mb-8">Our Vision</h2>
          <p className="font-jetbrains text-xl max-w-3xl mx-auto mb-12">
            We're building the world's most powerful network of young{" "}
            <span className="bg-[#39FF14]/20 px-2">innovators</span>,{" "}
            <span className="bg-[#FF5F5F]/20 px-2">entrepreneurs</span>, and{" "}
            <span className="bg-[#B400FF]/20 px-2">changemakers</span>. Our mission
            is to foster ambition, drive change, and create the next generation of
            world-class founders.
          </p>
          <div className="flex justify-center">
            <Link
              to="/bootcamps"
              className="pixel-button bg-maximally-blue text-white inline-flex items-center gap-2 px-8 py-4 text-lg hover:scale-105 transform transition-all"
            >
              <span>Ready to Maximize Your Potential?</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Progressive Schools Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-press-start text-3xl mb-8">🏫 Progressive Schools Wall</h2>
          <p className="font-jetbrains text-xl mb-8">
            Discover India's most innovative schools that are reshaping education.
            These institutions share our vision for future-ready learning.
          </p>
          <Link
            to="/wall-of-progressive-schools"
            className="pixel-button bg-maximally-blue text-white inline-flex items-center gap-2 px-8 py-4 text-lg hover:scale-105 transform transition-all"
          >
            <span>View Progressive Schools</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
