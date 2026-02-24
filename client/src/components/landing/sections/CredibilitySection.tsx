import { CompanyMarquee } from "../PartnerLogoRow";

const companies = [
  "Google", "Microsoft", "Meta", "AWS", "OpenAI", "DeepMind",
  "Intuit", "Visa", "Salesforce", "FedEx", "Atlassian", "McKinsey",
  "Replit", "Oracle", "Y Combinator", "Warner Bros.", "General Motors"
];

export function CredibilitySection() {
  return (
    <section className="py-14 sm:py-20 relative bg-gray-950 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8">
          <p className="font-space text-sm text-gray-500 tracking-wide">
            Judges, mentors, and partners from
          </p>
        </div>
        
        <CompanyMarquee companies={companies} />

        <p className="text-center mt-8 font-space text-xs text-gray-600">
          Our Senior Council includes operators from organizations like these.
        </p>
      </div>
    </section>
  );
}

export default CredibilitySection;
