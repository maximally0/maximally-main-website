import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import MyHackathonsQuickAccess from "@/components/MyHackathonsQuickAccess";
import {
  HeroSection,
  CredibilitySection,
  BlogFeedSection,
  UpcomingHackathonsSection,
  ExploreMaximallySection,
  WhyMaximallySection,
  ForOrganizersSection,
  BecomeJudgeSection,
  GlobalGallerySection,
  PartnersSection,
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
        <MyHackathonsQuickAccess />
        <HeroSection />
        
        <CredibilitySection />
        
        <UpcomingHackathonsSection />
        
        <BlogFeedSection />
        
        <ExploreMaximallySection />
        
        <WhyMaximallySection />
        
        <ForOrganizersSection />
        
        <BecomeJudgeSection />
        
        <GlobalGallerySection />
        
        <PartnersSection />
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
