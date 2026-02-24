import BlogPost from '../../components/BlogPost';

const MakeathonFAQ = () => {
  const content = (
    <div className="space-y-6">
      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">What Is the Maximally Makeathon?</h2>
      <p>
        The Maximally Makeathon is India's most future-forward, one-week startup bootcamp designed specifically for teens aged 13 to 18. It gives students a real taste of what it means to be an entrepreneur — from brainstorming ideas and building teams to creating prototypes and pitching in front of real investors.
      </p>

      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">Who Can Join the Makeathon?</h2>
      <p>
        Any student between 13 to 18 years old, from any school board or background, can apply. Whether you're a tech geek, a curious designer, or just someone with wild ideas — this is for you. No prior experience in startups or coding is needed. In fact, most participants are first-time builders!
      </p>

      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">What Do Students Learn?</h2>
      <p>
        Over the course of 7 days, students go through a high-energy, high-impact learning journey:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Ideation & Problem Solving</strong></li>
        <li><strong>Design Thinking & UI/UX</strong></li>
        <li><strong>Market Research & User Validation</strong></li>
        <li><strong>No-Code Development Tools</strong></li>
        <li><strong>Pitching & Presentation Skills</strong></li>
        <li><strong>Leadership & Team Collaboration</strong></li>
      </ul>

      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">How Are Teams Formed?</h2>
      <p>
        We form teams strategically by pairing students with different strengths: techies, creatives, analysts, presenters, etc. This simulates real startup environments where diverse teams drive innovation.
      </p>

      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">Is It Safe and Supervised?</h2>
      <p>
        Absolutely. All sessions are held in safe, monitored spaces, and participants are guided by trained facilitators and mentors. If it's a residential program, accommodations are fully secured, and we maintain 24/7 adult supervision.
      </p>

      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">What Happens on Demo Day?</h2>
      <p>
        On the final day, teams pitch their startup to a panel of real investors, founders, and industry mentors. Top teams may get awards, incubation opportunities, or even early-stage mentorship from Maximally's startup network.
      </p>

      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">What Do Parents Need to Know?</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Time Commitment:</strong> 1 week (fully immersive)</li>
        <li><strong>Tech Safety:</strong> We use secured platforms and provide guidance on using tools</li>
        <li><strong>Skill-Building:</strong> Focus on 21st-century skills — critical thinking, collaboration, creativity</li>
        <li><strong>Recognition:</strong> All participants receive certificates; winning teams get featured across Maximally's channels</li>
      </ul>

      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">What Tools Will Students Learn?</h2>
      <p>
        Students gain hands-on experience with professional-grade tools used by real startups:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Design:</strong> Figma for UI/UX design and prototyping</li>
        <li><strong>Development:</strong> No-code platforms like Bubble, Webflow, and Glide</li>
        <li><strong>AI Integration:</strong> ChatGPT, Canva API, and other AI tools</li>
        <li><strong>Project Management:</strong> Notion, Slack, and collaboration platforms</li>
        <li><strong>Research:</strong> User interview techniques and market analysis tools</li>
      </ul>

      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">Do I Need Coding Experience?</h2>
      <p>
        Not at all! Over 60% of our successful participants start with zero coding experience. We focus on no-code tools and teach you to think like an entrepreneur first, technologist second. Many of our most successful projects come from non-technical participants who excel at understanding user problems and creating business solutions.
      </p>

      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">What If I Don't Have a Team?</h2>
      <p>
        No worries! Most participants come individually, and we have a structured team formation process. We pair students based on complementary skills, interests, and working styles. Many of our strongest teams are formed during the event itself.
      </p>

      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">What Kind of Projects Do Students Build?</h2>
      <p>
        Students tackle real-world problems across various sectors:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>EdTech:</strong> Learning platforms, study tools, and educational games</li>
        <li><strong>HealthTech:</strong> Mental health apps, fitness trackers, and medical information systems</li>
        <li><strong>FinTech:</strong> Financial literacy tools, budgeting apps, and payment solutions</li>
        <li><strong>Social Impact:</strong> Environmental solutions, community platforms, and awareness campaigns</li>
        <li><strong>E-commerce:</strong> Marketplace platforms, local business solutions, and consumer apps</li>
      </ul>

      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">How Much Does It Cost?</h2>
      <p>
        We believe financial barriers shouldn't prevent talented students from participating. Maximally offers various pricing options including early bird discounts, scholarships for underrepresented students, and payment plans. Contact us for specific pricing information and scholarship opportunities.
      </p>

      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">What Happens After the Makeathon?</h2>
      <p>
        The learning doesn't stop after 7 days:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Continued Mentorship:</strong> Access to our mentor network for ongoing guidance</li>
        <li><strong>Alumni Community:</strong> Join a network of young entrepreneurs across India</li>
        <li><strong>Incubation Opportunities:</strong> Top projects may receive continued support and funding</li>
        <li><strong>Skills Certification:</strong> Recognition for skills developed during the program</li>
        <li><strong>College Application Support:</strong> Documentation and references for academic applications</li>
      </ul>

      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">How Do I Prepare for the Makeathon?</h2>
      <p>
        <strong>Before the Event:</strong>
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Think about problems you notice in your daily life</li>
        <li>Research startup stories and entrepreneurial journeys</li>
        <li>Practice explaining your ideas clearly to others</li>
        <li>Come with an open mind and willingness to learn</li>
      </ul>

      <p>
        <strong>What to Bring:</strong>
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Laptop with reliable internet connection</li>
        <li>Notebook and pen for brainstorming</li>
        <li>Positive attitude and collaborative mindset</li>
        <li>Questions and curiosity about entrepreneurship</li>
      </ul>

      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">Is This Just for Future Entrepreneurs?</h2>
      <p>
        Absolutely not! The skills developed during the makeathon—critical thinking, problem-solving, collaboration, communication, and innovation—are valuable for any career path. Whether you become a doctor, engineer, teacher, or artist, these entrepreneurial skills will make you more effective and successful.
      </p>

      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">How Is This Different from School Projects?</h2>
      <p>
        Unlike traditional school projects with predetermined answers, makeathons involve:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Real-world problems</strong> without obvious solutions</li>
        <li><strong>Professional tools</strong> used by actual companies</li>
        <li><strong>Industry mentors</strong> with startup experience</li>
        <li><strong>User feedback</strong> from real potential customers</li>
        <li><strong>Time pressure</strong> that mirrors professional environments</li>
        <li><strong>Team collaboration</strong> with diverse skill sets</li>
      </ul>

      <h2 className="text-2xl font-space font-bold text-maximally-black mt-8 mb-4">Still Have Questions?</h2>
      <p>
        Hundreds of teens have called the Maximally Makeathon the "most transformative week" of their lives. If you're curious about entrepreneurship, excited about solving problems, or just want to try something completely different, this experience is designed for you.
      </p>
      
      <p className="font-space font-bold text-maximally-blue">
        Ready to turn your ideas into reality? Apply now at Maximally.in
      </p>
    </div>
  );

  return (
    <BlogPost
      title="Maximally Makeathon FAQ: Everything Teens and Parents Need to Know Before Signing Up"
      date="January 11, 2025"
      readTime="8 min read"
      content={content}
    />
  );
};

export default MakeathonFAQ;