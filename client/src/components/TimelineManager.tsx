import { useState, useEffect } from 'react';
import { Clock, Calendar, Save, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';

interface TimelineManagerProps {
  hackathonId: number;
}

export default function TimelineManager({ hackathonId }: TimelineManagerProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [timeline, setTimeline] = useState({
    registration_opens_at: '',
    registration_closes_at: '',
    submission_opens_at: '',
    submission_closes_at: '',
    judging_starts_at: '',
    judging_ends_at: '',
    results_announced_at: ''
  });

  useEffect(() => {
    fetchTimeline();
  }, [hackathonId]);

  const fetchTimeline = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/organizer/hackathons/${hackathonId}`, { headers });
      const data = await response.json();

      if (data.success) {
        const hackathon = data.data;
        setTimeline({
          registration_opens_at: hackathon.registration_opens_at ? new Date(hackathon.registration_opens_at).toISOString().slice(0, 16) : '',
          registration_closes_at: hackathon.registration_closes_at ? new Date(hackathon.registration_closes_at).toISOString().slice(0, 16) : '',
          submission_opens_at: hackathon.submission_opens_at ? new Date(hackathon.submission_opens_at).toISOString().slice(0, 16) : '',
          submission_closes_at: hackathon.submission_closes_at ? new Date(hackathon.submission_closes_at).toISOString().slice(0, 16) : '',
          judging_starts_at: hackathon.judging_starts_at ? new Date(hackathon.judging_starts_at).toISOString().slice(0, 16) : '',
          judging_ends_at: hackathon.judging_ends_at ? new Date(hackathon.judging_ends_at).toISOString().slice(0, 16) : '',
          results_announced_at: hackathon.results_announced_at ? new Date(hackathon.results_announced_at).toISOString().slice(0, 16) : ''
        });
      }
    } catch (error) {
      console.error('Error fetching timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      
      const timelineData = Object.fromEntries(
        Object.entries(timeline).map(([key, value]) => [
          key,
          value ? new Date(value).toISOString() : null
        ])
      );

      const response = await fetch(`/api/organizer/hackathons/${hackathonId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(timelineData)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Timeline Updated!",
          description: "Hackathon timeline has been saved successfully",
        });
        await fetchTimeline();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 font-press-start text-gray-400">LOADING...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 border border-amber-500/40">
            <Clock className="h-5 w-5 text-amber-400" />
          </div>
          <h2 className="font-press-start text-lg text-amber-400">HACKATHON TIMELINE</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white px-6 py-3 font-press-start text-xs transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'SAVING...' : 'SAVE TIMELINE'}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-300 font-jetbrains">
            <p className="mb-2">Set the timeline for your hackathon. These dates control:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>When participants can register</li>
              <li>When submissions are accepted</li>
              <li>When judging takes place</li>
              <li>When results are announced</li>
              <li>The status badge shown on the hackathon page</li>
            </ul>
            <p className="mt-2 text-blue-400">All fields are optional. Leave blank to use default behavior.</p>
          </div>
        </div>
      </div>

      {/* Timeline Form */}
      <div className="space-y-6">
        {/* Registration Period */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 p-6">
          <h3 className="font-press-start text-sm text-blue-400 mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            REGISTRATION PERIOD
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Opens At</label>
              <input
                type="datetime-local"
                value={timeline.registration_opens_at}
                onChange={(e) => setTimeline({ ...timeline, registration_opens_at: e.target.value })}
                className="w-full bg-black/50 border border-blue-500/30 text-white px-4 py-3 font-jetbrains focus:border-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Closes At</label>
              <input
                type="datetime-local"
                value={timeline.registration_closes_at}
                onChange={(e) => setTimeline({ ...timeline, registration_closes_at: e.target.value })}
                className="w-full bg-black/50 border border-blue-500/30 text-white px-4 py-3 font-jetbrains focus:border-blue-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submission Period */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 p-6">
          <h3 className="font-press-start text-sm text-green-400 mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            SUBMISSION PERIOD
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Opens At</label>
              <input
                type="datetime-local"
                value={timeline.submission_opens_at}
                onChange={(e) => setTimeline({ ...timeline, submission_opens_at: e.target.value })}
                className="w-full bg-black/50 border border-green-500/30 text-white px-4 py-3 font-jetbrains focus:border-green-400 outline-none"
              />
            </div>
            <div>
              <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Closes At</label>
              <input
                type="datetime-local"
                value={timeline.submission_closes_at}
                onChange={(e) => setTimeline({ ...timeline, submission_closes_at: e.target.value })}
                className="w-full bg-black/50 border border-green-500/30 text-white px-4 py-3 font-jetbrains focus:border-green-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Judging Period */}
        <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/30 p-6">
          <h3 className="font-press-start text-sm text-purple-400 mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            JUDGING PERIOD
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Starts At</label>
              <input
                type="datetime-local"
                value={timeline.judging_starts_at}
                onChange={(e) => setTimeline({ ...timeline, judging_starts_at: e.target.value })}
                className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none"
              />
            </div>
            <div>
              <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Ends At</label>
              <input
                type="datetime-local"
                value={timeline.judging_ends_at}
                onChange={(e) => setTimeline({ ...timeline, judging_ends_at: e.target.value })}
                className="w-full bg-black/50 border border-purple-500/30 text-white px-4 py-3 font-jetbrains focus:border-purple-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results Announcement */}
        <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30 p-6">
          <h3 className="font-press-start text-sm text-amber-400 mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            RESULTS ANNOUNCEMENT
          </h3>
          <div>
            <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Announced At</label>
            <input
              type="datetime-local"
              value={timeline.results_announced_at}
              onChange={(e) => setTimeline({ ...timeline, results_announced_at: e.target.value })}
              className="w-full bg-black/50 border border-amber-500/30 text-white px-4 py-3 font-jetbrains focus:border-amber-400 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white px-8 py-4 font-press-start text-xs transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {saving ? 'SAVING...' : 'SAVE TIMELINE'}
        </button>
      </div>
    </div>
  );
}
