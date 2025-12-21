import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonialData = [
  {
    name: "Shiv",
    handle: "@shiv_speaksfire",
    achievement: "🎤 MUN Winner",
    quote: "Maximally helped me win my first MUN conference! The techniques they taught actually work.",
    avatar: "1",
    color: "purple"
  },
  {
    name: "Ananya",
    handle: "@ananya_codes",
    achievement: "🧠 Startup Intern",
    quote: "I landed my dream startup internship using the career skills I learned here. Worth every penny!",
    avatar: "2",
    color: "pink"
  },
  {
    name: "Rohan",
    handle: "@rohan_pixel",
    achievement: "🎬 Content Creator",
    quote: "The video editing course taught me skills I use every day for my YouTube channel. Now at 10K subs!",
    avatar: "3",
    color: "cyan"
  },
  {
    name: "Zara",
    handle: "@zara_builds",
    achievement: "⚡ No-Code Founder",
    quote: "Built my first app with no coding background after taking the no-code track. Now I have paying users!",
    avatar: "4",
    color: "green"
  }
];

const colorClasses = {
  purple: {
    bg: "bg-purple-500/20",
    border: "border-purple-500/40",
    text: "text-purple-400",
    badge: "bg-purple-500/10 border-purple-500/30 text-purple-300"
  },
  pink: {
    bg: "bg-pink-500/20",
    border: "border-pink-500/40",
    text: "text-pink-400",
    badge: "bg-pink-500/10 border-pink-500/30 text-pink-300"
  },
  cyan: {
    bg: "bg-cyan-500/20",
    border: "border-cyan-500/40",
    text: "text-cyan-400",
    badge: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
  },
  green: {
    bg: "bg-green-500/20",
    border: "border-green-500/40",
    text: "text-green-400",
    badge: "bg-green-500/10 border-green-500/30 text-green-300"
  }
};

interface TestimonialCardProps {
  testimonial: {
    name: string;
    handle: string;
    achievement: string;
    quote: string;
    avatar: string;
    color: string;
  };
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  const colors = colorClasses[testimonial.color as keyof typeof colorClasses] || colorClasses.purple;
  
  return (
    <div className={`bg-gradient-to-br from-gray-900/60 to-gray-900/30 border ${colors.border} h-full flex flex-col p-4 sm:p-6 transition-all duration-300 hover:border-opacity-70`}>
      <div className="flex items-center mb-4">
        <div className={`w-10 sm:w-12 h-10 sm:h-12 ${colors.bg} border ${colors.border} flex items-center justify-center mr-4`}>
          <span className={`font-press-start ${colors.text} text-sm sm:text-base`}>{testimonial.avatar}</span>
        </div>
        <div>
          <p className="font-press-start text-sm text-white">{testimonial.name}</p>
          <p className="font-jetbrains text-xs text-gray-400">{testimonial.handle}</p>
        </div>
      </div>
      
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400 fill-amber-400" />
        ))}
      </div>
      
      <div className="relative flex-grow mb-4">
        <Quote className={`absolute -top-1 -left-1 h-4 w-4 ${colors.text} opacity-50`} />
        <p className="font-jetbrains text-sm sm:text-base text-gray-300 pl-4">{testimonial.quote}</p>
      </div>
      
      <div className={`${colors.badge} border px-3 py-1 font-jetbrains text-xs inline-block self-start`}>
        {testimonial.achievement}
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % testimonialData.length);
  };
  
  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + testimonialData.length) % testimonialData.length);
  };
  
  return (
    <section className="py-12 sm:py-24 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.10)_0%,transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-press-start text-white mb-8 sm:mb-12 text-center">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Student Success Stories
          </span>
        </h2>
        
        <div className="relative">
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {testimonialData.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
          
          {/* Mobile slider */}
          <div className="md:hidden">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {testimonialData.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-6 gap-4">
              <button 
                onClick={prevSlide}
                className="p-2 bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={nextSlide}
                className="p-2 bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
