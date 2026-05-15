import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { toast } from 'sonner'

export interface JudgeAssignment {
  id: number
  judge_id: string
  hackathon_id: number
  assigned_category: string | null
  status: 'active' | 'inactive' | 'completed'
  assigned_by: string | null
  assigned_at: string
  hackathon?: {
    name: string
    start_date: string
    end_date: string
  }
}

export interface JudgeEvaluation {
  id: number
  judge_id: string
  submission_id: number
  hackathon_id: number
  criteria_scores: Record<string, number>
  total_score: number | null
  comments_for_organizers: string | null
  comments_for_participants: string | null
  status: 'not_started' | 'in_progress' | 'submitted'
  created_at: string
  updated_at: string
  submitted_at: string | null
  submission?: {
    id: number
    project_name: string
    team_name: string
    submission_url: string | null
    github_url: string | null
  }
  hackathon?: {
    name: string
  }
}

export interface EvaluationCriteria {
  id: number
  hackathon_id: number
  name: string
  description: string | null
  weight: number
  max_score: number
  display_order: number
  is_active: boolean
}

export interface EvaluationSubmission {
  criteria_scores: Record<string, number>
  comments_for_organizers?: string
  comments_for_participants?: string
}

// Query keys
export const JUDGE_KEYS = {
  all: ['judges'] as const,
  assignments: () => [...JUDGE_KEYS.all, 'assignments'] as const,
  assignmentsList: (judgeId?: string) => [...JUDGE_KEYS.assignments(), judgeId] as const,
  evaluations: () => [...JUDGE_KEYS.all, 'evaluations'] as const,
  evaluationsList: (judgeId?: string) => [...JUDGE_KEYS.evaluations(), judgeId] as const,
  criteria: () => [...JUDGE_KEYS.all, 'criteria'] as const,
  criteriaList: (hackathonId: number) => [...JUDGE_KEYS.criteria(), hackathonId] as const,
}

/**
 * Hook to get judge assignments
 */
export function useJudgeAssignments(judgeId?: string) {
  return useQuery({
    queryKey: JUDGE_KEYS.assignmentsList(judgeId),
    queryFn: async () => {
      const response = await apiClient.get(`/judges/${judgeId}/assignments`)
      return response.data as JudgeAssignment[]
    },
    enabled: !!judgeId,
  })
}

/**
 * Hook to get judge evaluations
 */
export function useJudgeEvaluations(judgeId?: string) {
  return useQuery({
    queryKey: JUDGE_KEYS.evaluationsList(judgeId),
    queryFn: async () => {
      const response = await apiClient.get(`/judges/${judgeId}/evaluations`)
      return response.data as JudgeEvaluation[]
    },
    enabled: !!judgeId,
  })
}

/**
 * Hook to get evaluation criteria for a hackathon
 */
export function useEvaluationCriteria(hackathonId: number) {
  return useQuery({
    queryKey: JUDGE_KEYS.criteriaList(hackathonId),
    queryFn: async () => {
      const response = await apiClient.get(`/hackathons/${hackathonId}/evaluation-criteria`)
      return response.data as EvaluationCriteria[]
    },
    enabled: !!hackathonId,
  })
}

/**
 * Hook to get a specific evaluation
 */
export function useEvaluation(evaluationId: number) {
  return useQuery({
    queryKey: [...JUDGE_KEYS.evaluations(), evaluationId],
    queryFn: async () => {
      const response = await apiClient.get(`/evaluations/${evaluationId}`)
      return response.data as JudgeEvaluation
    },
    enabled: !!evaluationId,
  })
}

/**
 * Hook to submit evaluation
 */
export function useSubmitEvaluation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      evaluationId,
      submission
    }: {
      evaluationId: number
      submission: EvaluationSubmission
    }) => {
      const response = await apiClient.post(`/evaluations/${evaluationId}/submit`, submission)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JUDGE_KEYS.evaluations() })
      toast.success('Evaluation submitted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit evaluation')
    },
  })
}

/**
 * Hook to save evaluation draft
 */
export function useSaveEvaluationDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      evaluationId,
      submission
    }: {
      evaluationId: number
      submission: Partial<EvaluationSubmission>
    }) => {
      const response = await apiClient.post(`/evaluations/${evaluationId}/draft`, submission)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JUDGE_KEYS.evaluations() })
      toast.success('Draft saved successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save draft')
    },
  })
}