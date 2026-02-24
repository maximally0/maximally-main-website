import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const councilMembers = [
  {
    name: "Coming Soon",
    role: "AI Research Lead",
    org: "Top Tech Company",
    initials: "CS",
    domain: "AI",
  },
  {
    name: "Coming Soon",
    role: "Founding Engineer",
    org: "YC-Backed Startup",
    initials: "CS",
    domain: "Engineering",
  },
  {
    name: "Coming Soon",
    role: "Product Director",
    org: "Fortune 500",
    initials: "CS",
    domain: "Product",
  },
  {
    name: "Coming Soon",
    role: "Serial Founder",
    org: "Multiple Exits",
    initials: "CS",
    domain: "Startups",
  },
];

export function SeniorCouncilSection() {
  return (
    <section className="py-24 sm:py-32 relative bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-14 sm:mb-18">
          <span className="font-space text-sm text-gray-400 tracking-wide font-medium mb-4 block uppercase">
            Maximally Senior Council
          </span>
          <h2 className="font-space text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 max-w-3xl mx-auto leading-tight">
            Judged by people who have built at the highest level.
          </h2>
          <p className="font-space text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The Senior Council is Maximally's directory of extraordinary operators — researchers, founders, and builders with documented recognition in their fields. They set the standard.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mb-14">
          {councilMembers.map((member, index) => (
            <div
              key={index}
              className="p-5 sm:p-6 bg-gray-900/60 border border-gray-800 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 border border-gray-700 flex items-center justify-center rounded-full">
                <span className="font-space text-lg font-bold text-gray-400">
                  {member.initials}
                </span>
              </div>
              <h3 className="font-space text-sm font-semibold text-white mb-1">
                {member.name}
              </h3>
              <p className="font-space text-xs text-gray-400 mb-1">
                {member.role}
              </p>
              <p className="font-space text-xs text-gray-500">
                {member.org}
              </p>
              <span className="inline-block mt-3 px-2 py-0.5 bg-gray-800 border border-gray-700 text-[10px] font-space text-gray-400 font-medium">
                {member.domain}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/senior-council"
            className="group flex items-center gap-2 px-6 py-3 border border-gray-700 hover:border-white text-gray-300 hover:text-white font-space text-sm font-medium transition-all duration-300"
          >
            <span>View the Full Council</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/senior-council#apply"
            className="font-space text-sm text-gray-500 hover:text-orange-400 transition-colors"
          >
            Apply to Join the Council →
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
    </section>
  );
}

export default SeniorCouncilSection;
