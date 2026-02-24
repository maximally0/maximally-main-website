
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const InstagramPersonalBranding = () => {
  const content = (
    <>
      <p className="lead mb-8">
        For Teens Who Want to Stand Out (Even Before College)
      </p>

      <section className="mb-8">
        <h2 className="font-space font-bold text-2xl mb-4">🔥 You're Already Online—Why Not Build a Brand?</h2>
        <p className="mb-4">Let's be real—you already spend time on Instagram. You scroll. You post. You like it. But what if you could use that time to build a personal brand that opens doors, earns income, and sets you apart?</p>
        <p className="mb-4">In 2025, building a personal brand on Insta isn't just for influencers or celebrities. Teens like you are using the platform to launch businesses, grow communities, and even land internships—without a resume.</p>
        <p>If you're curious how to turn your passion into a platform, this guide is for you.</p>
      </section>

      <section className="mb-8">
        <h2 className="font-space font-bold text-2xl mb-4">🚀 What Is a Personal Brand (and Why Should Teens Care)?</h2>
        <p className="mb-4">A personal brand is how people see you online. It's your reputation, your vibe, your story—all packed into your profile, posts, and captions.</p>
        <p className="mb-4">But here's the kicker: Your personal brand is already forming, whether you're intentional or not. So why not own it and shape it?</p>
        <p>Whether you love music, fashion, tech, gaming, sports, or writing, Instagram is where you can:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Build a portfolio</li>
          <li>Connect with like-minded teens</li>
          <li>Get noticed by colleges or startups</li>
          <li>Even earn money doing what you love</li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🧠 Step 1: Know Your Niche (Aka: What's Your Thing?)</h2>
        <p className="mb-4">You don't need to be an expert. But you do need to pick a theme.</p>
        <div className="pixel-border p-6 bg-maximally-purple/5">
          <p className="font-space font-bold text-lg mb-4">Ask yourself:</p>
          <ul className="list-disc pl-6">
            <li>What do I enjoy sharing?</li>
            <li>What would I talk about even if no one paid me?</li>
            <li>What are my friends always asking me for help with?</li>
          </ul>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">📸 Step 2: Polish Your Profile</h2>
        <div className="pixel-border p-6">
          <h3 className="font-space font-bold text-xl mb-4">✅ Essentials:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Clear Profile Picture: Show your face or logo. Keep it bright and friendly.</li>
            <li>Bio: Say who you are and what you do in one line. Add a little personality or emoji for flavor.</li>
            <li>Link in Bio: Use tools like Linktree or Beacons to connect to your YouTube, website, or portfolio.</li>
          </ul>
          <div className="bg-maximally-blue/5 p-4 rounded">
            <h4 className="font-space font-bold text-lg mb-2">🔧 Example:</h4>
            <p className="font-mono">
              @MusicByAanya<br />
              🎵 Teen songwriter & loop artist<br />
              💡 Sharing daily music hacks & covers<br />
              👇 Listen to my new single
            </p>
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">📅 Step 3: Create Content with Purpose</h2>
        <p className="mb-4">To build your personal brand on Insta, your content should educate, entertain, or inspire.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="pixel-border p-4">
            <h3 className="font-space font-bold text-lg mb-2">🎥 Content Types:</h3>
            <ul className="list-disc pl-6">
              <li>Reels – Short, fun videos that hook attention</li>
              <li>Carousels – Great for tutorials and tips</li>
              <li>Stories – Perfect for behind-the-scenes</li>
              <li>Lives – Collaborate with others</li>
            </ul>
          </div>
          <div className="pixel-border p-4">
            <h3 className="font-space font-bold text-lg mb-2">🧠 Pro Tips:</h3>
            <ul className="list-disc pl-6">
              <li>Mix personal and valuable content</li>
              <li>Stay consistent with posting</li>
              <li>Engage with your audience</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🧰 Step 4: Use Tools Like a Pro</h2>
        <div className="pixel-border p-6">
          <p className="mb-4">You don't need to be a designer or editor. These free tools can level up your content:</p>
          <ul className="list-disc pl-6">
            <li>Canva: Create eye-catching posts and carousels</li>
            <li>InShot: Edit videos for Reels like a pro</li>
            <li>CapCut: Add cool captions and effects</li>
            <li>Notion: Plan your weekly content calendar</li>
            <li>Preview: Schedule and preview your grid</li>
          </ul>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">📈 Step 5: Grow Your Audience</h2>
        <p className="mb-4">Followers are nice. But real brand growth comes from engagement.</p>
        <div className="pixel-border p-6 bg-maximally-purple/5">
          <h3 className="font-space font-bold text-xl mb-4">Try This:</h3>
          <ul className="list-disc pl-6">
            <li>Engage on similar accounts</li>
            <li>Use hashtags smartly</li>
            <li>Reply to comments</li>
            <li>Collaborate with others</li>
          </ul>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">💼 Turn Your Brand into Opportunities</h2>
        <p className="mb-4">Once you've built a solid personal brand, amazing things start to happen.</p>
        <div className="pixel-border p-6">
          <h3 className="font-space font-bold text-xl mb-4">🎯 Real examples from Maximally Bootcamp alumni:</h3>
          <ul className="list-disc pl-6">
            <li>Tanay (15) got an internship offer from a startup who found his Insta</li>
            <li>Ritika (17) started getting freelance clients for logo design</li>
            <li>Amaan (16) got invited to speak at a student TEDx event</li>
          </ul>
        </div>
      </section>

      <section className="pixel-border p-6 bg-maximally-blue/5 my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🚀 Ready to Build Your Brand?</h2>
        <p className="mb-4">Join Maximally's Summer Bootcamp 2025 and learn how to build your personal brand—even if you've never posted a Reel before.</p>
        <div className="text-center">
          <Button asChild size="lg" className="bg-black hover:bg-black/80">
            <Link to="/bootcamps">Join Summer Bootcamp 2025</Link>
          </Button>
        </div>
      </section>
    </>
  );

  return (
    <BlogPost
      title="How to Build a Personal Brand on Instagram in 2025"
      date="April 17, 2025"
      readTime="8 min read"
      content={content}
    />
  );
};

export default InstagramPersonalBranding;
