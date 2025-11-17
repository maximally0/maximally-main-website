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
        <div className="pixel-card bg-gray-900 border-2 border-green-500 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-green-500" />
            <span className="font-press-start text-xs text-gray-400">CHECK-IN_RATE</span>
          </div>
          <div className="text-3xl font-bold text-green-500 font-press-start">
            {overview.checkInRate}%
          </div>
        </div>

        <div className="pixel-card bg-gray-900 border-2 border-purple-500 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-purple-500" />
            <span className="font-press-start text-xs text-gray-400">TEAMS</span>
          </div>
          <div className="text-3xl font-bold text-purple-500 font-press-start">
            {overview.teams}
          </div>
        </div>

        <div className="pixel-card bg-gray-900 border-2 border-blue-500 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="font-press-start text-xs text-gray-400">INDIVIDUALS</span>
          </div>
          <div className="text-3xl font-bold text-blue-500 font-press-start">
            {overview.individuals}
          </div>
        </div>

        <div className="pixel-card bg-gray-900 border-2 border-orange-500 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-orange-500" />
            <span className="font-press-start text-xs text-gray-400">WAITLIST</span>
          </div>
          <div className="text-3xl font-bold text-orange-500 font-press-start">
            {overview.waitlist}
          </div>
        </div>
      </div>

      {/* Top Colleges */}
      {collegeStats && collegeStats.length > 0 && (
        <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <School className="h-5 w-5 text-maximally-yellow" />
            <h3 className="font-press-start text-sm text-maximally-yellow">TOP_COLLEGES</h3>
          </div>
          <div className="space-y-3">
            {collegeStats.slice(0, 5).map((college: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-jetbrains text-white text-sm">{college.college_university}</div>
                  <div className="w-full bg-gray-800 h-2 mt-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-maximally-yellow h-full"
                      style={{ width: `${(college.total_registrations / collegeStats[0].total_registrations) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 font-press-start text-sm text-maximally-yellow">
                  {college.total_registrations}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience Level Distribution */}
      {experienceStats && experienceStats.length > 0 && (
        <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-maximally-red" />
            <h3 className="font-press-start text-sm text-maximally-red">EXPERIENCE_LEVELS</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {experienceStats.map((exp: any) => (
              <div key={exp.experience_level} className="text-center">
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
        <div className="pixel-card bg-gray-900 border-2 border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="font-press-start text-sm text-green-500">REGISTRATION_TIMELINE</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(timeline).slice(-7).map(([date, count]: [string, any]) => (
              <div key={date} className="flex items-center gap-3">
                <div className="font-jetbrains text-xs text-gray-400 w-24">
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 bg-gray-800 h-6 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-full flex items-center justify-end pr-2"
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
