import { Link } from 'react-router-dom';
import { ArrowRight, Award, Shield, Star, Crown, Flame, Users, Target, Globe, Zap, CheckCircle2, TrendingUp, Lock, Sparkles, MessageSquare, Calendar, AlertCircle, Gift, UserCheck, Clock } from 'lucide-react';
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
      whoThisIsFor: 'Early-career professionals, students with shipped projects, or first-time mentors',
      whatWeLookFor: [
        'At least one shipped project (app, hardware, open source, or startup)',
        'Basic technical or domain knowledge',
        'Willingness to learn and grow as a judge',
        'Ability to provide constructive feedback'
      ],
      typicalProfiles: [
        'Junior engineers with side projects',
        'College students who\'ve built real products',
        'Early mentors at university hackathons',
        'Product designers with shipped work'
      ],
      canJudge: 'Beginner and student tracks, early-stage prototype submissions'
    },
    {
      level: 'Level 2',
      title: 'Verified Judge',
      description: 'Experienced professionals with proven domain expertise and prior judging or mentoring experience.',
      color: 'blue',
      icon: <Shield className="h-8 w-8" />,
      whoThisIsFor: 'Mid-level professionals with proven track records and domain expertise',
      whatWeLookFor: [
        '3+ years of professional experience in tech, design, or entrepreneurship',
        'Track record of shipped products or significant contributions',
        'Prior judging or mentoring experience',
        'Strong understanding of innovation and product development'
      ],
      typicalProfiles: [
        'Software engineers at startups or tech companies',
        'Product managers with multiple launches',
        'Designers with portfolio work at known companies',
        'Founders who\'ve raised funding or achieved traction'
      ],
      canJudge: 'Standard hackathon tracks, intermediate-level competitions, domain-specific challenges'
    },
    {
      level: 'Level 3',
      title: 'Senior Judge',
      description: 'Established leaders with extensive professional or entrepreneurial backgrounds and consistent judging experience.',
      color: 'purple',
      icon: <Star className="h-8 w-8" />,
      whoThisIsFor: 'Senior professionals, successful founders, or established technical leaders',
      whatWeLookFor: [
        '7+ years of deep domain expertise',
        'Leadership roles or significant entrepreneurial success',
        'Proven ability to evaluate complex technical or business problems',
        'Track record of mentoring and developing talent',
        'Consistent, high-quality judging history on Maximally'
      ],
      typicalProfiles: [
        'Staff/Principal engineers at major tech companies',
        'Founders who\'ve successfully exited or scaled companies',
        'Senior product leaders at unicorns',
        'Respected researchers or academics with real-world impact'
      ],
      canJudge: 'Advanced tracks, specialized domains, multi-stage competitions, can lead judging panels'
    },
    {
      level: 'Level 4',
      title: 'Chief Judge',
      description: 'Highly credible industry or academic leaders who oversee judging panels and set quality standards.',
      color: 'yellow',
      icon: <Crown className="h-8 w-8" />,
      whoThisIsFor: 'Industry leaders, executives, and influential figures in innovation ecosystems',
      whatWeLookFor: [
        '10+ years of exceptional professional achievement',
        'Director, VP, CTO, or C-suite level leadership',
        'Recognized thought leadership in their domain',
        'Significant ecosystem contributions (talks, papers, open source)',
        'Exceptional judging track record and mentorship impact'
      ],
      typicalProfiles: [
        'Engineering Directors/VPs at FAANG or unicorns',
        'CTOs of well-funded startups',
        'Senior academics with industry partnerships',
        'Angel investors with portfolio successes',
        'Heads of innovation at major companies'
      ],
      canJudge: 'Can oversee entire events, design custom judging criteria, handle high-stakes finals, mentor other judges'
    },
    {
      level: 'Level 5',
      title: 'Legacy Judge',
      description: 'Distinguished figures recognized for exceptional contributions to innovation and mentorship over time.',
      color: 'red',
      icon: <Flame className="h-8 w-8" />,
      whoThisIsFor: 'Legendary figures with decades of impact and global recognition',
      whatWeLookFor: [
        '15+ years of transformational impact',
        'Global recognition and ecosystem-level influence',
        'Sustained contribution to innovation communities',
        'Exceptional mentorship legacy',
        'Invitation-only consideration'
      ],
      typicalProfiles: [
        'Founders of unicorn/decacorn companies',
        'Chief Scientists or Fellows at major tech companies',
        'Renowned academics who\'ve commercialized research',
        'Ecosystem builders who\'ve launched major programs',
        'Published authors and recognized thought leaders'
      ],
      canJudge: 'Global flagship events, represents Maximally at the highest level, permanent ambassador status'
    },
  ];

  const levelPerks = [
    {
      level: 'Level 1',
      perks: [
        'Judge beginner and student tracks',
        'Verified judge profile on Maximally',
        'Official judge certificate',
        'Access to judge community'
      ]
    },
    {
      level: 'Level 2',
      perks: [
        'Priority invitations to events',
        'Judge more complex tracks',
        'Featured in event newsletters',
        'Maximally Verified badge',
        'Early access to new competitions'
      ]
    },
    {
      level: 'Level 3',
      perks: [
        'Lead judging panels',
        'Help design challenge criteria',
        'Featured judge profile badges',
        'Invitation to exclusive judge events',
        'Advanced matching for domain expertise',
        'Opportunity to mentor junior judges'
      ]
    },
    {
      level: 'Level 4',
      perks: [
        'Oversee judging at major events',
        'Speaking opportunities at Maximally events',
        'Access to partner programs and investor networks',
        'Chief Judge badge and recognition',
        'Custom profile spotlight',
        'Direct input on platform development'
      ]
    },
    {
      level: 'Level 5',
      perks: [
        'Global Maximally ambassador status',
        'Permanent legacy profile page',
        'Guaranteed spotlight at flagship events',
        'Keynote speaking opportunities',
        'Advisory role in ecosystem growth',
        'Reserved for legends — immortalized in the platform'
      ]
    }
  ];

  const faqs = [
    {
      question: 'Can students become judges?',
      answer: 'Yes! Students who have shipped real projects can start at Level 1. We value builders over credentials — if you\'ve created something meaningful, you can judge at the appropriate level.'
    },
    {
      question: 'How do I get promoted to higher levels?',
      answer: 'Promotions are based on judging credits, feedback quality, reliability, and ecosystem contributions. We review levels after every Maximally Season. Show up, deliver great feedback, and your level will rise.'
    },
    {
      question: 'What is the time commitment?',
      answer: 'It varies by event. Most hackathons require 2-4 hours for reviewing submissions and providing feedback. You can always decline invitations if you\'re unavailable. We value quality over quantity.'
    },
    {
      question: 'Do judges get compensated?',
      answer: 'Compensation varies by event. Some events offer honorariums, others offer equity, access, or networking opportunities. We always communicate this upfront before you commit.'
    },
    {
      question: 'Can I skip levels?',
      answer: 'Yes! If your profile demonstrates exceptional credibility, we place you directly at the level you deserve. Directors, CTOs, and senior professionals often start at Level 3 or 4. Legacy Level is invitation-only.'
    },
    {
      question: 'Can I lose my judge status?',
      answer: 'Yes. Judges who repeatedly ghost events, provide low-quality feedback, or violate our code of conduct will be removed. We maintain high standards to protect both builders and the ecosystem.'
    },
    {
      question: 'How exclusive is the Maximally Judge network?',
      answer: 'We accept less than 15% of judge applications. We\'re building the top 0.1% of innovation evaluators globally. Quality over quantity, always.'
    },
    {
      question: 'What happens if I can\'t judge an event I committed to?',
      answer: 'Life happens. Just communicate with us as early as possible. Reliability is key, but we understand emergencies. Repeated ghosting, however, will impact your standing.'
    }
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

              {/* SECTION 1: The Judge Level Framework (Overview) */}
              <section className="mb-20">
                <h2 className="font-press-start text-2xl md:text-3xl text-center text-cyan-400 mb-6" data-testid="heading-level-system">
                  THE JUDGE LEVEL SYSTEM
                </h2>
                <div className="minecraft-block bg-gray-900/50 border-2 border-cyan-400 p-8 mb-12">
                  <p className="font-jetbrains text-gray-300 text-lg leading-relaxed mb-4">
                    Maximally uses a <span className="text-cyan-400 font-bold">5-level judging framework</span> — the world's first standardized hierarchy for innovation evaluation.
                  </p>
                  <p className="font-jetbrains text-gray-300 text-lg leading-relaxed mb-4">
                    Your level reflects your expertise, experience, and contribution to the ecosystem.
                  </p>
                  <p className="font-jetbrains text-gray-300 text-lg leading-relaxed">
                    Everyone starts at a home level, and can <span className="text-maximally-yellow font-bold">rise through the ranks over time.</span>
                  </p>
                </div>
                
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

              {/* SECTION 2: Criteria For Each Level */}
              <section className="mb-20">
                <h2 className="font-press-start text-2xl md:text-3xl text-center text-maximally-red mb-12" data-testid="heading-level-criteria">
                  JUDGE LEVEL CRITERIA
                </h2>
                <div className="space-y-8">
                  {tierLevels.map((tier, index) => (
                    <div
                      key={index}
                      className={`minecraft-block bg-gray-900/50 border-2 border-${tier.color}-400 p-8`}
                      data-testid={`criteria-${tier.level.toLowerCase().replace(' ', '-')}`}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`text-${tier.color}-400`}>
                          {tier.icon}
                        </div>
                        <div>
                          <span className={`font-press-start text-xs text-${tier.color}-400 block mb-1`}>{tier.level}</span>
                          <h3 className="font-press-start text-xl text-white">{tier.title}</h3>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-press-start text-sm text-cyan-400 mb-3">WHO THIS IS FOR</h4>
                          <p className="font-jetbrains text-gray-300 leading-relaxed">{tier.whoThisIsFor}</p>
                        </div>

                        <div>
                          <h4 className="font-press-start text-sm text-cyan-400 mb-3">WHAT WE LOOK FOR</h4>
                          <ul className="space-y-2">
                            {tier.whatWeLookFor.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-1" />
                                <span className="font-jetbrains text-gray-300">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-press-start text-sm text-cyan-400 mb-3">TYPICAL PROFILE EXAMPLES</h4>
                          <ul className="space-y-2">
                            {tier.typicalProfiles.map((profile, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Star className={`h-4 w-4 text-${tier.color}-400 flex-shrink-0 mt-1`} />
                                <span className="font-jetbrains text-gray-300">{profile}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4 border-t border-gray-700">
                          <h4 className="font-press-start text-sm text-maximally-yellow mb-2">WHAT THEY CAN JUDGE</h4>
                          <p className="font-jetbrains text-gray-300">{tier.canJudge}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 3: How Judges Grow Inside Maximally */}
              <section className="mb-20">
                <h2 className="font-press-start text-2xl md:text-3xl text-center text-cyan-400 mb-12" data-testid="heading-progression">
                  HOW YOU GROW AS A MAXIMALLY JUDGE
                </h2>

                <div className="minecraft-block bg-gray-900/50 border-2 border-cyan-400 p-8 mb-8">
                  <h3 className="font-press-start text-xl text-cyan-400 mb-6 flex items-center gap-3">
                    <TrendingUp className="h-6 w-6" />
                    PROGRESSION FACTORS
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Award className="h-6 w-6 text-maximally-yellow flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-2">Judging Credits</h4>
                        <p className="font-jetbrains text-gray-300 text-sm">Number of events judged and submissions evaluated</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-6 w-6 text-maximally-yellow flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-2">Feedback Quality Score</h4>
                        <p className="font-jetbrains text-gray-300 text-sm">Depth, specificity, and helpfulness of your evaluations</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-6 w-6 text-maximally-yellow flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-2">Reliability Score</h4>
                        <p className="font-jetbrains text-gray-300 text-sm">Consistency in showing up and meeting deadlines</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-6 w-6 text-maximally-yellow flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-2">Community Contribution</h4>
                        <p className="font-jetbrains text-gray-300 text-sm">Mentorship, ecosystem building, and platform advocacy</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-yellow p-8 mb-8">
                  <h3 className="font-press-start text-xl text-maximally-yellow mb-6 flex items-center gap-3">
                    <ArrowRight className="h-6 w-6" />
                    PROMOTION WINDOWS
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="font-press-start text-sm text-green-400 min-w-[100px]">L1 → L2</span>
                      <p className="font-jetbrains text-gray-300">After judging 1-2 events + strong feedback scores</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-press-start text-sm text-blue-400 min-w-[100px]">L2 → L3</span>
                      <p className="font-jetbrains text-gray-300">After multiple events + proven domain depth and reliability</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-press-start text-sm text-purple-400 min-w-[100px]">L3 → L4</span>
                      <p className="font-jetbrains text-gray-300">After leading panels + significant ecosystem impact</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-press-start text-sm text-red-400 min-w-[100px]">L4 → L5</span>
                      <p className="font-jetbrains text-gray-300">Rare, long-term, exceptional individuals with global impact</p>
                    </div>
                  </div>
                </div>

                <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-red p-8">
                  <h3 className="font-press-start text-xl text-maximally-red mb-4 flex items-center gap-3">
                    <Calendar className="h-6 w-6" />
                    REVIEW CYCLE
                  </h3>
                  <p className="font-jetbrains text-gray-300 text-lg leading-relaxed">
                    We review judge levels <span className="text-cyan-400 font-bold">after every Maximally Season.</span> Tiers are upgraded based on contribution, performance, and leadership. Your journey is tracked, and excellence is rewarded.
                  </p>
                </div>
              </section>

              {/* SECTION 4: Fast-Track & Direct Placement */}
              <section className="mb-20">
                <h2 className="font-press-start text-2xl md:text-3xl text-center text-maximally-yellow mb-12" data-testid="heading-fast-track">
                  FAST-TRACK PLACEMENT
                </h2>
                
                <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-yellow p-8 mb-6">
                  <p className="font-jetbrains text-gray-300 text-lg leading-relaxed mb-8 text-center">
                    <span className="text-white font-bold">If your profile demonstrates exceptional credibility, we place you directly into the level you deserve</span> — no need to climb from Level 1.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Sparkles className="h-8 w-8 text-purple-400 flex-shrink-0" />
                      <div>
                        <h3 className="font-press-start text-sm text-purple-400 mb-3">FAST-TRACK TO LEVEL 3</h3>
                        <p className="font-jetbrains text-gray-300 mb-2">Staff engineers, successful founders, seasoned mentors with proven track records</p>
                        <ul className="space-y-1 ml-4">
                          <li className="font-jetbrains text-gray-400 text-sm">• 5+ years senior-level experience</li>
                          <li className="font-jetbrains text-gray-400 text-sm">• Multiple shipped products or significant projects</li>
                          <li className="font-jetbrains text-gray-400 text-sm">• Clear domain expertise</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Crown className="h-8 w-8 text-yellow-400 flex-shrink-0" />
                      <div>
                        <h3 className="font-press-start text-sm text-yellow-400 mb-3">FAST-TRACK TO LEVEL 4</h3>
                        <p className="font-jetbrains text-gray-300 mb-2">Directors, VPs, CTOs, senior academics, established ecosystem leaders</p>
                        <ul className="space-y-1 ml-4">
                          <li className="font-jetbrains text-gray-400 text-sm">• C-suite or director-level roles</li>
                          <li className="font-jetbrains text-gray-400 text-sm">• Published research or thought leadership</li>
                          <li className="font-jetbrains text-gray-400 text-sm">• Recognized industry contributions</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Flame className="h-8 w-8 text-red-400 flex-shrink-0" />
                      <div>
                        <h3 className="font-press-start text-sm text-red-400 mb-3">DIRECT LEGACY LEVEL</h3>
                        <p className="font-jetbrains text-gray-300 mb-2">Exceptional global figures with extraordinary ecosystem impact</p>
                        <ul className="space-y-1 ml-4">
                          <li className="font-jetbrains text-gray-400 text-sm">• Invitation-only or special evaluation</li>
                          <li className="font-jetbrains text-gray-400 text-sm">• Global recognition and influence</li>
                          <li className="font-jetbrains text-gray-400 text-sm">• Transformational contributions to innovation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 5: What We Expect From Every Maximally Judge */}
              <section className="mb-20">
                <h2 className="font-press-start text-2xl md:text-3xl text-center text-maximally-red mb-12" data-testid="heading-responsibilities">
                  WHAT WE EXPECT FROM EVERY MAXIMALLY JUDGE
                </h2>
                
                <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-red p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
                      <p className="font-jetbrains text-gray-300">Show up on time for committed events</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
                      <p className="font-jetbrains text-gray-300">Score all assigned submissions thoroughly</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
                      <p className="font-jetbrains text-gray-300">Give specific, helpful, actionable feedback</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
                      <p className="font-jetbrains text-gray-300">Keep judging unbiased and objective</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
                      <p className="font-jetbrains text-gray-300">Maintain no conflicts of interest</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
                      <p className="font-jetbrains text-gray-300">Treat student & youth founders with respect</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
                      <p className="font-jetbrains text-gray-300">Communicate early if unavailable</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
                      <p className="font-jetbrains text-gray-300">Protect confidentiality where required</p>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <p className="font-jetbrains text-cyan-400 text-center italic">
                      These standards help reduce ghosting, ensure quality, and protect the experience for builders worldwide.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 6: What You Unlock As You Level Up */}
              <section className="mb-20">
                <h2 className="font-press-start text-2xl md:text-3xl text-center text-cyan-400 mb-12" data-testid="heading-perks">
                  WHAT YOU UNLOCK AS YOU LEVEL UP
                </h2>
                
                <div className="space-y-6">
                  {levelPerks.map((levelPerk, index) => {
                    const tier = tierLevels[index];
                    return (
                      <div
                        key={index}
                        className={`minecraft-block bg-gray-900/50 border-2 border-${tier.color}-400 p-6`}
                        data-testid={`perks-${tier.level.toLowerCase().replace(' ', '-')}`}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`text-${tier.color}-400`}>
                            {tier.icon}
                          </div>
                          <div>
                            <span className={`font-press-start text-xs text-${tier.color}-400 block mb-1`}>{tier.level}</span>
                            <h3 className="font-press-start text-lg text-white">{tier.title}</h3>
                          </div>
                        </div>
                        <ul className="space-y-2">
                          {levelPerk.perks.map((perk, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Gift className={`h-4 w-4 text-${tier.color}-400 flex-shrink-0 mt-1`} />
                              <span className="font-jetbrains text-gray-300">{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* SECTION 7: Your Maximally Judge Profile */}
              <section className="mb-20">
                <h2 className="font-press-start text-2xl md:text-3xl text-center text-maximally-yellow mb-12" data-testid="heading-profile">
                  YOUR JUDGE PROFILE
                </h2>
                
                <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-yellow p-8">
                  <p className="font-jetbrains text-gray-300 text-lg leading-relaxed mb-6">
                    Every judge gets a <span className="text-cyan-400 font-bold">public profile</span> that showcases your expertise, credibility, and contributions to the innovation ecosystem.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-1">Judge Level & Badge</h4>
                        <p className="font-jetbrains text-gray-400 text-sm">Your verified rank in the ecosystem</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Target className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-1">Domain Expertise</h4>
                        <p className="font-jetbrains text-gray-400 text-sm">AI, product, fintech, design, hardware...</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-1">Events Judged</h4>
                        <p className="font-jetbrains text-gray-400 text-sm">Complete history of competitions evaluated</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-1">Judging Credits</h4>
                        <p className="font-jetbrains text-gray-400 text-sm">Quantified track record of contributions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-1">Badges & Seasons</h4>
                        <p className="font-jetbrains text-gray-400 text-sm">Special recognition and achievements</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-1">Mentorship Impact</h4>
                        <p className="font-jetbrains text-gray-400 text-sm">Teams coached and builders helped</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-700 text-center">
                    <p className="font-jetbrains text-xl text-white font-bold mb-2">
                      Your judge identity becomes a permanent, portable part of your professional story.
                    </p>
                    <p className="font-jetbrains text-gray-400">
                      Like IMDB credits for film or LinkedIn endorsements — but for innovation evaluation.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 8: How We Select Judges */}
              <section className="mb-20">
                <h2 className="font-press-start text-2xl md:text-3xl text-center text-maximally-red mb-12" data-testid="heading-selection">
                  HOW WE SELECT JUDGES
                </h2>
                
                <div className="minecraft-block bg-gray-900/50 border-2 border-maximally-red p-8">
                  <p className="font-jetbrains text-gray-300 text-lg leading-relaxed mb-8 text-center">
                    We maintain the highest standards to ensure only the top 0.1% of evaluators join the network.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-start gap-3">
                      <UserCheck className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-1">Professional Background</h4>
                        <p className="font-jetbrains text-gray-400 text-sm">Verified experience and credentials</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-1">Past Projects / Products Shipped</h4>
                        <p className="font-jetbrains text-gray-400 text-sm">Real-world creation and execution</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-1">Judging Experience</h4>
                        <p className="font-jetbrains text-gray-400 text-sm">Prior evaluation or mentorship history</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-1">Domain Depth</h4>
                        <p className="font-jetbrains text-gray-400 text-sm">Expertise in specific technical or business areas</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-1">Ability to Mentor</h4>
                        <p className="font-jetbrains text-gray-400 text-sm">Clear communication and teaching skills</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-1">Credibility & Track Record</h4>
                        <p className="font-jetbrains text-gray-400 text-sm">Reputation and verifiable achievements</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-1">Reliability Indicators</h4>
                        <p className="font-jetbrains text-gray-400 text-sm">Consistency and commitment signals</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-jetbrains font-bold text-white mb-1">Ecosystem Contributions</h4>
                        <p className="font-jetbrains text-gray-400 text-sm">Open source, talks, community building</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-6 border-t border-gray-700">
                    <p className="font-press-start text-2xl text-maximally-yellow mb-2">
                      WE ACCEPT LESS THAN 15% OF JUDGE APPLICATIONS
                    </p>
                    <p className="font-jetbrains text-gray-400">
                      Quality over quantity. Excellence over volume. Always.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 9: FAQ */}
              <section className="mb-20">
                <h2 className="font-press-start text-2xl md:text-3xl text-center text-cyan-400 mb-12" data-testid="heading-faq">
                  FREQUENTLY ASKED QUESTIONS
                </h2>
                
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="minecraft-block bg-gray-900/50 border-2 border-gray-700 hover:border-cyan-400 p-6 transition-all"
                      data-testid={`faq-${index}`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-press-start text-sm text-white mb-3">{faq.question}</h3>
                          <p className="font-jetbrains text-gray-300 leading-relaxed">{faq.answer}</p>
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
