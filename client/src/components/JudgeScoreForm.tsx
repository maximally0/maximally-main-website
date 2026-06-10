/**
 * Judge Score Form Component
 * 
 * Simple 1-10 score submission form with optional notes.
 * Auto-saves drafts as judge types (debounced).
 * 
 * Requirements: 9.4
 */

import { useState, useEffect, useRef } from 'react';
import { Loader2, Send, Check } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface JudgeScoreFormProps {
  initialScore?: number;
  initialNotes?: string;
  onSubmit: (score: number, notes?: string) => Promise<boolean>;
  onDraftSave?: (score: number, notes?: string) => Promise<void>;
  isSubmitting?: boolean;
}

export default function JudgeScoreForm({
  initialScore,
  initialNotes,
  onSubmit,
  onDraftSave,
  isSubmitting = false,
}: JudgeScoreFormProps) {
  const [score, setScore] = useState<number>(initialScore ?? 5);
  const [notes, setNotes] = useState<string>(initialNotes ?? '');
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const initialRender = useRef(true);

  // Debounced auto-save draft
  useEffect(() => {
    if (initialRender.current) { initialRender.current = false; return; }
    if (!onDraftSave) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setDraftStatus('saving');
      try {
        await onDraftSave(score, notes.trim() || undefined);
        setDraftStatus('saved');
        setTimeout(() => setDraftStatus('idle'), 2000);
      } catch { setDraftStatus('idle'); }
    }, 1500);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [score, notes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(score, notes.trim() || undefined);
  };

  // Get color based on score
  const getScoreColor = (value: number) => {
    if (value <= 3) return 'text-red-400';
    if (value <= 5) return 'text-amber-400';
    if (value <= 7) return 'text-gray-300';
    return 'text-green-400';
  };

  const getScoreLabel = (value: number) => {
    if (value <= 2) return 'Needs Work';
    if (value <= 4) return 'Below Average';
    if (value <= 6) return 'Average';
    if (value <= 8) return 'Good';
    return 'Excellent';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Score Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-space text-sm text-gray-400">
            Score
          </label>
          <div className="flex items-center gap-2">
            <span className={`font-space font-bold text-2xl ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="font-space text-sm text-gray-500">/10</span>
          </div>
        </div>
        
        {/* Score Buttons for Quick Selection */}
        <div className="flex gap-1 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setScore(value)}
              className={`w-9 h-9 rounded font-space font-bold text-xs transition-all ${
                score === value
                  ? 'bg-gradient-to-r from-orange-500 to-orange-500 text-white scale-110'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        {/* Slider for Fine Control */}
        <div className="pt-2">
          <Slider
            value={[score]}
            onValueChange={(values) => setScore(values[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        {/* Score Label */}
        <p className={`font-space text-sm ${getScoreColor(score)}`}>
          {getScoreLabel(score)}
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="font-space text-sm text-gray-400">
          Notes (optional)
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any feedback or notes about this submission..."
          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 font-space text-sm min-h-[80px] resize-none focus:border-orange-500"
          maxLength={500}
        />
        <p className="font-space text-xs text-gray-500 text-right">
          {notes.length}/500
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-500 text-white font-space font-bold text-xs py-3 h-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              SAVING...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {initialScore !== undefined ? 'UPDATE_SCORE' : 'SUBMIT_SCORE'}
            </>
          )}
        </Button>
        {draftStatus === 'saving' && <span className="font-space text-[10px] text-gray-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />Saving draft...</span>}
        {draftStatus === 'saved' && <span className="font-space text-[10px] text-green-400 flex items-center gap-1"><Check className="w-3 h-3" />Draft saved</span>}
      </div>
    </form>
  );
}
