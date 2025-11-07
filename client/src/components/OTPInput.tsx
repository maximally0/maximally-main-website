import React, { useEffect, useMemo, useRef } from 'react';

type Props = {
  length?: number;
  value: string;
  onChange: (next: string) => void;
  className?: string;
};

export default function OTPInput({ length = 6, value, onChange, className = '' }: Props) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const chars = useMemo(() => (value || '').slice(0, length).padEnd(length, ' ').split(''), [value, length]);

  useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, length);
  }, [length]);

  const setChar = (index: number, char: string) => {
    const clean = char.replace(/\D/g, '');
    if (!clean) return;
    const arr = (value || '').split('');
    arr[index] = clean.slice(-1);
    const next = arr.join('').slice(0, length);
    onChange(next);
    // focus next
    const nextEl = inputsRef.current[index + 1];
    if (nextEl) nextEl.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!text) return;
    const arr = (value || '').split('');
    for (let i = 0; i < text.length && index + i < length; i++) {
      arr[index + i] = text[i];
    }
    onChange(arr.join('').slice(0, length));
    const nextEl = inputsRef.current[Math.min(index + text.length, length - 1)];
    if (nextEl) nextEl.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const target = e.currentTarget;
    if (e.key === 'Backspace') {
      if (target.value) {
        // clear current first
        const arr = (value || '').split('');
        arr[index] = '';
        onChange(arr.join(''));
      } else {
        const prev = inputsRef.current[index - 1];
        if (prev) prev.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      const prev = inputsRef.current[index - 1];
      if (prev) prev.focus();
    } else if (e.key === 'ArrowRight') {
      const next = inputsRef.current[index + 1];
      if (next) next.focus();
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={chars[i] === ' ' ? '' : chars[i]}
          onChange={(e) => setChar(i, e.target.value)}
          onPaste={(e) => handlePaste(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="mx-1 h-12 w-10 rounded-md border-2 border-gray-700 bg-black text-white text-center text-xl focus:border-maximally-green outline-none"
        />
      ))}
    </div>
  );
}