
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TeenStartupJourney = () => {
  const content = (
    <>
      <p className="lead mb-8">
        "I didn't wait to graduate. I started building." That's the line I now use at school events when people ask me how I launched a startup before turning 18.
      </p>

      <p className="mb-4">
        I'm not from IIT. I didn't know how to code. What did I have? A simple idea. A smartphone. And the courage to start.
      </p>

      <p className="mb-8">
        If you're a teenager, there's never been a better time to launch your own startup. And with no-code tools, AI, and teen-focused programs like Maximally, you can go from zero to launch faster than ever.
      </p>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">From School Project to Startup Idea</h2>
        <p className="mb-4">It began in class 10, during exam season.</p>
        <p className="mb-4">I noticed how every student in my school was stressed, confused about what to revise, and wasting time scrolling Instagram while pretending to study.</p>
        <p className="mb-4">So, I thought: What if there was a simple AI-powered revision assistant that made custom timetables and gave quick recap notes?</p>
        <p className="font-space font-bold">I didn't call it a startup. I called it a "small project."</p>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Step 1: Solving a Problem You Understand</h2>
        <p className="mb-4">The best teen startups don't begin with a business plan. They start with frustration—something annoying you want to fix.</p>
        <div className="pixel-border p-6 bg-maximally-blue/5">
          <p className="mb-4">Here are a few real-world examples from teen founders:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Ananya (16) built a recycled stationery brand after noticing how many notebooks go to waste after exams.</li>
            <li>Dev (17) launched a digital store for school clubs using Glide and Google Sheets.</li>
            <li>Jiya (15) created an AI journaling app for mental health after her friend faced burnout.</li>
          </ul>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">No-Code Tools That Made It Possible</h2>
        <div className="grid gap-4">
          <div className="pixel-border p-4">
            <h3 className="font-space font-bold text-lg mb-2">🔧 Glide</h3>
            <p>Turn Google Sheets into apps. I built my first prototype in 1 weekend.</p>
          </div>
          <div className="pixel-border p-4">
            <h3 className="font-space font-bold text-lg mb-2">💬 ChatGPT</h3>
            <p>Used it to draft revision messages, build quiz bots, and test user flows.</p>
          </div>
          <div className="pixel-border p-4">
            <h3 className="font-space font-bold text-lg mb-2">🧠 Tally + Notion</h3>
            <p>Created sign-up forms and user onboarding without spending a rupee.</p>
          </div>
        </div>
      </section>

      <section className="pixel-border p-6 bg-maximally-green/5 my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Ready to Build Your Startup? 🚀</h2>
        <p className="mb-4">Join Maximally's Startup Bootcamp - India's #1 program for teen founders.</p>
        <div className="mb-6">
          <h4 className="font-space font-bold text-lg mb-2">What You'll Learn:</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li>Build your startup using no-code tools</li>
            <li>Learn from successful teen founders</li>
            <li>Get mentorship and feedback</li>
            <li>Pitch at Demo Day</li>
          </ul>
        </div>
        <div className="text-center">
          <Button asChild size="lg" className="bg-black hover:bg-black/80">
            <Link to="/bootcamps">Join the Next Cohort</Link>
          </Button>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Final Thought</h2>
        <p className="mb-4">I didn't have a degree. I just had a drive to solve a problem.</p>
        <p className="mb-4">And that was enough.</p>
        <p className="font-space font-bold">You don't have to wait to grow up. Start building your startup today.</p>
      </section>
    </>
  );

  return (
    <BlogPost
      title="How I Built My First Startup as a Student (And How You Can TOO)"
      date="April 17, 2025"
      readTime="10 min read"
      content={content}
    />
  );
};

export default TeenStartupJourney;
