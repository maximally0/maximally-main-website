
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PublicSpeakingGuide = () => {
  const content = (
    <>
      <p className="lead mb-8">
        🎤 Speaking Up Can Change Your Life—Even If Your Hands Shake
      </p>

      <p className="mb-4">
        Do your palms get sweaty just thinking about speaking in front of your class? Does raising your hand during a discussion feel like a battle against your own brain?
      </p>

      <p className="mb-8">
        You're not alone. Public speaking is one of the top fears among teens—but it's also one of the most life-changing skills you can learn.
      </p>

      <p className="mb-8">
        Whether you're introverted, shy, or just unsure—public speaking for teens isn't about being loud, it's about being heard.
      </p>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">What Is Public Speaking (and Why Should Teens Care)?</h2>
        <p className="mb-4">Public speaking is more than giving speeches. It's about expressing your ideas clearly—on stage, in class, in interviews, and even online.</p>
        <div className="pixel-border p-6 bg-maximally-blue/5">
          <h3 className="font-space font-bold text-xl mb-4">🔥 Why It Matters:</h3>
          <ul className="list-disc pl-6">
            <li>Helps you speak up in class discussions</li>
            <li>Prepares you for debates, interviews, and college admissions</li>
            <li>Builds confidence in expressing your ideas</li>
            <li>Boosts leadership, communication, and critical thinking skills</li>
          </ul>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Real Talk: Why Most Teens Avoid Public Speaking</h2>
        <p className="mb-4">Let's be honest: Public speaking feels scary because it's public. We fear:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Being judged</li>
          <li>Forgetting our words</li>
          <li>Sounding "awkward" or "cringe"</li>
        </ul>
        <p className="mb-4">But the truth? Nobody is born a good speaker.</p>
        <p>Even the best TED speakers started somewhere—most were scared at first too. What separates them is that they practiced, made mistakes, and kept showing up.</p>
      </section>

      <section className="pixel-border p-6 bg-maximally-green/5 my-8">
        <h3 className="font-space font-bold text-xl mb-4">Real Teen Example: Ananya's Story</h3>
        <p className="mb-4">
          Ananya (15) used to avoid class presentations. One day, she joined her school's MUN (Model United Nations) after a friend convinced her. At first, she barely spoke. But week after week, she practiced short speeches at home—and at her next conference, she won Best Delegate.
        </p>
        <p className="mb-4">Now, she's preparing for college interviews and leads her school's public speaking club.</p>
        <p className="font-space font-bold text-sm">Moral? Public speaking didn't change who she was—it revealed who she could become.</p>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-6">Benefits of Public Speaking for Teens</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="pixel-border p-4">
            <h4 className="font-space font-bold text-lg mb-2">🎯 Boosts Confidence</h4>
            <p>Nothing changes you like hearing an audience listen—and respect—what you have to say.</p>
          </div>
          <div className="pixel-border p-4">
            <h4 className="font-space font-bold text-lg mb-2">🧠 Improves Thinking</h4>
            <p>Learn to structure thoughts, use persuasive language, and stay focused.</p>
          </div>
          <div className="pixel-border p-4">
            <h4 className="font-space font-bold text-lg mb-2">🗣 Builds Leadership</h4>
            <p>Speaking clearly and confidently sets you apart in any group.</p>
          </div>
          <div className="pixel-border p-4">
            <h4 className="font-space font-bold text-lg mb-2">🎓 Prepares for Future</h4>
            <p>Essential for college interviews and future careers.</p>
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">How to Get Started (Even If You're Shy)</h2>
        
        <div className="space-y-6">
          <div className="pixel-border p-6">
            <h3 className="font-space font-bold text-xl mb-2">Step 1: Start Small (and Safe)</h3>
            <ul className="list-disc pl-6">
              <li>Record yourself explaining a topic you like</li>
              <li>Practice in front of a mirror</li>
              <li>Speak to one friend or family member for feedback</li>
            </ul>
          </div>

          <div className="pixel-border p-6">
            <h3 className="font-space font-bold text-xl mb-2">Step 2: Join Low-Pressure Speaking Spaces</h3>
            <ul className="list-disc pl-6">
              <li>School debate clubs</li>
              <li>Toastmasters Youth (Gavel Club)</li>
              <li>Online forums or speaking challenges</li>
              <li>Maximally Bootcamp's public speaking track</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="pixel-border p-6 bg-maximally-purple/5 my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🚀 Ready to Master Public Speaking?</h2>
        <p className="mb-4">Join Maximally's Public Speaking Bootcamp and transform your communication skills through hands-on practice and expert guidance.</p>
        <div className="text-center">
          <Button asChild size="lg" className="bg-black hover:bg-black/80">
            <Link to="/public-speaking">Join Public Speaking Bootcamp</Link>
          </Button>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Final Thought: You Deserve to Be Heard</h2>
        <p className="mb-4">Public speaking isn't about being the loudest. It's about being real, clear, and heard.</p>
        <p className="mb-4">You don't need to wait to be "older" or "confident enough." Speaking builds confidence—the more you speak, the stronger you grow.</p>
        <p className="font-space font-bold">So take the mic. Raise your hand. Record that video. Your voice could be the one that changes the room.</p>
      </section>
    </>
  );

  return (
    <BlogPost
      title="Why Every Teen Should Learn Public Speaking (Even If You're Shy)"
      date="April 17, 2025"
      readTime="8 min read"
      content={content}
    />
  );
};

export default PublicSpeakingGuide;
