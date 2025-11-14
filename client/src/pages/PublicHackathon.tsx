import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy,
  Clock,
  ExternalLink,
  Share2,
  Zap,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

interface Hackathon {
  id: number;
  hackathon_name: string;
  slug: string;
  tagline?: string;
  description?: string;
  start_date: string;
  end_date: string;
  format: string;
  venue?: string;
  registration_deadline?: string;
  team_size_min?: number;
  team_size_max?: number;
  registration_fee?: number;
  total_prize_pool?: string;
  prize_breakdown?: string;
  discord_link?: string;
  whatsapp_link?: string;
  website_url?: string;
  contact_email?: string;
  views_count: number;
  registrations_count: number;
}

export default function PublicHackathon() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchHackathon();
    }
  }, [slug]);

  const fetchHackathon = async () => {
    try {
      const response = await fetch(`/api/hackathons/${slug}`);
      const data = await response.json();

      if (data.success) {
        setHackathon(data.data);
        // Increment view count
        fetch(`/api/hackathons/${slug}/view`, { method: 'POST' });
      } else {
        toast({
          title: "Not Found",
          description: "This hackathon doesn't exist or hasn't been published yet.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching hackathon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: hackathon?.hackathon_name,
        text: hackathon?.tagline,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Hackathon link copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-press-start text-maximally-red">LOADING...</div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-press-start text-2xl text-maximally-red mb-4">404</h1>
          <p className="font-jetbrains text-gray-400 mb-6">Hackathon not found</p>
          <Link to="/events" className="pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm">
                BROWSE_HACKATHONS
          </Link>
        </div>
      </div>
    );
  }

  const startDate = new Date(hackathon.start_date);
  const endDate = new Date(hackathon.end_date);
  const prizes = hackathon.prize_breakdown ? JSON.parse(hackathon.prize_breakdown) : [];

  return (
    <>
      <SEO
        title={`${hackathon.hackathon_name} - Maximally`}
        description={hackathon.tagline || hackathon.description || ''}
        keywords={`hackathon, ${hackathon.format}, coding competition`}
      />

      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="minecraft-block bg-gradient-to-r from-maximally-red to-red-700 text-white px-6 py-3 inline-block mb-8">
                <span className="font-press-start text-sm">{hackathon.format.toUpperCase()}</span>
              </div>

              <h1 className="font-press-start text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 minecraft-text">
                <span className="text-maximally-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  {hackathon.hackathon_name}
                </span>
              </h1>

              {hackathon.tagline && (
                <p className="text-xl sm:text-2xl text-gray-300 font-jetbrains mb-8">
                  {hackathon.tagline}
                </p>
              )}

              <div className="flex flex-wrap gap-4 justify-center mb-8">
                <button
                  className="pixel-button bg-maximally-red text-white flex items-center gap-2 px-8 py-4 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors"
                >
                  <Zap className="h-5 w-5" />
                  JOIN_HACKATHON
                </button>

                <button
                  onClick={handleShare}
                  className="pixel-button bg-gray-800 text-white flex items-center gap-2 px-6 py-4 font-press-start text-sm hover:bg-gray-700 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                  SHARE
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="pixel-card bg-black/50 border-2 border-maximally-red p-4">
                  <Calendar className="h-6 w-6 text-maximally-yellow mx-auto mb-2" />
                  <p className="font-press-start text-xs text-gray-400 mb-1">DATE</p>
                  <p className="font-jetbrains text-sm text-white">
                    {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                <div className="pixel-card bg-black/50 border-2 border-maximally-red p-4">
                  <MapPin className="h-6 w-6 text-maximally-yellow mx-auto mb-2" />
                  <p className="font-press-start text-xs text-gray-400 mb-1">FORMAT</p>
                  <p className="font-jetbrains text-sm text-white capitalize">{hackathon.format}</p>
                </div>

                <div className="pixel-card bg-black/50 border-2 border-maximally-red p-4">
                  <Users className="h-6 w-6 text-maximally-yellow mx-auto mb-2" />
                  <p className="font-press-start text-xs text-gray-400 mb-1">TEAM SIZE</p>
                  <p className="font-jetbrains text-sm text-white">
                    {hackathon.team_size_min}-{hackathon.team_size_max}
                  </p>
                </div>

                <div className="pixel-card bg-black/50 border-2 border-maximally-red p-4">
                  <Trophy className="h-6 w-6 text-maximally-yellow mx-auto mb-2" />
                  <p className="font-press-start text-xs text-gray-400 mb-1">PRIZES</p>
                  <p className="font-jetbrains text-sm text-white">
                    {hackathon.total_prize_pool || 'TBA'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        {hackathon.description && (
          <section className="py-20 bg-gradient-to-b from-black to-gray-900">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-press-start text-2xl text-maximally-red mb-6">ABOUT</h2>
                <div className="pixel-card bg-black border-2 border-maximally-red p-8">
                  <p className="font-jetbrains text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {hackathon.description}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Prizes */}
        {prizes.length > 0 && (
          <section className="py-20 bg-black">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-press-start text-2xl text-maximally-red mb-6">PRIZES</h2>
                <div className="grid gap-4">
                  {prizes.map((prize: any, i: number) => (
                    <div key={i} className="pixel-card bg-gray-900 border-2 border-maximally-yellow p-6 flex items-center gap-4">
                      <div className="minecraft-block bg-maximally-yellow w-12 h-12 flex items-center justify-center flex-shrink-0">
                        <Trophy className="h-6 w-6 text-black" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-press-start text-sm text-maximally-yellow mb-1">
                          {prize.position}
                        </h3>
                        <p className="font-jetbrains text-white text-lg">{prize.amount}</p>
                        {prize.description && (
                          <p className="font-jetbrains text-sm text-gray-400 mt-1">{prize.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Links */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-press-start text-2xl text-maximally-red mb-6">CONNECT</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hackathon.discord_link && (
                  <a
                    href={hackathon.discord_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pixel-button bg-indigo-600 text-white flex items-center justify-center gap-2 px-6 py-4 font-press-start text-sm hover:bg-indigo-700 transition-colors"
                  >
                    DISCORD
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                {hackathon.whatsapp_link && (
                  <a
                    href={hackathon.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pixel-button bg-green-600 text-white flex items-center justify-center gap-2 px-6 py-4 font-press-start text-sm hover:bg-green-700 transition-colors"
                  >
                    WHATSAPP
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                {hackathon.website_url && (
                  <a
                    href={hackathon.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pixel-button bg-gray-700 text-white flex items-center justify-center gap-2 px-6 py-4 font-press-start text-sm hover:bg-gray-600 transition-colors"
                  >
                    WEBSITE
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                {hackathon.contact_email && (
                  <a
                    href={`mailto:${hackathon.contact_email}`}
                    className="pixel-button bg-gray-700 text-white flex items-center justify-center gap-2 px-6 py-4 font-press-start text-sm hover:bg-gray-600 transition-colors"
                  >
                    EMAIL_US
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-press-start text-2xl text-maximally-red mb-6">
                READY TO JOIN?
              </h2>
              <button className="pixel-button bg-maximally-red text-white px-12 py-6 font-press-start text-lg hover:bg-maximally-yellow hover:text-black transition-colors">
                REGISTER_NOW
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
