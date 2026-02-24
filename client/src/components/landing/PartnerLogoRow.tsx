interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  type: "judge" | "sponsor";
}

interface PartnerLogoRowProps {
  partners: Partner[];
  animateMarquee?: boolean;
}

export function PartnerLogoRow({ partners, animateMarquee = true }: PartnerLogoRowProps) {
  const duplicatedPartners = animateMarquee ? [...partners, ...partners] : partners;

  return (
    <div className="overflow-hidden py-4">
      <div 
        className={`flex items-center gap-12 ${animateMarquee ? 'animate-marquee' : 'justify-center flex-wrap'}`}
      >
        {duplicatedPartners.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="flex items-center justify-center min-w-[100px] grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            title={partner.name}
          >
            {partner.logoUrl ? (
              <img
                src={partner.logoUrl}
                alt={partner.name}
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <span 
              className={`font-space text-sm font-medium text-gray-400 hover:text-white transition-colors ${partner.logoUrl ? 'hidden' : 'flex'}`}
            >
              {partner.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CompanyMarquee({ companies }: { companies: string[] }) {
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <div className="overflow-hidden">
      <div className="flex animate-marquee hover:pause-marquee whitespace-nowrap">
        <div className="flex items-center space-x-6 md:space-x-8 text-white font-space text-sm sm:text-base font-semibold tracking-wide">
          {duplicatedCompanies.map((company, index) => (
            <span
              key={index}
              className="flex items-center space-x-6 md:space-x-8"
            >
              <span className="hover:text-orange-400 transition-colors duration-300 whitespace-nowrap">
                {company}
              </span>
              <span className="text-gray-600">&bull;</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PartnerLogoRow;
