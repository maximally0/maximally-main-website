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
  // Convert ISO string to IST datetime format (YYYY-MM-DDTHH:mm)
  const getISTDateTimeString = (isoString: string | null) => {
    if (!isoString) return '';
    
    // Parse the ISO string and convert to IST
    const date = new Date(isoString);
    
    // Convert to IST (UTC+5:30)
    const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    
    const year = istDate.getFullYear();
    const month = String(istDate.getMonth() + 1).padStart(2, '0');
    const day = String(istDate.getDate()).padStart(2, '0');
    const hours = String(istDate.getHours()).padStart(2, '0');
    const minutes = String(istDate.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  const localValue = getISTDateTimeString(value);
  
  // Convert minDate to IST datetime format
  const minDateStr = minDate ? getISTDateTimeString(minDate.toISOString()) : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue) {
      // User selected time in IST, we need to convert to UTC for storage
      // Parse as IST time
      const [datePart, timePart] = newValue.split('T');
      const [year, month, day] = datePart.split('-');
      const [hours, minutes] = timePart.split(':');
      
      // Create date string in IST
      const istDateString = `${year}-${month}-${day}T${hours}:${minutes}:00+05:30`;
      const date = new Date(istDateString);
      
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
    </div>
  );
}
