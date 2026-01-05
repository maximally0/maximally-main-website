import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, Clock, Code, Users, TrendingUp, 
  Activity, Layers, Award, Calendar, PieChart
} from 'lucide-react';
import DomainAnalytics from '@/components/DomainAnalytics';

interface HackathonInsights {
  hackathon_id: number;
  hackathon_name: string;
  total_registrations: number;
  confirmed_registrations: number;
  waitlist_count: number;
  checked_in_count: number;
  total_teams: number;
  avg_team_size: number;
  total_submissions: number;
  submitted_count: number;
  first_registration_at: string | null;
  last_registration_at: string | null;
  first_submission_at: string | null;
  last_submission_at: string | null;
  popular_technologies: { tech: string; count: number }[] | null;
  track_distribution: { track: string; count: number }[] | null;
  role_distribution: { team_role: string; count: number }[] | null;
  experience_distribution: { experience_level: string; count: number }[] | null;
}

interface SubmissionTiming {
  hour_of_day: number;
  day_of_week: number;
  submission_count: number;
}

interface OrganizerInsightsProps {
  hackathonId: number;
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const roleIcons: Record<string, string> = {
  developer: '💻',
  designer: '🎨',
  pm: '📋',
  marketing: '📢',
  leader: '👑',
  other: '🔧',
};

export function OrganizerInsights({ hackathonId }: OrganizerInsightsProps) {
  // Fetch insights from the view
  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ['hackathon-insights', hackathonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hackathon_insights')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .single();

      if (error) throw error;
      return data as HackathonInsights;
    },
  });

  // Fetch submission timing analytics
  const { data: timingData } = useQuery({
    queryKey: ['submission-timing', hackathonId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .rpc('get_submission_timing_analytics', { p_hackathon_id: hackathonId });

      if (error) return null;
      return (data || []) as SubmissionTiming[];
    },
  });

  // Fetch judge activity
  const { data: judgeActivity } = useQuery({
    queryKey: ['judge-activity', hackathonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('judge_activity_log')
        .select(`
          activity_type,
          created_at,
          judge:profiles!judge_activity_log_judge_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('hackathon_id', hackathonId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) return null;
      return data;
    },
  });

  if (insightsLoading) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/3"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-white/10 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6">
          <p className="text-gray-400">No insights available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Hackathon Insights
        </CardTitle>
        <CardDescription className="text-gray-400">
          Detailed analytics and insights for your hackathon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tech">Tech Stack</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="timing">Timing</TabsTrigger>
            <TabsTrigger value="domains">Domains</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<Users className="w-5 h-5 text-blue-400" />}
                label="Total Registrations"
                value={insights.total_registrations || 0}
                subValue={`${insights.confirmed_registrations || 0} confirmed`}
              />
              <StatCard
                icon={<Layers className="w-5 h-5 text-purple-400" />}
                label="Teams Formed"
                value={insights.total_teams || 0}
                subValue={`Avg ${insights.avg_team_size?.toFixed(1) || 0} members`}
              />
              <StatCard
                icon={<Award className="w-5 h-5 text-green-400" />}
                label="Submissions"
                value={insights.submitted_count || 0}
                subValue={`of ${insights.total_submissions || 0} drafts`}
              />
              <StatCard
                icon={<Activity className="w-5 h-5 text-yellow-400" />}
                label="Check-ins"
                value={insights.checked_in_count || 0}
                subValue={`${insights.waitlist_count || 0} on waitlist`}
              />
            </div>

            {/* Track Distribution */}
            {insights.track_distribution && insights.track_distribution.length > 0 && (
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Track Distribution
                </h4>
                <div className="space-y-2">
                  {insights.track_distribution.map((track, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-sm text-gray-400 w-32 truncate">{track.track}</span>
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{
                            width: `${(track.count / Math.max(...insights.track_distribution!.map(t => t.count))) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-white w-8 text-right">{track.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Tech Stack Tab */}
          <TabsContent value="tech" className="space-y-4">
            {insights.popular_technologies && insights.popular_technologies.length > 0 ? (
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Code className="w-4 h-4 text-green-400" />
                  Popular Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {insights.popular_technologies.map((tech, idx) => (
                    <Badge
                      key={idx}
                      className="bg-green-500/20 text-green-400 border-green-500/30"
                    >
                      {tech.tech}
                      <span className="ml-1 text-green-300/60">({tech.count})</span>
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No technology data available yet.</p>
            )}
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role Distribution */}
              {insights.role_distribution && insights.role_distribution.length > 0 && (
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    Role Distribution
                  </h4>
                  <div className="space-y-2">
                    {insights.role_distribution.map((role, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-gray-400 flex items-center gap-2">
                          <span>{roleIcons[role.team_role] || '👤'}</span>
                          {role.team_role.charAt(0).toUpperCase() + role.team_role.slice(1)}
                        </span>
                        <Badge className="bg-blue-500/20 text-blue-400">
                          {role.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Distribution */}
              {insights.experience_distribution && insights.experience_distribution.length > 0 && (
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                    Experience Levels
                  </h4>
                  <div className="space-y-2">
                    {insights.experience_distribution.map((exp, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-sm text-gray-400 w-24 capitalize">
                          {exp.experience_level}
                        </span>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              exp.experience_level === 'beginner'
                                ? 'bg-green-500'
                                : exp.experience_level === 'intermediate'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{
                              width: `${(exp.count / Math.max(...insights.experience_distribution!.map(e => e.count))) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-white w-8 text-right">{exp.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Timing Tab */}
          <TabsContent value="timing" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Registration Timeline */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  Registration Timeline
                </h4>
                <div className="space-y-2 text-sm">
                  {insights.first_registration_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">First Registration</span>
                      <span className="text-white">
                        {new Date(insights.first_registration_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {insights.last_registration_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Registration</span>
                      <span className="text-white">
                        {new Date(insights.last_registration_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submission Timeline */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  Submission Timeline
                </h4>
                <div className="space-y-2 text-sm">
                  {insights.first_submission_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">First Submission</span>
                      <span className="text-white">
                        {new Date(insights.first_submission_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {insights.last_submission_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Submission</span>
                      <span className="text-white">
                        {new Date(insights.last_submission_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submission Heatmap */}
            {timingData && timingData.length > 0 && (
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  Submission Activity Heatmap
                </h4>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-25 gap-1 min-w-[600px]">
                    {/* Header row */}
                    <div className="text-xs text-gray-500"></div>
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="text-xs text-gray-500 text-center">
                        {i}
                      </div>
                    ))}
                    
                    {/* Data rows */}
                    {dayNames.map((day, dayIdx) => (
                      <>
                        <div key={`day-${dayIdx}`} className="text-xs text-gray-500 pr-2">
                          {day}
                        </div>
                        {Array.from({ length: 24 }, (_, hour) => {
                          const data = timingData.find(
                            (t) => t.day_of_week === dayIdx && t.hour_of_day === hour
                          );
                          const count = data?.submission_count || 0;
                          const maxCount = Math.max(...timingData.map((t) => t.submission_count));
                          const intensity = maxCount > 0 ? count / maxCount : 0;
                          
                          return (
                            <div
                              key={`${dayIdx}-${hour}`}
                              className="w-4 h-4 rounded-sm"
                              style={{
                                backgroundColor: `rgba(139, 92, 246, ${intensity * 0.8 + 0.1})`,
                              }}
                              title={`${day} ${hour}:00 - ${count} submissions`}
                            />
                          );
                        })}
                      </>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Darker colors indicate more submission activity
                </p>
              </div>
            )}
          </TabsContent>

          {/* Domains Tab */}
          <TabsContent value="domains" className="space-y-4">
            <DomainAnalytics hackathonId={hackathonId} showPlatformTrends={false} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Helper component for stat cards
function StatCard({
  icon,
  label,
  value,
  subValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subValue?: string;
}) {
  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {subValue && <div className="text-xs text-gray-500 mt-1">{subValue}</div>}
    </div>
  );
}

export default OrganizerInsights;
