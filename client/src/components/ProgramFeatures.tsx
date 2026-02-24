import { Check } from "lucide-react";

interface Feature {
  title: string;
  description: string;
}

interface ProgramFeaturesProps {
  features: Feature[];
}

const ProgramFeatures = ({ features }: ProgramFeaturesProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="pixel-border p-6 bg-white hover:bg-gray-50 transition-colors group cursor-pointer"
        >
          <h3 className="font-space font-bold text-lg mb-4 group-hover:text-maximally-blue transition-colors">
            {feature.title}
          </h3>
          <p className="font-space text-maximally-black/80 leading-relaxed">
            {feature.description}
          </p>
          <div className="mt-4 flex justify-end">
            <span className="text-maximally-blue font-space font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Level Up &gt;
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgramFeatures;