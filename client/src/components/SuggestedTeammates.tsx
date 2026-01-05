import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Sparkles, UserPlus, MessageSquare, History, Search } from 'lucide-react';
import { Link } from 'wouter';

interface SuggestedTeammate {
  user_id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  skills: string[];
  experience_level: string;
  collaboration_count: number;
  last_collaborated_at: string | null;
  match_score: number;
  match_reasons: string[];
}

interface SuggestedTeammatesProps {
  hackathonId?: number;
  limit?: number;
  showTitle?: boolean;
  onInvite?: (userId: string) => void;
}

const experienceColors: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  advanced: 'bg-red-500/20 text-red-400',
};

export function SuggestedTeammates({ 
  hackathonId, 
  limit = 6, 
  showTitle = true,
  onInvite 
}: SuggestedTeammatesProps) {
  const { user } = useAuth();

  const { data: teammates, isLoading } = useQuery({
    queryKey: ['suggested-teammates', user?.id, hackathonId],
    queryFn: async () => {
      if (!user?.id) return [];

      // Try the database function
      const { data: funcData, error: funcError } = await (supabase as any)
        .rpc('get_suggested_teammates', { 
          p_user_id: user.id, 
          p_hackathon_id: hackathonId || null,
          p_limit: limit 
        });

      if (!funcError && funcData && (funcData as any[]).length > 0) {
        return funcData as SuggestedTeammate[];
      }

      // Fallback: Get users looking for teams
      const { data: fallback, error } = await supabase
        .from('hackathon_registrations')
        .select(`
          user_id,
          looking_for_team,
          experience_level,
          profile:profiles!hackathon_registrations_user_id_fkey (
            id,
            full_name,
            username,
            avatar_url,
            skills
          )
        `)
        .eq('looking_for_team', true)
        .neq('user_id', user.id)
        .limit(limit);

      if (error) throw error;

      // Deduplicate by user_id
      const uniqueUsers = new Map();
      (fallback || []).forEach((r: any) => {
        if (r.profile && !uniqueUsers.has(r.user_id)) {
          uniqueUsers.set(r.user_id, {
            user_id: r.user_id,
            full_name: r.profile.full_name || 'Unknown',
            username: r.profile.username || '',
            avatar_url: r.profile.avatar_url,
            skills: r.profile.skills || [],
            experience_level: r.experience_level || 'intermediate',
            collaboration_count: 0,
            last_collaborated_at: null,
            match_score: 50,
            match_reasons: ['Looking for team'],
          });
        }
      });

      return Array.from(uniqueUsers.values()) as SuggestedTeammate[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  if (!user) return null;

  if (isLoading) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-1/3"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!teammates || teammates.length === 0) {
    return (
      <Card className="bg-black/40 border-white/10">
        {showTitle && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-green-400" />
              Find Teammates
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <p className="text-gray-400 text-sm">
            No teammate suggestions available. Join hackathons and collaborate to get better suggestions!
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
            <Users className="w-5 h-5 text-green-400" />
            Suggested Teammates
          </CardTitle>
          <CardDescription className="text-gray-400">
            {hackathonId 
              ? 'People who might be a great fit for your team'
              : 'Based on your collaboration history and skills'}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {teammates.map((teammate) => (
          <div
            key={teammate.user_id}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-green-500/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              <Link href={`/profile/${teammate.username}`}>
                <Avatar className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-green-500 transition-all">
                  <AvatarImage src={teammate.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-cyan-500 text-white">
                    {teammate.full_name?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/profile/${teammate.username}`}>
                    <span className="text-white font-medium hover:text-green-400 cursor-pointer">
                      {teammate.full_name}
                    </span>
                  </Link>
                  {teammate.experience_level && (
                    <Badge className={`${experienceColors[teammate.experience_level]} text-xs`}>
                      {teammate.experience_level}
                    </Badge>
                  )}
                  {teammate.collaboration_count > 0 && (
                    <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                      <History className="w-3 h-3 mr-1" />
                      {teammate.collaboration_count}x teammate
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400">@{teammate.username}</p>

                {/* Skills */}
                {teammate.skills && teammate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {teammate.skills.slice(0, 4).map((skill, idx) => (
                      <Badge key={idx} className="bg-gray-500/20 text-gray-400 text-xs py-0">
                        {skill}
                      </Badge>
                    ))}
                    {teammate.skills.length > 4 && (
                      <Badge className="bg-gray-500/20 text-gray-400 text-xs py-0">
                        +{teammate.skills.length - 4}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Match reasons */}
                {teammate.match_reasons && teammate.match_reasons.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    <Sparkles className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400/80">
                      {teammate.match_reasons.join(' • ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Link href={`/profile/${teammate.username}`}>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Search className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </Link>
                {onInvite && (
                  <Button 
                    size="sm" 
                    onClick={() => onInvite(teammate.user_id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <UserPlus className="w-3 h-3 mr-1" />
                    Invite
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default SuggestedTeammates;
