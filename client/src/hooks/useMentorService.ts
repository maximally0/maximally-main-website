/**
 * React hooks for MentorService (Main Website)
 * Implements Task 3.2: Mentor-specific profile features
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mentorService, AvailabilitySlot, MentorStats, SkillValidationResult } from '../lib/mentorService'

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const mentorQueryKeys = {
  all: ['mentor'] as const,
  stats: (mentorId: string) => [...mentorQueryKeys.all, 'stats', mentorId] as const,
  availability: (mentorId: string) => [...mentorQueryKeys.all, 'availability', mentorId] as const,
  sessions: (mentorId: string, status?: string) => [...mentorQueryKeys.all, 'sessions', mentorId, status] as const,
  status: (mentorId: string) => [...mentorQueryKeys.all, 'status', mentorId] as const,
}

// ─── Skills Management Hooks ─────────────────────────────────────────────────

/**
 * Hook for validating mentor skills
 * Requirements: 2.2 - Skills validation
 */
export function useSkillValidation() {
  return {
    validateSkills: (skills: string[]): SkillValidationResult => {
      return mentorService.validateSkills(skills)
    }
  }
}

/**
 * Hook for updating mentor skills
 * Requirements: 2.1, 2.2, 2.5 - Skills management
 */
export function useUpdateMentorSkills() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ mentorId, skills }: { mentorId: string; skills: string[] }) =>
      mentorService.updateMentorSkills(mentorId, skills),
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['profile', variables.mentorId] })
        queryClient.invalidateQueries({ queryKey: mentorQueryKeys.stats(variables.mentorId) })
      }
    },
  })
}

// ─── Availability Management Hooks ───────────────────────────────────────────

/**
 * Hook for fetching mentor availability
 * Requirements: 2.1 - Availability slots management
 */
export function useMentorAvailability(mentorId: string) {
  return useQuery({
    queryKey: mentorQueryKeys.availability(mentorId),
    queryFn: () => mentorService.getMentorAvailability(mentorId),
    enabled: !!mentorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook for updating mentor availability
 * Requirements: 2.1, 2.3, 2.5 - Availability management
 */
export function useUpdateMentorAvailability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ mentorId, slots }: { mentorId: string; slots: AvailabilitySlot[] }) =>
      mentorService.updateMentorAvailability(mentorId, slots),
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: mentorQueryKeys.availability(variables.mentorId) })
        queryClient.invalidateQueries({ queryKey: mentorQueryKeys.status(variables.mentorId) })
        queryClient.invalidateQueries({ queryKey: ['profile', variables.mentorId] })
      }
    },
  })
}

/**
 * Hook for validating availability slots
 * Requirements: 2.3 - Availability slots validation
 */
export function useAvailabilityValidation() {
  return {
    validateSlot: (slot: AvailabilitySlot) => {
      return mentorService.validateAvailabilitySlot(slot)
    }
  }
}

// ─── Statistics and Hours Hooks ──────────────────────────────────────────────

/**
 * Hook for fetching mentor statistics
 * Requirements: 2.6 - Track total mentored hours
 */
