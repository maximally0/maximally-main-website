import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import TallyFormDialog from '@/components/TallyFormDialog';
import { useState } from 'react';

const About = () => {
  const [isTallyFormOpen, setIsTallyFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="About Maximally - Hackathons as Culture, Not Just Code"
        description="Learn about Maximally's mission to make hackathons open, accessible, and cultural. Discover our platform, events, and global community of teen builders."
      />

      <header className="pt-32 pb-12 text-center">
        <h1 className="font-press-start text-4xl md:text-5xl lg:text-6xl mb-6">About Maximally</h1>
        <p className="font-jetbrains text-lg text-gray-300 max-w-3xl mx-auto">A builder-first platform for hackathons, competitions, and creative systems.</p>
      </header>

      <main className="px-4 md:px-8 lg:px-24 py-12">
        <section className="mb-12">
          <h2 className="font-press-start text-2xl mb-4 text-maximally-red">What We Do</h2>
          <p className="font-jetbrains text-gray-300">We run high-agency hackathons, build tools for organizers, and grow a federation of partners and communities to support young builders worldwide.</p>
        </section>

        <section className="mb-12">
          <h2 className="font-press-start text-2xl mb-4 text-maximally-yellow">Grand Indian Hackathon Season</h2>
          <p className="font-jetbrains text-gray-300">A back-to-back series of themed hackathons across Sept-Nov 2025 showcasing intense building and real project launches.</p>
        </section>

        <section className="mb-12">
          <h2 className="font-press-start text-2xl mb-4 text-maximally-green">Join the Task Force</h2>
          <p className="font-jetbrains text-gray-300 mb-4">High-agency builders who ship. Apply to join our core team.</p>
          <div className="flex gap-4">
            <button onClick={() => setIsTallyFormOpen(true)} className="pixel-button bg-maximally-red text-black px-6 py-3">Apply</button>
            <Link to="/contact" className="pixel-button bg-black border-2 border-maximally-red text-white px-6 py-3">Contact</Link>
          </div>
          <TallyFormDialog open={isTallyFormOpen} onOpenChange={setIsTallyFormOpen} />
        </section>

        <section className="mb-24">
          <h2 className="font-press-start text-2xl mb-4">Partners & Mentors</h2>
          <p className="font-jetbrains text-gray-300">We're working with universities, sponsors, and community partners to scale hackathon culture.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;