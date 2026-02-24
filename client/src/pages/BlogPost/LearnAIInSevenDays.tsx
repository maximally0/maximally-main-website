
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LearnAIInSevenDays = () => {
  const content = (
    <>
      <p className="lead mb-8">
        Ever scrolled through your phone and wondered how those mind-blowing filters work? Or maybe you've chatted with a bot that almost felt… human? That's Artificial Intelligence (AI) in action, and guess what? You don't need to be a genius coder locked in a lab to understand it.
      </p>

      <h2 className="font-space font-bold text-2xl mb-4">🤖 What Exactly Is AI Anyway?</h2>
      <p className="mb-4">
        Simply put, AI is about making computers think and learn like humans. It involves creating algorithms (sets of instructions) that allow machines to perform tasks that typically require human intelligence, such as:
      </p>
      <ul className="list-disc pl-6 mb-8">
        <li>Learning: Improving performance over time based on data</li>
        <li>Problem-solving: Finding solutions to complex issues</li>
        <li>Decision-making: Choosing the best course of action</li>
        <li>Understanding language: Processing and responding to human speech and text</li>
        <li>Recognizing patterns: Identifying trends and anomalies in data</li>
      </ul>

      <h2 className="font-space font-bold text-2xl mb-4">📅 Your 7-Day AI Learning Adventure</h2>
      
      <h3 className="font-space font-bold text-xl mb-4">Day 1: Unmasking the Basics</h3>
      <p className="mb-4">Dive into core concepts of AI, machine learning, and deep learning. Think about Netflix recommending movies—that's machine learning analyzing your viewing history!</p>

      <h3 className="font-space font-bold text-xl mb-4">Day 2: Getting Hands-On with Visual AI</h3>
      <p className="mb-4">Explore how computers "see" through image recognition and object detection. Just like how self-driving cars identify traffic lights and pedestrians.</p>

      <h3 className="font-space font-bold text-xl mb-4">Day 3: Natural Language Processing</h3>
      <p className="mb-4">Discover how computers understand human language through text analysis and chatbots. Ever used Google Translate? That's NLP in action!</p>

      <h3 className="font-space font-bold text-xl mb-4">Day 4: Machine Learning Basics</h3>
      <p className="mb-4">Learn how machines learn from data. Your email's spam filter? That's machine learning spotting unwanted messages.</p>

      <h3 className="font-space font-bold text-xl mb-4">Day 5: Real-World Applications</h3>
      <p className="mb-4">See AI in action across industries—from healthcare and education to entertainment and environmental conservation.</p>

      <h3 className="font-space font-bold text-xl mb-4">Day 6: Ethics in AI</h3>
      <p className="mb-4">Tackle important questions about AI ethics, bias, privacy, and societal impact.</p>

      <h3 className="font-space font-bold text-xl mb-4">Day 7: Your AI Future</h3>
      <p className="mb-4">Map out your next steps in AI learning and explore exciting career opportunities in the field.</p>

      <div className="pixel-border p-6 bg-maximally-blue/5 my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🚀 Ready to Master AI?</h2>
        <p className="mb-4">
          Join Maximally's AI Bootcamp and learn the fundamentals in just 7 days! You'll get:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Hands-on practice with real AI tools</li>
          <li>Expert guidance from industry mentors</li>
          <li>Project-based learning experience</li>
          <li>Certificate of completion</li>
        </ul>
        <div className="text-center">
          <Button asChild size="lg" className="bg-black hover:bg-black/80">
            <Link to="/no-code-ai">Join AI Bootcamp Today</Link>
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <BlogPost
      title="Can Teenagers Really Learn AI in 7 Days? Here's How."
      date="January 17, 2025"
      readTime="8 min read"
      content={content}
    />
  );
};

export default LearnAIInSevenDays;
