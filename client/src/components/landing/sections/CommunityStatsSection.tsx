import { useEffect, useState } from 'react';
import { Users, Trophy, Rocket, Globe } from 'lucide-react';

interface PlatformStats {
  total_active_builders: number;
  total_events_run: number;
  total_projects_submitted: number;
  total_countries_represented: number;
}

export default function CommunityStatsSection() {
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    fetch('/api/platform-stats').then(r => r.json()).then(j => { if (j.success) setStats(j.data); }).catch(() => {});
  }, []);

  if (!stats) return null;

  const items = [
    { icon: Users, value: stats.total_active_builders, label: 'Active Builders' },
    { icon: Trophy, value: stats.total_events_run, label: 'Events Run' },
    { icon: Rocket, value: stats.total_projects_submitted, label: 'Projects Submitted' },
    { icon: Globe, value: stats.total_countries_represented, label: 'Countries' },
  ];

  return (
    <section className="py-12 sm:py-16 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <div key={i} className="border border-gray-800 bg-gray-900/40 p-5 text-center hover:border-orange-500/20 transition-colors">
              <item.icon className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <p className="font-space text-2xl sm:text-3xl font-bold text-white">{item.value}</p>
              <p className="font-space text-[10px] sm:text-xs text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
        <p className="font-space text-xs text-gray-600 text-center mt-6 max-w-xl mx-auto">
          Maximally is built for junior and mid-level developers between 14 and 26 — people actively building, not people who have already arrived.
        </p>
      </div>
    </section>
  );
}
