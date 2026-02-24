import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import MyHackathonsQuickAccess from "@/components/MyHackathonsQuickAccess";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import {
  HeroSection,
  CredibilitySection,
  UpcomingHackathonsSection,
  SeniorCouncilSection,
  ExploreMaximallySection,
  ForOrganizersSection,
  DotNavigation,
} from "@/components/landing";

const Index = () => {
  return (
    <>
      <SEO
        title="Maximally - The World's Most Serious Builder Ecosystem"
        description="Where extraordinary operators, builders, and innovators converge. Curated hackathons, the Senior Council, and programs for serious builders."
        keywords="hackathon, builder ecosystem, hackathons, innovation, Senior Council, operators, builders"
        canonicalUrl="https://maximally.in"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Maximally",
          description: "The world's most serious builder ecosystem. Where extraordinary operators converge.",
          url: "https://maximally.in",
        }}
      />

      <div className="min-h-screen bg-black text-white">
        <DotNavigation />
        <MyHackathonsQuickAccess />
        
        <div id="section-1">
          <HeroSection />
        </div>
        
        <CredibilitySection />
        
        <div id="section-2">
          <UpcomingHackathonsSection />
        </div>
        
        <div id="section-3">
          <SeniorCouncilSection />
        </div>
        
        <div id="section-4">
          <ExploreMaximallySection />
        </div>
        
        <div id="section-5">
          <ForOrganizersSection />
        </div>
        
        <NewsletterSignup />
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
