
import React from 'react';
import BlogPost from '@/components/BlogPost';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SideHustleToStartup = () => {
  const content = (
    <>
      <p className="lead mb-8">
        You're 15, stuck between school deadlines and social media distractions—but you also have a brilliant idea. Maybe it's a small online store you started on Instagram. Or you're editing videos for YouTubers. Or maybe you sell handmade art or build websites for local businesses.
      </p>

      <p className="font-space font-bold text-xl mb-4">Guess what?</p>
      <p className="mb-8">
        That's not just a hobby. That's a side hustle—and with the right mindset and tools, it could become your startup.
      </p>

      <h2 className="font-space font-bold text-2xl mb-4">💼 What Is a Side Hustle (and How Is It Different From a Startup)?</h2>
      <p className="mb-4">Let's break it down:</p>
      <ul className="list-disc pl-6 mb-8">
        <li>A side hustle is something you do outside of school—maybe for pocket money, fun, or learning.</li>
        <li>A startup is a business built to grow fast, solve real problems, and create big value.</li>
      </ul>

      <h2 className="font-space font-bold text-2xl mb-4">🔥 Real Teens, Real Stories</h2>
      <ul className="list-disc pl-6 mb-8">
        <li>Ben Pasternak, who created the app "Flogg" at age 15, which led him to start his own tech company.</li>
        <li>Alina Morse, who started her candy company, Zollipops, at age 9 and turned it into a successful brand.</li>
        <li>Mikaila Ulmer, who founded Me & the Bees Lemonade at age 4 and now runs a national brand.</li>
      </ul>

      <h2 className="font-space font-bold text-2xl mb-4">🛠️ Step-by-Step Guide</h2>
      
      <h3 className="font-space font-bold text-xl mb-4">✅ Step 1: Validate Your Idea</h3>
      <p className="mb-4">Ask yourself:</p>
      <ul className="list-disc pl-6 mb-8">
        <li>Are people paying for this?</li>
        <li>Is there a growing demand?</li>
        <li>Can I solve a real pain point better than what exists?</li>
      </ul>

      <h3 className="font-space font-bold text-xl mb-4">🧱 Step 2: Build a Brand</h3>
      <p className="mb-4">Your hustle becomes a startup when it has:</p>
      <ul className="list-disc pl-6 mb-8">
        <li>A name people remember</li>
        <li>A clear message ("What do you solve?")</li>
        <li>A simple logo and digital home</li>
      </ul>

      <h3 className="font-space font-bold text-xl mb-4">💻 Step 3: Use No-Code Tools to Scale</h3>
      <p className="mb-4">Try these tools:</p>
      <ul className="list-disc pl-6 mb-8">
        <li>Glide / Softr / Adalo – Build apps</li>
        <li>Canva / Figma – Design posts, decks, and products</li>
        <li>Notion / Trello – Organize your business</li>
        <li>Stripe / Razorpay – Accept payments</li>
      </ul>

      <div className="pixel-border p-6 bg-maximally-blue/5 my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🎓 Ready to Turn Your Side Hustle Into a Startup?</h2>
        <p className="mb-4">
          At Maximally's Summer Bootcamp, you'll learn to:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Turn your hustle into a real startup</li>
          <li>Build products using no-code tools</li>
          <li>Master pitching your ideas</li>
          <li>Get mentorship from founders</li>
        </ul>
        <div className="text-center">
          <Button asChild size="lg" className="bg-black hover:bg-black/80">
            <Link to="/bootcamps">Apply for Summer Bootcamp 2025</Link>
          </Button>
        </div>
      </div>

      <h2 className="font-space font-bold text-2xl mb-4">💡 Final Thoughts</h2>
      <p className="mb-4">
        Even if you don't raise millions (yet), the skills you learn are invaluable:
      </p>
      <ul className="list-disc pl-6 mb-8">
        <li>Clear communication</li>
        <li>Problem-solving</li>
        <li>Time and project management</li>
        <li>Confidence under pressure</li>
        <li>Real-world experience before college</li>
      </ul>
    </>
  );

  return (
    <BlogPost
      title="From Side Hustle to Startup: Teen Founders Who Made It Big"
      date="January 17, 2025"
      readTime="8 min read"
      content={content}
    />
  );
};

export default SideHustleToStartup;
