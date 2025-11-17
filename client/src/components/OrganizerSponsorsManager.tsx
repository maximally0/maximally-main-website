import { useEffect, useState } from 'react';
import { Plus, ExternalLink } from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface Sponsor {
  id: string;
  sponsor_name: string;
  sponsor_logo?: string;
  sponsor_website?: string;
  sponsor_tier: 'title' | 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner';
  display_order: number;
}

interface Props {
  hackathonId: number;
}

export default function OrganizerSponsorsManager({ hackathonId }: Props) {
  const { toast } = useToast();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    sponsor_name: '',
    sponsor_logo: '',
    sponsor_website: '',
    sponsor_tier: 'partner' as Sponsor['sponsor_tier'],
    display_order: '0',
  });

  useEffect(() => {
    fetchSponsors();
  }, [hackathonId]);

  const fetchSponsors = async () => {
    try {
      const response = await fetch(`/api/hackathons/${hackathonId}/sponsors`);
      const data = await response.json();
      if (data.success) {
        setSponsors(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/hackathons/${hackathonId}/sponsors`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...formData,
          display_order: parseInt(formData.display_order),
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Sponsor added!' });
        setFormData({
          sponsor_name: '',
          sponsor_logo: '',
          sponsor_website: '',
          sponsor_tier: 'partner',
          display_order: '0',
        });
        setShowForm(false);
        fetchSponsors();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: 'Error adding sponsor',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-400">Loading sponsors...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-press-start text-lg text-cyan-400">SPONSORS ({sponsors.length})</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="minecraft-block bg-cyan-400 text-black px-4 py-2 hover:bg-maximally-yellow transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="font-press-start text-xs">ADD SPONSOR</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="pixel-card bg-gray-900 border-2 border-cyan-400 p-6 space-y-4">
          <input
            type="text"
            placeholder="Sponsor name"
            value={formData.sponsor_name}
            onChange={(e) => setFormData({ ...formData, sponsor_name: e.target.value })}
            required
            className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-cyan-400 focus:outline-none"
          />
          <input
            type="url"
            placeholder="Logo URL (optional)"
            value={formData.sponsor_logo}
            onChange={(e) => setFormData({ ...formData, sponsor_logo: e.target.value })}
            className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-cyan-400 focus:outline-none"
          />
          <input
            type="url"
            placeholder="Website URL (optional)"
            value={formData.sponsor_website}
            onChange={(e) => setFormData({ ...formData, sponsor_website: e.target.value })}
            className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-cyan-400 focus:outline-none"
          />
          <select
            value={formData.sponsor_tier}
            onChange={(e) => setFormData({ ...formData, sponsor_tier: e.target.value as any })}
            className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-2 font-jetbrains focus:border-cyan-400 focus:outline-none"
          >
            <option value="title">Title Sponsor</option>
            <option value="platinum">Platinum</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
            <option value="partner">Partner</option>
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className="minecraft-block bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition-colors flex-1"
            >
              <span className="font-press-start text-xs">ADD</span>
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

      <div className="grid md:grid-cols-3 gap-4">
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className="pixel-card bg-gray-900 border-2 border-gray-700 p-4">
            <div className="minecraft-block bg-cyan-400 text-black px-2 py-1 inline-block mb-2">
              <span className="font-press-start text-xs">{sponsor.sponsor_tier.toUpperCase()}</span>
            </div>
            <h4 className="font-jetbrains text-white mb-2">{sponsor.sponsor_name}</h4>
            {sponsor.sponsor_website && (
              <a
                href={sponsor.sponsor_website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                Website
              </a>
            )}
          </div>
        ))}
      </div>

      {sponsors.length === 0 && !showForm && (
        <div className="text-center py-12">
          <div className="minecraft-block bg-gray-800 text-gray-400 px-6 py-4 inline-block">
            <span className="font-press-start text-sm">NO SPONSORS YET</span>
          </div>
        </div>
      )}
    </div>
  );
}
