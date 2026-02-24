import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Users, Rocket } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const fullText = ">> Max out your potential_";
  const textRef = useRef(null);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setText(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Pixel avatar coordinates for background effect
  const avatarPositions = [
    { x: "10%", y: "20%", delay: 0 },
    { x: "85%", y: "15%", delay: 1 },
    { x: "75%", y: "70%", delay: 2 },
    { x: "20%", y: "80%", delay: 1.5 },
    { x: "50%", y: "40%", delay: 0.5 },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 overflow-hidden bg-gradient-to-tr from-maximally-blue/30 via-white to-maximally-red/20 pixel-grid minecraft-gradient">
      {/* Background floating pixel avatars */}
      {avatarPositions.map((pos, index) => (
        <div 
          key={index}
          className="absolute w-10 h-10 md:w-16 md:h-16 bg-maximally-blue opacity-30 pixel-border animate-float glow-effect"
          style={{ 
            top: pos.y, 
            left: pos.x, 
            animationDelay: `${pos.delay}s`,
            animationDuration: `${4 + pos.delay}s`
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="text-white h-5 w-5 md:h-8 md:w-8" />
          </div>
        </div>
      ))}

      <div className="z-10 text-center max-w-4xl px-4">
        <h1 
          ref={textRef} 
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-space font-bold text-maximally-black mb-4 sm:mb-6 terminal"
        >
          {text}
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl font-space text-maximally-black/80 mb-8 sm:mb-12 max-w-2xl mx-auto">
          Learn the real-world skills schools forgot to teach.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            className="w-full sm:w-auto pixel-button bg-maximally-blue hover:bg-maximally-blue/90 group px-8 py-3"
            onClick={() => window.location.href = '/bootcamps'}
          >
            <Rocket className="mr-2 h-4 w-4 group-hover:animate-bounce" />
            Apply for Summer 2025
          </Button>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-space font-bold text-maximally-black mb-6">
            Join Our Community
          </h2>
          <p className="text-lg text-maximally-black/80 font-space max-w-2xl mx-auto mb-8">
            Connect with ambitious builders learning real-world skills. Share experiences, collaborate on projects, and grow together.
          </p>
          <Link to="/community" className="inline-block">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-maximally-black hover:transform hover:scale-105 transition-transform cursor-pointer">
              <Users className="h-12 w-12 text-maximally-blue mx-auto mb-4" />
              <p className="font-space font-bold text-sm text-maximally-black">1000+ members and growing</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-8 w-8 text-maximally-black" />
      </div>
    </div>
  );
};

export default Hero;