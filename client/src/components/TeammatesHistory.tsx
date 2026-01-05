import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Trophy, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

interface TeammateCollaboration {
  teammate_id: string;
  teammate_name: string;
  teammate_username: string;
  teammate_avatar: string;
  collaboration_count: number;
  hackathons: {
    hackathon_id: number;
    hackathon_name: string;
    hackathon_slug: string;
    team_name: string;
    collaborated_at: string;
    project_name: string | null;
    project_position: string | null;
  }[];
}

interface TeammatesHistoryProps {
  userId: string;
  showTitle?: boolean;
  limit?: number;
}

export function TeammatesHistory({ userId, showTitle = true, limit = 10 }: TeammatesHistoryProps) {
  const { data: teammates, isLoading } = useQuery({
    queryKey: ['teammates-history', userId],
    queryFn: async () => {
      // Get all collaborations for this user
      const { data: collaborations, error } = await supabase
        .from('team_collaboration_history')
        .select(`
          *,
          teammate:profiles!team_collaboration_history_teammate_id_fkey (
            id,
            full_name,
            username,
            avatar_url
          ),
          hackathon:organizer_hackathons!team_collaboration_history_hackathon_id_fkey (
            id,
            hackathon_name,
            slug
          )
        `)
        .eq('user_id', userId)
        .order('collaborated_at', { ascending: false });

      if (error) throw error;

      // Group by teammate
      const teammateMap = new Map<string, TeammateCollaboration>();
      
      collaborations?.forEach((collab: any) => {
        const teammateId = collab.teammate_id;
        
        if (!teammateMap.has(teammateId)) {
          teammateMap.set(teammateId, {
            teammate_id: teammateId,
            teammate_name: collab.teammate?.full_name || 'Unknown',
            teammate_username: collab.teammate?.username || '',
            teammate_avatar: collab.teammate?.avatar_url || '',
            collaboration_count: 0,
            hackathons: [],
          });
        }
        
        const teammate = teammateMap.get(teammateId)!;
        teammate.collaboration_count++;
        teammate.hackathons.push({
          hackathon_id: collab.hackathon_id,
          hackathon_name: collab.hackathon?.hackathon_name || collab.hackathon_name,
          hackathon_slug: collab.hackathon?.slug || '',
          team_name: collab.team_name,
          collaborated_at: collab.collaborated_at,
          project_name: collab.project_name,
          project_position: collab.project_position,
        });
      });

      // Sort by collaboration count and limit
      return Array.from(teammateMap.values())
        .sort((a, b) => b.collaboration_count - a.collaboration_count)
        .slice(0, limit);
    },
    enabled: !!userId,
  });

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
              <Users className="w-5 h-5 text-purple-400" />
              Teammates
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <p className="text-gray-400 text-sm">
            No team collaborations yet. Join a hackathon with a team to see your teammates here!
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
            <Users className="w-5 h-5 text-purple-400" />
            Teammates Worked With
          </CardTitle>
          <CardDescription className="text-gray-400">
            People you've collaborated with across hackathons
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {teammates.map((teammate) => (
          <div
            key={teammate.teammate_id}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              <Link href={`/profile/${teammate.teammate_username}`}>
                <Avatar className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all">
                  <AvatarImage src={teammate.teammate_avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    {teammate.teammate_name[0]}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/profile/${teammate.teammate_username}`}>
                    <span className="text-white font-medium hover:text-purple-400 cursor-pointer">
                      {teammate.teammate_name}
                    </span>
                  </Link>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    {teammate.collaboration_count} hackathon{teammate.collaboration_count > 1 ? 's' : ''}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">@{teammate.teammate_username}</p>
                
                {/* Recent hackathons together */}
                <div className="mt-3 space-y-2">
                  {teammate.hackathons.slice(0, 3).map((hack, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      <Link href={`/hackathon/${hack.hackathon_slug}`}>
                        <span className="text-gray-400 hover:text-purple-400 cursor-pointer">
                          {hack.hackathon_name}
                        </span>
                      </Link>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-500">{hack.team_name}</span>
                      {hack.project_position && (
                        <>
                          <span className="text-gray-600">•</span>
                          <Badge className="bg-yellow-500/20 text-yellow-400 text-xs py-0">
                            <Trophy className="w-3 h-3 mr-1" />
                            {hack.project_position}
                          </Badge>
                        </>
                      )}
                    </div>
                  ))}
                  {teammate.hackathons.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{teammate.hackathons.length - 3} more hackathons together
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default TeammatesHistory;
