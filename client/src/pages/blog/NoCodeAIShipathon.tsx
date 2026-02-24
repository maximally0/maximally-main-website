import BlogPost from "@/components/BlogPost";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

export default function NoCodeAIShipathon() {
  const content = (
    <div className="space-y-6">
      <SEO 
        title="No Code? No Problem: How Anyone Can Join the AI Shipathon | Maximally"
        description="So you've heard about AI. Maybe even messed around with ChatGPT. But when someone says 'build an AI project,' you panic because you don't know how to code. Here's the good news: you don't need to."
        keywords="no code AI, AI without coding, beginner AI tools, no code tools 2025, AI Shipathon"
        article={true}
      />

      <p className="text-lg leading-relaxed">
        So you've heard about AI. Maybe even messed around with ChatGPT. But when someone says <strong>"build an AI project,"</strong> you panic because you don't know how to code.
      </p>

      <p className="text-xl font-bold text-maximally-green">
        Here's the good news: you don't need to.
      </p>

      <p>
        That's the whole point of the Maximally AI Shipathon — to give you a fun, fast, no-pressure way to build cool things with AI, even if you've never touched code.
      </p>

      <h2 className="text-2xl font-bold text-maximally-red mt-8 mb-4">What is No-Code Anyway?</h2>

      <p>
        Think of it like this — instead of writing instructions in programming languages, you use tools with drag-and-drop features, ready-made templates, and simple automations. It's like building with LEGO instead of sculpting from scratch.
      </p>

      <div className="bg-maximally-blue/10 p-6 rounded-lg my-6">
        <h3 className="font-bold text-lg mb-4">With tools like:</h3>
        <ul className="space-y-2">
          <li><strong>Glide</strong> – turn Google Sheets into apps</li>
          <li><strong>Canva + Notion AI</strong> – design and content made easy</li>
          <li><strong>Make.com</strong> – automate actions across apps (like Zapier)</li>
          <li><strong>Voiceflow</strong> – build voice assistants and chatbots</li>
          <li><strong>ChatGPT + DALL·E</strong> – content + design generation</li>
        </ul>
        <p className="mt-4 font-medium">you can build your own AI product. No coding. Just creativity.</p>
      </div>

      <h2 className="text-2xl font-bold text-maximally-red mt-8 mb-4">Real Stuff You Can Build (Yes, You!)</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold mb-2">🤖 Personal Chatbot</h3>
          <p>A chatbot that answers questions for your school project</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold mb-2">📱 AI-Powered App</h3>
          <p>An AI-powered journaling app</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold mb-2">📊 Pitch Generator</h3>
          <p>A pitch deck generator using GPT and Canva</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold mb-2">🎮 Quiz App</h3>
          <p>A quiz app with image scoring using DALL·E</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold mb-2">🛍️ Smart Marketplace</h3>
          <p>A smart marketplace that filters items based on user intent</p>
        </div>
      </div>

      <p className="text-center text-lg font-medium mt-6">
        If you can imagine it, you can start building it.
      </p>

      <div className="bg-maximally-green/10 p-6 rounded-lg my-8">
        <p className="font-bold">🔗 Learn more & join in: <a href="https://maximally.in/shipathon" className="text-maximally-green underline">https://maximally.in/shipathon</a></p>
      </div>

      <h2 className="text-2xl font-bold text-maximally-red mt-8 mb-4">What Happens Once You Join?</h2>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="bg-maximally-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
          <p>Team up with 2–4 teens from around the world</p>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-maximally-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
          <p>Join live Zoom workshops and strategy jams</p>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-maximally-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
          <p>Pick a problem to solve (could be personal, social, or fun)</p>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-maximally-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
          <p>Use <strong>no code AI tools 2025</strong> style to build</p>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-maximally-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">5</div>
          <p>Ship a real project by the final day</p>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-maximally-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">6</div>
          <p>Pitch your work on demo day for prizes and recognition</p>
        </div>
      </div>

      <p className="mt-6 text-center bg-yellow-100 p-4 rounded-lg">
        <strong>And don't worry — mentors will be there to support you the whole time.</strong>
      </p>

      <h2 className="text-2xl font-bold text-maximally-red mt-8 mb-4">Who Should Definitely Join?</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-maximally-blue">🎨 Artists</h3>
            <p>who want to make interactive digital work</p>
          </div>
          <div>
            <h3 className="font-bold text-maximally-green">✍️ Writers</h3>
            <p>looking to build AI-generated fiction tools</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-orange-400">💼 Hustlers</h3>
            <p>who want to launch an idea with zero tech barrier</p>
          </div>
          <div>
            <h3 className="font-bold text-orange-600">🎓 Students</h3>
            <p>building college portfolios with real-world projects</p>
          </div>
        </div>
      </div>

      <p className="text-lg text-center mt-6">
        This is more than just a <strong>hackathon for teens</strong> — it's your playground.
      </p>

      <h2 className="text-2xl font-bold text-maximally-red mt-8 mb-4">Why No Code is the Future (and the Present)</h2>

      <p>
        In 2025, startups are shipping MVPs in days. Founders are validating products without hiring developers. No code isn't a trend — it's a toolkit.
      </p>

      <div className="bg-gray-100 p-6 rounded-lg my-6">
        <h3 className="font-bold text-lg mb-4">By learning how to build with AI without code, you:</h3>
        <ul className="space-y-2">
          <li>✅ Save time</li>
          <li>✅ Explore faster</li>
          <li>✅ Learn how tools work behind the scenes</li>
          <li>✅ Create smarter than 90% of people your age</li>
        </ul>
        <p className="mt-4 font-bold">And most importantly — you stop waiting and start building.</p>
      </div>

      <h2 className="text-2xl font-bold text-maximally-red mt-8 mb-4">Final Thoughts</h2>

      <p>
        If the only thing stopping you from joining an AI event is <strong>"I don't code,"</strong> then stop right now.
      </p>

      <p className="text-xl font-bold text-maximally-red">
        You've officially run out of excuses.
      </p>

      <p>
        The Maximally AI Shipathon was made for curious people who want to start. No code, no pressure — just momentum, creativity, and the joy of launching something that didn't exist before.
      </p>

      <p>
        And who knows? You might just discover your inner builder.
      </p>

      <div className="bg-maximally-red/10 p-6 rounded-lg my-8">
        <p className="font-bold text-lg">🚀 Sign up and ship your first AI project: <a href="https://maximally.in/shipathon" className="text-maximally-red underline">https://maximally.in/shipathon</a></p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogPost
        title="No Code? No Problem: How Anyone Can Join the AI Shipathon"
        date="July 12, 2025"
        readTime="7 min read"
        content={content}
      />
      <Footer />
    </div>
  );
}