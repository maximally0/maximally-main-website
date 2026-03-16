import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import MyHackathonsQuickAccess from "@/components/MyHackathonsQuickAccess";
import {
  HeroSection,
  UpcomingHackathonsSection,
  SeniorCouncilSection,
  PlatformInfraSection,
  JoinEcosystemCTA,
} from "@/components/landing";

const Index = () => {
  return (
    <>
      <SEO
        title="Maximally — Infrastructure for Serious Builders"
        description="Run serious competitions. Compete in events. Ship real products. Maximally is the infrastructure layer powering builder ecosystems."
        keywords="hackathon platform, builder ecosystem, competition infrastructure, hackathons, innovation, builders"
        canonicalUrl="https://maximally.in"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Maximally",
          description: "Infrastructure for serious builders. Run competitions, compete in events, ship real products.",
          url: "https://maximally.in",
        }}
      />

      <div className="min-h-screen bg-black text-white">
        <MyHackathonsQuickAccess />
        <HeroSection />
        <UpcomingHackathonsSection />
        <SeniorCouncilSection />
        <PlatformInfraSection />
        <JoinEcosystemCTA />
        <Footer />
      </div>
    </>
  );
};

export default Index;
