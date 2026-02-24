
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, MessageSquare } from 'lucide-react';

const SchoolVsLife2025 = () => {
  const content = (
    <>
      <p className="lead font-space text-lg mb-6">
        "I got straight A's… but no clue how to write an email, pitch an idea, or even file taxes."
      </p>

      <p className="mb-6">
        Sound familiar? Let's be real: India's education system is great at teaching formulas, dates, and theories — but when it comes to life after school, you're pretty much left to figure it out on your own.
      </p>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🧠 School ≠ Life</h2>
        <p className="mb-4">Here's the gap:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pixel-border p-6 bg-maximally-blue/5 my-8">
          <div>
            <h3 className="font-space font-bold text-lg mb-2">School Teaches You...</h3>
            <ul className="space-y-2">
              <li>How to solve for X</li>
              <li>Memorizing history</li>
              <li>Writing exams</li>
              <li>Theory-heavy learning</li>
            </ul>
          </div>
          <div>
            <h3 className="font-space font-bold text-lg mb-2">Real Life Demands...</h3>
            <ul className="space-y-2">
              <li>How to sell your ideas</li>
              <li>Building your own story</li>
              <li>Writing cold emails</li>
              <li>Experience-driven doing</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🚀 Enter Maximally: Real-World Skills for Teen Trailblazers</h2>
        <p className="mb-4">We built Maximally to be what school isn't.</p>

        <div className="pixel-border p-6 bg-maximally-red/5 my-8">
          <h3 className="font-space font-bold text-xl mb-4">💡 Our 7-Day Summer Bootcamp</h3>
          <p>From June 1–7, we're hosting an immersive bootcamp for India's most ambitious teens.</p>
          <ul className="space-y-2 mt-4">
            <li>🧑‍💼 Entrepreneurship – Build your own startup idea</li>
            <li>📣 Public Speaking – Master stage confidence and storytelling</li>
            <li>🧠 AI + No-Code – Learn how to use modern tools to build without coding</li>
            <li>🌍 MUN x Debates – Sharpen your diplomacy and argumentation skills</li>
            <li>🎯 Personal Branding – Design your online presence like a founder</li>
          </ul>
        </div>

        <div className="text-center my-8">
          <Button 
            className="bg-maximally-green hover:bg-maximally-green/90 text-white px-8 py-6 text-lg"
            onClick={() => window.location.href = 'https://www.maximally.in/bootcamps'}
          >
            Apply for Summer Bootcamp 2025
          </Button>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🔗 Learn More About This Global Movement</h2>
        <ul className="space-y-4">
          <li><a href="https://hbr.org/2019/10/why-companies-value-real-world-skills-over-degrees" className="text-maximally-blue hover:underline">📚 Why Real-World Skills Matter More Than Degrees – Harvard Business Review</a></li>
          <li><a href="https://www.forbes.com/sites/allbusiness/2019/05/26/teen-entrepreneurs-success-stories" className="text-maximally-blue hover:underline">🧑‍💻 Teen Entrepreneurs Changing the World – Forbes</a></li>
          <li><a href="https://www.ted.com/talks/sir_ken_robinson_do_schools_kill_creativity" className="text-maximally-blue hover:underline">🎙️ Sir Ken Robinson on Why School Kills Creativity – TED Talk</a></li>
          <li><a href="https://www.unicef.org/education/real-life-skills" className="text-maximally-blue hover:underline">🌍 UNICEF Report: Education Needs to Prepare Kids for Life, Not Just Exams</a></li>
        </ul>
      </section>

      <div className="flex justify-center gap-4 mt-8">
        <Button
          variant="outline"
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Why School Doesn\'t Teach You Real Life - A must-read for every student!')}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
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
          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Check out this article on why school doesn\'t teach real life skills: ' + window.location.href)}`, '_blank')}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Share on WhatsApp
        </Button>
      </div>
    </>
  );

  return (
    <BlogPost
      title="Why School Doesn't Teach You Real Life (And What We're Doing About It)"
      date="April 17, 2025"
      readTime="5 min read"
      content={content}
    />
  );
};

export default SchoolVsLife2025;
