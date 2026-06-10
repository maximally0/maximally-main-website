import { Link2, CalendarPlus } from 'lucide-react';
import { useState } from 'react';

interface ShareUtilitiesProps {
  hackathonName: string;
  startDate: string;
  endDate: string;
}

export default function ShareUtilities({ hackathonName, startDate, endDate }: ShareUtilitiesProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateICS = () => {
    const start = new Date(startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
      `DTSTART:${start}`, `DTEND:${end}`,
      `SUMMARY:${hackathonName}`,
      `DESCRIPTION:Hackathon on Maximally - ${window.location.href}`,
      `URL:${window.location.href}`,
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${hackathonName.replace(/\s+/g, '-')}.ics`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <button onClick={copyLink} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors font-space text-xs">
        <Link2 className="w-3.5 h-3.5" />
        {copied ? 'Copied!' : 'Copy link'}
      </button>
      <button onClick={generateICS} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors font-space text-xs">
        <CalendarPlus className="w-3.5 h-3.5" />
        Remind me
      </button>
    </div>
  );
}
