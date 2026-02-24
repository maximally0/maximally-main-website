
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NoCodeTools = () => {
  const content = (
    <>
      <p className="lead mb-8">
        Imagine building your own app, designing a website, or even automating daily tasks—without writing a single line of code. Sounds impossible? Not anymore.
      </p>

      <p className="mb-4">
        With no-code platforms, tech innovation isn't just for developers anymore. Today, teens like you can transform bold ideas into real digital products using simple drag-and-drop tools.
      </p>

      <p className="mb-8">
        Whether you're passionate about art, entrepreneurship, writing, or gaming, there's a no-code tool perfect for your summer projects.
      </p>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">What Is No-Code—and Why Should Teens Care?</h2>
        <p className="mb-4">No-code tools are platforms that let you build websites, apps, games, and workflows without writing code. Instead of spending months learning programming languages, you can start creating right away.</p>
        <div className="pixel-border p-6 bg-maximally-blue/5">
          <p className="mb-4">Here's why no-code matters for teens:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fast results: See your ideas come to life instantly.</li>
            <li>No technical barrier: Anyone can build, regardless of tech experience.</li>
            <li>Creative freedom: Build whatever you imagine—without limits.</li>
            <li>Career-ready skills: Gain real-world experience in product building and digital creativity.</li>
          </ul>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🔧 Top No-Code Tools Every Teen Should Try</h2>
        
        <div className="space-y-6">
          <div className="pixel-border p-6">
            <h3 className="font-space font-bold text-xl mb-2">1. Glide – Turn Spreadsheets Into Apps</h3>
            <p className="mb-2"><strong>Best for:</strong> Building simple mobile apps</p>
            <p className="mb-2"><strong>Use Case:</strong> A school event planner, budget tracker, or journal app.</p>
            <p className="mb-4">Glide transforms Google Sheets data into a working mobile app. Simply choose a template, connect your spreadsheet, and customize the design.</p>
            <div className="bg-maximally-green/5 p-4 rounded">
              <p className="font-space font-bold text-sm mb-2">Why teens love it:</p>
              <ul className="list-disc pl-6">
                <li>It's fast and fun</li>
                <li>You don't need design or coding experience</li>
                <li>It works straight from your phone</li>
              </ul>
            </div>
          </div>

          <div className="pixel-border p-6">
            <h3 className="font-space font-bold text-xl mb-2">2. Canva – Design Like a Pro</h3>
            <p className="mb-2"><strong>Best for:</strong> Graphic design, social media, presentations</p>
            <p className="mb-2"><strong>Use Case:</strong> Starting an Instagram poetry page, creating YouTube thumbnails, or making resumes.</p>
            <p className="mb-4">Drag, drop, and design anything using Canva's vast library of templates, fonts, and graphics.</p>
            <div className="bg-maximally-blue/5 p-4 rounded">
              <p className="font-space font-bold text-sm mb-2">Pro tip:</p>
              <p>Upgrade to Canva for Education (free for students) for premium features!</p>
            </div>
          </div>

          <div className="pixel-border p-6">
            <h3 className="font-space font-bold text-xl mb-2">3. Notion – Organize Your Brain</h3>
            <p className="mb-2"><strong>Best for:</strong> Productivity, journaling, content planning</p>
            <p className="mb-2"><strong>Use Case:</strong> Managing a content calendar, tracking habits, or keeping study notes.</p>
            <p className="mb-4">Combine text, databases, to-do lists, and calendars in one workspace.</p>
            <div className="bg-maximally-purple/5 p-4 rounded">
              <p className="italic">Real-world example: Arjun, 17, used Notion to manage his YouTube channel content and tripled his posting frequency.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">⚡ Real Teen Creators, Real Impact</h2>
        <div className="pixel-border p-6 bg-maximally-red/5">
          <p className="mb-4">Teens around the world are already using no-code tools to create amazing things:</p>
          <ul className="space-y-4">
            <li>Devika, 15, built a daily mood tracker using Notion and shared it with over 1,000 teens online.</li>
            <li>Amit, 16, created a sneaker review website using Tilda and got noticed by a local shoe brand.</li>
            <li>Priya, 17, designed her school's debate club website without touching a single line of code.</li>
          </ul>
          <p className="font-space font-bold text-lg mt-4">No-code doesn't mean low-skill—it means high-access.</p>
        </div>
      </section>

      <section className="pixel-border p-6 bg-maximally-green/5 my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🚀 Ready to Start Building?</h2>
        <p className="mb-4">Join Maximally's No-Code Bootcamp - Learn to build real projects without coding.</p>
        <div className="mb-6">
          <h4 className="font-space font-bold text-lg mb-2">What You'll Learn:</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li>Build apps and websites from scratch</li>
            <li>Create automated workflows</li>
            <li>Design beautiful graphics</li>
            <li>Launch your own digital products</li>
          </ul>
        </div>
        <div className="text-center">
          <Button asChild size="lg" className="bg-black hover:bg-black/80">
            <Link to="/bootcamps">Join No-Code Bootcamp</Link>
          </Button>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">TL;DR?</h2>
        <p className="mb-4">No-code tools are your gateway to building, creating, and innovating—without needing to code. All you need is curiosity and a bit of time this summer. The rest? We'll teach you.</p>
        <p className="font-space font-bold">Start building your future today.</p>
      </section>
    </>
  );

  return (
    <BlogPost
      title="No-Code Tools Every Teen Creator Should Try This Summer"
      date="April 17, 2025"
      readTime="8 min read"
      content={content}
    />
  );
};

export default NoCodeTools;
