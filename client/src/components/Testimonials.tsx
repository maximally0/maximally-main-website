
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonialData = [
  {
    name: "Shiv",
    handle: "@shiv_speaksfire",
    achievement: "🎤 MUN Winner",
    quote: "Maximally helped me win my first MUN conference! The techniques they taught actually work.",
    avatar: "1"
  },
  {
    name: "Ananya",
    handle: "@ananya_codes",
    achievement: "🧠 Startup Intern",
    quote: "I landed my dream startup internship using the career skills I learned here. Worth every penny!",
    avatar: "2"
  },
  {
    name: "Rohan",
    handle: "@rohan_pixel",
    achievement: "🎬 Content Creator",
    quote: "The video editing course taught me skills I use every day for my YouTube channel. Now at 10K subs!",
    avatar: "3"
  },
  {
    name: "Zara",
    handle: "@zara_builds",
    achievement: "⚡ No-Code Founder",
    quote: "Built my first app with no coding background after taking the no-code track. Now I have paying users!",
    avatar: "4"
  }
];

interface TestimonialCardProps {
  testimonial: {
    name: string;
    handle: string;
    achievement: string;
    quote: string;
    avatar: string;
  };
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <div className="pixel-card h-full flex flex-col p-4 sm:p-6">
      <div className="flex items-center mb-4">
        <div className={`w-10 sm:w-12 h-10 sm:h-12 pixel-border bg-maximally-blue flex items-center justify-center mr-4`}>
          <span className="font-press-start text-white text-sm sm:text-base">{testimonial.avatar}</span>
        </div>
        <div>
          <p className="font-press-start text-sm text-maximally-black">{testimonial.name}</p>
          <p className="font-jetbrains text-xs text-maximally-black/70">{testimonial.handle}</p>
        </div>
      </div>
      
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500" />
        ))}
      </div>
      
      <p className="font-jetbrains text-sm sm:text-base text-maximally-black/80 mb-4 flex-grow">{testimonial.quote}</p>
      
      <div className="bg-maximally-black/10 px-3 py-1 rounded font-jetbrains text-xs inline-block self-start">
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
    <section className="py-12 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-press-start text-maximally-black mb-8 sm:mb-12 text-center">
          &gt;&gt; Student Success Stories_
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
                className="p-2 bg-maximally-black text-white pixel-border hover:bg-maximally-black/80 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={nextSlide}
                className="p-2 bg-maximally-black text-white pixel-border hover:bg-maximally-black/80 transition-colors"
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
