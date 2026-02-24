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
  Globe,
  Sparkles
} from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-black text-white relative overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(249,115,22,0.04)_0%,transparent_50%)]" />
      
      <div className="absolute top-20 left-[10%] w-72 h-72 bg-orange-500/5 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-orange-500/3 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center py-20">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-500/30 mb-8">
          <Heart className="h-5 w-5 text-orange-400" />
          <span className="font-space font-bold text-xs text-orange-400">SUPPORT THE MOVEMENT</span>
        </div>
        
        <h1 className="font-space font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
          <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
            BECOME A SUPPORTER
          </span>
        </h1>
        
        <p className="font-space font-bold text-orange-400 text-base md:text-lg mb-8">
          HELP US HOST CRAZIER HACKATHONS
        </p>
        
        <p className="font-space text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed mb-10">
          Maximally is building the world's most powerful hackathon ecosystem. 
          Your support helps us bring hackathons to every corner of the world.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#tiers"
            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-500 text-white font-space font-bold text-xs py-4 px-8 transition-all duration-300 border border-orange-500/40 hover:scale-[1.02]"
          >
            VIEW SUPPORT TIERS
          </a>
          <a 
            href="#one-time"
            className="bg-gradient-to-r from-gray-900 to-gray-800 border border-orange-500/30 hover:border-orange-500 text-gray-300 hover:text-white font-space font-bold text-xs py-4 px-8 transition-all duration-300"
          >
            ONE-TIME DONATION
          </a>
        </div>
      </div>
    </section>
  );
};

const WhyThisExists = () => {
  return (
    <section className="bg-black text-white py-20 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-space font-bold text-2xl md:text-3xl bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-4">
            WHY THIS EXISTS
          </h2>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-orange-500/30 p-8 md:p-12">
          <p className="font-space text-gray-300 text-lg leading-relaxed mb-6">
            Hackathons changed our lives. They gave us skills, connections, and confidence that no classroom ever could. 
            But here's the problem: <span className="text-orange-400 font-bold">most hackathons are underfunded, poorly organized, or simply don't exist</span> in many parts of the world.
          </p>
          
          <p className="font-space text-gray-300 text-lg leading-relaxed mb-6">
            We're on a mission to change that. Maximally is building infrastructure, tools, and community to make 
            hackathons <span className="text-orange-400 font-bold">more accessible, more creative, and more impactful</span> than ever before.
          </p>
          
          <p className="font-space text-gray-300 text-lg leading-relaxed">
            Your support directly funds prize pools, venue costs, mentorship programs, and the technology that powers it all.
          </p>
        </div>
      </div>
    </section>
  );
};


const FounderNote = () => {
  return (
    <section className="bg-black text-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="font-space font-bold text-lg text-white">A NOTE FROM THE FOUNDER</h3>
              <p className="font-space text-orange-400 text-sm">Rishul Chanana</p>
            </div>
          </div>
          
          <blockquote className="font-space text-gray-300 text-lg leading-relaxed italic border-l-4 border-orange-500 pl-6">
            "I started Maximally because I believe hackathons are the most powerful way to learn, build, and connect. 
            Every dollar you contribute goes directly into making these experiences possible for more people. 
            We're not a big corporation — we're a small team with a big dream. Your support means everything."
          </blockquote>
        </div>
      </div>
    </section>
  );
};

