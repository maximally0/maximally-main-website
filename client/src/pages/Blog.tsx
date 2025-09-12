import { useEffect, useState, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Footer from '@/components/Footer';
import BlogCard, { BlogCardProps } from '@/components/BlogCard';
import { useBlogs, generateExcerpt, calculateReadTime } from '@/hooks/useBlog';
import { format } from 'date-fns';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const blogPosts = [
  {
    title: 'What is the Maximally AI Shipathon and Why You Should Join',
    excerpt:
      "If you've ever watched a cool AI demo and thought, 'I wish I could build something like that,' the Maximally AI Shipathon is exactly where you should start. It's not just another hackathon — it's a launchpad for teen innovators...",
    date: 'July 12, 2025',
    readTime: '8 min read',
    category: 'AI Hackathons',
    link: '/blog/maximally-ai-shipathon-guide',
  },
  {
    title:
      'Top AI Hackathons for Students in 2025 — And Why This One Is Different',
    excerpt:
      "Let's be honest: most hackathons can feel overwhelming. You see posts about AI models, lines of code, massive prizes — and you think, 'That's not for me… yet.' But what if there was a hackathon made for beginners?",
    date: 'July 12, 2025',
    readTime: '10 min read',
    category: 'AI Hackathons',
    link: '/blog/top-ai-hackathons-students-2025',
  },
  {
    title: 'No Code? No Problem: How Anyone Can Join the AI Shipathon',
    excerpt:
      "So you've heard about AI. Maybe even messed around with ChatGPT. But when someone says 'build an AI project,' you panic because you don't know how to code. Here's the good news: you don't need to.",
    date: 'July 12, 2025',
    readTime: '7 min read',
    category: 'No-Code AI',
    link: '/blog/no-code-ai-shipathon',
  },
  {
    title: 'How I Built My First AI Project in 48 Hours (And You Can Too)',
    excerpt:
      "Let me take you back 48 hours. I was staring at a blank Google Doc, part of a fresh team I'd never met before, in the middle of my first ever AI hackathon for beginners. The challenge? Build an AI-powered solution to a real-world problem using no code AI tools.",
    date: 'July 12, 2025',
    readTime: '9 min read',
    category: 'Success Stories',
    link: '/blog/first-ai-project-48-hours',
  },
  {
    title: "Masters' Union backs Maximally Startup Make-a-thon",
    excerpt:
      "We're excited to share that Masters' Union, one of India's most forward-thinking institutions for business and entrepreneurship, is officially backing the upcoming Maximally Startup Make-a-thon (July 1–7).",
    date: 'June 10, 2025',
    readTime: '5 min read',
    category: 'Partnership',
    link: '/blog/masters-union-partnership',
  },
  {
    title: 'Project CodeGen: Why Play Might Be the Future of Building',
    excerpt:
      'When was the last time you played with technology—not for work, not for profit, but just because it was fun? Project CodeGen is a 48-hour hackathon that celebrates joy over disruption.',
    date: 'January 26, 2025',
    readTime: '6 min read',
    category: 'Project CodeGen',
    link: '/blog/project-codegen-play-future',
  },
  {
    title: 'Project CodeGen: Redefining Code Collaboration',
    excerpt:
      "Project CodeGen reshapes coding collaboration with AI-driven productivity, fluid teamwork, and gamified elements. More than a tool - it's a movement for better building.",
    date: 'January 26, 2025',
    readTime: '7 min read',
    category: 'Project CodeGen',
    link: '/blog/project-codegen-redefining-collaboration',
  },
  {
    title:
      'From Idea to Execution: How Project Codegen Powers Real Hackathon Projects',
    excerpt:
      'Great hackathon ideas stumble at execution. Project Codegen helps you skip setup chaos and jump straight into building winning demos. Speed up your hackathon success.',
    date: 'January 26, 2025',
    readTime: '5 min read',
    category: 'Project CodeGen',
    link: '/blog/project-codegen-idea-to-execution',
  },
  {
    title:
      'Beyond Hackathons: The Future of Project Codegen in Everyday Development',
    excerpt:
      'Project Codegen started for hackathons but evolved for everyday development. Speed up MVPs, prototype faster, and amplify developer productivity in real-world projects.',
    date: 'January 26, 2025',
    readTime: '8 min read',
    category: 'Project CodeGen',
    link: '/blog/project-codegen-beyond-hackathons',
  },
  {
    title:
      'Why Hackathons Got Boring (and How Code Hypothesis Breaks the Script)',
    excerpt:
      "Code Hypothesis is a 24-hour online hackathon where you don't pitch ideas—you test them. No theatrics. No gatekeeping. Just one question: Can you prove a weird theory in a day?",
    date: 'January 24, 2025',
    readTime: '8 min read',
    category: 'Code Hypothesis',
    link: '/blog/why-hackathons-got-boring-code-hypothesis',
  },
  {
    title: "The Science of Wild Ideas: Why We're Calling It Code Hypothesis",
    excerpt:
      'Pitches are about selling. A hypothesis is about testing. Code Hypothesis is built on science + chaos - testing theories with code in 24 hours.',
    date: 'January 24, 2025',
    readTime: '6 min read',
    category: 'Code Hypothesis',
    link: '/blog/science-wild-ideas-code-hypothesis',
  },
  {
    title: 'No Pitch Decks. No Gatekeeping. Just Chaos.',
    excerpt:
      "Code Hypothesis isn't startup theater or hand-holding. 24 hours of shipping weird experiments judged on boldness + execution, not polish. Chaos is honest.",
    date: 'January 24, 2025',
    readTime: '5 min read',
    category: 'Code Hypothesis',
    link: '/blog/no-pitch-decks-gatekeeping-chaos',
  },
  {
    title: '24 Hours, Zero Excuses: How to Survive Code Hypothesis',
    excerpt:
      "The punk's field manual for 24-hour hackathon experimentation. From pre-hack checklist to submission - how to survive Code Hypothesis and ship something brilliant.",
    date: 'January 24, 2025',
    readTime: '12 min read',
    category: 'Code Hypothesis',
    link: '/blog/survive-code-hypothesis-24-hours',
  },
  {
    title: 'Protocol 404: When the System is Broken, Build Anyway',
    excerpt:
      "Most hackathons sell you order, tracks, mentors, polished pitches. Protocol 404? It sells you the exact opposite. This isn't about fixing the system—it's about building in the wreckage.",
    date: 'January 16, 2025',
    readTime: '4 min read',
    category: 'Protocol 404',
    link: '/blog/protocol-404-when-system-broken',
  },
  {
    title: 'Protocol 404: Why Hackathons Are the Future of Problem-Solving',
    excerpt:
      "What if an error wasn't just a bug, but a way of thinking? Discover how Protocol 404 represents a mindset where failure isn't the end—it's the start of innovation.",
    date: 'January 16, 2025',
    readTime: '5 min read',
    category: 'Protocol 404',
    link: '/blog/protocol-404-future-problem-solving',
  },
  {
    title: "Protocol 404: The Hacker's Shortcut to Chaos",
    excerpt:
      'The internet was built on protocols. But what happens when someone breaks those rules? Learn about Protocol 404 and how hackers exploit system vulnerabilities.',
    date: 'January 16, 2025',
    readTime: '6 min read',
    category: 'Protocol 404',
    link: '/blog/protocol-404-hacker-shortcut',
  },
  {
    title: 'Protocol 404: The Future of Hackathons Nobody Saw Coming',
    excerpt:
      "Protocol 404 isn't just a concept; it's a movement redefining how hackathons are run, how teams collaborate, and how innovation gets discovered.",
    date: 'January 16, 2025',
    readTime: '5 min read',
    category: 'Protocol 404',
    link: '/blog/protocol-404-future-of-hackathons',
  },
  {
    title: 'Tech Mentoring Benefits: Why Developers Should Join Makeathons',
    excerpt:
      'Discover how senior developers can accelerate their careers by mentoring at makeathons. Learn the leadership skills, networking opportunities, and professional growth that comes from guiding young innovators...',
    date: 'January 11, 2025',
    readTime: '8 min read',
    category: 'Professional Development',
    link: '/blog/senior-dev-as-mentors',
  },
  {
    title:
      'No Coding? No Problem! How Maximally Makeathons Welcome Beginners and Non-Tech Teens',
    excerpt:
      'Over 60% of successful participants arrive with zero coding experience. Discover how no-code tools and collaborative learning empower non-technical teens to build functional startups...',
    date: 'January 11, 2025',
    readTime: '10 min read',
    category: 'No-Code',
    link: '/blog/no-code-future',
  },
  {
    title:
      'Career Change Through Makeathons | Weekend Skill Building for Professionals',
    excerpt:
      'Discover how working professionals use makeathons to transition careers, learn new skills, and build portfolios while maintaining full-time employment...',
    date: 'January 11, 2025',
    readTime: '9 min read',
    category: 'Career Transition',
    link: '/blog/makeathon-for-career',
  },
  {
    title:
      'The Power of Mentorship: How Maximally Connects Teens with Startup Experts',
    excerpt:
      'Learn how expert mentorship accelerates teenage entrepreneurs from idea to successful startup launch. 70% of participants continue building post-event thanks to quality mentorship...',
    date: 'January 11, 2025',
    readTime: '12 min read',
    category: 'Mentorship',
    link: '/blog/power-of-mentorship',
  },
  {
    title:
      "Why Makeathons Like Maximally's Are the Future of Teen Education and Career Readiness",
    excerpt:
      "Discover how makeathons revolutionize education by teaching real-world skills that traditional classrooms can't provide. Project-based learning for the AI economy...",
    date: 'January 11, 2025',
    readTime: '14 min read',
    category: 'Education Future',
    link: '/blog/makeathons-future-education',
  },
  {
    title:
      "How Girls Are Breaking Barriers in STEM with Maximally's Inclusive Makeathon Programs",
    excerpt:
      'Discover how Maximally empowers girls in STEM through inclusive makeathons that break traditional barriers and build confidence. Real success stories from female teen entrepreneurs...',
    date: 'January 11, 2025',
    readTime: '12 min read',
    category: 'Girls in STEM',
    link: '/blog/girls-breaking-barriers-stem',
  },
  {
    title:
      "Top 5 Life Skills Teens Gain by Participating in Maximally's Startup Makeathon",
    excerpt:
      'Discover the top 5 life-changing skills teens develop at makeathons—from leadership and creativity to resilience and real-world problem solving...',
    date: 'January 11, 2025',
    readTime: '11 min read',
    category: 'Life Skills',
    link: '/blog/top-life-skills-teens',
  },
  {
    title: 'Maximally Makeathon Teaches Teens Figma, ChatGPT, and More',
    excerpt:
      "Learn how Maximally's Makeathon equips teens with real-world startup tools like Figma, ChatGPT, Notion, and no-code builders to turn ideas into reality...",
    date: 'January 11, 2025',
    readTime: '10 min read',
    category: 'Professional Tools',
    link: '/blog/maximally-teaches-tools',
  },
  {
    title:
      "How Parents Can Support Their Teens During Maximally's Makeathon Without Taking Over",
    excerpt:
      'Discover practical ways parents can support their teens through makeathons—while empowering independence, creativity, and confidence...',
    date: 'January 11, 2025',
    readTime: '13 min read',
    category: 'Parent Guide',
    link: '/blog/parents-support-makeathon',
  },
  {
    title:
      'Maximally Makeathon FAQ: Everything Teens and Parents Need to Know Before Signing Up',
    excerpt:
      "Have questions about Maximally's Makeathon? This FAQ covers everything from eligibility and safety to project outcomes and judging criteria...",
    date: 'January 11, 2025',
    readTime: '8 min read',
    category: 'FAQ',
    link: '/blog/makeathon-faq-maximally',
  },
  {
    title:
      "Building Teamwork and Leadership Skills Through Maximally's Startup Makeathon Experience",
    excerpt:
      "Discover how Maximally's Makeathon helps teens build vital skills like communication, collaboration, and leadership—while creating real startup projects...",
    date: 'January 11, 2025',
    readTime: '9 min read',
    category: 'Leadership Development',
    link: '/blog/teamwork-leadership-maximally',
  },
  {
    title:
      "Why Every Teen Should Join Maximally's Startup Makeathon to Kickstart Their Entrepreneurial Journey",
    excerpt:
      "Learn skills, build networks, and launch real startups in just 7 days. Discover how teenagers can transform ideas into reality through Maximally's intensive makeathon experience...",
    date: 'January 17, 2025',
    readTime: '10 min read',
    category: 'Entrepreneurship',
    link: '/blog/makeathon-for-future',
  },
  {
    title:
      "A Parent's Guide: How Maximally Makeathons Empower Teens to Build Real Startups",
    excerpt:
      "A comprehensive parent's guide to youth entrepreneurship programs. Understand how makeathons provide structured, safe environments for teens to develop business skills...",
    date: 'January 17, 2025',
    readTime: '12 min read',
    category: 'Parents Guide',
    link: '/blog/startups-through-maximally',
  },
  {
    title: 'Teachers Guide: Using Makeathons for Classroom Innovation',
    excerpt:
      "Discover how educators can integrate Maximally's makeathon methodologies into classroom teaching to boost student engagement and innovation skills...",
    date: 'January 17, 2025',
    readTime: '15 min read',
    category: 'Education',
    link: '/blog/maximally-makeathons-for-teachers',
  },
  {
    title:
      'Level Up Your College Applications: How Makeathons Give You the Edge',
    excerpt:
      'Transform your college applications with meaningful makeathon projects. Stand out to admissions officers with real innovation and impact...',
    date: 'January 17, 2025',
    readTime: '12 min read',
    category: 'College Guide',
    link: '/blog/level-up-your-game-with-maximally',
  },
  {
    title:
      'Transforming STEM Education: How to Integrate Makeathons into Your Curriculum',
    excerpt:
      'Discover how teachers can use makeathons to enhance STEM learning. Practical strategies for implementing project-based innovation in your classroom...',
    date: 'January 17, 2025',
    readTime: '18 min read',
    category: 'STEM Education',
    link: '/blog/transforming-education-with-maximally',
  },
  {
    title:
      'Can Teenagers Really Launch Startups? Why the Answer Is a Confident Yes',
    excerpt:
      "Wondering if teenagers can actually build startups? With the right tools, mindset, and mentorship, the answer is yes—and Maximally's Makeathon proves it...",
    date: 'January 17, 2025',
    readTime: '8 min read',
    category: 'Entrepreneurship',
    link: '/blog/can-teens-launch-startups',
  },
  {
    title: 'From Dorm Room to Startup: How Makeathons Launch Real Careers',
    excerpt:
      "Discover how college students are launching successful startups and careers through Maximally's makeathons. Real stories, practical advice, and networking opportunities...",
    date: 'January 17, 2025',
    readTime: '15 min read',
    category: 'Career Development',
    link: '/blog/dorm-to-startup-2025',
  },
  {
    title:
      'ROI of Innovation: How Makeathons Transform School Culture and Student Outcomes',
    excerpt:
      'Discover how school administrators can implement makeathons to improve student outcomes, boost engagement, and create innovation culture...',
    date: 'January 17, 2025',
    readTime: '20 min read',
    category: 'School Leadership',
    link: '/blog/school-innovation-roi',
  },
  {
    title:
      "Top Career Paths for Teen Innovators (That Don't Need a Degree Yet)",
    excerpt:
      'Explore exciting career options that let you innovate, create, and succeed, without waiting for a degree. From entrepreneurship to content creation, discover paths that fit your passion...',
    date: 'January 17, 2025',
    readTime: '8 min read',
    category: 'Career Guide',
    link: '/blog/top-careers-for-teen-innovators',
  },
  {
    title: 'Should You Start a YouTube Channel or a Startup First?',
    excerpt:
      'Deciding between content creation and entrepreneurship? Discover which path aligns best with your goals as a teen innovator, plus real success stories and expert guidance...',
    date: 'January 17, 2025',
    readTime: '8 min read',
    category: 'Career Guide',
    link: '/blog/youtube-vs-startup-for-teens',
  },
  {
    title: 'Why Teen Entrepreneurs Are the Future of India',
    excerpt:
      "Discover how India's teen entrepreneurs are revolutionizing business and technology. From AI prodigies to app developers, learn how young innovators are shaping the nation's future...",
    date: 'January 17, 2025',
    readTime: '8 min read',
    category: 'Entrepreneurship',
    link: '/blog/teen-entrepreneurs-india-future',
  },
  {
    title: 'How to Get Noticed Online: Student Branding Tips That Work',
    excerpt:
      'Learn how to build your authentic online presence and get noticed as a student! From choosing the right platforms to crafting compelling content...',
    date: 'January 17, 2025',
    readTime: '10 min read',
    category: 'Personal Branding',
    link: '/blog/online-branding-tips-for-students',
  },
  {
    title: "Can Teenagers Really Learn AI in 7 Days? Here's How.",
    excerpt:
      'Discover how teens can grasp AI fundamentals in just one week! From machine learning to neural networks, we break down complex concepts into fun, digestible lessons...',
    date: 'January 17, 2025',
    readTime: '8 min read',
    category: 'Technology',
    link: '/blog/learn-ai-in-7-days-teens',
  },
  {
    title: 'How to Turn Your Passion Project Into a Real Business',
    excerpt:
      'Transform your hobby into a thriving business! Learn how to validate your idea, create a business plan, and start making money doing what you love...',
    date: 'January 17, 2025',
    readTime: '8 min read',
    category: 'Entrepreneurship',
    link: '/blog/passion-project-to-business',
  },
  {
    title: "What It's Really Like Inside a Teen Entrepreneurship Bootcamp",
    excerpt:
      "Discover what it's like inside a teen startup bootcamp and how it can help you turn your business ideas into reality with Maximally Bootcamp...",
    date: 'January 17, 2025',
    readTime: '8 min read',
    category: 'Entrepreneurship',
    link: '/blog/teen-entrepreneurship-bootcamp-experience',
  },
  {
    title: 'The Gen Z Guide to Becoming a Young Influencer',
    excerpt:
      'Discover how to become a Gen Z influencer in 2025! Learn creating content, growing your following, and building your personal brand as a teen...',
    date: 'January 17, 2025',
    readTime: '8 min read',
    category: 'Social Media',
    link: '/blog/gen-z-influencer-guide-teens',
  },
  {
    title: 'From Side Hustle to Startup: Teen Founders Who Made It Big',
    excerpt:
      'Discover how teens turn their side hustles into successful startups. From weekend hobbies to real businesses—learn the path to teen entrepreneurship...',
    date: 'April 17, 2025',
    readTime: '8 min read',
    category: 'Entrepreneurship',
    link: '/blog/side-hustle-to-startup-teen-success',
  },
  {
    title: '10 Real-World Skills Schools Never Taught You (But We Will)',
    excerpt:
      "Discover essential real-world skills every teen should know before turning 18. From financial literacy to entrepreneurship—learn what school doesn't teach...",
    date: 'April 17, 2025',
    readTime: '8 min read',
    category: 'Life Skills',
    link: '/blog/real-world-skills-for-teens',
  },
  {
    title: "Why Every Teen Should Learn Public Speaking (Even If You're Shy)",
    excerpt:
      'Discover how public speaking builds confidence, leadership, and communication—even for shy students. Learn practical steps to overcome fear and speak with impact...',
    date: 'April 17, 2025',
    readTime: '8 min read',
    category: 'Skills Development',
    link: '/blog/public-speaking-for-teens-guide',
  },
  {
    title: 'The Ultimate Guide to Digital Marketing for High School Students',
    excerpt:
      'Learn digital marketing as a teen! How to build brands, earn online, and grow real-world skills. Perfect for high school students looking to start their digital journey...',
    date: 'April 17, 2025',
    readTime: '10 min read',
    category: 'Digital Marketing',
    link: '/blog/digital-marketing-for-high-schoolers',
  },
  {
    title: 'No-Code Tools Every Teen Creator Should Try This Summer',
    excerpt:
      'Create apps, websites, and businesses without coding—perfect for teen creators this summer. Discover the best no-code tools and start building today...',
    date: 'April 17, 2025',
    readTime: '8 min read',
    category: 'Technology',
    link: '/blog/no-code-tools-for-teen-creators',
  },
  {
    title: 'How I Built My First Startup as a Student (And How You Can TOO)',
    excerpt:
      'A real teen founder shares how he built his first startup while still in school. Get inspired and start yours. From school project to successful launch...',
    date: 'April 17, 2025',
    readTime: '10 min read',
    category: 'Entrepreneurship',
    link: '/blog/teen-startup-journey-student-story',
  },
  {
    title: 'AI for Teenagers: Learn the Future Without Coding',
    excerpt:
      'Explore how teenagers can start learning AI without coding—using no-code tools, real-world projects, and beginner-friendly platforms. Start building with AI today...',
    date: 'April 17, 2025',
    readTime: '8 min read',
    category: 'Technology',
    link: '/blog/ai-for-teenagers-no-code',
  },
  {
    title: 'Top 5 Summer Bootcamps for Teenagers in India (2025 Edition)',
    excerpt:
      'Discover the best summer bootcamps where Indian teens can learn AI, coding, entrepreneurship & digital skills. Find the perfect program to kickstart your tech journey...',
    date: 'April 17, 2025',
    readTime: '8 min read',
    category: 'Education',
    link: '/blog/summer-bootcamps-2025',
  },
  {
    title: 'How to Start a Business Before You Turn 18 (No Code, No Problem!)',
    excerpt:
      'Learn how to start a business before 18 using no-code tools. Build real products, grow your brand, and become a teen entrepreneur without writing a single line of code...',
    date: 'April 17, 2025',
    readTime: '8 min read',
    category: 'Entrepreneurship',
    link: '/blog/teen-business',
  },
  {
    title: 'How Maximally is Building the Leangap of India',
    excerpt:
      "Discover how Maximally is becoming India's answer to Leangap, empowering teens to start companies and build real projects. From mentorship to real outcomes, see how we're revolutionizing teen entrepreneurship...",
    date: 'April 17, 2025',
    readTime: '5 min read',
    category: 'Entrepreneurship',
    link: '/blog/maximally-leangap-2025',
  },
  {
    title:
      "Why School Doesn't Teach You Real Life (And What We're Doing About It)",
    excerpt:
      "From straight A's to real-world confusion - discover how Maximally is bridging the gap between academic excellence and practical life skills that schools don't teach...",
    date: 'April 17, 2025',
    readTime: '5 min read',
    category: 'Education',
  },
  {
    title: 'Top 10 Summer Programs for Teens in India (2025 Edition)',
    excerpt:
      "Discover the most impactful summer programs that will transform your skills and boost your college applications. From Maximally's intensive bootcamps to other notable programs...",
    date: 'April 10, 2025',
    readTime: '8 min read',
    category: 'Education',
  },
  {
    title:
      'How to Make the Most of Your Summer Break (For Students Ages 13–20)',
    excerpt:
      "Turn your summer break into a launchpad for success! Learn why joining Maximally's skill-focused bootcamps should be your #1 priority this summer...",
    date: 'April 10, 2025',
    readTime: '6 min read',
    category: 'Career Development',
  },
  {
    title: 'Why Real-World Skills Matter More Than Marks in 2025',
    excerpt:
      "The truth about marks vs. skills in today's job market. See how 87% of employers now prioritize practical skills over academic scores, and why Maximally's approach works...",
    date: 'April 10, 2025',
    readTime: '10 min read',
    category: 'Industry Insights',
  },
  {
    title: 'Best Online Courses for Teenagers in India (Free + Paid)',
    excerpt:
      "A comprehensive guide to the top online learning platforms for teens. Starting with Maximally's innovative bootcamps, explore options that fit your learning style...",
    date: 'April 10, 2025',
    readTime: '12 min read',
    category: 'Reviews',
  },
  {
    title: 'How to Get Internships in High School (Ultimate Guide)',
    excerpt:
      "Your step-by-step roadmap to landing amazing internships while in high school. Learn how Maximally's Career Starter Pack bootcamp can give you the edge...",
    date: 'April 10, 2025',
    readTime: '15 min read',
    category: 'Career Guide',
    link: '/blog/internships-2025',
  },
];
const POSTS_PER_PAGE = 10;

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data: dynamicBlogData, isLoading: dynamicLoading } = useBlogs(1, 1000, '');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allPosts = useMemo(() => {
    const staticPosts: BlogCardProps[] = blogPosts.map(post => ({
      title: post.title,
      excerpt: post.excerpt,
      date: format(new Date(post.date), 'MMMM d, yyyy'),
      readTime: post.readTime,
      category: post.category,
      link: post.link,
      coverImage: undefined, // Static posts don't have cover images in the current data
      authorName: undefined, // Static posts don't have author names in the current data
    }));

    const dynamicPosts: BlogCardProps[] = (dynamicBlogData?.data || []).map(post => ({
      title: post.title,
      excerpt: generateExcerpt(post.content),
      date: format(new Date(post.created_at), 'MMMM d, yyyy'),
      readTime: calculateReadTime(post.content),
      category: post.tags || 'AI Hackathons',
      link: `/blog/${post.slug}`,
      coverImage: post.cover_image,
      authorName: post.author_name,
    }));

    // Combine and sort by date (most recent first)
    const combined = [...dynamicPosts, ...staticPosts];
    return combined.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [dynamicBlogData]);

  const filteredPosts = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return allPosts;
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    return allPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.category.toLowerCase().includes(searchLower)
    );
  }, [allPosts, debouncedSearchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Handle pagination
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFirstPage = useCallback(() => {
    setCurrentPage(1);
    scrollToTop();
  }, [scrollToTop]);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
    scrollToTop();
  }, [scrollToTop]);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
    scrollToTop();
  }, [totalPages, scrollToTop]);

  const handleLastPage = useCallback(() => {
    setCurrentPage(totalPages);
    scrollToTop();
  }, [totalPages, scrollToTop]);

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
    scrollToTop();
  }, [scrollToTop]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
      <h1 className="font-press-start text-xl sm:text-2xl md:text-3xl text-maximally-black mb-6 sm:mb-8 text-center leading-tight">
        &gt;&gt; Maximally Blog_
      </h1>

      <div className="max-w-4xl mx-auto">
        <div className="relative mb-8 sm:mb-12">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maximally-black/50 h-5 w-5" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="font-jetbrains pl-12 h-12 sm:h-10 text-base sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading State */}
        {dynamicLoading && (
          <div className="space-y-6 md:space-y-8 mb-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="pixel-border bg-white p-4 md:p-6 lg:p-8 shadow-md">
                <div className="animate-pulse">
                  {/* Cover image placeholder for some cards */}
                  {index === 0 && (
                    <div className="mb-4">
                      <div className="relative w-full pixel-border bg-gray-200" style={{ aspectRatio: '16/9' }}></div>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                    <div className="pixel-border bg-gray-200 h-6 w-20"></div>
                    <div className="pixel-border bg-gray-200 h-4 w-24"></div>
                    <div className="pixel-border bg-gray-200 h-4 w-16"></div>
                  </div>
                  
                  <div className="pixel-border bg-gray-200 h-6 w-3/4 mb-3"></div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="pixel-border bg-gray-200 h-4 w-full"></div>
                    <div className="pixel-border bg-gray-200 h-4 w-2/3"></div>
                    <div className="pixel-border bg-gray-200 h-4 w-1/2"></div>
                  </div>
                  
                  <div className="pixel-border bg-gray-200 h-6 w-24"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results count */}
        {!dynamicLoading && (
          <div className="mb-6 font-jetbrains text-sm sm:text-base text-maximally-black/60">
            {filteredPosts.length > 0 ? (
              <>
                Showing {((currentPage - 1) * POSTS_PER_PAGE) + 1}-{Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length} posts
                {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
              </>
            ) : (
              <>No posts found{debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}</>
            )}
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="space-y-6 md:space-y-8">
          {paginatedPosts.map((post, index) => (
            <BlogCard
              key={`${post.title}-${index}`}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              readTime={post.readTime}
              category={post.category}
              link={post.link}
              coverImage={post.coverImage}
              authorName={post.authorName}
            />
          ))}
        </div>

        {/* No results message */}
        {!dynamicLoading && paginatedPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="font-press-start text-xl text-maximally-black mb-4">
              No posts found
            </h3>
            <p className="font-jetbrains text-maximally-black/70 mb-6">
              {debouncedSearchTerm 
                ? `No posts match your search for "${debouncedSearchTerm}"`
                : "No posts available at the moment"}
            </p>
            {debouncedSearchTerm && (
              <Button
                onClick={() => setSearchTerm('')}
                variant="outline"
                className="font-press-start"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!dynamicLoading && totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 sm:gap-6 mt-12 mb-8 pt-8 border-t border-maximally-black/10">
            
            <div className="flex items-center justify-center gap-1 sm:gap-2 order-1 sm:order-2 w-full sm:w-auto">
              {/* First Page Button */}
              <Button
                onClick={handleFirstPage}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="font-press-start min-h-[44px] px-3 sm:px-4 text-xs sm:text-sm flex-shrink-0 hover:bg-maximally-blue hover:text-white hover:border-maximally-blue transition-colors duration-200"
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">First</span>
              </Button>
              
              {/* Previous Page Button */}
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="font-press-start min-h-[44px] px-3 sm:px-4 text-xs sm:text-sm flex-shrink-0 hover:bg-maximally-blue hover:text-white hover:border-maximally-blue transition-colors duration-200"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Prev</span>
              </Button>
              
              {/* Current Page Indicator */}
              <div className="pixel-border bg-maximally-red text-white px-3 sm:px-4 py-2 font-press-start text-xs sm:text-sm min-h-[44px] flex items-center shadow-lg">
                <span className="hidden sm:inline">Page </span>
                <span className="mx-1 font-bold">{currentPage}</span>
                <span className="hidden sm:inline">of {totalPages}</span>
                <span className="sm:hidden">/{totalPages}</span>
              </div>
              
              {/* Next Page Button */}
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="font-press-start min-h-[44px] px-3 sm:px-4 text-xs sm:text-sm flex-shrink-0 hover:bg-maximally-blue hover:text-white hover:border-maximally-blue transition-colors duration-200"
                title="Next page"
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Last Page Button */}
              <Button
                onClick={handleLastPage}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="font-press-start min-h-[44px] px-3 sm:px-4 text-xs sm:text-sm flex-shrink-0 hover:bg-maximally-blue hover:text-white hover:border-maximally-blue transition-colors duration-200"
                title="Last page"
              >
                <span className="hidden sm:inline mr-1">Last</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Spacer before footer */}
      <div className="mt-16 sm:mt-20 md:mt-24"></div>
      
      <Footer />
    </div>
  );
};

export default Blog;
