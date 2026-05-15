import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Award, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  FileText,
  Star,
  Users,
  Calendar
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useJudgeAssignments, useJudgeEvaluations } from '@/hooks/useJudges'
import { EvaluationForm } from './EvaluationForm'
import type { SubmissionQueueItem } from '@/lib/judgePortalApi'

interface JudgeEvaluationPortalProps {
  className?: string
}

export function JudgeEvaluationPortal({ className }: JudgeEvaluationPortalProps) {
  const { user, profile } = useAuth()
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionQueueItem | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  const { data: assignments = [], isLoading: assignmentsLoading } = useJudgeAssignments(user?.id)
  const { data: evaluations = [], isLoading: evaluationsLoading } = useJudgeEvaluations(user?.id)

  if (!user || profile?.role !== 'judge') {
    return (
      <div className="text-center py-12">
        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-medium mb-2">Access Restricted</h2>
        <p className="text-muted-foreground">
          This portal is only accessible to assigned judges.
        </p>
      </div>
    )
  }

  if (assignmentsLoading || evaluationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const totalEvaluations = evaluations.length
  const completedEvaluations = evaluations.filter(e => e.status === 'submitted').length
  const inProgressEvaluations = evaluations.filter(e => e.status === 'in_progress').length
  const notStartedEvaluations = evaluations.filter(e => e.status === 'not_started').length
  const completionPercentage = totalEvaluations > 0 ? (completedEvaluations / totalEvaluations) * 100 : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-yellow-600 bg-yellow-100'
      case 'not_started': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <CheckCircle className="h-4 w-4" />
      case 'in_progress': return <Clock className="h-4 w-4" />
      case 'not_started': return <AlertCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Judge Evaluation Portal</h1>
        <p className="text-xl text-muted-foreground">
          Evaluate hackathon submissions and provide feedback to participants
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{totalEvaluations}</p>
                    <p className="text-sm text-muted-foreground">Total Evaluations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{completedEvaluations}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{inProgressEvaluations}</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{notStartedEvaluations}</p>
                    <p className="text-sm text-muted-foreground">Not Started</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Evaluation Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>{completionPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={completionPercentage} className="h-3" />
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedEvaluations}</div>
                  <div className="text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{inProgressEvaluations}</div>
                  <div className="text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{notStartedEvaluations}</div>
                  <div className="text-muted-foreground">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Evaluations</CardTitle>
            </CardHeader>
            <CardContent>
              {evaluations.slice(0, 5).map((evaluation: any) => (
                <div key={evaluation.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(evaluation.status)}
                    <div>
                      <h4 className="font-medium">{evaluation.submission?.project_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {evaluation.submission?.team_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(evaluation.status)}>
                      {evaluation.status.replace('_', ' ')}
                    </Badge>
                    {evaluation.total_score && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm font-medium">{evaluation.total_score}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {evaluations.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No evaluations assigned</h3>
                  <p className="text-muted-foreground">
                    You haven't been assigned any evaluations yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluations" className="space-y-6">
          {/* Evaluation Queue */}
          <div className="grid grid-cols-1 gap-4">
            {evaluations.map((evaluation: any) => (
              <Card key={evaluation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(evaluation.status)}
                        <h3 className="text-lg font-medium">{evaluation.submission?.project_name}</h3>
                        <Badge className={getStatusColor(evaluation.status)}>
                          {evaluation.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">
                        Team: {evaluation.submission?.team_name}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Hackathon: {evaluation.hackathon?.name}</span>
                        <span>•</span>
                        <span>Assigned: {new Date(evaluation.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {evaluation.total_score && (
                        <div className="text-right mr-4">
                          <div className="text-lg font-bold">{evaluation.total_score}</div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                      )}
                      <Button
                        onClick={() => setSelectedSubmission({
                          submission_id: evaluation.submission_id,
                          hackathon_id: evaluation.hackathon_id ?? evaluation.hackathon?.id ?? 0,
                          team_name: evaluation.submission?.team_name ?? '',
                          project_title: evaluation.submission?.project_name ?? '',
                          project_description: evaluation.submission?.description ?? '',
                          submission_url: evaluation.submission?.submission_url,
                          evaluation_status: evaluation.status,
                          total_score: evaluation.total_score ?? null,
                          evaluation_id: evaluation.id ?? null,
                        })}
                        variant={evaluation.status === 'not_started' ? 'default' : 'outline'}
                      >
                        {evaluation.status === 'not_started' ? 'Start Evaluation' : 'Continue'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {evaluations.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No evaluations assigned</h3>
                <p className="text-muted-foreground">
                  You haven't been assigned any evaluations yet. Check back later or contact the organizers.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          {/* Current Assignments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map((assignment: any) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>{assignment.hackathon?.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assignment.assigned_category && (
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <Badge variant="outline">{assignment.assigned_category}</Badge>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{assignment.status}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Assigned</p>
                      <p className="font-medium">
                        {new Date(assignment.assigned_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {assignment.hackathon?.start_date && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(assignment.hackathon.start_date).toLocaleDateString()} - 
                        {new Date(assignment.hackathon.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {assignments.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No active assignments</h3>
                <p className="text-muted-foreground">
                  You haven't been assigned to any hackathons yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Evaluation Modal */}
      {selectedSubmission && (
        <EvaluationForm
          submission={selectedSubmission}
          onSaved={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  )
}