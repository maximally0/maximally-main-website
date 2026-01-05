import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, MapPin, Users, ArrowRight, Trophy, Zap } from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';

interface RecommendedHackathon {
  hackathon_id: number;
  hackathon_name: string;
  slug: string;
  format: string;
  start_date: string;
  end_date: string;
  match_score: number;
  match_reasons: string[];
  tagline?: string;
  cover_image?: string;
  total_prize_pool?: string;
  registrations_count?: number;
}

interface RecommendedHackathonsProps {
  limit?: number;
  showTitle?: boolean;
}

export function RecommendedHackathons({ limit = 5, showTitle = true }: RecommendedHackathonsProps) {
  const { user } = useAuth();

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommended-hackathons', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Try to use the database function first
      const { data: funcData, error: funcError } = await (supabase as any)
        .rpc('get_recommended_hackathons', { p_user_id: user.id, p_limit: limit });

      if (!funcError && funcData && (funcData as any[]).length > 0) {
        // Enrich with additional hackathon data
        const hackathonIds = (funcData as any[]).map((h: any) => h.hackathon_id);
        const { data: hackathons } = await supabase
          .from('organizer_hackathons')
          .select('id, tagline, cover_image, total_prize_pool, registrations_count')
          .in('id', hackathonIds);

        const hackathonMap = new Map((hackathons || []).map((h: any) => [h.id, h]));
        
        return (funcData as any[]).map((rec: any) => ({
          ...rec,
          ...(hackathonMap.get(rec.hackathon_id) || {}),
        })) as RecommendedHackathon[];
      }

      // Fallback: Simple recommendation based on upcoming hackathons
      const { data: upcoming, error } = await supabase
        .from('organizer_hackathons')
        .select('id, hackathon_name, slug, format, start_date, end_date, tagline, cover_image, total_prize_pool, registrations_count, themes')
        .eq('status', 'published')
        .gt('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(limit);

      if (error) throw error;

      // Get user's past hackathons to filter out
      const { data: registered } = await supabase
        .from('hackathon_registrations')
        .select('hackathon_id')
        .eq('user_id', user.id);

      const registeredIds = new Set((registered || []).map((r: any) => r.hackathon_id));

      return (upcoming || [])
        .filter((h: any) => !registeredIds.has(h.id))
        .map((h: any) => ({
          hackathon_id: h.id,
          hackathon_name: h.hackathon_name,
          slug: h.slug,
          format: h.format,
          start_date: h.start_date,
          end_date: h.end_date,
          tagline: h.tagline,
          cover_image: h.cover_image,
          total_prize_pool: h.total_prize_pool,
          registrations_count: h.registrations_count,
          match_score: 50,
          match_reasons: ['Upcoming hackathon'],
        })) as RecommendedHackathon[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="bg-black/40 border-white/10">
        {showTitle && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Recommended For You
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <p className="text-gray-400 text-sm">
            No recommendations available right now. Check back later for personalized hackathon suggestions!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-white/10">
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Recommended For You
          </CardTitle>
          <CardDescription className="text-gray-400">
            Hackathons matched to your interests and past participation
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {recommendations.map((hackathon) => (
          <Link key={hackathon.hackathon_id} href={`/hackathon/${hackathon.slug}`}>
            <div className="group p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex gap-4">
                {/* Cover Image */}
                {hackathon.cover_image && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={hackathon.cover_image}
                      alt={hackathon.hackathon_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-white font-medium group-hover:text-purple-400 transition-colors line-clamp-1">
                        {hackathon.hackathon_name}
                      </h4>
                      {hackathon.tagline && (
                        <p className="text-sm text-gray-400 line-clamp-1 mt-0.5">
                          {hackathon.tagline}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors flex-shrink-0" />
                  </div>
                  
                  {/* Meta info */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(hackathon.start_date), 'MMM d')}
                    </span>
                    <Badge className={`text-xs py-0 ${
                      hackathon.format === 'online' 
                        ? 'bg-green-500/20 text-green-400' 
                        : hackathon.format === 'offline'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {hackathon.format}
                    </Badge>
                    {hackathon.total_prize_pool && (
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Trophy className="w-3 h-3" />
                        {hackathon.total_prize_pool}
                      </span>
                    )}
                    {hackathon.registrations_count !== undefined && hackathon.registrations_count > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {hackathon.registrations_count}
                      </span>
                    )}
                  </div>
                  
                  {/* Match reasons */}
                  {hackathon.match_reasons && hackathon.match_reasons.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400/80">
                        {hackathon.match_reasons.slice(0, 2).join(' • ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
        
        <Link href="/events">
          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
            View All Hackathons
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default RecommendedHackathons;
