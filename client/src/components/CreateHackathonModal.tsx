import { useState } from 'react';
import { X, Rocket, Calendar, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';

interface CreateHackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateHackathonModal({ isOpen, onClose }: CreateHackathonModalProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hackathonName: '',
    slug: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-generate slug from hackathon name
    if (name === 'hackathonName' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/organizer/hackathons', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create hackathon');
      }

      toast({
        title: "Hackathon Created!",
        description: "Your hackathon draft has been created successfully.",
      });

      // Navigate to hackathon dashboard
      navigate(`/organizer/hackathons/${data.data.id}`);
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to create hackathon',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="pixel-card bg-black border-4 border-maximally-red max-w-2xl w-full relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 pixel-button bg-maximally-red text-white p-2 hover:scale-110 transition-all z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-maximally-red to-red-700 p-6 border-b-4 border-maximally-yellow">
          <div className="flex items-center gap-3 mb-2">
            <div className="minecraft-block bg-maximally-yellow w-12 h-12 flex items-center justify-center">
              <Rocket className="h-6 w-6 text-black" />
            </div>
            <h2 className="font-press-start text-lg sm:text-xl text-white">
              CREATE HACKATHON
            </h2>
          </div>
          <p className="font-jetbrains text-sm text-gray-200 ml-15">
            Start by filling in the basic details. You can add more information later.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Hackathon Name */}
          <div>
            <label className="font-press-start text-xs text-maximally-red mb-2 block">
              HACKATHON NAME *
            </label>
            <input
              type="text"
              name="hackathonName"
              value={formData.hackathonName}
              onChange={handleChange}
              required
              className="w-full pixel-card bg-gray-900 border-2 border-maximally-red text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none transition-colors"
              placeholder="e.g., AI Innovation Hackathon 2025"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="font-press-start text-xs text-maximally-red mb-2 block flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              URL SLUG *
            </label>
            <div className="flex items-center gap-2">
              <span className="font-jetbrains text-sm text-gray-400">maximally.in/hackathon/</span>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                pattern="[a-z0-9-]+"
                className="flex-1 pixel-card bg-gray-900 border-2 border-maximally-red text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none transition-colors"
                placeholder="ai-innovation-2025"
              />
            </div>
            <p className="font-jetbrains text-xs text-gray-500 mt-1">
              Only lowercase letters, numbers, and hyphens allowed
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-press-start text-xs text-maximally-red mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                START DATE *
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full pixel-card bg-gray-900 border-2 border-maximally-red text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none transition-colors"
              />
            </div>

            <div>
              <label className="font-press-start text-xs text-maximally-red mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                END DATE *
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full pixel-card bg-gray-900 border-2 border-maximally-red text-white px-4 py-3 font-jetbrains focus:border-maximally-yellow outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 pixel-button bg-gray-700 text-white py-4 font-press-start text-sm hover:bg-gray-600 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 pixel-button bg-maximally-red text-white py-4 font-press-start text-sm hover:bg-maximally-yellow hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'CREATING...' : 'CREATE_HACKATHON'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
