
import BlogPost from '@/components/BlogPost';

const RealWorldSkills2025 = () => {
  const content = (
    <>
      <p className="lead font-space text-lg mb-6">
        It's 2025. You can memorize entire textbooks, score a 98%, and still be <em>clueless in a job interview.</em> Why? Because <strong>the world has changed</strong>, and the rules of success have flipped.
      </p>

      <blockquote className="pixel-border p-6 bg-maximally-blue/5 my-8">
        <p className="font-space font-bold">
          📉 Marks matter less.<br />
          🚀 Real-world skills matter more than ever.
        </p>
      </blockquote>

      <p className="mb-6">
        In fact, <strong>87% of employers</strong> now say they prioritize <strong>skills, attitude, and experience</strong> over academic scores. That's not a stat—it's a warning shot for every student still chasing marks like it's 2005.
      </p>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🎯 The Reality Check: Marks Don't Guarantee Success Anymore</h2>
        <p className="mb-4">You know the drill:<br />Study hard ➝ Top marks ➝ Top college ➝ Top job<br />Except… that ladder's broken.</p>
        
        <h3 className="font-space font-bold text-xl mb-4">Here's why:</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Most hiring is now skill-based</strong>, especially in startups and modern companies</li>
          <li><strong>AI and automation</strong> are replacing knowledge-based jobs</li>
          <li><strong>Your GPA doesn't show how well you pitch, lead, create, or adapt</strong></li>
          <li><strong>The best opportunities go to those who've <em>done</em> stuff</strong>, not just studied it</li>
        </ul>

        <blockquote className="italic text-maximally-black/80 border-l-4 border-maximally-blue pl-4 my-6">
          "We hire based on portfolios, not percentages."<br />
          — Literally every modern recruiter in 2025
        </blockquote>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">💡 What Do Employers Actually Look For?</h2>
        <p className="mb-4">Whether it's a global startup or an Ivy League college, here's what stands out on an application:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Problem-solving ability</strong></li>
          <li><strong>Communication & collaboration skills</strong></li>
          <li><strong>Initiative + leadership</strong></li>
          <li><strong>Creativity & adaptability</strong></li>
          <li><strong>Hands-on experience or personal projects</strong></li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🚀 Enter Maximally: India's Most Practical Bootcamps for Teens</h2>
        <p className="mb-4">At Maximally, we don't just <em>teach</em> real-world skills. We get teens to <strong>use</strong> them—live, in real projects, alongside equally driven peers.</p>
        
        <h3 className="font-space font-bold text-xl mb-4">Here's what our bootcamps unlock:</h3>
        <ul className="list-none pl-6 mb-4 space-y-4">
          <li>✅ <strong>Founder Mindset</strong> — Learn how to build startups, pitch ideas, and solve problems</li>
          <li>✅ <strong>Public Speaking & Influence</strong> — Speak like a TEDx pro, debate like a diplomat</li>
          <li>✅ <strong>Marketing & Branding</strong> — From reels to campaigns, master Gen Z marketing</li>
          <li>✅ <strong>No-Code & AI Tools</strong> — Automate work and build MVPs with zero coding</li>
          <li>✅ <strong>Content Creation</strong> — Edit, script, and storytell like a viral creator</li>
          <li>✅ <strong>Global Citizenship</strong> — Learn diplomacy, MUN, and 21st-century leadership</li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🔥 TL;DR: Marks Can't Keep Up. Skills Will Take You Further.</h2>
        <p className="mb-4">If you're still focusing <em>only</em> on marks in 2025, you're prepping for a race that no longer exists.</p>
        
        <blockquote className="pixel-border p-6 bg-maximally-red/5 my-8">
          <p className="font-space font-bold">
            📣 The new formula is:<br />
            <strong>Skills + Projects + Community + Mentorship = Actual Opportunities</strong>
          </p>
        </blockquote>
      </section>
    </>
  );

  return (
    <BlogPost
      title="Why Real-World Skills Matter More Than Marks in 2025"
      date="April 10, 2025"
      readTime="10 min read"
      content={content}
    />
  );
};

export default RealWorldSkills2025;
