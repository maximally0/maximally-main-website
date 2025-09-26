
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Makeathon = () => {
  return (
    <div className="min-h-screen pt-32">
      {/* Archive Banner */}
      <div className="bg-black text-white py-4 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-red-600/20"></div>
        <div className="container mx-auto relative">
          <p className="font-press-start text-sm md:text-base mb-2">
            <strong>This event has ended.</strong>
          </p>
          <p className="font-jetbrains text-xs md:text-sm text-white/80">
            <em>You're viewing the archived edition of the Maximally Startup Makeathon (Summer 2025).</em>
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white py-6 sm:py-16 px-3 sm:px-4 relative">
        {/* Archived Label */}
        <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-jetbrains">
          Archived Edition: Summer 2025
        </div>
        
        <div className="container mx-auto text-center">
          <h1 className="font-press-start text-xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 md:mb-8 px-2">
            The world's <span className="bg-[#39FF14]/20">boldest</span> builders joined{" "}
            <span className="bg-[#FF5F5F]/20">summer 2025</span>. Amazing work!
          </h1>
          <div className="mt-8 mb-12">
            <Link 
              to="/"
              className="pixel-button bg-[#39FF14] text-black px-12 py-6 text-xl font-press-start hover:scale-105 transform transition-all shadow-xl"
            >
              Back to Home →
            </Link>
            
            {/* YouTube Video Embed */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="pixel-border bg-white p-4">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/wMgcao2H75g"
                    title="Startup Makeathon Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="font-jetbrains text-xl sm:text-2xl md:text-3xl mb-4 leading-relaxed">
              <span className="bg-gradient-to-r from-[#39FF14] to-[#00ff99] bg-clip-text text-transparent font-bold">Maximally Startup Makeathon:</span> The world's premier startup simulation for teens — 7 days of idea validation, MVP building, and public pitching with real mentors.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg sm:text-xl">
              <div className="bg-[#39FF14]/10 p-4 rounded-lg hover:scale-105 transform transition-all duration-300">
                <span className="text-[#39FF14] font-bold">⚡️ Entrepreneurship</span>
              </div>
              <div className="bg-[#FF5F5F]/10 p-4 rounded-lg hover:scale-105 transform transition-all duration-300">
                <span className="text-[#FF5F5F] font-bold">🎯 Digital Marketing</span>
              </div>
              <div className="bg-[#B400FF]/10 p-4 rounded-lg hover:scale-105 transform transition-all duration-300">
                <span className="text-[#B400FF] font-bold">⚙️ AI Tools & No-Code MVPs</span>
              </div>
              <div className="bg-[#3C9EE7]/10 p-4 rounded-lg hover:scale-105 transform transition-all duration-300">
                <span className="text-[#3C9EE7] font-bold">🎤 Public Speaking</span>
              </div>
            </div>

            <p className="font-jetbrains text-lg sm:text-xl">
              <span className="bg-[#39FF14]/20 px-2">Built startups</span> from the ground up,{" "}
              <span className="bg-[#FF5F5F]/20 px-2">networked with industry leaders</span>, and{" "}
              <span className="bg-[#B400FF]/20 px-2">gained real-world experience</span> that set them apart.
            </p>
          </div>
        </div>
      </section>

      {/* What Participants Got Section */}
      <section className="py-8 sm:py-12 px-3 sm:px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="font-press-start text-2xl sm:text-3xl mb-6 sm:mb-8">🏆 What Participants Got</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4 md:px-0">
            <Card className="border-2 border-[#39FF14]/30 hover:border-[#39FF14] transition-all">
              <CardContent className="p-6">
                <h3 className="font-press-start text-xl mb-4">✅ A real MVP or working prototype</h3>
                <p className="font-jetbrains">Built something real — not just theory</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#FF5F5F]/30 hover:border-[#FF5F5F] transition-all">
              <CardContent className="p-6">
                <h3 className="font-press-start text-xl mb-4">✅ Startup & internship opportunities</h3>
                <p className="font-jetbrains">Top performers got placed in real startups</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#B400FF]/30 hover:border-[#B400FF] transition-all">
              <CardContent className="p-6">
                <h3 className="font-press-start text-xl mb-4">✅ Launchpad Grant</h3>
                <p className="font-jetbrains">₹5K-₹10K to help continue building</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#3C9EE7]/30 hover:border-[#3C9EE7] transition-all">
              <CardContent className="p-6">
                <h3 className="font-press-start text-xl mb-4">✅ Alumni Network</h3>
                <p className="font-jetbrains">Professional network & lifetime access</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#39FF14]/30 hover:border-[#39FF14] transition-all">
              <CardContent className="p-6">
                <h3 className="font-press-start text-xl mb-4">✅ LOR</h3>
                <p className="font-jetbrains">Letters of Recommendation for top performers</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#FF5F5F]/30 hover:border-[#FF5F5F] transition-all">
              <CardContent className="p-6">
                <h3 className="font-press-start text-xl mb-4">✅ Career Mentorship</h3>
                <p className="font-jetbrains">Guidance through next steps</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#B400FF]/30 hover:border-[#B400FF] transition-all">
              <CardContent className="p-6">
                <h3 className="font-press-start text-xl mb-4">✅ Exclusive Events</h3>
                <p className="font-jetbrains">Alumni-only events and perks</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="font-press-start text-3xl mb-8 text-center">🎁 Perks & Alumni Privileges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#39FF14]/10 p-6 rounded-lg">
              <h3 className="font-press-start text-xl mb-4">💼 Professional Network</h3>
              <p className="font-jetbrains">Private Discord with mentors & founders</p>
            </div>
            <div className="bg-[#FF5F5F]/10 p-6 rounded-lg">
              <h3 className="font-press-start text-xl mb-4">🚀 Career Growth</h3>
              <p className="font-jetbrains">Access to internships and collaborations</p>
            </div>
            <div className="bg-[#B400FF]/10 p-6 rounded-lg">
              <h3 className="font-press-start text-xl mb-4">📜 Recognition</h3>
              <p className="font-jetbrains">Letters of recommendation for top performers</p>
            </div>
            <div className="bg-[#3C9EE7]/10 p-6 rounded-lg">
              <h3 className="font-press-start text-xl mb-4">🌟 Exclusive Events</h3>
              <p className="font-jetbrains">Priority access to future Maximally events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Participated Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="font-press-start text-3xl mb-8">👥 Who Participated</h2>
          <p className="font-jetbrains text-xl mb-6">
            The Startup Makeathon was for teen builders, creators, and first-time founders.
          </p>
          <div className="space-y-4">
            <p className="font-jetbrains text-xl">
              <span className="bg-[#39FF14]/20 px-2">👉 Bold dreamers interested in building startups</span>
            </p>
            <p className="font-jetbrains text-xl">
              <span className="bg-[#FF5F5F]/20 px-2">👉 Those passionate about tech, marketing, and AI</span>
            </p>
            <p className="font-jetbrains text-xl">
              <span className="bg-[#B400FF]/20 px-2">👉 Future leaders who wanted to make an impact</span>
            </p>
            <p className="font-jetbrains text-xl">
              <span className="bg-[#3C9EE7]/20 px-2">👉 Creators, designers, developers, and communicators ready to work in teams</span>
            </p>
            <p className="font-jetbrains text-xl">
              <span className="bg-[#39FF14]/20 px-2">👉 Anyone who wanted to build, learn, and grow with the best in the industry!</span>
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="font-press-start text-3xl mb-8 text-center">📚 The 7-Day Builder Journey</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="day1">
              <AccordionTrigger className="font-press-start">Day 1: Kickoff + Team Formation</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                • Future of work, AI, and careers<br />
                • Defining your ambition and edge<br />
                • Form your startup teams (guilds)
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="day2">
              <AccordionTrigger className="font-press-start">Day 2: Problem Discovery + Research</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                • Identifying problems worth solving<br />
                • Market research and validation<br />
                • Customer interviews and insights
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="day3">
              <AccordionTrigger className="font-press-start">Day 3: MVP Tooling (Figma, AI, No-code)</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                • Tools like ChatGPT, Midjourney, Figma, Glide<br />
                • Design thinking and wireframing<br />
                • No-code development basics
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="day4">
              <AccordionTrigger className="font-press-start">Day 4: Prototyping + Mentorship Sprints</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                • Building fast prototypes<br />
                • 1:1 mentorship sessions<br />
                • Iterating based on feedback
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="day5">
              <AccordionTrigger className="font-press-start">Day 5: Demo Feedback + Product Polish</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                • Present early demos to mentors<br />
                • Receive feedback and iterate<br />
                • Polish your MVP for demo day
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="day6">
              <AccordionTrigger className="font-press-start">Day 6: Public Speaking + Pitch Building</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                • Speaking under pressure<br />
                • Storytelling and startup pitching<br />
                • Craft your final demo day presentation
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="day7">
              <AccordionTrigger className="font-press-start">Day 7: Demo Day (Public Pitch)</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                • Present to guests from top universities and startups<br />
                • Live feedback from a high-stakes panel<br />
                • Top 10 get special awards and future perks
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* How the Bootcamp Worked Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="container mx-auto relative">
          <div className="animate-float">
            <h2 className="font-press-start text-3xl mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#39FF14] via-[#00ff99] to-[#00ffcc]">
              🧩 How the Startup Makeathon Worked
            </h2>
          </div>
          <p className="font-jetbrains text-xl mb-8 text-center text-white/90 animate-fade-in">
            Maximally was more than a bootcamp. It was a <span className="text-[#39FF14]">7-day journey</span> where participants worked on <span className="text-[#00ff99]">real-world problems</span>, collaborated with others, and <span className="text-[#00ffcc]">built the startups of their dreams</span>. No lectures — just <span className="text-[#39FF14]">challenges</span>, <span className="text-[#00ff99]">mentors</span>, and <span className="text-[#00ffcc]">hands-on experience</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-black/40 p-6 rounded-lg border-2 border-[#39FF14] hover:scale-105 transform transition-all duration-300">
              <h4 className="font-press-start text-lg mb-4 text-[#39FF14]">🎯 Daily Impact</h4>
              <p className="font-jetbrains text-white">Real-life challenges and lessons from top founders, creators, and VCs who dropped by to share their journeys.</p>
            </div>

            <div className="bg-black/40 p-6 rounded-lg border-2 border-[#00ff99] hover:scale-105 transform transition-all duration-300">
              <h4 className="font-press-start text-lg mb-4 text-[#00ff99]">🚀 Guild System</h4>
              <p className="font-jetbrains text-white">Worked in small, dynamic startup teams to build and iterate ideas with fellow ambitious teens. Teams worked like real startups. They brainstormed, built, and shipped daily.</p>
            </div>

            <div className="bg-black/40 p-6 rounded-lg border-2 border-[#00ffcc] hover:scale-105 transform transition-all duration-300">
              <h4 className="font-press-start text-lg mb-4 text-[#00ffcc]">🎤 Demo Day</h4>
              <p className="font-jetbrains text-white">Pitched projects to secure potential internships and funding to continue growth journeys. Pitched to founders, creators, and VCs — live.</p>
            </div>
          </div>

          {/* Format Section */}
          <div className="mb-12">
            <h3 className="font-press-start text-2xl mb-6">🚀 The Format</h3>
            <div className="space-y-6 relative">
              <div className="bg-black/40 p-6 rounded-lg border-2 border-[#39FF14] hover:border-[#39FF14] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]">
                <h4 className="font-press-start text-lg mb-2 text-[#39FF14]">🧠 7 days. Zero lectures.</h4>
                <p className="font-jetbrains text-white">Each afternoon kicked off with a challenge, a guest founder, or a mind-bending activity.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-lg border-2 border-[#00FFFF] hover:border-[#00FFFF] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]">
                <h4 className="font-press-start text-lg mb-2 text-[#00FFFF]">🎤 Daily guest speakers.</h4>
                <p className="font-jetbrains text-white">Founders, creators, VCs, and domain experts dropped in daily. No fluff — just real stories and execution playbooks.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-lg border-2 border-[#FF00FF] hover:border-[#FF00FF] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,0,255,0.5)]">
                <h4 className="font-press-start text-lg mb-2 text-[#FF00FF]">👥 Guilds, not groups.</h4>
                <p className="font-jetbrains text-white">Participants were sorted into guilds of 4–5 teens. Think startup team meets secret society. They built together, debated together, and shipped real things — every day.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-lg border-2 border-[#FFA500] hover:border-[#FFA500] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,165,0,0.5)]">
                <h4 className="font-press-start text-lg mb-2 text-[#FFA500]">📦 Daily deliverables.</h4>
                <p className="font-jetbrains text-white">They didn't just learn — they <i>did</i>. Built ideas. Designed MVPs. Crafted pitches. Got feedback. Repeated.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-lg border-2 border-[#FF3366] hover:border-[#FF3366] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,51,102,0.5)]">
                <h4 className="font-press-start text-lg mb-2 text-[#FF3366]">🧰 Books + Tools + Videos.</h4>
                <p className="font-jetbrains text-white">They got curated mini-reads and videos from legends — stuff you won't find in textbooks. (<i>Think Naval Ravikant, Ali Abdaal, Sahil Bloom, Notion, Figma, ChatGPT.</i>)</p>
              </div>
              <div className="bg-black/40 p-6 rounded-lg border-2 border-[#9966FF] hover:border-[#9966FF] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(153,102,255,0.5)]">
                <h4 className="font-press-start text-lg mb-2 text-[#9966FF]">🧠 Gamified XP + Leaderboard.</h4>
                <p className="font-jetbrains text-white">Complete challenges, win debates, impress mentors — earn XP and badges. Top builders unlocked real perks and recognition.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-lg border-2 border-[#00FF99] hover:border-[#00FF99] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,255,153,0.5)]">
                <h4 className="font-press-start text-lg mb-2 text-[#00FF99]">🎓 Demo Day Finale.</h4>
                <p className="font-jetbrains text-white">On Day 7, guilds pitched in front of a live panel. No pressure. Just their first real founder moment.</p>
              </div>
            </div>
          </div>

          {/* What Participants Left With Section */}
          <div className="mb-12">
            <h3 className="font-press-start text-2xl mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF5F5F] via-[#FF9671] to-[#FFC75F] animate-pulse">
              🛠️ What Participants Left With
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-black/40 p-4 rounded-lg border-2 border-[#FF5F5F] hover:border-[#FF5F5F] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,95,95,0.5)]">
                <p className="font-jetbrains text-[#FF5F5F]">✅ A real-world project to showcase</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border-2 border-[#00FFFF] hover:border-[#00FFFF] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]">
                <p className="font-jetbrains text-[#00FFFF]">✅ Internship and funding opportunities if they had a viable idea</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border-2 border-[#FF00FF] hover:border-[#FF00FF] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,0,255,0.5)]">
                <p className="font-jetbrains text-[#FF00FF]">✅ A lasting digital identity, including recognition on our platform</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border-2 border-[#FFA500] hover:border-[#FFA500] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,165,0,0.5)]">
                <p className="font-jetbrains text-[#FFA500]">✅ Connections to top mentors, creators, and founders</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border-2 border-[#39FF14] hover:border-[#39FF14] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]">
                <p className="font-jetbrains text-[#39FF14]">✅ Confidence that stays with them as they move forward in their careers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="font-press-start text-3xl mb-8 text-center">❓ Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="faq1">
              <AccordionTrigger className="font-press-start">Did participants need to know how to code?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                Nope! We covered AI & no-code tools that anyone could use.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq2">
              <AccordionTrigger className="font-press-start">What about shy or introverted participants?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                They were welcome. We helped them build confidence, not just skills.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq3">
              <AccordionTrigger className="font-press-start">Was this only for kids from big cities?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                Not at all. We had students from small towns around the world. All that mattered was ambition.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq9">
              <AccordionTrigger className="font-press-start">What if someone had never built anything before?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                Perfect — we showed them how. No experience needed. Just curiosity and willingness to try.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq10">
              <AccordionTrigger className="font-press-start">What was a "guild"?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                A guild was their team of 4–5 students who they worked with every day. They brainstormed, debated, and built together — just like a real startup team.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq11">
              <AccordionTrigger className="font-press-start">Were there homework or assignments?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                Yes — but fun ones. Every day ended with a challenge or deliverable to build and share with their guild.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq12">
              <AccordionTrigger className="font-press-start">Did participants get to meet speakers and mentors?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                Yes — all speaker sessions were live and interactive. They were able to ask questions, join AMAs, and even get shoutouts for good work.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq13">
              <AccordionTrigger className="font-press-start">What happened after the bootcamp ended?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                They became part of the Maximally alumni network. That means access to future sessions, internships, mentors, and events — for life.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq4">
              <AccordionTrigger className="font-press-start">Did participants get personal feedback or help?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                Yes. They had mentors, peers, and our team to guide them.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq5">
              <AccordionTrigger className="font-press-start">What happened after the Makeathon ended?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                They joined a lifelong alumni network with exclusive access to events, internships, and more.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq14">
              <AccordionTrigger className="font-press-start">Was this a hackathon or a bootcamp?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                It was both. A startup simulation where participants built fast, shipped real things, and pitched like founders.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Progressive Schools */}
      <section className="py-12 px-4 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="container mx-auto text-center relative">
          <h2 className="font-press-start text-3xl mb-8 text-white">🏫 Our Partner Schools</h2>
          <p className="font-jetbrains text-xl mb-8 text-white/80">
            Progressive schools worldwide that partnered with Maximally
            to bring cutting-edge education to their students.
          </p>
          <Link
            to="/wall-of-progressive-schools"
            className="pixel-button bg-[#39FF14] text-black inline-flex items-center gap-2 px-8 py-4 text-lg hover:scale-105 transform transition-all"
          >
            <span>Explore Progressive Schools</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Makeathon;
