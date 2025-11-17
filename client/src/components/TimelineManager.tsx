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
      
      // Convert empty strings to null
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
          <Clock className="h-6 w-6 text-maximally-yellow" />
          <h2 className="font-press-start text-xl text-maximally-yellow">HACKATHON_TIMELINE</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="pixel-button bg-maximally-red text-white px-6 py-3 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'SAVING...' : 'SAVE_TIMELINE'}
        </button>
      </div>

      {/* Info Box */}
      <div className="pixel-card bg-blue-900/20 border-2 border-blue-500 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
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
        <div className="pixel-card bg-gray-900 border-2 border-blue-500 p-6">
          <h3 className="font-press-start text-lg text-blue-500 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            REGISTRATION_PERIOD
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Opens At</label>
              <input
                type="datetime-local"
                value={timeline.registration_opens_at}
                onChange={(e) => setTimeline({ ...timeline, registration_opens_at: e.target.value })}
                className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Closes At</label>
              <input
                type="datetime-local"
                value={timeline.registration_closes_at}
                onChange={(e) => setTimeline({ ...timeline, registration_closes_at: e.target.value })}
                className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submission Period */}
        <div className="pixel-card bg-gray-900 border-2 border-green-500 p-6">
          <h3 className="font-press-start text-lg text-green-500 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            SUBMISSION_PERIOD
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Opens At</label>
              <input
                type="datetime-local"
                value={timeline.submission_opens_at}
                onChange={(e) => setTimeline({ ...timeline, submission_opens_at: e.target.value })}
                className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Closes At</label>
              <input
                type="datetime-local"
                value={timeline.submission_closes_at}
                onChange={(e) => setTimeline({ ...timeline, submission_closes_at: e.target.value })}
                className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-green-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Judging Period */}
        <div className="pixel-card bg-gray-900 border-2 border-purple-500 p-6">
          <h3 className="font-press-start text-lg text-purple-500 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            JUDGING_PERIOD
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Starts At</label>
              <input
                type="datetime-local"
                value={timeline.judging_starts_at}
                onChange={(e) => setTimeline({ ...timeline, judging_starts_at: e.target.value })}
                className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Ends At</label>
              <input
                type="datetime-local"
                value={timeline.judging_ends_at}
                onChange={(e) => setTimeline({ ...timeline, judging_ends_at: e.target.value })}
                className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-purple-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results Announcement */}
        <div className="pixel-card bg-gray-900 border-2 border-yellow-500 p-6">
          <h3 className="font-press-start text-lg text-yellow-500 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            RESULTS_ANNOUNCEMENT
          </h3>
          <div>
            <label className="font-jetbrains text-sm text-gray-300 mb-2 block">Announced At</label>
            <input
              type="datetime-local"
              value={timeline.results_announced_at}
              onChange={(e) => setTimeline({ ...timeline, results_announced_at: e.target.value })}
              className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains focus:border-yellow-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="pixel-button bg-maximally-red text-white px-8 py-4 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {saving ? 'SAVING...' : 'SAVE_TIMELINE'}
        </button>
      </div>
    </div>
  );
}
