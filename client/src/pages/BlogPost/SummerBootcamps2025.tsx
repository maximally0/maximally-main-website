
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SummerBootcamps2025 = () => {
  const content = (
    <>
      <section className="my-8">
        <p className="mb-4">Ready to make this summer count? While your friends are still planning their vacations, imagine building your own AI chatbot, designing a mobile app without writing code, or launching a startup idea with just a few clicks. Sounds cool? That's what India's top summer bootcamps for teens are offering in 2025.</p>
        <p className="mb-8">From no code tools to AI-powered solutions, this year's summer programs are all about giving young minds like yours a head start in the tech world. Whether you're a curious beginner or a budding innovator, these bootcamps are built to spark creativity, sharpen skills, and maybe even shape your future career.</p>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Why Summer Bootcamps Matter (Especially in 2025)</h2>
        <p className="mb-4">We're living in a time where tech is evolving faster than ever. With AI automating tasks and no code platforms allowing anyone to build apps, it's no longer about knowing how to code—it's about knowing how to think creatively and work smart.</p>
        <p className="mb-4">Summer bootcamps are short, intense programs designed to teach you exactly that. In just a few weeks, you'll:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>Build real-world projects</li>
          <li>Learn from industry pros</li>
          <li>Collaborate with like-minded teens</li>
          <li>Get a feel of the future job market—before even graduating school</li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Top 5 Summer Bootcamps for Teenagers in India (2025 Edition)</h2>
        
        <div className="space-y-8">
          <div className="pixel-border p-6 bg-maximally-blue/5">
            <h3 className="font-space font-bold text-xl mb-4">1. Maximally Bootcamp – AI & No Code Startup Lab 🧠🚀</h3>
            <p className="mb-2"><strong>Mode:</strong> Online | <strong>Age Group:</strong> 13–18 | <strong>Duration:</strong> 1 Week</p>
            <p className="mb-4">If you're looking for the most future-forward summer bootcamp, Maximally should top your list.</p>
            <p className="mb-4">This 1-week immersive bootcamp lets you launch your own AI-powered product—without writing a single line of code. How? By teaching you how to use no code tools like Bubble, Thunkable, and Zapier, alongside powerful AI tools like ChatGPT, Runway ML, and Notion AI.</p>
            <div className="bg-white/50 p-4 rounded">
              <h4 className="font-space font-bold text-lg mb-2">What You'll Learn:</h4>
              <ul className="list-disc pl-6">
                <li>How to brainstorm and validate startup ideas</li>
                <li>Build websites and mobile apps using no code</li>
                <li>Integrate AI features like chatbots or smart search</li>
                <li>Present your product in a real investor-style pitch</li>
              </ul>
            </div>
          </div>

          {[2, 3, 4, 5].map((num, index) => (
            <div key={index} className="pixel-border p-6 bg-maximally-blue/5">
              <h3 className="font-space font-bold text-xl mb-4">
                {num}. {
                  num === 2 ? "Coding Ninjas – Tech Bootcamp for High Schoolers 💻" :
                  num === 3 ? "Camp K12 – AI Creators Bootcamp 🎨🤖" :
                  num === 4 ? "Younity – No Code + AI Innovation Camp 🌱⚡" :
                  "Tinkerly – STEM + AI Bootcamp with No Code Challenges 🔬🧩"
                }
              </h3>
              <p className="mb-2">
                <strong>Location:</strong> {
                  num === 2 ? "Delhi NCR + Online" :
                  num === 3 ? "Online" :
                  num === 4 ? "Online" :
                  "Jaipur + Online"
                } | <strong>Age Group:</strong> {
                  num === 2 ? "14–18" :
                  num === 3 ? "13–17" :
                  num === 4 ? "14–18" :
                  "12–18"
                } | <strong>Duration:</strong> {
                  num === 2 ? "3 Weeks" :
                  num === 3 ? "2–3 Weeks" :
                  "2 Weeks"
                }
              </p>
              <div className="bg-white/50 p-4 rounded mt-4">
                <h4 className="font-space font-bold text-lg mb-2">What You'll Learn:</h4>
                <ul className="list-disc pl-6">
                  {num === 2 && (
                    <>
                      <li>Python fundamentals & data science basics</li>
                      <li>Introduction to AI & machine learning</li>
                      <li>Bonus week on tools like Canva, Webflow, and Make Auto ML</li>
                    </>
                  )}
                  {num === 3 && (
                    <>
                      <li>Build face filters using AR and AI</li>
                      <li>Create AI art and generate music with tools like Soundraw and DALL·E</li>
                      <li>Design interactive games with no code game builders like GDevelop</li>
                    </>
                  )}
                  {num === 4 && (
                    <>
                      <li>Use tools like Tilda, Zapier, and Notion AI</li>
                      <li>Train simple AI models using Google's Teachable Machine</li>
                      <li>Work in teams to solve real social problems</li>
                    </>
                  )}
                  {num === 5 && (
                    <>
                      <li>Build and train visual AI models</li>
                      <li>Automate tasks and create custom bots</li>
                      <li>Explore STEM with gamified learning</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">What Makes These Bootcamps Special?</h2>
        <p className="mb-4">In 2025, the best bootcamps go beyond just coding. They:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>Encourage real-world problem-solving</li>
          <li>Teach you to work with AI and automation</li>
          <li>Empower you to build, launch, and test your own projects</li>
          <li>Use no code tools so you can skip the syntax and focus on ideas</li>
        </ul>
      </section>

      <section className="my-8">
        <div className="pixel-border bg-maximally-blue/5 p-6">
          <h2 className="font-space font-bold text-2xl mb-4">Ready to Launch Your Future?</h2>
          <p className="mb-4">There's no better way to spend your summer than learning how to build cool tech, meet awesome people, and maybe even kick off a future career.</p>
          <div className="flex justify-center">
            <Link to="/bootcamps">
              <Button className="font-space font-bold">
                Join Maximally Bootcamp
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">TL;DR – Quick Recap</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-maximally-blue/10">
                <th className="p-2 border">Bootcamp</th>
                <th className="p-2 border">What Makes It Stand Out</th>
                <th className="p-2 border">Duration</th>
                <th className="p-2 border">Mode</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">Maximally</td>
                <td className="p-2 border">AI + No Code + entrepreneurship</td>
                <td className="p-2 border">1 Week</td>
                <td className="p-2 border">Online</td>
              </tr>
              <tr>
                <td className="p-2 border">Coding Ninjas</td>
                <td className="p-2 border">Strong in Python & AI Foundations</td>
                <td className="p-2 border">3 Weeks</td>
                <td className="p-2 border">Hybrid</td>
              </tr>
              <tr>
                <td className="p-2 border">Camp K12</td>
                <td className="p-2 border">Creative Projects with AI</td>
                <td className="p-2 border">2–3 Weeks</td>
                <td className="p-2 border">Online</td>
              </tr>
              <tr>
                <td className="p-2 border">Younity</td>
                <td className="p-2 border">Collaborative Innovation + AI</td>
                <td className="p-2 border">2 Weeks</td>
                <td className="p-2 border">Online</td>
              </tr>
              <tr>
                <td className="p-2 border">Tinkerly</td>
                <td className="p-2 border">STEM meets AI + Hardware</td>
                <td className="p-2 border">2 Weeks</td>
                <td className="p-2 border">Hybrid</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );

  return (
    <BlogPost
      title="Top 5 Summer Bootcamps for Teenagers in India (2025 Edition)"
      date="April 17, 2025"
      readTime="8 min read"
      content={content}
    />
  );
};

export default SummerBootcamps2025;
