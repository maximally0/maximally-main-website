import { CompanyMarquee } from "../PartnerLogoRow";

const stats = [
  { value: "15,000+", label: "Participants" },
  { value: "11+", label: "Flagship Hackathons" },
  { value: "20+", label: "Sponsor Partners" },
];

const companies = [
  "Google", "Microsoft", "Meta", "AWS", "OpenAI", "DeepMind",
  "Intuit", "Visa", "Salesforce", "FedEx", "Atlassian", "McKinsey",
  "Replit", "Oracle", "Y Combinator", "Warner Bros.", "General Motors"
];

export function CredibilitySection() {
  return (
    <section className="py-12 sm:py-16 relative bg-black border-y border-red-500/30">
      <div className="absolute inset-0 bg-gradient-to-r from-red-950/20 via-transparent to-red-950/20" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-10 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center"
              data-testid={`stat-${index}`}
            >
              <div className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl text-red-500 mb-2">
                {stat.value}
              </div>
              <div className="font-jetbrains text-xs sm:text-sm text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mb-6">
          <p className="font-press-start text-[10px] sm:text-xs text-gray-500 tracking-wider">
            JUDGES FROM LEADING COMPANIES
          </p>
        </div>
        
        <CompanyMarquee companies={companies} />
        
        <div className="mt-8 text-center">
          <p className="font-jetbrains text-xs sm:text-sm text-gray-500">
            Events with schools, colleges, communities, and startups worldwide
          </p>
        </div>
      </div>
    </section>
  );
}

export default CredibilitySection;
