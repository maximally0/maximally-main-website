import { useState } from "react";
import { ArrowRight, Star, Users, Target, Rocket, Sparkles, Crown, Code, Zap, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import TallyFormDialog from "@/components/TallyFormDialog";

const Sponsor = () => {
  const [isTallyFormOpen, setIsTallyFormOpen] = useState(false);
  return (
    <>
      <SEO 
        title="Sponsor Maximally Summer Bootcamp 2025 | Partner With Us"
        description="Partner with Maximally to empower India's most ambitious teens. Reach 1000+ engaged learners through our Summer Bootcamp 2025. Multiple sponsorship tiers available."
        keywords="summer bootcamp sponsorship, teen education sponsorship, youth empowerment india, maximally partnership"
      />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="font-press-start text-3xl mb-4">⚡️ Sponsor Maximally Summer Bootcamp 2025</h1>
          <p className="font-jetbrains text-xl mb-8">Empowering India's most ambitious teens to learn, build & lead.</p>
        </section>

        {/* About */}
        <section className="mb-16 pixel-border p-6">
          <p className="font-jetbrains text-lg">
            Maximally is a youth-led platform helping ambitious teens (ages 13–20) across India learn real-world skills through immersive online bootcamps in entrepreneurship, public speaking, AI, marketing & more.
          </p>
        </section>

        {/* Why Sponsor */}
        <section className="mb-16">
          <h2 className="font-press-start text-2xl mb-8">Why Sponsor Us?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="pixel-border p-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <span className="font-jetbrains">Access to 1000+ engaged teen learners</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🚀</span>
                  <span className="font-jetbrains">Strong social impact & cause-based branding</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📢</span>
                  <span className="font-jetbrains">Multi-platform exposure (Discord, Insta, Email)</span>
                </li>
              </ul>
            </div>
            <div className="pixel-border p-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🎙️</span>
                  <span className="font-jetbrains">Sponsor talks, shoutouts & speaking slots</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🧑‍💼</span>
                  <span className="font-jetbrains">Early access to top student talent</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Audience */}
        <section className="mb-16">
          <h2 className="font-press-start text-2xl mb-8">Audience Snapshot</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="pixel-border p-6">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="text-2xl">👥</span>
                  <span className="font-jetbrains">Age Group: 13–20</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">🌍</span>
                  <span className="font-jetbrains">All-India reach (Tier 1–3 cities)</span>
                </li>
              </ul>
            </div>
            <div className="pixel-border p-6">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <span className="font-jetbrains">Active teen community via Discord</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">📲</span>
                  <span className="font-jetbrains">Est. 10K+ digital reach across socials</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sponsorship Tiers */}
        <section className="mb-16">
          <h2 className="font-press-start text-2xl mb-8">Sponsorship Tiers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="pixel-border p-6 bg-yellow-50 cursor-pointer hover:transform hover:scale-105 transition-all" onClick={() => setIsTallyFormOpen(true)}>
              <h3 className="font-press-start text-lg mb-4">🟡 Minimum Sponsor</h3>
              <p className="font-press-start text-xl mb-4">₹25,000</p>
              <ul className="space-y-2 font-jetbrains">
                <li>• Logo on website</li>
                <li>• Insta & story shoutout</li>
                <li>• Certificate of appreciation</li>
              </ul>
            </div>
            <div className="pixel-border p-6 bg-blue-50 cursor-pointer hover:transform hover:scale-105 transition-all" onClick={() => setIsTallyFormOpen(true)}>
              <h3 className="font-press-start text-lg mb-4">🔵 Resolution Partner</h3>
              <p className="font-press-start text-xl mb-4">₹1,00,000</p>
              <ul className="space-y-2 font-jetbrains">
                <li>• All Minimum benefits +</li>
                <li>• Speaking slot during bootcamp</li>
                <li>• Branded email shoutout</li>
                <li>• Discord community badge</li>
              </ul>
            </div>
            <div className="pixel-border p-6 bg-red-50 cursor-pointer hover:transform hover:scale-105 transition-all" onClick={() => setIsTallyFormOpen(true)}>
              <h3 className="font-press-start text-lg mb-4">🔴 Infinite Mode</h3>
              <p className="font-press-start text-xl mb-4">₹5,00,000+</p>
              <ul className="space-y-2 font-jetbrains">
                <li>• "Presented by [Your Brand]" tag</li>
                <li>• Custom collab reel on Instagram</li>
                <li>• VIP Impact Report post-event</li>
                <li>• Max visibility across platforms</li>
              </ul>
            </div>
            <TallyFormDialog open={isTallyFormOpen} onOpenChange={setIsTallyFormOpen} />
          </div>
          <p className="text-center mt-4 font-jetbrains italic">Custom sponsorships available on request</p>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="font-press-start text-2xl mb-8">Timeline</h2>
          <div className="pixel-border p-6">
            <ul className="space-y-4 font-jetbrains">
              <li className="flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <span>Sponsor Outreach: <strong>April–May 2025</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">🎓</span>
                <span>Bootcamp Dates: <strong>June–July 2025</strong></span>
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
          <h2 className="font-press-start text-2xl mb-8">Get In Touch</h2>
          <div className="pixel-border p-6 inline-block mx-auto">
            <h3 className="font-press-start mb-4">Rishul Chanana</h3>
            <p className="font-jetbrains mb-2">Founder, Maximally</p>
            <div className="space-y-2 font-jetbrains">
              <p>📧 hello@maximally.in</p>
              <p>📞 +91 9041260790</p>
              <p>🌐 maximally.in</p>
            </div>
          </div>
        </section>

        <div className="text-center">
          <Button asChild size="lg" className="font-press-start">
            <Link to="/contact">Contact Us Now</Link>
          </Button>
        </div>
      </main>
    </>
  );
};

export default Sponsor;
