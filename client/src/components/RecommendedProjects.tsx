import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Code, ExternalLink, Github, Heart, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

interface RecommendedProject {
  project_id: number;
  project_name: string;
  tagline: string | null;
  logo_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  category: string | null;
  technologies: string[];
  user_id: string;
  creator_name: string;
  creator_username: string;
  match_score: number;
  match_reasons: string[];
}

interface RecommendedProjectsProps {
  limit?: number;
  showTitle?: boolean;
}

export function RecommendedProjects({ limit = 6, showTitle = true }: RecommendedProjectsProps) {
  const { user } = useAuth();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['recommended-projects', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Try the database function first
      const { data: funcData, error: funcError } = await (supabase as any)
        .rpc('get_recommended_projects', { p_user_id: user.id, p_limit: limit });

      if (!funcError && funcData && (funcData as any[]).length > 0) {
        return funcData as RecommendedProject[];
      }

      // Fallback: Get popular projects the user hasn't created
      const { data: fallback, error } = await supabase
        .from('gallery_projects')
        .select(`
          id,
          name,
          tagline,
          logo_url,
          demo_url,
          github_url,
          category,
          technologies,
          user_id,
          like_count,
          view_count,
          creator:profiles!gallery_projects_user_id_fkey (
            full_name,
            username
          )
        `)
        .in('status', ['approved', 'featured'])
        .neq('user_id', user.id)
        .order('like_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (fallback || []).map((p: any) => ({
        project_id: p.id,
        project_name: p.name,
        tagline: p.tagline,
        logo_url: p.logo_url,
        demo_url: p.demo_url,
        github_url: p.github_url,
        category: p.category,
        technologies: p.technologies || [],
        user_id: p.user_id,
        creator_name: p.creator?.full_name || 'Unknown',
        creator_username: p.creator?.username || '',
        match_score: 50,
        match_reasons: ['Popular project'],
      })) as RecommendedProject[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  if (!user) return null;

  if (isLoading) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6">
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <Card className="bg-black/40 border-white/10">
        {showTitle && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-pink-400" />
              Recommended Projects
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <p className="text-gray-400 text-sm">
            No project recommendations yet. Add skills to your profile or submit projects to get personalized suggestions!
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
            <Sparkles className="w-5 h-5 text-pink-400" />
            Projects You Might Like
          </CardTitle>
          <CardDescription className="text-gray-400">
            Based on your skills and interests
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Link key={project.project_id} href={`/project/${project.project_id}`}>
              <div className="group p-4 bg-white/5 rounded-lg border border-white/10 hover:border-pink-500/30 hover:bg-white/10 transition-all cursor-pointer h-full">
                <div className="flex gap-3">
                  {project.logo_url ? (
                    <img
                      src={project.logo_url}
                      alt={project.project_name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium group-hover:text-pink-400 transition-colors line-clamp-1">
                      {project.project_name}
                    </h4>
                    {project.tagline && (
                      <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">
                        {project.tagline}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      by @{project.creator_username}
                    </p>
                  </div>
                </div>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                      <Badge key={idx} className="bg-purple-500/20 text-purple-400 text-xs py-0">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge className="bg-gray-500/20 text-gray-400 text-xs py-0">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Match reasons */}
                {project.match_reasons && project.match_reasons.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    <Sparkles className="w-3 h-3 text-pink-400" />
                    <span className="text-xs text-pink-400/80">
                      {project.match_reasons[0]}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-pink-400 flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-purple-400 flex items-center gap-1"
                    >
                      <Github className="w-3 h-3" />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/gallery">
          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
            Explore All Projects
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default RecommendedProjects;
