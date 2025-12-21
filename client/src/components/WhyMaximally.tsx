
import { useState, useEffect } from "react";
import { Zap, Users, BookOpen, Sparkles } from "lucide-react";

const features = [
  {
    title: "No boring lectures.",
    description: "Interactive, hands-on sessions that keep you engaged.",
    icon: BookOpen,
    gradient: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/40',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400'
  },
  {
    title: "No PDF dumps.",
    description: "Real projects, real feedback, real growth.",
    icon: Zap,
    gradient: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/40',
    iconBg: 'bg-cyan-500/20',
    iconColor: 'text-cyan-400'
  },
  {
    title: "By teens, for teens.",
    description: "Built by ambitious teens who get what you need.",
    icon: Users,
    gradient: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/40',
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-400'
  }
];

interface EvolutionStepProps {
  number: string;
  label: string;
  isActive: boolean;
  color: string;
}

const EvolutionStep = ({ number, label, isActive, color }: EvolutionStepProps) => {
  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400' },
    pink: { bg: 'bg-pink-500/20', border: 'border-pink-500/40', text: 'text-pink-400' },
    cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400' },
    green: { bg: 'bg-green-500/20', border: 'border-green-500/40', text: 'text-green-400' },
  };
  const colors = colorClasses[color] || colorClasses.purple;
  
  return (
    <div className={`flex flex-col items-center transition-all duration-300 ${isActive ? "opacity-100 scale-110" : "opacity-40"}`}>
      <div className={`w-12 h-12 ${isActive ? colors.bg : 'bg-gray-800/50'} border ${isActive ? colors.border : 'border-gray-700'} flex items-center justify-center transition-all duration-300`}>
        <span className={`font-press-start text-sm ${isActive ? colors.text : 'text-gray-500'}`}>{number}</span>
      </div>
      <span className={`font-jetbrains text-sm mt-2 ${isActive ? 'text-white' : 'text-gray-500'}`}>{label}</span>
    </div>
  );
};

const WhyMaximally = () => {
  const [activeStep, setActiveStep] = useState(1);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev % 4) + 1);
    }, 2000);
    
    return () => clearInterval(timer);
  }, []);
  
  const stepColors = ['purple', 'pink', 'cyan', 'green'];
  
  return (
    <section id="why" className="py-16 sm:py-24 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.10)_0%,transparent_50%)]" />
      
      <div className="absolute top-20 left-[10%] w-60 h-60 bg-purple-500/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-20 right-[10%] w-48 h-48 bg-pink-500/10 rounded-full blur-[60px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="font-press-start text-[10px] sm:text-xs text-purple-300 tracking-wider">
                THE DIFFERENCE
              </span>
            </div>
            <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl text-white mb-4">
              Why{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Maximally
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group bg-gradient-to-br ${feature.gradient} border ${feature.border} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]`}
              >
                <div className={`${feature.iconBg} border ${feature.border} w-14 h-14 flex items-center justify-center mb-4 mx-auto`}>
                  <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
                </div>
                <h3 className="font-press-start text-xs sm:text-sm text-white mb-3 text-center group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="font-jetbrains text-sm text-gray-400 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-purple-500/30 p-6 sm:p-8">
            <h3 className="font-press-start text-sm sm:text-base text-white mb-8 text-center">
              Your Growth Journey
            </h3>
            
            <div className="flex justify-between items-center">
              <EvolutionStep number="1" label="Noob" isActive={activeStep >= 1} color={stepColors[0]} />
              <div className={`h-1 flex-1 mx-2 transition-all duration-300 ${activeStep >= 2 ? 'bg-gradient-to-r from-purple-500/50 to-pink-500/50' : 'bg-gray-700'}`}></div>
              <EvolutionStep number="2" label="Starter" isActive={activeStep >= 2} color={stepColors[1]} />
              <div className={`h-1 flex-1 mx-2 transition-all duration-300 ${activeStep >= 3 ? 'bg-gradient-to-r from-pink-500/50 to-cyan-500/50' : 'bg-gray-700'}`}></div>
              <EvolutionStep number="3" label="Pro" isActive={activeStep >= 3} color={stepColors[2]} />
              <div className={`h-1 flex-1 mx-2 transition-all duration-300 ${activeStep >= 4 ? 'bg-gradient-to-r from-cyan-500/50 to-green-500/50' : 'bg-gray-700'}`}></div>
              <EvolutionStep number="4" label="Founder" isActive={activeStep >= 4} color={stepColors[3]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyMaximally;
