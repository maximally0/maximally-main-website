
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import TallyFormDialog from "@/components/TallyFormDialog";
import React, { useState } from 'react';

const Bootcamps = () => {
  const [isTallyFormOpen, setIsTallyFormOpen] = useState(false);

  return (
    <div className="min-h-screen pt-20 md:pt-24"> {/* Added padding top for navbar */}
      {/* Hero Section */}
      <section className="bg-white py-6 sm:py-16 px-3 sm:px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-press-start text-xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 md:mb-8 px-2">
            India's <span className="bg-[#39FF14]/20">most ambitious</span> teens join us{" "}
            <span className="bg-[#FF5F5F]/20">this summer</span>. Will you?
          </h1>
          <p className="font-jetbrains text-base sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4 md:px-0">
            <span className="bg-purple-100">Free</span> for the <span className="bg-yellow-200">first 500 students</span>  to get{" "}
            <span className="bg-blue-100">accepted</span> into our{" "}
            <span className="bg-green-100">certificate of excellence</span> program.
          </p>
          <TallyFormDialog open={isTallyFormOpen} onOpenChange={setIsTallyFormOpen} />
          <div className="mt-8">
            <button 
              onClick={() => window.location.href = "https://tally.so/r/wQEGEA"}
              className="pixel-button bg-[#39FF14] text-black px-12 py-6 text-xl font-press-start hover:scale-105 transform transition-all shadow-xl"
            >
              Apply Now →
            </button>
          </div>
        </div>
      </section>

      {/* Countdown Timer (Fixed) */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white py-2 sm:py-3 text-center z-40">
        <p className="font-press-start text-xs sm:text-sm md:text-base mb-12 sm:mb-0">
          🎉 Applications are open!
        </p>
        <p className="font-jetbrains text-[10px] sm:text-xs md:text-sm">
          Only 200 students will be selected. First come, first served.
        </p>
      </div>

      {/* Accepted Section */}
      <section className="py-8 sm:py-12 px-3 sm:px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="font-press-start text-2xl sm:text-3xl mb-6 sm:mb-8">🏆 Accepted? You're In for Life</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4 md:px-0">
            <Card className="border-2 border-[#39FF14]/30 hover:border-[#39FF14] transition-all">
              <CardContent className="p-6">
                <h3 className="font-press-start text-xl mb-4">🎓 Certificate of Excellence</h3>
                <p className="font-jetbrains">Recognized proof of your skill and execution</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#FF5F5F]/30 hover:border-[#FF5F5F] transition-all">
              <CardContent className="p-6">
                <h3 className="font-press-start text-xl mb-4">🤝 Alumni-Only Privileges</h3>
                <p className="font-jetbrains">Access to exclusive future opportunities</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#B400FF]/30 hover:border-[#B400FF] transition-all">
              <CardContent className="p-6">
                <h3 className="font-press-start text-xl mb-4">🌐 Lifetime Network</h3>
                <p className="font-jetbrains">Connect with India's future leaders</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#3C9EE7]/30 hover:border-[#3C9EE7] transition-all">
              <CardContent className="p-6">
                <h3 className="font-press-start text-xl mb-4">🎯 Future Access</h3>
                <p className="font-jetbrains">Your badge of honor in the digital age</p>
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

      {/* Who Should Apply Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="font-press-start text-3xl mb-8">👥 Who Should Apply</h2>
          <div className="space-y-4">
            <p className="font-jetbrains text-xl">
              <span className="bg-[#39FF14]/20 px-2">🧠 Teen founders</span> ready to{" "}
              <span className="bg-[#FF5F5F]/20 px-2">build their first ₹1CR startup</span>
            </p>
            <p className="font-jetbrains text-xl">
              <span className="bg-[#B400FF]/20 px-2">🚀 Ambitious teens</span> who want to{" "}
              <span className="bg-[#3C9EE7]/20 px-2">lead the future</span>
            </p>
            <p className="font-jetbrains text-xl">
              <span className="bg-[#39FF14]/20 px-2">🔥 Students</span> who love{" "}
              <span className="bg-[#FF5F5F]/20 px-2">challenges, ideas, and energy</span>
            </p>
            <p className="font-jetbrains text-xl">
              <span className="bg-[#B400FF]/20 px-2">🎤 Communicators</span>,{" "}
              <span className="bg-[#3C9EE7]/20 px-2">creatives, hackers, and builders</span>
            </p>
          </div>
        </div>
      </section>

      {/* Application Timeline */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="font-press-start text-3xl mb-8">📍 Application Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">1️⃣</div>
              <h3 className="font-press-start text-lg mb-2">🚀 Applications Open</h3>
              <p className="font-jetbrains">April 20</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">2️⃣</div>
              <h3 className="font-press-start text-lg mb-2">🎥 Submit Application</h3>
              <p className="font-jetbrains">Application + 1-minute intro video</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">3️⃣</div>
              <h3 className="font-press-start text-lg mb-2">🔍 Review Process</h3>
              <p className="font-jetbrains">Reviewed by Maximally Team</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">4️⃣</div>
              <h3 className="font-press-start text-lg mb-2">📩 Acceptance</h3>
              <p className="font-jetbrains">Emails sent by May 30</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">5️⃣</div>
              <h3 className="font-press-start text-lg mb-2">💳 Confirm Spot</h3>
              <p className="font-jetbrains">Secure your place in the program</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">6️⃣</div>
              <h3 className="font-press-start text-lg mb-2">🎉 Begin Journey</h3>
              <p className="font-jetbrains">Bootcamp begins June 1</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="font-press-start text-3xl mb-8 text-center">📚 Bootcamp Program</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="day1">
              <AccordionTrigger className="font-press-start">Day 1: Orientation & Mindset Reset</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                • Future of work, AI, and careers<br />
                • Defining your ambition and edge
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="day2">
              <AccordionTrigger className="font-press-start">Day 2: Entrepreneurship Fundamentals</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                • Identifying problems worth solving<br />
                • MVP design using no-code<br />
                • Storytelling and startup pitching
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="day3">
              <AccordionTrigger className="font-press-start">Day 3: Digital Marketing & Distribution</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                • Audience psychology<br />
                • Growth hacking 101<br />
                • Building a content engine
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="day4">
              <AccordionTrigger className="font-press-start">Day 4: AI & No-Code Execution</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                • Tools like ChatGPT, Midjourney, Glide<br />
                • Building fast prototypes<br />
                • Automating workflows
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="day5">
              <AccordionTrigger className="font-press-start">Day 5: Public Speaking & Influence</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                • Speaking under pressure<br />
                • Debate + MUN simulation<br />
                • Owning the room
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="day6">
              <AccordionTrigger className="font-press-start">Day 6: Personal Branding</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                • Portfolio and personal site building<br />
                • Networking strategy<br />
                • Digital identity for teens
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="day7">
              <AccordionTrigger className="font-press-start">Day 7: Demo Day</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                • Present to guests from top universities and startups<br />
                • Live feedback from a high-stakes panel<br />
                • Top 10 get special awards and future perks
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* How the Bootcamp Works Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="container mx-auto relative">
          <div className="animate-float">
            <h2 className="font-press-start text-3xl mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#39FF14] via-[#00ff99] to-[#00ffcc]">
              🧩 How the Bootcamp <i>Actually</i> Works
            </h2>
          </div>
          <p className="font-jetbrains text-xl mb-8 text-center text-white/90 animate-fade-in">
            Maximally is not a class. It's an <span className="text-[#39FF14]">experience</span>. 
            Here's how you'll <span className="text-[#00ff99]">learn</span>, 
            <span className="text-[#00ffcc]">build</span>, and 
            <span className="text-[#39FF14]">grow</span>:
          </p>

          {/* Format Section */}
          <div className="mb-12">
            <h3 className="font-press-start text-2xl mb-6">🚀 The Format</h3>
            <div className="space-y-6 relative">
              <div className="bg-black/40 p-6 rounded-lg border-2 border-[#39FF14] hover:border-[#39FF14] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]">
                <h4 className="font-press-start text-lg mb-2 text-[#39FF14]">🧠 7 days. Zero lectures.</h4>
                <p className="font-jetbrains text-white">Each afternoon kicks off with a challenge, a guest founder, or a mind-bending activity.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-lg border-2 border-[#00FFFF] hover:border-[#00FFFF] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]">
                <h4 className="font-press-start text-lg mb-2 text-[#00FFFF]">🎤 Daily guest speakers.</h4>
                <p className="font-jetbrains text-white">Founders, creators, VCs, and domain experts drop in daily. No fluff — just real stories and execution playbooks.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-lg border-2 border-[#FF00FF] hover:border-[#FF00FF] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,0,255,0.5)]">
                <h4 className="font-press-start text-lg mb-2 text-[#FF00FF]">👥 Guilds, not groups.</h4>
                <p className="font-jetbrains text-white">You'll be sorted into a guild of 4–5 teens. Think startup team meets secret society. You'll build together, debate together, and ship real things — every day.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-lg border-2 border-[#FFA500] hover:border-[#FFA500] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,165,0,0.5)]">
                <h4 className="font-press-start text-lg mb-2 text-[#FFA500]">📦 Daily deliverables.</h4>
                <p className="font-jetbrains text-white">You don't just learn — you <i>do</i>. Build ideas. Design MVPs. Craft pitches. Get feedback. Repeat.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-lg border-2 border-[#FF3366] hover:border-[#FF3366] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,51,102,0.5)]">
                <h4 className="font-press-start text-lg mb-2 text-[#FF3366]">🧰 Books + Tools + Videos.</h4>
                <p className="font-jetbrains text-white">You'll get curated mini-reads and videos from legends — stuff you won't find in textbooks. (<i>Think Naval Ravikant, Ali Abdaal, Sahil Bloom, Notion, Figma, ChatGPT.</i>)</p>
              </div>
              <div className="bg-black/40 p-6 rounded-lg border-2 border-[#9966FF] hover:border-[#9966FF] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(153,102,255,0.5)]">
                <h4 className="font-press-start text-lg mb-2 text-[#9966FF]">🧠 Gamified XP + Leaderboard.</h4>
                <p className="font-jetbrains text-white">Complete challenges, win debates, impress mentors — earn XP and badges. Top builders unlock real perks and recognition.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-lg border-2 border-[#00FF99] hover:border-[#00FF99] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,255,153,0.5)]">
                <h4 className="font-press-start text-lg mb-2 text-[#00FF99]">🎓 Demo Day Finale.</h4>
                <p className="font-jetbrains text-white">On Day 7, your guild will pitch in front of a live panel. No pressure. Just your first real founder moment.</p>
              </div>
            </div>
          </div>

          {/* What You'll Leave With Section */}
          <div className="mb-12">
            <h3 className="font-press-start text-2xl mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF5F5F] via-[#FF9671] to-[#FFC75F] animate-pulse">
              🛠️ What You'll Leave With
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded-lg border-2 border-[#FF5F5F] hover:border-[#FF5F5F] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,95,95,0.5)]">
                <p className="font-jetbrains text-[#FF5F5F]">✅ A real project (not just theory)</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border-2 border-[#00FFFF] hover:border-[#00FFFF] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]">
                <p className="font-jetbrains text-[#00FFFF]">✅ A guild of friends for life</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border-2 border-[#FF00FF] hover:border-[#FF00FF] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,0,255,0.5)]">
                <p className="font-jetbrains text-[#FF00FF]">✅ A digital identity you're proud of</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border-2 border-[#FFA500] hover:border-[#FFA500] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,165,0,0.5)]">
                <p className="font-jetbrains text-[#FFA500]">✅ Access to the alumni network</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border-2 border-[#39FF14] hover:border-[#39FF14] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]">
                <p className="font-jetbrains text-[#39FF14]">✅ Certificate + LOR (for top performers)</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border-2 border-[#9966FF] hover:border-[#9966FF] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(153,102,255,0.5)]">
                <p className="font-jetbrains text-[#9966FF]">✅ Confidence that sticks</p>
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
              <AccordionTrigger className="font-press-start">Do I need to know how to code?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                Nope! We cover AI & no-code tools that anyone can use.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq2">
              <AccordionTrigger className="font-press-start">What if I'm shy or introverted?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                You're welcome here. We help you build confidence, not just skills.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq3">
              <AccordionTrigger className="font-press-start">Is this only for kids from big cities?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                Not at all. We've got students from small towns across India. All that matters is ambition.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq9">
              <AccordionTrigger className="font-press-start">What if I've never built anything before?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                Perfect — we'll show you how. No experience needed. Just curiosity and willingness to try.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq10">
              <AccordionTrigger className="font-press-start">What's a "guild"?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                A guild is your team of 4–5 students who you'll work with every day. You'll brainstorm, debate, and build together — just like a real startup team.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq11">
              <AccordionTrigger className="font-press-start">Will there be homework or assignments?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                Yes — but fun ones. Every day ends with a challenge or deliverable to build and share with your guild.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq12">
              <AccordionTrigger className="font-press-start">Will I get to meet speakers and mentors?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                Yes — all speaker sessions are live and interactive. You'll be able to ask questions, join AMAs, and even get shoutouts for good work.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq13">
              <AccordionTrigger className="font-press-start">What happens after the bootcamp ends?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                You become part of the Maximally alumni network. That means access to future sessions, internships, mentors, and events — for life.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq4">
              <AccordionTrigger className="font-press-start">Will I get personal feedback or help?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                Yes. You'll have mentors, peers, and our team to guide you.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq5">
              <AccordionTrigger className="font-press-start">What happens after the bootcamp?</AccordionTrigger>
              <AccordionContent className="font-jetbrains">
                You join a lifelong alumni network with exclusive access to events, internships, and more.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="font-press-start text-3xl mb-6">Ready to Level Up?</h2>
          <TallyFormDialog open={isTallyFormOpen} onOpenChange={setIsTallyFormOpen} />
        </div>
      </section>
    </div>
  );
};

export default Bootcamps;
