/**
 * JudgePortal - Private evaluation dashboard for judges
 * Implements Task 6.1: Judge Portal dashboard with project queue
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6
 */

import React, { useEffect, useMemo, useState } from 'react'
import { Award, BarChart3, ExternalLink, Filter, Search, SortAsc } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/AuthContext'
import {
  type EvaluationStatus,
  type JudgeHackathonAssignment,
  type JudgePortalData,
  type SubmissionQueueItem,
  fetchJudgePortalData,
  getStatusLabel,
  getTrafficLightColor,
} from '@/lib/judgePortalApi'

// ─── Traffic Light Indicator ──────────────────────────────────────────────────

interface TrafficLightProps {
  status: EvaluationStatus
  size?: 'sm' | 'md'
}

function TrafficLight({ status, size = 'md' }: TrafficLightProps) {
  const color = getTrafficLightColor(status)
  const dim = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'

  const colorClass = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-400',
    green: 'bg-green-500',
  }[color]

  return (
    <span
      className={`inline-block rounded-full ${dim} ${colorClass} flex-shrink-0`}
      title={getStatusLabel(status)}
      aria-label={getStatusLabel(status)}
    />
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: EvaluationStatus }) {
  const color = getTrafficLightColor(status)
  const variantClass = {
    red: 'bg-red-100 text-red-700 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    green: 'bg-green-100 text-green-700 border-green-200',
  }[color]

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${variantClass}`}>
      <TrafficLight status={status} size="sm" />
      {getStatusLabel(status)}
    </span>
  )
}

// ─── Submission Queue Card ────────────────────────────────────────────────────

interface QueueCardProps {
  item: SubmissionQueueItem
  onEvaluate: (item: SubmissionQueueItem) => void
}

function QueueCard({ item, onEvaluate }: QueueCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <TrafficLight status={item.evaluation_status} />
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">{item.project_title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Team: {item.team_name}</p>
              {item.project_description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {item.project_description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <StatusBadge status={item.evaluation_status} />
                {item.total_score != null && (
                  <span className="text-xs text-muted-foreground">
                    Score: <span className="font-medium text-foreground">{item.total_score}</span>
                  </span>
                )}
                {item.submitted_at && (
                  <span className="text-xs text-muted-foreground">
                    Submitted {new Date(item.submitted_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {item.submission_url && (
              <a
                href={item.submission_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="View submission"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <Button
              size="sm"
              variant={item.evaluation_status === 'not_started' ? 'default' : 'outline'}
              onClick={() => onEvaluate(item)}
            >
              {item.evaluation_status === 'not_started'
                ? 'Start'
                : item.evaluation_status === 'in_progress'
                ? 'Continue'
                : 'Review'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Progress Overview ────────────────────────────────────────────────────────

interface ProgressOverviewProps {
  stats: JudgePortalData['stats']
}

function ProgressOverview({ stats }: ProgressOverviewProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-4 w-4" />
          Evaluation Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">
              {stats.total_completed} of {stats.total_assigned} evaluated
            </span>
            <span className="font-medium">{stats.completion_percentage}%</span>
          </div>
          <Progress value={stats.completion_percentage} className="h-2.5" />
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-lg font-bold text-green-600">{stats.total_completed}</span>
            </div>
            <p className="text-muted-foreground text-xs">Submitted</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="text-lg font-bold text-yellow-600">{stats.total_in_progress}</span>
            </div>
            <p className="text-muted-foreground text-xs">In Progress</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-lg font-bold text-red-600">{stats.total_not_started}</span>
            </div>
            <p className="text-muted-foreground text-xs">Not Started</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Hackathon Selector ───────────────────────────────────────────────────────

interface HackathonSelectorProps {
  assignments: JudgeHackathonAssignment[]
  selected: number | null
  onChange: (id: number | null) => void
}

function HackathonSelector({ assignments, selected, onChange }: HackathonSelectorProps) {
  if (assignments.length <= 1) return null

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">Hackathon:</span>
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1 rounded-full text-sm transition-colors ${
          selected === null
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-accent'
        }`}
      >
        All
      </button>
      {assignments.map(a => (
        <button
          key={a.id}
          onClick={() => onChange(a.hackathon_id)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selected === a.hackathon_id
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-accent'
          }`}
        >
          {a.hackathon_name}
        </button>
      ))}
    </div>
  )
}

// ─── Main JudgePortal Component ───────────────────────────────────────────────

interface JudgePortalProps {
  /** Called when the judge wants to open the evaluation form for a submission */
  onEvaluate?: (item: SubmissionQueueItem) => void
  className?: string
}

export function JudgePortal({ onEvaluate, className = '' }: JudgePortalProps) {
  const { user, profile, session } = useAuth()

  const [data, setData] = useState<JudgePortalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Requirement 10.6: Filter / sort state
  const [statusFilter, setStatusFilter] = useState<EvaluationStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'default' | 'score' | 'team'>('default')
  const [selectedHackathon, setSelectedHackathon] = useState<number | null>(null)

  const authToken = session?.access_token

  // Requirement 10.1: Only accessible to judges
  const isJudge = profile?.role === 'judge'

  useEffect(() => {
    if (!user || !isJudge) return

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchJudgePortalData(user.id, selectedHackathon ?? undefined, authToken)
        setData(result)
      } catch (e) {
        setError('Failed to load evaluation data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user, isJudge, selectedHackathon, authToken])

  // Requirement 10.1: Restrict access to judges only
  if (!user || !isJudge) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
        <p className="text-muted-foreground">
          The Judge Portal is only accessible to assigned judges.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <p className="text-destructive mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  const { assignments = [], queue = [], stats } = data ?? {
    assignments: [],
    queue: [],
    stats: {
      total_assigned: 0,
      total_completed: 0,
      total_in_progress: 0,
      total_not_started: 0,
      completion_percentage: 0,
    },
  }

  // Requirement 10.6: Filter and sort the queue
  const filteredQueue = useMemo(() => {
    let items = [...queue]

    // Filter by hackathon
    if (selectedHackathon !== null) {
      items = items.filter(i => i.hackathon_id === selectedHackathon)
    }

    // Filter by status
    if (statusFilter !== 'all') {
      items = items.filter(i => i.evaluation_status === statusFilter)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(
        i =>
          i.project_title.toLowerCase().includes(q) ||
          i.team_name.toLowerCase().includes(q) ||
          i.project_description?.toLowerCase().includes(q)
      )
    }

    // Sort
    if (sortBy === 'score') {
      items.sort((a, b) => (b.total_score ?? -1) - (a.total_score ?? -1))
    } else if (sortBy === 'team') {
      items.sort((a, b) => a.team_name.localeCompare(b.team_name))
    } else {
      // Default: not_started first, then in_progress, then submitted
      const order: Record<EvaluationStatus, number> = {
        not_started: 0,
        in_progress: 1,
        submitted: 2,
      }
      items.sort((a, b) => order[a.evaluation_status] - order[b.evaluation_status])
    }

    return items
  }, [queue, selectedHackathon, statusFilter, searchQuery, sortBy])

  const handleEvaluate = (item: SubmissionQueueItem) => {
    onEvaluate?.(item)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Judge Portal</h1>
        <p className="text-muted-foreground mt-1">
          Review and score your assigned project submissions
        </p>
      </div>

      {/* Requirement 10.5: Judge-specific navigation — hackathon selector */}
      {assignments.length > 0 && (
        <HackathonSelector
          assignments={assignments}
          selected={selectedHackathon}
          onChange={setSelectedHackathon}
        />
      )}

      {/* Requirement 10.4: Progress display */}
      <ProgressOverview stats={stats} />

      {/* Requirement 10.6: Filter + sort controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects or teams…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          {(['all', 'not_started', 'in_progress', 'submitted'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {s === 'all' ? 'All' : getStatusLabel(s as EvaluationStatus)}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <SortAsc className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="default">Priority</option>
            <option value="team">Team Name</option>
            <option value="score">Score</option>
          </select>
        </div>
      </div>

      {/* Requirement 10.2: Project queue */}
      <div className="space-y-3">
        {filteredQueue.length > 0 ? (
          filteredQueue.map(item => (
            <QueueCard key={item.submission_id} item={item} onEvaluate={handleEvaluate} />
          ))
        ) : queue.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No submissions assigned</h3>
              <p className="text-muted-foreground text-sm">
                You haven't been assigned any submissions yet. Check back later or contact the organizers.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-10">
              <p className="text-muted-foreground text-sm">No submissions match your filters.</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setStatusFilter('all')
                  setSearchQuery('')
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary footer */}
      {filteredQueue.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          Showing {filteredQueue.length} of {queue.length} submission{queue.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}

export default JudgePortal
