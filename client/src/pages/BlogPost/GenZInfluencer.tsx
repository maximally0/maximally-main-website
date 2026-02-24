
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const GenZInfluencer = () => {
  const content = (
    <>
      <p className="lead mb-8">
        As a Gen Z teen, you've probably scrolled through Instagram, TikTok, or YouTube, wondering how influencers got their start. Maybe you've even thought, "Why not me?" The good news? Becoming a young influencer is within your reach.
      </p>

      <p className="mb-4">
        It's no longer a dream; it's a reality. Teen influencers are everywhere, from dancing to fashion, gaming to lifestyle, and even educational content. The best part? You don't need to wait until you're older or have a huge following to start building your personal brand.
      </p>

      <h2 className="font-space font-bold text-2xl mb-4">💡 What Does it Mean to Be a Gen Z Influencer?</h2>
      <p className="mb-8">
        A Gen Z influencer is someone from the Gen Z generation who uses platforms like TikTok, Instagram, YouTube, or even Twitch to share content, promote products, and connect with their audience. Unlike traditional celebrities, influencers are usually relatable, accessible, and skilled at building a genuine connection with their followers.
      </p>

      <h2 className="font-space font-bold text-2xl mb-4">🚀 How to Become a Gen Z Influencer:</h2>
      
      <h3 className="font-space font-bold text-xl mb-4">1. Identify Your Niche</h3>
      <p className="mb-4">Ask yourself:</p>
      <ul className="list-disc pl-6 mb-8">
        <li>What am I genuinely passionate about?</li>
        <li>What makes me stand out from others?</li>
        <li>Can I create content that people will love and want to share?</li>
      </ul>

      <h3 className="font-space font-bold text-xl mb-4">2. Choose Your Platform</h3>
      <ul className="list-disc pl-6 mb-8">
        <li>TikTok: Great for short, engaging videos</li>
        <li>Instagram: Ideal for curated content and stories</li>
        <li>YouTube: Best for longer-form content</li>
        <li>Twitch: Perfect for gaming and live streaming</li>
      </ul>

      <h3 className="font-space font-bold text-xl mb-4">3. Create Authentic Content</h3>
      <ul className="list-disc pl-6 mb-8">
        <li>Be yourself and show your personality</li>
        <li>Share behind-the-scenes content</li>
        <li>Use trends creatively</li>
      </ul>

      <h3 className="font-space font-bold text-xl mb-4">4. Engage With Your Audience</h3>
      <ul className="list-disc pl-6 mb-8">
        <li>Host Q&A sessions</li>
        <li>Respond to comments</li>
        <li>Create interactive content</li>
      </ul>

      <h3 className="font-space font-bold text-xl mb-4">5. Collaborate and Grow</h3>
      <ul className="list-disc pl-6 mb-8">
        <li>Partner with other creators</li>
        <li>Work with brands that align with your values</li>
        <li>Build meaningful relationships</li>
      </ul>

      <div className="pixel-border p-6 bg-maximally-blue/5 my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🎓 Ready to Start Your Influencer Journey?</h2>
        <p className="mb-4">
          At Maximally's Summer Bootcamp, you'll learn:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Personal brand development</li>
          <li>Content creation strategies</li>
          <li>Social media growth tactics</li>
          <li>Engagement and community building</li>
        </ul>
        <div className="text-center">
          <Button asChild size="lg" className="bg-black hover:bg-black/80">
            <Link to="/bootcamps">Join Summer Bootcamp 2025</Link>
          </Button>
        </div>
      </div>

      <h2 className="font-space font-bold text-2xl mb-4">📈 Start Small, Think Big</h2>
      <p className="mb-4">
        Remember, every successful influencer started with zero followers. The key is to start creating, stay consistent, and keep learning. Your unique voice and perspective matter!
      </p>
    </>
  );

  return (
    <BlogPost
      title="The Gen Z Guide to Becoming a Young Influencer"
      date="January 17, 2025"
      readTime="8 min read"
      content={content}
    />
  );
};

export default GenZInfluencer;
