import { db } from "../server/db";
import { hackathons } from "../shared/schema";
import type { InsertHackathon } from "../shared/schema";

// Seed data extracted from existing hackathon pages
const hackathonData: InsertHackathon[] = [
  {
    slug: "codepocalypse",
    title: "Maximally Codepocalypse",
    tagline: "What would you build if the internet had 48 hours left?",
    badge_text: "48 HOUR CHAOS",
    description: "A 48-hour chaotic hackathon where builders create in the face of digital apocalypse. Build like the end is near.",
    registration_url: "https://codepocalypse.devpost.com/",
    start_date: "Oct 18, 2025",
    end_date: "Oct 19, 2025", 
    duration: "48 hours",
    format: "Online",
    team_size: "Solo or up to 4",
    judging_type: "Async with optional pitch",
    results_date: "Mid-November ceremony",
    what_it_is: "A 48-hour hackathon themed around digital apocalypse. Build software like the internet has 48 hours left. Any stack, any idea, just ship it before the countdown ends.",
    the_idea: "In a world where technology is failing and systems are breaking down, what would you build in the final 48 hours? Create tools, games, or apps that embrace chaos and help humanity survive the digital apocalypse.",
    who_joins: [
      "Anyone, anywhere",
      "No age, no filters", 
      "Teams up to 4 or solo",
      "Beginners welcome",
      "No-coders welcome",
      "Designers welcome",
      "Tinkerers welcome",
      "No prep, no pressure"
    ],
    tech_rules: [
      "Any stack, any tool",
      "AI tools allowed",
      "No-code allowed", 
      "Cursed workflows encouraged",
      "Plagiarism = disqualification",
      "Must include code or files",
      "Short readme required",
      "Optional 60s video"
    ],
    fun_awards: [
      "Most cursed build",
      "Shouldn't have worked but did",
      "Built while sleep-deprived", 
      "Best bug that became a feature"
    ],
    perks: [
      "Join the chaos network",
      "Featured on Maximally platform",
      "Connect with fellow chaos builders",
      "Learn from breaking things"
    ],
    cash_pool: "₹5000+ prizes",
    prize_pool: [
      { title: "Winner", amount: "₹3000", description: "Best overall project" },
      { title: "Runner-up", amount: "₹2000", description: "Second place" }
    ],
    judging_description: "Projects judged on creativity, functionality, chaos factor, and apocalypse theme adherence.",
    judging_criteria: "Innovation in chaos (25%), Technical execution (25%), Theme adherence (25%), Overall impact (25%)",
    required_submissions: [
      "Working demo or prototype", 
      "Public repository with code",
      "Brief project description",
      "List of technologies used"
    ],
    optional_submissions: [
      "60-second demo video",
      "Deployment link if applicable",
      "Team member details"
    ],
    theme_color_primary: "#dc2626",
    theme_color_secondary: "#1f2937", 
    theme_color_accent: "#fbbf24",
    is_active: true
  },
  {
    slug: "protocol-404",
    title: "Protocol 404",
    tagline: "Break the system. Build yours.",
    badge_text: "SYSTEM ERROR",
    description: "A 48-hour hackathon for system-breakers. When the system fails, we build better ones.",
    registration_url: "https://protocol404.devpost.com/",
    start_date: "Oct 4, 2025",
    end_date: "Oct 5, 2025",
    duration: "48 hours", 
    format: "Online",
    team_size: "Solo or up to 4",
    judging_type: "Async submission review",
    results_date: "October 12, 2025",
    what_it_is: "Protocol 404 is for builders who see broken systems and think 'I can fix that.' 48 hours to prototype your solution to something fundamentally broken.",
    the_idea: "Every system eventually breaks. When protocols fail, networks collapse, and error 404 becomes the norm - that's when true builders shine. Build tools that work when everything else doesn't.",
    who_joins: [
      "System breakers",
      "Protocol hackers", 
      "Error hunters",
      "Chaos engineers",
      "Infrastructure rebels",
      "Network builders",
      "Anyone who's seen a 404 and wanted to fix it"
    ],
    tech_rules: [
      "Any stack allowed",
      "Open source encouraged",
      "AI tools permitted",
      "No-code solutions welcome",
      "Must solve a real problem", 
      "Code repository required",
      "Brief documentation needed"
    ],
    fun_awards: [
      "Most elegant failure handler",
      "Best system resurrection",
      "Chaos utility champion",
      "Protocol perfectionist"
    ],
    perks: [
      "Join the protocol network", 
      "Featured on system builder showcases",
      "Connect with infrastructure hackers",
      "Learn advanced debugging techniques"
    ],
    cash_pool: "₹5000+ in prizes", 
    prize_pool: [
      { title: "System Breaker", amount: "₹3000", description: "Best protocol solution" },
      { title: "Error Hunter", amount: "₹2000", description: "Best debugging tool" }
    ],
    judging_description: "Projects evaluated on problem-solving approach, technical innovation, and real-world applicability.",
    judging_criteria: "Problem identification (20%), Solution design (30%), Technical execution (30%), Impact potential (20%)",
    required_submissions: [
      "Working prototype or demo",
      "Source code repository", 
      "Problem statement and solution",
      "Technology stack documentation"
    ],
    optional_submissions: [
      "Demo video (max 2 minutes)",
      "Deployment/live demo link",
      "Future roadmap"
    ],
    theme_color_primary: "#ef4444",
    theme_color_secondary: "#000000",
    theme_color_accent: "#fbbf24",
    is_active: true
  },
  {
    slug: "hacktober",
    title: "Maximally Hacktober", 
    tagline: "Build slow. Build loud. Finish strong.",
    badge_text: "MONTH-LONG MADNESS",
    description: "A month-long hackathon for builders who won't quit. October 1-31, 2025. Deep work, loud launches.",
    registration_url: "https://maximallyhacktober.devpost.com/",
    start_date: "Oct 1, 2025",
    end_date: "Oct 31, 2025",
    duration: "31 days",
    format: "Online", 
    team_size: "Solo or up to 4",
    judging_type: "Final submission review",
    results_date: "November 15, 2025",
    what_it_is: "Hacktober is a month-long building marathon. Not a sprint hackathon, but a sustained effort to create something meaningful. Build consistently, document loudly, finish strong.",
    the_idea: "Most hackathons are weekend sprints. Hacktober is different - a full month to build something substantial. Take time to iterate, polish, and create something you're truly proud of.",
    who_joins: [
      "Long-form builders",
      "Perfectionist makers",
      "Indie hackers", 
      "Product builders",
      "Anyone with a big idea",
      "Teams wanting depth over speed",
      "Builders who love the process"
    ],
    tech_rules: [
      "Any technology stack",
      "Open source preferred",
      "AI tools encouraged",
      "No-code solutions welcome",
      "Must show consistent progress",
      "Weekly check-ins required",
      "Final demo mandatory"
    ],
    fun_awards: [
      "Most consistent builder",
      "Best documentation", 
      "Biggest transformation",
      "Community favorite"
    ],
    perks: [
      "Monthly builder community access",
      "Featured on Maximally showcase",
      "Mentorship opportunities",
      "Product launch support"
    ],
    cash_pool: "₹10,000+ prize pool",
    prize_pool: [
      { title: "Master Builder", amount: "₹5000", description: "Best overall project" },
      { title: "Consistency Award", amount: "₹3000", description: "Most consistent progress" },
      { title: "Community Choice", amount: "₹2000", description: "Voted by community" }
    ],
    judging_description: "Projects judged on consistency, quality, innovation, and community impact over the month-long period.",
    judging_criteria: "Consistency (25%), Product quality (25%), Innovation (25%), Community engagement (25%)",
    required_submissions: [
      "Complete working product",
      "Development log/journal", 
      "Public repository",
      "Demo video (max 5 minutes)"
    ],
    optional_submissions: [
      "Live deployment link",
      "User testimonials",
      "Future development plans"
    ],
    theme_color_primary: "#d97706",
    theme_color_secondary: "#8b4513",
    theme_color_accent: "#f59e0b",
    is_active: true
  },
  {
    slug: "steal-a-thon",
    title: "Maximally Steal-A-Thon",
    tagline: "Good artists copy. Great artists steal. Greatest artists improve.",
    badge_text: "ORIGINAL THEFT",
    description: "24-hour hackathon where you upgrade existing projects. Find something cool, make it cooler.",
    registration_url: "https://stealathon.devpost.com/", 
    start_date: "Nov 9, 2025",
    end_date: "Nov 10, 2025",
    duration: "24 hours",
    format: "Online",
    team_size: "Solo or up to 4",
    judging_type: "Innovation on existing work",
    results_date: "November 17, 2025",
    what_it_is: "Steal-A-Thon celebrates the art of iteration. Find an existing open-source project, tool, or idea, then make it significantly better in 24 hours.",
    the_idea: "Innovation doesn't always mean starting from scratch. Sometimes the best way forward is to take something good and make it great. Find, fork, and improve.",
    who_joins: [
      "Coders",
      "No-coders",
      "Designers", 
      "First-timers",
      "Meme builders",
      "Indie hackers",
      "Chaos coders",
      "Anyone who believes good artists copy and great artists steal"
    ],
    tech_rules: [
      "Base your work on a public project",
      "Transform it enough to be yours",
      "Include a link to the original",
      "Keep it SFW and non-harmful",
      "Lazy clones get disqualified"
    ],
    fun_awards: [
      "Most creative theft",
      "Best transformation",
      "Funniest rename", 
      "Should-be-official-fork"
    ],
    perks: [
      "Join the remix network",
      "Featured on improvement showcases", 
      "Connect with iteration masters",
      "Learn advanced forking techniques"
    ],
    cash_pool: "₹3000+ in prizes",
    prize_pool: [
      { title: "Greatest Thief", amount: "₹2000", description: "Best improvement" },
      { title: "Creative Upgrade", amount: "₹1000", description: "Most creative transformation" }
    ],
    judging_description: "Projects judged on the creativity of improvements, technical execution, and how well they transform the original.",
    judging_criteria: "Improvement creativity (30%), Technical execution (25%), Originality in changes (25%), Overall polish (20%)",
    required_submissions: [
      "Your improved version",
      "Link to original project",
      "List of improvements made",
      "Brief explanation of changes"
    ],
    optional_submissions: [
      "Before/after comparison video",
      "Pull request to original (if applicable)",
      "User feedback on improvements"
    ],
    theme_color_primary: "#1f2937",
    theme_color_secondary: "#374151", 
    theme_color_accent: "#10b981",
    is_active: true
  },
  {
    slug: "grand-tech-assembly",
    title: "Grand Tech Assembly",
    tagline: "7 days. 4 tracks. 1 legendary build.",
    badge_text: "GTA SEASON",
    description: "Week-long hackathon with mission tracks. Choose your path: Heist, Street Hustle, Vigilante, or Mastermind.",
    registration_url: "https://gta-maximally.devpost.com/",
    start_date: "Nov 1, 2025", 
    end_date: "Nov 7, 2025",
    duration: "7 days",
    format: "Online, Devpost submissions",
    team_size: "Solo or up to 4",
    judging_type: "Track-based judging",
    results_date: "November 14, 2025",
    what_it_is: "Grand Tech Assembly is a week-long hackathon with GTA-themed mission tracks. Choose your criminal path and build your way to the top of the leaderboard.",
    the_idea: "Every great heist needs a plan, every street hustle needs grit, every vigilante needs justice, and every mastermind needs strategy. Pick your track and build something legendary.",
    who_joins: [
      "Anyone anywhere",
      "Beginners and no-coders",
      "Designers",
      "Hackers", 
      "Indie makers",
      "No prep needed",
      "Any stack works"
    ],
    tech_rules: [
      "Choose one primary mission track",
      "Side missions are bonus points",
      "Any technology allowed",
      "AI tools permitted",
      "Must relate to chosen track theme",
      "Code repository required",
      "Devpost submission mandatory"
    ],
    fun_awards: [
      "Best heist automation",
      "Most profitable hustle",
      "Justice served award",
      "Criminal mastermind",
      "Cross-track excellence"
    ],
    perks: [
      "Join the GTA network",
      "Featured on criminal showcases",
      "Access to mission briefings", 
      "Connect with track leaders"
    ],
    cash_pool: "₹8000+ across all tracks",
    prize_pool: [
      { title: "Track Champion", amount: "₹2000", description: "Best in each track" },
      { title: "Cross-Track Master", amount: "₹2000", description: "Multi-track excellence" }
    ],
    judging_description: "Projects judged within their chosen track category, with bonus points for cross-track innovation and overall execution quality.",
    judging_criteria: "Track alignment (25%), Innovation (25%), Technical execution (25%), Presentation (25%)",
    required_submissions: [
      "Devpost project submission",
      "Working demo or prototype",
      "Mission track selection",
      "Source code repository"
    ],
    optional_submissions: [
      "Demo video (max 60 seconds)",
      "Side mission completions",
      "Team introduction"
    ],
    theme_color_primary: "#059669", 
    theme_color_secondary: "#1f2937",
    theme_color_accent: "#fbbf24",
    is_active: true
  },
  {
    slug: "prompt-storm",
    title: "Maximally PromptStorm",
    tagline: "24 hours. Infinite prompts. Pure AI creativity.",
    badge_text: "AI POWERED",
    description: "24-hour AI-focused hackathon. Build anything where prompts are the core technology. ChatGPT, Claude, Midjourney - go wild.",
    registration_url: "https://maximally-promptstorm.devpost.com/",
    start_date: "Oct 25, 2025",
    end_date: "Oct 26, 2025", 
    duration: "24 hours",
    format: "Online",
    team_size: "Solo or up to 4",
    judging_type: "AI innovation and prompt creativity",
    results_date: "November 2, 2025",
    what_it_is: "PromptStorm is all about AI creativity. Build tools, art, stories, games, or anything where prompt engineering is the main technology. Show us what happens when humans and AI collaborate.",
    the_idea: "We're in the prompt era. The best builders aren't necessarily the best coders - they're the best prompt engineers. Show us what's possible when prompts become your primary tool.",
    who_joins: [
      "AI tinkerers",
      "Writers",
      "Designers",
      "Coders",
      "No-coders", 
      "Beginners who want a simple way to compete"
    ],
    tech_rules: [
      "Prompts must be central to the build",
      "Keep it SFW and non-harmful",
      "Team work is allowed, outside assets must be credited",
      "Share prompt logs or representative prompts"
    ],
    fun_awards: [
      "Most creative prompt use",
      "Best AI collaboration",
      "Prompt engineering master",
      "Unexpected AI application"
    ],
    perks: [
      "Join the AI builder community",
      "Featured on prompt showcases",
      "Access to prompt libraries",
      "Connect with AI innovators"
    ],
    cash_pool: "₹4000+ in AI prizes",
    prize_pool: [
      { title: "Prompt Master", amount: "₹2500", description: "Best prompt engineering" },
      { title: "AI Innovator", amount: "₹1500", description: "Most creative AI use" }
    ],
    judging_description: "Projects evaluated on prompt creativity, AI integration quality, innovation in human-AI collaboration, and overall execution.",
    judging_criteria: "Prompt innovation (30%), AI integration (25%), Creativity (25%), Execution (20%)",
    required_submissions: [
      "Working AI-powered project",
      "Key prompts used (sanitized)",
      "Brief explanation of AI role",
      "Technology and AI tools list"
    ],
    optional_submissions: [
      "Demo video showing AI interaction",
      "Prompt engineering insights",
      "Future AI integration plans"
    ],
    theme_color_primary: "#3b82f6",
    theme_color_secondary: "#1e40af",
    theme_color_accent: "#60a5fa",
    is_active: true
  },
  {
    slug: "codehypothesis",
    title: "Code Hypothesis",
    tagline: "A 24-hour hackathon for wild ideas",
    badge_text: "GRAND INDIAN HACKATHON",
    description: "Test theories instead of pitching. Part of Maximally Grand Indian Hackathon Season. Where code meets graffiti.",
    registration_url: "https://codehypothesis.devpost.com/",
    start_date: "Sept 28, 2025",
    end_date: "Sept 28, 2025",
    duration: "24 hours",
    format: "Online",
    team_size: "Solo or teams",
    judging_type: "Async submission review",
    results_date: "Mid November",
    what_it_is: "Not your average hackathon. Instead of pitching polished ideas, you test theories and challenge assumptions. This is about raw experimentation, fast prototyping, and proving (or disproving) your wildest coding hypotheses in just 24 hours.",
    the_idea: "Code Hypothesis is where theory meets reality. Build prototypes to test your coding assumptions, challenge conventional wisdom, and prove wild theories through raw experimentation.",
    who_joins: [
      "Builders with weird ideas",
      "Absolute beginners", 
      "No-code rebels",
      "Students & dropouts",
      "Indie hackers",
      "Theory breakers"
    ],
    tech_rules: [
      "Any stack, any tool",
      "Test a coding hypothesis",
      "Must include working prototype",
      "Code repository required",
      "Brief documentation needed",
      "Raw experimentation encouraged"
    ],
    fun_awards: [
      "Most mind-bending hypothesis",
      "Best theory destroyer",
      "Wildest assumption challenge",
      "Creative rebellion award"
    ],
    perks: [
      "Join the hypothesis network",
      "Featured on theory showcases", 
      "Connect with experimental builders",
      "Learn breakthrough thinking"
    ],
    cash_pool: "₹5000+ in prizes",
    prize_pool: [
      { title: "Hypothesis Master", amount: "₹3000", description: "Best theory test" },
      { title: "Reality Breaker", amount: "₹2000", description: "Most surprising result" }
    ],
    judging_description: "Projects judged on hypothesis creativity, experimental approach, technical execution, and insights gained from testing theories.",
    judging_criteria: "Hypothesis originality (30%), Experimental approach (25%), Technical execution (25%), Insights gained (20%)",
    required_submissions: [
      "Working prototype or demo",
      "Hypothesis statement",
      "Test results and findings", 
      "Source code repository"
    ],
    optional_submissions: [
      "Demo video",
      "Experimental process documentation",
      "Future research directions"
    ],
    theme_color_primary: "#10b981",
    theme_color_secondary: "#000000", 
    theme_color_accent: "#fbbf24",
    is_active: true
  },
  {
    slug: "project-codegen",
    title: "Project CodeGen",
    tagline: "Build like you're 6. Ship like you're 16.",
    badge_text: "PLAYFUL HACKATHON",
    description: "A 48-hour hackathon for builders who play. Not about disruption or MVPs. It's about play. Drop the pitch decks, pick up crayons.",
    registration_url: "https://projectcodegen.devpost.com",
    start_date: "Oct 11, 2025",
    end_date: "Oct 12, 2025", 
    duration: "48 hours",
    format: "Online",
    team_size: "Solo or teams (max 4)",
    judging_type: "Async judging, no live pitch",
    results_date: "Before Nov ceremony",
    what_it_is: "Not about disruption or MVPs. It's about play. Drop the pitch decks, pick up crayons. Build like a kid — silly ideas, joyful logic, weird prototypes. Make tech fun again.",
    the_idea: "Project CodeGen celebrates the joy of building. Inspired by notebooks, toys, science fairs, Lego builds, and Scratch projects. You're building for your younger self.",
    who_joins: [
      "Teen builders",
      "First-timers",
      "Designers + no-coders", 
      "Scratch veterans",
      "Makers who like color, fun, and zero stress"
    ],
    tech_rules: [
      "48-hour online event",
      "Solo or teams (max 4)",
      "Open to all ages, worldwide",
      "Any stack or tool",
      "No prep, no live calls",
      "Serious design allowed, serious tone not allowed",
      "You're building for your younger self"
    ],
    fun_awards: [
      "Most playful build",
      "Best imagination",
      "Highest joy factor",
      "Most useful in disguise"
    ],
    perks: [
      "Join the playful builder community",
      "Featured on creativity showcases",
      "Connect with joyful makers", 
      "Rediscover the fun in coding"
    ],
    cash_pool: "₹5000+ in prizes",
    prize_pool: [
      { title: "Big Kid Award", amount: "₹3000", description: "Best overall playful project + LOR + feature" },
      { title: "Most Playful Build", amount: "₹2000", description: "Highest creativity and joy" }
    ],
    judging_description: "Projects evaluated on imagination, execution, usefulness in disguise, presentation, and joy factor.",
    judging_criteria: "Imagination (30%), Execution (25%), Usefulness in Disguise (20%), Presentation (15%), Joy Factor (10%)",
    required_submissions: [
      "Prototype link (GitHub, Notion, Figma, no-code, etc.)",
      "Write-up: what you built, why it's playful, hidden smartness",
      "Working playful project"
    ],
    optional_submissions: [
      "1-min silly demo video",
      "Process documentation",
      "Fun screenshots or demos"
    ],
    theme_color_primary: "#f59e0b",
    theme_color_secondary: "#ec4899",
    theme_color_accent: "#3b82f6",
    is_active: true
  }
];

async function seedHackathons() {
  console.log("🌱 Starting hackathon seeding...");
  
  try {
    // Clear existing hackathons (optional - comment out if you want to keep existing data)
    console.log("🗑️  Clearing existing hackathons...");
    await db.delete(hackathons);
    
    // Insert hackathon data
    console.log("📝 Inserting hackathon data...");
    for (const hackathon of hackathonData) {
      await db.insert(hackathons).values(hackathon);
      console.log(`✅ Inserted: ${hackathon.title} (${hackathon.slug})`);
    }
    
    console.log(`🎉 Successfully seeded ${hackathonData.length} hackathons!`);
    
    // Verify insertion
    const insertedHackathons = await db.select().from(hackathons);
    console.log(`📊 Database now contains ${insertedHackathons.length} hackathons`);
    
  } catch (error) {
    console.error("❌ Error seeding hackathons:", error);
    process.exit(1);
  }
}

// Run the seeding script
seedHackathons()
  .then(() => {
    console.log("🏁 Seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  });

export { seedHackathons, hackathonData };