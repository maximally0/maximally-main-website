import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  School, 
  Award,
  BarChart3,
  PieChart
} from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

interface AnalyticsProps {
  hackathonId: number;
}

export default function RegistrationAnalytics({ hackathonId }: AnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [hackathonId]);

  const fetchAnalytics = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/analytics`, { headers });
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="font-press-start text-sm text-gray-400">LOADING_ANALYTICS...</div>
      </div>
    );
  }

  if (!analytics) return null;

  const { overview, collegeStats, experienceStats, timeline } = analytics;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/20 border border-green-500/30 p-4 hover:border-green-400/50 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-green-400" />
            <span className="font-press-start text-xs text-gray-400">CHECK-IN_RATE</span>
          </div>
          <div className="text-3xl font-bold text-green-300 font-press-start">
            {overview.checkInRate}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-500/30 p-4 hover:border-purple-400/50 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-purple-400" />
            <span className="font-press-start text-xs text-gray-400">TEAMS</span>
          </div>
          <div className="text-3xl font-bold text-purple-300 font-press-start">
            {overview.teams}
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/20 border border-cyan-500/30 p-4 hover:border-cyan-400/50 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-cyan-400" />
            <span className="font-press-start text-xs text-gray-400">INDIVIDUALS</span>
          </div>
          <div className="text-3xl font-bold text-cyan-300 font-press-start">
            {overview.individuals}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/20 border border-amber-500/30 p-4 hover:border-amber-400/50 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-amber-400" />
            <span className="font-press-start text-xs text-gray-400">WAITLIST</span>
          </div>
          <div className="text-3xl font-bold text-amber-300 font-press-start">
            {overview.waitlist}
          </div>
        </div>
      </div>

      {/* Top Colleges */}
      {collegeStats && collegeStats.length > 0 && (
        <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-amber-500/30 p-6 hover:border-amber-400/50 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <School className="h-5 w-5 text-amber-400" />
            <h3 className="font-press-start text-sm bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">TOP_COLLEGES</h3>
          </div>
          <div className="space-y-3">
            {collegeStats.slice(0, 5).map((college: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-jetbrains text-white text-sm">{college.college_university}</div>
                  <div className="w-full bg-gray-800/50 h-2 mt-1 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-full"
                      style={{ width: `${(college.total_registrations / collegeStats[0].total_registrations) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 font-press-start text-sm text-amber-300">
                  {college.total_registrations}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience Level Distribution */}
      {experienceStats && experienceStats.length > 0 && (
        <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-pink-500/30 p-6 hover:border-pink-400/50 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-pink-400" />
            <h3 className="font-press-start text-sm bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">EXPERIENCE_LEVELS</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {experienceStats.map((exp: any) => (
              <div key={exp.experience_level} className="text-center bg-black/30 border border-purple-500/20 p-3">
                <div className="text-2xl font-bold text-white font-press-start mb-1">
                  {exp.total_registrations}
                </div>
                <div className="text-xs text-gray-400 font-press-start uppercase">
                  {exp.experience_level}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registration Timeline */}
      {timeline && Object.keys(timeline).length > 0 && (
        <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-green-500/30 p-6 hover:border-green-400/50 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <h3 className="font-press-start text-sm bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">REGISTRATION_TIMELINE</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(timeline).slice(-7).map(([date, count]: [string, any]) => (
              <div key={date} className="flex items-center gap-3">
                <div className="font-jetbrains text-xs text-gray-400 w-24">
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 bg-gray-800/50 h-6 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-full flex items-center justify-end pr-2"
                    style={{ width: `${Math.min((count / Math.max(...Object.values(timeline) as number[])) * 100, 100)}%` }}
                  >
                    <span className="font-press-start text-xs text-white">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
