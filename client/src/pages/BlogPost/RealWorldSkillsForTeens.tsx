
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const RealWorldSkillsForTeens = () => {
  const content = (
    <>
      <p className="lead mb-8">
        🎯 The Real Test Begins After the Exam Ends
      </p>

      <p className="mb-4">
        You've spent years solving algebra problems, memorizing history dates, and writing essays about Shakespeare. But the truth hits hard when you step outside the classroom: No one ever taught you how to manage money, speak confidently, or turn your idea into a business.
      </p>

      <p className="mb-8">
        Let's be honest—school often skips the most important lessons.
      </p>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">What Are Real-World Skills (And Why Should Teens Care)?</h2>
        <p className="mb-4">Real-world skills are the practical, everyday abilities you'll use in your personal and professional life. Unlike textbook knowledge, these are the things that help you thrive in the real world—from building relationships to making your first income.</p>
        <p>Learning these early gives you a massive head start.</p>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Skill #1: Financial Literacy</h2>
        <div className="pixel-border p-6 bg-maximally-blue/5">
          <h3 className="font-space font-bold text-xl mb-4">💸 Understand Money Before You Earn It</h3>
          <p className="mb-4">Ever wonder why schools don't teach taxes or budgeting? Knowing how to save, invest, and spend wisely is one of the most powerful life skills.</p>
          <div className="mb-4">
            <strong>Example:</strong> Aarav (17) learned about budgeting during a startup bootcamp. He now tracks every rupee and invests small amounts in mutual funds.
          </div>
          <h4 className="font-space font-bold text-lg mb-2">🧠 Learn:</h4>
          <ul className="list-disc pl-6">
            <li>Budgeting apps like YNAB or Goodbudget</li>
            <li>Basics of investing, UPI, and digital wallets</li>
            <li>How to avoid credit card traps</li>
          </ul>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Skill #2: Public Speaking & Communication</h2>
        <p className="mb-4">Whether you're giving a presentation or explaining an idea to a friend, clear communication is gold.</p>
        <div className="mb-4">
          <strong>Example:</strong> A shy teen who joined a public speaking workshop at Maximally is now hosting his school podcast.
        </div>
        <div className="pixel-border p-4">
          <h4 className="font-space font-bold text-lg mb-2">🧠 Learn:</h4>
          <ul className="list-disc pl-6">
            <li>How to structure a talk</li>
            <li>Controlling stage fear</li>
            <li>Persuasion and body language</li>
          </ul>
        </div>
      </section>

      <section className="my-8 grid md:grid-cols-2 gap-6">
        <div className="pixel-border p-6">
          <h2 className="font-space font-bold text-xl mb-4">Skill #3: Time Management</h2>
          <p className="mb-4">Deadlines don't disappear after exams—they only get tougher. Time management helps you juggle studies, hobbies, internships, and self-care without burning out.</p>
          <h4 className="font-space font-bold text-lg mb-2">🧠 Learn:</h4>
          <ul className="list-disc pl-6">
            <li>Time-blocking using Google Calendar</li>
            <li>Pomodoro Technique</li>
            <li>Prioritizing tasks</li>
          </ul>
        </div>

        <div className="pixel-border p-6">
          <h2 className="font-space font-bold text-xl mb-4">Skill #4: Personal Brand</h2>
          <p className="mb-4">In the digital age, your online presence is your resume. Whether it's LinkedIn, Instagram, or a blog—how you show up matters.</p>
          <div className="mb-4">
            <strong>Example:</strong> Tara (16) started posting design tutorials on Instagram. She now earns freelance gigs from brands and clients.
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-6">Skills #5-10: Essential Life Skills</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="pixel-border p-4">
            <h4 className="font-space font-bold text-lg mb-2">Problem-Solving</h4>
            <p>Break down challenges, think critically, adapt fast</p>
          </div>
          <div className="pixel-border p-4">
            <h4 className="font-space font-bold text-lg mb-2">Digital Literacy</h4>
            <p>Master no-code tools like Canva, Notion, Figma</p>
          </div>
          <div className="pixel-border p-4">
            <h4 className="font-space font-bold text-lg mb-2">Networking</h4>
            <p>Build authentic connections that support growth</p>
          </div>
          <div className="pixel-border p-4">
            <h4 className="font-space font-bold text-lg mb-2">Entrepreneurial Thinking</h4>
            <p>Spot opportunities, solve problems, take initiative</p>
          </div>
          <div className="pixel-border p-4">
            <h4 className="font-space font-bold text-lg mb-2">Conflict Resolution</h4>
            <p>Handle disagreements with empathy and respect</p>
          </div>
          <div className="pixel-border p-4">
            <h4 className="font-space font-bold text-lg mb-2">Self-Learning</h4>
            <p>Stay curious, adapt to change, grow constantly</p>
          </div>
        </div>
      </section>

      <section className="pixel-border p-6 bg-maximally-purple/5 my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🚀 Ready to Learn Real-World Skills?</h2>
        <p className="mb-4">Join Maximally's Summer Bootcamp 2025 and learn what school doesn't teach. Build practical skills, confidence, and connect with ambitious peers.</p>
        <div className="text-center">
          <Button asChild size="lg" className="bg-black hover:bg-black/80">
            <Link to="/bootcamps">Join Summer Bootcamp 2025</Link>
          </Button>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Final Thought</h2>
        <p className="mb-4">School may not teach you everything—but the world is waiting to. The earlier you start learning real-world skills, the easier adulting becomes.</p>
        <p className="font-space font-bold">So, what will you learn first?</p>
      </section>
    </>
  );

  return (
    <BlogPost
      title="10 Real-World Skills Schools Never Taught You (But We Will)"
      date="April 17, 2025"
      readTime="8 min read"
      content={content}
    />
  );
};

export default RealWorldSkillsForTeens;
