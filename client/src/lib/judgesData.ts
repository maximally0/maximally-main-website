export type JudgeTier = 'starter' | 'verified' | 'senior' | 'chief' | 'legacy';

export type ExpertiseArea = 
  | 'AI' 
  | 'Product' 
  | 'Systems' 
  | 'Education' 
  | 'Design' 
  | 'Backend'
  | 'Frontend'
  | 'Mobile'
  | 'DevOps'
  | 'Security'
  | 'Blockchain'
  | 'Data Science'
  | 'Game Development'
  | 'Hardware'
  | 'IoT';

export interface JudgeEvent {
  eventName: string;
  role: string;
  date: string;
  link?: string;
  verified: boolean;
}

export interface Judge {
  id: string;
  username: string;
  
  // Public Profile
  fullName: string;
  profilePhoto: string;
  headline: string;
  shortBio: string;
  location: string;
  currentRole: string;
  company: string;
  
  // Expertise
  primaryExpertise: ExpertiseArea[];
  secondaryExpertise: ExpertiseArea[];
  
  // Stats
  totalEventsJudged: number;
  totalTeamsEvaluated: number;
  totalMentorshipHours: number;
  yearsOfExperience: number;
  averageFeedbackRating?: number;
  
  // Verification status for each stat
  verified: {
    eventsJudged: boolean;
    teamsEvaluated: boolean;
    mentorshipHours: boolean;
    feedbackRating: boolean;
  };
  
  // Event Portfolio
  topEventsJudged: JudgeEvent[];
  
  // Links
  linkedin: string;
  github?: string;
  twitter?: string;
  website?: string;
  
  // Additional Info
  languagesSpoken: string[];
  publicAchievements: string;
  mentorshipStatement: string;
  availabilityStatus: 'available' | 'not-available' | 'seasonal';
  
  // Tier & Status
  tier: JudgeTier;
  isPublished: boolean;
  joinedDate: string;
}

