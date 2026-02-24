
import BlogPost from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TeenEntrepreneursIndia = () => {
  const content = (
    <>
      <p className="lead mb-8">
        In the heart of India's bustling cities and quiet towns, a silent revolution is underway. Teenagers, once confined to classrooms and textbooks, are now stepping into boardrooms and brainstorming sessions. Armed with innovative ideas, digital prowess, and an indomitable spirit, these young minds are redefining the entrepreneurial landscape of the nation.
      </p>

      <p className="mb-4">
        In a country brimming with youthful energy and a rapidly evolving digital landscape, the rise of young innovators isn't just exciting – it's essential. You, the teenagers of today, possess an inherent understanding of the modern world and a drive to create that can unlock unprecedented opportunities and solve pressing issues.
      </p>

      <h2 className="font-space font-bold text-2xl mb-4">The Unstoppable Rise of India's Teenpreneurs</h2>
      <p className="mb-4">
        India is witnessing a powerful shift. The traditional path of education followed by employment is being increasingly challenged by a generation eager to take the reins and build their own futures.
      </p>

      <h3 className="font-space font-bold text-xl mb-4">1. Digital Natives with a Global Mindset</h3>
      <p className="mb-4">
        You've grown up with the internet as an extension of yourselves. This inherent digital fluency gives you an unparalleled advantage in today's globalized world. You effortlessly navigate social media, understand online marketing, and can connect with customers and collaborators across continents.
      </p>

      <h3 className="font-space font-bold text-xl mb-4">2. Fresh Perspectives, Innovative Solutions</h3>
      <p className="mb-4">
        Free from the constraints of conventional thinking, teen entrepreneurs often see problems with fresh eyes. You identify gaps and inefficiencies that older generations might overlook, leading to truly innovative solutions.
      </p>

      <h2 className="font-space font-bold text-2xl mb-4">Inspiring Stories: Indian Teenagers Leading the Way</h2>
      
      <h3 className="font-space font-bold text-xl mb-4">Advait Thakur: The AI and IoT Prodigy</h3>
      <p className="mb-4">
        At just 12 years old, Advait Thakur founded Apex Infosys India, specializing in AI, IoT, and digital solutions. His groundbreaking work has led to collaborations with tech giants and development of impactful educational apps.
      </p>

      <h3 className="font-space font-bold text-xl mb-4">Shravan and Sanjay Kumaran: The App Development Duo</h3>
      <p className="mb-4">
        This sibling duo launched GoDimensions, creating innovative apps addressing crucial societal issues. Their work earned them a spot on Forbes' 30 Under 30 Asia list.
      </p>

      <div className="pixel-border p-6 bg-maximally-blue/5 my-8">
        <h2 className="font-space font-bold text-2xl mb-4">🚀 Ready to Join India's Teen Entrepreneur Revolution?</h2>
        <p className="mb-4">
          Turn your innovative ideas into reality with Maximally's Entrepreneurship Bootcamp! Learn from successful founders, develop your business plan, and join a community of young innovators.
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Learn essential business skills</li>
          <li>Get mentored by industry experts</li>
          <li>Build your startup roadmap</li>
          <li>Network with like-minded peers</li>
        </ul>
        <div className="text-center">
          <Button asChild size="lg" className="bg-black hover:bg-black/80">
            <Link to="/entrepreneurship">Join Entrepreneurship Bootcamp</Link>
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <BlogPost
      title="Why Teen Entrepreneurs Are the Future of India"
      date="January 17, 2025"
      readTime="8 min read"
      content={content}
    />
  );
};

export default TeenEntrepreneursIndia;
