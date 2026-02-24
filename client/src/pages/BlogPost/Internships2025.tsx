
import BlogPost from '@/components/BlogPost';

const Internships2025 = () => {
  const content = (
    <>
      <section className="my-8">
        <p className="mb-4">Landing an internship in high school can be a game-changer, opening doors to real-world experiences, networking, and building your career early. But here's the reality: <strong>It's not as easy as sending out a couple of resumes</strong>.</p>
        
        <h2 className="font-space font-bold text-2xl mb-4">🚀 Why High School Internships Are So Important</h2>
        <p className="mb-4">Before we dive into the how-tos, let's talk about why internships matter so much for high schoolers.</p>
        
        <ul className="list-none space-y-4 mb-6">
          <li>
            <strong className="font-space font-bold">1. Hands-on experience</strong>
            <p>Internships give you real-world experience that you can't get from textbooks or class lectures.</p>
          </li>
          <li>
            <strong className="font-space font-bold">2. Networking opportunities</strong>
            <p>Internships allow you to build connections with industry professionals, mentors, and other interns.</p>
          </li>
          <li>
            <strong className="font-space font-bold">3. Strengthen your resume</strong>
            <p>Having an internship shows future employers and colleges that you're serious and proactive.</p>
          </li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🎯 Step-by-Step Guide to Landing Your Internship</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-space font-bold text-xl mb-2">Step 1: Build Skills That Employers Want</h3>
            <p>Through Maximally's Career Starter Pack bootcamp, you'll learn:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Professional communication</li>
              <li>Problem-solving</li>
              <li>Digital marketing and branding</li>
              <li>Time management</li>
            </ul>
          </div>

          <div>
            <h3 className="font-space font-bold text-xl mb-2">Step 2: Create a Killer Resume</h3>
            <p>Focus on skills, achievements, and relevant experience. Include projects from Maximally bootcamps in your portfolio.</p>
          </div>

          <div>
            <h3 className="font-space font-bold text-xl mb-2">Step 3: Research Companies</h3>
            <p>Look for opportunities in local businesses, startups, and nonprofits where your skills align.</p>
          </div>

          <div>
            <h3 className="font-space font-bold text-xl mb-2">Step 4: Network Effectively</h3>
            <p>Build professional connections, attend events, and don't be afraid to reach out directly.</p>
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🔥 How Maximally Helps You Stand Out</h2>
        <p className="mb-4">Our Career Starter Pack bootcamp gives you:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Real-world experience through hands-on projects</li>
          <li>Networking opportunities with mentors</li>
          <li>Skills that employers actually value</li>
          <li>Interview preparation and confidence building</li>
        </ul>

        <blockquote className="pixel-border p-6 bg-maximally-blue/5 my-8">
          <p className="font-space font-bold">
            💡 Pro Tip: Combine your internship search with Maximally's bootcamps to maximize your chances of success.
          </p>
        </blockquote>
      </section>
    </>
  );

  return (
    <BlogPost
      title="How to Get Internships in High School (Ultimate Guide)"
      date="April 10, 2025"
      readTime="15 min read"
      content={content}
    />
  );
};

export default Internships2025;
