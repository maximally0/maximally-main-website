
import { useEffect, useState } from "react";
import { ArrowRight, Heart, Zap, Target, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const Story = () => {
  const [visibleSections, setVisibleSections] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = parseInt(entry.target.getAttribute('data-section') || '0');
            setVisibleSections(prev => {
              const newSet = new Set([...prev, sectionIndex]);
              return Array.from(newSet);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('[data-section]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SEO
        title="Our Story | How Maximally Was Born"
        description="The origin story of Maximally - from a small town dreamer to building India's biggest hackathon league for Gen Z builders."
        keywords="maximally story, rishul chanana, startup founder story, hackathon origin, gen z entrepreneurship"
        canonicalUrl="https://maximally.in/story"
      />

      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center px-4 pt-20">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-8">
                <span className="text-6xl animate-pulse">💭</span>
              </div>
              
              <h1 className="font-press-start text-4xl md:text-6xl lg:text-7xl mb-8">
                <span className="bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#45B7D1] bg-clip-text text-transparent animate-gradient">
                  How Maximally
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#96CEB4] via-[#FFEAA7] to-[#DDA0DD] bg-clip-text text-transparent animate-gradient">
                  Was Born
                </span>
              </h1>

              <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-8">
                <p className="font-jetbrains text-xl md:text-2xl text-gray-300 italic">
                  "i didn't grow up in silicon valley<br />
                  i grew up in <span className="text-[#4ECDC4] font-bold">zirakpur</span>"
                </p>
              </div>

              <div className="text-right">
                <p className="font-press-start text-lg text-[#FFEAA7]">
                  — rishul chanana, founder & ceo
                </p>
              </div>
            </div>
          </section>

          {/* Section 1: Origins */}
          <section 
            data-section="1"
            className={`py-20 px-4 transition-all duration-1000 ${visibleSections.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="container mx-auto max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-press-start text-3xl md:text-4xl mb-8">
                    <span className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] bg-clip-text text-transparent">
                      The Beginning
                    </span>
                  </h2>
                  
                  <div className="space-y-6 font-jetbrains text-lg leading-relaxed">
                    <p className="text-gray-300">
                      <span className="text-[#4ECDC4] font-bold">no startup dads</span><br />
                      <span className="text-[#96CEB4] font-bold">no hack clubs</span><br />
                      just a laptop, a messy brain, and a <span className="text-[#FFEAA7] font-bold animate-pulse">stupid amount of ambition</span>
                    </p>
                    
                    <p className="text-gray-300">
                      i started <span className="text-[#DDA0DD] font-bold">alone</span><br />
                      no cofounder, no mentor, no team — just <span className="text-[#FF6B6B] italic">vibes and hunger</span>
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-gradient-to-br from-[#FF6B6B]/20 to-[#4ECDC4]/20 rounded-2xl p-8 border border-white/10">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🏠</div>
                      <h3 className="font-press-start text-xl text-[#4ECDC4] mb-4">zirakpur</h3>
                      <p className="font-jetbrains text-gray-400">
                        where dreams began<br />
                        far from silicon valley<br />
                        but close to ambition
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Failed Experiments */}
          <section 
            data-section="2"
            className={`py-20 px-4 transition-all duration-1000 ${visibleSections.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="container mx-auto max-w-6xl">
              <h2 className="font-press-start text-3xl md:text-4xl text-center mb-12">
                <span className="bg-gradient-to-r from-[#DDA0DD] to-[#FF8E8E] bg-clip-text text-transparent">
                  The Failed Experiments
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gradient-to-br from-[#96CEB4]/10 to-[#4ECDC4]/10 rounded-2xl p-8 border border-[#4ECDC4]/30">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-4">🦠</div>
                    <h3 className="font-press-start text-xl text-[#4ECDC4]">probiotic brand</h3>
                  </div>
                  <p className="font-jetbrains text-gray-400 text-center italic">
                    "i thought gen z gut health was the next big thing"
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#FFEAA7]/10 to-[#DDA0DD]/10 rounded-2xl p-8 border border-[#DDA0DD]/30">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-4">✨</div>
                    <h3 className="font-press-start text-xl text-[#DDA0DD]">skincare</h3>
                  </div>
                  <p className="font-jetbrains text-gray-400 text-center italic">
                    "india's version of glossier"
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-black/50 backdrop-blur-sm border border-[#FF6B6B]/30 rounded-2xl p-8 max-w-3xl mx-auto">
                  <h3 className="font-press-start text-2xl text-[#FF6B6B] mb-6">both flopped.</h3>
                  <p className="font-jetbrains text-xl text-gray-300 leading-relaxed">
                    but those experiments taught me something:<br />
                    <span className="text-[#4ECDC4] font-bold">i didn't care about the product</span><br />
                    <span className="text-[#FFEAA7] font-bold">i cared about building with people</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Finding Home */}
          <section 
            data-section="3"
            className={`py-20 px-4 transition-all duration-1000 ${visibleSections.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="font-press-start text-3xl md:text-4xl mb-8">
                  <span className="bg-gradient-to-r from-[#45B7D1] to-[#96CEB4] bg-clip-text text-transparent">
                    Finding Home in Hackathons
                  </span>
                </h2>
                
                <div className="text-6xl mb-8">🏠</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="bg-gradient-to-br from-[#FF6B6B]/10 to-black rounded-2xl p-6 border border-[#FF6B6B]/20">
                  <h3 className="font-press-start text-lg text-[#FF6B6B] mb-4">i was never</h3>
                  <ul className="font-jetbrains text-gray-300 space-y-2">
                    <li>❌ the most technical guy</li>
                    <li>❌ the best coder</li>
                    <li>❌ a deck-polisher</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#4ECDC4]/10 to-black rounded-2xl p-6 border border-[#4ECDC4]/20">
                  <h3 className="font-press-start text-lg text-[#4ECDC4] mb-4">but i could</h3>
                  <p className="font-jetbrains text-gray-300">
                    translate between <span className="text-[#FFEAA7]">vision</span> and <span className="text-[#96CEB4]">execution</span><br />
                    between <span className="text-[#DDA0DD]">pitch decks</span> and <span className="text-[#45B7D1]">github repos</span>
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#FFEAA7]/10 to-black rounded-2xl p-6 border border-[#FFEAA7]/20">
                  <h3 className="font-press-start text-lg text-[#FFEAA7] mb-4">hackathons were</h3>
                  <p className="font-jetbrains text-gray-300">
                    the only place that made me feel <span className="text-[#96CEB4] font-bold">seen</span><br />
                    where strangers became <span className="text-[#4ECDC4] font-bold">teammates at 2am</span>
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#96CEB4]/10 via-[#4ECDC4]/10 to-[#45B7D1]/10 rounded-2xl p-8 border border-white/10">
                <h3 className="font-press-start text-2xl text-center mb-8 text-[#4ECDC4]">the journey</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📚</div>
                    <h4 className="font-press-start text-[#FFEAA7]">class 9</h4>
                    <p className="font-jetbrains text-gray-400">joined my first hackathon</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎯</div>
                    <h4 className="font-press-start text-[#96CEB4]">class 10</h4>
                    <p className="font-jetbrains text-gray-400">hosted one at school</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🚀</div>
                    <h4 className="font-press-start text-[#DDA0DD]">class 11</h4>
                    <p className="font-jetbrains text-gray-400">co-founded CodeQuest → HackSkye</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: What is Maximally */}
          <section 
            data-section="4"
            className={`py-20 px-4 transition-all duration-1000 ${visibleSections.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="font-press-start text-3xl md:text-5xl mb-8">
                  <span className="bg-gradient-to-r from-[#FF6B6B] via-[#FFEAA7] to-[#4ECDC4] bg-clip-text text-transparent">
                    So What is Maximally?
                  </span>
                </h2>
                
                <div className="text-6xl mb-8 animate-bounce">⚡</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <div>
                  <h3 className="font-press-start text-2xl text-[#FF6B6B] mb-8">maximally isn't</h3>
                  <div className="space-y-4">
                    {["just a hackathon company", "bootcamps", "a discord server", "devpost spam"].map((item, index) => (
                      <div key={index} className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                        <p className="font-jetbrains text-gray-300">❌ {item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-press-start text-2xl text-[#4ECDC4] mb-8">maximally is</h3>
                  <div className="bg-gradient-to-br from-[#4ECDC4]/10 to-[#96CEB4]/10 border border-[#4ECDC4]/30 rounded-2xl p-8">
                    <p className="font-jetbrains text-xl text-gray-200 leading-relaxed">
                      a system for <span className="text-[#FFEAA7] font-bold">young, hungry, slightly chaotic builders</span><br />
                      who don't fit into <span className="text-[#DDA0DD]">IIT</span> or <span className="text-[#FF6B6B]">VC paths</span><br />
                      but still want to <span className="text-[#4ECDC4] font-bold">ship things that matter</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: "🚀", title: "startup makeathons", color: "[#FF6B6B]" },
                  { icon: "🤖", title: "ai shipathons", color: "[#4ECDC4]" },
                  { icon: "🎨", title: "brand-a-thons & design sprints", color: "[#FFEAA7]" },
                  { icon: "🎯", title: "scrapyard showdown & clout court", color: "[#DDA0DD]" },
                  { icon: "🎬", title: "maximally studios", color: "[#96CEB4]" },
                  { icon: "🌐", title: "growing community", color: "[#45B7D1]" }
                ].map((item, index) => (
                  <div key={index} className={`bg-gradient-to-br from-${item.color}/10 to-black rounded-xl p-6 border border-${item.color}/20 hover:scale-105 transition-transform`}>
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h4 className={`font-press-start text-sm text-${item.color}`}>{item.title}</h4>
                  </div>
                ))}
              </div>

              <div className="text-center mt-16">
                <div className="bg-black/50 backdrop-blur-sm border border-[#FFEAA7]/30 rounded-2xl p-8 max-w-2xl mx-auto">
                  <p className="font-press-start text-xl text-[#FFEAA7]">
                    a place where execution is culture
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Who is it for */}
          <section 
            data-section="5"
            className={`py-20 px-4 transition-all duration-1000 ${visibleSections.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="font-press-start text-3xl md:text-4xl mb-8">
                  <span className="bg-gradient-to-r from-[#96CEB4] to-[#45B7D1] bg-clip-text text-transparent">
                    Who is it for?
                  </span>
                </h2>
                
                <div className="text-6xl mb-8">🫵</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="font-press-start text-2xl text-[#FF6B6B] mb-8">we don't care about</h3>
                  <div className="space-y-4">
                    {["your age", "if you can't code", "if you've never pitched"].map((item, index) => (
                      <div key={index} className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4">
                        <p className="font-jetbrains text-gray-400">❌ {item}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 bg-gradient-to-r from-[#4ECDC4]/10 to-[#96CEB4]/10 border border-[#4ECDC4]/30 rounded-xl p-6">
                    <p className="font-jetbrains text-lg text-gray-200">
                      if you have a <span className="text-[#FFEAA7] font-bold">laptop</span>, <span className="text-[#4ECDC4] font-bold">internet</span>, and <span className="text-[#DDA0DD] font-bold">imagination</span><br />
                      <span className="text-[#96CEB4] font-bold text-xl">you're welcome here</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-press-start text-2xl text-[#4ECDC4] mb-8">this is for people who feel</h3>
                  <div className="space-y-6">
                    {[
                      { text: "too weird for school", color: "[#FF6B6B]" },
                      { text: "too early for startup land", color: "[#FFEAA7]" },
                      { text: "too chaotic for structure", color: "[#DDA0DD]" }
                    ].map((item, index) => (
                      <div key={index} className={`bg-gradient-to-r from-${item.color}/10 to-black border border-${item.color}/30 rounded-lg p-4`}>
                        <p className={`font-jetbrains text-lg text-${item.color}`}>
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 bg-black/50 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <p className="font-jetbrains text-lg text-gray-200">
                      but still want to <span className="text-[#4ECDC4] font-bold">build</span>, <span className="text-[#96CEB4] font-bold">learn</span>, and <span className="text-[#FFEAA7] font-bold">ship</span> something that feels <span className="text-[#FF6B6B] font-bold">real</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-16 text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { text: "maximally supports vision", icon: "👁️", color: "[#FF6B6B]" },
                    { text: "maximally supports delusion", icon: "🌙", color: "[#4ECDC4]" },
                    { text: "maximally supports people who aren't \"ready\"", icon: "⚡", color: "[#FFEAA7]" }
                  ].map((item, index) => (
                    <div key={index} className={`bg-gradient-to-br from-${item.color}/10 to-black border border-${item.color}/30 rounded-xl p-6`}>
                      <div className="text-3xl mb-4">{item.icon}</div>
                      <p className={`font-press-start text-sm text-${item.color}`}>
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Vision */}
          <section 
            data-section="6"
            className={`py-20 px-4 transition-all duration-1000 ${visibleSections.includes(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="font-press-start text-3xl md:text-4xl mb-8">
                  <span className="bg-gradient-to-r from-[#DDA0DD] via-[#FF6B6B] to-[#FFEAA7] bg-clip-text text-transparent">
                    What We're Actually Building
                  </span>
                </h2>
                
                <div className="text-6xl mb-8">🌟</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <div>
                  <h3 className="font-press-start text-2xl text-[#4ECDC4] mb-8">our long-term vision</h3>
                  <div className="space-y-6">
                    {[
                      { text: "a global league of gen z builders", icon: "🌍", color: "[#45B7D1]" },
                      { text: "a new education system based on proof-of-work", icon: "🎓", color: "[#96CEB4]" },
                      { text: "a platform where your first MVP gets more respect than your grades", icon: "🚀", color: "[#FFEAA7]" }
                    ].map((item, index) => (
                      <div key={index} className={`bg-gradient-to-r from-${item.color}/10 to-black border border-${item.color}/30 rounded-xl p-6`}>
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">{item.icon}</div>
                          <p className={`font-jetbrains text-lg text-${item.color}`}>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-press-start text-2xl text-[#FF6B6B] mb-8">maximally is meant to be</h3>
                  <div className="space-y-6">
                    {[
                      { text: "the harvard for high-agency dropouts", icon: "🎯", color: "[#FF6B6B]" },
                      { text: "the yc for gen z founders", icon: "💡", color: "[#DDA0DD]" },
                      { text: "the red bull of the startup world", icon: "⚡", color: "[#FFEAA7]" }
                    ].map((item, index) => (
                      <div key={index} className={`bg-gradient-to-r from-${item.color}/10 to-black border border-${item.color}/30 rounded-xl p-6`}>
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">{item.icon}</div>
                          <p className={`font-jetbrains text-lg text-${item.color}`}>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 bg-gradient-to-br from-[#4ECDC4]/10 to-[#96CEB4]/10 border border-[#4ECDC4]/30 rounded-xl p-6">
                    <p className="font-jetbrains text-lg text-gray-200 text-center">
                      except built in <span className="text-[#FFEAA7] font-bold">india</span><br />
                      by <span className="text-[#4ECDC4] font-bold">kids</span><br />
                      for <span className="text-[#DDA0DD] font-bold">kids who feel like they don't belong anywhere else</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final Section */}
          <section 
            data-section="7"
            className={`py-20 px-4 transition-all duration-1000 ${visibleSections.includes(7) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="container mx-auto max-w-4xl text-center">
              <div className="bg-gradient-to-br from-[#FF6B6B]/10 via-[#4ECDC4]/10 to-[#FFEAA7]/10 border border-white/20 rounded-3xl p-12">
                <h2 className="font-press-start text-3xl md:text-4xl mb-8">
                  <span className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] bg-clip-text text-transparent">
                    and me?
                  </span>
                </h2>
                
                <div className="space-y-6 font-jetbrains text-xl leading-relaxed mb-12">
                  <p className="text-gray-300">
                    i started maximally at <span className="text-[#FFEAA7] font-bold">16</span><br />
                    with <span className="text-[#FF6B6B] font-bold">zero money</span><br />
                    <span className="text-[#4ECDC4] font-bold">no credibility</span><br />
                    just <span className="text-[#DDA0DD] font-bold">vibes and momentum</span>
                  </p>
                  
                  <div className="my-8">
                    <div className="text-6xl animate-pulse">✨</div>
                  </div>
                  
                  <p className="text-gray-300">
                    now it's <span className="text-[#96CEB4] font-bold">real</span><br />
                    real events<br />
                    real stories<br />
                    real mentors<br />
                    real friends<br />
                    <span className="text-[#4ECDC4] font-bold text-2xl">real execution</span>
                  </p>
                </div>

                <div className="mb-12">
                  <h3 className="font-press-start text-2xl text-[#FF6B6B] mb-6">
                    we're not done<br />
                    we're not even close
                  </h3>
                  <p className="font-press-start text-3xl text-[#FFEAA7] animate-pulse">
                    we're just getting started
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    to="/shipathon"
                    className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white font-press-start py-4 px-8 rounded-xl hover:scale-105 transition-transform inline-flex items-center gap-2"
                  >
                    <Zap className="h-5 w-5" />
                    Join the Movement
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  
                  <Link
                    to="/community"
                    className="bg-black border-2 border-[#FFEAA7] text-[#FFEAA7] font-press-start py-4 px-8 rounded-xl hover:scale-105 transition-transform inline-flex items-center gap-2"
                  >
                    <Heart className="h-5 w-5" />
                    Be Part of the Story
                  </Link>
                </div>
              </div>

              <div className="mt-16 text-right">
                <p className="font-press-start text-lg text-[#4ECDC4]">
                  — rishul chanana<br />
                  <span className="text-[#FFEAA7]">founder & ceo, maximally.in</span>
                </p>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  );
};

export default Story;
