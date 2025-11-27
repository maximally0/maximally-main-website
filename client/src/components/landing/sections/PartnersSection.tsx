import partnersData from "@/data/partners.json";

export function PartnersSection() {
  const { partners } = partnersData;

  return (
    <section className="py-12 sm:py-16 relative bg-black border-y border-gray-800">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <p className="font-press-start text-xs text-gray-500 tracking-wider">
            OUR PARTNERS
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300"
              title={partner.name}
            >
              {partner.logoUrl ? (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="h-8 sm:h-10 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                    }
                  }}
                />
              ) : null}
              <span 
                className={`font-press-start text-xs sm:text-sm text-gray-400 hover:text-white transition-colors ${partner.logoUrl ? 'hidden' : 'block'}`}
              >
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;
