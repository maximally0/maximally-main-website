
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const YoutubeVsStartup = () => {
  const content = (
    <>
      <p className="lead mb-8">
        You're a teenager with a brilliant idea. Maybe it's a product that solves a common problem, or perhaps it's a unique perspective you'd love to share with the world. In today's digital landscape, two powerful avenues stand out for teen entrepreneurs: launching a YouTube channel or starting your own startup.
      </p>

      <h2 className="font-space font-bold text-2xl mb-4">Understanding the Two Paths</h2>
      
      <h3 className="font-space font-bold text-xl mb-4">Starting a YouTube Channel 🎥</h3>
      <div className="mb-6">
        <p className="mb-4">The Digital Creator's Journey offers several advantages:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Low Entry Barrier: Start with just a smartphone and internet</li>
          <li>Skill Development: Learn video editing, storytelling, and marketing</li>
          <li>Audience Building: Connect with viewers worldwide</li>
          <li>Monetization Opportunities: Earn through various channels</li>
        </ul>
        <p className="text-maximally-black/70">However, it requires consistency, understanding algorithms, and patience for growth.</p>
      </div>

      <h3 className="font-space font-bold text-xl mb-4">Launching a Startup 🚀</h3>
      <div className="mb-6">
        <p className="mb-4">The Entrepreneur's Path comes with its own benefits:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Problem Solving: Create real solutions for real issues</li>
          <li>Financial Potential: Opportunity for significant returns</li>
          <li>Skill Acquisition: Learn business, leadership, and operations</li>
        </ul>
        <p className="text-maximally-black/70">But be prepared for higher risks, time commitment, and regulatory challenges.</p>
      </div>

      <h2 className="font-space font-bold text-2xl mb-4">Success Stories That Inspire</h2>
      
      <div className="mb-6">
        <h3 className="font-space font-bold text-xl mb-3">Alex Costa: Content Creator to E-commerce Success</h3>
        <p className="mb-4">
          Started as a YouTuber focused on men's fashion and grooming, leveraged his following to launch Forte Series, 
          a successful hair care brand projected to generate $10 million in revenue by 2025.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-space font-bold text-xl mb-3">Bella Weems: Teen Jewelry Mogul</h3>
        <p className="mb-4">
          Founded Origami Owl at 14, turning a dream of earning money for a car into a multi-million dollar 
          customizable jewelry company employing thousands.
        </p>
      </div>

      <div className="pixel-border p-6 bg-maximally-blue/5 my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🎯 Ready to Start Your Journey?</h2>
        <p className="mb-4">
          Whether you choose content creation or startup building, Maximally's Entrepreneurship Bootcamp equips you with the skills, 
          mentorship, and community support you need to succeed.
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Learn from successful founders and creators</li>
          <li>Build your business plan or content strategy</li>
          <li>Connect with like-minded teen entrepreneurs</li>
          <li>Get hands-on experience with real projects</li>
        </ul>
        <div className="text-center">
          <Button asChild size="lg" className="bg-black hover:bg-black/80">
            <Link to="/makeathon">Join Startup Makeathon</Link>
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <BlogPost
      title="Should You Start a YouTube Channel or a Startup First?"
      date="January 17, 2025"
      readTime="8 min read"
      content={content}
    />
  );
};

export default YoutubeVsStartup;
