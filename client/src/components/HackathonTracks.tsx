import { Trophy, Target, Users, Zap } from 'lucide-react';

interface Track {
  name: string;
  description: string;
  prize?: string;
}

interface HackathonTracksProps {
  tracks: Track[] | string | null;
}

export default function HackathonTracks({ tracks: tracksData }: HackathonTracksProps) {
  // Parse tracks if it's a JSON string
  let tracks: Track[] = [];
  
  if (typeof tracksData === 'string') {
    try {
      const parsed = JSON.parse(tracksData);
      tracks = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing tracks:', error);
      tracks = [];
    }
  } else if (Array.isArray(tracksData)) {
    tracks = tracksData;
  } else if (!tracksData) {
    tracks = [];
  }

  if (!tracks || tracks.length === 0) {
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
      {tracks.map((track, index) => (
        <div
          key={index}
          className="pixel-card bg-gray-900 border-2 border-cyan-400 p-6 hover:border-maximally-yellow transition-all hover:scale-105"
        >
          {/* Icon */}
          <div className="minecraft-block bg-cyan-400 text-black p-3 inline-block mb-4">
            <Zap className="h-8 w-8" />
          </div>

          {/* Track Name */}
          <h3 className="font-press-start text-lg text-cyan-400 mb-3">
            {track.name}
          </h3>

          {/* Description */}
          <p className="font-jetbrains text-gray-300 text-sm mb-4 leading-relaxed">
            {track.description}
          </p>

          {/* Prize */}
          {track.prize && (
            <div className="minecraft-block bg-maximally-yellow text-black px-3 py-2">
              <span className="font-press-start text-xs">
                💰 {track.prize}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
