
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DigitalMarketingGuide = () => {
  const content = (
    <>
      <p className="lead mb-8">
        💡 What If You Could Grow a Brand, Go Viral, and Earn—All Before Graduation?
      </p>

      <p className="mb-4">
        Imagine being 16 and already managing an Instagram page for a business, designing ads, or even running a personal brand that makes money. Sounds like a dream? Not anymore.
      </p>

      <p className="mb-8">
        Digital marketing for teens is one of the fastest-growing opportunities for high schoolers in 2025. You don't need a business degree, investment, or even coding knowledge—just curiosity, creativity, and consistency.
      </p>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">What Is Digital Marketing?</h2>
        <p className="mb-4">Digital marketing is how businesses promote their products and connect with customers online—through social media, search engines, websites, emails, and content.</p>
        <p className="mb-4">If you've ever:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Seen an Instagram ad</li>
          <li>Searched for "best phone under ₹20,000" on Google</li>
          <li>Clicked a YouTube thumbnail that said "Watch this before buying!"...</li>
        </ul>
        <p>You've already experienced digital marketing in action.</p>
      </section>

      <section className="pixel-border p-6 bg-maximally-green/5 my-8">
        <h3 className="font-space font-bold text-xl mb-4">✅ Why It's Perfect for Teens:</h3>
        <ul className="list-disc pl-6">
          <li>You already know how platforms work (you're on them every day!)</li>
          <li>Businesses love Gen Z perspectives</li>
          <li>You can start with zero investment using free tools and no-code platforms</li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Core Areas of Digital Marketing for Teens</h2>
        
        <div className="space-y-6">
          <div className="pixel-border p-6">
            <h3 className="font-space font-bold text-xl mb-2">📱 Social Media Marketing</h3>
            <p className="mb-4">This is where most teens start—and thrive.</p>
            <p className="mb-2">Learn how to:</p>
            <ul className="list-disc pl-6">
              <li>Create viral content (reels, memes, carousels)</li>
              <li>Schedule posts using tools like Buffer</li>
              <li>Analyze engagement to grow your page</li>
            </ul>
          </div>

          <div className="pixel-border p-6">
            <h3 className="font-space font-bold text-xl mb-2">🧠 Content Marketing</h3>
            <p className="mb-4">This involves blogs, videos, and newsletters. It helps build trust and drives traffic to websites or pages.</p>
            <div className="bg-maximally-blue/5 p-4 rounded">
              <p className="font-space font-bold text-sm mb-2">Try starting:</p>
              <ul className="list-disc pl-6">
                <li>A blog on topics you love (gaming, study hacks, fashion)</li>
                <li>A YouTube Shorts channel</li>
                <li>A weekly newsletter using tools like Substack</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Tools to Get Started</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="pixel-border p-4">
            <h4 className="font-space font-bold text-lg mb-2">Canva</h4>
            <p>Design everything (posts, ads)</p>
          </div>
          <div className="pixel-border p-4">
            <h4 className="font-space font-bold text-lg mb-2">Notion</h4>
            <p>Plan content, strategy, ideas</p>
          </div>
          <div className="pixel-border p-4">
            <h4 className="font-space font-bold text-lg mb-2">Buffer/Later</h4>
            <p>Schedule social media posts</p>
          </div>
          <div className="pixel-border p-4">
            <h4 className="font-space font-bold text-lg mb-2">Linktree</h4>
            <p>Create a clean bio link page</p>
          </div>
        </div>
      </section>

      <section className="pixel-border p-6 bg-maximally-purple/5 my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🚀 Ready to Learn by Doing?</h2>
        <p className="mb-4">Join Maximally's Digital Marketing Bootcamp and learn to build brands, startups, and digital projects using no-code and AI tools.</p>
        <div className="text-center">
          <Button asChild size="lg" className="bg-black hover:bg-black/80">
            <Link to="/bootcamps">Join Digital Marketing Bootcamp</Link>
          </Button>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Final Thoughts: You Don't Need to Wait</h2>
        <p className="mb-4">If you're 13–18 and interested in content, tech, or business—digital marketing is the perfect starting point.</p>
        <p className="mb-4">It's where creativity meets business. Where likes turn into leads. Where your side project could be your first startup.</p>
        <p className="font-space font-bold">Start today. Learn. Build. Grow.</p>
      </section>
    </>
  );

  return (
    <BlogPost
      title="The Ultimate Guide to Digital Marketing for High School Students"
      date="April 17, 2025"
      readTime="10 min read"
      content={content}
    />
  );
};

export default DigitalMarketingGuide;
