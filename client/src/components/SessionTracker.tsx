/**
 * SessionTracker.tsx - UI component for active session management
 * Implements Task 5.2: Mentorship session tracking system
 * Requirements: 9.1, 9.2, 9.3, 9.4
 */

import React, { useEffect, useRef, useState } from 'react'
import { Clock, Play, Square, CheckCircle, XCircle, AlertCircle, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import {
  sessionTracker,
  type MentorshipSession,
  type SessionStatus,
} from '@/lib/sessionTracker'

// ─── Status Display Config ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  SessionStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertCircle },
  accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
  active: { label: 'Active', color: 'bg-green-100 text-green-800 border-green-200', icon: Play },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  no_show: { label: 'No Show', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertCircle },
}

// ─── Elapsed Timer ────────────────────────────────────────────────────────────

function ElapsedTimer({ startedAt }: { startedAt: string }) {
  const [elapsed, setElapsed] = useState(() => sessionTracker.getElapsedMinutes(startedAt))

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(sessionTracker.getElapsedMinutes(startedAt))
    }, 60_000)
    return () => clearInterval(id)
  }, [startedAt])

  const hours = Math.floor(elapsed / 60)
  const mins = elapsed % 60

  return (
    <span className="font-mono text-sm tabular-nums" aria-live="polite" aria-label={`Elapsed time: ${hours > 0 ? `${hours}h ` : ''}${mins}m`}>
      {hours > 0 && <>{hours}h </>}{mins}m
    </span>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function SessionStatusBadge({ status }: { status: SessionStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {cfg.label}
    </span>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SessionTrackerProps {
  session: MentorshipSession
  /** 'mentor' sees accept/start/complete actions; 'mentee' sees cancel */
  viewerRole: 'mentor' | 'mentee'
  authToken?: string
  onSessionUpdated?: (updated: MentorshipSession) => void
  /** Called when session is completed so parent can show rating UI */
  onSessionCompleted?: (sessionId: number) => void
}

// ─── SessionTracker Component ─────────────────────────────────────────────────

/**
 * Requirement 9.1: Session lifecycle management UI
 * Requirement 9.2: Real-time status updates
 * Requirement 9.3: Duration tracking with live timer
 */
export function SessionTrackerComponent({
  session: initialSession,
  viewerRole,
  authToken,
  onSessionUpdated,
  onSessionCompleted,
}: SessionTrackerProps) {
  const [session, setSession] = useState<MentorshipSession>(initialSession)
  const [mentorNotes, setMentorNotes] = useState(initialSession.mentor_notes ?? '')
  const [loading, setLoading] = useState(false)
  const notesRef = useRef(mentorNotes)
  notesRef.current = mentorNotes

  // Keep local state in sync if parent passes a new session object
  useEffect(() => {
    setSession(initialSession)
    setMentorNotes(initialSession.mentor_notes ?? '')
  }, [initialSession.id, initialSession.status])

  const allowed = sessionTracker.getAllowedTransitions(session.status)

  async function transition(to: SessionStatus) {
    setLoading(true)
    const extra =
      to === 'completed'
        ? {
            mentor_notes: notesRef.current || undefined,
            ended_at: new Date().toISOString(),
            duration_minutes: session.started_at
              ? sessionTracker.calculateDuration(session.started_at, new Date().toISOString())
              : session.duration_minutes,
          }
        : to === 'active'
        ? { started_at: new Date().toISOString() }
        : { mentor_notes: notesRef.current || undefined }

    const result = await sessionTracker.updateSessionStatus(
      session.id,
      to,
      session.status,
      extra,
      authToken
    )
    setLoading(false)

    if (!result.success) {
      toast.error(result.error ?? 'Failed to update session')
      return
    }

    const updated = result.session ?? { ...session, status: to, ...extra }
    setSession(updated as MentorshipSession)
    onSessionUpdated?.(updated as MentorshipSession)
    toast.success(`Session ${to}`)

    if (to === 'completed') {
      onSessionCompleted?.(session.id)
    }
  }

  const otherParty = viewerRole === 'mentor' ? session.mentee : session.mentor
  const otherName = otherParty?.full_name ?? otherParty?.username ?? 'Unknown'
  const otherInitials = otherName.slice(0, 2).toUpperCase()

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <CardTitle className="text-base font-semibold">
            {viewerRole === 'mentor' ? 'Mentorship Session' : 'Your Session'}
          </CardTitle>
          <SessionStatusBadge status={session.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Other party info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={otherParty?.avatar_url ?? ''} alt={otherName} />
            <AvatarFallback>{otherInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{otherName}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {viewerRole === 'mentor' ? 'Mentee' : 'Mentor'}
            </p>
          </div>
        </div>

        {/* Problem description */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Problem</p>
          <p className="text-sm">{session.problem_description}</p>
        </div>

        {/* Duration / timer */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {/* Requirement 9.3: Live timer when active */}
            {session.status === 'active' && session.started_at ? (
              <ElapsedTimer startedAt={session.started_at} />
            ) : (
              <span>{session.duration_minutes}m planned</span>
            )}
          </span>
          <Badge variant="outline" className="text-xs capitalize">
            {session.session_type}
          </Badge>
        </div>

        {/* Mentor notes (mentor only) */}
        {viewerRole === 'mentor' && session.status !== 'completed' && session.status !== 'cancelled' && session.status !== 'rejected' && (
          <div>
            <Label htmlFor={`notes-${session.id}`} className="text-xs">
              Session Notes
            </Label>
            <Textarea
              id={`notes-${session.id}`}
              value={mentorNotes}
              onChange={e => setMentorNotes(e.target.value)}
              placeholder="Add notes about this session…"
              rows={2}
              className="mt-1 text-sm resize-none"
            />
          </div>
        )}

        {/* Completed notes display */}
        {session.status === 'completed' && session.mentor_notes && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Mentor Notes</p>
            <p className="text-sm">{session.mentor_notes}</p>
          </div>
        )}

        {/* Action buttons */}
        {allowed.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {/* Requirement 9.1: Mentor actions */}
            {viewerRole === 'mentor' && (
              <>
                {allowed.includes('accepted') && (
                  <Button size="sm" onClick={() => transition('accepted')} disabled={loading}>
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                    Accept
                  </Button>
                )}
                {allowed.includes('active') && (
                  <Button size="sm" onClick={() => transition('active')} disabled={loading}>
                    <Play className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                    Start Session
                  </Button>
                )}
                {allowed.includes('completed') && (
                  <Button size="sm" onClick={() => transition('completed')} disabled={loading}>
                    <Square className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                    End Session
                  </Button>
                )}
                {allowed.includes('rejected') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => transition('rejected')}
                    disabled={loading}
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                    Decline
                  </Button>
                )}
                {allowed.includes('no_show') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => transition('no_show')}
                    disabled={loading}
                  >
                    <User className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                    No Show
                  </Button>
                )}
              </>
            )}

            {/* Mentee can cancel pending/accepted sessions */}
            {viewerRole === 'mentee' && allowed.includes('cancelled') && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => transition('cancelled')}
                disabled={loading}
              >
                <XCircle className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                Cancel Request
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SessionTrackerComponent
