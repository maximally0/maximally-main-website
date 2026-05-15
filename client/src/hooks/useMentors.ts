import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { toast } from 'sonner'

export interface Mentor {
  id: string
  full_name: string | null
  username: string | null
  email: string | null
  avatar_url: string | null
  bio: string | null
  skills: string[] | null
  role: string
  availability: TimeSlot[] | null
  max_concurrent_teams: number | null
  booking_url: string | null
  mentored_hours: number | null
  currentStatus: 'available' | 'busy' | 'in_session' | 'offline'
  totalSessions: number
  completedSessions: number
  averageRating: number
  created_at: string
  updated_at: string
}

export interface TimeSlot {
  day: string
  start_time: string
  end_time: string
  timezone?: string
}

export interface MentorshipRequest {
  mentorId: string
  menteeId: string
  problem_description: string
  requested_time?: string
  duration_minutes: number
  hackathon_id?: number | null
  team_id?: number | null
}

// Query keys
export const MENTOR_KEYS = {
  all: ['mentors'] as const,
  lists: () => [...MENTOR_KEYS.all, 'list'] as const,
  list: (filters?: any) => [...MENTOR_KEYS.lists(), filters] as const,
  details: () => [...MENTOR_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...MENTOR_KEYS.details(), id] as const,
}

/**
 * Hook to get all available mentors
 */
export function useMentors() {
  return useQuery({
    queryKey: MENTOR_KEYS.list(),
    queryFn: async () => {
      const response = await apiClient.get('/mentors')
      return response.data as Mentor[]
    },
  })
}

/**
 * Hook to get a specific mentor
 */
export function useMentor(mentorId: string) {
  return useQuery({
    queryKey: MENTOR_KEYS.detail(mentorId),
    queryFn: async () => {
      const response = await apiClient.get(`/mentors/${mentorId}`)
      return response.data as Mentor
    },
    enabled: !!mentorId,
  })
}

/**
 * Hook to request mentorship
 */
export function useRequestMentorship() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: MentorshipRequest) => {
      const response = await apiClient.post('/mentorship/request', request)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENTOR_KEYS.all })
      toast.success('Mentorship request sent successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send mentorship request')
    },
  })
}