const TheMovement = () => {
  const stats = [
    { number: "10+", label: "Hackathons Hosted", icon: <Trophy className="h-6 w-6" /> },
    { number: "1000+", label: "Participants", icon: <Users className="h-6 w-6" /> },
    { number: "50+", label: "Projects Built", icon: <Zap className="h-6 w-6" /> },
    { number: "5+", label: "Countries Reached", icon: <Globe className="h-6 w-6" /> }
  ];

  return (
    <section className="bg-black text-white py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08)_0%,transparent_50%)]" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-space font-bold text-2xl md:text-3xl bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-4">
            THE MOVEMENT SO FAR
          </h2>
          <p className="font-space text-gray-400 text-lg">
            What we've built together
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-gray-800 p-6 text-center hover:border-orange-500/50 transition-all"
            >
              <div className="text-orange-400 mb-4 flex justify-center">{stat.icon}</div>
              <p className="font-space font-bold text-3xl text-white mb-2">{stat.number}</p>
              <p className="font-space text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhatYouFunding = () => {
  const breakdown = [
    { percentage: 40, label: "Prize Pools", gradient: "from-orange-600 to-orange-500", border: "border-orange-500/50", textColor: "text-orange-400" },
    { percentage: 20, label: "Infrastructure", gradient: "from-orange-600 to-orange-500", border: "border-gray-700", textColor: "text-gray-300" },
    { percentage: 15, label: "Branding", gradient: "from-orange-600 to-orange-500", border: "border-orange-500/40", textColor: "text-orange-400" },
    { percentage: 15, label: "Mentors", gradient: "from-amber-600/40 to-orange-600/30", border: "border-amber-500/50", textColor: "text-amber-400" },
    { percentage: 10, label: "Outreach", gradient: "from-green-600/40 to-emerald-600/30", border: "border-green-500/50", textColor: "text-green-400" }
  ];

  return (
    <section className="bg-black text-white py-20" id="funding">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-space font-bold text-2xl md:text-3xl bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-4">
            WHERE YOUR MONEY GOES
          </h2>
          <p className="font-space text-gray-400 text-lg">
            100% transparent breakdown
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          {breakdown.map((item, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${item.gradient} border ${item.border} p-6 text-center transition-all duration-300 hover:scale-[1.02]`}
            >
              <DollarSign className={`h-8 w-8 ${item.textColor} mx-auto mb-4`} />
              <p className={`font-space font-bold text-3xl ${item.textColor} mb-3`}>
                {item.percentage}%
              </p>
              <p className="font-space text-gray-400 text-sm">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const SupportTiers = () => {
  const tiers = [
    {
      name: "HACKER",
      amount: "$5/month",
      description: "For builders who want to support the movement",
      perks: [
        "Supporter badge on profile",
        "Access to supporter Discord",
        "Monthly updates from the team",
        "Early access to new features"
      ],
      gradient: "from-orange-600 to-orange-500",
      border: "border-orange-500/50",
      buttonGradient: "from-orange-600 to-orange-500",
      popular: false
    },
    {
      name: "BUILDER",
      amount: "$15/month",
      description: "For those who want to actively shape the future",
      perks: [
        "Everything in Hacker tier",
        "Quarterly video calls with founders",
        "Input on new hackathon formats",
        "Exclusive supporter swag",
        "Priority support"
      ],
      gradient: "from-amber-600/40 to-orange-600/30",
      border: "border-amber-500/50",
      buttonGradient: "from-amber-600 to-orange-600",
      popular: true
    },
    {
      name: "LEGEND",
      amount: "$50/month",
      description: "For hackathon legends who want maximum impact",
      perks: [
        "Everything in Builder tier",
        "Monthly 1-on-1 with founder",
        "Co-design hackathon themes",
        "Judge at Maximally events",
        "Your name on supporter wall",
        "Lifetime access to all events"
      ],
      gradient: "from-orange-600 to-orange-500",
      border: "border-gray-700",
      buttonGradient: "from-orange-600 to-orange-500",
      popular: false
    }
  ];

  return (
    <section className="bg-black text-white py-20 relative" id="tiers">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-space font-bold text-2xl md:text-3xl bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-4">
            SUPPORT TIERS
          </h2>
          <p className="font-space text-gray-400 text-lg">
            Choose your level of impact
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, idx) => (
            <div 
              key={idx}
              className={`bg-gradient-to-br ${tier.gradient} border ${tier.border} p-8 relative transition-all duration-300 hover:scale-[1.02] ${tier.popular ? 'ring-2 ring-amber-500/50' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-1">
                    <span className="font-space font-bold text-xs text-white">MOST POPULAR</span>
                  </div>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="font-space font-bold text-xl text-white mb-2">{tier.name}</h3>
                <p className="font-space font-bold text-2xl text-orange-400 mb-3">{tier.amount}</p>
                <p className="font-space text-gray-400 text-sm">{tier.description}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {tier.perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="font-space text-gray-300 text-sm">{perk}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full bg-gradient-to-r ${tier.buttonGradient} hover:opacity-90 text-white font-space font-bold text-xs py-3 px-6 transition-all duration-300 border border-white/20`}>
                BECOME A {tier.name}
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="font-space text-gray-500 text-sm">
            All tiers are monthly subscriptions. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

const OneTimeSupport = () => {
  const amounts = ["$10", "$25", "$50", "$100", "$250"];

  return (
    <section className="bg-black text-white py-20" id="one-time">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/40 p-8 md:p-12">
          <div className="text-center mb-8">
            <Gift className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h2 className="font-space font-bold text-xl md:text-2xl text-green-400 mb-4">
              ONE-TIME SUPPORT
            </h2>
            <p className="font-space text-gray-300 text-lg">
              Prefer a one-time contribution? Every dollar helps us build better hackathons.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {amounts.map((amount, idx) => (
              <button 
                key={idx}
                className="bg-gradient-to-r from-green-600/40 to-emerald-500/30 border border-green-500/50 hover:border-green-400 text-green-200 font-space font-bold text-sm py-3 px-4 transition-all duration-300 hover:scale-[1.02]"
              >
                {amount}
              </button>
            ))}
          </div>
          
          <div className="text-center">
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-space font-bold text-xs py-3 px-8 transition-all duration-300 border border-green-500/50">
              CUSTOM AMOUNT
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};


const CorporateSponsorship = () => {
  return (
    <section className="bg-black text-white py-20 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-orange-500/30 p-8 md:p-12 text-center">
          <Building2 className="h-12 w-12 text-orange-400 mx-auto mb-6" />
          
          <h2 className="font-space font-bold text-xl md:text-2xl bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-6">
            CORPORATE SPONSORSHIP
          </h2>
          
          <p className="font-space text-gray-300 text-lg leading-relaxed mb-8">
            Want to sponsor at a larger scale? We work with companies to create custom sponsorship packages 
            that align with your goals and budget.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/30 border border-gray-800 p-4">
              <Target className="h-8 w-8 text-orange-400 mx-auto mb-3" />
              <p className="font-space font-bold text-xs text-orange-400 mb-2">BRAND EXPOSURE</p>
              <p className="font-space text-gray-400 text-sm">Logo placement, branded challenges, speaking opportunities</p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 p-4">
              <Users className="h-8 w-8 text-orange-400 mx-auto mb-3" />
              <p className="font-space font-bold text-xs text-orange-400 mb-2">TALENT ACCESS</p>
              <p className="font-space text-gray-400 text-sm">Direct access to top builders and innovators</p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 p-4">
              <Sparkles className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="font-space font-bold text-xs text-gray-300 mb-2">CUSTOM EVENTS</p>
              <p className="font-space text-gray-400 text-sm">Co-branded hackathons and workshops</p>
            </div>
          </div>
          
          <a 
            href="mailto:partnerships@maximally.in"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-500 text-white font-space font-bold text-xs py-3 px-8 transition-all duration-300 border border-orange-500/40"
          >
            <Mail className="h-4 w-4" />
            <span>CONTACT FOR SPONSORSHIP</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "Where does the money actually go?",
      answer: "100% transparent: Prize pools (40%), Infrastructure & Tools (20%), Branding & Content (15%), Judges & Mentors (15%), Outreach & Partnerships (10%). We publish quarterly reports showing exactly how funds are used."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, absolutely. No contracts, no commitments. Cancel anytime through your supporter dashboard."
    },
    {
      question: "Do I get any tax benefits?",
      answer: "Maximally is currently structured as a for-profit entity, so contributions are not tax-deductible. However, we're exploring non-profit status for the future."
    },
    {
      question: "How do I know my support is making a difference?",
      answer: "Supporters get monthly updates with metrics, stories, and behind-the-scenes content showing exactly how their contributions are powering hackathons worldwide."
    },
    {
      question: "Can I support in other ways besides money?",
      answer: "Yes! We also need judges, mentors, content creators, and community builders. Reach out to us at support@maximally.in to explore non-financial ways to contribute."
    }
  ];

  return (
    <section className="bg-black text-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-space font-bold text-2xl md:text-3xl bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-4">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 p-6 hover:border-orange-500/50 transition-all"
            >
              <h3 className="font-space font-bold text-sm text-orange-400 mb-3">
                {faq.question}
              </h3>
              <p className="font-space text-gray-300 text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  return (
    <section className="bg-black text-white py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-orange-500/50 p-12">
          <Sparkles className="h-16 w-16 text-orange-400 mx-auto mb-6" />
          
          <h2 className="font-space font-bold text-2xl md:text-3xl bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-6">
            JOIN THE MOVEMENT
          </h2>
          
          <p className="font-space text-gray-300 text-lg leading-relaxed mb-8">
            Every supporter helps us build a world where hackathons are everywhere — 
            where anyone, anywhere can experience the magic of building something from nothing in 48 hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#tiers"
              className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-500 text-white font-space font-bold text-xs py-4 px-8 transition-all duration-300 border border-orange-500/40 hover:scale-[1.02]"
            >
              BECOME A SUPPORTER
            </a>
            
            <a 
              href="mailto:support@maximally.in"
              className="bg-gradient-to-r from-gray-900 to-gray-800 border border-orange-500/30 hover:border-orange-500 text-gray-300 hover:text-white font-space font-bold text-xs py-4 px-8 transition-all duration-300 inline-flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              <span>ASK QUESTIONS</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const BecomeASupporter = () => {
  return (
    <>
      <SEO
        title="Become a Supporter | Maximally"
        description="Support the world's most serious builder ecosystem. Help us build the infrastructure that serious builders and extraordinary operators deserve."
        keywords="support maximally, builder ecosystem, serious builders, hackathon ecosystem"
      />
      
      <div className="bg-black min-h-screen">
        <HeroSection />
        <WhyThisExists />
        <FounderNote />
        <TheMovement />
        <WhatYouFunding />
        <SupportTiers />
        <OneTimeSupport />
        <CorporateSponsorship />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
};

export default BecomeASupporter;
