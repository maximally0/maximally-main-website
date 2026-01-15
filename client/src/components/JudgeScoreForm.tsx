/**
 * Judge Score Form Component
 * 
 * Simple 1-10 score submission form with optional notes.
 * Used by judges to score hackathon submissions.
 * 
 * Requirements: 9.4
 */

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface JudgeScoreFormProps {
  initialScore?: number;
  initialNotes?: string;
  onSubmit: (score: number, notes?: string) => Promise<boolean>;
  isSubmitting?: boolean;
}

export default function JudgeScoreForm({
  initialScore,
  initialNotes,
  onSubmit,
  isSubmitting = false,
}: JudgeScoreFormProps) {
  const [score, setScore] = useState<number>(initialScore ?? 5);
  const [notes, setNotes] = useState<string>(initialNotes ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(score, notes.trim() || undefined);
  };

  // Get color based on score
  const getScoreColor = (value: number) => {
    if (value <= 3) return 'text-red-400';
    if (value <= 5) return 'text-amber-400';
    if (value <= 7) return 'text-cyan-400';
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
          <label className="font-jetbrains text-sm text-gray-400">
            Score
          </label>
          <div className="flex items-center gap-2">
            <span className={`font-press-start text-2xl ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="font-jetbrains text-sm text-gray-500">/10</span>
          </div>
        </div>
        
        {/* Score Buttons for Quick Selection */}
        <div className="flex gap-1 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setScore(value)}
              className={`w-9 h-9 rounded font-press-start text-xs transition-all ${
                score === value
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110'
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
        <p className={`font-jetbrains text-sm ${getScoreColor(score)}`}>
          {getScoreLabel(score)}
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="font-jetbrains text-sm text-gray-400">
          Notes (optional)
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any feedback or notes about this submission..."
          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 font-jetbrains text-sm min-h-[80px] resize-none focus:border-purple-500"
          maxLength={500}
        />
        <p className="font-jetbrains text-xs text-gray-500 text-right">
          {notes.length}/500
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-press-start text-xs py-3 h-auto"
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
    </form>
  );
}
