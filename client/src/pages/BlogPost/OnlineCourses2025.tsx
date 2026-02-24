
import BlogPost from '@/components/BlogPost';

const OnlineCourses2025 = () => {
  const content = (
    <>
      <p className="lead font-space text-lg mb-6">
        The internet is bursting with opportunities to learn, but with so many courses out there, it's hard to know where to start—especially if you're a teenager trying to make the most of your time.
      </p>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🚀 1. Maximally Summer Bootcamps (Paid)</h2>
        <p className="mb-4"><strong>Ages</strong>: 13–20<br /><strong>Cost</strong>: ₹799–₹4000<br /><strong>Best For</strong>: Aspiring entrepreneurs, creators, and future leaders</p>
        
        <h3 className="font-space font-bold text-xl mb-4">Why Maximally Rocks:</h3>
        <p className="mb-4">Maximally is a high-impact <strong>bootcamp platform</strong> offering 6 immersive courses that focus on the <strong>skills that matter in 2025</strong>.</p>
        
        <ul className="list-none pl-6 mb-4 space-y-4">
          <li>✨ <strong>Founder Lab (Entrepreneurship Bootcamp)</strong> – Learn how to start a business, create a pitch, and launch a product</li>
          <li>🎤 <strong>Speak Mode (Public Speaking & Debate)</strong> – Master public speaking and debate</li>
          <li>📱 <strong>Digital Arsenal (Marketing & Branding)</strong> – Learn digital marketing and social media strategy</li>
          <li>🤖 <strong>No-Code & AI Tools</strong> – Build apps without coding</li>
          <li>🎬 <strong>Story Studio (Video Editing & Storytelling)</strong> – Create engaging content</li>
          <li>🌍 <strong>MUN & Global Citizenship</strong> – Gain leadership skills through Model United Nations</li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">💡 2. Coursera (Free + Paid)</h2>
        <p className="mb-4"><strong>Best For</strong>: Teenagers looking for flexible, university-level courses<br /><strong>Cost</strong>: Free (audit) or Paid (certificate)</p>
        
        <p className="mb-4">Partners with universities like <strong>Stanford, Yale, and the University of London</strong> to offer courses in everything from computer science to business management.</p>
        
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>World-class content</strong> from leading universities</li>
          <li>Courses for <strong>all levels</strong>, from beginners to advanced</li>
          <li><strong>Free auditing</strong> for most courses</li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🔍 3. Udemy (Paid)</h2>
        <p className="mb-4"><strong>Best For</strong>: Self-paced learning on various topics<br /><strong>Cost</strong>: ₹500–₹5,000 per course</p>
        
        <p className="mb-4">One of the <strong>largest online course platforms</strong> in the world, offering thousands of courses across topics like coding, graphic design, music, and photography.</p>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🌱 4. edX (Free + Paid)</h2>
        <p className="mb-4"><strong>Best For</strong>: Teens who want access to Ivy League education<br /><strong>Cost</strong>: Free (audit) or Paid (certificate)</p>
        
        <p className="mb-4">Take <strong>free courses from Harvard, MIT</strong>, and other prestigious institutions. Topics range from science to entrepreneurship to philosophy.</p>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">💻 Other Notable Platforms</h2>
        <ul className="list-none pl-6 mb-4 space-y-4">
          <li>🎨 <strong>Skillshare</strong> – Perfect for creative skills (₹400–₹1,200/month)</li>
          <li>📚 <strong>LinkedIn Learning</strong> – Professional development courses</li>
          <li>📈 <strong>Khan Academy</strong> – Free foundational learning in math, science, and more</li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🎯 Conclusion: Choose What Works for You</h2>
        <p className="mb-4">Whether you're looking to develop technical skills, express your creativity, or prepare for your dream career, there are plenty of online courses to help you unlock your full potential.</p>
        
        <blockquote className="pixel-border p-6 bg-maximally-blue/5 my-8">
          <p className="font-space font-bold">
            💡 Pro Tip: For hands-on learning and real-world skills that matter in 2025, Maximally's bootcamps offer the perfect blend of practical experience and expert mentorship.
          </p>
        </blockquote>
      </section>
    </>
  );

  return (
    <BlogPost
      title="Best Online Courses for Teenagers in India (Free + Paid)"
      date="April 10, 2025"
      readTime="12 min read"
      content={content}
    />
  );
};

export default OnlineCourses2025;
