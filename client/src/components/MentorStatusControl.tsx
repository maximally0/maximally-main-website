/**
 * MentorStatusControl - Manual status override for mentors
 * Implements Task 5.3: Mentor availability management
 * Requirements: 7.2 (auto status from sessions), 7.3 (manual override), 7.4 (discovery filtering)
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Wifi, WifiOff, Clock, AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { mentorService } from '@/lib/mentorService'

// ─── Types ────────────────────────────────────────────────────────────────────

export type MentorStatus = 'available' | 'in_session' | 'offline'

interface StatusConfig {
  label: string
  description: string
  badgeClass: string
  icon: React.ElementType
}

// ─── Status display config ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<MentorStatus, StatusConfig> = {
  available: {
    label: 'Available Now',
    description: 'You are visible to participants and can receive session requests.',
    badgeClass: 'bg-green-100 text-green-800 border-green-200',
    icon: Wifi,
  },
  in_session: {
    label: 'In Session',
    description: 'You have reached your maximum concurrent sessions.',
    badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
  },
  offline: {
    label: 'Offline',
    description: 'You are not visible in mentor discovery.',
    badgeClass: 'bg-red-100 text-red-800 border-red-200',
    icon: WifiOff,
  },
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: MentorStatus }) {
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${cfg.badgeClass}`}
      role="status"
      aria-label={`Current status: ${cfg.label}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {cfg.label}
    </span>
  )
}

// ─── MentorStatusControl ──────────────────────────────────────────────────────

export interface MentorStatusControlProps {
  mentorId: string
  /** If provided, used as the initial status without fetching */
  initialStatus?: MentorStatus
  /** Called when the status changes */
  onStatusChange?: (status: MentorStatus) => void
  className?: string
}

/**
 * Requirement 7.2: Automatic status updates based on concurrent sessions
 * Requirement 7.3: Manual status override (Available / Offline toggle)
 * Requirement 7.4: Status drives visibility in mentor discovery
 */
