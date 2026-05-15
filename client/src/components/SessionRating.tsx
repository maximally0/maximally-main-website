/**
 * SessionRating.tsx - Post-session rating component
 * Implements Task 5.2: Mentorship session tracking system
 * Requirements: 9.5 (1-5 star rating + optional feedback)
 */

import React, { useState } from 'react'
import { Star } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { sessionTracker } from '@/lib/sessionTracker'

// ─── Star Rating Input ────────────────────────────────────────────────────────

interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
  disabled?: boolean
}

const STAR_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent']

function StarRating({ value, onChange, disabled }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value

  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label="Session rating"
    >
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star !== 1 ? 's' : ''} — ${STAR_LABELS[star]}`}
          disabled={disabled}
          className="p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
          onClick={() => !disabled && onChange(star)}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => !disabled && setHovered(0)}
        >
          <Star
            className={`h-7 w-7 transition-colors ${
              star <= display
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-transparent text-muted-foreground'
            }`}
            aria-hidden="true"
          />
        </button>
      ))}
      {display > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">{STAR_LABELS[display]}</span>
      )}
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SessionRatingProps {
  sessionId: number
  mentorName?: string
  open: boolean
  onClose: () => void
  authToken?: string
  onRatingSubmitted?: (rating: number) => void
}

// ─── SessionRating Component ──────────────────────────────────────────────────

/**
 * Requirement 9.5: Post-session rating (1-5 stars) + optional text feedback
 */
export function SessionRating({
  sessionId,
  mentorName,
  open,
  onClose,
  authToken,
  onRatingSubmitted,
}: SessionRatingProps) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const validation = sessionTracker.validateRating(rating)
    if (!validation.isValid) {
      toast.error(validation.error ?? 'Please select a rating')
      return
    }

    setSubmitting(true)
    const result = await sessionTracker.submitRating(
      sessionId,
      { rating, mentee_feedback: feedback.trim() || undefined },
      authToken
    )
    setSubmitting(false)

    if (!result.success) {
      toast.error(result.error ?? 'Failed to submit rating')
      return
    }

    setSubmitted(true)
    toast.success('Thanks for your feedback!')
    onRatingSubmitted?.(rating)

    // Auto-close after brief delay
    setTimeout(() => {
      onClose()
      setRating(0)
      setFeedback('')
      setSubmitted(false)
    }, 1500)
  }

  function handleSkip() {
    onClose()
    setRating(0)
    setFeedback('')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Session</DialogTitle>
          <DialogDescription>
            {mentorName
              ? `How was your mentorship session with ${mentorName}?`
              : 'How was your mentorship session?'}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Star className="h-10 w-10 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            <p className="font-medium">Thanks for your feedback!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            {/* Star rating */}
            <div className="space-y-2">
              <Label>Your Rating</Label>
              <StarRating value={rating} onChange={setRating} disabled={submitting} />
            </div>

            {/* Optional feedback */}
            <div className="space-y-2">
              <Label htmlFor={`feedback-${sessionId}`}>
                Feedback{' '}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id={`feedback-${sessionId}`}
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Share what went well or how the session could be improved…"
                rows={3}
                maxLength={500}
                disabled={submitting}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {feedback.length}/500
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                disabled={submitting}
              >
                Skip
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={rating === 0 || submitting}
              >
                Submit Rating
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SessionRating
