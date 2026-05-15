/**
 * MentorGallery - Main gallery component with filtering
 * Implements Task 5.1: Mentor Gallery interface for main website
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, Users, Clock, Award, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

import { MentorCard } from './MentorCard'
import {
  fetchMentors,
  fetchMentorSkills,
  requestMentorHelp,
  type GalleryMentor,
  type MentorAvailabilityStatus,
  type MentorshipRequestPayload,
} from '@/lib/mentorGalleryApi'
import { useAuth } from '@/contexts/AuthContext'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RequestHelpState {
  mentorId: string
  mentorName: string
}

interface HelpFormData {
  problem_description: string
  requested_time: string
  duration_minutes: number
  session_type: MentorshipRequestPayload['session_type']
  /** Requirement 6.7: Team integration */
  team_id: string
  hackathon_id: string
}

const DEFAULT_FORM: HelpFormData = {
  problem_description: '',
  requested_time: '',
  duration_minutes: 30,
  session_type: 'general',
  team_id: '',
  hackathon_id: '',
}

// ─── MentorGallery ────────────────────────────────────────────────────────────

interface MentorGalleryProps {
  /** Pre-filter by hackathon context (Requirement 6.7) */
  hackathonId?: number
  /** Pre-filter by team context (Requirement 6.7) */
  teamId?: number
  className?: string
}

/**
 * Requirement 6.1: Mentor gallery page showing all available mentors
 * Requirement 6.2: Filter controls for skills
 * Requirement 6.3: Filter controls for availability
 * Requirement 6.7: Integration with team data for session requests
 */
