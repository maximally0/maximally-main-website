import { useState } from 'react';
import { X, Calendar, Users, Clock, ExternalLink } from 'lucide-react';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: EventData) => void;
  isLoading?: boolean;
}

interface EventData {
  eventName: string;
  role: string;
  date: string;
  link?: string;
  teamsEvaluated?: number;
  hoursSpent?: number;
}

const AddEventModal = ({ isOpen, onClose, onSubmit, isLoading = false }: AddEventModalProps) => {
  const [formData, setFormData] = useState<EventData>({
    eventName: '',
    role: '',
    date: '',
    link: '',
    teamsEvaluated: 0,
    hoursSpent: 0
  });

  const [errors, setErrors] = useState<Partial<EventData>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Partial<EventData> = {};
    if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.date.trim()) newErrors.date = 'Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const handleInputChange = (field: keyof EventData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleClose = () => {
    setFormData({
      eventName: '',
      role: '',
      date: '',
      link: '',
      teamsEvaluated: 0,
      hoursSpent: 0
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="minecraft-block bg-gray-900 border-2 border-cyan-400 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-press-start text-xl text-cyan-400">ADD JUDGING EVENT</h2>
          <button
            onClick={handleClose}
            className="pixel-button bg-red-600 text-white p-2 hover:bg-red-700"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Name */}
          <div>
            <label className="block font-press-start text-sm text-white mb-2">
              EVENT NAME *
            </label>
            <input
              type="text"
              value={formData.eventName}
              onChange={(e) => handleInputChange('eventName', e.target.value)}
              className="w-full minecraft-block bg-black border-2 border-gray-600 text-white p-3 font-jetbrains focus:border-cyan-400 focus:outline-none"
              placeholder="e.g., TechCrunch Disrupt Hackathon"
              disabled={isLoading}
            />
            {errors.eventName && (
              <p className="text-red-400 text-xs font-jetbrains mt-1">{errors.eventName}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block font-press-start text-sm text-white mb-2">
              YOUR ROLE *
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full minecraft-block bg-black border-2 border-gray-600 text-white p-3 font-jetbrains focus:border-cyan-400 focus:outline-none"
              disabled={isLoading}
            >
              <option value="">Select your role</option>
              <option value="Lead Judge">Lead Judge</option>
              <option value="Technical Judge">Technical Judge</option>
              <option value="Mentor Judge">Mentor Judge</option>
              <option value="Industry Judge">Industry Judge</option>
              <option value="Panel Judge">Panel Judge</option>
              <option value="Track Judge">Track Judge</option>
              <option value="Other">Other</option>
            </select>
            {errors.role && (
              <p className="text-red-400 text-xs font-jetbrains mt-1">{errors.role}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block font-press-start text-sm text-white mb-2">
              EVENT DATE *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full minecraft-block bg-black border-2 border-gray-600 text-white p-3 font-jetbrains focus:border-cyan-400 focus:outline-none"
              disabled={isLoading}
            />
            {errors.date && (
              <p className="text-red-400 text-xs font-jetbrains mt-1">{errors.date}</p>
            )}
          </div>

          {/* Event Link */}
          <div>
            <label className="block font-press-start text-sm text-white mb-2">
              EVENT LINK
            </label>
            <div className="relative">
              <input
                type="url"
                value={formData.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
                className="w-full minecraft-block bg-black border-2 border-gray-600 text-white p-3 font-jetbrains focus:border-cyan-400 focus:outline-none pr-10"
                placeholder="https://example.com/hackathon"
                disabled={isLoading}
              />
              <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-press-start text-sm text-white mb-2">
                TEAMS EVALUATED
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={formData.teamsEvaluated}
                  onChange={(e) => handleInputChange('teamsEvaluated', parseInt(e.target.value) || 0)}
                  className="w-full minecraft-block bg-black border-2 border-gray-600 text-white p-3 font-jetbrains focus:border-cyan-400 focus:outline-none pr-10"
                  placeholder="0"
                  disabled={isLoading}
                />
                <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block font-press-start text-sm text-white mb-2">
                HOURS SPENT
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={formData.hoursSpent}
                  onChange={(e) => handleInputChange('hoursSpent', parseInt(e.target.value) || 0)}
                  className="w-full minecraft-block bg-black border-2 border-gray-600 text-white p-3 font-jetbrains focus:border-cyan-400 focus:outline-none pr-10"
                  placeholder="0"
                  disabled={isLoading}
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="minecraft-block bg-yellow-900/20 border border-yellow-600 p-4">
            <p className="font-jetbrains text-yellow-300 text-sm">
              <strong>Note:</strong> New events will be marked as "Pending Verification" until reviewed by our team. 
              This helps maintain the credibility of the Maximally Judge network.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="pixel-button bg-maximally-yellow text-maximally-black px-6 py-3 font-press-start text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-maximally-black"></div>
                  ADDING...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4" />
                  ADD EVENT
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="pixel-button bg-gray-700 text-white px-6 py-3 font-press-start text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;