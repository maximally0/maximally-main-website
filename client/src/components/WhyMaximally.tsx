
import { useState, useEffect } from "react";
import { Zap, Users, BookOpen } from "lucide-react";

const features = [
  {
    title: "No boring lectures.",
    description: "Interactive, hands-on sessions that keep you engaged.",
    icon: BookOpen
  },
  {
    title: "No PDF dumps.",
    description: "Real projects, real feedback, real growth.",
    icon: Zap
  },
  {
    title: "By teens, for teens.",
    description: "Built by ambitious teens who get what you need.",
    icon: Users
  }
];

interface EvolutionStepProps {
  number: string;
  label: string;
  isActive: boolean;
}

const EvolutionStep = ({ number, label, isActive }: EvolutionStepProps) => {
  return (
    <div className={`flex flex-col items-center ${isActive ? "opacity-100" : "opacity-50"}`}>
      <div className={`w-12 h-12 pixel-border flex items-center justify-center ${
        isActive ? "bg-maximally-red" : "bg-gray-300"
      }`}>
        <span className="font-press-start text-white text-sm">{number}</span>
      </div>
      <span className="font-jetbrains text-maximally-black text-sm mt-2">{label}</span>
    </div>
  );
};

const WhyMaximally = () => {
  const [activeStep, setActiveStep] = useState(1);
  
  // Auto-advance the steps - Fixed by changing useState to useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev % 4) + 1);
    }, 2000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <section id="why" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-press-start text-maximally-black mb-16 text-center">
            &gt;&gt; Why Maximally_
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-maximally-red pixel-border flex items-center justify-center mb-4 mx-auto">
                  <feature.icon className="text-white h-8 w-8" />
                </div>
                <h3 className="font-press-start text-xl mb-2 text-maximally-black">{feature.title}</h3>
                <p className="font-jetbrains text-maximally-black/70">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="pixel-border p-6 bg-white">
            <h3 className="font-press-start text-xl mb-6 text-center text-maximally-black">
              Your Growth Journey
            </h3>
            
            <div className="flex justify-between items-center">
              <EvolutionStep number="1" label="Noob" isActive={activeStep >= 1} />
              <div className="h-1 flex-1 bg-gray-300 mx-2"></div>
              <EvolutionStep number="2" label="Starter" isActive={activeStep >= 2} />
              <div className="h-1 flex-1 bg-gray-300 mx-2"></div>
              <EvolutionStep number="3" label="Pro" isActive={activeStep >= 3} />
              <div className="h-1 flex-1 bg-gray-300 mx-2"></div>
              <EvolutionStep number="4" label="Founder" isActive={activeStep >= 4} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyMaximally;
