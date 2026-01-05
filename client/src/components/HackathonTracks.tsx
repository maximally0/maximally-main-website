import { Trophy, Target, Users, Zap, Coins } from 'lucide-react';

interface Track {
  name: string;
  description: string;
  prize?: string;
}

interface HackathonTracksProps {
  tracks: Track[] | string | null;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export default function HackathonTracks({ 
  tracks: tracksData,
  primaryColor = '#8B5CF6',
  secondaryColor = '#EC4899',
  accentColor = '#06B6D4'
}: HackathonTracksProps) {
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
          className="border p-6 transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: `linear-gradient(to bottom right, ${primaryColor}15, ${secondaryColor}10)`,
            borderColor: `${primaryColor}40`,
            boxShadow: `0 0 20px ${primaryColor}10`
          }}
        >
          {/* Icon */}
          <div 
            className="p-3 border inline-block mb-4"
            style={{
              backgroundColor: `${primaryColor}20`,
              borderColor: `${primaryColor}40`
            }}
          >
            <Zap className="h-8 w-8" style={{ color: primaryColor }} />
          </div>

          {/* Track Name */}
          <h3 className="font-press-start text-lg mb-3" style={{ color: primaryColor }}>
            {track.name}
          </h3>

          {/* Description */}
          <p className="font-jetbrains text-gray-300 text-sm mb-4 leading-relaxed">
            {track.description}
          </p>

          {/* Prize */}
          {track.prize && (
            <div 
              className="border px-3 py-2 inline-flex items-center gap-2"
              style={{
                backgroundColor: `${accentColor}20`,
                borderColor: `${accentColor}40`
              }}
            >
              <Coins className="h-4 w-4" style={{ color: accentColor }} />
              <span className="font-press-start text-xs" style={{ color: accentColor }}>
                {track.prize}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
