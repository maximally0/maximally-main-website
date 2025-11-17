import { useEffect, useState } from 'react';
import { Trophy, Target, Users, Zap } from 'lucide-react';

interface Track {
  id: string;
  track_name: string;
  track_description: string;
  track_icon?: string;
  prize_pool?: string;
  max_submissions?: number;
  current_submissions: number;
}

interface HackathonTracksProps {
  hackathonId: number;
}

export default function HackathonTracks({ hackathonId }: HackathonTracksProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'trophy': return <Trophy className="h-8 w-8" />;
      case 'target': return <Target className="h-8 w-8" />;
      case 'users': return <Users className="h-8 w-8" />;
      default: return <Zap className="h-8 w-8" />;
    }
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="pixel-card bg-gray-900 border-2 border-gray-700 p-6 animate-pulse">
            <div className="h-8 w-8 bg-gray-800 mb-4"></div>
            <div className="h-6 bg-gray-800 mb-2"></div>
            <div className="h-4 bg-gray-800"></div>
          </div>
        ))}
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="minecraft-block bg-gray-800 text-gray-400 px-6 py-4 inline-block">
          <span className="font-press-start text-sm">NO TRACKS DEFINED</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="pixel-card bg-gray-900 border-2 border-cyan-400 p-6 hover:border-maximally-yellow transition-all hover:scale-105"
        >
          {/* Icon */}
          <div className="minecraft-block bg-cyan-400 text-black p-3 inline-block mb-4">
            {getIconComponent(track.track_icon)}
          </div>

          {/* Track Name */}
          <h3 className="font-press-start text-lg text-cyan-400 mb-3">
            {track.track_name}
          </h3>

          {/* Description */}
          <p className="font-jetbrains text-gray-300 text-sm mb-4 leading-relaxed">
            {track.track_description}
          </p>

          {/* Prize Pool */}
          {track.prize_pool && (
            <div className="minecraft-block bg-maximally-yellow text-black px-3 py-2 mb-3">
              <span className="font-press-start text-xs">
                💰 {track.prize_pool}
              </span>
            </div>
          )}

          {/* Submissions Count */}
          {track.max_submissions && (
            <div className="flex items-center justify-between text-sm font-jetbrains">
              <span className="text-gray-400">Submissions:</span>
              <span className="text-cyan-400">
                {track.current_submissions} / {track.max_submissions}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
