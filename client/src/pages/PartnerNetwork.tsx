import {
  ArrowRight,
  Users,
  Target,
  Zap,
  Award,
  Rocket,
  Shield,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  Globe,
  BarChart3,
  Megaphone,
  Code,
  Lightbulb,
  Building2,
  GraduationCap,
  Cpu,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import partnersData from '@/data/partners.json';

const PartnerNetwork = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = [
    { value: '15,000+', label: 'Builders Reached' },
    { value: '250+', label: 'Hackathons Advised' },
    { value: '11+', label: 'Hackathons Organized' },
    { value: '500+', label: 'Projects Built' },
  ];

  const hackathonTypes = [
    {
      title: 'In-Person Hackathons',
      description: 'End-to-end planning and execution of on-site hackathons at universities, coworking spaces, and corporate venues across India.',
      stat: '8+',
      statLabel: 'cities covered',
    },
    {
      title: 'Virtual Hackathons',
      description: 'Fully online hackathons with custom platforms, Discord servers, live streams, and global participation — no venue needed.',
      stat: '10,000+',
      statLabel: 'online participants',
    },
    {
      title: 'Hybrid Events',
      description: 'The best of both worlds. Physical hubs with virtual participation, unified judging, and seamless builder experience.',
      stat: '500+',
      statLabel: 'projects shipped',
    },
  ];

  const services = [
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Program Design',
      description: 'Custom hackathon formats, theme development, track design, and challenge statements tailored to your goals.',
    },
    {
      icon: <Megaphone className="h-6 w-6" />,
      title: 'Marketing & Outreach',
      description: 'Builder recruitment through our 15,000+ community, social campaigns, and partner network amplification.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Event Management',
      description: 'End-to-end logistics, from registration and team formation to judging, awards, and post-event reporting.',
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: 'Hackathon Platform',
      description: 'Custom submission portals, judging dashboards, leaderboards, and participant management tools.',
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: 'Mentors & Judges',
      description: 'Access to our bench of industry experts from Google, Microsoft, AWS, Meta, and top startups.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Analytics & Reporting',
      description: 'Post-event analytics, participant surveys, project quality assessments, and ROI reporting for sponsors.',
    },
  ];

  const impactCategories = [
    {
      icon: <Lightbulb className="h-5 w-5" />,
      title: 'Accelerate Innovation',
      description: 'Generate fresh product ideas, prototypes, and MVPs in 24-48 hours.',
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Build Talent Pipeline',
      description: 'Identify and recruit top builders before your competitors do.',
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      title: 'Brand Visibility',
      description: 'Position your brand at the center of the builder ecosystem.',
    },
    {
      icon: <Cpu className="h-5 w-5" />,
      title: 'Product Adoption',
      description: 'Get builders to build on your platform, API, or developer tools.',
    },
  ];

  const processSteps = [
    { step: '1', title: 'Discovery Call', description: 'We understand your goals, audience, timeline, and budget to design the right hackathon format.' },
    { step: '2', title: 'Program Design', description: 'Our team creates a custom hackathon blueprint — themes, tracks, judging criteria, and marketing plan.' },
    { step: '3', title: 'Build & Launch', description: 'We handle registration, outreach, platform setup, and community building. You focus on your brand.' },
    { step: '4', title: 'Execute & Deliver', description: 'Live event management, mentorship, judging, and awards. Full analytics and reporting post-event.' },
  ];

  const faqs = [
    {
      q: 'What types of organizations partner with Maximally?',
      a: 'We work with tech companies, startups, universities, developer tool companies, VCs, and community organizations. Anyone looking to engage builders through hackathons.',
    },
    {
      q: 'How long does it take to plan a hackathon?',
      a: 'Typical timeline is 4-8 weeks for a full hackathon. For smaller events or if you already have infrastructure, we can move faster. Virtual hackathons can be set up in as little as 2-3 weeks.',
    },
    {
      q: 'What does a typical partnership look like?',
      a: 'It depends on your goals. Some partners want full-service hackathon production, others want community access and co-branding. We offer flexible tiers from visibility partnerships to full co-organization.',
    },
    {
      q: 'How much does it cost to partner?',
      a: 'Partnership costs vary based on scope, format, and services needed. We work with budgets ranging from community-level events to enterprise-scale programs. Get in touch for a custom quote.',
    },
    {
      q: 'Can you run hackathons outside India?',
      a: 'Yes. We have run virtual hackathons with global participation and can support in-person events in multiple countries through our partner network.',
    },
    {
      q: 'What makes Maximally different from other hackathon organizers?',
      a: 'We are builder-first. Our community is curated, our events produce real projects (not just demos), and we provide end-to-end support from design to post-event analytics. We focus on quality over quantity.',
    },
  ];

  return (
    <>
      <SEO
        title="Partner With Maximally — Builder Event Infrastructure"
        description="Run your best builder event with Maximally infrastructure. Full-service event design, execution, and community access for companies and organizations."
        keywords="partner with Maximally, hackathon partner, builder events, event infrastructure, corporate hackathon"
        keywords="hackathon partnership, hackathon organizer, hackathon agency, developer engagement, hackathon services"
      />

      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="pt-28 sm:pt-36 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-950/20 via-transparent to-gray-950/20" />
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-[200px]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <p className="font-space text-sm text-orange-400 tracking-wider mb-6 font-semibold">
                HACKATHON SERVICES
              </p>

              <h1 className="font-space font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-8 leading-[1.1]">
                <span className="text-white">Run Your Best</span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  Hackathon Yet
                </span>
              </h1>

              <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-space leading-relaxed mb-10">
                Full-service hackathon design, execution, and community access. 
                From concept to post-event analytics — we handle everything.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <a
                  href="https://cal.com/maximally"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space font-semibold text-sm transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#services"
                  className="flex items-center justify-center gap-3 px-8 py-4 border border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-space font-semibold text-sm transition-all duration-300"
                >
                  <span>Explore Services</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-50">
                {partnersData.partners.slice(0, 6).map((partner) => (
                  <div key={partner.id} className="grayscale" title={partner.name}>
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="h-6 sm:h-8 w-auto object-contain"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <span className="font-space text-xs text-gray-500">{partner.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hackathon Types */}
        <section className="py-20 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="font-space font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4">
                  Organize Any Hackathon Imaginable
                </h2>
                <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-space">
                  Whether in-person, virtual, or hybrid — we design and execute hackathons that produce real results.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {hackathonTypes.map((type, i) => (
                  <div
                    key={i}
                    className="bg-gray-950 border border-gray-800 hover:border-orange-500/50 p-8 transition-all duration-300 group"
                  >
                    <h3 className="font-space font-bold text-lg text-white mb-3 group-hover:text-orange-400 transition-colors">
                      {type.title}
                    </h3>
                    <p className="font-space text-sm text-gray-400 leading-relaxed mb-6">
                      {type.description}
                    </p>
                    <div className="border-t border-gray-800 pt-4">
                      <span className="font-space font-bold text-2xl text-orange-400">{type.stat}</span>
                      <span className="font-space text-xs text-gray-500 ml-2">{type.statLabel}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="font-space font-bold text-2xl sm:text-3xl text-white mb-1">{stat.value}</div>
                    <div className="font-space text-xs text-gray-500 tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Full-Service Section */}
        <section className="py-20 relative" id="services">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 via-transparent to-gray-950/50" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-14">
                <p className="font-space text-sm text-orange-400 tracking-wider mb-4 font-semibold">
                  WHAT WE DO
                </p>
                <h2 className="font-space font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4">
                  Full-Service Hackathon Agency
                </h2>
                <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-space">
                  We handle every aspect of your hackathon so you can focus on what matters — engaging with builders and driving outcomes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, i) => (
                  <div
                    key={i}
                    className="bg-gray-950 border border-gray-800 hover:border-orange-500/40 p-6 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                      {service.icon}
                    </div>
                    <h3 className="font-space font-bold text-base text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="font-space text-sm text-gray-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <a
                  href="https://cal.com/maximally"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white font-space font-semibold text-sm transition-all duration-300"
                >
                  <span>Explore Our Services</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Drive Impact */}
        <section className="py-20 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="font-space font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4">
                  Drive Impact with Hackathons
                </h2>
                <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-space">
                  Hackathons are not just events — they are strategic tools for innovation, recruitment, and community building.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {impactCategories.map((cat, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-6 bg-gray-950 border border-gray-800 hover:border-orange-500/30 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0 text-orange-400">
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="font-space font-bold text-base text-white mb-1">{cat.title}</h3>
                      <p className="font-space text-sm text-gray-400 leading-relaxed">{cat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 via-transparent to-gray-950/50" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-14">
                <p className="font-space text-sm text-orange-400 tracking-wider mb-4 font-semibold">
                  HOW IT WORKS
                </p>
                <h2 className="font-space font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4">
                  Our Hackathon Planning Process
                </h2>
              </div>

              <div className="space-y-0">
                {processSteps.map((step, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-orange-600 flex items-center justify-center flex-shrink-0">
                        <span className="font-space font-bold text-sm text-white">{step.step}</span>
                      </div>
                      {i < processSteps.length - 1 && (
                        <div className="w-px h-full bg-gray-800 group-hover:bg-orange-500/30 transition-colors min-h-[40px]" />
                      )}
                    </div>
                    <div className="pb-10">
                      <h3 className="font-space font-bold text-lg text-white mb-2">{step.title}</h3>
                      <p className="font-space text-sm text-gray-400 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-gray-950 border border-gray-800 p-10 sm:p-14">
                <div className="font-space text-3xl text-orange-400 mb-6">"</div>
                <p className="font-space text-lg sm:text-xl text-gray-200 leading-relaxed mb-8 italic">
                  Partnering with Maximally turned our hackathon into a global experience. 
                  From judges to marketing to post-event analytics — everything felt professional 
                  and well-executed. The quality of builders who participated was exceptional.
                </p>
                <div className="h-px w-16 bg-orange-500 mx-auto mb-4" />
                <p className="font-space text-sm text-gray-500">Hackathon Partner</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="font-space font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4">
                  FAQ
                </h2>
              </div>

              <div className="space-y-0">
                {faqs.map((faq, i) => (
                  <div key={i} className="border-b border-gray-800">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between py-5 text-left group"
                    >
                      <span className="font-space font-semibold text-sm sm:text-base text-white group-hover:text-orange-400 transition-colors pr-4">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                          openFaq === i ? 'rotate-180 text-orange-400' : ''
                        }`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="pb-5">
                        <p className="font-space text-sm text-gray-400 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-orange-950/10 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-space font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4">
                Run Your Best
                <br />
                <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  Hackathon Yet
                </span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg font-space mb-10 max-w-xl mx-auto">
                Whether you're a startup, enterprise, or university — let's build something extraordinary together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://cal.com/maximally"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-space font-semibold text-sm transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-3 px-8 py-4 border border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-space font-semibold text-sm transition-all duration-300"
                >
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default PartnerNetwork;
