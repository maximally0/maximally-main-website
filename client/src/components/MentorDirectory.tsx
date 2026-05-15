import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Search, 
  Star, 
  Clock, 
  Calendar, 
  MessageSquare,
  ExternalLink,
  Filter,
  Users,
  Award
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMentors } from '@/hooks/useMentors'
import { RequestHelpModal } from './RequestHelpModal'

interface MentorDirectoryProps {
  className?: string
}

export function MentorDirectory({ className }: MentorDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [skillFilter, setSkillFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null)

  const { data: mentors = [], isLoading } = useMentors()

  // Get all unique skills for filter
  const allSkills = useMemo(() => {
    const skills = new Set<string>()
    mentors.forEach(mentor => {
      mentor.skills?.forEach(skill => skills.add(skill))
    })
    return Array.from(skills).sort()
  }, [mentors])

  // Filter mentors based on search and filters
  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => {
      // Search filter
      const matchesSearch = !searchTerm || 
        mentor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))

      // Skill filter
      const matchesSkill = !skillFilter || 
        mentor.skills?.includes(skillFilter)

      // Status filter
      const matchesStatus = !statusFilter || 
        mentor.currentStatus === statusFilter

      return matchesSearch && matchesSkill && matchesStatus
    })
  }, [mentors, searchTerm, skillFilter, statusFilter])

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Mentor Directory</h1>
        <p className="text-xl text-muted-foreground">
          Connect with experienced mentors to get help with your projects
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{mentors.length}</p>
                <p className="text-sm text-muted-foreground">Total Mentors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {mentors.filter(m => m.currentStatus === 'available').length}
                </p>
                <p className="text-sm text-muted-foreground">Available Now</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {mentors.reduce((sum, m) => sum + (m.mentored_hours || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mentors by name, skills, or expertise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={skillFilter} onValueChange={setSkillFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Skills</SelectItem>
            {allSkills.map(skill => (
              <SelectItem key={skill} value={skill}>{skill}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="available">Available Now</SelectItem>
            <SelectItem value="in_session">In Session</SelectItem>
            <SelectItem value="busy">Busy</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mentor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={mentor.avatar_url || ''} />
                  <AvatarFallback>
                    {mentor.full_name?.charAt(0) || mentor.username?.charAt(0) || 'M'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{mentor.full_name || mentor.username}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(mentor.currentStatus)}`} />
                    <span className="text-sm text-muted-foreground">
                      {getStatusText(mentor.currentStatus)}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mentor.bio && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {mentor.bio}
                </p>
              )}

              {/* Skills */}
              <div className="flex flex-wrap gap-1">
                {mentor.skills?.slice(0, 4).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {mentor.skills && mentor.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{mentor.skills.length - 4} more
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Sessions</p>
                  <p className="font-medium">{mentor.totalSessions || 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Rating</p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {mentor.averageRating > 0 ? mentor.averageRating.toFixed(1) : 'New'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mentored Hours */}
              {mentor.mentored_hours && mentor.mentored_hours > 0 && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Mentored Hours</p>
                  <p className="font-medium">{mentor.mentored_hours} hours</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button
                  className="flex-1"
                  onClick={() => setSelectedMentor(mentor.id)}
                  disabled={mentor.currentStatus === 'offline'}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Request Help
                </Button>
                {mentor.booking_url && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(mentor.booking_url, '_blank')}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredMentors.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No mentors found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || skillFilter || statusFilter
                ? 'Try adjusting your search criteria.'
                : 'No mentors are currently available.'
              }
            </p>
            {(searchTerm || skillFilter || statusFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSkillFilter('')
                  setStatusFilter('')
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Request Help Modal */}
      {selectedMentor && (
        <RequestHelpModal
          mentorId={selectedMentor}
          open={!!selectedMentor}
          onClose={() => setSelectedMentor(null)}
        />
      )}
    </div>
  )
}