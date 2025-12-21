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
        <div className="bg-gray-800/50 border border-gray-700 text-gray-400 px-6 py-4 inline-block">
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
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
        >
          {/* Icon */}
          <div className="p-3 bg-purple-500/20 border border-purple-500/40 inline-block mb-4">
            <Zap className="h-8 w-8 text-purple-400" />
          </div>

          {/* Track Name */}
          <h3 className="font-press-start text-lg text-purple-300 mb-3">
            {track.name}
          </h3>

          {/* Description */}
          <p className="font-jetbrains text-gray-300 text-sm mb-4 leading-relaxed">
            {track.description}
          </p>

          {/* Prize */}
          {track.prize && (
            <div className="bg-amber-500/20 border border-amber-500/40 px-3 py-2 inline-block">
              <span className="font-press-start text-xs text-amber-300">
                💰 {track.prize}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
