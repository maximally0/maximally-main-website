import { Trophy, Users, Building2, Sparkles } from "lucide-react";
import { CompanyMarquee } from "../PartnerLogoRow";

const stats = [
  { value: "15,000+", label: "Participants", icon: Users, color: "text-red-400" },
  { value: "11+", label: "Flagship Hackathons", icon: Trophy, color: "text-yellow-400" },
  { value: "20+", label: "Sponsor Partners", icon: Building2, color: "text-purple-400" },
];

const companies = [
  "Google", "Microsoft", "Meta", "AWS", "OpenAI", "DeepMind",
  "Intuit", "Visa", "Salesforce", "FedEx", "Atlassian", "McKinsey",
  "Replit", "Oracle", "Y Combinator", "Warner Bros.", "General Motors"
];

export function CredibilitySection() {
  return (
    <section className="py-16 sm:py-20 relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/10 via-transparent to-purple-950/10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-14 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index}
                className="group text-center p-6 bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 hover:border-red-500/40 transition-all duration-300"
                data-testid={`stat-${index}`}
              >
                <IconComponent className={`w-6 h-6 ${stat.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                <div className={`font-press-start text-2xl sm:text-3xl md:text-4xl ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="font-jetbrains text-xs sm:text-sm text-gray-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-gray-500" />
            <p className="font-press-start text-[10px] sm:text-xs text-gray-500 tracking-wider">
              JUDGES FROM LEADING COMPANIES
            </p>
            <Sparkles className="w-3 h-3 text-gray-500" />
          </div>
        </div>
        
        <CompanyMarquee companies={companies} />
        
        <div className="mt-10 text-center">
          <p className="font-jetbrains text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
            Partnering with schools, colleges, communities, and startups worldwide
          </p>
        </div>
      </div>
    </section>
  );
}

export default CredibilitySection;