export function useMentorStats(mentorId: string) {
  return useQuery({
    queryKey: mentorQueryKeys.stats(mentorId),
    queryFn: () => mentorService.getMentorStats(mentorId),
    enabled: !!mentorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook for calculating mentor hours
 * Requirements: 2.6 - Mentored hours calculation
 */
export function useMentorHours(mentorId: string) {
  return useQuery({
    queryKey: [...mentorQueryKeys.sessions(mentorId, 'completed'), 'hours'],
    queryFn: () => mentorService.calculateMentorHours(mentorId),
    enabled: !!mentorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook for getting active sessions count
 * Requirements: 2.4 - Max concurrent teams tracking
 */
export function useActiveSessions(mentorId: string) {
  return useQuery({
    queryKey: mentorQueryKeys.sessions(mentorId, 'active'),
    queryFn: () => mentorService.getActiveSessions(mentorId),
    enabled: !!mentorId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

// ─── Rating System Hooks ─────────────────────────────────────────────────────

/**
 * Hook for calculating mentor rating
 * Requirements: 2.6 - Mentor rating system
 */
export function useMentorRating(mentorId: string) {
  return useQuery({
    queryKey: [...mentorQueryKeys.sessions(mentorId), 'rating'],
    queryFn: () => mentorService.calculateMentorRating(mentorId),
    enabled: !!mentorId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook for updating mentor rating
 * Requirements: 2.6 - Mentor rating system
 */
export function useUpdateMentorRating() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mentorId: string) => mentorService.updateMentorRating(mentorId),
    onSuccess: (data, mentorId) => {
      if (data.success) {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['profile', mentorId] })
        queryClient.invalidateQueries({ queryKey: mentorQueryKeys.stats(mentorId) })
        queryClient.invalidateQueries({ queryKey: [...mentorQueryKeys.sessions(mentorId), 'rating'] })
      }
    },
  })
}

// ─── Booking URL Hooks ───────────────────────────────────────────────────────

/**
 * Hook for validating booking URLs
 * Requirements: 2.7 - Booking URL validation
 */
export function useBookingUrlValidation() {
  return {
    validateUrl: (url: string) => {
      return mentorService.validateBookingUrl(url)
    }
  }
}

/**
 * Hook for updating booking URL
 * Requirements: 2.7 - Booking URL validation
 */
export function useUpdateBookingUrl() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ mentorId, bookingUrl }: { mentorId: string; bookingUrl: string }) =>
      mentorService.updateBookingUrl(mentorId, bookingUrl),
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate profile query
        queryClient.invalidateQueries({ queryKey: ['profile', variables.mentorId] })
      }
    },
  })
}

// ─── Status Management Hooks ─────────────────────────────────────────────────

/**
 * Hook for getting mentor status
 * Requirements: 2.4 - Max concurrent teams tracking
 */
export function useMentorStatus(mentorId: string) {
  return useQuery({
    queryKey: mentorQueryKeys.status(mentorId),
    queryFn: () => mentorService.getMentorStatus(mentorId),
    enabled: !!mentorId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

// ─── Combined Hooks ───────────────────────────────────────────────────────────

/**
 * Combined hook for all mentor service functionality
 * Requirements: All mentor requirements
 */
export function useMentorService(mentorId: string) {
  const stats = useMentorStats(mentorId)
  const availability = useMentorAvailability(mentorId)
  const status = useMentorStatus(mentorId)
  const activeSessions = useActiveSessions(mentorId)
  const rating = useMentorRating(mentorId)
  const hours = useMentorHours(mentorId)

  const updateSkills = useUpdateMentorSkills()
  const updateAvailability = useUpdateMentorAvailability()
  const updateRating = useUpdateMentorRating()
  const updateBookingUrl = useUpdateBookingUrl()

  const { validateSkills } = useSkillValidation()
  const { validateSlot } = useAvailabilityValidation()
  const { validateUrl } = useBookingUrlValidation()

  return {
    // Data
    stats: stats.data,
    availability: availability.data,
    status: status.data,
    activeSessions: activeSessions.data,
    rating: rating.data,
    hours: hours.data,

    // Loading states
    isLoading: stats.isLoading || availability.isLoading || status.isLoading,
    isUpdating: updateSkills.isPending || updateAvailability.isPending || 
                updateRating.isPending || updateBookingUrl.isPending,

    // Mutations
    updateSkills: updateSkills.mutate,
    updateAvailability: updateAvailability.mutate,
    updateRating: updateRating.mutate,
    updateBookingUrl: updateBookingUrl.mutate,

    // Validation
    validateSkills,
    validateSlot,
    validateUrl,

    // Utility
    formatTime: mentorService.formatTime,
    getDayName: mentorService.getDayName,

    // Refetch functions
    refetchStats: stats.refetch,
    refetchAvailability: availability.refetch,
    refetchStatus: status.refetch,
  }
}

// ─── Utility Hooks ───────────────────────────────────────────────────────────

/**
 * Hook for mentor utility functions
 */
export function useMentorUtils() {
  return {
    formatTime: mentorService.formatTime,
    getDayName: mentorService.getDayName,
  }
}