import { Sparkles } from "lucide-react";
import { CompanyMarquee } from "../PartnerLogoRow";

const companies = [
  "Google", "Microsoft", "Meta", "AWS", "OpenAI", "DeepMind",
  "Intuit", "Visa", "Salesforce", "FedEx", "Atlassian", "McKinsey",
  "Replit", "Oracle", "Y Combinator", "Warner Bros.", "General Motors"
];

export function CredibilitySection() {
  return (
    <section className="py-12 sm:py-16 relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/10 via-transparent to-purple-950/10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-gray-500" />
            <p className="font-press-start text-[10px] sm:text-xs text-gray-500 tracking-wider">
              TRUSTED BY LEADING COMPANIES
            </p>
            <Sparkles className="w-3 h-3 text-gray-500" />
          </div>
        </div>
        
        <CompanyMarquee companies={companies} />
        
        
      </div>
    </section>
  );
}

export default CredibilitySection;
