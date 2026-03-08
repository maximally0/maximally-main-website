import { Link } from "react-router-dom";
import { ArrowRight, Users, Network as NetworkIcon, Shield } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const councilMembers = [
  { name: "Coming Soon", role: "AI Research Lead", org: "Top Tech Company", initials: "CS", domain: "AI" },
  { name: "Coming Soon", role: "Founding Engineer", org: "YC-Backed Startup", initials: "CS", domain: "Engineering" },
  { name: "Coming Soon", role: "Product Director", org: "Fortune 500", initials: "CS", domain: "Product" },
  { name: "Coming Soon", role: "Serial Founder", org: "Multiple Exits", initials: "CS", domain: "Startups" },
  { name: "Coming Soon", role: "Biotech Researcher", org: "Research Institution", initials: "CS", domain: "Biotech" },
  { name: "Coming Soon", role: "Open Source Maintainer", org: "Major OSS Project", initials: "CS", domain: "Open Source" },
];

export default function Network() {
  return (
    <>
      <SEO
        title="Network — Senior Council & Organizer Federation | Maximally"
        description="The people powering the builder ecosystem. Senior Council operators, the Organizer Federation (MFHOP), and the network behind Maximally infrastructure."
        canonicalUrl="https://maximally.in/network"
      />
      <div className="min-h-screen bg-black text-white pt-20 sm:pt-24 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 pb-20">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center pt-12 sm:pt-16 mb-20">
            <span className="font-space text-sm text-orange-400 tracking-[0.2em] font-medium mb-4 block uppercase">Network</span>
            <h1 className="font-space text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              The people behind<br />the ecosystem
            </h1>
            <p className="font-space text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Operators, organizers, judges, and builders. The network that powers Maximally.
            </p>
          </div>

          {/* Senior Council */}
          <div className="mb-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-orange-500/10 border border-orange-500/20">
                <Shield className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="font-space text-xl sm:text-2xl font-bold text-white">Senior Council</h2>
                <p className="font-space text-sm text-gray-400">Extraordinary operators who evaluate builders across Maximally events.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {councilMembers.map((member, i) => (
                <div key={i} className="p-4 bg-gray-900/60 border border-gray-800 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-800 border border-gray-700 flex items-center justify-center rounded-full">
                    <span className="font-space text-sm font-bold text-gray-400">{member.initials}</span>
                  </div>
                  <h3 className="font-space text-xs font-semibold text-white mb-0.5">{member.name}</h3>
                  <p className="font-space text-[10px] text-gray-400">{member.role}</p>
                  <span className="inline-block mt-2 px-1.5 py-0.5 bg-gray-800 border border-gray-700 text-[9px] font-space text-gray-400">{member.domain}</span>
                </div>
              ))}
            </div>

            <Link to="/senior-council" className="group inline-flex items-center gap-2 font-space text-sm text-gray-400 hover:text-orange-400 transition-colors">
              <span>View full Senior Council</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Organizer Federation */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-orange-500/10 border border-orange-500/20">
                <NetworkIcon className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="font-space text-xl sm:text-2xl font-bold text-white">Organizer Federation</h2>
                <p className="font-space text-sm text-gray-400">The Maximally Federation of Hackathon Organizers (MFHOP).</p>
              </div>
            </div>

            <div className="max-w-3xl bg-gray-900/40 border border-gray-800 p-8 sm:p-10 mb-8">
              <p className="font-space text-sm text-gray-300 leading-relaxed mb-6">
                MFHOP is Maximally's invite-reviewed network of serious hackathon organizers. Members get shared infrastructure, collective credibility, and access to a community of people solving the same problems in the builder ecosystem.
              </p>
              <p className="font-space text-sm text-gray-400 leading-relaxed mb-8">
                The federation exists to raise the standard of hackathon organizing globally. If you run events for builders and care about quality over quantity, this is your network.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/mfhop" className="group flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space text-sm font-semibold transition-all duration-300">
                  <span>Join the Federation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/host-hackathon" className="flex items-center justify-center gap-3 px-6 py-3 border border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-space text-sm font-semibold transition-all duration-300">
                  Host on Maximally
                </Link>
              </div>
            </div>
          </div>

          {/* Future categories hint */}
          <div className="border-t border-gray-800 pt-12">
            <p className="font-space text-xs text-gray-600 text-center">
              More network categories coming soon: Mentors · Judges · Builders
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
