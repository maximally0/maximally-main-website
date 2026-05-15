/**
 * EvaluationForm - Full project evaluation form for judges
 * Implements Task 6.2: Project evaluation interface
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  Lock,
  Save,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import type { SubmissionQueueItem } from '@/lib/judgePortalApi'
import {
  calculateWeightedScore,
  fetchEvaluation,
  fetchEvaluationCriteria,
  saveEvaluationDraft,
  submitEvaluation,
  type JudgeEvaluationCriteria,
  type JudgeSubmissionEvaluation,
} from '@/lib/evaluationApi'

// ─── Score Input ──────────────────────────────────────────────────────────────

interface ScoreInputProps {
  criterion: JudgeEvaluationCriteria
  value: number
  onChange: (criterionId: number, score: number) => void
  disabled?: boolean
}

function ScoreInput({ criterion, value, onChange, disabled }: ScoreInputProps) {
  const getScoreColor = (v: number) => {
    if (v <= 3) return 'text-red-500'
    if (v <= 5) return 'text-amber-500'
    if (v <= 7) return 'text-blue-500'
    return 'text-green-500'
  }

  const getScoreLabel = (v: number) => {
    if (v <= 2) return 'Poor'
    if (v <= 4) return 'Below Average'
    if (v <= 6) return 'Average'
    if (v <= 8) return 'Good'
    return 'Excellent'
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-sm text-foreground">{criterion.name}</p>
          {criterion.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{criterion.description}</p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            Weight: {criterion.weight} · Max: {criterion.max_score}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <span className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}</span>
          <span className="text-xs text-muted-foreground">/10</span>
          <p className={`text-xs ${getScoreColor(value)}`}>{getScoreLabel(value)}</p>
        </div>
      </div>

      {/* Quick-select buttons */}
      <div className="flex gap-1 flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => onChange(criterion.id, n)}
            className={`w-8 h-8 rounded text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              value === n
                ? 'bg-primary text-primary-foreground scale-110'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Slider */}
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(criterion.id, v)}
        min={1}
        max={criterion.max_score}
        step={1}
        disabled={disabled}
        className="w-full"
      />
    </div>
  )
}

// ─── Project Details Panel ────────────────────────────────────────────────────

interface ProjectDetailsPanelProps {
  submission: SubmissionQueueItem
}

function ProjectDetailsPanel({ submission }: ProjectDetailsPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" />
          Project Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Requirement 8.7: Display project title, team name */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Project</p>
          <h2 className="text-lg font-semibold text-foreground">{submission.project_title}</h2>
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Team</p>
          <p className="font-medium">{submission.team_name}</p>
        </div>

        {/* Requirement 8.7: Display project description */}
        {submission.project_description && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Description
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {submission.project_description}
            </p>
          </div>
        )}

        {/* Requirement 8.7: Display submission URL */}
        {submission.submission_url && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Submission Link
            </p>
            <a
              href={submission.submission_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              View Submission
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Locked Evaluation View ───────────────────────────────────────────────────

interface LockedEvaluationViewProps {
  evaluation: JudgeSubmissionEvaluation
  criteria: JudgeEvaluationCriteria[]
}

function LockedEvaluationView({ evaluation, criteria }: LockedEvaluationViewProps) {
  return (
    <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-green-700 dark:text-green-400">
          <Lock className="h-4 w-4" />
          Evaluation Submitted
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This evaluation was submitted on{' '}
          {evaluation.submitted_at
            ? new Date(evaluation.submitted_at).toLocaleString()
            : 'unknown date'}
          . It is now locked and cannot be modified.
        </p>

        {/* Scores read-only */}
        <div className="space-y-3">
          {criteria
            .filter(c => c.is_active)
            .sort((a, b) => a.display_order - b.display_order)
            .map(c => {
              const score = evaluation.criteria_scores[String(c.id)] ?? 0
              return (
                <div key={c.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{c.name}</span>
                  <span className="font-bold text-foreground">
                    {score}
                    <span className="text-xs text-muted-foreground font-normal">/{c.max_score}</span>
                  </span>
                </div>
              )
            })}
        </div>

        {evaluation.total_score != null && (
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="font-semibold">Total Score</span>
            <span className="text-xl font-bold text-primary">{evaluation.total_score}/10</span>
          </div>
        )}

        {evaluation.comments_for_organizers && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Comments for Organizers
            </p>
            <p className="text-sm">{evaluation.comments_for_organizers}</p>
          </div>
        )}

        {evaluation.comments_for_participants && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Comments for Participants
            </p>
            <p className="text-sm">{evaluation.comments_for_participants}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Confirm Submit Dialog ────────────────────────────────────────────────────

interface ConfirmSubmitDialogProps {
  totalScore: number
  onConfirm: () => void
  onCancel: () => void
  isSubmitting: boolean
}

function ConfirmSubmitDialog({
  totalScore,
  onConfirm,
  onCancel,
  isSubmitting,
}: ConfirmSubmitDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Confirm Submission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You are about to submit your final evaluation with a total score of{' '}
            <span className="font-bold text-foreground">{totalScore}/10</span>. This action cannot
            be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={onConfirm} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main EvaluationForm Component ───────────────────────────────────────────

export interface EvaluationFormProps {
  /** The submission being evaluated (from the judge's queue) */
  submission: SubmissionQueueItem
  /** Called after a successful draft save or final submission */
  onSaved?: (evaluation: JudgeSubmissionEvaluation) => void
  className?: string
}

export function EvaluationForm({ submission, onSaved, className = '' }: EvaluationFormProps) {
  const { user, session } = useAuth()
  const authToken = session?.access_token

  // ── Remote state ──────────────────────────────────────────────────────────
  const [criteria, setCriteria] = useState<JudgeEvaluationCriteria[]>([])
  const [existingEvaluation, setExistingEvaluation] = useState<JudgeSubmissionEvaluation | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // ── Form state ────────────────────────────────────────────────────────────
  const [scores, setScores] = useState<Record<string, number>>({})
  const [commentsForOrganizers, setCommentsForOrganizers] = useState('')
  const [commentsForParticipants, setCommentsForParticipants] = useState('')

  // ── Action state ──────────────────────────────────────────────────────────
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  // ── Load criteria + existing evaluation ──────────────────────────────────
  useEffect(() => {
    if (!user) return

    const load = async () => {
      setLoading(true)
      setLoadError(null)
      try {
        const [criteriaData, evalData] = await Promise.all([
          fetchEvaluationCriteria(submission.hackathon_id, authToken),
          fetchEvaluation(user.id, submission.submission_id, authToken),
        ])
        setCriteria(criteriaData)
        setExistingEvaluation(evalData)

        // Pre-fill form from existing evaluation
        if (evalData) {
          setScores(evalData.criteria_scores ?? {})
          setCommentsForOrganizers(evalData.comments_for_organizers ?? '')
          setCommentsForParticipants(evalData.comments_for_participants ?? '')
        } else {
          // Default all criteria to score 5
          const defaults: Record<string, number> = {}
          criteriaData.forEach(c => {
            defaults[String(c.id)] = 5
          })
          setScores(defaults)
        }
      } catch {
        setLoadError('Failed to load evaluation data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user, submission.submission_id, submission.hackathon_id, authToken])

  // ── Requirement 8.3: Auto-calculated weighted total score ─────────────────
  const totalScore = useMemo(
    () => calculateWeightedScore(scores, criteria),
    [scores, criteria]
  )

  // ── Requirement 8.5: All required criteria must be scored ─────────────────
  const activeCriteria = useMemo(() => criteria.filter(c => c.is_active), [criteria])

  const allCriteriaScored = useMemo(
    () => activeCriteria.every(c => (scores[String(c.id)] ?? 0) >= 1),
    [activeCriteria, scores]
  )

  const handleScoreChange = useCallback((criterionId: number, score: number) => {
    setScores(prev => ({ ...prev, [String(criterionId)]: score }))
    setActionSuccess(null)
  }, [])

  // ── Requirement 8.5: Save draft ───────────────────────────────────────────
  const handleSaveDraft = async () => {
    if (!user) return
    setIsSavingDraft(true)
    setActionError(null)
    setActionSuccess(null)

    const result = await saveEvaluationDraft(
      {
        judge_id: user.id,
        submission_id: submission.submission_id,
        hackathon_id: submission.hackathon_id,
        criteria_scores: scores,
        comments_for_organizers: commentsForOrganizers || undefined,
        comments_for_participants: commentsForParticipants || undefined,
      },
      authToken
    )

    setIsSavingDraft(false)

    if (result.success && result.evaluation) {
      setExistingEvaluation(result.evaluation)
      setActionSuccess('Draft saved successfully.')
      onSaved?.(result.evaluation)
    } else {
      setActionError(result.error ?? 'Failed to save draft.')
    }
  }

  // ── Requirement 8.6: Final submission ─────────────────────────────────────
  const handleConfirmSubmit = async () => {
    if (!user) return
    setIsSubmitting(true)
    setActionError(null)
    setActionSuccess(null)

    const result = await submitEvaluation(
      {
        judge_id: user.id,
        submission_id: submission.submission_id,
        hackathon_id: submission.hackathon_id,
        criteria_scores: scores,
        comments_for_organizers: commentsForOrganizers || undefined,
        comments_for_participants: commentsForParticipants || undefined,
      },
      authToken
    )

    setIsSubmitting(false)
    setShowConfirm(false)

    if (result.success && result.evaluation) {
      setExistingEvaluation(result.evaluation)
      setActionSuccess('Evaluation submitted successfully.')
      onSaved?.(result.evaluation)
    } else {
      setActionError(result.error ?? 'Failed to submit evaluation.')
    }
  }

  // ── Requirement 8.1: Only visible to the assigned judge ───────────────────
  if (!user) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Please sign in to access the evaluation form.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
        <p className="text-destructive mb-4">{loadError}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  const isLocked = existingEvaluation?.status === 'submitted'

  return (
    <>
      {showConfirm && (
        <ConfirmSubmitDialog
          totalScore={totalScore}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
        {/* ── Left: Project Details (Req 8.7) ── */}
        <div className="space-y-4">
          <ProjectDetailsPanel submission={submission} />
        </div>

        {/* ── Right: Evaluation Rubric (Req 8.2) ── */}
        <div className="space-y-4">
          {/* Locked view for already-submitted evaluations */}
          {isLocked && existingEvaluation ? (
            <LockedEvaluationView evaluation={existingEvaluation} criteria={criteria} />
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Evaluation Rubric</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Requirement 8.2: Criteria scoring inputs (1-10) */}
                {activeCriteria.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No evaluation criteria configured for this hackathon.
                  </p>
                ) : (
                  activeCriteria
                    .sort((a, b) => a.display_order - b.display_order)
                    .map(c => (
                      <ScoreInput
                        key={c.id}
                        criterion={c}
                        value={scores[String(c.id)] ?? 5}
                        onChange={handleScoreChange}
                        disabled={isLocked}
                      />
                    ))
                )}

                {/* Requirement 8.3: Auto-calculated total score */}
                {activeCriteria.length > 0 && (
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="font-semibold text-sm">Weighted Total Score</span>
                    <span className="text-2xl font-bold text-primary">{totalScore}/10</span>
                  </div>
                )}

                {/* Requirement 8.4: Comments for organizers (private) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Comments for Organizers
                    <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                      (private — not shared with participants)
                    </span>
                  </label>
                  <Textarea
                    value={commentsForOrganizers}
                    onChange={e => setCommentsForOrganizers(e.target.value)}
                    placeholder="Internal notes for the organising team…"
                    disabled={isLocked}
                    maxLength={2000}
                    className="min-h-[80px] resize-none text-sm"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {commentsForOrganizers.length}/2000
                  </p>
                </div>

                {/* Requirement 8.4: Comments for participants (shared after event) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Comments for Participants
                    <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                      (shared with the team after the event)
                    </span>
                  </label>
                  <Textarea
                    value={commentsForParticipants}
                    onChange={e => setCommentsForParticipants(e.target.value)}
                    placeholder="Constructive feedback for the team…"
                    disabled={isLocked}
                    maxLength={1000}
                    className="min-h-[80px] resize-none text-sm"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {commentsForParticipants.length}/1000
                  </p>
                </div>

                {/* Action feedback */}
                {actionError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {actionError}
                  </div>
                )}
                {actionSuccess && (
                  <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-md px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    {actionSuccess}
                  </div>
                )}

                {/* Requirement 8.5 & 8.6: Action buttons */}
                {!isLocked && (
                  <div className="flex gap-3 pt-1">
                    {/* Save Draft */}
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handleSaveDraft}
                      disabled={isSavingDraft || isSubmitting}
                    >
                      {isSavingDraft ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Draft
                        </>
                      )}
                    </Button>

                    {/* Submit Evaluation — requires all criteria scored */}
                    <Button
                      type="button"
                      className="flex-1"
                      onClick={() => setShowConfirm(true)}
                      disabled={!allCriteriaScored || isSavingDraft || isSubmitting}
                      title={
                        !allCriteriaScored
                          ? 'Score all criteria before submitting'
                          : undefined
                      }
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit Evaluation
                    </Button>
                  </div>
                )}

                {!allCriteriaScored && !isLocked && activeCriteria.length > 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Score all criteria (1–10) to enable final submission.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

export default EvaluationForm
