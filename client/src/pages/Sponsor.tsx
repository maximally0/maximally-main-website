import { useState } from "react";
import { ArrowRight, Star, Users, Target, Rocket, Sparkles, Crown, Code, Zap, CalendarCheck, Mail, Phone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import TallyFormDialog from "@/components/TallyFormDialog";

const Sponsor = () => {
  const [isTallyFormOpen, setIsTallyFormOpen] = useState(false);
  
  return (
    <>
      <SEO 
        title="Sponsor Maximally Summer Bootcamp 2025 | Partner With Us"
        description="Partner with Maximally to empower India's most ambitious students. Reach 1000+ engaged learners through our Summer Bootcamp 2025. Multiple sponsorship tiers available."
        keywords="summer bootcamp sponsorship, student education sponsorship, youth empowerment india, maximally partnership"
      />
      
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.04)_0%,transparent_50%)]" />
        
        <div className="absolute top-20 left-[5%] w-80 h-80 bg-orange-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-60 right-[10%] w-60 h-60 bg-orange-500/3 rounded-full blur-[80px]" />
        <div className="absolute bottom-40 left-[20%] w-72 h-72 bg-gray-800 rounded-full blur-[90px]" />

        <main className="max-w-6xl mx-auto px-4 py-24 relative z-10">
          {/* Hero */}
          <section className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-gray-800 mb-6">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="font-space font-bold text-[10px] sm:text-xs text-orange-400">PARTNERSHIP OPPORTUNITY</span>
            </div>
            <h1 className="font-space font-bold text-xl sm:text-2xl md:text-3xl mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                Sponsor Maximally
              </span>
            </h1>
            <h2 className="font-space font-bold text-sm sm:text-base text-orange-400 mb-4">Summer Bootcamp 2025</h2>
            <p className="font-space text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
              Empowering India's most ambitious students to learn, build & lead.
            </p>
          </section>

          {/* About */}
          <section className="mb-16 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 p-6 sm:p-8">
            <p className="font-space text-base sm:text-lg text-gray-300 leading-relaxed">
              Maximally is a youth-led platform helping ambitious students (ages 13–20) across India learn real-world skills through immersive online bootcamps in entrepreneurship, public speaking, AI, marketing & more.
            </p>
          </section>

          {/* Why Sponsor */}
          <section className="mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 mb-8">
              <Target className="w-4 h-4 text-amber-400" />
              <h2 className="font-space font-bold text-xs text-amber-300">WHY SPONSOR US?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <span className="font-space text-gray-300">Access to 1000+ engaged student learners</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🚀</span>
                    <span className="font-space text-gray-300">Strong social impact & cause-based branding</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">📢</span>
                    <span className="font-space text-gray-300">Multi-platform exposure (Discord, Insta, Email)</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-gray-700 p-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🎙️</span>
                    <span className="font-space text-gray-300">Sponsor talks, shoutouts & speaking slots</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🧑‍💼</span>
                    <span className="font-space text-gray-300">Early access to top student talent</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Audience */}
          <section className="mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 mb-8">
              <Users className="w-4 h-4 text-green-400" />
              <h2 className="font-space font-bold text-xs text-green-300">AUDIENCE SNAPSHOT</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 p-6">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">👥</span>
                    <span className="font-space text-gray-300">Age Group: 13–20</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">🌍</span>
                    <span className="font-space text-gray-300">All-India reach (Tier 1–3 cities)</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-gray-800 p-6">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">💬</span>
                    <span className="font-space text-gray-300">Active student community via Discord</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">📲</span>
                    <span className="font-space text-gray-300">Est. 10K+ digital reach across socials</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sponsorship Tiers */}
          <section className="mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-gray-800 mb-8">
              <Crown className="w-4 h-4 text-orange-400" />
              <h2 className="font-space font-bold text-xs text-orange-400">SPONSORSHIP TIERS</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div 
                className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30 p-6 cursor-pointer hover:scale-[1.02] hover:border-amber-400/60 transition-all duration-300"
                onClick={() => setIsTallyFormOpen(true)}
              >
                <h3 className="font-space font-bold text-xs text-amber-300 mb-4">🟡 MINIMUM SPONSOR</h3>
                <p className="font-space font-bold text-lg text-amber-400 mb-4">₹25,000</p>
                <ul className="space-y-2 font-space text-gray-400 text-sm">
                  <li>• Logo on website</li>
                  <li>• Insta & story shoutout</li>
                  <li>• Certificate of appreciation</li>
                </ul>
              </div>
              <div 
                className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-gray-700 p-6 cursor-pointer hover:scale-[1.02] hover:border-gray-600/60 transition-all duration-300"
                onClick={() => setIsTallyFormOpen(true)}
              >
                <h3 className="font-space font-bold text-xs text-gray-300 mb-4">🔵 RESOLUTION PARTNER</h3>
                <p className="font-space font-bold text-lg text-gray-300 mb-4">₹1,00,000</p>
                <ul className="space-y-2 font-space text-gray-400 text-sm">
                  <li>• All Minimum benefits +</li>
                  <li>• Speaking slot during bootcamp</li>
                  <li>• Branded email shoutout</li>
                  <li>• Discord community badge</li>
                </ul>
              </div>
              <div 
                className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-gray-800 p-6 cursor-pointer hover:scale-[1.02] hover:border-orange-500/60 transition-all duration-300"
                onClick={() => setIsTallyFormOpen(true)}
              >
                <h3 className="font-space font-bold text-xs text-orange-400 mb-4">🔴 INFINITE MODE</h3>
                <p className="font-space font-bold text-lg text-orange-400 mb-4">₹5,00,000+</p>
                <ul className="space-y-2 font-space text-gray-400 text-sm">
                  <li>• "Presented by [Your Brand]" tag</li>
                  <li>• Custom collab reel on Instagram</li>
                  <li>• VIP Impact Report post-event</li>
                  <li>• Max visibility across platforms</li>
                </ul>
              </div>
              <TallyFormDialog open={isTallyFormOpen} onOpenChange={setIsTallyFormOpen} />
            </div>
            <p className="text-center mt-6 font-space text-gray-500 italic text-sm">
              Custom sponsorships available on request
            </p>
          </section>

          {/* Timeline */}
          <section className="mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 mb-8">
              <CalendarCheck className="w-4 h-4 text-indigo-400" />
              <h2 className="font-space font-bold text-xs text-indigo-300">TIMELINE</h2>
            </div>
            <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/30 p-6">
              <ul className="space-y-4 font-space text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="text-2xl">📅</span>
                  <span>Sponsor Outreach: <span className="text-indigo-300 font-semibold">April–May 2025</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">🎓</span>
                  <span>Bootcamp Dates: <span className="text-indigo-300 font-semibold">June–July 2025</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">⏱️</span>
                  <span>2-week online bootcamps, 6 themes</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-gray-800 mb-8">
              <Mail className="w-4 h-4 text-orange-400" />
              <h2 className="font-space font-bold text-xs text-orange-400">GET IN TOUCH</h2>
            </div>
            <div className="bg-gradient-to-br from-gray-900/40 via-black to-gray-900/20 border border-gray-800 p-8 inline-block mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.05)_0%,transparent_70%)]" />
              <div className="relative z-10">
                <h3 className="font-space font-bold text-sm text-white mb-4">Rishul Chanana</h3>
                <p className="font-space text-gray-400 mb-4">Founder, Maximally</p>
                <div className="space-y-2 font-space text-gray-300">
                  <p className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4 text-orange-400" />
                    hello@maximally.in
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4 text-orange-400" />
                    +91 9041260790
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Globe className="w-4 h-4 text-orange-400" />
                    maximally.in
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="text-center">
            <Link 
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-500/50 hover:border-orange-500 text-white hover:text-white font-space font-bold text-xs transition-all duration-300 hover:scale-[1.02]"
            >
              CONTACT US NOW
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Sponsor;
