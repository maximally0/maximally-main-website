/**
 * AvailabilityManager - Weekly availability slot configuration UI
 * Implements Task 5.3: Mentor availability management
 * Requirements: 7.1 (slot config), 7.5 (real-time updates), 7.6 (conflict prevention)
 */

import React, { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle,
  Save,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { mentorService, type AvailabilitySlot } from '@/lib/mentorService'

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

const SLOT_TYPES: { value: AvailabilitySlot['slot_type']; label: string }[] = [
  { value: 'regular', label: 'Regular' },
  { value: 'office_hours', label: 'Office Hours' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'emergency', label: 'Emergency' },
]

// Common IANA timezones
const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Vancouver',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Pacific/Auckland',
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface SlotError {
  field: string
  message: string
}

interface SlotWithErrors extends AvailabilitySlot {
  _errors?: SlotError[]
  _key: string // stable local key for React list rendering
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeKey() {
  return Math.random().toString(36).slice(2)
}

function makeEmptySlot(timezone: string): SlotWithErrors {
  return {
    _key: makeKey(),
    day_of_week: 1, // Monday
    start_time: '09:00',
    end_time: '17:00',
    timezone,
    slot_type: 'regular',
    max_sessions: 1,
    is_active: true,
  }
}

/**
 * Requirement 7.6: Detect overlapping slots on the same day
 */
function detectConflicts(slots: SlotWithErrors[]): SlotWithErrors[] {
  return slots.map((slot, i) => {
    const conflicts: SlotError[] = []

    // Basic field validation via mentorService
    const validation = mentorService.validateAvailabilitySlot(slot)
    if (!validation.isValid) {
      validation.errors.forEach(msg => conflicts.push({ field: 'general', message: msg }))
    }

    // Overlap check against other active slots on the same day
    slots.forEach((other, j) => {
      if (i === j) return
      if (other.day_of_week !== slot.day_of_week) return
      if (!other.is_active || !slot.is_active) return

      const overlapStart = slot.start_time < other.end_time
      const overlapEnd = slot.end_time > other.start_time
      if (overlapStart && overlapEnd) {
        conflicts.push({
          field: 'time',
          message: `Overlaps with another slot on ${DAYS[slot.day_of_week]?.label}`,
        })
      }
    })

    return { ...slot, _errors: conflicts.length > 0 ? conflicts : undefined }
  })
}

// ─── SlotRow ──────────────────────────────────────────────────────────────────

interface SlotRowProps {
  slot: SlotWithErrors
  onChange: (updated: Partial<AvailabilitySlot>) => void
  onRemove: () => void
  defaultTimezone: string
}

function SlotRow({ slot, onChange, onRemove, defaultTimezone }: SlotRowProps) {
  const hasErrors = slot._errors && slot._errors.length > 0

  return (
    <div
      className={`rounded-lg border p-4 space-y-3 transition-colors ${
        hasErrors ? 'border-destructive/60 bg-destructive/5' : 'border-border bg-card'
      }`}
      role="group"
      aria-label={`Availability slot: ${DAYS[slot.day_of_week]?.label} ${slot.start_time}–${slot.end_time}`}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Day selector */}
        <div className="flex-1 min-w-0">
          <Label className="text-xs text-muted-foreground mb-1 block">Day</Label>
          <Select
            value={String(slot.day_of_week)}
            onValueChange={v => onChange({ day_of_week: Number(v) })}
          >
            <SelectTrigger className="h-8 text-sm" aria-label="Day of week">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map(d => (
                <SelectItem key={d.value} value={String(d.value)}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Slot type */}
        <div className="flex-1 min-w-0">
          <Label className="text-xs text-muted-foreground mb-1 block">Type</Label>
          <Select
            value={slot.slot_type}
            onValueChange={v => onChange({ slot_type: v as AvailabilitySlot['slot_type'] })}
          >
            <SelectTrigger className="h-8 text-sm" aria-label="Slot type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SLOT_TYPES.map(t => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active toggle + remove */}
        <div className="flex items-end gap-2 pb-0.5">
          <button
            type="button"
            onClick={() => onChange({ is_active: !slot.is_active })}
            className={`text-xs px-2 py-1 rounded border transition-colors ${
              slot.is_active
                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'
            }`}
            aria-pressed={slot.is_active}
            aria-label={slot.is_active ? 'Slot active — click to deactivate' : 'Slot inactive — click to activate'}
          >
            {slot.is_active ? 'Active' : 'Inactive'}
          </button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
            aria-label="Remove slot"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Time range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`start-${slot._key}`} className="text-xs text-muted-foreground mb-1 block">
            Start Time
          </Label>
          <input
            id={`start-${slot._key}`}
            type="time"
            value={slot.start_time}
            onChange={e => onChange({ start_time: e.target.value })}
            className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Start time"
          />
        </div>
        <div>
          <Label htmlFor={`end-${slot._key}`} className="text-xs text-muted-foreground mb-1 block">
            End Time
          </Label>
          <input
            id={`end-${slot._key}`}
            type="time"
            value={slot.end_time}
            onChange={e => onChange({ end_time: e.target.value })}
            className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="End time"
          />
        </div>
      </div>

      {/* Max sessions */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Label htmlFor={`max-${slot._key}`} className="text-xs text-muted-foreground mb-1 block">
            Max Concurrent Sessions
          </Label>
          <Select
            value={String(slot.max_sessions)}
            onValueChange={v => onChange({ max_sessions: Number(v) })}
          >
            <SelectTrigger id={`max-${slot._key}`} className="h-8 text-sm" aria-label="Max concurrent sessions">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map(n => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? 'session' : 'sessions'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Validation errors */}
      {hasErrors && (
        <ul className="space-y-1" role="alert" aria-label="Slot errors">
          {slot._errors!.map((err, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
              {err.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── AvailabilityManager ──────────────────────────────────────────────────────

export interface AvailabilityManagerProps {
  mentorId: string
  /** Initial slots loaded from the server */
  initialSlots?: AvailabilitySlot[]
  /** Called after a successful save */
  onSaved?: (slots: AvailabilitySlot[]) => void
  className?: string
}

/**
 * Requirement 7.1: Availability slot configuration (day, start_time, end_time, timezone)
 * Requirement 7.5: Real-time availability updates (saves immediately on submit)
 * Requirement 7.6: Conflict detection and prevention
 */
export function AvailabilityManager({
  mentorId,
  initialSlots,
  onSaved,
  className,
}: AvailabilityManagerProps) {
  const [slots, setSlots] = useState<SlotWithErrors[]>([])
  const [timezone, setTimezone] = useState('UTC')
  const [loading, setLoading] = useState(!initialSlots)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  // ── Load slots ──────────────────────────────────────────────────────────────
  const loadSlots = useCallback(async () => {
    setLoading(true)
    try {
      const fetched = await mentorService.getMentorAvailability(mentorId)
      const withKeys: SlotWithErrors[] = fetched.map(s => ({ ...s, _key: makeKey() }))
      const validated = detectConflicts(withKeys)
      setSlots(validated)
      if (fetched.length > 0 && fetched[0].timezone) {
        setTimezone(fetched[0].timezone)
      }
    } catch {
      toast.error('Failed to load availability slots')
    } finally {
      setLoading(false)
    }
  }, [mentorId])

  useEffect(() => {
    if (initialSlots) {
      const withKeys = initialSlots.map(s => ({ ...s, _key: makeKey() }))
      setSlots(detectConflicts(withKeys))
      if (initialSlots.length > 0 && initialSlots[0].timezone) {
        setTimezone(initialSlots[0].timezone)
      }
    } else {
      loadSlots()
    }
  }, [initialSlots, loadSlots])

  // ── Slot mutations ──────────────────────────────────────────────────────────

  function addSlot() {
    const newSlot = makeEmptySlot(timezone)
    const updated = detectConflicts([...slots, newSlot])
    setSlots(updated)
    setDirty(true)
  }

  function removeSlot(key: string) {
    const updated = detectConflicts(slots.filter(s => s._key !== key))
    setSlots(updated)
    setDirty(true)
  }

  function updateSlot(key: string, changes: Partial<AvailabilitySlot>) {
    const updated = slots.map(s => (s._key === key ? { ...s, ...changes } : s))
    setSlots(detectConflicts(updated))
    setDirty(true)
  }

  // When global timezone changes, apply to all slots
  function applyTimezone(tz: string) {
    setTimezone(tz)
    const updated = slots.map(s => ({ ...s, timezone: tz }))
    setSlots(detectConflicts(updated))
    setDirty(true)
  }

  // ── Save ────────────────────────────────────────────────────────────────────

  async function handleSave() {
    // Re-run conflict detection before saving
    const validated = detectConflicts(slots)
    setSlots(validated)

    const hasErrors = validated.some(s => s._errors && s._errors.length > 0)
    if (hasErrors) {
      toast.error('Please fix the errors before saving')
      return
    }

    setSaving(true)
    try {
      // Strip internal _key/_errors before sending
      const clean: AvailabilitySlot[] = validated.map(({ _key, _errors, ...rest }) => rest)
      const result = await mentorService.updateMentorAvailability(mentorId, clean)

      if (result.success) {
        toast.success('Availability saved')
        setDirty(false)
        onSaved?.(clean)
      } else {
        toast.error(result.error ?? 'Failed to save availability')
        if (result.validationErrors) {
          result.validationErrors.forEach(e => toast.error(e))
        }
      }
    } finally {
      setSaving(false)
    }
  }

  // ── Derived stats ───────────────────────────────────────────────────────────
  const activeCount = slots.filter(s => s.is_active).length
  const errorCount = slots.filter(s => s._errors && s._errors.length > 0).length

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
            <CardTitle className="text-base">Weekly Availability</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeCount} active slot{activeCount !== 1 ? 's' : ''}
              </Badge>
            )}
            {errorCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {errorCount} error{errorCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Configure when you're available for mentorship sessions each week.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Global timezone selector */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
          <Globe className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <Label htmlFor="global-timezone" className="text-xs font-medium">
              Your Timezone
            </Label>
            <p className="text-xs text-muted-foreground">Applied to all slots</p>
          </div>
          <Select value={timezone} onValueChange={applyTimezone}>
            <SelectTrigger id="global-timezone" className="w-52 h-8 text-sm" aria-label="Select timezone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {TIMEZONES.map(tz => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center h-24" aria-live="polite" aria-busy="true">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {/* Slot list */}
        {!loading && (
          <div className="space-y-3" role="list" aria-label="Availability slots">
            {slots.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-40" aria-hidden="true" />
                <p className="text-sm">No availability slots configured.</p>
                <p className="text-xs mt-1">Add a slot to let participants know when you're available.</p>
              </div>
            )}
            {slots.map(slot => (
              <div key={slot._key} role="listitem">
                <SlotRow
                  slot={slot}
                  onChange={changes => updateSlot(slot._key, changes)}
                  onRemove={() => removeSlot(slot._key)}
                  defaultTimezone={timezone}
                />
              </div>
            ))}
          </div>
        )}

        {/* Add slot button */}
        {!loading && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={addSlot}
            aria-label="Add availability slot"
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Add Slot
          </Button>
        )}

        {/* Save button */}
        {!loading && (
          <div className="flex items-center justify-between pt-2 border-t">
            {dirty ? (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Unsaved changes
              </p>
            ) : (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
                Up to date
              </p>
            )}
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={saving || !dirty || errorCount > 0}
              aria-label="Save availability"
            >
              <Save className="h-4 w-4 mr-2" aria-hidden="true" />
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AvailabilityManager
