import { useState, useEffect } from 'react';
import { X, Calendar, Users, Clock, ExternalLink, Save } from 'lucide-react';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventId: string, eventData: EventData) => void;
  isLoading?: boolean;
  event: JudgeEvent | null;
}

interface EventData {
  eventName: string;
  role: string;
  date: string;
  link?: string;
}

interface JudgeEvent {
  id: string;
  eventName: string;
  role: string;
  date: string;
  link?: string;
  verified: boolean;
}

const EditEventModal = ({ isOpen, onClose, onSubmit, isLoading = false, event }: EditEventModalProps) => {
  const [formData, setFormData] = useState<EventData>({
    eventName: '',
    role: '',
    date: '',
    link: ''
  });

  const [errors, setErrors] = useState<Partial<EventData>>({});

  useEffect(() => {
    if (event) {
      // Convert date to yyyy-MM-dd format if needed
      let formattedDate = event.date;
      try {
        const dateObj = new Date(event.date);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split('T')[0];
        }
      } catch (e) {
        console.error('Date parsing error:', e);
      }

      setFormData({
        eventName: event.eventName,
        role: event.role,
        date: formattedDate,
        link: event.link || ''
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) return;

    // Validate form
    const newErrors: Partial<EventData> = {};
    if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.date.trim()) newErrors.date = 'Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(event.id, formData);
  };

  const handleInputChange = (field: keyof EventData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="minecraft-block bg-gray-900 border-2 border-cyan-400 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-press-start text-xl text-cyan-400">EDIT EVENT</h2>
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

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="pixel-button bg-cyan-600 text-white px-6 py-3 font-press-start text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  SAVING...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  SAVE CHANGES
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

export default EditEventModal;
