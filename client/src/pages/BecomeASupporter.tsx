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
  Target,
  DollarSign,
  Shield,
  CheckCircle2,
  MessageCircle,
  Globe
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

const FounderNote = () => {
  return (
    <section className="bg-black text-white py-20 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(229,9,20,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="pixel-card bg-black/90 border-2 border-maximally-yellow p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="h-8 w-8 text-maximally-yellow" />
            <h2 className="font-press-start text-xl md:text-2xl text-maximally-yellow">
              FROM THE FOUNDER
            </h2>
          </div>
          
          <div className="space-y-4">
            <p className="font-jetbrains text-gray-300 text-lg leading-relaxed italic">
              "I started Maximally because hackathons changed my life. Everything we've done so far has been 
              built without budget — just energy and creativity.
            </p>
            
            <p className="font-jetbrains text-gray-300 text-lg leading-relaxed italic">
              If you support us today, you're helping fuel something that I genuinely believe will become 
              the largest hackathon network in the world.
            </p>
            
            <p className="font-jetbrains text-gray-300 text-lg leading-relaxed italic">
              And I promise: we'll use your support to build the craziest, most creative events ever."
            </p>
            
            <p className="font-jetbrains text-maximally-red text-xl font-bold pt-4">
              — Rishul Chanana, Founder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const TheMovement = () => {
  return (
    <section className="bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="pixel-card bg-black/80 border-2 border-maximally-red p-8 md:p-12 text-center">
          <Globe className="h-12 w-12 text-maximally-red mx-auto mb-6" />
          
          <h2 className="font-press-start text-2xl md:text-3xl text-maximally-red mb-8">
            THE MOVEMENT
          </h2>
          
          <p className="font-jetbrains text-gray-300 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
            We want a world where hackathons become a cultural phenomenon — not just a college event. 
            We want more builders, more chaos, more creativity, more making. 
            <span className="text-maximally-red font-bold"> Your support helps us bring hackathons to cities, villages, schools, 
            colleges, communities, and online spaces across the world.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

const WhatYouFunding = () => {
  const breakdown = [
    { percentage: 40, label: "Prize Pools", borderColor: "border-maximally-red", textColor: "text-maximally-red" },
    { percentage: 20, label: "Infra & Tools", borderColor: "border-maximally-yellow", textColor: "text-maximally-yellow" },
    { percentage: 15, label: "Branding + Content", borderColor: "border-green-500", textColor: "text-green-500" },
    { percentage: 15, label: "Judges & Mentors", borderColor: "border-blue-500", textColor: "text-blue-500" },
    { percentage: 10, label: "Outreach & Partnerships", borderColor: "border-purple-500", textColor: "text-purple-500" }
  ];

  return (
    <section className="bg-black text-white py-20 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(229,9,20,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-press-start text-2xl md:text-4xl text-maximally-red mb-4">
            WHAT YOU'RE ACTUALLY FUNDING
          </h2>
          <p className="font-jetbrains text-gray-300 text-lg">
            Complete transparency. Here's exactly where supporter money goes:
          </p>
        </div>
        
        <div className="grid md:grid-cols-5 gap-6">
          {breakdown.map((item, idx) => (
            <Card 
              key={idx}
              className={`bg-black border-2 ${item.borderColor} p-6 text-center hover-elevate`}
              data-testid={`card-funding-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="mb-4">
                <DollarSign className={`h-8 w-8 ${item.textColor} mx-auto`} />
              </div>
              
              <p className={`font-press-start text-4xl ${item.textColor} mb-3`}>
                {item.percentage}%
              </p>
              
              <p className="font-jetbrains text-gray-300 text-sm">
                {item.label}
              </p>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="font-jetbrains text-gray-400 text-sm italic">
            This builds trust. We're not pocketing it — we're building the ecosystem.
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
      starColor: "fill-maximally-red text-maximally-red",
      priceColor: "text-maximally-red"
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
      starColor: "fill-maximally-yellow text-maximally-yellow",
      priceColor: "text-maximally-yellow",
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
      starColor: "fill-green-500 text-green-500",
      priceColor: "text-green-500"
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
                  <Star key={i} className={`h-5 w-5 ${tier.starColor}`} />
                ))}
              </div>
              
              <h3 className="font-press-start text-xl text-white mb-2">
                {tier.name}
              </h3>
              
              <p className={`font-press-start text-3xl ${tier.priceColor} mb-6`}>
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

const AdvisorCircle = () => {
  const advisorRoles = [
    { icon: Zap, text: "Brainstorm new formats" },
    { icon: Trophy, text: "Vote on themes/logos" },
    { icon: Users, text: "Suggest global judges" },
    { icon: Heart, text: "Propose communities to partner with" },
    { icon: Target, text: "Build new hackathon verticals" },
    { icon: Gift, text: "Experiment with crazy new ideas" }
  ];

  return (
    <section className="bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-press-start text-2xl md:text-4xl text-maximally-yellow mb-4">
            WHAT IS THE ADVISOR CIRCLE?
          </h2>
          <p className="font-jetbrains text-gray-300 text-lg max-w-3xl mx-auto">
            When you become a supporter, you're not just donating — you become an advisor helping shape the future.
          </p>
        </div>
        
        <div className="pixel-card bg-black/80 border-2 border-maximally-yellow p-8 md:p-12">
          <p className="font-jetbrains text-gray-300 text-lg mb-8 text-center">
            <span className="text-maximally-yellow font-bold">Advisor Circle members</span> help us:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {advisorRoles.map((role, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-black/50 border border-maximally-yellow/30 p-4">
                <role.icon className="h-6 w-6 text-maximally-yellow flex-shrink-0" />
                <span className="font-jetbrains text-gray-300">{role.text}</span>
              </div>
            ))}
          </div>
          
          <p className="font-jetbrains text-gray-400 text-center mt-8 italic">
            Your supporter tier isn't just symbolic — it makes you useful in shaping hacker culture.
          </p>
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
      iconColor: "text-maximally-yellow",
      priceColor: "text-maximally-yellow",
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
      iconColor: "text-maximally-red",
      priceColor: "text-maximally-red",
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
      iconColor: "text-blue-500",
      priceColor: "text-blue-500",
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
                <Building2 className={`h-8 w-8 ${pkg.iconColor}`} />
              </div>
              
              <h3 className="font-press-start text-xl text-white mb-2">
                {pkg.name}
              </h3>
              
              <p className={`font-press-start text-3xl ${pkg.priceColor} mb-6`}>
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
        
        <Card className="bg-black border-2 border-green-500 p-8 mt-8 hover-elevate" data-testid="card-talk-to-us">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-press-start text-xl text-green-500 mb-3">
                WANT A CALL BEFORE SPONSORING?
              </h3>
              <p className="font-jetbrains text-gray-300 text-lg">
                Some people want to ask questions before paying $1500+. We get it.
              </p>
            </div>
            <a href="mailto:hello@maximally.in">
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white font-press-start whitespace-nowrap"
                data-testid="button-talk-to-us"
              >
                EMAIL US FIRST
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

const TrustAndSafety = () => {
  const faqs = [
    { q: "Is payment secure?", a: "Yes, all payments are processed through BuyMeACoffee's secure platform." },
    { q: "Is this a donation?", a: "No — you're supporting an ecosystem + receiving tangible benefits and advisor privileges." },
    { q: "Is it refundable?", a: "No, but perks are delivered instantly upon payment." },
    { q: "Will I get a certificate?", a: "Yes, digital certificate + verifiable supporter badge." },
    { q: "Can I support anonymously?", a: "Yes, you can choose to remain anonymous." }
  ];

  return (
    <section className="bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="font-press-start text-2xl md:text-4xl text-green-500 mb-4">
            TRUST + SAFETY
          </h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Card key={idx} className="bg-black border-2 border-green-500/30 p-6 hover-elevate" data-testid={`faq-${idx}`}>
              <h3 className="font-press-start text-lg text-green-500 mb-2">
                {faq.q}
              </h3>
              <p className="font-jetbrains text-gray-300">
                {faq.a}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const SupporterOnboarding = () => {
  const steps = [
    { icon: Mail, text: "You get an email confirmation" },
    { icon: Users, text: "You get community access to private supporter channels" },
    { icon: Trophy, text: "Your name goes on the Maximally Supporter Wall" },
    { icon: Gift, text: "You get an advisor welcome packet" },
    { icon: CheckCircle2, text: "You get all your tier perks activated" }
  ];

  return (
    <section className="bg-black text-white py-20 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(229,9,20,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-press-start text-2xl md:text-4xl text-maximally-yellow mb-4">
            WHAT HAPPENS AFTER YOU SUPPORT?
          </h2>
          <p className="font-jetbrains text-gray-300 text-lg">
            Your onboarding is instant. Here's what you get immediately:
          </p>
        </div>
        
        <div className="pixel-card bg-black/80 border-2 border-maximally-yellow p-8 md:p-12">
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="minecraft-block bg-maximally-yellow p-2 flex-shrink-0">
                  <step.icon className="h-6 w-6 text-black" />
                </div>
                <div className="flex-1">
                  <p className="font-jetbrains text-gray-300 text-lg">
                    {idx + 1}. {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <p className="font-jetbrains text-gray-400 text-center mt-8 italic">
            This builds assurance. You know exactly what to expect.
          </p>
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
        <FounderNote />
        <TheMovement />
        <WhatYouFunding />
        <div id="individual-supporters">
          <IndividualTiers />
        </div>
        <AdvisorCircle />
        <div id="sponsor-packages">
          <SponsorPackages />
        </div>
        <NonMonetarySupport />
        <TrustAndSafety />
        <SupporterOnboarding />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
