/**
 * MentorCard - Individual mentor card with status badge
 * Implements Task 5.1: Mentor Gallery interface for main website
 * Requirements: 6.4 (status badges), 6.5 (card content), 6.6 (Request Help button)
 */

import React from 'react'
import { Star, Clock, Calendar, ExternalLink, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { GalleryMentor, MentorAvailabilityStatus } from '@/lib/mentorGalleryApi'

// ─── Status Badge ─────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: MentorAvailabilityStatus
}

/**
 * Requirement 6.4: Status badges with correct colors
 * - Available Now → green
 * - In Session    → yellow
 * - Offline       → gray
 */
export function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<MentorAvailabilityStatus, { dot: string; label: string; badge: string }> = {
    available: {
      dot: 'bg-green-500',
      label: 'Available Now',
      badge: 'bg-green-100 text-green-800 border-green-200',
    },
    in_session: {
      dot: 'bg-yellow-500',
      label: 'In Session',
      badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    offline: {
      dot: 'bg-gray-400',
      label: 'Offline',
      badge: 'bg-gray-100 text-gray-600 border-gray-200',
    },
  }

  const { dot, label, badge } = config[status] ?? config.offline

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${badge}`}
      aria-label={`Mentor status: ${label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  )
}

// ─── MentorCard ───────────────────────────────────────────────────────────────

interface MentorCardProps {
  mentor: GalleryMentor
  /** Called when the user clicks "Request Help" */
  onRequestHelp: (mentorId: string) => void
}

/**
 * Requirement 6.5: Mentor card showing name, avatar, skills, rating, availability status
 * Requirement 6.6: "Request Help" button
 */
export function MentorCard({ mentor, onRequestHelp }: MentorCardProps) {
  const initials =
    mentor.full_name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ??
    mentor.username?.slice(0, 2).toUpperCase() ??
    'M'

  const isAvailable = mentor.availability_status === 'available'

  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          {/* Avatar + name */}
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-11 w-11 shrink-0">
              <AvatarImage src={mentor.avatar_url ?? ''} alt={mentor.full_name ?? 'Mentor'} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold text-sm leading-tight truncate">
                {mentor.full_name ?? mentor.username ?? 'Mentor'}
              </p>
              {mentor.username && (
                <p className="text-xs text-muted-foreground truncate">@{mentor.username}</p>
              )}
            </div>
          </div>

          {/* Requirement 6.4: Status badge */}
          <StatusBadge status={mentor.availability_status} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1">
        {/* Bio */}
        {mentor.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">{mentor.bio}</p>
        )}

        {/* Requirement 6.5: Skills */}
        {mentor.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {mentor.skills.slice(0, 4).map(skill => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {mentor.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{mentor.skills.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {/* Requirement 6.5: Rating */}
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            {mentor.mentor_rating > 0 ? mentor.mentor_rating.toFixed(1) : 'New'}
          </span>

          {/* Mentored hours */}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {mentor.mentored_hours}h
          </span>

          {/* Active sessions */}
          {mentor.availability_status === 'in_session' && (
            <span className="text-yellow-600">
              {mentor.active_sessions}/{mentor.max_concurrent_teams} sessions
            </span>
          )}
        </div>

        {/* Actions — pushed to bottom */}
        <div className="flex gap-2 mt-auto pt-1">
          {/* Requirement 6.6: Request Help button */}
          <Button
            className="flex-1 text-sm"
            size="sm"
            onClick={() => onRequestHelp(mentor.id)}
            disabled={!isAvailable}
            aria-label={
              isAvailable
                ? `Request help from ${mentor.full_name ?? mentor.username}`
                : `${mentor.full_name ?? mentor.username} is not available`
            }
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
            Request Help
          </Button>

          {/* Booking URL shortcut */}
          {mentor.booking_url && (
            <Button
              variant="outline"
              size="sm"
              asChild
              aria-label="Open booking page"
            >
              <a href={mentor.booking_url} target="_blank" rel="noopener noreferrer">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
