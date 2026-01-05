import { useState, useEffect } from 'react';
import { 
  Users, 
  Send, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';

interface JudgeProgress {
  judge_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  scored: number;
  total: number;
  progress: number;
  completed: boolean;
}

interface JudgeProgressManagerProps {
  hackathonId: number;
}

export default function JudgeProgressManager({ hackathonId }: JudgeProgressManagerProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [data, setData] = useState<{
    totalSubmissions: number;
    judges: JudgeProgress[];
    overallProgress: number;
  } | null>(null);

  useEffect(() => {
    fetchProgress();
  }, [hackathonId]);

  const fetchProgress = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/judge-progress`, { headers });
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching judge progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendReminders = async () => {
    setSending(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}/send-judge-reminders`, {
        method: 'POST',
        headers,
      });
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Reminders Sent!",
          description: `${result.sent} reminder email(s) sent to judges`,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reminders",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!data || data.judges.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700 p-8 text-center">
        <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <h2 className="font-press-start text-lg text-gray-400 mb-2">NO JUDGES ASSIGNED</h2>
        <p className="text-gray-500 font-jetbrains text-sm">
          Invite judges to start tracking their progress.
        </p>
      </div>
    );
  }

  const incompleteJudges = data.judges.filter(j => !j.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-green-400" />
          <h2 className="font-press-start text-lg bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            JUDGE PROGRESS
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setLoading(true); fetchProgress(); }}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={sendReminders}
            disabled={sending || incompleteJudges.length === 0}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-4 py-2 font-press-start text-xs transition-all flex items-center gap-2 border border-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            SEND REMINDERS
          </button>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-press-start text-xs text-green-400 mb-1">OVERALL PROGRESS</p>
            <p className="font-jetbrains text-sm text-gray-400">
              {data.totalSubmissions} submissions • {data.judges.length} judges
            </p>
          </div>
          <div className="text-right">
            <p className="font-press-start text-3xl text-green-400">{data.overallProgress}%</p>
          </div>
        </div>
        <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${data.overallProgress}%` }}
          />
        </div>
      </div>

      {/* Judge List */}
      <div className="space-y-3">
        {data.judges.map((judge) => (
          <div
            key={judge.judge_id}
            className={`bg-gradient-to-br border p-4 transition-colors ${
              judge.completed
                ? 'from-green-900/20 to-emerald-900/10 border-green-500/30'
                : judge.progress > 50
                  ? 'from-amber-900/20 to-orange-900/10 border-amber-500/30'
                  : 'from-gray-900/60 to-gray-900/30 border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                  {judge.avatar_url ? (
                    <img src={judge.avatar_url} alt={judge.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-press-start text-xs text-white">
                      {judge.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                {/* Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-press-start text-sm text-white">{judge.name}</p>
                    {judge.completed && (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    )}
                  </div>
                  <p className="font-jetbrains text-xs text-gray-500">{judge.email}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="text-right">
                <p className={`font-press-start text-lg ${
                  judge.completed ? 'text-green-400' : 
                  judge.progress > 50 ? 'text-amber-400' : 'text-gray-400'
                }`}>
                  {judge.scored}/{judge.total}
                </p>
                <p className="font-jetbrains text-xs text-gray-500">
                  {judge.progress}% complete
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  judge.completed ? 'bg-green-500' :
                  judge.progress > 50 ? 'bg-amber-500' : 'bg-gray-600'
                }`}
                style={{ width: `${judge.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/30 p-4 text-center">
          <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <p className="font-press-start text-xl text-green-400">
            {data.judges.filter(j => j.completed).length}
          </p>
          <p className="font-jetbrains text-xs text-gray-500">Completed</p>
        </div>
        <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/10 border border-amber-500/30 p-4 text-center">
          <Clock className="h-6 w-6 text-amber-400 mx-auto mb-2" />
          <p className="font-press-start text-xl text-amber-400">
            {data.judges.filter(j => !j.completed && j.progress > 0).length}
          </p>
          <p className="font-jetbrains text-xs text-gray-500">In Progress</p>
        </div>
        <div className="bg-gradient-to-br from-red-900/20 to-pink-900/10 border border-red-500/30 p-4 text-center">
          <AlertCircle className="h-6 w-6 text-red-400 mx-auto mb-2" />
          <p className="font-press-start text-xl text-red-400">
            {data.judges.filter(j => j.progress === 0).length}
          </p>
          <p className="font-jetbrains text-xs text-gray-500">Not Started</p>
        </div>
      </div>
    </div>
  );
}
