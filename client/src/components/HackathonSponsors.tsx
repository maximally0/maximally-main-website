import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface Sponsor {
  id: string;
  sponsor_name: string;
  sponsor_logo?: string;
  sponsor_website?: string;
  sponsor_tier: 'title' | 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner';
  display_order: number;
}

interface HackathonSponsorsProps {
  hackathonId: number;
}

export default function HackathonSponsors({ hackathonId }: HackathonSponsorsProps) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsors();
  }, [hackathonId]);

  const fetchSponsors = async () => {
    try {
      const response = await fetch(`/api/hackathons/${hackathonId}/sponsors`);
      const data = await response.json();
      if (data.success) {
        setSponsors(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    const colors = {
      title: 'border-maximally-red bg-red-900/20',
      platinum: 'border-gray-300 bg-gray-900/20',
      gold: 'border-yellow-400 bg-yellow-900/20',
      silver: 'border-gray-400 bg-gray-800/20',
      bronze: 'border-orange-600 bg-orange-900/20',
      partner: 'border-cyan-400 bg-cyan-900/20',
    };
    return colors[tier as keyof typeof colors] || colors.partner;
  };

  const getTierLabel = (tier: string) => {
    return tier.toUpperCase().replace('_', ' ');
  };

  // Group sponsors by tier
  const groupedSponsors = sponsors.reduce((acc, sponsor) => {
    if (!acc[sponsor.sponsor_tier]) {
      acc[sponsor.sponsor_tier] = [];
    }
    acc[sponsor.sponsor_tier].push(sponsor);
    return acc;
  }, {} as Record<string, Sponsor[]>);

  const tierOrder = ['title', 'platinum', 'gold', 'silver', 'bronze', 'partner'];

  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-8 w-32 bg-gray-800 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-24 bg-gray-800"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sponsors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="minecraft-block bg-gray-800 text-gray-400 px-6 py-4 inline-block">
          <span className="font-press-start text-sm">NO SPONSORS YET</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {tierOrder.map((tier) => {
        const tierSponsors = groupedSponsors[tier];
        if (!tierSponsors || tierSponsors.length === 0) return null;

        return (
          <div key={tier}>
            {/* Tier Title */}
            <div className="minecraft-block bg-cyan-400 text-black px-4 py-2 inline-block mb-6">
              <span className="font-press-start text-sm">
                {getTierLabel(tier)} SPONSORS
              </span>
            </div>

            {/* Sponsors Grid */}
            <div className={`grid ${
              tier === 'title' ? 'grid-cols-1 md:grid-cols-2' : 
              tier === 'platinum' ? 'grid-cols-2 md:grid-cols-3' :
              'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'
            } gap-6`}>
              {tierSponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.sponsor_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`pixel-card ${getTierColor(sponsor.sponsor_tier)} border-2 p-6 hover:scale-105 transition-all group relative`}
                >
                  {/* Logo or Name */}
                  {sponsor.sponsor_logo ? (
                    <img
                      src={sponsor.sponsor_logo}
                      alt={sponsor.sponsor_name}
                      className="w-full h-auto object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="font-press-start text-sm text-center text-white">
                        {sponsor.sponsor_name}
                      </span>
                    </div>
                  )}

                  {/* External Link Icon */}
                  {sponsor.sponsor_website && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-4 w-4 text-cyan-400" />
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
