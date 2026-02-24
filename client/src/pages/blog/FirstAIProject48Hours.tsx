import BlogPost from "@/components/BlogPost";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

export default function FirstAIProject48Hours() {
  const content = (
    <div className="space-y-6">
      <SEO 
        title="How I Built My First AI Project in 48 Hours (And You Can Too) | Maximally"
        description="Let me take you back 48 hours. I was staring at a blank Google Doc, part of a fresh team I'd never met before, in the middle of my first ever AI hackathon for beginners. The challenge? Build an AI-powered solution to a real-world problem using no code AI tools."
        keywords="first AI project, 48 hour hackathon, AI project story, beginner AI development, student success story"
        article={true}
      />

      <p className="text-lg leading-relaxed">
        Let me take you back 48 hours. I was staring at a blank Google Doc, part of a fresh team I'd never met before, in the middle of my first ever <strong>AI hackathon for beginners</strong>. The challenge? Build an AI-powered solution to a real-world problem using no code AI tools.
      </p>

      <p>
        I'd never built an app. I didn't even know what a "workflow" was. I just knew I liked solving problems and learning new things. And now, I had 48 hours to go from zero to something.
      </p>

      <h2 className="text-2xl font-bold text-maximally-red mt-8 mb-4">Step 1: Picking the Problem</h2>

      <p>
        Our team brainstormed fast. We all agreed on one thing — school life can get overwhelming. Too many assignments, projects, club events, and personal goals. So, we decided to build a personal AI assistant for students that keeps everything organized.
      </p>

      <div className="bg-maximally-blue/10 p-6 rounded-lg my-6">
        <p className="font-bold text-lg">The idea was simple:</p>
        <p>An app that takes your weekly tasks and suggests a balanced schedule — like a planner that thinks.</p>
      </div>

      <h2 className="text-2xl font-bold text-maximally-red mt-8 mb-4">Step 2: Choosing the Tools</h2>

      <p>Here's what we used:</p>

      <div className="grid md:grid-cols-2 gap-4 my-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-maximally-blue mb-2">📝 Notion AI</h3>
          <p>For note capturing and automatic task summaries</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-maximally-green mb-2">⚡ Make.com</h3>
          <p>To automate syncing between Google Calendar and Notion</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-orange-400 mb-2">📱 Glide</h3>
          <p>To build the mobile app interface</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-orange-600 mb-2">🤖 ChatGPT API</h3>
          <p>To analyze inputs and give back smart advice</p>
        </div>
      </div>

      <p>
        No one in our team was a coder. But these tools felt like magic. We were dragging, connecting, testing. And suddenly, the pieces started working together.
      </p>

      <h2 className="text-2xl font-bold text-maximally-red mt-8 mb-4">Step 3: Failing (A Lot)</h2>

      <div className="bg-red-50 border-l-4 border-red-400 p-6 my-6">
        <p className="font-bold text-red-800 mb-2">Our first version was a disaster.</p>
        <ul className="text-red-700 space-y-1">
          <li>• The UI was clunky</li>
          <li>• The AI responses were off</li>
          <li>• One automation loop kept sending the same reminder 50 times</li>
        </ul>
      </div>

      <p>
        We laughed, fixed it, broke something else, and fixed it again.
      </p>

      <p className="text-lg font-medium text-maximally-green">
        But that's when the real learning happened. Every fail taught us something — about logic, user experience, time management, and teamwork.
      </p>

      <h2 className="text-2xl font-bold text-maximally-red mt-8 mb-4">Step 4: Demo Day</h2>

      <p>
        When we presented, it wasn't perfect. But it worked. Our AI assistant could:
      </p>

      <div className="bg-maximally-green/10 p-6 rounded-lg my-6">
        <ul className="space-y-2">
          <li>✅ Take in a list of tasks from the user</li>
          <li>✅ Categorize them into academics, health, and personal goals</li>
          <li>✅ Suggest a realistic schedule and even recommend Pomodoro breaks</li>
        </ul>
      </div>

      <p>
        The judges were impressed. Not because it was the flashiest app, but because we had an idea, built a real thing, and explained it like creators.
      </p>

      <div className="bg-maximally-blue/10 p-6 rounded-lg my-8">
        <p className="font-bold">Try building your first project here: <a href="https://maximally.in/shipathon" className="text-maximally-blue underline">https://maximally.in/shipathon</a></p>
      </div>

      <h2 className="text-2xl font-bold text-maximally-red mt-8 mb-4">What I Learned</h2>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-bold text-lg text-maximally-blue mb-2">🚀 AI isn't just for coders.</h3>
          <p>If you can think logically and creatively, you can build.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-bold text-lg text-maximally-green mb-2">⚡ No code is powerful.</h3>
          <p>It's not a shortcut — it's a launchpad.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-bold text-lg text-orange-400 mb-2">👥 Teamwork &gt; Solo genius.</h3>
          <p>My teammates brought skills I didn't have, and vice versa.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-bold text-lg text-orange-600 mb-2">✅ Done &gt; Perfect.</h3>
          <p>You'll learn more by finishing one imperfect thing than dreaming about a perfect one you never start.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-maximally-red mt-8 mb-4">Why You Should Try It</h2>

      <p>
        If you're still waiting to feel "ready," you'll be waiting forever. The truth is, nobody feels ready at the beginning. But once you start building, everything changes.
      </p>

      <p>
        The Maximally AI Shipathon is designed for this. It's your safety net and your rocket ship. You'll be surrounded by mentors, resources, and people who want to see you win.
      </p>

      <div className="bg-yellow-100 p-6 rounded-lg my-6">
        <p className="text-lg font-bold text-center">
          It's not about being the smartest — it's about showing up, trying, and surprising yourself.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-maximally-red mt-8 mb-4">TL;DR: You Can Do This</h2>

      <p>
        I went from <strong>"I don't know what I'm doing"</strong> to <strong>"I built something real"</strong> in just 48 hours. And now, you can too.
      </p>

      <p>
        The next great AI idea doesn't need to come from Silicon Valley. It can come from your bedroom, your school bench, your imagination.
      </p>

      <div className="bg-maximally-red/10 p-6 rounded-lg my-8">
        <p className="font-bold text-lg">🚀 Join the Maximally AI Shipathon: <a href="https://maximally.in/shipathon" className="text-maximally-red underline">https://maximally.in/shipathon</a></p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogPost
        title="How I Built My First AI Project in 48 Hours (And You Can Too)"
        date="July 12, 2025"
        readTime="9 min read"
        content={content}
      />
      <Footer />
    </div>
  );
}