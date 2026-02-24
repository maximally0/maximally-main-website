
import { CalendarDays, Clock } from "lucide-react";

interface Event {
  title: string;
  date: string;
  time: string;
  price: string;
  isPopular?: boolean;
}

interface UpcomingEventsProps {
  events: Event[];
}

const UpcomingEvents = ({ events }: UpcomingEventsProps) => {
  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border-2 border-maximally-black relative">
            {event.isPopular && (
              <div className="absolute top-0 right-0 bg-maximally-red text-white px-3 py-1 text-sm transform translate-x-2 -translate-y-2 rotate-3">
                Popular
              </div>
            )}
            <h3 className="font-space font-bold text-lg mb-4">{event.title}</h3>
            <div className="flex items-center mb-2">
              <CalendarDays className="h-4 w-4 text-maximally-blue mr-2" />
              <span className="font-space text-sm">{event.date}</span>
            </div>
            <div className="flex items-center mb-4">
              <Clock className="h-4 w-4 text-maximally-green mr-2" />
              <span className="font-space text-sm">{event.time}</span>
            </div>
            <div className="font-space font-bold text-maximally-blue">{event.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
