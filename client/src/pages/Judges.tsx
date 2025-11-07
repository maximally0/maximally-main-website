import { Link } from 'react-router-dom';
import { ArrowRight, Award, Shield, Star, Crown, Flame, Users, Target, Globe, Zap, CheckCircle2 } from 'lucide-react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';

const Judges = () => {
  const tierLevels = [
    {
      level: 'Level 1',
      title: 'Starter Judge',
      description: 'Entry-level professionals or early mentors beginning their judging journey.',
      color: 'green',
      icon: <Award className="h-8 w-8" />,
    },
    {
      level: 'Level 2',
      title: 'Verified Judge',
      description: 'Experienced professionals with proven domain expertise and prior judging or mentoring experience.',
      color: 'blue',
      icon: <Shield className="h-8 w-8" />,
    },
    {
      level: 'Level 3',
      title: 'Senior Judge',
      description: 'Established leaders with extensive professional or entrepreneurial backgrounds and consistent judging experience.',
      color: 'purple',
      icon: <Star className="h-8 w-8" />,
    },
    {
      level: 'Level 4',
      title: 'Chief Judge',
      description: 'Highly credible industry or academic leaders who oversee judging panels and set quality standards.',
      color: 'yellow',
      icon: <Crown className="h-8 w-8" />,
    },
    {
      level: 'Level 5',
      title: 'Legacy Judge',
      description: 'Distinguished figures recognized for exceptional contributions to innovation and mentorship over time.',
      color: 'red',
      icon: <Flame className="h-8 w-8" />,
    },
  ];

  const beliefs = [
    {
      title: 'Judging should be earned',
      description: 'Not through titles, but through proof of creation. Only those who\'ve built something real can truly evaluate what\'s next.',
      icon: <Target className="h-6 w-6" />,
    },
    {
      title: 'Evaluation should be standardized',
      description: 'Every hackathon, competition, and innovation event should operate on clear, consistent, and transparent judging systems — not arbitrary opinion.',
      icon: <CheckCircle2 className="h-6 w-6" />,
    },
    {
      title: 'Mentorship should be visible',
      description: 'Great judges aren\'t just score-givers — they\'re mentors. Every judge deserves public recognition, a verified profile, and lasting credibility for shaping innovation.',
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: 'Access should be global',
      description: 'A builder in Chandigarh deserves feedback from a Senior Engineer at Bloomberg. A student team in Lagos deserves mentorship from a Meta researcher. Geography should never limit greatness.',
      icon: <Globe className="h-6 w-6" />,
    },
  ];

  return (
    <>
      <SEO
        title="Become a Maximally Judge | The Standard of Judgment in Innovation"
        description="Join the world's top 0.1% of innovators mentoring and evaluating the next generation of builders. Become a Maximally Judge — the global standard of innovation credibility."
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <main className="relative z-10 pt-24">
          <section className="container mx-auto px-4 py-20">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="font-press-start text-3xl md:text-5xl lg:text-6xl mb-6 text-cyan-400 leading-tight" data-testid="heading-judges-hero">
                  THE BUILDERS OF THE FUTURE<br />DESERVE JUDGES WHO'VE BUILT BEFORE
                </h1>
                <p className="font-jetbrains text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Join the world's top 0.1% of innovators mentoring and evaluating the next generation of builders.
                </p>
                <p className="font-jetbrains text-lg text-maximally-yellow mb-12">
                  Become a Maximally Judge — the global standard of innovation credibility.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                  <Link
                    to="/judges/apply"
                    className="pixel-button bg-maximally-yellow text-maximally-black group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-yellow h-14 px-8 font-press-start text-sm"
                    data-testid="button-apply-judge-main"
                  >
                    <Star className="h-5 w-5" />
                    <span>APPLY TO BECOME A JUDGE</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/people/judges"
                    className="pixel-button bg-cyan-600 text-white group flex items-center justify-center gap-2 hover:scale-105 transform transition-all hover:shadow-glow-purple h-14 px-8 font-press-start text-sm hover:bg-cyan-700"
                    data-testid="button-view-judges"
                  >
                    <Users className="h-5 w-5" />
                    <span>VIEW VERIFIED JUDGES</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <section className="mb-20">
                <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-red p-8 mb-8">
                  <h2 className="font-press-start text-2xl md:text-3xl text-maximally-red mb-6 flex items-center gap-3" data-testid="heading-problem">
                    <Zap className="h-8 w-8" />
                    THE PROBLEM
                  </h2>
                  <div className="font-jetbrains text-gray-300 space-y-4 text-lg leading-relaxed">
                    <p>Every hackathon claims to be the future.</p>
                    <p>But the people evaluating that future? Random. Rotating. Forgettable.</p>
                    <p>The judging process — the very thing that decides what ideas get celebrated and what builders get seen — has never had a standard.</p>
                    <p className="text-cyan-400 font-bold">It's opinion masquerading as evaluation. It's chaos without credibility.</p>
                    <p>Because you can't build the next generation of innovators… without the right generation of judges.</p>
                  </div>
                </div>

                <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-yellow p-8">
                  <h2 className="font-press-start text-2xl md:text-3xl text-maximally-yellow mb-6" data-testid="heading-vision">
                    THE VISION
                  </h2>
                  <div className="font-jetbrains text-gray-300 space-y-4 text-lg leading-relaxed">
                    <p className="text-xl font-bold text-white">Maximally Judges exists to standardize excellence in the innovation ecosystem.</p>
                    <p>We're building the world's first identity and credibility layer for hackathon and competition judges — a network of the top 0.1% of global builders, engineers, founders, and creatives who mentor, evaluate, and shape the world's next generation of innovators.</p>
                    <p className="text-cyan-400 italic">If Y Combinator created the standard for founders, Maximally will create the standard for judging innovation itself.</p>
                  </div>
                </div>
              </section>

              <section className="mb-20">
                <h2 className="font-press-start text-2xl md:text-3xl text-center text-cyan-400 mb-12" data-testid="heading-beliefs">
                  WHAT WE BELIEVE
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {beliefs.map((belief, index) => (
                    <div
                      key={index}
                      className="minecraft-block bg-gray-900/50 border-2 border-cyan-400 p-6 hover:border-maximally-yellow hover:shadow-glow-yellow transition-all"
                      data-testid={`card-belief-${index}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-cyan-400 flex-shrink-0 mt-1">
                          {belief.icon}
                        </div>
                        <div>
                          <h3 className="font-press-start text-sm text-white mb-3">{belief.title.toUpperCase()}</h3>
                          <p className="font-jetbrains text-gray-300 text-sm leading-relaxed">{belief.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-20">
                <h2 className="font-press-start text-2xl md:text-3xl text-center text-maximally-red mb-12" data-testid="heading-system">
                  THE SYSTEM
                </h2>
                <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-red p-8 mb-8">
                  <p className="font-jetbrains text-gray-300 text-lg leading-relaxed mb-6">
                    Becoming a Maximally Judge means being verified, recognized, and immortalized for your expertise.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
                      <p className="font-jetbrains text-gray-300">A <span className="text-cyan-400 font-bold">public profile</span> showcasing their expertise, background, and past events judged.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
                      <p className="font-jetbrains text-gray-300"><span className="text-cyan-400 font-bold">Judging credits</span> — a track record of credibility that travels with them.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
                      <p className="font-jetbrains text-gray-300">A <span className="text-cyan-400 font-bold">verified badge</span> signifying trust, excellence, and mentorship.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
                      <p className="font-jetbrains text-gray-300"><span className="text-cyan-400 font-bold">Invitations</span> to judge future events, mentor upcoming founders, and shape global competitions.</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="font-jetbrains text-xl text-gray-300 mb-4">
                    Every hackathon that uses Maximally Judges gains access to a vetted, global panel — instantly.
                  </p>
                  <p className="font-jetbrains text-2xl text-maximally-yellow font-bold">
                    Just excellence on demand.
                  </p>
                </div>
              </section>

              <section className="mb-20">
                <h2 className="font-press-start text-2xl md:text-3xl text-center text-cyan-400 mb-12" data-testid="heading-tiers">
                  THE JUDGE TIER FRAMEWORK
                </h2>
                <p className="font-jetbrains text-gray-300 text-center text-lg mb-12 max-w-3xl mx-auto">
                  A standardized hierarchy for innovation evaluation, ensuring credibility, transparency, and consistency across all judging panels.
                </p>
                <div className="space-y-6">
                  {tierLevels.map((tier, index) => (
                    <div
                      key={index}
                      className={`minecraft-block bg-gray-900/50 border-2 border-${tier.color}-400 p-6 hover:shadow-glow-${tier.color} transition-all`}
                      data-testid={`tier-${tier.level.toLowerCase().replace(' ', '-')}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`text-${tier.color}-400 flex-shrink-0`}>
                          {tier.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`font-press-start text-xs text-${tier.color}-400`}>{tier.level}</span>
                            <h3 className="font-press-start text-lg text-white">{tier.title}</h3>
                          </div>
                          <p className="font-jetbrains text-gray-300 leading-relaxed">{tier.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-20">
                <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-yellow p-8 text-center">
                  <h2 className="font-press-start text-2xl md:text-3xl text-maximally-yellow mb-6" data-testid="heading-standard">
                    THE STANDARD
                  </h2>
                  <div className="font-jetbrains text-gray-300 space-y-4 text-lg leading-relaxed max-w-3xl mx-auto">
                    <p className="text-xl text-white font-bold">"A Maximally Judge" will become the gold standard of credibility in innovation.</p>
                    <p>Like Chartered Accountants for finance, or IMDB Credits for film, this is the universal credential for those who evaluate innovation.</p>
                    <p className="text-cyan-400">It's how we create a consistent global standard across competitions, hackathons, and accelerators — a shared language of judgment and mentorship.</p>
                  </div>
                </div>
              </section>

              <section className="mb-20">
                <div className="minecraft-block bg-gray-900/50 border-2 border-cyan-400 p-8 text-center">
                  <h2 className="font-press-start text-2xl md:text-3xl text-cyan-400 mb-6" data-testid="heading-future">
                    THE FUTURE WE'RE BUILDING
                  </h2>
                  <div className="font-jetbrains text-gray-300 space-y-4 text-lg leading-relaxed max-w-3xl mx-auto">
                    <p>The next decade belongs to builders — but the builders will only thrive if the <span className="text-maximally-yellow font-bold">judging layer</span> evolves with them.</p>
                    <p>We're building that layer.</p>
                    <p>A global network of thinkers, doers, mentors, and rebels — who don't just observe innovation, they <span className="text-cyan-400 font-bold">understand</span> it.</p>
                    <p className="text-xl text-white font-bold">Because innovation deserves better judges.</p>
                    <p className="text-xl text-white font-bold">And the world deserves better innovators.</p>
                  </div>
                </div>
              </section>

              <section className="text-center mb-20">
                <div className="minecraft-block bg-gradient-to-br from-maximally-red to-maximally-yellow p-12">
                  <h2 className="font-press-start text-2xl md:text-3xl text-black mb-6" data-testid="heading-cta">
                    THE MOVEMENT STARTS NOW
                  </h2>
                  <div className="font-jetbrains text-black space-y-4 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                    <p className="font-bold">We're not collecting judges. We're curating a standard.</p>
                    <p>If you've built, shipped, failed, led, or created — if you believe that the next wave of human progress starts with better feedback, deeper mentorship, and credible evaluation — then this is your arena.</p>
                  </div>
                  <Link
                    to="/judges/apply"
                    className="pixel-button bg-black text-maximally-yellow group inline-flex items-center justify-center gap-3 hover:scale-105 transform transition-all h-16 px-10 font-press-start text-base hover:bg-gray-900"
                    data-testid="button-apply-judge-cta"
                  >
                    <Star className="h-6 w-6" />
                    <span>BECOME A MAXIMALLY JUDGE</span>
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <div className="mt-8">
                    <p className="font-press-start text-sm text-black">SHAPE THE FUTURE OF INNOVATION</p>
                    <p className="font-press-start text-sm text-black">SET THE STANDARD FOR EXCELLENCE</p>
                  </div>
                </div>
              </section>

              <section className="text-center">
                <p className="font-press-start text-xl text-cyan-400 mb-2">MAXIMALLY JUDGES</p>
                <p className="font-jetbrains text-2xl text-maximally-yellow italic">The World's Top 0.1% Mentoring the Next 1%.</p>
              </section>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Judges;
