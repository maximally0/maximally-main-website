
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PitchingTipsForTeens = () => {
  const content = (
    <>
      <p className="lead mb-8">
        A Teen's Guide to Pitching With Confidence and Clarity
      </p>

      <section className="mb-8">
        <h2 className="font-space font-bold text-2xl mb-4">🎤 Scared of Public Speaking?</h2>
        <p className="mb-4">You step onto the stage. Lights are on. Eyes are watching. Your heart races. You're about to give your first pitch—and your brain screams, "What if I mess up?"</p>
        <p className="mb-4">Sound familiar?</p>
        <p className="mb-4">Don't worry. You're not alone. For many teens, giving a pitch in front of a crowd feels more terrifying than a math test, but it doesn't have to be. Whether it's for a school competition, a startup idea, or your first real-world opportunity, your pitch can be powerful—even if you've never done it before.</p>
        <p>In this blog, we'll walk you through exactly how to crush your first pitch, with practical tips, real teen stories, and a clear roadmap to help you shine under pressure.</p>
      </section>

      <section className="mb-8">
        <h2 className="font-space font-bold text-2xl mb-4">💡 What Is a Pitch?</h2>
        <p className="mb-4">A pitch is simply telling people what you do or believe—in a way that makes them care.</p>
        <p>You might pitch:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>A startup idea at a hackathon</li>
          <li>Your club to school administrators</li>
          <li>A project to investors or mentors</li>
          <li>Yourself in a college interview</li>
        </ul>
        <p className="mb-4">In every case, the goal is the same: Get people interested, inspired, and excited to say yes.</p>
        <div className="pixel-border p-6 bg-maximally-purple/5">
          <h3 className="font-space font-bold text-xl mb-4">Why It Matters Now:</h3>
          <p>Even if you're not planning a startup, pitching helps you:</p>
          <ul className="list-disc pl-6">
            <li>Improve public speaking</li>
            <li>Think clearly under pressure</li>
            <li>Stand out in college and job applications</li>
            <li>Build confidence in any situation</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-space font-bold text-2xl mb-4">🧠 Step 1: Know Your "Why"</h2>
        <p className="mb-4">Before you write a single line of your pitch, answer this:</p>
        <p className="font-bold mb-4">Why does this idea matter to YOU?</p>
        <p className="mb-4">People don't buy into facts. They buy into stories and passion. Start with your motivation—what inspired this idea or project?</p>
        <div className="pixel-border p-6">
          <h3 className="font-space font-bold text-xl mb-4">Example:</h3>
          <p className="mb-2">Instead of saying:</p>
          <p className="italic mb-4">"We built a note-sharing app for students."</p>
          <p className="mb-2">Say:</p>
          <p className="italic">"As students, we often struggle to keep up with classes. I missed a week due to illness and fell behind. That's when I thought—what if there was a way for students to help each other catch up easily?"</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-space font-bold text-2xl mb-4">✍️ Step 2: Craft Your Core Message</h2>
        <p className="mb-4">A great first pitch answers three things clearly:</p>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="pixel-border p-4">
            <h3 className="font-space font-bold text-lg mb-2">🧩 The Problem</h3>
            <p>What challenge are you solving?</p>
          </div>
          <div className="pixel-border p-4">
            <h3 className="font-space font-bold text-lg mb-2">🧪 The Solution</h3>
            <p>How does your idea help?</p>
          </div>
          <div className="pixel-border p-4">
            <h3 className="font-space font-bold text-lg mb-2">🚀 Why You?</h3>
            <p>Why are you the right person?</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-space font-bold text-2xl mb-4">⏱️ Step 3: Time It Right</h2>
        <p className="mb-4">Your first pitch should be 2–3 minutes max. That's about 300–400 words. You don't need to explain every detail—just give them a taste that leaves them wanting more.</p>
        <div className="pixel-border p-6">
          <h3 className="font-space font-bold text-xl mb-4">Quick Pitch Framework:</h3>
          <ul className="list-none space-y-2">
            <li>• Hook (30 sec): Grab attention with a story or stat</li>
            <li>• Problem (30 sec): Explain the pain point</li>
            <li>• Solution (45 sec): Share your product, service, or idea</li>
            <li>• Why You (30 sec): Show your passion or team advantage</li>
            <li>• Call to Action (15 sec): What do you want from the audience?</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-space font-bold text-2xl mb-4">🎤 Step 4: Practice Like a Pro</h2>
        <p className="mb-4">Practicing your first pitch doesn't mean memorizing it word-for-word. It means:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Knowing your key points cold</li>
          <li>Practicing in front of a mirror, camera, or friends</li>
          <li>Timing yourself to stay on track</li>
          <li>Recording and rewatching to spot nervous habits</li>
        </ul>
        <div className="bg-maximally-blue/5 p-4 rounded">
          <p className="font-bold">Pro Tip:</p>
          <p>Practice in front of someone who doesn't know your idea. If they "get it" by the end, you're on the right track.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-space font-bold text-2xl mb-4">💥 Step 5: Master the Delivery</h2>
        <p className="mb-4">On stage, your energy and presence matter as much as your words.</p>
        <div className="pixel-border p-6">
          <h3 className="font-space font-bold text-xl mb-4">Here's how to look confident:</h3>
          <ul className="list-none space-y-2">
            <li>👀 Make eye contact (scan the room slowly)</li>
            <li>✋ Use hand gestures to emphasize key points</li>
            <li>👣 Stand still—don't pace or sway</li>
            <li>🎤 Project your voice—imagine you're talking to the last row</li>
            <li>⏸️ Pause—Don't be afraid of silence after a big point</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-space font-bold text-2xl mb-4">🔥 Real-World Examples: Teens Who Nailed It</h2>
        <div className="space-y-4">
          <div className="pixel-border p-4">
            <h3 className="font-bold">Aarav, 16 – Language Learning App</h3>
            <p>Opened with the story of his house help struggling to communicate. Won first place and NGO attention.</p>
          </div>
          <div className="pixel-border p-4">
            <h3 className="font-bold">Mehak, 17 – Thrift-Store Platform</h3>
            <p>Used humor and Canva mock-ups. Got invited to join a startup accelerator.</p>
          </div>
          <div className="pixel-border p-4">
            <h3 className="font-bold">Tanisha, 15 – Homework Buddy</h3>
            <p>Pitched her chatbot, followed structure, got 3 mentorship offers!</p>
          </div>
        </div>
      </section>

      <section className="pixel-border p-6 bg-maximally-blue/5 my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🚀 Ready to Pitch Like a Pro?</h2>
        <p className="mb-4">Join Maximally's Summer Bootcamp and learn how to deliver killer pitches that get results.</p>
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
      title="How to Crush Your First Pitch in Front of a Crowd"
      date="April 17, 2025"
      readTime="8 min read"
      content={content}
    />
  );
};

export default PitchingTipsForTeens;
