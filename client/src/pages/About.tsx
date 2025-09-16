
import { ArrowRight, Users, Calendar, MapPin, Trophy, Download, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import TallyFormDialog from "@/components/TallyFormDialog";
import { useState } from "react";

const About = () => {
  const [isTallyFormOpen, setIsTallyFormOpen] = useState(false);
  
  return (
    <div className="min-h-screen pt-20">
      <SEO 
        title="About Maximally | Builder-First Platform for Global Hackathons"
        description="Maximally is a builder-first platform for hackathons, competitions, and creative systems. Join the global hackathon league for ambitious builders worldwide."
      />

      {/* 1. Hero / What Maximally Is */}
      <section className="py-20 bg-maximally-black relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 animate-grid-flow" />
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="font-press-start text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            <span className="bg-maximally-red/20 px-2">Maximally</span> is a builder-first platform
          </h1>
          <p className="font-jetbrains text-white/90 text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
            For hackathons, competitions, and creative systems. Where ambitious builders worldwide come to prove their worth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events" className="pixel-button bg-maximally-red text-black px-8 py-4 hover:bg-maximally-yellow transition-all">
              See Events
            </Link>
            <Link to="/blog" className="pixel-button bg-black border-2 border-maximally-red text-white px-8 py-4 hover:border-maximally-yellow transition-all">
              Our Platform
            </Link>
            <Link to="/contact" className="pixel-button bg-maximally-blue text-white px-8 py-4 hover:bg-maximally-green transition-all">
              Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Impact Snapshot */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">Impact Snapshot</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="font-press-start text-3xl text-maximally-red mb-2">1000+</div>
              <div className="font-jetbrains text-gray-600">Participants</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="font-press-start text-3xl text-maximally-blue mb-2">10</div>
              <div className="font-jetbrains text-gray-600">Events</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="font-press-start text-3xl text-maximally-green mb-2">50+</div>
              <div className="font-jetbrains text-gray-600">Countries</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="font-press-start text-3xl text-maximally-yellow mb-2">₹2L</div>
              <div className="font-jetbrains text-gray-600">Revenue</div>
            </div>
          </div>
          <p className="text-center font-jetbrains text-gray-500 mt-6">Data as of December 2025</p>
        </div>
      </section>

      {/* 3. What We Do (Core Work) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-press-start text-lg mb-3">Events</h3>
              <p className="font-jetbrains mb-4">Hackathons, bootcamps, make-a-thons</p>
              <Link to="/events" className="text-maximally-red font-jetbrains hover:underline">View Events →</Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="font-press-start text-lg mb-3">Platform</h3>
              <p className="font-jetbrains mb-4">Building MaximallyHack - hosting + judge dashboards + team formation</p>
              <Link to="/blog" className="text-maximally-red font-jetbrains hover:underline">Learn More →</Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-press-start text-lg mb-3">Federation</h3>
              <p className="font-jetbrains mb-4">MFHOP - network of hackathon organizers</p>
              <Link to="/allies" className="text-maximally-red font-jetbrains hover:underline">Join Federation →</Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="font-press-start text-lg mb-3">Studios</h3>
              <p className="font-jetbrains mb-4">Content/media vertical - podcasts, reels, blog</p>
              <Link to="/blog" className="text-maximally-red font-jetbrains hover:underline">Read Blog →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. People Behind It */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-8 text-center">People Behind It</h2>
          <p className="font-jetbrains text-xl text-center mb-12 max-w-3xl mx-auto">
            Built by the <span className="bg-maximally-red/20 px-2">Maximally Task Force</span> - a high-agency culture of builders who move fast and ship real products.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center bg-gray-50 p-6 rounded-lg">
              <div className="w-16 h-16 bg-maximally-red rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-press-start text-lg mb-2">Task Force</h3>
              <p className="font-jetbrains text-gray-600">High-agency builders</p>
            </div>
            <div className="text-center bg-gray-50 p-6 rounded-lg">
              <div className="w-16 h-16 bg-maximally-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-press-start text-lg mb-2">Leaders</h3>
              <p className="font-jetbrains text-gray-600">Innovation drivers</p>
            </div>
            <div className="text-center bg-gray-50 p-6 rounded-lg">
              <div className="w-16 h-16 bg-maximally-green rounded-full mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-press-start text-lg mb-2">Global</h3>
              <p className="font-jetbrains text-gray-600">Worldwide network</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link to="/contact" className="pixel-button bg-maximally-red text-white px-8 py-4 hover:bg-maximally-yellow hover:text-black transition-all">
              See Core Team
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Partners & Collabs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">Partners & Collaborators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="font-press-start text-sm">Masters' Union</div>
                <div className="font-jetbrains text-xs text-gray-500 mt-2">Outreach</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="font-press-start text-sm">MakeX</div>
                <div className="font-jetbrains text-xs text-gray-500 mt-2">Sponsors</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="font-press-start text-sm">YRI</div>
                <div className="font-jetbrains text-xs text-gray-500 mt-2">Mentors</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="font-press-start text-sm">Calyptus</div>
                <div className="font-jetbrains text-xs text-gray-500 mt-2">Platform</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="font-press-start text-sm">More Soon</div>
                <div className="font-jetbrains text-xs text-gray-500 mt-2">Stay Tuned</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="font-press-start text-sm">Join Us</div>
                <div className="font-jetbrains text-xs text-gray-500 mt-2">Partnership</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Judges & Mentors */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">Judges & Mentors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-gray-50 p-6 rounded-lg">
              <div className="w-20 h-20 bg-maximally-red rounded-full mx-auto mb-4"></div>
              <h3 className="font-press-start text-lg mb-2">Industry Leaders</h3>
              <p className="font-jetbrains text-gray-600">Tech Veterans</p>
            </div>
            <div className="text-center bg-gray-50 p-6 rounded-lg">
              <div className="w-20 h-20 bg-maximally-blue rounded-full mx-auto mb-4"></div>
              <h3 className="font-press-start text-lg mb-2">Startup Founders</h3>
              <p className="font-jetbrains text-gray-600">Scale Experts</p>
            </div>
            <div className="text-center bg-gray-50 p-6 rounded-lg">
              <div className="w-20 h-20 bg-maximally-green rounded-full mx-auto mb-4"></div>
              <h3 className="font-press-start text-lg mb-2">Innovation Experts</h3>
              <p className="font-jetbrains text-gray-600">Future Builders</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link to="/contact" className="pixel-button bg-maximally-blue text-white px-8 py-4 hover:bg-maximally-green transition-all">
              See All Judges
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Press & Mentions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">Press & Mentions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-press-start text-lg mb-4">Featured In</h3>
              <p className="font-jetbrains text-gray-600 mb-4">Coverage coming soon across major tech publications</p>
              <div className="font-jetbrains text-sm text-maximally-red">Coming Soon</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-press-start text-lg mb-4">Recognition</h3>
              <p className="font-jetbrains text-gray-600 mb-4">"Building the future of hackathon culture"</p>
              <div className="font-jetbrains text-sm text-maximally-blue">Industry Quote</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-press-start text-lg mb-4">Awards</h3>
              <p className="font-jetbrains text-gray-600 mb-4">Innovation in community building</p>
              <div className="font-jetbrains text-sm text-maximally-green">Recognition</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Story & Timeline with Grand Indian Hackathon Season */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">Our Story & Timeline</h2>
          <div className="space-y-8">
            <div className="border-l-4 border-maximally-red pl-8">
              <div className="bg-maximally-red text-white px-3 py-1 rounded font-press-start text-sm inline-block mb-2">CodeQuest</div>
              <h3 className="font-press-start text-xl mb-2">The Beginning</h3>
              <p className="font-jetbrains text-gray-600">Started as the biggest school hackathon</p>
            </div>
            <div className="border-l-4 border-maximally-blue pl-8">
              <div className="bg-maximally-blue text-white px-3 py-1 rounded font-press-start text-sm inline-block mb-2">Platform Launch</div>
              <h3 className="font-press-start text-xl mb-2">Maximally Launch</h3>
              <p className="font-jetbrains text-gray-600">Global hackathon league for builders worldwide</p>
            </div>
            <div className="border-l-4 border-maximally-green pl-8">
              <div className="bg-maximally-green text-white px-3 py-1 rounded font-press-start text-sm inline-block mb-2">July 2025</div>
              <h3 className="font-press-start text-xl mb-2">Startup Make-a-thon</h3>
              <p className="font-jetbrains text-gray-600">7-day sprint from idea to MVP to public pitch</p>
            </div>
            <div className="border-l-4 border-maximally-yellow pl-8">
              <div className="bg-maximally-yellow text-black px-3 py-1 rounded font-press-start text-sm inline-block mb-2">August 2025</div>
              <h3 className="font-press-start text-xl mb-2">AI Shipathon</h3>
              <p className="font-jetbrains text-gray-600">48-hour global AI hackathon for builders and creators</p>
            </div>
            
            {/* Grand Indian Hackathon Season */}
            <div className="border-l-4 border-red-600 pl-8 bg-red-50 p-6 rounded-r-lg">
              <div className="bg-red-600 text-white px-3 py-1 rounded font-press-start text-sm inline-block mb-4">🇮🇳 September - November 2025</div>
              <h3 className="font-press-start text-2xl mb-4 text-red-600">Grand Indian Hackathon Season</h3>
              <p className="font-jetbrains text-gray-700 mb-6">8 hackathons back-to-back, the biggest innovation challenge series</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="font-jetbrains">
                  <strong>🧪 Code Hypothesis</strong> - September 2025<br/>
                  <span className="text-gray-600">Test your coding theories</span>
                </div>
                <div className="font-jetbrains">
                  <strong>⚡ Protocol 404</strong> - October 2025<br/>
                  <span className="text-gray-600">When the system is broken, build anyway</span>
                </div>
                <div className="font-jetbrains">
                  <strong>📝 Project CodeGen</strong> - October 2025<br/>
                  <span className="text-gray-600">Beyond hackathons - real project generation</span>
                </div>
                <div className="font-jetbrains">
                  <strong>🍂 Maximally Hacktober</strong> - October 2025<br/>
                  <span className="text-gray-600">October's biggest hackathon celebration</span>
                </div>
                <div className="font-jetbrains">
                  <strong>⚡ PromptStorm</strong> - Oct 25-26, 2025<br/>
                  <span className="text-gray-600">24-hour AI prompt-engineering hackathon</span>
                </div>
                <div className="font-jetbrains">
                  <strong>☢️ Codepocalypse</strong> - Oct 18-19, 2025<br/>
                  <span className="text-gray-600">48-hour chaotic hackathon</span>
                </div>
                <div className="font-jetbrains">
                  <strong>🎮 Grand Tech Assembly</strong> - Nov 1-7, 2025<br/>
                  <span className="text-gray-600">7-day GTA-themed hackathon</span>
                </div>
                <div className="font-jetbrains">
                  <strong>🔥 Steal-A-Thon</strong> - Nov 9-10, 2025<br/>
                  <span className="text-gray-600">Where original ideas are banned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-press-start text-3xl mb-12 text-center">What Builders Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="font-jetbrains text-gray-600 mb-4">"Maximally changed how I think about building. The hackathons are intense and real."</p>
              <div className="font-press-start text-sm text-maximally-red">- Builder, AI Shipathon</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="font-jetbrains text-gray-600 mb-4">"Best hackathon experience. The judges actually care about what you're building."</p>
              <div className="font-press-start text-sm text-maximally-blue">- Participant, Makeathon</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="font-jetbrains text-gray-600 mb-4">"The Grand Indian Hackathon Season pushed me to ship 3 projects in 2 months."</p>
              <div className="font-press-start text-sm text-maximally-green">- Developer, Code Hypothesis</div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Future Direction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-press-start text-3xl mb-8">Future Direction</h2>
          <p className="font-jetbrains text-xl max-w-3xl mx-auto mb-12">
            Platform launch. Federation scaling. More events. Global expansion.
            <br/><br/>
            <span className="bg-maximally-red/20 px-2">We're just getting started.</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-press-start text-lg mb-3">Platform 2.0</h3>
              <p className="font-jetbrains">MaximallyHack full launch</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="font-press-start text-lg mb-3">Global Scale</h3>
              <p className="font-jetbrains">Federation expansion worldwide</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-press-start text-lg mb-3">More Events</h3>
              <p className="font-jetbrains">Year-round hackathon seasons</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Media Kit & Resources */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-press-start text-3xl mb-8">Media Kit & Resources</h2>
          <p className="font-jetbrains text-xl mb-8">Download brand assets and access resources</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="pixel-button bg-maximally-red text-white px-8 py-4 hover:bg-maximally-yellow hover:text-black transition-all flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Logo Pack
            </button>
            <Link to="/blog" className="pixel-button bg-black border-2 border-maximally-red text-white px-8 py-4 hover:border-maximally-yellow transition-all flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Resources
            </Link>
          </div>
        </div>
      </section>

      {/* 12. Culture / Join Us */}
      <section className="py-16 bg-maximally-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-press-start text-3xl mb-8">Join the Maximally Task Force</h2>
          <p className="font-jetbrains text-xl mb-8 max-w-3xl mx-auto">
            High-agency. Builder-first. Ship real products. Join a culture where proof-of-work matters more than credentials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <TallyFormDialog open={isTallyFormOpen} onOpenChange={setIsTallyFormOpen} />
            <button 
              onClick={() => setIsTallyFormOpen(true)}
              className="pixel-button bg-maximally-red text-black px-8 py-4 hover:bg-maximally-yellow transition-all"
            >
              Apply to Join
            </button>
            <Link to="/contact" className="pixel-button bg-black border-2 border-maximally-red text-white px-8 py-4 hover:border-maximally-yellow transition-all">
              Volunteer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
