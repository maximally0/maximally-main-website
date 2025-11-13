import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  Trophy, 
  Zap,
  Building2,
  Mail,
  ExternalLink,
  Star,
  Gift,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-black text-white relative overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(229,9,20,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-maximally-red pixel-border animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + i}s`,
          }}
        />
      ))}
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center py-20">
        <div className="minecraft-block bg-maximally-red p-4 inline-block mb-6">
          <Heart className="h-8 w-8 text-black" />
        </div>
        
        <h1 className="font-press-start text-3xl md:text-4xl lg:text-6xl mb-6 text-white drop-shadow-[4px_4px_0px_rgba(229,9,20,1)]">
          BECOME A SUPPORTER
        </h1>
        
        <p className="font-press-start text-maximally-red text-lg md:text-xl mb-6">
          HELP US HOST CRAZIER HACKATHONS
        </p>
        
        <div className="pixel-card bg-black/80 border-2 border-maximally-red p-6 md:p-8 max-w-4xl mx-auto">
          <p className="font-jetbrains text-gray-300 text-base md:text-lg leading-relaxed">
            Help us push hacker culture to every corner of the world. Build the future of hackathons with us.
          </p>
        </div>
      </div>
    </section>
  );
};

const WhyThisExists = () => {
  return (
    <section className="bg-black text-white py-20 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(229,9,20,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-press-start text-2xl md:text-4xl text-maximally-red mb-6">
            WHY THIS EXISTS
          </h2>
        </div>
        
        <div className="pixel-card bg-black/80 border-2 border-maximally-red p-8 md:p-12 space-y-6">
          <p className="font-jetbrains text-gray-300 text-lg leading-relaxed">
            Maximally is building the world's most powerful hackathon ecosystem — a global OS for hackathons.
          </p>
          
          <p className="font-jetbrains text-gray-300 text-lg leading-relaxed">
            We help schools, colleges, startups, and communities run <span className="text-maximally-red font-bold">insane, high-energy hackathons</span> with:
          </p>
          
          <ul className="font-jetbrains text-gray-300 text-lg space-y-2 pl-6">
            <li className="flex items-start gap-2">
              <span className="text-maximally-red">▸</span>
              <span>full-stack infra</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-maximally-red">▸</span>
              <span>submissions + judging systems</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-maximally-red">▸</span>
              <span>sponsors + mentors</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-maximally-red">▸</span>
              <span>branding + ops</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-maximally-red">▸</span>
              <span>templates + playbooks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-maximally-red">▸</span>
              <span>MFHOP federation access</span>
            </li>
          </ul>
          
          <p className="font-jetbrains text-gray-300 text-lg leading-relaxed">
            We've already hosted and co-organized 10+ global hackathons, brought thousands of builders together, 
            and partnered with judges from Google, Microsoft, Meta, AWS, McKinsey, Warner Bros Discovery, and more.
          </p>
          
          <p className="font-jetbrains text-gray-300 text-lg leading-relaxed">
            Now we want to <span className="text-maximally-red font-bold">scale this globally</span> — bigger events, wilder formats, 
            more locations, more opportunities.
          </p>
          
          <p className="font-jetbrains text-maximally-red text-xl leading-relaxed font-bold text-center pt-4">
            And we want YOU to be part of the movement.
          </p>
        </div>
      </div>
    </section>
  );
};

const IndividualTiers = () => {
  const tiers = [
    {
      name: "SUPPORTER",
      price: "$100",
      stars: 1,
      benefits: [
        "Listed on the Maximally Supporter Wall",
        "Supporter badge (LinkedIn-ready)",
        "Early access to all hackathons",
        "Access to the Maximally Community + private supporter channels",
        "Invitation to monthly supporter calls",
        "Ability to advise on formats, themes, and new ideas (light advisory role)"
      ],
      color: "maximally-red"
    },
    {
      name: "SUPER SUPPORTER",
      price: "$150",
      stars: 2,
      benefits: [
        "Everything in Supporter +",
        "Featured profile on Supporter Wall (photo + 1-line)",
        "Priority invitation to co-review shortlists",
        "Access to MFHOP resources & organizer playbooks",
        "Quarterly 'Advisor Circle' meet-up",
        "Ability to influence the direction of upcoming hackathons"
      ],
      color: "maximally-yellow",
      featured: true
    },
    {
      name: "CHAMPION SUPPORTER",
      price: "$200",
      stars: 3,
      benefits: [
        "Everything in Super Supporter +",
        "Featured as Champion on a hackathon webpage",
        "Optional 'Advisor Spotlight' on our Instagram",
        "1× 15-minute 'build hackathons with us' call",
        "Access to our mentors/judges pipeline",
        "Ability to advise more deeply on the Maximally roadmap"
      ],
      color: "green-500"
    }
  ];

  return (
    <section className="bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-press-start text-2xl md:text-4xl text-maximally-red mb-4">
            INDIVIDUAL SUPPORTERS
          </h2>
          <p className="font-jetbrains text-gray-300 text-lg max-w-3xl mx-auto">
            Support Maximally → become an Advisor-like supporter → help us build crazier shit.
          </p>
          <p className="font-jetbrains text-gray-300 text-lg max-w-3xl mx-auto mt-4">
            When you support Maximally, you're not "donating." You're joining the internal circle that helps 
            shape hackathons, events, formats, partnerships, and the future of hacker culture.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <Card 
              key={idx}
              className={`bg-black border-2 ${tier.featured ? 'border-maximally-yellow' : 'border-maximally-red'} p-6 relative overflow-hidden hover-elevate`}
              data-testid={`card-tier-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {tier.featured && (
                <div className="absolute top-0 right-0 bg-maximally-yellow text-black px-3 py-1 font-press-start text-xs">
                  POPULAR
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: tier.stars }).map((_, i) => (
                  <Star key={i} className={`h-5 w-5 fill-${tier.color} text-${tier.color}`} />
                ))}
              </div>
              
              <h3 className="font-press-start text-xl text-white mb-2">
                {tier.name}
              </h3>
              
              <p className={`font-press-start text-3xl text-${tier.color} mb-6`}>
                {tier.price}
              </p>
              
              <ul className="space-y-3 mb-8">
                {tier.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 font-jetbrains text-gray-300 text-sm">
                    <span className="text-maximally-red mt-1">▸</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <a 
                href="https://www.buymeacoffee.com/maximally" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Button 
                  className="w-full bg-maximally-red hover:bg-maximally-red/90 text-black font-press-start"
                  data-testid={`button-support-${tier.price.replace('$', '')}`}
                >
                  SUPPORT – {tier.price}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const SponsorPackages = () => {
  const packages = [
    {
      name: "STARTER SPONSOR",
      price: "$1,500",
      color: "maximally-yellow",
      benefits: [
        "Logo on event page",
        "Mention in newsletter & socials",
        "Recruiter access to top performers",
        "Sponsor certificate",
        "Inclusion in MFHOP partner database"
      ]
    },
    {
      name: "GROWTH SPONSOR",
      price: "$3,500",
      color: "maximally-red",
      benefits: [
        "Everything in Starter +",
        "Dedicated prize track",
        "Judge/mentor slot",
        "Branding in opening + closing ceremony",
        "Feature on Maximally's Instagram + LinkedIn"
      ],
      featured: true
    },
    {
      name: "FLAGSHIP SPONSOR",
      price: "$7,500",
      color: "blue-500",
      benefits: [
        "Everything in Growth +",
        "Category naming rights",
        "Full integration into hackathon experience",
        "Access to participant resumes (opt-in)",
        "Full brand pack across mailers + content",
        "Year-long MFHOP partnership access"
      ]
    }
  ];

  return (
    <section className="bg-black text-white py-20 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(229,9,20,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-press-start text-2xl md:text-4xl text-maximally-red mb-4">
            SPONSOR PACKAGES
          </h2>
          <p className="font-jetbrains text-gray-300 text-lg max-w-3xl mx-auto">
            For companies that want branding, presence, and visibility across the Maximally ecosystem + MFHOP network.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {packages.map((pkg, idx) => (
            <Card 
              key={idx}
              className={`bg-black border-2 ${pkg.featured ? 'border-maximally-red' : 'border-gray-700'} p-6 relative overflow-hidden hover-elevate`}
              data-testid={`card-sponsor-${pkg.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {pkg.featured && (
                <div className="absolute top-0 right-0 bg-maximally-red text-black px-3 py-1 font-press-start text-xs">
                  RECOMMENDED
                </div>
              )}
              
              <div className="mb-4">
                <Building2 className={`h-8 w-8 text-${pkg.color}`} />
              </div>
              
              <h3 className="font-press-start text-xl text-white mb-2">
                {pkg.name}
              </h3>
              
              <p className={`font-press-start text-3xl text-${pkg.color} mb-6`}>
                {pkg.price}
              </p>
              
              <ul className="space-y-3 mb-8">
                {pkg.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 font-jetbrains text-gray-300 text-sm">
                    <span className="text-maximally-red mt-1">▸</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <a 
                href="https://www.buymeacoffee.com/maximally" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Button 
                  className="w-full bg-maximally-red hover:bg-maximally-red/90 text-black font-press-start"
                  data-testid={`button-sponsor-${pkg.price.replace('$', '').replace(',', '')}`}
                >
                  SPONSOR – {pkg.price}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </Card>
          ))}
        </div>
        
        <Card className="bg-black border-2 border-purple-500 p-8 hover-elevate" data-testid="card-sponsor-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-press-start text-2xl text-white mb-3">
                CUSTOM PARTNERSHIP
              </h3>
              <p className="font-jetbrains text-gray-300 text-lg">
                If your org wants something larger or multi-event
              </p>
            </div>
            <a href="mailto:hello@maximally.in">
              <Button 
                className="bg-purple-500 hover:bg-purple-600 text-white font-press-start whitespace-nowrap"
                data-testid="button-custom-pricing"
              >
                GET CUSTOM PRICING
                <Mail className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </Card>
      </div>
    </section>
  );
};

const NonMonetarySupport = () => {
  const supportTypes = [
    { icon: Zap, text: "credits (AI tools, hosting, APIs)" },
    { icon: Gift, text: "swag" },
    { icon: Building2, text: "workspace access" },
    { icon: Target, text: "marketing reach" },
    { icon: Users, text: "mentorship" },
    { icon: Trophy, text: "judge roles" },
    { icon: Heart, text: "community partnerships" }
  ];

  return (
    <section className="bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-press-start text-2xl md:text-4xl text-maximally-red mb-6">
            DON'T WANT TO SUPPORT MONETARILY?
          </h2>
          <p className="font-press-start text-xl text-maximally-yellow mb-4">
            STILL JOIN US
          </p>
        </div>
        
        <div className="pixel-card bg-black/80 border-2 border-maximally-red p-8 md:p-12">
          <p className="font-jetbrains text-gray-300 text-lg mb-6 text-center">
            You can support hacker culture by contributing:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {supportTypes.map((type, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-black/50 border border-maximally-red/30 p-4">
                <type.icon className="h-6 w-6 text-maximally-red flex-shrink-0" />
                <span className="font-jetbrains text-gray-300">{type.text}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="font-jetbrains text-gray-300 text-lg mb-6">
              Email us to be part of this:
            </p>
            <a href="mailto:hello@maximally.in">
              <Button 
                className="bg-maximally-red hover:bg-maximally-red/90 text-black font-press-start text-lg px-8 py-6"
                data-testid="button-email-support"
              >
                HELLO@MAXIMALLY.IN
                <Mail className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="bg-black text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(229,9,20,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-maximally-red pixel-border animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + i}s`,
          }}
        />
      ))}
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="pixel-card bg-black/80 border-2 border-maximally-red p-8 md:p-12 text-center">
          <p className="font-press-start text-xl md:text-2xl text-white mb-8 leading-relaxed">
            "WE'RE BUILDING THE FUTURE OF HACKATHONS."
          </p>
          
          <p className="font-jetbrains text-gray-300 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
            If you've ever believed in hacker culture, builder energy, or global communities — 
            come build this with us.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#individual-supporters">
              <Button 
                className="bg-maximally-red hover:bg-maximally-red/90 text-black font-press-start"
                data-testid="button-support-individually"
              >
                SUPPORT INDIVIDUALLY
              </Button>
            </a>
            <a href="#sponsor-packages">
              <Button 
                className="bg-maximally-yellow hover:bg-maximally-yellow/90 text-black font-press-start"
                data-testid="button-sponsor-company"
              >
                SPONSOR AS A COMPANY
              </Button>
            </a>
            <a href="mailto:hello@maximally.in">
              <Button 
                variant="outline" 
                className="border-2 border-maximally-red text-maximally-red hover:bg-maximally-red hover:text-black font-press-start"
                data-testid="button-contact-us"
              >
                CONTACT US
                <Mail className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function BecomeASupporter() {
  return (
    <>
      <SEO
        title="Become a Supporter | Maximally"
        description="Support Maximally and help us build the future of hackathons. Join the global movement of hacker culture with individual or company sponsorship packages."
        canonicalUrl="/become-a-supporter"
      />
      
      <div className="min-h-screen bg-black">
        <HeroSection />
        <WhyThisExists />
        <div id="individual-supporters">
          <IndividualTiers />
        </div>
        <div id="sponsor-packages">
          <SponsorPackages />
        </div>
        <NonMonetarySupport />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
