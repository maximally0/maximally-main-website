import { ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const OpeningStatement = () => {
  return (
    <section className="min-h-[80vh] bg-black text-white relative flex items-center pt-32 sm:pt-40 pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.06)_0%,transparent_50%)]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <h1 className="font-space font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-white mb-8">
          The world's most serious<br />
          <span className="text-orange-400">builder ecosystem.</span>
        </h1>

        <p className="font-space text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl">
          The builder ecosystem globally is full of noise. Hackathons with thousands of participants
          and mediocre output. Communities that feel vibrant but produce nothing. Serious builders —
          the ones actually building things that matter — have nowhere to belong. Maximally is that place.
        </p>
      </div>
    </section>
  );
};

const Manifesto = () => {
  return (
    <section className="py-24 sm:py-32 bg-black relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <span className="font-space text-sm text-orange-400 tracking-widest font-medium mb-10 block">
          WHAT WE BELIEVE
        </span>

        <div className="space-y-8">
          <p className="font-space text-base sm:text-lg text-gray-300 leading-relaxed">
            Most platforms compete on size — the largest number of participants, the most events hosted,
            the widest reach. We are not competing on size. We are competing on signal. Every person in
            this ecosystem, every hackathon we run, every partnership we enter is filtered through a
            single question: is this serious?
          </p>

          <p className="font-space text-base sm:text-lg text-gray-300 leading-relaxed">
            That word — <span className="text-white font-semibold">serious</span> — is the entire brand.
            It defines who belongs, who doesn't, what we build, what we publish, and who we work with.
            It is not a marketing position. It is an operating principle. The moment we stop meaning it
            is the moment this stops working.
          </p>

          <p className="font-space text-base sm:text-lg text-gray-300 leading-relaxed">
            Hackathons deserve better. Builders deserve better. The people who actually ship things —
            who care about craft, who show up to solve real problems under real constraints — deserve
            infrastructure that takes them as seriously as they take their work. We are building that
            infrastructure.
          </p>
        </div>
      </div>
    </section>
  );
};

const ThreeLayers = () => {
  const layers = [
    {
      number: "01",
      name: "The Ecosystem",
      description: "A curated network of the world's most serious builders, hackathon organizers, and innovation operators. Entry is earned through demonstrated seriousness — execution track record, peer recognition, or extraordinary credentialing. The ecosystem is the product. Everything else is built on top of it.",
      audience: "For builders, organizers, and operators who have shipped real things."
    },
    {
      number: "02",
      name: "The Enterprise Access Layer",
      description: "Companies that want access to serious builders cannot find them on their own. Most hackathons attract participants chasing prizes. Maximally attracts builders chasing problems. We offer enterprise partners curated, high-signal access to this ecosystem through structured hackathons and innovation programs.",
      audience: "For devrel teams, innovation leads, growth teams, and talent functions."
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-black relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <span className="font-space text-sm text-orange-400 tracking-widest font-medium mb-16 block">
          WHAT MAXIMALLY IS
        </span>

        <div className="space-y-20">
          {layers.map((layer) => (
            <div key={layer.number} className="group">
              <div className="flex items-start gap-6 sm:gap-10">
                <span className="font-space font-bold text-4xl sm:text-5xl md:text-6xl text-gray-800 group-hover:text-orange-500/30 transition-colors duration-500 shrink-0 leading-none">
                  {layer.number}
                </span>
                <div>
                  <h3 className="font-space font-bold text-xl sm:text-2xl text-white mb-4">
                    {layer.name}
                  </h3>
                  <p className="font-space text-base text-gray-400 leading-relaxed mb-3">
                    {layer.description}
                  </p>
                  <p className="font-space text-sm text-orange-400/80">
                    {layer.audience}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TheBar = () => {
  return (
    <section className="py-24 sm:py-32 bg-black relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <span className="font-space text-sm text-orange-400 tracking-widest font-medium mb-10 block">
          THE BAR
        </span>

        <h2 className="font-space font-bold text-2xl sm:text-3xl text-white mb-6 max-w-2xl">
          Not everyone gets in. That's the point.
        </h2>

        <div className="space-y-6">
          <p className="font-space text-base text-gray-400 leading-relaxed max-w-3xl">
            The Senior Council is a directory of operators with documented extraordinary ability —
            people who have built at the highest level and now set the standard for what serious
            building looks like inside this ecosystem.
          </p>

          <p className="font-space text-base text-gray-400 leading-relaxed max-w-3xl">
            The Maximally Federation of Hackathon Organizers and Partners includes 100+ vetted
            organizers — not an open network, but a curated group that shares infrastructure,
            sponsors, and collective credibility. Being Maximally-affiliated means something to
            participants and sponsors because the bar is real.
          </p>
        </div>
      </div>
    </section>
  );
};

const Founder = () => {
  return (
    <section className="py-24 sm:py-32 bg-black relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <span className="font-space text-sm text-orange-400 tracking-widest font-medium mb-10 block">
          THE FOUNDER
        </span>

        <h3 className="font-space font-bold text-xl sm:text-2xl text-white mb-6">
          Rishul Chanana
        </h3>

        <div className="space-y-4">
          <p className="font-space text-base text-gray-400 leading-relaxed">
            Rishul built Maximally because he understood something most people in the ecosystem
            miss: the problem isn't a lack of hackathons. It's a lack of serious ones. He has
            personally operated and advised on 20+ hackathons, built the federation from zero to
            100+ organizers, and assembled a judge network of extraordinary operators who have
            built at the highest level.
          </p>

          <p className="font-space text-base text-gray-400 leading-relaxed">
            He leads with execution, not announcements. Every layer of Maximally — the ecosystem,
            the enterprise partnerships, the media — exists because he shipped it first and talked
            about it second. That operating principle is the reason the brand means what it means.
          </p>

          <a
            href="https://www.linkedin.com/in/rishul-chanana"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-space text-sm text-orange-400 hover:text-orange-300 transition-colors mt-2"
          >
            LinkedIn
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <>
      <SEO
        title="About Maximally | The World's Most Serious Builder Ecosystem"
        description="Maximally exists because serious builders deserve a serious place to belong. A curated ecosystem of extraordinary operators, not a platform competing on size — competing on signal."
        keywords="about maximally, builder ecosystem, serious builders, extraordinary operators, curated ecosystem, hackathon infrastructure"
        canonicalUrl="https://maximally.in/about"
      />

      <div className="min-h-screen bg-black text-white">
        <OpeningStatement />
        <Manifesto />
        <ThreeLayers />
        <TheBar />
        <Founder />
        <Footer />
      </div>
    </>
  );
};

export default About;
