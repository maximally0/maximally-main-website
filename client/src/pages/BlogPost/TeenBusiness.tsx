import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TeenBusiness = () => {
  const content = (
    <>
      <section className="my-8">
        <p className="mb-4">What if your teenager launched a business before finishing school—without even learning to code?</p>
        <p className="mb-4">Sounds wild, right? But thanks to no-code tools and teen-focused startup programs, it's happening all across India (and the world).</p>
        <p className="mb-8">Whether you're a teen with a big idea, a parent of a creative kid, or a school leader looking to empower young innovators, this guide will walk you through how teenagers can start and grow a real business—even before they turn 18.</p>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Why Start a Business Before 18?</h2>
        <p className="mb-4">Starting early gives teens a massive advantage. They develop real-world skills, build confidence, and often discover passions that shape their futures. But the biggest shift in 2025? You don't need money, an MBA, or tech skills to get started. All you need is:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>A problem worth solving</li>
          <li>Creativity</li>
          <li>The right tools (hello, no-code!)</li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">What is No-Code, and Why Should Teen Entrepreneurs Use It?</h2>
        <p className="mb-4">No-code tools let you build apps, websites, and automations without writing traditional code. Think of it like Lego for the internet—drag, drop, and launch!</p>

        <div className="pixel-border bg-maximally-blue/5 p-6 my-6">
          <h3 className="font-space font-bold text-xl mb-4">Popular No-Code Tools for Teens:</h3>
          <ul className="space-y-2">
            <li>✨ Glide: Turn Google Sheets into apps in minutes</li>
            <li>🎨 Canva: Design logos, pitch decks, and content</li>
            <li>📝 Tally: Build forms and collect data</li>
            <li>📊 Notion: Organize your startup roadmap</li>
            <li>🚀 Bubble: Create full-scale web apps</li>
            <li>🤖 ChatGPT: Automate customer support or idea brainstorming</li>
          </ul>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Step-by-Step: How to Launch a Business Before 18</h2>

        <div className="space-y-8">
          <div>
            <h3 className="font-space font-bold text-xl mb-4">Step 1: Spot a Problem You Care About</h3>
            <p className="mb-4">Every business begins with a problem. The best teen entrepreneurs solve something close to their world.</p>
            <div className="bg-maximally-red/5 p-4 rounded-lg">
              <p className="font-bold mb-2">Real Examples:</p>
              <ul className="space-y-2">
                <li>🎯 Tanvi (16, Jaipur): Built a digital locker app using Glide</li>
                <li>💰 Ravi (17, Hyderabad): Created a teen budgeting tool with Notion</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-space font-bold text-xl mb-4">Step 2: Brainstorm a Simple Solution</h3>
            <p className="mb-4">Start small. Use the "One Sentence Startup Test":</p>
            <blockquote className="pixel-border bg-maximally-blue/5 p-4 my-4">
              "I'm building a tool that helps [people] do [something] faster/easier/cheaper."
            </blockquote>
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Want to Start but Need Help?</h2>
        <div className="pixel-border bg-maximally-blue/5 p-6">
          <h3 className="font-space font-bold text-xl mb-4">🚀 Join Maximally's Teen Startup Program</h3>
          <p className="mb-4">Go from idea to product in just 4 weeks with:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>No-code tools mastery</li>
            <li>AI integration workshops</li>
            <li>Live mentorship</li>
            <li>Startup pitch day</li>
          </ul>
          <div className="flex justify-center">
            <Link to="/entrepreneurship">
              <Button className="font-space font-bold">
                Join the Bootcamp
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Final Thoughts</h2>
        <p className="mb-4">The world doesn't wait until you're 18.</p>
        <p className="mb-4">Why should your dreams?</p>
        <p>With no-code tools, AI, and the right mentors, you can become an entrepreneur right now—no matter your age, tech skills, or background.</p>
      </section>
    </>
  );

  return (
    <BlogPost
      title="How to Start a Business Before You Turn 18 (No Code, No Problem!)"
      date="April 17, 2025"
      readTime="8 min read"
      content={content}
    />
  );
};

export default TeenBusiness;