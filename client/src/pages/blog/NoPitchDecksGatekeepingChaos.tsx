import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, ArrowRight, X, Check } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const NoPitchDecksGatekeepingChaos = () => {
  return (
    <>
      <SEO
        title="No Pitch Decks. No Gatekeeping. Just Chaos."
        description="Code Hypothesis isn't startup theater or hand-holding. 24 hours of shipping weird experiments judged on boldness + execution, not polish. Chaos is honest."
        keywords="no pitch decks, no gatekeeping, chaos hackathon, punk rules, code hypothesis, raw experiments, anti-gatekeeping"
        canonicalUrl="https://maximally.in/blog/no-pitch-decks-gatekeeping-chaos"
      />
      
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Back Button */}
          <Link 
            to="/blog" 
            className="inline-flex items-center text-maximally-red hover:text-maximally-yellow transition-colors mb-8 font-mono"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-green-400 mb-6 font-mono leading-tight">
              No Pitch Decks. No Gatekeeping. Just Chaos.
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-white/70 text-sm font-mono">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                January 24, 2025
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                5 min read
              </div>
              <div className="flex items-center gap-2">
                <User size={16} />
                Code Hypothesis Team
              </div>
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-lg prose-invert max-w-none font-mono">
            <p className="text-lg text-white/90 leading-relaxed mb-4">Most hackathons:</p>

            <div className="space-y-3 mb-8">
              <div className="bg-red-500/10 border-l-4 border-red-500 p-4">
                <p className="text-white/90">• A welcome speech longer than your attention span.</p>
              </div>
              <div className="bg-red-500/10 border-l-4 border-red-500 p-4">
                <p className="text-white/90">• Mentors telling you to "pivot."</p>
              </div>
              <div className="bg-red-500/10 border-l-4 border-red-500 p-4">
                <p className="text-white/90">• Ten-slide decks pretending to be products.</p>
              </div>
            </div>

            <div className="bg-black/70 border-2 border-red-500 p-8 text-center mb-8">
              <p className="text-3xl text-red-500 font-bold mb-4">Hard pass.</p>
              <p className="text-white/90 text-lg">That's not hacking. That's performance art.</p>
            </div>

            <p className="text-xl text-green-400 font-bold text-center mb-12">
              <strong>Code Hypothesis</strong> isn't here for that.
            </p>

            <h2 className="text-3xl font-bold text-red-500 mb-6 font-mono">
              What We're Not
            </h2>

            <div className="space-y-4 mb-12">
              {[
                "No startup theater",
                "No hand-holding", 
                "No \"are you investor-ready?\" questions",
                "No gatekeeping based on stack or skill"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-black/50 border border-red-500/30 p-4">
                  <X size={20} className="text-red-500 flex-shrink-0" />
                  <p className="text-white/90">{item}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-900/50 border-l-4 border-green-400 p-6 mb-12">
              <p className="text-white/90 leading-relaxed">
                If you can Google, prototype, or duct-tape something in 24 hours—you're qualified.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-green-400 mb-6 font-mono">
              What We Are
            </h2>

            <div className="space-y-4 mb-8">
              {[
                "24 hours of shipping weird experiments",
                "Solo or squad (up to 4)",
                "Any stack, tool, or platform—yes, no-code counts",
                "Judged on boldness + execution, not polish"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-black/50 border border-green-400/30 p-4">
                  <Check size={20} className="text-green-400 flex-shrink-0" />
                  <p className="text-white/90">{item}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-400/20 to-yellow-400/20 border border-green-400 p-8 text-center mb-12">
              <p className="text-xl text-green-400 font-bold">
                The only thing that matters: <strong>did you test a real hypothesis?</strong>
              </p>
            </div>

            <h2 className="text-3xl font-bold text-yellow-400 mb-6 font-mono">
              Why Chaos Wins
            </h2>

            <p className="text-lg text-white/90 leading-relaxed mb-4">
              Chaos isn't sloppy—it's honest.<br />
              It's what happens when you stop polishing and just <strong className="text-yellow-400">ship the thing.</strong>
            </p>

            <p className="text-lg text-white/90 leading-relaxed mb-6">At Code Hypothesis:</p>

            <div className="space-y-4 mb-8">
              {[
                "Bugs can be features if they make your point",
                "Scope creep gets laughed out of the room",
                "Failing fast is still winning (because you proved something wrong)"
              ].map((item, index) => (
                <div key={index} className="bg-yellow-400/10 border border-yellow-400/30 p-4">
                  <p className="text-white/90">• {item}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-900/50 border-l-4 border-red-500 p-6 mb-12">
              <p className="text-white/90 leading-relaxed">
                If you're used to hackathons where people obsess over color palettes and pitch theatrics—you're in for a culture shock.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-green-400 mb-6 font-mono">
              Who Belongs Here
            </h2>

            <div className="space-y-4 mb-12">
              {[
                "Students who hate PowerPoint but love breaking stuff",
                "No-coders who can whip up a working demo faster than a dev can npm install",
                "Beginners tired of \"you must know X\" gatekeeping",
                "Builders who want to test wild theories instead of polishing fake startups"
              ].map((item, index) => (
                <div key={index} className="bg-green-400/10 border border-green-400/30 p-4">
                  <p className="text-white/90">• {item}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-orange-500/20 to-orange-400/20 border border-orange-500 p-8 text-center mb-12">
              <p className="text-lg text-white/90 leading-relaxed">
                If you've ever thought, <em className="text-orange-400">"what if this dumb idea actually works?"</em> — congratulations, you belong.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-red-500 mb-6 font-mono">
              The Punk Rules of Code Hypothesis
            </h2>

            <div className="space-y-6 mb-12">
              {[
                { num: "1", rule: "Spray it. Ship it.", desc: "Don't overthink—just drop it." },
                { num: "2", rule: "Keep it ugly.", desc: "Raw prototypes > polished decks." },
                { num: "3", rule: "Test, don't pitch.", desc: "A hypothesis is more powerful than a fantasy." },
                { num: "4", rule: "Break politely.", desc: "Chaos is welcome, but respect your team + the deadline." },
                { num: "5", rule: "Ship something.", desc: "Even half-broken counts—if it proves your point." }
              ].map((rule, index) => (
                <div key={index} className="bg-black/70 border-l-4 border-red-500 p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-500 text-white font-bold text-xl w-8 h-8 flex items-center justify-center font-mono">
                      {rule.num}
                    </div>
                    <div>
                      <h3 className="text-red-500 font-bold text-lg mb-2">{rule.rule}</h3>
                      <p className="text-white/90">{rule.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-3xl font-bold text-green-400 mb-6 font-mono">
              The Manifesto
            </h2>

            <div className="bg-black/90 border-2 border-green-400 p-8 mb-12">
              <div className="space-y-4">
                <p className="text-lg text-white/90 leading-relaxed">We don't want your pitch.</p>
                <p className="text-lg text-white/90 leading-relaxed">We don't want your market sizing.</p>
                <p className="text-lg text-white/90 leading-relaxed">We don't want to see if you can say "AI" 20 times in 5 minutes.</p>
                <div className="border-t border-green-400 pt-4 mt-6">
                  <p className="text-xl text-green-400 font-bold leading-relaxed">
                    We want your wildest hypothesis, shipped in 24 hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 border-l-4 border-yellow-400 p-6 mb-12">
              <p className="text-white/90 leading-relaxed">
                Because hackathons should feel like tagging a wall at midnight: quick, messy, impossible to ignore.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-blue-400 mb-6 font-mono">
              Quick Details
            </h2>

            <div className="bg-black/70 border border-blue-400 p-6 mb-8">
              <ul className="space-y-2 text-white/90">
                <li><strong className="text-blue-400">Event:</strong> Code Hypothesis</li>
                <li><strong className="text-blue-400">Date:</strong> Sept 28, 2025</li>
                <li><strong className="text-blue-400">Format:</strong> Online, global, 24 hours</li>
                <li><strong className="text-blue-400">Who:</strong> Solo hackers or teams of 4, beginners welcome</li>
                <li><strong className="text-blue-400">Submission:</strong> Repo/prototype + short write-up of your hypothesis + what happened</li>
                <li><strong className="text-blue-400">Judging:</strong> Async (no pitch decks, no Shark Tank)</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-green-400 mb-6 font-mono">
              Final Word
            </h2>

            <p className="text-lg text-white/90 leading-relaxed mb-8">
              If you want a hackathon that feels like LinkedIn networking, there are plenty.
            </p>

            <div className="bg-gradient-to-r from-red-500/20 to-yellow-400/20 border border-red-500 p-8 text-center mb-12">
              <p className="text-lg text-white/90 leading-relaxed mb-6">
                If you want a hackathon that feels like spray-paint on concrete—fast, raw, unfiltered—this is it.
              </p>
              <a 
                href="https://codehypothesis.devpost.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 font-bold font-mono hover:bg-red-600 transition-colors"
              >
                Register on Devpost
                <ArrowRight size={16} />
              </a>
              <p className="text-sm text-white/70 mt-4">and bring your chaos.</p>
            </div>
          </article>

          {/* Related Links */}
          <div className="border-t border-gray-800 pt-8">
            <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">Related Posts</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/blog/why-hackathons-got-boring-code-hypothesis" className="block bg-gray-900/50 border border-gray-700 hover:border-green-400 p-4 transition-colors">
                <h4 className="text-green-400 font-bold mb-2">Why Hackathons Got Boring</h4>
                <p className="text-white/70 text-sm">Breaking the script with Code Hypothesis</p>
              </Link>
              <Link to="/blog/survive-code-hypothesis-24-hours" className="block bg-gray-900/50 border border-gray-700 hover:border-green-400 p-4 transition-colors">
                <h4 className="text-green-400 font-bold mb-2">24-Hour Survival Guide</h4>
                <p className="text-white/70 text-sm">How to make it through the chaos</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default NoPitchDecksGatekeepingChaos;