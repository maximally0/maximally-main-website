import { Handshake } from "lucide-react";
import partnersData from "@/data/partners.json";

export function PartnersSection() {
  const { partners } = partnersData;

  return (
    <section className="py-16 sm:py-20 relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/5 via-transparent to-gray-950/20" />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Handshake className="w-4 h-4 text-gray-500" />
            <p className="font-press-start text-[10px] sm:text-xs text-gray-500 tracking-wider">
              TRUSTED PARTNERS
            </p>
            <Handshake className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 max-w-4xl mx-auto">
          {partners.map((partner, index) => (
            <div
              key={partner.id}
              className="group grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-500"
              title={partner.name}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {partner.logoUrl ? (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="h-8 sm:h-10 w-auto object-contain group-hover:scale-110 transition-transform"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                    }
                  }}
                />
              ) : null}
              <span 
                className={`font-press-start text-[10px] sm:text-xs text-gray-500 hover:text-white transition-colors ${partner.logoUrl ? 'hidden' : 'block'}`}
              >
                {partner.name}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <p className="font-jetbrains text-xs text-gray-600">
            Want to partner with us?{' '}
            <a href="/contact" className="text-red-500 hover:text-red-400 transition-colors">
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;
