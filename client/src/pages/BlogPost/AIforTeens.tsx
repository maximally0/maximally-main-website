
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AIforTeens = () => {
  const content = (
    <>
      <p className="lead mb-8 text-maximally-yellow font-semibold text-lg">
        What if you could build your own personal assistant, create AI-generated art, or launch a mini startup… without ever writing a single line of code? That's not the future—it's right now.
      </p>

      <p className="mb-6 text-gray-300">
        If you're a teenager curious about tech, creativity, or entrepreneurship, AI is the most exciting skill you can learn today. And the best part? You don't need to be a coder to get started.
      </p>

      <section className="my-8">
        <h2 className="font-press-start text-xl sm:text-2xl mb-4 text-maximally-yellow">Why AI is the Skill of the Decade</h2>
        <p className="mb-4 text-gray-300">
          Artificial Intelligence (AI) is transforming everything—from how we shop and learn to how we create music and tell stories. Companies like Google, Netflix, and Tesla are already powered by AI.
        </p>
        <p className="mb-4 text-gray-300">But here's what most schools won't tell you:</p>
        <p className="font-press-start mb-4 text-maximally-red text-sm">You don't need to wait until college—or even know how to code—to start using and building with AI.</p>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-300">
          <li>Build AI chatbots</li>
          <li>Generate music and designs</li>
          <li>Analyze data</li>
          <li>Create businesses</li>
          <li>Solve real-world problems</li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="font-press-start text-xl sm:text-2xl mb-4 text-maximally-blue">What is No-Code AI?</h2>
        <p className="mb-4 text-gray-300">No-code AI means building and using artificial intelligence tools without needing to know programming languages like Python or Java.</p>
        <div className="border-2 border-maximally-blue/30 bg-gray-900/50 p-4 sm:p-6 rounded-lg">
          <p className="mb-4 text-gray-300">Instead of writing lines of code, you can:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Drag and drop elements</li>
            <li>Use AI platforms with friendly interfaces</li>
            <li>Train your own models by uploading data or giving examples</li>
          </ul>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-press-start text-xl sm:text-2xl mb-4 text-maximally-green">Tools That Make AI Easy for Teens</h2>
        <div className="grid gap-6 mb-8">
          <div className="border-2 border-maximally-green/30 bg-gray-900/50 p-4 sm:p-6 rounded-lg">
            <h3 className="font-press-start text-lg sm:text-xl mb-3 text-maximally-yellow">🧠 ChatGPT</h3>
            <p className="mb-2 text-gray-300">Use it to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Write stories or poems</li>
              <li>Get study help</li>
              <li>Simulate interviews or debates</li>
              <li>Create a chatbot for your website</li>
            </ul>
            <p className="mt-4 text-sm italic text-maximally-blue">💡 Teen Example: Aryan (15, Delhi) built a school debate simulator using ChatGPT and Tally Forms.</p>
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-press-start text-xl sm:text-2xl mb-4 text-maximally-red">Real Teens Using AI to Make a Difference</h2>
        <div className="grid gap-4">
          <div className="border-2 border-maximally-red/30 bg-gray-900/50 p-4 rounded-lg">
            <h3 className="font-press-start text-sm sm:text-lg text-maximally-yellow">🌟 Ishaan, 14 (Noida)</h3>
            <p className="text-gray-300">Created an AI bot that generates motivational messages for students dealing with exam stress.</p>
          </div>
          <div className="border-2 border-maximally-red/30 bg-gray-900/50 p-4 rounded-lg">
            <h3 className="font-press-start text-sm sm:text-lg text-maximally-yellow">🌟 Zoya, 16 (Pune)</h3>
            <p className="text-gray-300">Built an AI-powered news summarizer for teenagers—so they don't have to read long articles.</p>
          </div>
          <div className="border-2 border-maximally-red/30 bg-gray-900/50 p-4 rounded-lg">
            <h3 className="font-press-start text-sm sm:text-lg text-maximally-yellow">🌟 Krishna, 17 (Indore)</h3>
            <p className="text-gray-300">Runs a small business selling AI-generated logos to local shops.</p>
          </div>
        </div>
      </section>

      <section className="border-2 border-maximally-green bg-gray-900/50 p-4 sm:p-6 my-8 rounded-lg">
        <h2 className="font-press-start text-lg sm:text-2xl mb-4 text-maximally-green">Ready to Build with AI? Start Here 👇</h2>
        <h3 className="font-press-start text-md sm:text-xl mb-4 text-maximally-yellow">💻 Join the Maximally AI & No-Code Bootcamp</h3>
        <p className="mb-4 text-gray-300">Maximally is India's most hands-on AI bootcamp designed for teenagers—no coding needed.</p>
        <div className="mb-6">
          <h4 className="font-press-start text-sm sm:text-lg mb-2 text-maximally-blue">🧩 What you'll do:</h4>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Build projects in 1 week</li>
            <li>Use tools like ChatGPT, DALL·E, Lobe, Bubble, and Glide</li>
            <li>Learn from expert mentors and young startup founders</li>
            <li>Join India's smartest teen builder community</li>
            <li>Pitch your project at our Demo Day</li>
          </ul>
        </div>
        <div className="text-center">
          <Button asChild size="lg" className="pixel-button bg-maximally-red hover:bg-maximally-red/90 text-white font-press-start">
            <Link to="/bootcamps">Apply Now for AI Bootcamp</Link>
          </Button>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-press-start text-xl sm:text-2xl mb-4 text-maximally-red">Final Thoughts</h2>
        <p className="mb-4 text-gray-300">You don't need to be 18, a genius, or a coder to shape the future.</p>
        <p className="font-press-start text-md sm:text-lg mb-4 text-maximally-yellow">You just need to start.</p>
        <p className="mb-4 text-gray-300">And with AI, the future is already yours to build.</p>
        <p className="text-gray-300">So pick up that laptop. Launch your first idea.</p>
        <p className="font-press-start text-maximally-green">Let the world see what a teenager with AI can really do.</p>
      </section>
    </>
  );

  return (
    <BlogPost
      title="AI for Teenagers: Learn the Future Without Coding"
      date="April 17, 2025"
      readTime="8 min read"
      content={content}
    />
  );
};

export default AIforTeens;
