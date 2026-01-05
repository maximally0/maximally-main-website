import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, ExternalLink, Sparkles, ArrowRight, Database, Cloud, Palette, Code, TestTube, Zap } from 'lucide-react';

interface RecommendedTool {
  tool_id: string;
  tool_name: string;
  tool_description: string | null;
  tool_url: string;
  tool_logo: string | null;
  category: string;
  related_technologies: string[];
  match_score: number;
  match_reasons: string[];
}

interface RecommendedToolsProps {
  limit?: number;
  showTitle?: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  framework: <Code className="w-4 h-4" />,
  library: <Zap className="w-4 h-4" />,
  database: <Database className="w-4 h-4" />,
  hosting: <Cloud className="w-4 h-4" />,
  design: <Palette className="w-4 h-4" />,
  devops: <Cloud className="w-4 h-4" />,
  api: <Zap className="w-4 h-4" />,
  testing: <TestTube className="w-4 h-4" />,
  other: <Wrench className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  framework: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  library: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  database: 'bg-green-500/20 text-green-400 border-green-500/30',
  hosting: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  design: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  devops: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  api: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  testing: 'bg-red-500/20 text-red-400 border-red-500/30',
  other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export function RecommendedTools({ limit = 6, showTitle = true }: RecommendedToolsProps) {
  const { user } = useAuth();

  const { data: tools, isLoading } = useQuery({
    queryKey: ['recommended-tools', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Try the database function first
      const { data: funcData, error: funcError } = await (supabase as any)
        .rpc('get_recommended_tools', { p_user_id: user.id, p_limit: limit });

      if (!funcError && funcData && (funcData as any[]).length > 0) {
        return funcData as RecommendedTool[];
      }

      // Fallback: Get popular tools
      const { data: fallback, error } = await (supabase as any)
        .from('recommended_tools')
        .select('*')
        .eq('is_active', true)
        .order('popularity_score', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (fallback || []).map((t: any) => ({
        tool_id: t.id,
        tool_name: t.tool_name,
        tool_description: t.tool_description,
        tool_url: t.tool_url,
        tool_logo: t.tool_logo,
        category: t.category,
        related_technologies: t.related_technologies || [],
        match_score: t.popularity_score,
        match_reasons: ['Popular tool'],
      })) as RecommendedTool[];
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  if (!user) return null;

  if (isLoading) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6">
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-24 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tools || tools.length === 0) {
    return (
      <Card className="bg-black/40 border-white/10">
        {showTitle && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Wrench className="w-5 h-5 text-cyan-400" />
              Recommended Tools
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <p className="text-gray-400 text-sm">
            No tool recommendations yet. Submit projects with your tech stack to get personalized suggestions!
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
            <Wrench className="w-5 h-5 text-cyan-400" />
            Tools For Your Stack
          </CardTitle>
          <CardDescription className="text-gray-400">
            Based on the technologies you use
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <a
              key={tool.tool_id}
              href={tool.tool_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-500/30 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start gap-3">
                {tool.tool_logo ? (
                  <img
                    src={tool.tool_logo}
                    alt={tool.tool_name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    {categoryIcons[tool.category] || <Wrench className="w-5 h-5 text-white" />}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                      {tool.tool_name}
                    </h4>
                    <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-cyan-400" />
                  </div>
                  <Badge className={`${categoryColors[tool.category]} text-xs mt-1`}>
                    {tool.category}
                  </Badge>
                </div>
              </div>

              {tool.tool_description && (
                <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                  {tool.tool_description}
                </p>
              )}

              {/* Related technologies */}
              {tool.related_technologies && tool.related_technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tool.related_technologies.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="text-xs text-gray-500">
                      {tech}{idx < Math.min(tool.related_technologies.length, 3) - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              )}

              {/* Match reasons */}
              {tool.match_reasons && tool.match_reasons.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs text-cyan-400/80">
                    {tool.match_reasons[0]}
                  </span>
                </div>
              )}
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecommendedTools;
