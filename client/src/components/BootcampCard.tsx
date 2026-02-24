
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

interface BootcampCardProps {
  title: string;
  description: string;
  skills: string[];
  duration: number;
  price: number;
  powerUpLink: string;
  onPreRegister: () => void;
}

const BootcampCard = ({ title, description, skills, duration, price, powerUpLink, onPreRegister }: BootcampCardProps) => {
  return (
    <div className="pixel-border bg-white p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-maximally-blue text-white px-3 py-1 text-sm font-space">
        {duration} week
      </div>

      <h3 className="font-space font-bold text-xl mb-4 text-maximally-black">{title}</h3>
      <p className="font-space text-maximally-black/80 mb-4">{description}</p>

      <div className="mb-4">
        <div className="text-sm font-space text-maximally-black/60 mb-2">Skills:</div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="bg-maximally-blue/10 text-maximally-blue px-2 py-1 rounded text-sm font-space">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <div className="flex items-center justify-between">
          <div className="font-space font-bold text-maximally-black">₹{price}</div>
          <Button 
            onClick={onPreRegister}
            className="bg-maximally-red text-white hover:bg-maximally-red/90 font-space"
          >
            Pre-register <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <Link to={powerUpLink} className="block w-full">
          <Button 
            variant="outline"
            className="w-full border-maximally-blue text-maximally-blue hover:bg-maximally-blue hover:text-white font-space"
          >
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BootcampCard;
