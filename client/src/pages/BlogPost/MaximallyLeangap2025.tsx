
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const MaximallyLeangap2025 = () => {
  const content = (
    <>
      <section className="my-8">
        <p className="mb-6">
          India's teens are no longer waiting to grow up before building startups. Across cities and towns, a generation of young founders, creators, and changemakers are rising. And standing at the forefront of this revolution is Maximally — a bold new edtech platform that's building what many are calling the Leangap of India.
        </p>

        <div className="pixel-border p-6 bg-maximally-blue/5 my-8">
          <h2 className="font-space font-bold text-2xl mb-4">What is Leangap — and Why Does India Need One?</h2>
          <p className="mb-4">
            Leangap is a prestigious U.S.-based summer program where high schoolers build real startups with mentorship, resources, and community. Alumni have gone on to raise millions, build YC-backed companies, and become teen CEOs.
          </p>
          <p className="font-space font-bold text-lg mt-4">
            🚀 Leangap, reimagined for India's top 1% of teenagers who dare to think big.
          </p>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-6">Introducing Maximally Bootcamp — India's Teen Startup Playground</h2>
        <p className="mb-4">
          Maximally Bootcamp is a 7-day immersive program for students aged 13–18, designed to help them:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Launch their first startup or creative project</li>
          <li>Learn real-world skills like entrepreneurship, digital marketing, AI & no-code, public speaking, and personal branding</li>
          <li>Collaborate with India's top teen minds in guilds (startup-style teams)</li>
          <li>Pitch to real investors, mentors, and founders on Demo Day</li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-6">What Makes Maximally India's Answer to Leangap?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="pixel-border p-4">
            <h3 className="font-space font-bold text-lg mb-3">✅ Real-World Outcomes</h3>
            <p>Teens don't just learn theory. They build real startups, publish landing pages, run ads, prototype apps with AI and no-code.</p>
          </div>
          <div className="pixel-border p-4">
            <h3 className="font-space font-bold text-lg mb-3">✅ Curated Mentors</h3>
            <p>From Shark Tank founders to top YouTubers, learn from India's coolest creators and tech minds.</p>
          </div>
          <div className="pixel-border p-4">
            <h3 className="font-space font-bold text-lg mb-3">✅ Built for Indian Students</h3>
            <p>100% designed for the Indian student mindset — while keeping global ambition at its core.</p>
          </div>
          <div className="pixel-border p-4">
            <h3 className="font-space font-bold text-lg mb-3">✅ Guild System</h3>
            <p>Join dynamic guilds that mimic startup teams. Find your role as a founder, designer, speaker, or coder.</p>
          </div>
        </div>
      </section>

      <section className="my-8">
        <div className="pixel-border p-6 bg-maximally-green/5">
          <h2 className="font-space font-bold text-2xl mb-4">Join the Movement: Applications for Summer 2025 Are Open</h2>
          <p className="mb-4">If you're a teenager who dreams of:</p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Starting a company</li>
            <li>Building a personal brand</li>
            <li>Pitching ideas with confidence</li>
            <li>Learning the skills schools don't teach</li>
          </ul>
          <p className="font-space font-bold text-lg mb-4">📍 Only 1,000 spots. Curated. Competitive. Game-changing.</p>
          <div className="text-center">
            <Button asChild size="lg" className="bg-black hover:bg-black/80">
              <Link to="/bootcamps">Apply Now for Summer 2025</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Final Thoughts: This Is Just the Beginning</h2>
        <p className="mb-4">Leangap created a movement in the U.S.</p>
        <p className="font-space font-bold text-lg">Maximally is creating a revolution in India.</p>
        <p className="mt-4">
          If you believe that teenagers can be founders, innovators, and leaders — not someday, but today — then Maximally is your tribe.
        </p>
      </section>

      <div className="mt-8 space-y-4">
        <h3 className="font-space font-bold text-xl mb-4">Related Posts</h3>
        <ul className="space-y-2">
          <li>
            <Link to="/blog/school-vs-life-2025" className="text-maximally-blue hover:underline">👉 Why School Doesn't Teach You Real Life</Link>
          </li>
          <li>
            <Link to="/blog/real-world-skills-2025" className="text-maximally-blue hover:underline">👉 Why Real-World Skills Matter More Than Marks</Link>
          </li>
          <li>
            <Link to="/blog/summer-programs-2025" className="text-maximally-blue hover:underline">👉 Top Summer Programs for Teens</Link>
          </li>
        </ul>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <Button
          variant="outline"
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('How Maximally is Building the Leangap of India - A must-read for every ambitious teen!')}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
        >
          <Twitter className="w-4 h-4 mr-2" />
          Share on Twitter
        </Button>
        <Button
          variant="outline"
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
        >
          <Linkedin className="w-4 h-4 mr-2" />
          Share on LinkedIn
        </Button>
        <Button
          variant="outline"
          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Check out how Maximally is becoming India\'s Leangap: ' + window.location.href)}`, '_blank')}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Share on WhatsApp
        </Button>
      </div>
    </>
  );

  return (
    <BlogPost
      title="How Maximally is Building the Leangap of India"
      date="April 17, 2025"
      readTime="5 min read"
      content={content}
    />
  );
};

export default MaximallyLeangap2025;
