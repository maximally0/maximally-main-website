
import { Calendar, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

const eventsData = [
  {
    title: "TeenBiz Bootcamp",
    description: "Learn to launch your first micro-business.",
    date: "May 1st, 2025",
    price: "₹499",
    daysLeft: 12,
    color: "bg-maximally-blue"
  },
  {
    title: "Public Speaking Masterclass",
    description: "Overcome stage fright and captivate audiences.",
    date: "May 15th, 2025",
    price: "₹599",
    daysLeft: 26,
    color: "bg-maximally-red"
  },
  {
    title: "AI Tools Workshop",
    description: "Leverage AI to boost your productivity.",
    date: "June 5th, 2025",
    price: "₹299",
    daysLeft: 47,
    color: "bg-maximally-black"
  }
];

interface EventCardProps {
  event: {
    title: string;
    description: string;
    date: string;
    price: string;
    daysLeft: number;
    color: string;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="pixel-card h-full flex flex-col">
      <div className={`${event.color} text-white p-4 -m-5 mb-6 pixel-border`}>
        <h3 className="font-press-start text-lg">{event.title}</h3>
      </div>
      
      <p className="font-jetbrains text-maximally-black/80 mb-4">{event.description}</p>
      
      <div className="flex items-center mb-2 text-maximally-black/70">
        <Calendar className="h-4 w-4 mr-2" />
        <span className="font-jetbrains text-sm">{event.date}</span>
      </div>
      
      <div className="flex items-center mb-4 text-maximally-black/70">
        <Clock className="h-4 w-4 mr-2" />
        <span className="font-jetbrains text-sm">Starts in {event.daysLeft} days</span>
      </div>
      
      <div className="mt-auto">
        <div className="flex items-center mb-4 text-maximally-black">
          <DollarSign className="h-4 w-4 mr-1" />
          <span className="font-press-start text-lg">{event.price}</span>
        </div>
        
        <Button className="w-full pixel-button bg-maximally-black hover:bg-maximally-black/90">
          Enroll Now
        </Button>
      </div>
    </div>
  );
};

const Events = () => {
  return (
    <section id="events" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-press-start text-maximally-black mb-4 text-center">
          &gt;&gt; Upcoming Bootcamps_
        </h2>
        
        <p className="text-center font-jetbrains text-maximally-black/80 mb-12 max-w-2xl mx-auto">
          Intensive, live bootcamps to level up your skills fast.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {eventsData.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
