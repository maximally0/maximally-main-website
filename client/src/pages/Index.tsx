import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import MyHackathonsQuickAccess from "@/components/MyHackathonsQuickAccess";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import {
  HeroSection,
  CredibilitySection,
  BlogFeedSection,
  UpcomingHackathonsSection,
  ExploreMaximallySection,
  ForOrganizersSection,
  DotNavigation,
} from "@/components/landing";

const Index = () => {
  return (
    <>
      <SEO
        title="Maximally - Welcome to the Hackathon Universe"
        description="High-energy hackathons and programs for ambitious builders. Discover events, join challenges, and explore everything Maximally has to offer."
        keywords="hackathon, hackathons, coding competition, builders, developers, innovation, tech events"
        canonicalUrl="https://maximally.in"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Maximally",
          description: "A global innovation league that hosts high-stakes hackathons for ambitious builders",
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
          <BlogFeedSection />
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
