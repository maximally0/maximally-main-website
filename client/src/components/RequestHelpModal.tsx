import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MessageSquare, Send } from 'lucide-react'
import { useMentors, useRequestMentorship } from '@/hooks/useMentors'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface RequestHelpModalProps {
  mentorId: string
  open: boolean
  onClose: () => void
}

export function RequestHelpModal({ mentorId, open, onClose }: RequestHelpModalProps) {
  const { user } = useAuth()
  const { data: mentors = [] } = useMentors()
  const requestMentorship = useRequestMentorship()

  const mentor = mentors.find(m => m.id === mentorId)

  const [formData, setFormData] = useState({
    problem_description: '',
    requested_time: '',
    duration_minutes: 30,
    hackathon_id: null as number | null,
    team_id: null as number | null
  })

  if (!mentor) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please log in to request mentorship')
      return
    }

    if (!formData.problem_description.trim()) {
      toast.error('Please describe the problem you need help with')
      return
    }

    try {
      await requestMentorship.mutateAsync({
        mentorId: mentor.id,
        menteeId: user.id,
        ...formData
      })
      
      toast.success('Mentorship request sent successfully!')
      onClose()
      setFormData({
        problem_description: '',
        requested_time: '',
        duration_minutes: 30,
        hackathon_id: null,
        team_id: null
      })
    } catch (error) {
      toast.error('Failed to send mentorship request')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500'
      case 'in_session': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available Now'
      case 'in_session': return 'In Session'
      case 'busy': return 'Busy'
      default: return 'Offline'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Request Mentorship</span>
          </DialogTitle>
          <DialogDescription>
            Send a mentorship request to get help with your project or problem.
          </DialogDescription>
        </DialogHeader>

        {/* Mentor Info */}
        <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
          <Avatar className="h-12 w-12">
            <AvatarImage src={mentor.avatar_url || ''} />
            <AvatarFallback>
              {mentor.full_name?.charAt(0) || mentor.username?.charAt(0) || 'M'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium">{mentor.full_name || mentor.username}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(mentor.currentStatus)}`} />
              <span className="text-sm text-muted-foreground">
                {getStatusText(mentor.currentStatus)}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {mentor.skills?.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Response Time</div>
            <div className="font-medium">~2 hours</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Problem Description */}
          <div>
            <Label htmlFor="problem">Problem Description *</Label>
            <Textarea
              id="problem"
              value={formData.problem_description}
              onChange={(e) => setFormData(prev => ({ ...prev, problem_description: e.target.value }))}
              placeholder="Describe the specific problem or challenge you're facing. Be as detailed as possible to help the mentor understand your needs."
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Be specific about what you're working on and where you're stuck.
            </p>
          </div>

          {/* Timing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="requested_time">Preferred Time (Optional)</Label>
              <Input
                id="requested_time"
                type="datetime-local"
                value={formData.requested_time}
                onChange={(e) => setFormData(prev => ({ ...prev, requested_time: e.target.value }))}
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty for ASAP or suggest a specific time.
              </p>
            </div>
            <div>
              <Label htmlFor="duration">Expected Duration</Label>
              <select
                id="duration"
                value={formData.duration_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
                className="w-full p-2 border rounded-md"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>

          {/* Additional Context */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Tips for a Great Mentorship Session</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be specific about your problem and what you've already tried</li>
              <li>• Have your code/project ready to share if applicable</li>
              <li>• Prepare specific questions rather than general "help me" requests</li>
              <li>• Be respectful of the mentor's time and expertise</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={requestMentorship.isPending || !formData.problem_description.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}