// Mock data - 10 diverse judges across all tiers
export const mockJudges: Judge[] = [
  {
    id: '1',
    username: 'sarah-chen',
    fullName: 'Dr. Sarah Chen',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    headline: 'Chief Judge · AI Systems · AWS',
    shortBio: 'AI Architect at AWS with 12+ years building ML systems. Mentored 500+ student innovators across 3 continents.',
    location: 'Singapore, Asia-Pacific',
    currentRole: 'Principal AI Architect',
    company: 'Amazon Web Services',
    primaryExpertise: ['AI', 'Systems', 'Education'],
    secondaryExpertise: ['Backend', 'Data Science'],
    totalEventsJudged: 47,
    totalTeamsEvaluated: 620,
    totalMentorshipHours: 184,
    yearsOfExperience: 12,
    averageFeedbackRating: 4.9,
    verified: {
      eventsJudged: true,
      teamsEvaluated: true,
      mentorshipHours: true,
      feedbackRating: true,
    },
    topEventsJudged: [
      {
        eventName: 'Maximally AI Shipathon 2025',
        role: 'Lead Judge',
        date: 'July 2025',
        link: '/events/ai-shipathon',
        verified: true,
      },
      {
        eventName: 'Global AI Challenge 2024',
        role: 'Chief Judge',
        date: 'Nov 2024',
        verified: true,
      },
      {
        eventName: 'TechNova Singapore',
        role: 'Senior Panelist',
        date: 'Aug 2024',
        verified: true,
      },
    ],
    linkedin: 'https://linkedin.com/in/sarahchen',
    github: 'https://github.com/sarahchen',
    twitter: 'https://twitter.com/sarahchen_ai',
    website: 'https://sarahchen.ai',
    languagesSpoken: ['English', 'Mandarin', 'French'],
    publicAchievements: 'IEEE Fellow, Speaker at Web Summit 2024, Published 15+ AI research papers',
    mentorshipStatement: 'I believe innovation needs better evaluation systems. Every builder deserves feedback that helps them grow, not just scores.',
    availabilityStatus: 'available',
    tier: 'chief',
    isPublished: true,
    joinedDate: '2023-01-15',
  },
  {
    id: '2',
    username: 'raj-patel',
    fullName: 'Raj Patel',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj',
    headline: 'Senior Judge · Product & Growth · Meta',
    shortBio: 'Product Manager at Meta, previously founded two startups. Passionate about helping teens build their first products.',
    location: 'San Francisco, USA',
    currentRole: 'Senior Product Manager',
    company: 'Meta',
    primaryExpertise: ['Product', 'AI', 'Design'],
    secondaryExpertise: ['Frontend', 'Mobile'],
    totalEventsJudged: 28,
    totalTeamsEvaluated: 340,
    totalMentorshipHours: 96,
    yearsOfExperience: 8,
    averageFeedbackRating: 4.7,
    verified: {
      eventsJudged: true,
      teamsEvaluated: false,
      mentorshipHours: true,
      feedbackRating: false,
    },
    topEventsJudged: [
      {
        eventName: 'Protocol 404 Hackathon',
        role: 'Track Lead - Product',
        date: 'Oct 2025',
        link: '/protocol-404',
        verified: true,
      },
      {
        eventName: 'YC Startup School Demo Day',
        role: 'Guest Judge',
        date: 'Sept 2024',
        verified: true,
      },
    ],
    linkedin: 'https://linkedin.com/in/rajpatel',
    twitter: 'https://twitter.com/raj_builds',
    languagesSpoken: ['English', 'Hindi', 'Gujarati'],
    publicAchievements: 'Founded 2 startups (1 acquired), Speaker at ProductCon',
    mentorshipStatement: 'Product thinking is a superpower. I love seeing students discover that they can solve real problems.',
    availabilityStatus: 'seasonal',
    tier: 'senior',
    isPublished: true,
    joinedDate: '2023-06-20',
  },
  {
    id: '3',
    username: 'emily-rodriguez',
    fullName: 'Emily Rodriguez',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    headline: 'Legacy Judge · Innovation Ecosystems · MIT',
    shortBio: 'Director of Innovation at MIT, 20+ years building innovation programs. Founded 3 global hackathon leagues.',
    location: 'Boston, USA',
    currentRole: 'Director of Innovation Programs',
    company: 'MIT Media Lab',
    primaryExpertise: ['Education', 'Product', 'Systems'],
    secondaryExpertise: ['AI', 'Design'],
    totalEventsJudged: 156,
    totalTeamsEvaluated: 2400,
    totalMentorshipHours: 580,
    yearsOfExperience: 22,
    averageFeedbackRating: 4.9,
    verified: {
      eventsJudged: true,
      teamsEvaluated: true,
      mentorshipHours: true,
      feedbackRating: true,
    },
    topEventsJudged: [
      {
        eventName: 'MIT Grand Hack 2025',
        role: 'Founding Judge',
        date: 'March 2025',
        verified: true,
      },
      {
        eventName: 'Global Innovators Summit',
        role: 'Chief Evaluation Officer',
        date: 'Dec 2024',
        verified: true,
      },
    ],
    linkedin: 'https://linkedin.com/in/emilyrodriguez',
    website: 'https://emilyrodriguez.com',
    languagesSpoken: ['English', 'Spanish'],
    publicAchievements: 'Founded 3 global hackathon leagues, TEDx speaker, Author of "Building Builders"',
    mentorshipStatement: 'Innovation ecosystems are built by people who care. My life\'s work is creating spaces where young builders can thrive.',
    availabilityStatus: 'available',
    tier: 'legacy',
    isPublished: true,
    joinedDate: '2022-08-10',
  },
  {
    id: '4',
    username: 'marcus-kim',
    fullName: 'Marcus Kim',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    headline: 'Verified Judge · Full-Stack Engineering · Stripe',
    shortBio: 'Senior engineer at Stripe, open-source contributor. Love judging hackathons focused on dev tools and infrastructure.',
    location: 'Seoul, South Korea',
    currentRole: 'Senior Software Engineer',
    company: 'Stripe',
    primaryExpertise: ['Backend', 'Frontend', 'DevOps'],
    secondaryExpertise: ['Systems', 'Security'],
    totalEventsJudged: 12,
    totalTeamsEvaluated: 145,
    totalMentorshipHours: 48,
    yearsOfExperience: 5,
    averageFeedbackRating: 4.6,
    verified: {
      eventsJudged: false,
      teamsEvaluated: false,
      mentorshipHours: false,
      feedbackRating: true,
    },
    topEventsJudged: [
      {
        eventName: 'DevTools Hackathon',
        role: 'Technical Judge',
        date: 'May 2025',
        verified: false,
      },
      {
        eventName: 'Hacktober 2024',
        role: 'Mentor Judge',
        date: 'Oct 2024',
        link: '/hacktober',
        verified: true,
      },
    ],
    linkedin: 'https://linkedin.com/in/marcuskim',
    github: 'https://github.com/mkim',
    languagesSpoken: ['English', 'Korean'],
    publicAchievements: 'Core contributor to 3 major OSS projects, Google Summer of Code mentor',
    mentorshipStatement: 'Code quality matters. I focus on helping students write maintainable, production-ready code.',
    availabilityStatus: 'available',
    tier: 'verified',
    isPublished: true,
    joinedDate: '2024-02-14',
  },
  {
    id: '5',
    username: 'priya-sharma',
    fullName: 'Priya Sharma',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    headline: 'Senior Judge · Design & UX · Figma',
    shortBio: 'Lead designer at Figma. Previously at Airbnb. Focused on making technology more accessible and beautiful.',
    location: 'Mumbai, India',
    currentRole: 'Lead Product Designer',
    company: 'Figma',
    primaryExpertise: ['Design', 'Product', 'Frontend'],
    secondaryExpertise: ['AI', 'Mobile'],
    totalEventsJudged: 34,
    totalTeamsEvaluated: 410,
    totalMentorshipHours: 127,
    yearsOfExperience: 9,
    averageFeedbackRating: 4.8,
    verified: {
      eventsJudged: true,
      teamsEvaluated: true,
      mentorshipHours: false,
      feedbackRating: true,
    },
    topEventsJudged: [
      {
        eventName: 'Design Innovation Summit',
        role: 'Lead Judge',
        date: 'June 2025',
        verified: true,
      },
      {
        eventName: 'Project CodeGen',
        role: 'Design Track Judge',
        date: 'Oct 2025',
        link: '/project-codegen',
        verified: true,
      },
    ],
    linkedin: 'https://linkedin.com/in/priyasharma',
    website: 'https://priyasharma.design',
    twitter: 'https://twitter.com/priya_designs',
    languagesSpoken: ['English', 'Hindi', 'Marathi'],
    publicAchievements: 'Dribbble Top Designer 2024, Speaker at Config 2024',
    mentorshipStatement: 'Design is not just how it looks. It\'s how it works, how it feels, and how it changes lives.',
    availabilityStatus: 'available',
    tier: 'senior',
    isPublished: true,
    joinedDate: '2023-09-05',
  },
  {
    id: '6',
    username: 'alex-johnson',
    fullName: 'Alex Johnson',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    headline: 'Starter Judge · Mobile Development · Emerging Mentor',
    shortBio: 'iOS developer and recent graduate. Competed in 15+ hackathons, now excited to give back as a judge.',
    location: 'Toronto, Canada',
    currentRole: 'Junior iOS Developer',
    company: 'Shopify',
    primaryExpertise: ['Mobile', 'Frontend'],
    secondaryExpertise: ['Design', 'Product'],
    totalEventsJudged: 3,
    totalTeamsEvaluated: 24,
    totalMentorshipHours: 12,
    yearsOfExperience: 2,
    verified: {
      eventsJudged: false,
      teamsEvaluated: false,
      mentorshipHours: false,
      feedbackRating: false,
    },
    topEventsJudged: [
      {
        eventName: 'University Hackathon 2025',
        role: 'Assistant Judge',
        date: 'Sept 2025',
        verified: false,
      },
    ],
    linkedin: 'https://linkedin.com/in/alexjohnson',
    github: 'https://github.com/ajohnson',
    languagesSpoken: ['English', 'French'],
    publicAchievements: 'Won 5 hackathons as participant, Published 2 iOS apps',
    mentorshipStatement: 'I was a hackathon participant just a year ago. I understand the nervousness and excitement of presenting your project.',
    availabilityStatus: 'available',
    tier: 'starter',
    isPublished: true,
    joinedDate: '2025-08-01',
  },
  {
    id: '7',
    username: 'david-okonkwo',
    fullName: 'Dr. David Okonkwo',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    headline: 'Chief Judge · Blockchain & Security · Google',
    shortBio: 'Security researcher at Google with PhD in Cryptography. Building the future of decentralized systems.',
    location: 'Lagos, Nigeria',
    currentRole: 'Staff Security Engineer',
    company: 'Google',
    primaryExpertise: ['Security', 'Blockchain', 'Systems'],
    secondaryExpertise: ['Backend', 'AI'],
    totalEventsJudged: 52,
    totalTeamsEvaluated: 780,
    totalMentorshipHours: 215,
    yearsOfExperience: 14,
    averageFeedbackRating: 4.8,
    verified: {
      eventsJudged: true,
      teamsEvaluated: true,
      mentorshipHours: true,
      feedbackRating: true,
    },
    topEventsJudged: [
      {
        eventName: 'Web3 Innovation Challenge',
        role: 'Chief Judge',
        date: 'July 2025',
        verified: true,
      },
      {
        eventName: 'Security Hackathon Africa',
        role: 'Lead Evaluator',
        date: 'April 2025',
        verified: true,
      },
    ],
    linkedin: 'https://linkedin.com/in/davidokonkwo',
    website: 'https://davidokonkwo.tech',
    languagesSpoken: ['English', 'Yoruba', 'Igbo'],
    publicAchievements: 'PhD in Cryptography, 20+ published security papers, ACM Distinguished Member',
    mentorshipStatement: 'Security and decentralization will define the next era of technology. I mentor builders who think deeply about trust.',
    availabilityStatus: 'seasonal',
    tier: 'chief',
    isPublished: true,
    joinedDate: '2023-03-12',
  },
  {
    id: '8',
    username: 'sofia-lopez',
    fullName: 'Sofia Lopez',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
    headline: 'Verified Judge · Game Development · Unity',
    shortBio: 'Game developer and educator. Making game development accessible to everyone through mentorship and workshops.',
    location: 'Barcelona, Spain',
    currentRole: 'Senior Game Developer',
    company: 'Unity Technologies',
    primaryExpertise: ['Game Development', 'Education', 'Frontend'],
    secondaryExpertise: ['Design', 'AI'],
    totalEventsJudged: 16,
    totalTeamsEvaluated: 192,
    totalMentorshipHours: 64,
    yearsOfExperience: 6,
    averageFeedbackRating: 4.7,
    verified: {
      eventsJudged: true,
      teamsEvaluated: false,
      mentorshipHours: true,
      feedbackRating: false,
    },
    topEventsJudged: [
      {
        eventName: 'Game Jam Global 2025',
        role: 'Technical Judge',
        date: 'Aug 2025',
        verified: true,
      },
      {
        eventName: 'Student Game Dev Challenge',
        role: 'Mentor & Judge',
        date: 'March 2025',
        verified: false,
      },
    ],
    linkedin: 'https://linkedin.com/in/sofialopez',
    twitter: 'https://twitter.com/sofia_games',
    website: 'https://sofialopez.games',
    languagesSpoken: ['Spanish', 'English', 'Catalan'],
    publicAchievements: 'Published 4 indie games, Unity Certified Instructor',
    mentorshipStatement: 'Games are the most creative form of software. I love helping students discover the joy of building interactive experiences.',
    availabilityStatus: 'available',
    tier: 'verified',
    isPublished: true,
    joinedDate: '2024-05-10',
  },
  {
    id: '9',
    username: 'james-wilson',
    fullName: 'James Wilson',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    headline: 'Senior Judge · Data Science & ML · Netflix',
    shortBio: 'ML engineer at Netflix. Specialized in recommendation systems and personalization at scale.',
    location: 'Los Angeles, USA',
    currentRole: 'Senior ML Engineer',
    company: 'Netflix',
    primaryExpertise: ['Data Science', 'AI', 'Backend'],
    secondaryExpertise: ['Systems', 'Product'],
    totalEventsJudged: 29,
    totalTeamsEvaluated: 385,
    totalMentorshipHours: 102,
    yearsOfExperience: 10,
    averageFeedbackRating: 4.6,
    verified: {
      eventsJudged: true,
      teamsEvaluated: true,
      mentorshipHours: false,
      feedbackRating: true,
    },
    topEventsJudged: [
      {
        eventName: 'ML Challenge 2025',
        role: 'Senior Judge',
        date: 'May 2025',
        verified: true,
      },
      {
        eventName: 'Data Science Olympics',
        role: 'Track Lead',
        date: 'Feb 2025',
        verified: true,
      },
    ],
    linkedin: 'https://linkedin.com/in/jameswilson',
    github: 'https://github.com/jwilson',
    languagesSpoken: ['English'],
    publicAchievements: 'Netflix Tech Blog contributor, Kaggle Grandmaster',
    mentorshipStatement: 'Data tells stories. I help students learn to listen and build systems that make impact.',
    availabilityStatus: 'not-available',
    tier: 'senior',
    isPublished: true,
    joinedDate: '2023-11-20',
  },
  {
    id: '10',
    username: 'aisha-rahman',
    fullName: 'Aisha Rahman',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    headline: 'Starter Judge · IoT & Hardware · Emerging Builder',
    shortBio: 'Electrical engineering student and hardware hacker. Building IoT solutions for developing communities.',
    location: 'Dhaka, Bangladesh',
    currentRole: 'Hardware Engineer Intern',
    company: 'Local Innovation Lab',
    primaryExpertise: ['Hardware', 'IoT'],
    secondaryExpertise: ['Systems', 'Education'],
    totalEventsJudged: 4,
    totalTeamsEvaluated: 32,
    totalMentorshipHours: 16,
    yearsOfExperience: 1,
    verified: {
      eventsJudged: false,
      teamsEvaluated: false,
      mentorshipHours: false,
      feedbackRating: false,
    },
    topEventsJudged: [
      {
        eventName: 'Hardware Hackathon 2025',
        role: 'Assistant Judge',
        date: 'Aug 2025',
        verified: false,
      },
    ],
    linkedin: 'https://linkedin.com/in/aisharahman',
    github: 'https://github.com/arahman',
    languagesSpoken: ['Bengali', 'English', 'Hindi'],
    publicAchievements: 'Built 10+ IoT projects, Local maker community leader',
    mentorshipStatement: 'Hardware is harder, but more rewarding. I want to help students discover the magic of building physical things.',
    availabilityStatus: 'seasonal',
    tier: 'starter',
    isPublished: true,
    joinedDate: '2025-07-15',
  },
];

