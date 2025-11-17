import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Trophy } from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: string;
  track_name: string;
  track_description: string;
  track_icon?: string;
  prize_pool?: string;
  max_submissions?: number;
  current_submissions: number;
}

interface Props {
  hackathonId: number;
}

export default function OrganizerTracksManager({ hackathonId }: Props) {
  const { toast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    track_name: '',
    track_description: '',
    track_icon: 'trophy',
    prize_pool: '',
    max_submissions: '',
  });

  useEffect(() => {
    fetchTracks();
  }, [hackathonId]);

  const fetchTracks = async () => {
    try {
      const response = await fetch(`/api/hackathons/${hackathonId}/tracks`);
      const data = await response.json();
      if (data.success) {
        setTracks(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/tracks`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...formData,
          max_submissions: formData.max_submissions ? parseInt(formData.max_submissions) : null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Track created!' });
        setFormData({
          track_name: '',
          track_description: '',
          track_icon: 'trophy',
          prize_pool: '',
          max_submissions: '',
        });
        setShowForm(false);
        fetchTracks();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: 'Error creating track',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-400">Loading tracks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-press-start text-lg text-cyan-400">TRACKS ({tracks.length})</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="minecraft-block bg-cyan-400 text-black px-4 py-2 hover:bg-maximally-yellow transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="font-press-start text-xs">ADD TRACK</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="pixel-card bg-gray-900 border-2 border-cyan-400 p-6 space-y-4">
          <input
            type="text"
            placeholder="Track name"
            value={formData.track_name}
            onChange={(e) => setFormData({ ...formData, track_name: e.target.value })}
            required
            className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-cyan-400 focus:outline-none"
          />
          <textarea
            placeholder="Track description"
            value={formData.track_description}
            onChange={(e) => setFormData({ ...formData, track_description: e.target.value })}
            required
            rows={3}
            className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-cyan-400 focus:outline-none resize-none"
          />
          <input
            type="text"
            placeholder="Prize pool (e.g., $5000)"
            value={formData.prize_pool}
            onChange={(e) => setFormData({ ...formData, prize_pool: e.target.value })}
            className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-cyan-400 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max submissions (optional)"
            value={formData.max_submissions}
            onChange={(e) => setFormData({ ...formData, max_submissions: e.target.value })}
            className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-cyan-400 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="minecraft-block bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition-colors flex-1"
            >
              <span className="font-press-start text-xs">CREATE</span>
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="minecraft-block bg-gray-600 text-white px-4 py-2 hover:bg-gray-700 transition-colors"
            >
              <span className="font-press-start text-xs">CANCEL</span>
            </button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {tracks.map((track) => (
          <div key={track.id} className="pixel-card bg-gray-900 border-2 border-gray-700 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-cyan-400" />
                <h4 className="font-press-start text-sm text-white">{track.track_name}</h4>
              </div>
            </div>
            <p className="text-sm text-gray-400 font-jetbrains mb-2">{track.track_description}</p>
            {track.prize_pool && (
              <div className="text-xs text-maximally-yellow font-press-start">
                💰 {track.prize_pool}
              </div>
            )}
            {track.max_submissions && (
              <div className="text-xs text-gray-500 font-jetbrains mt-1">
                Submissions: {track.current_submissions} / {track.max_submissions}
              </div>
            )}
          </div>
        ))}
      </div>

      {tracks.length === 0 && !showForm && (
        <div className="text-center py-12">
          <div className="minecraft-block bg-gray-800 text-gray-400 px-6 py-4 inline-block">
            <span className="font-press-start text-sm">NO TRACKS YET</span>
          </div>
        </div>
      )}
    </div>
  );
}
