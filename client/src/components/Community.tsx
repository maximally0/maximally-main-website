
import { MessageSquare, Trophy, FileCode, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Live Events",
    description: "Join weekly workshops, AMAs, and networking sessions.",
    icon: Users,
    color: "bg-maximally-blue"
  },
  {
    title: "Leaderboards",
    description: "Earn XP and climb the ranks with your achievements.",
    icon: Trophy,
    color: "bg-maximally-red"
  },
  {
    title: "Peer Projects",
    description: "Collaborate on real projects with fellow members.",
    icon: FileCode,
    color: "bg-maximally-black"
  }
];

const Community = () => {
  return (
    <section id="community" className="py-24 bg-gradient-to-b from-white to-maximally-blue/10 pixel-grid">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-space font-bold text-maximally-black mb-4 text-center">
            &gt;&gt; Join the Community_
          </h2>
          
          <p className="text-center font-space text-maximally-black/80 mb-12 max-w-2xl mx-auto">
            Connect with other ambitious teens in our Discord community of 1000+ members.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="pixel-card text-center">
                <div className={`w-16 h-16 ${feature.color} pixel-border flex items-center justify-center mb-4 mx-auto`}>
                  <feature.icon className="text-white h-8 w-8" />
                </div>
                <h3 className="font-space font-bold text-lg mb-2 text-maximally-black">{feature.title}</h3>
                <p className="font-space text-maximally-black/70">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button className="pixel-button bg-maximally-black hover:bg-maximally-black/90 group">
              <MessageSquare className="mr-2 h-4 w-4 group-hover:animate-bounce" />
              Join Discord Server
            </Button>
          </div>
          
          {/* Discord Map */}
          <div className="mt-16 pixel-border bg-white p-6">
            <h3 className="font-space font-bold text-xl mb-6 text-center text-maximally-black">
              Server Map
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Welcome", "Announcements", "Resources", "Challenges", "General", "Skill-Tracks", "Projects", "Showcase"].map((channel, index) => (
                <div key={index} className="bg-maximally-black/10 pixel-border p-2 text-center">
                  <p className="font-space text-maximally-black">#{channel}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
