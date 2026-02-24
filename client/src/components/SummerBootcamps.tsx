import { useState } from 'react';
import BootcampCard from './BootcampCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

const bootcamps = [
  {
    title: "The Founder Lab",
    description: "Build something real. Learn how to start, validate, and pitch your first startup.",
    skills: ["Entrepreneurship", "MVPs", "Pitching"],
    duration: 3,
    price: 1299,
    powerUpLink: "/entrepreneurship"
  },
  {
    title: "Speak for Impact",
    description: "Become a confident communicator. Master public speaking, debate, and persuasion.",
    skills: ["Speaking", "Debate", "Articulation"],
    duration: 2,
    price: 999,
    powerUpLink: "/public-speaking"
  },
  {
    title: "Digital Influence 101",
    description: "Build your personal brand and grow on platforms like Instagram, YouTube, LinkedIn.",
    skills: ["Content Creation", "Social Media", "Branding"],
    duration: 2,
    price: 999,
    powerUpLink: "/digital-marketing"
  },
  {
    title: "Build with AI & No-Code",
    description: "Use ChatGPT, Notion AI, Bubble and more to build automations & tools.",
    skills: ["AI Tools", "No-Code Apps", "Automation"],
    duration: 2,
    price: 999,
    powerUpLink: "/no-code-ai"
  },
  {
    title: "Career Starter Pack",
    description: "Build a strong resume, network on LinkedIn, and find real internships.",
    skills: ["Resume", "LinkedIn", "Networking"],
    duration: 2,
    price: 799,
    powerUpLink: "/career-launch"
  }
];

const SummerBootcamps = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBootcamp, setSelectedBootcamp] = useState<string>('');

  const handlePreRegister = (bootcampTitle: string) => {
    setSelectedBootcamp(bootcampTitle);
    setIsDialogOpen(true);
  };

  return (
    <section className="py-20 bg-maximally-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-space font-bold text-4xl text-maximally-blue mb-4">
            Summer Bootcamp 2025
          </h2>
          <p className="font-space text-white/80 mb-6">
            Level up your skills this summer. Bootcamps start May 2025.
          </p>
          <div className="inline-block bg-maximally-blue/20 px-4 py-2 rounded-full">
            <span className="font-space text-maximally-blue animate-pulse">
              ⏰ Early bird registration open
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {bootcamps.map((bootcamp) => (
            <BootcampCard
              key={bootcamp.title}
              {...bootcamp}
              onPreRegister={() => handlePreRegister(bootcamp.title)}
            />
          ))}
        </div>

        <div className="bg-white pixel-border p-8 text-center">
          <h3 className="font-space font-bold text-2xl text-maximally-black mb-6">
            Bundle & Save
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="pixel-border p-6">
              <h4 className="font-space font-bold text-lg mb-2">Any 2 Bootcamps</h4>
              <p className="font-space font-bold text-2xl text-maximally-blue mb-4">₹1,799</p>
              <Button 
                onClick={() => handlePreRegister('Bundle - 2 Bootcamps')}
                className="bg-maximally-red text-white w-full"
              >
                Choose Bootcamps
              </Button>
            </div>
            <div className="pixel-border p-6 bg-maximally-blue/5">
              <h4 className="font-space font-bold text-lg mb-2">All-Access Pass</h4>
              <p className="font-space font-bold text-2xl text-maximally-blue mb-4">₹3,999</p>
              <Button 
                onClick={() => handlePreRegister('All-Access Pass')}
                className="bg-maximally-red text-white w-full"
              >
                Get All Access
              </Button>
            </div>
          </div>
          <p className="font-space text-maximally-black/60 mt-6">
            * Scholarships available for select students
          </p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pre-register for {selectedBootcamp}</DialogTitle>
            <DialogDescription>
              Fill out this quick form to pre-register and get early access pricing!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SummerBootcamps;