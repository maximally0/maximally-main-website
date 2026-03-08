import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Upload,
  Scale,
  Users,
  BarChart3,
  CreditCard,
  Layers,
  Globe,
  Megaphone,
} from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const infraCards = [
  { icon: FileText, title: "Event Pages", description: "Custom event pages with tracks, rules, schedules, and branding. Each event gets a dedicated public page." },
  { icon: Upload, title: "Submissions System", description: "Project submission pipeline with file uploads, team tagging, and deadline enforcement." },
  { icon: Scale, title: "Judging Dashboard", description: "Structured scoring rubrics, judge assignment workflows, and real-time scoring aggregation." },
  { icon: Users, title: "Team Formation", description: "Built-in team matching, invite links, and participant management for organizers." },
  { icon: Layers, title: "Project Galleries", description: "Public project galleries showcasing submissions with filtering, search, and voting." },
];

const paymentsCards = [
  { icon: CreditCard, title: "Sponsorship Management", description: "Track sponsor commitments, deliverables, and visibility across events." },
  { icon: Globe, title: "Prize Distribution", description: "Structured prize pools with automated winner selection and distribution tracking." },
  { icon: Megaphone, title: "Ticketing & Registration", description: "Registration flows with capacity management, waitlists, and confirmation emails." },
];

const organizerTools = [
  { icon: BarChart3, title: "Analytics Dashboard", description: "Real-time metrics on registrations, submissions, engagement, and judge progress." },
  { icon: Layers, title: "Organizer Dashboard", description: "Unified control panel for managing all aspects of your event from one place." },
  { icon: Megaphone, title: "Event Promotion", description: "Built-in visibility through the Maximally events directory and featured placements." },
];

export default function Platform() {
  return (
    <>
      <SEO
        title="Platform — Builder Event Infrastructure | Maximally"
        description="Infrastructure for serious builders. Submissions, judging, team formation, payments, and analytics — everything to run and scale builder events."
        canonicalUrl="https://maximally.in/platform"
      />
      <div className="min-h-screen bg-black text-white pt-20 sm:pt-24 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 pb-20">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center pt-12 sm:pt-16 mb-20">
            <span className="font-space text-sm text-orange-400 tracking-[0.2em] font-medium mb-4 block uppercase">Platform</span>
            <h1 className="font-space text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Event infrastructure<br />for serious builders
            </h1>
            <p className="font-space text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Everything you need to run, manage, and scale builder events. From submissions to judging to payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/host-hackathon" className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space text-sm font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20">
                <span>Host an Event</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/organizer/apply" className="flex items-center justify-center gap-3 px-8 py-4 border border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-space text-sm font-semibold transition-all duration-300">
                Organizer Dashboard
              </Link>
            </div>
          </div>

          {/* Event Infrastructure */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <span className="font-space text-sm text-gray-500 tracking-wide font-medium mb-3 block uppercase">Core Infrastructure</span>
              <h2 className="font-space text-2xl sm:text-3xl font-bold text-white mb-3">Event Infrastructure</h2>
              <p className="font-space text-sm text-gray-400 max-w-xl mx-auto">The building blocks for running any builder event.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
              {infraCards.map((card, i) => (
                <div key={i} className="group p-6 bg-gray-900/40 border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
                  <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 inline-block mb-4 group-hover:bg-orange-500/20 transition-colors">
                    <card.icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="font-space text-sm font-semibold text-white mb-2">{card.title}</h3>
                  <p className="font-space text-xs text-gray-400 leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payments Infrastructure */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <span className="font-space text-sm text-gray-500 tracking-wide font-medium mb-3 block uppercase">Monetization</span>
              <h2 className="font-space text-2xl sm:text-3xl font-bold text-white mb-3">Payments Infrastructure</h2>
              <p className="font-space text-sm text-gray-400 max-w-xl mx-auto">Monetize and manage the financial side of your events.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
              {paymentsCards.map((card, i) => (
                <div key={i} className="group p-6 bg-gray-900/40 border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
                  <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 inline-block mb-4 group-hover:bg-orange-500/20 transition-colors">
                    <card.icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="font-space text-sm font-semibold text-white mb-2">{card.title}</h3>
                  <p className="font-space text-xs text-gray-400 leading-relaxed">{card.description}</p>
                  <span className="inline-block mt-3 px-2 py-0.5 bg-gray-800 border border-gray-700 text-[10px] font-space text-gray-500 font-medium">Coming Soon</span>
                </div>
              ))}
            </div>
          </div>

          {/* Organizer Tools */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <span className="font-space text-sm text-gray-500 tracking-wide font-medium mb-3 block uppercase">Organizer Tools</span>
              <h2 className="font-space text-2xl sm:text-3xl font-bold text-white mb-3">Built for Organizers</h2>
              <p className="font-space text-sm text-gray-400 max-w-xl mx-auto">Tools to manage, promote, and analyze your events.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
              {organizerTools.map((card, i) => (
                <div key={i} className="group p-6 bg-gray-900/40 border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
                  <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 inline-block mb-4 group-hover:bg-orange-500/20 transition-colors">
                    <card.icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="font-space text-sm font-semibold text-white mb-2">{card.title}</h3>
                  <p className="font-space text-xs text-gray-400 leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