// Helper functions
export const getJudgeByUsername = (username: string): Judge | undefined => {
  return mockJudges.find(judge => judge.username === username);
};

export const getJudgesByTier = (tier: JudgeTier): Judge[] => {
  return mockJudges.filter(judge => judge.tier === tier && judge.isPublished);
};

export const getPublishedJudges = (): Judge[] => {
  return mockJudges.filter(judge => judge.isPublished);
};

export const getFeaturedJudges = (count: number = 6): Judge[] => {
  // Return judges from higher tiers first
  const tierOrder: JudgeTier[] = ['legacy', 'chief', 'senior', 'verified', 'starter'];
  const sorted = [...mockJudges]
    .filter(judge => judge.isPublished)
    .sort((a, b) => {
      return tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
    });
  return sorted.slice(0, count);
};

export const getTierColor = (tier: JudgeTier): string => {
  const colors = {
    starter: 'text-green-400 border-green-400',
    verified: 'text-blue-400 border-blue-400',
    senior: 'text-purple-400 border-purple-400',
    chief: 'text-yellow-400 border-yellow-400',
    legacy: 'text-red-400 border-red-400',
  };
  return colors[tier];
};

export const getTierLabel = (tier: JudgeTier): string => {
  const labels = {
    starter: 'Starter Judge',
    verified: 'Verified Judge',
    senior: 'Senior Judge',
    chief: 'Chief Judge',
    legacy: 'Legacy Judge',
  };
  return labels[tier];
};
