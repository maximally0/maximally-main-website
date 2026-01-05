import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PieChart, TrendingUp, TrendingDown, Minus, 
  Code, Database, Cloud, Smartphone, Brain, Link2, Layers
} from 'lucide-react';

interface DomainStat {
  domain: string;
  submission_count: number;
  percentage: number;
}

interface DomainTrend {
  domain: string;
  hackathon_count: number;
  submission_count: number;
  trend_direction: 'new' | 'rising' | 'stable' | 'declining';
}

interface DomainAnalyticsProps {
  hackathonId?: number;
  showPlatformTrends?: boolean;
}

const domainIcons: Record<string, React.ReactNode> = {
  'Frontend': <Code className="w-4 h-4" />,
  'Backend': <Layers className="w-4 h-4" />,
  'AI/ML': <Brain className="w-4 h-4" />,
  'Database': <Database className="w-4 h-4" />,
  'Cloud/DevOps': <Cloud className="w-4 h-4" />,
  'Mobile': <Smartphone className="w-4 h-4" />,
  'Web3/Blockchain': <Link2 className="w-4 h-4" />,
  'Other': <Layers className="w-4 h-4" />,
};

const domainColors: Record<string, string> = {
  'Frontend': 'bg-blue-500',
  'Backend': 'bg-green-500',
  'AI/ML': 'bg-purple-500',
  'Database': 'bg-yellow-500',
  'Cloud/DevOps': 'bg-orange-500',
  'Mobile': 'bg-pink-500',
  'Web3/Blockchain': 'bg-cyan-500',
  'Other': 'bg-gray-500',
};

const trendIcons: Record<string, React.ReactNode> = {
  new: <TrendingUp className="w-4 h-4 text-green-400" />,
  rising: <TrendingUp className="w-4 h-4 text-green-400" />,
  stable: <Minus className="w-4 h-4 text-yellow-400" />,
  declining: <TrendingDown className="w-4 h-4 text-red-400" />,
};

const trendColors: Record<string, string> = {
  new: 'bg-green-500/20 text-green-400',
  rising: 'bg-green-500/20 text-green-400',
  stable: 'bg-yellow-500/20 text-yellow-400',
  declining: 'bg-red-500/20 text-red-400',
};

export function DomainAnalytics({ hackathonId, showPlatformTrends = true }: DomainAnalyticsProps) {
  // Fetch hackathon-specific domain analytics
  const { data: hackathonDomains, isLoading: hackathonLoading } = useQuery({
    queryKey: ['domain-analytics', hackathonId],
    queryFn: async () => {
      if (!hackathonId) return null;

      const { data, error } = await (supabase as any)
        .rpc('get_domain_analytics', { p_hackathon_id: hackathonId });

      if (error) throw error;
      return (data || []) as DomainStat[];
    },
    enabled: !!hackathonId,
  });

  // Fetch platform-wide domain trends
  const { data: platformTrends, isLoading: trendsLoading } = useQuery({
    queryKey: ['platform-domain-trends'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .rpc('get_platform_domain_trends', { p_days: 90 });

      if (error) throw error;
      return (data || []) as DomainTrend[];
    },
    enabled: showPlatformTrends,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const isLoading = hackathonLoading || trendsLoading;

  if (isLoading) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-white/10 rounded w-1/3"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-white/10 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <PieChart className="w-5 h-5 text-purple-400" />
          Domain Analytics
        </CardTitle>
        <CardDescription className="text-gray-400">
          Technology domains and trends across submissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={hackathonId ? "hackathon" : "platform"} className="space-y-4">
          <TabsList className="bg-white/5 border border-white/10">
            {hackathonId && <TabsTrigger value="hackathon">This Hackathon</TabsTrigger>}
            {showPlatformTrends && <TabsTrigger value="platform">Platform Trends</TabsTrigger>}
          </TabsList>

          {/* Hackathon-specific domains */}
          {hackathonId && (
            <TabsContent value="hackathon" className="space-y-4">
              {hackathonDomains && hackathonDomains.length > 0 ? (
                <div className="space-y-3">
                  {hackathonDomains.map((domain, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${domainColors[domain.domain] || 'bg-gray-500'} flex items-center justify-center text-white`}>
                        {domainIcons[domain.domain] || <Layers className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white">{domain.domain}</span>
                          <span className="text-xs text-gray-400">
                            {domain.submission_count} ({domain.percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${domainColors[domain.domain] || 'bg-gray-500'} rounded-full transition-all`}
                            style={{ width: `${domain.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No domain data available yet.</p>
              )}
            </TabsContent>
          )}

          {/* Platform-wide trends */}
          {showPlatformTrends && (
            <TabsContent value="platform" className="space-y-4">
              {platformTrends && platformTrends.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 mb-4">
                    Trends based on the last 90 days of submissions
                  </p>
                  {platformTrends.slice(0, 10).map((trend, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-500">#{idx + 1}</span>
                        <div>
                          <span className="text-white font-medium">{trend.domain}</span>
                          <div className="text-xs text-gray-400">
                            {trend.submission_count} submissions in {trend.hackathon_count} hackathons
                          </div>
                        </div>
                      </div>
                      <Badge className={trendColors[trend.trend_direction]}>
                        {trendIcons[trend.trend_direction]}
                        <span className="ml-1 capitalize">{trend.trend_direction}</span>
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No trend data available.</p>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default DomainAnalytics;
