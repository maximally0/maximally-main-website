import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Trophy, Code, Loader2 } from "lucide-react";

interface FeaturedHackathon {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  prize: string;
  format: "online" | "in-person" | "hybrid";
  tags: string[];
  status: "upcoming" | "ongoing" | "completed";
  registerUrl: string;
  type: "admin" | "organizer";
}

const formatColors: Record<string, string> = {
  online: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  "in-person": "bg-purple-500/20 text-purple-300 border-purple-500/40",
  hybrid: "bg-orange-500/20 text-orange-300 border-orange-500/40",
};

const getDateRange = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startMonth = startDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const endMonth = endDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
  }
  return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${startDate.getFullYear()}`;
};

const calcStatus = (start: string, end: string): "upcoming" | "ongoing" | "completed" => {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (startDate > now) return "upcoming";
  if (endDate < now) return "completed";
  return "ongoing";
};

export function UpcomingHackathonsSection() {
  const [hackathons, setHackathons] = useState<FeaturedHackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedHackathons();
  }, []);

  const fetchFeaturedHackathons = async () => {
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const featuredRes = await fetch(
        `${SUPABASE_URL}/rest/v1/featured_hackathons?id=eq.1&select=*`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          }
        }
      );
      
      const featuredData = await featuredRes.json();
      const config = featuredData?.[0];
      
      if (!config) {
        setLoading(false);
        return;
      }

      const adminIds: number[] = [];
      const organizerIds: number[] = [];
      
      for (let i = 1; i <= 6; i++) {
        const type = config[`slot_${i}_type`];
        const id = config[`slot_${i}_id`];
        if (type && id) {
          if (type === 'admin') adminIds.push(id);
          else organizerIds.push(id);
        }
      }

      const results: FeaturedHackathon[] = [];

      if (adminIds.length > 0) {
        const adminRes = await fetch(
          `${SUPABASE_URL}/rest/v1/hackathons?id=in.(${adminIds.join(',')})&select=id,title,subtitle,start_date,end_date,location,status,focus_areas,devpost_register_url,registration_url`,
          {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            }
          }
        );
        const adminData = await adminRes.json();
        
        (adminData || []).forEach((h: any) => {
          results.push({
            id: `admin-${h.id}`,
            name: h.title,
            description: h.subtitle || '',
            startDate: h.start_date,
            endDate: h.end_date || h.start_date,
            prize: 'TBD',
            format: h.location?.toLowerCase().includes('online') ? 'online' : 'hybrid',
            tags: Array.isArray(h.focus_areas) ? h.focus_areas.slice(0, 2) : [],
            status: calcStatus(h.start_date, h.end_date || h.start_date),
            registerUrl: h.devpost_register_url || h.registration_url || '#',
            type: 'admin'
          });
        });
      }

      if (organizerIds.length > 0) {
        const orgRes = await fetch(
          `${SUPABASE_URL}/rest/v1/organizer_hackathons?id=in.(${organizerIds.join(',')})&select=id,hackathon_name,tagline,start_date,end_date,format,venue,slug,total_prize_pool,themes`,
          {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            }
          }
        );
        const orgData = await orgRes.json();
        
        (orgData || []).forEach((h: any) => {
          results.push({
            id: `org-${h.id}`,
            name: h.hackathon_name,
            description: h.tagline || '',
            startDate: h.start_date,
            endDate: h.end_date,
            prize: h.total_prize_pool || 'TBD',
            format: h.format || 'hybrid',
            tags: Array.isArray(h.themes) ? h.themes.slice(0, 2) : [],
            status: calcStatus(h.start_date, h.end_date),
            registerUrl: `/hackathon/${h.slug}`,
            type: 'organizer'
          });
        });
      }

      const orderedResults: FeaturedHackathon[] = [];
      for (let i = 1; i <= 6; i++) {
        const type = config[`slot_${i}_type`];
        const id = config[`slot_${i}_id`];
        if (type && id) {
          const prefix = type === 'admin' ? 'admin' : 'org';
          const found = results.find(r => r.id === `${prefix}-${id}`);
          if (found) orderedResults.push(found);
        }
      }

      setHackathons(orderedResults);
    } catch (error) {
      console.error('Error fetching featured hackathons:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="py-20 sm:py-28 relative bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-500/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <span className="font-space text-sm text-orange-400 tracking-wide font-medium mb-4 block">
            OPEN NOW
          </span>
          <h2 className="font-space text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
            Upcoming Hackathons
          </h2>
          <p className="font-space text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Curated programs for serious builders. Apply, build, and get noticed by the people who matter.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
          </div>
        ) : hackathons.length === 0 ? (
          <div className="text-center py-12">
            <Code className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="font-space text-gray-500">No featured hackathons yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12 max-w-6xl mx-auto">
            {hackathons.map((hackathon) => (
              <div
                key={hackathon.id}
                className="group relative bg-gray-900/50 border border-gray-800 hover:border-orange-500/40 transition-all duration-300"
              >
                <div className="relative p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-space font-medium capitalize border ${formatColors[hackathon.format] || formatColors.hybrid}`}>
                        {hackathon.format}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 border text-[10px] font-space font-medium uppercase ${
                      hackathon.status === 'upcoming' ? 'bg-green-500/20 text-green-300 border-green-500/40' :
                      hackathon.status === 'ongoing' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                      'bg-gray-500/20 text-gray-400 border-gray-500/40'
                    }`}>
                      {hackathon.status}
                    </span>
                  </div>

                  <h3 className="font-space text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                    {hackathon.name}
                  </h3>
                  <p className="font-space text-sm text-gray-400 mb-4 line-clamp-2">
                    {hackathon.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-4 text-xs font-space text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      <span>{getDateRange(hackathon.startDate, hackathon.endDate)}</span>
                    </div>
                    {hackathon.prize && hackathon.prize !== 'TBD' && (
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-orange-300">{hackathon.prize}</span>
                      </div>
                    )}
                  </div>

                  {hackathon.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {hackathon.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 text-xs font-space text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <a
                    href={hackathon.registerUrl}
                    target={hackathon.registerUrl.startsWith('http') ? '_blank' : undefined}
                    rel={hackathon.registerUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500/10 border border-orange-500/30 hover:border-orange-400 hover:bg-orange-500/20 text-orange-300 hover:text-orange-200 font-space text-sm font-medium transition-all duration-300"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/events"
            className="group inline-flex items-center gap-3 px-6 py-3 border border-gray-700 hover:border-orange-500/60 text-gray-300 hover:text-white font-space text-sm font-medium transition-all duration-300"
          >
            <span>See All Open Hackathons</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
    </section>
  );
}

export default UpcomingHackathonsSection;
