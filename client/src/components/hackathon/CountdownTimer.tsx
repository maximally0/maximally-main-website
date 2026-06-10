import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  label?: string;
}

export default function CountdownTimer({ targetDate, label = 'Registration closes in' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calc = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        expired: false,
      });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.expired) {
    return <p className="font-space text-xs text-red-400 font-bold">CLOSED</p>;
  }

  return (
    <div>
      {label && <p className="font-space text-[10px] text-gray-500 mb-1.5">{label}</p>}
      <div className="flex gap-2">
        {[
          { v: timeLeft.days, l: 'D' },
          { v: timeLeft.hours, l: 'H' },
          { v: timeLeft.minutes, l: 'M' },
          { v: timeLeft.seconds, l: 'S' },
        ].map((t, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 px-2 py-1.5 text-center min-w-[36px]">
            <span className="font-space font-bold text-sm text-white block">{String(t.v).padStart(2, '0')}</span>
            <span className="font-space text-[9px] text-gray-500">{t.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
