
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TeenEntrepreneurshipBootcamp = () => {
  const content = (
    <>
      <p className="lead mb-8">
        Have you ever had an idea for a business and wondered how to turn it into a reality? Maybe you've seen successful teen entrepreneurs like Ben Pasternak or Alina Morse who started their businesses as teens and thought, "I can do that!"
      </p>

      <p className="mb-4">
        If that sounds like you, then a teen startup bootcamp might be just what you need. These programs are designed to help young, aspiring entrepreneurs like yourself develop the skills, mindset, and network to launch your own business.
      </p>

      <h2 className="font-space font-bold text-2xl mb-4">💡 What is a Teen Startup Bootcamp?</h2>
      <p className="mb-4">
        A teen startup bootcamp is an immersive, intensive program designed to teach young people about entrepreneurship, business strategy, marketing, and how to launch their own startups. These bootcamps are typically short-term, lasting from a few days to a couple of weeks, and are led by experienced entrepreneurs, business mentors, and industry professionals.
      </p>

      <h2 className="font-space font-bold text-2xl mb-4">🚀 What Happens Inside a Teen Startup Bootcamp?</h2>
      
      <h3 className="font-space font-bold text-xl mb-4">1. Immersive Learning: Business Fundamentals</h3>
      <p className="mb-4">From day one, you'll dive straight into learning the fundamentals of business:</p>
      <ul className="list-disc pl-6 mb-8">
        <li>Business Models: Design sustainable business models</li>
        <li>Marketing & Branding: Digital marketing and social media strategy</li>
        <li>Pitching & Fundraising: Learn to pitch to investors</li>
        <li>Leadership: Team building and management skills</li>
      </ul>

      <h3 className="font-space font-bold text-xl mb-4">2. Hands-On Projects</h3>
      <ul className="list-disc pl-6 mb-8">
        <li>Team Projects: Collaborate with other teens</li>
        <li>Develop Your Business Idea: Create plans and prototypes</li>
        <li>Get Feedback: Learn from mentors and professionals</li>
      </ul>

      <h3 className="font-space font-bold text-xl mb-4">3. Networking Opportunities</h3>
      <p className="mb-8">
        Connect with like-minded teens, successful mentors, and even potential investors who can help turn your ideas into reality.
      </p>

      <div className="pixel-border p-6 bg-maximally-blue/5 my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🎓 Ready to Start Your Entrepreneurial Journey?</h2>
        <p className="mb-4">
          At Maximally's Entrepreneurship Bootcamp, you'll learn:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Business fundamentals and strategy</li>
          <li>Marketing and branding</li>
          <li>Pitching and presentation skills</li>
          <li>Leadership and team management</li>
        </ul>
        <div className="text-center">
          <Button asChild size="lg" className="bg-black hover:bg-black/80">
            <Link to="/bootcamps">Join Maximally Bootcamp 2025</Link>
          </Button>
        </div>
      </div>

      <h2 className="font-space font-bold text-2xl mb-4">💪 Take Action Now</h2>
      <p className="mb-4">
        Don't wait for the perfect moment—start building your business today. Whether you want to create a tech startup, launch a product, or build a brand, the skills you'll learn at a teen entrepreneurship bootcamp will set you up for success.
      </p>
    </>
  );

  return (
    <BlogPost
      title="What It's Really Like Inside a Teen Entrepreneurship Bootcamp"
      date="January 17, 2025"
      readTime="8 min read"
      content={content}
    />
  );
};

export default TeenEntrepreneurshipBootcamp;