export function MentorStatusControl({
  mentorId,
  initialStatus,
  onStatusChange,
  className,
}: MentorStatusControlProps) {
  const [status, setStatus] = useState<MentorStatus>(initialStatus ?? 'offline')
  const [loading, setLoading] = useState(!initialStatus)
  const [refreshing, setRefreshing] = useState(false)

  // Confirmation dialog state
  const [confirmTarget, setConfirmTarget] = useState<'available' | 'offline' | null>(null)
  const [confirming, setConfirming] = useState(false)

  // ── Load current status ─────────────────────────────────────────────────────
  /**
   * Requirement 7.2: Derive status from active sessions vs max concurrent teams
   */
  const fetchStatus = useCallback(async () => {
    try {
      const derived = await mentorService.getMentorStatus(mentorId)
      setStatus(derived)
      onStatusChange?.(derived)
    } catch {
      // Silently fall back to current status
    }
  }, [mentorId, onStatusChange])

  useEffect(() => {
    if (!initialStatus) {
      setLoading(true)
      fetchStatus().finally(() => setLoading(false))
    }
  }, [initialStatus, fetchStatus])

  // ── Manual refresh ──────────────────────────────────────────────────────────
  async function handleRefresh() {
    setRefreshing(true)
    await fetchStatus()
    setRefreshing(false)
    toast.success('Status refreshed')
  }

  // ── Override handlers ───────────────────────────────────────────────────────

  /**
   * Requirement 7.3: Manual status override — show confirmation before applying
   */
  function requestOverride(target: 'available' | 'offline') {
    if (target === status) return
    // in_session is automatic — only allow toggling available ↔ offline
    setConfirmTarget(target)
  }

  async function confirmOverride() {
    if (!confirmTarget) return
    setConfirming(true)
    try {
      const isActive = confirmTarget === 'available'
      const apiBase = (import.meta as any).env?.VITE_API_URL ?? '/api'

      // PATCH /api/mentors/:id/active — sets the active flag on the profile
      const response = await fetch(`${apiBase}/mentors/${mentorId}/active`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: isActive }),
      })

      if (response.ok) {
        // Re-derive status after the update
        const newStatus = isActive
          ? await mentorService.getMentorStatus(mentorId)
          : 'offline'
        setStatus(newStatus)
        onStatusChange?.(newStatus)
        toast.success(
          confirmTarget === 'available'
            ? 'You are now available for mentorship requests.'
            : 'You are now offline and hidden from discovery.'
        )
      } else {
        const data = await response.json().catch(() => ({}))
        toast.error((data as any).error ?? 'Failed to update status')
      }
    } catch {
      toast.error('Failed to update status')
    } finally {
      setConfirming(false)
      setConfirmTarget(null)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  const cfg = STATUS_CONFIG[status]

  return (
    <>
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base">Availability Status</CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              aria-label="Refresh status"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-16" aria-live="polite" aria-busy="true">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              {/* Current status */}
              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Current Status
                </p>
                <StatusBadge status={status} />
                <p className="text-xs text-muted-foreground">{cfg.description}</p>
              </div>

              {/* In-session notice */}
              {status === 'in_session' && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                  <p className="text-xs">
                    Status is automatically set to <strong>In Session</strong> when you reach your
                    maximum concurrent sessions. Complete or cancel sessions to become available again.
                  </p>
                </div>
              )}

              {/* Manual override buttons */}
              {/* Requirement 7.3: Only allow available ↔ offline manual toggle */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Manual Override</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={status === 'available' ? 'default' : 'outline'}
                    size="sm"
                    className={
                      status === 'available'
                        ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                        : ''
                    }
                    onClick={() => requestOverride('available')}
                    disabled={status === 'available' || status === 'in_session'}
                    aria-pressed={status === 'available'}
                    aria-label="Set status to available"
                  >
                    <Wifi className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                    Available
                  </Button>
                  <Button
                    type="button"
                    variant={status === 'offline' ? 'default' : 'outline'}
                    size="sm"
                    className={
                      status === 'offline'
                        ? 'bg-red-600 hover:bg-red-700 text-white border-red-600'
                        : ''
                    }
                    onClick={() => requestOverride('offline')}
                    disabled={status === 'offline'}
                    aria-pressed={status === 'offline'}
                    aria-label="Set status to offline"
                  >
                    <WifiOff className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                    Go Offline
                  </Button>
                </div>
                {status === 'in_session' && (
                  <p className="text-xs text-muted-foreground">
                    Manual override is disabled while you have active sessions at capacity.
                  </p>
                )}
              </div>

              {/* Status legend */}
              <div className="pt-2 border-t space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Status Guide</p>
                {(Object.entries(STATUS_CONFIG) as [MentorStatus, StatusConfig][]).map(
                  ([key, c]) => {
                    const Icon = c.icon
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <Badge
                          className={`text-xs px-2 py-0 border ${c.badgeClass} bg-transparent`}
                          variant="outline"
                        >
                          <Icon className="h-3 w-3 mr-1" aria-hidden="true" />
                          {c.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{c.description}</span>
                      </div>
                    )
                  }
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Confirmation dialog */}
      <Dialog open={!!confirmTarget} onOpenChange={open => !open && setConfirmTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {confirmTarget === 'available' ? 'Go Available?' : 'Go Offline?'}
            </DialogTitle>
            <DialogDescription>
              {confirmTarget === 'available'
                ? 'You will become visible in mentor discovery and can receive new session requests.'
                : 'You will be hidden from mentor discovery and will not receive new session requests. Existing sessions are not affected.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setConfirmTarget(null)}
              disabled={confirming}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              variant={confirmTarget === 'offline' ? 'destructive' : 'default'}
              onClick={confirmOverride}
              disabled={confirming}
              aria-label={`Confirm ${confirmTarget === 'available' ? 'going available' : 'going offline'}`}
            >
              {confirming
                ? 'Updating…'
                : confirmTarget === 'available'
                ? 'Go Available'
                : 'Go Offline'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MentorStatusControl