export function MentorGallery({ hackathonId, teamId, className }: MentorGalleryProps) {
  const { user } = useAuth()

  // ── Data state ──────────────────────────────────────────────────────────────
  const [mentors, setMentors] = useState<GalleryMentor[]>([])
  const [allSkills, setAllSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ── Filter state ────────────────────────────────────────────────────────────
  const [search, setSearch] = useState('')
  const [skillFilter, setSkillFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // ── Request Help modal state ────────────────────────────────────────────────
  const [requestState, setRequestState] = useState<RequestHelpState | null>(null)
  const [formData, setFormData] = useState<HelpFormData>(DEFAULT_FORM)
  const [submitting, setSubmitting] = useState(false)

  // ── Load mentors ────────────────────────────────────────────────────────────
  const loadMentors = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [mentorList, skills] = await Promise.all([
        fetchMentors({ hackathon_id: hackathonId }),
        fetchMentorSkills(),
      ])
      setMentors(mentorList)
      setAllSkills(skills)
    } catch (err) {
      setError('Failed to load mentors. Please try again.')
      console.error('[MentorGallery] load error:', err)
    } finally {
      setLoading(false)
    }
  }, [hackathonId])

  useEffect(() => {
    loadMentors()
  }, [loadMentors])

  // ── Client-side filtering ───────────────────────────────────────────────────
  /**
   * Requirement 6.2: Skill filter
   * Requirement 6.3: Availability filter
   */
  const filtered = useMemo(() => {
    return mentors.filter(m => {
      if (search) {
        const q = search.toLowerCase()
        const nameMatch = m.full_name?.toLowerCase().includes(q) || m.username?.toLowerCase().includes(q)
        const skillMatch = m.skills.some(s => s.toLowerCase().includes(q))
        const bioMatch = m.bio?.toLowerCase().includes(q)
        if (!nameMatch && !skillMatch && !bioMatch) return false
      }
      if (skillFilter !== 'all' && !m.skills.includes(skillFilter)) return false
      if (statusFilter !== 'all' && m.availability_status !== statusFilter) return false
      return true
    })
  }, [mentors, search, skillFilter, statusFilter])

  // ── Stats ───────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: mentors.length,
    available: mentors.filter(m => m.availability_status === 'available').length,
    totalHours: mentors.reduce((sum, m) => sum + (m.mentored_hours ?? 0), 0),
  }), [mentors])

  // ── Request Help handlers ───────────────────────────────────────────────────
  const handleRequestHelp = (mentorId: string) => {
    const mentor = mentors.find(m => m.id === mentorId)
    if (!mentor) return

    setFormData({
      ...DEFAULT_FORM,
      team_id: teamId ? String(teamId) : '',
      hackathon_id: hackathonId ? String(hackathonId) : '',
    })
    setRequestState({ mentorId, mentorName: mentor.full_name ?? mentor.username ?? 'Mentor' })
  }

  const handleCloseModal = () => {
    setRequestState(null)
    setFormData(DEFAULT_FORM)
  }

  /**
   * Requirement 6.6: "Request Help" creates a mentorship session request
   * Requirement 6.7: Includes team_id and hackathon_id
   */
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestState) return

    if (!user) {
      toast.error('Please log in to request mentorship')
      return
    }

    if (!formData.problem_description.trim()) {
      toast.error('Please describe the problem you need help with')
      return
    }

    setSubmitting(true)
    try {
      const payload: MentorshipRequestPayload = {
        mentor_id: requestState.mentorId,
        problem_description: formData.problem_description.trim(),
        duration_minutes: formData.duration_minutes,
        session_type: formData.session_type,
        ...(formData.requested_time && { requested_time: formData.requested_time }),
        ...(formData.team_id && { team_id: Number(formData.team_id) }),
        ...(formData.hackathon_id && { hackathon_id: Number(formData.hackathon_id) }),
      }

      const result = await requestMentorHelp(payload)

      if (result.success) {
        toast.success('Mentorship request sent! The mentor will be notified.')
        handleCloseModal()
        // Refresh mentor list to reflect updated session counts
        loadMentors()
      } else {
        toast.error(result.error ?? 'Failed to send request')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setSkillFilter('all')
    setStatusFilter('all')
  }

  const hasActiveFilters = search || skillFilter !== 'all' || statusFilter !== 'all'

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Find a Mentor</h1>
        <p className="text-muted-foreground">
          Connect with experienced mentors to get guidance on your project.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-500 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Mentors</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-green-500 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xl font-bold">{stats.available}</p>
              <p className="text-xs text-muted-foreground">Available Now</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Award className="h-5 w-5 text-yellow-500 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xl font-bold">{stats.totalHours}</p>
              <p className="text-xs text-muted-foreground">Hours Mentored</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters — Requirement 6.2 (skill) + 6.3 (availability) */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search by name, skill, or bio…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Search mentors"
          />
        </div>

        {/* Requirement 6.2: Skill filter */}
        <Select value={skillFilter} onValueChange={setSkillFilter}>
          <SelectTrigger className="w-full sm:w-44" aria-label="Filter by skill">
            <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" aria-hidden="true" />
            <SelectValue placeholder="All Skills" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Skills</SelectItem>
            {allSkills.map(skill => (
              <SelectItem key={skill} value={skill}>{skill}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Requirement 6.3: Availability filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44" aria-label="Filter by availability">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available Now</SelectItem>
            <SelectItem value="in_session">In Session</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} aria-label="Clear all filters">
            <X className="h-4 w-4 mr-1" aria-hidden="true" />
            Clear
          </Button>
        )}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length === mentors.length
            ? `${mentors.length} mentor${mentors.length !== 1 ? 's' : ''}`
            : `${filtered.length} of ${mentors.length} mentor${mentors.length !== 1 ? 's' : ''}`}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-48" aria-live="polite" aria-busy="true">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <Card>
          <CardContent className="text-center py-10">
            <p className="text-destructive mb-3">{error}</p>
            <Button variant="outline" onClick={loadMentors}>Retry</Button>
          </CardContent>
        </Card>
      )}

      {/* Requirement 6.1: Mentor grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(mentor => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onRequestHelp={handleRequestHelp}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" aria-hidden="true" />
            <h3 className="font-medium mb-1">No mentors found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {hasActiveFilters
                ? 'Try adjusting your filters.'
                : 'No mentors are currently listed.'}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Request Help Modal ── */}
      <Dialog open={!!requestState} onOpenChange={open => !open && handleCloseModal()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Help from {requestState?.mentorName}</DialogTitle>
            <DialogDescription>
              Describe your problem and the mentor will be notified.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitRequest} className="space-y-4 mt-2">
            {/* Problem description */}
            <div className="space-y-1.5">
              <Label htmlFor="problem_description">Problem Description *</Label>
              <Textarea
                id="problem_description"
                rows={4}
                required
                placeholder="Describe the specific challenge you're facing…"
                value={formData.problem_description}
                onChange={e => setFormData(f => ({ ...f, problem_description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Session type */}
              <div className="space-y-1.5">
                <Label htmlFor="session_type">Session Type</Label>
                <select
                  id="session_type"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.session_type}
                  onChange={e =>
                    setFormData(f => ({
                      ...f,
                      session_type: e.target.value as HelpFormData['session_type'],
                    }))
                  }
                >
                  <option value="general">General</option>
                  <option value="technical">Technical</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="presentation">Presentation</option>
                </select>
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <Label htmlFor="duration">Duration</Label>
                <select
                  id="duration"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.duration_minutes}
                  onChange={e =>
                    setFormData(f => ({ ...f, duration_minutes: Number(e.target.value) }))
                  }
                >
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                </select>
              </div>
            </div>

            {/* Preferred time */}
            <div className="space-y-1.5">
              <Label htmlFor="requested_time">Preferred Time (optional)</Label>
              <Input
                id="requested_time"
                type="datetime-local"
                value={formData.requested_time}
                min={new Date().toISOString().slice(0, 16)}
                onChange={e => setFormData(f => ({ ...f, requested_time: e.target.value }))}
              />
            </div>

            {/* Requirement 6.7: Team integration fields */}
            {(!teamId || !hackathonId) && (
              <div className="grid grid-cols-2 gap-3">
                {!hackathonId && (
                  <div className="space-y-1.5">
                    <Label htmlFor="hackathon_id">Hackathon ID (optional)</Label>
                    <Input
                      id="hackathon_id"
                      type="number"
                      placeholder="e.g. 42"
                      value={formData.hackathon_id}
                      onChange={e => setFormData(f => ({ ...f, hackathon_id: e.target.value }))}
                    />
                  </div>
                )}
                {!teamId && (
                  <div className="space-y-1.5">
                    <Label htmlFor="team_id">Team ID (optional)</Label>
                    <Input
                      id="team_id"
                      type="number"
                      placeholder="e.g. 7"
                      value={formData.team_id}
                      onChange={e => setFormData(f => ({ ...f, team_id: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !formData.problem_description.trim()}
              >
                {submitting ? 'Sending…' : 'Send Request'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
