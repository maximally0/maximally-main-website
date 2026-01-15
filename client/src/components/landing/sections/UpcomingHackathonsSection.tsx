import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Calendar, Trophy, MapPin, Code, Loader2 } from "lucide-react";
import { supabasePublic } from "@/lib/supabaseClient";

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
  hybrid: "bg-pink-500/20 text-pink-300 border-pink-500/40",
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

      // Fetch featured hackathons config
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

      // Collect slot IDs by type
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

      // Fetch admin hackathons
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

      // Fetch organizer hackathons
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

      // Sort by slot order
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
    <section className="py-16 sm:py-20 relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="font-press-start text-[10px] sm:text-xs text-purple-400 tracking-wider">
              UPCOMING EVENTS
            </span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <h2 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-4">
            <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              Join The Next Wave
            </span>
          </h2>
          <p className="font-jetbrains text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            High-stakes hackathons designed for ambitious builders.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : hackathons.length === 0 ? (
          <div className="text-center py-12">
            <Code className="w-12 h-12 text-purple-400/50 mx-auto mb-4" />
            <p className="font-jetbrains text-gray-500">No featured hackathons yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10 ml-8 sm:ml-12 lg:ml-16">
            {hackathons.map((hackathon) => (
              <div
                key={hackathon.id}
                className="group relative bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
              >
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                <div className="relative p-4 sm:p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-black/30 border border-cyan-500/40">
                        <Code className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span className="px-2 py-0.5 text-[9px] font-press-start bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        HACKATHON
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 border text-[9px] font-press-start uppercase ${
                      hackathon.status === 'upcoming' ? 'bg-green-500/20 text-green-300 border-green-500/40' :
                      hackathon.status === 'ongoing' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                      'bg-gray-500/20 text-gray-400 border-gray-500/40'
                    }`}>
                      {hackathon.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-press-start text-xs sm:text-sm text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2 leading-relaxed">
                    {hackathon.name}
                  </h3>
                  <p className="font-jetbrains text-xs text-gray-400 mb-3 line-clamp-2">
                    {hackathon.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-2 mb-3 text-[10px] font-jetbrains text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-purple-400" />
                      <span>{getDateRange(hackathon.startDate, hackathon.endDate)}</span>
                    </div>
                    {hackathon.prize && hackathon.prize !== 'TBD' && (
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-yellow-400" />
                        <span className="text-yellow-300">{hackathon.prize}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`px-1.5 py-0.5 text-[9px] font-jetbrains capitalize border ${formatColors[hackathon.format] || formatColors.hybrid}`}>
                      {hackathon.format}
                    </span>
                    {hackathon.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 bg-white/5 border border-white/10 text-[9px] font-jetbrains text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href={hackathon.registerUrl}
                    target={hackathon.registerUrl.startsWith('http') ? '_blank' : undefined}
                    rel={hackathon.registerUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-press-start text-[9px] transition-all duration-300"
                  >
                    <span>VIEW DETAILS</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/events"
            className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-purple-500/10 border border-purple-500/40 hover:border-purple-400 hover:from-purple-600/30 hover:to-purple-500/20 text-purple-300 hover:text-purple-200 font-press-start text-[10px] sm:text-xs transition-all duration-300"
          >
            <span>VIEW ALL HACKATHONS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </section>
  );
}

export default UpcomingHackathonsSection;
