import { Calendar } from 'lucide-react';

interface DateTimePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  placeholder?: string;
  minDate?: Date;
  className?: string;
}

export default function DateTimePicker({ 
  value, 
  onChange, 
  placeholder,
  minDate,
  className 
}: DateTimePickerProps) {
  // Convert ISO string to UTC datetime format (YYYY-MM-DDTHH:mm)
  // All times are stored and displayed in UTC
  const getUTCDateTimeString = (isoString: string | null) => {
    if (!isoString) return '';
    
    // Parse the ISO string
    const date = new Date(isoString);
    
    // Get UTC components
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  const localValue = getUTCDateTimeString(value);
  
  // Convert minDate to UTC datetime format
  const minDateStr = minDate ? getUTCDateTimeString(minDate.toISOString()) : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue) {
      // User selected time - treat as UTC
      const [datePart, timePart] = newValue.split('T');
      const [year, month, day] = datePart.split('-');
      const [hours, minutes] = timePart.split(':');
      
      // Create date string in UTC
      const utcDateString = `${year}-${month}-${day}T${hours}:${minutes}:00Z`;
      const date = new Date(utcDateString);
      
      onChange(date.toISOString());
    } else {
      onChange(null);
    }
  };

  return (
    <div className={`relative ${className || ''}`}>
      <input
        type="datetime-local"
        value={localValue}
        onChange={handleChange}
        min={minDateStr}
        placeholder={placeholder}
        className="w-full bg-gray-800 border-2 border-gray-700 text-white px-4 py-3 font-jetbrains hover:border-gray-600 focus:border-blue-500 outline-none transition-colors pr-12"
        style={{
          colorScheme: 'dark',
        }}
      />
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-jetbrains">UTC</span>
    </div>
  );
}
