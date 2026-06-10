import { useEffect, useState } from 'react';
import { Scale } from 'lucide-react';

interface Criterion {
  id: number;
  name: string;
  description: string;
  max_score: number;
}

export default function JudgingRubric({ hackathonId }: { hackathonId: number }) {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/hackathons/${hackathonId}/judging-criteria`)
      .then(r => r.json())
      .then(j => { if (j.success) setCriteria(j.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [hackathonId]);

  if (loading || criteria.length === 0) return null;

  return (
    <div className="border border-gray-800 bg-gray-900/40 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-4 h-4 text-orange-400" />
        <h3 className="font-space font-bold text-sm text-white">JUDGING RUBRIC</h3>
      </div>
      <p className="font-space text-xs text-gray-500 mb-4">Projects are evaluated on the following criteria. Each scored 1–10.</p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left font-space text-xs text-orange-400 font-bold py-2 pr-4">Criterion</th>
              <th className="text-left font-space text-xs text-gray-500 font-bold py-2 pr-4">Description</th>
              <th className="text-right font-space text-xs text-gray-500 font-bold py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {criteria.map(c => (
              <tr key={c.id} className="border-b border-gray-800/50">
                <td className="font-space text-sm text-white py-3 pr-4">{c.name}</td>
                <td className="font-space text-xs text-gray-400 py-3 pr-4">{c.description}</td>
                <td className="font-space text-xs text-gray-500 py-3 text-right">/ {c.max_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
