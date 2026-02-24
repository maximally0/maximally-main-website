
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TopCareersForTeens = () => {
  const content = (
    <>
      <p className="lead mb-8">
        As a teen, you probably already have a lot of interests and passions. But if you're like many others, you might feel the pressure of needing to follow a traditional career path that includes years of university study. The truth is, the world is changing—and so are career paths.
      </p>

      <h2 className="font-space font-bold text-2xl mb-4">Why Choose a Career Path Without a Degree?</h2>
      <div className="mb-6">
        <p className="mb-4">In today's world, a college degree isn't the only path to success. Many teens are building careers through their skills, creativity, and entrepreneurial spirit. Here's why:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Practical experience over theoretical learning</li>
          <li>More time to innovate and create</li>
          <li>Faster path to financial independence</li>
        </ul>
      </div>

      <h2 className="font-space font-bold text-2xl mb-4">Top Career Paths for Teen Innovators</h2>
      
      <div className="mb-6">
        <h3 className="font-space font-bold text-xl mb-3">1. Entrepreneurship 🚀</h3>
        <p className="mb-4">
          Start your own business and bring innovative ideas to life. With the digital economy, young entrepreneurs 
          can launch globally-reaching businesses with minimal startup costs.
        </p>
        <p className="text-maximally-black/70 mb-4">
          Success Story: Ben Pasternak started his first tech company at 15, later raising millions in investment.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-space font-bold text-xl mb-3">2. Content Creation & Social Media 📱</h3>
        <p className="mb-4">
          Build a career sharing your ideas and talents with a global audience through platforms like YouTube, 
          TikTok, and Instagram.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-space font-bold text-xl mb-3">3. Digital Marketing & SEO 📊</h3>
        <p className="mb-4">
          Help businesses grow online through social media, SEO, content marketing, and email campaigns. 
          Learn valuable skills that are increasingly in demand.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-space font-bold text-xl mb-3">4. Web & App Development 💻</h3>
        <p className="mb-4">
          Create websites and apps that solve real problems. Start with no-code tools or dive deep into 
          programming languages like Python and JavaScript.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-space font-bold text-xl mb-3">5. Graphic Design & Animation 🎨</h3>
        <p className="mb-4">
          Turn your artistic talents into a career through logo design, advertisements, web design, and animations. 
          Build a freelance business or start a design agency.
        </p>
      </div>

      <div className="pixel-border p-6 bg-maximally-blue/5 my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Ready to Start Your Career Journey? 🎯</h2>
        <p className="mb-4">
          Don't wait for the traditional path—start building your career now with Maximally's Career Launch Bootcamp. 
          Get hands-on experience, expert mentorship, and join a community of teen innovators.
        </p>
        <div className="text-center">
          <Button asChild size="lg" className="bg-black hover:bg-black/80">
            <Link to="/career-launch">Join Career Launch Bootcamp</Link>
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <BlogPost
      title="Top Career Paths for Teen Innovators (That Don't Need a Degree Yet)"
      date="January 17, 2025"
      readTime="8 min read"
      content={content}
    />
  );
};

export default TopCareersForTeens;
